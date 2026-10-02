// Gen 3 game text as characters: the international games' set, or the Japanese
// games' kana and marks, their letters, digits and space read as the others'.

const LATIN = ' ÀÁÂÇÈÉÊËÌ\0ÎÏÒÓÔŒÙÚÛÑßàá\0çèéêëì\0îïòóôœùúûñºª\0&+';             // from 0x00
const COMMON = '0123456789!?.-\0…“”‘’♂♀¥,×/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz▶:ÄÖÜäöü';  // from 0xA1
const KANA = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'
  + 'ぁぃぅぇぉゃゅょがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽっ'
  + 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  + 'ァィゥェォャュョガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポッ';                  // from 0x01
const JAPANESE_COMMON = '0123456789！？。ー・‥『』「」♂♀円．×／ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  + 'abcdefghijklmnopqrstuvwxyz▶：ÄÖÜäöü';                                                    // from 0xA1

// The text up to its terminator; codes with no character here are left out.
export function decodeGameText(bytes, japanese = false) {
  let text = '';
  for (const code of bytes) {
    if (code === 0xff) break;
    let char;
    if (japanese) char = code === 0 ? ' ' : code <= KANA.length ? KANA[code - 1] : JAPANESE_COMMON[code - 0xa1];
    else char = code < LATIN.length ? LATIN[code] : COMMON[code - 0xa1];
    if (char && char !== '\0') text += char;
  }
  return text;
}
