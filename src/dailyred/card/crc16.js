/** Wonder Card CRC16 (poly 0x8408, init 0x1121). */

let table = null;

function buildTable() {
  const t = new Uint16Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 1) ? ((crc >>> 1) ^ 0x8408) : (crc >>> 1);
    }
    t[i] = crc;
  }
  return t;
}

export function compute(data, length = data.length) {
  if (!table) table = buildTable();
  let crc = 0x1121;
  for (let i = 0; i < length; i++) {
    const high = (crc >>> 8) & 0xff;
    crc = (crc ^ data[i]) & 0xffff;
    crc = (high ^ table[crc & 0xff]) & 0xffff;
  }
  return (~crc) & 0xffff;
}
