@ A New Day (Emerald). `new_day` does what Emerald does when its clock starts
@ a new day, as if one day had passed: the daily flags are cleared, and each
@ daily update in `daily` runs for 1 day (Dewford's trend, the TV shows, the
@ weather, the party's Pokérus, MIRAGE ISLAND, the professor, the Battle
@ Frontier's maniac and gambler, SHOAL CAVE's items and the Lottery number).
@ The BERRY trees then grow for a day's minutes. VAR_DAYS, which the clock's
@ days are counted against, stays as it is.
@
@ Parameters (--defsym): CLEAR_DAILY_FLAGS, UPDATE_DEWFORD_TREND,
@ UPDATE_TV_SHOWS, UPDATE_WEATHER, UPDATE_POKERUS, UPDATE_MIRAGE_RND,
@ UPDATE_BIRCH_STATE, UPDATE_FRONTIER_MANIAC, UPDATE_FRONTIER_GAMBLER,
@ SET_SHOAL_ITEM_FLAG, SET_LOTTERY_NUMBER and BERRY_TREE_TIME_UPDATE.

    .syntax unified
    .thumb
    .text
    .align 2

    .equ MINUTES_PER_DAY, 24 * 60

new_day:
    push {r4, r5, lr}
    adr r4, daily
    movs r5, #(daily_end - daily) / 4
1:  ldmia r4!, {r3}
    movs r0, #1                         @ days since the last update
    bl call_r3
    subs r5, #1
    bne 1b
    ldr r0, p_minutes
    ldr r3, p_berry_trees
    bl call_r3
    pop {r4, r5, pc}

call_r3:
    bx r3

    .align 2
p_minutes:     .word MINUTES_PER_DAY
p_berry_trees: .word BERRY_TREE_TIME_UPDATE
daily:
    .word CLEAR_DAILY_FLAGS, UPDATE_DEWFORD_TREND, UPDATE_TV_SHOWS, UPDATE_WEATHER
    .word UPDATE_POKERUS, UPDATE_MIRAGE_RND, UPDATE_BIRCH_STATE, UPDATE_FRONTIER_MANIAC
    .word UPDATE_FRONTIER_GAMBLER, SET_SHOAL_ITEM_FLAG, SET_LOTTERY_NUMBER
daily_end:
