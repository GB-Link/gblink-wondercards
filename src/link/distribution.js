// Runs a distribution: switches the GB-Link to wireless adapter mode, ticks the
// WonderSession at the GBA frame rate and passes its frames to the adapter.

import { COMMAND, STATUS, openGbLink } from './gblink.js';
import { Rfu1Reader } from './rfu1.js';
import { startTicker } from './ticker.js';
import { WonderSession } from './wonder.js';

export const MIN_FIRMWARE = [2, 2, 6];

const MODE_WIRELESS_ADAPTER = 0x07;
const LINK_PACKET_BYTES = 64;
// Adapter reports, twice a second: 0x0e is the start-up stage (2 or more once
// the GBA passed its adapter check), 0x1d counts the game's adapter resets
// (8-bit, wrapping).
const REPORT_STAGE = 0x0e;
const REPORT_EVENTS = 0x1d;
const STAGE_READY = 2;
// A game that cannot reach the adapter resets it several times a second.
const RESET_WINDOW_MS = 10_000;
const RESET_LOOP_COUNT = 30;

export class FirmwareError extends Error {
  constructor(version) {
    super(version
      ? `This page needs GB-Link firmware ${MIN_FIRMWARE.join('.')} or newer; the adapter has ${version}.`
      : `This page needs GB-Link firmware ${MIN_FIRMWARE.join('.')} or newer.`);
    this.version = version;
  }
}

function atLeast(version, min) {
  for (let i = 0; i < min.length; i++) {
    if (version[i] !== min[i]) return version[i] > min[i];
  }
  return true;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class Distribution {
  constructor({ log = () => {} } = {}) {
    this.log = log;
    this.link = null;
    this.session = null;
    this.stopTicker = null;
    this.reader = new Rfu1Reader();
    this.firmware = null;
    this.gbaReady = false;
    this.resets = [];
    this.resetLoop = false;
    this.onStatus = null;
    this.onDecision = null;
    this.onResult = null;
    this.onAdapter = null;
    this.onDisconnect = null;
  }

  get connected() {
    return this.link !== null;
  }

  async connect(event, onProgress = () => {}) {
    onProgress('Waiting for the browser…');
    const link = await openGbLink();
    this.link = link;
    link.onDisconnect = () => this.lost();
    try {
      onProgress('Checking the adapter…');
      await link.sendCommand([COMMAND.CANCEL]);
      await delay(300);
      const info = await link.request([COMMAND.FIRMWARE_INFO]);
      const version = info?.length >= 4 ? [info[1], info[2], info[3]] : null;
      if (!version || !atLeast(version, MIN_FIRMWARE)) throw new FirmwareError(version?.join('.'));
      this.firmware = version.join('.');
      await link.sendCommand([COMMAND.SET_VOLTAGE_3V3]);

      onProgress('Starting wireless adapter mode…');
      link.onData = (payload) => this.data(payload);
      link.onStatus = (code) => {
        if (code === STATUS.LINK_CLOSED && this.session) this.lost();
      };
      const started = link.waitStatus(STATUS.AWAIT_MODE, 3000);
      await link.sendCommand([COMMAND.SET_MODE, MODE_WIRELESS_ADAPTER, 0]);
      if (!(await started)) {
        throw new Error('The adapter did not start wireless adapter mode. Unplug it, plug it back in, and connect again.');
      }

      const session = new WonderSession({ send: (frame) => this.send(frame), log: this.log });
      session.onStatus = (status) => this.onStatus?.(status);
      session.onDecision = (request) => this.onDecision?.(request);
      session.onResult = (result) => this.onResult?.(result);
      session.setEvent(event);
      this.session = session;
      session.start();
      this.stopTicker = startTicker(() => this.session?.tick());
    } catch (error) {
      await this.disconnect();
      throw error;
    }
  }

  setEvent(event) {
    this.session?.setEvent(event);
  }

  decide(send) {
    this.session?.decide(send);
  }

  send(frame) {
    this.link?.sendData(frame).catch(() => {});
  }

  data(payload) {
    if (payload.length === LINK_PACKET_BYTES) {
      for (const frame of this.reader.push(payload)) this.session?.receive(frame);
      return;
    }
    if (payload[0] === REPORT_STAGE && payload.length >= 4) {
      const ready = payload[3] >= STAGE_READY;
      if (ready !== this.gbaReady) {
        this.gbaReady = ready;
        this.onAdapter?.({ gbaReady: ready, resetLoop: this.resetLoop });
      }
    } else if (payload[0] === REPORT_EVENTS && payload.length >= 15) {
      this.noteResets(payload[14]);
    }
  }

  noteResets(count) {
    const now = Date.now();
    this.resets.push({ at: now, count });
    while (this.resets.length > 1 && now - this.resets[0].at > RESET_WINDOW_MS) this.resets.shift();
    const looping = ((count - this.resets[0].count) & 0xff) >= RESET_LOOP_COUNT;
    if (looping === this.resetLoop) return;
    this.resetLoop = looping;
    this.onAdapter?.({ gbaReady: this.gbaReady, resetLoop: looping });
  }

  // The adapter was unplugged, or left wireless adapter mode on its own.
  lost() {
    const link = this.link;
    if (!link) return;
    this.shutdown();
    this.link = null;
    link.onDisconnect = null;
    link.close().catch(() => {});
    this.onDisconnect?.();
  }

  shutdown() {
    this.stopTicker?.();
    this.stopTicker = null;
    this.session?.stop();
    this.session = null;
    this.reader = new Rfu1Reader();
    this.gbaReady = false;
    this.resets = [];
    this.resetLoop = false;
  }

  async disconnect() {
    const link = this.link;
    if (!link) return;
    this.shutdown();
    this.link = null;
    link.onDisconnect = null;
    try {
      await delay(50);
      await link.sendCommand([COMMAND.CANCEL]);
    } catch { }
    await link.close();
  }
}
