@ Event Pokémon. `give_mon` makes a copy of an English Gen 3 distribution the
@ way PKHeX's EncounterGift3 describes it: a 16-bit origin seed from Random()
@ runs the GBA LCG; the first call is the high half of the PID and the second
@ its low half (+8, rounded down to a multiple of 8, where it would be shiny
@ and the event never gave shinies), the next two the IVs, and one more the
@ held item (WISHMKR) or the OT's gender (bit 7, inverted: 10 ANIV).
@ CreateMon makes the Pokémon, which then gets the event's OT, ID, IVs, moves
@ and met data: a fateful encounter, in Ruby, at its level, in a POKé BALL.
@ It goes to the first free party slot, else to the PC by the routine
@ GiveMonToPlayer uses, which (unlike GiveMonToPlayer) keeps the OT. Given,
@ it counts as seen and caught. VAR_RESULT = MON_GIVEN_TO_PARTY,
@ MON_GIVEN_TO_PC or MON_CANT_GIVE.
@
@ Parameters (--defsym): JIRACHI (1: WISHMKR Jirachi, 0: 10 ANIV Celebi),
@ PARTY, PARTY_COUNT, ENEMY_PARTY, SPECIAL_VAR_RESULT, RANDOM, CREATE_MON,
@ SET_MON_DATA, GET_MON_DATA, SET_MON_MOVE_SLOT, CALCULATE_STATS,
@ SEND_MON_TO_PC and GET_SET_POKEDEX_FLAG.

    .syntax unified
    .thumb
    .text
    .align 2

    .equ MON_SIZE, 100
    .equ PARTY_SIZE, 6
    .equ OT_ID_PRESET, 1
    .equ MON_DATA_OT_NAME, 7
    .equ MON_DATA_SPECIES, 11
    .equ MON_DATA_HELD_ITEM, 12
    .equ MON_DATA_MET_LOCATION, 35
    .equ MON_DATA_MET_GAME, 37
    .equ MON_DATA_HP_IV, 39
    .equ MON_DATA_OT_GENDER, 49
    .equ METLOC_FATEFUL_ENCOUNTER, 0xFF
    .equ VERSION_RUBY, 2
    .equ MON_GIVEN_TO_PARTY, 0
    .equ MON_CANT_GIVE, 2
    .equ FLAG_SET_SEEN, 2
    .equ FLAG_SET_CAUGHT, 3
    .equ ITEM_SALAC_BERRY, 170
    .equ FRAME, 24                      @ CreateMon's four stack arguments, then:
    .equ IVS, 16                        @ the IVs, packed as the game keeps them
    .equ VALUE, 20                      @ a value for SetMonData
.if JIRACHI
    .equ SPECIES, 409
    .equ NATIONAL, 385
    .equ LEVEL, 5
    .equ TRAINER_ID, 20043              @ secret id 0
.else
    .equ SPECIES, 251
    .equ NATIONAL, 251
    .equ LEVEL, 70
    .equ TRAINER_ID, 10
.endif

give_mon:
    push {r4, r5, r6, r7, lr}
    sub sp, #FRAME
    ldr r3, p_random
    bl call_r3
    lsls r6, r0, #16
    lsrs r6, r6, #16                    @ the origin seed
    bl rand16
    lsls r7, r0, #16
    bl rand16
    orrs r7, r0                         @ the PID
.if JIRACHI == 0
    lsrs r0, r7, #16
    lsls r1, r7, #16
    lsrs r1, r1, #16
    eors r0, r1
    movs r1, #TRAINER_ID
    eors r0, r1
    cmp r0, #8
    bcs 1f
    adds r7, #8                         @ it would be shiny
    lsrs r7, r7, #3
    lsls r7, r7, #3
1:
.endif
    bl rand16
    lsls r4, r0, #17
    lsrs r4, r4, #17
    bl rand16
    lsls r0, r0, #17
    lsrs r0, r0, #2
    orrs r4, r0
    str r4, [sp, #IVS]
    bl rand16
    movs r5, r0                         @ the call for the item or the OT's gender
    str r7, [sp, #4]                    @ CreateMon(mon, species, level, 0, TRUE,
    movs r0, #1                         @ pid, OT_ID_PRESET, TRAINER_ID)
    str r0, [sp, #0]
    movs r0, #OT_ID_PRESET
    str r0, [sp, #8]
    ldr r0, p_trainer_id
    str r0, [sp, #12]
    ldr r0, p_mon
    ldr r1, p_species
    movs r2, #LEVEL
    movs r3, #0
    ldr r4, p_create_mon
    bl call_r4
    movs r1, #MON_DATA_OT_NAME
    adr r2, ot_name
    bl set_data
.if JIRACHI
    movs r0, #0                         @ the OT is male
.else
    lsrs r0, r5, #7
    movs r1, #1
    bics r1, r0                         @ bit 7, inverted
    movs r0, r1
.endif
    movs r1, #MON_DATA_OT_GENDER
    bl set_value
    movs r0, #METLOC_FATEFUL_ENCOUNTER
    movs r1, #MON_DATA_MET_LOCATION
    bl set_value
    movs r0, #VERSION_RUBY
    movs r1, #MON_DATA_MET_GAME
    bl set_value
.if JIRACHI
    movs r0, r5
    movs r1, #3
    svc #6                              @ Div: (rand16 / 3) & 1 picks the berry
    movs r1, #1
    ands r0, r1
    movs r1, #ITEM_SALAC_BERRY
    subs r0, r1, r0
    movs r1, #MON_DATA_HELD_ITEM
    bl set_value
.endif
    movs r5, #0                         @ each IV, five bits apiece from HP
2:  movs r1, #5
    muls r1, r5
    ldr r0, [sp, #IVS]
    lsrs r0, r1
    movs r1, #31
    ands r0, r1
    movs r1, #MON_DATA_HP_IV
    adds r1, r1, r5
    bl set_value
    adds r5, #1
    cmp r5, #6
    bne 2b
    movs r5, #0                         @ each move
3:  ldr r0, p_mon
    adr r1, moves
    lsls r2, r5, #1
    ldrh r1, [r1, r2]
    movs r2, r5
    ldr r4, p_set_move_slot
    bl call_r4
    adds r5, #1
    cmp r5, #4
    bne 3b
    ldr r0, p_mon
    ldr r4, p_calculate_stats
    bl call_r4
    movs r5, #0                         @ the first free party slot
4:  movs r0, #MON_SIZE
    muls r0, r5
    ldr r1, p_party
    adds r4, r1, r0
    movs r0, r4
    movs r1, #MON_DATA_SPECIES
    movs r2, #0
    ldr r3, p_get_mon_data
    bl call_r3
    cmp r0, #0
    beq 5f
    adds r5, #1
    cmp r5, #PARTY_SIZE
    bne 4b
    ldr r0, p_mon
    ldr r4, p_send_to_pc
    bl call_r4
    movs r7, r0
    b 7f
5:  ldr r1, p_mon                       @ copy it there
    movs r2, #MON_SIZE - 4
6:  ldr r0, [r1, r2]
    str r0, [r4, r2]
    subs r2, #4
    bpl 6b
    adds r5, #1
    ldr r0, p_party_count
    strb r5, [r0]
    movs r7, #MON_GIVEN_TO_PARTY
7:  cmp r7, #MON_CANT_GIVE
    beq 8f
    ldr r0, p_national
    movs r1, #FLAG_SET_SEEN
    ldr r4, p_pokedex_flag
    bl call_r4
    ldr r0, p_national
    movs r1, #FLAG_SET_CAUGHT
    ldr r4, p_pokedex_flag
    bl call_r4
8:  ldr r0, p_var_result
    strh r7, [r0]
    add sp, #FRAME
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
    push {lr}
    ldr r0, p_mon
    ldr r3, p_set_mon_data
    bl call_r3
    pop {pc}

call_r3:
    bx r3

call_r4:
    bx r4

    .align 2
p_random:          .word RANDOM
p_lcg_mul:         .word 0x41C64E6D
p_lcg_add:         .word 0x00006073
p_trainer_id:      .word TRAINER_ID
p_mon:             .word ENEMY_PARTY
p_species:         .word SPECIES
p_create_mon:      .word CREATE_MON
p_set_mon_data:    .word SET_MON_DATA
p_get_mon_data:    .word GET_MON_DATA
p_set_move_slot:   .word SET_MON_MOVE_SLOT
p_calculate_stats: .word CALCULATE_STATS
p_party:           .word PARTY
p_party_count:     .word PARTY_COUNT
p_send_to_pc:      .word SEND_MON_TO_PC
p_national:        .word NATIONAL
p_pokedex_flag:    .word GET_SET_POKEDEX_FLAG
p_var_result:      .word SPECIAL_VAR_RESULT
.if JIRACHI
ot_name: .byte 0xD1, 0xC3, 0xCD, 0xC2, 0xC7, 0xC5, 0xCC, 0xFF     @ WISHMKR
moves:   .hword 273, 93, 156, 0                                     @ WISH, CONFUSION, REST
.else
ot_name: .byte 0xA2, 0xA1, 0x00, 0xBB, 0xC8, 0xC3, 0xD0, 0xFF     @ 10 ANIV
@ ANCIENTPOWER, FUTURE SIGHT, BATON PASS, PERISH SONG
moves:   .hword 246, 248, 226, 195
.endif
    .align 2
