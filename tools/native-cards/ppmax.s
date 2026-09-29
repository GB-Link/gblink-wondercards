@ PP Max. `max_pp` gives every move of every party Pokémon that is not an Egg
@ three PP Ups (ppBonuses 0xFF) and restores its PP to the new maximum.
@
@ Parameters (--defsym): PARTY, SET_MON_DATA, MON_RESTORE_PP.

    .syntax unified
    .thumb
    .text
    .align 2

    .equ MON_DATA_PP_BONUSES, 21
    .equ ALL_PP_UPS, 0xFF

max_pp:
    push {r4, r5, lr}
    sub sp, #4
    movs r0, #ALL_PP_UPS
    str r0, [sp]
    ldr r4, p_party
    movs r5, #PARTY_SIZE
1:  ldrb r0, [r4, #MON_FLAGS]
    lsls r0, r0, #29
    lsrs r0, r0, #29
    cmp r0, #A_POKEMON
    bne 2f
    movs r0, r4
    movs r1, #MON_DATA_PP_BONUSES
    mov r2, sp
    ldr r3, p_set_mon_data
    bl call_r3
    movs r0, r4
    ldr r3, p_restore_pp
    bl call_r3
2:  adds r4, #MON_SIZE
    subs r5, #1
    bne 1b
    add sp, #4
    pop {r4, r5, pc}

call_r3:
    bx r3

    .align 2
p_party:        .word PARTY
p_set_mon_data: .word SET_MON_DATA
p_restore_pp:   .word MON_RESTORE_PP

    .include "mons.inc"
