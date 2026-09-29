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
    label: 'Slow Down 0.5× (Press R)',
    description: 'Press R and the whole game runs at half speed; press R again to play normally. R works anywhere, and the speed stays as you set it until you press it again. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`7QNlAAUAAAAAAMK7xsAAzcq/v77////////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADjwC9XgAACGZtaGwCvZ0AAAhmbWhsAsrm2efnAMwA6OMA5ODV7QDV6ADc1eDaAOfk
2dnYq/7K5tnn5wDMANXb1d3iAOjjAOTg1e0A4uPm4dXg4O2t/87c3ecA293a6ADY49nn4rToAOvj
5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wBwtQDwHvgeiAAgGIAQTRSkEEgEOALU
IVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkD0ApLGWBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEfA
RgD8AwIMAgAAICcAA7j9AwIwtXNIBIh0SAFoATEBYHpIACgB0AEhAXAA8H34APCI+GVLAPB3+AEg
BEIn0WxMZKUA8Cf4a0xkpQDwI/hsSAB4ACgb0GVIICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDAB
OfHRXEhBaAExQWBZTAAsBNBSSwDwTvgBPPjnMLwBvABHALVaSAB4AChB0AAsP9BVSEFoamiRQjrR
AWgqaJFCNtFSScmIyQsy0QDwfvhTSQApENBIStJoUwAbGItCCtlFSAFpATEBYdEIATFSGgDVACLC
YBzgAbRDSAAhwYUBhitoAPAX+EBIQWhraJlCDtEA8BD4APBZ+AK8QBoA1eQwNUrQYJFoATGRYAE8
vucBsAG8AEcYRzZKNkgAiMBDwAXAD1F4UHCIQxF4QUARcHBHELUpSEFpACkG0CtKEWCBaVFgACFB
YYFhLkkAKSnQKEgCeAAqJdAgSMJpATKKQgDTACLCYQAqHNEfSxxoFEqUQgPRXGgTSpRCB9AcaBJK
lEIP0VxoEUqUQgvRGErSiNILB9ERSBxoRGFcaIRhGkwcYFxgELwBvABHcEcVSACIoDgA1eQwcEfA
RjkHAAh5RwAIBV4ICF1eCAjxngMIIYQDCNwiAAMAAAAAYP8DArABAgIAAAAAAAAAAMAiAAPUfwMC
gP8DAjABAAQAAAAA5AAAAAYAAAQCAAAAqf0DAg==`)],
      ...romPayloads(decodeBase64(`6gNlAAIAAAAAAMK7xsAAzcq/v77////////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADjwC9XgAACGZtaGwCvZ0AAAhmbWhsAsrm2efnAMwA6OMA5ODV7QDV6ADc1eDaAOfk
2dnYq/7K5tnn5wDMANXb1d3iAOjjAOTg1e0A4uPm4dXg4O2t/87c3ecA293a6ADY49nn4rToAOvj
5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wBwtQDwHvgeiAAgGIAQTRSkEEgEOALU
IVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkD0ApLGWBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEfA
RgD8AwIMAgAAUDUAA7j9AwIwtXNIBIh0SAFoATEBYHpIACgB0AEhAXAA8H34APCI+GVLAPB3+AEg
BEIn0WxMZKUA8Cf4a0xkpQDwI/hsSAB4ACgb0GVIICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDAB
OfHRXEhBaAExQWBZTAAsBNBSSwDwTvgBPPjnMLwBvABHALVaSAB4AChB0AAsP9BVSEFoamiRQjrR
AWgqaJFCNtFSScmIyQsy0QDwfvhTSQApENBIStJoUwAbGItCCtlFSAFpATEBYdEIATFSGgDVACLC
YBzgAbRDSAAhwYUBhitoAPAX+EBIQWhraJlCDtEA8BD4APBZ+AK8QBoA1eQwNUrQYJFoATGRYAE8
vucBsAG8AEcYRzZKNkgAiMBDwAXAD1F4UHCIQxF4QUARcHBHELUpSEFpACkG0CtKEWCBaVFgACFB
YYFhLkkAKSnQKEgCeAAqJdAgSMJpATKKQgDTACLCYQAqHNEfSxxoFEqUQgPRXGgTSpRCB9AcaBJK
lEIP0VxoEUqUQgvRGErSiNILB9ERSBxoRGFcaIRhGkwcYFxgELwBvABHcEcVSACIoDgA1eQwcEfA
RiUHAAjpLQAINWUFCLVlBQjlIwEIAREBCAwxAAMAAAAAYP8DAjQAAgIAAAAAAAAAAPAwAAO4egMC
gP8DAjABAAR18QMC5AAAAAYAAAQCAAAAqf0DAg==`), {
        'BPRE 1.1': decodeBase64(`dAEBATwEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE8BBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
      }),
    },
  },
  {
    id: 'custom-speed-0-75',
    label: 'Slow Down 0.75× (Press R)',
    description: 'Press R and the whole game runs at three-quarter speed; press R again to play normally. R works anywhere, and the speed stays as you set it until you press it again. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`7gNlAAYAAAAAAKGtqKa5AM3Kv7++///////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADkwC9XgAACGZtaGwCvZ8AAAhmbWhsAsrm2efnAMwA6OMA5ODV7QDVAODd6Ojg2QDn
4OPr2ear/srm2efnAMwA1dvV3eIA6OMA5ODV7QDi4+bh1eDg7a3/ztzd5wDb3droANjj2efitOgA
6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AAAAcLUA8B74HogAIBiAEE0UpBBI
BDgC1CFYKVD65w5IAWgqH0sbmwoB0RFoAOARYAApA9AKSxlgaRwBYADwAvgegHC9giObAAQiEgab
GHBHwEYA/AMCDAIAACAnAAO4/QMCMLVzSASIdEgBaAExAWB6SAAoAdABIQFwAPB9+ADwiPhlSwDw
d/gBIARCJ9FsTGSlAPAn+GtMZKUA8CP4bEgAeAAoG9BlSCAhwn4AKgfQgnkDeppCA9HCeUN6mkIO
0CQwATnx0VxIQWgBMUFgWUwALATQUksA8E74ATz45zC8AbwARwC1WkgAeAAoQdAALD/QVUhBaGpo
kUI60QFoKmiRQjbRUknJiMkLMtEA8H74U0kAKRDQSErSaFMAGxiLQgrZRUgBaQExAWHRCAExUhoA
1QAiwmAc4AG0Q0gAIcGFAYYraADwF/hASEFoa2iZQg7RAPAQ+ADwWfgCvEAaANXkMDVK0GCRaAEx
kWABPL7nAbABvABHGEc2SjZIAIjAQ8AFwA9ReFBwiEMReEFAEXBwRxC1KUhBaQApBtArShFggWlR
YAAhQWGBYS5JACkp0ChIAngAKiXQIEjCaQEyikIA0wAiwmEAKhzRH0scaBRKlEID0VxoE0qUQgfQ
HGgSSpRCD9FcaBFKlEIL0RhK0ojSCwfREUgcaERhXGiEYRpMHGBcYBC8AbwAR3BHFUgAiKA4ANXk
MHBHwEY5BwAIeUcACAVeCAhdXggI8Z4DCCGEAwjcIgADAAAAAGD/AwKwAQICAAAAAAAAAADAIgAD
1H8DAoD/AwIwAQAEAAAAAOQAAAAGAAAEBAAAAKn9AwI=`)],
      ...romPayloads(decodeBase64(`6wNlAAMAAAAAAKGtqKa5AM3Kv7++///////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADkwC9XgAACGZtaGwCvZ8AAAhmbWhsAsrm2efnAMwA6OMA5ODV7QDVAODd6Ojg2QDn
4OPr2ear/srm2efnAMwA1dvV3eIA6OMA5ODV7QDi4+bh1eDg7a3/ztzd5wDb3droANjj2efitOgA
6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AAAAcLUA8B74HogAIBiAEE0UpBBI
BDgC1CFYKVD65w5IAWgqH0sbmwoB0RFoAOARYAApA9AKSxlgaRwBYADwAvgegHC9giObAAQiEgab
GHBHwEYA/AMCDAIAAFA1AAO4/QMCMLVzSASIdEgBaAExAWB6SAAoAdABIQFwAPB9+ADwiPhlSwDw
d/gBIARCJ9FsTGSlAPAn+GtMZKUA8CP4bEgAeAAoG9BlSCAhwn4AKgfQgnkDeppCA9HCeUN6mkIO
0CQwATnx0VxIQWgBMUFgWUwALATQUksA8E74ATz45zC8AbwARwC1WkgAeAAoQdAALD/QVUhBaGpo
kUI60QFoKmiRQjbRUknJiMkLMtEA8H74U0kAKRDQSErSaFMAGxiLQgrZRUgBaQExAWHRCAExUhoA
1QAiwmAc4AG0Q0gAIcGFAYYraADwF/hASEFoa2iZQg7RAPAQ+ADwWfgCvEAaANXkMDVK0GCRaAEx
kWABPL7nAbABvABHGEc2SjZIAIjAQ8AFwA9ReFBwiEMReEFAEXBwRxC1KUhBaQApBtArShFggWlR
YAAhQWGBYS5JACkp0ChIAngAKiXQIEjCaQEyikIA0wAiwmEAKhzRH0scaBRKlEID0VxoE0qUQgfQ
HGgSSpRCD9FcaBFKlEIL0RhK0ojSCwfREUgcaERhXGiEYRpMHGBcYBC8AbwAR3BHFUgAiKA4ANXk
MHBHwEYlBwAI6S0ACDVlBQi1ZQUI5SMBCAERAQgMMQADAAAAAGD/AwI0AAICAAAAAAAAAADwMAAD
uHoDAoD/AwIwAQAEdfEDAuQAAAAGAAAEBAAAAKn9AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBAUAEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQFABBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
      }),
    },
  },
  {
    id: 'custom-speed-2',
    label: 'Fast Forward 2× (Press R)',
    description: 'Press R and the game runs at double speed, including walking, battles and text; press R again to play normally. R works anywhere, and the speed stays as you set it until you press it again. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`8wNlAAsAAAAAAL7Jz7zGvwDNyr+/vv/////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADiwC9XgAACGZtaGwCvZgAAAhmbWhsAsrm2efnAMwA2uPmANjj6dbg2QDn5NnZ2Kv+
yubZ5+cAzADV29Xd4gDo4wDk4NXtAOLj5uHV4ODtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAHC1APAe+B6IACAYgBBNFKQQSAQ4AtQhWClQ
+ucOSAFoKh9LG5sKAdERaADgEWAAKQPQCksZYGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwR8BGAPwD
AgwCAAAgJwADuP0DAjC1c0gEiHRIAWgBMQFgekgAKAHQASEBcADwffgA8Ij4ZUsA8Hf4ASAEQifR
bExkpQDwJ/hrTGSlAPAj+GxIAHgAKBvQZUggIcJ+ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFc
SEFoATFBYFlMACwE0FJLAPBO+AE8+OcwvAG8AEcAtVpIAHgAKEHQACw/0FVIQWhqaJFCOtEBaCpo
kUI20VJJyYjJCzLRAPB++FNJACkQ0EhK0mhTABsYi0IK2UVIAWkBMQFh0QgBMVIaANUAIsJgHOAB
tENIACHBhQGGK2gA8Bf4QEhBaGtomUIO0QDwEPgA8Fn4ArxAGgDV5DA1StBgkWgBMZFgATy+5wGw
AbwARxhHNko2SACIwEPABcAPUXhQcIhDEXhBQBFwcEcQtSlIQWkAKQbQK0oRYIFpUWAAIUFhgWEu
SQApKdAoSAJ4ACol0CBIwmkBMopCANMAIsJhACoc0R9LHGgUSpRCA9FcaBNKlEIH0BxoEkqUQg/R
XGgRSpRCC9EYStKI0gsH0RFIHGhEYVxohGEaTBxgXGAQvAG8AEdwRxVIAIigOADV5DBwR8BGOQcA
CHlHAAgFXggIXV4ICPGeAwghhAMI3CIAAwEAAABg/wMCsAECAgEAAAABAAAAwCIAA9R/AwKA/wMC
MAEABAAAAADkAAAABgAABAAAAACp/QMC`)],
      ...romPayloads(decodeBase64(`7gNlAAYAAAAAAL7Jz7zGvwDNyr+/vv/////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADiwC9XgAACGZtaGwCvZgAAAhmbWhsAsrm2efnAMwA2uPmANjj6dbg2QDn5NnZ2Kv+
yubZ5+cAzADV29Xd4gDo4wDk4NXtAOLj5uHV4ODtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAHC1APAe+B6IACAYgBBNFKQQSAQ4AtQhWClQ
+ucOSAFoKh9LG5sKAdERaADgEWAAKQPQCksZYGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwR8BGAPwD
AgwCAABQNQADuP0DAjC1c0gEiHRIAWgBMQFgekgAKAHQASEBcADwffgA8Ij4ZUsA8Hf4ASAEQifR
bExkpQDwJ/hrTGSlAPAj+GxIAHgAKBvQZUggIcJ+ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFc
SEFoATFBYFlMACwE0FJLAPBO+AE8+OcwvAG8AEcAtVpIAHgAKEHQACw/0FVIQWhqaJFCOtEBaCpo
kUI20VJJyYjJCzLRAPB++FNJACkQ0EhK0mhTABsYi0IK2UVIAWkBMQFh0QgBMVIaANUAIsJgHOAB
tENIACHBhQGGK2gA8Bf4QEhBaGtomUIO0QDwEPgA8Fn4ArxAGgDV5DA1StBgkWgBMZFgATy+5wGw
AbwARxhHNko2SACIwEPABcAPUXhQcIhDEXhBQBFwcEcQtSlIQWkAKQbQK0oRYIFpUWAAIUFhgWEu
SQApKdAoSAJ4ACol0CBIwmkBMopCANMAIsJhACoc0R9LHGgUSpRCA9FcaBNKlEIH0BxoEkqUQg/R
XGgRSpRCC9EYStKI0gsH0RFIHGhEYVxohGEaTBxgXGAQvAG8AEdwRxVIAIigOADV5DBwR8BGJQcA
COktAAg1ZQUItWUFCOUjAQgBEQEIDDEAAwEAAABg/wMCNAACAgEAAAABAAAA8DAAA7h6AwKA/wMC
MAEABHXxAwLkAAAABgAABAAAAACp/QMC`), {
        'BPRE 1.1': decodeBase64(`dAEBATgEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE4BBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
      }),
    },
  },
  {
    id: 'custom-speed-3',
    label: 'Fast Forward 3× (Press R)',
    description: 'Press R and the game runs up to three times as fast, including walking, battles and text; press R again to play normally. R works anywhere, and the speed stays as you set it until you press it again. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`9ANlAAwAAAAAAM7Mw8rGvwDNyr+/vv/////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADiwC9XgAACGZtaGwCvZgAAAhmbWhsAsrm2efnAMwA2uPmAOjm3eTg2QDn5NnZ2Kv+
yubZ5+cAzADV29Xd4gDo4wDk4NXtAOLj5uHV4ODtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAHC1APAe+B6IACAYgBBNFKQQSAQ4AtQhWClQ
+ucOSAFoKh9LG5sKAdERaADgEWAAKQPQCksZYGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwR8BGAPwD
AgwCAAAgJwADuP0DAjC1c0gEiHRIAWgBMQFgekgAKAHQASEBcADwffgA8Ij4ZUsA8Hf4ASAEQifR
bExkpQDwJ/hrTGSlAPAj+GxIAHgAKBvQZUggIcJ+ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFc
SEFoATFBYFlMACwE0FJLAPBO+AE8+OcwvAG8AEcAtVpIAHgAKEHQACw/0FVIQWhqaJFCOtEBaCpo
kUI20VJJyYjJCzLRAPB++FNJACkQ0EhK0mhTABsYi0IK2UVIAWkBMQFh0QgBMVIaANUAIsJgHOAB
tENIACHBhQGGK2gA8Bf4QEhBaGtomUIO0QDwEPgA8Fn4ArxAGgDV5DA1StBgkWgBMZFgATy+5wGw
AbwARxhHNko2SACIwEPABcAPUXhQcIhDEXhBQBFwcEcQtSlIQWkAKQbQK0oRYIFpUWAAIUFhgWEu
SQApKdAoSAJ4ACol0CBIwmkBMopCANMAIsJhACoc0R9LHGgUSpRCA9FcaBNKlEIH0BxoEkqUQg/R
XGgRSpRCC9EYStKI0gsH0RFIHGhEYVxohGEaTBxgXGAQvAG8AEdwRxVIAIigOADV5DBwR8BGOQcA
CHlHAAgFXggIXV4ICPGeAwghhAMI3CIAAwIAAABg/wMCsAECAgIAAAACAAAAwCIAA9R/AwKA/wMC
MAEABAAAAADkAAAABgAABAAAAACp/QMC`)],
      ...romPayloads(decodeBase64(`7wNlAAcAAAAAAM7Mw8rGvwDNyr+/vv/////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADiwC9XgAACGZtaGwCvZgAAAhmbWhsAsrm2efnAMwA2uPmAOjm3eTg2QDn5NnZ2Kv+
yubZ5+cAzADV29Xd4gDo4wDk4NXtAOLj5uHV4ODtrf/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAHC1APAe+B6IACAYgBBNFKQQSAQ4AtQhWClQ
+ucOSAFoKh9LG5sKAdERaADgEWAAKQPQCksZYGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwR8BGAPwD
AgwCAABQNQADuP0DAjC1c0gEiHRIAWgBMQFgekgAKAHQASEBcADwffgA8Ij4ZUsA8Hf4ASAEQifR
bExkpQDwJ/hrTGSlAPAj+GxIAHgAKBvQZUggIcJ+ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFc
SEFoATFBYFlMACwE0FJLAPBO+AE8+OcwvAG8AEcAtVpIAHgAKEHQACw/0FVIQWhqaJFCOtEBaCpo
kUI20VJJyYjJCzLRAPB++FNJACkQ0EhK0mhTABsYi0IK2UVIAWkBMQFh0QgBMVIaANUAIsJgHOAB
tENIACHBhQGGK2gA8Bf4QEhBaGtomUIO0QDwEPgA8Fn4ArxAGgDV5DA1StBgkWgBMZFgATy+5wGw
AbwARxhHNko2SACIwEPABcAPUXhQcIhDEXhBQBFwcEcQtSlIQWkAKQbQK0oRYIFpUWAAIUFhgWEu
SQApKdAoSAJ4ACol0CBIwmkBMopCANMAIsJhACoc0R9LHGgUSpRCA9FcaBNKlEIH0BxoEkqUQg/R
XGgRSpRCC9EYStKI0gsH0RFIHGhEYVxohGEaTBxgXGAQvAG8AEdwRxVIAIigOADV5DBwR8BGJQcA
COktAAg1ZQUItWUFCOUjAQgBEQEIDDEAAwIAAABg/wMCNAACAgIAAAACAAAA8DAAA7h6AwKA/wMC
MAEABHXxAwLkAAAABgAABAAAAACp/QMC`), {
        'BPRE 1.1': decodeBase64(`dAEBATgEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE4BBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
      }),
    },
  },
  {
    id: 'custom-speed-4',
    label: 'Fast Forward 4× (Press R)',
    description: 'Press R and the game runs up to four times as fast, including walking, battles and text; press R again to play normally. R works anywhere, and the speed stays as you set it until you press it again. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset. Original speed-up event by Decryptu.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`+gNlABIAAAAAAKW5AM3Kv7++///////////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADjwC9XgAACGZtaGwCvZwAAAhmbWhsAsrm2efnAMwA6OMA5+TZ2dgA6NzZANvV4dkA
6eSr/srm2efnAMwA1dvV3eIA6OMA5ODV7QDi4+bh1eDg7a3/ztzd5wDb3droANjj2efitOgA6+Pm
3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AABwtQDwHvgeiAAgGIAQTRSkEEgEOALU
IVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkD0ApLGWBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEfA
RgD8AwIMAgAAICcAA7j9AwIwtXNIBIh0SAFoATEBYHpIACgB0AEhAXAA8H34APCI+GVLAPB3+AEg
BEIn0WxMZKUA8Cf4a0xkpQDwI/hsSAB4ACgb0GVIICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDAB
OfHRXEhBaAExQWBZTAAsBNBSSwDwTvgBPPjnMLwBvABHALVaSAB4AChB0AAsP9BVSEFoamiRQjrR
AWgqaJFCNtFSScmIyQsy0QDwfvhTSQApENBIStJoUwAbGItCCtlFSAFpATEBYdEIATFSGgDVACLC
YBzgAbRDSAAhwYUBhitoAPAX+EBIQWhraJlCDtEA8BD4APBZ+AK8QBoA1eQwNUrQYJFoATGRYAE8
vucBsAG8AEcYRzZKNkgAiMBDwAXAD1F4UHCIQxF4QUARcHBHELUpSEFpACkG0CtKEWCBaVFgACFB
YYFhLkkAKSnQKEgCeAAqJdAgSMJpATKKQgDTACLCYQAqHNEfSxxoFEqUQgPRXGgTSpRCB9AcaBJK
lEIP0VxoEUqUQgvRGErSiNILB9ERSBxoRGFcaIRhGkwcYFxgELwBvABHcEcVSACIoDgA1eQwcEfA
RjkHAAh5RwAIBV4ICF1eCAjxngMIIYQDCNwiAAMEAAAAYP8DArABAgIDAAAAAwAAAMAiAAPUfwMC
gP8DAjABAAQAAAAA5AAAAAYAAAQAAAAAqf0DAg==`)],
      ...romPayloads(decodeBase64(`8ANlAAgAAAAAAKW5AM3Kv7++///////////////////////////////////////////MAOjp5uLn
AN3oAOPiANXi2ADj2tqr////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFVAAACB+vAAAIRbsFVAAACB+8AAAIALsFVAAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADjwC9XgAACGZtaGwCvZwAAAhmbWhsAsrm2efnAMwA6OMA5+TZ2dgA6NzZANvV4dkA
6eSr/srm2efnAMwA1dvV3eIA6OMA5ODV7QDi4+bh1eDg7a3/ztzd5wDb3droANjj2efitOgA6+Pm
3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AABwtQDwHvgeiAAgGIAQTRSkEEgEOALU
IVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkD0ApLGWBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEfA
RgD8AwIMAgAAUDUAA7j9AwIwtXNIBIh0SAFoATEBYHpIACgB0AEhAXAA8H34APCI+GVLAPB3+AEg
BEIn0WxMZKUA8Cf4a0xkpQDwI/hsSAB4ACgb0GVIICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDAB
OfHRXEhBaAExQWBZTAAsBNBSSwDwTvgBPPjnMLwBvABHALVaSAB4AChB0AAsP9BVSEFoamiRQjrR
AWgqaJFCNtFSScmIyQsy0QDwfvhTSQApENBIStJoUwAbGItCCtlFSAFpATEBYdEIATFSGgDVACLC
YBzgAbRDSAAhwYUBhitoAPAX+EBIQWhraJlCDtEA8BD4APBZ+AK8QBoA1eQwNUrQYJFoATGRYAE8
vucBsAG8AEcYRzZKNkgAiMBDwAXAD1F4UHCIQxF4QUARcHBHELUpSEFpACkG0CtKEWCBaVFgACFB
YYFhLkkAKSnQKEgCeAAqJdAgSMJpATKKQgDTACLCYQAqHNEfSxxoFEqUQgPRXGgTSpRCB9AcaBJK
lEIP0VxoEUqUQgvRGErSiNILB9ERSBxoRGFcaIRhGkwcYFxgELwBvABHcEcVSACIoDgA1eQwcEfA
RiUHAAjpLQAINWUFCLVlBQjlIwEIAREBCAwxAAMEAAAAYP8DAjQAAgIDAAAAAwAAAPAwAAO4egMC
gP8DAjABAAR18QMC5AAAAAYAAAQAAAAAqf0DAg==`), {
        'BPRE 1.1': decodeBase64(`dAEBATwEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE8BBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
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
RgD8AwLgAQAAICcAA5D9AwIwtWlIBIhqSAFoATEBYG9IACgB0AEhAXAA8Hf4XEsA8HP4ASAEQiPR
Y0xbpQDwI/hiTFulAPAf+F5IICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDABOfHRVUhBaAExQWBS
TAAsBNBLSwDwTvgBPPjnMLwBvABHALVTSAB4AChB0AAsP9BOSEFoamiRQjrRAWgqaJFCNtFLScmI
yQsy0QDwcfhLSQApENBBStJoUwAbGItCCtk+SAFpATEBYdEIATFSGgDVACLCYBzgAbQ8SAAhwYUB
hitoAPAX+DlIQWhraJlCDtEA8BD4APBM+AK8QBoA1eQwLkrQYJFoATGRYAE8vucBsAG8AEcYRxC1
KEhBaQApBtAqShFggWlRYAAhQWGBYS1JACkp0CdIAngAKiXQH0jCaQEyikIA0wAiwmEAKhzRH0sc
aBRKlEID0VxoE0qUQgfQHGgSSpRCD9FcaBFKlEIL0RdK0ojSCwfREEgcaERhXGiEYRlMHGBcYBC8
AbwAR3BHE0gAiKA4ANXkMHBHOQcACHlHAAgFXggIXV4ICPGeAwghhAMI3CIAAwgAAABg/wMCsAEC
AgAAAAAAAAAAwCIAA9R/AwKA/wMCAAAAAOQAAAAGAAAEAAAAAIP9AwI=`)],
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
RgD8AwLgAQAAUDUAA5D9AwIwtWlIBIhqSAFoATEBYG9IACgB0AEhAXAA8Hf4XEsA8HP4ASAEQiPR
Y0xbpQDwI/hiTFulAPAf+F5IICHCfgAqB9CCeQN6mkID0cJ5Q3qaQg7QJDABOfHRVUhBaAExQWBS
TAAsBNBLSwDwTvgBPPjnMLwBvABHALVTSAB4AChB0AAsP9BOSEFoamiRQjrRAWgqaJFCNtFLScmI
yQsy0QDwcfhLSQApENBBStJoUwAbGItCCtk+SAFpATEBYdEIATFSGgDVACLCYBzgAbQ8SAAhwYUB
hitoAPAX+DlIQWhraJlCDtEA8BD4APBM+AK8QBoA1eQwLkrQYJFoATGRYAE8vucBsAG8AEcYRxC1
KEhBaQApBtAqShFggWlRYAAhQWGBYS1JACkp0CdIAngAKiXQH0jCaQEyikIA0wAiwmEAKhzRH0sc
aBRKlEID0VxoE0qUQgfQHGgSSpRCD9FcaBFKlEIL0RdK0ojSCwfREEgcaERhXGiEYRlMHGBcYBC8
AbwAR3BHE0gAiKA4ANXkMHBHJQcACOktAAg1ZQUItWUFCOUjAQgBEQEIDDEAAwgAAABg/wMCNAAC
AgAAAAAAAAAA8DAAA7h6AwKA/wMCAAAAAOQAAAAGAAAEAAAAAIP9AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBARQEFTkHAAj9LQAISWUFCMllBQj5IwEIFQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQEUBBU5BwAI/S0ACEllBQjJZQUI+SMBCBU=`),
      }),
    },
  },
  {
    id: 'custom-travel-anywhere',
    label: 'Travel Anywhere (Fly with R, Run & Bike Indoors)',
    description: 'Press R outdoors to open the Fly map, with no Pokémon that knows Fly and no badge needed, and fly to any town you’ve visited with the usual animation. It works wherever Fly does: on foot, on a bike or surfing, but not indoors, in caves or during a cutscene. B closes the map. You can also run and ride your Bike everywhere, indoors and in caves included, once you have the Running Shoes or a Bike. In FireRed and LeafGreen, L still opens the Help menu. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset, or to turn it off.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`FAQSACwAAAAEAM7Mu9C/xgC7yNPRwr/Mv//////////////////////////////////AxtMA693o
3ADMuAC8w8W/AN3i2OPj5uf/////////////////////yubZ5+cAzADj6ejY4+Pm5wDo4wDAxtO4
AOLj/////////////////8LHAOLZ2djZ2LgA1eLYAObp4gDV4tgAvMPFv//////////////////V
4u3r3Nnm2a0A0N3n3egA6NzZANjZ4N3q2ebt4dXi////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFowAACB+vAAAIRbsFowAACB+8AAAIALsFowAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2tAAAIZm4UCCENgAAAuwGZAAAII6UOAAM/Ab3jAAAIZm1obAK9HQEA
CGZuFAghDYABALsBmQAACCOlDgADUAG9QAEACGZtaGwCvVcBAAhmbWhsAr1rAQAIZm1obALN3NXg
4ADDAODZ6ADt4+kAwMbTAOvd6NwAzADV4tj+5uniANXi2AC8w8W/ANXi7evc2ebZrP++4+LZqwDJ
6ejY4+Pm57gA5ObZ5+cAzADo4wDAxtOt/sPoAODV5+jnAOni6N3gAO3j6QDm2efZ6K3/zubV6tng
ANXi7evc2ebZAN3nAOPirf7F2dnkAN3oAOPirP+81dffAOjjAOLj5uHV4ADo5tXq2eCr/73j4dkA
1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj
2gDo3NkA29Xh2a3/AAAAcLUSSx6IACAYgBFNFKQRSAQ4IVgpUPvRD0xgcAEgIHAOSAFoSxubCgLQ
YWBpHAFgBksegHC9CEgAIQFwAkgAKADQAXBwR8BGAAAAAAgCAAQA/AMCyAEAAGD/AwIgJwAD8LVV
TCB4AChA0FRPuIvABzzRVEgAKAHQASEBcHhoUkmIQgvRYXgAKTDQACFhcE9KEWBLShFwTkl5YCfg
TUmIQiTRT0mIfgUiEEOIdgAgYHD4jUAKGtNITSh4ACgW0UdIwHgAKBLRRkjAfUZLAPBz+AAoC9AA
8Eb4/ygH0KBwASAocEFIUCFBSwDwZfhjaADwYvjwvAG8AEcQtSghQUM8TGQYIIkAKBDROksA8FT4
OksA8FH4OUsA8E74ASAAIThLAPBJ+AEgIIEQvTZIwIgABBfUIUiBeDVKUXIBIUFwMksA8Dn4MksA
8Db4MksA8DP4MUsA8DD4GkgAIQFwF0gvSUFgEL3wtf8mACRkIGBDLE0tGCgACyEA8Bz4ACgS0CgA
LSEA8Bb4ACgM0f8uANEmAA0nKAA5AADwDPgTKAfQATcRL/bRATQGLN/RMADwvSAA8L0AIhtLGEdg
/wMCwCIAA/gmAAMAAAAAqVgbCKxdAAPJYAgIXV4ICCwPAAOQdQMCGHMDAvVbCAiZ/AMCsY8KCABe
AAN1SQ0IlXQJCPW8CAjRvAoI1H8DAnnDCgjIzgMCNV0ICLmfCwhRjwoIkUYSCOxEAgIZpQYI`)],
      ...romPayloads(decodeBase64(`FAQSACwAAAAEAM7Mu9C/xgC7yNPRwr/Mv//////////////////////////////////AxtMA693o
3ADMuAC8w8W/AN3i2OPj5uf/////////////////////yubZ5+cAzADj6ejY4+Pm5wDo4wDAxtO4
AOLj/////////////////8LHAOLZ2djZ2LgA1eLYAObp4gDV4tgAvMPFv//////////////////V
4u3r3Nnm2a0A0N3n3egA6NzZANjZ4N3q2ebt4dXi////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFowAACB+vAAAIRbsFowAACB+8AAAIALsFowAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2tAAAIZm4UCCENgAAAuwGZAAAIIxUPAAM/Ab3jAAAIZm1obAK9HQEA
CGZuFAghDYABALsBmQAACCMVDwADUAG9QAEACGZtaGwCvVcBAAhmbWhsAr1rAQAIZm1obALN3NXg
4ADDAODZ6ADt4+kAwMbTAOvd6NwAzADV4tj+5uniANXi2AC8w8W/ANXi7evc2ebZrP++4+LZqwDJ
6ejY4+Pm57gA5ObZ5+cAzADo4wDAxtOt/sPoAODV5+jnAOni6N3gAO3j6QDm2efZ6K3/zubV6tng
ANXi7evc2ebZAN3nAOPirf7F2dnkAN3oAOPirP+81dffAOjjAOLj5uHV4ADo5tXq2eCr/73j4dkA
1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj
2gDo3NkA29Xh2a3/AAAAcLUSSx6IACAYgBFNFKQRSAQ4IVgpUPvRD0xgcAEgIHAOSAFoSxubCgLQ
YWBpHAFgBksegHC9CEgAIQFwAkgAKADQAXBwR8BGdfEDAggCAAQA/AMCzAEAAGD/AwJQNQAD8LVW
TCB4AChC0FVPuIvABz7RVUgAKAHQASEBcHhoU0mIQgvRYXgAKTLQACFhcFBKEWBMShFwT0l5YCng
TkmIQibRUElIfgIiEENIdgEgCHYAIGBw+I1AChrTSE0oeAAoFtFHSMB4ACgS0UZIwH1GSwDwc/gA
KAvQAPBG+P8oB9CgcAEgKHBBSFAhQUsA8GX4Y2gA8GL48LwBvABHELUoIUFDPExkGCCJACgQ0TpL
APBU+DpLAPBR+DlLAPBO+AEgACE4SwDwSfgBICCBEL02SMCIAAQX1CFIgXg1SlFyASFBcDJLAPA5
+DJLAPA2+DJLAPAz+DFLAPAw+BpIACEBcBdIL0lBYBC98LX/JgAkZCBgQyxNLRgoAAshAPAc+AAo
EtAoAC0hAPAW+AAoDNH/LgDRJgANJygAOQAA8Az4EygH0AE3ES/20QE0Bizf0TAA8L0gAPC9ACIb
SxhHYP8DAvAwAAMoNQADdfEDArFKEgggUAAD3WcFCLVlBQicDwADeHADAvxtAwL9YQUInfwDAh10
BwiQUAAD7YIJCHWJBgiBxwUIGagHCLh6AwIFsAcIoLADAvFjBQhlfggIvXMHCPlODAiEQgIC6fsD
CA==`), {
        'BPRE 1.1': decodeBase64(`dAEBAcAEAilLyAQF8WcFCMncBAIRYuQEATHsBA0BgwkIiYkGCJXHBQgtAAUBGQgFDgVkBQh5fggI
  0XMHCA1PHAUB/Q==`),
        'BPGE 1.0': decodeBase64(`XAEBR8AEAYnsBAHB+AQC7acABQLZrwwFATkUBQHN`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHABAIBS8gEBfFnBQjJ3AQCEWLkBAEx7AQN1YIJCImJBgiVxwUIAQAFAu2vCAUNBWQF
  CE1+CAjRcwcI4RwFAf0=`),
      }),
    },
  },
  {
    id: 'custom-no-encounters',
    label: 'No Wild Encounters & Repel',
    description: 'Choose which wild Pokémon stay away: ALL OF THEM, until the game is turned off or reset (fishing, Rock Smash and Sweet Scent still find Pokémon); the WEAKER ONES, with a Repel that lasts 65,535 steps and is saved with your game; or NONE, which brings them all back.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`/AMpABQAAAAcAMjJAL/IvcnPyM6/zM0ALQDMv8q/xv/////////////////////////R3eDYAMrJ
xRvHyci4AOfo1e0A1evV7av/////////////////////xdnZ5ADV4OAA693g2ADKycUbx8nIANXr
1e24/////////////////+PmAOPi4O0A6NzZAOvZ1d/Z5gDj4tnnrQDQ3efd6P/////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFtgAACB+vAAAIRbsFtgAACB+8AAAIALsFtgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73AAAAIZiOlDgADXQEnIQ2AAQC7AYIAAAghDYACALsBlwAACCENgAAAuwWsAAAIEQEAjAMC
veUAAAhmbWhsAhEAAIwDAhYhQP//vRQBAAhmbWhsAhEAAIwDAhYhQAAAvToBAAhmbWhsAr1bAQAI
Zm1obAK9bwEACGZtaGwC0dzd19wA693g2ADKycUbx8nIAOfc4+ng2P7n6NXtANXr1e2s/8jj4tkA
693g4ADV5OTZ1eYA6eLo3eAA7ePp/ujp5uIA49raAO3j6eYA29Xh2a3/xt3f2QDVAMy/yr/GAOjc
1egA4NXn6Of+p6a4pqSmAOfo2eTnq//R3eDYAMrJxRvHycgA1ebZANbV198A6OP+4uPm4dXgq/+9
4+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd
4+IA49oA6NzZANvV4dmt/wAAAAGgAyEKIkbgu8bGAMnAAM7Cv8f/0b+7xb/MAMnIv83/yMnIv/8A
wEbwtYWwDQAXACNOACMCyAAiBsYBM6tC+dEfThwgwBsAIToAawAeTADwIfgHAAAhHUwA8Bz4OAAp
ADIAG0wA8Bb4OAApAAAiGUwA8BD4ACAZTADwDPgAICkAOgACIxRMAPAF+A5I/yEBgAWw8L0gRxC1
iLAAI5wAbEQgYAR4ATD/LPvRAzCACIAAATOLQvLRaEb/97b/CLAQvbD7AwLwdQMCHSoOCFV4GQiN
lRkIcZUZCL0fDgi9mRkI`)],
      ...romPayloads(decodeBase64(`/AMpABQAAAAcAMjJAL/IvcnPyM6/zM0ALQDMv8q/xv/////////////////////////R3eDYAMrJ
xRvHyci4AOfo1e0A1evV7av/////////////////////xdnZ5ADV4OAA693g2ADKycUbx8nIANXr
1e24/////////////////+PmAOPi4O0A6NzZAOvZ1d/Z5gDj4tnnrQDQ3efd6P/////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFtgAACB+vAAAIRbsFtgAACB+8AAAIALsFtgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73AAAAIZiMVDwADXQEnIQ2AAQC7AYIAAAghDYACALsBlwAACCENgAAAuwWsAAAIEQHchgMC
veUAAAhmbWhsAhEA3IYDAhYgQP//vRQBAAhmbWhsAhEA3IYDAhYgQAAAvToBAAhmbWhsAr1bAQAI
Zm1obAK9bwEACGZtaGwC0dzd19wA693g2ADKycUbx8nIAOfc4+ng2P7n6NXtANXr1e2s/8jj4tkA
693g4ADV5OTZ1eYA6eLo3eAA7ePp/ujp5uIA49raAO3j6eYA29Xh2a3/xt3f2QDVAMy/yr/GAOjc
1egA4NXn6Of+p6a4pqSmAOfo2eTnq//R3eDYAMrJxRvHycgA1ebZANbV198A6OP+4uPm4dXgq/+9
4+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd
4+IA49oA6NzZANvV4dmt/wAAAAGgAyEKIlbgu8bGAMnAAM7Cv8f/0b+7xb/MAMnIv83/yMnIv/8A
wEbwtYWwDQAXACtOACMCyAAiBsYBM6tC+dEnThwgwBsAIToALaNsHhtdJUwA8C/4BwAAISRMAPAq
+A4hAJEBlQKWACEDkQIhBJE4AAgiAiMeTADwHPgOIQCRAZUAIQKROAACIQAiAiMZTADwEPgAICkA
OgACIxZMAPAJ+AAgFUwA8AX4Dkj/IQGABbDwvSBHELWIsAAjnABsRCBgBHgBMP8s+9EDMIAIgAAB
M4tC8tFoRv/3pv8IsBC9sPsDAtBwAwJV1gkIUXcPCOn7EAjZ9xAIGcwJCKVnDwgCBAYHCQsNDg==`), {
        'BPRE 1.1': decodeBase64(`dAEBAeADFmnWCQjJdw8IYfwQCFH4EAgtzAkIHWg=`),
        'BPGE 1.0': decodeBase64(`XAEBR+ADFSnWCQgpdw8IwfsQCLH3EAjtywkIfQ==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHgAxU91gkIoXcPCDn8EAgp+BAIAcwJCPU=`),
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
    id: 'custom-mass-outbreak',
    label: 'Mass Outbreak of a Rare Pokémon',
    description: 'Choose one of eight rare Pokémon of Hoenn: Ralts, Plusle, Skarmory, Kecleon, Tropius, Absol, Chimecho or Mawile. For the next two days it makes up half of the wild Pokémon in the grass or cave where it lives, as with the TV’s outbreak news, at the level and with the moves a wild one there has.',
    roms: ['BPEE 1.0'],
    payloads: {
      emerald: [decodeBase64(`IgR4AToAAAAYAMe7zc0Ayc/OvMy/u8X////////////////////////////////////M1ebZAMrJ
xRvHyci4ANnq2ebt69zZ5tmr////////////////////zejV5ugA1QDn69Xm4QDj2gDVAObV5tkA
wsm/yMj//////////////8rJxRvHycgA69zZ5tkA3egA4N3q2eetANDd593o///////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFdwAACB+vAAAIRbsFdwAACB+8AAAIALsFdwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72BAAAIZiOlDgAD2QAnIQ2AfwC7AW0AAAgjpQ4AA/IAvZ0AAAhmbWhsAr3ZAAAIZm1obAK9
7QAACGZtaGwC0dzd19wAysnFG8fJyADn3OPp4NgA5+vV5uGs/87c2ebZtOcA1QDh1efnAOPp6Nbm
2dXfAOPa/v0CAOPiAP0Dq/vD6ADg1efo5wDa4+YA6OvjANjV7eet/73j4dkA1tXX3wDV4u0A6N3h
2av/ztzd5wDb3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/
AAC1iLAzoAAhAogLI1pDKUvSGGtGWlAGMAQxICn00WhGCCEJIgDwbvgIsAC9cLUdSACIBiFIQyek
JBggiCF5HksA8C74GE0taBhILRggiCiA4HiocKB46HAgeShxACYUSA0hiRkVSwDwG/hxAGkYCIEB
NgQu89EyIGh0AiBoghBIIYgRSwDwDPigeOF4D0sA8Af4AX0LSAAiDUsA8AH4cL0YR8BG8HUDAoxd
AAOQKwAAREcCAsiFMQhpTgsIGaUGCMQcAgLEHQICFbkGCJFKCAhtRRIIiAEAEQQAYQEAGQ0A4wAA
HBAAPQEAIhkAcQEAIhsAeAEAIxsAmwEYFhwAYwEYLCYA8LWFsA0AFwAZTgAjAsgAIgbGATOrQvnR
FU4cIMAbACE6AGsAFEwA8CH4BwAAIRNMAPAc+DgAKQAyABFMAPAW+DgAKQAAIg9MAPAQ+AAgD0wA
8Az4ACApADoAAiMKTADwBfgESP8hAYAFsPC9IEfARrD7AwLwdQMCHSoOCFV4GQiNlRkIcZUZCL0f
Dgi9mRkI`)],
    },
  },
  {
    id: 'custom-feebas-finder',
    label: 'Feebas Finder (Route 119)',
    description: 'Wherever you fish on Route 119, the tile you fish becomes one of Feebas’s six hidden spots, so half of your bites there are Feebas, as at a real Feebas spot. It lasts until the game is turned off or reset; talk to the deliveryman again to turn it off.',
    roms: ['BPEE 1.0'],
    payloads: {
      emerald: [decodeBase64(`IwRIATsAAAAMAMC/v7y7zQDAw8i+v8z////////////////////////////////////A3efcANXi
7evc2ebZAOPiAMzJz86/AKKiqv//////////////////wL+/vLvNANbd6NnnAOvc2ebZ6tnmAO3j
6QDa3efc/////////////+PiAMzJz86/AKKiqq0A0N3n3egA6NzZ///////////////////////Y
2eDd6tnm7eHV4gDj4gDo3NkAo+LYANrg4+Pm////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFowAACB+vAAAIRbsFowAACB+8AAAIALsFowAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2tAAAIZm4UCCENgAAAuwGZAAAII6UOAANbAb3mAAAIZm1obAK9KAEA
CGZuFAghDYABALsBmQAACCOlDgADbAG9TQEACGZtaGwCvXUBAAhmbWhsAr2JAQAIZm1obALN3NXg
4ADDANbm3eLbAMC/v7y7zQDo4wDZ6tnm7f7a3efc3eLbAOfk4+gA4+IAzMnPzr8AoqKqrP++4+LZ
qwC91efoANUA5uPYANXi7evc2ebZAOPi/szJz86/AKKiqq0Aw+gA4NXn6OcA6eLo3eAA7ePpAObZ
59norf/O3NkAwL+/vLvNAMDDyL6/zADd5wDj4q3+xdnZ5ADd6ADj4qz/wL+/vLvNAN3nANbV198A
3eIA3ejnAOfd7P7c3djY2eIA5+Tj6Oet/73j4dkA1tXX3wDV4u0A6N3h2av/ztzd5wDb3droANjj
2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/AHC1D0seiAAgGIAOTRGk
DkgEOCFYKVD70QxMYHABICBwC0gBaEsbmwoC0GFgaRwBYANLHoBwvQVIACEBcHBHwEYIAgAEAPwD
AggBAABg/wMCICcAA3C1MkwgeAAoIdAxSICLwAcd0TBNECYwSShoiEIC0Sh5ACgE0Sg1AT720WZw
D+BgeAAoDNEpSABogIgpSYhCBtEBIGBwJ0hQISdLAPA++GNoAPA7+HC8AbwAR3C1g7ACkGhGAaki
SwDwMPhqRgAj0F4HOAQj0V4HOQAiLikD2wEiXCkA2wIiG0sA8B/4BCgW0xlOsEIA0QAgBQAAJBdI
YEMXSUAYAAwxAAbfqUID0AE0IAzz0APgCUgAaBJJRFICmApLAPAC+AOwcL0YR2D/AwLAIgADAF4A
A8HICAiMXQADACIAAFv8AwKxjwoInZAKCGm6CAjFSAsIvwEAAG1OxkE5MAAAai4AAA==`)],
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
    id: 'custom-instant-eggs',
    label: 'Instant Egg Hatch & Day Care Egg',
    description: 'Hatches every Egg in your party on the spot, each with the usual hatching scene and nickname prompt. With no Eggs to hatch, or if you say no, the deliveryman offers to have the Day Care’s Egg ready right away, when the two Pokémon there can have one.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`+AOcARAAAAAEAMPIzc67yM4Av8HBzf/////////////////////////////////////C1ejX3ADi
4+u4AOPmANvZ6ADj4tkA4uPr////////////////////wtXo19wA6NzZAL/Bwc0A7ePpANfV5ubt
uADj5v///////////////9vZ6ADo3NkAvrvTAL27zL+05wC/wcEA5t3b3Oj////////////////V
69XtrQDQ3efd6ADo3NkA2Nng3erZ5u3h1eL/////////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsF9QAACB+vAAAIRbsF9QAACB+8AAAIALsF9QAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADIwIhDYAAALsBngAACL3/AAAIZm4UCCENgAAAuwGeAAAIaCOlDgADmAK4cQAACCOl
DgADFgIhDYAAALsBlAAACCXFACcoEAC5dgAACL01AQAIZm1obAK9TQEACGZuFAghDYAAALsB6wAA
CCuGALsB1wAACCOlDgADBQIhDYAAALsB4QAACL2HAQAIZm1obAK9sgEACGZtaGwCveMBAAhmbWhs
Ar0bAgAIZm1obAK9LwIACGZtaGwC0+PpANzV6tkAv8HBzQDr3ejcAO3j6av+zdzV4OAAwwDc1ejX
3ADo3NnhAObd29zoAOLj66z/ztXf2QDb4+PYANfV5tkA49oA6NzZ4av/zdzV4OAAwwDc1erZAOjc
2QC+u9MAvbvMv7Tn/r/BwQDm2dXY7QDa4+YA7ePpAObd29zoANXr1e2s/87c2QC+u9MAvbvMvwDc
1ecA1eIAv8HB/ubZ1djtANrj5gDt4+kA4uPrq//O3NkAvrvTAL27zL8A1eDm2dXY7QDc1ecA1eL+
v8HBAOvV3ejd4tsA2uPmAO3j6av/xtnV6tkA6OvjAMrJxRvHycgA6NzV6ADb2ej+1eDj4tsA1egA
6NzZAL670wC9u8y/ANrd5ufoq/+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rTo
AOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAACBIACEBOQGAHUgAIQYiw3xb
B1sPBisA0QExZDABOvbRGUgBgHBHF0saiAEyEgQSDGQhUUMSSEAYBioK0sF8SQdJDwYpAtBkMAEy
9ecagAEgAOAAIAxJCIBwRwC1C0gAaAtJQBgLSwDwCfgAKAPQCksA8AT4ASAESQiAAL0YR8BG7EQC
AuB1AwLwdQMCjF0AAzAwAABNDQcI4QEHCAdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBH
jF0AAzA3AAAA/AMC`)],
      ...romPayloads(decodeBase64(`+AOcARAAAAAEAMPIzc67yM4Av8HBzf/////////////////////////////////////C1ejX3ADi
4+u4AOPmANvZ6ADj4tkA4uPr////////////////////wtXo19wA6NzZAL/Bwc0A7ePpANfV5ubt
uADj5v///////////////9vZ6ADo3NkAvrvTAL27zL+05wC/wcEA5t3b3Oj////////////////V
69XtrQDQ3efd6ADo3NkA2Nng3erZ5u3h1eL/////////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF9QAACB+vAAAIRbsF9QAACB+8AAAIALsF9QAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADIwIhDYAAALsBngAACL3/AAAIZm4UCCENgAAAuwGeAAAIaCMVDwADmAK4cQAACCMV
DwADFgIhDYAAALsBlAAACCXCACcoEAC5dgAACL01AQAIZm1obAK9TQEACGZuFAghDYAAALsB6wAA
CCtmArsB1wAACCMVDwADBQIhDYAAALsB4QAACL2HAQAIZm1obAK9sgEACGZtaGwCveMBAAhmbWhs
Ar0bAgAIZm1obAK9LwIACGZtaGwC0+PpANzV6tkAv8HBzQDr3ejcAO3j6av+zdzV4OAAwwDc1ejX
3ADo3NnhAObd29zoAOLj66z/ztXf2QDb4+PYANfV5tkA49oA6NzZ4av/zdzV4OAAwwDc1erZAOjc
2QC+u9MAvbvMv7Tn/r/BwQDm2dXY7QDa4+YA7ePpAObd29zoANXr1e2s/87c2QC+u9MAvbvMvwDc
1ecA1eIAv8HB/ubZ1djtANrj5gDt4+kA4uPrq//O3NkAvrvTAL27zL8A1eDm2dXY7QDc1ecA1eL+
v8HBAOvV3ejd4tsA2uPmAO3j6av/xtnV6tkA6OvjAMrJxRvHycgA6NzV6ADb2ej+1eDj4tsA1egA
6NzZAL670wC9u8y/ANrd5ufoq/+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rTo
AOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAACBIACEBOQGAHUgAIQYiw3xb
B1sPBisA0QExZDABOvbRGUgBgHBHF0saiAEyEgQSDGQhUUMSSEAYBioK0sF8SQdJDwYpAtBkMAEy
9ecagAEgAOAAIAxJCIBwRwC1C0gAaAtJQBgLSwDwCfgAKAPQCksA8AT4ASAESQiAAL0YR8BGhEIC
AsBwAwLQcAMCCFAAA4AvAABNZQQISVoECAdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBH
CFAAAyQ2AAAA/AMC`), {
        'BPRE 1.1': decodeBase64(`dAEBAUwEBWFlBAhd`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQFMBAVhZQQIXQ==`),
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
    id: 'custom-move-tutor',
    label: 'Move Relearner, Deleter & Tutor Reset',
    description: 'Teaches a Pokémon from your party a move it could have learned by level up, like the Move Relearner but free, or makes it forget any move, HMs included. It can also let every one-time move tutor teach its move again.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`EATrACgAAAAUAMfJ0L8AzL/Gv7vMyL/MAC0Avr/Gv86/zP////////////////////+74tgA6NzZ
AOjp6OPm5wDo2dXX3ADV29Xd4v//////////////////zNng2dXm4gDVAOHj6tm4ANrj5tvZ6ADj
4tm4/////////////////+PmAODZ6ADo3NkA4ePq2QDo6ejj5ucA6NnV19z////////////////V
29Xd4q0A0N3n3egA6NzZANjZ4N3q2ebt4dXi////////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFnQEACB+vAAAIRbsFnQEACB+8AAAIALsFnQEACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyOlDgADQwO4SgAACL2nAQAIZm4UCCENgAAAuwGZAAAIvfIBAAhmbSXeACchBIAGALsElgAA
CCVKASENgAEAuwEvAQAIIQWAAAC7ATkBAAgl4wAnaGwCvc8BAAhmbhQIIQ2AAAC7AVcBAAi98gEA
CGZtJaIAJyEEgAYAuwSWAAAIJUoBIQ2AAQC7AS8BAAh/AASAJeIAIQ2AAQC7AUMBAAi9DgIACGZt
lwEl3wAnlwAhBYAEALsBlgAACCXhAL0rAgAIZm4UCCENgAAAuwGTAQAIJQkCIQ2AAQC7AU0BAAgl
4AC9PgIACGZtaGwCvUwCAAhmbWhsAr1vAgAIZm1obAK9kwIACGZtaGwCvasCAAhmbWhsAr3bAgAI
Zm4UCCENgAAAuwGTAQAIKrEBKrIBKrMBKrQBKrUBKrYBKrcBKrgBKrkBKroBvRMDAAhmbWhsAr08
AwAIZm1obAK9UAMACGZtaGwCzdzV4OAAwwDc2eDkANUAysnFG8fJyP7m2eHZ4dbZ5gDVAOHj6tms
/8nmAOfc1eDgAMMA4dXf2QDj4tkA2uPm29no/tUA4ePq2az/0dzd19wAysnFG8fJyADn3OPp4NgA
3egA1tms/9Hc3dfcAOHj6tkA59zj6eDYAN3oANrj5tvZ6Kz/x9Xf2QD9AgDa4+bb2ej+/QOs//0C
ANrj5tvj6AD9A6v/u+IAv8HBANjj2efitOgA3+Lj6wDV4u3+4ePq2ecA7dnoq//O3Nnm2bTnAOLj
AOHj6tkA2uPmAN3oAOjj/ubZ4dnh1tnmrf/9AgDf4uPr5wDj4uDtAOPi2f7h4+rZq//D6LTnAOjc
2QDj4uDtAMrJxRvHycgA49oA7ePp5uf+6NzV6ADf4uPr5wDNz8zAq//J5gDn3NXg4ADDAODZ6ADo
3NkA4ePq2QDo6ejj5uf+6NnV19wA6NzZ3eYA4ePq2ecA1dvV3eKs/77j4tmrAL/q2ebtAOHj6tkA
6Ono4+YA693g4P7o2dXX3ADV29Xd4q3/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ
5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAAdIAGgHSUAYB0maaBIa
UhiaYPkikgAEOoNYi1D70XBHjF0AAzA3AAAA/AMC`)],
      ...romPayloads(decodeBase64(`EATrACgAAAAUAMfJ0L8AzL/Gv7vMyL/MAC0Avr/Gv86/zP////////////////////+74tgA6NzZ
AOjp6OPm5wDo2dXX3ADV29Xd4v//////////////////zNng2dXm4gDVAOHj6tm4ANrj5tvZ6ADj
4tm4/////////////////+PmAODZ6ADo3NkA4ePq2QDo6ejj5ucA6NnV19z////////////////V
29Xd4q0A0N3n3egA6NzZANjZ4N3q2ebt4dXi////////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFnQEACB+vAAAIRbsFnQEACB+8AAAIALsFnQEACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyMVDwADEwO4SgAACL2nAQAIZm4UCCENgAAAuwGZAAAIvfIBAAhmbSXbACchBIAGALsElgAA
CCVIASENgAEAuwEhAQAIIQWAAAC7ASsBAAgl4AAnaGwCvc8BAAhmbhQIIQ2AAAC7AT8BAAi98gEA
CGZtJZ8AJyEEgAYAuwSWAAAIJUgBIQ2AAQC7ASEBAAh/AASAJd8AIQ2AAQC7ATUBAAi9DgIACGZt
lwEl3AAnlwAhBYAEALsBlgAACCXeAL0rAgAIZm4UCCENgAAAuwGTAQAIJd0AvT4CAAhmbWhsAr1M
AgAIZm1obAK9bwIACGZtaGwCvZMCAAhmbWhsAr2rAgAIZm4UCCENgAAAuwGTAQAIKsACKsECKsIC
KsMCKsQCKsUCKsYCKscCKsgCKskCKsoCKssCKswCKs0CKs4CKt4CKt8CKuACveMCAAhmbWhsAr0M
AwAIZm1obAK9IAMACGZtaGwCzdzV4OAAwwDc2eDkANUAysnFG8fJyP7m2eHZ4dbZ5gDVAOHj6tms
/8nmAOfc1eDgAMMA4dXf2QDj4tkA2uPm29no/tUA4ePq2az/0dzd19wAysnFG8fJyADn3OPp4NgA
3egA1tms/9Hc3dfcAOHj6tkA59zj6eDYAN3oANrj5tvZ6Kz/x9Xf2QD9AgDa4+bb2ej+/QOs//0C
ANrj5tvj6AD9A6v/u+IAv8HBANjj2efitOgA3+Lj6wDV4u3+4ePq2ecA7dnoq//O3Nnm2bTnAOLj
AOHj6tkA2uPmAN3oAOjj/ubZ4dnh1tnmrf/9AgDf4uPr5wDj4uDtAOPi2f7h4+rZq//J5gDn3NXg
4ADDAODZ6ADo3NkA4ePq2QDo6ejj5uf+6NnV19wA6NzZ3eYA4ePq2ecA1dvV3eKs/77j4tmrAL/q
2ebtAOHj6tkA6Ono4+YA693g4P7o2dXX3ADV29Xd4q3/vePh2QDW1dffANXi7QDo3eHZq//O3N3n
ANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAAdIAGgH
SUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBHCFAAAyQ2AAAA/AMC`), {
        'BPRE 1.1': decodeBase64(`dAEBAQ==`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE=`),
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
    id: 'custom-physical-special-split',
    label: 'Gen 4 Physical/Special Split',
    description: 'Every damaging move is physical or special on its own, as from Diamond and Pearl on, instead of by its type: Fire Punch, Crunch and Dragon Claw hit with Attack, Shadow Ball, Hyper Beam and Sludge Bomb with Sp. Atk, and Hidden Power and Weather Ball are always special. Stat stages, Reflect and Light Screen, burns, Choice Band, Huge Power, Pure Power, Hustle’s boost, Guts, Counter and Mirror Coat follow the move’s kind too. In a link battle one Game Boy Advance runs the battle for both players, so use the card on both. It lasts until the game is turned off or reset; talk to the deliveryman again after a reset, or to turn it off.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`JgRlAT4AAAAcAMG/yAClAMrC083DvbvGus3Kv73Du8YAzcrGw87////////////////H4+rZ5wDc
3egA1ecA3eIA4NXo2eYA29Xh2ef/////////////////v9XX3ADh4+rZAN3nAOTc7efd19XgAOPm
/////////////////////+fk2dfd1eAA4+IA3ejnAOPr4rgA4uPoANbtAN3o5//////////////o
7eTZrQDQ3efd6ADo3NkA2Nng3erZ5u3h1eL/////////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFogAACB+vAAAIRbsFogAACB+8AAAIALsFogAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2sAAAIZm4UCCENgAAAuwGYAAAII6UOAAMHAb3NAAAIZm1obAK97QAA
CGZuFAghDYABALsBmAAACBEAYP8DAr0KAQAIZm1obAK9HwEACGZtaGwCvTMBAAhmbWhsAtHV4ugA
6NzZAOTc7efd19Xguufk2dfd1eD+5+Tg3eis/77j4tmrAMPoAODV5+jnAOni6N3gAO3j6QDm2efZ
6K3/ztzZAOfk4N3oAN3nAOPirf7F2dnkAN3oAOPirP+81dffAOjjAOjc2QDj4NgA69Xtq/+94+HZ
ANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA
49oA6NzZANvV4dmt/wAAADC1Ck0MpI8ggAAEOCFYKVD70QdMASAgcAZIAWhLG5sKAtBhY2kcAWAw
vcBGAPwDAmD/AwIgJwAD8LV0THROsIvABzvRYXgAKQHQAPCX+CB4ACgz0DBob0mIQi/RbkgAaAAo
K9FtSAdoeA4EKCbRbEgAiHShwgiJXAciAkDRQAElDUAMIUFDZ0hAGIZ4ZkgAaMF8OngAKQXQDCoB
0UsGAdQ/Jg5ACT72D65CB9AFKhbQwyoU0AwqBtAA4GFwY2vwvAG8hkYYR3l4WkgBKfbYANFXSAB4
oHAA8Iz4AiHt51RIAPBn+AYAIQA4MQDwaPhRSADwX/gHACEdAPBj+ADwZ/gALSPQcIjxjbopAdFB
CEAYICFxXCUpAdBKKQDRQAA3KQHRQgiAGPJsPikE0QAqBdBCCIAYAuDSBgDVQAgwgXB+MHe4iHiB
uH54dxXgMIlwgDB/cHZ4ibiAeH+4dgAg8Y26KQDR8IUgIrFcRCkA0LBU8WwQIpFD8WQBIZ7nALUA
IGBwAikR0ADwIvgqSADwEfgBACAdAPAV+CVIAPAK+AEAIAA4MADwC/gAvaB4APAh+AC9AHhYIUhD
HElAGHBHUCIA4DAiBDqDWItQ+9FwRxlIAHgZSQhcwAeADxhJQBgBiEoISkDSB9IPUwAaQ1FAAYBw
RxAhQUMSSAkYSmiLaEtgimAKe0t7C3NKc3BHYP8DAsAiAAPxngMIaEACAhRCAgLqQQICmMgxCJxE
AgKEQAICC0ICAgxCAgJ2QAICjkICAjxDAgL/3/7///8FAH8sAh/Mv/CnnfvV7/2f2Y/u+////Vc0
WoFP1o99/mawovnbUQAAwEY=`)],
      ...romPayloads(decodeBase64(`JgRlAT4AAAAcAMG/yAClAMrC083DvbvGus3Kv73Du8YAzcrGw87////////////////H4+rZ5wDc
3egA1ecA3eIA4NXo2eYA29Xh2ef/////////////////v9XX3ADh4+rZAN3nAOTc7efd19XgAOPm
/////////////////////+fk2dfd1eAA4+IA3ejnAOPr4rgA4uPoANbtAN3o5//////////////o
7eTZrQDQ3efd6ADo3NkA2Nng3erZ5u3h1eL/////////////////4+IAo8AA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFogAACB+vAAAIRbsFogAACB+8AAAIALsFogAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARx9g/wMCAbsBdAAACL2sAAAIZm4UCCENgAAAuwGYAAAIIxUPAAMHAb3NAAAIZm1obAK97QAA
CGZuFAghDYABALsBmAAACBEAYP8DAr0KAQAIZm1obAK9HwEACGZtaGwCvTMBAAhmbWhsAtHV4ugA
6NzZAOTc7efd19Xguufk2dfd1eD+5+Tg3eis/77j4tmrAMPoAODV5+jnAOni6N3gAO3j6QDm2efZ
6K3/ztzZAOfk4N3oAN3nAOPirf7F2dnkAN3oAOPirP+81dffAOjjAOjc2QDj4NgA69Xtq/+94+HZ
ANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA
49oA6NzZANvV4dmt/wAAADC1Ck0MpI8ggAAEOCFYKVD70QdMASAgcAZIAWhLG5sKAtBhY2kcAWAw
vcBGAPwDAmD/AwJQNQAD8LV0THROsIvABzvRYXgAKQHQAPCX+CB4ACgz0DBob0mIQi/RbkgAaAAo
K9FtSAdoeA4EKCbRbEgAiHShwgiJXAciAkDRQAElDUAMIUFDZ0hAGIZ4ZkgAaMF8OngAKQXQDCoB
0UsGAdQ/Jg5ACT72D65CB9AFKhbQwyoU0AwqBtAA4GFwY2vwvAG8hkYYR3l4WkgBKfbYANFXSAB4
oHAA8Iz4AiHt51RIAPBn+AYAIQA4MQDwaPhRSADwX/gHACEdAPBj+ADwZ/gALSPQcIjxjbopAdFB
CEAYICFxXCUpAdBKKQDRQAA3KQHRQgiAGPJsPikE0QAqBdBCCIAYAuDSBgDVQAgwgXB+MHe4iHiB
uH54dxXgMIlwgDB/cHZ4ibiAeH+4dgAg8Y26KQDR8IUgIrFcRCkA0LBU8WwQIpFD8WQBIZ7nALUA
IGBwAikR0ADwIvgqSADwEfgBACAdAPAV+CVIAPAK+AEAIAA4MADwC/gAvaB4APAh+AC9AHhYIUhD
HElAGHBHUCIA4DAiBDqDWItQ+9FwRxlIAHgZSQhcwAeADxhJQBgBiEoISkDSB9IPUwAaQ1FAAYBw
RxAhQUMSSAkYSmiLaEtgimAKe0t7C3NKc3BHYP8DAvAwAAPlIwEIyDsCAnQ9AgJKPQICBAwlCOg/
AgLkOwICaz0CAmw9AgLWOwIC3j0CAow+AgL/3/7///8FAH8sAh/Mv/CnnfvV7/2f2Y/u+////Vc0
WoFP1o99/mawovnbUQAAwEY=`), {
        'BPRE 1.1': decodeBase64(`dAEBAdAEAfngBAF0`),
        'BPGE 1.0': decodeBase64(`XAEBR+AEAuAL`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHQBAH54AQBUA==`),
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
mmAAR72AAAAIZm0jpQ4AA0gCuFEAAAglogAnIQSABgC7BHQAAAgjpQ4AA20AZwDAAQJmbWhsAr2e
AAAIZm1obALR3N3X3ADKycUbx8nIAOfc4+ng2ADDAN7p2NvZrP/O3N3nANvd2ugA2OPZ5+K06ADr
4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf/wtYiwQkgAiGQhSEM/TCQYACUAJych
Bi0A0xQhSRkgAD1LAPBx+GkAakZQUgYtANM/GAE1DC3t0WpGF4MAIAeQOqU0TgAnKHgBNf0oEND/
KAbRB5kAKQPQDQAAJweX8ucwcAE2/yju0Qiw8LwBvABHKHgBNTAoINIQKBbSACgK0SAAAiEyACRL
APA++DB4/yjZ0AE2+ucgACBLAPA1+IAAH0kJWADwD/jN5xA4QADAGWlGCFoA8A/4xecwOAwnR0MH
lS+lv+cIeP8oA9AwcAExATb453BHMLUAJBKlKYgCNQEpC9AAIohCAtNAGgEy+ucUQ/PQoTIycAE2
7+ehMDBwATYwvAG8AEcYR8BG7EQCAuB1AwIAwAECGaUGCHHQBghQy2EI6ANkAAoAAQD9ALTnAOLV
6Onm2QDd5wD9Aa3+wtnm2QDV5tkA3ejnAMPQ57gA4+noAOPaAKSi8Pv9MPvD6OcAv9DnANXY2ADp
5ADo4wD9HADj2gCmoqHw+/0x/wDCygD9ELgAu87Ou73FAP0RuAC+v8C/yM2/AP0S/s3KrQC7zsUA
/RS4AM3KrQC+v8AA/RW4AM3Kv7++AP0T/8BGB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iLUPvR
cEeMXQADMDcAAAD8AwI=`)],
      ...romPayloads(decodeBase64(`+wOyABMAAAAYAMPQur/QAM3Ou84AxM++wb/////////////////////////////////D0Oe4AL/Q
5wDV4tgA4tXo6ebZ////////////////////////////venm3ePp5wDV1uPp6ADt4+nmAMrJxRvH
ycis/////////////////87c2QDY2eDd6tnm7eHV4gDj4gDo3NkAo+LY///////////////////a
4OPj5gDj2gDVAMrJxRvHycgAvb/Izr/MANfV4v//////////////59zj6wDd6OcAw9DnuAC/0OcA
1eLYAOLV6Onm2a3//////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFdgAACB+vAAAIRbsFdgAACB+8AAAIALsFdgAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72AAAAIZm0jFQ8AA0gCuFEAAAglnwAnIQSABgC7BHQAAAgjFQ8AA20AZwDAAQJmbWhsAr2e
AAAIZm1obALR3N3X3ADKycUbx8nIAOfc4+ng2ADDAN7p2NvZrP/O3N3nANvd2ugA2OPZ5+K06ADr
4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf/wtYiwQkgAiGQhSEM/TCQYACUAJych
Bi0A0xQhSRkgAD1LAPBx+GkAakZQUgYtANM/GAE1DC3t0WpGF4MAIAeQOqU0TgAnKHgBNf0oEND/
KAbRB5kAKQPQDQAAJweX8ucwcAE2/yju0Qiw8LwBvABHKHgBNTAoINIQKBbSACgK0SAAAiEyACRL
APA++DB4/yjZ0AE2+ucgACBLAPA1+IAAH0kJWADwD/jN5xA4QADAGWlGCFoA8A/4xecwOAwnR0MH
lS+lv+cIeP8oA9AwcAExATb453BHMLUAJBKlKYgCNQEpC9AAIohCAtNAGgEy+ucUQ/PQoTIycAE2
7+ehMDBwATYwvAG8AEcYR8BGhEICAsBwAwIAwAEC6fsDCJ0uBAhgPkYI6ANkAAoAAQD9ALTnAOLV
6Onm2QDd5wD9Aa3+wtnm2QDV5tkA3ejnAMPQ57gA4+noAOPaAKSi8Pv9MPvD6OcAv9DnANXY2ADp
5ADo4wD9HADj2gCmoqHw+/0x/wDCygD9ELgAu87Ou73FAP0RuAC+v8C/yM2/AP0S/s3KrQC7zsUA
/RS4AM3KrQC+v8AA/RW4AM3Kv7++AP0T/8BGB0gAaAdJQBgHSZpoEhpSGJpg+SKSAAQ6g1iLUPvR
cEcIUAADJDYAAAD8AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBATwDCf37AwixLgQIwA==`),
        'BPGE 1.0': decodeBase64(`XAEBR0QDAoA4`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE8Awr9+wMIsS4ECPA4`),
      }),
    },
  },
  {
    id: 'custom-hidden-power',
    label: 'Hidden Power Checker & Max IVs',
    description: 'Choose a Pokémon from your party and the deliveryman tells you the type and power of its Hidden Power, then offers to raise all six of its IVs to 31, the maximum, which makes its Hidden Power Dark-type at power 70. Its stats update right away.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`BQTJAB0AAAAIAMLDvr6/yADKydG/zAAtAMPQzf////////////////////////////+93NnX3wDd
6LgA6NzZ4gDh1ewA3ej/////////////////////////zdnZANUAysnFG8fJyLTnAMLDvr6/yADK
ydG/zLj//////////////+jc2eIA5tXd59kA1eDgAN3o5wDD0OcA6OMApKL////////////////d
2gDt4+kA4N3f2a0A0N3n3egA6NzZAKPA////////////////////2Nng3erZ5u3h1eIA49oA1QC9
v8jOv8yt/////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsF0gAACB+vAAAIRbsF0gAACB+8AAAIALsF0gAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73cAAAIZm0jpQ4AA3QCuFEAAAglogAnIQSABgC7BM8AAAgmDYBJASENgJwBuwHFAAAIfwAE
gCOlDgADdQGDAgWAvR4BAAhmbb1GAQAIZm4UCCENgAAAuwG7AAAII6UOAAOjASOlDgADSAGDAgWA
vWcBAAhmbWhsAr2mAQAIZm1obAK9/wAACGZtaGwCaGwCvboBAAhmbWhsAtHc4+fZAMLDvr6/yADK
ydG/zADn3OPp4NgAw/7X3NnX36z/u+IAv8HBAN/Z2eTnAN3o5wDk4+vZ5gDc3djY2eKr//0CtOcA
wsO+vr/IAMrJ0b/MAN3n/v0Drujt5Nm4AOTj69nmAP0Erf/N3NXg4ADDAObV3efZANXg4ADd6OcA
w9Dn/ujjAKSirP+74OAA3ejnAMPQ5wDV5tkApKIA4uPrq/vD6OcAwsO+vr/IAMrJ0b/MAN3n/v0D
rujt5Nm4AOTj69nmAP0Erf+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj
5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt//C1APBZ+AQAACUAJgAnIAAnIckZJ0sA
8ED4QQgBIhBAEUC4QLlABUMOQwE3Bi/u0SggcEM/IQbfHjAYSUiADyBoQz8hBt8BMAkoANMBMADw
Hvjwvf8g/+dwtYGwBgAA8Cv4BAAnJQEgMEB2CB4wAJAgACkAakYKSwDwD/gBNS0t8dEgAAdLAPAI
+AGwcL0HIUFDBUgJGAVIBUsYR+B1AwKtrAYIDY0GCDiuMQjEHQICoYsACBmlBggDSACIZCFIQwJJ
QBhwR8BG4HUDAuxEAgIHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9FwR4xdAAMwNwAAAPwD
Ag==`)],
      ...romPayloads(decodeBase64(`BQTJAB0AAAAIAMLDvr6/yADKydG/zAAtAMPQzf////////////////////////////+93NnX3wDd
6LgA6NzZ4gDh1ewA3ej/////////////////////////zdnZANUAysnFG8fJyLTnAMLDvr6/yADK
ydG/zLj//////////////+jc2eIA5tXd59kA1eDgAN3o5wDD0OcA6OMApKL////////////////d
2gDt4+kA4N3f2a0A0N3n3egA6NzZAKPA////////////////////2Nng3erZ5u3h1eIA49oA1QC9
v8jOv8yt/////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF0gAACB+vAAAIRbsF0gAACB+8AAAIALsF0gAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73cAAAIZm0jFQ8AA3QCuFEAAAglnwAnIQSABgC7BM8AAAgmDYBHASENgJwBuwHFAAAIfwAE
gCMVDwADdQGDAgWAvR4BAAhmbb1GAQAIZm4UCCENgAAAuwG7AAAIIxUPAAOjASMVDwADSAGDAgWA
vWcBAAhmbWhsAr2mAQAIZm1obAK9/wAACGZtaGwCaGwCvboBAAhmbWhsAtHc4+fZAMLDvr6/yADK
ydG/zADn3OPp4NgAw/7X3NnX36z/u+IAv8HBAN/Z2eTnAN3o5wDk4+vZ5gDc3djY2eKr//0CtOcA
wsO+vr/IAMrJ0b/MAN3n/v0Drujt5Nm4AOTj69nmAP0Erf/N3NXg4ADDAObV3efZANXg4ADd6OcA
w9Dn/ujjAKSirP+74OAA3ejnAMPQ5wDV5tkApKIA4uPrq/vD6OcAwsO+vr/IAMrJ0b/MAN3n/v0D
rujt5Nm4AOTj69nmAP0Erf+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rToAOvj
5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt//C1APBZ+AQAACUAJgAnIAAnIckZJ0sA
8ED4QQgBIhBAEUC4QLlABUMOQwE3Bi/u0SggcEM/IQbfHjAYSUiADyBoQz8hBt8BMAkoANMBMADw
Hvjwvf8g/+dwtYGwBgAA8Cv4BAAnJQEgMEB2CB4wAJAgACkAakYKSwDwD/gBNS0t8dEgAAdLAPAI
+AGwcL0HIUFDBUgJGAVIBUsYR8BwAwJ9AwQIfeQDCKDxJAjwHAIChY0ACOn7AwgDSACIZCFIQwJJ
QBhwR8BGwHADAoRCAgIHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9FwRwhQAAMkNgAAAPwD
Ag==`), {
        'BPRE 1.1': decodeBase64(`dAEBAeADCpEDBAiR5AMIEPLwAwWZjQAI/Q==`),
        'BPGE 1.0': decodeBase64(`XAEBR+gDAXw=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHgAwmRAwQIkeQDCOzwAwWZjQAI/Q==`),
      }),
    },
  },
  {
    id: 'custom-hidden-power-type',
    label: 'Hidden Power Type Changer',
    description: 'Choose a Pokémon from your party, then physical or special and one of the eight types of that kind: its Hidden Power becomes that type at power 70, the most there is. Its IVs become 30 or 31 each, with HP and Attack at 31, and its stats update right away.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`IQTJADkAAAAYAMLDvr6/yADKydG/zADO08q///////////////////////////////+74u0A6O3k
2bgA5OPr2eYAqKH/////////////////////////////wd3q2QDVAMrJxRvHyci05wDCw76+v8gA
ysnRv8z//////////////+jc2QDo7eTZAO3j6QDX3OPj59mtANDd593o///////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsF2AAACB+vAAAIRbsF2AAACB+8AAAIALsF2AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73iAAAIZm0jpQ4AAyQDuFEAAAglogAnIQSABgC7BNUAAAgmDYBJASENgJwBuwHLAAAIfwAE
gL0lAQAIZiOlDgADRwEnIQ2AfwC7AcEAAAgZBoANgL1DAQAIZiOlDgADMQEnIQ2AfwC7AcEAAAgj
pQ4AA1YBvU8BAAhmbWhsAr19AQAIZm1obAK9BgEACGZtaGwCaGwCvZEBAAhmbWhsAtHc4+fZAMLD
vr6/yADKydG/zADn3OPp4NgAw/7X3NXi29ms/7viAL/BwQDf2dnk5wDd6OcA5OPr2eYA3N3Y2Nni
q/+7AOTc7efd19XgAOPmANUA5+TZ193V4ADo7eTZrP/R3N3X3ADo7eTZrP++4+LZqwD9ArTnAMLD
vr6/yADKydG/zP7d5wD9A67o7eTZuADk4+vZ5gCooa3/vePh2QDW1dffANXi7QDo3eHZq//O3N3n
ANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AMKACIQgi
nuAAtYiwAPAS+AchSEMnSUAYACFqRlBQBzAEMSAp+dFoRgghByIA8FT4CLAAvRxIgIgJIUhDATBw
RxC1//f3/x5JDIgAGQDwJPgVSICIwAAAGYAAAzAA8AH4EL1wtYGwBgAA8JL4BAAnJQEgMEB2CB4w
AJAgACkAakYKSwDwD/gBNS0t8dEgAAhLAPAI+AGwcL0HIUFDBUgJGAVIBksYR8BG4HUDAq2sBggN
jQYIOK4xCMQdAgKhiwAI8HUDAsrC083DvbvG/wDARs3Kv73Du8b/8LWFsA0AFwAjTgAjAsgAIgbG
ATOrQvnRH04cIMAbACE6AGsAHkwA8CH4BwAAIR1MAPAc+DgAKQAyABtMAPAW+DgAKQAAIhlMAPAQ
+AAgGUwA8Az4ACApADoAAiMUTADwBfgOSP8hAYAFsPC9IEcQtYiwACOcAGxEIGAEeAEw/yz70QMw
gAiAAAEzi0Ly0WhG//e2/wiwEL2w+wMC8HUDAh0qDghVeBkIjZUZCHGVGQi9Hw4IvZkZCANIAIhk
IUhDAklAGHBHwEbgdQMC7EQCAgdIAGgHSUAYB0maaBIaUhiaYPkikgAEOoNYi1D70XBHjF0AAzA3
AAAA/AMC`)],
      ...romPayloads(decodeBase64(`IQTJADkAAAAYAMLDvr6/yADKydG/zADO08q///////////////////////////////+74u0A6O3k
2bgA5OPr2eYAqKH/////////////////////////////wd3q2QDVAMrJxRvHyci05wDCw76+v8gA
ysnRv8z//////////////+jc2QDo7eTZAO3j6QDX3OPj59mtANDd593o///////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF2AAACB+vAAAIRbsF2AAACB+8AAAIALsF2AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73iAAAIZm0jFQ8AA0wDuFEAAAglnwAnIQSABgC7BNUAAAgmDYBHASENgJwBuwHLAAAIfwAE
gL0lAQAIZiMVDwADRwEnIQ2AfwC7AcEAAAgZBoANgL1DAQAIZiMVDwADMQEnIQ2AfwC7AcEAAAgj
FQ8AA1YBvU8BAAhmbWhsAr19AQAIZm1obAK9BgEACGZtaGwCaGwCvZEBAAhmbWhsAtHc4+fZAMLD
vr6/yADKydG/zADn3OPp4NgAw/7X3NXi29ms/7viAL/BwQDf2dnk5wDd6OcA5OPr2eYA3N3Y2Nni
q/+7AOTc7efd19XgAOPmANUA5+TZ193V4ADo7eTZrP/R3N3X3ADo7eTZrP++4+LZqwD9ArTnAMLD
vr6/yADKydG/zP7d5wD9A67o7eTZuADk4+vZ5gCooa3/vePh2QDW1dffANXi7QDo3eHZq//O3N3n
ANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AMKACIQgi
ruAAtYiwAPAS+AchSEMnSUAYACFqRlBQBzAEMSAp+dFoRgghByIA8FT4CLAAvRxIgIgJIUhDATBw
RxC1//f3/x5JDIgAGQDwJPgVSICIwAAAGYAAAzAA8AH4EL1wtYGwBgAA8Kb4BAAnJQEgMEB2CB4w
AJAgACkAakYKSwDwD/gBNS0t8dEgAAhLAPAI+AGwcL0HIUFDBUgJGAVIBksYR8BGwHADAn0DBAh9
5AMIoPEkCPAcAgKFjQAI0HADAsrC083DvbvG/wDARs3Kv73Du8b/8LWFsA0AFwArTgAjAsgAIgbG
ATOrQvnRJ04cIMAbACE6AC2jbB4bXSVMAPAv+AcAACEkTADwKvgOIQCRAZUClgAhA5ECIQSROAAI
IgIjHkwA8Bz4DiEAkQGVACECkTgAAiEAIgIjGUwA8BD4ACApADoAAiMWTADwCfgAIBVMAPAF+A5I
/yEBgAWw8L0gRxC1iLAAI5wAbEQgYAR4ATD/LPvRAzCACIAAATOLQvLRaEb/96b/CLAQvbD7AwLQ
cAMCVdYJCFF3Dwjp+xAI2fcQCBnMCQilZw8IAgQGBwkLDQ4DSACIZCFIQwJJQBhwR8BGwHADAoRC
AgIHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9FwRwhQAAMkNgAAAPwDAg==`), {
        'BPRE 1.1': decodeBase64(`dAEBAcQDCpEDBAiR5AMIEPLUAwGZsAQWadYJCMl3Dwhh/BAIUfgQCC3MCQgdaA==`),
        'BPGE 1.0': decodeBase64(`XAEBR8wDAXywBBUp1gkIKXcPCMH7EAix9xAI7csJCH0=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHEAwmRAwQIkeQDCOzUAwGZsAQVPdYJCKF3Dwg5/BAIKfgQCAHMCQj1`),
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
    id: 'custom-friendship',
    label: 'Friendship Checker & Max Friendship',
    description: 'Choose a Pokémon from your party and the deliveryman tells you its friendship, out of 255, then offers to raise it to the maximum for that Pokémon or for your whole party. Pokémon that evolve through friendship, such as Pichu, Golbat and Chansey, then evolve at their next level up.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`+QOsABEAAAAQAMDMw7/Ivs3Cw8oAvcK/vcW/zP/////////////////////////////C4+sA1+Dj
59kA1ebZAO3j6az/////////////////////////////zdnZANzj6wDa5t3Z4tjg7QDVAMrJxRvH
ycgA3ee4/////////////+jc2eIA4dXf2QDd6ADj5gDt4+nmAOTV5ujtANXn///////////////a
5t3Z4tjg7QDV5wDX1eIA1tmtANDd593oAOjc2f//////////////2Nng3erZ5u3h1eIA4+IAo8AA
49oA1QC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsF4QAACB+vAAAIRbsF4QAACB+8AAAIALsF4QAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73rAAAIZm0jpQ4AAxADuFEAAAglogAnIQSABgC7BN4AAAgmDYBJASENgJwBuwHUAAAIfwAE
gCOlDgADeQGDAQWAvSwBAAhmbb1OAQAIZiOlDgADdQEnIQ2AAgC7BMoAAAgjpQ4AA2oBIQ2AAAC7
BcAAAAi9dQEACGZtaGwCvYgBAAhmbWhsAr2pAQAIZm1obAK9DAEACGZtaGwCaGwCvb0BAAhmbWhs
AtHc4+fZANrm3dni2Ofc3eQA59zj6eDYAMP+19zZ19+s/7viAL/BwQDc1efitOgA4dXY2QDa5t3Z
4tjnAO3Z6Kv//QK05wDa5t3Z4tjn3N3kAN3n/v0DAOPp6ADj2gCjpqat/83c1eDgAMMA4dXf2QDd
6ADV5wDa5t3Z4tjg7f7V5wDX1eIA1tms//0CANXY4+bZ5wDt4+kA4uPrq//T4+nmAOvc4+DZAOTV
5ujtANXY4+bZ5wDt4+n+4uPrq/+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rTo
AOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAtQDwpfggIRdLAPAm+BNJSIAA
vRagAyELInTgMLWBsP8gAJAOSACIACgE0QDwkPgA8BD4DOALTAYl4HxAB0APAigC0SAAAPAF+GQ0
AT300QGwML0gIWpGBEsYR+B1AwLwdQMC7EQCAhmlBgitrAYIzsLDzQDKycUbx8nI/wDARtHCyca/
AMq7zM7T/8jJAM7Cu8jFzf/ARvC1hbANABcAI04AIwLIACIGxgEzq0L50R9OHCDAGwAhOgBrAB5M
APAh+AcAACEdTADwHPg4ACkAMgAbTADwFvg4ACkAACIZTADwEPgAIBlMAPAM+AAgKQA6AAIjFEwA
8AX4Dkj/IQGABbDwvSBHELWIsAAjnABsRCBgBHgBMP8s+9EDMIAIgAABM4tC8tFoRv/3tv8IsBC9
sPsDAvB1AwIdKg4IVXgZCI2VGQhxlRkIvR8OCL2ZGQgDSACIZCFIQwJJQBhwR8BG4HUDAuxEAgIH
SABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9FwR4xdAAMwNwAAAPwDAg==`)],
      ...romPayloads(decodeBase64(`+QOsABEAAAAQAMDMw7/Ivs3Cw8oAvcK/vcW/zP/////////////////////////////C4+sA1+Dj
59kA1ebZAO3j6az/////////////////////////////zdnZANzj6wDa5t3Z4tjg7QDVAMrJxRvH
ycgA3ee4/////////////+jc2eIA4dXf2QDd6ADj5gDt4+nmAOTV5ujtANXn///////////////a
5t3Z4tjg7QDV5wDX1eIA1tmtANDd593oAOjc2f//////////////2Nng3erZ5u3h1eIA4+IAo8AA
49oA1QC9v8jOv8yt/////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF4QAACB+vAAAIRbsF4QAACB+8AAAIALsF4QAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73rAAAIZm0jFQ8AAzgDuFEAAAglnwAnIQSABgC7BN4AAAgmDYBHASENgJwBuwHUAAAIfwAE
gCMVDwADeQGDAQWAvSwBAAhmbb1OAQAIZiMVDwADdQEnIQ2AAgC7BMoAAAgjFQ8AA2oBIQ2AAAC7
BcAAAAi9dQEACGZtaGwCvYgBAAhmbWhsAr2pAQAIZm1obAK9DAEACGZtaGwCaGwCvb0BAAhmbWhs
AtHc4+fZANrm3dni2Ofc3eQA59zj6eDYAMP+19zZ19+s/7viAL/BwQDc1efitOgA4dXY2QDa5t3Z
4tjnAO3Z6Kv//QK05wDa5t3Z4tjn3N3kAN3n/v0DAOPp6ADj2gCjpqat/83c1eDgAMMA4dXf2QDd
6ADV5wDa5t3Z4tjg7f7V5wDX1eIA1tms//0CANXY4+bZ5wDt4+kA4uPrq//T4+nmAOvc4+DZAOTV
5ujtANXY4+bZ5wDt4+n+4uPrq/+94+HZANbV198A1eLtAOjd4dmr/87c3ecA293a6ADY49nn4rTo
AOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAtQDwufggIRdLAPAm+BNJSIAA
vRagAyELIoTgMLWBsP8gAJAOSACIACgE0QDwpPgA8BD4DOALTAYl4HxAB0APAigC0SAAAPAF+GQ0
AT300QGwML0gIWpGBEsYR8BwAwLQcAMChEICAun7Awh9AwQIzsLDzQDKycUbx8nI/wDARtHCyca/
AMq7zM7T/8jJAM7Cu8jFzf/ARvC1hbANABcAK04AIwLIACIGxgEzq0L50SdOHCDAGwAhOgAto2we
G10lTADwL/gHAAAhJEwA8Cr4DiEAkQGVApYAIQORAiEEkTgACCICIx5MAPAc+A4hAJEBlQAhApE4
AAIhACICIxlMAPAQ+AAgKQA6AAIjFkwA8An4ACAVTADwBfgOSP8hAYAFsPC9IEcQtYiwACOcAGxE
IGAEeAEw/yz70QMwgAiAAAEzi0Ly0WhG//em/wiwEL2w+wMC0HADAlXWCQhRdw8I6fsQCNn3EAgZ
zAkIpWcPCAIEBgcJCw0OA0gAiGQhSEMCSUAYcEfARsBwAwKEQgICB0gAaAdJQBgHSZpoEhpSGJpg
+SKSAAQ6g1iLUPvRcEcIUAADJDYAAAD8AwI=`), {
        'BPRE 1.1': decodeBase64(`dAEBAawDBf37AwiRnAQWadYJCMl3Dwhh/BAIUfgQCC3MCQgdaA==`),
        'BPGE 1.0': decodeBase64(`XAEBR5wEFSnWCQgpdw8IwfsQCLH3EAjtywkIfQ==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQGsAwX9+wMIkZwEFT3WCQihdw8IOfwQCCn4EAgBzAkI9Q==`),
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
    id: 'custom-unown-letters',
    label: 'Unown Letter Changer',
    description: 'Choose an Unown from your party and type the letter it should be, A to Z, ! or ?, on the naming screen; its nickname stays as it was. It keeps its nature and whether it is shiny.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`IATJADgAAAAYAM/IydHIAMa/zs6/zAC9wrvIwb/M///////////////////////////A5uPhALsA
6OMArP//////////////////////////////////////wd3q2QDV4gDPyMnRyADV4u0A49oA3ejn
AKOp/////////////////+DZ6OjZ5uetAMPoAN/Z2eTnAN3o5wDi1ejp5tmt///////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsF2QAACB+vAAAIRbsF2QAACB+8AAAIALsF2QAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73jAAAIZm0jpQ4AA2QDuFEAAAglogAnIQSABgC7BNYAAAh/AASAJg2ASQEhDYDJALsFwgAA
CL3wAAAIZm1olwEjpQ4AAysBJyOlDgADSQF/AASAIQ2AAAC7AcwAAAghDYACALsBtgAACL03AQAI
Zm1obAK9FAEACGZtuYAAAAi9UAEACGZtaGwCvWUBAAhmbWhsAmhsAr15AQAIZm1obALR3N3X3ADP
yMnRyKz/zu3k2QDd6OcA4tnrAODZ6OjZ5vD+uwDo4wDUuACrAOPmAKz/yeLZAODZ6OjZ5rgA5ODZ
1efZ8P67AOjjANS4AKsA4+YArP/9AgDd5wDo3NkA4Nno6Nnm/v0DAOLj66v/ztzV6LTnAOLj6ADV
4gDPyMnRyKv/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+
6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AELWCsADw2vgAaACQTUgBkElJ/yAIcAMgySL/I0hM
APCI+AKwEL3wtYSwQ0kAIgsAHHgBM/8sBNAALPnQIAABMvbnASoD0AAgYtMCIGDgAgC7OhoqCtMa
OhoqB9MaIqsoBNAbIqwoAdACIFHgAJK7IBoqANORIIAYCHD/IEhwAPCd+AQAJmgwABkhAPCj+AUA
YGgBDEhAAAQADAKQMQxxQAkECQxIQAgoAdMAIclDAZEAIAOQIUsA8Dv4BwAfSwDwN/gBmUocBNBA
B0APSEB4QAXgAQB5QAKaUUAIKQzTAAQHQzgAGSEA8HX4qEIE0QDwE/gAmYhCBtADmAEwA5AADNjQ
ACAE4CAAOQAA8B34ASAISQiABLDwvQAgGCGAADoAykADIxpAEEMIOffVHCFR4BhHIEfwdQMCxB0C
As31Bgh5LQ4IzWEICPC1kLAFAA8ALmgwAADwK/gMkDgAAPAn+A2QACQMmOBAAyMYQAwiUEMgMCgY
DZnhQBlAUUNpRAMiA2hzQHtAC2AEMAQxATr30QI0CCzm0WlGKAAgMCwii1iDUAQ6+9UvYAEgELDw
vQC1GCEA8A/4DKEIXAC9A0gAiGQhSEMCSUAYcEfARuB1AwLsRAICyQbKDohCANNAGpFCAdBJCPjn
cEfktNiceGzhsdKTcmPJjcaHTks5LTYnHhsHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9Fw
R4xdAAMwNwAAAPwDAg==`)],
      ...romPayloads(decodeBase64(`IATJADgAAAAYAM/IydHIAMa/zs6/zAC9wrvIwb/M///////////////////////////A5uPhALsA
6OMArP//////////////////////////////////////wd3q2QDV4gDPyMnRyADV4u0A49oA3ejn
AKOp/////////////////+DZ6OjZ5uetAMPoAN/Z2eTnAN3o5wDi1ejp5tmt///////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF2QAACB+vAAAIRbsF2QAACB+8AAAIALsF2QAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR73jAAAIZm0jFQ8AA2QDuFEAAAglnwAnIQSABgC7BNYAAAh/AASAJg2ARwEhDYDJALsFwgAA
CL3wAAAIZm1olwEjFQ8AAysBJyMVDwADSQF/AASAIQ2AAAC7AcwAAAghDYACALsBtgAACL03AQAI
Zm1obAK9FAEACGZtuYAAAAi9UAEACGZtaGwCvWUBAAhmbWhsAmhsAr15AQAIZm1obALR3N3X3ADP
yMnRyKz/zu3k2QDd6OcA4tnrAODZ6OjZ5vD+uwDo4wDUuACrAOPmAKz/yeLZAODZ6OjZ5rgA5ODZ
1efZ8P67AOjjANS4AKsA4+YArP/9AgDd5wDo3NkA4Nno6Nnm/v0DAOLj66v/ztzV6LTnAOLj6ADV
4gDPyMnRyKv/vePh2QDW1dffANXi7QDo3eHZq//O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd6Nz+
6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AELWCsADw2vgAaACQTUgBkElJ/yAIcAMgySL/I0hM
APCI+AKwEL3wtYSwQ0kAIgsAHHgBM/8sBNAALPnQIAABMvbnASoD0AAgYtMCIGDgAgC7OhoqCtMa
OhoqB9MaIqsoBNAbIqwoAdACIFHgAJK7IBoqANORIIAYCHD/IEhwAPCd+AQAJmgwABkhAPCj+AUA
YGgBDEhAAAQADAKQMQxxQAkECQxIQAgoAdMAIclDAZEAIAOQIUsA8Dv4BwAfSwDwN/gBmUocBNBA
B0APSEB4QAXgAQB5QAKaUUAIKQzTAAQHQzgAGSEA8HX4qEIE0QDwE/gAmYhCBtADmAEwA5AADNjQ
ACAE4CAAOQAA8B34ASAISQiABLDwvQAgGCGAADoAykADIxpAEEMIOffVHCFR4BhHIEfQcAMC8BwC
AslOBAhV2QkI4WgFCPC1kLAFAA8ALmgwAADwK/gMkDgAAPAn+A2QACQMmOBAAyMYQAwiUEMgMCgY
DZnhQBlAUUNpRAMiA2hzQHtAC2AEMAQxATr30QI0CCzm0WlGKAAgMCwii1iDUAQ6+9UvYAEgELDw
vQC1GCEA8A/4DKEIXAC9A0gAiGQhSEMCSUAYcEfARsBwAwKEQgICyQbKDohCANNAGpFCAdBJCPjn
cEfktNiceGzhsdKTcmPJjcaHTks5LTYnHhsHSABoB0lAGAdJmmgSGlIYmmD5IpIABDqDWItQ+9Fw
RwhQAAMkNgAAAPwDAg==`), {
        'BPRE 1.1': decodeBase64(`dAEBATwECd1OBAhp2QkI9Q==`),
        'BPGE 1.0': decodeBase64(`XAEBR0AEASk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQE8BAndTgQIPdkJCPU=`),
      }),
    },
  },
  {
    id: 'custom-max-conditions',
    label: 'Max Contest Conditions (Feebas to Milotic)',
    description: 'Raises a Pokémon’s Cool, Beauty, Cute, Smart and Tough conditions and its sheen to the maximum, as far as Pokéblocks can take them. A Feebas in this condition evolves into Milotic at its next level up, even in FireRed and LeafGreen, which have no way to raise Beauty.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`BARJARwAAAAEAMe70gC9yci+w87DycjN//////////////////////////////////+94+Lo2efo
AObZ1djtq///////////////////////////////////vcnJxrgAvL+7z87TuAC9z86/uADNx7vM
zgDV4tj//////////////87Jz8HCAOjjAOjc2QDh1ezwANUAwL+/vLvN///////////////////o
3NniANnq4+Dq2ecA1egA3ejnAOLZ7OgA4Nnq2eCt////////////0N3n3egAo8AA49oA1QDKycUb
x8nIAL2/yM6/zK3//////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFlwAACB+vAAAIRbsFlwAACB+8AAAIALsFlwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72hAAAIZm0jpQ4AA3gBuFEAAAglogAnIQSABgC7BJQAAAgmDYBJASENgJwBuwGKAAAIfwAE
gCOlDgAD/QC97QAACGZtaGwCvdAAAAhmbWhsAmhsAr0/AQAIZm1obALR3N3X3ADKycUbx8nIAOfc
4+ng2ADDANvZ6P7m2dXY7QDa4+YA1+Pi6Nnn6Oes/7viAL/BwQDX1eK06ADZ4ujZ5gDX4+Lo2efo
56v//QIA3ecA3eIA6OPkANfj4tjd6N3j4qv7uwDAv7+8u80A3eIA6Nzd5wDX4+LY3ejd4+IA693g
4P7Z6uPg6tkA1egA3ejnAOLZ7OgA4Nnq2eCt/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o
3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAACC1gbD/IACQACUA8BP4B6FJXWpGBEsA8AX4ATUG
LfTRAbAgvRhHwEatrAYIFhcYIS8wwEYDSACIZCFIQwJJQBhwR8BG4HUDAuxEAgIHSABoB0lAGAdJ
mmgSGlIYmmD5IpIABDqDWItQ+9FwR4xdAAMwNwAAAPwDAg==`)],
      ...romPayloads(decodeBase64(`BARJARwAAAAEAMe70gC9yci+w87DycjN//////////////////////////////////+94+Lo2efo
AObZ1djtq///////////////////////////////////vcnJxrgAvL+7z87TuAC9z86/uADNx7vM
zgDV4tj//////////////87Jz8HCAOjjAOjc2QDh1ezwANUAwL+/vLvN///////////////////o
3NniANnq4+Dq2ecA1egA3ejnAOLZ7OgA4Nnq2eCt////////////0N3n3egAo8AA49oA1QDKycUb
x8nIAL2/yM6/zK3//////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFlwAACB+vAAAIRbsFlwAACB+8AAAIALsFlwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAAR72hAAAIZm0jFQ8AA3gBuFEAAAglnwAnIQSABgC7BJQAAAgmDYBHASENgJwBuwGKAAAIfwAE
gCMVDwAD/QC97QAACGZtaGwCvdAAAAhmbWhsAmhsAr0/AQAIZm1obALR3N3X3ADKycUbx8nIAOfc
4+ng2ADDANvZ6P7m2dXY7QDa4+YA1+Pi6Nnn6Oes/7viAL/BwQDX1eK06ADZ4ujZ5gDX4+Lo2efo
56v//QIA3ecA3eIA6OPkANfj4tjd6N3j4qv7uwDAv7+8u80A3eIA6Nzd5wDX4+LY3ejd4+IA693g
4P7Z6uPg6tkA1egA3ejnAOLZ7OgA4Nnq2eCt/87c3ecA293a6ADY49nn4rToAOvj5t8A693o3P7o
3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAACC1gbD/IACQACUA8BP4B6FJXWpGBEsA8AX4ATUG
LfTRAbAgvRhHwEZ9AwQIFhcYIS8wwEYDSACIZCFIQwJJQBhwR8BGwHADAoRCAgIHSABoB0lAGAdJ
mmgSGlIYmmD5IpIABDqDWItQ+9FwRwhQAAMkNgAAAPwDAg==`), {
        'BPRE 1.1': decodeBase64(`dAEBAfACAZE=`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHwAgGR`),
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
Wh+uAAAIRbsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBhQAACEMjpQ4AAwUBIQ2AAgC7AY8AAAgp5AExcgG9owAACGYybSENgAEAuwF7AAAI
aGwCvbgAAAhmbWhsAr3PAAAIZm1obAK9+wAACGZtaGwCvRsBAAhmbWhsAv0BAObZ19nd6tnYAMTD
zLu9wsOr/8PoAOvV5wDn2eLoAOjjAOjc2QDKva3/zNnX2d3q2QDo3NkA19Xm2ADV29Xd4gDa4+b+
1eLj6NzZ5gDEw8y7vcLDq//T4+nmAOTV5ujtANXi2ADo3NkAyr0A1ebZANrp4OCr/87c3ecA293a
6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAAPC1hrBYpEhL
APCK+AYENgwA8Hz4BwQA8Hn4B0MBlwEgAJABIAKQQ0gDkADwb/hHBH8MAPBr+EAEgAg4QwSQAPBl
+AYAPEghiAUiACM7TwDwaPhDogchAPBh+AAgMSEA8Fv4/yAjIQDwV/gCICUhAPBT+DAAAyEG3wEh
AUCqIEAaDCEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgAkSCZPAPA6+AE2BC70
0SBIJE8A8DP4JE43eB1IBi8D0yNLAPAq+AvgZCF5Qx5KiRhgIoNYi1AEOvvVATc3cAAgD0kIgAIo
DNAgiBlLAPAV+AYAAiEYTwDwEfgwAAMhAPAN+Aaw8L0HSHBDB0lGGDAMcEcFkAWqBkgISxhHOEfw
dQMCzfUGCG1OxkFzYAAAS04AAERHAgJNewYIrawGCPWRBggNjQYI7EQCAulEAgKRtAYIpdQGCGUG
DAjRw83Cx8XM/5kBEQFdAJwAAADARg==`)],
      ...romPayloads(decodeBase64(`FgSZAS4AAAAMANHDzcLHxcwAxMPMu73Cw//////////////////////////////////O3NkAvMnI
z80AvsPNvQDb3dro////////////////////////////ztzZAOvd59yu2+bV4ujd4tsAxMPMu73C
wwDj2v///////////////+jc2QC9ycbJzc2/z8cAvMnIz80AvsPNva3////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFQ8AAwUBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbgAAAhmbWhsAr3PAAAIZm1obAK9+wAACGZtaGwCvRsBAAhmbWhsAv0BAObZ19nd6tnYAMTD
zLu9wsOr/8PoAOvV5wDn2eLoAOjjAOjc2QDKva3/zNnX2d3q2QDo3NkA19Xm2ADV29Xd4gDa4+b+
1eLj6NzZ5gDEw8y7vcLDq//T4+nmAOTV5ujtANXi2ADo3NkAyr0A1ebZANrp4OCr/87c3ecA293a
6ADY49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAAPC1hrBYpEhL
APCK+AYENgwA8Hz4BwQA8Hn4B0MBlwEgAJABIAKQQ0gDkADwb/hHBH8MAPBr+EAEgAg4QwSQAPBl
+AYAPEghiAUiACM7TwDwaPhDogchAPBh+AAgMSEA8Fv4/yAjIQDwV/gCICUhAPBT+DAAAyEG3wEh
AUCqIEAaDCEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgAkSCZPAPA6+AE2BC70
0SBIJE8A8DP4JE43eB1IBi8D0yNLAPAq+AvgZCF5Qx5KiRhgIoNYi1AEOvvVATc3cAAgD0kIgAIo
DNAgiBlLAPAV+AYAAiEYTwDwEfgwAAMhAPAN+Aaw8L0HSHBDB0lGGDAMcEcFkAWqBkgISxhHOEfQ
cAMCyU4ECG1OxkFzYAAAS04AACxAAgJV2gMIfQMECGXpAwh95AMIhEICAilAAgKRCwQImTIECHWO
CAjRw83Cx8XM/5kBEQFdAJwAAADARg==`), {
        'BPRE 1.1': decodeBase64(`dAEBAcwDAd3gAw1p2gMIkQMECHnpAwiR+AMJpQsECK0yBAiJ`),
        'BPGE 1.0': decodeBase64(`XAEBRwAEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHMAwHd4AMNadoDCJEDBAh56QMIkfgDCaULBAitMgQIXQ==`),
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
Wh+uAAAIRbsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBhQAACEMjpQ4AAwEBIQ2AAgC7AY8AAAgp5AExcgG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAL2/
xr+8w6v/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAL2/xr+8w6v/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsFmkSUsA8Iv4
BgQ2DADwffgHBADwevgHQzgMeEBFSUhAAATADALRCDf/CP8AAZcBIACQASACkD9IA5AA8Gb4RwR/
DADwYvhABIAIOEMEkADwXPgGADhIIYhGIgAjN08A8F/4P6IHIQDwWPjwQ8AJMSEA8FH4/yAjIQDw
TfgCICUhAPBJ+ASeJycfIDBAdgk5AADwQfgBNy0v9tEAJnEAYRhJiDIAJEgnTwDwOvgBNgQu9NEh
SCRPAPAz+CVON3geSAYvA9MjSwDwKvgL4GQheUMeSokYYCKDWItQBDr71QE3N3AAIA9JCIACKAzQ
IIgaSwDwFfgGAAIhGE8A8BH4MAADIQDwDfgGsPC9CEhwQwhJRhgwDHBHBZAFqgdICEsYRzhHwEbw
dQMCzfUGCG1OxkFzYAAACgAAAERHAgJNewYIrawGCPWRBggNjQYI7EQCAulEAgKRtAYIpdQGCGUG
DAiioQC7yMPQ//sA9gD4AOIAwwDARg==`)],
      ...romPayloads(decodeBase64(`FwT7AC8AAAAEAKKhALvIw9AAvb/Gv7zD///////////////////////////////////O3NkAoqHo
3AC74uLd6tnm59Xm7QDb3dro////////////////////ztzZAL2/xr+8wwDj2gDo3NkAo6GhpwCi
oejc/////////////////7vi4t3q2ebn1ebtAOjj6eYA49oAu+HZ5t3X1a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFQ8AAwEBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAL2/
xr+8w6v/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAL2/xr+8w6v/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsFmkSUsA8Iv4
BgQ2DADwffgHBADwevgHQzgMeEBFSUhAAATADALRCDf/CP8AAZcBIACQASACkD9IA5AA8Gb4RwR/
DADwYvhABIAIOEMEkADwXPgGADhIIYhGIgAjN08A8F/4P6IHIQDwWPjwQ8AJMSEA8FH4/yAjIQDw
TfgCICUhAPBJ+ASeJycfIDBAdgk5AADwQfgBNy0v9tEAJnEAYRhJiDIAJEgnTwDwOvgBNgQu9NEh
SCRPAPAz+CVON3geSAYvA9MjSwDwKvgL4GQheUMeSokYYCKDWItQBDr71QE3N3AAIA9JCIACKAzQ
IIgaSwDwFfgGAAIhGE8A8BH4MAADIQDwDfgGsPC9CEhwQwhJRhgwDHBHBZAFqgdICEsYRzhHwEbQ
cAMCyU4ECG1OxkFzYAAACgAAACxAAgJV2gMIfQMECGXpAwh95AMIhEICAilAAgKRCwQImTIECHWO
CAiioQC7yMPQ//sA9gD4AOIAwwDARg==`), {
        'BPRE 1.1': decodeBase64(`dAEBAcwDAd3gAw1p2gMIkQMECHnpAwiR+AMJpQsECK0yBAiJ`),
        'BPGE 1.0': decodeBase64(`XAEBRwAEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHMAwHd4AMNadoDCJEDBAh56QMIkfgDCaULBAitMgQIXQ==`),
      }),
    },
  },
  {
    id: 'custom-10-aniv-kanto',
    label: 'Party of the Decade: Kanto (10 ANIV Event)',
    description: 'Choose one of the Kanto favorites of the 2006 Pokémon 10th Anniversary “Party of the Decade”: Bulbasaur, Charizard, Blastoise, the Pikachu that knows Fly, Alakazam or Dragonite. Each is level 70, OT 10 ANIV, ID 06808, from Ruby, with the event’s own moves, its nature, IVs and OT gender rolled the way the event rolled them, never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`GAQZADAAAAAQAMq7zM7TAMnAAM7CvwC+v727vr/////////////////////////////Fu8jOyQDa
1erj5t3o2ef/////////////////////////////////vM/GvLvNu8/MuAC9wrvMw9S7zL64////
/////////////////////7zGu83OycPNv7gAysPFu73Cz7gAu8a7xbvUu8f////////////////j
5gC+zLvBycjDzr/wANfc4+Pn2QDj4tkA4+L/////////////////o8AA49oA1QDKycUbx8nIAL2/
yM6/zK3//////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsF3AAACB+vAAAIRbsF3AAACB+8AAAIALsF3AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBvgAACBYEgAAAI6UOAAORAiENgAAAuwHSAAAIfQAGgL1pAQAIZm4UCCENgAEAuwGF
AAAIFwSAAQC5UQAACEMjpQ4AAywBIQ2AAgC7AcgAAAgp5AExcgG95gAACGYybSENgAEAuwG0AAAI
aGwCvfYAAAhmbWhsAr0NAQAIZm1obAK9NQEACGZtaGwCvVUBAAhmbWhsAr18AQAIZm1obAL9AQDm
2dfZ3erZ2AD9Aqv/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3i
ANrj5v7V4uPo3NnmAOPi2av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq/+94+HZANbV
198A1eLtAOjd4dmr/9Hj6eDYAO3j6QDg3d/ZAP0CrP/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAPC1hrBjpGBIAIgKIUhDJBhPSwDwi/gGBDYM
APB9+AcEAPB6+AdDOAx4QExJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQRUgDkADwZvhHBH8MAPBi
+EAEgAg4QwSQAPBc+AYAP0ghiEYiACM+TwDwX/hGogchAPBY+PBDwAkxIQDwUfj/ICMhAPBN+AIg
JSEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgArSC1PAPA6+AE2BC700SdIK08A
8DP4K043eCRIBi8D0ypLAPAq+AvgZCF5QyVKiRhgIoNYi1AEOvvVATc3cAAgFkkIgAIoDNAgiCBL
APAV+AYAAiEfTwDwEfgwAAMhAPAN+Aaw8L0OSHBDDklGGDAMcEcFkAWqDUgPSxhHOEcVSAGIACIG
KQXSCiJRQxWiUVqBgAEiAUgCgHBH8HUDAs31BghtTsZBc2AAAJgaAABERwICTXsGCK2sBgj1kQYI
DY0GCOxEAgLpRAICkbQGCKXUBghlBgwI4HUDAqKhALvIw9D/AQDmAEoATADrAAYAEQCjAFIAUwAJ
ALYA8ACCADgAGQBVAFcAcQATAEEA+ABbAV4ADwGVAGEA2wARAMgA`)],
      ...romPayloads(decodeBase64(`GAQZADAAAAAQAMq7zM7TAMnAAM7CvwC+v727vr/////////////////////////////Fu8jOyQDa
1erj5t3o2ef/////////////////////////////////vM/GvLvNu8/MuAC9wrvMw9S7zL64////
/////////////////////7zGu83OycPNv7gAysPFu73Cz7gAu8a7xbvUu8f////////////////j
5gC+zLvBycjDzr/wANfc4+Pn2QDj4tkA4+L/////////////////o8AA49oA1QDKycUbx8nIAL2/
yM6/zK3//////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF3AAACB+vAAAIRbsF3AAACB+8AAAIALsF3AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBvgAACBYEgAAAIxUPAAORAiENgAAAuwHSAAAIfQAGgL1pAQAIZm4UCCENgAEAuwGF
AAAIFwSAAQC5UQAACEMjFQ8AAywBIQ2AAgC7AcgAAAgp2AMxAQG95gAACGYybSENgAEAuwG0AAAI
aGwCvfYAAAhmbWhsAr0NAQAIZm1obAK9NQEACGZtaGwCvVUBAAhmbWhsAr18AQAIZm1obAL9AQDm
2dfZ3erZ2AD9Aqv/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3i
ANrj5v7V4uPo3NnmAOPi2av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq/+94+HZANbV
198A1eLtAOjd4dmr/9Hj6eDYAO3j6QDg3d/ZAP0CrP/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAPC1hrBjpGBIAIgKIUhDJBhPSwDwi/gGBDYM
APB9+AcEAPB6+AdDOAx4QExJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQRUgDkADwZvhHBH8MAPBi
+EAEgAg4QwSQAPBc+AYAP0ghiEYiACM+TwDwX/hGogchAPBY+PBDwAkxIQDwUfj/ICMhAPBN+AIg
JSEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgArSC1PAPA6+AE2BC700SdIK08A
8DP4K043eCRIBi8D0ypLAPAq+AvgZCF5QyVKiRhgIoNYi1AEOvvVATc3cAAgFkkIgAIoDNAgiCBL
APAV+AYAAiEfTwDwEfgwAAMhAPAN+Aaw8L0OSHBDDklGGDAMcEcFkAWqDUgPSxhHOEcVSAGIACIG
KQXSCiJRQxWiUVqBgAEiAUgCgHBH0HADAslOBAhtTsZBc2AAAJgaAAAsQAICVdoDCH0DBAhl6QMI
feQDCIRCAgIpQAICkQsECJkyBAh1jggIwHADAqKhALvIw9D/AQDmAEoATADrAAYAEQCjAFIAUwAJ
ALYA8ACCADgAGQBVAFcAcQATAEEA+ABbAV4ADwGVAGEA2wARAMgA`), {
        'BPRE 1.1': decodeBase64(`dAEBAVQEAd1oBA1p2gMIkQMECHnpAwiRgAQJpQsECK0yBAiJ`),
        'BPGE 1.0': decodeBase64(`XAEBR4gEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQFUBAHdaAQNadoDCJEDBAh56QMIkYAECaULBAitMgQIXQ==`),
      }),
    },
  },
  {
    id: 'custom-10-aniv-legends',
    label: 'Party of the Decade: Legends (10 ANIV Event)',
    description: 'Choose one of the Legendary Pokémon of the 2006 Pokémon 10th Anniversary “Party of the Decade”: Articuno, Zapdos, Moltres, Raikou, Entei, Suicune, Latias or Latios. Each is level 70, OT 10 ANIV, ID 06808, from Ruby, with the event’s own moves, its nature, IVs and OT gender rolled the way the event rolled them, never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`GQSQADEAAAAYAMq7zM7TAMnAAM7CvwC+v727vr/////////////////////////////G2dvZ4tjV
5u0AysnFG8fJyP//////////////////////////////u8zOw73PyMm4ANS7yr7JzbgAx8nGzsy/
zbj//////////////////8y7w8XJz7gAv8jOv8O4AM3Pw73PyL+4AMa7zsO7zf/////////////j
5gDGu87Dyc3wANfc4+Pn2QDj4tkA4+L/////////////////////o8AA49oA1QDKycUbx8nIAL2/
yM6/zK3//////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsF3AAACB+vAAAIRbsF3AAACB+8AAAIALsF3AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBvgAACBYEgAAAI6UOAAORAiENgAAAuwHSAAAIfQAGgL1pAQAIZm4UCCENgAEAuwGF
AAAIFwSAAQC5UQAACEMjpQ4AAywBIQ2AAgC7AcgAAAgp5AExcgG95gAACGYybSENgAEAuwG0AAAI
aGwCvfYAAAhmbWhsAr0NAQAIZm1obAK9NQEACGZtaGwCvVUBAAhmbWhsAr18AQAIZm1obAL9AQDm
2dfZ3erZ2AD9Aqv/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3i
ANrj5v7V4uPo3NnmAOPi2av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq/+94+HZANbV
198A1eLtAOjd4dmr/9Hj6eDYAO3j6QDg3d/ZAP0CrP/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAPC1hrBjpGBIAIgKIUhDJBhPSwDwi/gGBDYM
APB9+AcEAPB6+AdDOAx4QExJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQRUgDkADwZvhHBH8MAPBi
+EAEgAg4QwSQAPBc+AYAP0ghiEYiACM+TwDwX/hGogchAPBY+PBDwAkxIQDwUfj/ICMhAPBN+AIg
JSEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgArSC1PAPA6+AE2BC700SdIK08A
8DP4K043eCRIBi8D0ypLAPAq+AvgZCF5QyVKiRhgIoNYi1AEOvvVATc3cAAgFkkIgAIoDNAgiCBL
APAV+AYAAiEfTwDwEfgwAAMhAPAN+Aaw8L0OSHBDDklGGDAMcEcFkAWqDUgPSxhHOEcVSAGIACII
KQXSCiJRQxWiUVqBgAEiAUgCgHBH8HUDAs31BghtTsZBc2AAAJgaAABERwICTXsGCK2sBgj1kQYI
DY0GCOxEAgLpRAICkbQGCKXUBghlBgwI4HUDAqKhALvIw9D/kABhAKoAOgBzAJEAYQDFAEEADAGS
AGEAywA1ANsA8wBiANEAcwDyAPQAUwAXADUAzwD1ABAAPgA2APMAlwEoAV4AaQDMAJgBJwFeAGkA
XQE=`)],
      ...romPayloads(decodeBase64(`GQSQADEAAAAYAMq7zM7TAMnAAM7CvwC+v727vr/////////////////////////////G2dvZ4tjV
5u0AysnFG8fJyP//////////////////////////////u8zOw73PyMm4ANS7yr7JzbgAx8nGzsy/
zbj//////////////////8y7w8XJz7gAv8jOv8O4AM3Pw73PyL+4AMa7zsO7zf/////////////j
5gDGu87Dyc3wANfc4+Pn2QDj4tkA4+L/////////////////////o8AA49oA1QDKycUbx8nIAL2/
yM6/zK3//////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF3AAACB+vAAAIRbsF3AAACB+8AAAIALsF3AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBvgAACBYEgAAAIxUPAAORAiENgAAAuwHSAAAIfQAGgL1pAQAIZm4UCCENgAEAuwGF
AAAIFwSAAQC5UQAACEMjFQ8AAywBIQ2AAgC7AcgAAAgp2AMxAQG95gAACGYybSENgAEAuwG0AAAI
aGwCvfYAAAhmbWhsAr0NAQAIZm1obAK9NQEACGZtaGwCvVUBAAhmbWhsAr18AQAIZm1obAL9AQDm
2dfZ3erZ2AD9Aqv/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3i
ANrj5v7V4uPo3NnmAOPi2av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq/+94+HZANbV
198A1eLtAOjd4dmr/9Hj6eDYAO3j6QDg3d/ZAP0CrP/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAPC1hrBjpGBIAIgKIUhDJBhPSwDwi/gGBDYM
APB9+AcEAPB6+AdDOAx4QExJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQRUgDkADwZvhHBH8MAPBi
+EAEgAg4QwSQAPBc+AYAP0ghiEYiACM+TwDwX/hGogchAPBY+PBDwAkxIQDwUfj/ICMhAPBN+AIg
JSEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgArSC1PAPA6+AE2BC700SdIK08A
8DP4K043eCRIBi8D0ypLAPAq+AvgZCF5QyVKiRhgIoNYi1AEOvvVATc3cAAgFkkIgAIoDNAgiCBL
APAV+AYAAiEfTwDwEfgwAAMhAPAN+Aaw8L0OSHBDDklGGDAMcEcFkAWqDUgPSxhHOEcVSAGIACII
KQXSCiJRQxWiUVqBgAEiAUgCgHBH0HADAslOBAhtTsZBc2AAAJgaAAAsQAICVdoDCH0DBAhl6QMI
feQDCIRCAgIpQAICkQsECJkyBAh1jggIwHADAqKhALvIw9D/kABhAKoAOgBzAJEAYQDFAEEADAGS
AGEAywA1ANsA8wBiANEAcwDyAPQAUwAXADUAzwD1ABAAPgA2APMAlwEoAV4AaQDMAJgBJwFeAGkA
XQE=`), {
        'BPRE 1.1': decodeBase64(`dAEBAVQEAd1oBA1p2gMIkQMECHnpAwiRgAQJpQsECK0yBAiJ`),
        'BPGE 1.0': decodeBase64(`XAEBR4gEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQFUBAHdaAQNadoDCJEDBAh56QMIkYAECaULBAitMgQIXQ==`),
      }),
    },
  },
  {
    id: 'custom-10-aniv-johto-hoenn',
    label: 'Party of the Decade: Johto & Hoenn (10 ANIV Event)',
    description: 'Choose one of the Johto and Hoenn favorites of the 2006 Pokémon 10th Anniversary “Party of the Decade”: Typhlosion, Espeon, Umbreon, Tyranitar, Blaziken or Absol. Each is level 70, OT 10 ANIV, ID 06808, from Ruby, with the event’s own moves, its nature, IVs and OT gender rolled the way the event rolled them, never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`GgTEADIAAAAIAMq7zM7TAMnAAM7CvwC+v727vr/////////////////////////////EycLOyQAt
AMLJv8jIANrV6uPm3ejZ5///////////////////////ztPKwsbJzcPJyLgAv83Kv8nIuADPx7zM
v8nIuP///////////////87TzLvIw867zLgAvMa71MPFv8gA4+b///////////////////////+7
vM3JxvAA19zj4+fZAOPi2QDj4v//////////////////////////o8AA49oA1QDKycUbx8nIAL2/
yM6/zK3//////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsF3AAACB+vAAAIRbsF3AAACB+8AAAIALsF3AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBvgAACBYEgAAAI6UOAAORAiENgAAAuwHSAAAIfQAGgL1pAQAIZm4UCCENgAEAuwGF
AAAIFwSAAQC5UQAACEMjpQ4AAywBIQ2AAgC7AcgAAAgp5AExcgG95gAACGYybSENgAEAuwG0AAAI
aGwCvfYAAAhmbWhsAr0NAQAIZm1obAK9NQEACGZtaGwCvVUBAAhmbWhsAr18AQAIZm1obAL9AQDm
2dfZ3erZ2AD9Aqv/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3i
ANrj5v7V4uPo3NnmAOPi2av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq/+94+HZANbV
198A1eLtAOjd4dmr/9Hj6eDYAO3j6QDg3d/ZAP0CrP/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAPC1hrBjpGBIAIgKIUhDJBhPSwDwi/gGBDYM
APB9+AcEAPB6+AdDOAx4QExJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQRUgDkADwZvhHBH8MAPBi
+EAEgAg4QwSQAPBc+AYAP0ghiEYiACM+TwDwX/hGogchAPBY+PBDwAkxIQDwUfj/ICMhAPBN+AIg
JSEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgArSC1PAPA6+AE2BC700SdIK08A
8DP4K043eCRIBi8D0ypLAPAq+AvgZCF5QyVKiRhgIoNYi1AEOvvVATc3cAAgFkkIgAIoDNAgiCBL
APAV+AYAAiEfTwDwEfgwAAMhAPAN+Aaw8L0OSHBDDklGGDAMcEcFkAWqDUgPSxhHOEcVSAGIACIG
KQXSCiJRQxWiUVqBgAEiAUgCgHBH8HUDAs31BghtTsZBc2AAAJgaAABERwICTXsGCK2sBgj1kQYI
DY0GCOxEAgLpRAICkbQGCKXUBghlBgwI4HUDAqKhALvIw9D/nQBiAKwAgQA1AMQAPAD0AF4A6gDF
ALkA1ABnAOwA+AAlALgA8gBZABoBKwGjAHcARwF4AWgAowD4AMMA`)],
      ...romPayloads(decodeBase64(`GgTEADIAAAAIAMq7zM7TAMnAAM7CvwC+v727vr/////////////////////////////EycLOyQAt
AMLJv8jIANrV6uPm3ejZ5///////////////////////ztPKwsbJzcPJyLgAv83Kv8nIuADPx7zM
v8nIuP///////////////87TzLvIw867zLgAvMa71MPFv8gA4+b///////////////////////+7
vM3JxvAA19zj4+fZAOPi2QDj4v//////////////////////////o8AA49oA1QDKycUbx8nIAL2/
yM6/zK3//////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsF3AAACB+vAAAIRbsF3AAACB+8AAAIALsF3AAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBvgAACBYEgAAAIxUPAAORAiENgAAAuwHSAAAIfQAGgL1pAQAIZm4UCCENgAEAuwGF
AAAIFwSAAQC5UQAACEMjFQ8AAywBIQ2AAgC7AcgAAAgp2AMxAQG95gAACGYybSENgAEAuwG0AAAI
aGwCvfYAAAhmbWhsAr0NAQAIZm1obAK9NQEACGZtaGwCvVUBAAhmbWhsAr18AQAIZm1obAL9AQDm
2dfZ3erZ2AD9Aqv/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3i
ANrj5v7V4uPo3NnmAOPi2av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq/+94+HZANbV
198A1eLtAOjd4dmr/9Hj6eDYAO3j6QDg3d/ZAP0CrP/O3N3nANvd2ugA2OPZ5+K06ADr4+bfAOvd
6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAPC1hrBjpGBIAIgKIUhDJBhPSwDwi/gGBDYM
APB9+AcEAPB6+AdDOAx4QExJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQRUgDkADwZvhHBH8MAPBi
+EAEgAg4QwSQAPBc+AYAP0ghiEYiACM+TwDwX/hGogchAPBY+PBDwAkxIQDwUfj/ICMhAPBN+AIg
JSEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgArSC1PAPA6+AE2BC700SdIK08A
8DP4K043eCRIBi8D0ypLAPAq+AvgZCF5QyVKiRhgIoNYi1AEOvvVATc3cAAgFkkIgAIoDNAgiCBL
APAV+AYAAiEfTwDwEfgwAAMhAPAN+Aaw8L0OSHBDDklGGDAMcEcFkAWqDUgPSxhHOEcVSAGIACIG
KQXSCiJRQxWiUVqBgAEiAUgCgHBH0HADAslOBAhtTsZBc2AAAJgaAAAsQAICVdoDCH0DBAhl6QMI
feQDCIRCAgIpQAICkQsECJkyBAh1jggIwHADAqKhALvIw9D/nQBiAKwAgQA1AMQAPAD0AF4A6gDF
ALkA1ABnAOwA+AAlALgA8gBZABoBKwGjAHcARwF4AWgAowD4AMMA`), {
        'BPRE 1.1': decodeBase64(`dAEBAVQEAd1oBA1p2gMIkQMECHnpAwiRgAQJpQsECK0yBAiJ`),
        'BPGE 1.0': decodeBase64(`XAEBR4gEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQFUBAHdaAQNadoDCJEDBAh56QMIkYAECaULBAitMgQIXQ==`),
      }),
    },
  },
  {
    id: 'custom-doel-deoxys',
    label: 'Deoxys (DOEL Event)',
    description: 'A Deoxys like the one the DOEL distribution gave: level 70, OT DOEL, ID 28606, from Ruby, knowing Cosmic Power, Recover, Psycho Boost and Hyper Beam, marked as met in a fateful encounter so it obeys. Like any Deoxys it takes your game’s form: Speed Forme in Emerald, Attack Forme in FireRed, Defense Forme in LeafGreen. Never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`GwSaATMAAAAYAL7Jv8YAvr/J0tPN///////////////////////////////////////A5uPhAOPp
6NnmAOfk1dfZ////////////////////////////////ztzZAL6/ydLTzQDj2gDo3NkAvsm/xv//
/////////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBhQAACEMjpQ4AAwEBIQ2AAgC7AY8AAAgp5AExcgG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAL6/
ydLTzav/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAL6/ydLTzav/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsFukS0sA8I/4
BgQ2DADwgfgHBADwfvgHQzgMeEBHSUhAAATADALRCDf/CP8AAZcBIACQASACkEFIA5AA8Gr4RwR/
DADwZvhABIAIOEMEkADwYPgGADpIIYhGIgAjOU8A8GP4QaIHIQDwXPjwQ8AJMSEA8FX4/yAjIQDw
UfgCICUhAPBN+AEgUCEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgAkSCdPAPA6
+AE2BC700SFIJE8A8DP4JU43eB5IBi8D0yNLAPAq+AvgZCF5Qx5KiRhgIoNYi1AEOvvVATc3cAAg
D0kIgAIoDNAgiBpLAPAV+AYAAiEYTwDwEfgwAAMhAPAN+Aaw8L0ISHBDCElGGDAMcEcFkAWqB0gI
SxhHOEfARvB1AwLN9QYIbU7GQXNgAAC+bwAAREcCAk17BgitrAYI9ZEGCA2NBgjsRAIC6UQCApG0
Bgil1AYIZQYMCL7Jv8b/////mgFCAWkAYgE/AMBG`)],
      ...romPayloads(decodeBase64(`GwSaATMAAAAYAL7Jv8YAvr/J0tPN///////////////////////////////////////A5uPhAOPp
6NnmAOfk1dfZ////////////////////////////////ztzZAL6/ydLTzQDj2gDo3NkAvsm/xv//
/////////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFQ8AAwEBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAL6/
ydLTzav/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAL6/ydLTzav/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsFukS0sA8I/4
BgQ2DADwgfgHBADwfvgHQzgMeEBHSUhAAATADALRCDf/CP8AAZcBIACQASACkEFIA5AA8Gr4RwR/
DADwZvhABIAIOEMEkADwYPgGADpIIYhGIgAjOU8A8GP4QaIHIQDwXPjwQ8AJMSEA8FX4/yAjIQDw
UfgCICUhAPBN+AEgUCEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgAkSCdPAPA6
+AE2BC700SFIJE8A8DP4JU43eB5IBi8D0yNLAPAq+AvgZCF5Qx5KiRhgIoNYi1AEOvvVATc3cAAg
D0kIgAIoDNAgiBpLAPAV+AYAAiEYTwDwEfgwAAMhAPAN+Aaw8L0ISHBDCElGGDAMcEcFkAWqB0gI
SxhHOEfARtBwAwLJTgQIbU7GQXNgAAC+bwAALEACAlXaAwh9AwQIZekDCH3kAwiEQgICKUACApEL
BAiZMgQIdY4ICL7Jv8b/////mgFCAWkAYgE/AMBG`), {
        'BPRE 1.1': decodeBase64(`dAEBAdQDAd3oAw1p2gMIkQMECHnpAwiRAAQJpQsECK0yBAiJ`),
        'BPGE 1.0': decodeBase64(`XAEBRwgEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHUAwHd6AMNadoDCJEDBAh56QMIkQAECaULBAitMgQIXQ==`),
      }),
    },
  },
  {
    id: 'custom-space-c-deoxys',
    label: 'Deoxys (SPACE C Event)',
    description: 'A Deoxys like the one the SPACE C distribution gave: level 70, OT SPACE C, ID 00010, from Ruby, knowing Cosmic Power, Recover, Psycho Boost and Hyper Beam, marked as met in a fateful encounter so it obeys. Like any Deoxys it takes your game’s form: Speed Forme in Emerald, Attack Forme in FireRed, Defense Forme in LeafGreen. Never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`HASaATQAAAAUAM3Ku72/AL0Avr/J0tPN///////////////////////////////////A5uPhAOPp
6NnmAOfk1dfZ////////////////////////////////ztzZAL6/ydLTzQDj2gDo3NkAzcq7vb8A
vf///////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBhQAACEMjpQ4AAwEBIQ2AAgC7AY8AAAgp5AExcgG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAL6/
ydLTzav/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAL6/ydLTzav/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsFukS0sA8I/4
BgQ2DADwgfgHBADwfvgHQzgMeEBHSUhAAATADALRCDf/CP8AAZcBIACQASACkEFIA5AA8Gr4RwR/
DADwZvhABIAIOEMEkADwYPgGADpIIYhGIgAjOU8A8GP4QaIHIQDwXPjwQ8AJMSEA8FX4/yAjIQDw
UfgCICUhAPBN+AEgUCEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgAkSCdPAPA6
+AE2BC700SFIJE8A8DP4JU43eB5IBi8D0yNLAPAq+AvgZCF5Qx5KiRhgIoNYi1AEOvvVATc3cAAg
D0kIgAIoDNAgiBpLAPAV+AYAAiEYTwDwEfgwAAMhAPAN+Aaw8L0ISHBDCElGGDAMcEcFkAWqB0gI
SxhHOEfARvB1AwLN9QYIbU7GQXNgAAAKAAAAREcCAk17BgitrAYI9ZEGCA2NBgjsRAIC6UQCApG0
Bgil1AYIZQYMCM3Ku72/AL3/mgFCAWkAYgE/AMBG`)],
      ...romPayloads(decodeBase64(`HASaATQAAAAUAM3Ku72/AL0Avr/J0tPN///////////////////////////////////A5uPhAOPp
6NnmAOfk1dfZ////////////////////////////////ztzZAL6/ydLTzQDj2gDo3NkAzcq7vb8A
vf///////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFQ8AAwEBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAL6/
ydLTzav/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAL6/ydLTzav/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsFukS0sA8I/4
BgQ2DADwgfgHBADwfvgHQzgMeEBHSUhAAATADALRCDf/CP8AAZcBIACQASACkEFIA5AA8Gr4RwR/
DADwZvhABIAIOEMEkADwYPgGADpIIYhGIgAjOU8A8GP4QaIHIQDwXPjwQ8AJMSEA8FX4/yAjIQDw
UfgCICUhAPBN+AEgUCEA8En4BJ4nJx8gMEB2CTkAAPBB+AE3LS/20QAmcQBhGEmIMgAkSCdPAPA6
+AE2BC700SFIJE8A8DP4JU43eB5IBi8D0yNLAPAq+AvgZCF5Qx5KiRhgIoNYi1AEOvvVATc3cAAg
D0kIgAIoDNAgiBpLAPAV+AYAAiEYTwDwEfgwAAMhAPAN+Aaw8L0ISHBDCElGGDAMcEcFkAWqB0gI
SxhHOEfARtBwAwLJTgQIbU7GQXNgAAAKAAAALEACAlXaAwh9AwQIZekDCH3kAwiEQgICKUACApEL
BAiZMgQIdY4ICM3Ku72/AL3/mgFCAWkAYgE/AMBG`), {
        'BPRE 1.1': decodeBase64(`dAEBAdQDAd3oAw1p2gMIkQMECHnpAwiRAAQJpQsECK0yBAiJ`),
        'BPGE 1.0': decodeBase64(`XAEBRwgEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHUAwHd6AMNadoDCJEDBAh56QMIkQAECaULBAitMgQIXQ==`),
      }),
    },
  },
  {
    id: 'custom-aura-mew',
    label: 'Mew (Aura Event)',
    description: 'A Mew like the one the Aura distribution gave: level 10, OT Aura, ID 20078, from Ruby, knowing Pound and Transform, marked as met in a fateful encounter so it obeys. Never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`HQSXADUAAAAMALvPzLsAx7/R///////////////////////////////////////////O3NkAu+nm
1QDb3dro////////////////////////////////////ztzZAMe/0QDj2gDo3NkAu+nm1f//////
/////////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBhQAACEMjpQ4AA/0AIQ2AAgC7AY8AAAgp5AExcgG9owAACGYybSENgAEAuwF7AAAI
aGwCvbQAAAhmbWhsAr3LAAAIZm1obAK98wAACGZtaGwCvRMBAAhmbWhsAv0BAObZ19nd6tnYAMe/
0av/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V4uPo
3NnmAMe/0av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA2OPZ5+K0
6ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAADwtYawW6RLSwDwj/gGBDYM
APCB+AcEAPB++AdDOAx4QEdJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQQUgDkADwavhHBH8MAPBm
+EAEgAg4QwSQAPBg+AYAOkghiAoiACM5TwDwY/hBogchAPBc+PBDwAkxIQDwVfj/ICMhAPBR+AIg
JSEA8E34ASBQIQDwSfgEnicnHyAwQHYJOQAA8EH4ATctL/bRACZxAGEYSYgyACRIJ08A8Dr4ATYE
LvTRIUgkTwDwM/glTjd4HkgGLwPTI0sA8Cr4C+BkIXlDHkqJGGAig1iLUAQ6+9UBNzdwACAPSQiA
AigM0CCIGksA8BX4BgACIRhPAPAR+DAAAyEA8A34BrDwvQhIcEMISUYYMAxwRwWQBaoHSAhLGEc4
R8BG8HUDAs31BghtTsZBc2AAAG5OAABERwICTXsGCK2sBgj1kQYIDY0GCOxEAgLpRAICkbQGCKXU
BghlBgwIu+nm1f////+XAAEAkAAAAAAAwEY=`)],
      ...romPayloads(decodeBase64(`HQSXADUAAAAMALvPzLsAx7/R///////////////////////////////////////////O3NkAu+nm
1QDb3dro////////////////////////////////////ztzZAMe/0QDj2gDo3NkAu+nm1f//////
/////////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFQ8AA/0AIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbQAAAhmbWhsAr3LAAAIZm1obAK98wAACGZtaGwCvRMBAAhmbWhsAv0BAObZ19nd6tnYAMe/
0av/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V4uPo
3NnmAMe/0av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA2OPZ5+K0
6ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAADwtYawW6RLSwDwj/gGBDYM
APCB+AcEAPB++AdDOAx4QEdJSEAABMAMAtEIN/8I/wABlwEgAJABIAKQQUgDkADwavhHBH8MAPBm
+EAEgAg4QwSQAPBg+AYAOkghiAoiACM5TwDwY/hBogchAPBc+PBDwAkxIQDwVfj/ICMhAPBR+AIg
JSEA8E34ASBQIQDwSfgEnicnHyAwQHYJOQAA8EH4ATctL/bRACZxAGEYSYgyACRIJ08A8Dr4ATYE
LvTRIUgkTwDwM/glTjd4HkgGLwPTI0sA8Cr4C+BkIXlDHkqJGGAig1iLUAQ6+9UBNzdwACAPSQiA
AigM0CCIGksA8BX4BgACIRhPAPAR+DAAAyEA8A34BrDwvQhIcEMISUYYMAxwRwWQBaoHSAhLGEc4
R8BG0HADAslOBAhtTsZBc2AAAG5OAAAsQAICVdoDCH0DBAhl6QMIfeQDCIRCAgIpQAICkQsECJky
BAh1jggIu+nm1f////+XAAEAkAAAAAAAwEY=`), {
        'BPRE 1.1': decodeBase64(`dAEBAdADAd3kAw1p2gMIkQMECHnpAwiR/AMJpQsECK0yBAiJ`),
        'BPGE 1.0': decodeBase64(`XAEBRwQEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHQAwHd5AMNadoDCJEDBAh56QMIkfwDCaULBAitMgQIXQ==`),
      }),
    },
  },
  {
    id: 'custom-mystry-mew',
    label: 'Mew (MYSTRY Event)',
    description: 'A Mew like the one the MYSTRY distribution gave: level 10, OT MYSTRY, ID 06930, from Ruby, knowing Pound and Transform, marked as met in a fateful encounter so it obeys. It comes from one of the 86 seeds the real ones came from, as PKHeX expects. Never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`HgSXADYAAAAEAMfTzc7M0wDHv9H////////////////////////////////////////O3NkAx9PN
zszTANvd2uj/////////////////////////////////ztzZAMe/0QDj2gDo3NkAx9PNzszT////
/////////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBhQAACEMjpQ4AA/0AIQ2AAgC7AY8AAAgp5AExcgG9owAACGYybSENgAEAuwF7AAAI
aGwCvbQAAAhmbWhsAr3LAAAIZm1obAK98wAACGZtaGwCvRMBAAhmbWhsAv0BAObZ19nd6tnYAMe/
0av/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V4uPo
3NnmAMe/0av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA2OPZ5+K0
6ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAADwtYawZqRVSwDwpPgGBDYM
MABWIQbfSQBkoEBasgeSDwEyXEmIQgDRAiIFIUpDBgAA8Ib4ATr70QDwgvgHBADwf/gHQzgMeEBH
SUhAAATADALRCDf/CP8AAZcBIACQASACkEFIA5AA8Gv4RwR/DADwZ/hABIAIOEMEkADwYfgGADpI
IYgKIgAjOU8A8GT4QqIHIQDwXfgwAAMhBt8xIQDwVfj/ICMhAPBR+AIgJSEA8E34ASBQIQDwSfgE
nicnHyAwQHYJOQAA8EH4ATctL/bRACZxAGEYSYgyACRIJk8A8Dr4ATYELvTRIEgkTwDwM/gkTjd4
HUgGLwPTI0sA8Cr4C+BkIXlDHkqJGGAig1iLUAQ6+9UBNzdwACAPSQiAAigM0CCIGUsA8BX4BgAC
IRhPAPAR+DAAAyEA8A34BrDwvQdIcEMHSUYYMAxwRwWQBaoGSAhLGEc4R/B1AwLN9QYIbU7GQXNg
AAASGwAAREcCAk17BgitrAYI9ZEGCA2NBgjsRAIC6UQCApG0Bgil1AYIZQYMCGVgAADH083OzNP/
/5cAAQCQAAAAAADARlIGMgkTDEMN7g5jEskTFBYJHKUevyCJIzkpLTBuMPM080XORg1KY0t5TI5Q
q1BAUidTulbMVkFYYFrBWyte815lYD9kV2SjZ0RpBm5ibmd273fSeFWGkopIi9CTHZSglX2WkJY3
nECcnJ3knYaeU6FDpKyoCKz7r/KxMbiWvtTChcPOxizJU8liyUPMR82WzeTR7d8s5szmCuld6ZHp
sut/7p/uyO/k8E7+nf4=`)],
      ...romPayloads(decodeBase64(`HgSXADYAAAAEAMfTzc7M0wDHv9H////////////////////////////////////////O3NkAx9PN
zszTANvd2uj/////////////////////////////////ztzZAMe/0QDj2gDo3NkAx9PNzszT////
/////////////////////9jd5+jm3dbp6N3j4rgA5tnV2O0A6OMA49bZ7a3////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFQ8AA/0AIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbQAAAhmbWhsAr3LAAAIZm1obAK98wAACGZtaGwCvRMBAAhmbWhsAv0BAObZ19nd6tnYAMe/
0av/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V4uPo
3NnmAMe/0av/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA2OPZ5+K0
6ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8AAADwtYawZqRVSwDwpPgGBDYM
MABWIQbfSQBkoEBasgeSDwEyXEmIQgDRAiIFIUpDBgAA8Ib4ATr70QDwgvgHBADwf/gHQzgMeEBH
SUhAAATADALRCDf/CP8AAZcBIACQASACkEFIA5AA8Gv4RwR/DADwZ/hABIAIOEMEkADwYfgGADpI
IYgKIgAjOU8A8GT4QqIHIQDwXfgwAAMhBt8xIQDwVfj/ICMhAPBR+AIgJSEA8E34ASBQIQDwSfgE
nicnHyAwQHYJOQAA8EH4ATctL/bRACZxAGEYSYgyACRIJk8A8Dr4ATYELvTRIEgkTwDwM/gkTjd4
HUgGLwPTI0sA8Cr4C+BkIXlDHkqJGGAig1iLUAQ6+9UBNzdwACAPSQiAAigM0CCIGUsA8BX4BgAC
IRhPAPAR+DAAAyEA8A34BrDwvQdIcEMHSUYYMAxwRwWQBaoGSAhLGEc4R9BwAwLJTgQIbU7GQXNg
AAASGwAALEACAlXaAwh9AwQIZekDCH3kAwiEQgICKUACApELBAiZMgQIdY4ICGVgAADH083OzNP/
/5cAAQCQAAAAAADARlIGMgkTDEMN7g5jEskTFBYJHKUevyCJIzkpLTBuMPM080XORg1KY0t5TI5Q
q1BAUidTulbMVkFYYFrBWyte815lYD9kV2SjZ0RpBm5ibmd273fSeFWGkopIi9CTHZSglX2WkJY3
nECcnJ3knYaeU6FDpKyoCKz7r/KxMbiWvtTChcPOxizJU8liyUPMR82WzeTR7d8s5szmCuld6ZHp
sut/7p/uyO/k8E7+nf4=`), {
        'BPRE 1.1': decodeBase64(`dAEBAfgDAd0MBA1p2gMIkQMECHnpAwiRJAQJpQsECK0yBAiJ`),
        'BPGE 1.0': decodeBase64(`XAEBRywEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQH4AwHdDAQNadoDCJEDBAh56QMIkSQECaULBAitMgQIXQ==`),
      }),
    },
  },
  {
    id: 'custom-rocks-metang',
    label: 'Metang (ROCKS Event)',
    description: 'A Metang like the one the ROCKS distribution gave: level 30, OT ROCKS, ID 02005, from Ruby, knowing Take Down, Confusion, Metal Claw and Refresh, with the National Ribbon. Never shiny. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`HwSPATcAAAAUAMzJvcXNAMe/zrvIwf/////////////////////////////////////R3ejcAOjc
2QDI1ejd4+LV4ADM3dbW4+L/////////////////////ztzZAMe/zrvIwQDj2gDo3NkAzMm9xc3/
/////////////////////9jd5+jm3dbp6N3j4rgA693o3ADd6OcA5t3W1uPirf/////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBhQAACEMjpQ4AAwEBIQ2AAgC7AY8AAAgp5AExcgG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAMe/
zrvIwav/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAMe/zrvIwav/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsFmkSUsA8Iv4
BgQ2DADwffgHBADwevgHQzgMeEBFSUhAAATADALRCDf/CP8AAZcBIACQASACkD9IA5AA8Gb4RwR/
DADwYvhABIAIOEMEkDpIIYgeIgAjOU8A8GL4QKIHIQDwW/gAIDEhAPBV+P8gIyEA8FH4AiAlIQDw
TfgBIEwhAPBJ+ASeJycfIDBAdgk5AADwQfgBNy0v9tEAJnEAYRhJiDIAJEgnTwDwOvgBNgQu9NEh
SCRPAPAz+CVON3geSAYvA9MjSwDwKvgL4GQheUMeSokYYCKDWItQBDr71QE3N3AAIA9JCIACKAzQ
IIgaSwDwFfgGAAIhGE8A8BH4MAADIQDwDfgGsPC9CEhwQwhJRhgwDHBHBZAFqgdICEsYRzhHwEbw
dQMCzfUGCG1OxkFzYAAA1QcAAERHAgJNewYIrawGCPWRBggNjQYI7EQCAulEAgKRtAYIpdQGCGUG
DAjMyb3Fzf///48BJABdAOgAHwHARg==`)],
      ...romPayloads(decodeBase64(`HwSPATcAAAAUAMzJvcXNAMe/zrvIwf/////////////////////////////////////R3ejcAOjc
2QDI1ejd4+LV4ADM3dbW4+L/////////////////////ztzZAMe/zrvIwQDj2gDo3NkAzMm9xc3/
/////////////////////9jd5+jm3dbp6N3j4rgA693o3ADd6OcA5t3W1uPirf/////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IAo8D/////////////////49oA1QDKycUbx8nIAL2/yM6/
zK3//////////////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmQAACB+vAAAIRbsFmQAACB+8AAAIALsFmQAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhQAACEMjFQ8AAwEBIQ2AAgC7AY8AAAgp2AMxAQG9owAACGYybSENgAEAuwF7AAAI
aGwCvbcAAAhmbWhsAr3OAAAIZm1obAK9+QAACGZtaGwCvRkBAAhmbWhsAv0BAObZ19nd6tnYAMe/
zrvIwav/w+gA69XnAOfZ4ugA6OMA6NzZAMq9rf/M2dfZ3erZAOjc2QDX1ebYANXb1d3iANrj5v7V
4uPo3NnmAMe/zrvIwav/0+Pp5gDk1ebo7QDV4tgA6NzZAMq9ANXm2QDa6eDgq//O3N3nANvd2ugA
2OPZ5+K06ADr4+bfAOvd6Nz+6Nzd5wDq2ebn3ePiAOPaAOjc2QDb1eHZrf8A8LWGsFmkSUsA8Iv4
BgQ2DADwffgHBADwevgHQzgMeEBFSUhAAATADALRCDf/CP8AAZcBIACQASACkD9IA5AA8Gb4RwR/
DADwYvhABIAIOEMEkDpIIYgeIgAjOU8A8GL4QKIHIQDwW/gAIDEhAPBV+P8gIyEA8FH4AiAlIQDw
TfgBIEwhAPBJ+ASeJycfIDBAdgk5AADwQfgBNy0v9tEAJnEAYRhJiDIAJEgnTwDwOvgBNgQu9NEh
SCRPAPAz+CVON3geSAYvA9MjSwDwKvgL4GQheUMeSokYYCKDWItQBDr71QE3N3AAIA9JCIACKAzQ
IIgaSwDwFfgGAAIhGE8A8BH4MAADIQDwDfgGsPC9CEhwQwhJRhgwDHBHBZAFqgdICEsYRzhHwEbQ
cAMCyU4ECG1OxkFzYAAA1QcAACxAAgJV2gMIfQMECGXpAwh95AMIhEICAilAAgKRCwQImTIECHWO
CAjMyb3Fzf///48BJABdAOgAHwHARg==`), {
        'BPRE 1.1': decodeBase64(`dAEBAcwDAd3gAw1p2gMIkQMECHnpAwiR+AMJpQsECK0yBAiJ`),
        'BPGE 1.0': decodeBase64(`XAEBRwAEAUk=`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQHMAwHd4AMNadoDCJEDBAh56QMIkfgDCaULBAitMgQIXQ==`),
      }),
    },
  },
  {
    id: 'custom-starter-egg',
    label: 'Starter Egg (Random First Partner)',
    description: 'An Egg with one of the nine first partners of Kanto, Johto and Hoenn inside, picked at random: Bulbasaur, Charmander, Squirtle, Chikorita, Cyndaquil, Totodile, Treecko, Torchic or Mudkip. It hatches like any Egg, with you as its trainer. Not an official event. It joins your party, or goes to the PC when the party is full. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`JAScATwAAAAQAM3Ou8zOv8wAv8HB///////////////////////////////////////R3N3X3ADj
4tkA693g4ADc1ejX3Kz/////////////////////////u+IAv8HBAOvd6NwA4+LZAOPaAOjc2QDi
3eLZ/////////////////9rd5ufoAOTV5uji2ebnAN3i593Y2a0A0N3n3ej////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFmwAACB+vAAAIRbsFmwAACB+8AAAIALsFmwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvkAbsBhwAACCOlDgADAgF6BIAhDYACALsBkQAACCnkATFyAb2lAAAIZjJtIQ2AAQC7AX0A
AAhobAK9uQAACGZtaGwCvdAAAAhmbWhsAr34AAAIZm1obAK9GAEACGZtaGwC/QEA5tnX2d3q2dgA
1eIAv8HBq//D6ADr1ecA59ni6ADo4wDo3NkAyr2t/8zZ19nd6tkA6NzZANfV5tgA1dvV3eIA2uPm
/tXi4+jc2eYAv8HBq//T4+nmAOTV5ujtANXi2ADo3NkAyr0A1ebZANrp4OCr/87c3ecA293a6ADY
49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAALUGSwDwCPgJIQbf
SQAFoEBaA0kIgAC9GEfARs31BgjgdQMCAQAEAAcAmACbAJ4AFQEYARsBwEY=`)],
      ...romPayloads(decodeBase64(`JAScATwAAAAQAM3Ou8zOv8wAv8HB///////////////////////////////////////R3N3X3ADj
4tkA693g4ADc1ejX3Kz/////////////////////////u+IAv8HBAOvd6NwA4+LZAOPaAOjc2QDi
3eLZ/////////////////9rd5ufoAOTV5uji2ebnAN3i593Y2a0A0N3n3ej////////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFmwAACB+vAAAIRbsFmwAACB+8AAAIALsFmwAACA8A0HgAAg8BkXhAGA8CgBgEMg8D
mmAARyvYA7sBhwAACCMVDwADAgF6BIAhDYACALsBkQAACCnYAzEBAb2lAAAIZjJtIQ2AAQC7AX0A
AAhobAK9uQAACGZtaGwCvdAAAAhmbWhsAr34AAAIZm1obAK9GAEACGZtaGwC/QEA5tnX2d3q2dgA
1eIAv8HBq//D6ADr1ecA59ni6ADo4wDo3NkAyr2t/8zZ19nd6tkA6NzZANfV5tgA1dvV3eIA2uPm
/tXi4+jc2eYAv8HBq//T4+nmAOTV5ujtANXi2ADo3NkAyr0A1ebZANrp4OCr/87c3ecA293a6ADY
49nn4rToAOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/wAAALUGSwDwCPgJIQbf
SQAFoEBaA0kIgAC9GEfARslOBAjAcAMCAQAEAAcAmACbAJ4AFQEYARsBwEY=`), {
        'BPRE 1.1': decodeBase64(`dAEBAbwCAd0=`),
        'BPGE 1.0': decodeBase64(`XAEBRw==`),
        'BPGE 1.1': decodeBase64(`XAEBR3QBAQG8AgHd`),
      }),
    },
  },
  {
    id: 'custom-gift-box',
    label: 'Gift Box (Money, Rare Candies, Coins, BP)',
    description: '¥100,000, 99 Rare Candies when your bag has room, 1,000 Coins when you have the Coin Case and room for them, and in Emerald 100 Battle Points. Money stops at ¥999,999, Coins at 9,999 and Battle Points at 9,999, as in the game. One per card; receive the card again for another.',
    roms: NATIVE_ROMS,
    payloads: {
      emerald: [decodeBase64(`JQRxAD0AAAAIAMHDwM4AvMnS///////////////////////////////////////////H4+LZ7bgA
19Xi2O0A1eLYAOHj5tn/////////////////////////t6KhobihoaG4AKqqAMy7zL8AvbvIvsO/
zQDV4tj//////////////73Jw8jNAOPmALy7zs7GvwDKycPIzs2tANDd593o///////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIRbsFsQAACB+vAAAIRbsFsQAACB+8AAAIALsFsQAACCvkAbsBpwAACCnkAZCghgEAADFy
Ab27AAAIZjJtRkQAYwAhDYAAALsBmwAACEREAGMAvdEAAAhmbUcEAQEAIQ2AAAC7AYkAAAi06AMh
DYAAALsFiQAACL0fAQAIZm0WBIBkACXKAb04AQAIZm1obAK97gAACGZtuWQAAAi9VwEACGZtaGwC
vYQBAAhmbWhsAv0BAObZ19nd6tnYALeioaG4oaGhq//9AQDm2dfZ3erZ2ACqqgDMu8y//r27yL7D
v82r/87c2ebZtOcA4uMA5uPj4QDd4gDt4+nmANbV2/7a4+YAqqoAzLvMvwC9u8i+w7/Nq//9AQDm
2dfZ3erZ2ACiuKGhoQC9ycPIzav//QEA5tnX2d3q2dgAoqGh/ry7zs7GvwDKycPIzs2r/8zZ19nd
6tkA6NzZANfV5tgA1dvV3eIA2uPm/tXi4+jc2eYAwcPAzgC8ydKr/87c3ecA293a6ADY49nn4rTo
AOvj5t8A693o3P7o3N3nAOrZ5ufd4+IA49oA6NzZANvV4dmt/w==`)],
      ...romPayloads(decodeBase64(`JQRxAD0AAAAIAMHDwM4AvMnS///////////////////////////////////////////H4+LZ7bgA
19Xi2O0A1eLYAOHj5tn/////////////////////////t6KhobihoaG4AKqqAMy7zL8AvbvIvsO/
zQDV4tj//////////////73Jw8jNAOPmALy7zs7GvwDKycPIzs2tANDd593o///////////////o
3NkA2Nng3erZ5u3h1eIA4+IA6NzZAKPi2P//////////////////2uDj4+YA49oA1QDKycUbx8nI
AL2/yM6/zK3//////////////////8G8rsbd4t8AztnV4f//////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
Wh+uAAAIUrsFogAACB+vAAAIRbsFogAACB+8AAAIALsFogAACCvYA7sBmAAACCnYA5CghgEAADEB
Ab2sAAAIZjJtRkQAYwAhDYAAALsBjAAACEREAGMAvcIAAAhmbUcEAQEAIQ2AAAC7AYkAAAi06AMh
DYAAALsFiQAACL0QAQAIZm1obAK93wAACGZtuWQAAAi9KQEACGZtaGwCvVYBAAhmbWhsAv0BAObZ
19nd6tnYALeioaG4oaGhq//9AQDm2dfZ3erZ2ACqqgDMu8y//r27yL7Dv82r/87c2ebZtOcA4uMA
5uPj4QDd4gDt4+nmANbV2/7a4+YAqqoAzLvMvwC9u8i+w7/Nq//9AQDm2dfZ3erZ2ACiuKGhoQC9
ycPIzav/zNnX2d3q2QDo3NkA19Xm2ADV29Xd4gDa4+b+1eLj6NzZ5gDBw8DOALzJ0qv/ztzd5wDb
3droANjj2efitOgA6+Pm3wDr3ejc/ujc3ecA6tnm593j4gDj2gDo3NkA29Xh2a3/`), {
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
