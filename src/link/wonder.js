// One Wonder Card distribution over a GB-Link in wireless mode: the group the
// GBA finds under Mystery Gift -> Wireless Communication, the link-up a
// librfu leader runs once a GBA has joined, then the Mystery Gift exchange.
// Frames in and out, ticked once per GBA frame by the caller.

import { CMD, Distributor, RFU_SERIAL_JOY_SPOT, beaconData } from './distributor.js';
import {
  JAPANESE_WONDER_CARD_BYTES,
  MysteryGiftError,
  PAYLOAD_SCRIPT_OFFSET,
  WONDER_CARD_BYTES,
  WonderCardServer,
  gameOfCode,
  isJapanese,
  romId,
} from './mystery-gift.js';
import { SaveBackupServer, SaveRestoreServer } from './save.js';
import { decodeGameText } from './text.js';

// Frames to wait after the GBA's first linked frame before sending player ids,
// so its player exchange task has reset its receive state.
const LINK_SETTLE_TICKS = 10;
// A GBA that is busy sending drops a block request; ask again after this long.
const REQUEST_RETRY_TICKS = 90;
const REQUEST_RETRIES = 3;
// The GBA's standby round follows the player exchange within a frame or two;
// its link code skips the round if it asks while still finishing its own
// block, and then waits for the Mystery Gift exchange directly.
const STANDBY_WAIT_TICKS = 180;
// A linked GBA answers every parent frame, so this much silence means it is gone.
const SILENCE_TICKS = 600;
// After "ready to end" the GBA closes the link within a few frames.
const CLOSE_TIMEOUT_TICKS = 600;
const BLOCK_REQ_LINK_PLAYER = 0;
const LINK_PLAYER_BLOCK_BYTES = 200;
const GAME_FREAK = 'GameFreak inc.';

const VERSIONS = { 1: 'Sapphire', 2: 'Ruby', 3: 'Emerald', 4: 'FireRed', 5: 'LeafGreen' };

const LANGUAGE_JAPANESE = 1;

// The parents an event shows a searching GBA: the international games look for
// the Wonder Distributor's serial, the Japanese games only for their Joy Spot's.
// Both show whatever the event has cards for, so that any game links and hears
// from the page when nothing of it is for that game.
export function eventBeacons(event) {
  const gnameBytes = Uint8Array.from(event.gnameBytes);
  gnameBytes[0] = (gnameBytes[0] & 0xf0) | LANGUAGE_JAPANESE;
  return [beaconData(event), beaconData({ ...event, serialNo: RFU_SERIAL_JOY_SPOT, gnameBytes })];
}

export function decodeName(bytes, japanese = false) {
  return decodeGameText(bytes, japanese).trim();
}

function put16(bytes, at, value) {
  bytes[at] = value & 0xff;
  bytes[at + 1] = (value >> 8) & 0xff;
}

function u16(bytes, at) {
  return bytes[at] | (bytes[at + 1] << 8);
}

function magicAt(bytes, at) {
  for (let i = 0; i < GAME_FREAK.length; i++) {
    if (bytes[at + i] !== GAME_FREAK.charCodeAt(i)) return false;
  }
  return bytes[at + GAME_FREAK.length] === 0;
}

// struct LinkPlayerBlock: magic, struct LinkPlayer, magic.
export function linkPlayerBlock({ gnameBytes, unameBytes }) {
  const b = new Uint8Array(LINK_PLAYER_BLOCK_BYTES);
  for (let i = 0; i < GAME_FREAK.length; i++) {
    b[i] = GAME_FREAK.charCodeAt(i);
    b[44 + i] = GAME_FREAK.charCodeAt(i);
  }
  const compatibility = u16(gnameBytes, 0);
  put16(b, 16, 0x4000 | ((compatibility >> 10) & 0xf));
  put16(b, 18, 0x8000);
  put16(b, 20, u16(gnameBytes, 2));
  b.set(unameBytes.subarray(0, 8), 24);
  b[32] = 0x11;
  b[34] = 0x11;
  put16(b, 42, compatibility & 0xf);
  return b;
}

export function readLinkPlayer(block) {
  if (block.length < 60 || !magicAt(block, 0) || !magicAt(block, 44)) return null;
  const version = block[16];
  const japanese = u16(block, 42) === LANGUAGE_JAPANESE;
  return {
    version: VERSIONS[version] ?? null,
    japanese,
    name: decodeName(block.subarray(24, 32), japanese),
  };
}

// Every payload an event holds for a GBA reporting `game`, as { card, script }:
// the event's one payload, or its list for that ROM or game when it has them
// (event.variants, keyed by ROM id like 'BPRE 1.1' or by game). Empty when
// nothing of it runs there, or when the event lists the ROMs it runs on
// (event.roms) and this is not one of them. The Japanese games lay their
// Wonder Cards out otherwise: they take only their ROM's own payloads, or an
// event's one payload made for them (event.japanese), and the others never
// those.
export function eventPayloads(event, game) {
  if (event.roms && !(game && event.roms.includes(romId(game)))) return [];
  const japanese = isJapanese(game);
  let all;
  if (event.variants) {
    all = (game && (event.variants[romId(game)] ?? (japanese ? null : event.variants[gameOfCode(game.gameCode)]))) ?? [];
  } else {
    all = Boolean(event.japanese) === japanese ? [event.payloadBytes] : [];
  }
  const cardBytes = japanese ? JAPANESE_WONDER_CARD_BYTES : WONDER_CARD_BYTES;
  return all.map((bytes) => ({
    card: bytes.subarray(0, cardBytes),
    script: bytes.subarray(PAYLOAD_SCRIPT_OFFSET),
  }));
}

// The payload to send: one of them at random, as the egg cartridges pick a
// species for each delivery. Null when there is none.
export function eventPayload(event, game, random = Math.random) {
  const payloads = eventPayloads(event, game);
  return payloads.length ? payloads[Math.floor(random() * payloads.length)] : null;
}

export class WonderSession {
  // send(frame): one RFU1 frame to the adapter.
  constructor({ send, log = () => {} }) {
    this.log = log;
    this.distributor = new Distributor({ send, log });
    this.event = null;
    this.nextEvent = null;
    this.running = false;
    this.link = null;
    this.decision = null;
    this.onStatus = null;
    this.onDecision = null;
    this.onResult = null;
    const d = this.distributor;
    d.onConnect = () => this.connected();
    d.onLinked = () => this.linked();
    d.onBlockStart = () => { if (this.link) this.link.childSending = true; };
    d.onBlock = (data) => this.childBlock(data);
    d.onCommand = (words) => this.childCommand(words);
    d.onClosed = () => this.closed();
  }

  status(stage, detail = {}) {
    this.onStatus?.({ stage, event: this.link?.event ?? this.event, ...detail });
  }

  // The event whose card goes to the next GBA; a link in progress keeps its own.
  setEvent(event) {
    if (this.link) {
      this.nextEvent = event;
      return;
    }
    this.event = event;
    if (this.running) this.distributor.open(eventBeacons(event));
  }

  start() {
    if (!this.event) throw new Error('No event chosen.');
    this.running = true;
    this.distributor.open(eventBeacons(this.event));
    this.status('open');
  }

  stop() {
    this.running = false;
    this.cancelDecision();
    this.distributor.close();
    this.link = null;
  }

  receive(frame) {
    this.distributor.receive(frame);
  }

  tick() {
    const link = this.link;
    if (link?.stage === 'settling' && --link.settle <= 0) this.beginExchange();
    else if (link?.stage === 'exchanging' && !link.childSending && !link.player) {
      if (++link.sinceRequest >= REQUEST_RETRY_TICKS && link.retries < REQUEST_RETRIES) {
        link.retries++;
        link.sinceRequest = 0;
        this.distributor.requestBlock(BLOCK_REQ_LINK_PLAYER);
      }
    } else if (link?.stage === 'exchanging' && link.player && ++link.sincePlayer > STANDBY_WAIT_TICKS) {
      this.startServer();
    }
    if (link && (this.distributor.silentTicks > SILENCE_TICKS
      || (link.stage === 'closing' && ++link.closingTicks > CLOSE_TIMEOUT_TICKS))) {
      this.drop();
      return;
    }
    this.distributor.tick();
  }

  // Ends a link the GBA stopped answering.
  drop() {
    const link = this.link;
    this.cancelDecision();
    link.server?.fail(new MysteryGiftError('The Game Boy Advance stopped answering.'));
    this.finish(link.result ?? { outcome: 'lost', stage: link.stage, player: link.player });
    this.distributor.close();
    this.reopen();
  }

  // The page's answer to onDecision: true sends the card anyway.
  decide(send) {
    const decision = this.decision;
    this.decision = null;
    decision?.(Boolean(send));
  }

  cancelDecision() {
    if (!this.decision) return;
    this.decision(false);
    this.decision = null;
    this.onDecision?.(null);
  }

  connected() {
    this.link = {
      event: this.event,
      stage: 'joining',
      settle: 0,
      sinceRequest: 0,
      retries: 0,
      childSending: false,
      player: null,
      sincePlayer: 0,
      readyCount: 0,
      server: null,
      result: null,
      closingTicks: 0,
    };
    this.status('joining');
  }

  linked() {
    if (!this.link) return;
    this.link.stage = 'settling';
    this.link.settle = LINK_SETTLE_TICKS;
  }

  beginExchange() {
    const link = this.link;
    link.stage = 'exchanging';
    link.sinceRequest = 0;
    this.distributor.playerIds();
    this.distributor.requestBlock(BLOCK_REQ_LINK_PLAYER);
    this.distributor.sendBlock(linkPlayerBlock(link.event));
  }

  childBlock(data) {
    const link = this.link;
    if (!link) return;
    if (link.server) {
      link.server.block(data);
      return;
    }
    if (link.stage !== 'exchanging' || link.player) return;
    const player = readLinkPlayer(data);
    if (!player) {
      this.log('the Game Boy Advance sent an unreadable player block');
      return;
    }
    link.player = player;
    this.status('linked', { player });
  }

  childCommand(words) {
    const link = this.link;
    if (!link) return;
    const op = words[0] & 0xff00;
    if (op === CMD.READY_EXIT_STANDBY && link.player) {
      // Answered every time: the GBA only asks again if the answer was lost.
      this.distributor.standby(words[1]);
      link.readyCount = (words[1] + 1) & 0xffff;
      if (!link.server) this.startServer();
    }
  }

  startServer() {
    const link = this.link;
    const Server = { backup: SaveBackupServer, restore: SaveRestoreServer }[link.event.kind] ?? WonderCardServer;
    const server = new Server({
      save: link.event.save,
      link: this.distributor,
      payload: (game) => eventPayload(link.event, game),
      game: link.event.game,
      confirm: (reasons, game) => this.ask(reasons, game),
      log: this.log,
    });
    link.server = server;
    link.stage = 'gift';
    server.onStage = (stage, detail) => this.status(stage, { player: link.player, detail });
    server.run().then(
      (result) => {
        if (this.link !== link) return;
        link.result = result;
        link.stage = 'closing';
        this.distributor.closeLink(link.readyCount);
        this.status('closing', { player: link.player, result });
      },
      (error) => {
        if (this.link !== link) return;
        const message = error instanceof MysteryGiftError ? error.message : 'The Mystery Gift exchange failed.';
        this.log(message);
        this.finish({ outcome: 'error', message });
        this.distributor.close();
        this.reopen();
      },
    );
  }

  ask(reasons, game) {
    return new Promise((resolve) => {
      this.decision = resolve;
      this.onDecision?.({ reasons, game, event: this.link?.event ?? this.event });
    });
  }

  closed() {
    const link = this.link;
    if (!link) return;
    this.cancelDecision();
    link.server?.fail(new MysteryGiftError('The Game Boy Advance left the link.'));
    if (link.result) this.finish(link.result);
    else this.finish({ outcome: 'lost', stage: link.stage, player: link.player });
    this.reopen();
  }

  finish(result) {
    const link = this.link;
    this.link = null;
    this.onResult?.({ event: link?.event ?? null, player: link?.player ?? null, ...result });
  }

  reopen() {
    if (this.nextEvent) {
      this.event = this.nextEvent;
      this.nextEvent = null;
    }
    if (!this.running) return;
    this.distributor.open(eventBeacons(this.event));
    this.status('open');
  }
}
