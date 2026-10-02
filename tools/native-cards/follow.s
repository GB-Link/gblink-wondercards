@ Pokémon Follow: a V-blank hook that walks the lead party Pokémon behind the
@ player, for the species the game has an overworld sprite of (the tables
@ below: FireRed and LeafGreen's turn to face where they go; Emerald's
@ Poochyena, Kirlia, Dusclops, Mew and Zigzagoon also walk).
@
@ While CB2_Overworld runs and the game waits for V-blank, the hook keeps one
@ object event of local id FOLLOW_ID, spawned with the lead's sprite on the
@ player's tile and hidden until the player's first step (a new map loads a
@ fresh set of object events, so it comes back after each warp, and a new lead
@ gets a new one). When the player's coordinates change, the player has begun
@ a step from the tile it left: the follower walks onto that tile with the
@ player's own movement action turned its way (walk, slide; a run becomes a
@ fast walk), a ledge's jump becoming a walk to its edge; two tiles away in a
@ line it jumps (the ledge one step back), farther it is moved straight
@ there. Its current elevation is kept at NO_ELEVATION, which matches no
@ tile's, so nothing collides with it or talks to it: the player, people and
@ trainers' sight go through, while its sprite keeps the priority of its
@ previous elevation. Biking, surfing and diving hide it on the player's tile.
@ A pressed in the field facing it (the game finds nothing there to talk to)
@ runs `talk_script`: it turns to the player and cries.
@
@ `install` copies `resident`..`resident_end` to RESIDENT like the other hooks
@ (only one card's hook can run between resets) and points the V-blank
@ interrupt at the copy; it lasts until the game is reset.
@
@ Parameters (--defsym): INTR_VBLANK, MAIN, CB2_OVERWORLD, PARTY,
@ PLAYER_AVATAR, OBJECT_EVENTS, GET_MON_DATA, SPAWN_OBJECT, SET_HELD_MOVEMENT,
@ CLEAR_HELD_MOVEMENT, MOVE_OBJECT_TO, REMOVE_OBJECT, CB1_OVERWORLD,
@ CONTROLS_LOCKED, SELECTED_OBJECT, SETUP_SCRIPT, QUEST_LOG_STATE (0 if none),
@ EMERALD and STATE.

    .syntax unified
    .thumb
    .text
    .align 2

    .equ RESIDENT, 0x0203FC00           @ unused RAM in both games
    .equ ENABLED, 0                     @ STATE: u8
    .equ OBJECT, 1                      @ u8, the follower's object event, or NONE
    .equ GRAPHICS, 2                    @ u8, its sprite
    .equ PENDING, 3                     @ u8, 1 while a step waits to be taken
    .equ PLAYER_XY, 4                   @ s16 × 2, the player's coordinates last seen
    .equ TARGET_XY, 8                   @ s16 × 2, the tile the follower goes to
    .equ FAMILY, 12                     @ u8, the player's movement action, facing down
    .equ SPECIES, 14                    @ u16, the lead's
    .equ KEPT, 16                       @ the V-blank handler the hook calls
    .equ NONE, 0xFF
    .equ FOLLOW_ID, 0xF0                @ a local id no map uses
    .equ NO_ELEVATION, 14
    .equ MAIN_CALLBACK2, 4
    .equ MAIN_INTR_CHECK, 0x1C
    .equ MAIN_NEW_KEYS, 0x2E
    .equ QL_STATE_PLAYBACK, 2           @ and 3, its last scene
    .equ AVATAR_OBJECT, 5               @ in gPlayerAvatar
    .equ AVATAR_RIDING, 0x1E            @ its flags: either bike, surfing, underwater
    .equ OBJ_SIZE, 0x24                 @ struct ObjectEvent
    .equ OBJ_FLAGS, 0                   @ bit 0 active, 6 heldMovementActive, 7 finished
    .equ OBJ_FLAGS_1, 1                 @ bit 5 invisible
    .equ OBJ_GRAPHICS, 5
    .equ OBJ_LOCAL_ID, 8
    .equ OBJ_ELEVATION, 0x0B            @ current in the low 4 bits, previous in the high
    .equ OBJ_CURRENT, 0x10              @ s16 x, y
    .equ OBJ_PREVIOUS, 0x14
    .equ OBJ_DIRECTION, 0x18            @ movement direction in the high 4 bits
    .equ OBJ_ACTION, 0x1C
    .equ INVISIBLE_BIT, 5
    .equ MON_DATA_SPECIES_OR_EGG, 65
    .equ OBJECT_EVENTS_COUNT, 16
.if EMERALD
    .equ WALK_NORMAL, 0x08              @ MOVEMENT_ACTION_WALK_NORMAL_DOWN
    .equ JUMP_2, 0x0C                   @ MOVEMENT_ACTION_JUMP_2_DOWN
    .equ WALK_FAST, 0x15                @ MOVEMENT_ACTION_WALK_FAST_DOWN
    .equ PLAYER_RUN, 0x35               @ MOVEMENT_ACTION_PLAYER_RUN_DOWN
.else
    .equ WALK_NORMAL, 0x10
    .equ JUMP_2, 0x14
    .equ WALK_FAST, 0x1D
    .equ PLAYER_RUN, 0x3D
.endif
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
    ldr r0, p_initial                   @ on, no object, no sprite, nothing pending
    str r0, [r4, #ENABLED]
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

    .align 2
p_ime:           .word IME
p_resident:      .word RESIDENT
p_resident_size: .word resident_end - resident
p_state:         .word STATE
p_initial:       .word 1 | NONE << 8
p_intr_vblank:   .word INTR_VBLANK

@ ---- copied to RESIDENT
    .align 2
resident:
    push {r4, r5, r6, r7, lr}
    ldr r4, r_state
    ldrb r0, [r4, #ENABLED]
    cmp r0, #0
    beq 9f
    ldr r0, r_main
    ldrh r1, [r0, #MAIN_INTR_CHECK]
    lsls r1, r1, #31
    bne 9f                              @ the game is mid-frame
    ldr r0, [r0, #MAIN_CALLBACK2]
    ldr r1, r_cb2_overworld
    cmp r0, r1
    bne 9f
    bl follow
    bl talk
9:  ldr r3, [r4, #KEPT]
    bl call_r3
    pop {r4, r5, r6, r7}
    pop {r0}
    bx r0

call_r3:
    bx r3

@ r4 = STATE. r5 = the player's object event, r6 = the follower's.
follow:
    push {lr}
    ldr r0, r_player_avatar
    ldrb r0, [r0, #AVATAR_OBJECT]
    movs r1, #OBJ_SIZE
    muls r0, r1
    ldr r5, r_object_events
    adds r5, r5, r0
    bl lead_graphics                    @ r0 = the sprite, 0 if none
    ldrb r1, [r4, #OBJECT]
    cmp r1, #NONE
    beq 2f
    movs r2, #OBJ_SIZE
    muls r1, r2
    ldr r6, r_object_events
    adds r6, r6, r1
    ldrb r1, [r6, #OBJ_FLAGS]
    lsls r1, r1, #31
    beq 1f                              @ a new map's object events
    ldrb r1, [r6, #OBJ_LOCAL_ID]
    cmp r1, #FOLLOW_ID
    bne 1f
    ldrb r1, [r6, #OBJ_GRAPHICS]
    cmp r1, r0
    beq 4f                              @ still ours, still the lead
    push {r0}
    movs r0, r6
    ldr r3, r_remove_object
    bl call_r3
    pop {r0}
1:  movs r1, #NONE
    strb r1, [r4, #OBJECT]
2:  strb r0, [r4, #GRAPHICS]
    cmp r0, #0
    bne 3f
    b 9f
@ A new follower on the player's tile, hidden until the first step.
3:
    sub sp, #8
    ldrb r1, [r5, #OBJ_ELEVATION]
    lsls r1, r1, #28
    lsrs r1, r1, #28
    str r1, [sp, #4]                    @ elevation
    ldrh r1, [r5, #OBJ_CURRENT + 2]
    str r1, [sp]                        @ y
    ldrh r3, [r5, #OBJ_CURRENT]         @ x
    movs r1, #0                         @ MOVEMENT_TYPE_NONE
    movs r2, #FOLLOW_ID
    ldr r7, r_spawn_object
    bl call_r7
    add sp, #8
    cmp r0, #OBJECT_EVENTS_COUNT
    bcs 9f                              @ no room for one
    strb r0, [r4, #OBJECT]
    movs r1, #OBJ_SIZE
    muls r0, r1
    ldr r6, r_object_events
    adds r6, r6, r0
    bl hide
    ldr r0, [r5, #OBJ_CURRENT]
    str r0, [r4, #PLAYER_XY]
    movs r0, #0
    strb r0, [r4, #PENDING]
4:  ldrb r0, [r6, #OBJ_ELEVATION]       @ nothing collides with it
    lsrs r0, r0, #4
    lsls r0, r0, #4
    adds r0, #NO_ELEVATION
    strb r0, [r6, #OBJ_ELEVATION]
    ldr r0, r_player_avatar
    ldrb r0, [r0]
    movs r1, #AVATAR_RIDING
    tst r0, r1
    beq 5f
@ Riding or surfing: hidden on the player's tile.
    bl hide
    ldr r1, [r5, #OBJ_CURRENT]
    str r1, [r4, #PLAYER_XY]
    ldr r0, [r6, #OBJ_CURRENT]
    cmp r0, r1
    beq 9f
    movs r0, #0
    strb r0, [r4, #PENDING]
    ldrh r1, [r5, #OBJ_CURRENT]
    ldrh r2, [r5, #OBJ_CURRENT + 2]
    b move_to
5:  ldr r0, [r5, #OBJ_CURRENT]
    ldr r1, [r4, #PLAYER_XY]
    cmp r0, r1
    beq 6f
@ The player has begun a step: the follower goes where it was.
    str r0, [r4, #PLAYER_XY]
    ldrb r0, [r5, #OBJ_DIRECTION]
    lsrs r0, r0, #4
    ldrb r1, [r5, #OBJ_ACTION]
    adds r1, #1
    subs r1, r1, r0                     @ its action's down
    cmp r1, #JUMP_2
    bne 7f
@ A ledge's jump moves the player's coordinates twice, onto the ledge and
@ halfway past it; the follower, on its way to the edge by then, keeps going
@ there and jumps after the player's next step.
    ldrb r0, [r6, #OBJ_FLAGS]
    lsrs r2, r0, #7
    bne 10f                             @ its last step finished
    lsls r0, r0, #25
    bmi 6f                              @ still on its way
10: movs r1, #WALK_NORMAL
7:  cmp r1, #PLAYER_RUN
    bne 11f
@ The player's run takes the player's running frames, which a Pokémon's
@ sprite lacks; walking fast is the same speed with its walking frames.
    movs r1, #WALK_FAST
11: strb r1, [r4, #FAMILY]
    ldr r0, [r5, #OBJ_PREVIOUS]
    str r0, [r4, #TARGET_XY]
    movs r0, #1
    strb r0, [r4, #PENDING]
6:  ldrb r0, [r4, #PENDING]
    cmp r0, #0
    beq 9f
    ldrb r0, [r6, #OBJ_FLAGS]
    lsrs r1, r0, #7                     @ finished
    bne 8f
    lsls r0, r0, #25
    bmi 9f                              @ still moving
8:  movs r0, r6
    ldr r3, r_clear_held_movement
    bl call_r3
    movs r0, #0
    strb r0, [r4, #PENDING]
    ldrh r1, [r4, #TARGET_XY]
    ldrh r2, [r4, #TARGET_XY + 2]
    ldrh r0, [r6, #OBJ_CURRENT]
    subs r0, r1, r0                     @ dx (map coordinates are never negative)
    ldrh r3, [r6, #OBJ_CURRENT + 2]
    subs r3, r2, r3                     @ dy
    ldrb r7, [r4, #FAMILY]
    movs r1, #3                         @ RIGHT
    cmp r0, #1
    beq 3f
    cmp r0, #2
    beq 2f
    movs r1, #2                         @ LEFT
    adds r0, #1
    beq 3f
    adds r0, #1
    beq 2f
    cmp r0, #2
    bne 1f                              @ off in x too: straight there
    movs r1, #0                         @ DOWN
    cmp r3, #1
    beq 3f
    cmp r3, #2
    beq 2f
    movs r1, #1                         @ UP
    adds r3, #1
    beq 3f
    adds r3, #1
    beq 2f
    cmp r3, #2
    beq 4f                              @ already there: just seen
1:  ldrh r1, [r4, #TARGET_XY]
    ldrh r2, [r4, #TARGET_XY + 2]
    b move_to
2:  movs r7, #JUMP_2
3:  adds r1, r7, r1                     @ two in a line: down a ledge; one: a step
    movs r0, r6
    ldr r3, r_set_held_movement
    bl call_r3
4:  ldrb r0, [r6, #OBJ_FLAGS_1]         @ seen from the first step on
    movs r1, #1 << INVISIBLE_BIT
    bics r0, r1
    strb r0, [r6, #OBJ_FLAGS_1]
9:  pop {pc}

@ The follower at (r1, r2), where the next steps start from; returns from
@ follow.
move_to:
    movs r0, r6
    ldr r3, r_move_object_to
    bl call_r3
    pop {pc}

hide:
    ldrb r0, [r6, #OBJ_FLAGS_1]
    movs r1, #1 << INVISIBLE_BIT
    orrs r0, r1
    strb r0, [r6, #OBJ_FLAGS_1]
    bx lr

call_r7:
    bx r7

@ A just pressed in the field, facing the follower: r4 = STATE, and as
@ `follow` left them, r5 = the player's object event, r6 = the follower's.
talk:
    push {lr}
    ldr r0, r_main
    ldrh r1, [r0, #MAIN_NEW_KEYS]
    lsrs r1, r1, #1
    bcc 9f
    ldr r0, [r0]
    ldr r1, r_cb2_overworld
    subs r1, #CB2_OVERWORLD - CB1_OVERWORLD
    cmp r0, r1
    bne 9f                              @ a link room's field, or not the field
    ldr r0, r_controls_locked
    ldrb r0, [r0]
    cmp r0, #0
    bne 9f                              @ a menu, or a script the A started
.if EMERALD == 0
    ldr r0, r_quest_log_state
    ldrb r0, [r0]
    cmp r0, #QL_STATE_PLAYBACK
    bcs 9f
.endif
    ldrb r1, [r4, #OBJECT]
    cmp r1, #NONE
    beq 9f
@ The tile in front of the player: facing 1 south, 2 north, 3 west, 4 east.
    ldrb r2, [r5, #OBJ_DIRECTION]
    lsls r2, r2, #28
    lsrs r2, r2, #27                    @ twice the facing
    cmp r2, #4
    bhi 1f
    movs r0, #3
    subs r0, r0, r2
    lsls r0, r0, #16                    @ y + 1 or y - 1
    b 2f
1:  subs r0, r2, #7                     @ x - 1 or x + 1
2:  ldr r2, [r5, #OBJ_CURRENT]
    adds r0, r0, r2
    ldr r2, [r6, #OBJ_CURRENT]
    cmp r0, r2
    bne 9f
    ldr r0, r_selected_object           @ faceplayer turns it
    strb r1, [r0]
    movs r0, r6
    ldr r3, r_clear_held_movement
    bl call_r3
    ldr r0, r_talk_script
    ldrh r1, [r4, #SPECIES]
    strh r1, [r0, #2]
    ldr r3, r_setup_script
    bl call_r3
9:  pop {pc}

@ r0 = the sprite of the lead party Pokémon's species, 0 if it has none.
lead_graphics:
    push {lr}
    ldr r0, r_party
    movs r1, #MON_DATA_SPECIES_OR_EGG
    ldr r3, r_get_mon_data
    bl call_r3
    strh r0, [r4, #SPECIES]
    adr r1, follow_species
    movs r2, #0
1:  ldrh r3, [r1, r2]
    adds r2, #2
    cmp r3, #0
    beq 2f                              @ the 0 after the sprites
    cmp r3, r0
    bne 1b
2:  lsrs r2, r2, #1
    adds r1, #follow_graphics - 1 - follow_species
    ldrb r0, [r1, r2]
    pop {pc}

    .align 2
r_state:               .word STATE
r_main:                .word MAIN
r_cb2_overworld:       .word CB2_OVERWORLD
r_party:               .word PARTY
r_player_avatar:       .word PLAYER_AVATAR
r_object_events:       .word OBJECT_EVENTS
r_get_mon_data:        .word GET_MON_DATA
r_spawn_object:        .word SPAWN_OBJECT
r_set_held_movement:   .word SET_HELD_MOVEMENT
r_clear_held_movement: .word CLEAR_HELD_MOVEMENT
r_move_object_to:      .word MOVE_OBJECT_TO
r_remove_object:       .word REMOVE_OBJECT
r_controls_locked:     .word CONTROLS_LOCKED
.if EMERALD == 0
r_quest_log_state:     .word QUEST_LOG_STATE
.endif
r_selected_object:     .word SELECTED_OBJECT
r_setup_script:        .word SETUP_SCRIPT
r_talk_script:         .word RESIDENT + (talk_script - resident)

@ playmoncry's species is written in before it runs.
talk_script:
    .byte 0x5A                          @ faceplayer
    .byte 0xA1                          @ playmoncry species, CRY_MODE_NORMAL
    .2byte 0, 0
    .byte 0xC5                          @ waitmoncry
    .byte 0x02                          @ end

@ The species with an overworld sprite that turns or walks, and those sprites.
follow_species:
.if EMERALD
    .2byte 286, 393, 362, 151, 288, 309, 315, 317, 25, 184, 350, 185, 0
    .align 2
follow_graphics:
    .byte 220, 225, 226, 229, 98, 211, 203, 204, 209, 210, 214, 228, 0
.else
    .2byte 25, 35, 39, 40, 52, 54, 79, 80, 86, 66, 67, 62, 100
    .2byte 16, 18, 21, 22, 84, 104, 113, 115, 131, 140, 29, 32, 33, 0
    .align 2
follow_graphics:
    .byte 120, 113, 115, 131, 125, 121, 128, 129, 126, 130, 134, 112, 127
    .byte 116, 114, 110, 133, 132, 111, 117, 119, 135, 147, 122, 123, 124, 0
.endif
    .align 2
resident_end:
