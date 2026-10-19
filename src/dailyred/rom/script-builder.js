/**
 * Deliveryman RAM script: ROM check, relocate, save/restore party, battle.
 */
import { alloc, concat, u8, writeU16LE, writeU32LE } from '../bytes.js';
import { encode as encodeText } from '../card/text.js';

const VIRTUAL_BASE = 0x08000000;
const RELOCATED = 0x0203fc00;
const RELOCATED_END = 0x0203fc00 + 996;
const ROM_GAME = 0x080000ae;
const ROM_LANGUAGE = 0x080000af;
const ROM_REVISION = 0x080000bc;
const NE = 5;

const TRAMPOLINE = [0x020078d0, 0x18407891, 0x32041880, 0x4700609a];
const RELOCATE_CODE = [
  0x9a, 0x68, 0x0d, 0x49, 0x8a, 0x42, 0x03, 0xd3, 0x0c, 0x48, 0x82, 0x42, 0x00, 0xd2, 0x70, 0x47,
  0x07, 0x48, 0x00, 0x68, 0x07, 0x49, 0x40, 0x18, 0x07, 0x49, 0x9a, 0x68, 0x12, 0x1a, 0x52, 0x18,
  0x9a, 0x60, 0xf9, 0x22, 0x92, 0x00, 0x04, 0x3a, 0x83, 0x58, 0x8b, 0x50, 0xfb, 0xd1, 0x70, 0x47,
];

const u16 = (v) => {
  const b = alloc(2);
  writeU16LE(b, 0, v);
  return [...b];
};
const u32 = (v) => {
  const b = alloc(4);
  writeU32LE(b, 0, v);
  return [...b];
};
const compareAddr = (addr, value) => [0x1f, ...u32(addr), value & 0xff];
const msg = (label) => [{ vmessage: label }, 0x66, 0x6d, 0x68];

function sizeOf(item, at) {
  if (item && typeof item === 'object') {
    if ('align' in item) return (-at) & (item.align - 1);
    if ('dist' in item) return 2;
    if ('vgoto_if' in item) return 6;
    if ('vmessage' in item) return 5;
    if ('label' in item) return 4;
    if ('relocated_thumb' in item) return 4;
    if ('text' in item) return encodeText(item.text).length;
    if ('raw' in item) return item.raw.length;
    if ('define' in item) return 0;
  }
  return 1;
}

function layout(items) {
  const labels = {};
  let at = 0;
  for (const item of items) {
    if (item && typeof item === 'object' && 'define' in item) {
      labels[item.define] = at;
      continue;
    }
    at += sizeOf(item, at);
  }

  const chunks = [];
  at = 0;
  for (const item of items) {
    if (item && typeof item === 'object' && 'define' in item) continue;

    if (item && typeof item === 'object' && 'align' in item) {
      const pad = (-at) & (item.align - 1);
      if (pad) chunks.push(alloc(pad, 0));
      at += pad;
      continue;
    }
    if (item && typeof item === 'object' && 'dist' in item) {
      if (!(item.dist in labels)) throw new Error(`Missing label ${item.dist}`);
      const delta = (labels[item.dist] + 1 - (at - 2)) & 0xffff;
      const b = alloc(2);
      writeU16LE(b, 0, delta);
      chunks.push(b);
      at += 2;
      continue;
    }
    if (item && typeof item === 'object' && 'vgoto_if' in item) {
      const [cond, lab] = item.vgoto_if;
      const b = alloc(6);
      b[0] = 0xbb;
      b[1] = cond;
      writeU32LE(b, 2, VIRTUAL_BASE + labels[lab]);
      chunks.push(b);
      at += 6;
      continue;
    }
    if (item && typeof item === 'object' && 'vmessage' in item) {
      const b = alloc(5);
      b[0] = 0xbd;
      writeU32LE(b, 1, VIRTUAL_BASE + labels[item.vmessage]);
      chunks.push(b);
      at += 5;
      continue;
    }
    if (item && typeof item === 'object' && 'label' in item) {
      const b = alloc(4);
      writeU32LE(b, 0, VIRTUAL_BASE + labels[item.label]);
      chunks.push(b);
      at += 4;
      continue;
    }
    if (item && typeof item === 'object' && 'relocated_thumb' in item) {
      const b = alloc(4);
      writeU32LE(b, 0, (RELOCATED + labels[item.relocated_thumb]) | 1);
      chunks.push(b);
      at += 4;
      continue;
    }
    if (item && typeof item === 'object' && 'text' in item) {
      const enc = encodeText(item.text);
      chunks.push(enc);
      at += enc.length;
      continue;
    }
    if (item && typeof item === 'object' && 'raw' in item) {
      chunks.push(item.raw instanceof Uint8Array ? item.raw : Uint8Array.from(item.raw));
      at += item.raw.length;
      continue;
    }
    if (typeof item === 'number') {
      chunks.push(u8(item));
      at += 1;
      continue;
    }
    throw new Error(`Bad script item: ${JSON.stringify(item)}`);
  }

  const out = concat(chunks);
  if (out.length > 995) {
    throw new Error(`Script is ${out.length} bytes (max 995). Shrink messages or payload.`);
  }
  return out;
}

export function build(symbols, thumbPayload, intro, outro, wrongGame) {
  const game = String(symbols.game).charCodeAt(0);
  const revision = Number(symbols.revision);
  const ctx = Number(symbols.SCRIPT_CONTEXT);
  const sb1 = Number(symbols.SB1_PTR);
  const scriptOff = Number(symbols.scriptInSaveBlock1);
  const saveParty = Number(symbols.SPECIAL_SAVE_PARTY);
  const loadParty = Number(symbols.SPECIAL_LOAD_PARTY);

  const items = [];
  items.push(0xb8, ...u32(VIRTUAL_BASE), 0x6a, 0x5a);

  items.push(...compareAddr(ROM_GAME, game), { vgoto_if: [NE, 'wrong'] });
  items.push(...compareAddr(ROM_LANGUAGE, 'E'.charCodeAt(0)), { vgoto_if: [NE, 'wrong'] });
  items.push(...compareAddr(ROM_REVISION, revision), { vgoto_if: [NE, 'wrong'] });

  for (let i = 0; i < TRAMPOLINE.length; i++) {
    items.push(0x0f, i, ...u32(TRAMPOLINE[i]));
  }

  items.push(0x23, ...u32(ctx + 0x65), { dist: 'scene_code' });

  items.push({ define: 'scene' }, 0xb8, { label: 'scene' }, 0x68);
  items.push(...msg('intro_text'));
  items.push(0x25, ...u16(saveParty));
  items.push(0x23, { relocated_thumb: 'payload' }, 0x27);
  items.push(0x25, ...u16(loadParty));
  items.push(...msg('outro_text'), 0x6c, 0x02);

  items.push({ define: 'wrong' }, ...msg('wrong_text'), 0x6c, 0x02);

  items.push({ define: 'intro_text' }, { text: intro });
  items.push({ define: 'outro_text' }, { text: outro });
  items.push({ define: 'wrong_text' }, { text: wrongGame });

  items.push({ align: 4 }, { define: 'scene_code' }, ...RELOCATE_CODE);
  items.push(...u32(sb1), ...u32(scriptOff), ...u32(RELOCATED), ...u32(RELOCATED_END));

  items.push({ align: 2 }, { define: 'payload' }, { raw: thumbPayload });

  return layout(items);
}
