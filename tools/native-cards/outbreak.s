@ Mass Outbreak (Emerald). `outbreak_menu` offers eight rare Pokémon of
@ Hoenn; `start_outbreak` starts a mass outbreak of the one chosen
@ (VAR_RESULT) where it lives, as the TV's news does (StartMassOutbreak): at
@ its level there, knowing the moves a wild one would (CreateWildMon's),
@ half of the wild Pokémon on land and from SWEET SCENT, for two days. Its
@ name goes to gStringVar1 and the place's to gStringVar2.
@
@ Parameters (--defsym): SB1_PTR, SPECIAL_VAR_RESULT, ENEMY_PARTY,
@ STRING_VAR_1, STRING_VAR_2, SPECIES_NAMES, CREATE_WILD_MON, GET_MON_DATA,
@ GET_SPECIES_NAME, GET_MAP_HEADER, GET_MAP_NAME, JAPANESE (1 on the Japanese
@ games) and those of menu.inc.

    .syntax unified
    .thumb
    .text
    .align 2

    .equ OUTBREAKS, 8
    .equ ENTRY_SIZE, 6                  @ u16 species, u8 map group, map number, level
    .equ ENTRY_GROUP, 2
    .equ ENTRY_NUM, 3
    .equ ENTRY_LEVEL, 4
    .equ OUTBREAK, 0x2B90               @ in SaveBlock1: u16 species,
    .equ OUTBREAK_NUM, 2                @ u8 map number, map group, level,
    .equ OUTBREAK_GROUP, 3
    .equ OUTBREAK_LEVEL, 4
    .equ OUTBREAK_MOVES, 8              @ u16 moves[4],
    .equ OUTBREAK_PROBABILITY, 0x11     @ u8 probability (%),
    .equ OUTBREAK_DAYS, 0x12            @ u16 days left
    .equ PROBABILITY, 50                @ as the TV's outbreaks
    .equ DAYS, 2
.if JAPANESE
    .equ SPECIES_NAME_SIZE, 6
.else
    .equ SPECIES_NAME_SIZE, 11
.endif
    .equ MON_DATA_MOVE1, 13
    .equ REGION_MAP_SECTION, 0x14       @ in a map header
    .equ MENU_WIDTH, 9                  @ tiles, for SKARMORY

outbreak_menu:
    push {lr}
    sub sp, #OUTBREAKS * 4
    adr r0, outbreaks
    movs r1, #0
1:  ldrh r2, [r0]
    movs r3, #SPECIES_NAME_SIZE
    muls r2, r3
    ldr r3, p_species_names
    adds r2, r2, r3
    mov r3, sp
    str r2, [r3, r1]
    adds r0, #ENTRY_SIZE
    adds r1, #4
    cmp r1, #OUTBREAKS * 4
    bne 1b
    mov r0, sp
    movs r1, #OUTBREAKS
    movs r2, #MENU_WIDTH
    bl menu
    add sp, #OUTBREAKS * 4
    pop {pc}

start_outbreak:
    push {r4, r5, r6, lr}
    ldr r0, p_var_result
    ldrh r0, [r0]
    movs r1, #ENTRY_SIZE
    muls r0, r1
    adr r4, outbreaks
    adds r4, r4, r0                     @ the Pokémon chosen
    ldrh r0, [r4]
    ldrb r1, [r4, #ENTRY_LEVEL]
    ldr r3, p_create_wild_mon           @ into gEnemyParty[0], for its moves
    bl call_r3
    ldr r5, p_sb1_ptr
    ldr r5, [r5]
    ldr r0, p_outbreak
    adds r5, r5, r0
    ldrh r0, [r4]
    strh r0, [r5]
    ldrb r0, [r4, #ENTRY_NUM]
    strb r0, [r5, #OUTBREAK_NUM]
    ldrb r0, [r4, #ENTRY_GROUP]
    strb r0, [r5, #OUTBREAK_GROUP]
    ldrb r0, [r4, #ENTRY_LEVEL]
    strb r0, [r5, #OUTBREAK_LEVEL]
    movs r6, #0
2:  ldr r0, p_enemy
    movs r1, #MON_DATA_MOVE1
    adds r1, r1, r6
    ldr r3, p_get_mon_data
    bl call_r3
    lsls r1, r6, #1
    adds r1, r5, r1
    strh r0, [r1, #OUTBREAK_MOVES]
    adds r6, #1
    cmp r6, #4
    bne 2b
    movs r0, #PROBABILITY
    strb r0, [r5, #OUTBREAK_PROBABILITY]
    movs r0, #DAYS
    strh r0, [r5, #OUTBREAK_DAYS]
    ldr r0, p_string_var_1
    ldrh r1, [r4]
    ldr r3, p_get_species_name
    bl call_r3
    ldrb r0, [r4, #ENTRY_GROUP]
    ldrb r1, [r4, #ENTRY_NUM]
    ldr r3, p_get_map_header
    bl call_r3
    ldrb r1, [r0, #REGION_MAP_SECTION]
    ldr r0, p_string_var_2
    movs r2, #0
    ldr r3, p_get_map_name
    bl call_r3
    pop {r4, r5, r6, pc}

call_r3:
    bx r3

    .align 2
p_var_result:       .word SPECIAL_VAR_RESULT
p_sb1_ptr:          .word SB1_PTR
p_outbreak:         .word OUTBREAK
p_enemy:            .word ENEMY_PARTY
p_species_names:    .word SPECIES_NAMES
p_create_wild_mon:  .word CREATE_WILD_MON
p_get_mon_data:     .word GET_MON_DATA
p_string_var_1:     .word STRING_VAR_1
p_string_var_2:     .word STRING_VAR_2
p_get_species_name: .word GET_SPECIES_NAME
p_get_map_header:   .word GET_MAP_HEADER
p_get_map_name:     .word GET_MAP_NAME

@ Each rare Pokémon, where it lives and its level there (wild_encounters.json).
outbreaks:
    .hword 392
    .byte 0, 17, 4, 0                   @ RALTS, ROUTE 102
    .hword 353
    .byte 0, 25, 13, 0                  @ PLUSLE, ROUTE 110
    .hword 227
    .byte 0, 28, 16, 0                  @ SKARMORY, ROUTE 113
    .hword 317
    .byte 0, 34, 25, 0                  @ KECLEON, ROUTE 119
    .hword 369
    .byte 0, 34, 27, 0                  @ TROPIUS, ROUTE 119
    .hword 376
    .byte 0, 35, 27, 0                  @ ABSOL, ROUTE 120
    .hword 411
    .byte 24, 22, 28, 0                 @ CHIMECHO, MT. PYRE's summit
    .hword 355
    .byte 24, 44, 38, 0                 @ MAWILE, VICTORY ROAD B1F
    .align 2

    .include "menu.inc"
