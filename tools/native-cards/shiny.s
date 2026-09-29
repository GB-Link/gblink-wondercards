@ Shiny Hunting: a V-blank hook that makes wild Pokémon shiny more often.
@
@ A wild Pokémon is a new gEnemyParty[0] that turns up while CB2_Overworld
@ runs, or CB2_OverworldBasic, which the game switches to when a battle's
@ transition starts (often before the hook's first chance), and carries the
@ player's trainer id, as every Pokémon the player can catch does; a
@ trainer's does not. One with the same name as the last, which
@ for a wild Pokémon is its species name, extends the chain, up to MAX_CHAIN.
@ It turns shiny when its shiny value (the personality's halves XOR the
@ trainer id's) is below 32 × (chain + 1), where the game's own rule is below
@ 8: 1 in 1024 for a new chain, 1 in 64 at MAX_CHAIN. It then gets a shiny
@ personality with the same nature, gender byte and ability bit, its data
@ re-encrypted and reordered to match.
@
@ `install` copies `resident`..`resident_end` to RESIDENT like the speed hook
@ (only one card's hook can run between resets) and points the V-blank
@ interrupt at the copy. `report` gives the card's script the chain in
@ VAR_0x8005 and the next Pokémon's odds in VAR_0x8006; the name is in STATE.
@ The hook only acts while the game waits for V-blank, so it never meets a
@ Pokémon the game is halfway through changing.
@
@ Parameters (--defsym): INTR_VBLANK (&gIntrTable[4]), MAIN (&gMain),
@ CB2_OVERWORLD, ENEMY_PARTY (&gEnemyParty), SB2_PTR (&gSaveBlock2Ptr),
@ SPECIAL_VAR_8004 and STATE.

    .syntax unified
    .thumb
    .text
    .align 2

    .equ RESIDENT, 0x0203FC00           @ unused RAM in both games
    .equ ENABLED, 0                     @ STATE: u8
    .equ CHAIN, 2                       @ u16, Pokémon met in a row
    .equ LAST_PID, 4                    @ the last wild Pokémon's personality
    .equ CB2, 8                         @ CB2_Overworld
    .equ OVERWORLD_BASIC, 12            @ CB2_OverworldBasic is 12 bytes before it
    .equ NAME, 12                       @ its name: 10 characters, then EOS
    .equ KEPT, 24                       @ the V-blank handler the hook calls
    .equ NAME_LENGTH, 10
    .equ MAX_CHAIN, 31
    .equ MAIN_CALLBACK2, 4
    .equ MAIN_INTR_CHECK, 0x1C
    .equ PLAYER_ID, 10                  @ in SaveBlock2
    .equ EOS, 0xFF
    .equ IME, 0x04000208
    .set MONS_ORDER, 1

install:
    push {r4, r5, r6, lr}
    ldr r3, p_ime
    ldrh r6, [r3]
    movs r0, #0
    strh r0, [r3]                       @ no interrupts while the hook changes
    ldr r5, p_resident
    adr r4, resident
    ldr r0, p_resident_size
1:  subs r0, #4
    ldr r1, [r4, r0]
    str r1, [r5, r0]
    bne 1b
    ldr r4, p_state
    strh r0, [r4, #CHAIN]
    movs r0, #1
    strb r0, [r4, #ENABLED]
    movs r0, #EOS
    strb r0, [r4, #NAME + NAME_LENGTH]
    ldr r0, p_enemy
    ldr r0, [r0]
    str r0, [r4, #LAST_PID]             @ not the Pokémon met before
    ldr r0, p_cb2_overworld
    str r0, [r4, #CB2]
    ldr r0, p_intr_vblank
    ldr r1, [r0]
    subs r3, r1, r5
    lsrs r3, r3, #10
    beq 3f                              @ already installed
    str r1, [r4, #KEPT]
    adds r1, r5, #1
    str r1, [r0]
3:  ldr r3, p_ime
    strh r6, [r3]
    pop {r4, r5, r6, pc}

report:
    ldr r0, p_state
    ldrh r1, [r0, #CHAIN]
    ldr r2, p_var_8004
    strh r1, [r2, #2]
    cmp r1, #MAX_CHAIN
    bcs 1f
    adds r1, #1                         @ the next Pokémon's chain
1:  adds r1, #1
    movs r0, #1
    lsls r0, r0, #11
    svc #6                              @ Div: 2048 / (chain + 1)
    ldr r2, p_var_8004
    strh r0, [r2, #4]
    bx lr

    .align 2
p_ime:           .word IME
p_resident:      .word RESIDENT
p_resident_size: .word resident_end - resident
p_state:         .word STATE
p_enemy:         .word ENEMY_PARTY
p_cb2_overworld: .word CB2_OVERWORLD
p_intr_vblank:   .word INTR_VBLANK
p_var_8004:      .word SPECIAL_VAR_8004

@ ---- copied to RESIDENT
    .align 2
resident:
    push {r4, r5, r6, r7, lr}
    ldr r4, r_state
    ldrb r0, [r4, #ENABLED]
    cmp r0, #0
    beq 9f
    ldr r7, r_main
    ldrh r0, [r7, #MAIN_INTR_CHECK]
    lsls r0, r0, #31
    bne 9f                              @ the game is mid-frame
    ldr r5, r_enemy
    ldr r6, [r5, #MON_PERSONALITY]
    ldr r0, [r4, #LAST_PID]
    cmp r0, r6
    beq 9f
    str r6, [r4, #LAST_PID]
    ldr r0, [r7, #MAIN_CALLBACK2]
    ldr r1, [r4, #CB2]
    cmp r0, r1
    beq 1f
    adds r0, #OVERWORLD_BASIC
    cmp r0, r1
    bne 9f
1:  ldr r0, r_sb2_ptr
    ldr r0, [r0]
    ldrh r1, [r0, #PLAYER_ID + 2]
    lsls r1, r1, #16
    ldrh r0, [r0, #PLAYER_ID]
    orrs r0, r1
    ldr r1, [r5, #MON_OT_ID]
    cmp r0, r1
    bne 9f                              @ a trainer's Pokémon, or none
    bl encounter
9:  ldr r3, [r4, #KEPT]
    bl call_r3
    pop {r4, r5, r6, r7}
    pop {r0}
    bx r0

call_r3:
    bx r3

@ A new wild Pokémon at r5 with personality r6; r4 = STATE. The game leaves
@ stray bytes after a name's EOS, so names are compared up to it.
encounter:
    push {lr}
    movs r0, #0
    movs r7, #0                         @ nonzero if the name differs
1:  adds r1, r5, r0
    ldrb r1, [r1, #MON_NICKNAME]
    adds r3, r4, r0
    ldrb r2, [r3, #NAME]
    strb r1, [r3, #NAME]
    eors r2, r1
    orrs r7, r2
    cmp r1, #EOS
    beq 2f
    adds r0, #1
    cmp r0, #NAME_LENGTH
    bne 1b
2:  ldrh r2, [r4, #CHAIN]
    cmp r7, #0
    beq 3f
    movs r2, #0
3:  cmp r2, #MAX_CHAIN
    bcs 4f
    adds r2, #1
4:  strh r2, [r4, #CHAIN]
    adds r2, #1
    lsls r2, r2, #5                     @ 32 × (chain + 1)
    ldr r0, [r5, #MON_OT_ID]
    eors r0, r6
    lsrs r1, r0, #16
    eors r0, r1
    lsls r0, r0, #16
    lsrs r0, r0, #16                    @ the shiny value
    cmp r0, #8
    bcc 5f                              @ shiny already
    cmp r0, r2
    bcs 5f
    bl make_shiny
    str r0, [r4, #LAST_PID]
5:  pop {pc}

    .equ OLD_ORDER, 48                  @ make_shiny's frame: the secure data,
    .equ NEW_ORDER, 52                  @ reordered, then these
    .equ CANDIDATE, 56
    .equ NATURE, OLD_ORDER              @ while searching
    .equ TRAINER, NEW_ORDER             @ the trainer id's halves XORed

@ Gives the Pokémon at r5 (personality r6) a shiny personality with the same
@ nature and low byte; r0 = the new personality, or r6 if there is none.
make_shiny:
    push {r4, r7, lr}
    sub sp, #60
    movs r0, r6
    movs r1, #25
    bl umod
    str r0, [sp, #NATURE]
    ldr r0, [r5, #MON_OT_ID]
    lsrs r1, r0, #16
    eors r0, r1
    str r0, [sp, #TRAINER]
    lsls r7, r6, #24
    lsrs r7, r7, #24                    @ the low half, from the low byte up
1:  movs r4, #0                         @ the shiny value, 0 to 7
2:  ldr r0, [sp, #TRAINER]
    eors r0, r7
    eors r0, r4
    lsls r0, r0, #16
    orrs r0, r7
    str r0, [sp, #CANDIDATE]
    movs r1, #25
    bl umod
    ldr r1, [sp, #NATURE]
    cmp r0, r1
    beq 3f
    adds r4, #1
    cmp r4, #8
    bne 2b
    adds r7, #255
    adds r7, #1
    lsrs r0, r7, #16
    beq 1b
    movs r0, r6
    b 9f
3:  ldr r7, [sp, #CANDIDATE]
    movs r0, r6
    bl order
    str r0, [sp, #OLD_ORDER]
    movs r0, r7
    bl order
    str r0, [sp, #NEW_ORDER]
    movs r4, #0                         @ 2 × the substructure number
4:  ldr r0, [sp, #OLD_ORDER]
    lsrs r0, r4
    movs r3, #3
    ands r0, r3
    movs r2, #SUBSTRUCT_SIZE
    muls r0, r2
    adds r0, #MON_SECURE
    adds r0, r5, r0                     @ from its old place
    ldr r1, [sp, #NEW_ORDER]
    lsrs r1, r4
    ands r1, r3
    muls r1, r2
    add r1, sp                          @ to its new place in the frame
    movs r2, #3
5:  ldr r3, [r0]
    eors r3, r6                         @ the key changes by old ^ new personality
    eors r3, r7
    str r3, [r1]
    adds r0, #4
    adds r1, #4
    subs r2, #1
    bne 5b
    adds r4, #2
    cmp r4, #8
    bne 4b
    mov r1, sp
    movs r0, r5
    adds r0, #MON_SECURE
    movs r2, #44
6:  ldr r3, [r1, r2]
    str r3, [r0, r2]
    subs r2, #4
    bpl 6b
    str r7, [r5, #MON_PERSONALITY]
    movs r0, r7
9:  add sp, #60
    pop {r4, r7, pc}

@ r0 = the substructure order for personality r0.
order:
    push {lr}
    movs r1, #24
    bl umod
    adr r1, substruct_order
    ldrb r0, [r1, r0]
    pop {pc}

    .align 2
r_state:   .word STATE
r_enemy:   .word ENEMY_PARTY
r_main:    .word MAIN
r_sb2_ptr: .word SB2_PTR

    .include "mons.inc"
resident_end:
