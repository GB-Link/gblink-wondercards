@ Event Pokémon. `give_mon` makes a copy of an English Gen 3 distribution the
@ way PKHeX's EncounterGift3 describes it, from the card's settings below: the
@ distribution's trainer id, level, flags and OT name, and its Pokémon
@ (species, then four moves; VAR_0x8004 picks one where there are several).
@
@ The origin seed is 16 bits of Random(), or for MYSTRY Mew one of the 86 seeds
@ its Mew came from, 1 to 4 Mew along. The GBA LCG then gives the high half of
@ the PID and its low half (+8 and rounded down to a multiple of 8 where it
@ would be shiny and the event never gave shinies), two calls of IVs, and one
@ call for the held item (WISHMKR's Salac or Ganlon Berry) or the OT's gender
@ (bit 7 inverted, or (r / 3) & 1).
@
@ CreateMon makes the Pokémon, which then gets the event's OT, IVs, moves and
@ met data (a fateful encounter, in Ruby, at its level, in a POKé BALL), and
@ the fateful-encounter flag and National Ribbon where the event had them. It
@ goes to the next party slot (gPlayerPartyCount, which the script counts
@ with getpartysize first), else to the PC by the routine GiveMonToPlayer
@ uses, which (unlike GiveMonToPlayer) keeps the OT. Given, it counts as seen
@ and caught. VAR_RESULT = MON_GIVEN_TO_PARTY, MON_GIVEN_TO_PC or
@ MON_CANT_GIVE.
@
@ On cards with several Pokémon, `offer` puts the species of Pokémon
@ VAR_0x8004 in VAR_0x8006, with VAR_RESULT 1, or 0 past the last.
@
@ Parameters (--defsym): EVENT (below), PARTY, PARTY_COUNT, ENEMY_PARTY,
@ SPECIAL_VAR_8004, SPECIAL_VAR_RESULT, RANDOM, CREATE_MON, SET_MON_DATA,
@ SET_MON_MOVE_SLOT, CALCULATE_STATS, SEND_MON_TO_PC, SPECIES_TO_NATIONAL and
@ GET_SET_POKEDEX_FLAG.

    .syntax unified
    .thumb
    .text
    .align 2

    .equ EVENT_WISHMKR_JIRACHI, 1
    .equ EVENT_10_ANIV_CELEBI, 2
    .equ EVENT_10_ANIV_KANTO, 3
    .equ EVENT_10_ANIV_LEGENDS, 4
    .equ EVENT_10_ANIV_JOHTO_HOENN, 5
    .equ EVENT_DOEL_DEOXYS, 6
    .equ EVENT_SPACE_C_DEOXYS, 7
    .equ EVENT_AURA_MEW, 8
    .equ EVENT_MYSTRY_MEW, 9
    .equ EVENT_ROCKS_METANG, 10

    .equ F_ANTI_SHINY, 1
    .equ F_FATEFUL, 2
    .equ F_NATIONAL_RIBBON, 4
    .equ F_GENDER_BIT7, 8               @ OT gender: bit 7 of the call, inverted,
    .equ F_GENDER_DIV3, 16              @ or (call / 3) & 1; else male
    .equ F_WISHMKR_ITEM, 32
    .equ F_MYSTRY_SEEDS, 64

@ ---- the distributions (PKHeX EncountersWC3): trainer id (secret id 0),
@ level, flags and how many Pokémon; the OT names and the Pokémon are below
.if EVENT == EVENT_WISHMKR_JIRACHI
    .equ TID, 20043
    .equ LEVEL, 5
    .equ FLAGS, F_WISHMKR_ITEM
    .equ MONS, 1
.endif
.if EVENT == EVENT_10_ANIV_CELEBI       @ Journey Across America
    .equ TID, 10
    .equ LEVEL, 70
    .equ FLAGS, F_ANTI_SHINY | F_GENDER_BIT7
    .equ MONS, 1
.endif
.if EVENT >= EVENT_10_ANIV_KANTO && EVENT <= EVENT_10_ANIV_JOHTO_HOENN
    .equ TID, 6808                      @ Party of the Decade
    .equ LEVEL, 70
    .equ FLAGS, F_ANTI_SHINY | F_GENDER_BIT7
.endif
.if EVENT == EVENT_10_ANIV_KANTO || EVENT == EVENT_10_ANIV_JOHTO_HOENN
    .equ MONS, 6
.endif
.if EVENT == EVENT_10_ANIV_LEGENDS
    .equ MONS, 8
.endif
.if EVENT == EVENT_DOEL_DEOXYS
    .equ TID, 28606
.endif
.if EVENT == EVENT_SPACE_C_DEOXYS
    .equ TID, 10
.endif
.if EVENT == EVENT_DOEL_DEOXYS || EVENT == EVENT_SPACE_C_DEOXYS
    .equ LEVEL, 70
    .equ FLAGS, F_ANTI_SHINY | F_GENDER_BIT7 | F_FATEFUL
    .equ MONS, 1
.endif
.if EVENT == EVENT_AURA_MEW
    .equ TID, 20078
    .equ LEVEL, 10
    .equ FLAGS, F_ANTI_SHINY | F_GENDER_BIT7 | F_FATEFUL
    .equ MONS, 1
.endif
.if EVENT == EVENT_MYSTRY_MEW
    .equ TID, 6930
    .equ LEVEL, 10
    .equ FLAGS, F_ANTI_SHINY | F_GENDER_DIV3 | F_FATEFUL | F_MYSTRY_SEEDS
    .equ MONS, 1
.endif
.if EVENT == EVENT_ROCKS_METANG
    .equ TID, 2005
    .equ LEVEL, 30
    .equ FLAGS, F_ANTI_SHINY | F_NATIONAL_RIBBON
    .equ MONS, 1
.endif

    .equ ENTRY_SIZE, 10                 @ u16 species, u16 moves[4]
    .equ PARTY_SIZE, 6
    .equ MON_SIZE, 100
    .equ OT_ID_PRESET, 1
    .equ MON_DATA_OT_NAME, 7
    .equ MON_DATA_HELD_ITEM, 12
    .equ MON_DATA_MET_LOCATION, 35
    .equ MON_DATA_MET_GAME, 37
    .equ MON_DATA_HP_IV, 39
    .equ MON_DATA_OT_GENDER, 49
    .equ MON_DATA_NATIONAL_RIBBON, 76
    .equ MON_DATA_FATEFUL, 80           @ MON_DATA_MODERN_FATEFUL_ENCOUNTER
    .equ METLOC_FATEFUL_ENCOUNTER, 0xFF
    .equ VERSION_RUBY, 2
    .equ MON_GIVEN_TO_PARTY, 0
    .equ MON_CANT_GIVE, 2
    .equ FLAG_SET_SEEN, 2
    .equ FLAG_SET_CAUGHT, 3
    .equ ITEM_SALAC_BERRY, 170
    .equ MYSTRY_SEED_COUNT, 86
    .equ MYSTRY_RELEASED_SEED, 0x6065   @ its only valid Mew is the 2nd along
    .equ FRAME, 24                      @ CreateMon's four stack arguments, then:
    .equ IVS, 16                        @ the IVs, packed as the game keeps them
    .equ VALUE, 20                      @ a value for SetMonData

give_mon:
    push {r4, r5, r6, r7, lr}
    sub sp, #FRAME
    adr r4, mons
.if MONS > 1
    ldr r0, p_var_8004
    ldrh r0, [r0]
    movs r1, #ENTRY_SIZE
    muls r0, r1
    adds r4, r4, r0                     @ the Pokémon
.endif
    ldr r3, p_random
    bl call_r3
    lsls r6, r0, #16
    lsrs r6, r6, #16                    @ the origin seed
.if FLAGS & F_MYSTRY_SEEDS
    movs r0, r6
    movs r1, #MYSTRY_SEED_COUNT
    svc #6                              @ Div: r1 = r0 % 86
    lsls r1, r1, #1
    adr r0, mystry_seeds
    ldrh r0, [r0, r1]
    lsls r2, r6, #30
    lsrs r2, r2, #30
    adds r2, #1                         @ Mew 1 to 4 along
    ldr r1, p_released_seed
    cmp r0, r1
    bne 1f
    movs r2, #2
1:  movs r1, #5
    muls r2, r1
    movs r6, r0
2:  bl rand16
    subs r2, #1
    bne 2b
.endif
    bl rand16
    lsls r7, r0, #16
    bl rand16
    orrs r7, r0                         @ the PID
.if FLAGS & F_ANTI_SHINY
    lsrs r0, r7, #16
    eors r0, r7
    ldr r1, p_tid
    eors r0, r1
    lsls r0, r0, #16
    lsrs r0, r0, #19
    bne 3f                              @ not shiny
    adds r7, #8
    lsrs r7, r7, #3
    lsls r7, r7, #3
3:
.endif
    str r7, [sp, #4]                    @ CreateMon(mon, species, level, 0, TRUE,
    movs r0, #1                         @ pid, OT_ID_PRESET, trainer id)
    str r0, [sp, #0]
    movs r0, #OT_ID_PRESET
    str r0, [sp, #8]
    ldr r0, p_tid
    str r0, [sp, #12]
    bl rand16
    lsls r7, r0, #17
    lsrs r7, r7, #17
    bl rand16
    lsls r0, r0, #17
    lsrs r0, r0, #2
    orrs r0, r7
    str r0, [sp, #IVS]
.if FLAGS & (F_WISHMKR_ITEM | F_GENDER_BIT7 | F_GENDER_DIV3)
    bl rand16
    movs r6, r0                         @ the call for the item or the OT's gender
.endif
    ldr r0, p_mon
    ldrh r1, [r4]
    movs r2, #LEVEL
    movs r3, #0
    ldr r7, p_create_mon
    bl call_r7
    adr r2, ot_name
    movs r1, #MON_DATA_OT_NAME
    bl set_data
.if FLAGS & F_GENDER_BIT7
    mvns r0, r6
    lsrs r0, r0, #7                     @ bit 7, inverted; the field keeps bit 0
.elseif FLAGS & F_GENDER_DIV3
    movs r0, r6
    movs r1, #3
    svc #6                              @ Div: r0 = call / 3
.else
    movs r0, #0                         @ male
.endif
    movs r1, #MON_DATA_OT_GENDER
    bl set_value
    movs r0, #METLOC_FATEFUL_ENCOUNTER
    movs r1, #MON_DATA_MET_LOCATION
    bl set_value
    movs r0, #VERSION_RUBY
    movs r1, #MON_DATA_MET_GAME
    bl set_value
.if FLAGS & F_WISHMKR_ITEM
    movs r0, r6
    movs r1, #3
    svc #6                              @ Div: r0 = call / 3
    movs r1, #1
    ands r1, r0
    movs r0, #ITEM_SALAC_BERRY
    subs r0, r0, r1                     @ Salac, or Ganlon when (call / 3) & 1
    movs r1, #MON_DATA_HELD_ITEM
    bl set_value
.endif
.if FLAGS & F_FATEFUL
    movs r0, #1
    movs r1, #MON_DATA_FATEFUL
    bl set_value
.endif
.if FLAGS & F_NATIONAL_RIBBON
    movs r0, #1
    movs r1, #MON_DATA_NATIONAL_RIBBON
    bl set_value
.endif
    ldr r6, [sp, #IVS]
    movs r7, #MON_DATA_HP_IV
4:  movs r0, #31                        @ each IV, five bits apiece from HP
    ands r0, r6
    lsrs r6, r6, #5
    movs r1, r7
    bl set_value
    adds r7, #1
    cmp r7, #MON_DATA_HP_IV + 6
    bne 4b
    movs r6, #0
5:  lsls r1, r6, #1                     @ each move
    adds r1, r4, r1
    ldrh r1, [r1, #2]
    movs r2, r6
    ldr r0, p_mon
    ldr r7, p_set_move_slot
    bl call_r7
    adds r6, #1
    cmp r6, #4
    bne 5b
    ldr r0, p_mon
    ldr r7, p_calculate_stats
    bl call_r7
    ldr r6, p_party_count
    ldrb r7, [r6]
    ldr r0, p_mon
    cmp r7, #PARTY_SIZE
    bcc 6f
    ldr r3, p_send_to_pc
    bl call_r3
    b 8f
6:  movs r1, #MON_SIZE                  @ into the next party slot
    muls r1, r7
    ldr r2, p_party
    adds r1, r1, r2
    movs r2, #MON_SIZE - 4
7:  ldr r3, [r0, r2]
    str r3, [r1, r2]
    subs r2, #4
    bpl 7b
    adds r7, #1
    strb r7, [r6]
    movs r0, #MON_GIVEN_TO_PARTY
8:  ldr r1, p_var_result
    strh r0, [r1]
    cmp r0, #MON_CANT_GIVE
    beq 9f
    ldrh r0, [r4]
    ldr r3, p_species_to_national
    bl call_r3
    movs r6, r0
    movs r1, #FLAG_SET_SEEN
    ldr r7, p_pokedex_flag
    bl call_r7
    movs r0, r6
    movs r1, #FLAG_SET_CAUGHT
    bl call_r7
9:  add sp, #FRAME
    pop {r4, r5, r6, r7, pc}

@ r0 = the next 16 bits of the GBA LCG, whose state is r6.
rand16:
    ldr r0, p_lcg_mul
    muls r0, r6
    ldr r1, p_lcg_add
    adds r6, r0, r1
    lsrs r0, r6, #16
    bx lr

@ SetMonData on the Pokémon being made: field r1, the value r0, or data at r2.
set_value:
    str r0, [sp, #VALUE]                @ in give_mon's frame
    add r2, sp, #VALUE
set_data:
    ldr r0, p_mon
    ldr r3, p_set_mon_data
call_r3:
    bx r3

call_r7:
    bx r7

.if MONS > 1
offer:
    ldr r0, p_var_8004
    ldrh r1, [r0]
    movs r2, #0
    cmp r1, #MONS
    bcs 1f                              @ past the last
    movs r2, #ENTRY_SIZE
    muls r1, r2
    adr r2, mons
    ldrh r1, [r2, r1]
    strh r1, [r0, #4]                   @ VAR_0x8006
    movs r2, #1
1:  ldr r0, p_var_result
    strh r2, [r0]
    bx lr
.endif

    .align 2
p_var_result:          .word SPECIAL_VAR_RESULT
p_random:              .word RANDOM
p_lcg_mul:             .word 0x41C64E6D
p_lcg_add:             .word 0x00006073
p_tid:                 .word TID
p_mon:                 .word ENEMY_PARTY
p_create_mon:          .word CREATE_MON
p_set_mon_data:        .word SET_MON_DATA
p_set_move_slot:       .word SET_MON_MOVE_SLOT
p_calculate_stats:     .word CALCULATE_STATS
p_party:               .word PARTY
p_party_count:         .word PARTY_COUNT
p_send_to_pc:          .word SEND_MON_TO_PC
p_species_to_national: .word SPECIES_TO_NATIONAL
p_pokedex_flag:        .word GET_SET_POKEDEX_FLAG
.if MONS > 1
p_var_8004:            .word SPECIAL_VAR_8004
.endif
.if FLAGS & F_MYSTRY_SEEDS
p_released_seed:       .word MYSTRY_RELEASED_SEED
.endif

@ ---- the OT name (7 characters, EOS), then the Pokémon: species and moves
ot_name:
.if EVENT == EVENT_WISHMKR_JIRACHI
    .byte 0xD1, 0xC3, 0xCD, 0xC2, 0xC7, 0xC5, 0xCC, 0xFF           @ WISHMKR
mons:
    .hword 409, 273, 93, 156, 0         @ JIRACHI: WISH, CONFUSION, REST
.endif
.if EVENT >= EVENT_10_ANIV_CELEBI && EVENT <= EVENT_10_ANIV_JOHTO_HOENN
    .byte 0xA2, 0xA1, 0x00, 0xBB, 0xC8, 0xC3, 0xD0, 0xFF           @ 10 ANIV
mons:
.endif
.if EVENT == EVENT_10_ANIV_CELEBI
    .hword 251, 246, 248, 226, 195      @ CELEBI: ANCIENTPOWER, FUTURE SIGHT, BATON PASS, PERISH SONG
.endif
.if EVENT == EVENT_10_ANIV_KANTO
    .hword 1, 230, 74, 76, 235          @ BULBASAUR: SWEET SCENT, GROWTH, SOLARBEAM, SYNTHESIS
    .hword 6, 17, 163, 82, 83           @ CHARIZARD: WING ATTACK, SLASH, DRAGON RAGE, FIRE SPIN
    .hword 9, 182, 240, 130, 56         @ BLASTOISE: PROTECT, RAIN DANCE, SKULL BASH, HYDRO PUMP
    .hword 25, 85, 87, 113, 19          @ PIKACHU: THUNDERBOLT, THUNDER, LIGHT SCREEN, FLY
    .hword 65, 248, 347, 94, 271        @ ALAKAZAM: FUTURE SIGHT, CALM MIND, PSYCHIC, TRICK
    .hword 149, 97, 219, 17, 200        @ DRAGONITE: AGILITY, SAFEGUARD, WING ATTACK, OUTRAGE
.endif
.if EVENT == EVENT_10_ANIV_LEGENDS
    .hword 144, 97, 170, 58, 115        @ ARTICUNO: AGILITY, MIND READER, ICE BEAM, REFLECT
    .hword 145, 97, 197, 65, 268        @ ZAPDOS: AGILITY, DETECT, DRILL PECK, CHARGE
    .hword 146, 97, 203, 53, 219        @ MOLTRES: AGILITY, ENDURE, FLAMETHROWER, SAFEGUARD
    .hword 243, 98, 209, 115, 242       @ RAIKOU: QUICK ATTACK, SPARK, REFLECT, CRUNCH
    .hword 244, 83, 23, 53, 207         @ ENTEI: FIRE SPIN, STOMP, FLAMETHROWER, SWAGGER
    .hword 245, 16, 62, 54, 243         @ SUICUNE: GUST, AURORA BEAM, MIST, MIRROR COAT
    .hword 407, 296, 94, 105, 204       @ LATIAS: MIST BALL, PSYCHIC, RECOVER, CHARM
    .hword 408, 295, 94, 105, 349       @ LATIOS: LUSTER PURGE, PSYCHIC, RECOVER, DRAGON DANCE
.endif
.if EVENT == EVENT_10_ANIV_JOHTO_HOENN
    .hword 157, 98, 172, 129, 53        @ TYPHLOSION: QUICK ATTACK, FLAME WHEEL, SWIFT, FLAMETHROWER
    .hword 196, 60, 244, 94, 234        @ ESPEON: PSYBEAM, PSYCH UP, PSYCHIC, MORNING SUN
    .hword 197, 185, 212, 103, 236      @ UMBREON: FAINT ATTACK, MEAN LOOK, SCREECH, MOONLIGHT
    .hword 248, 37, 184, 242, 89        @ TYRANITAR: THRASH, SCARY FACE, CRUNCH, EARTHQUAKE
    .hword 282, 299, 163, 119, 327      @ BLAZIKEN: BLAZE KICK, SLASH, MIRROR MOVE, SKY UPPERCUT
    .hword 376, 104, 163, 248, 195      @ ABSOL: DOUBLE TEAM, SLASH, FUTURE SIGHT, PERISH SONG
.endif
.if EVENT == EVENT_DOEL_DEOXYS
    .byte 0xBE, 0xC9, 0xBF, 0xC6, 0xFF, 0xFF, 0xFF, 0xFF           @ DOEL
.endif
.if EVENT == EVENT_SPACE_C_DEOXYS
    .byte 0xCD, 0xCA, 0xBB, 0xBD, 0xBF, 0x00, 0xBD, 0xFF           @ SPACE C
.endif
.if EVENT == EVENT_DOEL_DEOXYS || EVENT == EVENT_SPACE_C_DEOXYS
mons:
    .hword 410, 322, 105, 354, 63       @ DEOXYS: COSMIC POWER, RECOVER, PSYCHO BOOST, HYPER BEAM
.endif
.if EVENT == EVENT_AURA_MEW
    .byte 0xBB, 0xE9, 0xE6, 0xD5, 0xFF, 0xFF, 0xFF, 0xFF           @ Aura
.endif
.if EVENT == EVENT_MYSTRY_MEW
    .byte 0xC7, 0xD3, 0xCD, 0xCE, 0xCC, 0xD3, 0xFF, 0xFF           @ MYSTRY
.endif
.if EVENT == EVENT_AURA_MEW || EVENT == EVENT_MYSTRY_MEW
mons:
    .hword 151, 1, 144, 0, 0            @ MEW: POUND, TRANSFORM
.endif
.if EVENT == EVENT_MYSTRY_MEW
    .align 2
mystry_seeds:
    .hword 0x0652, 0x0932, 0x0C13, 0x0D43, 0x0EEE, 0x1263, 0x13C9, 0x1614, 0x1C09, 0x1EA5
    .hword 0x20BF, 0x2389, 0x2939, 0x302D, 0x306E, 0x34F3, 0x45F3, 0x46CE, 0x4A0D, 0x4B63
    .hword 0x4C79, 0x508E, 0x50AB, 0x5240, 0x5327, 0x56BA, 0x56CC, 0x5841, 0x5A60, 0x5BC1
    .hword 0x5E2B, 0x5EF3, 0x6065, 0x643F, 0x6457, 0x67A3, 0x6944, 0x6E06, 0x6E62, 0x7667
    .hword 0x77EF, 0x78D2, 0x8655, 0x8A92, 0x8B48, 0x93D0, 0x941D, 0x95A0, 0x967D, 0x9690
    .hword 0x9C37, 0x9C40, 0x9D9C, 0x9DE4, 0x9E86, 0xA153, 0xA443, 0xA8AC, 0xAC08, 0xAFFB
    .hword 0xB1F2, 0xB831, 0xBE96, 0xC2D4, 0xC385, 0xC6CE, 0xC92C, 0xC953, 0xC962, 0xCC43
    .hword 0xCD47, 0xCD96, 0xD1E4, 0xDFED, 0xE62C, 0xE6CC, 0xE90A, 0xE95D, 0xE991, 0xEBB2
    .hword 0xEE7F, 0xEE9F, 0xEFC8, 0xF0E4, 0xFE4E, 0xFE9D
.endif
.if EVENT == EVENT_ROCKS_METANG
    .byte 0xCC, 0xC9, 0xBD, 0xC5, 0xCD, 0xFF, 0xFF, 0xFF           @ ROCKS
mons:
    .hword 399, 36, 93, 232, 287        @ METANG: TAKE DOWN, CONFUSION, METAL CLAW, REFRESH
.endif
    .align 2
