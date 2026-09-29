@ Feebas Finder (Emerald). `install` starts a V-blank hook: when a rod is cast
@ on ROUTE 119 (a Task_Fishing task starts), it creates a task that moves
@ the six FEEBAS spots so that the first is the tile being fished. The spots
@ come from gSaveBlock1Ptr->dewfordTrends[0].rand through FeebasRandom (the
@ ISO LCG, 1103515245 × x + 12345, high half), the first one being that
@ % 447 (0 counts as 447); the task searches the 16-bit seeds for one whose
@ first spot is GetFeebasFishingSpotId of the tile in front of the player,
@ as CheckFeebas finds it. A bite there is then FEEBAS half the time, as at
@ any FEEBAS spot. Spots 1 to 3, which can't be fished from, are left alone.
@ The hook is copied to RESIDENT like the others, so it lasts until the game
@ is reset; `uninstall` turns it off.
@
@ Parameters (--defsym): INTR_VBLANK, MAIN, SB1_PTR, TASKS, TASK_FISHING,
@ CREATE_TASK, DESTROY_TASK, FRONT_OF_PLAYER (GetXYCoordsOneStepInFrontOfPlayer),
@ FEEBAS_SPOT (GetFeebasFishingSpotId) and STATE.

    .syntax unified
    .thumb
    .text
    .align 2

    .equ RESIDENT, 0x0203FC00           @ unused RAM in both games
    .equ ENABLED, 0                     @ STATE: u8
    .equ CAST, 1                        @ u8: this cast's spots are placed
    .equ KEPT, 4                        @ the V-blank handler the hook calls
    .equ MAIN_INTR_CHECK, 0x1C
    .equ NUM_TASKS, 16
    .equ TASK_SIZE, 0x28
    .equ TASK_ACTIVE, 4
    .equ TASK_PRIORITY, 80
    .equ SB1_MAP, 4                     @ location.mapGroup, then mapNum
    .equ ROUTE_119, 34 << 8             @ group 0, map 34
    .equ TREND_RAND, 0x2E6A             @ dewfordTrends[0].rand in SaveBlock1
    .equ MAP_OFFSET, 7
    .equ SECTION_2, 46                  @ sRoute119WaterTileData's y ranges
    .equ SECTION_3, 92
    .equ FISHING_SPOTS, 447
    .equ FIRST_SPOT, 4
    .equ IME, 0x04000208

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
    strb r0, [r4, #CAST]
    movs r0, #1
    strb r0, [r4, #ENABLED]
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

uninstall:
    ldr r0, p_state
    movs r1, #0
    strb r1, [r0, #ENABLED]
    bx lr

    .align 2
p_ime:           .word IME
p_resident:      .word RESIDENT
p_resident_size: .word resident_end - resident
p_state:         .word STATE
p_intr_vblank:   .word INTR_VBLANK

@ ---- copied to RESIDENT
    .align 2
resident:
    push {r4, r5, r6, lr}
    ldr r4, r_state
    ldrb r0, [r4, #ENABLED]
    cmp r0, #0
    beq 9f
    ldr r0, r_main
    ldrh r0, [r0, #MAIN_INTR_CHECK]
    lsls r0, r0, #31
    bne 9f                              @ the game is mid-frame
    ldr r5, r_tasks
    movs r6, #NUM_TASKS
    ldr r1, r_task_fishing
1:  ldr r0, [r5]
    cmp r0, r1
    bne 2f
    ldrb r0, [r5, #TASK_ACTIVE]
    cmp r0, #0
    bne 3f
2:  adds r5, #TASK_SIZE
    subs r6, #1
    bne 1b
    strb r6, [r4, #CAST]                @ no rod out: ready for the next cast
    b 9f
3:  ldrb r0, [r4, #CAST]
    cmp r0, #0
    bne 9f
    ldr r0, r_sb1_ptr
    ldr r0, [r0]
    ldrh r0, [r0, #SB1_MAP]
    ldr r1, r_route_119
    cmp r0, r1
    bne 9f
    movs r0, #1
    strb r0, [r4, #CAST]
    ldr r0, r_spot_task
    movs r1, #TASK_PRIORITY
    ldr r3, r_create_task
    bl r_call_r3
9:  ldr r3, [r4, #KEPT]
    bl r_call_r3
    pop {r4, r5, r6}
    pop {r0}
    bx r0

@ The task the cast starts: finds the spot in front of the player and a seed
@ whose first FEEBAS spot it is, then ends.
spot_task:
    push {r4, r5, r6, lr}
    sub sp, #12
    str r0, [sp, #8]                    @ the task
    mov r0, sp
    add r1, sp, #4
    ldr r3, r_front
    bl r_call_r3                        @ x and y at sp, sp + 4
    mov r2, sp
    movs r3, #0
    ldrsh r0, [r2, r3]
    subs r0, #MAP_OFFSET
    movs r3, #4
    ldrsh r1, [r2, r3]
    subs r1, #MAP_OFFSET
    movs r2, #0                         @ the section of the route
    cmp r1, #SECTION_2
    blt 1f
    movs r2, #1
    cmp r1, #SECTION_3
    blt 1f
    movs r2, #2
1:  ldr r3, r_feebas_spot
    bl r_call_r3
    cmp r0, #FIRST_SPOT
    bcc 8f                              @ no FEEBAS spot can be there
    ldr r6, r_fishing_spots
    cmp r0, r6
    bne 2f
    movs r0, #0
2:  movs r5, r0                         @ the spot % 447
    movs r4, #0                         @ the seed
3:  ldr r0, r_iso_mul
    muls r0, r4
    ldr r1, r_iso_add
    adds r0, r0, r1
    lsrs r0, r0, #16
    movs r1, r6
    svc #6                              @ Div: r1 = r0 % 447
    cmp r1, r5
    beq 4f
    adds r4, #1
    lsrs r0, r4, #16
    beq 3b
    b 8f
4:  ldr r0, r_sb1_ptr
    ldr r0, [r0]
    ldr r1, r_trend_rand
    strh r4, [r0, r1]
8:  ldr r0, [sp, #8]
    ldr r3, r_destroy_task
    bl r_call_r3
    add sp, #12
    pop {r4, r5, r6, pc}

r_call_r3:
    bx r3

    .align 2
r_state:         .word STATE
r_main:          .word MAIN
r_tasks:         .word TASKS
r_task_fishing:  .word TASK_FISHING
r_sb1_ptr:       .word SB1_PTR
r_route_119:     .word ROUTE_119
r_spot_task:     .word RESIDENT + (spot_task - resident) + 1
r_create_task:   .word CREATE_TASK
r_destroy_task:  .word DESTROY_TASK
r_front:         .word FRONT_OF_PLAYER
r_feebas_spot:   .word FEEBAS_SPOT
r_fishing_spots: .word FISHING_SPOTS
r_iso_mul:       .word 1103515245
r_iso_add:       .word 12345
r_trend_rand:    .word TREND_RAND
resident_end:
