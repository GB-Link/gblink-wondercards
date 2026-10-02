// The GB-Link Team cards in the Japanese games: each English text of
// build.mjs (a Wonder Card's body as its four lines together) and its
// Japanese, in kana as the games write it, words apart. A message line fits
// 16 characters, which FireRed and LeafGreen's deliveryman can say on one;
// a card's title takes 18, its subtitle 13 and a body line 18.

export const JAPANESE = {
  // ---- every card
  'GB-Link Team': 'GB-Link Team',
  '': '',
  'This gift doesn’t work with\nthis version of the game.': 'この　おくりものは\nこの　ゲームでは　つかえません',
  'Come back any time!': 'また　いつでも　どうぞ！',
  'Stay healthy out there!': 'からだに　きを　つけてね！',
  'Take good care of it!': 'たいせつに　そだててね！',
  'It was sent to the PC.': 'パソコンに　てんそうされた！',
  'Your party and the PC are full!': 'てもちも　パソコンも\nいっぱいです！',
  'Would you like {STR_VAR_1}?': '{STR_VAR_1}に　しますか？',
  '{PLAYER} received {STR_VAR_1}!': '{PLAYER}は　{STR_VAR_1}を\nうけとった！',
  'Receive the card again for\nanother one!': 'カードを　もういちど　うけとると\nまた　もらえるよ！',

  // ---- speed cards (their cards are the originals')
  'HALF SPEED': 'スピード　０．５ばい',
  '0.75× SPEED': 'スピード　０．７５ばい',
  'DOUBLE SPEED': 'スピード　２ばい',
  'TRIPLE SPEED': 'スピード　３ばい',
  '4× SPEED': 'スピード　４ばい',
  'R turns it on and off!': 'Ｒで　オン・オフ！',
  'A special trick is waiting\njust for you!\nVisit the deliveryman on the\n2nd floor of a POKEMON CENTER.':
    'あなたに　とっておきの\nしかけを　とどけます！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Press R for double speed!\nPress R again to play normally.': 'Ｒを　おすと　２ばいそく！\nもう　いちど　おすと　もとどおり',
  'Press R for triple speed!\nPress R again to play normally.': 'Ｒを　おすと　３ばいそく！\nもう　いちど　おすと　もとどおり',
  'Press R to speed the game up!\nPress R again to play normally.': 'Ｒを　おすと　はやおくり！\nもう　いちど　おすと　もとどおり',
  'Press R to play at half speed!\nPress R again to play normally.': 'Ｒを　おすと　０．５ばいそく！\nもう　いちど　おすと　もとどおり',
  'Press R to play a little slower!\nPress R again to play normally.': 'Ｒを　おすと　すこし　ゆっくり！\nもう　いちど　おすと　もとどおり',

  // ---- new trainer name/gender
  'NEW TRAINER NAME/GENDER': 'トレーナーの　なまえと　せいべつ',
  'A new name, a new look!': 'あたらしい　じぶんに！',
  'New name? New look? Visit the\ndeliveryman on the 2nd floor\nof a POKéMON CENTER to rename\nor swap between BOY and GIRL.':
    'なまえを　かえたり　せいべつを\nいれかえたり　できるよ！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Would you like a new name?': 'あたらしい　なまえに　しますか？',
  'Nice to meet you, {PLAYER}!': '{PLAYER}さん！\nよろしく　おねがいします',
  'Shall I swap you between\nBOY and GIRL?': 'おとこのこと　おんなのこを\nいれかえますか？',
  'Ta-da! Talk to me again any\ntime to swap back.': 'じゃーん！\nもどすときも　はなしかけてね！',

  // ---- Pokérus
  'POKéRUS': 'ポケルス',
  'Achoo!': 'ハクション！',
  'A tiny virus that helps\nPOKéMON grow stronger. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'ポケモンを　つよく　そだてる\nちいさな　ウイルスです！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'POKéRUS is a tiny virus that\nhelps POKéMON grow stronger.¶Want your party POKéMON\nto catch it?':
    'ポケルスは　ポケモンを　つよく\nそだてる　ちいさな　ウイルスです¶てもちの　ポケモンに\nうつしますか？',
  'Achoo! Your party POKéMON\ncaught POKéRUS!': 'ハクション！　てもちの\nポケモンが　ポケルスに　なった！',

  // ---- instant eggs
  'INSTANT EGGS': 'すぐに　タマゴ',
  'Hatch now, or get one now': 'いますぐ　かえる・もらえる',
  'Hatch the EGGS you carry, or\nget the DAY CARE’s EGG right\naway. Visit the deliveryman\non 2F of a POKéMON CENTER.':
    'もっている　タマゴが　かえり\nそだてやの　タマゴも　すぐに！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'You have EGGS with you!\nShall I hatch them right now?': 'タマゴを　もっていますね！\nいますぐ　かえしましょうか？',
  'Take good care of them!': 'たいせつに　そだててね！',
  'Shall I have the DAY CARE’s\nEGG ready for you right away?': 'そだてやの　タマゴを\nいますぐ　よういしましょうか？',
  'The DAY CARE has an EGG\nready for you now!': 'そだてやで　タマゴを\nうけとれるように　なりました！',
  'The DAY CARE already has an\nEGG waiting for you!': 'そだてやで　もう　タマゴが\nまっていますよ！',
  'Leave two POKéMON that get\nalong at the DAY CARE first!': 'まず　なかの　いい　ポケモンを\n２ひき　そだてやに　あずけてね！',

  // ---- friendship checker
  'FRIENDSHIP CHECKER': 'なつきど　チェッカー',
  'How close are you?': 'なかよし　どのくらい？',
  'See how friendly a POKéMON is,\nthen make it or your party as\nfriendly as can be. Visit the\ndeliveryman on 2F of a CENTER.':
    'ポケモンの　なつきぐあいを\nしらべて　さいこうに　できる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Whose friendship should I\ncheck?': 'どの　ポケモンの　なつきぐあいを\nしらべますか？',
  'An EGG hasn’t made friends yet!': 'タマゴは　まだ\nなついていません！',
  '{STR_VAR_1}’s friendship is\n{STR_VAR_2} out of 255.': '{STR_VAR_1}の　なつきどは\n２５５のうち　{STR_VAR_2}です',
  'Shall I make it as friendly\nas can be?': 'さいこうに　なつくように\nしましょうか？',
  '{STR_VAR_1} adores you now!': '{STR_VAR_1}は　あなたが\nだいすきに　なりました！',
  'Your whole party adores you\nnow!': 'てもちの　みんなが　あなたを\nだいすきに　なりました！',
  'THIS POKéMON': 'この　ポケモン',
  'WHOLE PARTY': 'てもち　ぜんいん',
  'NO THANKS': 'やめておく',

  // ---- stat judge
  'IV/EV STAT JUDGE': 'こたいち　どりょくち　はんてい',
  'IVs, EVs and nature': 'のうりょくを　しらべる',
  'Curious about your POKéMON?\nThe deliveryman on the 2nd\nfloor of a POKéMON CENTER can\nshow its IVs, EVs and nature.':
    'こたいち　どりょくち　せいかく\nポケモンの　ひみつが　わかる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Which POKéMON should I judge?': 'どの　ポケモンを　しらべますか？',
  '{name}’s nature is {nature}.\nHere are its IVs, out of 31:¶{ivs}¶Its EVs add up to {ev_total} of 510:¶{evs}':
    '{name}の　せいかくは\n{nature}です！¶こたいちは　つぎの　とおり\nどれも　さいだいは　３１です¶{ivs}¶どりょくちの　ごうけいは　{ev_total}\nさいだいは　５１０です¶{evs}',
  'HP {hp}, ATTACK {attack}, DEFENSE {defense}\nSP. ATK {sp_atk}, SP. DEF {sp_def}, SPEED {speed}':
    'ＨＰ{hp}　こうげき{attack}\nぼうぎょ{defense}　とくこう{sp_atk}¶とくぼう{sp_def}　すばやさ{speed}',

  // ---- no encounters
  'NO ENCOUNTERS & REPEL': 'やせいの　ポケモン　よけ',
  'Wild POKéMON, stay away!': 'でてこないで！',
  'Keep all wild POKéMON away,\nor only the weaker ones. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'やせいの　ポケモンを　すべて\nまたは　よわい　ものだけ　よける\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Which wild POKéMON should\nstay away?': 'どの　やせいの　ポケモンを\nよけますか？',
  'None will appear until you\nturn off your game.': 'でんげんを　きるまで\nいっさい　でてきません',
  'Like a REPEL that lasts\n65,535 steps!': '６５５３５ほ　つづく\nむしよけスプレーです！',
  'Wild POKéMON are back to\nnormal!': 'やせいの　ポケモンが\nもとどおり　でてきます！',
  'ALL OF THEM': 'すべて',
  'WEAKER ONES': 'よわい　もの',
  'NONE': 'よけない',

  // ---- nickname change
  'NICKNAME CHANGE': 'ニックネーム　チェンジ',
  'A new name, or none at all': 'あたらしい　なまえに',
  'Give a POKéMON a new nickname\nor its species name back. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'ニックネームを　つけなおしたり\nもとの　なまえに　もどしたり！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Whose nickname shall I change?': 'どの　ポケモンの\nニックネームを　かえますか？',
  'Give {STR_VAR_1} a new nickname?': '{STR_VAR_1}に　あたらしい\nニックネームを　つけますか？',
  'Should {STR_VAR_1} go back to\nits species name instead?': 'それとも　{STR_VAR_1}を\nもとの　なまえに　もどしますか？',
  'Done! It’s {STR_VAR_1} again.': 'できました！\nまた　{STR_VAR_1}に　なりました',
  'From now on, it’s {STR_VAR_1}!': 'これからは　{STR_VAR_1}！',
  'An EGG doesn’t have a name yet!': 'タマゴには　まだ\nなまえが　ありません！',

  // ---- shiny hunting
  'SHINY HUNTING': 'いろちがい　ハンティング',
  'Shiny POKéMON, more often': 'いろちがいに　あいやすく',
  'Catch or defeat one POKéMON\nagain and again to meet it\nshiny. Visit the deliveryman\non 2F of a POKéMON CENTER.':
    'おなじ　ポケモンを　つかまえたり\nたおすほど　いろちがいに！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'On until you reset!\nR shows your chain.': 'リセットするまで　オン！\nＲで　れんさを　みられます',
  'On until you reset!': 'リセットするまで　オン！',
  '{STR_VAR_1} chain: {STR_VAR_2}!': '{STR_VAR_1}の　れんさ　{STR_VAR_2}！',

  // ---- pokémon follow
  'POKéMON FOLLOW': 'つれあるき',
  'Your partner walks with you': 'ポケモンと　おさんぽ',
  'Your lead POKéMON walks behind\nyou, if the game has its\nsprite. Visit the deliveryman\non 2F of a POKéMON CENTER.':
    'せんとうの　ポケモンが\nうしろを　ついて　あるきます\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Your lead POKéMON follows you\nuntil you reset!': 'せんとうの　ポケモンが\nリセットまで　ついてきます！',

  // ---- nature mint
  'NATURE MINT': 'せいかく　ミント',
  'A fresh new nature': 'あたらしい　せいかく',
  'Pick the stat a POKéMON’s\nnature raises and the one it\nlowers. Visit the deliveryman\non 2F of a POKéMON CENTER.':
    'せいかくで　あがる　のうりょく\nさがる　のうりょくを　えらべる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Whose nature should I change?': 'せいかくを　かえる\nポケモンは？',
  'Raise which stat?': 'あげる　のうりょくは？',
  'Lower which stat?': 'さげる　のうりょくは？',
  '{STR_VAR_1} is {STR_VAR_2} now!': '{STR_VAR_1}は　{STR_VAR_2}に\nなりました！',
  'That didn’t work, sorry!': 'うまく　いきませんでした\nごめんなさい！',

  // ---- ability capsule
  'ABILITY CAPSULE': 'とくせい　カプセル',
  'Try its other ability': 'もう　ひとつの　とくせい',
  'Switch a POKéMON to the other\nability its species can have.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'しゅぞくの　もう　ひとつの\nとくせいに　かえられる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Whose ability should I switch?': 'どの　ポケモンの\nとくせいを　かえますか？',
  'An EGG can’t switch abilities!': 'タマゴの　とくせいは\nかえられません！',
  '{STR_VAR_1}’s ability is now\n{STR_VAR_2}!': '{STR_VAR_1}の　とくせいが\n{STR_VAR_2}に　なりました！',
  '{STR_VAR_1} has only one\nability.': '{STR_VAR_1}の　とくせいは\nひとつしか　ありません',

  // ---- Pokémon gender change
  'POKéMON GENDER CHANGE': 'ポケモンの　せいべつ　チェンジ',
  'For the perfect pair': 'さいこうの　ペアに',
  'Switch a POKéMON between male\nand female. Visit the\ndeliveryman on the 2nd floor\nof a POKéMON CENTER.':
    'ポケモンの　オスと　メスを\nいれかえられる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Which POKéMON should switch\ngender?': 'どの　ポケモンの\nせいべつを　かえますか？',
  'Let’s wait for the EGG to\nhatch first!': 'タマゴが　かえるまで\nまちましょう！',
  '{STR_VAR_1} is now male!': '{STR_VAR_1}が　オスに\nなりました！',
  '{STR_VAR_1} is now female!': '{STR_VAR_1}が　メスに\nなりました！',
  '{STR_VAR_1}’s gender can’t\nbe switched.': '{STR_VAR_1}の　せいべつは\nかえられません',

  // ---- PP max
  'PP MAX': 'ポイントマックス',
  'Moves at full power': 'わざを　フルパワーに',
  'Every move in your party gets\nthe most PP it can have. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'てもちの　すべての　わざの\nPPを　さいだいに　できる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall I raise the PP of every\nmove in your party to the max?': 'てもちの　すべての　わざの\nPPを　さいだいに　しますか？',
  'Done! Every move has the most\nPP it can have.': 'できました！　すべての　わざの\nPPが　さいだいです',

  // ---- max conditions
  'MAX CONDITIONS': 'コンディション　マックス',
  'Contest ready!': 'コンテストへ！',
  'COOL, BEAUTY, CUTE, SMART and\nTOUGH to the max: a FEEBAS\nthen evolves at its next level.\nVisit 2F of a POKéMON CENTER.':
    'かっこよさなど　ぜんぶ　マックス\nヒンバスも　つぎの　レベルで！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Which POKéMON should I get\nready for contests?': 'どの　ポケモンを\nコンテストに　そなえますか？',
  'An EGG can’t enter contests!': 'タマゴは　コンテストに\nでられません！',
  '{STR_VAR_1} is in top condition!¶A FEEBAS in this condition will\nevolve at its next level.':
    '{STR_VAR_1}は　さいこうの\nコンディションです！¶この　ヒンバスなら　つぎの\nレベルアップで　しんかします',

  // ---- hidden power & IVs
  'HIDDEN POWER & IVS': 'めざめるパワーと　こたいち',
  'Check it, then max it': 'しらべて　さいだいに',
  'See a POKéMON’s HIDDEN POWER,\nthen raise all its IVs to 31\nif you like. Visit the 2F\ndeliveryman of a CENTER.':
    'めざめるパワーを　しらべて\nこたいちを　ぜんぶ　３１に！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Whose HIDDEN POWER should I\ncheck?': 'どの　ポケモンの\nめざめるパワーを　しらべますか？',
  'An EGG keeps its power hidden!': 'タマゴの　ちからは\nまだ　ねむっています！',
  '{STR_VAR_1}’s HIDDEN POWER is\n{STR_VAR_2}-type, power {STR_VAR_3}.': '{STR_VAR_1}の　めざめるパワーは\n{STR_VAR_2}タイプ　いりょく{STR_VAR_3}',
  'Shall I raise all its IVs to\n31? Its nature may change.': 'こたいちを　ぜんぶ　３１に\nします　せいかくも　かわります',
  'All its IVs are 31 now!¶Its HIDDEN POWER is\n{STR_VAR_2}-type, power {STR_VAR_3}.':
    'こたいちが　ぜんぶ　３１に！¶めざめるパワーは\n{STR_VAR_2}タイプ　いりょく{STR_VAR_3}',

  // ---- hidden power type
  'HIDDEN POWER TYPE': 'めざめるパワーの　タイプ',
  'Any type, power 70': 'すきな　タイプで　７０',
  'Give a POKéMON’s HIDDEN POWER\nthe type you choose. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'めざめるパワーを　すきな\nタイプに　かえられる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Whose HIDDEN POWER should I\nchange?': 'どの　ポケモンの\nめざめるパワーを　かえますか？',
  'A physical or a special type?': 'ぶつりと　とくしゅ\nどちらの　タイプに？',
  'Which type?': 'どの　タイプに？',
  'Done! {STR_VAR_1}’s HIDDEN POWER\nis {STR_VAR_2}-type, power 70.': 'できました！¶{STR_VAR_1}の　めざめるパワーは\n{STR_VAR_2}タイプ　いりょく７０です',
  'PHYSICAL': 'ぶつり',
  'SPECIAL': 'とくしゅ',

  // ---- Unown letters
  'UNOWN LETTER CHANGER': 'アンノーン　もじ　チェンジ',
  'From A to ?': 'ＡからＺ　！と？',
  'Give an UNOWN any of its 28\nletters. It keeps its nature.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'アンノーンの　もじを　２８しゅの\nどれにでも！　せいかくは　そのまま\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Which UNOWN?': 'どの　アンノーンですか？',
  'Type its new letter:\nA to Z, ! or ?': 'あたらしい　もじを　いれてね\nＡからＺか　！か　？',
  'One letter, please:\nA to Z, ! or ?': 'もじは　ひとつだけ\nＡからＺか　！か　？',
  '{STR_VAR_1} is the letter\n{STR_VAR_2} now!': '{STR_VAR_1}が\n{STR_VAR_2}の　もじに　なりました！',
  'That’s not an UNOWN!': 'それは　アンノーンでは\nありません！',

  // ---- EV training
  'EV TRAINING': 'どりょくち　トレーニング',
  'Train without battling': 'たたかわずに　きたえる',
  'Reset a POKéMON’s EVs or max\nthe stats you choose. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'どりょくちを　０に　もどしたり\nえらんで　さいだいに　したり！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Which POKéMON should I train?': 'どの　ポケモンを\nきたえますか？',
  'An EGG can’t train yet!': 'タマゴは　まだ\nきたえられません！',
  'Reset all of {STR_VAR_1}’s\nEVs to 0 first?': 'さきに　{STR_VAR_1}の\nどりょくちを　０に　しますか？',
  'Which EVs should I max?\nPress B when you’re done.': 'どの　どりょくちを　さいだいに？\nおわったら　Ｂボタン',
  '{STR_VAR_2} EVs: {STR_VAR_3}.': '{STR_VAR_2}の　どりょくちが\n{STR_VAR_3}に　なりました',
  'All done! Good luck,\n{STR_VAR_1}!': 'できました！\nがんばってね　{STR_VAR_1}！',

  // ---- trainer IDs
  'TRAINER ID REVEAL': 'IDナンバー　チェック',
  'Both of your IDs': 'ふたつの　ID',
  'Learn your TRAINER ID and the\nSECRET ID the game hides.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'IDナンバーと　ゲームが\nかくしている　うらIDが　わかる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Your TRAINER ID is {STR_VAR_1}\nand your SECRET ID is {STR_VAR_2}.¶Together they decide which\nPOKéMON you meet are shiny.':
    'IDナンバーは　{STR_VAR_1}\nうらIDは　{STR_VAR_2}です¶ふたつで　であう　ポケモンの\nいろちがいが　きまります',

  // ---- national dex
  'NATIONAL POKéDEX': 'ぜんこくずかん',
  'Every POKéMON, right away': 'いますぐ　ぜんこくへ',
  'Upgrade your POKéDEX to the\nNATIONAL POKéDEX now. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'ポケモンずかんを　いますぐ\nぜんこくずかんに　できる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall I upgrade your POKéDEX\nto the NATIONAL POKéDEX?': 'ポケモンずかんを\nぜんこくずかんに　しますか？',
  'Done! Your POKéDEX is now the\nNATIONAL POKéDEX.': 'できました！　ポケモンずかんが\nぜんこくずかんに　なりました',
  'You don’t have a POKéDEX yet!': 'まだ　ポケモンずかんを\nもっていませんね！',
  'Your POKéDEX is already the\nNATIONAL POKéDEX!': 'もう　ぜんこくずかんに\nなっていますよ！',

  // ---- rare berries
  'RARE BERRIES': 'めずらしい　きのみ',
  'ENIGMA, LANSAT and STARF': 'ナゾ　サン　スター',
  'Three BERRIES that were only\never given out at events.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'イベントでしか　もらえなかった\n３しゅるいの　きのみ！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Here you go: an ENIGMA, a\nLANSAT and a STARF BERRY!': 'どうぞ！　ナゾのみ\nサンのみ　スターのみ　です！',
  'Receive this card again for\nmore BERRIES!': 'カードを　もういちど　うけとると\nまた　きのみが　もらえるよ！',
  'There’s no room for them in\nyour BAG!': 'バッグに　はいりきりません！',

  // ---- Mirage Island (Emerald)
  'MIRAGE ISLAND': 'まぼろしじま',
  'Out on ROUTE 130 today': '１３０ばんすいどうに',
  'Make MIRAGE ISLAND appear\ntoday. Visit the deliveryman\non the 2nd floor of a\nPOKéMON CENTER.':
    'きょう　まぼろしじまが\nすがたを　あらわす！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'MIRAGE ISLAND is out off\nROUTE 130 today!¶It stays as long as {STR_VAR_1}\nis in your party.':
    'きょうは　１３０ばんすいどうに\nまぼろしじまが　みえます！¶{STR_VAR_1}が　てもちに　いるあいだ\nずっと　みえています',

  // ---- a new day (Emerald)
  'A NEW DAY': 'あたらしい　いちにち',
  'When the clock has stopped': 'とけいが　とまっても',
  'Daily events start over as if\na day had passed. Visit the\ndeliveryman on the 2nd floor\nof a POKéMON CENTER.':
    'いちにち　たったように\nまいにちの　イベントが　もどる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall I start a new day? Daily\nevents will all come back.': 'あたらしい　いちにちに　しますか？\nまいにちの　イベントが　もどります',
  'A new day has begun! New TV\nshows, a new LOTTERY number…¶and a day’s growth for BERRIES.':
    'あたらしい　いちにちの　はじまり！\nテレビも　くじの　ばんごうも¶きのみも　いちにちぶん　そだちました',

  // ---- mass outbreak (Emerald)
  'MASS OUTBREAK': 'たいりょうはっせい',
  'Rare POKéMON, everywhere!': 'めずらしい　ポケモンが！',
  'Start a swarm of a rare HOENN\nPOKéMON where it lives. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'ホウエンの　めずらしい　ポケモンが\nすみかで　たいりょうはっせい！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Which POKéMON should swarm?': 'どの　ポケモンを\nたいりょうはっせい　させますか？',
  'There’s a mass outbreak of\n{STR_VAR_1} on {STR_VAR_2}!¶It lasts for two days.':
    '{STR_VAR_2}で　{STR_VAR_1}が\nたいりょうはっせい　しています！¶ふつかかん　つづきます',

  // ---- berry garden (Emerald)
  'BERRY GARDEN': 'きのみ　ガーデン',
  'Ripe BERRIES, right now': 'いますぐ　しゅうかく',
  'Every BERRY tree you planted\nis ready to pick. Visit the\ndeliveryman on the 2nd floor\nof a POKéMON CENTER.':
    'うえた　きのみの　きが　ぜんぶ\nいますぐ　しゅうかく　できる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall I make your BERRY trees\nready to pick?': 'きのみの　きを　しゅうかく\nできるように　しますか？',
  'Done! {STR_VAR_1} BERRY trees are\nready to pick, and well watered.': 'できました！　きのみの　き　{STR_VAR_1}ほんが\nしゅうかく　できます　みずも　たっぷり',
  'None of your BERRY trees are\ngrowing right now.': 'いま　そだっている\nきのみの　きは　ありません',

  // ---- rival name (FireRed/LeafGreen)
  'RENAME YOUR RIVAL': 'ライバルの　なまえ',
  'Smell ya later!': 'あばよ！',
  'Give your rival a new name.\nVisit the deliveryman on the\n2nd floor of a POKéMON\nCENTER.':
    'ライバルに　あたらしい\nなまえを　つけられる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Would you like to give your\nrival a new name?': 'ライバルに　あたらしい\nなまえを　つけますか？',
  'From now on, your rival is\n{RIVAL}!': 'これから　ライバルは\n{RIVAL}です！',

  // ---- gift ribbons
  'GIFT RIBBONS': 'きねん　リボン',
  'Seven RIBBONS to show off': '７つの　リボンを　みせよう',
  'Your party gets the gift\nRIBBONS once only given at\nevents. Visit the deliveryman\non 2F of a POKéMON CENTER.':
    'イベントで　くばられた\nきねんリボンが　てもちに！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall I give your party POKéMON\nthe gift RIBBONS?': 'てもちの　ポケモンに\nきねんリボンを　あげますか？',
  'Your POKéMON got all seven gift\nRIBBONS! Take a look.': 'きねんリボン　７つを\nもらいました！　みてみてね',

  // ---- fast text
  'FAST TEXT': 'メッセージ　さいそく',
  'No more waiting': 'もう　またない',
  'All text prints at top speed\nuntil you turn off your game.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'でんげんを　きるまで　メッセージが\nいちばん　はやく　でる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'All text prints at top speed\nnow, until you turn off the game.': 'でんげんを　きるまで\nメッセージが　さいそくで　でます',

  // ---- move relearner & deleter
  'MOVE RELEARNER & DELETER': 'わざ　おもいだし　わすれ',
  'And the tutors teach again': 'わざおしえも　もういちど',
  'Relearn a move, forget one,\nor let the move tutors teach\nagain. Visit the deliveryman\non 2F of a POKéMON CENTER.':
    'わざを　おもいだしたり\nわすれたり　わざおしえも　また！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall I help a POKéMON\nremember a move?': 'ポケモンに　わざを\nおもいださせますか？',
  'Or shall I make one forget\na move?': 'それとも　わざを\nわすれさせますか？',
  'Which POKéMON should it be?': 'どの　ポケモンに　しますか？',
  'Which move should it forget?': 'どの　わざを　わすれさせますか？',
  'Make {STR_VAR_1} forget\n{STR_VAR_2}?': '{STR_VAR_1}に　{STR_VAR_2}を\nわすれさせますか？',
  '{STR_VAR_1} forgot {STR_VAR_2}!': '{STR_VAR_1}は　{STR_VAR_2}を\nわすれた！',
  'An EGG doesn’t know any\nmoves yet!': 'タマゴは　まだ\nわざを　おぼえていません！',
  'There’s no move for it to\nremember.': 'おもいだせる　わざが\nありません',
  '{STR_VAR_1} knows only one\nmove!': '{STR_VAR_1}は　わざを\nひとつしか　しりません！',
  'It’s the only POKéMON of yours\nthat knows SURF!': 'なみのりを　おぼえている\nゆいいつの　ポケモンです！',
  'Or shall I let the move tutors\nteach their moves again?': 'それとも　わざおしえに\nまた　おしえてもらいますか？',
  'Done! Every move tutor will\nteach again.': 'できました！　わざおしえが\nまた　おしえてくれます',

  // ---- trade evolution
  'TRADE EVOLUTION': 'こうかん　しんか',
  'No second GBA needed': 'GBAは　１だいで　OK',
  'Evolve a POKéMON that evolves\nby trading, right away. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'こうかんで　しんかする\nポケモンが　いますぐ　しんか！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Which POKéMON should evolve?': 'どの　ポケモンを\nしんか　させますか？',
  'An EGG can’t evolve!': 'タマゴは　しんか　できません！',
  '{STR_VAR_1} doesn’t evolve by\ntrading.¶Some POKéMON need to hold an\nitem when they’re traded.':
    '{STR_VAR_1}は　こうかんでは\nしんか　しません¶どうぐを　もたせて　こうかんで\nしんかする　ポケモンも　います',

  // ---- Poké Ball changer
  'POKé BALL CHANGER': 'ボール　チェンジャー',
  'A new home for a POKéMON': 'あたらしい　おうち',
  'Move a POKéMON into the POKé\nBALL of your choice. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'ポケモンを　すきな\nボールに　いれなおせる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Which POKéMON should get a\nnew POKé BALL?': 'どの　ポケモンの\nボールを　かえますか？',
  'An EGG hasn’t been caught in a\nPOKé BALL!': 'タマゴは　ボールに\nはいっていません！',
  'Which POKé BALL would it like?': 'どの　ボールに　しますか？',
  '{STR_VAR_1} now calls its\n{STR_VAR_2} home!': '{STR_VAR_1}の　あたらしい\nおうちは　{STR_VAR_2}！',
  'MORE…': 'つぎへ',

  // ---- Espeon & Umbreon
  'ESPEON & UMBREON': 'エーフィと　ブラッキー',
  'Day or night, no clock needed': 'ひるも　よるも',
  'A friendly EEVEE evolves into\nESPEON or UMBREON, your pick.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'なついた　イーブイが　えらんで\nエーフィか　ブラッキーに！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Which EEVEE should evolve?': 'どの　イーブイを\nしんか　させますか？',
  'Which form should it take?': 'どちらに　しんか　させますか？',
  '{STR_VAR_1} isn’t an EEVEE!': '{STR_VAR_1}は\nイーブイでは　ありません！',
  'It needs the NATIONAL POKéDEX\nfirst.': 'さきに　ぜんこくずかんが\nひつようです',
  '{STR_VAR_1}’s friendship is\n{STR_VAR_2}. It evolves at 220.': '{STR_VAR_1}の　なつきどは　{STR_VAR_2}\n２２０で　しんか　します',
  'ESPEON': 'エーフィ',
  'UMBREON': 'ブラッキー',

  // ---- roaming Pokémon
  'ROAMING POKéMON': 'はいかいする　ポケモン',
  'Find it, then lure it': 'さがして　よびよせる',
  'Find out where the roaming\nPOKéMON is and lure it to you.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'はいかいする　ポケモンの\nいばしょが　わかり　よびよせる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  '{STR_VAR_1} is roaming\n{STR_VAR_2} right now.': '{STR_VAR_1}は　いま\n{STR_VAR_2}に　います',
  'Shall I lure it to you? It will\nfollow you along its routes.': 'よびよせますか？　どうろを\nつたって　ついてきます',
  'Done! Look for it in tall grass\nand on the water.': 'できました！　くさむらや\nすいめんで　さがしてね',
  'It’s following you.\nKeep luring it?': 'いま　ついてきています\nよびよせを　つづけますか？',
  'It will roam on its own again.': 'また　じゆうに　はいかいします',
  'No POKéMON is roaming right\nnow.': 'いま　はいかいしている\nポケモンは　いません',

  // ---- legendary respawn
  'LEGENDARY RESPAWN': 'でんせつ　ふっかつ',
  'A second chance': 'もう　いちど　チャンス',
  'Legendary POKéMON you beat\nbut didn’t catch come back.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'たおして　しまった\nでんせつの　ポケモンが　ふっかつ！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall I bring back the legendary\nPOKéMON you didn’t catch?': 'つかまえなかった　でんせつの\nポケモンを　よびもどしますか？',
  'Done! {STR_VAR_1} legendary POKéMON\ncame back.': 'できました！　でんせつの\nポケモンが　{STR_VAR_1}ひき　ふっかつ！',
  'No legendary POKéMON needs to\ncome back.': 'ふっかつが　ひつような\nでんせつの　ポケモンは　いません',

  // ---- travel anywhere
  'TRAVEL ANYWHERE': 'どこでも　いどう',
  'FLY with R, BIKE indoors': 'Ｒで　そらをとぶ！',
  'Press R outdoors to FLY, no\nHM needed, and run and BIKE\nanywhere. Visit the deliveryman\non 2F of a POKéMON CENTER.':
    'そとで　Ｒを　おすと　そらをとぶ\nどこでも　はしれて　じてんしゃも！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall I let you FLY with R and\nrun and BIKE anywhere?': 'Ｒで　そらをとび　どこでも\nはしれて　じてんしゃに　のれる！¶そう　しましょうか？',
  'Done! Outdoors, press R to FLY.\nIt lasts until you reset.': 'できました！　そとで　Ｒです\nリセットするまで　つづきます',
  'Travel anywhere is on.\nKeep it on?': 'どこでも　いどうは　オンです\nこのまま　つづけますか？',
  'Back to normal travel!': 'もとの　いどうに　もどります！',

  // ---- PC anywhere
  'PC ANYWHERE': 'どこでも　パソコン',
  'Your boxes, one button away': 'Ｒで　ボックスへ',
  'Press R in the field to use\nyour PC’s POKéMON boxes. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'フィールドで　Ｒを　おすと\nパソコンの　ボックスが　つかえる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall I let you open the PC\nwith R, wherever you are?': 'どこでも　Ｒで　パソコンを\nつかえるように　しますか？',
  'Done! Press R in the field to\nuse the PC, until you reset.': 'できました！　Ｒで　ひらけます\nリセットするまで　つづきます',
  'PC Anywhere is on.\nKeep it on?': 'どこでも　パソコンは　オンです\nこのまま　つづけますか？',
  'Back to the PCs in POKéMON\nCENTERS!': 'パソコンは　ポケモンセンターで！',

  // ---- HM moves without HMs
  'HM MOVES, NO HMs': 'ひでんわざ　いらず',
  'Your badges are enough': 'バッジだけで　OK',
  'CUT, SURF, STRENGTH and more,\nno POKéMON needs to know them.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'いあいぎり　なみのり　かいりき\nおぼえて　いなくても　つかえる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Want to use HM moves without\nteaching them?': 'おぼえさせずに　ひでんわざを\nつかえるように　しますか？',
  'Done! Your badges are all you\nneed now, until you reset.': 'できました！　バッジだけで　OK\nリセットするまで　つづきます',
  'No HMs needed now.\nKeep it that way?': 'いまは　ひでんわざ　いらずです\nこのまま　つづけますか？',
  'Back to teaching HMs!': 'ひでんわざは\nおぼえて　つかってね！',

  // ---- reusable TMs
  'REUSABLE TMs': 'なんどでも　わざマシン',
  'Teach a TM again and again': 'わざマシンが　へらない',
  'Teaching a move with a TM no\nlonger uses the TM up. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    'わざマシンを　つかっても\nなくならなく　なる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall I make your TMs last\nforever?': 'わざマシンを　なんどでも\nつかえるように　しますか？',
  'Done! Teaching a move won’t use\nup the TM until you reset.': 'できました！　リセットするまで\nわざマシンは　なくなりません',
  'Your TMs last forever.\nKeep it that way?': 'わざマシンは　なくなりません\nこのまま　つづけますか？',
  'TMs get used up again.': 'わざマシンは　また　なくなります',

  // ---- physical/special split
  'GEN 4 PHYSICAL/SPECIAL SPLIT': 'ぶつり・とくしゅ　ぶんり',
  'Moves hit as in later games': 'のちの　シリーズのように',
  'Each move is physical or\nspecial on its own, not by its\ntype. Visit the deliveryman\non 2F of a POKéMON CENTER.':
    'わざの　ぶつり・とくしゅが\nタイプでなく　わざで　きまる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Want the physical/special\nsplit?': 'ぶつり・とくしゅを\nわざで　わけますか？',
  'Done! It lasts until you reset.': 'できました！\nリセットするまで　つづきます',
  'The split is on.\nKeep it on?': 'いまは　わざで　わけています\nこのまま　つづけますか？',
  'Back to the old way!': 'もとに　もどります！',

  // ---- Exp. Share for all
  'EXP. SHARE FOR ALL': 'みんなで　けいけんち',
  'The whole party grows': 'みんな　せいちょう',
  'Every POKéMON in your party\ngets EXP. from each battle.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'てもちの　ポケモン　ぜんいんが\nたたかうたびに　けいけんちを！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall your whole party get EXP.\nfrom every battle?': 'てもち　ぜんいんが　けいけんちを\nもらえるように　しますか？',
  'Done! Those that battle get all\nthe EXP., the rest get half.¶It lasts until you reset.':
    'できました！¶たたかった　ポケモンは　ぜんぶ\nほかは　はんぶん　もらえます！¶リセットするまで　つづきます',
  'Your whole party gets EXP.\nKeep it that way?': 'てもち　ぜんいんが　けいけんちを\nもらえます　つづけますか？',

  // ---- feebas finder (Emerald)
  'FEEBAS FINDER': 'ヒンバス　ファインダー',
  'Fish anywhere on ROUTE 119': '１１９ばんどうろ　どこでも',
  'FEEBAS bites wherever you fish\non ROUTE 119. Visit the\ndeliveryman on the 2nd floor\nof a POKéMON CENTER.':
    '１１９ばんどうろの　どこで　つっても\nヒンバスが　かかる！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'Shall I bring FEEBAS to every\nfishing spot on ROUTE 119?': '１１９ばんどうろの　つりばしょ　すべてに\nヒンバスを　よびましょうか？',
  'Done! Cast a rod anywhere on\nROUTE 119. It lasts until you reset.': 'できました！　１１９ばんどうろの　どこでも\nつってね　リセットするまで　つづきます',
  'The FEEBAS FINDER is on.\nKeep it on?': 'ヒンバス　ファインダーは　オンです\nこのまま　つづけますか？',
  'FEEBAS is back in its six\nhidden spots.': 'ヒンバスは　６かしょの\nかくれた　ばしょに　もどりました',

  // ---- starter egg
  'STARTER EGG': 'はじめの　パートナーの　タマゴ',
  'Which one will hatch?': 'なにが　うまれる？',
  'An EGG with one of the nine\nfirst partners inside. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    '９ひきの　さいしょの　パートナーの\nどれかが　はいった　タマゴ！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',

  // ---- gift box
  'GIFT BOX': 'プレゼント　ボックス',
  'Money, candy and more': 'おかねに　アメに　いろいろ',
  '¥100,000, 99 RARE CANDIES and\nCOINS or BATTLE POINTS. Visit\nthe deliveryman on the 2nd\nfloor of a POKéMON CENTER.':
    '１０まんえん　ふしぎなアメ９９こ\nコインか　バトルポイントも！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  '{PLAYER} received ¥100,000!': '{PLAYER}は\n１０まんえん　うけとった！',
  '{PLAYER} received 99 RARE\nCANDIES!': '{PLAYER}は　ふしぎなアメを\n９９こ　うけとった！',
  'There’s no room in your bag\nfor 99 RARE CANDIES!': 'バッグに　ふしぎなアメ\n９９こは　はいりきりません！',
  '{PLAYER} received 1,000 COINS!': '{PLAYER}は　コインを\n１０００まい　うけとった！',
  '{PLAYER} received 100\nBATTLE POINTS!': '{PLAYER}は　バトルポイントを\n１００　うけとった！',
  'Receive the card again for\nanother GIFT BOX!': 'カードを　もういちど　うけとると\nまた　プレゼントが　もらえるよ！',

  // ---- Master Ball (Decryptu's)
  'MYSTERY GIFT': 'ふしぎな　おくりもの',
  'A replacement MASTER BALL': 'マスターボール　ふたたび',
  'A MASTER BALL is on its way to\nreplace the one you used.\nTalk to the delivery man on the\n2nd floor of a POKEMON CENTER.':
    'つかった　マスターボールの\nかわりを　おとどけします！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'A MASTER BALL delivery has arrived!': 'マスターボールを\nおとどけに　まいりました！',
  'You received a MASTER BALL!': 'マスターボールを　どうぞ！',
  'You already collected the MASTER BALL.': 'マスターボールは　もう\nおわたし　しましたよ',
  'No room! Make space, then\ncome back.': 'バッグが　いっぱいです！\nあけてから　また　きてね',

  // ---- Pocket Casino (RAF's)
  'POCKET CASINO': 'ポケット　カジノ',
  'Game Corner!': 'ゲームコーナー！',
  'Roulette!': 'ルーレット！',
  'A special game is waiting\njust for you!\nBring a COIN CASE and COINS.\nGame on!':
    'あなただけの　ゲームが\nまっています！\nコインケースと　コインを　もって\nいざ　しょうぶ！',
  'A COIN CASE and 100 COINS,\njust for this game.': 'この　ゲームの　あいだ　だけ\nコインケースと　コイン１００まい',
  'You can borrow a COIN CASE,\njust for this game.': 'この　ゲームの　あいだ　だけ\nコインケースを　かしますね',
  'Here are 100 COINS to play.': 'あそぶ　コインを\n１００まい　どうぞ',
  'Heh heh, looks like someone\nwants to play some slots.': 'へへ　だれか\nスロットで　あそびたいようだね',
  'Heh heh, looks like someone\nwants to play roulette.': 'へへ　だれか\nルーレットで　あそびたいようだね',
  'I will take the COIN CASE back.\nYour COINS stay with you.': 'コインケースは　かえしてもらうね\nコインは　そのまま　どうぞ',
  'Your BAG is full.': 'バッグが　いっぱいです',
};

// ---- the event Pokémon cards
const EVENT_MONS = {
  JIRACHI: 'ジラーチ', CELEBI: 'セレビィ', DEOXYS: 'デオキシス', MEW: 'ミュウ', METANG: 'メタング',
  PIKACHU: 'ピカチュウ', 'HO-OH': 'ホウオウ',
};
for (const [english, japanese] of Object.entries(EVENT_MONS)) {
  JAPANESE[`{PLAYER} received ${english}!`] = `{PLAYER}は　${japanese}を\nうけとった！`;
  JAPANESE[`Receive the card again for\nanother ${english}!`] = `カードを　もういちど　うけとると\nまた　${japanese}が　もらえるよ！`;
}
Object.assign(JAPANESE, {
  '{PLAYER} received an EGG!': '{PLAYER}は　タマゴを\nうけとった！',
  'Receive the card again for\nanother EGG!': 'カードを　もういちど　うけとると\nまた　タマゴが　もらえるよ！',
  'Would you like a {STR_VAR_1}\nEGG?': '{STR_VAR_1}の　タマゴに\nしますか？',

  'WISHMKR JIRACHI': 'WISHMKR　ジラーチ',
  'The BONUS DISC gift': 'ボーナスディスク',
  'The wish-granting JIRACHI of\nthe COLOSSEUM BONUS DISC.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'かいがいの　コロシアム\nボーナスディスクの　ジラーチ！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  '10 ANIV CELEBI': '10 ANIV　セレビィ',
  'The 10th Anniversary gift': '１０しゅうねん　きねん',
  'The CELEBI of the 2006 10th\nAnniversary tour of America.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    '２００６ねん　アメリカの\n１０しゅうねん　ツアーの　セレビィ！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'PARTY OF THE DECADE': 'パーティ　オブ　ザ　ディケイド',
  'KANTO favorites': 'カントーの　にんきもの',
  'BULBASAUR, CHARIZARD,\nBLASTOISE, PIKACHU, ALAKAZAM\nor DRAGONITE: choose one on\n2F of a POKéMON CENTER.':
    'フシギダネ　リザードン　カメックス\nピカチュウ　フーディン　カイリュー\nポケモンセンター　２かいで\nどれか　１ぴきを　えらんでね',
  'Legendary POKéMON': 'でんせつの　ポケモン',
  'ARTICUNO, ZAPDOS, MOLTRES,\nRAIKOU, ENTEI, SUICUNE, LATIAS\nor LATIOS: choose one on\n2F of a POKéMON CENTER.':
    'フリーザー　サンダー　ファイヤー\nライコウ　エンテイ　スイクン\nラティアス　ラティオスから　１ぴき\nポケモンセンター２かいで',
  'JOHTO & HOENN favorites': 'ジョウトと　ホウエン',
  'TYPHLOSION, ESPEON, UMBREON,\nTYRANITAR, BLAZIKEN or\nABSOL: choose one on\n2F of a POKéMON CENTER.':
    'バクフーン　エーフィ　ブラッキー\nバンギラス　バシャーモ　アブソル\nポケモンセンター　２かいで\nどれか　１ぴきを　えらんでね',
  'DOEL DEOXYS': 'DOEL　デオキシス',
  'From outer space': 'うちゅうから',
  'The DEOXYS of the DOEL\ndistribution, ready to obey.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'DOELの　はいふ\nいうことを　きく　デオキシス！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'SPACE C DEOXYS': 'SPACE C　デオキシス',
  'The DEOXYS of the SPACE C\ndistribution, ready to obey.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'SPACE Cの　はいふ\nいうことを　きく　デオキシス！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'AURA MEW': 'Aura　ミュウ',
  'The Aura gift': 'Auraの　おくりもの',
  'The MEW of the Aura\ndistribution, ready to obey.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'Auraの　はいふ\nいうことを　きく　ミュウ！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'MYSTRY MEW': 'MYSTRY　ミュウ',
  'The MYSTRY gift': 'MYSTRYの　おくりもの',
  'The MEW of the MYSTRY\ndistribution, ready to obey.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'MYSTRYの　はいふ\nいうことを　きく　ミュウ！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'ROCKS METANG': 'ROCKS　メタング',
  'With the National Ribbon': 'ナショナルリボンつき',
  'The METANG of the ROCKS\ndistribution, with its ribbon.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'ROCKSの　はいふ\nリボンつきの　メタング！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'CHANNEL JIRACHI': 'CHANNEL　ジラーチ',
  'The POKéMON CHANNEL gift': 'ポケモンチャンネル',
  'The JIRACHI that POKéMON\nCHANNEL gave in Europe.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'ヨーロッパの　ポケモン\nチャンネルの　ジラーチ！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'POKéMON BOX EGGS': 'ポケモンボックスの　タマゴ',
  'EGGS with special moves': 'とくべつな　わざの　タマゴ',
  'SWABLU, ZIGZAGOON, SKITTY or\nPICHU with a special move:\nchoose one on 2F of a\nPOKéMON CENTER.':
    'チルット　ジグザグマ　エネコ\nピチューの　とくべつな　わざ！\nポケモンセンター　２かいで\nどれか　ひとつを　えらんでね',
  'COLOSSEUM PIKACHU': 'コロシアム　ピカチュウ',
  'From Japan’s BONUS DISC': 'ボーナスディスク',
  'The PIKACHU of the Japanese\nCOLOSSEUM BONUS DISC.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'ポケモンコロシアム　よやく\nとくてんの　ピカチュウ！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'AGETO CELEBI': 'アゲト　セレビィ',
  'The CELEBI of the Japanese\nCOLOSSEUM BONUS DISC.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'ポケモンコロシアム　よやく\nとくてんの　セレビィ！\nポケモンセンター　２かいの\nはいたついんに　はなしかけてね',
  'MATTLE HO-OH': 'MATTLE　ホウオウ',
  'The MT. BATTLE prize': 'バトルやまの　ごほうび',
  'The HO-OH COLOSSEUM gave for\nwinning 100 MT. BATTLE fights.\nVisit the deliveryman on 2F\nof a POKéMON CENTER.':
    'かいがいの　コロシアム\nバトルやま　１００れんしょうの\nごほうびの　ホウオウ！\nポケモンセンター２かいへ！',
});
