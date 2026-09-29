function decodeBase64(s) {
  const bin = atob(s.replace(/\s+/g, ""));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// The GB-Link Team cards, written by tools/native-cards/build.mjs: one payload
// per game, or per ROM where FireRed and LeafGreen, 1.0 and 1.1 need different
// addresses. All but the Master Ball check the ROM header in game and are sent
// only to the English ROMs they list. The Master Ball's two scripts differ only
// in the flag and var numbers each game uses.
const NATIVE_ROMS = ['BPEE 1.0', 'BPRE 1.0', 'BPRE 1.1', 'BPGE 1.0', 'BPGE 1.1'];

// The payloads for the four FireRed/LeafGreen ROMs: FireRed 1.0's, and for each
// other ROM the bytes that differ from it, as runs of [u16 offset, u8 length,
// bytes].
function romPayloads(base, patches) {
  const payloads = { 'BPRE 1.0': [base] };
  for (const [rom, diff] of Object.entries(patches)) {
    const bytes = Uint8Array.from(base);
    for (let at = 0; at < diff.length; at += 3 + diff[at + 2]) {
      bytes.set(diff.subarray(at + 3, at + 3 + diff[at + 2]), diff[at] | (diff[at + 1] << 8));
    }
    payloads[rom] = [bytes];
  }
  return payloads;
}

export const CUSTOM_WONDERCARDS = [
  {
    id: 'custom-speed-0-5',
    label: 'Slow Down 0.5× (Hold R)',
    description: 'While you hold R, the whole game runs at half speed. Let go of R to play normally. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`7QNlAAUAAAAAAMK7xsAAzcq/v77////////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADiwC9XgAACGZtaGwCvZoAAAhmbWhsAsLj4NgAzADo4wDk4NXtANXoANzV4NoA5+TZ
2dir/sbZ6ADb4wDj2gDMAOjjAOTg1e0A4uPm4dXg4O2t/87c3ecA293a6ADY49nn4rToAOvj5t8A
693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/3C1APAe+B6IACAYgBBNFKQQSAQ4AtQhWClQ
+ucOSAFoKh9LG5sKAdERaADgEWAAKQPQCksZYGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwR8BGAPwD
AvABAAAgJwADoP0DAjC1bUgEiG5IAWgBMQFgc0gAKAHQASEBcADwe/hgSwDwd/gBIARCI9FnTF+l
APAj+GZMX6UA8B/4YkggIcJ+ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFZSEFoATFBYFZMACwE
0E9LAPBS+AE8+OcwvAG8AEcAtVdJACkE0FRIgI0IQIhCQdEALD/QUEhBaGpokUI60QFoKmiRQjbR
TUnJiMkLMtEA8HX4TUkAKRDQQ0rSaFMAGxiLQgrZQEgBaQExAWHRCAExUhoA1QAiwmAc4AG0PkgA
IcGFAYYraADwF/g7SEFoa2iZQg7RAPAQ+ADwUPgCvEAaANXkMDBK0GCRaAExkWABPL7nAbABvABH
GEcQtSpIQWkAKQbQLEoRYIFpUWAAIUFhgWEvSQApLdApSgAqBNAmS5uNE0CTQiXRH0jCaQEyikIA
0wAiwmEAKhzRH0scaBRKlEID0VxoE0qUQgfQHGgSSpRCD9FcaBFKlEIL0RdK0ojSCwfREEgcaERh
XGiEYRlMHGBcYBC8AbwAR3BHE0gAiKA4ANXkMHBHOQcACHlHAAgFXggIXV4ICPGeAwghhAMI3CIA
AwAAAABg/wMCsAECAgAAAAAAAAAAwCIAA9R/AwIAAQAAAAAAAOQAAAAGAAAEAgAAAJP9AwI=`)],
      ...romPayloads(decodeBase64(`6gNlAAIAAAAAAMK7xsAAzcq/v77////////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADiwC9XgAACGZtaGwCvZoAAAhmbWhsAsLj4NgAzADo4wDk4NXtANXoANzV4NoA5+TZ
2dir/sbZ6ADb4wDj2gDMAOjjAOTg1e0A4uPm4dXg4O2t/87c3ecA293a6ADY49nn4rToAOvj5t8A
693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/3C1APAe+B6IACAYgBBNFKQQSAQ4AtQhWClQ
+ucOSAFoKh9LG5sKAdERaADgEWAAKQPQCksZYGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwR8BGAPwD
AvABAABQNQADoP0DAjC1bUgEiG5IAWgBMQFgc0gAKAHQASEBcADwe/hgSwDwd/gBIARCI9FnTF+l
APAj+GZMX6UA8B/4YkggIcJ+ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFZSEFoATFBYFZMACwE
0E9LAPBS+AE8+OcwvAG8AEcAtVdJACkE0FRIgI0IQIhCQdEALD/QUEhBaGpokUI60QFoKmiRQjbR
TUnJiMkLMtEA8HX4TUkAKRDQQ0rSaFMAGxiLQgrZQEgBaQExAWHRCAExUhoA1QAiwmAc4AG0PkgA
IcGFAYYraADwF/g7SEFoa2iZQg7RAPAQ+ADwUPgCvEAaANXkMDBK0GCRaAExkWABPL7nAbABvABH
GEcQtSpIQWkAKQbQLEoRYIFpUWAAIUFhgWEvSQApLdApSgAqBNAmS5uNE0CTQiXRH0jCaQEyikIA
0wAiwmEAKhzRH0scaBRKlEID0VxoE0qUQgfQHGgSSpRCD9FcaBFKlEIL0RdK0ojSCwfREEgcaERh
XGiEYRlMHGBcYBC8AbwAR3BHE0gAiKA4ANXkMHBHJQcACOktAAg1ZQUItWUFCOUjAQgBEQEIDDEA
AwAAAABg/wMCNAACAgAAAAAAAAAA8DAAA7h6AwIAAQAAdfEDAuQAAAAGAAAEAgAAAJP9AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBASAEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEgBBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
      }),
    },
  },
  {
    id: 'custom-speed-0-75',
    label: 'Slow Down 0.75× (Hold R)',
    description: 'While you hold R, the whole game runs at three-quarter speed. Let go of R to play normally. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`7gNlAAYAAAAAAKGtqKa5AM3Kv7++///////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADjwC9XgAACGZtaGwCvZwAAAhmbWhsAsLj4NgAzADo4wDk4NXtANUA4N3o6ODZAOfg
4+vZ5qv+xtnoANvjAOPaAMwA6OMA5ODV7QDi4+bh1eDg7a3/ztzd5wDb3droANjj2efitOgA6+Pm
3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AABwtQDwHvgeiAAgGIAQTRSkEEgEOALU
IVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkD0ApLGWBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEfA
RgD8AwLwAQAAICcAA6D9AwIwtW1IBIhuSAFoATEBYHNIACgB0AEhAXAA8Hv4YEsA8Hf4ASAEQiPR
Z0xfpQDwI/hmTF+lAPAf+GJIICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDABOfHRWUhBaAExQWBW
TAAsBNBPSwDwUvgBPPjnMLwBvABHALVXSQApBNBUSICNCECIQkHRACw/0FBIQWhqaJFCOtEBaCpo
kUI20U1JyYjJCzLRAPB1+E1JACkQ0ENK0mhTABsYi0IK2UBIAWkBMQFh0QgBMVIaANUAIsJgHOAB
tD5IACHBhQGGK2gA8Bf4O0hBaGtomUIO0QDwEPgA8FD4ArxAGgDV5DAwStBgkWgBMZFgATy+5wGw
AbwARxhHELUqSEFpACkG0CxKEWCBaVFgACFBYYFhL0kAKS3QKUoAKgTQJkubjRNAk0Il0R9IwmkB
MopCANMAIsJhACoc0R9LHGgUSpRCA9FcaBNKlEIH0BxoEkqUQg/RXGgRSpRCC9EXStKI0gsH0RBI
HGhEYVxohGEZTBxgXGAQvAG8AEdwRxNIAIigOADV5DBwRzkHAAh5RwAIBV4ICF1eCAjxngMIIYQD
CNwiAAMAAAAAYP8DArABAgIAAAAAAAAAAMAiAAPUfwMCAAEAAAAAAADkAAAABgAABAQAAACT/QMC`)],
      ...romPayloads(decodeBase64(`6wNlAAMAAAAAAKGtqKa5AM3Kv7++///////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADjwC9XgAACGZtaGwCvZwAAAhmbWhsAsLj4NgAzADo4wDk4NXtANUA4N3o6ODZAOfg
4+vZ5qv+xtnoANvjAOPaAMwA6OMA5ODV7QDi4+bh1eDg7a3/ztzd5wDb3droANjj2efitOgA6+Pm
3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AABwtQDwHvgeiAAgGIAQTRSkEEgEOALU
IVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkD0ApLGWBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEfA
RgD8AwLwAQAAUDUAA6D9AwIwtW1IBIhuSAFoATEBYHNIACgB0AEhAXAA8Hv4YEsA8Hf4ASAEQiPR
Z0xfpQDwI/hmTF+lAPAf+GJIICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDABOfHRWUhBaAExQWBW
TAAsBNBPSwDwUvgBPPjnMLwBvABHALVXSQApBNBUSICNCECIQkHRACw/0FBIQWhqaJFCOtEBaCpo
kUI20U1JyYjJCzLRAPB1+E1JACkQ0ENK0mhTABsYi0IK2UBIAWkBMQFh0QgBMVIaANUAIsJgHOAB
tD5IACHBhQGGK2gA8Bf4O0hBaGtomUIO0QDwEPgA8FD4ArxAGgDV5DAwStBgkWgBMZFgATy+5wGw
AbwARxhHELUqSEFpACkG0CxKEWCBaVFgACFBYYFhL0kAKS3QKUoAKgTQJkubjRNAk0Il0R9IwmkB
MopCANMAIsJhACoc0R9LHGgUSpRCA9FcaBNKlEIH0BxoEkqUQg/RXGgRSpRCC9EXStKI0gsH0RBI
HGhEYVxohGEZTBxgXGAQvAG8AEdwRxNIAIigOADV5DBwRyUHAAjpLQAINWUFCLVlBQjlIwEIAREB
CAwxAAMAAAAAYP8DAjQAAgIAAAAAAAAAAPAwAAO4egMCAAEAAHXxAwLkAAAABgAABAQAAACT/QMC`), {
        'BPRE 1.1': decodeBase64(`dAEBASQEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEkBBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
      }),
    },
  },
  {
    id: 'custom-speed-2',
    label: 'Fast Forward 2× (Hold R)',
    description: 'While you hold R, the game runs at double speed, including walking, battles and text. Let go of R to play normally. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`8wNlAAsAAAAAAL7Jz7zGvwDNyr+/vv/////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADhwC9XgAACGZtaGwCvZUAAAhmbWhsAsLj4NgAzADa4+YA2OPp1uDZAOfk2dnYq/7G
2egA2+MA49oAzADo4wDk4NXtAOLj5uHV4ODtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+
6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AcLUA8B74HogAIBiAEE0UpBBIBDgC1CFYKVD65w5I
AWgqH0sbmwoB0RFoAOARYAApA9AKSxlgaRwBYADwAvgegHC9giObAAQiEgabGHBHwEYA/AMC8AEA
ACAnAAOg/QMCMLVtSASIbkgBaAExAWBzSAAoAdABIQFwAPB7+GBLAPB3+AEgBEIj0WdMX6UA8CP4
ZkxfpQDwH/hiSCAhwn4AKgfQgnkDeppCA9HCeUN6mkIO0CQwATnx0VlIQWgBMUFgVkwALATQT0sA
8FL4ATz45zC8AbwARwC1V0kAKQTQVEiAjQhAiEJB0QAsP9BQSEFoamiRQjrRAWgqaJFCNtFNScmI
yQsy0QDwdfhNSQApENBDStJoUwAbGItCCtlASAFpATEBYdEIATFSGgDVACLCYBzgAbQ+SAAhwYUB
hitoAPAX+DtIQWhraJlCDtEA8BD4APBQ+AK8QBoA1eQwMErQYJFoATGRYAE8vucBsAG8AEcYRxC1
KkhBaQApBtAsShFggWlRYAAhQWGBYS9JACkt0ClKACoE0CZLm40TQJNCJdEfSMJpATKKQgDTACLC
YQAqHNEfSxxoFEqUQgPRXGgTSpRCB9AcaBJKlEIP0VxoEUqUQgvRF0rSiNILB9EQSBxoRGFcaIRh
GUwcYFxgELwBvABHcEcTSACIoDgA1eQwcEc5BwAIeUcACAVeCAhdXggI8Z4DCCGEAwjcIgADAQAA
AGD/AwKwAQICAQAAAAEAAADAIgAD1H8DAgABAAAAAAAA5AAAAAYAAAQAAAAAk/0DAg==`)],
      ...romPayloads(decodeBase64(`7gNlAAYAAAAAAL7Jz7zGvwDNyr+/vv/////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADhwC9XgAACGZtaGwCvZUAAAhmbWhsAsLj4NgAzADa4+YA2OPp1uDZAOfk2dnYq/7G
2egA2+MA49oAzADo4wDk4NXtAOLj5uHV4ODtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+
6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AcLUA8B74HogAIBiAEE0UpBBIBDgC1CFYKVD65w5I
AWgqH0sbmwoB0RFoAOARYAApA9AKSxlgaRwBYADwAvgegHC9giObAAQiEgabGHBHwEYA/AMC8AEA
AFA1AAOg/QMCMLVtSASIbkgBaAExAWBzSAAoAdABIQFwAPB7+GBLAPB3+AEgBEIj0WdMX6UA8CP4
ZkxfpQDwH/hiSCAhwn4AKgfQgnkDeppCA9HCeUN6mkIO0CQwATnx0VlIQWgBMUFgVkwALATQT0sA
8FL4ATz45zC8AbwARwC1V0kAKQTQVEiAjQhAiEJB0QAsP9BQSEFoamiRQjrRAWgqaJFCNtFNScmI
yQsy0QDwdfhNSQApENBDStJoUwAbGItCCtlASAFpATEBYdEIATFSGgDVACLCYBzgAbQ+SAAhwYUB
hitoAPAX+DtIQWhraJlCDtEA8BD4APBQ+AK8QBoA1eQwMErQYJFoATGRYAE8vucBsAG8AEcYRxC1
KkhBaQApBtAsShFggWlRYAAhQWGBYS9JACkt0ClKACoE0CZLm40TQJNCJdEfSMJpATKKQgDTACLC
YQAqHNEfSxxoFEqUQgPRXGgTSpRCB9AcaBJKlEIP0VxoEUqUQgvRF0rSiNILB9EQSBxoRGFcaIRh
GUwcYFxgELwBvABHcEcTSACIoDgA1eQwcEclBwAI6S0ACDVlBQi1ZQUI5SMBCAERAQgMMQADAQAA
AGD/AwI0AAICAQAAAAEAAADwMAADuHoDAgABAAB18QMC5AAAAAYAAAQAAAAAk/0DAg==`), {
        'BPRE 1.1': decodeBase64(`dAEBARwEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEcBBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
      }),
    },
  },
  {
    id: 'custom-speed-3',
    label: 'Fast Forward 3× (Hold R)',
    description: 'While you hold R, the game runs up to three times as fast, including walking, battles and text. Let go of R to play normally. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`9ANlAAwAAAAAAM7Mw8rGvwDNyr+/vv/////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADhwC9XgAACGZtaGwCvZUAAAhmbWhsAsLj4NgAzADa4+YA6Obd5ODZAOfk2dnYq/7G
2egA2+MA49oAzADo4wDk4NXtAOLj5uHV4ODtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+
6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AcLUA8B74HogAIBiAEE0UpBBIBDgC1CFYKVD65w5I
AWgqH0sbmwoB0RFoAOARYAApA9AKSxlgaRwBYADwAvgegHC9giObAAQiEgabGHBHwEYA/AMC8AEA
ACAnAAOg/QMCMLVtSASIbkgBaAExAWBzSAAoAdABIQFwAPB7+GBLAPB3+AEgBEIj0WdMX6UA8CP4
ZkxfpQDwH/hiSCAhwn4AKgfQgnkDeppCA9HCeUN6mkIO0CQwATnx0VlIQWgBMUFgVkwALATQT0sA
8FL4ATz45zC8AbwARwC1V0kAKQTQVEiAjQhAiEJB0QAsP9BQSEFoamiRQjrRAWgqaJFCNtFNScmI
yQsy0QDwdfhNSQApENBDStJoUwAbGItCCtlASAFpATEBYdEIATFSGgDVACLCYBzgAbQ+SAAhwYUB
hitoAPAX+DtIQWhraJlCDtEA8BD4APBQ+AK8QBoA1eQwMErQYJFoATGRYAE8vucBsAG8AEcYRxC1
KkhBaQApBtAsShFggWlRYAAhQWGBYS9JACkt0ClKACoE0CZLm40TQJNCJdEfSMJpATKKQgDTACLC
YQAqHNEfSxxoFEqUQgPRXGgTSpRCB9AcaBJKlEIP0VxoEUqUQgvRF0rSiNILB9EQSBxoRGFcaIRh
GUwcYFxgELwBvABHcEcTSACIoDgA1eQwcEc5BwAIeUcACAVeCAhdXggI8Z4DCCGEAwjcIgADAgAA
AGD/AwKwAQICAgAAAAIAAADAIgAD1H8DAgABAAAAAAAA5AAAAAYAAAQAAAAAk/0DAg==`)],
      ...romPayloads(decodeBase64(`7wNlAAcAAAAAAM7Mw8rGvwDNyr+/vv/////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADhwC9XgAACGZtaGwCvZUAAAhmbWhsAsLj4NgAzADa4+YA6Obd5ODZAOfk2dnYq/7G
2egA2+MA49oAzADo4wDk4NXtAOLj5uHV4ODtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+
6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AcLUA8B74HogAIBiAEE0UpBBIBDgC1CFYKVD65w5I
AWgqH0sbmwoB0RFoAOARYAApA9AKSxlgaRwBYADwAvgegHC9giObAAQiEgabGHBHwEYA/AMC8AEA
AFA1AAOg/QMCMLVtSASIbkgBaAExAWBzSAAoAdABIQFwAPB7+GBLAPB3+AEgBEIj0WdMX6UA8CP4
ZkxfpQDwH/hiSCAhwn4AKgfQgnkDeppCA9HCeUN6mkIO0CQwATnx0VlIQWgBMUFgVkwALATQT0sA
8FL4ATz45zC8AbwARwC1V0kAKQTQVEiAjQhAiEJB0QAsP9BQSEFoamiRQjrRAWgqaJFCNtFNScmI
yQsy0QDwdfhNSQApENBDStJoUwAbGItCCtlASAFpATEBYdEIATFSGgDVACLCYBzgAbQ+SAAhwYUB
hitoAPAX+DtIQWhraJlCDtEA8BD4APBQ+AK8QBoA1eQwMErQYJFoATGRYAE8vucBsAG8AEcYRxC1
KkhBaQApBtAsShFggWlRYAAhQWGBYS9JACkt0ClKACoE0CZLm40TQJNCJdEfSMJpATKKQgDTACLC
YQAqHNEfSxxoFEqUQgPRXGgTSpRCB9AcaBJKlEIP0VxoEUqUQgvRF0rSiNILB9EQSBxoRGFcaIRh
GUwcYFxgELwBvABHcEcTSACIoDgA1eQwcEclBwAI6S0ACDVlBQi1ZQUI5SMBCAERAQgMMQADAgAA
AGD/AwI0AAICAgAAAAIAAADwMAADuHoDAgABAAB18QMC5AAAAAYAAAQAAAAAk/0DAg==`), {
        'BPRE 1.1': decodeBase64(`dAEBARwEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEcBBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
      }),
    },
  },
  {
    id: 'custom-speed-4',
    label: 'Fast Forward 4× (Hold R)',
    description: 'While you hold R, the game runs up to four times as fast, including walking, battles and text. Let go of R to play normally. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`+gNlABIAAAAAAKW5AM3Kv7++///////////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADiwC9XgAACGZtaGwCvZkAAAhmbWhsAsLj4NgAzADo4wDn5NnZ2ADo3NkA29Xh2QDp
5Kv+xtnoANvjAOPaAMwA6OMA5ODV7QDi4+bh1eDg7a3/ztzd5wDb3droANjj2efitOgA6+Pm3wDr
3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AHC1APAe+B6IACAYgBBNFKQQSAQ4AtQhWClQ
+ucOSAFoKh9LG5sKAdERaADgEWAAKQPQCksZYGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwR8BGAPwD
AvABAAAgJwADoP0DAjC1bUgEiG5IAWgBMQFgc0gAKAHQASEBcADwe/hgSwDwd/gBIARCI9FnTF+l
APAj+GZMX6UA8B/4YkggIcJ+ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFZSEFoATFBYFZMACwE
0E9LAPBS+AE8+OcwvAG8AEcAtVdJACkE0FRIgI0IQIhCQdEALD/QUEhBaGpokUI60QFoKmiRQjbR
TUnJiMkLMtEA8HX4TUkAKRDQQ0rSaFMAGxiLQgrZQEgBaQExAWHRCAExUhoA1QAiwmAc4AG0PkgA
IcGFAYYraADwF/g7SEFoa2iZQg7RAPAQ+ADwUPgCvEAaANXkMDBK0GCRaAExkWABPL7nAbABvABH
GEcQtSpIQWkAKQbQLEoRYIFpUWAAIUFhgWEvSQApLdApSgAqBNAmS5uNE0CTQiXRH0jCaQEyikIA
0wAiwmEAKhzRH0scaBRKlEID0VxoE0qUQgfQHGgSSpRCD9FcaBFKlEIL0RdK0ojSCwfREEgcaERh
XGiEYRlMHGBcYBC8AbwAR3BHE0gAiKA4ANXkMHBHOQcACHlHAAgFXggIXV4ICPGeAwghhAMI3CIA
AwQAAABg/wMCsAECAgMAAAADAAAAwCIAA9R/AwIAAQAAAAAAAOQAAAAGAAAEAAAAAJP9AwI=`)],
      ...romPayloads(decodeBase64(`8ANlAAgAAAAAAKW5AM3Kv7++///////////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADiwC9XgAACGZtaGwCvZkAAAhmbWhsAsLj4NgAzADo4wDn5NnZ2ADo3NkA29Xh2QDp
5Kv+xtnoANvjAOPaAMwA6OMA5ODV7QDi4+bh1eDg7a3/ztzd5wDb3droANjj2efitOgA6+Pm3wDr
3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AHC1APAe+B6IACAYgBBNFKQQSAQ4AtQhWClQ
+ucOSAFoKh9LG5sKAdERaADgEWAAKQPQCksZYGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwR8BGAPwD
AvABAABQNQADoP0DAjC1bUgEiG5IAWgBMQFgc0gAKAHQASEBcADwe/hgSwDwd/gBIARCI9FnTF+l
APAj+GZMX6UA8B/4YkggIcJ+ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFZSEFoATFBYFZMACwE
0E9LAPBS+AE8+OcwvAG8AEcAtVdJACkE0FRIgI0IQIhCQdEALD/QUEhBaGpokUI60QFoKmiRQjbR
TUnJiMkLMtEA8HX4TUkAKRDQQ0rSaFMAGxiLQgrZQEgBaQExAWHRCAExUhoA1QAiwmAc4AG0PkgA
IcGFAYYraADwF/g7SEFoa2iZQg7RAPAQ+ADwUPgCvEAaANXkMDBK0GCRaAExkWABPL7nAbABvABH
GEcQtSpIQWkAKQbQLEoRYIFpUWAAIUFhgWEvSQApLdApSgAqBNAmS5uNE0CTQiXRH0jCaQEyikIA
0wAiwmEAKhzRH0scaBRKlEID0VxoE0qUQgfQHGgSSpRCD9FcaBFKlEIL0RdK0ojSCwfREEgcaERh
XGiEYRlMHGBcYBC8AbwAR3BHE0gAiKA4ANXkMHBHJQcACOktAAg1ZQUItWUFCOUjAQgBEQEIDDEA
AwQAAABg/wMCNAACAgMAAAADAAAA8DAAA7h6AwIAAQAAdfEDAuQAAAAGAAAEAAAAAJP9AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBASAEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEgBBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
      }),
    },
  },
  {
    id: 'custom-gender-swap',
    label: 'New Trainer Name/Gender',
    description: 'Offers you a new trainer name, then offers to switch your character between boy and girl on the spot, sprite included; say no to either to skip it. Your own Pokémon take the new name as their original trainer, so they still count as yours. Talk to the deliveryman again to switch back.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`9QOEAA0AAAAIAMi/0QDOzLvDyL/MAMi7x7+6wb/Ivr/M//////////////////////+7AOLZ6wDi
1eHZuADVAOLZ6wDg4+Pfq///////////////////////yNnrAOLV4dmsAMjZ6wDg4+PfrADQ3efd
6ADo3Nn//////////////9jZ4N3q2ebt4dXiAOPiAOjc2QCj4tgA2uDj4+b////////////////j
2gDVAMrJxRvHycgAvb/Izr/MAOjjAObZ4tXh2f//////////////4+YA5+vV5ADW2ejr2dniALzJ
0wDV4tgAwcPMxq3//////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFsAAACB+vAAAIRbsFsAAACB+8AAAIALsFsAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR726AAAIZm4UCCENgAAAuwF8AAAII6UOAAMzArheAAAIaJcBI6UOAANmAScjpQ4AA34BvdUA
AAhmbb3rAAAIZm4UCCENgAAAuwGmAAAIaJcDI6UOAAP3AJcCvRIBAAhmbWhsAr1BAQAIZm1obAK9
VQEACGZtaGwC0ePp4NgA7ePpAODd39kA1QDi2esA4tXh2az/yN3X2QDo4wDh2dnoAO3j6bgA/QGr
/83c1eDgAMMA5+vV5ADt4+kA1tno69nZ4v68ydMA1eLYAMHDzMas/87VrtjVqwDO1eDfAOjjAOHZ
ANXb1d3iANXi7f7o3eHZAOjjAOfr1eQA1tXX363/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd
2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AMLUzSABoAXoB
IlFAAXIyTOFxZXkkIEVDMEgtGAAgM0sA8FP4AQAoADFLAPBO+Cl+CQcJDygAL0sA8Ef4MLwBvABH
ELWCsC1LAZMAIACQIEkJaAp6ACMAICdMAPA3+AKwEL3wtRpPP2gNIC0COVwNQwE4Cij52hpMBiZk
IgDwE/gYTCRoBDRpJrYAUCIA8Av4EEwkaBRIJBgCJowiAPAD+PC8AbwARwE+DtThfIkHCdVhaKlC
BtEhABQxByABODtcC1T70aQY7udwRxhHIEfARpBdAAOMXQADkHUDAlBzAwLsRAIClF0AAzAwAABV
vQgI+eMICEXlCAh5LQ4IsWEICAdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBHjF0AAzA3
AAAA/AMC`)],
      ...romPayloads(decodeBase64(`9QOEAA0AAAAIAMi/0QDOzLvDyL/MAMi7x7+6wb/Ivr/M//////////////////////+7AOLZ6wDi
1eHZuADVAOLZ6wDg4+Pfq///////////////////////yNnrAOLV4dmsAMjZ6wDg4+PfrADQ3efd
6ADo3Nn//////////////9jZ4N3q2ebt4dXiAOPiAOjc2QCj4tgA2uDj4+b////////////////j
2gDVAMrJxRvHycgAvb/Izr/MAOjjAObZ4tXh2f//////////////4+YA5+vV5ADW2ejr2dniALzJ
0wDV4tgAwcPMxq3//////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFsAAACB+vAAAIRbsFsAAACB+8AAAIALsFsAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR726AAAIZm4UCCENgAAAuwF8AAAIIxUPAAMzArheAAAIaJcBIxUPAANmAScjFQ8AA34BvdUA
AAhmbb3rAAAIZm4UCCENgAAAuwGmAAAIaJcDIxUPAAP3AJcCvRIBAAhmbWhsAr1BAQAIZm1obAK9
VQEACGZtaGwC0ePp4NgA7ePpAODd39kA1QDi2esA4tXh2az/yN3X2QDo4wDh2dnoAO3j6bgA/QGr
/83c1eDgAMMA5+vV5ADt4+kA1tno69nZ4v68ydMA1eLYAMHDzMas/87VrtjVqwDO1eDfAOjjAOHZ
ANXb1d3iANXi7f7o3eHZAOjjAOfr1eQA1tXX363/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd
2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AMLUzSABoAXoB
IlFAAXIyTOFxZXkkIEVDMEgtGAAgM0sA8FP4AQAoADFLAPBO+Cl+CQcJDygAL0sA8Ef4MLwBvABH
ELWCsC1LAZMAIACQIEkJaAp6ACMAICdMAPA3+AKwEL3wtRpPP2gNIC0COVwNQwE4Cij52hpMBiZk
IgDwE/gYTCRoBDRpJrYAUCIA8Av4EEwkaBRIJBgCJowiAPAD+PC8AbwARwE+DtThfIkHCdVhaKlC
BtEhABQxByABODtcC1T70aQY7udwRxhHIEfARgxQAAMIUAADeHADAjhuAwKEQgICEFAAA4AvAADh
xwUIYfAFCBnyBQhV2QkIxWgFCAdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBHCFAAAyQ2
AAAA/AMC`), {
        'BPRE 1.1': decodeBase64(`dAEBAcgDEfXHBQh18AUILfIFCGnZCQjZ`),
        'BPGE 1.0': decodeBase64(`XAEBR9QDASk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHIAxH1xwUIdfAFCC3yBQg92QkI2Q==`),
      }),
    },
  },
  {
    id: 'custom-pokerus',
    label: 'Pokérus for Your Party',
    description: 'Gives every Pokémon in your party Pokérus, which doubles the EVs they earn in battle.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`9gNxAA4AAAAUAMrJxRvMz83///////////////////////////////////////////+719zj46v/
////////////////////////////////////////////uwDo3eLtAOrd5unnAOjc1egA3Nng5Of/
/////////////////////8rJxRvHycgA2+bj6wDn6Obj4tvZ5q0A0N3n3ej////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFcgAACB+vAAAIRbsFcgAACB+8AAAIALsFcgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR718AAAIZm4UCCENgAAAuwFoAAAII6UOAAP7AL3bAAAIZm1obAK9BQEACGZtaGwCvR0BAAhm
bWhsAsrJxRvMz80A3ecA1QDo3eLtAOrd5unnAOjc1ej+3Nng5OcAysnFG8fJyADb5uPrAOfo5uPi
29nmrfvR1eLoAO3j6eYA5NXm6O0AysnFG8fJyP7o4wDX1ejX3ADd6Kz/u9fc4+OrANPj6eYA5NXm
6O0AysnFG8fJyP7X1enb3OgAysnFG8zPzav/zejV7QDc2dXg6NztAOPp6ADo3Nnm2av/ztzd5wDb
3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/ADC1CUwGJeB8
AyEIQAIoBdEgAAMhACISIwDwKfhkNAE98dEwvAG8AEfsRAICyQbKDohCANNAGpFCAdBJCPjncEcw
tQQATQAgaBgh//fv/xyhCFzoQAMhCEAMIUhDIDAgGDC8ArwIRwFoQGhIQHBH8LUHAAy0//fk/wQA
OAD/9/P/BQAMvJEIiQBkGAMhEUDJACZobkAyAMpAEgYSDv8giECGQxgAiEAGQ25AJmCbGgggAUCL
QLiLwBi4g/C8AbwAR+S02Jx4bOGx0pNyY8mNxodOSzktNiceGw==`)],
      ...romPayloads(decodeBase64(`9gNxAA4AAAAUAMrJxRvMz83///////////////////////////////////////////+719zj46v/
////////////////////////////////////////////uwDo3eLtAOrd5unnAOjc1egA3Nng5Of/
/////////////////////8rJxRvHycgA2+bj6wDn6Obj4tvZ5q0A0N3n3ej////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFcgAACB+vAAAIRbsFcgAACB+8AAAIALsFcgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR718AAAIZm4UCCENgAAAuwFoAAAIIxUPAAP7AL3bAAAIZm1obAK9BQEACGZtaGwCvR0BAAhm
bWhsAsrJxRvMz80A3ecA1QDo3eLtAOrd5unnAOjc1ej+3Nng5OcAysnFG8fJyADb5uPrAOfo5uPi
29nmrfvR1eLoAO3j6eYA5NXm6O0AysnFG8fJyP7o4wDX1ejX3ADd6Kz/u9fc4+OrANPj6eYA5NXm
6O0AysnFG8fJyP7X1enb3OgAysnFG8zPzav/zejV7QDc2dXg6NztAOPp6ADo3Nnm2av/ztzd5wDb
3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/ADC1CUwGJeB8
AyEIQAIoBdEgAAMhACISIwDwKfhkNAE98dEwvAG8AEeEQgICyQbKDohCANNAGpFCAdBJCPjncEcw
tQQATQAgaBgh//fv/xyhCFzoQAMhCEAMIUhDIDAgGDC8ArwIRwFoQGhIQHBH8LUHAAy0//fk/wQA
OAD/9/P/BQAMvJEIiQBkGAMhEUDJACZobkAyAMpAEgYSDv8giECGQxgAiEAGQ25AJmCbGgggAUCL
QLiLwBi4g/C8AbwAR+S02Jx4bOGx0pNyY8mNxodOSzktNiceGw==`), {
        'BPRE 1.1': decodeBase64(`dAEBAQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE=`),
      }),
    },
  },
  {
    id: 'custom-instant-hatch',
    label: 'Instant Egg Hatch',
    description: 'Hatches every Egg in your party on the spot. Each one plays the usual hatching scene and asks for a nickname.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`+AOcARAAAAAEAMPIzc67yM4Av8HBAMK7zr3C///////////////////////////////N393kAOjc
2QDr1eDf3eLbq///////////////////////////////vdXm5u3d4tsAv8HBzawA0N3n3egA6NzZ
/////////////////////9jZ4N3q2ebt4dXiAOPiAOjc2QCj4tgA2uDj4+b////////////////j
2gDVAMrJxRvHycgAvb/Izr/MAOjjANzV6Nfc////////////////6NzZ4QDV4OAA5t3b3OgA1evV
7av//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFsgAACB+vAAAIRbsFsgAACB+8AAAIALsFsgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADPwEhDYAAALsBngAACL28AAAIZm4UCCENgAAAuwGoAAAIaCOlDgADgAG4cQAACCOl
DgADMgEhDYAAALsBlAAACCXFACcoEAC5dgAACL3yAAAIZm1obAK9CgEACGZtaGwCvTgBAAhmbWhs
Ar1MAQAIZm1obALT4+kA3NXq2QC/wcHNAOvd6NwA7ePpq/7N3NXg4ADDANzV6NfcAOjc2eEA5t3b
3OgA4uPrrP/O1d/ZANvj49gA19Xm2QDj2gDo3Nnhq/+94+HZANbV198A69zZ4gDt4+kA3NXq2QDV
4v6/wcEA3eIA7ePp5gDk1ebo7av/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K0
6ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AABdIACEBOQGAFEgAIQYiw3xb
B1sPBisA0QExZDABOvbREEgBgHBHDksaiAEyEgQSDGQhUUMJSEAYBioK0sF8SQdJDwYpAtBkMAEy
9ecagAEgAOAAIANJCIBwR8BG7EQCAuB1AwLwdQMCB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iL
UPvRcEeMXQADMDcAAAD8AwI=`)],
      ...romPayloads(decodeBase64(`+AOcARAAAAAEAMPIzc67yM4Av8HBAMK7zr3C///////////////////////////////N393kAOjc
2QDr1eDf3eLbq///////////////////////////////vdXm5u3d4tsAv8HBzawA0N3n3egA6NzZ
/////////////////////9jZ4N3q2ebt4dXiAOPiAOjc2QCj4tgA2uDj4+b////////////////j
2gDVAMrJxRvHycgAvb/Izr/MAOjjANzV6Nfc////////////////6NzZ4QDV4OAA5t3b3OgA1evV
7av//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFsgAACB+vAAAIRbsFsgAACB+8AAAIALsFsgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADPwEhDYAAALsBngAACL28AAAIZm4UCCENgAAAuwGoAAAIaCMVDwADgAG4cQAACCMV
DwADMgEhDYAAALsBlAAACCXCACcoEAC5dgAACL3yAAAIZm1obAK9CgEACGZtaGwCvTgBAAhmbWhs
Ar1MAQAIZm1obALT4+kA3NXq2QC/wcHNAOvd6NwA7ePpq/7N3NXg4ADDANzV6NfcAOjc2eEA5t3b
3OgA4uPrrP/O1d/ZANvj49gA19Xm2QDj2gDo3Nnhq/+94+HZANbV198A69zZ4gDt4+kA3NXq2QDV
4v6/wcEA3eIA7ePp5gDk1ebo7av/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K0
6ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AABdIACEBOQGAFEgAIQYiw3xb
B1sPBisA0QExZDABOvbREEgBgHBHDksaiAEyEgQSDGQhUUMJSEAYBioK0sF8SQdJDwYpAtBkMAEy
9ecagAEgAOAAIANJCIBwR8BGhEICAsBwAwLQcAMCB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iL
UPvRcEcIUAADJDYAAAD8AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBAQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE=`),
      }),
    },
  },
  {
    id: 'custom-max-friendship',
    label: 'Max Friendship for Your Party',
    description: 'Raises the friendship of every Pokémon in your party to the maximum. Pokémon that evolve through friendship, such as Pichu, Golbat and Chansey, evolve at their next level up.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`+QOsABEAAAAQAMe70gDAzMO/yL7NwsPK///////////////////////////////////A5t3Z4tjn
ANrj5gDg3drZq///////////////////////////////x9Xf2QDZ6tnm7QDKycUbx8nIAN3iAO3j
6eb//////////////////+TV5ujtANXnANrm3dni2ODtANXnANfV4gDW2a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
G8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFcgAACB+vAAAIRbsFcgAACB+8AAAIALsFcgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR718AAAIZm4UCCENgAAAuwFoAAAII6UOAAPPAL26AAAIZm1obAK93QAACGZtaGwCvfEAAAhm
bWhsAsMA19XiAOHV39kA7ePp5gDk1ebo7QDKycUbx8nI/tXnANrm3dni2ODtANXnANfV4gDW2a37
zdzV4OAAw6z/ztzZ5tmrANPj6eYAysnFG8fJyADV2OPm2f7t4+kA4uPrrf+94+HZANbV198A1eLt
AOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV
4dmt/wAwtQlMBiXgfEAHQA8CKAXRIAAAIQki/yMA8Cn4ZDQBPfHRMLwBvABH7EQCAskGyg6IQgDT
QBqRQgHQSQj453BHMLUEAE0AIGgYIf/37/8coQhc6EADIQhADCFIQyAwIBgwvAK8CEcBaEBoSEBw
R/C1BwAMtP/35P8EADgA//fz/wUADLyRCIkAZBgDIRFAyQAmaG5AMgDKQBIGEg7/IIhAhkMYAIhA
BkNuQCZgmxoIIAFAi0C4i8AYuIPwvAG8AEfktNiceGzhsdKTcmPJjcaHTks5LTYnHhs=`)],
      ...romPayloads(decodeBase64(`+QOsABEAAAAQAMe70gDAzMO/yL7NwsPK///////////////////////////////////A5t3Z4tjn
ANrj5gDg3drZq///////////////////////////////x9Xf2QDZ6tnm7QDKycUbx8nIAN3iAO3j
6eb//////////////////+TV5ujtANXnANrm3dni2ODtANXnANfV4gDW2a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
G8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFcgAACB+vAAAIRbsFcgAACB+8AAAIALsFcgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR718AAAIZm4UCCENgAAAuwFoAAAIIxUPAAPPAL26AAAIZm1obAK93QAACGZtaGwCvfEAAAhm
bWhsAsMA19XiAOHV39kA7ePp5gDk1ebo7QDKycUbx8nI/tXnANrm3dni2ODtANXnANfV4gDW2a37
zdzV4OAAw6z/ztzZ5tmrANPj6eYAysnFG8fJyADV2OPm2f7t4+kA4uPrrf+94+HZANbV198A1eLt
AOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV
4dmt/wAwtQlMBiXgfEAHQA8CKAXRIAAAIQki/yMA8Cn4ZDQBPfHRMLwBvABHhEICAskGyg6IQgDT
QBqRQgHQSQj453BHMLUEAE0AIGgYIf/37/8coQhc6EADIQhADCFIQyAwIBgwvAK8CEcBaEBoSEBw
R/C1BwAMtP/35P8EADgA//fz/wUADLyRCIkAZBgDIRFAyQAmaG5AMgDKQBIGEg7/IIhAhkMYAIhA
BkNuQCZgmxoIIAFAi0C4i8AYuIPwvAG8AEfktNiceGzhsdKTcmPJjcaHTks5LTYnHhs=`), {
        'BPRE 1.1': decodeBase64(`dAEBAQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE=`),
      }),
    },
  },
  {
    id: 'custom-stat-judge',
    label: 'IV/EV Stat Judge',
    description: 'Choose a Pokémon from your party and the deliveryman tells you its nature, its six IVs (0 to 31) and its six EVs with their total (at most 510). It works on Eggs too.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`+wOyABMAAAAYAMPQur/QAM3Ou84AxM++wb/////////////////////////////////D0Oe4AL/Q
5wDV4tgA4tXo6ebZ////////////////////////////venm3ePp5wDV1uPp6ADt4+nmAMrJxRvH
ycis/////////////////87c2QDY2eDd6tnm7eHV4gDj4gDo3NkAo+LY///////////////////a
4OPj5gDj2gDVAMrJxRvHycgAvb/Izr/MANfV4v//////////////59zj6wDd6OcAw9DnuAC/0OcA
1eLYAOLV6Onm2a3//////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFdgAACB+vAAAIRbsFdgAACB+8AAAIALsFdgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72AAAAIZm0jpQ4AA0YCuFEAAAglogAnIQSABgC7BHQAAAgjpQ4AA20AZwDAAQJmbWhsAr2e
AAAIZm1obALR3N3X3ADKycUbx8nIAOfc4+ng2ADDAN7p2NvZrP/O3N3nANvd2ugA2OPZ5+K06ADr
4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf/wtYiwQkgAiGQhSEM/TCQYACUAJych
Bi0A0xQhSRkgAD1LAPBx+GkAakZQUgYtANM/GAE1DC3t0WpGF4MAIAeQOqU0TgAnKHgBNf0oEND/
KAbRB5kAKQPQDQAAJweX8ucwcAE2/yju0Qiw8LwBvABHKHgBNTAoINIQKBbSACgK0SAAAiEyACRL
APA++DB4/yjZ0AE2+ucgACBLAPA1+IAAH0kJWADwD/jN5xA4QADAGWlGCFoA8A/4xecwOAwnR0MH
lS+lv+cIeP8oA9AwcAExATb453BHMLUAJBKlKYgCNQEpC9AAIohCAtNAGgEy+ucUQ/PQoTIycAE2
7+ehMDBwATYwvAG8AEcYR8BG7EQCAuB1AwIAwAECGaUGCHHQBghQy2EI6ANkAAoAAQD9ALTnAOLV
6Onm2QDd5wD9Aa3+wtnm2QDV5tkA3ejnAMPQ57gA4+noAOPaAKSi8Pv9MPvD6OcAv9DnANXY2ADp
5ADo4wD9HADj2gCmoqHw+/0x/wDCygD9ELgAu87Ou73FAP0RuAC+v8C/yM2/AP0S/s3KrQC7zsUA
/RS4AM3KrQC+v8AA/RW4AM3Kv7++AP0T/whIAGgISUAYCEmaaBIaUhiaYPkikgAEOoNYi1D70XBH
wEaMXQADMDcAAAD8AwI=`)],
      ...romPayloads(decodeBase64(`+wOyABMAAAAYAMPQur/QAM3Ou84AxM++wb/////////////////////////////////D0Oe4AL/Q
5wDV4tgA4tXo6ebZ////////////////////////////venm3ePp5wDV1uPp6ADt4+nmAMrJxRvH
ycis/////////////////87c2QDY2eDd6tnm7eHV4gDj4gDo3NkAo+LY///////////////////a
4OPj5gDj2gDVAMrJxRvHycgAvb/Izr/MANfV4v//////////////59zj6wDd6OcAw9DnuAC/0OcA
1eLYAOLV6Onm2a3//////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFdgAACB+vAAAIRbsFdgAACB+8AAAIALsFdgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72AAAAIZm0jFQ8AA0YCuFEAAAglnwAnIQSABgC7BHQAAAgjFQ8AA20AZwDAAQJmbWhsAr2e
AAAIZm1obALR3N3X3ADKycUbx8nIAOfc4+ng2ADDAN7p2NvZrP/O3N3nANvd2ugA2OPZ5+K06ADr
4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf/wtYiwQkgAiGQhSEM/TCQYACUAJych
Bi0A0xQhSRkgAD1LAPBx+GkAakZQUgYtANM/GAE1DC3t0WpGF4MAIAeQOqU0TgAnKHgBNf0oEND/
KAbRB5kAKQPQDQAAJweX8ucwcAE2/yju0Qiw8LwBvABHKHgBNTAoINIQKBbSACgK0SAAAiEyACRL
APA++DB4/yjZ0AE2+ucgACBLAPA1+IAAH0kJWADwD/jN5xA4QADAGWlGCFoA8A/4xecwOAwnR0MH
lS+lv+cIeP8oA9AwcAExATb453BHMLUAJBKlKYgCNQEpC9AAIohCAtNAGgEy+ucUQ/PQoTIycAE2
7+ehMDBwATYwvAG8AEcYR8BGhEICAsBwAwIAwAEC6fsDCJ0uBAhgPkYI6ANkAAoAAQD9ALTnAOLV
6Onm2QDd5wD9Aa3+wtnm2QDV5tkA3ejnAMPQ57gA4+noAOPaAKSi8Pv9MPvD6OcAv9DnANXY2ADp
5ADo4wD9HADj2gCmoqHw+/0x/wDCygD9ELgAu87Ou73FAP0RuAC+v8C/yM2/AP0S/s3KrQC7zsUA
/RS4AM3KrQC+v8AA/RW4AM3Kv7++AP0T/whIAGgISUAYCEmaaBIaUhiaYPkikgAEOoNYi1D70XBH
wEYIUAADJDYAAAD8AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBATwDCf37AwixLgQIwA==`),
        'BPGE 1.0': decodeBase64(`XAEBR0QDAoA4`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE8Awr9+wMIsS4ECPA4`),
      }),
    },
  },
  {
    id: 'custom-no-encounters',
    label: 'No Wild Encounters',
    description: 'Stops wild Pokémon from appearing in grass, caves and water until the game is turned off or reset. Fishing, Rock Smash and Sweet Scent still find Pokémon. Talk to the deliveryman again to bring them back.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`/AMpABQAAAAcAMjJANHDxr4Av8i9yc/Izr/Mzf/////////////////////////////R3eDYAMrJ
xRvHyci4AOfo1e0A1evV7av/////////////////////0dXg3wDo3Obj6dvcANvm1efnANXi2ADX
1erZ5////////////////+vd6Nzj6egA693g2ADKycUbx8nIrQDQ3efd6P/////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFiQAACB+vAAAIRbsFiQAACB+8AAAIALsFiQAACB8AjAMCAbsBWwAACL2TAAAIZm4U
CCENgAAAuwF/AAAIEQEAjAMCvdcAAAhmbWhsAr0CAQAIZm4UCCENgAAAuwF/AAAIEQAAjAMCvTEB
AAhmbWhsAr1IAQAIZm1obAK9XAEACGZtaGwCwwDX1eIA39nZ5ADr3eDYAMrJxRvHycgA1evV7f7p
4ujd4ADt4+kA6Onm4gDj2toA7ePp5gDb1eHZrfvN3NXg4ADDrP++4+LZqwDO1eDfAOjjAOHZANXb
1d3iAOjj/tbm3eLbAOjc2eEA1tXX363/0d3g2ADKycUbx8nIANXm2QDn6NXt3eLbANXr1e2t/tHV
4ugA6NzZ4QDW1dffrP/R3eDYAMrJxRvHycgA1ebZANbV19+r/73j4dkA1tXX3wDV4u0A6N3h2av/
ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/`)],
      ...romPayloads(decodeBase64(`/AMpABQAAAAcAMjJANHDxr4Av8i9yc/Izr/Mzf/////////////////////////////R3eDYAMrJ
xRvHyci4AOfo1e0A1evV7av/////////////////////0dXg3wDo3Obj6dvcANvm1efnANXi2ADX
1erZ5////////////////+vd6Nzj6egA693g2ADKycUbx8nIrQDQ3efd6P/////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFiQAACB+vAAAIRbsFiQAACB+8AAAIALsFiQAACB/chgMCAbsBWwAACL2TAAAIZm4U
CCENgAAAuwF/AAAIEQHchgMCvdcAAAhmbWhsAr0CAQAIZm4UCCENgAAAuwF/AAAIEQDchgMCvTEB
AAhmbWhsAr1IAQAIZm1obAK9XAEACGZtaGwCwwDX1eIA39nZ5ADr3eDYAMrJxRvHycgA1evV7f7p
4ujd4ADt4+kA6Onm4gDj2toA7ePp5gDb1eHZrfvN3NXg4ADDrP++4+LZqwDO1eDfAOjjAOHZANXb
1d3iAOjj/tbm3eLbAOjc2eEA1tXX363/0d3g2ADKycUbx8nIANXm2QDn6NXt3eLbANXr1e2t/tHV
4ugA6NzZ4QDW1dffrP/R3eDYAMrJxRvHycgA1ebZANbV19+r/73j4dkA1tXX3wDV4u0A6N3h2av/
ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/`), {
        'BPRE 1.1': decodeBase64(`dAEBAQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE=`),
      }),
    },
  },
  {
    id: 'custom-nickname',
    label: 'Nickname Change & Removal',
    description: 'Choose a Pokémon from your party to give it a new nickname, or to take its nickname away so it goes by its species name again. Works on Pokémon from trades too.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`/QPJABUAAAAMAMjDvcXIu8e/AL3Cu8jBv/////////////////////////////////+7AOLZ6wDi
1eHZuADj5gDi4+LZANXoANXg4P//////////////////wd3q2QDVAMrJxRvHycgA1QDi2esA4t3X
3+LV4dn//////////////+PmAN3o5wDn5NnX3dnnAOLV4dkA1tXX360A0N3n3ej////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsF8wAACB+vAAAIRbsF8wAACB+8AAAIALsF8wAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR739AAAIZm0jpQ4AA0QCuFEAAAglogAnIQSABgC7BPEAAAgmDYBJASENgJwBuwHdAAAIfwAE
gL0cAQAIZm4UCCENgAEAuwHIAAAII6UOAANpASENgAAAuwHnAAAIvTQBAAhmbhQIIQ2AAAC7AecA
AAgjpQ4AA30BfwAEgL1jAQAIZm1obAJolwEloQAnfwAEgL14AQAIZm1obAK9jgEACGZtaGwCva4B
AAhmbWhsAmwCvcIBAAhmbWhsAtHc4+fZAOLd19/i1eHZAOfc1eDgAMMA19zV4tvZrP/B3erZAP0C
ANUA4tnrAOLd19/i1eHZrP/N3OPp4NgA/QIA2+MA1tXX3wDo4/7d6OcA5+TZ193Z5wDi1eHZAN3i
5+jZ1dis/77j4tmrAMPotOcA/QIA1dvV3eKt/8Dm4+EA4uPrAOPiuADd6LTnAP0Cq/+74gC/wcEA
2OPZ5+K06ADc1erZANUA4tXh2QDt2eir/73j4dkA1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj
2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/ELUA8Cb4IAACIR9KIDIf
SwDwMvgcSAEAIDECeAt4mkIF0QEwATH/KvfRACAA4AEgFEkIgBC8AbwARxC1APAJ+CAAAiEQShJL
APAW+BC8AbwARwC1CkgAiGQhSEMHTCQYIAALIQlLAPAH+AEABkgJSwDwAvgBvABHGEfARuxEAgLg
dQMC8HUDAgDAAQIZpQYIrawGCBW5BggHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9FwR4xd
AAMwNwAAAPwDAg==`)],
      ...romPayloads(decodeBase64(`/QPJABUAAAAMAMjDvcXIu8e/AL3Cu8jBv/////////////////////////////////+7AOLZ6wDi
1eHZuADj5gDi4+LZANXoANXg4P//////////////////wd3q2QDVAMrJxRvHycgA1QDi2esA4t3X
3+LV4dn//////////////+PmAN3o5wDn5NnX3dnnAOLV4dkA1tXX360A0N3n3ej////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF8wAACB+vAAAIRbsF8wAACB+8AAAIALsF8wAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR739AAAIZm0jFQ8AA0QCuFEAAAglnwAnIQSABgC7BPEAAAgmDYBHASENgJwBuwHdAAAIfwAE
gL0cAQAIZm4UCCENgAEAuwHIAAAIIxUPAANpASENgAAAuwHnAAAIvTQBAAhmbhQIIQ2AAAC7AecA
AAgjFQ8AA30BfwAEgL1jAQAIZm1obAJolwElngAnfwAEgL14AQAIZm1obAK9jgEACGZtaGwCva4B
AAhmbWhsAmwCvcIBAAhmbWhsAtHc4+fZAOLd19/i1eHZAOfc1eDgAMMA19zV4tvZrP/B3erZAP0C
ANUA4tnrAOLd19/i1eHZrP/N3OPp4NgA/QIA2+MA1tXX3wDo4/7d6OcA5+TZ193Z5wDi1eHZAN3i
5+jZ1dis/77j4tmrAMPotOcA/QIA1dvV3eKt/8Dm4+EA4uPrAOPiuADd6LTnAP0Cq/+74gC/wcEA
2OPZ5+K06ADc1erZANUA4tXh2QDt2eir/73j4dkA1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj
2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/ELUA8Cb4IAACIR9KIDIf
SwDwMvgcSAEAIDECeAt4mkIF0QEwATH/KvfRACAA4AEgFEkIgBC8AbwARxC1APAJ+CAAAiEQShJL
APAW+BC8AbwARwC1CkgAiGQhSEMHTCQYIAALIQlLAPAH+AEABkgJSwDwAvgBvABHGEfARoRCAgLA
cAMC0HADAgDAAQLp+wMIfQMECNEPBAgHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9FwRwhQ
AAMkNgAAAPwDAg==`), {
        'BPRE 1.1': decodeBase64(`dAEBAdQDCf37AwiRAwQI5Q==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHUAwn9+wMIkQMECOU=`),
      }),
    },
  },
  {
    id: 'custom-shiny-hunting',
    label: 'Shiny Hunting (Boosted Odds)',
    description: 'Wild Pokémon are shiny 1 in 1024 times instead of 1 in 8192. Keep meeting the same species and the odds climb with each one, reaching 1 in 64 at 31 in a row; a different species starts the chain over. A Pokémon made shiny keeps its nature, gender and ability. Talk to the deliveryman again to see your chain or turn it off. It lasts until the game is turned off or reset.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`/gOCABYAAAAAAM3Cw8jTAMLPyM7DyMH////////////////////////////////////N3N3i7QDK
ycUbx8nIuADh4+bZAOPa6Nni////////////////////x9nZ6ADn3N3i7QDKycUbx8nIAOHj5tkA
49ro2eK4/////////////+Hj5tkA5+jd4OAA3eIA1QDm4+utANDd593oAOjc2f/////////////Y
2eDd6tnm7eHV4gDj4gDo3NkAo+LYANrg4+Pm////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFyQAACB+vAAAIRbsFyQAACB+8AAAIALsFyQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL3TAAAIZm4UCCENgAAAuwG/AAAII6UOAANLAb3yAAAIZm1obAIjpQ4A
A34BgwEGgCEFgAAAuwGbAAAIhQBs/wMCgwIFgL0cAQAIZm29LQEACGZuFAghDYABALsBvwAACBEA
YP8DAr1QAQAIZm1obAK9ZgEACGZtaGwCvXoBAAhmbWhsAtHV4ugA59zd4u0AysnFG8fJyADh4+bZ
AOPa6NnirP++4+LZqwDN1eHZAMrJxRvHycgA3eIA1QDm4+u4/tbZ6OjZ5gDj2Njnq//9AgDd4gDV
AObj6/AA/QSr/83c3eLtAOPY2OfwAKIA3eIA/QOt/sXZ2eQA3Oni6N3i26z/zdzd4u0A3Oni6N3i
2wDd5wDj2tqt/73j4dkA1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc
/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/cLUXSx6IACAYgBZNHKQWSAQ4IVgpUPvRFExggAEg
IHD/IKB1EkgAaGBgEkigYBJIAWhLG5sKAtChYWkcAWAISx6AcL0JSEGIDEpRgB8pANIBMQExASDA
AgbfCEqQgHBHCAIABAD8AwKMAQAAYP8DAkRHAgJdXggIICcAA+B1AwLwtVNMIHgAKBvQU0+4i8AH
F9FQTS5oYGiwQhLQZmB4aKFoiEIC0AwwiEIK0UtIAGiBiQkEQIkIQ2loiEIB0QDwB/ijaQDwA/jw
vAG8AEcYRwC1ACAAJykYCXojGBp7GXNKQBdD/ykC0AEwCijz0WKIAC8A0AAiHyoA0gEyYoABMlIB
aGhwQAEMSEAABAAMCCgE05BCAtIA8AL4YGAAvZC1j7AwABkhAPBb+AyQaGgBDEhADZA3Bj8OACQN
mHhAYEAABDhDDpAZIQDwSvgMmYhCCNABNAgs8NH/NwE3OAzr0DAALOAOnzAAAPAr+AyQOAAA8Cf4
DZAAJAyY4EADIxhADCJQQyAwKBgNmeFAGUBRQ2lEAyIDaHNAe0ALYAQwBDEBOvfRAjQILObRaUYo
ACAwLCKLWINQBDr71S9gOAAPsJC9ALUYIQDwC/gKoQhcAL1g/wMCREcCAsAiAAOQXQADyQbKDohC
ANNAGpFCAdBJCPjncEfktNiceGzhsdKTcmPJjcaHTks5LTYnHhs=`)],
      ...romPayloads(decodeBase64(`/gOCABYAAAAAAM3Cw8jTAMLPyM7DyMH////////////////////////////////////N3N3i7QDK
ycUbx8nIuADh4+bZAOPa6Nni////////////////////x9nZ6ADn3N3i7QDKycUbx8nIAOHj5tkA
49ro2eK4/////////////+Hj5tkA5+jd4OAA3eIA1QDm4+utANDd593oAOjc2f/////////////Y
2eDd6tnm7eHV4gDj4gDo3NkAo+LYANrg4+Pm////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFyQAACB+vAAAIRbsFyQAACB+8AAAIALsFyQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL3TAAAIZm4UCCENgAAAuwG/AAAIIxUPAANLAb3yAAAIZm1obAIjFQ8A
A34BgwEGgCEFgAAAuwGbAAAIhQBs/wMCgwIFgL0cAQAIZm29LQEACGZuFAghDYABALsBvwAACBEA
YP8DAr1QAQAIZm1obAK9ZgEACGZtaGwCvXoBAAhmbWhsAtHV4ugA59zd4u0AysnFG8fJyADh4+bZ
AOPa6NnirP++4+LZqwDN1eHZAMrJxRvHycgA3eIA1QDm4+u4/tbZ6OjZ5gDj2Njnq//9AgDd4gDV
AObj6/AA/QSr/83c3eLtAOPY2OfwAKIA3eIA/QOt/sXZ2eQA3Oni6N3i26z/zdzd4u0A3Oni6N3i
2wDd5wDj2tqt/73j4dkA1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc
/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/cLUXSx6IACAYgBZNHKQWSAQ4IVgpUPvRFExggAEg
IHD/IKB1EkgAaGBgEkigYBJIAWhLG5sKAtChYWkcAWAISx6AcL0JSEGIDEpRgB8pANIBMQExASDA
AgbfCEqQgHBHCAIABAD8AwKMAQAAYP8DAixAAgK1ZQUIUDUAA8BwAwLwtVNMIHgAKBvQU0+4i8AH
F9FQTS5oYGiwQhLQZmB4aKFoiEIC0AwwiEIK0UtIAGiBiQkEQIkIQ2loiEIB0QDwB/ijaQDwA/jw
vAG8AEcYRwC1ACAAJykYCXojGBp7GXNKQBdD/ykC0AEwCijz0WKIAC8A0AAiHyoA0gEyYoABMlIB
aGhwQAEMSEAABAAMCCgE05BCAtIA8AL4YGAAvZC1j7AwABkhAPBb+AyQaGgBDEhADZA3Bj8OACQN
mHhAYEAABDhDDpAZIQDwSvgMmYhCCNABNAgs8NH/NwE3OAzr0DAALOAOnzAAAPAr+AyQOAAA8Cf4
DZAAJAyY4EADIxhADCJQQyAwKBgNmeFAGUBRQ2lEAyIDaHNAe0ALYAQwBDEBOvfRAjQILObRaUYo
ACAwLCKLWINQBDr71S9gOAAPsJC9ALUYIQDwC/gKoQhcAL1g/wMCLEACAvAwAAMMUAADyQbKDohC
ANNAGpFCAdBJCPjncEfktNiceGzhsdKTcmPJjcaHTks5LTYnHhs=`), {
        'BPRE 1.1': decodeBase64(`dAEBAXQDAck=`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQF0AwHJ`),
      }),
    },
  },
  {
    id: 'custom-nature-mint',
    label: 'Nature Mint (Change Nature)',
    description: 'Choose a Pokémon from your party, then the stat its new nature raises and the one it lowers (the same stat twice gives a neutral nature). It keeps its gender, ability and shininess, and its stats update right away.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`/wMrABcAAAAMAMi7zs/MvwDHw8jO//////////////////////////////////////+7ANrm2efc
AOLZ6wDi1ejp5tn/////////////////////////////yt3X3wDo3NkA5+jV6ADVAMrJxRvHyci0
5////////////////////+LV6Onm2QDm1d3n2ecA1eLYAOjc2QDj4tkA3ej////////////////g
4+vZ5uetANDd593oAOjc2QDY2eDd6tnm7eHV4v//////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFyQAACB+vAAAIRbsFyQAACB+8AAAIALsFyQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73TAAAIZm0jpQ4AA0ADuFEAAAglogAnIQSABgC7BMYAAAh/AASAvfEAAAhmI6UOAAMXASch
DYB/ALsBxgAACBkFgA2AvQ0BAAhmI6UOAAP5ACchDYB/ALsBxgAACCOlDgAD8AAhDYAAALsBvAAA
CL0oAQAIZm1obAK9NgEACGZtaGwCaGwCvU8BAAhmbWhsAtHc4+fZAOLV6Onm2QDn3OPp4NgAwwDX
3NXi29ms/9Hc3dfcAOfo1egA59zj6eDYAN3oAObV3efZrP+74tgA69zd19wA59zj6eDYAN3oAODj
69nmrP/9AgDd5wD9AwDi4+ur/87c1egA2N3Y4rToAOvj5t+4AOfj5ubtq//O3N3nANvd2ugA2OPZ
5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAAASSAQwBSEIIi7gMLUQ
SEWIBSFNQw9IAIgtGADw0fgEACF4KgAA8Gj4CkkIgAAoCtAgAAlLAPAI+AhJrQBJWQhICEsA8AH4
ML0YR8BGAL5cCOB1AwLwdQMCDY0GCFDLYQjEHQICoYsACPC1hbANABcAGU4AIwLIACIGxgEzq0L5
0RVOHCDAGwAhOgBrABRMAPAh+AcAACETTADwHPg4ACkAMgARTADwFvg4ACkAACIPTADwEPgAIA9M
APAM+AAgKQA6AAIjCkwA8AX4BEj/IQGABbDwvSBHwEaw+wMC8HUDAh0qDghVeBkIjZUZCHGVGQi9
Hw4IvZkZCPC1kLAFAA2RDJIuaDAMMQQJDEhADpAoAAshKksA8FD4ASQAJ8koAtEEJLcFvw85Ag2Y
AUMOmEhAAAQIQw+QGSEA8E74DJmIQgTQPxk4Cu7QACAs4A+fMAAA8Cv4DJA4AADwJ/gNkAAkDJjg
QAMjGEAMIlBDIDAoGA2Z4UAZQFFDaUQDIgNoc0B7QAtgBDAEMQE699ECNAgs5tFpRigAIDAsIotY
g1AEOvvVL2ABIBCw8L0AtRghAPAT+A6hCFwAvRhHwEYZpQYIA0gAiGQhSEMCSUAYcEfARuB1AwLs
RAICyQbKDohCANNAGpFCAdBJCPjncEfktNiceGzhsdKTcmPJjcaHTks5LTYnHhsHSABoB0lAGAdJ
mmgSGlIYmmD5IpIABDqDWItQ+9FwR4xdAAMwNwAAAPwDAg==`)],
      ...romPayloads(decodeBase64(`/wMrABcAAAAMAMi7zs/MvwDHw8jO//////////////////////////////////////+7ANrm2efc
AOLZ6wDi1ejp5tn/////////////////////////////yt3X3wDo3NkA5+jV6ADVAMrJxRvHyci0
5////////////////////+LV6Onm2QDm1d3n2ecA1eLYAOjc2QDj4tkA3ej////////////////g
4+vZ5uetANDd593oAOjc2QDY2eDd6tnm7eHV4v//////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFyQAACB+vAAAIRbsFyQAACB+8AAAIALsFyQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73TAAAIZm0jFQ8AA2gDuFEAAAglnwAnIQSABgC7BMYAAAh/AASAvfEAAAhmIxUPAAMXASch
DYB/ALsBxgAACBkFgA2AvQ0BAAhmIxUPAAP5ACchDYB/ALsBxgAACCMVDwAD8AAhDYAAALsBvAAA
CL0oAQAIZm1obAK9NgEACGZtaGwCaGwCvU8BAAhmbWhsAtHc4+fZAOLV6Onm2QDn3OPp4NgAwwDX
3NXi29ms/9Hc3dfcAOfo1egA59zj6eDYAN3oAObV3efZrP+74tgA69zd19wA59zj6eDYAN3oAODj
69nmrP/9AgDd5wD9AwDi4+ur/87c1egA2N3Y4rToAOvj5t+4AOfj5ubtq//O3N3nANvd2ugA2OPZ
5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAAASSAQwBSEIIi7gMLUQ
SEWIBSFNQw9IAIgtGADw5fgEACF4KgAA8Hz4CkkIgAAoCtAgAAlLAPAI+AhJrQBJWQhICEsA8AH4
ML0YR8BG0NU/CMBwAwLQcAMCfeQDCGA+RgjwHAIChY0ACPC1hbANABcAIU4AIwLIACIGxgEzq0L5
0R1OHCDAGwAhOgAjo2weG10bTADwL/gHAAAhGkwA8Cr4DiEAkQGVApYAIQORAiEEkTgACCICIxRM
APAc+A4hAJEBlQAhApE4AAIhACICIw9MAPAQ+AAgKQA6AAIjDEwA8An4ACALTADwBfgESP8hAYAF
sPC9IEfARrD7AwLQcAMCVdYJCFF3Dwjp+xAI2fcQCBnMCQilZw8IAgQGBwkLDQ7wtZCwBQANkQyS
LmgwDDEECQxIQA6QKAALISpLAPBQ+AEkACfJKALRBCS3Bb8POQINmAFDDphIQAAECEMPkBkhAPBO
+AyZiEIE0D8ZOAru0AAgLOAPnzAAAPAr+AyQOAAA8Cf4DZAAJAyY4EADIxhADCJQQyAwKBgNmeFA
GUBRQ2lEAyIDaHNAe0ALYAQwBDEBOvfRAjQILObRaUYoACAwLCKLWINQBDr71S9gASAQsPC9ALUY
IQDwE/gOoQhcAL0YR8BG6fsDCANIAIhkIUhDAklAGHBHwEbAcAMChEICAskGyg6IQgDTQBqRQgHQ
SQj453BH5LTYnHhs4bHSk3JjyY3Gh05LOS02Jx4bB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iL
UPvRcEcIUAADJDYAAAD8AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBASQDAkDWMAMFkeQDCMA8AwGZ2AMWadYJCMl3Dwhh/BAIUfgQCC3MCQgdaLwEAf0=`),
        'BPGE 1.0': decodeBase64(`XAEBRyQDAgzUNAMCgDjYAxUp1gkIKXcPCMH7EAix9xAI7csJCH0=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEkAwJ81DADBpHkAwjwODwDAZnYAxU91gkIoXcPCDn8EAgp+BAIAcwJCPW8BAH9`),
      }),
    },
  },
  {
    id: 'custom-ability-capsule',
    label: 'Ability Capsule (Swap Ability)',
    description: 'Switches a Pokémon from your party to the other ability its species can have, keeping its nature, gender and shininess. Species with only one ability can’t switch.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`AATpABgAAAAYALu8w8bDztMAvbvKzc/Gv//////////////////////////////////O5u0A3ejn
AOPo3NnmANXW3eDd6O3/////////////////////////zevd6NfcANUAysnFG8fJyADo4wDo3NkA
4+jc2eb//////////////9XW3eDd6O0A3ejnAOfk2dfd2ecA19XiANzV6tmt///////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFrAAACB+vAAAIRbsFrAAACB+8AAAIALsFrAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR722AAAIZm0jpQ4AA8gCuFEAAAglogAnIQSABgC7BKkAAAgmDYBJASENgJwBuwGfAAAIfwAE
gCOlDgAD4QAhDYAAALsBlQAACL30AAAIZm1obAK9DAEACGZtaGwCvdUAAAhmbWhsAmhsAr0lAQAI
Zm1obALR3OPn2QDV1t3g3ejtAOfc4+ng2ADDAOfr3ejX3Kz/u+IAv8HBANfV4rToAOfr3ejX3ADV
1t3g3ejd2eer//0CtOcA1dbd4N3o7QDd5wDi4+v+/QOr//0CANzV5wDj4uDtAOPi2f7V1t3g3ejt
rf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A
8LWBsADwtvgEAAshIUsA8D34HCFIQyFJRhgAIPF9ACkw0CV4ASdvQDJ8ACoL0P4qCdKVQoBBl0KJ
QYhCA9BvHmgIANNvHCBoGSEA8J/4AgA5ACAAAPAq+AAoE9ABIAdAAJcgAC4hakYLSwDwD/gWNvFd
DSBBQwpICRgKSApLAPAF+AEgAkkIgAGw8L0YR8BG8HUDAhmlBgitrAYIzAMyCNu2MQjEHQICoYsA
CPC1kLAFAA2RDJIuaDAMMQQJDEhADpAoAAshKksA8FD4ASQAJ8koAtEEJLcFvw85Ag2YAUMOmEhA
AAQIQw+QGSEA8E74DJmIQgTQPxk4Cu7QACAs4A+fMAAA8Cv4DJA4AADwJ/gNkAAkDJjgQAMjGEAM
IlBDIDAoGA2Z4UAZQFFDaUQDIgNoc0B7QAtgBDAEMQE699ECNAgs5tFpRigAIDAsIotYg1AEOvvV
L2ABIBCw8L0AtRghAPAT+A6hCFwAvRhHwEYZpQYIA0gAiGQhSEMCSUAYcEfARuB1AwLsRAICyQbK
DohCANNAGpFCAdBJCPjncEfktNiceGzhsdKTcmPJjcaHTks5LTYnHhsHSABoB0lAGAdJmmgSGlIY
mmD5IpIABDqDWItQ+9FwR4xdAAMwNwAAAPwDAg==`)],
      ...romPayloads(decodeBase64(`AATpABgAAAAYALu8w8bDztMAvbvKzc/Gv//////////////////////////////////O5u0A3ejn
AOPo3NnmANXW3eDd6O3/////////////////////////zevd6NfcANUAysnFG8fJyADo4wDo3NkA
4+jc2eb//////////////9XW3eDd6O0A3ejnAOfk2dfd2ecA19XiANzV6tmt///////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFrAAACB+vAAAIRbsFrAAACB+8AAAIALsFrAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR722AAAIZm0jFQ8AA8gCuFEAAAglnwAnIQSABgC7BKkAAAgmDYBHASENgJwBuwGfAAAIfwAE
gCMVDwAD4QAhDYAAALsBlQAACL30AAAIZm1obAK9DAEACGZtaGwCvdUAAAhmbWhsAmhsAr0lAQAI
Zm1obALR3OPn2QDV1t3g3ejtAOfc4+ng2ADDAOfr3ejX3Kz/u+IAv8HBANfV4rToAOfr3ejX3ADV
1t3g3ejd2eer//0CtOcA1dbd4N3o7QDd5wDi4+v+/QOr//0CANzV5wDj4uDtAOPi2f7V1t3g3ejt
rf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A
8LWBsADwtvgEAAshIUsA8D34HCFIQyFJRhgAIPF9ACkw0CV4ASdvQDJ8ACoL0P4qCdKVQoBBl0KJ
QYhCA9BvHmgIANNvHCBoGSEA8J/4AgA5ACAAAPAq+AAoE9ABIAdAAJcgAC4hakYLSwDwD/gWNvFd
DSBBQwpICRgKSApLAPAF+AEgAkkIgAGw8L0YR8BG0HADAun7Awh9AwQIhEclCED8JAjwHAIChY0A
CPC1kLAFAA2RDJIuaDAMMQQJDEhADpAoAAshKksA8FD4ASQAJ8koAtEEJLcFvw85Ag2YAUMOmEhA
AAQIQw+QGSEA8E74DJmIQgTQPxk4Cu7QACAs4A+fMAAA8Cv4DJA4AADwJ/gNkAAkDJjgQAMjGEAM
IlBDIDAoGA2Z4UAZQFFDaUQDIgNoc0B7QAtgBDAEMQE699ECNAgs5tFpRigAIDAsIotYg1AEOvvV
L2ABIBCw8L0AtRghAPAT+A6hCFwAvRhHwEbp+wMIA0gAiGQhSEMCSUAYcEfARsBwAwKEQgICyQbK
DohCANNAGpFCAdBJCPjncEfktNiceGzhsdKTcmPJjcaHTks5LTYnHhsHSABoB0lAGAdJmmgSGlIY
mmD5IpIABDqDWItQ+9FwRwhQAAMkNgAAAPwDAg==`), {
        'BPRE 1.1': decodeBase64(`dAEBAUADDf37AwiRAwQI9EclCLBUAwGZHAQB/Q==`),
        'BPGE 1.0': decodeBase64(`XAEBR0gDBWBHJQgc`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQFAAw39+wMIkQMECNBHJQiMVAMBmRwEAf0=`),
      }),
    },
  },
  {
    id: 'custom-pokemon-gender',
    label: 'Pokémon Gender Change',
    description: 'Switches a Pokémon from your party between male and female, handy for breeding. It keeps its nature, ability and shininess. Species that are always one gender, or have none, can’t switch.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`AQQgABkAAAAQAMrJxRvHycgAwb/Ivr/MAL3Cu8jBv//////////////////////////A4+YA6NzZ
AOTZ5trZ1+gA5NXd5v//////////////////////////zevd6NfcANUAysnFG8fJyADW2ejr2dni
AOHV4Nn//////////////9Xi2ADa2eHV4NmtANDd593oAOjc2f/////////////////////////Y
2eDd6tnm7eHV4gDj4gDo3NkAo+LYANrg4+Pm////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFwQAACB+vAAAIRbsFwQAACB+8AAAIALsFwQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73LAAAIZm0jpQ4AA7gCuFEAAAglogAnIQSABgC7BL4AAAgmDYBJASENgJwBuwG0AAAIfwAE
gCOlDgADFQEhDYAAALsBqgAACCENgAIAuwGgAAAIvRYBAAhmbWhsAr0mAQAIZm1obAK9OAEACGZt
aGwCve8AAAhmbWhsAmhsAr1XAQAIZm1obALR3N3X3ADKycUbx8nIAOfc4+ng2ADn693o19z+29ni
2NnmrP/G2ei05wDr1d3oANrj5gDo3NkAv8HBAOjj/tzV6NfcANrd5ufoq//9AgDd5wDi4+sA4dXg
2av//QIA3ecA4uPrANrZ4dXg2av//QK05wDb2eLY2eYA19XitOj+1tkA5+vd6Nfc2dit/87c3ecA
293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAAHC1APCV
+AQACyEVSwDwJPgcIUhDE0lAGAJ8ACYAKhjQ/ioW0iV4EQBpQAEgAUABJpVCAdMCOgImVRggaBkh
APCD+AIAKQAgAADwDvgAKADRACYCSQ6AcL0YR8BG8HUDAhmlBgjMAzII8LWQsAUADZEMki5oMAwx
BAkMSEAOkCgACyEqSwDwUPgBJAAnySgC0QQktwW/DzkCDZgBQw6YSEAABAhDD5AZIQDwTvgMmYhC
BNA/GTgK7tAAICzgD58wAADwK/gMkDgAAPAn+A2QACQMmOBAAyMYQAwiUEMgMCgYDZnhQBlAUUNp
RAMiA2hzQHtAC2AEMAQxATr30QI0CCzm0WlGKAAgMCwii1iDUAQ6+9UvYAEgELDwvQC1GCEA8BP4
DqEIXAC9GEfARhmlBggDSACIZCFIQwJJQBhwR8BG4HUDAuxEAgLJBsoOiEIA00AakUIB0EkI+Odw
R+S02Jx4bOGx0pNyY8mNxodOSzktNiceGwdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBH
jF0AAzA3AAAA/AMC`)],
      ...romPayloads(decodeBase64(`AQQgABkAAAAQAMrJxRvHycgAwb/Ivr/MAL3Cu8jBv//////////////////////////A4+YA6NzZ
AOTZ5trZ1+gA5NXd5v//////////////////////////zevd6NfcANUAysnFG8fJyADW2ejr2dni
AOHV4Nn//////////////9Xi2ADa2eHV4NmtANDd593oAOjc2f/////////////////////////Y
2eDd6tnm7eHV4gDj4gDo3NkAo+LYANrg4+Pm////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFwQAACB+vAAAIRbsFwQAACB+8AAAIALsFwQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73LAAAIZm0jFQ8AA7gCuFEAAAglnwAnIQSABgC7BL4AAAgmDYBHASENgJwBuwG0AAAIfwAE
gCMVDwADFQEhDYAAALsBqgAACCENgAIAuwGgAAAIvRYBAAhmbWhsAr0mAQAIZm1obAK9OAEACGZt
aGwCve8AAAhmbWhsAmhsAr1XAQAIZm1obALR3N3X3ADKycUbx8nIAOfc4+ng2ADn693o19z+29ni
2NnmrP/G2ei05wDr1d3oANrj5gDo3NkAv8HBAOjj/tzV6NfcANrd5ufoq//9AgDd5wDi4+sA4dXg
2av//QIA3ecA4uPrANrZ4dXg2av//QK05wDb2eLY2eYA19XitOj+1tkA5+vd6Nfc2dit/87c3ecA
293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAAHC1APCV
+AQACyEVSwDwJPgcIUhDE0lAGAJ8ACYAKhjQ/ioW0iV4EQBpQAEgAUABJpVCAdMCOgImVRggaBkh
APCD+AIAKQAgAADwDvgAKADRACYCSQ6AcL0YR8BG0HADAun7AwiERyUI8LWQsAUADZEMki5oMAwx
BAkMSEAOkCgACyEqSwDwUPgBJAAnySgC0QQktwW/DzkCDZgBQw6YSEAABAhDD5AZIQDwTvgMmYhC
BNA/GTgK7tAAICzgD58wAADwK/gMkDgAAPAn+A2QACQMmOBAAyMYQAwiUEMgMCgYDZnhQBlAUUNp
RAMiA2hzQHtAC2AEMAQxATr30QI0CCzm0WlGKAAgMCwii1iDUAQ6+9UvYAEgELDwvQC1GCEA8BP4
DqEIXAC9GEfARun7AwgDSACIZCFIQwJJQBhwR8BGwHADAoRCAgLJBsoOiEIA00AakUIB0EkI+Odw
R+S02Jx4bOGx0pNyY8mNxodOSzktNiceGwdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBH
CFAAAyQ2AAAA/AMC`), {
        'BPRE 1.1': decodeBase64(`dAEBAUADBf37Awj0DAQB/Q==`),
        'BPGE 1.0': decodeBase64(`XAEBR0QDAWA=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQFAAwX9+wMI0AwEAf0=`),
      }),
    },
  },
  {
    id: 'custom-hyper-training',
    label: 'Hyper Training (Max IVs)',
    description: 'Raises all six IVs of a Pokémon from your party to 31, the maximum, and updates its stats. In Gen 3 the IVs also decide Hidden Power, which becomes Dark-type at power 70.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`AgREABoAAAAUAMLTyr/MAM7Mu8PIw8jB//////////////////////////////////+/6tnm7QDD
0ADo4wCkov//////////////////////////////////zNXd59kA1eDgAOfd7ADD0OcA49oA1f//
/////////////////////8rJxRvHycgA6OMA6NzZAOHV7N3h6eG4AKSirf/////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFtQAACB+vAAAIRbsFtQAACB+8AAAIALsFtQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72/AAAIZm0jpQ4AA4gBuFEAAAglogAnIQSABgC7BLIAAAgmDYBJASENgJwBuwGoAAAIfwAE
gL31AAAIZm4UCCENgAAAuwGeAAAII6UOAAP1AL0gAQAIZm1obAK9OQEACGZtaGwCvd0AAAhmbWhs
AmhsAr1NAQAIZm1obALR3N3X3ADKycUbx8nIAOfc4+ng2ADDAOjm1d3irP+74gC/wcEA19XitOgA
6ObV3eIA7dnoq/+74OAA49oA/QK05wDD0OcA693g4P7W2QCkoq0AzdzV4OAAwwDn6NXm6Kz//QK0
5wDD0OcA1ebZANXg4ACkov7i4+ur/73j4dkA1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj2efi
tOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/ADC1gbAA8Bj4BAAfIACQJyUg
ACkAakYGSwDwCfgBNS0t9tEgAANLAPAC+AGwML0YR62sBggNjQYIA0gAiGQhSEMCSUAYcEfARuB1
AwLsRAICB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iLUPvRcEeMXQADMDcAAAD8AwI=`)],
      ...romPayloads(decodeBase64(`AgREABoAAAAUAMLTyr/MAM7Mu8PIw8jB//////////////////////////////////+/6tnm7QDD
0ADo4wCkov//////////////////////////////////zNXd59kA1eDgAOfd7ADD0OcA49oA1f//
/////////////////////8rJxRvHycgA6OMA6NzZAOHV7N3h6eG4AKSirf/////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFtQAACB+vAAAIRbsFtQAACB+8AAAIALsFtQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72/AAAIZm0jFQ8AA4gBuFEAAAglnwAnIQSABgC7BLIAAAgmDYBHASENgJwBuwGoAAAIfwAE
gL31AAAIZm4UCCENgAAAuwGeAAAIIxUPAAP1AL0gAQAIZm1obAK9OQEACGZtaGwCvd0AAAhmbWhs
AmhsAr1NAQAIZm1obALR3N3X3ADKycUbx8nIAOfc4+ng2ADDAOjm1d3irP+74gC/wcEA19XitOgA
6ObV3eIA7dnoq/+74OAA49oA/QK05wDD0OcA693g4P7W2QCkoq0AzdzV4OAAwwDn6NXm6Kz//QK0
5wDD0OcA1ebZANXg4ACkov7i4+ur/73j4dkA1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj2efi
tOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/ADC1gbAA8Bj4BAAfIACQJyUg
ACkAakYGSwDwCfgBNS0t9tEgAANLAPAC+AGwML0YR30DBAh95AMIA0gAiGQhSEMCSUAYcEfARsBw
AwKEQgICB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iLUPvRcEcIUAADJDYAAAD8AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBAQQDBZEDBAiR`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEEAwWRAwQIkQ==`),
      }),
    },
  },
  {
    id: 'custom-pp-max',
    label: 'Max PP for All Moves',
    description: 'Gives every move of every Pokémon in your party the most PP it can have, as if it had three PP Ups, and fills it up.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`AwQkABsAAAAcAMrKAMe70v/////////////////////////////////////////////H4+rZ5wDV
6ADa6eDgAOTj69nm////////////////////////////v+rZ5u0A4ePq2QDd4gDt4+nmAOTV5ujt
ANvZ6Of//////////////+jc2QDh4+foAMrKAN3oANfV4gDc1erZrQDQ3efd6P/////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFcgAACB+vAAAIRbsFcgAACB+8AAAIALsFcgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR718AAAIZm4UCCENgAAAuwFoAAAII6UOAAPbAL25AAAIZm1obAK95wAACGZtaGwCvfsAAAhm
bWhsAs3c1eDgAMMA5tXd59kA6NzZAMrKAOPaANnq2ebt/uHj6tkA3eIA7ePp5gDk1ebo7QDo4wDo
3NkA4dXsrP++4+LZqwC/6tnm7QDh4+rZANzV5wDo3NkA4ePn6P7KygDd6ADX1eIA3NXq2a3/vePh
2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePi
AOPaAOjc2QDb1eHZrf8AAAAwtYGw/yAAkAtMBiXgfEAHQA8CKAnRIAAVIWpGB0sA8An4IAAGSwDw
BfhkNAE97dEBsDC9GEfARuxEAgKtrAYIJekGCA==`)],
      ...romPayloads(decodeBase64(`AwQkABsAAAAcAMrKAMe70v/////////////////////////////////////////////H4+rZ5wDV
6ADa6eDgAOTj69nm////////////////////////////v+rZ5u0A4ePq2QDd4gDt4+nmAOTV5ujt
ANvZ6Of//////////////+jc2QDh4+foAMrKAN3oANfV4gDc1erZrQDQ3efd6P/////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFcgAACB+vAAAIRbsFcgAACB+8AAAIALsFcgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR718AAAIZm4UCCENgAAAuwFoAAAIIxUPAAPbAL25AAAIZm1obAK95wAACGZtaGwCvfsAAAhm
bWhsAs3c1eDgAMMA5tXd59kA6NzZAMrKAOPaANnq2ebt/uHj6tkA3eIA7ePp5gDk1ebo7QDo4wDo
3NkA4dXsrP++4+LZqwC/6tnm7QDh4+rZANzV5wDo3NkA4ePn6P7KygDd6ADX1eIA3NXq2a3/vePh
2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePi
AOPaAOjc2QDb1eHZrf8AAAAwtYGw/yAAkAtMBiXgfEAHQA8CKAnRIAAVIWpGB0sA8An4IAAGSwDw
BfhkNAE97dEBsDC9GEfARoRCAgJ9AwQI2UIECA==`), {
        'BPRE 1.1': decodeBase64(`dAEBAcACBZEDBAjt`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHAAgWRAwQI7Q==`),
      }),
    },
  },
  {
    id: 'custom-beauty',
    label: 'Max Beauty for Milotic',
    description: 'Raises a Pokémon’s Beauty to the maximum. A Feebas this beautiful evolves into Milotic at its next level up, even in FireRed and LeafGreen, which have no way to raise Beauty.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`BARIARwAAAAEALy/u8/O0wDAycwAx8PGyc7Dvf/////////////////////////////Av7+8u824
ANnq4+Dq2av/////////////////////////////////x9Xf2QDVAMrJxRvHycgA1ecA1tnV6ejd
2ung/////////////////9XnANfV4gDW2bgA1eLYAMC/v7y7zQDZ6uPg6tnn///////////////V
6ADd6OcA4tns6ADg2erZ4K0A0N3n3egA6NzZ////////////////2Nng3erZ5u3h1eIA4+IAo8Ct
/////////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFlwAACB+vAAAIRbsFlwAACB+8AAAIALsFlwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72hAAAIZm0jpQ4AA1QBuFEAAAglogAnIQSABgC7BJQAAAgmDYBJASENgJwBuwGKAAAIfwAE
gCOlDgAD7QC95gAACGZtaGwCvcgAAAhmbWhsAmhsAr0wAQAIZm1obALR3N3X3ADKycUbx8nIAOfc
4+ng2ADDAOHV39n+1tnV6ejd2ungrP+74gC/wcEA3ecA1tnV6ejd2ungANXnAN3oAN3nq//9AgDg
4+Pf5wDn6Oni4t3i26v7uwDAv7+8u80A6Nzd5wDW2dXp6N3a6eAA693g4P7Z6uPg6tkA1egA3ejn
AOLZ7OgA4Nnq2eCt/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA
6NzZANvV4dmt/wAAALWBsADwDPj/IQCRFyFqRgJLAPAC+AGwAL0YR62sBggDSACIZCFIQwJJQBhw
R8BG4HUDAuxEAgIHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9FwR4xdAAMwNwAAAPwDAg==`)],
      ...romPayloads(decodeBase64(`BARIARwAAAAEALy/u8/O0wDAycwAx8PGyc7Dvf/////////////////////////////Av7+8u824
ANnq4+Dq2av/////////////////////////////////x9Xf2QDVAMrJxRvHycgA1ecA1tnV6ejd
2ung/////////////////9XnANfV4gDW2bgA1eLYAMC/v7y7zQDZ6uPg6tnn///////////////V
6ADd6OcA4tns6ADg2erZ4K0A0N3n3egA6NzZ////////////////2Nng3erZ5u3h1eIA4+IAo8Ct
/////////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFlwAACB+vAAAIRbsFlwAACB+8AAAIALsFlwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72hAAAIZm0jFQ8AA1QBuFEAAAglnwAnIQSABgC7BJQAAAgmDYBHASENgJwBuwGKAAAIfwAE
gCMVDwAD7QC95gAACGZtaGwCvcgAAAhmbWhsAmhsAr0wAQAIZm1obALR3N3X3ADKycUbx8nIAOfc
4+ng2ADDAOHV39n+1tnV6ejd2ungrP+74gC/wcEA3ecA1tnV6ejd2ungANXnAN3oAN3nq//9AgDg
4+Pf5wDn6Oni4t3i26v7uwDAv7+8u80A6Nzd5wDW2dXp6N3a6eAA693g4P7Z6uPg6tkA1egA3ejn
AOLZ7OgA4Nnq2eCt/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA
6NzZANvV4dmt/wAAALWBsADwDPj/IQCRFyFqRgJLAPAC+AGwAL0YR30DBAgDSACIZCFIQwJJQBhw
R8BGwHADAoRCAgIHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9FwRwhQAAMkNgAAAPwDAg==`), {
        'BPRE 1.1': decodeBase64(`dAEBAdQCAZE=`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHUAgGR`),
      }),
    },
  },
  {
    id: 'custom-hidden-power',
    label: 'Hidden Power Checker',
    description: 'Choose a Pokémon from your party and the deliveryman tells you the type and power of its Hidden Power.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`BQTJAB0AAAAIAMLDvr6/yADKydG/zAC9wr+9xf/////////////////////////////R3NXoAOjt
5NkA3ecA3eis////////////////////////////////wN3i2ADj6egA6NzZAOjt5NkA1eLYAOTj
69nm/////////////////+PaANUAysnFG8fJyLTnAMLDvr6/yADKydG/zK3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFmwAACB+vAAAIRbsFmwAACB+8AAAIALsFmwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72lAAAIZm0jpQ4AA4wBuFEAAAglogAnIQSABgC7BJgAAAgmDYBJASENgJwBuwGOAAAIfwAE
gCOlDgADzQCDAgWAvecAAAhmbWhsAr3IAAAIZm1obAJobAK9DwEACGZtaGwC0dzj59kAwsO+vr/I
AMrJ0b/MAOfc4+ng2ADD/tfc2dffrP+74gC/wcEA39nZ5OcA3ejnAOTj69nmANzd2NjZ4qv//QK0
5wDCw76+v8gAysnRv8wA3ef+/QOu6O3k2bgA5OPr2eYA/QSt/87c3ecA293a6ADY49nn4rToAOvj
5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAAPC1APA5+AQAACUAJgAnIAAnIckZ
FEsA8CP4QQgBIhBAEUC4QLlABUMOQwE3Bi/u0SggcEM/IQbfHjAKSUiADyBoQz8hBt8BMAkoANMB
MAchQUMGSAkYBkgGSwDwAfjwvRhHwEbgdQMCGaUGCDiuMQjEHQICoYsACANIAIhkIUhDAklAGHBH
wEbgdQMC7EQCAgdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBHjF0AAzA3AAAA/AMC`)],
      ...romPayloads(decodeBase64(`BQTJAB0AAAAIAMLDvr6/yADKydG/zAC9wr+9xf/////////////////////////////R3NXoAOjt
5NkA3ecA3eis////////////////////////////////wN3i2ADj6egA6NzZAOjt5NkA1eLYAOTj
69nm/////////////////+PaANUAysnFG8fJyLTnAMLDvr6/yADKydG/zK3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmwAACB+vAAAIRbsFmwAACB+8AAAIALsFmwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72lAAAIZm0jFQ8AA4wBuFEAAAglnwAnIQSABgC7BJgAAAgmDYBHASENgJwBuwGOAAAIfwAE
gCMVDwADzQCDAgWAvecAAAhmbWhsAr3IAAAIZm1obAJobAK9DwEACGZtaGwC0dzj59kAwsO+vr/I
AMrJ0b/MAOfc4+ng2ADD/tfc2dffrP+74gC/wcEA39nZ5OcA3ejnAOTj69nmANzd2NjZ4qv//QK0
5wDCw76+v8gAysnRv8wA3ef+/QOu6O3k2bgA5OPr2eYA/QSt/87c3ecA293a6ADY49nn4rToAOvj
5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAAPC1APA5+AQAACUAJgAnIAAnIckZ
FEsA8CP4QQgBIhBAEUC4QLlABUMOQwE3Bi/u0SggcEM/IQbfHjAKSUiADyBoQz8hBt8BMAkoANMB
MAchQUMGSAkYBkgGSwDwAfjwvRhHwEbAcAMC6fsDCKDxJAjwHAIChY0ACANIAIhkIUhDAklAGHBH
wEbAcAMChEICAgdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBHCFAAAyQ2AAAA/AMC`), {
        'BPRE 1.1': decodeBase64(`dAEBAQADBv37AwgQ8gwDAZk=`),
        'BPGE 1.0': decodeBase64(`XAEBRwQDAXw=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEAAwX9+wMI7AwDAZk=`),
      }),
    },
  },
  {
    id: 'custom-ev-training',
    label: 'EV Reset & Training',
    description: 'Choose a Pokémon from your party, reset its EVs to 0 if you like, then pick the stats to max out, 252 each and 510 in total. Its stats update when you’re done.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`BgRqAB4AAAAAAL/QAM7Mu8PIw8jB///////////////////////////////////////O5tXd4gDr
3ejc4+noANbV6Ojg3eLb////////////////////////zNnn2egA1QDKycUbx8nItOcAv9DnAOPm
AOHV7P///////////////+jc2QDn6NXo5wDt4+kA19zj4+fZrQDQ3efd6P/////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsF4gAACB+vAAAIRbsF4gAACB+8AAAIALsF4gAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73sAAAIZm0jpQ4AAwQDuFEAAAglogAnIQSABgC7BN8AAAgmDYBJASENgJwBuwHVAAAIfwAE
gL0iAQAIZm4UCCENgAAAuwGUAAAII6UOAANFAb1EAQAIZiOlDgADXgEnIQ2AfwC7AcQAAAgjpQ4A
A1MBgwIFgL12AQAIZm25lAAACCOlDgADrAG9ggEACGZtaGwCvQoBAAhmbWhsAmhsAr2bAQAIZm1o
bALR3N3X3ADKycUbx8nIAOfc4+ng2ADDAOjm1d3irP+74gC/wcEA19XitOgA6ObV3eIA7dnoq//M
2efZ6ADV4OAA49oA/QK05/6/0OcA6OMAoQDa3ebn6Kz/0dzd19wAv9DnAOfc4+ng2ADDAOHV7Kz+
yubZ5+cAvADr3NniAO3j6bTm2QDY4+LZrf/9AwC/0OfwAP0Erf+74OAA2OPi2asAwePj2ADg6dff
uP79Aqv/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh
2a3/AAAAMLWBsADwrvgEAAAgAJAaJSAAKQBqRipLAPBI+AE1IC320QGwML0kSAYhCCJS4PC1gbAA
8Jf4BAAeSAeIACUAJr5CBtAgABohiRkcSwDwLvgtGAE2Bi7z0R1OdhsA1QAm/C4A2fwmIAAaIckZ
E0sA8B34hkIA0gYAAJYgABohyRlqRg9LAPAS+AlIRoC/AApJyVkNSA1LAPAJ+AGw8L0AtQDwYPgH
SwDwAfgAvRhHwEbgdQMC8HUDAgC+XAgZpQYIrawGCA2NBgjEHQICoYsACP4BAADwtYWwDQAXABlO
ACMCyAAiBsYBM6tC+dEVThwgwBsAIToAawAUTADwIfgHAAAhE0wA8Bz4OAApADIAEUwA8Bb4OAAp
AAAiD0wA8BD4ACAPTADwDPgAICkAOgACIwpMAPAF+ARI/yEBgAWw8L0gR8BGsPsDAvB1AwIdKg4I
VXgZCI2VGQhxlRkIvR8OCL2ZGQgDSACIZCFIQwJJQBhwR8BG4HUDAuxEAgIHSABoB0lAGAdJmmgS
GlIYmmD5IpIABDqDWItQ+9FwR4xdAAMwNwAAAPwDAg==`)],
      ...romPayloads(decodeBase64(`BgRqAB4AAAAAAL/QAM7Mu8PIw8jB///////////////////////////////////////O5tXd4gDr
3ejc4+noANbV6Ojg3eLb////////////////////////zNnn2egA1QDKycUbx8nItOcAv9DnAOPm
AOHV7P///////////////+jc2QDn6NXo5wDt4+kA19zj4+fZrQDQ3efd6P/////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF4gAACB+vAAAIRbsF4gAACB+8AAAIALsF4gAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73sAAAIZm0jFQ8AAywDuFEAAAglnwAnIQSABgC7BN8AAAgmDYBHASENgJwBuwHVAAAIfwAE
gL0iAQAIZm4UCCENgAAAuwGUAAAIIxUPAANFAb1EAQAIZiMVDwADXgEnIQ2AfwC7AcQAAAgjFQ8A
A1MBgwIFgL12AQAIZm25lAAACCMVDwADrAG9ggEACGZtaGwCvQoBAAhmbWhsAmhsAr2bAQAIZm1o
bALR3N3X3ADKycUbx8nIAOfc4+ng2ADDAOjm1d3irP+74gC/wcEA19XitOgA6ObV3eIA7dnoq//M
2efZ6ADV4OAA49oA/QK05/6/0OcA6OMAoQDa3ebn6Kz/0dzd19wAv9DnAOfc4+ng2ADDAOHV7Kz+
yubZ5+cAvADr3NniAO3j6bTm2QDY4+LZrf/9AwC/0OfwAP0Erf+74OAA2OPi2asAwePj2ADg6dff
uP79Aqv/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh
2a3/AAAAMLWBsADwwvgEAAAgAJAaJSAAKQBqRipLAPBI+AE1IC320QGwML0kSAYhCCJS4PC1gbAA
8Kv4BAAeSAeIACUAJr5CBtAgABohiRkcSwDwLvgtGAE2Bi7z0R1OdhsA1QAm/C4A2fwmIAAaIckZ
E0sA8B34hkIA0gYAAJYgABohyRlqRg9LAPAS+AlIRoC/AApJyVkNSA1LAPAJ+AGw8L0AtQDwdPgH
SwDwAfgAvRhHwEbAcAMC0HADAtDVPwjp+wMIfQMECH3kAwjwHAIChY0ACP4BAADwtYWwDQAXACFO
ACMCyAAiBsYBM6tC+dEdThwgwBsAIToAI6NsHhtdG0wA8C/4BwAAIRpMAPAq+A4hAJEBlQKWACED
kQIhBJE4AAgiAiMUTADwHPgOIQCRAZUAIQKROAACIQAiAiMPTADwEPgAICkAOgACIwxMAPAJ+AAg
C0wA8AX4BEj/IQGABbDwvSBHwEaw+wMC0HADAlXWCQhRdw8I6fsQCNn3EAgZzAkIpWcPCAIEBgcJ
Cw0OA0gAiGQhSEMCSUAYcEfARsBwAwKEQgICB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iLUPvR
cEcIUAADJDYAAAD8AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBAdwDDUDWPwj9+wMIkQMECJHwAwGZkAQWadYJCMl3Dwhh/BAIUfgQCC3MCQgdaA==`),
        'BPGE 1.0': decodeBase64(`XAEBR9wDAgzUkAQVKdYJCCl3DwjB+xAIsfcQCO3LCQh9`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHcAw181D8I/fsDCJEDBAiR8AMBmZAEFT3WCQihdw8IOfwQCCn4EAgBzAkI9Q==`),
      }),
    },
  },
  {
    id: 'custom-trainer-ids',
    label: 'Trainer & Secret ID Reveal',
    description: 'Shows your Trainer ID and the Secret ID the game never shows you. Together they decide which Pokémon you meet are shiny.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`BwQ/AB8AAAAYAM7Mu8PIv8wAw74AzL/Qv7vG//////////////////////////////+84+jcAOPa
AO3j6eYAw77n////////////////////////////////xtnV5uIA7ePp5gDOzLvDyL/MAMO+ANXi
2ADo3Nn//////////////82/vcy/zgDDvgDo3NkA29Xh2QDc3djZ563////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADtwC9XgAACGZtaGwCvcUAAAhmbWhsAtPj6eYAzsy7w8i/zADDvgDd5wD9Av7V4tgA
7ePp5gDNv73Mv84Aw74A3ecA/QOt+87j29no3NnmAOjc2e0A2NnX3djZAOvc3dfc/srJxRvHycgA
7ePpAOHZ2egA1ebZAOfc3eLtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn
3ePiAOPaAOjc2QDb1eHZrf8AMLUITCRoCk1hiQdIAiIFIwDwB/ihiQVIAiIFIwDwAfgwvShHkF0A
A8QcAgLEHQICwYwACA==`)],
      ...romPayloads(decodeBase64(`BwQ/AB8AAAAYAM7Mu8PIv8wAw74AzL/Qv7vG//////////////////////////////+84+jcAOPa
AO3j6eYAw77n////////////////////////////////xtnV5uIA7ePp5gDOzLvDyL/MAMO+ANXi
2ADo3Nn//////////////82/vcy/zgDDvgDo3NkA29Xh2QDc3djZ563////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADtwC9XgAACGZtaGwCvcUAAAhmbWhsAtPj6eYAzsy7w8i/zADDvgDd5wD9Av7V4tgA
7ePp5gDNv73Mv84Aw74A3ecA/QOt+87j29no3NnmAOjc2e0A2NnX3djZAOvc3dfc/srJxRvHycgA
7ePpAOHZ2egA1ebZAOfc3eLtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn
3ePiAOPaAOjc2QDb1eHZrf8AMLUITCRoCk1hiQdIAiIFIwDwB/ihiQVIAiIFIwDwAfgwvShHDFAA
A9AcAgLwHAICeY4ACA==`), {
        'BPRE 1.1': decodeBase64(`dAEBAXwCAY0=`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQF8AgGN`),
      }),
    },
  },
  {
    id: 'custom-national-dex',
    label: 'National Pokédex Unlock',
    description: 'Upgrades your Pokédex to the National Pokédex right away, instead of after beating the Elite Four and catching 60 Kanto Pokémon (FireRed and LeafGreen) or entering the Hall of Fame (Emerald). In FireRed and LeafGreen it also lets Kanto Pokémon evolve into later species, and Celio needs it before he sends you on the errand that earns the Rainbow Pass, which the Aurora and Mystic Tickets need. You need a Pokédex first.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`CASJACAAAAAIAMi7zsPJyLvGAMrJxRu+v9L///////////////////////////////+/6tnm7QDK
ycUbx8nIuADm3dvc6ADV69Xt////////////////////z+Tb5tXY2QDt4+nmAMrJxRu+v9IA6OMA
6NzZ/////////////////8i7zsPJyLvGAMrJxRu+v9IA4uPrrQDQ3efd6P/////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFfAAACB+vAAAIRbsFfAAACB+8AAAIALsFfAAACCthCLsAXgAACCuWCLsBaAAACL2G
AAAIZm4UCCENgAAAuwFyAAAIJfMBvbwAAAhmbWhsAr3sAAAIZm1obAK9CgEACGZtaGwCvTgBAAhm
bWhsAr1MAQAIZm1obALN3NXg4ADDAOnk2+bV2NkA7ePp5gDKycUbvr/S/ujjAOjc2QDIu87Dyci7
xgDKycUbvr/SrP++4+LZqwDT4+nmAMrJxRu+v9IA3ecA4uPrAOjc2f7Iu87Dyci7xgDKycUbvr/S
rf/T4+kA2OPitOgA3NXq2QDVAMrJxRu+v9IA7dnoq//T4+nmAMrJxRu+v9IA3ecA1eDm2dXY7QDo
3Nn+yLvOw8nIu8YAysnFG76/0qv/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K0
6ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8=`)],
      ...romPayloads(decodeBase64(`CASJACAAAAAIAMi7zsPJyLvGAMrJxRu+v9L///////////////////////////////+/6tnm7QDK
ycUbx8nIuADm3dvc6ADV69Xt////////////////////z+Tb5tXY2QDt4+nmAMrJxRu+v9IA6OMA
6NzZ/////////////////8i7zsPJyLvGAMrJxRu+v9IA4uPrrQDQ3efd6P/////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFfAAACB+vAAAIRbsFfAAACB+8AAAIALsFfAAACCspCLsAXgAACCtACLsBaAAACL2G
AAAIZm4UCCENgAAAuwFyAAAIJW8BvbwAAAhmbWhsAr3sAAAIZm1obAK9CgEACGZtaGwCvTgBAAhm
bWhsAr1MAQAIZm1obALN3NXg4ADDAOnk2+bV2NkA7ePp5gDKycUbvr/S/ujjAOjc2QDIu87Dyci7
xgDKycUbvr/SrP++4+LZqwDT4+nmAMrJxRu+v9IA3ecA4uPrAOjc2f7Iu87Dyci7xgDKycUbvr/S
rf/T4+kA2OPitOgA3NXq2QDVAMrJxRu+v9IA7dnoq//T4+nmAMrJxRu+v9IA3ecA1eDm2dXY7QDo
3Nn+yLvOw8nIu8YAysnFG76/0qv/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K0
6ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8=`), {
        'BPRE 1.1': decodeBase64(`dAEBAQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE=`),
      }),
    },
  },
  {
    id: 'custom-rare-berries',
    label: 'Rare Event Berries',
    description: 'Gives an Enigma, a Lansat and a Starf Berry, which Gen 3 only ever handed out at events. One set per card; receive the card again for another. Without the e-Reader’s berry data the Enigma Berry has no effect in battle, but Emerald can grow more of it.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`CQQgASEAAAAUAMy7zL8AvL/MzMO/zf////////////////////////////////////+/yMPBx7u4
AMa7yM27zgDV4tgAzc67zMD/////////////////////ztzm2dkAvL/MzMO/zQDo3NXoAOvZ5tkA
4+Lg7f///////////////9nq2eYA293q2eIA4+noANXoANnq2eLo563////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFlAAACB+vAAAIRbsFlAAACB+8AAAIALsFlAAACCvkAbsBgAAACEavAAEAIQ2AAAC7
AYoAAAhGrQABACENgAAAuwGKAAAIRq4AAQAhDYAAALsBigAACESvAAEARK0AAQBErgABACnkAb2e
AAAIZm1obAK90gAACGZtaGwCvfwAAAhmbWhsAr0iAQAIZm1obALC2ebZAO3j6QDb4/AA1eIAv8jD
wce7uADV/sa7yM27zgDV4tgA1QDNzrvMwAC8v8zM06v/zNnX2d3q2QDo3N3nANfV5tgA1dvV3eIA
2uPm/uHj5tkAvL/MzMO/zav/ztzZ5tm05wDi4wDm4+PhANrj5gDo3NnhAN3i/u3j6eYAvLvBq//O
3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8=`)],
      ...romPayloads(decodeBase64(`CQQgASEAAAAUAMy7zL8AvL/MzMO/zf////////////////////////////////////+/yMPBx7u4
AMa7yM27zgDV4tgAzc67zMD/////////////////////ztzm2dkAvL/MzMO/zQDo3NXoAOvZ5tkA
4+Lg7f///////////////9nq2eYA293q2eIA4+noANXoANnq2eLo563////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFlAAACB+vAAAIRbsFlAAACB+8AAAIALsFlAAACCvYA7sBgAAACEavAAEAIQ2AAAC7
AYoAAAhGrQABACENgAAAuwGKAAAIRq4AAQAhDYAAALsBigAACESvAAEARK0AAQBErgABACnYA72e
AAAIZm1obAK90gAACGZtaGwCvfwAAAhmbWhsAr0iAQAIZm1obALC2ebZAO3j6QDb4/AA1eIAv8jD
wce7uADV/sa7yM27zgDV4tgA1QDNzrvMwAC8v8zM06v/zNnX2d3q2QDo3N3nANfV5tgA1dvV3eIA
2uPm/uHj5tkAvL/MzMO/zav/ztzZ5tm05wDi4wDm4+PhANrj5gDo3NnhAN3i/u3j6eYAvLvBq//O
3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8=`), {
        'BPRE 1.1': decodeBase64(`dAEBAQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE=`),
      }),
    },
  },
  {
    id: 'custom-mirage-island',
    label: 'Mirage Island Today',
    description: 'Makes Mirage Island appear off Route 130 today, for as long as the Pokémon at the front of your party stays in your party. The game picks a new Pokémon for the island every day, so talk to the deliveryman again tomorrow.',
    roms: ['BPEE 1.0'],
    payloads: {
      emerald: [decodeBase64(`CgRoASIAAAAEAMfDzLvBvwDDzca7yL7////////////////////////////////////J6egA4+IA
zMnPzr8AoqShAOjj2NXt////////////////////////x9Xf2QDHw8y7wb8Aw83Gu8i+ANXk5NnV
5v///////////////////+jj2NXtrQDQ3efd6ADo3NkA2Nng3erZ5u3h1eL////////////////j
4gDo3NkAo+LYANrg4+PmAOPaANX/////////////////////////ysnFG8fJyAC9v8jOv8yt////
/////////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVQAACB+vAAAIRbsFVQAACB+8AAAIALsFVQAACBXidQMC7EQCAhXjdQMC7UQCAhkk
QAWAFgSAAAB/AASAvV8AAAhmbWhsAr2yAAAIZm1obALHw8y7wb8Aw83Gu8i+AN3nAOPp6ADj2tr+
zMnPzr8AoqShAOjj2NXtq/vD6ADn6NXt5wDV5wDg4+LbANXnAP0C/t3nAN3iAO3j6eYA5NXm6O2t
/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/w==`)],
    },
  },
  {
    id: 'custom-berry-garden',
    label: 'Ripen All Berry Trees',
    description: 'Makes every Berry tree you planted ready to pick, fully watered for the biggest crop.',
    roms: ['BPEE 1.0'],
    payloads: {
      emerald: [decodeBase64(`CwRxASMAAAAMALy/zMzTAMG7zL6/yP/////////////////////////////////////M3eTZALy/
zMzDv824AObd29zoAOLj6///////////////////////v+rZ5u0AvL/MzNMA6ObZ2QDt4+kA5ODV
4ujZ2P///////////////93nAObZ1djtAOjjAOTd19+tANDd593oAOjc2f/////////////////Y
2eDd6tnm7eHV4gDj4gDo3NkAo+LYANrg4+Pm////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFiwAACB+vAAAIRbsFiwAACB+8AAAIALsFiwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72VAAAIZm4UCCENgAAAuwGBAAAII6UOAAMfASENgAAAuwF3AAAIgwANgL3CAAAIZm1obAK9
/AAACGZtaGwCvSwBAAhmbWhsAr1AAQAIZm1obALN3NXg4ADDAOHV39kA7ePp5gC8v8zM0wDo5tnZ
5/7m2dXY7QDo4wDk3dffrP++4+LZqwD9AgC8v8zM0wDo5tnZ5wDV5tn+5tnV2O0A6OMA5N3X37gA
1eLYAOvZ4OAA69Xo2ebZ2K3/yOPi2QDj2gDt4+nmALy/zMzTAOjm2dnnANXm2f7b5uPr3eLbAObd
29zoAOLj663/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+
6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAHC1EkwkaBJIJBiAJQAmIHgAKBTQYHgBOAQoENJg
efAhCENgcSAADEsA8A/4YHgFKPjRIHgJSwDwCPhggAE2CDQBPeTRA0gGgHC9GEeMXQADnBYAAPB1
AwLJFw4IfRsOCA==`)],
    },
  },
  {
    id: 'custom-daycare-egg',
    label: 'Instant Day Care Egg',
    description: 'If the two Pokémon at the Day Care can have an Egg, the Day Care has one ready for you right away.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`DASvACQAAAAcAMPIzc67yM4AvrvTAL27zL8Av8HB///////////////////////////I4wDh4+bZ
AOTV193i2///////////////////////////////////ztzZAL670wC9u8y/ANzV5wDV4gC/wcEA
2uPm/////////////////+3j6QDm3dvc6ADV69XtrQDQ3efd6ADo3Nn////////////////////Y
2eDd6tnm7eHV4gDj4gDo3NkAo+LYANrg4+Pm////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFfAAACB+vAAAIRbsFfAAACB+8AAAIALsFfAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyuGALsBaAAACCOlDgADAgEhDYAAALsBcgAACL2GAAAIZm1obAK9sQAACGZtaGwCveIAAAhm
bWhsAr0aAQAIZm1obALO3NkAvrvTAL27zL8A3NXnANXiAL/Bwf7m2dXY7QDa4+YA7ePpAOLj66v/
ztzZAL670wC9u8y/ANXg5tnV2O0A3NXnANXi/r/BwQDr1d3o3eLbANrj5gDt4+mr/8bZ1erZAOjr
4wDKycUbx8nIAOjc1egA29no/tXg4+LbANXoAOjc2QC+u9MAvbvMvwDa3ebn6Kv/ztzd5wDb3dro
ANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/ALUISABoCElAGAlL
APAJ+AAoA9AHSwDwBPgBIANJCIAAvRhHjF0AAzAwAADwdQMCTQ0HCOEBBwg=`)],
      ...romPayloads(decodeBase64(`DASvACQAAAAcAMPIzc67yM4AvrvTAL27zL8Av8HB///////////////////////////I4wDh4+bZ
AOTV193i2///////////////////////////////////ztzZAL670wC9u8y/ANzV5wDV4gC/wcEA
2uPm/////////////////+3j6QDm3dvc6ADV69XtrQDQ3efd6ADo3Nn////////////////////Y
2eDd6tnm7eHV4gDj4gDo3NkAo+LYANrg4+Pm////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFfAAACB+vAAAIRbsFfAAACB+8AAAIALsFfAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARytmArsBaAAACCMVDwADAgEhDYAAALsBcgAACL2GAAAIZm1obAK9sQAACGZtaGwCveIAAAhm
bWhsAr0aAQAIZm1obALO3NkAvrvTAL27zL8A3NXnANXiAL/Bwf7m2dXY7QDa4+YA7ePpAOLj66v/
ztzZAL670wC9u8y/ANXg5tnV2O0A3NXnANXi/r/BwQDr1d3o3eLbANrj5gDt4+mr/8bZ1erZAOjr
4wDKycUbx8nIAOjc1egA29no/tXg4+LbANXoAOjc2QC+u9MAvbvMvwDa3ebn6Kv/ztzd5wDb3dro
ANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/ALUISABoCElAGAlL
APAJ+AAoA9AHSwDwBPgBIANJCIAAvRhHCFAAA4AvAADQcAMCTWUECElaBAg=`), {
        'BPRE 1.1': decodeBase64(`dAEBAdACBWFlBAhd`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHQAgVhZQQIXQ==`),
      }),
    },
  },
  {
    id: 'custom-rival-name',
    label: 'Rename Your Rival',
    description: 'Gives your rival a new name with the game’s own naming screen.',
    roms: ['BPRE 1.0', 'BPRE 1.1', 'BPGE 1.0', 'BPGE 1.1'],
    payloads: {
      ...romPayloads(decodeBase64(`DQSFACUAAAAQAMy/yLvHvwDTyc/MAMzD0LvG///////////////////////////////N4dng4ADt
1QDg1ejZ5qv/////////////////////////////////wd3q2QDt4+nmAObd6tXgANUA4tnrAOLV
4dmt/////////////////9Dd593oAOjc2QDY2eDd6tnm7eHV4gDj4gDo3Nn///////////////+j
4tgA2uDj4+YA49oA1QDKycUbx8nI////////////////////////vb/Izr/Mrf//////////////
/////////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFggAACB+vAAAIRbsFggAACB+8AAAIALsFggAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72MAAAIZm4UCCENgAAAuwF4AAAIIxUPAAMDAbheAAAIaJcBIxUPAAO8ACe9ugAACGZtaGwC
vdkAAAhmbWhsAr3tAAAIZm1obALR4+ng2ADt4+kA4N3f2QDo4wDb3erZAO3j6eb+5t3q1eAA1QDi
2esA4tXh2az/wObj4QDi4+sA4+K4AO3j6eYA5t3q1eAA3ef+/Qar/73j4dkA1tXX3wDV4u0A6N3h
2av/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/
ABC1grALSwGTACAAkAZJCWgGSokYACIAIwQgBUwA8AL4ArAQvSBHwEYIUAADTDoAAFXZCQjFaAUI
B0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iLUPvRcEcIUAADJDYAAAD8AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBAaQCBWnZCQjZ`),
        'BPGE 1.0': decodeBase64(`XAEBR6QCASk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQGkAgU92QkI2Q==`),
      }),
    },
  },
  {
    id: 'custom-gift-ribbons',
    label: 'Event Ribbons for Your Party',
    description: 'Gives every Pokémon in your party the seven gift ribbons, Marine, Land, Sky, Country, National, Earth and World, which Gen 3 only handed out at events. A ribbon whose caption came from a real event keeps it.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`DgRmASYAAAAAAMHDwM4AzMO8vMnIzf/////////////////////////////////////N2erZ4gDM
w7y8ycjNAOjjAOfc4+sA49ra////////////////////0+Pp5gDk1ebo7QDb2ejnAOjc2QDb3dro
/////////////////////8zDvLzJyM0A4+LX2QDj4uDtANvd6tniANXo///////////////////Z
6tni6OetANDd593oAOjc2QDY2eDd6tnm7eHV4v//////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFdQAACB+vAAAIRbsFdQAACB+8AAAIALsFdQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR71/AAAIZm4UCCENgAAAuwFrAAAII6UOAAPbACmbCL2xAAAIZm1obAK95wAACGZtaGwCvfsA
AAhmbWhsAs3c1eDgAMMA293q2QDt4+nmAOTV5ujtAMrJxRvHycj+6NzZANvd2ugAzMO8vMnIzaz/
0+Pp5gDKycUbx8nIANvj6ADV4OAA59nq2eIA293a6P7Mw7y8ycjNqwDO1d/ZANUA4OPj363/vePh
2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePi
AOPaAOjc2QDb1eHZrf8AAABwtYGwE0wkaBNIJBgVpQAmoF0AKAHRqF2gVQE2By730QEgAJANTAYl
4HxAB0APAigJ0UgmIAAxAGpGCUsA8Aj4ATZPLvbRZDQBPe3RAbBwvRhHwEaMXQADqDEAAOxEAgKt
rAYINzo7PTw+PwA=`)],
      ...romPayloads(decodeBase64(`DgRmASYAAAAAAMHDwM4AzMO8vMnIzf/////////////////////////////////////N2erZ4gDM
w7y8ycjNAOjjAOfc4+sA49ra////////////////////0+Pp5gDk1ebo7QDb2ejnAOjc2QDb3dro
/////////////////////8zDvLzJyM0A4+LX2QDj4uDtANvd6tniANXo///////////////////Z
6tni6OetANDd593oAOjc2QDY2eDd6tnm7eHV4v//////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFdQAACB+vAAAIRbsFdQAACB+8AAAIALsFdQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR71/AAAIZm4UCCENgAAAuwFrAAAIIxUPAAPbACk7CL2xAAAIZm1obAK95wAACGZtaGwCvfsA
AAhmbWhsAs3c1eDgAMMA293q2QDt4+nmAOTV5ujtAMrJxRvHycj+6NzZANvd2ugAzMO8vMnIzaz/
0+Pp5gDKycUbx8nIANvj6ADV4OAA59nq2eIA293a6P7Mw7y8ycjNqwDO1d/ZANUA4OPj363/vePh
2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePi
AOPaAOjc2QDb1eHZrf8AAABwtYGwE0wkaBNIJBgVpQAmoF0AKAHRqF2gVQE2By730QEgAJANTAYl
4HxAB0APAigJ0UgmIAAxAGpGCUsA8Aj4ATZPLvbRZDQBPe3RAbBwvRhHwEYIUAADnDAAAIRCAgJ9
AwQINzo7PTw+PwA=`), {
        'BPRE 1.1': decodeBase64(`dAEBAeQCAZE=`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHkAgGR`),
      }),
    },
  },
  {
    id: 'custom-fast-text',
    label: 'Max Text Speed',
    description: 'All text prints at top speed, in the overworld and in battle, until the game is turned off or reset. Talk to the deliveryman again after a reset.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`DwQ7AScAAAAYAMC7zc4Azr/Szv/////////////////////////////////////////I4wDh4+bZ
AOvV3ejd4tv/////////////////////////////////u+DgAOjZ7OgA5Obd4ujnANXoAOjj5ADn
5NnZ2P///////////////+ni6N3gAO3j6QDo6ebiAOPa2gDt4+nmANvV4dmt///////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADjwC9XgAACGZtaGwCvZ0AAAhmbWhsArvg4ADo2ezoAOTm3eLo5wDV6ADo4+QA5+TZ
2dj+4uPruADp4ujd4ADt4+kA6Onm4gDj2toA6NzZANvV4dmt/87c3ecA293a6ADY49nn4rToAOvj
5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wBwtQDwHvgeiAAgGIAQTRSkEEgEOALU
IVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkD0ApLGWBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEfA
RgD8AwLwAQAAICcAA6D9AwIwtW1IBIhuSAFoATEBYHNIACgB0AEhAXAA8Hv4YEsA8Hf4ASAEQiPR
Z0xfpQDwI/hmTF+lAPAf+GJIICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDABOfHRWUhBaAExQWBW
TAAsBNBPSwDwUvgBPPjnMLwBvABHALVXSQApBNBUSICNCECIQkHRACw/0FBIQWhqaJFCOtEBaCpo
kUI20U1JyYjJCzLRAPB1+E1JACkQ0ENK0mhTABsYi0IK2UBIAWkBMQFh0QgBMVIaANUAIsJgHOAB
tD5IACHBhQGGK2gA8Bf4O0hBaGtomUIO0QDwEPgA8FD4ArxAGgDV5DAwStBgkWgBMZFgATy+5wGw
AbwARxhHELUqSEFpACkG0CxKEWCBaVFgACFBYYFhL0kAKS3QKUoAKgTQJkubjRNAk0Il0R9IwmkB
MopCANMAIsJhACoc0R9LHGgUSpRCA9FcaBNKlEIH0BxoEkqUQg/RXGgRSpRCC9EXStKI0gsH0RBI
HGhEYVxohGEZTBxgXGAQvAG8AEdwRxNIAIigOADV5DBwRzkHAAh5RwAIBV4ICF1eCAjxngMIIYQD
CNwiAAMIAAAAYP8DArABAgIAAAAAAAAAAMAiAAPUfwMCAAEAAAAAAADkAAAABgAABAAAAACT/QMC`)],
      ...romPayloads(decodeBase64(`DwQ7AScAAAAYAMC7zc4Azr/Szv/////////////////////////////////////////I4wDh4+bZ
AOvV3ejd4tv/////////////////////////////////u+DgAOjZ7OgA5Obd4ujnANXoAOjj5ADn
5NnZ2P///////////////+ni6N3gAO3j6QDo6ebiAOPa2gDt4+nmANvV4dmt///////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADjwC9XgAACGZtaGwCvZ0AAAhmbWhsArvg4ADo2ezoAOTm3eLo5wDV6ADo4+QA5+TZ
2dj+4uPruADp4ujd4ADt4+kA6Onm4gDj2toA6NzZANvV4dmt/87c3ecA293a6ADY49nn4rToAOvj
5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wBwtQDwHvgeiAAgGIAQTRSkEEgEOALU
IVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkD0ApLGWBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEfA
RgD8AwLwAQAAUDUAA6D9AwIwtW1IBIhuSAFoATEBYHNIACgB0AEhAXAA8Hv4YEsA8Hf4ASAEQiPR
Z0xfpQDwI/hmTF+lAPAf+GJIICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDABOfHRWUhBaAExQWBW
TAAsBNBPSwDwUvgBPPjnMLwBvABHALVXSQApBNBUSICNCECIQkHRACw/0FBIQWhqaJFCOtEBaCpo
kUI20U1JyYjJCzLRAPB1+E1JACkQ0ENK0mhTABsYi0IK2UBIAWkBMQFh0QgBMVIaANUAIsJgHOAB
tD5IACHBhQGGK2gA8Bf4O0hBaGtomUIO0QDwEPgA8FD4ArxAGgDV5DAwStBgkWgBMZFgATy+5wGw
AbwARxhHELUqSEFpACkG0CxKEWCBaVFgACFBYYFhL0kAKS3QKUoAKgTQJkubjRNAk0Il0R9IwmkB
MopCANMAIsJhACoc0R9LHGgUSpRCA9FcaBNKlEIH0BxoEkqUQg/RXGgRSpRCC9EXStKI0gsH0RBI
HGhEYVxohGEZTBxgXGAQvAG8AEdwRxNIAIigOADV5DBwRyUHAAjpLQAINWUFCLVlBQjlIwEIAREB
CAwxAAMIAAAAYP8DAjQAAgIAAAAAAAAAAPAwAAO4egMCAAEAAAAAAADkAAAABgAABAAAAACT/QMC`), {
        'BPRE 1.1': decodeBase64(`dAEBASQEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEkBBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
      }),
    },
  },
  {
    id: 'custom-move-tutor',
    label: 'Move Relearner & Deleter',
    description: 'Teaches a Pokémon from your party a move it could have learned by level up, like the Move Relearner but free, or makes it forget any move, HMs included.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`EATrACgAAAAUAMfJ0L8AzL/Gv7vMyL/MAC0Avr/Gv86/zP/////////////////////M2eHZ4dbZ
5gDj5gDa4+bb2ei4ANrm2dn/////////////////////ztnV19wA1QDKycUbx8nIANUA4ePq2QDd
6P///////////////////9rj5tvj6LgA4+YA4dXf2QDd6ADa4+bb2egA4+LZrf/////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFYQEACB+vAAAIRbsFYQEACB+8AAAIALsFYQEACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADpwK4SgAACL1rAQAIZm4UCCENgAAAuwGZAAAIvbYBAAhmbSXeACchBIAGALsElgAA
CCVKASENgAEAuwEvAQAIIQWAAAC7ATkBAAgl4wAnaGwCvZMBAAhmbhQIIQ2AAAC7AVcBAAi9tgEA
CGZtJaIAJyEEgAYAuwSWAAAIJUoBIQ2AAQC7AS8BAAh/AASAJeIAIQ2AAQC7AUMBAAi90gEACGZt
lwEl3wAnlwAhBYAEALsBlgAACCXhAL3vAQAIZm4UCCENgAAAuwFXAQAIJQkCIQ2AAQC7AU0BAAgl
4AC9AgIACGZtaGwCvRACAAhmbWhsAr0zAgAIZm1obAK9VwIACGZtaGwCvW8CAAhmbWhsAr2fAgAI
Zm1obAK9swIACGZtaGwCzdzV4OAAwwDc2eDkANUAysnFG8fJyP7m2eHZ4dbZ5gDVAOHj6tms/8nm
AOfc1eDgAMMA4dXf2QDj4tkA2uPm29no/tUA4ePq2az/0dzd19wAysnFG8fJyADn3OPp4NgA3egA
1tms/9Hc3dfcAOHj6tkA59zj6eDYAN3oANrj5tvZ6Kz/x9Xf2QD9AgDa4+bb2ej+/QOs//0CANrj
5tvj6AD9A6v/u+IAv8HBANjj2efitOgA3+Lj6wDV4u3+4ePq2ecA7dnoq//O3Nnm2bTnAOLjAOHj
6tkA2uPmAN3oAOjj/ubZ4dnh1tnmrf/9AgDf4uPr5wDj4uDtAOPi2f7h4+rZq//D6LTnAOjc2QDj
4uDtAMrJxRvHycgA49oA7ePp5uf+6NzV6ADf4uPr5wDNz8zAq/+94+HZANbV198A1eLtAOjd4dmr
/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAA
AAdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBHjF0AAzA3AAAA/AMC`)],
      ...romPayloads(decodeBase64(`EATrACgAAAAUAMfJ0L8AzL/Gv7vMyL/MAC0Avr/Gv86/zP/////////////////////M2eHZ4dbZ
5gDj5gDa4+bb2ei4ANrm2dn/////////////////////ztnV19wA1QDKycUbx8nIANUA4ePq2QDd
6P///////////////////9rj5tvj6LgA4+YA4dXf2QDd6ADa4+bb2egA4+LZrf/////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFSQEACB+vAAAIRbsFSQEACB+8AAAIALsFSQEACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADXwK4SgAACL1TAQAIZm4UCCENgAAAuwGZAAAIvZ4BAAhmbSXbACchBIAGALsElgAA
CCVIASENgAEAuwEhAQAIIQWAAAC7ASsBAAgl4AAnaGwCvXsBAAhmbhQIIQ2AAAC7AT8BAAi9ngEA
CGZtJZ8AJyEEgAYAuwSWAAAIJUgBIQ2AAQC7ASEBAAh/AASAJd8AIQ2AAQC7ATUBAAi9ugEACGZt
lwEl3AAnlwAhBYAEALsBlgAACCXeAL3XAQAIZm4UCCENgAAAuwE/AQAIJd0AveoBAAhmbWhsAr34
AQAIZm1obAK9GwIACGZtaGwCvT8CAAhmbWhsAr1XAgAIZm1obAK9awIACGZtaGwCzdzV4OAAwwDc
2eDkANUAysnFG8fJyP7m2eHZ4dbZ5gDVAOHj6tms/8nmAOfc1eDgAMMA4dXf2QDj4tkA2uPm29no
/tUA4ePq2az/0dzd19wAysnFG8fJyADn3OPp4NgA3egA1tms/9Hc3dfcAOHj6tkA59zj6eDYAN3o
ANrj5tvZ6Kz/x9Xf2QD9AgDa4+bb2ej+/QOs//0CANrj5tvj6AD9A6v/u+IAv8HBANjj2efitOgA
3+Lj6wDV4u3+4ePq2ecA7dnoq//O3Nnm2bTnAOLjAOHj6tkA2uPmAN3oAOjj/ubZ4dnh1tnmrf/9
AgDf4uPr5wDj4uDtAOPi2f7h4+rZq/+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn
4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAAAdIAGgHSUAYB0maaBIa
UhiaYPkikgAEOoNYi1D70XBHCFAAAyQ2AAAA/AMC`), {
        'BPRE 1.1': decodeBase64(`dAEBAQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE=`),
      }),
    },
  },
  {
    id: 'custom-trade-evolution',
    label: 'Trade Evolution Without Trading',
    description: 'Evolves a Pokémon from your party that normally evolves by trading, such as Kadabra, Machoke, Graveler or Haunter, with the usual evolution scene. One that needs to hold an item when traded (Onix, Scyther, Seadra, Slowpoke, Poliwhirl, Porygon, Clamperl) must be holding it, and uses it up as in a trade. In FireRed and LeafGreen, evolving into a Johto Pokémon needs the National Pokédex.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`EQRBACkAAAAIAM7Mu76/AL/QycbPzsPJyP/////////////////////////////////I4wDn2dfj
4tgAwby7AOLZ2djZ2P//////////////////////////v+rj4OrZANUAysnFG8fJyADo3NXoANnq
4+Dq2ef//////////////9btAOjm1djd4tu4AObd29zoANXr1e2tANDd593o///////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFrQAACB+vAAAIRbsFrQAACB+8AAAIALsFrQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR723AAAIZm0jpQ4AA6gBuFEAAAglogAnIQSABgC7BKoAAAgmDYBJASENgJwBuwGgAAAIfwAE
gCOlDgADEQEhDYAAALsBlgAACCe96QAACGZtaGwCvf8AAAhmbWhsAr3UAAAIZm1obAJobAK9VAEA
CGZtaGwC0dzd19wAysnFG8fJyADn3OPp4NgA2erj4OrZrP+74gC/wcEA19XitOgA2erj4OrZq//O
1d/ZANvj49gA19Xm2QDj2gDd6Kv//QIA2OPZ5+K06ADZ6uPg6tkA1u3+6ObV2N3i2637zePh2QDK
ycUbx8nIAOLZ2dgA6OMA3OPg2ADV4v7d6NnhAOvc2eIA6NzZ7bTm2QDo5tXY2dit/87c3ecA293a
6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAMLUA8CX4BAAB
IQAiDEsA8BH4BQAL0AxIDEkBYAZLG3gAIikAIAAHTADwBfgBJQNIBYAwvRhHIEfgdQMC8HUDApnQ
BghB2hMI6GEAA7FhCAgDSACIZCFIQwJJQBhwR8BG4HUDAuxEAgIHSABoB0lAGAdJmmgSGlIYmmD5
IpIABDqDWItQ+9FwR4xdAAMwNwAAAPwDAg==`)],
      ...romPayloads(decodeBase64(`EQRBACkAAAAIAM7Mu76/AL/QycbPzsPJyP/////////////////////////////////I4wDn2dfj
4tgAwby7AOLZ2djZ2P//////////////////////////v+rj4OrZANUAysnFG8fJyADo3NXoANnq
4+Dq2ef//////////////9btAOjm1djd4tu4AObd29zoANXr1e2tANDd593o///////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFrQAACB+vAAAIRbsFrQAACB+8AAAIALsFrQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR723AAAIZm0jFQ8AA6gBuFEAAAglnwAnIQSABgC7BKoAAAgmDYBHASENgJwBuwGgAAAIfwAE
gCMVDwADEQEhDYAAALsBlgAACCe96QAACGZtaGwCvf8AAAhmbWhsAr3UAAAIZm1obAJobAK9VAEA
CGZtaGwC0dzd19wAysnFG8fJyADn3OPp4NgA2erj4OrZrP+74gC/wcEA19XitOgA2erj4OrZq//O
1d/ZANvj49gA19Xm2QDj2gDd6Kv//QIA2OPZ5+K06ADZ6uPg6tkA1u3+6ObV2N3i2637zePh2QDK
ycUbx8nIAOLZ2dgA6OMA3OPg2ADV4v7d6NnhAOvc2eIA6NzZ7bTm2QDo5tXY2dit/87c3ecA293a
6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAMLUA8CX4BAAB
IQAiDEsA8BH4BQAL0AxIDEkBYAZLG3gAIikAIAAHTADwBfgBJQNIBYAwvRhHIEfAcAMC0HADAsUu
BAip3QwIfFMAA8VoBQgDSACIZCFIQwJJQBhwR8BGwHADAoRCAgIHSABoB0lAGAdJmmgSGlIYmmD5
IpIABDqDWItQ+9FwRwhQAAMkNgAAAPwDAg==`), {
        'BPRE 1.1': decodeBase64(`dAEBARwDBdkuBAi9KAMB2Q==`),
        'BPGE 1.0': decodeBase64(`XAEBRyADAX0=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEcAwXZLgQIkSgDAdk=`),
      }),
    },
  },
  {
    id: 'custom-roamer',
    label: 'Roaming Pokémon Finder & Lure',
    description: 'Tells you which Pokémon is roaming and the route it’s on right now, then offers to lure it: while the lure is on, it follows you onto the routes it roams, and 1 in 4 wild Pokémon you meet there is it. Latios or Latias roams in Emerald after the Hall of Fame; Entei, Raikou or Suicune roams in FireRed and LeafGreen after you bring Celio the Sapphire. The lure lasts until the game is turned off or reset; talk to the deliveryman again to turn it off.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`EgT1ACoAAAAQAMzJu8fDyMEAysnFG8fJyP/////////////////////////////////A3eLYAN3o
uADo3NniAODp5tkA3ej/////////////////////////wN3i2ADj6egA69zZ5tkA6NzZAObj1eHd
4tv//////////////////8rJxRvHycgA3ecA1eLYAODp5tkA3egA6OMA7ePprf/////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFxQAACB+vAAAIRbsFxQAACB+8AAAIALsFxQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADwwEhDYAAALsBsQAACL3PAAAIZm0fYP8DAgG7AY0AAAi96wAACGZuFAghDYAAALsB
uwAACCOlDgADwgG9KAEACGZtaGwCvVoBAAhmbhQIIQ2AAQC7AbsAAAgRAGD/AwK9fgEACGZtaGwC
vZ0BAAhmbWhsAr2+AQAIZm1obAK90gEACGZtaGwC/QIA3ecA5uPV4d3i2/79AwDm3dvc6ADi4+ut
/83c1eDgAMMA4Onm2QDd6ADo4wDt4+msAMPoAOvd4OD+2uPg4OPrAO3j6QDV4OPi2wDd6OcA5uPp
6Nnnrf++4+LZqwDG4+PfANrj5gDd6ADd4gDo1eDgANvm1efn/tXi2ADj4gDo3NkA69Xo2eat/8Po
tOcA2uPg4OPr3eLbAO3j6a3+xdnZ5ADg6ebd4tsA3eis/8PoAOvd4OAA5uPV4QDj4gDd6OcA4+vi
ANXb1d3irf/I4wDKycUbx8nIAN3nAObj1eHd4tsA5t3b3Oj+4uPrrf+94+HZANbV198A1eLtAOjd
4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt
/xC1G0wkaBtIJBjgfBpJCIAAKBDQIYkZSBpLAPAn+BpKEHhReBlLAPAh+AF9FEgAIhdLAPAb+BC9
cLUWSx6IACAYgBVNGKQVSAQ4IVgpUPvRE0wBICBwE0gBaEsbmwoC0GFgaRwBYAtLHoBwvRhHwEaM
XQAD3DEAAPB1AwLEHAICxB0CAhW5BgiGvAMCkUoICG1FEggIAgAEAPwDAlgAAABg/wMCICcAAxC1
EEwgeAAoFNAPSABoD0lBXAApDtABeQApC9FCeQxLGHiQQgPQBjP/KPnRAuAJSAFwQnBjaADwA/gQ
vAG8AEcYR8BGYP8DAoxdAAPvMQAAMOxcCIa8AwI=`)],
      ...romPayloads(decodeBase64(`EgT1ACoAAAAQAMzJu8fDyMEAysnFG8fJyP/////////////////////////////////A3eLYAN3o
uADo3NniAODp5tkA3ej/////////////////////////wN3i2ADj6egA69zZ5tkA6NzZAObj1eHd
4tv//////////////////8rJxRvHycgA3ecA1eLYAODp5tkA3egA6OMA7ePprf/////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFxQAACB+vAAAIRbsFxQAACB+8AAAIALsFxQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADwwEhDYAAALsBsQAACL3PAAAIZm0fYP8DAgG7AY0AAAi96wAACGZuFAghDYAAALsB
uwAACCMVDwADwgG9KAEACGZtaGwCvVoBAAhmbhQIIQ2AAQC7AbsAAAgRAGD/AwK9fgEACGZtaGwC
vZ0BAAhmbWhsAr2+AQAIZm1obAK90gEACGZtaGwC/QIA3ecA5uPV4d3i2/79AwDm3dvc6ADi4+ut
/83c1eDgAMMA4Onm2QDd6ADo4wDt4+msAMPoAOvd4OD+2uPg4OPrAO3j6QDV4OPi2wDd6OcA5uPp
6Nnnrf++4+LZqwDG4+PfANrj5gDd6ADd4gDo1eDgANvm1efn/tXi2ADj4gDo3NkA69Xo2eat/8Po
tOcA2uPg4OPr3eLbAO3j6a3+xdnZ5ADg6ebd4tsA3eis/8PoAOvd4OAA5uPV4QDj4gDd6OcA4+vi
ANXb1d3irf/I4wDKycUbx8nIAN3nAObj1eHd4tsA5t3b3Oj+4uPrrf+94+HZANbV198A1eLtAOjd
4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt
/xC1G0wkaBtIJBjgfBpJCIAAKBDQIYkZSBpLAPAn+BpKEHhReBlLAPAh+AF9FEgAIhdLAPAb+BC9
cLUWSx6IACAYgBVNGKQVSAQ4IVgpUPvRE0wBICBwE0gBaEsbmwoC0GFgaRwBYAtLHoBwvRhHwEYI
UAAD0DAAANBwAwLQHAIC8BwCAtEPBAiu8wMCOVIFCHlNDAgIAgAEAPwDAlgAAABg/wMCUDUAAxC1
EEwgeAAoFNAPSABoD0lBXAApDtABeQMpC9FCeQxLGHiQQgPQBzP/KPnRAuAJSAFwQnBjaADwA/gQ
vAG8AEcYR8BGYP8DAghQAAPjMAAAWGxGCK7zAwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBAdwDAeXkAwVNUgUIjVAEAbg=`),
        'BPGE 1.0': decodeBase64(`XAEBR+gDAU1QBAI0ZQ==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHcAwHl5AMFTVIFCGFQBAKkZQ==`),
      }),
    },
  },
  {
    id: 'custom-legendary-respawn',
    label: 'Legendary Respawn',
    description: 'Brings back the legendary Pokémon you knocked out instead of catching, to where you met them. In Emerald: Regirock, Regice, Registeel, Kyogre, Groudon and Rayquaza, and from the event islands Latias or Latios, Mew, Lugia, Ho-Oh and Deoxys. In FireRed and LeafGreen: Articuno, Zapdos, Moltres, Mewtwo, Lugia, Ho-Oh and Deoxys. A roaming Pokémon you knocked out, or that left with Roar, roams again at full HP. Legendaries your Pokédex has as caught stay gone. For Kyogre or Groudon, ask at the Weather Institute about the weather again.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`EwSWACsAAAAcAMa/wb/IvrvM0wDMv83Ku9HI//////////////////////////////+7AOfZ1+Pi
2ADX3NXi19n/////////////////////////////////xtnb2eLY1ebtAMrJxRvHycgA7ePpANbZ
1ej//////////////////9bp6ADY3djitOgA19Xo19wA1+Ph2QDW1dffrf/////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFiwAACB+vAAAIRbsFiwAACB+8AAAIALsFiwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72VAAAIZm4UCCENgAAAuwGBAAAII6UOAAMTASENgAAAuwF3AAAIgwANgL3QAAAIZm1obAK9
9gAACGZtaGwCvR8BAAhmbWhsAr0zAQAIZm1obALN3NXg4ADDANbm3eLbANbV198A6NzZAODZ29ni
2NXm7f7KycUbx8nIAO3j6QDY3djitOgA19Xo19ys/77j4tmrAP0CAODZ29ni2NXm7QDKycUbx8nI
/tfV4dkA1tXX363/yOMA4Nnb2eLY1ebtAMrJxRvHycgA4tnZ2OcA6OP+1+Ph2QDW1dffrf+94+HZ
ANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA
49oA6NzZANvV4dmt/wAAAPC1gbAAJzGkIIgAKBDQJUsA8Eb4ACgJ0GCIAPAz+AAoBNEgiCBLAPA7
+AE3BDTr5x5NLWgfSC0YKIkAKB7Q6XwAKRvRHEsA8Cv4APAb+AAoFNFoaACQGUgpiSp7K2gYTgDw
H/gVSFgwAIhogQAgaHMBIOh0E0sA8BP4ATcSSAeAAbDwvQAoCtABOMEICEoSaCgyUVwHIhBAwUAB
IAhAcEcYRzBHkdcJCGnXCQiMXQADkF0AA9wxAACl1AYIREcCAmGABggBHRYI8HUDArsBeQG8AXoB
vQF7Ab4BfgG/AX8BwAGAAcgBAADHAQAA3QEAANwBAACsAQAAAADARg==`)],
      ...romPayloads(decodeBase64(`EwSWACsAAAAcAMa/wb/IvrvM0wDMv83Ku9HI//////////////////////////////+7AOfZ1+Pi
2ADX3NXi19n/////////////////////////////////xtnb2eLY1ebtAMrJxRvHycgA7ePpANbZ
1ej//////////////////9bp6ADY3djitOgA19Xo19wA1+Ph2QDW1dffrf/////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFiwAACB+vAAAIRbsFiwAACB+8AAAIALsFiwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72VAAAIZm4UCCENgAAAuwGBAAAIIxUPAAMTASENgAAAuwF3AAAIgwANgL3QAAAIZm1obAK9
9gAACGZtaGwCvR8BAAhmbWhsAr0zAQAIZm1obALN3NXg4ADDANbm3eLbANbV198A6NzZAODZ29ni
2NXm7f7KycUbx8nIAO3j6QDY3djitOgA19Xo19ys/77j4tmrAP0CAODZ29ni2NXm7QDKycUbx8nI
/tfV4dkA1tXX363/yOMA4Nnb2eLY1ebtAMrJxRvHycgA4tnZ2OcA6OP+1+Ph2QDW1dffrf+94+HZ
ANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA
49oA6NzZANvV4dmt/wAAAPC1gbAAJzGkIIgAKBDQJUsA8Eb4ACgJ0GCIAPAz+AAoBNEgiCBLAPA7
+AE3BDTr5x5NLWgfSC0YKIkAKB7Q6XwAKRvRHEsA8Cv4APAb+AAoFNFoaACQGUgpiSp7K2gYTgDw
H/gVSFgwAIhogQAgaHMBIOh0E0sA8BP4ATcSSAeAAbDwvQAoCtABOMEICEoSaCgyUVwHIhBAwUAB
IAhAcEcYRzBH0eYGCKnmBggIUAADDFAAA9AwAACZMgQILEACAmnfAwjVHRQI0HADAr4CkAC/ApEA
vQKSALwClgD1AgAA9gIAAPcCAAAAAMBG`), {
        'BPRE 1.1': decodeBase64(`dAEBAWADBeXmBgi9dAMBrXwDBn3fAwhNHg==`),
        'BPGE 1.0': decodeBase64(`XAEBR4ADAa0=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQFgAwXl5gYIvXQDAa18AwZ93wMIJR4=`),
      }),
    },
  },
  {
    id: 'custom-fly-anywhere',
    label: 'Fly Anywhere with R',
    description: 'Press R outdoors to open the Fly map, with no Pokémon that knows Fly and no badge needed, and fly to any town you’ve visited with the usual animation. It works wherever Fly does: on foot, on a bike or surfing, but not indoors, in caves or during a cutscene. B closes the map. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset, or to turn it off.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`FAQSACwAAAAEAMDG0wC7yNPRwr/Mv//////////////////////////////////////K5tnn5wDM
AOjjAMDG0///////////////////////////////////yubZ5+cAzADj6ejY4+Pm5wDo4wDAxtMA
6OMA1f///////////////+jj6+IA7ePptOrZAOrd593o2di4AOLjAMLH///////////////////i
2dnY2ditANDd593oAOjc2QDY2eDd6tnm7eHV4v//////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFowAACB+vAAAIRbsFowAACB+8AAAIALsFowAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2tAAAIZm4UCCENgAAAuwGZAAAII6UOAAMzAb3cAAAIZm1obAK9FgEA
CGZuFAghDYABALsBmQAACCOlDgADRAG9NAEACGZtaGwCvUsBAAhmbWhsAr1fAQAIZm1obALR1eLo
AOjjAMDG0wDr3ejcAOjc2QDk5tnn5wDj2gDMuP7i4wDCxwDi2dnY2dis/77j4tmrAMnp6Njj4+bn
uADk5tnn5wDMAOjjAMDG063+w+gA4NXn6OcA6eLo3eAA7ePpAObZ59norf/AxtMA693o3ADMAN3n
AOPirf7F2dnkAN3oAOPirP/MAOLjAODj4tvZ5gDj5Nni5wDAxtOt/73j4dkA1tXX3wDV4u0A6N3h
2av/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/
AAAAcLUSSx6IACAYgBFNFKQRSAQ4IVgpUPvRD0xgcAEgIHAOSAFoSxubCgLQYWBpHAFgBksegHC9
CEgAIQFwAkgAKADQAXBwR8BGAAAAAAgCAAQA/AMCwAEAAGD/AwIgJwAD8LVTTCB4ACg70FJPuIvA
BzfRUkgAKAHQASEBcHhoUEmIQgvRYXgAKSvQACFhcE1KEWBJShFwTEl5YCLgS0mIQh/RACBgcPiN
QAoa00hNKHgAKBbRR0jAeAAoEtFGSMB9RksA8HP4ACgL0ADwRvj/KAfQoHABIChwQUhQIUFLAPBl
+GNoAPBi+PC8AbwARxC1KCFBQzxMZBggiQAoENE7SwDwVPg6SwDwUfg6SwDwTvgBIAAhOEsA8En4
ASAggRC9NkjAiAAEF9QhSIF4NUpRcgEhQXAySwDwOfgzSwDwNvgySwDwM/gySwDwMPgaSAAhAXAY
SC9JQWAQvfC1/yYAJGQgYEMsTS0YKAALIQDwHPgAKBLQKAAtIQDwFvgAKAzR/y4A0SYADScoADkA
APAM+BMoB9ABNxEv9tEBNAYs39EwAPC9IADwvQAiHEsYR8BGYP8DAsAiAAP4JgADAAAAAKlYGwis
XQADyWAICF1eCAgsDwADkHUDAhhzAwL1WwgIj/wDArGPCggAXgADdUkNCJV0CQj1vAgI0bwKCNR/
AwJ5wwoIyM4DAjVdCAi5nwsIUY8KCJFGEgjsRAICGaUGCA==`)],
      ...romPayloads(decodeBase64(`FAQSACwAAAAEAMDG0wC7yNPRwr/Mv//////////////////////////////////////K5tnn5wDM
AOjjAMDG0///////////////////////////////////yubZ5+cAzADj6ejY4+Pm5wDo4wDAxtMA
6OMA1f///////////////+jj6+IA7ePptOrZAOrd593o2di4AOLjAMLH///////////////////i
2dnY2ditANDd593oAOjc2QDY2eDd6tnm7eHV4v//////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFowAACB+vAAAIRbsFowAACB+8AAAIALsFowAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2tAAAIZm4UCCENgAAAuwGZAAAIIxUPAAMzAb3cAAAIZm1obAK9FgEA
CGZuFAghDYABALsBmQAACCMVDwADRAG9NAEACGZtaGwCvUsBAAhmbWhsAr1fAQAIZm1obALR1eLo
AOjjAMDG0wDr3ejcAOjc2QDk5tnn5wDj2gDMuP7i4wDCxwDi2dnY2dis/77j4tmrAMnp6Njj4+bn
uADk5tnn5wDMAOjjAMDG063+w+gA4NXn6OcA6eLo3eAA7ePpAObZ59norf/AxtMA693o3ADMAN3n
AOPirf7F2dnkAN3oAOPirP/MAOLjAODj4tvZ5gDj5Nni5wDAxtOt/73j4dkA1tXX3wDV4u0A6N3h
2av/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/
AAAAcLUSSx6IACAYgBFNFKQRSAQ4IVgpUPvRD0xgcAEgIHAOSAFoSxubCgLQYWBpHAFgBksegHC9
CEgAIQFwAkgAKADQAXBwR8BGdfEDAggCAAQA/AMCwAEAAGD/AwJQNQAD8LVTTCB4ACg70FJPuIvA
BzfRUkgAKAHQASEBcHhoUEmIQgvRYXgAKSvQACFhcE1KEWBJShFwTEl5YCLgS0mIQh/RACBgcPiN
QAoa00hNKHgAKBbRR0jAeAAoEtFGSMB9RksA8HP4ACgL0ADwRvj/KAfQoHABIChwQUhQIUFLAPBl
+GNoAPBi+PC8AbwARxC1KCFBQzxMZBggiQAoENE7SwDwVPg6SwDwUfg6SwDwTvgBIAAhOEsA8En4
ASAggRC9NkjAiAAEF9QhSIF4NUpRcgEhQXAySwDwOfgzSwDwNvgySwDwM/gySwDwMPgaSAAhAXAY
SC9JQWAQvfC1/yYAJGQgYEMsTS0YKAALIQDwHPgAKBLQKAAtIQDwFvgAKAzR/y4A0SYADScoADkA
APAM+BMoB9ABNxEv9tEBNAYs39EwAPC9IADwvQAiHEsYR8BGYP8DAvAwAAMoNQADdfEDArFKEggg
UAAD3WcFCLVlBQicDwADeHADAvxtAwL9YQUIj/wDAh10BwiQUAAD7YIJCHWJBgiBxwUIGagHCLh6
AwIFsAcIoLADAvFjBQhlfggIvXMHCPlODAiEQgIC6fsDCA==`), {
        'BPRE 1.1': decodeBase64(`dAEBAagEAilLsAQF8WcFCMnEBAIRYswEATHUBA0BgwkIiYkGCJXHBQgt6AQBGfAEDgVkBQh5fggI
  0XMHCA1PBAUB/Q==`),
        'BPGE 1.0': decodeBase64(`XAEBR6gEAYnUBAHB4AQC7afoBALZr/QEATn8BAHN`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQGoBAIBS7AEBfFnBQjJxAQCEWLMBAEx1AQN1YIJCImJBgiVxwUIAegEAu2v8AQNBWQF
  CE1+CAjRcwcI4QQFAf0=`),
      }),
    },
  },
  {
    id: 'custom-reusable-tms',
    label: 'Reusable TMs',
    description: 'Teaching a move with a TM no longer uses the TM up, as in later games, so one TM can teach as many Pokémon as you like. HMs work as before, and selling a TM at a shop still sells it. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset, or to turn it off.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`FQSJAC0AAAAYAMy/z827vMa/AM7H5//////////////////////////////////////O2dXX3ADV
AM7HANXb1d3iANXi2ADV29Xd4v//////////////////ztnV19zd4tsA1QDh4+rZAOvd6NwA1QDO
xwDi4////////////////+Dj4tvZ5gDp59nnAOjc2QDOxwDp5K0A0N3n3ej////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFowAACB+vAAAIRbsFowAACB+8AAAIALsFowAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2tAAAIZm4UCCENgAAAuwGZAAAII6UOAAMzAb3RAAAIZm1obAK9DAEA
CGZuFAghDYABALsBmQAACCOlDgADRAG9NQEACGZtaGwCvUwBAAhmbWhsAr1gAQAIZm1obALN3NXg
4ADDAOHV39kA7ePp5gDOx+cA4NXn6P7a4+bZ6tnmrP++4+LZqwDO2dXX3N3i2wDVAOHj6tkA6+Pi
tOgA6efZ/unkAOjc2QDOxwDp4ujd4ADt4+kA5tnn2eit/9Pj6eYAzsfnAODV5+gA2uPm2erZ5q3+
xdnZ5ADd6ADo3NXoAOvV7az/zsfnANvZ6ADp59nYAOnkANXb1d3irf+94+HZANbV198A1eLtAOjd
4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt
/wAAcLUPSx6IACAYgA5NEaQOSAQ4IVgpUPvRDExgcAEgIHALSAFoSxubCgLQYWBpHAFgA0segHC9
BUgAIQFwcEfARggCAAQA/AMCkAAAAGD/AwIgJwAD8LUaTCB4ACgp0BlPuIvAByXReGgXSYhCANAL
4BZNECYWSShoiEIC0Sh5ACgF0Sg1AT720QAgYHAR4BFIAIoAKA3RYHgAKArRDkgAiA5JQRoyKQTS
ASFhcAxLAPAG+GNoAPAD+PC8AbwARxhHYP8DAsAiAAOxARsIAF4AA2FvGwjIzgMCfM4DAiEBAAAp
aQ0I`)],
      ...romPayloads(decodeBase64(`FQSJAC0AAAAYAMy/z827vMa/AM7H5//////////////////////////////////////O2dXX3ADV
AM7HANXb1d3iANXi2ADV29Xd4v//////////////////ztnV19zd4tsA1QDh4+rZAOvd6NwA1QDO
xwDi4////////////////+Dj4tvZ5gDp59nnAOjc2QDOxwDp5K0A0N3n3ej////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFowAACB+vAAAIRbsFowAACB+8AAAIALsFowAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2tAAAIZm4UCCENgAAAuwGZAAAIIxUPAAMzAb3RAAAIZm1obAK9DAEA
CGZuFAghDYABALsBmQAACCMVDwADRAG9NQEACGZtaGwCvUwBAAhmbWhsAr1gAQAIZm1obALN3NXg
4ADDAOHV39kA7ePp5gDOx+cA4NXn6P7a4+bZ6tnmrP++4+LZqwDO2dXX3N3i2wDVAOHj6tkA6+Pi
tOgA6efZ/unkAOjc2QDOxwDp4ujd4ADt4+kA5tnn2eit/9Pj6eYAzsfnAODV5+gA2uPm2erZ5q3+
xdnZ5ADd6ADo3NXoAOvV7az/zsfnANvZ6ADp59nYAOnkANXb1d3irf+94+HZANbV198A1eLtAOjd
4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt
/wAAcLUPSx6IACAYgA5NEaQOSAQ4IVgpUPvRDExgcAEgIHALSAFoSxubCgLQYWBpHAFgA0segHC9
BUgAIQFwcEfARggCAAQA/AMCtAAAAGD/AwJQNQAD8LUgTCB4ACg00B9PuIvABzDReGgdSYhCBtAj
SYhCEtAiSYhCD9AL4BlNECYZSShoiEIC0Sh5ACgK0Sg1AT720QAgYHAW4BpIAGgAKBLQA+ARSACK
ACgN0WB4ACgK0Q9IAIgPSUEaMikE0gEhYXANSwDwBvhjaADwA/jwvAG8AEcYR8BGYP8DAvAwAAOh
6xEIkFAAA/VcEgigsAMCMK0DAiEBAACFoAkISU4SCP1OEgiQsAMC`), {
        'BPRE 1.1': decodeBase64(`dAEBAcgDAhns0AMCbV3gAwqZoAkIwU4SCHVP`),
        'BPGE 1.0': decodeBase64(`XAEBR8gDAXnQAwHN4AMJWaAJCCFOEgjV`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHIAwHx0AMCRV3gAwptoAkImU4SCE1P`),
      }),
    },
  },
  {
    id: 'custom-wishmkr-jirachi',
    label: 'Jirachi (WISHMKR Event)',
    description: 'A Jirachi like the one the Pokémon Colosseum Bonus Disc gave in North America: level 5, OT WISHMKR, ID 20043, from Ruby, knowing Wish, Confusion and Rest and holding a Salac or Ganlon Berry. Its nature, IVs and berry are rolled the way the disc rolled them, so it can even be shiny, as a few from the disc were. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`FgSZAS4AAAAMANHDzcLHxcwAxMPMu73Cw//////////////////////////////////O3NkAvMnI
z80AvsPNvQDb3dro////////////////////////////ztzZAOvd59yu2+bV4ujd4tsAxMPMu73C
wwDj2v///////////////+jc2QC9ycbJzc2/z8cAvMnIz80AvsPNva3////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFmAAACB+vAAAIRbsFmAAACB+8AAAIALsFmAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBhAAACCOlDgADJgEhDYACALsBjgAACCnkATFyAb2iAAAIZjJtIQ2AAQC7AXoAAAho
bAK9twAACGZtaGwCveEAAAhmbWhsAr0OAQAIZm1obAK9PgEACGZtaGwC/QEA5tnX2d3q2dgAxMPM
u73Cw6v/0+Pp5gDk1ebo7QDd5wDa6eDguADn4wDd6ADr2eLo/ujjAOjc2QDKva3/zNnX2d3q2QDo
3N3nANfV5tgA1dvV3eIA2uPm/tXi4+jc2eYAxMPMu73Cw6v/ztzZ5tm05wDi4wDm4+PhANrj5gDd
6ADd4gDt4+nm/uTV5ujtAOPmAOjc2QDKvav/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc
3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/8LWGsE5LAPCZ+AYENgwA8If4BwQA8IT4B0MA8IH4RARk
DADwffhABIAIBEMElADwd/gFAAGXASAAkAEgApBDSAOQQ0hDSQUiACNDTADwd/gHIUyiAPBs+AAg
MSEA8Gb4/yAjIQDwYvgCICUhAPBe+CgAAyEG3wEhCECqIQgaDCEA8FT4ACUFIWlDBJjIQB8hCEAn
IUkZAPBJ+AE1Bi3y0QAlK0g5oWoAiVoqAC1MAPBG+AE1BC300SVIK0wA8D/4ACVkIGhDKUkMGCAA
CyEAIiNLAPAz+AAoCNABNQYt8NEbSCRMAPAr+AcACeAYSWAiiFigUAQ6+9UBNR1IBXAAJwIvCdAc
SAIhHEwA8Bj4GkgDIRpMAPAT+BlIB4AGsPC9CEhwQwhJRhgwDHBHBZAFqgC1B0gJSwDwAfgAvRhH
IEfN9QYIbU7GQXNgAABLTgAAREcCApkBAABNewYIrawGCBmlBgj1kQYIDY0GCOxEAgLpRAICkbQG
CIEBAABlBgwI8HUDAtHDzcLHxcz/EQFdAJwAAAA=`)],
      ...romPayloads(decodeBase64(`FgSZAS4AAAAMANHDzcLHxcwAxMPMu73Cw//////////////////////////////////O3NkAvMnI
z80AvsPNvQDb3dro////////////////////////////ztzZAOvd59yu2+bV4ujd4tsAxMPMu73C
wwDj2v///////////////+jc2QC9ycbJzc2/z8cAvMnIz80AvsPNva3////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmAAACB+vAAAIRbsFmAAACB+8AAAIALsFmAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhAAACCMVDwADJgEhDYACALsBjgAACCnYAzEBAb2iAAAIZjJtIQ2AAQC7AXoAAAho
bAK9twAACGZtaGwCveEAAAhmbWhsAr0OAQAIZm1obAK9PgEACGZtaGwC/QEA5tnX2d3q2dgAxMPM
u73Cw6v/0+Pp5gDk1ebo7QDd5wDa6eDguADn4wDd6ADr2eLo/ujjAOjc2QDKva3/zNnX2d3q2QDo
3N3nANfV5tgA1dvV3eIA2uPm/tXi4+jc2eYAxMPMu73Cw6v/ztzZ5tm05wDi4wDm4+PhANrj5gDd
6ADd4gDt4+nm/uTV5ujtAOPmAOjc2QDKvav/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc
3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/8LWGsE5LAPCZ+AYENgwA8If4BwQA8IT4B0MA8IH4RARk
DADwffhABIAIBEMElADwd/gFAAGXASAAkAEgApBDSAOQQ0hDSQUiACNDTADwd/gHIUyiAPBs+AAg
MSEA8Gb4/yAjIQDwYvgCICUhAPBe+CgAAyEG3wEhCECqIQgaDCEA8FT4ACUFIWlDBJjIQB8hCEAn
IUkZAPBJ+AE1Bi3y0QAlK0g5oWoAiVoqAC1MAPBG+AE1BC300SVIK0wA8D/4ACVkIGhDKUkMGCAA
CyEAIiNLAPAz+AAoCNABNQYt8NEbSCRMAPAr+AcACeAYSWAiiFigUAQ6+9UBNR1IBXAAJwIvCdAc
SAIhHEwA8Bj4GkgDIRpMAPAT+BlIB4AGsPC9CEhwQwhJRhgwDHBHBZAFqgC1B0gJSwDwAfgAvRhH
IEfJTgQIbU7GQXNgAABLTgAALEACApkBAABV2gMIfQMECOn7Awhl6QMIfeQDCIRCAgIpQAICkQsE
CIEBAAB1jggI0HADAtHDzcLHxcz/EQFdAJwAAAA=`), {
        'BPRE 1.1': decodeBase64(`dAEBAQQEAd0cBBFp2gMIkQMECP37Awh56QMIkTgEAaVABAGJ`),
        'BPGE 1.0': decodeBase64(`XAEBR0AEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEEBAHdHAQRadoDCJEDBAj9+wMIeekDCJE4BAGlQAQBXQ==`),
      }),
    },
  },
  {
    id: 'custom-10-aniv-celebi',
    label: 'Celebi (10 ANIV Event)',
    description: 'A Celebi like the one the 2006 Pokémon 10th Anniversary “Journey Across America” tour gave: level 70, OT 10 ANIV, ID 00010, from Ruby, knowing Ancient Power, Future Sight, Baton Pass and Perish Song. Its nature, IVs and OT gender are rolled the way the tour rolled them, never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`FwT7AC8AAAAEAKKhALvIw9AAvb/Gv7zD///////////////////////////////////O3NkAoqHo
3AC74uLd6tnm59Xm7QDb3dro////////////////////ztzZAL2/xr+8wwDj2gDo3NkAo6GhpwCi
oejc/////////////////7vi4t3q2ebn1ebtAOjj6eYA49oAu+HZ5t3X1a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFmAAACB+vAAAIRbsFmAAACB+8AAAIALsFmAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBhAAACCOlDgADJgEhDYACALsBjgAACCnkATFyAb2iAAAIZjJtIQ2AAQC7AXoAAAho
bAK9tgAACGZtaGwCveAAAAhmbWhsAr0MAQAIZm1obAK9PAEACGZtaGwC/QEA5tnX2d3q2dgAvb/G
v7zDq//T4+nmAOTV5ujtAN3nANrp4OC4AOfjAN3oAOvZ4uj+6OMA6NzZAMq9rf/M2dfZ3erZAOjc
3ecA19Xm2ADV29Xd4gDa4+b+1eLj6NzZ5gC9v8a/vMOr/87c2ebZtOcA4uMA5uPj4QDa4+YA3egA
3eIA7ePp5v7k1ebo7QDj5gDo3NkAyr2r/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3n
AOrZ5ufd4+IA49oA6NzZANvV4dmt/wAA8LWGsFBLAPCd+AYENgwA8Iv4BwQA8Ij4B0M4DDkECQxI
QAohSEAIKALSCDf/CP8AAPB6+EQEZAwA8Hb4QASACARDBJQA8HD4BQABlwEgAJABIAKQP0gDkD9I
QElGIgAjP0wA8HD4ByFIogDwZfjoCQEhgUMIADEhAPBc+P8gIyEA8Fj4AiAlIQDwVPgAJQUhaUME
mMhAHyEIQCchSRkA8En4ATUGLfLRACUrSDmhagCJWioALUwA8Eb4ATUELfTRJUgrTADwP/gAJWQg
aEMpSQwYIAALIQAiI0sA8DP4ACgI0AE1Bi3w0RtIJEwA8Cv4BwAJ4BhJYCKIWKBQBDr71QE1HUgF
cAAnAi8J0BxIAiEcTADwGPgaSAMhGkwA8BP4GUgHgAaw8L0ISHBDCElGGDAMcEcFkAWqALUHSAlL
APAB+AC9GEcgR831BghtTsZBc2AAAAoAAABERwIC+wAAAE17BgitrAYIGaUGCPWRBggNjQYI7EQC
AulEAgKRtAYI+wAAAGUGDAjwdQMCoqEAu8jD0P/2APgA4gDDAA==`)],
      ...romPayloads(decodeBase64(`FwT7AC8AAAAEAKKhALvIw9AAvb/Gv7zD///////////////////////////////////O3NkAoqHo
3AC74uLd6tnm59Xm7QDb3dro////////////////////ztzZAL2/xr+8wwDj2gDo3NkAo6GhpwCi
oejc/////////////////7vi4t3q2ebn1ebtAOjj6eYA49oAu+HZ5t3X1a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmAAACB+vAAAIRbsFmAAACB+8AAAIALsFmAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhAAACCMVDwADJgEhDYACALsBjgAACCnYAzEBAb2iAAAIZjJtIQ2AAQC7AXoAAAho
bAK9tgAACGZtaGwCveAAAAhmbWhsAr0MAQAIZm1obAK9PAEACGZtaGwC/QEA5tnX2d3q2dgAvb/G
v7zDq//T4+nmAOTV5ujtAN3nANrp4OC4AOfjAN3oAOvZ4uj+6OMA6NzZAMq9rf/M2dfZ3erZAOjc
3ecA19Xm2ADV29Xd4gDa4+b+1eLj6NzZ5gC9v8a/vMOr/87c2ebZtOcA4uMA5uPj4QDa4+YA3egA
3eIA7ePp5v7k1ebo7QDj5gDo3NkAyr2r/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3n
AOrZ5ufd4+IA49oA6NzZANvV4dmt/wAA8LWGsFBLAPCd+AYENgwA8Iv4BwQA8Ij4B0M4DDkECQxI
QAohSEAIKALSCDf/CP8AAPB6+EQEZAwA8Hb4QASACARDBJQA8HD4BQABlwEgAJABIAKQP0gDkD9I
QElGIgAjP0wA8HD4ByFIogDwZfjoCQEhgUMIADEhAPBc+P8gIyEA8Fj4AiAlIQDwVPgAJQUhaUME
mMhAHyEIQCchSRkA8En4ATUGLfLRACUrSDmhagCJWioALUwA8Eb4ATUELfTRJUgrTADwP/gAJWQg
aEMpSQwYIAALIQAiI0sA8DP4ACgI0AE1Bi3w0RtIJEwA8Cv4BwAJ4BhJYCKIWKBQBDr71QE1HUgF
cAAnAi8J0BxIAiEcTADwGPgaSAMhGkwA8BP4GUgHgAaw8L0ISHBDCElGGDAMcEcFkAWqALUHSAlL
APAB+AC9GEcgR8lOBAhtTsZBc2AAAAoAAAAsQAIC+wAAAFXaAwh9AwQI6fsDCGXpAwh95AMIhEIC
AilAAgKRCwQI+wAAAHWOCAjQcAMCoqEAu8jD0P/2APgA4gDDAA==`), {
        'BPRE 1.1': decodeBase64(`dAEBAQwEAd0kBBFp2gMIkQMECP37Awh56QMIkUAEAaVIBAGJ`),
        'BPGE 1.0': decodeBase64(`XAEBR0gEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEMBAHdJAQRadoDCJEDBAj9+wMIeekDCJFABAGlSAQBXQ==`),
      }),
    },
  },
  {
    id: 'custom-master-ball',
    label: 'Master Ball',
    description: 'Gives a Master Ball, once per card; receive the card again for another. Original Master Ball event by Decryptu.',
    payloads: {
      emerald: [decodeBase64(`9wMjAA8AAAAAAMfTzc6/zNMAwcPAzv////////////////////////////////////+7AObZ5ODV
19nh2eLoAMe7zc6/zAC8u8bG////////////////////uwDHu83Ov8wAvLvGxgDd5wDj4gDd6OcA
69XtAOjj/////////////+bZ5ODV19kA6NzZAOPi2QDt4+kA6efZ2K3////////////////////O
1eDfAOjjAOjc2QDY2eDd6tnm7QDh1eIA4+IA6NzZ////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WivkAbsBZAAACL2AAAAIZm1oKkkBId5AAAC7ASsAAAi5WQAACL2kAAAIZm1oRgEAAQAhDYAAALsB
cQAACBoAgAEAGgGAAQAJABbeQAEAuVkAAAgp5AEpSQG5fgAACL3AAAAIZm1ouX4AAAi95wAACGZt
aLl+AAAIbAK7AMe7zc6/zAC8u8bGANjZ4N3q2ebtANzV5wDV5ubd6tnYq//T4+kA5tnX2d3q2dgA
1QDHu83Ov8wAvLvGxqv/0+PpANXg5tnV2O0A1+Pg4NnX6NnYAOjc2QDHu83Ov8wAvLvGxq3/yOMA
5uPj4asAx9Xf2QDn5NXX2bgA6NzZ4v7X4+HZANbV19+t/w==`)],
      frlg: [decodeBase64(`9wMjAA8AAAAAAMfTzc6/zNMAwcPAzv////////////////////////////////////+7AObZ5ODV
19nh2eLoAMe7zc6/zAC8u8bG////////////////////uwDHu83Ov8wAvLvGxgDd5wDj4gDd6OcA
69XtAOjj/////////////+bZ5ODV19kA6NzZAOPi2QDt4+kA6efZ2K3////////////////////O
1eDfAOjjAOjc2QDY2eDd6tnm7QDh1eIA4+IA6NzZ////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WivYA7sBZAAACL2AAAAIZm1oKrYCIbZAAAC7ASsAAAi5WQAACL2kAAAIZm1oRgEAAQAhDYAAALsB
cQAACBoAgAEAGgGAAQAJABa2QAEAuVkAAAgp2AMptgK5fgAACL3AAAAIZm1ouX4AAAi95wAACGZt
aLl+AAAIbAK7AMe7zc6/zAC8u8bGANjZ4N3q2ebtANzV5wDV5ubd6tnYq//T4+kA5tnX2d3q2dgA
1QDHu83Ov8wAvLvGxqv/0+PpANXg5tnV2O0A1+Pg4NnX6NnYAOjc2QDHu83Ov8wAvLvGxq3/yOMA
5uPj4asAx9Xf2QDn5NXX2bgA6NzZ4v7X4+HZANbV19+t/w==`)],
    },
  },
];
