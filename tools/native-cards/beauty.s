@ Beauty for Milotic. `max_beauty` sets the Beauty condition of the Pokémon in
@ gSpecialVar_0x8004 to 255; a Feebas evolves at its next level when its
@ Beauty is above 170.
@
@ Parameters (--defsym): PARTY, SPECIAL_VAR_8004, SET_MON_DATA and those of
@ relocate.inc.

    .syntax unified
    .thumb
    .text
    .align 2

    .set MONS_CHOSEN, 1
    .equ MON_DATA_BEAUTY, 23
    .equ MAX_CONDITION, 255

max_beauty:
    push {lr}
    sub sp, #4
    bl chosen_mon
    movs r1, #MAX_CONDITION
    str r1, [sp]
    movs r1, #MON_DATA_BEAUTY
    mov r2, sp
    ldr r3, p_set_mon_data
    bl call_r3
    add sp, #4
    pop {pc}

call_r3:
    bx r3

    .align 2
p_set_mon_data: .word SET_MON_DATA

    .include "mons.inc"
    .include "relocate.inc"
