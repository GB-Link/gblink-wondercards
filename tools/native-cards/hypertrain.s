@ Hyper Training. `max_ivs` sets all six IVs of the Pokémon in
@ gSpecialVar_0x8004 to 31 and recalculates its stats.
@
@ Parameters (--defsym): PARTY, SPECIAL_VAR_8004, SET_MON_DATA,
@ CALCULATE_STATS and those of relocate.inc.

    .syntax unified
    .thumb
    .text
    .align 2

    .set MONS_CHOSEN, 1
    .equ MON_DATA_HP_IV, 39
    .equ STAT_COUNT, 6
    .equ MAX_IV, 31

max_ivs:
    push {r4, r5, lr}
    sub sp, #4
    bl chosen_mon
    movs r4, r0
    movs r0, #MAX_IV
    str r0, [sp]
    movs r5, #MON_DATA_HP_IV
1:  movs r0, r4
    movs r1, r5
    mov r2, sp
    ldr r3, p_set_mon_data
    bl call_r3
    adds r5, #1
    cmp r5, #MON_DATA_HP_IV + STAT_COUNT
    bne 1b
    movs r0, r4
    ldr r3, p_calculate_stats
    bl call_r3
    add sp, #4
    pop {r4, r5, pc}

call_r3:
    bx r3

    .align 2
p_set_mon_data:    .word SET_MON_DATA
p_calculate_stats: .word CALCULATE_STATS

    .include "mons.inc"
    .include "relocate.inc"
