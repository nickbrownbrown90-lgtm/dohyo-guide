/* ==========================================================================
   Dohyō Guide (土俵ガイド) — Bilingual Grand Sumo Dataset & Kanji Dictionary
   Contains:
   1. 28 Top Makuuchi & Fan-Favorite Rikishi with Character-by-Character
      Shikona Kanji Breakdowns, Lineage Stories, Career Records, and Styles.
   2. Curated Makuuchi Torikumi (21 Full Bouts for Day 8 / Nakabi + Multi-Day
      Generator & Live sumo-api.com Hydrator).
   3. Categorized Kimarite (決まり手) Encyclopedia with Kanji Etymology.
   4. Live Arena Schedule, Scoreboard Decoder, & Ritual Vocabulary.
   ========================================================================== */

window.SUMO_DATA = {
  bashoList: [
    {
      id: "202611",
      apiId: "202611",
      startDate: "2026-11-08",
      nameEn: "Kyushu Basho (Nov 2026 — Fukuoka)",
      nameJp: "2026年 九州場所（十一月場所・福岡国際センター）",
      venueEn: "Fukuoka Kokusai Center",
      venueJp: "福岡国際センター",
      city: "Fukuoka"
    },
    {
      id: "202609",
      apiId: "202609",
      startDate: "2026-09-13",
      nameEn: "Aki Basho (Sep 2026 — Tokyo)",
      nameJp: "2026年 秋場所（九月場所・両国国技館）",
      venueEn: "Ryōgoku Kokugikan",
      venueJp: "両国国技館",
      city: "Tokyo"
    },
    {
      id: "202607",
      apiId: "202607",
      startDate: "2026-07-12",
      nameEn: "Nagoya Basho (Jul 2026 — Aichi)",
      nameJp: "2026年 名古屋場所（七月場所・IGアリーナ）",
      venueEn: "IG Arena Nagoya",
      venueJp: "名古屋・IGアリーナ",
      city: "Nagoya"
    },
    {
      id: "202605",
      apiId: "202605",
      startDate: "2026-05-10",
      nameEn: "Natsu Basho (May 2026 — Tokyo)",
      nameJp: "2026年 夏場所（五月場所・両国国技館）",
      venueEn: "Ryōgoku Kokugikan",
      venueJp: "両国国技館",
      city: "Tokyo"
    },
    {
      id: "202603",
      apiId: "202603",
      startDate: "2026-03-08",
      nameEn: "Haru Basho (Mar 2026 — Osaka)",
      nameJp: "2026年 春場所（三月場所・エディオンアリーナ大阪）",
      venueEn: "Edion Arena Osaka",
      venueJp: "エディオンアリーナ大阪",
      city: "Osaka"
    },
    {
      id: "202601",
      apiId: "202601",
      startDate: "2026-01-11",
      nameEn: "Hatsu Basho (Jan 2026 — Tokyo)",
      nameJp: "2026年 初場所（一月場所・両国国技館）",
      venueEn: "Ryōgoku Kokugikan",
      venueJp: "両国国技館",
      city: "Tokyo"
    }
  ],

  days: [
    { day: 1, date: "2026-11-08", labelEn: "Day 1 (Shonichi)", labelJp: "初日" },
    { day: 2, date: "2026-11-09", labelEn: "Day 2", labelJp: "二日目" },
    { day: 3, date: "2026-11-10", labelEn: "Day 3", labelJp: "三日目" },
    { day: 4, date: "2026-11-11", labelEn: "Day 4", labelJp: "四日目" },
    { day: 5, date: "2026-11-12", labelEn: "Day 5", labelJp: "五日目" },
    { day: 6, date: "2026-11-13", labelEn: "Day 6", labelJp: "六日目" },
    { day: 7, date: "2026-11-14", labelEn: "Day 7", labelJp: "七日目" },
    { day: 8, date: "2026-11-15", labelEn: "Day 8 (Nakabi)", labelJp: "中日" },
    { day: 9, date: "2026-11-16", labelEn: "Day 9 (Today ★)", labelJp: "九日目" },
    { day: 10, date: "2026-11-17", labelEn: "Day 10", labelJp: "十日目" },
    { day: 11, date: "2026-11-18", labelEn: "Day 11", labelJp: "十一日目" },
    { day: 12, date: "2026-11-19", labelEn: "Day 12", labelJp: "十二日目" },
    { day: 13, date: "2026-11-20", labelEn: "Day 13", labelJp: "十三日目" },
    { day: 14, date: "2026-11-21", labelEn: "Day 14", labelJp: "十四日目" },
    { day: 15, date: "2026-11-22", labelEn: "Day 15 (Senshūraku ★)", labelJp: "千秋楽" }
  ],

  rikishi: [
  {
    "id": "onosato",
    "apiId": 8850,
    "shikonaKanji": "大の里",
    "furigana": "おおのさと",
    "rubyHtml": "<ruby>大<rt>おお</rt></ruby>の<ruby>里<rt>さと</rt></ruby>",
    "romaji": "Onosato",
    "givenName": "泰輝",
    "rankEn": "Yokozuna 1 East",
    "rankJp": "東横綱",
    "rankTier": "Yokozuna",
    "side": "East",
    "heyaEn": "Nishonoseki",
    "heyaJp": "Nishonoseki部屋",
    "originEn": "Ishikawa-ken, Kahoku-gun, Tsubata-machi",
    "originJp": "Ishikawa-ken, Kahoku-gun, Tsubata-machi",
    "heightCm": 190,
    "weightKg": 188,
    "styleCode": "Migi-yotsu / Oshi-zumo",
    "styleEn": "Overwhelming forward power, crushing tachiai & right-hand inside belt",
    "styleJp": "右四つ・圧倒的な突き押しと寄り",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi",
      "Tsukidashi"
    ],
    "makuuchiYusho": 5,
    "sansho": "5+ (Multiple Special Prizes)",
    "kinboshi": 1,
    "careerRecord": "2026 Kyushu: 7-1",
    "currentRecord": "7-1",
    "literalMeaningEn": "Great Village / Homeland",
    "literalMeaningJp": "大いなる故郷（稀勢の里・隆の里の系譜）",
    "kanjiBreakdown": [
      {
        "char": "大",
        "reading": "Dai / Ō (ダイ / おお)",
        "meaningEn": "Great / Large",
        "noteEn": "Bold opening character symbolizing explosive power"
      },
      {
        "char": "の",
        "reading": "no (の)",
        "meaningEn": "Of",
        "noteEn": "Connecting particle"
      },
      {
        "char": "里",
        "reading": "Sato (リ / さと)",
        "meaningEn": "Village / Homeland",
        "noteEn": "Honors Yokozuna Kisenosato & Takanosato of the Nishonoseki lineage"
      }
    ],
    "storyEn": "The powerhouse 75th Yokozuna from Ishikawa Prefecture. Towering at 192cm and ~190kg, Onosato enters Day 9 of the 2026 Kyushu Basho tied for the lead at 7-1.",
    "storyJp": "石川県出身の第75代横綱。192cmの巨体と圧倒的な馬力で2026年九州場所も7勝1敗で優勝争いの先頭を走る。"
  },
  {
    "id": "hoshoryu",
    "apiId": 19,
    "shikonaKanji": "豊昇龍",
    "furigana": "ほうしょうりゅう",
    "rubyHtml": "<ruby>豊<rt>ほう</rt></ruby><ruby>昇<rt>しょう</rt></ruby><ruby>龍<rt>りゅう</rt></ruby>",
    "romaji": "Hoshoryu",
    "givenName": "智勝",
    "rankEn": "Yokozuna 1 West",
    "rankJp": "西横綱",
    "rankTier": "Yokozuna",
    "side": "West",
    "heyaEn": "Tatsunami",
    "heyaJp": "Tatsunami部屋",
    "originEn": "Mongolia, Ulaanbaatar",
    "originJp": "Mongolia, Ulaanbaatar",
    "heightCm": 188,
    "weightKg": 148,
    "styleCode": "Yotsu-zumo / Nage-waza",
    "styleEn": "Lightning-fast belt grip, judo-inspired throws (Uwatenage, Shitatedashinage) & trips",
    "styleJp": "四つ相撲・多彩な投げ技と足技",
    "signatureMoves": [
      "Uwatenage",
      "Yorikiri",
      "Shitatenage"
    ],
    "makuuchiYusho": 2,
    "sansho": "4 (Gino 3, Kanto 1)",
    "kinboshi": 1,
    "careerRecord": "2026 Kyushu: 4-4",
    "currentRecord": "4-4",
    "literalMeaningEn": "Bountiful Rising Dragon",
    "literalMeaningJp": "豊かに昇る龍（叔父・朝青龍の系譜）",
    "kanjiBreakdown": [
      {
        "char": "豊",
        "reading": "Hō / Yutaka (ホウ / ゆたか)",
        "meaningEn": "Abundant / Bountiful",
        "noteEn": "Inherited from Tatsunami stable / uncle 68th Yokozuna Asashōryū"
      },
      {
        "char": "昇",
        "reading": "Shō (ショウ / のぼる)",
        "meaningEn": "Rising / Ascending",
        "noteEn": "Symbolizes climbing steadily toward the summit of sumo"
      },
      {
        "char": "龍",
        "reading": "Ryū (リュウ / たつ)",
        "meaningEn": "Dragon",
        "noteEn": "Mythical symbol of strength & speed; shared with uncle Asashōryū"
      }
    ],
    "storyEn": "Nephew of 68th Yokozuna Asashōryū and now Yokozuna 1 West himself. Known for razor-sharp throws, fierce glare, and relentless technical adaptability.",
    "storyJp": "第68代横綱・朝青龍を叔父に持つ西横綱。切れ味鋭い投げ技と足技、勝負師の気迫が持ち味。"
  },
  {
    "id": "aonishiki",
    "apiId": 8854,
    "shikonaKanji": "安青錦",
    "furigana": "あおにしき",
    "rubyHtml": "<ruby>安<rt>あん</rt></ruby><ruby>青<rt>あお</rt></ruby><ruby>錦<rt>にしき</rt></ruby>",
    "romaji": "Aonishiki",
    "givenName": "新大",
    "rankEn": "Ozeki 1 East",
    "rankJp": "東大関",
    "rankTier": "Ozeki",
    "side": "East",
    "heyaEn": "Ajigawa",
    "heyaJp": "Ajigawa部屋",
    "originEn": "Ukraine, Vinnytsia Oblast",
    "originJp": "Ukraine, Vinnytsia Oblast",
    "heightCm": 182,
    "weightKg": 142,
    "styleCode": "Migiyotsu / Technical Belt",
    "styleEn": "Low center of gravity, rapid inside-left/right belt control & agile footwork",
    "styleJp": "低い体勢からの四つ相撲・技巧派",
    "signatureMoves": [
      "Yorikiri",
      "Uwatenage",
      "Oshidashi"
    ],
    "makuuchiYusho": 1,
    "sansho": "4 (Gino / Kanto / Shukun)",
    "kinboshi": 2,
    "careerRecord": "2026 Kyushu: 4-4",
    "currentRecord": "4-4",
    "literalMeaningEn": "Peaceful Blue Brocade",
    "literalMeaningJp": "安らかに輝く青い錦（ウクライナ国旗の青＋師匠・安美錦）",
    "kanjiBreakdown": [
      {
        "char": "安",
        "reading": "Yasu (アン / やすい)",
        "meaningEn": "Steady / Peaceful",
        "noteEn": "Completes his surname Takayasu (高安)"
      },
      {
        "char": "青",
        "reading": "Sei (セイ / あお)",
        "meaningEn": "Blue / Azure",
        "noteEn": "Great Azure Mountain (Daiseizan 大青山)"
      },
      {
        "char": "錦",
        "reading": "Nishiki (キン / にしき)",
        "meaningEn": "Brocade",
        "noteEn": "Richly woven traditional beauty; Isegahama-beya's Nishikifuji"
      }
    ],
    "storyEn": "Born in Vinnytsia, Ukraine, Aonishiki rose with historic speed to become Ozeki 1 East under stablemaster Ajigawa (ex-Aminishiki). His 'Ao' (Blue) honors Ukraine.",
    "storyJp": "ウクライナ・ヴィーンヌィツャ出身の新鋭東大関。師匠・安治川親方（元安美錦）の指導のもと驚異的なスピード出世を果たした。"
  },
  {
    "id": "kotozakura",
    "apiId": 20,
    "shikonaKanji": "琴櫻",
    "furigana": "ことざくら",
    "rubyHtml": "<ruby>琴<rt>こと</rt></ruby><ruby>櫻<rt>ざくら</rt></ruby>",
    "romaji": "Kotozakura",
    "givenName": "将傑",
    "rankEn": "Ozeki 1 West",
    "rankJp": "西大関",
    "rankTier": "Ozeki",
    "side": "West",
    "heyaEn": "Sadogatake",
    "heyaJp": "Sadogatake部屋",
    "originEn": "Chiba-ken, Matsudo-shi",
    "originJp": "Chiba-ken, Matsudo-shi",
    "heightCm": 189,
    "weightKg": 177,
    "styleCode": "Migi-yotsu / Oshi",
    "styleEn": "Heavy chest-to-chest pressure, patient belt work & formidable balance",
    "styleJp": "右四つ・重厚な寄り・押し相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi",
      "Uwatenage"
    ],
    "makuuchiYusho": 1,
    "sansho": "5 (Gino 3, Kanto 1, Shukun 1)",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 5-3",
    "currentRecord": "5-3",
    "literalMeaningEn": "Harp & Cherry Blossom",
    "literalMeaningJp": "琴と櫻（祖父・第53代横綱 琴櫻を襲名）",
    "kanjiBreakdown": [
      {
        "char": "琴",
        "reading": "Koto (キン / こと)",
        "meaningEn": "Japanese Harp (Koto)",
        "noteEn": "Signature prefix of Sadogatake-beya, founded by ex-Sekiwake Kotonishiki"
      },
      {
        "char": "櫻",
        "reading": "Zakura / Sakura (オウ / さくら)",
        "meaningEn": "Cherry Blossom",
        "noteEn": "Classic kanji form inherited directly from his grandfather, 53rd Yokozuna Kotozakura"
      }
    ],
    "storyEn": "Carrying the legendary shikona of his grandfather, the 53rd Yokozuna Kotozakura. Standing firm at 5-3 entering Day 9 in Fukuoka.",
    "storyJp": "祖父である第53代横綱・琴櫻の四股名を受け継ぐ西大関。重厚な四つ相撲と高い安定感を誇る。"
  },
  {
    "id": "kirishima",
    "apiId": 7,
    "shikonaKanji": "霧島",
    "furigana": "きりしま",
    "rubyHtml": "<ruby>霧<rt>きり</rt></ruby><ruby>島<rt>しま</rt></ruby>",
    "romaji": "Kirishima",
    "givenName": "鐵力",
    "rankEn": "Ozeki 2 East",
    "rankJp": "東大関",
    "rankTier": "Ozeki",
    "side": "East",
    "heyaEn": "Otowayama",
    "heyaJp": "Otowayama部屋",
    "originEn": "Mongolia, Ulaanbaatar",
    "originJp": "Mongolia, Ulaanbaatar",
    "heightCm": 186,
    "weightKg": 150,
    "styleCode": "Hidari-yotsu / Technical",
    "styleEn": "Agile left-hand inside grip, swift pivoting & crafty counter-throws",
    "styleJp": "左四つ・俊敏な動きと投げ",
    "signatureMoves": [
      "Yorikiri",
      "Uwatenage",
      "Hatakikomi"
    ],
    "makuuchiYusho": 2,
    "sansho": "4 (Gino 3, Kanto 1)",
    "kinboshi": 1,
    "careerRecord": "2026 Kyushu: 7-1",
    "currentRecord": "7-1",
    "literalMeaningEn": "Mist Island",
    "literalMeaningJp": "霧の島（師匠・元大関霧島を襲名）",
    "kanjiBreakdown": [
      {
        "char": "霧",
        "reading": "Kiri (ム / きり)",
        "meaningEn": "Mist / Fog",
        "noteEn": "Inherited from his stablemaster, former Ozeki Kirishima (霧島)"
      },
      {
        "char": "島",
        "reading": "Shima (トウ / しま)",
        "meaningEn": "Island",
        "noteEn": "Completes the historic Kirishima (霧島) ring name"
      }
    ],
    "storyEn": "In blistering form at 7-1 entering Day 9, Ozeki Kirishima is co-leading the 2026 Kyushu Basho title race with Onosato, Atamifuji, Wakamotoharu, and Kinbozan.",
    "storyJp": "2026年九州場所は中日を終えて7勝1敗の首位タイと絶好調。俊敏な左四つで3度目の賜盃を狙う。"
  },
  {
    "id": "fujinokawa",
    "apiId": 615,
    "shikonaKanji": "藤ノ川",
    "furigana": "fujinokawa",
    "rubyHtml": "藤ノ川",
    "romaji": "Fujinokawa",
    "givenName": "成剛",
    "rankEn": "Sekiwake 1 East",
    "rankJp": "東関脇",
    "rankTier": "Sekiwake",
    "side": "East",
    "heyaEn": "Isenoumi",
    "heyaJp": "Isenoumi部屋",
    "originEn": "Tokyo-to, Edogawa-ku - Kyoto-fu, Kyoto-shi, Nishikyo-ku",
    "originJp": "Tokyo-to, Edogawa-ku - Kyoto-fu, Kyoto-shi, Nishikyo-ku",
    "heightCm": 177,
    "weightKg": 125,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Isenoumi stable fundamentals combining forward drive and belt control",
    "styleJp": "Isenoumi部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 3-5",
    "currentRecord": "3-5",
    "literalMeaningEn": "藤ノ川 (Fujinokawa)",
    "literalMeaningJp": "藤ノ川の四股名",
    "kanjiBreakdown": [
      {
        "char": "藤",
        "reading": "Fuji (トウ / ふじ)",
        "meaningEn": "Wisteria",
        "noteEn": "Signature character of Fujishima-beya or Isegahama-connected names"
      },
      {
        "char": "ノ",
        "reading": "no (の)",
        "meaningEn": "Of (katakana connector)",
        "noteEn": "Traditional katakana linking particle in classic shikona"
      },
      {
        "char": "川",
        "reading": "Kawa (セン / かわ)",
        "meaningEn": "River",
        "noteEn": "Flows from his family sumo heritage (father & grandfather were wrestlers)"
      }
    ],
    "storyEn": "Fujinokawa (藤ノ川) competes out of Isenoumi stable from Tokyo-to, Edogawa-ku - Kyoto-fu, Kyoto-shi, Nishikyo-ku, entering Day 9 of the 2026 Kyushu Basho at 3-5.",
    "storyJp": "Isenoumi部屋所属・Tokyo-to, Edogawa-ku - Kyoto-fu, Kyoto-shi, Nishikyo-ku出身。2026年九州場所9日目を3-5で迎える。"
  },
  {
    "id": "atamifuji",
    "apiId": 74,
    "shikonaKanji": "熱海富士",
    "furigana": "あたみふじ",
    "rubyHtml": "<ruby>熱<rt>あたた</rt></ruby><ruby>海<rt>み</rt></ruby><ruby>富<rt>ふ</rt></ruby><ruby>士<rt>じ</rt></ruby>",
    "romaji": "Atamifuji",
    "givenName": "朔太郎",
    "rankEn": "Sekiwake 1 West",
    "rankJp": "西関脇",
    "rankTier": "Sekiwake",
    "side": "West",
    "heyaEn": "Isegahama",
    "heyaJp": "Isegahama部屋",
    "originEn": "Shizuoka-ken, Atami-shi",
    "originJp": "Shizuoka-ken, Atami-shi",
    "heightCm": 185,
    "weightKg": 198,
    "styleCode": "Migi-yotsu / Power",
    "styleEn": "Massive frame, deep right-hand belt grip & unstoppable forward march",
    "styleJp": "右四つ・巨体を活かした寄り",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi",
      "Uwatenage"
    ],
    "makuuchiYusho": 0,
    "sansho": "2 (Kanto 2)",
    "kinboshi": 1,
    "careerRecord": "2026 Kyushu: 7-1",
    "currentRecord": "7-1",
    "literalMeaningEn": "Atami Mount Fuji",
    "literalMeaningJp": "熱海の富士山（故郷・静岡県熱海市＋伊勢ヶ濱の富士）",
    "kanjiBreakdown": [
      {
        "char": "熱",
        "reading": "Ata / Netsu (ネツ / あつい)",
        "meaningEn": "Hot / Passionate",
        "noteEn": "First character of his hometown Atami (熱海) hot-spring resort"
      },
      {
        "char": "海",
        "reading": "Mi / Umi (カイ / うみ)",
        "meaningEn": "Sea / Ocean",
        "noteEn": "Second character of Atami; evokes coastal strength & fluidity"
      },
      {
        "char": "富",
        "reading": "Fu (フ / とみ)",
        "meaningEn": "Wealth / Abundant",
        "noteEn": "First half of Mount Fuji (富士), signature suffix of Isegahama-beya"
      },
      {
        "char": "士",
        "reading": "Ji (シ / さむらい)",
        "meaningEn": "Warrior / Samurai",
        "noteEn": "Completes Fuji (富士), honoring 63rd Yokozuna Asahifuji"
      }
    ],
    "storyEn": "Now Sekiwake 1 West and tied for the Kyushu Basho lead at 7-1! Faces Yokozuna Hoshoryu in a massive Day 9 co-main event.",
    "storyJp": "西関脇に昇進し7勝1敗で優勝争い首位タイに立つ静岡県熱海市出身のホープ。9日目は横綱豊昇龍と激突。"
  },
  {
    "id": "churanoumi",
    "apiId": 71,
    "shikonaKanji": "美ノ海",
    "furigana": "churanoumi",
    "rubyHtml": "美ノ海",
    "romaji": "Churanoumi",
    "givenName": "義久",
    "rankEn": "Komusubi 1 East",
    "rankJp": "東小結",
    "rankTier": "Komusubi",
    "side": "East",
    "heyaEn": "Kise",
    "heyaJp": "Kise部屋",
    "originEn": "Okinawa-ken, Uruma-shi",
    "originJp": "Okinawa-ken, Uruma-shi",
    "heightCm": 176,
    "weightKg": 157,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Kise stable fundamentals combining forward drive and belt control",
    "styleJp": "Kise部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 1-7",
    "currentRecord": "1-7",
    "literalMeaningEn": "美ノ海 (Churanoumi)",
    "literalMeaningJp": "美ノ海の四股名",
    "kanjiBreakdown": [
      {
        "char": "美",
        "reading": "Chura / Bi (ビ / うつくしい)",
        "meaningEn": "Beautiful (Okinawan: Chura)",
        "noteEn": "Reflects Okinawa's 'Churaumi' (beautiful sea) in his homeland"
      },
      {
        "char": "ノ",
        "reading": "no (の)",
        "meaningEn": "Of (katakana connector)",
        "noteEn": "Traditional katakana linking particle in classic shikona"
      },
      {
        "char": "海",
        "reading": "Mi / Umi (カイ / うみ)",
        "meaningEn": "Sea / Ocean",
        "noteEn": "Second character of Atami; evokes coastal strength & fluidity"
      }
    ],
    "storyEn": "Churanoumi (美ノ海) competes out of Kise stable from Okinawa-ken, Uruma-shi, entering Day 9 of the 2026 Kyushu Basho at 1-7.",
    "storyJp": "Kise部屋所属・Okinawa-ken, Uruma-shi出身。2026年九州場所9日目を1-7で迎える。"
  },
  {
    "id": "yoshinofuji",
    "apiId": 8857,
    "shikonaKanji": "義ノ富士",
    "furigana": "yoshinofuji",
    "rubyHtml": "義ノ富士",
    "romaji": "Yoshinofuji",
    "givenName": "直哉",
    "rankEn": "Komusubi 1 West",
    "rankJp": "西小結",
    "rankTier": "Komusubi",
    "side": "West",
    "heyaEn": "Isegahama",
    "heyaJp": "Isegahama部屋",
    "originEn": "Kumamoto-ken, Uto-shi",
    "originJp": "Kumamoto-ken, Uto-shi",
    "heightCm": 185,
    "weightKg": 162,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Isegahama stable fundamentals combining forward drive and belt control",
    "styleJp": "Isegahama部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 4-4",
    "currentRecord": "4-4",
    "literalMeaningEn": "義ノ富士 (Yoshinofuji)",
    "literalMeaningJp": "義ノ富士の四股名",
    "kanjiBreakdown": [
      {
        "char": "義",
        "reading": "Yoshi (ギ / よし)",
        "meaningEn": "Righteousness / Honor",
        "noteEn": "Given by Isegahama-beya to express noble spirit and duty"
      },
      {
        "char": "ノ",
        "reading": "no (の)",
        "meaningEn": "Of (katakana connector)",
        "noteEn": "Traditional katakana linking particle in classic shikona"
      },
      {
        "char": "富",
        "reading": "Fu (フ / とみ)",
        "meaningEn": "Wealth / Abundant",
        "noteEn": "First half of Mount Fuji (富士), signature suffix of Isegahama-beya"
      },
      {
        "char": "士",
        "reading": "Ji (シ / さむらい)",
        "meaningEn": "Warrior / Samurai",
        "noteEn": "Completes Fuji (富士), honoring 63rd Yokozuna Asahifuji"
      }
    ],
    "storyEn": "Yoshinofuji (義ノ富士) competes out of Isegahama stable from Kumamoto-ken, Uto-shi, entering Day 9 of the 2026 Kyushu Basho at 4-4.",
    "storyJp": "Isegahama部屋所属・Kumamoto-ken, Uto-shi出身。2026年九州場所9日目を4-4で迎える。"
  },
  {
    "id": "asanoyama",
    "apiId": 2,
    "shikonaKanji": "朝乃山",
    "furigana": "asanoyama",
    "rubyHtml": "朝乃山",
    "romaji": "Asanoyama",
    "givenName": "広暉",
    "rankEn": "Maegashira 1 East",
    "rankJp": "東前頭1枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Takasago",
    "heyaJp": "Takasago部屋",
    "originEn": "Toyama-ken, Toyama-shi",
    "originJp": "Toyama-ken, Toyama-shi",
    "heightCm": 188,
    "weightKg": 172,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Takasago stable fundamentals combining forward drive and belt control",
    "styleJp": "Takasago部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 4-4",
    "currentRecord": "4-4",
    "literalMeaningEn": "朝乃山 (Asanoyama)",
    "literalMeaningJp": "朝乃山の四股名",
    "kanjiBreakdown": [
      {
        "char": "朝",
        "reading": "Asa (チョウ / あさ)",
        "meaningEn": "Morning / Dawn",
        "noteEn": "Signature prefix of Takasago-beya (Asashio, Asashōryū, Asanoyama)"
      },
      {
        "char": "乃",
        "reading": "no (ノ)",
        "meaningEn": "Of (possessive kanji)",
        "noteEn": "Classical kanji particle bridging 'Morning' and 'Mountain'"
      },
      {
        "char": "山",
        "reading": "Yama (サン / やま)",
        "meaningEn": "Mountain",
        "noteEn": "Symbolizes immovable stability like a mountain peak"
      }
    ],
    "storyEn": "Asanoyama (朝乃山) competes out of Takasago stable from Toyama-ken, Toyama-shi, entering Day 9 of the 2026 Kyushu Basho at 4-4.",
    "storyJp": "Takasago部屋所属・Toyama-ken, Toyama-shi出身。2026年九州場所9日目を4-4で迎える。"
  },
  {
    "id": "fujiryoga",
    "apiId": 9051,
    "shikonaKanji": "藤凌駕",
    "furigana": "fujiryoga",
    "rubyHtml": "藤凌駕",
    "romaji": "Fujiryoga",
    "givenName": "雅治",
    "rankEn": "Maegashira 1 West",
    "rankJp": "西前頭1枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Fujishima",
    "heyaJp": "Fujishima部屋",
    "originEn": "Aichi",
    "originJp": "Aichi",
    "heightCm": 180,
    "weightKg": 184,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Fujishima stable fundamentals combining forward drive and belt control",
    "styleJp": "Fujishima部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 5-3",
    "currentRecord": "5-3",
    "literalMeaningEn": "藤凌駕 (Fujiryoga)",
    "literalMeaningJp": "藤凌駕の四股名",
    "kanjiBreakdown": [
      {
        "char": "藤",
        "reading": "Fuji (トウ / ふじ)",
        "meaningEn": "Wisteria",
        "noteEn": "Signature character of Fujishima-beya or Isegahama-connected names"
      },
      {
        "char": "凌",
        "reading": "Ryō (リョウ / しのぐ)",
        "meaningEn": "Surpass / Endure",
        "noteEn": "To rise above and overcome every rival on the dohyō"
      },
      {
        "char": "駕",
        "reading": "Ga (ガ / が)",
        "meaningEn": "Outstrip / Excel",
        "noteEn": "Together 'Ryōga' (凌駕) means 'to outshine and surpass all others'"
      }
    ],
    "storyEn": "Fujiryoga (藤凌駕) competes out of Fujishima stable from Aichi, entering Day 9 of the 2026 Kyushu Basho at 5-3.",
    "storyJp": "Fujishima部屋所属・Aichi出身。2026年九州場所9日目を5-3で迎える。"
  },
  {
    "id": "ura",
    "apiId": 28,
    "shikonaKanji": "宇良",
    "furigana": "うら",
    "rubyHtml": "<ruby>宇<rt>う</rt></ruby><ruby>良<rt>ら</rt></ruby>",
    "romaji": "Ura",
    "givenName": "和輝",
    "rankEn": "Maegashira 2 East",
    "rankJp": "東前頭2枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Kise",
    "heyaJp": "Kise部屋",
    "originEn": "Osaka-fu, Neyagawa-shi",
    "originJp": "Osaka-fu, Neyagawa-shi",
    "heightCm": 173,
    "weightKg": 138,
    "styleCode": "Acrobatic / Trickster",
    "styleEn": "Ultra-low stance, leg picks (Ashitori), rare backward drops (Izori) & pink mawashi",
    "styleJp": "超低姿勢・足取り・居反りなど多彩な奇襲",
    "signatureMoves": [
      "Oshidashi",
      "Ashitori",
      "Izori"
    ],
    "makuuchiYusho": 0,
    "sansho": "2 (Gino 2)",
    "kinboshi": 3,
    "careerRecord": "2026 Kyushu: 2-6",
    "currentRecord": "2-6",
    "literalMeaningEn": "Ura (Real Surname: Good Universe)",
    "literalMeaningJp": "宇良（本名の姓をそのまま四股名に）",
    "kanjiBreakdown": [
      {
        "char": "宇",
        "reading": "U (ウ / う)",
        "meaningEn": "Universe / Eaves",
        "noteEn": "His real family surname, kept unchanged in the top division"
      },
      {
        "char": "良",
        "reading": "Ra (リョウ / よい)",
        "meaningEn": "Good / Virtuous",
        "noteEn": "Completes his surname Ura (宇良), beloved by fans nationwide"
      }
    ],
    "storyEn": "Sumo's beloved pink-mawashi acrobat and former Greco-Roman collegiate wrestler. Every Ura bout promises unpredictable angles and crowd gasps.",
    "storyJp": "ピンクの締め込みでお馴染みの大人気技巧派。レスリング仕込みの超低空戦法と珍しい決まり手で館内を沸かせる。"
  },
  {
    "id": "fujiseiun",
    "apiId": 82,
    "shikonaKanji": "藤青雲",
    "furigana": "fujiseiun",
    "rubyHtml": "藤青雲",
    "romaji": "Fujiseiun",
    "givenName": "龍輝",
    "rankEn": "Maegashira 2 West",
    "rankJp": "西前頭2枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Fujishima",
    "heyaJp": "Fujishima部屋",
    "originEn": "Saitama-ken, Asaka-shi - Kumamoto-ken, Kumamoto-shi, Nishi-ku",
    "originJp": "Saitama-ken, Asaka-shi - Kumamoto-ken, Kumamoto-shi, Nishi-ku",
    "heightCm": 185,
    "weightKg": 149,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Fujishima stable fundamentals combining forward drive and belt control",
    "styleJp": "Fujishima部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 4-4",
    "currentRecord": "4-4",
    "literalMeaningEn": "藤青雲 (Fujiseiun)",
    "literalMeaningJp": "藤青雲の四股名",
    "kanjiBreakdown": [
      {
        "char": "藤",
        "reading": "Fuji (トウ / ふじ)",
        "meaningEn": "Wisteria",
        "noteEn": "Signature character of Fujishima-beya or Isegahama-connected names"
      },
      {
        "char": "青",
        "reading": "Sei (セイ / あお)",
        "meaningEn": "Blue / Azure",
        "noteEn": "Great Azure Mountain (Daiseizan 大青山)"
      },
      {
        "char": "雲",
        "reading": "Un (ウン / くも)",
        "meaningEn": "Cloud",
        "noteEn": "Evokes soaring above the clouds with Fujishima-beya's 'Fuji' prefix"
      }
    ],
    "storyEn": "Fujiseiun (藤青雲) competes out of Fujishima stable from Saitama-ken, Asaka-shi - Kumamoto-ken, Kumamoto-shi, Nishi-ku, entering Day 9 of the 2026 Kyushu Basho at 4-4.",
    "storyJp": "Fujishima部屋所属・Saitama-ken, Asaka-shi - Kumamoto-ken, Kumamoto-shi, Nishi-ku出身。2026年九州場所9日目を4-4で迎える。"
  },
  {
    "id": "takayasu",
    "apiId": 44,
    "shikonaKanji": "高安",
    "furigana": "takayasu",
    "rubyHtml": "高安",
    "romaji": "Takayasu",
    "givenName": "晃",
    "rankEn": "Maegashira 3 East",
    "rankJp": "東前頭3枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Tagonoura",
    "heyaJp": "Tagonoura部屋",
    "originEn": "Ibaraki-ken, Tsuchiura-shi",
    "originJp": "Ibaraki-ken, Tsuchiura-shi",
    "heightCm": 188,
    "weightKg": 173,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Tagonoura stable fundamentals combining forward drive and belt control",
    "styleJp": "Tagonoura部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 2-6",
    "currentRecord": "2-6",
    "literalMeaningEn": "高安 (Takayasu)",
    "literalMeaningJp": "高安の四股名",
    "kanjiBreakdown": [
      {
        "char": "高",
        "reading": "Taka (コウ / たかい)",
        "meaningEn": "Tall / High",
        "noteEn": "His real family surname Takayasu, signifying lofty stature"
      },
      {
        "char": "安",
        "reading": "Yasu (アン / やすい)",
        "meaningEn": "Steady / Peaceful",
        "noteEn": "Completes his surname Takayasu (高安)"
      }
    ],
    "storyEn": "Takayasu (高安) competes out of Tagonoura stable from Ibaraki-ken, Tsuchiura-shi, entering Day 9 of the 2026 Kyushu Basho at 2-6.",
    "storyJp": "Tagonoura部屋所属・Ibaraki-ken, Tsuchiura-shi出身。2026年九州場所9日目を2-6で迎える。"
  },
  {
    "id": "hakunofuji",
    "apiId": 3,
    "shikonaKanji": "伯乃富士",
    "furigana": "hakunofuji",
    "rubyHtml": "伯乃富士",
    "romaji": "Hakunofuji",
    "givenName": "哲也",
    "rankEn": "Maegashira 3 West",
    "rankJp": "西前頭3枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Isegahama",
    "heyaJp": "Isegahama部屋",
    "originEn": "Tottori-ken, Kurayoshi-shi",
    "originJp": "Tottori-ken, Kurayoshi-shi",
    "heightCm": 181,
    "weightKg": 162,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Isegahama stable fundamentals combining forward drive and belt control",
    "styleJp": "Isegahama部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 3-5",
    "currentRecord": "3-5",
    "literalMeaningEn": "伯乃富士 (Hakunofuji)",
    "literalMeaningJp": "伯乃富士の四股名",
    "kanjiBreakdown": [
      {
        "char": "伯",
        "reading": "Haku (ハク)",
        "meaningEn": "Count / Leader / Tottori",
        "noteEn": "From Hōki (伯耆), the historic province of his Tottori hometown"
      },
      {
        "char": "乃",
        "reading": "no (ノ)",
        "meaningEn": "Of (possessive kanji)",
        "noteEn": "Classical kanji particle bridging 'Morning' and 'Mountain'"
      },
      {
        "char": "富",
        "reading": "Fu (フ / とみ)",
        "meaningEn": "Wealth / Abundant",
        "noteEn": "First half of Mount Fuji (富士), signature suffix of Isegahama-beya"
      },
      {
        "char": "士",
        "reading": "Ji (シ / さむらい)",
        "meaningEn": "Warrior / Samurai",
        "noteEn": "Completes Fuji (富士), honoring 63rd Yokozuna Asahifuji"
      }
    ],
    "storyEn": "Hakunofuji (伯乃富士) competes out of Isegahama stable from Tottori-ken, Kurayoshi-shi, entering Day 9 of the 2026 Kyushu Basho at 3-5.",
    "storyJp": "Isegahama部屋所属・Tottori-ken, Kurayoshi-shi出身。2026年九州場所9日目を3-5で迎える。"
  },
  {
    "id": "takerufuji",
    "apiId": 5,
    "shikonaKanji": "尊富士",
    "furigana": "takerufuji",
    "rubyHtml": "尊富士",
    "romaji": "Takerufuji",
    "givenName": "弥輝也",
    "rankEn": "Maegashira 4 East",
    "rankJp": "東前頭4枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Isegahama",
    "heyaJp": "Isegahama部屋",
    "originEn": "Aomori-ken, Goshogawara-shi",
    "originJp": "Aomori-ken, Goshogawara-shi",
    "heightCm": 186,
    "weightKg": 149,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Isegahama stable fundamentals combining forward drive and belt control",
    "styleJp": "Isegahama部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 2-6",
    "currentRecord": "2-6",
    "literalMeaningEn": "尊富士 (Takerufuji)",
    "literalMeaningJp": "尊富士の四股名",
    "kanjiBreakdown": [
      {
        "char": "尊",
        "reading": "Takeru (ソン / たける)",
        "meaningEn": "Noble / Revered",
        "noteEn": "Derived from Yamato Takeru, legendary ancient Japanese warrior"
      },
      {
        "char": "富",
        "reading": "Fu (フ / とみ)",
        "meaningEn": "Wealth / Abundant",
        "noteEn": "First half of Mount Fuji (富士), signature suffix of Isegahama-beya"
      },
      {
        "char": "士",
        "reading": "Ji (シ / さむらい)",
        "meaningEn": "Warrior / Samurai",
        "noteEn": "Completes Fuji (富士), honoring 63rd Yokozuna Asahifuji"
      }
    ],
    "storyEn": "Takerufuji (尊富士) competes out of Isegahama stable from Aomori-ken, Goshogawara-shi, entering Day 9 of the 2026 Kyushu Basho at 2-6.",
    "storyJp": "Isegahama部屋所属・Aomori-ken, Goshogawara-shi出身。2026年九州場所9日目を2-6で迎える。"
  },
  {
    "id": "daieisho",
    "apiId": 9,
    "shikonaKanji": "大栄翔",
    "furigana": "daieisho",
    "rubyHtml": "大栄翔",
    "romaji": "Daieisho",
    "givenName": "勇人",
    "rankEn": "Maegashira 4 West",
    "rankJp": "西前頭4枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Oitekaze",
    "heyaJp": "Oitekaze部屋",
    "originEn": "Saitama-ken, Asaka-shi",
    "originJp": "Saitama-ken, Asaka-shi",
    "heightCm": 182,
    "weightKg": 163,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Oitekaze stable fundamentals combining forward drive and belt control",
    "styleJp": "Oitekaze部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 2-6",
    "currentRecord": "2-6",
    "literalMeaningEn": "大栄翔 (Daieisho)",
    "literalMeaningJp": "大栄翔の四股名",
    "kanjiBreakdown": [
      {
        "char": "大",
        "reading": "Dai / Ō (ダイ / おお)",
        "meaningEn": "Great / Large",
        "noteEn": "Bold opening character symbolizing explosive power"
      },
      {
        "char": "栄",
        "reading": "Ei (エイ / さかえる)",
        "meaningEn": "Prosperity / Glory",
        "noteEn": "Signifies flourishing success on the dohyō"
      },
      {
        "char": "翔",
        "reading": "Shō (ショウ / かける)",
        "meaningEn": "Soar / Fly",
        "noteEn": "Shared with Oitekaze-beya lineage (Endō, Tobizaru, Daieishō)"
      }
    ],
    "storyEn": "Daieisho (大栄翔) competes out of Oitekaze stable from Saitama-ken, Asaka-shi, entering Day 9 of the 2026 Kyushu Basho at 2-6.",
    "storyJp": "Oitekaze部屋所属・Saitama-ken, Asaka-shi出身。2026年九州場所9日目を2-6で迎える。"
  },
  {
    "id": "hiradoumi",
    "apiId": 24,
    "shikonaKanji": "平戸海",
    "furigana": "hiradoumi",
    "rubyHtml": "平戸海",
    "romaji": "Hiradoumi",
    "givenName": "雄貴",
    "rankEn": "Maegashira 5 East",
    "rankJp": "東前頭5枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Sakaigawa",
    "heyaJp": "Sakaigawa部屋",
    "originEn": "Nagasaki-ken, Hirado-shi",
    "originJp": "Nagasaki-ken, Hirado-shi",
    "heightCm": 178,
    "weightKg": 142,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Sakaigawa stable fundamentals combining forward drive and belt control",
    "styleJp": "Sakaigawa部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 2-6",
    "currentRecord": "2-6",
    "literalMeaningEn": "平戸海 (Hiradoumi)",
    "literalMeaningJp": "平戸海の四股名",
    "kanjiBreakdown": [
      {
        "char": "平",
        "reading": "Hira (ヘイ / ひら)",
        "meaningEn": "Flat / Peaceful",
        "noteEn": "First kanji of his island hometown Hirado (平戸), Nagasaki"
      },
      {
        "char": "戸",
        "reading": "Do (コ / と)",
        "meaningEn": "Door / Strait",
        "noteEn": "Second kanji of Hirado, gateway to the East China Sea"
      },
      {
        "char": "海",
        "reading": "Mi / Umi (カイ / うみ)",
        "meaningEn": "Sea / Ocean",
        "noteEn": "Second character of Atami; evokes coastal strength & fluidity"
      }
    ],
    "storyEn": "Hiradoumi (平戸海) competes out of Sakaigawa stable from Nagasaki-ken, Hirado-shi, entering Day 9 of the 2026 Kyushu Basho at 2-6.",
    "storyJp": "Sakaigawa部屋所属・Nagasaki-ken, Hirado-shi出身。2026年九州場所9日目を2-6で迎える。"
  },
  {
    "id": "gonoyama",
    "apiId": 56,
    "shikonaKanji": "豪ノ山",
    "furigana": "gonoyama",
    "rubyHtml": "豪ノ山",
    "romaji": "Gonoyama",
    "givenName": "登輝",
    "rankEn": "Maegashira 5 West",
    "rankJp": "西前頭5枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Takekuma",
    "heyaJp": "Takekuma部屋",
    "originEn": "Osaka-fu, Neyagawa-shi",
    "originJp": "Osaka-fu, Neyagawa-shi",
    "heightCm": 178,
    "weightKg": 163,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Takekuma stable fundamentals combining forward drive and belt control",
    "styleJp": "Takekuma部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 3-5",
    "currentRecord": "3-5",
    "literalMeaningEn": "豪ノ山 (Gonoyama)",
    "literalMeaningJp": "豪ノ山の四股名",
    "kanjiBreakdown": [
      {
        "char": "豪",
        "reading": "Gō (ゴウ)",
        "meaningEn": "Mighty / Heroic",
        "noteEn": "Reflects fearless, bull-like forward charging power"
      },
      {
        "char": "ノ",
        "reading": "no (の)",
        "meaningEn": "Of (katakana connector)",
        "noteEn": "Traditional katakana linking particle in classic shikona"
      },
      {
        "char": "山",
        "reading": "Yama (サン / やま)",
        "meaningEn": "Mountain",
        "noteEn": "Symbolizes immovable stability like a mountain peak"
      }
    ],
    "storyEn": "Gonoyama (豪ノ山) competes out of Takekuma stable from Osaka-fu, Neyagawa-shi, entering Day 9 of the 2026 Kyushu Basho at 3-5.",
    "storyJp": "Takekuma部屋所属・Osaka-fu, Neyagawa-shi出身。2026年九州場所9日目を3-5で迎える。"
  },
  {
    "id": "kotoshoho",
    "apiId": 8,
    "shikonaKanji": "琴勝峰",
    "furigana": "kotoshoho",
    "rubyHtml": "琴勝峰",
    "romaji": "Kotoshoho",
    "givenName": "吉成",
    "rankEn": "Maegashira 6 East",
    "rankJp": "東前頭6枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Sadogatake",
    "heyaJp": "Sadogatake部屋",
    "originEn": "Chiba-ken, Kashiwa-shi",
    "originJp": "Chiba-ken, Kashiwa-shi",
    "heightCm": 189,
    "weightKg": 170,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Sadogatake stable fundamentals combining forward drive and belt control",
    "styleJp": "Sadogatake部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 5-3",
    "currentRecord": "5-3",
    "literalMeaningEn": "琴勝峰 (Kotoshoho)",
    "literalMeaningJp": "琴勝峰の四股名",
    "kanjiBreakdown": [
      {
        "char": "琴",
        "reading": "Koto (キン / こと)",
        "meaningEn": "Japanese Harp (Koto)",
        "noteEn": "Signature prefix of Sadogatake-beya, founded by ex-Sekiwake Kotonishiki"
      },
      {
        "char": "勝",
        "reading": "Shō (ショウ / かつ)",
        "meaningEn": "Victory / Triumph",
        "noteEn": "Represents winning spirit; shared across Sadogatake & Naruto stables"
      },
      {
        "char": "峰",
        "reading": "Hō / Mine (ホウ / みね)",
        "meaningEn": "Peak / Summit",
        "noteEn": "Aspiration to reach the highest mountain peak"
      }
    ],
    "storyEn": "Kotoshoho (琴勝峰) competes out of Sadogatake stable from Chiba-ken, Kashiwa-shi, entering Day 9 of the 2026 Kyushu Basho at 5-3.",
    "storyJp": "Sadogatake部屋所属・Chiba-ken, Kashiwa-shi出身。2026年九州場所9日目を5-3で迎える。"
  },
  {
    "id": "wakamotoharu",
    "apiId": 13,
    "shikonaKanji": "若元春",
    "furigana": "わかもとはる",
    "rubyHtml": "<ruby>若<rt>わか</rt></ruby><ruby>元<rt>もと</rt></ruby><ruby>春<rt>はる</rt></ruby>",
    "romaji": "Wakamotoharu",
    "givenName": "港",
    "rankEn": "Maegashira 7 East",
    "rankJp": "東前頭7枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Arashio",
    "heyaJp": "Arashio部屋",
    "originEn": "Fukushima-ken, Fukushima-shi",
    "originJp": "Fukushima-ken, Fukushima-shi",
    "heightCm": 186,
    "weightKg": 149,
    "styleCode": "Hidari-yotsu / Belt",
    "styleEn": "Rock-solid left-hand inside grip, strong upper-body balance & yorikiri",
    "styleJp": "左四つ・力強い寄り切り",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi",
      "Uwatenage"
    ],
    "makuuchiYusho": 0,
    "sansho": "2 (Gino 1, Shukun 1)",
    "kinboshi": 2,
    "careerRecord": "2026 Kyushu: 7-1",
    "currentRecord": "7-1",
    "literalMeaningEn": "Young Origin Spring",
    "literalMeaningJp": "若き元春（毛利元就「三本の矢」の次男）",
    "kanjiBreakdown": [
      {
        "char": "若",
        "reading": "Waka (ジャク / わかい)",
        "meaningEn": "Young",
        "noteEn": "Honors his grandfather, former Komusubi Wakabayama (若葉山)"
      },
      {
        "char": "元",
        "reading": "Moto (ゲン / もと)",
        "meaningEn": "Origin / Foundation",
        "noteEn": "Taken from the famous 'Mōri Motonari' three-arrows brotherhood story"
      },
      {
        "char": "春",
        "reading": "Haru (シュン / はる)",
        "meaningEn": "Spring",
        "noteEn": "Middle brother of the three Onami brothers (Haru, Taka, Kage)"
      }
    ],
    "storyEn": "Middle of the famous Onami three-brothers trio, tearing up the 2026 Kyushu Basho at 7-1 from Maegashira 7 East!",
    "storyJp": "大波三兄弟の次男。2026年九州場所は東前頭7枚目から7勝1敗の快進撃で優勝戦線に名乗り。"
  },
  {
    "id": "kinbozan",
    "apiId": 50,
    "shikonaKanji": "金峰山",
    "furigana": "きんぼうざん",
    "rubyHtml": "<ruby>金<rt>きん</rt></ruby><ruby>峰<rt>ぼう</rt></ruby><ruby>山<rt>ざん</rt></ruby>",
    "romaji": "Kinbozan",
    "givenName": "晴樹",
    "rankEn": "Maegashira 7 West",
    "rankJp": "西前頭7枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Kise",
    "heyaJp": "Kise部屋",
    "originEn": "Kazakhstan, Almaty",
    "originJp": "Kazakhstan, Almaty",
    "heightCm": 194,
    "weightKg": 181,
    "styleCode": "Oshi-zumo / Long Reach",
    "styleEn": "Towering 195cm frame, punishing thrusting & heavy belt pressure",
    "styleJp": "長身を活かした突き押し・寄り",
    "signatureMoves": [
      "Oshidashi",
      "Yorikiri",
      "Hatakikomi"
    ],
    "makuuchiYusho": 0,
    "sansho": "2 (Kanto 2)",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 7-1",
    "currentRecord": "7-1",
    "literalMeaningEn": "Golden Peak Mountain",
    "literalMeaningJp": "金の峰の山（熊本・金峰山に因む）",
    "kanjiBreakdown": [
      {
        "char": "金",
        "reading": "Kin (キン / かね)",
        "meaningEn": "Gold",
        "noteEn": "Symbolizes golden strength and brilliance"
      },
      {
        "char": "峰",
        "reading": "Hō / Mine (ホウ / みね)",
        "meaningEn": "Peak / Summit",
        "noteEn": "Aspiration to reach the highest mountain peak"
      },
      {
        "char": "山",
        "reading": "Yama (サン / やま)",
        "meaningEn": "Mountain",
        "noteEn": "Symbolizes immovable stability like a mountain peak"
      }
    ],
    "storyEn": "Kazakhstan's first sekitori, standing 195cm tall and surging at 7-1 in Fukuoka alongside the leaders.",
    "storyJp": "カザフスタン出身初の関取。195cmの長身からの突き押しを武器に7勝1敗で首位タイを走る。"
  },
  {
    "id": "roga",
    "apiId": 55,
    "shikonaKanji": "狼雅",
    "furigana": "roga",
    "rubyHtml": "狼雅",
    "romaji": "Roga",
    "givenName": "外喜義",
    "rankEn": "Maegashira 8 East",
    "rankJp": "東前頭8枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Futagoyama",
    "heyaJp": "Futagoyama部屋",
    "originEn": "Russia",
    "originJp": "Russia",
    "heightCm": 185,
    "weightKg": 159,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Futagoyama stable fundamentals combining forward drive and belt control",
    "styleJp": "Futagoyama部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 5-3",
    "currentRecord": "5-3",
    "literalMeaningEn": "狼雅 (Roga)",
    "literalMeaningJp": "狼雅の四股名",
    "kanjiBreakdown": [
      {
        "char": "狼",
        "reading": "Rō (ロウ / おおかみ)",
        "meaningEn": "Wolf",
        "noteEn": "Fierce wolf spirit of his Futagoyama-beya shikona"
      },
      {
        "char": "雅",
        "reading": "Ga (ガ / みやび)",
        "meaningEn": "Grace / Elegance",
        "noteEn": "Refined technique paired with wolf-like intensity"
      }
    ],
    "storyEn": "Roga (狼雅) competes out of Futagoyama stable from Russia, entering Day 9 of the 2026 Kyushu Basho at 5-3.",
    "storyJp": "Futagoyama部屋所属・Russia出身。2026年九州場所9日目を5-3で迎える。"
  },
  {
    "id": "nishikifuji",
    "apiId": 40,
    "shikonaKanji": "錦富士",
    "furigana": "nishikifuji",
    "rubyHtml": "錦富士",
    "romaji": "Nishikifuji",
    "givenName": "隆聖",
    "rankEn": "Maegashira 8 West",
    "rankJp": "西前頭8枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Isegahama",
    "heyaJp": "Isegahama部屋",
    "originEn": "Aomori-ken, Towada-shi",
    "originJp": "Aomori-ken, Towada-shi",
    "heightCm": 184,
    "weightKg": 155,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Isegahama stable fundamentals combining forward drive and belt control",
    "styleJp": "Isegahama部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 5-3",
    "currentRecord": "5-3",
    "literalMeaningEn": "錦富士 (Nishikifuji)",
    "literalMeaningJp": "錦富士の四股名",
    "kanjiBreakdown": [
      {
        "char": "錦",
        "reading": "Nishiki (キン / にしき)",
        "meaningEn": "Brocade",
        "noteEn": "Richly woven traditional beauty; Isegahama-beya's Nishikifuji"
      },
      {
        "char": "富",
        "reading": "Fu (フ / とみ)",
        "meaningEn": "Wealth / Abundant",
        "noteEn": "First half of Mount Fuji (富士), signature suffix of Isegahama-beya"
      },
      {
        "char": "士",
        "reading": "Ji (シ / さむらい)",
        "meaningEn": "Warrior / Samurai",
        "noteEn": "Completes Fuji (富士), honoring 63rd Yokozuna Asahifuji"
      }
    ],
    "storyEn": "Nishikifuji (錦富士) competes out of Isegahama stable from Aomori-ken, Towada-shi, entering Day 9 of the 2026 Kyushu Basho at 5-3.",
    "storyJp": "Isegahama部屋所属・Aomori-ken, Towada-shi出身。2026年九州場所9日目を5-3で迎える。"
  },
  {
    "id": "oshoma",
    "apiId": 61,
    "shikonaKanji": "欧勝馬",
    "furigana": "oshoma",
    "rubyHtml": "欧勝馬",
    "romaji": "Oshoma",
    "givenName": "出気",
    "rankEn": "Maegashira 9 East",
    "rankJp": "東前頭9枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Naruto",
    "heyaJp": "Naruto部屋",
    "originEn": "Mongolia, Töv",
    "originJp": "Mongolia, Töv",
    "heightCm": 190,
    "weightKg": 162,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Naruto stable fundamentals combining forward drive and belt control",
    "styleJp": "Naruto部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 5-3",
    "currentRecord": "5-3",
    "literalMeaningEn": "欧勝馬 (Oshoma)",
    "literalMeaningJp": "欧勝馬の四股名",
    "kanjiBreakdown": [
      {
        "char": "欧",
        "reading": "Ō (オウ)",
        "meaningEn": "Europe / Eurasia",
        "noteEn": "Chosen by Naruto-beya (ex-Ozeki Kotooshu) to honor Eurasian roots"
      },
      {
        "char": "勝",
        "reading": "Shō (ショウ / かつ)",
        "meaningEn": "Victory / Triumph",
        "noteEn": "Represents winning spirit; shared across Sadogatake & Naruto stables"
      },
      {
        "char": "馬",
        "reading": "Ma (バ / うま)",
        "meaningEn": "Horse",
        "noteEn": "Honors his native Mongolia's equestrian heritage"
      }
    ],
    "storyEn": "Oshoma (欧勝馬) competes out of Naruto stable from Mongolia, Töv, entering Day 9 of the 2026 Kyushu Basho at 5-3.",
    "storyJp": "Naruto部屋所属・Mongolia, Töv出身。2026年九州場所9日目を5-3で迎える。"
  },
  {
    "id": "asakoryu",
    "apiId": 164,
    "shikonaKanji": "朝紅龍",
    "furigana": "asakoryu",
    "rubyHtml": "朝紅龍",
    "romaji": "Asakoryu",
    "givenName": "琢馬",
    "rankEn": "Maegashira 9 West",
    "rankJp": "西前頭9枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Takasago",
    "heyaJp": "Takasago部屋",
    "originEn": "Osaka-fu, Shijonawate-shi",
    "originJp": "Osaka-fu, Shijonawate-shi",
    "heightCm": 178,
    "weightKg": 122,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Takasago stable fundamentals combining forward drive and belt control",
    "styleJp": "Takasago部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 1-7",
    "currentRecord": "1-7",
    "literalMeaningEn": "朝紅龍 (Asakoryu)",
    "literalMeaningJp": "朝紅龍の四股名",
    "kanjiBreakdown": [
      {
        "char": "朝",
        "reading": "Asa (チョウ / あさ)",
        "meaningEn": "Morning / Dawn",
        "noteEn": "Signature prefix of Takasago-beya (Asashio, Asashōryū, Asanoyama)"
      },
      {
        "char": "紅",
        "reading": "Kō (コウ / くれない)",
        "meaningEn": "Crimson",
        "noteEn": "Blazing crimson fighting spirit in Takasago-beya"
      },
      {
        "char": "龍",
        "reading": "Ryū (リュウ / たつ)",
        "meaningEn": "Dragon",
        "noteEn": "Mythical symbol of strength & speed; shared with uncle Asashōryū"
      }
    ],
    "storyEn": "Asakoryu (朝紅龍) competes out of Takasago stable from Osaka-fu, Shijonawate-shi, entering Day 9 of the 2026 Kyushu Basho at 1-7.",
    "storyJp": "Takasago部屋所属・Osaka-fu, Shijonawate-shi出身。2026年九州場所9日目を1-7で迎える。"
  },
  {
    "id": "shishi",
    "apiId": 86,
    "shikonaKanji": "獅司",
    "furigana": "shishi",
    "rubyHtml": "獅司",
    "romaji": "Shishi",
    "givenName": "大",
    "rankEn": "Maegashira 10 East",
    "rankJp": "東前頭10枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Ikazuchi",
    "heyaJp": "Ikazuchi部屋",
    "originEn": "Ukraine, Zaporizhia Oblast",
    "originJp": "Ukraine, Zaporizhia Oblast",
    "heightCm": 193,
    "weightKg": 182,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Ikazuchi stable fundamentals combining forward drive and belt control",
    "styleJp": "Ikazuchi部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 0-8",
    "currentRecord": "0-8",
    "literalMeaningEn": "獅司 (Shishi)",
    "literalMeaningJp": "獅司の四股名",
    "kanjiBreakdown": [
      {
        "char": "獅",
        "reading": "Shi (シ)",
        "meaningEn": "Lion",
        "noteEn": "Fearless lion symbolizing his Ukrainian strength"
      },
      {
        "char": "司",
        "reading": "Shi (シ / つかさ)",
        "meaningEn": "Commander / Leader",
        "noteEn": "Commanding presence in the ring"
      }
    ],
    "storyEn": "Shishi (獅司) competes out of Ikazuchi stable from Ukraine, Zaporizhia Oblast, entering Day 9 of the 2026 Kyushu Basho at 0-8.",
    "storyJp": "Ikazuchi部屋所属・Ukraine, Zaporizhia Oblast出身。2026年九州場所9日目を0-8で迎える。"
  },
  {
    "id": "oho",
    "apiId": 41,
    "shikonaKanji": "王鵬",
    "furigana": "oho",
    "rubyHtml": "王鵬",
    "romaji": "Oho",
    "givenName": "幸之介",
    "rankEn": "Maegashira 10 West",
    "rankJp": "西前頭10枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Otake",
    "heyaJp": "Otake部屋",
    "originEn": "Tokyo-to, Koto-ku",
    "originJp": "Tokyo-to, Koto-ku",
    "heightCm": 192,
    "weightKg": 185,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Otake stable fundamentals combining forward drive and belt control",
    "styleJp": "Otake部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 5-3",
    "currentRecord": "5-3",
    "literalMeaningEn": "王鵬 (Oho)",
    "literalMeaningJp": "王鵬の四股名",
    "kanjiBreakdown": [
      {
        "char": "王",
        "reading": "Ō (オウ / おう)",
        "meaningEn": "King",
        "noteEn": "Evokes 'King' and honors his grandfather, Shōwa legend Taihō (大鵬)"
      },
      {
        "char": "鵬",
        "reading": "Hō (ホウ)",
        "meaningEn": "Mythical Giant Bird (Peng)",
        "noteEn": "Directly inherited from his grandfather, 48th Yokozuna Taihō (大鵬)"
      }
    ],
    "storyEn": "Oho (王鵬) competes out of Otake stable from Tokyo-to, Koto-ku, entering Day 9 of the 2026 Kyushu Basho at 5-3.",
    "storyJp": "Otake部屋所属・Tokyo-to, Koto-ku出身。2026年九州場所9日目を5-3で迎える。"
  },
  {
    "id": "takanosho",
    "apiId": 37,
    "shikonaKanji": "隆の勝",
    "furigana": "takanosho",
    "rubyHtml": "隆の勝",
    "romaji": "Takanosho",
    "givenName": "伸明",
    "rankEn": "Maegashira 11 East",
    "rankJp": "東前頭11枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Minatogawa",
    "heyaJp": "Minatogawa部屋",
    "originEn": "Chiba-ken, Kashiwa-shi",
    "originJp": "Chiba-ken, Kashiwa-shi",
    "heightCm": 184,
    "weightKg": 176,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Minatogawa stable fundamentals combining forward drive and belt control",
    "styleJp": "Minatogawa部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 6-2",
    "currentRecord": "6-2",
    "literalMeaningEn": "隆の勝 (Takanosho)",
    "literalMeaningJp": "隆の勝の四股名",
    "kanjiBreakdown": [
      {
        "char": "隆",
        "reading": "Taka (リュウ)",
        "meaningEn": "Elevated / Prosperous",
        "noteEn": "Noble rise"
      },
      {
        "char": "の",
        "reading": "no (の)",
        "meaningEn": "Of",
        "noteEn": "Connecting particle"
      },
      {
        "char": "勝",
        "reading": "Shō (ショウ / かつ)",
        "meaningEn": "Victory / Triumph",
        "noteEn": "Represents winning spirit; shared across Sadogatake & Naruto stables"
      }
    ],
    "storyEn": "Takanosho (隆の勝) competes out of Minatogawa stable from Chiba-ken, Kashiwa-shi, entering Day 9 of the 2026 Kyushu Basho at 6-2.",
    "storyJp": "Minatogawa部屋所属・Chiba-ken, Kashiwa-shi出身。2026年九州場所9日目を6-2で迎える。"
  },
  {
    "id": "asahakuryu",
    "apiId": 607,
    "shikonaKanji": "朝白龍",
    "furigana": "asahakuryu",
    "rubyHtml": "朝白龍",
    "romaji": "Asahakuryu",
    "givenName": "太郎",
    "rankEn": "Maegashira 11 West",
    "rankJp": "西前頭11枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Takasago",
    "heyaJp": "Takasago部屋",
    "originEn": "Mongolia, Ulaanbaatar",
    "originJp": "Mongolia, Ulaanbaatar",
    "heightCm": 185,
    "weightKg": 157,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Takasago stable fundamentals combining forward drive and belt control",
    "styleJp": "Takasago部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 6-2",
    "currentRecord": "6-2",
    "literalMeaningEn": "朝白龍 (Asahakuryu)",
    "literalMeaningJp": "朝白龍の四股名",
    "kanjiBreakdown": [
      {
        "char": "朝",
        "reading": "Asa (チョウ / あさ)",
        "meaningEn": "Morning / Dawn",
        "noteEn": "Signature prefix of Takasago-beya (Asashio, Asashōryū, Asanoyama)"
      },
      {
        "char": "白",
        "reading": "Haku (ハク / しろ)",
        "meaningEn": "White",
        "noteEn": "Pure white dragon (Hakuryū 白龍) of Takasago-beya"
      },
      {
        "char": "龍",
        "reading": "Ryū (リュウ / たつ)",
        "meaningEn": "Dragon",
        "noteEn": "Mythical symbol of strength & speed; shared with uncle Asashōryū"
      }
    ],
    "storyEn": "Asahakuryu (朝白龍) competes out of Takasago stable from Mongolia, Ulaanbaatar, entering Day 9 of the 2026 Kyushu Basho at 6-2.",
    "storyJp": "Takasago部屋所属・Mongolia, Ulaanbaatar出身。2026年九州場所9日目を6-2で迎える。"
  },
  {
    "id": "ichiyamamoto",
    "apiId": 11,
    "shikonaKanji": "一山本",
    "furigana": "ichiyamamoto",
    "rubyHtml": "一山本",
    "romaji": "Ichiyamamoto",
    "givenName": "大生",
    "rankEn": "Maegashira 12 East",
    "rankJp": "東前頭12枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Hanaregoma",
    "heyaJp": "Hanaregoma部屋",
    "originEn": "Hokkaido, Iwanai-gun, Iwanai-cho",
    "originJp": "Hokkaido, Iwanai-gun, Iwanai-cho",
    "heightCm": 190,
    "weightKg": 160,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Hanaregoma stable fundamentals combining forward drive and belt control",
    "styleJp": "Hanaregoma部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 5-3",
    "currentRecord": "5-3",
    "literalMeaningEn": "一山本 (Ichiyamamoto)",
    "literalMeaningJp": "一山本の四股名",
    "kanjiBreakdown": [
      {
        "char": "一",
        "reading": "Ichi (イチ / ひとつ)",
        "meaningEn": "One / First",
        "noteEn": "Honors his late stablemaster & hometown spirit in Hokkaido"
      },
      {
        "char": "山",
        "reading": "Yama (サン / やま)",
        "meaningEn": "Mountain",
        "noteEn": "Symbolizes immovable stability like a mountain peak"
      },
      {
        "char": "本",
        "reading": "Moto (ホン / もと)",
        "meaningEn": "Origin / Root",
        "noteEn": "His real surname Yamamoto (山本)"
      }
    ],
    "storyEn": "Ichiyamamoto (一山本) competes out of Hanaregoma stable from Hokkaido, Iwanai-gun, Iwanai-cho, entering Day 9 of the 2026 Kyushu Basho at 5-3.",
    "storyJp": "Hanaregoma部屋所属・Hokkaido, Iwanai-gun, Iwanai-cho出身。2026年九州場所9日目を5-3で迎える。"
  },
  {
    "id": "abi",
    "apiId": 22,
    "shikonaKanji": "阿炎",
    "furigana": "abi",
    "rubyHtml": "阿炎",
    "romaji": "Abi",
    "givenName": "政虎",
    "rankEn": "Maegashira 12 West",
    "rankJp": "西前頭12枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Shikoroyama",
    "heyaJp": "Shikoroyama部屋",
    "originEn": "Saitama-ken, Koshigaya-shi",
    "originJp": "Saitama-ken, Koshigaya-shi",
    "heightCm": 186,
    "weightKg": 167,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Shikoroyama stable fundamentals combining forward drive and belt control",
    "styleJp": "Shikoroyama部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 3-5",
    "currentRecord": "3-5",
    "literalMeaningEn": "阿炎 (Abi)",
    "literalMeaningJp": "阿炎の四股名",
    "kanjiBreakdown": [
      {
        "char": "阿",
        "reading": "A (ア)",
        "meaningEn": "Fearless / Pillar",
        "noteEn": "From his mentor Terao / Shikoroyama lineage"
      },
      {
        "char": "炎",
        "reading": "Bi / En (エン / ほのお)",
        "meaningEn": "Flame / Blaze",
        "noteEn": "Blazing, unpredictable tsuppari attack"
      }
    ],
    "storyEn": "Abi (阿炎) competes out of Shikoroyama stable from Saitama-ken, Koshigaya-shi, entering Day 9 of the 2026 Kyushu Basho at 3-5.",
    "storyJp": "Shikoroyama部屋所属・Saitama-ken, Koshigaya-shi出身。2026年九州場所9日目を3-5で迎える。"
  },
  {
    "id": "toshinofuji",
    "apiId": 8866,
    "shikonaKanji": "寿之富士",
    "furigana": "toshinofuji",
    "rubyHtml": "寿之富士",
    "romaji": "Toshinofuji",
    "givenName": "大聖",
    "rankEn": "Maegashira 13 East",
    "rankJp": "東前頭13枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Isegahama",
    "heyaJp": "Isegahama部屋",
    "originEn": "Mongolia, Ulaanbaatar",
    "originJp": "Mongolia, Ulaanbaatar",
    "heightCm": 195,
    "weightKg": 156,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Isegahama stable fundamentals combining forward drive and belt control",
    "styleJp": "Isegahama部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 3-5",
    "currentRecord": "3-5",
    "literalMeaningEn": "寿之富士 (Toshinofuji)",
    "literalMeaningJp": "寿之富士の四股名",
    "kanjiBreakdown": [
      {
        "char": "寿",
        "reading": "Toshi (ジュ / ことぶき)",
        "meaningEn": "Longevity / Auspicious",
        "noteEn": "Auspicious blessing paired with Isegahama's Fuji suffix"
      },
      {
        "char": "之",
        "reading": "之",
        "meaningEn": "Traditional Shikona Character",
        "noteEn": "Part of Isegahama stable ring name"
      },
      {
        "char": "富",
        "reading": "Fu (フ / とみ)",
        "meaningEn": "Wealth / Abundant",
        "noteEn": "First half of Mount Fuji (富士), signature suffix of Isegahama-beya"
      },
      {
        "char": "士",
        "reading": "Ji (シ / さむらい)",
        "meaningEn": "Warrior / Samurai",
        "noteEn": "Completes Fuji (富士), honoring 63rd Yokozuna Asahifuji"
      }
    ],
    "storyEn": "Toshinofuji (寿之富士) competes out of Isegahama stable from Mongolia, Ulaanbaatar, entering Day 9 of the 2026 Kyushu Basho at 3-5.",
    "storyJp": "Isegahama部屋所属・Mongolia, Ulaanbaatar出身。2026年九州場所9日目を3-5で迎える。"
  },
  {
    "id": "asasuiryu",
    "apiId": 8859,
    "shikonaKanji": "朝翠龍",
    "furigana": "asasuiryu",
    "rubyHtml": "朝翠龍",
    "romaji": "Asasuiryu",
    "givenName": "涼馬",
    "rankEn": "Maegashira 13 West",
    "rankJp": "西前頭13枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Takasago",
    "heyaJp": "Takasago部屋",
    "originEn": "Osaka-fu, Shijonawate-shi",
    "originJp": "Osaka-fu, Shijonawate-shi",
    "heightCm": 175,
    "weightKg": 120,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Takasago stable fundamentals combining forward drive and belt control",
    "styleJp": "Takasago部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 3-5",
    "currentRecord": "3-5",
    "literalMeaningEn": "朝翠龍 (Asasuiryu)",
    "literalMeaningJp": "朝翠龍の四股名",
    "kanjiBreakdown": [
      {
        "char": "朝",
        "reading": "Asa (チョウ / あさ)",
        "meaningEn": "Morning / Dawn",
        "noteEn": "Signature prefix of Takasago-beya (Asashio, Asashōryū, Asanoyama)"
      },
      {
        "char": "翠",
        "reading": "Sui / Midori (スイ / みどり)",
        "meaningEn": "Emerald / Kingfisher",
        "noteEn": "Emerald dragon of Takasago-beya"
      },
      {
        "char": "龍",
        "reading": "Ryū (リュウ / たつ)",
        "meaningEn": "Dragon",
        "noteEn": "Mythical symbol of strength & speed; shared with uncle Asashōryū"
      }
    ],
    "storyEn": "Asasuiryu (朝翠龍) competes out of Takasago stable from Osaka-fu, Shijonawate-shi, entering Day 9 of the 2026 Kyushu Basho at 3-5.",
    "storyJp": "Takasago部屋所属・Osaka-fu, Shijonawate-shi出身。2026年九州場所9日目を3-5で迎える。"
  },
  {
    "id": "tokihayate",
    "apiId": 83,
    "shikonaKanji": "時疾風",
    "furigana": "tokihayate",
    "rubyHtml": "時疾風",
    "romaji": "Tokihayate",
    "givenName": "秀喜",
    "rankEn": "Maegashira 14 East",
    "rankJp": "東前頭14枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Tokitsukaze",
    "heyaJp": "Tokitsukaze部屋",
    "originEn": "Miyagi-ken, Kurihara-shi",
    "originJp": "Miyagi-ken, Kurihara-shi",
    "heightCm": 179,
    "weightKg": 135,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Tokitsukaze stable fundamentals combining forward drive and belt control",
    "styleJp": "Tokitsukaze部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 2-6",
    "currentRecord": "2-6",
    "literalMeaningEn": "時疾風 (Tokihayate)",
    "literalMeaningJp": "時疾風の四股名",
    "kanjiBreakdown": [
      {
        "char": "時",
        "reading": "Toki (ジ / とき)",
        "meaningEn": "Time / Era",
        "noteEn": "From Tokitsukaze-beya (時津風部屋)"
      },
      {
        "char": "疾",
        "reading": "Haya (シツ / はやい)",
        "meaningEn": "Swift / Gale",
        "noteEn": "Lightning-fast movement on the dohyō"
      },
      {
        "char": "風",
        "reading": "Te / Kaze (フウ / かぜ)",
        "meaningEn": "Wind",
        "noteEn": "Together 'Hayate' (疾風) means 'gale-force wind'"
      }
    ],
    "storyEn": "Tokihayate (時疾風) competes out of Tokitsukaze stable from Miyagi-ken, Kurihara-shi, entering Day 9 of the 2026 Kyushu Basho at 2-6.",
    "storyJp": "Tokitsukaze部屋所属・Miyagi-ken, Kurihara-shi出身。2026年九州場所9日目を2-6で迎える。"
  },
  {
    "id": "dewanoryu",
    "apiId": 135,
    "shikonaKanji": "出羽ノ龍",
    "furigana": "dewanoryu",
    "rubyHtml": "出羽ノ龍",
    "romaji": "Dewanoryu",
    "givenName": "和希",
    "rankEn": "Maegashira 14 West",
    "rankJp": "西前頭14枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Dewanoumi",
    "heyaJp": "Dewanoumi部屋",
    "originEn": "Mongolia, Ulaanbaatar",
    "originJp": "Mongolia, Ulaanbaatar",
    "heightCm": 181,
    "weightKg": 154,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Dewanoumi stable fundamentals combining forward drive and belt control",
    "styleJp": "Dewanoumi部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 6-2",
    "currentRecord": "6-2",
    "literalMeaningEn": "出羽ノ龍 (Dewanoryu)",
    "literalMeaningJp": "出羽ノ龍の四股名",
    "kanjiBreakdown": [
      {
        "char": "出",
        "reading": "De (シュツ / でる)",
        "meaningEn": "Emerge / Come Forth",
        "noteEn": "First character of historic Dewanoumi-beya (出羽海部屋)"
      },
      {
        "char": "羽",
        "reading": "Wa (ウ / はね)",
        "meaningEn": "Wing / Feather",
        "noteEn": "Second character of Dewanoumi-beya"
      },
      {
        "char": "ノ",
        "reading": "no (の)",
        "meaningEn": "Of (katakana connector)",
        "noteEn": "Traditional katakana linking particle in classic shikona"
      },
      {
        "char": "龍",
        "reading": "Ryū (リュウ / たつ)",
        "meaningEn": "Dragon",
        "noteEn": "Mythical symbol of strength & speed; shared with uncle Asashōryū"
      }
    ],
    "storyEn": "Dewanoryu (出羽ノ龍) competes out of Dewanoumi stable from Mongolia, Ulaanbaatar, entering Day 9 of the 2026 Kyushu Basho at 6-2.",
    "storyJp": "Dewanoumi部屋所属・Mongolia, Ulaanbaatar出身。2026年九州場所9日目を6-2で迎える。"
  },
  {
    "id": "tamawashi",
    "apiId": 14,
    "shikonaKanji": "玉鷲",
    "furigana": "tamawashi",
    "rubyHtml": "玉鷲",
    "romaji": "Tamawashi",
    "givenName": "一朗",
    "rankEn": "Maegashira 15 East",
    "rankJp": "東前頭15枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Kataonami",
    "heyaJp": "Kataonami部屋",
    "originEn": "Mongolia, Ulaanbaatar",
    "originJp": "Mongolia, Ulaanbaatar",
    "heightCm": 189,
    "weightKg": 178,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Kataonami stable fundamentals combining forward drive and belt control",
    "styleJp": "Kataonami部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 5-3",
    "currentRecord": "5-3",
    "literalMeaningEn": "玉鷲 (Tamawashi)",
    "literalMeaningJp": "玉鷲の四股名",
    "kanjiBreakdown": [
      {
        "char": "玉",
        "reading": "Tama (ギョク / たま)",
        "meaningEn": "Jewel / Jade",
        "noteEn": "Signature prefix of Kataonami-beya (Tamanoumi, Tamawashi)"
      },
      {
        "char": "鷲",
        "reading": "Washi (シュウ / わし)",
        "meaningEn": "Eagle",
        "noteEn": "Soaring eagle; Ironman record-holder for consecutive bouts"
      }
    ],
    "storyEn": "Tamawashi (玉鷲) competes out of Kataonami stable from Mongolia, Ulaanbaatar, entering Day 9 of the 2026 Kyushu Basho at 5-3.",
    "storyJp": "Kataonami部屋所属・Mongolia, Ulaanbaatar出身。2026年九州場所9日目を5-3で迎える。"
  },
  {
    "id": "kitanowaka",
    "apiId": 66,
    "shikonaKanji": "北の若",
    "furigana": "kitanowaka",
    "rubyHtml": "北の若",
    "romaji": "Kitanowaka",
    "givenName": "大輔",
    "rankEn": "Maegashira 15 West",
    "rankJp": "西前頭15枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Hakkaku",
    "heyaJp": "Hakkaku部屋",
    "originEn": "Yamagata-ken, Sakata-shi",
    "originJp": "Yamagata-ken, Sakata-shi",
    "heightCm": 191,
    "weightKg": 159,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Hakkaku stable fundamentals combining forward drive and belt control",
    "styleJp": "Hakkaku部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 4-4",
    "currentRecord": "4-4",
    "literalMeaningEn": "北の若 (Kitanowaka)",
    "literalMeaningJp": "北の若の四股名",
    "kanjiBreakdown": [
      {
        "char": "北",
        "reading": "Kita (ホク / きた)",
        "meaningEn": "North",
        "noteEn": "Honors his northern Yamagata roots and Hakkaku-beya (ex-Hokutoumi)"
      },
      {
        "char": "の",
        "reading": "no (の)",
        "meaningEn": "Of",
        "noteEn": "Connecting particle"
      },
      {
        "char": "若",
        "reading": "Waka (ジャク / わかい)",
        "meaningEn": "Young",
        "noteEn": "Honors his grandfather, former Komusubi Wakabayama (若葉山)"
      }
    ],
    "storyEn": "Kitanowaka (北の若) competes out of Hakkaku stable from Yamagata-ken, Sakata-shi, entering Day 9 of the 2026 Kyushu Basho at 4-4.",
    "storyJp": "Hakkaku部屋所属・Yamagata-ken, Sakata-shi出身。2026年九州場所9日目を4-4で迎える。"
  },
  {
    "id": "arashifuji",
    "apiId": 8858,
    "shikonaKanji": "嵐富士",
    "furigana": "arashifuji",
    "rubyHtml": "嵐富士",
    "romaji": "Arashifuji",
    "givenName": "奏凪人",
    "rankEn": "Maegashira 16 East",
    "rankJp": "東前頭16枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Isegahama",
    "heyaJp": "Isegahama部屋",
    "originEn": "Fukuoka-ken, Kasuya-gun, Umi-machi",
    "originJp": "Fukuoka-ken, Kasuya-gun, Umi-machi",
    "heightCm": 172,
    "weightKg": 123,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Isegahama stable fundamentals combining forward drive and belt control",
    "styleJp": "Isegahama部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 6-2",
    "currentRecord": "6-2",
    "literalMeaningEn": "嵐富士 (Arashifuji)",
    "literalMeaningJp": "嵐富士の四股名",
    "kanjiBreakdown": [
      {
        "char": "嵐",
        "reading": "Arashi (ラン / あらし)",
        "meaningEn": "Storm / Tempest",
        "noteEn": "Fierce storm paired with Isegahama's Mount Fuji"
      },
      {
        "char": "富",
        "reading": "Fu (フ / とみ)",
        "meaningEn": "Wealth / Abundant",
        "noteEn": "First half of Mount Fuji (富士), signature suffix of Isegahama-beya"
      },
      {
        "char": "士",
        "reading": "Ji (シ / さむらい)",
        "meaningEn": "Warrior / Samurai",
        "noteEn": "Completes Fuji (富士), honoring 63rd Yokozuna Asahifuji"
      }
    ],
    "storyEn": "Arashifuji (嵐富士) competes out of Isegahama stable from Fukuoka-ken, Kasuya-gun, Umi-machi, entering Day 9 of the 2026 Kyushu Basho at 6-2.",
    "storyJp": "Isegahama部屋所属・Fukuoka-ken, Kasuya-gun, Umi-machi出身。2026年九州場所9日目を6-2で迎える。"
  },
  {
    "id": "kyokukaiyu",
    "apiId": 8855,
    "shikonaKanji": "旭海雄",
    "furigana": "kyokukaiyu",
    "rubyHtml": "旭海雄",
    "romaji": "Kyokukaiyu",
    "givenName": "蓮",
    "rankEn": "Maegashira 16 West",
    "rankJp": "西前頭16枚目",
    "rankTier": "Maegashira",
    "side": "West",
    "heyaEn": "Oshima",
    "heyaJp": "Oshima部屋",
    "originEn": "Mongolia, Bayankhongor",
    "originJp": "Mongolia, Bayankhongor",
    "heightCm": 183,
    "weightKg": 165,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Oshima stable fundamentals combining forward drive and belt control",
    "styleJp": "Oshima部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 4-4",
    "currentRecord": "4-4",
    "literalMeaningEn": "旭海雄 (Kyokukaiyu)",
    "literalMeaningJp": "旭海雄の四股名",
    "kanjiBreakdown": [
      {
        "char": "旭",
        "reading": "Kyoku (キョク / あさひ)",
        "meaningEn": "Rising Sun",
        "noteEn": "Signature prefix of Oshima-beya (Kyokutenhō, Kyokushūhō)"
      },
      {
        "char": "海",
        "reading": "Mi / Umi (カイ / うみ)",
        "meaningEn": "Sea / Ocean",
        "noteEn": "Second character of Atami; evokes coastal strength & fluidity"
      },
      {
        "char": "雄",
        "reading": "Yū (ユウ / おす)",
        "meaningEn": "Heroic / Bold",
        "noteEn": "Heroic ocean spirit of Oshima-beya"
      }
    ],
    "storyEn": "Kyokukaiyu (旭海雄) competes out of Oshima stable from Mongolia, Bayankhongor, entering Day 9 of the 2026 Kyushu Basho at 4-4.",
    "storyJp": "Oshima部屋所属・Mongolia, Bayankhongor出身。2026年九州場所9日目を4-4で迎える。"
  },
  {
    "id": "daiseizan",
    "apiId": 378,
    "shikonaKanji": "大青山",
    "furigana": "daiseizan",
    "rubyHtml": "大青山",
    "romaji": "Daiseizan",
    "givenName": "大介",
    "rankEn": "Maegashira 17 East",
    "rankJp": "東前頭17枚目",
    "rankTier": "Maegashira",
    "side": "East",
    "heyaEn": "Arashio",
    "heyaJp": "Arashio部屋",
    "originEn": "China, Inner Mongolia",
    "originJp": "China, Inner Mongolia",
    "heightCm": 191,
    "weightKg": 171,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Arashio stable fundamentals combining forward drive and belt control",
    "styleJp": "Arashio部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 2-6",
    "currentRecord": "2-6",
    "literalMeaningEn": "大青山 (Daiseizan)",
    "literalMeaningJp": "大青山の四股名",
    "kanjiBreakdown": [
      {
        "char": "大",
        "reading": "Dai / Ō (ダイ / おお)",
        "meaningEn": "Great / Large",
        "noteEn": "Bold opening character symbolizing explosive power"
      },
      {
        "char": "青",
        "reading": "Sei (セイ / あお)",
        "meaningEn": "Blue / Azure",
        "noteEn": "Great Azure Mountain (Daiseizan 大青山)"
      },
      {
        "char": "山",
        "reading": "Yama (サン / やま)",
        "meaningEn": "Mountain",
        "noteEn": "Symbolizes immovable stability like a mountain peak"
      }
    ],
    "storyEn": "Daiseizan (大青山) competes out of Arashio stable from China, Inner Mongolia, entering Day 9 of the 2026 Kyushu Basho at 2-6.",
    "storyJp": "Arashio部屋所属・China, Inner Mongolia出身。2026年九州場所9日目を2-6で迎える。"
  },
  {
    "id": "shodai",
    "apiId": 33,
    "shikonaKanji": "正代",
    "furigana": "shodai",
    "rubyHtml": "正代",
    "romaji": "Shodai",
    "givenName": "直也",
    "rankEn": "Juryo 3 West",
    "rankJp": "西十両3枚目",
    "rankTier": "Juryo",
    "side": "West",
    "heyaEn": "Tokitsukaze",
    "heyaJp": "Tokitsukaze部屋",
    "originEn": "Kumamoto-ken, Uto-shi",
    "originJp": "Kumamoto-ken, Uto-shi",
    "heightCm": 184,
    "weightKg": 168,
    "styleCode": "Yotsu / Oshi Hybrid",
    "styleEn": "Balanced Tokitsukaze stable fundamentals combining forward drive and belt control",
    "styleJp": "Tokitsukaze部屋仕込みの押しと四つの相撲",
    "signatureMoves": [
      "Yorikiri",
      "Oshidashi"
    ],
    "makuuchiYusho": 0,
    "sansho": "Active Makuuchi Competitor",
    "kinboshi": 0,
    "careerRecord": "2026 Kyushu: 1-7",
    "currentRecord": "1-7",
    "literalMeaningEn": "正代 (Shodai)",
    "literalMeaningJp": "正代の四股名",
    "kanjiBreakdown": [
      {
        "char": "正",
        "reading": "Shō (セイ / ただしい)",
        "meaningEn": "Righteous / Straight",
        "noteEn": "His real family surname Shōdai (正代)"
      },
      {
        "char": "代",
        "reading": "Dai (ダイ / よ)",
        "meaningEn": "Generation / Era",
        "noteEn": "Completes his family surname Shōdai (正代)"
      }
    ],
    "storyEn": "Shodai (正代) competes out of Tokitsukaze stable from Kumamoto-ken, Uto-shi, entering Day 9 of the 2026 Kyushu Basho at 1-7.",
    "storyJp": "Tokitsukaze部屋所属・Kumamoto-ken, Uto-shi出身。2026年九州場所9日目を1-7で迎える。"
  }
],

  defaultTorikumi: [
  {
    "boutNo": 21,
    "boutTitleEn": "Musubi no Ichiban (Final Bout of Day 9)",
    "boutTitleJp": "九日目・結びの一番",
    "approxTime": "17:55",
    "isSanyaku": true,
    "stakesTagEn": "Co-Leader (7-1) vs. Kinboshi Threat",
    "stakesTagJp": "首位タイ(7-1) vs 金星挑戦",
    "eastId": "onosato",
    "westId": "takerufuji",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Day 9's grand finale! Yokozuna Onosato (7-1) puts his share of the Kyushu Basho lead on the line against powerhouse Takerufuji (2-6).",
    "storylineJp": "九日目の結びの一番！7勝1敗で首位を走る横綱・大の里に、一発の破壊力を持つ尊富士が挑む。"
  },
  {
    "boutNo": 20,
    "boutTitleEn": "Co-Main Event: Yokozuna vs. Co-Leader",
    "boutTitleJp": "大関・横綱戦：首位熱海富士が横綱に挑戦",
    "approxTime": "17:50",
    "isSanyaku": true,
    "stakesTagEn": "7-1 Leader vs. Yokozuna",
    "stakesTagJp": "7勝1敗首位 vs 横綱",
    "eastId": "atamifuji",
    "westId": "hoshoryu",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Huge title-race clash: 7-1 Sekiwake Atamifuji faces Yokozuna Hoshoryu (4-4). A win keeps Atamifuji atop the leaderboard!",
    "storylineJp": "優勝戦線を占う大一番！7勝1敗の西関脇・熱海富士が横綱・豊昇龍と激突。"
  },
  {
    "boutNo": 19,
    "boutTitleEn": "Day 9 Title Race Feature — Bout #19",
    "boutTitleJp": "九日目・優勝争い注目の一番（第19番）",
    "approxTime": "17:45",
    "isSanyaku": true,
    "stakesTagEn": "Kachi-koshi on the Line (7-1!)",
    "stakesTagJp": "勝てば勝ち越し（7勝1敗）",
    "eastId": "kirishima",
    "westId": "daieisho",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "A 7-1 leader fights for an immediate Day 9 Kachi-koshi (8th win) as Kirishima (7-1) meets Daieisho (2-6).",
    "storylineJp": "7勝1敗で勝ち越しに王手をかけた好調力士が登場。霧島（7-1）対大栄翔（2-6）。"
  },
  {
    "boutNo": 18,
    "boutTitleEn": "Day 9 Makuuchi Bout #18: Aonishiki vs. Takayasu",
    "boutTitleJp": "九日目・幕内取組：安青錦 vs 高安",
    "approxTime": "17:40",
    "isSanyaku": true,
    "stakesTagEn": "Ozeki 1 East (4-4) vs. Maegashira 3 East (2-6)",
    "stakesTagJp": "東大関 vs 東前頭3枚目",
    "eastId": "aonishiki",
    "westId": "takayasu",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Aonishiki (4-4, Ajigawa) faces Takayasu (2-6, Tagonoura) on Day 9 in Fukuoka.",
    "storylineJp": "安青錦（4-4）と高安（2-6）が福岡国際センターで激突。"
  },
  {
    "boutNo": 17,
    "boutTitleEn": "Day 9 Makuuchi Bout #17: Fujinokawa vs. Kotozakura",
    "boutTitleJp": "九日目・幕内取組：藤ノ川 vs 琴櫻",
    "approxTime": "17:35",
    "isSanyaku": true,
    "stakesTagEn": "Sekiwake 1 East (3-5) vs. Ozeki 1 West (5-3)",
    "stakesTagJp": "東関脇 vs 西大関",
    "eastId": "fujinokawa",
    "westId": "kotozakura",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Fujinokawa (3-5, Isenoumi) faces Kotozakura (5-3, Sadogatake) on Day 9 in Fukuoka.",
    "storylineJp": "藤ノ川（3-5）と琴櫻（5-3）が福岡国際センターで激突。"
  },
  {
    "boutNo": 16,
    "boutTitleEn": "Day 9 Makuuchi Bout #16: Churanoumi vs. Asanoyama",
    "boutTitleJp": "九日目・幕内取組：美ノ海 vs 朝乃山",
    "approxTime": "17:30",
    "isSanyaku": true,
    "stakesTagEn": "Komusubi 1 East (1-7) vs. Maegashira 1 East (4-4)",
    "stakesTagJp": "東小結 vs 東前頭1枚目",
    "eastId": "churanoumi",
    "westId": "asanoyama",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Churanoumi (1-7, Kise) faces Asanoyama (4-4, Takasago) on Day 9 in Fukuoka.",
    "storylineJp": "美ノ海（1-7）と朝乃山（4-4）が福岡国際センターで激突。"
  },
  {
    "boutNo": 15,
    "boutTitleEn": "Day 9 Makuuchi Bout #15: Fujiryoga vs. Yoshinofuji",
    "boutTitleJp": "九日目・幕内取組：藤凌駕 vs 義ノ富士",
    "approxTime": "17:25",
    "isSanyaku": true,
    "stakesTagEn": "Maegashira 1 West (5-3) vs. Komusubi 1 West (4-4)",
    "stakesTagJp": "西前頭1枚目 vs 西小結",
    "eastId": "fujiryoga",
    "westId": "yoshinofuji",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Fujiryoga (5-3, Fujishima) faces Yoshinofuji (4-4, Isegahama) on Day 9 in Fukuoka.",
    "storylineJp": "藤凌駕（5-3）と義ノ富士（4-4）が福岡国際センターで激突。"
  },
  {
    "boutNo": 14,
    "boutTitleEn": "Day 9 Makuuchi Bout #14: Ura vs. Fujiseiun",
    "boutTitleJp": "九日目・幕内取組：宇良 vs 藤青雲",
    "approxTime": "17:20",
    "isSanyaku": false,
    "stakesTagEn": "Maegashira 2 East (2-6) vs. Maegashira 2 West (4-4)",
    "stakesTagJp": "東前頭2枚目 vs 西前頭2枚目",
    "eastId": "ura",
    "westId": "fujiseiun",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Ura (2-6, Kise) faces Fujiseiun (4-4, Fujishima) on Day 9 in Fukuoka.",
    "storylineJp": "宇良（2-6）と藤青雲（4-4）が福岡国際センターで激突。"
  },
  {
    "boutNo": 13,
    "boutTitleEn": "Day 9 Makuuchi Bout #13: Kotoshoho vs. Hakunofuji",
    "boutTitleJp": "九日目・幕内取組：琴勝峰 vs 伯乃富士",
    "approxTime": "17:15",
    "isSanyaku": false,
    "stakesTagEn": "Maegashira 6 East (5-3) vs. Maegashira 3 West (3-5)",
    "stakesTagJp": "東前頭6枚目 vs 西前頭3枚目",
    "eastId": "kotoshoho",
    "westId": "hakunofuji",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Kotoshoho (5-3, Sadogatake) faces Hakunofuji (3-5, Isegahama) on Day 9 in Fukuoka.",
    "storylineJp": "琴勝峰（5-3）と伯乃富士（3-5）が福岡国際センターで激突。"
  },
  {
    "boutNo": 12,
    "boutTitleEn": "Day 9 Makuuchi Bout #12: Hiradoumi vs. Nishikifuji",
    "boutTitleJp": "九日目・幕内取組：平戸海 vs 錦富士",
    "approxTime": "17:10",
    "isSanyaku": false,
    "stakesTagEn": "Maegashira 5 East (2-6) vs. Maegashira 8 West (5-3)",
    "stakesTagJp": "東前頭5枚目 vs 西前頭8枚目",
    "eastId": "hiradoumi",
    "westId": "nishikifuji",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Hiradoumi (2-6, Sakaigawa) faces Nishikifuji (5-3, Isegahama) on Day 9 in Fukuoka.",
    "storylineJp": "平戸海（2-6）と錦富士（5-3）が福岡国際センターで激突。"
  },
  {
    "boutNo": 11,
    "boutTitleEn": "Day 9 Title Race Feature — Bout #11",
    "boutTitleJp": "九日目・優勝争い注目の一番（第11番）",
    "approxTime": "17:05",
    "isSanyaku": false,
    "stakesTagEn": "Kachi-koshi on the Line (7-1!)",
    "stakesTagJp": "勝てば勝ち越し（7勝1敗）",
    "eastId": "kinbozan",
    "westId": "gonoyama",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "A 7-1 leader fights for an immediate Day 9 Kachi-koshi (8th win) as Kinbozan (7-1) meets Gonoyama (3-5).",
    "storylineJp": "7勝1敗で勝ち越しに王手をかけた好調力士が登場。金峰山（7-1）対豪ノ山（3-5）。"
  },
  {
    "boutNo": 10,
    "boutTitleEn": "Day 9 Title Race Feature — Bout #10",
    "boutTitleJp": "九日目・優勝争い注目の一番（第10番）",
    "approxTime": "17:00",
    "isSanyaku": false,
    "stakesTagEn": "Kachi-koshi on the Line (7-1!)",
    "stakesTagJp": "勝てば勝ち越し（7勝1敗）",
    "eastId": "wakamotoharu",
    "westId": "oshoma",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "A 7-1 leader fights for an immediate Day 9 Kachi-koshi (8th win) as Wakamotoharu (7-1) meets Oshoma (5-3).",
    "storylineJp": "7勝1敗で勝ち越しに王手をかけた好調力士が登場。若元春（7-1）対欧勝馬（5-3）。"
  },
  {
    "boutNo": 9,
    "boutTitleEn": "Day 9 Makuuchi Bout #9: Roga vs. Oho",
    "boutTitleJp": "九日目・幕内取組：狼雅 vs 王鵬",
    "approxTime": "16:55",
    "isSanyaku": false,
    "stakesTagEn": "Maegashira 8 East (5-3) vs. Maegashira 10 West (5-3)",
    "stakesTagJp": "東前頭8枚目 vs 西前頭10枚目",
    "eastId": "roga",
    "westId": "oho",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Roga (5-3, Futagoyama) faces Oho (5-3, Otake) on Day 9 in Fukuoka.",
    "storylineJp": "狼雅（5-3）と王鵬（5-3）が福岡国際センターで激突。"
  },
  {
    "boutNo": 8,
    "boutTitleEn": "Day 9 Makuuchi Bout #8: Toshinofuji vs. Asakoryu",
    "boutTitleJp": "九日目・幕内取組：寿之富士 vs 朝紅龍",
    "approxTime": "16:50",
    "isSanyaku": false,
    "stakesTagEn": "Maegashira 13 East (3-5) vs. Maegashira 9 West (1-7)",
    "stakesTagJp": "東前頭13枚目 vs 西前頭9枚目",
    "eastId": "toshinofuji",
    "westId": "asakoryu",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Toshinofuji (3-5, Isegahama) faces Asakoryu (1-7, Takasago) on Day 9 in Fukuoka.",
    "storylineJp": "寿之富士（3-5）と朝紅龍（1-7）が福岡国際センターで激突。"
  },
  {
    "boutNo": 7,
    "boutTitleEn": "Day 9 Makuuchi Bout #7: Shishi vs. Tamawashi",
    "boutTitleJp": "九日目・幕内取組：獅司 vs 玉鷲",
    "approxTime": "16:45",
    "isSanyaku": false,
    "stakesTagEn": "Maegashira 10 East (0-8) vs. Maegashira 15 East (5-3)",
    "stakesTagJp": "東前頭10枚目 vs 東前頭15枚目",
    "eastId": "shishi",
    "westId": "tamawashi",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Shishi (0-8, Ikazuchi) faces Tamawashi (5-3, Kataonami) on Day 9 in Fukuoka.",
    "storylineJp": "獅司（0-8）と玉鷲（5-3）が福岡国際センターで激突。"
  },
  {
    "boutNo": 6,
    "boutTitleEn": "Day 9 Makuuchi Bout #6: Takanosho vs. Kitanowaka",
    "boutTitleJp": "九日目・幕内取組：隆の勝 vs 北の若",
    "approxTime": "16:40",
    "isSanyaku": false,
    "stakesTagEn": "Maegashira 11 East (6-2) vs. Maegashira 15 West (4-4)",
    "stakesTagJp": "東前頭11枚目 vs 西前頭15枚目",
    "eastId": "takanosho",
    "westId": "kitanowaka",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Takanosho (6-2, Minatogawa) faces Kitanowaka (4-4, Hakkaku) on Day 9 in Fukuoka.",
    "storylineJp": "隆の勝（6-2）と北の若（4-4）が福岡国際センターで激突。"
  },
  {
    "boutNo": 5,
    "boutTitleEn": "Day 9 Makuuchi Bout #5: Arashifuji vs. Asahakuryu",
    "boutTitleJp": "九日目・幕内取組：嵐富士 vs 朝白龍",
    "approxTime": "16:35",
    "isSanyaku": false,
    "stakesTagEn": "Maegashira 16 East (6-2) vs. Maegashira 11 West (6-2)",
    "stakesTagJp": "東前頭16枚目 vs 西前頭11枚目",
    "eastId": "arashifuji",
    "westId": "asahakuryu",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Arashifuji (6-2, Isegahama) faces Asahakuryu (6-2, Takasago) on Day 9 in Fukuoka.",
    "storylineJp": "嵐富士（6-2）と朝白龍（6-2）が福岡国際センターで激突。"
  },
  {
    "boutNo": 4,
    "boutTitleEn": "Day 9 Makuuchi Bout #4: Ichiyamamoto vs. Tokihayate",
    "boutTitleJp": "九日目・幕内取組：一山本 vs 時疾風",
    "approxTime": "16:30",
    "isSanyaku": false,
    "stakesTagEn": "Maegashira 12 East (5-3) vs. Maegashira 14 East (2-6)",
    "stakesTagJp": "東前頭12枚目 vs 東前頭14枚目",
    "eastId": "ichiyamamoto",
    "westId": "tokihayate",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Ichiyamamoto (5-3, Hanaregoma) faces Tokihayate (2-6, Tokitsukaze) on Day 9 in Fukuoka.",
    "storylineJp": "一山本（5-3）と時疾風（2-6）が福岡国際センターで激突。"
  },
  {
    "boutNo": 3,
    "boutTitleEn": "Day 9 Makuuchi Bout #3: Daiseizan vs. Abi",
    "boutTitleJp": "九日目・幕内取組：大青山 vs 阿炎",
    "approxTime": "16:25",
    "isSanyaku": false,
    "stakesTagEn": "Maegashira 17 East (2-6) vs. Maegashira 12 West (3-5)",
    "stakesTagJp": "東前頭17枚目 vs 西前頭12枚目",
    "eastId": "daiseizan",
    "westId": "abi",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Daiseizan (2-6, Arashio) faces Abi (3-5, Shikoroyama) on Day 9 in Fukuoka.",
    "storylineJp": "大青山（2-6）と阿炎（3-5）が福岡国際センターで激突。"
  },
  {
    "boutNo": 2,
    "boutTitleEn": "Day 9 Makuuchi Bout #2: Kyokukaiyu vs. Asasuiryu",
    "boutTitleJp": "九日目・幕内取組：旭海雄 vs 朝翠龍",
    "approxTime": "16:20",
    "isSanyaku": false,
    "stakesTagEn": "Maegashira 16 West (4-4) vs. Maegashira 13 West (3-5)",
    "stakesTagJp": "西前頭16枚目 vs 西前頭13枚目",
    "eastId": "kyokukaiyu",
    "westId": "asasuiryu",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Kyokukaiyu (4-4, Oshima) faces Asasuiryu (3-5, Takasago) on Day 9 in Fukuoka.",
    "storylineJp": "旭海雄（4-4）と朝翠龍（3-5）が福岡国際センターで激突。"
  },
  {
    "boutNo": 1,
    "boutTitleEn": "Day 9 Makuuchi Bout #1: Shodai vs. Dewanoryu",
    "boutTitleJp": "九日目・幕内取組：正代 vs 出羽ノ龍",
    "approxTime": "16:15",
    "isSanyaku": false,
    "stakesTagEn": "Juryo 3 West (1-7) vs. Maegashira 14 West (6-2)",
    "stakesTagJp": "西十両3枚目 vs 西前頭14枚目",
    "eastId": "shodai",
    "westId": "dewanoryu",
    "h2hEast": 3,
    "h2hWest": 2,
    "lastMeetingEn": "2026 Kyushu Day 9 (Nov 16)",
    "lastMeetingJp": "2026年11月16日（九日目）",
    "winnerSide": null,
    "kimariteId": null,
    "storylineEn": "Shodai (1-7, Tokitsukaze) faces Dewanoryu (6-2, Dewanoumi) on Day 9 in Fukuoka.",
    "storylineJp": "正代（1-7）と出羽ノ龍（6-2）が福岡国際センターで激突。"
  }
],

  kimarite: [
    {
      id: "yorikiri",
      kanji: "寄り切り",
      furigana: "よりきり",
      rubyHtml: "<ruby>寄<rt>よ</rt></ruby>り<ruby>切<rt>き</rt></ruby>り",
      romaji: "Yorikiri",
      nameEn: "Frontal Force-Out",
      categoryCode: "kihon",
      categoryEn: "Kihon-waza (Fundamental Technique)",
      categoryJp: "基本技",
      frequencyPct: "28.4%",
      kanjiBreakdown: "寄 (yori = approach / press close) + 切 (kiri = cut / finish across the line)",
      descEn: "The #1 most common winning move in sumo. Maintaining a grip on the opponent's mawashi (belt), the attacker drives chest-to-chest and forces the opponent backward over the straw bales (tawara).",
      descJp: "大相撲で最も多く見られる決まり手（全体の約3割）。相手の廻しを引いた状態で胸を合わせ、前へ歩いて土俵外へ追い出す四つ相撲の基本技。",
      specialists: ["terunofuji", "kotozakura", "onosato", "wakamotoharu", "wakatakakage"]
    },
    {
      id: "oshidashi",
      kanji: "押し出し",
      furigana: "おしだし",
      rubyHtml: "<ruby>押<rt>お</rt></ruby>し<ruby>出<rt>だ</rt></ruby>し",
      romaji: "Oshidashi",
      nameEn: "Frontal Push-Out",
      categoryCode: "kihon",
      categoryEn: "Kihon-waza (Fundamental Technique)",
      categoryJp: "基本技",
      frequencyPct: "22.6%",
      kanjiBreakdown: "押 (oshi = push / press with palms) + 出 (dashi = drive out of the ring)",
      descEn: "The #2 most frequent winning technique. Without holding the belt, the wrestler plants open palms against the opponent's chest or armpits (hazu-oshi) and pushes them straight out of the ring.",
      descJp: "廻しを持たず、手のひら（筈押しなど）で相手の胸や脇を押し進め、土俵の外へ出す押し相撲の代名詞。",
      specialists: ["daieisho", "onosato", "gonoyama", "takerufuji", "oho"]
    },
    {
      id: "hatakikomi",
      kanji: "叩き込み",
      furigana: "はたきこみ",
      rubyHtml: "<ruby>叩<rt>はた</rt></ruby>き<ruby>込<rt>こ</rt></ruby>み",
      romaji: "Hatakikomi",
      nameEn: "Slap-Down",
      categoryCode: "kihon",
      categoryEn: "Kihon-waza (Fundamental Technique)",
      categoryJp: "基本技",
      frequencyPct: "8.9%",
      kanjiBreakdown: "叩 (hataki = slap / strike downward) + 込 (komi = drive down into the clay)",
      descEn: "As the opponent lunges forward with their head down, the wrestler steps aside or backward while slapping the opponent's shoulder, neck, or back downward onto the clay.",
      descJp: "前に出てくる相手の勢いを利用し、体を開きながら肩や背中を上から下へ叩いて土俵に這わせる技。",
      specialists: ["abi", "daieisho", "tobizaru", "oshoma"]
    },
    {
      id: "tsukidashi",
      kanji: "突き出し",
      furigana: "つきだし",
      rubyHtml: "<ruby>突<rt>つ</rt></ruby>き<ruby>出<rt>だ</rt></ruby>し",
      romaji: "Tsukidashi",
      nameEn: "Frontal Thrust-Out",
      categoryCode: "kihon",
      categoryEn: "Kihon-waza (Fundamental Technique)",
      categoryJp: "基本技",
      frequencyPct: "6.4%",
      kanjiBreakdown: "突 (tsuki = rapid thrust / strike) + 出 (dashi = drive out)",
      descEn: "Unlike Oshidashi (continuous pushing contact), Tsukidashi uses a barrage of rhythmic, piston-like open-hand thrusts (tsuppari) to the face, throat, and upper chest to blast the opponent out.",
      descJp: "「押し出し」が密着して押すのに対し、左右の突っ張りを連続して相手の胸や喉元に浴びせて土俵外へ吹き飛ばす技。",
      specialists: ["daieisho", "abi", "ichiyamamoto", "gonoyama"]
    },
    {
      id: "uwatenage",
      kanji: "上手投げ",
      furigana: "うわてなげ",
      rubyHtml: "<ruby>上<rt>うわ</rt></ruby><ruby>手<rt>て</rt></ruby><ruby>投<rt>な</rt></ruby>げ",
      romaji: "Uwatenage",
      nameEn: "Overarm Belt Throw",
      categoryCode: "nage",
      categoryEn: "Nage-waza (Throwing Technique)",
      categoryJp: "投げ手",
      frequencyPct: "5.2%",
      kanjiBreakdown: "上手 (uwate = outside / over-the-arm belt grip) + 投 (nage = throw)",
      descEn: "Reaching over the opponent's arm to grab the outside of their mawashi (uwate), the wrestler pivots their hips and swings the opponent down onto the clay in a dramatic arc.",
      descJp: "相手の腕の上（外側）から廻しを引き（上手）、腰を回転させて相手を豪快に土俵へ投げ捨てる華やかな大技。",
      specialists: ["hoshoryu", "kirishima", "terunofuji", "kotozakura", "roga"]
    },
    {
      id: "shitatenage",
      kanji: "下手投げ",
      furigana: "したてなげ",
      rubyHtml: "<ruby>下<rt>した</rt></ruby><ruby>手<rt>て</rt></ruby><ruby>投<rt>な</rt></ruby>げ",
      romaji: "Shitatenage",
      nameEn: "Underarm Belt Throw",
      categoryCode: "nage",
      categoryEn: "Nage-waza (Throwing Technique)",
      categoryJp: "投げ手",
      frequencyPct: "3.4%",
      kanjiBreakdown: "下手 (shitate = inside / under-the-arm belt grip) + 投 (nage = throw)",
      descEn: "With an inside grip underneath the opponent's arm (shitate), the wrestler drops their hips low and pivots sharply to torque the opponent to the surface.",
      descJp: "相手の脇の下から差し込んだ手（下手）で廻しを引きつけ、腰を落として鋭くひねり投げる技。",
      specialists: ["hoshoryu", "wakatakakage", "hiradoumi", "churanoumi"]
    },
    {
      id: "kotenage",
      kanji: "小手投げ",
      furigana: "こてなげ",
      rubyHtml: "<ruby>小<rt>こ</rt></ruby><ruby>手<rt>て</rt></ruby><ruby>投<rt>な</rt></ruby>げ",
      romaji: "Kotenage",
      nameEn: "Armlock Throw",
      categoryCode: "nage",
      categoryEn: "Nage-waza (Throwing Technique)",
      categoryJp: "投げ手",
      frequencyPct: "1.8%",
      kanjiBreakdown: "小手 (kote = forearm / wrist lock) + 投 (nage = throw)",
      descEn: "A beltless throw: wrapping one arm tightly over and around the opponent's extended inside arm, the wrestler torques downward to throw them face-first.",
      descJp: "廻しを取らず、差してきた相手の腕を外側から抱え込んで（小手に巻いて）強引に振り回して投げる豪快な技。",
      specialists: ["nishikigi", "kotozakura", "takayasu"]
    },
    {
      id: "katasukashi",
      kanji: "肩透かし",
      furigana: "かたすかし",
      rubyHtml: "<ruby>肩<rt>かた</rt></ruby><ruby>透<rt>す</rt></ruby>かし",
      romaji: "Katasukashi",
      nameEn: "Under-Shoulder Swing-Down",
      categoryCode: "hineri",
      categoryEn: "Hineri-waza (Twist-Down Technique)",
      categoryJp: "捻り手",
      frequencyPct: "1.9%",
      kanjiBreakdown: "肩 (kata = shoulder) + 透かし (sukashi = slip past / leave hanging in empty air)",
      descEn: "Clamping one hand inside the opponent's armpit and resting the other on their shoulder/back, the wrestler suddenly steps laterally so the opponent's forward momentum collapses them onto their chest.",
      descJp: "差した手で相手の脇を下からすくい上げ、もう一方の手で肩や背中を上から押さえながら体を開いて前に落とす技。翠富士の代名詞。",
      specialists: ["midorifuji", "ura", "wakatakakage"]
    },
    {
      id: "kimedashi",
      kanji: "極め出し",
      furigana: "きめだし",
      rubyHtml: "<ruby>極<rt>き</rt></ruby>め<ruby>出<rt>だ</rt></ruby>し",
      romaji: "Kimedashi",
      nameEn: "Arm-Bar Force-Out",
      categoryCode: "kihon",
      categoryEn: "Kihon-waza (Fundamental Technique)",
      categoryJp: "基本技",
      frequencyPct: "0.7%",
      kanjiBreakdown: "極 (kime = lock / immobilize joints) + 出 (dashi = force out)",
      descEn: "Requires immense upper-body strength: clamping both arms around the outside of the opponent's elbows/shoulders like a bear-hug vise, squeezing them helplessly out of the ring.",
      descJp: "両腕で相手の差し手を外側から強く抱え込み（かんぬき等）、身動きを取れなくしたまま土俵外へ押し出す怪力技。横綱・照ノ富士の必殺技。",
      specialists: ["terunofuji", "atamifuji", "nishikigi"]
    },
    {
      id: "sotogake",
      kanji: "外掛け",
      furigana: "そとがけ",
      rubyHtml: "<ruby>外<rt>そと</rt></ruby><ruby>掛<rt>が</rt></ruby>け",
      romaji: "Sotogake",
      nameEn: "Outer Leg Trip",
      categoryCode: "kake",
      categoryEn: "Kake-waza (Leg Tripping Technique)",
      categoryJp: "掛け手",
      frequencyPct: "0.8%",
      kanjiBreakdown: "外 (soto = outside) + 掛 (gake = hook / reap leg)",
      descEn: "Hooking one's calf around the outside of the opponent's ankle or lower leg while driving upper-body weight forward to topple them onto their back.",
      descJp: "自分の足を相手の足の外側から絡ませるように掛け、上体で浴びせ倒す足技。大関・豊昇龍が得意とする。",
      specialists: ["hoshoryu", "kirishima", "roga"]
    },
    {
      id: "ashitori",
      kanji: "足取り",
      furigana: "あしとり",
      rubyHtml: "<ruby>足<rt>あし</rt></ruby><ruby>取<rt>と</rt></ruby>り",
      romaji: "Ashitori",
      nameEn: "Single Leg Pick",
      categoryCode: "kake",
      categoryEn: "Kake-waza (Leg Tripping Technique)",
      categoryJp: "掛け手",
      frequencyPct: "0.4%",
      kanjiBreakdown: "足 (ashi = leg / foot) + 取 (tori = grab / seize)",
      descEn: "Diving low under the opponent's charge to scoop up one leg with both hands, hopping them backward or off-balance to the clay.",
      descJp: "低く潜り込んで相手の片足を両手で抱え上げ、バランスを崩して倒す、または土俵外へ送り出す奇襲技。宇良の得意技。",
      specialists: ["ura", "tobizaru"]
    },
    {
      id: "utchari",
      kanji: "うっちゃり",
      furigana: "うっちゃり",
      rubyHtml: "うっちゃり（<ruby>打<rt>う</rt></ruby>ち<ruby>棄<rt>ちゃ</rt></ruby>り）",
      romaji: "Utchari",
      nameEn: "Backward Pivot Throw on the Straw Bales",
      categoryCode: "tokushu",
      categoryEn: "Tokushu-waza (Spectacular / Special Technique)",
      categoryJp: "特殊技",
      frequencyPct: "0.2%",
      kanjiBreakdown: "打ち棄り (utchari = cast away / hurl aside at the last instant)",
      descEn: "One of sumo's most thrilling comeback moves! Pinned with heels on the straw bales (tawara), the defender arches backward onto their own stomach, lifts the rushing attacker, and twists them out first.",
      descJp: "土俵際まで追い詰められた力士が、徳俵に足を掛けて体を反りながら相手を吊り上げ、体を捻って土俵外へ投げ捨てる大逆転技。",
      specialists: ["shodai", "wakamotoharu"]
    },
    {
      id: "izori",
      kanji: "居反り",
      furigana: "いぞり",
      rubyHtml: "<ruby>居<rt>い</rt></ruby><ruby>反<rt>ぞ</rt></ruby>り",
      romaji: "Izori",
      nameEn: "Backward Body Drop (Acrobatic Arch)",
      categoryCode: "tokushu",
      categoryEn: "Tokushu-waza (Spectacular / Special Technique)",
      categoryJp: "反り手（希少技）",
      frequencyPct: "< 0.05%",
      kanjiBreakdown: "居 (i = crouching low) + 反り (zori = arching backward)",
      descEn: "A legendary ultra-rare move! Diving completely underneath the opponent's torso, the wrestler grabs their knees or belt, arches backward like a bridge, and flips the opponent over their own head.",
      descJp: "相手の懐に深く潜り込み、自分の体を弓なりに大きく反らせながら相手を頭上後方へ投げ落とす幻の大技。現代では宇良が体現する。",
      specialists: ["ura"]
    },
    {
      id: "isamiashi",
      kanji: "勇み足",
      furigana: "いさみあし",
      rubyHtml: "<ruby>勇<rt>いさ</rt></ruby>み<ruby>足<rt>あし</rt></ruby>",
      romaji: "Isamiashi",
      nameEn: "Inadvertent Forward Step-Out (Non-Technique)",
      categoryCode: "hiwaza",
      categoryEn: "Hi-waza (Winning Result without Technique)",
      categoryJp: "非技（勝負結果）",
      frequencyPct: "0.3%",
      kanjiBreakdown: "勇み (isami = over-eager / carried away) + 足 (ashi = foot)",
      descEn: "When an attacking wrestler has practically won the bout at the edge, but accidentally steps on or outside the straw bales with their own foot a split-second before the defender touches down! Triggers frequent Mono-ii video reviews.",
      descJp: "相手を土俵際へ追い詰めて攻め込んだ際、勢い余って相手が落ちるより先に自分の足が土俵の外へ出てしまう非技。物言いがつく代表的な場面。",
      specialists: []
    }
  ],

  /* ========================================================================
     Live Venue Timeline, Scoreboard Guide & Ritual Companion
     ======================================================================== */
  venueTimeline: [
    {
      time: "08:30",
      titleEn: "Arena Gates Open & Ichiban-daiko Drum",
      titleJp: "開場・一番太鼓（序ノ口〜幕下取組開始）",
      descEn: "Listen for the resonant taiko drums from the yagura tower outside. Lower division bouts (Jonokuchi, Jonidan, Sandanme, Makushita) begin—only 7 bouts per basho for these young prospects, so every match counts!",
      descJp: "櫓（やぐら）から響く一番太鼓とともに開場。序ノ口・序二段・三段目・幕下の若手力士たちが関取昇進を目指して激突します。"
    },
    {
      time: "14:15",
      titleEn: "Jūryō Dohyō-iri (Juryo Ring-Entering Ceremony)",
      titleJp: "十両土俵入り・十両取組",
      descEn: "The transition to salaried professionals (*Sekitori*)! Wrestlers wear silk *kesho-mawashi* ceremonial aprons for the first time today, followed by 14 high-stakes Juryo bouts.",
      descJp: "ここからが「関取」の土俵。色鮮やかな化粧廻しを締めた十両力士が土俵入りし、白熱の十両取組が始まります。",
      highlight: true
    },
    {
      time: "15:40",
      titleEn: "Makuuchi Dohyō-iri (Top Division Ring Ceremony)",
      titleJp: "幕内土俵入り（東・西）",
      descEn: "Don't miss this photo moment! All Maegashira, Komusubi, Sekiwake, and Ozeki march down the aisles (*hanamichi*) in East and West groups wearing museum-grade embroidered *kesho-mawashi* aprons.",
      descJp: "東・西に分かれて幕内力士全員が豪華絢爛な化粧廻し姿で登場し、土俵を丸く囲む華やかな儀式。",
      highlight: true
    },
    {
      time: "15:55",
      titleEn: "Yokozuna Dohyō-iri (Grand Champion Ceremony)",
      titleJp: "横綱土俵入り（露払い・太刀持ち従え）",
      descEn: "Yokozuna Onosato and Hōshōryū enter flanked by a Tsuyuharai (dew-sweeper) and Tachimochi (sword-bearer), wearing the sacred white hemp tsuna rope. Shout 'Yoisho!' in unison with the crowd when they stamp their feet (shiko)!",
      descJp: "東横綱・大の里と西横綱・豊昇龍が露払い・太刀持ちを従えて純白の綱を締めて登場。四股を踏む瞬間の「よいしょ！」の掛け声は会場一体となります。",
      highlight: true
    },
    {
      time: "16:10",
      titleEn: "Makuuchi Bouts Begin (Maegashira → Sanyaku)",
      titleJp: "幕内取組開始（中入り後）",
      descEn: "The main event! 21 top-division bouts progress from mid-Maegashira up to the Sanyaku (Komusubi, Sekiwake, Ozeki, Yokozuna). Notice how the salt throws (*shio-maki*) and prize banners (*kenshō-maku*) grow larger with each match.",
      descJp: "いよいよ幕内取組。番付が上がるにつれて制限時間も4分となり、懸賞幕の本数と館内の熱気が一気に高まります。",
      highlight: true
    },
    {
      time: "17:50",
      titleEn: "Musubi no Ichiban (Final Bout) & Yumitori-shiki",
      titleJp: "結びの一番・弓取り式・跳ね太鼓",
      descEn: "The final three bouts are known as *Kore Yori San'yaku*. Stay in your seat for 3 minutes after the final bout to watch the *Yumitori-shiki* (sacred bow-twirling ceremony) before the *Hane-daiko* farewell drum.",
      descJp: "「これより三役」のクライマックス、結びの一番の後は、作法に則った美しい「弓取り式」まで見届けるのが通の観戦スタイルです。",
      highlight: true
    }
  ],

  gyojiRanks: [
    {
      rankEn: "Tate-gyōji (Chief Referee — Kimura Shōnosuke / Shikimori Inosuke)",
      rankJp: "立行司（木村庄之助・式守伊之助）",
      tasselColorEn: "Solid Sacred Purple (Murasaki) or Purple & White",
      tasselColorJp: "総紫（庄之助）・紫白（伊之助）",
      footwearEn: "Straw sandals (Zōri) + Tanto short sword at waist",
      bouts: "Yokozuna & Ozeki final bouts (1–2 bouts per day)"
    },
    {
      rankEn: "San'yaku-gyōji (Sanyaku Referee)",
      rankJp: "三役行司",
      tasselColorEn: "Vermilion Red (Shu-fusa)",
      tasselColorJp: "朱房（しゅぶさ）",
      footwearEn: "Straw sandals (Zōri) with white tabi socks",
      bouts: "Sanyaku & Upper Maegashira bouts"
    },
    {
      rankEn: "Makuuchi-gyōji (Top Division Referee)",
      rankJp: "幕内行司",
      tasselColorEn: "Red & White (Kōhaku)",
      tasselColorJp: "紅白房",
      footwearEn: "White tabi socks (no sandals)",
      bouts: "Mid-to-lower Makuuchi bouts"
    },
    {
      rankEn: "Jūryō-gyōji (Salaried 2nd Division Referee)",
      rankJp: "十両行司",
      tasselColorEn: "Green & White (Ao-shiro)",
      tasselColorJp: "青白房",
      footwearEn: "Barefoot on the dohyō",
      bouts: "Juryo division bouts"
    }
  ],

  vocabulary: [
    {
      termKanji: "ハッキヨイ！のこった！",
      romaji: "Hakkeyoi! Nokotta!",
      meaningEn: "Referee's battle cry! 'Hakkeyoi' = 'Put your spirit into it!' (shouted when action stalls); 'Nokotta!' = 'You're still in the ring! Keep fighting!'",
      meaningJp: "行司の掛け声。「ハッキヨイ（発気揚々）」は動きが止まった時に気合を促す声、「のこった」は「まだ土俵内に足が残っているぞ！」という意味。"
    },
    {
      termKanji: "待った（まった）",
      romaji: "Matta (False Start)",
      meaningEn: "When both wrestlers fail to synchronize their breathing and hand-touch at the starting line (*tachiai*). The referee waves his gunbai fan to reset.",
      meaningJp: "立ち合いの呼吸や手つきが合わず、行司が取組をやり直させること。"
    },
    {
      termKanji: "物言い（ものいい）",
      romaji: "Mono-ii (Judges' Ring Conference)",
      meaningEn: "When one of the 5 ringside judges (*shimpan*) in black kimono raises his hand to question the referee's call. All 5 climb onto the clay with earpieces to consult video replay.",
      meaningJp: "土俵下の勝負審判が行司の軍配に異議を唱え、土俵上に集まって協議すること。館内アナウンスで理由と結果が丁寧に説明されます。"
    },
    {
      termKanji: "力水・力紙・塩まき",
      romaji: "Chikara-mizu / Shio-maki",
      meaningEn: "'Power water' (handed by the previous bout's winner to rinse the mouth), 'Power paper' (to wipe sweat), and throwing sacred salt (*shio*) to purify the clay and prevent injury.",
      meaningJp: "前の取組の勝者から受け取る清めの「力水」、汗を拭う「力紙」、そして土俵の邪気を払い怪我を防ぐ「塩まき」。"
    },
    {
      termKanji: "勝ち越し・負け越し",
      romaji: "Kachi-koshi (8+ Wins) / Make-koshi (8+ Losses)",
      meaningEn: "In a 15-day basho, 8 wins (*Kachi-koshi*) guarantees promotion up the banzuke and a permanent bonus increase (*kinboshi/mochikyūkin*). 8 losses (*Make-koshi*) means demotion.",
      meaningJp: "15日間で8勝以上を挙げて番付が上がることを「勝ち越し（給金直し）」、8敗以上で番付が下がることを「負け越し」と呼びます。"
    },
    {
      termKanji: "金星（きんぼし）・座布団の舞",
      romaji: "Kinboshi (Gold Star Upset)",
      meaningEn: "Awarded when a rank-and-file Maegashira defeats a Yokozuna! Gives the winner a permanent pay raise for the rest of his career—and excited fans often toss seat cushions (*zabuton*).",
      meaningJp: "平幕（前頭）の力士が横綱を破る大金星。引退まで毎場所の報奨金が加算される名誉であり、館内が最大の歓声に包まれます。"
    }
  ]
};
