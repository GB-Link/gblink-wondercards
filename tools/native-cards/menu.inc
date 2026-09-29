@ `menu` shows the game's multichoice box at the top right, r2 tiles wide,
@ with r1 items (up to 8) named by the string pointers at r0, and leaves the
@ choice to the game's input task: after `waitstate` the script finds the
@ item's index in VAR_RESULT, or 127 for B. The box is built the way
@ DrawMultichoiceMenu (Emerald) and DrawVerticalMultichoiceMenu
@ (FireRed/LeafGreen) build theirs, with the item list at MENU_LIST.
@
@ Parameters (--defsym): EMERALD (1 on Emerald), SPECIAL_VAR_RESULT,
@ MENU_LIST (room for 8 MenuActions), CREATE_WINDOW_FROM_RECT, WINDOW_BORDER,
@ PRINT_MENU_ITEMS (PrintMenuTable / MultichoiceList_PrintItems),
@ INIT_MENU_CURSOR, MULTICHOICE_TASK (InitMultichoiceCheckWrap /
@ CreateMCMenuInputHandlerTask) and SCHEDULE_BG_COPY.

    .equ MENU_RIGHT, 28                 @ the box ends at this column
    .equ MENU_ID, 2                     @ a multichoice id with no extras
    .equ FONT_NORMAL_FRLG, 2

menu:
    push {r4, r5, r6, r7, lr}
    sub sp, #20
    movs r5, r1                         @ how many
    movs r7, r2                         @ the width
    ldr r6, menu_list
    movs r3, #0
1:  ldmia r0!, {r1}
    movs r2, #0
    stmia r6!, {r1, r2}                 @ MenuAction: text, func
    adds r3, #1
    cmp r3, r5
    bne 1b
    ldr r6, menu_list
    movs r0, #MENU_RIGHT
    subs r0, r0, r7
    movs r1, #0                         @ the top row
    movs r2, r7
.if EMERALD
    lsls r3, r5, #1                     @ two rows an item
.else
    adr r3, menu_heights
    subs r4, r5, #1
    ldrb r3, [r3, r4]
.endif
    ldr r4, menu_create_window
    bl menu_call
    movs r7, r0                         @ the window
    movs r1, #0
    ldr r4, menu_border
    bl menu_call
.if EMERALD
    movs r0, r7
    movs r1, r5
    movs r2, r6
    ldr r4, menu_print
    bl menu_call
    movs r0, r7
    movs r1, r5
    movs r2, #0
    ldr r4, menu_cursor
    bl menu_call
    movs r0, #0
    ldr r4, menu_copy
    bl menu_call
.else
    movs r1, #14                        @ MultichoiceList_PrintItems(window, font,
    str r1, [sp, #0]                    @ 8, 2, 14, count, list, 0, 2)
    str r5, [sp, #4]
    str r6, [sp, #8]
    movs r1, #0
    str r1, [sp, #12]
    movs r1, #2
    str r1, [sp, #16]
    movs r0, r7
    movs r2, #8
    movs r3, #2
    ldr r4, menu_print
    bl menu_call
    movs r1, #14                        @ Menu_InitCursor(window, font, 0, 2, 14,
    str r1, [sp, #0]                    @ count, 0)
    str r5, [sp, #4]
    movs r1, #0
    str r1, [sp, #8]
    movs r0, r7
    movs r1, #FONT_NORMAL_FRLG
    movs r2, #0
    movs r3, #2
    ldr r4, menu_cursor
    bl menu_call
.endif
    movs r0, #0                         @ B cancels
    movs r1, r5
    movs r2, r7
    movs r3, #MENU_ID
    ldr r4, menu_task
    bl menu_call
.if EMERALD == 0
    movs r0, #0
    ldr r4, menu_copy
    bl menu_call
.endif
    ldr r0, menu_result
    movs r1, #0xFF
    strh r1, [r0]
    add sp, #20
    pop {r4, r5, r6, r7, pc}

menu_call:
    bx r4

    .align 2
menu_list:          .word MENU_LIST
menu_result:        .word SPECIAL_VAR_RESULT
menu_create_window: .word CREATE_WINDOW_FROM_RECT
menu_border:        .word WINDOW_BORDER
menu_print:         .word PRINT_MENU_ITEMS
menu_cursor:        .word INIT_MENU_CURSOR
menu_task:          .word MULTICHOICE_TASK
menu_copy:          .word SCHEDULE_BG_COPY
.if EMERALD == 0
menu_heights:       .byte 2, 4, 6, 7, 9, 11, 13, 14   @ GetMCWindowHeight for 1-8 items
.endif
    .align 2
