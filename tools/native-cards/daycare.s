@ Instant Day Care Egg. `daycare_egg` has the game's TriggerPendingDaycareEgg
@ make the Day Care's Egg ready now when its two Pokémon can have one
@ (GetDaycareCompatibilityScore above 0). VAR_RESULT = 1 when it did, else 0.
@
@ Parameters (--defsym): SB1_PTR, DAYCARE (its offset in SaveBlock1),
@ SPECIAL_VAR_RESULT, DAYCARE_COMPATIBILITY, TRIGGER_DAYCARE_EGG.

    .syntax unified
    .thumb
    .text
    .align 2

daycare_egg:
    push {lr}
    ldr r0, p_sb1_ptr
    ldr r0, [r0]
    ldr r1, p_daycare
    adds r0, r0, r1
    ldr r3, p_compatibility
    bl call_r3
    cmp r0, #0
    beq 1f
    ldr r3, p_trigger_egg
    bl call_r3
    movs r0, #1
1:  ldr r1, p_var_result
    strh r0, [r1]
    pop {pc}

call_r3:
    bx r3

    .align 2
p_sb1_ptr:       .word SB1_PTR
p_daycare:       .word DAYCARE
p_var_result:    .word SPECIAL_VAR_RESULT
p_compatibility: .word DAYCARE_COMPATIBILITY
p_trigger_egg:   .word TRIGGER_DAYCARE_EGG
