function decodeBase64(s) {
  const bin = atob(s.replace(/\s+/g, ""));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export const ISKAANDISMET_WONDERCARDS = [
  {
    id: 'iskaandismet-a-chance-encounter',
    label: 'A Chance Encounter (Custom Event) (Emerald)',
    description: 'Sets loose a random one of the nine starters as a level 5 roaming Pokémon. Repeatable.',
    source: 'u/iskaandismet — https://www.reddit.com/r/PokemonEmerald/comments/1grkwrb/i_created_six_new_custom_wonder_cards_for/',
    flagId: 46266,
    iconSpecies: 440,
    payload: decodeBase64(`urS4AQAAAACQBwAAuwC93NXi19kAv+LX4+ni6NnmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC7
AObV5tkA693g2ADK49/Z4ePiq6sAAAAAAAAAAAAAAAAA0dzd4NkA2OPd4tsA2t3Z4Njr4+bfANrj
5gDKzMnArQC8w8y9wrgAAMe70wDc1ecA2N3n1+Pq2ebZ2ADVAObV5tkA4+no1ubZ1d8A49oA1QDX
2ebo1d3iAMrJxRvHycirAM7m1djd6N3j4tXg4O0A293q2eIA6OMA4tnrAM7Mu8PIv8zNuADo3Nnn
2QDX1eIA1tkA3NXm2ADo4wDa3eLYrc3k2dXfAOjjAMrMycCtALzDzL3CAN3iAMbDzs7Gv8zJyc4A
zsnRyADo4wDW2dvd4gC7AL3Cu8i9vwC/yL3Jz8jOv8ytAAAAAAAAAAAAAAAAAAAAAAAAuAQAAAhq
WivnAbsBbgEACCnnAb23AQAIZm0lKwEWJk8FABYlT9cAjwkAIQ2AAAC7AZIAAAghDYABALsBqgAA
CCENgAIAuwHCAAAIIQ2AAwC7AdoAAAghDYAEALsB8gAACCENgAUAuwEKAQAIIQ2ABgC7ASIBAAgh
DYAHALsBOgEACCENgAgAuwFSAQAI/xYkT5sAdZsACgNtdr07AwAIZrlqAQAI/xYkT54AdZ4ACgNt
dr1PAwAIZrlqAQAI/xYkT5gAdZgACgNtdr1iAwAIZrlqAQAI/xYkTxgBdRgBCgNtdr12AwAIZrlq
AQAI/xYkTxsBdRsBCgNtdr2IAwAIZrlqAQAI/xYkTxUBdRUBCgNtdr2ZAwAIZrlqAQAI/xYkTwQA
dQQACgNtdr2qAwAIZrlqAQAI/xYkTwEAdQEACgNtdr2/AwAIZrlqAQAI/xYkTwcAdQcACgNtdr3T
AwAIZrlqAQAI/21sAv8r5gG7AYQBAAgp5gG9cwIACGZtbAL/vfgCAAhmbUcMAAEAIQ2AAQC7AZ4B
AAhsAv8xPgEyvS4DAAhmbWxFDAABACrnASrmAQL/yszJwK0AvMPMvcLwALvcuAD9AasAw7ThANvg
1dj+7ePptOrZANfj4dmtAMe70wDc1ecA5+Tj6OjZ2ADV+urZ5u0A5tXm2QDKycUbx8nIAN3iAOjc
2QDr3eDYq/rP5+nV4ODtAOjc2e205tkA5tXd59nYAN3iANUA4NXW+tXi2ADb3erZ4gDo4wDi2esA
zsy7w8i/zM2tAMPotOf65tXm2QDo4wDn2dkA6NzZ4QDd4gDo3NkA693g2K3/AP/KzMnArQC8w8y9
wvAAztzV6ADKycUbx8nIAN3n/ubj1eHd4tsA6NzZAOvd4NirAMPoANfj6eDY+tbZANXi7evc2ebZ
rQDT4+m04OAA3NXq2QDo4wDg4+Pf+tnq2ebt69zZ5tmrAP0BuADb4wDV4tgA2t3i2Pro3NXoAMrJ
xRvHycir/wD/yszJwK0AvMPMvcLwAP0BuADr4+ng2ADt4+n+1ubd4tsA4dkA1QDKzL/Hw7/MALy7
xsas/wD/ztzV4t/nAP0Brf8A/7sA693g2AC908i+u8vPw8ar/wD/uwDr3eDYAM7Jzsm+w8a/q/8A
/7sA693g2AC9wsPFyczDzrur/wD/uwDr3eDYAM7JzL3Cw72r/wD/uwDr3eDYAMfPvsXDyqv/AP+7
AOvd4NgAzsy/v8XJq/8A/7sA693g2AC9wrvMx7vIvr/Mq/8A/7sA693g2AC8z8a8u827z8yr/wD/
uwDr3eDYAM3Lz8PMzsa/q/8=`),
  },
  {
    id: 'iskaandismet-a-wrinkle-in-a-time-forest',
    label: 'A Wrinkle in a Time Forest (Custom Event) (Emerald)',
    description: 'A small exploration quest that lets you catch Celebi and grants the Old Sea Map.',
    source: 'u/iskaandismet — https://www.reddit.com/r/PokemonEmerald/comments/1grkwrb/i_created_six_new_custom_wonder_cards_for/',
    flagId: 46266,
    iconSpecies: 251,
    payload: decodeBase64(`urT7AAAAAACMBwAAuwDR5t3i3+DZAN3iANUAzt3h2QDA4+bZ5+gAAAAAAAAAAAAAAAAAAAAAAAC7
4gDZ4tfj6eLo2eYA693o3ADVAOjd4dkAysnFG8fJyKurzNnX2eLo4O24AM7Mu8PIv8zNANzV6tkA
5tnk4+bo2dgA1QAAAAAAAMfTzc6/zMPJz80AwMnBANbg1eLf2ejd4tsAyr/Ou8a8z8zBAAAAAADR
ycm+za0AzePh2QDOzLvDyL/MzQDc1erZANjd59Xk5NnV5tnYAAAA1dro2eYA19Xo19zd4tsA593b
3OgA49oA1QDr3eDYAMrJxRvHycitAM3k2dXfAOjjAM7Mu8PIv8zNAN3iAMq/zrvGvM/MwQDRycm+
zQDo4wDW2dvd4gC7ANHMw8jFxr8Aw8gAuwDOw8e/AMDJzL/Nzq0AAAAAAAAAAAAAAAAAuAQAAAhq
WmULAAEr7wG7AfoBAAikBgClYwEALwArAGMCAC8AKwBjAwAvACsAYwQALwArAGMFAC8AKwBjBgAv
ACsAYwcALwArAGMIAC8AKwBjCQAvACsAYwoALwArAGMMAC8AKwBjDQAvACsAK+4BuwHXAQAIK/MB
uwGzAQAIK/IBuwGPAQAIK/EBuwFrAQAIK/ABuwEFAQAIvTACAAhmbWxqEZa+qwMCEZa/qwMCEZbA
qwMCEZbBqwMCEZbCqwMCEZbDqwMCEZbEqwMCEZbFqwMCEZbGqwMCEZbHqwMCEf7IqwMCTwsAvqsD
AlELAFMLAGMLAAcAGwBVCwAp8AFsAv+99gIACGZtbBGXzqsDAhGXzasDAhGXz6sDAhGX0KsDAhGX
0asDAhGX0qsDAhGX06sDAhGX1KsDAhGX1asDAhGX1qsDAhH+16sDAk8LAM6rAwJRCwBTCwBjCwAH
AAoAVQsAKfEBAv+9GwMACGZtbE8LAM6rAwJRCwBTCwBjCwApAAUAVQsAKfIBAv+9NwMACGZtbE8L
AL6rAwJRCwBTCwBjCwAqABkAVQsAKfMBAv+9awMACGZtbE8LAL6rAwJRCwBTCwBjCwAXACIAVQsA
Ke4BAv+9kwMACGZtbCnvAbb7AAWvABG3vKsDAhECvasDAgW8qwMC/72hAwAIZm1HeAEBACENgAAA
uwEUAgAIbAL/vdMDAAhmbRoAgHgBGgGAAQAJACnWCCk8AWwC/8ncuADC2eDg46sAw7Tq2QDW2dni
ANrj4ODj693i2wDo3Nn+1djq3dfZAOPaANXiANrV5tXr1e0AysnFG8fJyPrKzMnAv83Nycy4AOvc
4wDb1erZAOHZAOjc3ef6yca+AM7Mv78Ax7vKANXi2ADn2eLoAOHZAOjjANrd4tj66NzZAMrJxb/H
ycgA3egA4NnV2OcA6OOtALzp6ADD+t/Z2eQA29no6N3i2wDg4+foAN3iAOjc2efZANrj29vt+uvj
49jnq/8A/87c3ecAyca+AM7Mv78Ax7vKAN3nANzV5tgA6OMA5tnV2K3/AP/H1e3W2QDr2bTm2QDi
2dXm4O0A6NzZ5tms/wD/wwDo3N3i3wDr2bTm2QDX4OPn2av+ztzZAMnGvgDOzL+/AMe7ygDi2erZ
5gDg3dnnq/8A/8MA19XiANzZ1eYA3eir/s7c2QDm1ebZAM7Dx78AysnFG8fJyKv/AP/D6LTnANzZ
5tmrq/8A/8O04QDi4+gA2erZ4gDn6ebZAN3oAN3nANXiAMnGvv7OzL+/AMe7ygDV4u3r1e2t/wD/
wtnm2bgA7ePpAOjV39kA3eit/w==`),
  },
  {
    id: 'iskaandismet-hard-as-stone',
    label: 'Hard as Stone (Custom Event) (Emerald)',
    description: 'Allows unlimited rematches with post-game Steven Stone. After enough rematches, grants the Mystic Ticket.',
    source: 'u/iskaandismet — https://www.reddit.com/r/PokemonEmerald/comments/1grkwrb/i_created_six_new_custom_wonder_cards_for/',
    flagId: 46266,
    iconSpecies: 227,
    payload: decodeBase64(`urTjAAAAAAAABwAAwtXm2AC75wDN6OPi2QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC7
AObZ4dXo19wA693o3ADo3NkA19zV4eTd4+KrqwAAAAAAztzZAOfd6NkA49oA1eIA1eLX3dni6ADH
v86/ycwAzcLJ0b/MuAAAAMe/zr/JzADAu8bGzQDd5wDf4uPr4gDo4wDW2QDVAOjm1d3i3eLbAADb
5uPp4tgA2uPmAOPi4O0A6NzZAOjj6dvc2efoAM7Mu8PIv8zNrQAAztzZ5tkAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAM3k2dXfAOjjAMrMycCtAL3J1MfJAN3iAMC7xsa7zLzJzADO
ydHIAADo4wDW2dvd4gDCu8y+ALvNAM3Oyci/rQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuAQAAAhq
Wiv4BLsBHgAACL3vAAAIZm1sAv8q+AS9kQEACGZtR2wAEAAhDYABALsBPgAACLnCAAAI/yvtAbsB
aQAACCntAb0fAgAIZm0aAIB4ARoBgAEACQAp1Agp1wgpOwFsAv+PBQAhDYAAALsBpAAACCENgAEA
uwGzAAAIIQ2AAgC7AcIAAAghDYADALsB0QAACCENgAQAuwHgAAAI/xoAgMMAGgGAAQAJAGwC/xoA
gMwAGgGAAQAJAGwC/xoAgLsAGgGAAQAJAGwC/xoAgB4BGgGAAQAJAGwC/xoAgB8BGgGAAQAJAGwC
/8rMycCtAL3J1MfJ8ADC2eDg4wD9AasAvt3Y/u3j6QDf4uPrAOjc1egA1tna4+bZANG7xsa7vb+4
+s3Ov9C/yADNzsnIvwDr1ecA19zV4eTd4+KsAMLZANfV4vrn4+HZ6N3h2ecA1tkA2uPp4tgA3eIA
x7/Ov8nMAMC7xsbNrfrDAOfV6wDc3eEA6NzZ5tkA4+IA4e0A4NXn6ADo5t3kq/8A/8rMycCtAL3J
1MfJ8ADR4+u4AP0BqwDD/tzZ1ebYAOjc1egA7ePpANbZ1egAzc6/0L/IAN3iANX6ysnFG8fJyAC8
u87Oxr+rAMLZ5tm4AOjV39kA6Nzd560Aw/ra4+ni2ADr3N3g2QDg4+Pf3eLbANrj5gDh2ejZ4+bn
+t3iAMe/zr/JzADAu8bGza3/AP/KzMnArQC9ydTHyfAA/QG4AOjV39kA6Nzd563+wwDr4+IA3egA
1QDHv86/ycwAvcnHyr/Ow87Dyci4+tbp6ADDAOLZ6tnmAOfZ2eEA6OMA3NXq2QDo3eHZAOjj+ujV
39kA1QDq1dfV6N3j4q0A0+PpANvjqwDR3OMA3+Lj6+e4+u3j6QDh3dvc6ADa3eLYANUA5tXm2QDK
ycUbx8nIq/8=`),
  },
  {
    id: 'iskaandismet-the-berry-grandmaster',
    label: 'The Berry Grandmaster (Custom Event) (Emerald)',
    description: 'Provides a means of obtaining the event-only Berries in-game.',
    source: 'u/iskaandismet — https://www.reddit.com/r/PokemonEmerald/comments/1grkwrb/i_created_six_new_custom_wonder_cards_for/',
    flagId: 46266,
    iconSpecies: 0xffff,
    payload: decodeBase64(`urT//wAAAACMBwAAztzZALzZ5ubtAMHm1eLY4dXn6NnmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC7
ANbZ5ubtAOTV5+fZ2ADY4+viAOjc5uPp29wA6N3h2aurztzZALy/zMzTAMe7zc6/zADc1ecA5tnX
2eLo4O0A1tnb6eIA6OMAANrZ2eAA4+DYuADV4tgA3NXnAOjV39niAOjjANzV6t3i2wDa4+LYAADm
2erZ5t3Z5wDj2gDt4+ni29nmANjV7ecA69zZ4gDc2QDr1ecAAAAA1eIA1eTk5tni6N3X2QDo4wDo
3NkAvL/MzNMAwcy7yL7Hu83Ov8ytAM3k2dXfAOjjAOjc2QC8v8zM0wDHu83Ov8wA2uPmANUAzcq/
vcO7xgDMv9G7zL4A2ubj4QDo3NkAvL/MzNMAwcy7yL7Hu83Ov8ytAAAAAAAAAAAAAAAAuAQAAAhq
Wr0+AQAIZm2PCAAhDYAAALsBbgAACCENgAEAuwGIAAAIIQ2AAgC7AaIAAAghDYADALsBvAAACCEN
gAQAuwHWAAAIIQ2ABQC7AfAAAAghDYAGALsBCgEACCENgAcAuwEkAQAI/zE+ATIaAICoABoBgAEA
CQC96wEACGZtbAL/MT4BMhoAgKkAGgGAAQAJAL3rAQAIZm1sAv8xPgEyGgCAqgAaAYABAAkAvesB
AAhmbWwC/zE+ATIaAICrABoBgAEACQC96wEACGZtbAL/MT4BMhoAgKwAGgGAAQAJAL3rAQAIZm1s
Av8xPgEyGgCArQAaAYABAAkAvesBAAhmbWwC/zE+ATIaAICuABoBgAEACQC96wEACGZtbAL/MT4B
MhoAgK8AGgGAAQAJAL3rAQAIZm1sAv+73LgA1QDt4+ni2wDOzLvDyL/MqwDH7QDb5tXi2NrV6NzZ
5rj+6NzZAODZ29ni2NXm7QC8v8zM0wDBzLvIvse7zc6/zLj66NXp29zoAOHZANnq2ebt6Nzd4tsA
wwDf4uPrANXW4+no+ry/zMzDv82tAMLZ5tm4AODZ6ADh2QDn3NXm2QDj4tkA49r63N3nAOfk2dfd
1eAA6tXm3dno3dnnAOvd6NwA7ePpq/8A/87c3ecAvL/MzNMA69XnANjZ6tng4+TZ2ADW7QDh7f7b
5tXi2NrV6NzZ5gDo3Obj6dvcAO3Z1ebnAOPa+tfV5tna6eAA1+ng6N3q1ejd4+KtAM/n2QDd6ADr
3efZ4O24+tXi2ADX4+HZANbV198A2uPmANXi4+jc2ear/w==`),
  },
  {
    id: 'iskaandismet-the-mirage-tyrant',
    label: 'The Mirage Tyrant (Custom Event) (Emerald)',
    description: 'Braille puzzles and exploration that let you catch a level 50 Tyranitar for the Battle Frontier.',
    source: 'u/iskaandismet — https://www.reddit.com/r/PokemonEmerald/comments/1grkwrb/i_created_six_new_custom_wonder_cards_for/',
    flagId: 46266,
    iconSpecies: 248,
    payload: decodeBase64(`urT4AAAAAAAABwAAztzZAMfd5tXb2QDO7ebV4ugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC7
AOHt5+jZ5u0A3eIA6NzZANjZ59nm6KurAAAAAAAAAAAAztzZAMDJzc3DxgDHu8jDu70A3NXnANjd
59fj6tnm2dgA1QAAAAAAAM3Oyci/AM67vMa/zgDr3N3g2QDc6eLo3eLbANrj5gDAyc3Nw8bNrQDO
3NkAzc7JyL8Azru8xr/OAN3nAOrZ5u0A4+DYuADW6egA5+jd4OAA3NXnAOfj4dkA2NnX3eTc2ebV
1uDZAOft4dbj4Oetra0AAAAAAAAAAM3k2dXfAOjjAOjc2QDAyc3Nw8YAx7vIw7u9AOPp6Ofd2NkA
49oAAADAu8bGu8y8ycwA6OMA1tnb3eIAzsK/AMfDzLvBvwDO08y7yM6tAAAAAAAAAAAAuAQAAAgR
AL6rAwIRAL+rAwIRAMCrAwIRAMGrAwIRAMKrAwIRAMOrAwIRHcSrAwIRCcWrAwIRC8arAwIRBcer
AwIRFcirAwIRAcmrAwIRA8qrAwIREcurAwIRAMyrAwIRFs2rAwIRGc6rAwIRMc+rAwIRLNCrAwIR
C9GrAwIR/9KrAwIRANOrAwIR2tSrAwIRA9WrAwIRE9arAwIRBterAwIRHdirAwIRAdmrAwIRD9qr
AwIRCdurAwIRHtyrAwIRHd2rAwIRCd6rAwIRAd+rAwIRFuCrAwIRMeGrAwIRHeKrAwIRCeOrAwIR
/+SrAwIRAOWrAwIRt+arAwIRAuerAwIr6wG7ASECAAgrwwO7AR0BAAi5LAEACP8r6gG7AfoBAAi5
LAEACP8r6gG7AdMBAAgr5QG7AZwBAAhHKQABACENgAEAuwFpAQAIuVQBAAj/vSsCAAhmbWx4vqsD
Am0E1KsDAgL/RyoAAQAhDYABALsBfwEACLlUAQAI/ynlAb2MAgAIZm2h+AAAAMUlMwG9yQIACGZt
bAL/KnMAvdoCAAhmbWxHGAEBACENgAEAuwG5AQAIAv8qwwMpxANFGAEBACnqAb0tAwAIZm2XAGwC
/71HAwAIZm141qsDAm0E1KsDAimdAClOARbLQAAAvWwDAAhmbWwC/ynrAb3JAgAIZm2h+AAAAMUl
PQG9gQMACGZtbLb4ADK7AAXWqwMC/72nAwAIZm1sAv/9AasAzNnX2eLo4O0A69zd4Nn+4OPj393i
2wDa4+YA2uPn593g57gAwwDa4+ni2ADVAM3Oyci/+gDOu7zGv86rALzp6ADDANfV4rToAObZ1dgA
3eit+r3V4gDt4+ms/wD/ztzV6LTnAN3oq/7Mv74A1eLYALzGu73FAMDGz86/zav6xtnotOcA6NzZ
4QDk4NXtAOjj29no3Nnmrf8A/9Hc1egA69XnAOjc1eis/wD/0ePp4NgA7ePpANbm3eLbAOHZANUA
x7/Ov8nMw86//ufjAMMA19XiAOjm1djZAN3oANrj5gDKzMnArQC9ydTHybTn+s3Oyci/AM67vMa/
zqz/AP+7AMe/zr/JzMPOv6wAztzV4t/nAP0Bq/8A//0BqwDDtOrZANvj6ADV4uPo3NnmAM3Oyci/
AM67vMa/zqv/AP/R3NXorAC7AOjm2dXn6ebZrKv/AP/9AasAwwDo3N3i3wDn4+HZ6Nzd4tsA2uPg
4OPr2dgA7ePpq/8A/83jra2tAO3j6QDa4+ni2ADVANrj5+fd4Kz+x9Xt1tkA3egA69XnANUA6ObZ
1efp5tkA4OPi2wDV2+Otra3/`),
  },
  {
    id: 'iskaandismet-the-mysterious-white-rock',
    label: 'The Mysterious White Rock (Custom Event) (Emerald)',
    description: 'A Braille puzzle that lets you catch Jirachi.',
    source: 'u/iskaandismet — https://www.reddit.com/r/PokemonEmerald/comments/1grkwrb/i_created_six_new_custom_wonder_cards_for/',
    flagId: 46266,
    iconSpecies: 409,
    payload: decodeBase64(`urSZAQAAAACQBwAAztzZAMft5+jZ5t3j6ecA0dzd6NkAzOPX3wAAAAAAAAAAAAAAAAAAAAAAAADO
3NkA693n3ADp5OPiANUA2tXg4NniAOfo1earqwAAAAAAztzZANHCw86/AMzJvcUA4+no593Y2QDj
2gDHyc3Nvr+/ygAAAAAAAM3Ku72/AL2/yM6/zADc1ecA4OPi2wDc1dgA1QDn5NnX3dXgAAAAAADh
2dXi3eLbAOjjAOjc2QDk2ePk4NkA69zjAOTp6ADd6ADo3Nnm2bgA1QDr3efcANrj5gDo3Nnd5gDm
49ff2ejnAOjjANrg7QDn1drZ4O2tAM3k2dXfAOjjAOjc2QDRw83CAMa7vtMAAN3iAMfJzc2+v7/K
AAAAAAAA6OMA1tnb3eIAzsK/AMfTzc6/zMPJz80A0cLDzr8AzMm9xa0AAAAAAAAAAAAAuAQAAAhq
WivrAbsBLgEACL04AQAIZm1sEQC+qwMCEQC/qwMCEQDAqwMCEQDBqwMCEQDCqwMCEQDDqwMCERPE
qwMCEQHFqwMCERHGqwMCEQnHqwMCEQDIqwMCEQHJqwMCEQDKqwMCES7LqwMCERjMqwMCERbNqwMC
EQ3OqwMCEf/PqwMCEQDQqwMCEdrUqwMCEQPVqwMCeL6rAwJqbQTUqwMCvdgBAAhmbXwRASENgAYA
uwC+AAAIbAL/vQoCAAgRWL6rAwIR/r+rAwJP/wC+qwMCZm2hmQEFAMURVr6rAwJP/wC+qwMCTwgA
vqsDAlEAAKGZAQAAxaGZAQAAxU//AL6rAwJPCAC+qwMCUQAAKesBtpkBCqkAEbe8qwMCEQK9qwMC
BbyrAwIC/70aAgAIZm1sAv/O3N3nAObj198A3NXnANUA5+TZ193V4ADh2dXi3eLbAOjj/ujc2QDk
2ePk4NkA1egA6NzZAM3Ku72/AL2/yM6/zK36w7Tq2QDW2dniAODj49/d4tsA1egA3egA2uPmAOfj
+uDj4tu4ANXi2ADj4uDtAOLj6wDm2dXg3e7ZuADd6Prc1ecA5+Ph2QDn6ObV4tvZAOHV5t/d4tvn
ra2t/wD/ytnm3NXk5wDo3NnttObZAN3i5+jm6dfo3ePi5/7a4+YA4dXf3eLbANUA693n3Kz/AP/9
AQDp59nYANHDzcKt/wD/ztzd5wDm49ffra2tAN3nAOvV5wDn5NnX3dXg/trj5gDVANHDzcIAysnF
G8fJyADo4+Otra0=`),
  },
  {
    id: 'iskaandismet-the-virtual-trainer-machine',
    label: 'The Virtual Trainer Machine (Custom Event) (Emerald)',
    description: 'Battle a series of virtual trainers in the Battle Frontier for quick experience (repeatable). Grants the Eon Ticket on first completion.',
    source: 'u/iskaandismet — https://www.reddit.com/r/PokemonEmerald/comments/1grkwrb/i_created_six_new_custom_wonder_cards_for/',
    flagId: 46266,
    iconSpecies: 0xffff,
    payload: decodeBase64(`urT//wAAAACIBwAAztzZANDd5ujp1eAAzubV3eLZ5gDH1dfc3eLZAAAAAAAAAAAAAAAAAAAAAAC7
ANfc1eDg2eLb2QDa4+YA6NzZANfc1eHk3ePiq6sAAAAAzb3Jzs4A3NXnANfm2dXo2dgA1QDn5NnX
3dXgAOHV19zd4tkA6NzV6Nfm2dXo2ecA0MPMzs+7xgDq2ebn3ePi5wDj2gDn4+HZAOPaAAAAAADo
3NkAwsm/yMgA5tnb3ePiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwtkA5tnX2eLo4O0A2NnX3djZ
2ADd6AAAAAAAAAAAAAAAAAAAAAAAAM3k2dXfAOjjAM29yc7OAN3iAOjc2QC8u87Oxr8AwMzJyM7D
v8wA6OPW2dvd4gDOwr8A0MPMzs+7xgDOzLvDyL/MAMe7vcLDyL+tAAAAAAAAAAAAAAAAuAQAAAgR
vOOrAwIR7uSrAwIR7uarAwIR7uerAwIR6OirAwIRq+mrAwIR/+qrAwIRAOurAwJqWivhAbsBxwAA
CCvgAbsBrQAACCvfAbsBkwAACCveAbsBeQAACL0LAQAIZm0p3gFcABkDAADjqwMC46sDAl3/vckB
AAhmbSnfAVwAFQMAAOOrAwLjqwMCXf+9+AEACGZtKeABXAAdAwAA46sDAuOrAwJd/70yAgAIZm0p
4QFcACEDAADjqwMC46sDAl3/K+IBuwHvAAAIKeIBvWYCAAhmbRoAgBMBGgGAAQAJACmzCLn8AAAI
/73dAgAIZm25/AAACP8q3gEq3wEq4AEq4QFsAv/NvcnOzvAAu9y4AP0BqwDDtOrZANbZ2eL+6+Pm
393i2wDj4gDVANfc1eDg2eLb2QDo3NXoAOfc4+ng2Prk5uPq2QDY3dra3dfp4OgA2erZ4gDa4+YA
7ePpuADo3Nn6wsm/yMgAvcK7x8rDycirAMPotOcA1QDn2ebd2ecA49r66t3m6OnV4ADo5tXd4tnm
5wDa5uPhAOHtAOLZ6/rQw8zOz7vGAM7Mu8PIv8wAx7u9wsPIv6v7zNnV2O2s/wD/0dng4ADY4+LZ
qwDJ4gDo4wDo3NkA59nX4+LY/tDDzM7Pu8YAzsy7w8i/zK3/AP/9AbgA7ePp5gDW1ejo4NnnANXm
2QDd4tfm2djd1uDZAOjj/uvV6NfcqwDI6eHW2eYA6Nzm2dmr/wD/zejp4uLd4turAMjj6wDa1dfZ
AOHt/ufo5uPi29nn6ADQw8zOz7vGAM7Mu8PIv8yrq/8A/7viANXh1e7d4tsA2N3n5ODV7QDj2gDW
1ejo4N3i26v+wtnm2QD9AbgA6NXf2QDo3N3nrQDD6LTnANXi+r/JyADOw73Fv84A6OMAzcnPzsK/
zMgAw83Gu8i+rfrDANzZ1eYA3ei05wDg4+rZ4O0A6NzZ5tmt/wD//QG4AO3j6bTq2QDV4OAA2Nna
2dXo2dgA4e3+0MPMzs+7xgDOzLvDyL/MzasAwwDn6eTk4+fZAMP61tno6NnmAOvj5t8A4+IA3eHk
5uPq3eLbAOjc2eGtra3/`),
  },
  {
    id: 'iskaandismet-the-zeta-episode',
    label: 'The Zeta Episode (Custom Event) (Emerald)',
    description: 'A minor story event (fetch quest / puzzle) that grants access to Birth Island and a second battle with a stronger wild ZETADEOXYS. Intended if you have not already played the Birth Island event.',
    source: 'u/iskaandismet — https://www.reddit.com/r/PokemonEmerald/comments/1grkwrb/i_created_six_new_custom_wonder_cards_for/',
    flagId: 46266,
    iconSpecies: 410,
    payload: decodeBase64(`urSaAQAAAACIBwAAztzZANTZ6NUAv+Td5+PY2QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC7
AOrd593o4+YA2ubj4QDo3NkA1tnt4+LYq6sAAAAAAAAAuwDY3efo6ebW1eLX2QDd4gDCyb/IyKsA
u+cA1eIA4+Hd4uPp5wAAALvPzMnMuwDg3dvc6Nni5wDo3NkA4t3b3OgA59/d2ee4AOvd4NgAAADK
ycUbx8nIANvm4+sA5tnn6ODZ5+e4ANXi2ADVAOHt5+jZ5t3j6ecAzb3Dv8jOw83OANXm5t3q2ecA
3eIAx8nNzb6/v8oAvcPO060AAAAAAM3k2dXfAOjjAMrMycCtAM3Ku72/0wDd4gDo3NkAx8nNzb6/
v8oAAADNyru9vwC9v8jOv8wA6OMA1tnb3eIAzsK/ANS/zrsAv8rDzcm+v60AAAAAAAAAuAQAAAhq
WivoAbsBSwEACL1VAQAIZm0r6QG7AUUAAAhHbAAFACENgAAAuwF0AAAIR2wABQAhDYABALsBfgAA
CP98YgEhDYAGALsAvAAACEdzAQEAIQ2AAAC7AZQAAAhHcwEBACENgAEAuwGyAAAI/72MAQAIZm1s
Av9FbAAFACnpATE+ATK9AgIACGZtbAL/vSwCAAhmbRoAgHMBGgGAAQAJACnVCCk6AWZtbAL/vaUC
AAhmbWwC/70uAwAIZm0p6AG9mwMACGZtoZoBBQDFEVa+qwMCEf6/qwMCT/8AvqsDAk8DAL6rAwJR
AAC9swMACGZttpoBZGwAEdRMRwICEb9NRwICEc5ORwICEbtPRwICEb5QRwICEb9RRwICEclSRwIC
EdJTRwICEdNURwICEc1VRwICEbe8qwMCEQK9qwMCBbyrAwL/vboDAAhmbWwC/8rMycCtAM3Ku72/
0/AAztzZ5tm05wDVAOfo5tXi29n+u8/Mycy7AOPq2eYAwsm/yMitra3/AP/9AasAw7ThANfj4tjp
1+jd4tv+5tnn2dXm19wA3eLo4wDo3N3nAOfo5tXi29kAu8/Mycy7rfq86egAwwDi2dnYAOHj5tkA
1+Pn4d3XAOHV6Nnm3dXgrfq91eIA7ePpANbm3eLbAOHZAKYAzc67zL7Pzc6s/wD/0dng4ADY4+LZ
uAD9Aav+w7Tg4ADp5Nvm1djZAOHtAOHV19zd4tmt/wD/w7Tq2QDa4+ni2ADn6ObV4tvZANS/zrsA
2eLZ5tvt/tfj4d3i2wDa5uPhAOjc2QC7z8zJzLut+s7V39kA6Nzd5wC7z8zJzLvOw73Fv864ANXi
2ADa3eLYAOjc2frn4+nm19kA49oA6NzZANS/zrsAu8/Mycy7rf8A//0BqwDDtOEA4uPoAOfp5tn+
69zV6ADt4+kA2uPp4tgA4+IAvMPMzsIAw83Gu8i+uADW6ej66NzZANS/zrsA2eLZ5tvtANrm4+EA
6NzZALvPzMnMuwDc1ef63eLX5tnV59nYqwDDAOLZ2dgA6OMAytPNvcLJALzJyc3O+uHtAOHV19zd
4tmr/wD//QGrANHd6NwA1QDn6Obj4tsA2eLj6dvc/srN073CyQC8ycnNzrgA4e0A4dXX3N3i2QDX
1eL62Nno2dfoAOjc2QDn4+nm19kA49oA6NzZ+tS/zrsAu8/Mycy7qwDH1e3W2QDd6LTnAFNUrP8A
//0BAOnn2dgAys3TvcLJALzJyc3Orf8A/8Lp3Kz/AP/KzMnArQDNyru9v9PwAM7c2QDUv867ALvP
zMnMuwDc1ef+6tXi3efc2dir/w==`),
  },
];

