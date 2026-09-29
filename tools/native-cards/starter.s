@ Starter Egg. `pick_starter` puts one of the nine starter Pokémon of Kanto,
@ Johto and Hoenn, at random, in VAR_0x8004 for giveegg.
@
@ Parameters (--defsym): SPECIAL_VAR_8004, RANDOM.

    .syntax unified
    .thumb
    .text
    .align 2

    .equ STARTERS, 9

pick_starter:
    push {lr}
    ldr r3, p_random
    bl call_r3
    movs r1, #STARTERS
    svc #6                              @ Div: r1 = r0 % 9
    lsls r1, r1, #1
    adr r0, starters
    ldrh r0, [r0, r1]
    ldr r1, p_var_8004
    strh r0, [r1]
    pop {pc}

call_r3:
    bx r3

    .align 2
p_random:   .word RANDOM
p_var_8004: .word SPECIAL_VAR_8004
starters:   .hword 1, 4, 7, 152, 155, 158, 277, 280, 283   @ BULBASAUR … MUDKIP
    .align 2
