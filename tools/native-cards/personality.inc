@ `repersonalize` gives the Pokémon at r0 a new personality whose low byte (its
@ gender and ability bit) is r1 and whose nature is r2, and re-encrypts and
@ reorders its data to match; r0 = 1, or 0 if no such personality turned up.
@ Only the second byte is searched; the high half is the low half ^ the old
@ high ^ low, which keeps the shiny value (the halves of personality ^ trainer
@ id) as it was. For an Unown the second byte keeps its two low bits, and with
@ the rest that keeps its letter.
@
@ Parameters (--defsym): GET_MON_DATA. Needs mons.inc with MONS_ORDER.

    .equ REP_NATURE, 48                 @ frame: 48 bytes of reordered data, then
    .equ REP_LOW, 52
    .equ REP_HIGH, 56                   @ the high half is the low half ^ this
    .equ REP_CANDIDATE, 60
    .equ REP_FRAME, 64
    .equ SPECIES_UNOWN, 201
    .equ MON_DATA_SPECIES, 11

repersonalize:
    push {r4, r5, r6, r7, lr}
    sub sp, #REP_FRAME
    movs r5, r0
    str r1, [sp, #REP_LOW]
    str r2, [sp, #REP_NATURE]
    ldr r6, [r5, #MON_PERSONALITY]
    lsrs r0, r6, #16                    @ high ^ low stays as it was, and the
    lsls r1, r6, #16                    @ shiny value with it
    lsrs r1, r1, #16
    eors r0, r1
    str r0, [sp, #REP_HIGH]
    movs r0, r5
    movs r1, #MON_DATA_SPECIES
    ldr r3, rep_get_mon_data
    bl rep_call
    movs r4, #1                         @ the second byte's step
    movs r7, #0                         @ the second byte
    cmp r0, #SPECIES_UNOWN
    bne 1f
    movs r4, #4
    lsls r7, r6, #22
    lsrs r7, r7, #30
1:  lsls r1, r7, #8
    ldr r0, [sp, #REP_LOW]
    orrs r1, r0                         @ the low half
    ldr r0, [sp, #REP_HIGH]
    eors r0, r1
    lsls r0, r0, #16
    orrs r0, r1
    str r0, [sp, #REP_CANDIDATE]
    movs r1, #25
    bl umod
    ldr r1, [sp, #REP_NATURE]
    cmp r0, r1
    beq 2f
    adds r7, r7, r4
    lsrs r0, r7, #8
    beq 1b
    movs r0, #0
    b 9f
2:  ldr r7, [sp, #REP_CANDIDATE]
    movs r0, r6
    bl rep_order
    str r0, [sp, #REP_NATURE]           @ from here: the old order
    movs r0, r7
    bl rep_order
    str r0, [sp, #REP_LOW]              @ and the new one
    movs r4, #0                         @ 2 × the substructure number
3:  ldr r0, [sp, #REP_NATURE]
    lsrs r0, r4
    movs r3, #3
    ands r0, r3
    movs r2, #SUBSTRUCT_SIZE
    muls r0, r2
    adds r0, #MON_SECURE
    adds r0, r5, r0                     @ from its old place
    ldr r1, [sp, #REP_LOW]
    lsrs r1, r4
    ands r1, r3
    muls r1, r2
    add r1, sp                          @ to its new place in the frame
    movs r2, #3
4:  ldr r3, [r0]
    eors r3, r6                         @ the key changes by old ^ new personality
    eors r3, r7
    str r3, [r1]
    adds r0, #4
    adds r1, #4
    subs r2, #1
    bne 4b
    adds r4, #2
    cmp r4, #8
    bne 3b
    mov r1, sp
    movs r0, r5
    adds r0, #MON_SECURE
    movs r2, #44
5:  ldr r3, [r1, r2]
    str r3, [r0, r2]
    subs r2, #4
    bpl 5b
    str r7, [r5, #MON_PERSONALITY]
    movs r0, #1
9:  add sp, #REP_FRAME
    pop {r4, r5, r6, r7, pc}

@ r0 = the substructure order for personality r0.
rep_order:
    push {lr}
    movs r1, #24
    bl umod
    adr r1, substruct_order
    ldrb r0, [r1, r0]
    pop {pc}

rep_call:
    bx r3

    .align 2
rep_get_mon_data: .word GET_MON_DATA
