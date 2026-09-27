function decodeBase64(s) {
  const bin = atob(s.replace(/\s+/g, ""));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export const CUSTOM_WONDERCARDS = [
  {
    id: 'custom-speed-emerald-0-5',
    label: 'Slow Down 0.5× Emerald',
    blurb: 'English Emerald. After the card saves, talk to the deliveryman on Pokémon Center 2F. Hold R for half speed. Let go to play at normal speed. Talk to them again after each reset.',
    source: 'gblink turbo hook, English Emerald',
    game: 'emerald',
    flagId: 1005,
    effect: 'Hold R for half speed. Let go of R to play at normal speed. After a reset, talk to the deliveryman again.',
    iconSpecies: 101,
    payload: decodeBase64(`7QNlAAUAAAAAAMK7xsAAzcq/v77////////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////9vW4N3i3///////////////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WhEFAMABAhFIAcABAhEAAsABAhFoA8ABAhEFBMABAhFJBcABAhFCBsABAhFcB8ABAhEzCMABAhEq
CcABAhEDCsABAhHRC8ABAhEEDMABAhFKDcABAhFADsABAhEYD8ABAhGAEMABAhEYEcABAhEAEsAB
AhFHE8ABAhFwFMABAhFHFcABAhHAFsABAhFGF8ABAhGMGMABAhFdGcABAhEAGsABAhEDG8ABAhEs
HMABAhE3HcABAhEAHsABAhEAH8ABAhExIMABAhEBIcABAhEAIsABAhEAI8ABAiMBwAECve4AAAhm
bWhsAsLj4NgAzADo4wDk4NXtANXoANzV4NoA5+TZ2dir/sbZ6ADb4wDj2gDMAOjjAOTg1e0A4uPm
4dXg4O2t/wAAcLUA8B/4HogAIBiAEE0TpBBIBDgC1CFYKVD65w5IAWgqH0sbmwoB0RFoAOARYAAp
BNBrI5sA6VBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEcA/AMCGAIAACAnAAMwtWtIBIhtSAFoATEB
YHpIACgB0AEhAXAA8ID4APB8+GJLAPB6+ADwd/gBIARCI9FkTGelAPAj+GNMZ6UA8B/4X0ggIcJ+
ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFWSEFoATFBYFNMACwE0FFLAPBT+AE8+OcwvAG8AEcA
tVxJACkE0FFIgI0IQIhCQdEALD/QTUhBaGpokUI60QFoKmiRQjbRTknJiMkLMtEA8Hb4UkkAKRDQ
QErSaFMAGxiLQgrZPUgBaQExAWHRCAExUhoA1QAiwmAc4AG0O0gAIcGFAYYraADwGPg4SEFoa2iZ
Qg7RAPAR+ADwUfgCvEAaANXkMC1K0GCRaAExkWABPL7nAbABvABHcEcYRxC1J0hBaQApBtApShFg
gWlRYAAhQWGBYTZJACkt0C5KACoE0CJLm40TQJNCJdEcSMJpATKKQgDTACLCYQAqHNEbSxxoG0qU
QgPRXGgaSpRCB9AcaBlKlEIP0VxoGEqUQgvRGErSiNILB9ENSBxoRGFcaIRhIEwcYFxgELwBvABH
cEcYSACIoDgA1eQwcEfARjkHAAjcIgADeUcACAAAAABg/wMCsAECAgAAAAAAAAAAwCIAAwVeCAhd
XggI8Z4DCCGEAwjUfwMCAAAAAAB+AQbWeQMCyCYAAwABAAAAAAAA5AAAAAYAAAQAAAAAKEACAiBC
AAMCAAAAnf0DAg==`),
  },
  {
    id: 'custom-speed-emerald-0-75',
    label: 'Slow Down 0.75× Emerald',
    blurb: 'English Emerald. After the card saves, talk to the deliveryman on Pokémon Center 2F. Hold R for three-quarter speed. Let go to play at normal speed. Talk to them again after each reset.',
    source: 'gblink turbo hook, English Emerald',
    game: 'emerald',
    flagId: 1006,
    effect: 'Hold R for three-quarter speed. Let go of R to play at normal speed. After a reset, talk to the deliveryman again.',
    iconSpecies: 101,
    payload: decodeBase64(`7gNlAAYAAAAAAKGtqKa5AM3Kv7++///////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////9vW4N3i3///////////////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WhEFAMABAhFIAcABAhEAAsABAhFoA8ABAhEFBMABAhFJBcABAhFCBsABAhFcB8ABAhEzCMABAhEq
CcABAhEDCsABAhHRC8ABAhEEDMABAhFKDcABAhFADsABAhEYD8ABAhGAEMABAhEYEcABAhEAEsAB
AhFHE8ABAhFwFMABAhFHFcABAhHAFsABAhFGF8ABAhGMGMABAhFdGcABAhEAGsABAhEDG8ABAhEs
HMABAhE3HcABAhEAHsABAhEAH8ABAhExIMABAhEBIcABAhEAIsABAhEAI8ABAiMBwAECve4AAAhm
bWhsAsLj4NgAzADo4wDk4NXtANUA4N3o6ODZAOfg4+vZ5qv+xtnoANvjAOPaAMwA6OMA5ODV7QDi
4+bh1eDg7a3/cLUA8B/4HogAIBiAEE0TpBBIBDgC1CFYKVD65w5IAWgqH0sbmwoB0RFoAOARYAAp
BNBrI5sA6VBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEcA/AMCGAIAACAnAAMwtWtIBIhtSAFoATEB
YHpIACgB0AEhAXAA8ID4APB8+GJLAPB6+ADwd/gBIARCI9FkTGelAPAj+GNMZ6UA8B/4X0ggIcJ+
ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFWSEFoATFBYFNMACwE0FFLAPBT+AE8+OcwvAG8AEcA
tVxJACkE0FFIgI0IQIhCQdEALD/QTUhBaGpokUI60QFoKmiRQjbRTknJiMkLMtEA8Hb4UkkAKRDQ
QErSaFMAGxiLQgrZPUgBaQExAWHRCAExUhoA1QAiwmAc4AG0O0gAIcGFAYYraADwGPg4SEFoa2iZ
Qg7RAPAR+ADwUfgCvEAaANXkMC1K0GCRaAExkWABPL7nAbABvABHcEcYRxC1J0hBaQApBtApShFg
gWlRYAAhQWGBYTZJACkt0C5KACoE0CJLm40TQJNCJdEcSMJpATKKQgDTACLCYQAqHNEbSxxoG0qU
QgPRXGgaSpRCB9AcaBlKlEIP0VxoGEqUQgvRGErSiNILB9ENSBxoRGFcaIRhIEwcYFxgELwBvABH
cEcYSACIoDgA1eQwcEfARjkHAAjcIgADeUcACAAAAABg/wMCsAECAgAAAAAAAAAAwCIAAwVeCAhd
XggI8Z4DCCGEAwjUfwMCAAAAAAB+AQbWeQMCyCYAAwABAAAAAAAA5AAAAAYAAAQAAAAAKEACAiBC
AAMEAAAAnf0DAg==`),
  },
  {
    id: 'custom-speed-emerald-2',
    label: 'Fast Forward 2× Emerald',
    blurb: 'English Emerald. After the card saves, talk to the deliveryman on Pokémon Center 2F. Hold R for double speed. Let go to play at normal speed. Talk to them again after each reset.',
    source: 'gblink turbo hook, English Emerald',
    game: 'emerald',
    flagId: 1011,
    effect: 'Hold R for double speed. Let go of R to play at normal speed. After a reset, talk to the deliveryman again.',
    iconSpecies: 101,
    payload: decodeBase64(`8wNlAAsAAAAAAL7Jz7zGvwDNyr+/vv/////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////9vW4N3i3///////////////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WhEFAMABAhFIAcABAhEAAsABAhFoA8ABAhEFBMABAhFJBcABAhFCBsABAhFcB8ABAhEzCMABAhEq
CcABAhEDCsABAhHRC8ABAhEEDMABAhFKDcABAhFADsABAhEYD8ABAhGAEMABAhEYEcABAhEAEsAB
AhFHE8ABAhFwFMABAhFHFcABAhHAFsABAhFGF8ABAhGMGMABAhFdGcABAhEAGsABAhEDG8ABAhEs
HMABAhE3HcABAhEAHsABAhEAH8ABAhEtIMABAhEBIcABAhEAIsABAhEAI8ABAiMBwAECve4AAAhm
bWhsAsLj4NgAzADa4+YA2OPp1uDZAOfk2dnYq/7G2egA2+MA49oAzADo4wDk4NXtAOLj5uHV4ODt
rf8AAABwtQDwH/geiAAgGIAQTROkEEgEOALUIVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkE0Gsj
mwDpUGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwRwD8AwIYAgAAICcAAzC1a0gEiG1IAWgBMQFgekgA
KAHQASEBcADwgPgA8Hz4YksA8Hr4APB3+AEgBEIj0WRMZ6UA8CP4Y0xnpQDwH/hfSCAhwn4AKgfQ
gnkDeppCA9HCeUN6mkIO0CQwATnx0VZIQWgBMUFgU0wALATQUUsA8FP4ATz45zC8AbwARwC1XEkA
KQTQUUiAjQhAiEJB0QAsP9BNSEFoamiRQjrRAWgqaJFCNtFOScmIyQsy0QDwdvhSSQApENBAStJo
UwAbGItCCtk9SAFpATEBYdEIATFSGgDVACLCYBzgAbQ7SAAhwYUBhitoAPAY+DhIQWhraJlCDtEA
8BH4APBR+AK8QBoA1eQwLUrQYJFoATGRYAE8vucBsAG8AEdwRxhHELUnSEFpACkG0ClKEWCBaVFg
ACFBYYFhNkkAKS3QLkoAKgTQIkubjRNAk0Il0RxIwmkBMopCANMAIsJhACoc0RtLHGgbSpRCA9Fc
aBpKlEIH0BxoGUqUQg/RXGgYSpRCC9EYStKI0gsH0Q1IHGhEYVxohGEgTBxgXGAQvAG8AEdwRxhI
AIigOADV5DBwR8BGOQcACNwiAAN5RwAIAQAAAGD/AwKwAQICAQAAAAEAAADAIgADBV4ICF1eCAjx
ngMIIYQDCNR/AwIAAAAAAH4BBtZ5AwLIJgADAAEAAAAAAADkAAAABgAABAAAAAAoQAICIEIAAwAA
AACd/QMC`),
  },
  {
    id: 'custom-speed-emerald-3',
    label: 'Fast Forward 3× Emerald',
    blurb: 'English Emerald. After the card saves, talk to the deliveryman on Pokémon Center 2F. Hold R for triple speed. Let go to play at normal speed. Talk to them again after each reset.',
    source: 'gblink turbo hook, English Emerald',
    game: 'emerald',
    flagId: 1012,
    effect: 'Hold R for triple speed. Let go of R to play at normal speed. After a reset, talk to the deliveryman again.',
    iconSpecies: 101,
    payload: decodeBase64(`9ANlAAwAAAAAAM7Mw8rGvwDNyr+/vv/////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////9vW4N3i3///////////////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WhEFAMABAhFIAcABAhEAAsABAhFoA8ABAhEFBMABAhFJBcABAhFCBsABAhFcB8ABAhEzCMABAhEq
CcABAhEDCsABAhHRC8ABAhEEDMABAhFKDcABAhFADsABAhEYD8ABAhGAEMABAhEYEcABAhEAEsAB
AhFHE8ABAhFwFMABAhFHFcABAhHAFsABAhFGF8ABAhGMGMABAhFdGcABAhEAGsABAhEDG8ABAhEs
HMABAhE3HcABAhEAHsABAhEAH8ABAhEtIMABAhEBIcABAhEAIsABAhEAI8ABAiMBwAECve4AAAhm
bWhsAsLj4NgAzADa4+YA6Obd5ODZAOfk2dnYq/7G2egA2+MA49oAzADo4wDk4NXtAOLj5uHV4ODt
rf8AAABwtQDwH/geiAAgGIAQTROkEEgEOALUIVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkE0Gsj
mwDpUGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwRwD8AwIYAgAAICcAAzC1a0gEiG1IAWgBMQFgekgA
KAHQASEBcADwgPgA8Hz4YksA8Hr4APB3+AEgBEIj0WRMZ6UA8CP4Y0xnpQDwH/hfSCAhwn4AKgfQ
gnkDeppCA9HCeUN6mkIO0CQwATnx0VZIQWgBMUFgU0wALATQUUsA8FP4ATz45zC8AbwARwC1XEkA
KQTQUUiAjQhAiEJB0QAsP9BNSEFoamiRQjrRAWgqaJFCNtFOScmIyQsy0QDwdvhSSQApENBAStJo
UwAbGItCCtk9SAFpATEBYdEIATFSGgDVACLCYBzgAbQ7SAAhwYUBhitoAPAY+DhIQWhraJlCDtEA
8BH4APBR+AK8QBoA1eQwLUrQYJFoATGRYAE8vucBsAG8AEdwRxhHELUnSEFpACkG0ClKEWCBaVFg
ACFBYYFhNkkAKS3QLkoAKgTQIkubjRNAk0Il0RxIwmkBMopCANMAIsJhACoc0RtLHGgbSpRCA9Fc
aBpKlEIH0BxoGUqUQg/RXGgYSpRCC9EYStKI0gsH0Q1IHGhEYVxohGEgTBxgXGAQvAG8AEdwRxhI
AIigOADV5DBwR8BGOQcACNwiAAN5RwAIAgAAAGD/AwKwAQICAgAAAAIAAADAIgADBV4ICF1eCAjx
ngMIIYQDCNR/AwIAAAAAAH4BBtZ5AwLIJgADAAEAAAAAAADkAAAABgAABAAAAAAoQAICIEIAAwAA
AACd/QMC`),
  },
  {
    id: 'custom-speed-emerald-4',
    label: 'Fast Forward 4× Emerald',
    blurb: 'English Emerald. After the card saves, talk to the deliveryman on Pokémon Center 2F. Hold R for 4× speed. Let go to play at normal speed. Talk to them again after each reset.',
    source: 'gblink turbo hook, English Emerald',
    game: 'emerald',
    flagId: 1018,
    effect: 'Hold R for 4× speed. Let go of R to play at normal speed. After a reset, talk to the deliveryman again.',
    iconSpecies: 101,
    payload: decodeBase64(`+gNlABIAAAAAAKW5AM3Kv7++///////////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////9vW4N3i3///////////////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WhEFAMABAhFIAcABAhEAAsABAhFoA8ABAhEFBMABAhFJBcABAhFCBsABAhFcB8ABAhEzCMABAhEq
CcABAhEDCsABAhHRC8ABAhEEDMABAhFKDcABAhFADsABAhEYD8ABAhGAEMABAhEYEcABAhEAEsAB
AhFHE8ABAhFwFMABAhFHFcABAhHAFsABAhFGF8ABAhGMGMABAhFdGcABAhEAGsABAhEDG8ABAhEs
HMABAhE3HcABAhEAHsABAhEAH8ABAhExIMABAhEBIcABAhEAIsABAhEAI8ABAiMBwAECve4AAAhm
bWhsAsLj4NgAzADo4wDn5NnZ2ADo3NkA29Xh2QDp5Kv+xtnoANvjAOPaAMwA6OMA5ODV7QDi4+bh
1eDg7a3/AAAAcLUA8B/4HogAIBiAEE0TpBBIBDgC1CFYKVD65w5IAWgqH0sbmwoB0RFoAOARYAAp
BNBrI5sA6VBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEcA/AMCGAIAACAnAAMwtWtIBIhtSAFoATEB
YHpIACgB0AEhAXAA8ID4APB8+GJLAPB6+ADwd/gBIARCI9FkTGelAPAj+GNMZ6UA8B/4X0ggIcJ+
ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFWSEFoATFBYFNMACwE0FFLAPBT+AE8+OcwvAG8AEcA
tVxJACkE0FFIgI0IQIhCQdEALD/QTUhBaGpokUI60QFoKmiRQjbRTknJiMkLMtEA8Hb4UkkAKRDQ
QErSaFMAGxiLQgrZPUgBaQExAWHRCAExUhoA1QAiwmAc4AG0O0gAIcGFAYYraADwGPg4SEFoa2iZ
Qg7RAPAR+ADwUfgCvEAaANXkMC1K0GCRaAExkWABPL7nAbABvABHcEcYRxC1J0hBaQApBtApShFg
gWlRYAAhQWGBYTZJACkt0C5KACoE0CJLm40TQJNCJdEcSMJpATKKQgDTACLCYQAqHNEbSxxoG0qU
QgPRXGgaSpRCB9AcaBlKlEIP0VxoGEqUQgvRGErSiNILB9ENSBxoRGFcaIRhIEwcYFxgELwBvABH
cEcYSACIoDgA1eQwcEfARjkHAAjcIgADeUcACAQAAABg/wMCsAECAgMAAAADAAAAwCIAAwVeCAhd
XggI8Z4DCCGEAwjUfwMCAAAAAAB+AQbWeQMCyCYAAwABAAAAAAAA5AAAAAYAAAQAAAAAKEACAiBC
AAMAAAAAnf0DAg==`),
  },
  {
    id: 'custom-speed-frlg-0-5',
    label: 'Slow Down 0.5× FireRed/LeafGreen',
    blurb: 'English FireRed and LeafGreen. After the card saves, talk to the deliveryman on Pokémon Center 2F. Hold R for half speed. Let go to play at normal speed. Talk to them again after each reset.',
    source: 'gblink turbo hook, English FireRed',
    game: 'frlg',
    flagId: 1002,
    effect: 'Hold R for half speed. Let go of R to play at normal speed. After a reset, talk to the deliveryman again.',
    iconSpecies: 101,
    payload: decodeBase64(`6gNlAAIAAAAAAMK7xsAAzcq/v77////////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////9vW4N3i3///////////////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WhEFAMABAhFIAcABAhEAAsABAhFoA8ABAhEFBMABAhFJBcABAhFCBsABAhFcB8ABAhEzCMABAhEq
CcABAhEDCsABAhHRC8ABAhEEDMABAhFKDcABAhFADsABAhEYD8ABAhGAEMABAhEYEcABAhEAEsAB
AhFHE8ABAhFwFMABAhFHFcABAhHAFsABAhFGF8ABAhEIGMABAhFQGcABAhEAGsABAhEDG8ABAhEg
HMABAhE2HcABAhEAHsABAhEAH8ABAhExIMABAhEBIcABAhEAIsABAhEAI8ABAiMBwAECve4AAAhm
bWhsAsLj4NgAzADo4wDk4NXtANXoANzV4NoA5+TZ2dir/sbZ6ADb4wDj2gDMAOjjAOTg1e0A4uPm
4dXg4O2t/wAAcLUA8B/4HogAIBiAEE0TpBBIBDgC1CFYKVD65w5IAWgqH0sbmwoB0RFoAOARYAAp
BNBrI5sA6VBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEcA/AMCGAIAAFA1AAMwtWtIBIhtSAFoATEB
YHpIACgB0AEhAXAA8ID4APB8+GJLAPB6+ADwd/gBIARCI9FkTGelAPAj+GNMZ6UA8B/4X0ggIcJ+
ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFWSEFoATFBYFNMACwE0FFLAPBT+AE8+OcwvAG8AEcA
tVxJACkE0FFIgI0IQIhCQdEALD/QTUhBaGpokUI60QFoKmiRQjbRTknJiMkLMtEA8Hb4UkkAKRDQ
QErSaFMAGxiLQgrZPUgBaQExAWHRCAExUhoA1QAiwmAc4AG0O0gAIcGFAYYraADwGPg4SEFoa2iZ
Qg7RAPAR+ADwUfgCvEAaANXkMC1K0GCRaAExkWABPL7nAbABvABHcEcYRxC1J0hBaQApBtApShFg
gWlRYAAhQWGBYTZJACkt0C5KACoE0CJLm40TQJNCJdEcSMJpATKKQgDTACLCYQAqHNEbSxxoG0qU
QgPRXGgaSpRCB9AcaBlKlEIP0VxoGEqUQgvRGErSiNILB9ENSBxoRGFcaIRhIEwcYFxgELwBvABH
cEcYSACIoDgA1eQwcEfARiUHAAgMMQAD6S0ACAAAAABg/wMCNAACAgAAAAAAAAAA8DAAAzVlBQi1
ZQUI5SMBCAERAQi4egMCAAAAAAB+AQbWeQMCyCYAAwABAAB18QMC5AAAAAYAAAQAAAAAKEACAiBC
AAMCAAAAnf0DAg==`),
  },
  {
    id: 'custom-speed-frlg-0-75',
    label: 'Slow Down 0.75× FireRed/LeafGreen',
    blurb: 'English FireRed and LeafGreen. After the card saves, talk to the deliveryman on Pokémon Center 2F. Hold R for three-quarter speed. Let go to play at normal speed. Talk to them again after each reset.',
    source: 'gblink turbo hook, English FireRed',
    game: 'frlg',
    flagId: 1003,
    effect: 'Hold R for three-quarter speed. Let go of R to play at normal speed. After a reset, talk to the deliveryman again.',
    iconSpecies: 101,
    payload: decodeBase64(`6wNlAAMAAAAAAKGtqKa5AM3Kv7++///////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////9vW4N3i3///////////////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WhEFAMABAhFIAcABAhEAAsABAhFoA8ABAhEFBMABAhFJBcABAhFCBsABAhFcB8ABAhEzCMABAhEq
CcABAhEDCsABAhHRC8ABAhEEDMABAhFKDcABAhFADsABAhEYD8ABAhGAEMABAhEYEcABAhEAEsAB
AhFHE8ABAhFwFMABAhFHFcABAhHAFsABAhFGF8ABAhEIGMABAhFQGcABAhEAGsABAhEDG8ABAhEg
HMABAhE2HcABAhEAHsABAhEAH8ABAhExIMABAhEBIcABAhEAIsABAhEAI8ABAiMBwAECve4AAAhm
bWhsAsLj4NgAzADo4wDk4NXtANUA4N3o6ODZAOfg4+vZ5qv+xtnoANvjAOPaAMwA6OMA5ODV7QDi
4+bh1eDg7a3/cLUA8B/4HogAIBiAEE0TpBBIBDgC1CFYKVD65w5IAWgqH0sbmwoB0RFoAOARYAAp
BNBrI5sA6VBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEcA/AMCGAIAAFA1AAMwtWtIBIhtSAFoATEB
YHpIACgB0AEhAXAA8ID4APB8+GJLAPB6+ADwd/gBIARCI9FkTGelAPAj+GNMZ6UA8B/4X0ggIcJ+
ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFWSEFoATFBYFNMACwE0FFLAPBT+AE8+OcwvAG8AEcA
tVxJACkE0FFIgI0IQIhCQdEALD/QTUhBaGpokUI60QFoKmiRQjbRTknJiMkLMtEA8Hb4UkkAKRDQ
QErSaFMAGxiLQgrZPUgBaQExAWHRCAExUhoA1QAiwmAc4AG0O0gAIcGFAYYraADwGPg4SEFoa2iZ
Qg7RAPAR+ADwUfgCvEAaANXkMC1K0GCRaAExkWABPL7nAbABvABHcEcYRxC1J0hBaQApBtApShFg
gWlRYAAhQWGBYTZJACkt0C5KACoE0CJLm40TQJNCJdEcSMJpATKKQgDTACLCYQAqHNEbSxxoG0qU
QgPRXGgaSpRCB9AcaBlKlEIP0VxoGEqUQgvRGErSiNILB9ENSBxoRGFcaIRhIEwcYFxgELwBvABH
cEcYSACIoDgA1eQwcEfARiUHAAgMMQAD6S0ACAAAAABg/wMCNAACAgAAAAAAAAAA8DAAAzVlBQi1
ZQUI5SMBCAERAQi4egMCAAAAAAB+AQbWeQMCyCYAAwABAAB18QMC5AAAAAYAAAQAAAAAKEACAiBC
AAMEAAAAnf0DAg==`),
  },
  {
    id: 'custom-speed-frlg-2',
    label: 'Fast Forward 2× FireRed/LeafGreen',
    blurb: 'English FireRed and LeafGreen. After the card saves, talk to the deliveryman on Pokémon Center 2F. Hold R for double speed. Let go to play at normal speed. Talk to them again after each reset.',
    source: 'gblink turbo hook, English FireRed',
    game: 'frlg',
    flagId: 1006,
    effect: 'Hold R for double speed. Let go of R to play at normal speed. After a reset, talk to the deliveryman again.',
    iconSpecies: 101,
    payload: decodeBase64(`7gNlAAYAAAAAAL7Jz7zGvwDNyr+/vv/////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////9vW4N3i3///////////////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WhEFAMABAhFIAcABAhEAAsABAhFoA8ABAhEFBMABAhFJBcABAhFCBsABAhFcB8ABAhEzCMABAhEq
CcABAhEDCsABAhHRC8ABAhEEDMABAhFKDcABAhFADsABAhEYD8ABAhGAEMABAhEYEcABAhEAEsAB
AhFHE8ABAhFwFMABAhFHFcABAhHAFsABAhFGF8ABAhEIGMABAhFQGcABAhEAGsABAhEDG8ABAhEg
HMABAhE2HcABAhEAHsABAhEAH8ABAhEtIMABAhEBIcABAhEAIsABAhEAI8ABAiMBwAECve4AAAhm
bWhsAsLj4NgAzADa4+YA2OPp1uDZAOfk2dnYq/7G2egA2+MA49oAzADo4wDk4NXtAOLj5uHV4ODt
rf8AAABwtQDwH/geiAAgGIAQTROkEEgEOALUIVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkE0Gsj
mwDpUGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwRwD8AwIYAgAAUDUAAzC1a0gEiG1IAWgBMQFgekgA
KAHQASEBcADwgPgA8Hz4YksA8Hr4APB3+AEgBEIj0WRMZ6UA8CP4Y0xnpQDwH/hfSCAhwn4AKgfQ
gnkDeppCA9HCeUN6mkIO0CQwATnx0VZIQWgBMUFgU0wALATQUUsA8FP4ATz45zC8AbwARwC1XEkA
KQTQUUiAjQhAiEJB0QAsP9BNSEFoamiRQjrRAWgqaJFCNtFOScmIyQsy0QDwdvhSSQApENBAStJo
UwAbGItCCtk9SAFpATEBYdEIATFSGgDVACLCYBzgAbQ7SAAhwYUBhitoAPAY+DhIQWhraJlCDtEA
8BH4APBR+AK8QBoA1eQwLUrQYJFoATGRYAE8vucBsAG8AEdwRxhHELUnSEFpACkG0ClKEWCBaVFg
ACFBYYFhNkkAKS3QLkoAKgTQIkubjRNAk0Il0RxIwmkBMopCANMAIsJhACoc0RtLHGgbSpRCA9Fc
aBpKlEIH0BxoGUqUQg/RXGgYSpRCC9EYStKI0gsH0Q1IHGhEYVxohGEgTBxgXGAQvAG8AEdwRxhI
AIigOADV5DBwR8BGJQcACAwxAAPpLQAIAQAAAGD/AwI0AAICAQAAAAEAAADwMAADNWUFCLVlBQjl
IwEIAREBCLh6AwIAAAAAAH4BBtZ5AwLIJgADAAEAAHXxAwLkAAAABgAABAAAAAAoQAICIEIAAwAA
AACd/QMC`),
  },
  {
    id: 'custom-speed-frlg-3',
    label: 'Fast Forward 3× FireRed/LeafGreen',
    blurb: 'English FireRed and LeafGreen. After the card saves, talk to the deliveryman on Pokémon Center 2F. Hold R for triple speed. Let go to play at normal speed. Talk to them again after each reset.',
    source: 'gblink turbo hook, English FireRed',
    game: 'frlg',
    flagId: 1007,
    effect: 'Hold R for triple speed. Let go of R to play at normal speed. After a reset, talk to the deliveryman again.',
    iconSpecies: 101,
    payload: decodeBase64(`7wNlAAcAAAAAAM7Mw8rGvwDNyr+/vv/////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////9vW4N3i3///////////////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WhEFAMABAhFIAcABAhEAAsABAhFoA8ABAhEFBMABAhFJBcABAhFCBsABAhFcB8ABAhEzCMABAhEq
CcABAhEDCsABAhHRC8ABAhEEDMABAhFKDcABAhFADsABAhEYD8ABAhGAEMABAhEYEcABAhEAEsAB
AhFHE8ABAhFwFMABAhFHFcABAhHAFsABAhFGF8ABAhEIGMABAhFQGcABAhEAGsABAhEDG8ABAhEg
HMABAhE2HcABAhEAHsABAhEAH8ABAhEtIMABAhEBIcABAhEAIsABAhEAI8ABAiMBwAECve4AAAhm
bWhsAsLj4NgAzADa4+YA6Obd5ODZAOfk2dnYq/7G2egA2+MA49oAzADo4wDk4NXtAOLj5uHV4ODt
rf8AAABwtQDwH/geiAAgGIAQTROkEEgEOALUIVgpUPrnDkgBaCofSxubCgHREWgA4BFgACkE0Gsj
mwDpUGkcAWAA8AL4HoBwvYIjmwAEIhIGmxhwRwD8AwIYAgAAUDUAAzC1a0gEiG1IAWgBMQFgekgA
KAHQASEBcADwgPgA8Hz4YksA8Hr4APB3+AEgBEIj0WRMZ6UA8CP4Y0xnpQDwH/hfSCAhwn4AKgfQ
gnkDeppCA9HCeUN6mkIO0CQwATnx0VZIQWgBMUFgU0wALATQUUsA8FP4ATz45zC8AbwARwC1XEkA
KQTQUUiAjQhAiEJB0QAsP9BNSEFoamiRQjrRAWgqaJFCNtFOScmIyQsy0QDwdvhSSQApENBAStJo
UwAbGItCCtk9SAFpATEBYdEIATFSGgDVACLCYBzgAbQ7SAAhwYUBhitoAPAY+DhIQWhraJlCDtEA
8BH4APBR+AK8QBoA1eQwLUrQYJFoATGRYAE8vucBsAG8AEdwRxhHELUnSEFpACkG0ClKEWCBaVFg
ACFBYYFhNkkAKS3QLkoAKgTQIkubjRNAk0Il0RxIwmkBMopCANMAIsJhACoc0RtLHGgbSpRCA9Fc
aBpKlEIH0BxoGUqUQg/RXGgYSpRCC9EYStKI0gsH0Q1IHGhEYVxohGEgTBxgXGAQvAG8AEdwRxhI
AIigOADV5DBwR8BGJQcACAwxAAPpLQAIAgAAAGD/AwI0AAICAgAAAAIAAADwMAADNWUFCLVlBQjl
IwEIAREBCLh6AwIAAAAAAH4BBtZ5AwLIJgADAAEAAHXxAwLkAAAABgAABAAAAAAoQAICIEIAAwAA
AACd/QMC`),
  },
  {
    id: 'custom-speed-frlg-4',
    label: 'Fast Forward 4× FireRed/LeafGreen',
    blurb: 'English FireRed and LeafGreen. After the card saves, talk to the deliveryman on Pokémon Center 2F. Hold R for 4× speed. Let go to play at normal speed. Talk to them again after each reset.',
    source: 'gblink turbo hook, English FireRed',
    game: 'frlg',
    flagId: 1008,
    effect: 'Hold R for 4× speed. Let go of R to play at normal speed. After a reset, talk to the deliveryman again.',
    iconSpecies: 101,
    payload: decodeBase64(`8ANlAAgAAAAAAKW5AM3Kv7++///////////////////////////////////////////C4+DYAOjc
2QDMALzp6Ojj4qv/////////////////////////////uwDn5NnX3dXgAOjm3dffAN3nAOvV3ejd
4tv//////////////////97p5+gA2uPmAO3j6av////////////////////////////////////Q
3efd6ADo3NkA2Nng3erZ5u3h1eIA4+IA6NzZ////////////////o+LYANrg4+PmAOPaANUAysnF
v8fJyAC9v8jOv8yt/////////////9vW4N3i3///////////////////////////////////////
////////////////////////////////////////////////////////////AAAAAAAAuAAAAAhq
WhEFAMABAhFIAcABAhEAAsABAhFoA8ABAhEFBMABAhFJBcABAhFCBsABAhFcB8ABAhEzCMABAhEq
CcABAhEDCsABAhHRC8ABAhEEDMABAhFKDcABAhFADsABAhEYD8ABAhGAEMABAhEYEcABAhEAEsAB
AhFHE8ABAhFwFMABAhFHFcABAhHAFsABAhFGF8ABAhEIGMABAhFQGcABAhEAGsABAhEDG8ABAhEg
HMABAhE2HcABAhEAHsABAhEAH8ABAhExIMABAhEBIcABAhEAIsABAhEAI8ABAiMBwAECve4AAAhm
bWhsAsLj4NgAzADo4wDn5NnZ2ADo3NkA29Xh2QDp5Kv+xtnoANvjAOPaAMwA6OMA5ODV7QDi4+bh
1eDg7a3/AAAAcLUA8B/4HogAIBiAEE0TpBBIBDgC1CFYKVD65w5IAWgqH0sbmwoB0RFoAOARYAAp
BNBrI5sA6VBpHAFgAPAC+B6AcL2CI5sABCISBpsYcEcA/AMCGAIAAFA1AAMwtWtIBIhtSAFoATEB
YHpIACgB0AEhAXAA8ID4APB8+GJLAPB6+ADwd/gBIARCI9FkTGelAPAj+GNMZ6UA8B/4X0ggIcJ+
ACoH0IJ5A3qaQgPRwnlDeppCDtAkMAE58dFWSEFoATFBYFNMACwE0FFLAPBT+AE8+OcwvAG8AEcA
tVxJACkE0FFIgI0IQIhCQdEALD/QTUhBaGpokUI60QFoKmiRQjbRTknJiMkLMtEA8Hb4UkkAKRDQ
QErSaFMAGxiLQgrZPUgBaQExAWHRCAExUhoA1QAiwmAc4AG0O0gAIcGFAYYraADwGPg4SEFoa2iZ
Qg7RAPAR+ADwUfgCvEAaANXkMC1K0GCRaAExkWABPL7nAbABvABHcEcYRxC1J0hBaQApBtApShFg
gWlRYAAhQWGBYTZJACkt0C5KACoE0CJLm40TQJNCJdEcSMJpATKKQgDTACLCYQAqHNEbSxxoG0qU
QgPRXGgaSpRCB9AcaBlKlEIP0VxoGEqUQgvRGErSiNILB9ENSBxoRGFcaIRhIEwcYFxgELwBvABH
cEcYSACIoDgA1eQwcEfARiUHAAgMMQAD6S0ACAQAAABg/wMCNAACAgMAAAADAAAA8DAAAzVlBQi1
ZQUI5SMBCAERAQi4egMCAAAAAAB+AQbWeQMCyCYAAwABAAB18QMC5AAAAAYAAAQAAAAAKEACAiBC
AAMAAAAAnf0DAg==`),
  },
];
