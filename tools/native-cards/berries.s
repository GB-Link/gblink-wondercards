@ Berry Garden (Emerald). `ripen` makes every growing berry tree in SaveBlock1
@ ready to pick: watered all four times, for the biggest crop, grown with the
@ game's BerryTreeGrow up to the berries stage, where it works out the crop,
@ and given that berry's full stage time before the berries fall. Trees the
@ game has stopped are left alone. VAR_RESULT = the trees ripened.
@
@ Parameters (--defsym): SB1_PTR, SPECIAL_VAR_RESULT, BERRY_TREE_GROW,
@ BERRY_STAGE_DURATION (GetStageDurationByBerryType).

    .syntax unified
    .thumb
    .text
    .align 2

    .equ BERRY_TREES, 0x169C            @ in SaveBlock1: 128 trees, 8 bytes each
    .equ TREE_COUNT, 128
    .equ TREE_SIZE, 8
    .equ TREE_BERRY, 0
    .equ TREE_STAGE, 1                  @ stage:7, stopGrowth:1
    .equ TREE_MINUTES, 2
    .equ TREE_WATERED, 5                @ regrowthCount:4, watered1-4
    .equ ALL_WATERED, 0xF0
    .equ STAGE_BERRIES, 5

ripen:
    push {r4, r5, r6, lr}
    ldr r4, p_sb1_ptr
    ldr r4, [r4]
    ldr r0, p_berry_trees
    adds r4, r4, r0
    movs r5, #TREE_COUNT
    movs r6, #0
1:  ldrb r0, [r4, #TREE_BERRY]
    cmp r0, #0
    beq 3f
    ldrb r0, [r4, #TREE_STAGE]
    subs r0, #1
    cmp r0, #STAGE_BERRIES - 1
    bcs 3f                              @ bare, ripe already, or stopped
    ldrb r0, [r4, #TREE_WATERED]
    movs r1, #ALL_WATERED
    orrs r0, r1
    strb r0, [r4, #TREE_WATERED]
2:  movs r0, r4
    ldr r3, p_grow
    bl call_r3
    ldrb r0, [r4, #TREE_STAGE]
    cmp r0, #STAGE_BERRIES
    bne 2b
    ldrb r0, [r4, #TREE_BERRY]
    ldr r3, p_stage_duration
    bl call_r3
    strh r0, [r4, #TREE_MINUTES]
    adds r6, #1
3:  adds r4, #TREE_SIZE
    subs r5, #1
    bne 1b
    ldr r0, p_var_result
    strh r6, [r0]
    pop {r4, r5, r6, pc}

call_r3:
    bx r3

    .align 2
p_sb1_ptr:        .word SB1_PTR
p_berry_trees:    .word BERRY_TREES
p_var_result:     .word SPECIAL_VAR_RESULT
p_grow:           .word BERRY_TREE_GROW
p_stage_duration: .word BERRY_STAGE_DURATION
