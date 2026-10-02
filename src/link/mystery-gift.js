// The server side of the games' Mystery Gift link (pokeemerald
// mystery_gift_link.c, _scripts.c, _server.c; FireRed and LeafGreen are the
// same). A message is a 6-byte header block (id, CRC, size) followed by blocks
// of up to 252 bytes. The server drives the client by sending it scripts.

export const MG_LINK = {
  CLIENT_SCRIPT: 16,
  GAME_DATA: 17,
  GAME_STAT: 18,
  RESPONSE: 19,
  READY_END: 20,
  DYNAMIC_MSG: 21,
  CARD: 22,
  NEWS: 23,
  STAMP: 24,
  RAM_SCRIPT: 25,
};

export const CLI = {
  NONE: 0,
  RETURN: 1,
  RECV: 2,
  SEND_LOADED: 3,
  COPY_RECV: 4,
  YES_NO: 5,
  COPY_RECV_IF_N: 6,
  COPY_RECV_IF: 7,
  LOAD_GAME_DATA: 8,
  SAVE_NEWS: 9,
  SAVE_CARD: 10,
  PRINT_MSG: 11,
  COPY_MSG: 12,
  ASK_TOSS: 13,
  LOAD_TOSS_RESPONSE: 14,
  RUN_MEVENT_SCRIPT: 15,
  SAVE_STAMP: 16,
  SAVE_RAM_SCRIPT: 17,
  RECV_EREADER_TRAINER: 18,
  SEND_STAT: 19,
  SEND_READY_END: 20,
  RUN_BUFFER_SCRIPT: 21,
};

export const CLI_MSG = {
  NOTHING_SENT: 0,
  CARD_RECEIVED: 2,
  HAD_CARD: 5,
  COMM_CANCELED: 9,
  CANT_ACCEPT: 10,
  COMM_ERROR: 11,
};

export const MG_LINK_BUFFER_SIZE = 0x400;
export const MG_BLOCK_BYTES = 252;
export const WONDER_CARD_BYTES = 332;
// The Japanese games' Wonder Card, with shorter texts.
export const JAPANESE_WONDER_CARD_BYTES = 164;
export const RAM_SCRIPT_BYTES = 995;
export const GAME_DATA_BYTES = 100;

// Where a site payload keeps the card and the script that goes with it.
export const PAYLOAD_SCRIPT_OFFSET = 336;

const CRC_TABLE = (() => {
  const table = new Uint16Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0x8408 : c >>> 1;
    table[i] = c;
  }
  return table;
})();

// util.c CalcCRC16WithTable.
export function crc16(bytes) {
  let crc = 0x1121;
  for (let i = 0; i < bytes.length; i++) {
    const high = crc >> 8;
    crc ^= bytes[i];
    crc = high ^ CRC_TABLE[crc & 0xff];
  }
  return ~crc & 0xffff;
}

function u16(bytes, at) {
  return bytes[at] | (bytes[at + 1] << 8);
}

function u32(bytes, at) {
  return (bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16) | (bytes[at + 3] << 24)) >>> 0;
}

function put16(bytes, at, value) {
  bytes[at] = value & 0xff;
  bytes[at + 1] = (value >> 8) & 0xff;
}

function put32(bytes, at, value) {
  put16(bytes, at, value & 0xffff);
  put16(bytes, at + 2, value >>> 16);
}

export function clientScript(commands) {
  const bytes = new Uint8Array(commands.length * 8);
  commands.forEach(([instr, parameter = 0], i) => {
    put32(bytes, i * 8, instr);
    put32(bytes, i * 8 + 4, parameter);
  });
  return bytes;
}

export const CLIENT_SCRIPTS = {
  sendGameData: clientScript([
    [CLI.LOAD_GAME_DATA],
    [CLI.SEND_LOADED],
    [CLI.RECV, MG_LINK.CLIENT_SCRIPT],
    [CLI.COPY_RECV],
  ]),
  askToss: clientScript([
    [CLI.ASK_TOSS],
    [CLI.LOAD_TOSS_RESPONSE],
    [CLI.SEND_LOADED],
    [CLI.RECV, MG_LINK.CLIENT_SCRIPT],
    [CLI.COPY_RECV],
  ]),
  saveCard: clientScript([
    [CLI.RECV, MG_LINK.CARD],
    [CLI.SAVE_CARD],
    [CLI.RECV, MG_LINK.RAM_SCRIPT],
    [CLI.SAVE_RAM_SCRIPT],
    [CLI.SEND_READY_END],
    [CLI.RETURN, CLI_MSG.CARD_RECEIVED],
  ]),
  saveCardWithoutScript: clientScript([
    [CLI.RECV, MG_LINK.CARD],
    [CLI.SAVE_CARD],
    [CLI.SEND_READY_END],
    [CLI.RETURN, CLI_MSG.CARD_RECEIVED],
  ]),
  hadCard: clientScript([[CLI.SEND_READY_END], [CLI.RETURN, CLI_MSG.HAD_CARD]]),
  nothingSent: clientScript([[CLI.SEND_READY_END], [CLI.RETURN, CLI_MSG.NOTHING_SENT]]),
  cantAccept: clientScript([[CLI.SEND_READY_END], [CLI.RETURN, CLI_MSG.CANT_ACCEPT]]),
  canceled: clientScript([[CLI.SEND_READY_END], [CLI.RETURN, CLI_MSG.COMM_CANCELED]]),
};

export function messageBlocks(ident, data) {
  const header = new Uint8Array(6);
  put16(header, 0, ident);
  put16(header, 2, crc16(data));
  put16(header, 4, data.length);
  const blocks = [header];
  for (let at = 0; at < data.length; at += MG_BLOCK_BYTES) {
    blocks.push(data.subarray(at, Math.min(data.length, at + MG_BLOCK_BYTES)));
  }
  return blocks;
}

export class MysteryGiftError extends Error {}

export class MessageReceiver {
  constructor(ident) {
    this.ident = ident;
    this.size = -1;
    this.crc = 0;
    this.data = null;
    this.got = 0;
  }

  // One finished block from the client; returns the message once complete.
  push(block) {
    if (this.size < 0) {
      const ident = u16(block, 0);
      const size = u16(block, 4);
      if (ident !== this.ident) {
        throw new MysteryGiftError(`The Game Boy Advance sent message ${ident} instead of ${this.ident}.`);
      }
      if (size > MG_LINK_BUFFER_SIZE) {
        throw new MysteryGiftError(`The Game Boy Advance sent an oversized message (${size} bytes).`);
      }
      this.size = size;
      this.crc = u16(block, 2);
      this.data = new Uint8Array(size);
      return size === 0 ? this.finish() : null;
    }
    const take = Math.min(MG_BLOCK_BYTES, this.size - this.got);
    this.data.set(block.subarray(0, take), this.got);
    this.got += take;
    return this.got < this.size ? null : this.finish();
  }

  finish() {
    if (crc16(this.data) !== this.crc) {
      throw new MysteryGiftError('A message from the Game Boy Advance failed its checksum.');
    }
    return this.data;
  }
}

const GAME_DATA_VALID_VAR = 0x101;

// struct MysteryGiftLinkGameData as the games are built (agbcc puts structs on
// 4-byte boundaries): 100 bytes, the same in Emerald and FireRed/LeafGreen.
// Only the check words differ: Emerald marks a card request with 1 << 2 and
// 1 << 9, FireRed/LeafGreen with 1 and its version code.
export function parseGameData(bytes) {
  const checked = bytes.length >= GAME_DATA_BYTES
    && u32(bytes, 0) === GAME_DATA_VALID_VAR
    && (u16(bytes, 4) & 1) === 1
    && (u32(bytes, 8) & 1) === 1;
  const emerald = (u16(bytes, 12) & (1 << 2)) !== 0 && (u32(bytes, 16) & 0x380) !== 0;
  const frlg = (u16(bytes, 12) & 1) !== 0 && (u32(bytes, 16) & 0xf) !== 0;
  return {
    valid: checked && (emerald || frlg),
    cardFlagId: u16(bytes, 0x14),
    playerName: bytes.slice(0x45, 0x4c),
    trainerId: u32(bytes, 0x4c),
    gameCode: String.fromCharCode(...bytes.subarray(0x5c, 0x60)),
    revision: bytes[0x60],
  };
}

const GAMES = { BPE: 'emerald', BPR: 'frlg', BPG: 'frlg' };
const GAME_NAMES = { BPE: 'Emerald', BPR: 'FireRed', BPG: 'LeafGreen' };
const LANGUAGES = { J: 'Japanese', E: 'English', F: 'French', D: 'German', I: 'Italian', S: 'Spanish' };

export function gameOfCode(code) {
  return GAMES[code.slice(0, 3)] ?? null;
}

export function isJapanese(game) {
  return game?.gameCode?.[3] === 'J';
}

export function describeGameCode(code) {
  const name = GAME_NAMES[code.slice(0, 3)];
  if (!name) return code;
  const language = LANGUAGES[code[3]];
  return language ? `${name} (${language})` : name;
}

// The ROM the GBA runs, as the game data reports it: "BPRE 1.1".
export function romId(game) {
  return `${game.gameCode} 1.${game.revision}`;
}

export function describeRom(game) {
  return `${describeGameCode(game.gameCode)} 1.${game.revision}`;
}

export function cardFlagId(card) {
  return u16(card, 0);
}

// Runs one Mystery Gift exchange with a linked client, following the game's
// gMysteryGiftServerScript_SendWonderCard. It also refuses a card whose script
// can't run on the client's ROM, and asks the page before sending the same card
// again or a card made for the other game.
export class WonderCardServer {
  // link.sendBlock(bytes) queues one block for the client. payload(game) gives
  // the { card, script } to send to the client's game (an empty script for
  // none), or null when the event has nothing that runs there. confirm(reasons,
  // game) resolves true to send anyway.
  constructor({ link, payload, game, confirm, log = () => {} }) {
    this.link = link;
    this.payload = payload;
    this.game = game;
    this.confirm = confirm;
    this.log = log;
    this.receiver = null;
    this.waiting = null;
    this.onStage = null;
  }

  send(ident, data) {
    for (const block of messageBlocks(ident, data)) this.link.sendBlock(block);
  }

  receive(ident) {
    this.receiver = new MessageReceiver(ident);
    return new Promise((resolve, reject) => { this.waiting = { resolve, reject }; });
  }

  // A block the client finished sending.
  block(data) {
    if (!this.receiver) {
      this.log('ignored an unexpected block from the Game Boy Advance');
      return;
    }
    let message;
    try {
      message = this.receiver.push(data);
    } catch (error) {
      this.fail(error);
      return;
    }
    if (!message) return;
    const { resolve } = this.waiting;
    this.receiver = null;
    this.waiting = null;
    resolve(message);
  }

  fail(error) {
    const waiting = this.waiting;
    this.receiver = null;
    this.waiting = null;
    waiting?.reject(error);
  }

  stage(name, detail) {
    this.onStage?.(name, detail);
  }

  async run() {
    this.stage('checking');
    this.send(MG_LINK.CLIENT_SCRIPT, CLIENT_SCRIPTS.sendGameData);
    const game = parseGameData(await this.receive(MG_LINK.GAME_DATA));
    this.stage('checked', game);
    if (!game.valid) return this.end('cant-accept', CLIENT_SCRIPTS.cantAccept, game);
    const payload = this.payload(game);
    if (!payload) return this.end('unsupported', CLIENT_SCRIPTS.cantAccept, game);
    const card = payload.card;
    const ramScript = payload.script;

    const flagId = cardFlagId(card);
    const sameCard = game.cardFlagId !== 0 && game.cardFlagId === flagId;
    const otherCard = game.cardFlagId !== 0 && !sameCard;
    const reasons = [];
    const connected = gameOfCode(game.gameCode);
    if (connected && this.game && connected !== this.game) reasons.push('other-game');
    if (sameCard) reasons.push('same-card');
    if (reasons.length) {
      this.stage('deciding', reasons);
      if (!(await this.confirm(reasons, game))) {
        return sameCard
          ? this.end('had-card', CLIENT_SCRIPTS.hadCard, game)
          : this.end('declined', CLIENT_SCRIPTS.nothingSent, game);
      }
    }

    if (otherCard) {
      this.stage('asking');
      this.send(MG_LINK.CLIENT_SCRIPT, CLIENT_SCRIPTS.askToss);
      const response = await this.receive(MG_LINK.RESPONSE);
      // FALSE: the player threw the old card away.
      if (u32(response, 0) !== 0) return this.end('kept-card', CLIENT_SCRIPTS.canceled, game);
    }

    this.stage('sending');
    if (ramScript.length) {
      this.send(MG_LINK.CLIENT_SCRIPT, CLIENT_SCRIPTS.saveCard);
      this.send(MG_LINK.CARD, card);
      this.send(MG_LINK.RAM_SCRIPT, ramScript.subarray(0, RAM_SCRIPT_BYTES));
    } else {
      this.send(MG_LINK.CLIENT_SCRIPT, CLIENT_SCRIPTS.saveCardWithoutScript);
      this.send(MG_LINK.CARD, card);
    }
    await this.receive(MG_LINK.READY_END);
    return { outcome: 'sent', game };
  }

  async end(outcome, script, game) {
    this.send(MG_LINK.CLIENT_SCRIPT, script);
    await this.receive(MG_LINK.READY_END);
    return { outcome, game };
  }
}
