// GB-Link adapter over WebUSB, or WebSerial where WebUSB is missing. Three
// channels: commands out, link status in, data both ways. Command replies
// come back on the data channel, led by the command byte.

const VENDOR_ID = 0x2fe3;
const PACKET_BYTES = 64;
const SERIAL_SYNC = [0x47, 0x42];
const CHANNEL = { COMMAND: 0, DATA: 1, STATUS: 2 };

export const COMMAND = {
  SET_MODE: 0x00,
  CANCEL: 0x01,
  FIRMWARE_INFO: 0x0f,
  SET_VOLTAGE_3V3: 0x40,
};

export const STATUS = {
  AWAIT_MODE: 0xff02,
  LINK_CONNECTED: 0xff05,
  LINK_RECONNECTING: 0xff06,
  LINK_CLOSED: 0xff07,
  DEVICE_READY: 0xff08,
};

export function isTransportAvailable() {
  return typeof navigator !== 'undefined' && Boolean(navigator.usb || navigator.serial);
}

class GbLink {
  constructor() {
    this.onData = null;
    this.onStatus = null;
    this.onDisconnect = null;
    this.waiters = [];
    this.statusWaiters = [];
    this.closed = false;
  }

  deliverData(payload) {
    if (payload.length < PACKET_BYTES) {
      const at = this.waiters.findIndex((w) => w.command === payload[0]);
      if (at >= 0) {
        const [waiter] = this.waiters.splice(at, 1);
        clearTimeout(waiter.timer);
        waiter.resolve(payload);
        return;
      }
    }
    this.onData?.(payload);
  }

  deliverStatus(code) {
    for (const waiter of this.statusWaiters.filter((w) => w.code === code)) {
      clearTimeout(waiter.timer);
      waiter.resolve(code);
    }
    this.statusWaiters = this.statusWaiters.filter((w) => w.code !== code);
    this.onStatus?.(code);
  }

  lost() {
    if (this.closed) return;
    this.closed = true;
    for (const w of this.waiters) {
      clearTimeout(w.timer);
      w.resolve(null);
    }
    for (const w of this.statusWaiters) {
      clearTimeout(w.timer);
      w.resolve(null);
    }
    this.waiters = [];
    this.statusWaiters = [];
    this.onDisconnect?.();
  }

  // Sends a command and resolves with its reply, or null after the timeout.
  request(bytes, timeoutMs = 800) {
    return new Promise((resolve) => {
      const waiter = { command: bytes[0], resolve, timer: 0 };
      waiter.timer = setTimeout(() => {
        this.waiters = this.waiters.filter((w) => w !== waiter);
        resolve(null);
      }, timeoutMs);
      this.waiters.push(waiter);
      this.sendCommand(bytes).catch(() => {});
    });
  }

  waitStatus(code, timeoutMs) {
    return new Promise((resolve) => {
      const waiter = { code, resolve, timer: 0 };
      waiter.timer = setTimeout(() => {
        this.statusWaiters = this.statusWaiters.filter((w) => w !== waiter);
        resolve(null);
      }, timeoutMs);
      this.statusWaiters.push(waiter);
    });
  }

  // Data longer than a packet goes out in consecutive packets.
  sendData(bytes) {
    let last = Promise.resolve();
    for (let at = 0; at < bytes.length; at += PACKET_BYTES) {
      last = this.write(CHANNEL.DATA, bytes.subarray(at, Math.min(bytes.length, at + PACKET_BYTES)));
    }
    return last;
  }

  sendCommand(bytes) {
    return this.write(CHANNEL.COMMAND, Uint8Array.from(bytes));
  }
}

class GbLinkUsb extends GbLink {
  constructor(device, endpoints) {
    super();
    this.device = device;
    this.endpoints = endpoints;
    this.outbound = Promise.resolve();
    this.onUsbDisconnect = (event) => {
      if (event.device === this.device) this.lost();
    };
    navigator.usb.addEventListener('disconnect', this.onUsbDisconnect);
    this.readLoop(endpoints.dataIn, (payload) => this.deliverData(payload));
    this.readLoop(endpoints.statusIn, (payload) => {
      if (payload.length >= 2) this.deliverStatus(payload[0] | (payload[1] << 8));
    });
  }

  // Always keep a transfer pending: the adapter waits on every packet it
  // sends until the host takes it.
  async readLoop(endpoint, deliver) {
    try {
      while (!this.closed) {
        const result = await this.device.transferIn(endpoint, PACKET_BYTES);
        if (result.status === 'stall') {
          await this.device.clearHalt('in', endpoint);
          continue;
        }
        if (result.data?.byteLength) {
          deliver(new Uint8Array(result.data.buffer, result.data.byteOffset, result.data.byteLength));
        }
      }
    } catch {
      this.lost();
    }
  }

  write(channel, payload) {
    const endpoint = channel === CHANNEL.COMMAND ? this.endpoints.commandOut : this.endpoints.dataOut;
    const result = this.outbound.then(() => {
      if (this.closed) throw new Error('GB-Link disconnected.');
      return this.device.transferOut(endpoint, payload);
    });
    this.outbound = result.catch(() => {});
    return result;
  }

  async close() {
    this.closed = true;
    navigator.usb.removeEventListener('disconnect', this.onUsbDisconnect);
    try { await this.device.close(); } catch { }
  }
}

class GbLinkSerial extends GbLink {
  constructor(port, reader, writer) {
    super();
    this.port = port;
    this.reader = reader;
    this.writer = writer;
    this.rx = { state: 0, channel: 0, length: 0, payload: null, at: 0 };
    this.readLoop();
  }

  async readLoop() {
    try {
      while (!this.closed) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value) for (const b of value) this.feed(b);
      }
    } catch {
      // Unplugged, or close() cancelled the read.
    }
    this.lost();
  }

  // "GB", channel, length (LE16), payload.
  feed(b) {
    const rx = this.rx;
    switch (rx.state) {
      case 0:
        if (b === SERIAL_SYNC[0]) rx.state = 1;
        break;
      case 1:
        rx.state = b === SERIAL_SYNC[1] ? 2 : b === SERIAL_SYNC[0] ? 1 : 0;
        break;
      case 2:
        rx.channel = b;
        rx.state = 3;
        break;
      case 3:
        rx.length = b;
        rx.state = 4;
        break;
      case 4:
        rx.length |= b << 8;
        rx.at = 0;
        rx.payload = new Uint8Array(rx.length);
        if (rx.length > PACKET_BYTES) rx.state = 0;
        else if (rx.length === 0) this.frame();
        else rx.state = 5;
        break;
      default:
        rx.payload[rx.at++] = b;
        if (rx.at === rx.length) this.frame();
        break;
    }
  }

  frame() {
    const { channel, payload } = this.rx;
    this.rx.state = 0;
    if (channel === CHANNEL.DATA) this.deliverData(payload);
    else if (channel === CHANNEL.STATUS && payload.length >= 2) this.deliverStatus(payload[0] | (payload[1] << 8));
  }

  write(channel, payload) {
    if (this.closed) return Promise.reject(new Error('GB-Link disconnected.'));
    const frame = new Uint8Array(5 + payload.length);
    frame.set(SERIAL_SYNC);
    frame[2] = channel;
    frame[3] = payload.length & 0xff;
    frame[4] = payload.length >> 8;
    frame.set(payload, 5);
    return this.writer.write(frame);
  }

  async close() {
    this.closed = true;
    try { await this.reader.cancel(); } catch { }
    try { this.reader.releaseLock(); } catch { }
    try { this.writer.releaseLock(); } catch { }
    try { await this.port.close(); } catch { }
  }
}

// Lower endpoint pair: commands out, status in. Upper pair: data.
function findEndpoints(device) {
  for (const iface of device.configuration?.interfaces ?? []) {
    for (const alternate of iface.alternates) {
      if (alternate.interfaceClass !== 0xff) continue;
      const numbers = (direction) => alternate.endpoints
        .filter((e) => e.direction === direction)
        .map((e) => e.endpointNumber)
        .sort((a, b) => a - b);
      const ins = numbers('in');
      const outs = numbers('out');
      if (ins.length < 2 || outs.length < 2) continue;
      return {
        interfaceNumber: iface.interfaceNumber,
        commandOut: outs[0],
        statusIn: ins[0],
        dataOut: outs[outs.length - 1],
        dataIn: ins[ins.length - 1],
      };
    }
  }
  return null;
}

// Asks the browser for the adapter; must run from a user gesture.
export async function openGbLink() {
  if (navigator.usb) {
    for (const device of await navigator.usb.getDevices()) {
      if (device.opened) {
        try { await device.close(); } catch { }
      }
    }
    const device = await navigator.usb.requestDevice({ filters: [{ vendorId: VENDOR_ID }] });
    await device.open();
    if (!device.configuration) await device.selectConfiguration(1);
    const endpoints = findEndpoints(device);
    if (!endpoints) throw new Error('This device is not a GB-Link adapter.');
    await device.claimInterface(endpoints.interfaceNumber);
    return new GbLinkUsb(device, endpoints);
  }
  if (navigator.serial) {
    const port = await navigator.serial.requestPort({ filters: [{ usbVendorId: VENDOR_ID }] });
    await port.open({ baudRate: 115200 });
    const link = new GbLinkSerial(port, port.readable.getReader(), port.writable.getWriter());
    port.addEventListener?.('disconnect', () => link.lost());
    return link;
  }
  throw new Error('This browser cannot reach USB devices. Use Chrome, Edge, or Firefox 151 or newer.');
}
