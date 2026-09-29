@ Hidden Power Checker. `hidden_power` works out the Hidden Power of the
@ Pokémon in gSpecialVar_0x8004 from its IVs the way the game does: its type's
@ name goes to gStringVar2 and its power to VAR_0x8005.
@
@ Parameters (--defsym): PARTY, SPECIAL_VAR_8004, STRING_VAR_2, TYPE_NAMES,
@ GET_MON_DATA, STRING_COPY and those of relocate.inc.

    .syntax unified
    .thumb
    .text
    .align 2

    .set MONS_CHOSEN, 1
    .equ MON_DATA_HP_IV, 39
    .equ STAT_COUNT, 6
    .equ TYPE_MYSTERY, 9
    .equ TYPE_NAME_SIZE, 7

hidden_power:
    push {r4, r5, r6, r7, lr}
    bl chosen_mon
    movs r4, r0
    movs r5, #0                         @ the type bits
    movs r6, #0                         @ the power bits
    movs r7, #0                         @ the stat
1:  movs r0, r4
    movs r1, #MON_DATA_HP_IV
    adds r1, r1, r7
    ldr r3, p_get_mon_data
    bl call_r3
    lsrs r1, r0, #1
    movs r2, #1
    ands r0, r2
    ands r1, r2
    lsls r0, r7
    lsls r1, r7
    orrs r5, r0
    orrs r6, r1
    adds r7, #1
    cmp r7, #STAT_COUNT
    bne 1b
    movs r0, #40
    muls r0, r6
    movs r1, #63
    svc #6                              @ Div
    adds r0, #30
    ldr r1, p_var_8004
    strh r0, [r1, #2]                   @ VAR_0x8005: the power
    movs r0, #15
    muls r0, r5
    movs r1, #63
    svc #6
    adds r0, #1                         @ from FIGHTING, skipping ???
    cmp r0, #TYPE_MYSTERY
    bcc 2f
    adds r0, #1
2:  movs r1, #TYPE_NAME_SIZE
    muls r1, r0
    ldr r0, p_type_names
    adds r1, r1, r0
    ldr r0, p_string_var_2
    ldr r3, p_string_copy
    bl call_r3
    pop {r4, r5, r6, r7, pc}

call_r3:
    bx r3

    .align 2
p_var_8004:     .word SPECIAL_VAR_8004
p_get_mon_data: .word GET_MON_DATA
p_type_names:   .word TYPE_NAMES
p_string_var_2: .word STRING_VAR_2
p_string_copy:  .word STRING_COPY

    .include "mons.inc"
    .include "relocate.inc"
