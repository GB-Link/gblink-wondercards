function decodeBase64(s) {
  const bin = atob(s.replace(/\s+/g, ""));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export const JPAJ_WONDERCARDS = [
  {
    id: 'mystic-ticket',
    label: 'Mystic Ticket (Lugia & Ho-Oh) (Emerald)',
    description: 'Gives the Mystic Ticket. Show it at the harbor in Lilycove City to sail to Navel Rock, where Lugia and Ho-Oh appear.',
    source: 'JPAJ - Mystic Ticket (EMER).gba',
    flagId: 1001,
    iconSpecies: 249,
    payload: decodeBase64(`6QP5AAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAALHH083Ow70AzsO9xb/OsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/7Nfc1eLb
2QC91ebYAAAAAAAAAAAAweMA6OMA6NzZAOfZ1+Pi2ADa4OPj5gDj2gDo3NkAysnFG8fJyAAAAL2/yM6/zADV4tgA4dnZ6ADo3NkA
2Nng3erZ5u0A5Nnm5+PiAN3iAADb5tnZ4q0AzNnX2d3q2QDo3NkAx9PNzsO9AM7DvcW/zgDV4tgAAAAA6NzZ4gDn1erZAOjc2QDb
1eHZq6sAAAAAAAAAAAAAAAAAAAAAAAAAAL7jAOLj6ADo4+fnAOjc3ecAv+zX3NXi29kAvdXm2AAAAAAAAAAAAADW2drj5tkA5tnX
2d3q3eLbAOjc2QDH083Ow70AzsO9xb/Oq6sAAAAAAAAAAAAAuAtVZwhqWis7AbsBeFVnCCuRALsBeFVnCCuSALsBeFVnCEdyAQEA
IQ2AAQC7AXhVZwi9gVVnCGZtRnIBAQAhDYAAALsBb1VnCBoAgHIBGgGAAQAJACngCCk7Ab3eVWcIZm1sAr1vVmcIZm1sAr1CVmcI
Zm1sAs7c1eLfAO3j6QDa4+YA6efd4tsA6NzZAMfTzc6/zNP+wcPAzgDN7efo2eGt+9Pj6QDh6efoANbZAP0Brf7O3Nnm2QDd5wDV
AOjd19/Z6ADc2ebZANrj5gDt4+mt/8PoANXk5NnV5ucA6OMA1tkA2uPmAOnn2QDV6ADo3Nn+xsPG073J0L8AvcPO0wDk4+borfvR
3O0A4uPoANvd6tkA3egA1QDo5u0A1eLYAOfZ2QDr3NXo/t3oAN3nANXW4+norP/O3NXi3wDt4+kA2uPmAOnn3eLbAOjc2QDH083O
v8zT/sHDwM4Aze3n6Nnhrf/J3LgAw7ThAOfj5ubtuAD9Aa3+0+Pp5gC8u8G05wDFv9MAw86/x80Aysm9xb/OAN3nANrp4OCt+8rg
2dXn2QDn6OPm2QDn4+HZ6Nzd4tsA4+IA7ePp5gDKvbj+6NzZ4gDX4+HZANbV198A2uPmAOjc3eet/wAAAAAAAAA=`),
  },
  {
    id: 'old-sea-map',
    label: 'Old Sea Map (Mew) (Emerald)',
    description: 'Gives the Old Sea Map. Show it at the harbor in Lilycove City to sail to Faraway Island, where Mew appears.',
    source: 'JPAJ - Old Sea Map (EMER).gba',
    flagId: 1002,
    iconSpecies: 151,
    payload: decodeBase64(`6gOXAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAscnGvgDNv7sAx7vKsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/7Nfc1eLb
2QC91ebYAAAAAAAAAAAAweMA6OMA6NzZAOfZ1+Pi2ADa4OPj5gDj2gDo3NkAysnFG8fJyAAAAL2/yM6/zADV4tgA4dnZ6ADo3NkA
2Nng3erZ5u0A5Nnm5+PiAN3iAADb5tnZ4q0AzNnX2d3q2QDo3NkAyca+AM2/uwDHu8oA1eLYAAAAAAAA6NzZ4gDn1erZAOjc2QDb
1eHZq6sAAAAAAAAAAAAAAAAAAAAAAAAAAMrg2dXn2QDY4wDi4+gA6OPn5wDo3N3nAL/s19zV4tvZAL3V5tgAAADW2drj5tkA7ePp
AObZ19nd6tkA6NzZAMnGvgDNv7sAx7vKq6sAAAAAAAAAAAAAuPRXZwhqWis8AbsBWFhnCCvKAbsBWFhnCEd4AQEAIQ2AAQC7AVhY
Zwi9YVhnCGZtRngBAQAhDYAAALsBT1hnCBoAgHgBGgGAAQAJACnWCCk8Ab3ZWGcIZm1sAr1qWWcIZm1sAr09WWcIZm1sAs7c1eLf
AO3j6QDa4+YA6efd4tsA6NzZAMfTzc6/zNP+wcPAzgDN7efo2eGt+8bZ6ADh2QDX4+La3ebhrq7t4+kA1ebZAP0BrPvR2QDm2dfZ
3erZ2ADo3N3nAMnGvgDNv7sAx7vK/tXY2ObZ5+fZ2ADo4wDt4+mt/8PoANXk5NnV5ucA6OMA1tkA2uPmAOnn2QDV6ADo3Nn+xsPG
073J0L8AvcPO0wDk4+borfvR3O0A4uPoANvd6tkA3egA1QDo5u0A1eLYAOfZ2QDr3NXo/t3oAN3nANXW4+norP/O3NXi3wDt4+kA
2uPmAOnn3eLbAOjc2QDH083Ov8zT/sHDwM4Aze3n6Nnhrf/J3LgAw7ThAOfj5ubtuAD9Aa3+0+Pp5gC8u8G05wDFv9MAw86/x80A
ysm9xb/OAN3nANrp4OCt+8rg2dXn2QDn6OPm2QDn4+HZ6Nzd4tsA4+IA7ePp5gDKvbj+6NzZ4gDX4+HZANbV198A2uPmAOjc3eet
/wAAAAAAAAA=`),
  },
  {
    id: 'eon-ticket',
    label: 'Eon Ticket (Latias or Latios) (Emerald)',
    description: 'Gives the Eon Ticket. Show it at the harbor in Lilycove City to sail to Southern Island, where Latias or Latios appears.',
    source: 'JPAJ - Eon Ticket (EMER).gba',
    flagId: 1003,
    iconSpecies: 407,
    payload: decodeBase64(`6wOXAQAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAsb/JyADOw73Fv86yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/7Nfc1eLb
2QC91ebYAAAAAAAAAAAAweMA6OMA6NzZAOfZ1+Pi2ADa4OPj5gDj2gDo3NkAysnFG8fJyAAAAL2/yM6/zADV4tgA4dnZ6ADo3NkA
2Nng3erZ5u0A5Nnm5+PiAN3iAADb5tnZ4q0AzNnX2d3q2QDo3NkAv8nIAM7DvcW/zgDV4tgAAAAAAAAA6NzZ4gDn1erZAOjc2QDb
1eHZq6sAAAAAAAAAAAAAAAAAAAAAAAAAAMrg2dXn2QDY4wDi4+gA6OPn5wDo3N3nAL/s19zV4tvZAL3V5tgAAADW2drj5tkA7ePp
AObZ19nd6tkA7ePp5gC/ycgAzsO9xb/Oq6sAAAAAAAAAAAAAuCgnAQhqWis9AbsBjCcBCCvJAbsBjCcBCEcTAQEAIQ2AAQC7AYwn
AQi9lScBCGZtRhMBAQAhDYAAALsBgycBCBoAgBMBGgGAAQAJACmzCCk9Ab3yJwEIZm1sAr2EKAEIZm1sAr1XKAEIZm1sAs7c1eLf
AO3j6QDa4+YA6efd4tsA6NzZAMfTzc6/zNP+wcPAzgDN7efo2eGt+9Pj6QDh6efoANbZAP0Brf7O3Nnm2QDd5wDVAOjd19/Z6ADc
2ebZANrj5gDt4+mt/8PoANXk5NnV5ucA6OMA1tkA2uPmAOnn2QDV6ADo3Nn+xsPG073J0L8AvcPO0wDk4+borfvR3O0A4uPoANvd
6tkA3egA1QDo5u0A1eLYAOfZ2QDr3NXo/t3oAN3nANXW4+norP//ztzV4t8A7ePpANrj5gDp593i2wDo3NkAx9PNzr/M0/7Bw8DO
AM3t5+jZ4a3/ydy4AMO04QDn4+bm7bgA/QGtANPj6eYAvLvBtOf+xb/TAMPOv8fNAMrJvcW/zgDd5wDa6eDgrfvK4NnV59kA5+jj
5tkA5+Ph2ejc3eLbAOPiAO3j6eYAyr24/ujc2eIA1+Ph2QDW1dffANrj5gDo3N3nrf8AAAAAAAAA`),
  },
  {
    id: 'altering-cave',
    label: 'Altering Cave (New Wild Pokémon) (Emerald)',
    description: 'Changes the wild Pokémon in Altering Cave on Route 103, which normally holds only Zubat. Each delivery moves the cave on to the next Pokémon: Mareep, Pineco, Houndour, Teddiursa, Aipom, Shuckle, Stantler and Smeargle, then back to Zubat.',
    source: 'JPAJ - Altering Cave (EMER).gba',
    flagId: 1004,
    iconSpecies: 355,
    payload: decodeBase64(`7ANjAQAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAALG7xs6/zMPIwQC9u9C/sgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/7Nfc1eLb
2QC91ebYAAAAAAAAAAAAweMA6OMA6NzZAOfZ1+Pi2ADa4OPj5gDj2gDo3NkAysnFG8fJyAAAAL2/yM6/zADV4tgA4dnZ6ADo3NkA
2Nng3erZ5u0A5Nnm5+PiAN3iAADb5tnZ4q0AztzZ4gDb4wDo4wDo3NkAu8bOv8zDyMEAvbvQvwDo4wAA2t3i2ADm1ebZAMrj3xvh
4+IA6NzV6ADV5OTZ1eYA6NzZ5tmrAAAAAL7jAOLj6ADo4+fnAOjc3ecAv+zX3NXi29kAvdXm2AAAAAAAAAAAAADW2drj5tkA2ezk
4OPm3eLbAOjc2QC7xs6/zMPIwQC9u9C/q6sAAAAAAAAAAAAAuONWZwgXPkABACE+QAoAuwD9VmcIFj5AAABqWr0IV2cIZm1sAs7c
1eLfAO3j6QDa4+YA6efd4tsA6NzZAMfTzc6/zNP+wcPAzgDN7efo2eGt+87c2ebZANXk5NnV5ucA6OMA1tkA1QDm6eHj5gDV1uPp
6P7m1ebZAMrJxRvHycgA593b3Ojd4tvnrfvO3NkA593b3Ojd4tvnAObZ5OPm6NnY4O0A19Xh2QDa5uPh/ujc2QC7xs6/zMPIwQC9
u9C/AOPiAMzJz86/AKKhpK37ytnm3NXk5wDd6ADr4+ng2ADW2QDr4+bo3Ovc3eDZANrj5v7t4+kA6OMA3eLq2efo3dvV6NkA6Nzd
5wDm6eHj5q3/AAAAAAAAAA==`),
  }
];
