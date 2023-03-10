const array = [
  // " "
  { base: ' ',     letters: '\u00a0' },
  // "ⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"
  { base: 'A',     letters: '\u24b6\uff21\u00c0\u00c1\u00c2\u1ea6\u1ea4\u1eaa\u1ea8\u00c3\u0100\u0102\u1eb0\u1eae\u1eb4\u1eb2\u0226\u01e0\u00c4\u01de\u1ea2\u00c5\u01fa\u01cd\u0200\u0202\u1ea0\u1eac\u1eb6\u1e00\u0104\u023a\u2c6f' },
  // "Ꜳ"
  { base: 'AA',    letters: '\ua732' },
  // "ÆǼǢ"
  { base: 'AE',    letters: '\u00c6\u01fc\u01e2' },
  // "Ꜵ"
  { base: 'AO',    letters: '\ua734' },
  // "Ꜷ"
  { base: 'AU',    letters: '\ua736' },
  // "ꜸꜺ"
  { base: 'AV',    letters: '\ua738\ua73a' },
  // "Ꜽ"
  { base: 'AY',    letters: '\ua73c' },
  // "ⒷＢḂḄḆɃƂƁ"
  { base: 'B',     letters: '\u24b7\uff22\u1e02\u1e04\u1e06\u0243\u0182\u0181' },
  // "ⒸＣĆĈĊČÇḈƇȻꜾ"
  { base: 'C',     letters: '\u24b8\uff23\u0106\u0108\u010a\u010c\u00c7\u1e08\u0187\u023b\ua73e' },
  // "ⒹＤḊĎḌḐḒḎĐƋƊƉꝹ"
  { base: 'D',     letters: '\u24b9\uff24\u1e0a\u010e\u1e0c\u1e10\u1e12\u1e0e\u0110\u018b\u018a\u0189\ua779' },
  // "ǱǄ"
  { base: 'DZ',    letters: '\u01f1\u01c4' },
  // "ǲǅ"
  { base: 'Dz',    letters: '\u01f2\u01c5' },
  // "ⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"
  { base: 'E',     letters: '\u24ba\uff25\u00c8\u00c9\u00ca\u1ec0\u1ebe\u1ec4\u1ec2\u1ebc\u0112\u1e14\u1e16\u0114\u0116\u00cb\u1eba\u011a\u0204\u0206\u1eb8\u1ec6\u0228\u1e1c\u0118\u1e18\u1e1a\u0190\u018e' },
  // "ⒻＦḞƑꝻ"
  { base: 'F',     letters: '\u24bb\uff26\u1e1e\u0191\ua77b' },
  // "ⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"
  { base: 'G',     letters: '\u24bc\uff27\u01f4\u011c\u1e20\u011e\u0120\u01e6\u0122\u01e4\u0193\ua7a0\ua77d\ua77e' },
  // "ⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"
  { base: 'H',     letters: '\u24bd\uff28\u0124\u1e22\u1e26\u021e\u1e24\u1e28\u1e2a\u0126\u2c67\u2c75\ua78d' },
  // "ⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"
  { base: 'I',     letters: '\u24be\uff29\u00cc\u00cd\u00ce\u0128\u012a\u012c\u0130\u00cf\u1e2e\u1ec8\u01cf\u0208\u020a\u1eca\u012e\u1e2c\u0197' },
  // "ⒿＪĴɈ"
  { base: 'J',     letters: '\u24bf\uff2a\u0134\u0248' },
  // "ⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"
  { base: 'K',     letters: '\u24c0\uff2b\u1e30\u01e8\u1e32\u0136\u1e34\u0198\u2c69\ua740\ua742\ua744\ua7a2' },
  // "ⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"
  { base: 'L',     letters: '\u24c1\uff2c\u013f\u0139\u013d\u1e36\u1e38\u013b\u1e3c\u1e3a\u0141\u023d\u2c62\u2c60\ua748\ua746\ua780' },
  // "Ǉ"
  { base: 'LJ',    letters: '\u01c7' },
  // "ǈ"
  { base: 'Lj',    letters: '\u01c8' },
  // "ⓂＭḾṀṂⱮƜ"
  { base: 'M',     letters: '\u24c2\uff2d\u1e3e\u1e40\u1e42\u2c6e\u019c' },
  // "ⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"
  { base: 'N',     letters: '\u24c3\uff2e\u01f8\u0143\u00d1\u1e44\u0147\u1e46\u0145\u1e4a\u1e48\u0220\u019d\ua790\ua7a4' },
  // "Ǌ"
  { base: 'NJ',    letters: '\u01ca' },
  // "ǋ"
  { base: 'Nj',    letters: '\u01cb' },
  // "ⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"
  { base: 'O',     letters: '\u24c4\uff2f\u00d2\u00d3\u00d4\u1ed2\u1ed0\u1ed6\u1ed4\u00d5\u1e4c\u022c\u1e4e\u014c\u1e50\u1e52\u014e\u022e\u0230\u00d6\u022a\u1ece\u0150\u01d1\u020c\u020e\u01a0\u1edc\u1eda\u1ee0\u1ede\u1ee2\u1ecc\u1ed8\u01ea\u01ec\u00d8\u01fe\u0186\u019f\ua74a\ua74c' },
  // "Ƣ"
  { base: 'OI',    letters: '\u01a2' },
  // "Ꝏ"
  { base: 'OO',    letters: '\ua74e' },
  // "Ȣ"
  { base: 'OU',    letters: '\u0222' },
  // "ⓅＰṔṖƤⱣꝐꝒꝔ"
  { base: 'P',     letters: '\u24c5\uff30\u1e54\u1e56\u01a4\u2c63\ua750\ua752\ua754' },
  // "ⓆＱꝖꝘɊ"
  { base: 'Q',     letters: '\u24c6\uff31\ua756\ua758\u024a' },
  // "ⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"
  { base: 'R',     letters: '\u24c7\uff32\u0154\u1e58\u0158\u0210\u0212\u1e5a\u1e5c\u0156\u1e5e\u024c\u2c64\ua75a\ua7a6\ua782' },
  // "ⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"
  { base: 'S',     letters: '\u24c8\uff33\u1e9e\u015a\u1e64\u015c\u1e60\u0160\u1e66\u1e62\u1e68\u0218\u015e\u2c7e\ua7a8\ua784' },
  // "ⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"
  { base: 'T',     letters: '\u24c9\uff34\u1e6a\u0164\u1e6c\u021a\u0162\u1e70\u1e6e\u0166\u01ac\u01ae\u023e\ua786' },
  // "Þ"
  { base: 'Th',    letters: '\u00de' },
  // "Ꜩ"
  { base: 'TZ',    letters: '\ua728' },
  // "ⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"
  { base: 'U',     letters: '\u24ca\uff35\u00d9\u00da\u00db\u0168\u1e78\u016a\u1e7a\u016c\u00dc\u01db\u01d7\u01d5\u01d9\u1ee6\u016e\u0170\u01d3\u0214\u0216\u01af\u1eea\u1ee8\u1eee\u1eec\u1ef0\u1ee4\u1e72\u0172\u1e76\u1e74\u0244' },
  // "ⓋＶṼṾƲꝞɅ"
  { base: 'V',     letters: '\u24cb\uff36\u1e7c\u1e7e\u01b2\ua75e\u0245' },
  // "Ꝡ"
  { base: 'VY',    letters: '\ua760' },
  // "ⓌＷẀẂŴẆẄẈⱲ"
  { base: 'W',     letters: '\u24cc\uff37\u1e80\u1e82\u0174\u1e86\u1e84\u1e88\u2c72' },
  // "ⓍＸẊẌ"
  { base: 'X',     letters: '\u24cd\uff38\u1e8a\u1e8c' },
  // "ⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"
  { base: 'Y',     letters: '\u24ce\uff39\u1ef2\u00dd\u0176\u1ef8\u0232\u1e8e\u0178\u1ef6\u1ef4\u01b3\u024e\u1efe' },
  // "ⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"
  { base: 'Z',     letters: '\u24cf\uff3a\u0179\u1e90\u017b\u017d\u1e92\u1e94\u01b5\u0224\u2c7f\u2c6b\ua762' },
  // "ⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑ"
  { base: 'a',     letters: '\u24d0\uff41\u1e9a\u00e0\u00e1\u00e2\u1ea7\u1ea5\u1eab\u1ea9\u00e3\u0101\u0103\u1eb1\u1eaf\u1eb5\u1eb3\u0227\u01e1\u00e4\u01df\u1ea3\u00e5\u01fb\u01ce\u0201\u0203\u1ea1\u1ead\u1eb7\u1e01\u0105\u2c65\u0250\u0251' },
  // "ꜳ"
  { base: 'aa',    letters: '\ua733' },
  // "æǽǣ"
  { base: 'ae',    letters: '\u00e6\u01fd\u01e3' },
  // "ꜵ"
  { base: 'ao',    letters: '\ua735' },
  // "ꜷ"
  { base: 'au',    letters: '\ua737' },
  // "ꜹꜻ"
  { base: 'av',    letters: '\ua739\ua73b' },
  // "ꜽ"
  { base: 'ay',    letters: '\ua73d' },
  // "ⓑｂḃḅḇƀƃɓ"
  { base: 'b',     letters: '\u24d1\uff42\u1e03\u1e05\u1e07\u0180\u0183\u0253' },
  // "ⓒｃćĉċčçḉƈȼꜿↄ"
  { base: 'c',     letters: '\u24d2\uff43\u0107\u0109\u010b\u010d\u00e7\u1e09\u0188\u023c\ua73f\u2184' },
  // "ⓓｄḋďḍḑḓḏđƌɖɗꝺ"
  { base: 'd',     letters: '\u24d3\uff44\u1e0b\u010f\u1e0d\u1e11\u1e13\u1e0f\u0111\u018c\u0256\u0257\ua77a' },
  // "ǳǆ"
  { base: 'dz',    letters: '\u01f3\u01c6' },
  // "ⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"
  { base: 'e',     letters: '\u24d4\uff45\u00e8\u00e9\u00ea\u1ec1\u1ebf\u1ec5\u1ec3\u1ebd\u0113\u1e15\u1e17\u0115\u0117\u00eb\u1ebb\u011b\u0205\u0207\u1eb9\u1ec7\u0229\u1e1d\u0119\u1e19\u1e1b\u0247\u025b\u01dd' },
  // "ⓕｆḟƒꝼ"
  { base: 'f',     letters: '\u24d5\uff46\u1e1f\u0192\ua77c' },
  // "ﬀ"
  { base: 'ff',    letters: '\ufb00' },
  // "ﬁ"
  { base: 'fi',    letters: '\ufb01' },
  // "ﬂ"
  { base: 'fl',    letters: '\ufb02' },
  // "ﬃ"
  { base: 'ffi',   letters: '\ufb03' },
  // "ﬄ"
  { base: 'ffl',   letters: '\ufb04' },
  // "ⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"
  { base: 'g',     letters: '\u24d6\uff47\u01f5\u011d\u1e21\u011f\u0121\u01e7\u0123\u01e5\u0260\ua7a1\u1d79\ua77f' },
  // "ⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"
  { base: 'h',     letters: '\u24d7\uff48\u0125\u1e23\u1e27\u021f\u1e25\u1e29\u1e2b\u1e96\u0127\u2c68\u2c76\u0265' },
  // "ƕ"
  { base: 'hv',    letters: '\u0195' },
  // "ⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"
  { base: 'i',     letters: '\u24d8\uff49\u00ec\u00ed\u00ee\u0129\u012b\u012d\u00ef\u1e2f\u1ec9\u01d0\u0209\u020b\u1ecb\u012f\u1e2d\u0268\u0131' },
  // "ⓙｊĵǰɉ"
  { base: 'j',     letters: '\u24d9\uff4a\u0135\u01f0\u0249' },
  // "ⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"
  { base: 'k',     letters: '\u24da\uff4b\u1e31\u01e9\u1e33\u0137\u1e35\u0199\u2c6a\ua741\ua743\ua745\ua7a3' },
  // "ⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"
  { base: 'l',     letters: '\u24db\uff4c\u0140\u013a\u013e\u1e37\u1e39\u013c\u1e3d\u1e3b\u017f\u0142\u019a\u026b\u2c61\ua749\ua781\ua747' },
  // "ǉ"
  { base: 'lj',    letters: '\u01c9' },
  // "ⓜｍḿṁṃɱɯ"
  { base: 'm',     letters: '\u24dc\uff4d\u1e3f\u1e41\u1e43\u0271\u026f' },
  // "ñnⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥлԉ"
  { base: 'n',     letters: '\u00f1\u006e\u24dd\uff4e\u01f9\u0144\u00f1\u1e45\u0148\u1e47\u0146\u1e4b\u1e49\u019e\u0272\u0149\ua791\ua7a5\u043b\u0509' },
  // "ǌ"
  { base: 'nj',    letters: '\u01cc' },
  // "߀oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"
  { base: 'o',     letters: '\u07c0\u006f\u24de\uff4f\u00f2\u00f3\u00f4\u1ed3\u1ed1\u1ed7\u1ed5\u00f5\u1e4d\u022d\u1e4f\u014d\u1e51\u1e53\u014f\u022f\u0231\u00f6\u022b\u1ecf\u0151\u01d2\u020d\u020f\u01a1\u1edd\u1edb\u1ee1\u1edf\u1ee3\u1ecd\u1ed9\u01eb\u01ed\u00f8\u01ff\u0254\ua74b\ua74d\u0275' },
  // "Œœ"
  { base: 'oe',    letters: '\u0152\u0153' },
  // "ƣ"
  { base: 'oi',    letters: '\u01a3' },
  // "ȣ"
  { base: 'ou',    letters: '\u0223' },
  // "ꝏ"
  { base: 'oo',    letters: '\ua74f' },
  // "ⓟｐṕṗƥᵽꝑꝓꝕ"
  { base: 'p',     letters: '\u24df\uff50\u1e55\u1e57\u01a5\u1d7d\ua751\ua753\ua755' },
  // "ⓠｑɋꝗꝙ"
  { base: 'q',     letters: '\u24e0\uff51\u024b\ua757\ua759' },
  // "ⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"
  { base: 'r',     letters: '\u24e1\uff52\u0155\u1e59\u0159\u0211\u0213\u1e5b\u1e5d\u0157\u1e5f\u024d\u027d\ua75b\ua7a7\ua783' },
  // "ⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ"
  { base: 's',     letters: '\u24e2\uff53\u00df\u015b\u1e65\u015d\u1e61\u0161\u1e67\u1e63\u1e69\u0219\u015f\u023f\ua7a9\ua785\u1e9b' },
  // "ß"
  { base: 'ss',    letters: '\u00df' },
  // "ⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"
  { base: 't',     letters: '\u24e3\uff54\u1e6b\u1e97\u0165\u1e6d\u021b\u0163\u1e71\u1e6f\u0167\u01ad\u0288\u2c66\ua787' },
  // "þ"
  { base: 'th',    letters: '\u00fe' },
  // "ꜩ"
  { base: 'tz',    letters: '\ua729' },
  // "ⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"
  { base: 'u',     letters: '\u24e4\uff55\u00f9\u00fa\u00fb\u0169\u1e79\u016b\u1e7b\u016d\u00fc\u01dc\u01d8\u01d6\u01da\u1ee7\u016f\u0171\u01d4\u0215\u0217\u01b0\u1eeb\u1ee9\u1eef\u1eed\u1ef1\u1ee5\u1e73\u0173\u1e77\u1e75\u0289' },
  // "ⓥｖṽṿʋꝟʌ"
  { base: 'v',     letters: '\u24e5\uff56\u1e7d\u1e7f\u028b\ua75f\u028c' },
  // "ꝡ"
  { base: 'vy',    letters: '\ua761' },
  // "ⓦｗẁẃŵẇẅẘẉⱳ"
  { base: 'w',     letters: '\u24e6\uff57\u1e81\u1e83\u0175\u1e87\u1e85\u1e98\u1e89\u2c73' },
  // "ⓧｘẋẍ"
  { base: 'x',     letters: '\u24e7\uff58\u1e8b\u1e8d' },
  // "ⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"
  { base: 'y',     letters: '\u24e8\uff59\u1ef3\u00fd\u0177\u1ef9\u0233\u1e8f\u00ff\u1ef7\u1e99\u1ef5\u01b4\u024f\u1eff' },
  // "ⓩｚźẑżžẓẕƶȥɀⱬꝣ"
  { base: 'z',     letters: '\u24e9\uff5a\u017a\u1e91\u017c\u017e\u1e93\u1e95\u01b6\u0225\u0240\u2c6c\ua763' },
]

/** @type {Map<number, string>} */
const map = new Map()

/**
 * https://en.wikipedia.org/wiki/Combining_Diacritical_Marks
 * @param {number} charCode 
 */
const isDiactricalMark = (charCode) => charCode >= 0x300 && charCode <= 0x36f

for (const { base, letters  } of array) {
  for (const letter of letters)  {
    map.set(letter.charCodeAt(0), base)
  }
}

/**
 * Removes diacritics from a string.
 * @param {string} str
 * @returns {string}
 */
const removeDiacritics = (str) => {
  const length = str.length
  const chunks = new Array(length)
  for (let i = 0; i < length; i++) {
    const charCode = str.charCodeAt(i)
    if (isDiactricalMark(charCode)) {
      chunks[i] = ''
    } else {
      const base = map.get(charCode)
      chunks[i] = base ?? String.fromCharCode(charCode)
    }
  }
  return chunks.join('')
}

export {
  isDiactricalMark,
  removeDiacritics,
}