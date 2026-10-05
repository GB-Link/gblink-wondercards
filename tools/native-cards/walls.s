@ Walk Through Walls. `install` starts a V-blank hook that clears the
@ collision bits of the map tiles around the player every frame, so walls,
@ trees, rocks and counters stop the player no longer; people still do, and
@ ledges, water and height changes work as before. It starts on; R in the
@ field turns it off and on again (a PC's sounds tell which). The map is the
@ game's own copy in RAM: turning it off builds the map again as entering it
@ does (InitMap, which runs its on-load script too) and redraws it, so every
@ wall is back at once. Not in the Union Room, nor in a link room
@ (their field has another callback1); not while FireRed/LeafGreen play back
@ "Previously on your quest", where R no longer opens the Help menu either
@ (L still does). The hook is copied to RESIDENT like the others, so it lasts
@ until the game is reset; `uninstall` turns it off and gives R back to the
@ Help menu.
@
@ Parameters (--defsym): INTR_VBLANK, MAIN, PLAYER_AVATAR, OBJECT_EVENTS,
@ CONTROLS_LOCKED (sLockFieldControls), SCRIPT_STATUS
@ (sGlobalScriptContextStatus), HELP_R_DISABLE and QUEST_LOG_STATE (0 if
@ none), CB1_OVERWORLD, CB2_OVERWORLD, IN_UNION_ROOM, SETUP_SCRIPT,
@ GET_METATILE_ID, SET_METATILE_ID, INIT_MAP, DRAW_WHOLE_MAP_VIEW, EMERALD and
@ STATE.

    .syntax unified
    .thumb
    .text
    .align 2

    .equ RESIDENT, 0x0203FC00           @ unused RAM in both games
    .equ ENABLED, 0                     @ STATE: u8, the hook is on
    .equ THROUGH, 1                     @ u8, walls are walked through
    .equ KEPT, 4                        @ the V-blank handler the hook calls
    .equ MAIN_CALLBACK1, 0
    .equ MAIN_CALLBACK2, 4
    .equ MAIN_INTR_CHECK, 0x1C
    .equ MAIN_NEW_KEYS, 0x2E
    .equ BUTTON_R_BIT, 8
    .equ AVATAR_OBJECT_ID, 5            @ in gPlayerAvatar
    .equ TILE_TRANSITION_STATE, 3       @ 0 while standing still
    .equ OBJECT_EVENT_SIZE, 0x24
    .equ CURRENT_COORDS, 0x10           @ in struct ObjectEvent: s16 x, y
    .equ REACH, 2                       @ tiles cleared each way
    .equ CONTEXT_SHUTDOWN, 2
    .equ QL_STATE_PLAYBACK, 2           @ and 3, its last scene
    .equ SE_PC_OFF, 3
    .equ SE_PC_ON, 4
    .equ IME, 0x04000208

install:
    push {r4, r5, r6, lr}
    ldr r3, p_ime
    ldrh r6, [r3]
    movs r0, #0
    strh r0, [r3]                       @ no interrupts while the hook changes
    ldr r5, p_resident
    adr r4, resident
    movs r0, #(resident_end - resident) / 4
    lsls r0, r0, #2
1:  subs r0, #4
    ldr r1, [r4, r0]
    str r1, [r5, r0]
    bne 1b
    ldr r4, p_state
    movs r0, #1
    strb r0, [r4, #ENABLED]
    strb r0, [r4, #THROUGH]
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
    strb r1, [r0, #THROUGH]
.if EMERALD == 0
    ldr r0, p_help_r_disable
    strb r1, [r0]
.endif
    bx lr

    .align 2
.if EMERALD == 0
p_help_r_disable: .word HELP_R_DISABLE
.endif
p_ime:            .word IME
p_resident:       .word RESIDENT
p_state:          .word STATE
p_intr_vblank:    .word INTR_VBLANK

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
.if EMERALD == 0
    ldr r0, r_help_r_disable
    movs r1, #1
    strb r1, [r0]
.endif
    ldr r0, [r7, #MAIN_CALLBACK1]
    ldr r1, r_cb1_overworld
    cmp r0, r1
    bne 9f
    ldr r0, [r7, #MAIN_CALLBACK2]
    ldr r1, r_cb2_overworld
    cmp r0, r1
    bne 9f
.if EMERALD == 0
    ldr r0, r_quest_log_state
    ldrb r0, [r0]
    cmp r0, #QL_STATE_PLAYBACK
    bcs 9f
.endif
    ldr r3, r_in_union_room
    bl r_call_r3
    cmp r0, #0
    bne 9f
    bl r_toggle
    ldrb r0, [r4, #THROUGH]
    cmp r0, #0
    beq 9f

    @ The tiles within REACH of the player's: their ids written back without
    @ the collision bits (MapGridSetMetatileIdAt keeps the elevation).
    ldr r0, r_player_avatar
    ldrb r0, [r0, #AVATAR_OBJECT_ID]
    movs r1, #OBJECT_EVENT_SIZE
    muls r0, r1
    ldr r1, r_object_events
    adds r0, r0, r1
    movs r1, #CURRENT_COORDS
    ldrsh r6, [r0, r1]
    adds r1, #2
    ldrsh r5, [r0, r1]
    subs r6, #REACH                     @ r6: the first column
    adds r7, r5, #REACH                 @ r7: the last row
    subs r5, #REACH                     @ r5: the row
2:  movs r4, r6                         @ r4: the column
3:  movs r0, r4
    movs r1, r5
    ldr r3, r_get_metatile_id
    bl r_call_r3
    movs r2, r0
    movs r0, r4
    movs r1, r5
    ldr r3, r_set_metatile_id
    bl r_call_r3
    adds r4, #1
    adds r0, r6, #2 * REACH
    cmp r4, r0
    ble 3b
    adds r5, #1
    cmp r5, r7
    ble 2b
    ldr r4, r_state
9:  ldr r3, [r4, #KEPT]
    bl r_call_r3
    pop {r4, r5, r6, r7}
    pop {r0}
    bx r0

r_call_r3:
    bx r3

@ R just pressed with the player standing still, controls free and no
@ script running: the walls switch, told by a sound. r4 holds STATE, r7 gMain.
r_toggle:
    push {lr}
    ldrh r0, [r7, #MAIN_NEW_KEYS]
    lsrs r0, r0, #BUTTON_R_BIT + 1
    bcc 8f                              @ R not just pressed
    ldr r0, r_controls_locked
    ldrb r0, [r0]
    cmp r0, #0
    bne 8f
    ldr r0, r_script_status
    ldrb r0, [r0]
    cmp r0, #CONTEXT_SHUTDOWN
    bne 8f
    ldr r0, r_player_avatar
    ldrb r0, [r0, #TILE_TRANSITION_STATE]
    cmp r0, #0
    bne 8f
    ldrb r0, [r4, #THROUGH]
    movs r1, #1
    eors r0, r1
    strb r0, [r4, #THROUGH]
    ldr r1, r_on_script
    cmp r0, #0
    bne 7f
    ldr r1, r_off_script
7:  movs r0, r1
    ldr r3, r_setup_script
    bl r_call_r3
8:  pop {r0}
    bx r0

    .align 2
r_state:           .word STATE
r_main:            .word MAIN
.if EMERALD == 0
r_help_r_disable:  .word HELP_R_DISABLE
r_quest_log_state: .word QUEST_LOG_STATE
.endif
r_cb1_overworld:   .word CB1_OVERWORLD
r_cb2_overworld:   .word CB2_OVERWORLD
r_controls_locked: .word CONTROLS_LOCKED
r_script_status:   .word SCRIPT_STATUS
r_player_avatar:   .word PLAYER_AVATAR
r_object_events:   .word OBJECT_EVENTS
r_in_union_room:   .word IN_UNION_ROOM
r_setup_script:    .word SETUP_SCRIPT
r_get_metatile_id: .word GET_METATILE_ID
r_set_metatile_id: .word SET_METATILE_ID
r_on_script:       .word RESIDENT + (on_script - resident)
r_off_script:      .word RESIDENT + (off_script - resident)
on_script:
    .byte 0x2F, SE_PC_ON, 0             @ playse
    .byte 0x02                          @ end
off_script:
    .byte 0x23                          @ callnative: the map as it was built
    .4byte INIT_MAP
    .byte 0x23                          @ callnative: and on screen
    .4byte DRAW_WHOLE_MAP_VIEW
    .byte 0x2F, SE_PC_OFF, 0            @ playse
    .byte 0x02                          @ end
    .align 2
resident_end:
