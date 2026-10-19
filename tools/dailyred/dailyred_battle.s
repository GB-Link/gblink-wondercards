@ Daily Red stock-ROM battle payload (Thumb / ARMv4T).
@ Follows pret Task_BattleStart + CloseLink; refills enemy party after InitBattle.

    .syntax unified
    .thumb
    .text
    .global dailyred_entry
    .global mon_table
    .align 2
    .thumb_func
dailyred_entry:
    push    {r4-r7, lr}
    bl      .Lbuild_all
    @ CloseLink runs in task_battle right before init (not here).

    ldr     r1, =BATTLE_TYPE
    movs    r0, #0x0C                 @ TRAINER | IS_MASTER
    str     r0, [r1]
    ldr     r1, =TRAINER_BATTLE_OPPONENT_A
    ldr     r0, =TRAINER_OPPONENT_ID   @ FRLG: TRAINER_PLAYER_RED 514; Emerald: TRAINER_RED 851
    strh    r0, [r1]
    ldr     r0, =MAIN
    ldr     r1, =CB2_RETURN
    str     r1, [r0, #8]

    adr     r0, task_battle
    movs    r1, #1
    orrs    r0, r1
    ldr     r2, =CREATE_TASK
    mov     ip, r2
    movs    r1, #1
    bl      .Lbx_ip

    @ MUS_VS_CHAMPION — FRLG 299 / Emerald 478 (defsym MUS_BATTLE)
    ldr     r0, =MUS_BATTLE
    ldr     r1, =PLAY_MAP_BGM
    mov     ip, r1
    bl      .Lbx_ip

    ldr     r0, =SCRIPT_CONTEXT_STOP
    mov     ip, r0
    bl      .Lbx_ip
    pop     {r4-r7, pc}

.Lclose_link:
    push    {lr}
    ldr     r0, =CLOSE_LINK
    cmp     r0, #0
    beq     .Lcl_done
    mov     ip, r0
    bl      .Lbx_ip
.Lcl_done:
    pop     {pc}

    .align 2
    .thumb_func
task_battle:
    push    {r4-r5, lr}
    movs    r4, r0                    @ taskId
    movs    r0, #40
    muls    r0, r4
    ldr     r1, =TASKS
    adds    r0, r1
    movs    r5, #8
    adds    r5, r0                    @ data

    ldrh    r0, [r5]
    cmp     r0, #0
    beq     .Ls0
    cmp     r0, #1
    beq     .Ls1
    b       .Ltask_ret

.Ls0:
    movs    r0, #4                    @ POKEBALLS_TRAIL
    ldr     r1, =BATTLE_TRANSITION_START
    mov     ip, r1
    bl      .Lbx_ip
    movs    r0, #1
    strh    r0, [r5]
    b       .Ltask_ret

.Ls1:
    ldr     r0, =IS_BATTLE_TRANSITION_DONE
    mov     ip, r0
    bl      .Lbx_ip
    cmp     r0, #1
    bne     .Ltask_ret

    ldr     r0, =CLEANUP_OVERWORLD
    mov     ip, r0
    bl      .Lbx_ip
    bl      .Lclose_link

    ldr     r1, =BATTLE_TYPE
    movs    r0, #0x0C
    str     r0, [r1]

    adr     r0, cb2_init
    movs    r1, #1
    orrs    r0, r1
    ldr     r2, =SET_MAIN_CALLBACK2
    mov     ip, r2
    bl      .Lbx_ip
    @ InitBattle ResetTasks; no DestroyTask needed

.Ltask_ret:
    pop     {r4-r5, pc}

    .align 2
    .thumb_func
cb2_init:
    push    {lr}
    ldr     r0, =CB2_INIT_BATTLE
    mov     ip, r0
    bl      .Lbx_ip
    movs    r5, #6
    bl      .Lbuild_from
    pop     {pc}

@ Build all 12 mons; sets party count.
.Lbuild_all:
    push    {r4-r7, lr}
    movs    r5, #0
    bl      .Lbuild_from
    ldr     r0, =PARTY_COUNT
    movs    r1, #6
    strb    r1, [r0]
    pop     {r4-r7, pc}

@ In: r5 = start index. Builds through 11. Clobbers r4-r7.
.Lbuild_from:
    push    {lr}
    adr     r4, mon_table
.Lbf_loop:
    cmp     r5, #12
    bge     .Lbf_done
    bl      .Lbuild_one
    adds    r5, #1
    b       .Lbf_loop
.Lbf_done:
    pop     {pc}

@ In: r4=table, r5=index. r6=mon*, r7=rec*
.Lbuild_one:
    push    {lr}
    sub     sp, #20
    cmp     r5, #6
    bge     .Lbo_en
    ldr     r0, =PARTY
    movs    r1, #100
    muls    r1, r5
    adds    r6, r0, r1
    b       .Lbo_ok
.Lbo_en:
    ldr     r0, =ENEMY_PARTY
    movs    r1, r5
    subs    r1, #6
    movs    r2, #100
    muls    r1, r2
    adds    r6, r0, r1
.Lbo_ok:
    movs    r0, #22                   @ compact mon record
    muls    r0, r5
    adds    r7, r4, r0

    movs    r0, #0
    str     r0, [sp, #12]
    str     r0, [sp, #8]
    ldr     r0, [r7, #12]             @ personality
    str     r0, [sp, #4]
    movs    r0, #1
    str     r0, [sp]
    ldrh    r1, [r7]
    movs    r2, #100
    movs    r3, #31
    ldr     r0, =CREATE_MON
    mov     ip, r0
    adds    r0, r6, #0
    bl      .Lbx_ip

    adds    r0, r6, #0
    movs    r1, #12
    adds    r2, r7, #2
    ldr     r3, =SET_MON_DATA
    mov     ip, r3
    bl      .Lbx_ip

    movs    r3, #0
.Lbo_mv:
    cmp     r3, #4
    bge     .Lbo_mvd
    push    {r3}
    adds    r0, r6, #0
    lsls    r1, r3, #1
    adds    r1, #4
    ldrh    r1, [r7, r1]
    adds    r2, r3, #0
    ldr     r3, =SET_MON_MOVE_SLOT
    mov     ip, r3
    bl      .Lbx_ip
    pop     {r3}
    adds    r3, #1
    b       .Lbo_mv
.Lbo_mvd:

    movs    r3, #0
.Lbo_ev:
    cmp     r3, #6
    bge     .Lbo_evd
    push    {r3}
    adds    r0, r6, #0
    movs    r1, #26
    adds    r1, r1, r3
    adds    r2, r7, #0
    adds    r2, #16                   @ evs
    adds    r2, r2, r3
    ldr     r3, =SET_MON_DATA
    mov     ip, r3
    bl      .Lbx_ip
    pop     {r3}
    adds    r3, #1
    b       .Lbo_ev
.Lbo_evd:

    adds    r0, r6, #0
    ldr     r1, =CALCULATE_STATS
    mov     ip, r1
    bl      .Lbx_ip
    add     sp, #20
    pop     {pc}

.Lbx_ip:
    bx      ip

    .ltorg
    .align 2
mon_table:
    .space 264
