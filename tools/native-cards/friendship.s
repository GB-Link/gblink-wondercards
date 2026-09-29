@ Sets the friendship of every party Pokémon that is not an Egg to 255. Eggs
@ are skipped because the same byte holds their egg cycles.
@
@ Parameters (--defsym): PARTY (&gPlayerParty).

    .syntax unified
    .thumb
    .text
    .align 2

    .set MONS_SET_BYTE, 1

befriend:
    push {r4, r5, lr}
    ldr r4, p_party
    movs r5, #PARTY_SIZE
1:  ldrb r0, [r4, #MON_FLAGS]
    lsls r0, r0, #29
    lsrs r0, r0, #29
    cmp r0, #A_POKEMON
    bne 2f
    movs r0, r4
    movs r1, #GROWTH
    movs r2, #GROWTH_FRIENDSHIP
    movs r3, #255
    bl set_mon_byte
2:  adds r4, #MON_SIZE
    subs r5, #1
    bne 1b
    pop {r4, r5}
    pop {r0}
    bx r0

    .align 2
p_party: .word PARTY

    .include "mons.inc"
