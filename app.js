/* ==========================================================================
   Dohyō Guide (土俵ガイド) — Application Controller & Hybrid Live API Engine
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.SUMO_DATA;

  const DIVISIONS = [
    { key: "Makuuchi", jp: "幕内", order: 6, startMin: 16 * 60 + 15, stepMin: 5 },
    { key: "Juryo", jp: "十両", order: 5, startMin: 14 * 60 + 30, stepMin: 4 },
    { key: "Makushita", jp: "幕下", order: 4, startMin: 13 * 60 + 5, stepMin: 2.2 },
    { key: "Sandanme", jp: "三段目", order: 3, startMin: 11 * 60 + 15, stepMin: 2.5 },
    { key: "Jonidan", jp: "序二段", order: 2, startMin: 9 * 60 + 10, stepMin: 2.5 },
    { key: "Jonokuchi", jp: "序ノ口", order: 1, startMin: 8 * 60 + 40, stepMin: 3 }
  ];
  const DIVISION_MAP = new Map(DIVISIONS.map((d) => [d.key, d]));

  const PLAYER_COLORS = [
    "#B91C1C",
    "#1E3A8A",
    "#D97706",
    "#15803D",
    "#7E22CE",
    "#0F766E",
    "#BE185D",
    "#4338CA"
  ];

  function createDefault4Players() {
    return [1, 2, 3, 4].map((num, idx) => ({
      id: `p${num}`,
      name: `Player ${num}`,
      color: PLAYER_COLORS[idx % PLAYER_COLORS.length],
      picks: {},
      tiebreakers: {}
    }));
  }

  function loadContestState() {
    try {
      const raw = localStorage.getItem("dohyo_contest_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.players) && parsed.players.length > 0) {
          const players = parsed.players.slice();
          // Upgrade legacy 2-player default to 4 players automatically while keeping existing picks
          if (!parsed.fourPlayerReady) {
            while (players.length < 4) {
              const nextNum = players.length + 1;
              players.push({
                id: `p${nextNum}_` + Math.random().toString(36).slice(2, 5),
                name: `Player ${nextNum}`,
                color: PLAYER_COLORS[(nextNum - 1) % PLAYER_COLORS.length],
                picks: {},
                tiebreakers: {}
              });
            }
          }
          return {
            fourPlayerReady: true,
            players,
            activePlayerId: parsed.activePlayerId || players[0].id,
            contestScope: parsed.contestScope || "Makuuchi",
            actualMusubiKensho: parsed.actualMusubiKensho || {}
          };
        }
      }
    } catch (_) {}
    return {
      fourPlayerReady: true,
      players: createDefault4Players(),
      activePlayerId: "p1",
      contestScope: "Makuuchi",
      actualMusubiKensho: {}
    };
  }

  function getTodayJstDateStr() {
    const nowJst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    return nowJst.toISOString().slice(0, 10);
  }

  function detectCurrentBashoAndDay() {
    const todayJst = getTodayJstDateStr();
    const todayMs = Date.parse(`${todayJst}T00:00:00Z`);
    const sorted = [...DATA.bashoList].sort((a, b) => a.startDate.localeCompare(b.startDate));

    for (const b of sorted) {
      const startMs = Date.parse(`${b.startDate}T00:00:00Z`);
      const diffDays = Math.floor((todayMs - startMs) / 86400000);
      if (diffDays >= 0 && diffDays < 15) {
        return { bashoId: b.id, day: diffDays + 1 };
      }
    }

    let latestPast = null;
    for (const b of sorted) {
      const startMs = Date.parse(`${b.startDate}T00:00:00Z`);
      if (startMs <= todayMs) latestPast = b;
    }
    if (latestPast) {
      return { bashoId: latestPast.id, day: 15 };
    }
    return { bashoId: sorted[0].id, day: 1 };
  }

  const INITIAL_BASHO_DAY = detectCurrentBashoAndDay();

  // Application State
  const state = {
    activeTab: "torikumi",
    langMode: localStorage.getItem("dohyo_lang") || "dual",
    theme: localStorage.getItem("dohyo_theme") || "washi",
    selectedBashoId: INITIAL_BASHO_DAY.bashoId,
    selectedDay: INITIAL_BASHO_DAY.day,
    boutOrder: localStorage.getItem("dohyo_bout_order") || "desc", // "desc" = Last Match First, "asc" = Last Match at Bottom
    divisionFilter: "all",
    torikumiFilter: "all",
    torikumiSearch: "",
    rikishiRankFilter: "all",
    rikishiSearch: "",
    kimariteCatFilter: "all",
    kimariteSearch: "",
    starredBouts: new Set(JSON.parse(localStorage.getItem("dohyo_starred_bouts") || "[]")),
    starredRikishi: new Set(JSON.parse(localStorage.getItem("dohyo_starred_rikishi") || "[]")),
    simulatedWinners: JSON.parse(localStorage.getItem("dohyo_sim_winners") || "{}"), // boutKey -> { side: 'East'|'West', kimariteId: string }
    boutsForCurrentSelection: [],
    contest: loadContestState(),
    editingPlayerId: null,
    standings: {
      division: "Makuuchi",
      topN: "15",
      search: "",
      selectedRikishiId: null,
      loading: false
    }
  };

  function saveContestState() {
    try {
      localStorage.setItem("dohyo_contest_v1", JSON.stringify(state.contest));
    } catch (_) {}
  }

  function saveSimulatedWinners() {
    try {
      localStorage.setItem("dohyo_sim_winners", JSON.stringify(state.simulatedWinners));
    } catch (_) {}
  }

  // Lookup Maps
  const rikishiById = new Map();
  const rikishiByApiId = new Map();
  const rikishiByKanji = new Map();
  const rikishiByRomaji = new Map();

  function registerRikishi(r) {
    rikishiById.set(r.id, r);
    if (r.apiId) rikishiByApiId.set(r.apiId, r);
    if (r.shikonaKanji) rikishiByKanji.set(r.shikonaKanji, r);
    if (r.romaji) {
      rikishiByRomaji.set(r.romaji.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), r);
    }
  }

  DATA.rikishi.forEach(registerRikishi);

  const kimariteById = new Map();
  DATA.kimarite.forEach((k) => kimariteById.set(k.id, k));

  /* ========================================================================
     Initialization
     ======================================================================== */
  function init() {
    applyTheme(state.theme);
    applyLanguageMode(state.langMode);
    updateBoutOrderButton();
    initBashoSelector();
    initDayStrip();
    generateScheduleForDay(state.selectedDay);
    bindEvents();
    checkUrlAutoImportPicks();
    renderAll();
    // Auto-sync live results from sumo-api.com in background
    syncWithLiveSumoApi();
  }

  function updateBoutOrderButton() {
    const btn = document.getElementById("bout-order-toggle-btn");
    if (!btn) return;
    if (state.boutOrder === "asc") {
      btn.textContent = "⬆ Last Match at Bottom (序盤から)";
    } else {
      btn.textContent = "⬇ Last Match First (結びから)";
    }
  }

  /* ========================================================================
     Theme & Bilingual Mode Switchers
     ======================================================================== */
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("dohyo_theme", theme);

    const iconEl = document.getElementById("theme-icon");
    const labelEl = document.getElementById("theme-label");
    if (theme === "dark") {
      iconEl.textContent = "📜";
      labelEl.textContent = "Washi Light";
    } else {
      iconEl.textContent = "🏮";
      labelEl.textContent = "Arena Dark";
    }
  }

  function applyLanguageMode(langMode) {
    state.langMode = langMode;
    document.body.setAttribute("data-lang", langMode);
    localStorage.setItem("dohyo_lang", langMode);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang-mode") === langMode);
    });
  }

  /* ========================================================================
     Basho & 15-Day Strip Controls
     ======================================================================== */
  function initBashoSelector() {
    const select = document.getElementById("basho-select");
    select.innerHTML = DATA.bashoList
      .map(
        (b) =>
          `<option value="${b.id}" ${b.id === state.selectedBashoId ? "selected" : ""}>${b.nameEn} / ${b.nameJp}</option>`
      )
      .join("");
  }

  function initDayStrip() {
    const strip = document.getElementById("day-strip");
    strip.innerHTML = DATA.days
      .map((d) => {
        const isSpecial = d.day === 1 || d.day === 8 || d.day === 15;
        return `
          <button
            type="button"
            class="day-btn ${isSpecial ? "special-day" : ""} ${d.day === state.selectedDay ? "active" : ""}"
            data-day="${d.day}"
            title="${d.labelEn} (${d.labelJp})"
          >
            <span class="day-kanji">${d.labelJp}</span>
            <span>D${d.day}</span>
          </button>
        `;
      })
      .join("");
  }

  function getDayDateStr(basho, dayNum) {
    if (!basho || !basho.startDate) return "";
    const parts = basho.startDate.split("-").map(Number);
    const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + (dayNum - 1)));
    return dt.toISOString().slice(0, 10);
  }

  function updateHeaderBashoPill() {
    const basho = DATA.bashoList.find((b) => b.id === state.selectedBashoId) || DATA.bashoList[0];
    const dayObj = DATA.days.find((d) => d.day === state.selectedDay) || DATA.days[8];
    const dateStr = getDayDateStr(basho, dayObj.day);
    const pill = document.getElementById("active-basho-pill");
    if (pill) {
      pill.textContent = `★ ${basho.city} • ${dateStr} • Day ${dayObj.day} (${dayObj.labelJp})`;
    }
  }

  /* ========================================================================
     Dynamic Multi-Day Torikumi Generator & Live API Hydrator
     ======================================================================== */
  function generateScheduleForDay(dayNum) {
    updateHeaderBashoPill();

    // Kyushu 2026 Day 9 (2026-11-16) uses our curated card directly
    if (state.selectedBashoId === "202611" && dayNum === 9) {
      state.boutsForCurrentSelection = DATA.defaultTorikumi.map((b) => ({ ...b }));
      return;
    }

    // For other days (1..15), deterministically rotate pairings across Sanyaku & Maegashira
    // so every single day 1-15 has realistic, rich East vs. West matchups & storylines
    const sanyakuPool = DATA.rikishi.slice(0, 10);
    const maegashiraPool = DATA.rikishi.slice(10);
    const generated = [];

    // 5 Sanyaku / Upper feature bouts
    for (let i = 0; i < 5; i++) {
      const east = sanyakuPool[i];
      const westIdx = 5 + ((i + dayNum) % 5);
      const west = sanyakuPool[westIdx];
      const boutNo = 21 - i;
      const seed = (dayNum * 7 + i * 3) % 5;

      generated.push({
        boutNo,
        boutTitleEn:
          boutNo === 21
            ? `Day ${dayNum} Musubi no Ichiban (Final Bout)`
            : `Day ${dayNum} Upper San'yaku Clash`,
        boutTitleJp: boutNo === 21 ? `${dayNum}日目・結びの一番` : `${dayNum}日目・上位三役戦`,
        approxTime: `17:${50 - i * 8}`,
        isSanyaku: true,
        stakesTagEn: `${east.rankEn} vs. ${west.rankEn}`,
        stakesTagJp: `${east.rankJp} vs ${west.rankJp}`,
        eastId: east.id,
        westId: west.id,
        h2hEast: 2 + seed,
        h2hWest: 1 + ((dayNum + i) % 4),
        lastMeetingEn: `${east.romaji} won by ${east.signatureMoves[0]}`,
        lastMeetingJp: `前回対戦：${east.shikonaKanji}が勝利`,
        winnerSide: dayNum < 8 ? (seed % 2 === 0 ? "East" : "West") : null,
        kimariteId: dayNum < 8 ? (seed % 2 === 0 ? "yorikiri" : "oshidashi") : null,
        storylineEn: `Day ${dayNum} showdown pitting ${east.romaji} (${east.styleCode}) against ${west.romaji} (${west.styleCode}). Watch how ${east.romaji}'s ${east.signatureMoves[0]} counters ${west.romaji}'s initial tachiai charge.`,
        storylineJp: `${dayNum}日目の注目一番。${east.shikonaKanji}（${east.styleJp}）と${west.shikonaKanji}（${west.styleJp}）が激突。立ち合いの主導権争いに注目。`
      });
    }

    // 6 Maegashira bouts
    const mCount = Math.floor(maegashiraPool.length / 2);
    for (let j = 0; j < mCount; j++) {
      const east = maegashiraPool[j];
      const west = maegashiraPool[mCount + ((j + dayNum) % mCount)];
      const boutNo = 16 - j;
      const seed = (dayNum + j * 2) % 4;

      generated.push({
        boutNo,
        boutTitleEn: `Day ${dayNum} Makuuchi Bout #${boutNo}: ${east.romaji} vs. ${west.romaji}`,
        boutTitleJp: `${dayNum}日目・幕内取組：${east.shikonaKanji} vs ${west.shikonaKanji}`,
        approxTime: `16:${55 - j * 7}`,
        isSanyaku: false,
        stakesTagEn: `${east.heyaEn} vs. ${west.heyaEn} Stable`,
        stakesTagJp: `${east.heyaJp} vs ${west.heyaJp}`,
        eastId: east.id,
        westId: west.id,
        h2hEast: 1 + seed,
        h2hWest: 2 + (j % 3),
        lastMeetingEn: `${west.romaji} won by ${west.signatureMoves[0]}`,
        lastMeetingJp: `前回対戦：${west.shikonaKanji}が勝利`,
        winnerSide: dayNum < 8 ? (seed % 2 === 1 ? "East" : "West") : null,
        kimariteId: dayNum < 8 ? "yorikiri" : null,
        storylineEn: `Mid-division battle between ${east.romaji} ("${east.literalMeaningEn}") and ${west.romaji} ("${west.literalMeaningEn}").`,
        storylineJp: `「${east.shikonaKanji}」と「${west.shikonaKanji}」の幕内中位戦。双方の持ち味がぶつかり合う熱戦。`
      });
    }

    state.boutsForCurrentSelection = generated;
  }

  /* ========================================================================
     Live sumo-api.com Sync (Torikumi + All-Division Banzuke + Rikishi Stats)
     ======================================================================== */
  const KANJI_CHAR_GLOSS = {
    "大": ["Dai / Ō", "Great / Grand"],
    "小": ["Ko / Shō", "Small / Little"],
    "若": ["Waka", "Young / Youthful"],
    "貴": ["Taka", "Noble / Precious"],
    "隆": ["Taka / Ryū", "Prosperous / Elevated"],
    "豊": ["Hō / Yutaka", "Abundant / Bountiful"],
    "昇": ["Shō", "Rising / Ascending"],
    "龍": ["Ryū / Tatsu", "Dragon"],
    "富士": ["Fuji", "Mount Fuji"],
    "富": ["Fu / Tomi", "Abundant / Wealth"],
    "士": ["Ji / Shi", "Warrior / Samurai"],
    "琴": ["Koto", "Japanese Harp (Sadogatake)"],
    "桜": ["Sakura", "Cherry Blossom"],
    "櫻": ["Zakura", "Cherry Blossom"],
    "海": ["Umi / Mi", "Sea / Ocean"],
    "山": ["Yama / Zan", "Mountain"],
    "川": ["Kawa / Gawa", "River"],
    "里": ["Sato", "Village / Homeland"],
    "風": ["Kaze / Fū", "Wind"],
    "錦": ["Nishiki", "Brocade"],
    "青": ["Ao / Sei", "Blue / Azure"],
    "紅": ["Kō / Kurenai", "Crimson"],
    "白": ["Haku / Shiro", "White"],
    "黒": ["Kuro", "Black"],
    "金": ["Kin / Kane", "Gold"],
    "銀": ["Gin", "Silver"],
    "玉": ["Tama", "Jewel / Jade"],
    "鷲": ["Washi", "Eagle"],
    "鵬": ["Hō", "Mythical Giant Bird"],
    "王": ["Ō", "King / Monarch"],
    "朝": ["Asa", "Morning (Takasago)"],
    "千代": ["Chiyo", "Thousand Generations (Kokonoe)"],
    "千": ["Chi", "Thousand"],
    "代": ["Yo / Dai", "Generation / Era"],
    "北": ["Kita / Hoku", "North"],
    "東": ["Higashi / Azuma", "East"],
    "西": ["Nishi", "West"],
    "南": ["Minami / Nan", "South"],
    "翔": ["Shō", "Soar / Fly"],
    "勝": ["Shō / Katsu", "Victory"],
    "峰": ["Hō / Mine", "Mountain Peak"],
    "豪": ["Gō", "Mighty / Heroic"],
    "輝": ["Teru / Ki", "Radiance / Shine"],
    "光": ["Hikari / Kō", "Light"],
    "天": ["Ten / Ama", "Heaven / Sky"],
    "وم": ["", ""],
    "ノ": ["no", "Possessive particle"],
    "の": ["no", "Possessive particle"],
    "乃": ["no", "Classical possessive particle"]
  };

  function rankJpFromEn(rankEn) {
    if (!rankEn) return "本場所";
    const m = String(rankEn).match(
      /(Yokozuna|Ozeki|Sekiwake|Komusubi|Maegashira|Juryo|Makushita|Sandanme|Jonidan|Jonokuchi)\s*(\d+)?\s*(East|West)?/i
    );
    if (!m) return rankEn;
    const tier = m[1];
    const num = m[2] || "";
    const side = m[3] || "";
    const sideJp = side.toLowerCase() === "west" ? "西" : side.toLowerCase() === "east" ? "東" : "";
    const map = {
      yokozuna: "横綱",
      ozeki: "大関",
      sekiwake: "関脇",
      komusubi: "小結",
      maegashira: "前頭",
      juryo: "十両",
      makushita: "幕下",
      sandanme: "三段目",
      jonidan: "序二段",
      jonokuchi: "序ノ口"
    };
    const tierJp = map[tier.toLowerCase()] || tier;
    if (["yokozuna", "ozeki", "sekiwake", "komusubi"].includes(tier.toLowerCase())) {
      return `${sideJp}${tierJp}`;
    }
    return `${sideJp}${tierJp}${num ? num + "枚目" : ""}`;
  }

  function rankTierFromEn(rankEn) {
    const s = String(rankEn || "");
    for (const t of [
      "Yokozuna",
      "Ozeki",
      "Sekiwake",
      "Komusubi",
      "Maegashira",
      "Juryo",
      "Makushita",
      "Sandanme",
      "Jonidan",
      "Jonokuchi"
    ]) {
      if (s.includes(t)) return t;
    }
    return "Maegashira";
  }

  function parseShikonaJp(rawJp, fallbackRomaji) {
    if (!rawJp) {
      return { kanji: fallbackRomaji || "力士", furigana: (fallbackRomaji || "").toLowerCase(), given: "" };
    }
    // Lower-division banzuke often formats as "納谷(なや)" or "千代翔馬　富士雄"
    const parenMatch = rawJp.match(/^([^\(（]+?)[\(（]([^\)）]+)[\)）]/);
    if (parenMatch) {
      return {
        kanji: parenMatch[1].trim(),
        furigana: parenMatch[2].trim(),
        given: ""
      };
    }
    const parts = rawJp.replace(/\u3000/g, " ").trim().split(/\s+/);
    return {
      kanji: parts[0] || fallbackRomaji || "力士",
      furigana: (fallbackRomaji || "").toLowerCase(),
      given: parts[1] || ""
    };
  }

  function buildAutoKanjiBreakdown(kanjiStr, heyaEn) {
    const chars = [...(kanjiStr || "")].filter((c) => c.trim());
    return chars.map((ch) => {
      const gloss = KANJI_CHAR_GLOSS[ch];
      return {
        char: ch,
        reading: gloss ? gloss[0] : ch,
        meaningEn: gloss ? gloss[1] : "Shikona Kanji",
        noteEn: heyaEn && heyaEn !== "JSA" ? `${heyaEn} stable ring name character` : "Traditional sumo ring name character"
      };
    });
  }

  let bulkRikishiPromise = null;
  const liveBanzukeByBasho = new Map(); // bashoApiId -> Map(rikishiId -> banzukeEntry)

  async function ensureRikishiAndBanzukeLoaded(bashoApiId) {
    // 1. Fetch all 596 active Rikishi physical profiles once per session
    if (!bulkRikishiPromise) {
      bulkRikishiPromise = fetch("https://sumo-api.com/api/rikishis?limit=1000")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.records)) {
            data.records.forEach((rec) => {
              upsertRikishiFromApi(rec, null);
            });
          }
          return data;
        })
        .catch(() => null);
    }

    // 2. Fetch all 6 division banzuke (wins, losses, absences, shikonaJp, rank) for this basho
    if (!liveBanzukeByBasho.has(bashoApiId)) {
      const bMap = new Map();
      liveBanzukeByBasho.set(bashoApiId, bMap);
      await Promise.allSettled(
        DIVISIONS.map(async (divMeta) => {
          const res = await fetch(`https://sumo-api.com/api/basho/${bashoApiId}/banzuke/${divMeta.key}`);
          if (!res.ok) return;
          const json = await res.json();
          ["east", "west"].forEach((sideKey) => {
            if (Array.isArray(json[sideKey])) {
              json[sideKey].forEach((entry) => {
                if (entry && entry.rikishiID) {
                  bMap.set(entry.rikishiID, { ...entry, division: divMeta.key });
                }
              });
            }
          });
        })
      );
    }

    await bulkRikishiPromise;
    const bMap = liveBanzukeByBasho.get(bashoApiId);
    if (bMap && bMap.size > 0) {
      bMap.forEach((bEntry) => {
        upsertRikishiFromApi(null, bEntry);
      });
    }
  }

  function upsertRikishiFromApi(apiRec, banzukeEntry) {
    const apiId = (apiRec && apiRec.id) || (banzukeEntry && banzukeEntry.rikishiID);
    const shikonaEn = (banzukeEntry && banzukeEntry.shikonaEn) || (apiRec && apiRec.shikonaEn) || "";
    const norm = shikonaEn.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let existing = (apiId && rikishiByApiId.get(apiId)) || (norm && rikishiByRomaji.get(norm));

    const rawJp = (banzukeEntry && banzukeEntry.shikonaJp) || (apiRec && apiRec.shikonaJp) || "";
    const parsedJp = parseShikonaJp(rawJp, shikonaEn);
    const rankEn = (banzukeEntry && banzukeEntry.rank) || (apiRec && apiRec.currentRank) || (existing && existing.rankEn) || "Grand Sumo";
    const rankJp = rankJpFromEn(rankEn);
    const rankTier = rankTierFromEn(rankEn);
    const side = (banzukeEntry && banzukeEntry.side) || (rankEn.includes("West") ? "West" : "East");

    let recordStr = existing ? existing.currentRecord : "0-0";
    if (banzukeEntry && typeof banzukeEntry.wins === "number" && typeof banzukeEntry.losses === "number") {
      recordStr =
        `${banzukeEntry.wins}-${banzukeEntry.losses}` +
        (banzukeEntry.absences ? `-${banzukeEntry.absences}` : "");
    }

    if (existing) {
      if (apiId) existing.apiId = apiId;
      if (parsedJp.kanji && (existing.shikonaKanji === existing.romaji || !existing.shikonaKanji)) {
        existing.shikonaKanji = parsedJp.kanji;
        existing.rubyHtml = parsedJp.kanji;
      }
      if (parsedJp.furigana && (!existing.furigana || existing.furigana === existing.romaji)) {
        existing.furigana = parsedJp.furigana;
      }
      if (parsedJp.given && !existing.givenName) {
        existing.givenName = parsedJp.given;
      }
      if (banzukeEntry && banzukeEntry.rank) {
        existing.rankEn = rankEn;
        existing.rankJp = rankJp;
        existing.rankTier = rankTier;
        existing.side = side;
      }
      if (banzukeEntry && typeof banzukeEntry.wins === "number") {
        existing.currentRecord = recordStr;
        if (existing.careerRecord === "Live API" || existing.careerRecord.startsWith("2026 Kyushu:")) {
          existing.careerRecord = `Current Basho: ${recordStr}`;
        }
      }
      if (apiRec) {
        if (apiRec.height) existing.heightCm = Math.round(apiRec.height);
        if (apiRec.weight) existing.weightKg = Math.round(apiRec.weight);
        if (apiRec.heya) {
          existing.heyaEn = apiRec.heya;
          existing.heyaJp = `${apiRec.heya}部屋`;
        }
        if (apiRec.shusshin) {
          existing.originEn = apiRec.shusshin;
          existing.originJp = apiRec.shusshin;
        }
        if (apiRec.debut) {
          existing.debut = apiRec.debut;
        }
      }
      if (!existing.kanjiBreakdown || existing.kanjiBreakdown.length === 0) {
        existing.kanjiBreakdown = buildAutoKanjiBreakdown(existing.shikonaKanji, existing.heyaEn);
      }
      registerRikishi(existing);
      return existing;
    }

    const heyaEn = (apiRec && apiRec.heya) || "Grand Sumo";
    const originEn = (apiRec && apiRec.shusshin) || "Japan";
    const heightCm = apiRec && apiRec.height ? Math.round(apiRec.height) : 180;
    const weightKg = apiRec && apiRec.weight ? Math.round(apiRec.weight) : 135;
    const slug = (norm || `rikishi-${apiId || Math.random()}`).replace(/[^a-z0-9]/g, "") + (apiId ? `-${apiId}` : "");

    const newProfile = {
      id: slug,
      apiId: apiId || 0,
      shikonaKanji: parsedJp.kanji,
      furigana: parsedJp.furigana,
      rubyHtml: parsedJp.kanji,
      romaji: shikonaEn || "Rikishi",
      givenName: parsedJp.given,
      rankEn,
      rankJp,
      rankTier,
      side,
      heyaEn,
      heyaJp: `${heyaEn}部屋`,
      originEn,
      originJp: originEn,
      heightCm,
      weightKg,
      styleCode: `${rankTier} • ${heyaEn}`,
      styleEn: `${heyaEn} stable competitor (${heightCm}cm, ${weightKg}kg)`,
      styleJp: `${heyaEn}部屋所属（${heightCm}cm・${weightKg}kg）`,
      signatureMoves: ["Yorikiri", "Oshidashi"],
      makuuchiYusho: 0,
      sansho: rankTier,
      kinboshi: 0,
      careerRecord: `Current Basho: ${recordStr}`,
      currentRecord: recordStr,
      literalMeaningEn: `${parsedJp.kanji} (${shikonaEn})`,
      literalMeaningJp: `${parsedJp.kanji}（${heyaEn}部屋）`,
      kanjiBreakdown: buildAutoKanjiBreakdown(parsedJp.kanji, heyaEn),
      storyEn: `${shikonaEn} (${parsedJp.kanji}) represents ${heyaEn} stable from ${originEn}, standing ${heightCm}cm and ${weightKg}kg with a ${recordStr} tournament record.`,
      storyJp: `${heyaEn}部屋所属、${originEn}出身。体格は${heightCm}cm・${weightKg}kg、今場所の星取は${recordStr}。`
    };
    DATA.rikishi.push(newProfile);
    registerRikishi(newProfile);
    return newProfile;
  }

  function resolveOrCreateRikishi(apiId, shikonaRaw, rankRaw, side) {
    if (apiId && rikishiByApiId.has(apiId)) {
      const found = rikishiByApiId.get(apiId);
      if (rankRaw && (!found.rankEn || found.rankEn === "Grand Sumo")) {
        found.rankEn = rankRaw;
        found.rankJp = rankJpFromEn(rankRaw);
        found.rankTier = rankTierFromEn(rankRaw);
      }
      return found;
    }
    const norm = (shikonaRaw || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (norm && rikishiByRomaji.has(norm)) return rikishiByRomaji.get(norm);

    return upsertRikishiFromApi(
      { id: apiId, shikonaEn: shikonaRaw, currentRank: rankRaw },
      { rikishiID: apiId, shikonaEn: shikonaRaw, rank: rankRaw, side }
    );
  }

  function updateDivisionPills() {
    const container = document.getElementById("torikumi-division-pills");
    if (!container) return;
    const counts = new Map();
    state.boutsForCurrentSelection.forEach((b) => {
      const div = b.division || "Makuuchi";
      counts.set(div, (counts.get(div) || 0) + 1);
    });
    const total = state.boutsForCurrentSelection.length;
    container.querySelectorAll(".filter-pill").forEach((btn) => {
      const div = btn.getAttribute("data-division");
      if (div === "all") {
        btn.textContent = `All Divisions 全階級 (${total})`;
      } else {
        const meta = DIVISION_MAP.get(div);
        const c = counts.get(div) || 0;
        btn.textContent = `${div} ${meta ? meta.jp : ""} (${c})`;
      }
      btn.classList.toggle("active", div === state.divisionFilter);
    });
  }

  async function syncWithLiveSumoApi() {
    const dot = document.getElementById("api-status-dot");
    const text = document.getElementById("api-status-text");
    const basho = DATA.bashoList.find((b) => b.id === state.selectedBashoId) || DATA.bashoList[0];
    const dateStr = getDayDateStr(basho, state.selectedDay);

    dot.classList.add("syncing");
    text.textContent = `Syncing all 6 divisions & stats (${dateStr} • Day ${state.selectedDay})...`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8500);

      const curatedByBoutNo = new Map();
      if (state.selectedBashoId === "202611" && state.selectedDay === 9) {
        DATA.defaultTorikumi.forEach((b) => curatedByBoutNo.set(b.boutNo, b));
      }

      const [, results] = await Promise.all([
        ensureRikishiAndBanzukeLoaded(basho.apiId),
        Promise.allSettled(
          DIVISIONS.map(async (divMeta) => {
            const url = `https://sumo-api.com/api/basho/${basho.apiId}/torikumi/${divMeta.key}/${state.selectedDay}`;
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return { divMeta, torikumi: json && Array.isArray(json.torikumi) ? json.torikumi : [] };
          })
        )
      ]);
      clearTimeout(timeout);

      const allMapped = [];
      results.forEach((r) => {
        if (r.status !== "fulfilled") return;
        const { divMeta, torikumi } = r.value;
        torikumi.forEach((item, idx) => {
          const bno = item.matchNo || item.boutNo || idx + 1;
          const curated = divMeta.key === "Makuuchi" ? curatedByBoutNo.get(bno) : null;
          const eastMatch = resolveOrCreateRikishi(item.eastId, item.eastShikona, item.eastRank, "East");
          const westMatch = resolveOrCreateRikishi(item.westId, item.westShikona, item.westRank, "West");

          const totalMins = Math.round(divMeta.startMin + (bno - 1) * divMeta.stepMin);
          const approxTime = `${Math.floor(totalMins / 60)}:${String(totalMins % 60).padStart(2, "0")}`;

          const winnerSide =
            item.winnerId && item.winnerId === item.eastId
              ? "East"
              : item.winnerId && item.winnerId === item.westId
              ? "West"
              : null;

          const eRec = eastMatch.currentRecord || "";
          const wRec = westMatch.currentRecord || "";

          allMapped.push({
            division: divMeta.key,
            divisionJp: divMeta.jp,
            divisionOrder: divMeta.order,
            boutNo: bno,
            boutTitleEn: curated
              ? curated.boutTitleEn
              : `${divMeta.key} Bout #${bno}: ${eastMatch.romaji} (${eRec}) vs. ${westMatch.romaji} (${wRec})`,
            boutTitleJp: curated
              ? curated.boutTitleJp
              : `${divMeta.jp}第${bno}番：${eastMatch.shikonaKanji}（${eRec}）vs ${westMatch.shikonaKanji}（${wRec}）`,
            approxTime: curated ? curated.approxTime : approxTime,
            isSanyaku: curated ? curated.isSanyaku : divMeta.key === "Makuuchi" && bno >= 15,
            stakesTagEn: curated
              ? curated.stakesTagEn
              : `${item.eastRank || eastMatch.rankEn} (${eRec}) vs. ${item.westRank || westMatch.rankEn} (${wRec})`,
            stakesTagJp: curated
              ? curated.stakesTagJp
              : `${eastMatch.rankJp}（${eRec}）vs ${westMatch.rankJp}（${wRec}）`,
            eastId: eastMatch.id,
            westId: westMatch.id,
            h2hEast: curated ? curated.h2hEast : 1,
            h2hWest: curated ? curated.h2hWest : 1,
            lastMeetingEn: item.kimarite
              ? `Result: ${item.kimarite}`
              : curated
              ? curated.lastMeetingEn
              : `${dateStr} • Day ${state.selectedDay}`,
            lastMeetingJp: item.kimarite
              ? `決まり手：${item.kimarite}`
              : curated
              ? curated.lastMeetingJp
              : `${dateStr}（${state.selectedDay}日目）`,
            winnerSide,
            kimariteId: item.kimarite ? item.kimarite.toLowerCase() : null,
            storylineEn: curated
              ? curated.storylineEn
              : `${divMeta.key} matchup: ${eastMatch.romaji} (${eRec}, ${eastMatch.heyaEn}, ${eastMatch.heightCm}cm/${eastMatch.weightKg}kg, from ${eastMatch.originEn}) faces ${westMatch.romaji} (${wRec}, ${westMatch.heyaEn}, ${westMatch.heightCm}cm/${westMatch.weightKg}kg, from ${westMatch.originEn}).`,
            storylineJp: curated
              ? curated.storylineJp
              : `${divMeta.jp}取組：${eastMatch.shikonaKanji}（${eRec}・${eastMatch.heyaJp}・${eastMatch.heightCm}cm/${eastMatch.weightKg}kg）と${westMatch.shikonaKanji}（${wRec}・${westMatch.heyaJp}・${westMatch.heightCm}cm/${westMatch.weightKg}kg）が対戦。`
          });
        });
      });

      if (allMapped.length > 0) {
        state.boutsForCurrentSelection = allMapped;
        dot.classList.remove("syncing");
        text.textContent = `Live API Synced • ${dateStr} (${allMapped.length} Bouts + All 6 Divisions Stats)`;
        updateDivisionPills();
        renderTorikumiList();
        renderRikishiDirectory();
        renderPredictionsTab();
        if (state.activeTab === "standings") renderStandingsTab();
        return;
      }
      throw new Error("Empty torikumi payload");
    } catch (err) {
      dot.classList.remove("syncing");
      text.textContent = `Offline-First Curated Dataset Active (${dateStr} • Day ${state.selectedDay})`;
      generateScheduleForDay(state.selectedDay);
      updateDivisionPills();
      renderTorikumiList();
      renderPredictionsTab();
      if (state.activeTab === "standings") renderStandingsTab();
    }
  }

  /* ========================================================================
     Tab 1 Renderer: Torikumi Bout Cards + Inline Contest Picker
     ======================================================================== */
  function renderTorikumiList() {
    const container = document.getElementById("bout-list-container");
    const watchlistCountEl = document.getElementById("watchlist-count");
    const summaryEl = document.getElementById("bout-count-summary");
    const basho = DATA.bashoList.find((b) => b.id === state.selectedBashoId) || DATA.bashoList[0];
    const dateStr = getDayDateStr(basho, state.selectedDay);

    watchlistCountEl.textContent = state.starredBouts.size + state.starredRikishi.size;
    renderDenkoScoreboardPreview();
    updateDivisionPills();
    renderInlineContestPickerBar();

    const activePlayer = getActiveContestPlayer();
    const query = state.torikumiSearch.trim().toLowerCase();

    const filtered = state.boutsForCurrentSelection
      .filter((bout) => {
        const div = bout.division || "Makuuchi";
        if (state.divisionFilter !== "all" && div !== state.divisionFilter) return false;

        const east = rikishiById.get(bout.eastId);
        const west = rikishiById.get(bout.westId);
        if (!east || !west) return false;

        const boutKey = getBoutKey(bout);
        const isStarred =
          state.starredBouts.has(boutKey) ||
          state.starredRikishi.has(east.id) ||
          state.starredRikishi.has(west.id);

        if (state.torikumiFilter === "sanyaku" && !bout.isSanyaku) return false;
        if (state.torikumiFilter === "stakes") {
          const hasLeader =
            east.currentRecord.includes("7-1") ||
            west.currentRecord.includes("7-1") ||
            east.currentRecord.includes("8-0") ||
            west.currentRecord.includes("8-0") ||
            east.currentRecord.includes("7-0") ||
            west.currentRecord.includes("7-0");
          if (!hasLeader) return false;
        }
        if (state.torikumiFilter === "kyushu") {
          const kyushuPattern = /Nagasaki|Kumamoto|Okinawa|Fukuoka|Kyushu|長崎|熊本|沖縄|福岡|九州/i;
          if (!kyushuPattern.test(east.originEn + east.originJp + west.originEn + west.originJp)) {
            return false;
          }
        }
        if (state.torikumiFilter === "starred" && !isStarred) return false;

        if (query) {
          const haystack = [
            div,
            bout.divisionJp || "",
            east.shikonaKanji,
            east.romaji,
            east.furigana,
            east.styleCode,
            east.heyaEn,
            west.shikonaKanji,
            west.romaji,
            west.furigana,
            west.styleCode,
            west.heyaEn,
            bout.storylineEn,
            bout.storylineJp
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(query)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const divA = a.divisionOrder || 6;
        const divB = b.divisionOrder || 6;
        if (divA !== divB) {
          return state.boutOrder === "asc" ? divA - divB : divB - divA;
        }
        return state.boutOrder === "asc" ? a.boutNo - b.boutNo : b.boutNo - a.boutNo;
      });

    const divLabel = state.divisionFilter === "all" ? "All Divisions" : state.divisionFilter;
    summaryEl.textContent = `Showing ${filtered.length} of ${state.boutsForCurrentSelection.length} bouts (${divLabel} • ${dateStr} • Day ${state.selectedDay})`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="banzuke-banner" style="text-align:center; padding:2rem;">
          <p style="font-weight:700; margin-bottom:0.5rem;">No bouts match your current filter.</p>
          <button type="button" class="action-btn" id="reset-torikumi-filter-btn">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById("reset-torikumi-filter-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          state.divisionFilter = "all";
          state.torikumiFilter = "all";
          state.torikumiSearch = "";
          document.getElementById("torikumi-search").value = "";
          document.querySelectorAll("#torikumi-filter-pills .filter-pill").forEach((p) => {
            p.classList.toggle("active", p.getAttribute("data-filter") === "all");
          });
          updateDivisionPills();
          renderTorikumiList();
        });
      }
      return;
    }

    container.innerHTML = filtered
      .map((bout) => {
        const div = bout.division || "Makuuchi";
        const divJp = bout.divisionJp || "幕内";
        const east = rikishiById.get(bout.eastId);
        const west = rikishiById.get(bout.westId);
        const boutKey = getBoutKey(bout);
        const isStarred =
          state.starredBouts.has(boutKey) ||
          state.starredRikishi.has(east.id) ||
          state.starredRikishi.has(west.id);

        const sim = state.simulatedWinners[boutKey];
        const effectiveWinner = sim ? sim.side : bout.winnerSide;
        const effectiveKimariteId = sim ? sim.kimariteId : bout.kimariteId;
        const kimariteObj = effectiveKimariteId ? kimariteById.get(effectiveKimariteId) : null;

        const totalH2H = Math.max(1, bout.h2hEast + bout.h2hWest);
        const eastPct = Math.round((bout.h2hEast / totalH2H) * 100);
        const westPct = 100 - eastPct;

        const activePick = activePlayer && activePlayer.picks ? activePlayer.picks[boutKey] : null;
        const groupPickChipsHtml = state.contest.players
          .map((p) => {
            const pSide = p.picks ? p.picks[boutKey] : null;
            if (!pSide) {
              return `<span class="player-pick-chip"><span class="player-dot" style="background:${p.color};"></span>${escapeHtml(p.name)}: —</span>`;
            }
            const pickedRikishi = pSide === "East" ? east : west;
            const sideKanji = pSide === "East" ? "東" : "西";
            let statusClass = "";
            let statusMark = "";
            if (effectiveWinner) {
              if (pSide === effectiveWinner) {
                statusClass = "pick-correct";
                statusMark = " ✓ +1";
              } else {
                statusClass = "pick-wrong";
                statusMark = " ✗";
              }
            }
            return `<span class="player-pick-chip ${statusClass}"><span class="player-dot" style="background:${p.color};"></span>${escapeHtml(p.name)}: ${sideKanji} ${pickedRikishi.shikonaKanji} (${pickedRikishi.romaji})${statusMark}</span>`;
          })
          .join("");

        return `
          <article class="bout-card ${isStarred ? "starred-bout" : ""}" id="bout-card-${div}-${bout.boutNo}">
            <!-- Top Metadata Bar -->
            <div class="bout-meta-bar">
              <div class="bout-num-group">
                <span class="bout-number-badge">${divJp} #${bout.boutNo}</span>
                <span class="bout-time-tag">⏱ ${bout.approxTime}</span>
                <span class="stakes-badge lang-en-only">${bout.stakesTagEn}</span>
                <span class="stakes-badge lang-jp-only">${bout.stakesTagJp}</span>
              </div>
              <button
                type="button"
                class="star-bout-btn ${isStarred ? "active" : ""}"
                data-star-bout="${boutKey}"
                aria-label="Star or bookmark this bout"
              >
                <span>${isStarred ? "★ Watchlisted" : "☆ Watch"}</span>
              </button>
            </div>

            <!-- East vs Gunbai Center vs West -->
            <div class="bout-matchup-grid">
              <!-- HIGASHI (EAST) -->
              <div class="corner-side corner-east" data-inspect-rikishi="${east.id}" role="button" tabindex="0" title="Tap for ${east.romaji} Kanji breakdown & profile">
                <div>
                  <div class="corner-header">
                    <span class="side-indicator">東 HIGASHI</span>
                    <span class="rank-label lang-en-only">${east.rankEn}</span>
                    <span class="rank-label lang-jp-only">${east.rankJp}</span>
                    ${effectiveWinner === "East" ? `<span class="shiroboshi-mark">○ WIN 白星</span>` : ""}
                    ${effectiveWinner === "West" ? `<span style="font-size:0.74rem; color:var(--text-muted);">● 黒星</span>` : ""}
                  </div>
                  <div class="rikishi-name-block">
                    <div class="rikishi-kanji-large">${east.rubyHtml}</div>
                    <span class="rikishi-romaji-sub">${east.romaji} <span style="font-weight:400; font-size:0.78rem;">(${east.heyaEn} / ${east.heyaJp})</span></span>
                    <span class="rikishi-meaning-hint">"${east.literalMeaningEn}"</span>
                  </div>
                </div>
                <div class="corner-stats-row">
                  <span class="record-pill">${east.currentRecord}</span>
                  <span class="style-tag">${east.styleCode}</span>
                  <span class="style-tag">${east.heightCm}cm • ${east.weightKg}kg</span>
                </div>
              </div>

              <!-- CENTER GUNBAI & HEAD-TO-HEAD -->
              <div class="bout-center-gunbai">
                <span class="h2h-label">Head-to-Head 対戦成績</span>
                <div class="h2h-tally">
                  <span class="h2h-east-num">${bout.h2hEast}</span>
                  <span style="color:var(--text-muted); font-size:0.75rem;">—</span>
                  <span class="h2h-west-num">${bout.h2hWest}</span>
                </div>
                <div class="h2h-bar" aria-hidden="true">
                  <div class="h2h-bar-east" style="width:${eastPct}%"></div>
                  <div class="h2h-bar-west" style="width:${westPct}%"></div>
                </div>
                ${
                  kimariteObj
                    ? `<button type="button" class="kimarite-result-chip" data-inspect-kimarite="${kimariteObj.id}">
                        決まり手: ${kimariteObj.kanji} (${kimariteObj.romaji})
                      </button>`
                    : `<span style="font-size:0.68rem; color:var(--text-muted);">${bout.lastMeetingEn}</span>`
                }
              </div>

              <!-- NISHI (WEST) -->
              <div class="corner-side corner-west" data-inspect-rikishi="${west.id}" role="button" tabindex="0" title="Tap for ${west.romaji} Kanji breakdown & profile">
                <div>
                  <div class="corner-header">
                    ${effectiveWinner === "West" ? `<span class="shiroboshi-mark">○ WIN 白星</span>` : ""}
                    ${effectiveWinner === "East" ? `<span style="font-size:0.74rem; color:var(--text-muted);">● 黒星</span>` : ""}
                    <span class="rank-label lang-en-only">${west.rankEn}</span>
                    <span class="rank-label lang-jp-only">${west.rankJp}</span>
                    <span class="side-indicator">西 NISHI</span>
                  </div>
                  <div class="rikishi-name-block">
                    <div class="rikishi-kanji-large">${west.rubyHtml}</div>
                    <span class="rikishi-romaji-sub">${west.romaji} <span style="font-weight:400; font-size:0.78rem;">(${west.heyaEn} / ${west.heyaJp})</span></span>
                    <span class="rikishi-meaning-hint">"${west.literalMeaningEn}"</span>
                  </div>
                </div>
                <div class="corner-stats-row">
                  <span class="style-tag">${west.heightCm}cm • ${west.weightKg}kg</span>
                  <span class="style-tag">${west.styleCode}</span>
                  <span class="record-pill">${west.currentRecord}</span>
                </div>
              </div>
            </div>

            <!-- Storyline & Match Insight Box -->
            <div class="bout-storyline-box">
              <div class="storyline-header">
                <span class="storyline-badge">
                  🪭 ${bout.boutTitleEn} / ${bout.boutTitleJp}
                </span>
              </div>
              <p class="storyline-text-en lang-en-only">${bout.storylineEn}</p>
              <p class="storyline-text-jp lang-jp-only">${bout.storylineJp}</p>

              <!-- Predictions & Result Strip -->
              <div class="bout-prediction-strip">
                <div class="bout-pick-top-row">
                  <div class="pick-btn-group">
                    <span style="font-size:0.72rem; font-weight:800; color:var(--text-primary);">
                      🎯 ${activePlayer ? escapeHtml(activePlayer.name) : "Player"}'s Pick (予想):
                    </span>
                    <button
                      type="button"
                      class="pick-side-btn east-btn ${activePick === "East" ? "selected-east" : ""}"
                      data-pick-bout="${boutKey}"
                      data-pick-side="East"
                    >
                      東 Pick ${east.shikonaKanji} (${east.romaji})
                    </button>
                    <button
                      type="button"
                      class="pick-side-btn west-btn ${activePick === "West" ? "selected-west" : ""}"
                      data-pick-bout="${boutKey}"
                      data-pick-side="West"
                    >
                      西 Pick ${west.shikonaKanji} (${west.romaji})
                    </button>
                  </div>
                  <div style="display:flex; gap:0.3rem; align-items:center; flex-wrap:wrap;">
                    <span style="font-size:0.68rem; color:var(--text-muted); font-weight:700;">Judge 判定:</span>
                    <button type="button" class="inspect-btn" data-mark-winner="${boutKey}" data-side="East" data-move="${east.signatureMoves[0].toLowerCase()}">
                      East ○ ${east.shikonaKanji}
                    </button>
                    <button type="button" class="inspect-btn" data-mark-winner="${boutKey}" data-side="West" data-move="${west.signatureMoves[0].toLowerCase()}">
                      West ○ ${west.shikonaKanji}
                    </button>
                    ${
                      sim
                        ? `<button type="button" class="inspect-btn" data-clear-winner="${boutKey}" title="Clear manual referee result">✕ Clear</button>`
                        : ""
                    }
                  </div>
                </div>
                <div class="group-picks-row">
                  <span style="font-size:0.68rem; font-weight:700; color:var(--text-muted);">Group Picks:</span>
                  ${groupPickChipsHtml}
                </div>
              </div>

              <!-- Interactive Quick Kanji Decode Controls -->
              <div class="bout-quick-actions">
                <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                  <button type="button" class="inspect-btn" data-inspect-rikishi="${east.id}">
                    🔍 Decode ${east.shikonaKanji} (${east.romaji})
                  </button>
                  <button type="button" class="inspect-btn" data-inspect-rikishi="${west.id}">
                    🔍 Decode ${west.shikonaKanji} (${west.romaji})
                  </button>
                </div>
                <button type="button" class="inspect-btn" data-open-tab="predictions">
                  🏆 Open 4-Player Leaderboard &amp; Picks →
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  /* ========================================================================
     Tab 2 Renderer: Rikishi Directory & Shikona Kanji Deep-Dive
     ======================================================================== */
  function renderRikishiDirectory() {
    const container = document.getElementById("rikishi-grid-container");
    const query = state.rikishiSearch.trim().toLowerCase();

    const filtered = DATA.rikishi.filter((r) => {
      if (state.rikishiRankFilter === "Yokozuna-Ozeki") {
        if (r.rankTier !== "Yokozuna" && r.rankTier !== "Ozeki") return false;
      } else if (state.rikishiRankFilter === "Sanyaku") {
        if (r.rankTier !== "Sekiwake" && r.rankTier !== "Komusubi") return false;
      } else if (state.rikishiRankFilter === "Maegashira") {
        if (r.rankTier !== "Maegashira") return false;
      } else if (state.rikishiRankFilter === "Juryo") {
        if (r.rankTier !== "Juryo") return false;
      } else if (state.rikishiRankFilter === "Makushita") {
        if (r.rankTier !== "Makushita") return false;
      } else if (state.rikishiRankFilter === "Lower") {
        if (r.rankTier !== "Sandanme" && r.rankTier !== "Jonidan" && r.rankTier !== "Jonokuchi") return false;
      } else if (state.rikishiRankFilter === "Fuji") {
        if (!r.shikonaKanji.includes("富士")) return false;
      }

      if (query) {
        const kanjiMeanings = r.kanjiBreakdown
          .map((k) => `${k.char} ${k.reading} ${k.meaningEn} ${k.noteEn}`)
          .join(" ");
        const haystack = [
          r.shikonaKanji,
          r.furigana,
          r.romaji,
          r.rankEn,
          r.rankJp,
          r.heyaEn,
          r.heyaJp,
          r.originEn,
          r.originJp,
          r.literalMeaningEn,
          r.literalMeaningJp,
          r.storyEn,
          r.storyJp,
          kanjiMeanings
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    const visibleList = query || state.rikishiRankFilter !== "all" ? filtered.slice(0, 120) : filtered.slice(0, 72);

    container.innerHTML = visibleList
      .map((r) => {
        const isStarred = state.starredRikishi.has(r.id);
        return `
          <article class="rikishi-card" id="rikishi-card-${r.id}">
            <div class="rikishi-card-top">
              <div class="rikishi-title-group">
                <span class="rank-stamp ${r.side === "West" ? "west-stamp" : ""}">
                  ${r.rankJp} • ${r.rankEn}
                </span>
                <h3 style="margin-top:0.35rem;">${r.rubyHtml}</h3>
                <div class="rikishi-romaji-headline">${r.romaji} <span style="font-size:0.78rem; color:var(--text-muted); font-weight:500;">(${r.furigana})</span></div>
              </div>
              <button
                type="button"
                class="star-bout-btn ${isStarred ? "active" : ""}"
                data-star-rikishi="${r.id}"
                title="Add ${r.romaji} to Watchlist"
              >
                ${isStarred ? "★ Starred" : "☆ Star"}
              </button>
            </div>

            <!-- Literal Shikona Meaning Banner -->
            <div class="shikona-literal-banner">
              <div class="lang-en-only"><strong>Shikona Meaning:</strong> "${r.literalMeaningEn}"</div>
              <div class="lang-jp-only"><strong>四股名の意味:</strong> ${r.literalMeaningJp}</div>
            </div>

            <!-- Character-by-Character Kanji Breakdown Tiles -->
            <div class="kanji-breakdown-grid">
              ${r.kanjiBreakdown
                .map(
                  (kb) => `
                <div class="kanji-tile">
                  <span class="kanji-char">${kb.char}</span>
                  <span class="kanji-reading">${kb.reading}</span>
                  <span class="kanji-meaning">${kb.meaningEn}</span>
                  <span class="kanji-note">${kb.noteEn}</span>
                </div>
              `
                )
                .join("")}
            </div>

            <!-- Storyline / Lineage Note -->
            <p style="font-size:0.8rem; color:var(--text-secondary);" class="lang-en-only">${r.storyEn}</p>
            <p style="font-size:0.79rem; color:var(--text-secondary);" class="lang-jp-only">${r.storyJp}</p>

            <!-- Career & Physical Metadata -->
            <div class="rikishi-meta-table">
              <div class="meta-item">
                <span class="meta-k">Stable (部屋)</span>
                <span class="meta-v">${r.heyaEn} (${r.heyaJp})</span>
              </div>
              <div class="meta-item">
                <span class="meta-k">Origin (出身)</span>
                <span class="meta-v">${r.originEn}</span>
              </div>
              <div class="meta-item">
                <span class="meta-k">Build &amp; Style (体格・型)</span>
                <span class="meta-v">${r.heightCm}cm / ${r.weightKg}kg • ${r.styleCode}</span>
              </div>
              <div class="meta-item">
                <span class="meta-k">Yūshō &amp; Career (優勝・通算)</span>
                <span class="meta-v">🏆 ${r.makuuchiYusho} Yūshō • ${r.careerRecord}</span>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  /* ========================================================================
     Tab 3 Renderer: Kimarite Explorer (決まり手図鑑)
     ======================================================================== */
  function renderKimariteExplorer() {
    const container = document.getElementById("kimarite-grid-container");
    const query = state.kimariteSearch.trim().toLowerCase();

    const filtered = DATA.kimarite.filter((k) => {
      if (state.kimariteCatFilter !== "all") {
        if (state.kimariteCatFilter === "hineri") {
          if (k.categoryCode !== "hineri" && k.categoryCode !== "tokushu" && k.categoryCode !== "hiwaza")
            return false;
        } else if (k.categoryCode !== state.kimariteCatFilter) {
          return false;
        }
      }

      if (query) {
        const haystack = [
          k.kanji,
          k.furigana,
          k.romaji,
          k.nameEn,
          k.categoryEn,
          k.categoryJp,
          k.kanjiBreakdown,
          k.descEn,
          k.descJp,
          ...k.specialists
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    container.innerHTML = filtered
      .map((k) => {
        const specialistHtml = k.specialists
          .map((rid) => {
            const r = rikishiById.get(rid);
            if (!r) return "";
            return `<button type="button" class="specialist-chip" data-inspect-rikishi="${r.id}">${r.shikonaKanji} (${r.romaji})</button>`;
          })
          .join("");

        return `
          <article class="kimarite-card" id="kimarite-card-${k.id}">
            <div class="kimarite-header">
              <div>
                <div class="kimarite-title-kanji">${k.rubyHtml}</div>
                <div style="font-size:0.9rem; font-weight:700; color:var(--text-secondary);">
                  ${k.romaji} — ${k.nameEn}
                </div>
              </div>
              <span class="kimarite-freq-badge" title="Makuuchi frequency">Freq: ${k.frequencyPct}</span>
            </div>

            <span class="kimarite-cat-tag">${k.categoryJp} • ${k.categoryEn}</span>

            <div class="kimarite-kanji-mini">
              <strong>Kanji Mechanics:</strong> ${k.kanjiBreakdown}
            </div>

            <p style="font-size:0.82rem; color:var(--text-primary);" class="lang-en-only">${k.descEn}</p>
            <p style="font-size:0.8rem; color:var(--text-secondary);" class="lang-jp-only">${k.descJp}</p>

            ${
              specialistHtml
                ? `<div>
                    <div style="font-size:0.7rem; font-weight:700; color:var(--text-muted); margin-bottom:0.2rem;">Active Specialists 得意力士:</div>
                    <div class="specialist-chips">${specialistHtml}</div>
                  </div>`
                : ""
            }
          </article>
        `;
      })
      .join("");
  }

  /* ========================================================================
     Tab 4 Renderer: Venue Timeline, Kenshō Calculator & Rituals
     ======================================================================== */
  function renderVenueGuide() {
    const timelineEl = document.getElementById("venue-timeline-container");
    timelineEl.innerHTML = DATA.venueTimeline
      .map(
        (item) => `
        <div class="timeline-item ${item.highlight ? "highlight-slot" : ""}">
          <div class="timeline-time">${item.time}</div>
          <div>
            <div style="font-weight:700; font-size:0.88rem;" class="lang-en-only">${item.titleEn}</div>
            <div style="font-weight:700; font-size:0.86rem; font-family:var(--font-mincho);" class="lang-jp-only">${item.titleJp}</div>
            <p style="font-size:0.79rem; color:var(--text-secondary); margin-top:0.2rem;" class="lang-en-only">${item.descEn}</p>
            <p style="font-size:0.78rem; color:var(--text-secondary); margin-top:0.2rem;" class="lang-jp-only">${item.descJp}</p>
          </div>
        </div>
      `
      )
      .join("");

    const gyojiEl = document.getElementById("gyoji-ranks-container");
    gyojiEl.innerHTML = DATA.gyojiRanks
      .map(
        (g) => `
        <div class="timeline-item">
          <div class="timeline-time" style="font-family:var(--font-mincho); font-size:0.8rem;">${g.tasselColorJp}</div>
          <div>
            <div style="font-weight:700; font-size:0.84rem;">${g.rankJp} / ${g.rankEn}</div>
            <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:0.15rem;">
              <strong>Tassel (房):</strong> ${g.tasselColorEn} • <strong>Footwear:</strong> ${g.footwearEn}
            </div>
          </div>
        </div>
      `
      )
      .join("");

    const vocabEl = document.getElementById("vocab-grid-container");
    vocabEl.innerHTML = DATA.vocabulary
      .map(
        (v) => `
        <div class="kimarite-card">
          <div style="font-family:var(--font-mincho); font-size:1.15rem; font-weight:800; color:var(--higashi-primary);">
            ${v.termKanji}
          </div>
          <div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary);">${v.romaji}</div>
          <p style="font-size:0.81rem;" class="lang-en-only">${v.meaningEn}</p>
          <p style="font-size:0.79rem; color:var(--text-secondary);" class="lang-jp-only">${v.meaningJp}</p>
        </div>
      `
      )
      .join("");

    renderDenkoScoreboardPreview();
    updateKenshoCalculator();
  }

  function renderDenkoScoreboardPreview() {
    const boardEl = document.getElementById("denko-board-mockup");
    if (!boardEl) return;

    const basho = DATA.bashoList.find((b) => b.id === state.selectedBashoId) || DATA.bashoList[0];
    const dateStr = getDayDateStr(basho, state.selectedDay);

    const makuuchiBouts = state.boutsForCurrentSelection.filter(
      (b) => !b.division || b.division === "Makuuchi"
    );
    const pool = makuuchiBouts.length > 0 ? makuuchiBouts : state.boutsForCurrentSelection;

    const topBouts = pool
      .slice()
      .sort((a, b) => b.boutNo - a.boutNo)
      .slice(0, 3);

    if (topBouts.length === 0) return;

    const rowsHtml = topBouts
      .map((bout, idx) => {
        const east = rikishiById.get(bout.eastId);
        const west = rikishiById.get(bout.westId);
        if (!east || !west) return "";

        const boutKey = getBoutKey(bout);
        const sim = state.simulatedWinners[boutKey];
        const effectiveWinner = sim ? sim.side : bout.winnerSide;
        const effectiveKimariteId = sim ? sim.kimariteId : bout.kimariteId;
        const kimariteObj = effectiveKimariteId ? kimariteById.get(effectiveKimariteId) : null;

        // If decided, show real ○/● and kimarite; otherwise show example ○ vs ● for legend
        const eastCircle =
          effectiveWinner === "West" ? "kuroboshi-circle" : "shiroboshi-circle";
        const westCircle =
          effectiveWinner === "West" ? "shiroboshi-circle" : "kuroboshi-circle";
        const centerLabel = kimariteObj
          ? `${kimariteObj.kanji} (${kimariteObj.romaji})`
          : bout.boutNo === 21
          ? "結びの一番 (Final)"
          : `#${bout.boutNo} • ${bout.approxTime}`;

        const isLast = idx === topBouts.length - 1;
        return `
          <div class="denko-row" ${isLast ? 'style="border-bottom:none;"' : ""}>
            <div><span class="${eastCircle}" title="○ = Win / ● = Loss"></span> <strong>${east.shikonaKanji}</strong> (${east.romaji})</div>
            <span style="font-size:0.75rem; color:#FBBF24;">${centerLabel}</span>
            <div><span class="${westCircle}" title="○ = Win / ● = Loss"></span> <strong>${west.shikonaKanji}</strong> (${west.romaji})</div>
          </div>
        `;
      })
      .join("");

    boardEl.innerHTML = `
      <div class="denko-row" style="font-size:0.74rem; color:#9E9689;">
        <span>東 HIGASHI (East)</span>
        <span>${dateStr} • Day ${state.selectedDay} (例/Example)</span>
        <span>西 NISHI (West)</span>
      </div>
      ${rowsHtml}
    `;
  }

  function updateKenshoCalculator() {
    const input = document.getElementById("kensho-input");
    const count = Math.max(1, Math.min(200, parseInt(input.value, 10) || 1));
    const totalYen = count * 70000;
    const cashYen = count * 30000;
    const fundYen = count * 30000;

    document.getElementById("kensho-total-yen").textContent = "¥" + totalYen.toLocaleString();
    document.getElementById("kensho-cash-yen").textContent = "¥" + cashYen.toLocaleString();
    document.getElementById("kensho-fund-yen").textContent = "¥" + fundYen.toLocaleString();
  }

  /* ========================================================================
     Phase 2: Predictions & "Loser Pays Everything" Contest (予想対決・ゴチ)
     ======================================================================== */
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getContestDayKey() {
    return `${state.selectedBashoId}-D${state.selectedDay}`;
  }

  function getBoutKey(bout) {
    const div = bout.division || "Makuuchi";
    return `${state.selectedBashoId}-D${state.selectedDay}-${div}-B${bout.boutNo}`;
  }

  function getActiveContestPlayer() {
    if (!state.contest.players.length) return null;
    const found = state.contest.players.find((p) => p.id === state.contest.activePlayerId);
    if (found) return found;
    state.contest.activePlayerId = state.contest.players[0].id;
    return state.contest.players[0];
  }

  function getBoutsInContestScope() {
    const scope = state.contest.contestScope || "Makuuchi";
    return state.boutsForCurrentSelection
      .filter((b) => {
        const div = b.division || "Makuuchi";
        if (scope === "Makuuchi") return div === "Makuuchi";
        if (scope === "Sanyaku") return div === "Makuuchi" && (b.isSanyaku || b.boutNo >= 15);
        if (scope === "Juryo") return div === "Juryo";
        return true; // "All"
      })
      .sort((a, b) => {
        const divA = a.divisionOrder || 6;
        const divB = b.divisionOrder || 6;
        if (divA !== divB) return divB - divA;
        return b.boutNo - a.boutNo;
      });
  }

  function getMusubiBout() {
    const makuuchiBouts = state.boutsForCurrentSelection.filter(
      (b) => !b.division || b.division === "Makuuchi"
    );
    const pool = makuuchiBouts.length > 0 ? makuuchiBouts : state.boutsForCurrentSelection;
    if (!pool.length) return null;
    return pool.slice().sort((a, b) => b.boutNo - a.boutNo)[0];
  }

  function computeContestStandings() {
    const scopeBouts = getBoutsInContestScope();
    const totalBouts = scopeBouts.length;
    const dayKey = getContestDayKey();
    const musubiBout = getMusubiBout();
    const musubiKey = musubiBout ? getBoutKey(musubiBout) : null;
    const musubiSim = musubiKey ? state.simulatedWinners[musubiKey] : null;
    const actualMusubiKimarite = musubiSim
      ? musubiSim.kimariteId
      : musubiBout && musubiBout.kimariteId
      ? musubiBout.kimariteId
      : null;

    const actualKenshoRaw = state.contest.actualMusubiKensho[dayKey];
    const hasActualKensho =
      actualKenshoRaw !== undefined && actualKenshoRaw !== null && actualKenshoRaw !== "";
    const actualKenshoNum = hasActualKensho ? Number(actualKenshoRaw) : null;

    const rows = state.contest.players.map((p, idx) => {
      let correct = 0;
      let wrong = 0;
      let pending = 0;
      let pickedCount = 0;

      scopeBouts.forEach((bout) => {
        const bKey = getBoutKey(bout);
        const pick = p.picks ? p.picks[bKey] : null;
        if (pick) pickedCount++;
        const sim = state.simulatedWinners[bKey];
        const winner = sim ? sim.side : bout.winnerSide;
        if (winner) {
          if (pick === winner) {
            correct++;
          } else if (pick) {
            wrong++;
          }
        } else {
          pending++;
        }
      });

      const tb = (p.tiebreakers && p.tiebreakers[dayKey]) || {
        kimariteId: "yorikiri",
        kenshoCount: 15
      };
      const kimariteExact =
        actualMusubiKimarite && tb.kimariteId === actualMusubiKimarite ? 1 : 0;
      const kenshoDiff =
        hasActualKensho && tb.kenshoCount !== undefined
          ? Math.abs(Number(tb.kenshoCount) - actualKenshoNum)
          : 999;

      const graded = correct + wrong;
      const winPct = graded > 0 ? Math.round((correct / graded) * 100) : 0;
      const maxPossible = correct + pending;

      return {
        player: p,
        originalIdx: idx,
        correct,
        wrong,
        pending,
        pickedCount,
        totalBouts,
        winPct,
        maxPossible,
        tb,
        kimariteExact,
        kenshoDiff
      };
    });

    rows.sort((a, b) => {
      if (b.correct !== a.correct) return b.correct - a.correct;
      if (b.kimariteExact !== a.kimariteExact) return b.kimariteExact - a.kimariteExact;
      if (a.kenshoDiff !== b.kenshoDiff) return a.kenshoDiff - b.kenshoDiff;
      if (b.pickedCount !== a.pickedCount) return b.pickedCount - a.pickedCount;
      return a.originalIdx - b.originalIdx;
    });

    return rows;
  }

  function showContestToast(message) {
    const banner = document.getElementById("contest-toast-banner");
    if (!banner) return;
    banner.style.display = "flex";
    banner.innerHTML = `
      <span>${escapeHtml(message)}</span>
      <button type="button" class="inspect-btn" id="dismiss-contest-toast-btn">OK</button>
    `;
    const btn = document.getElementById("dismiss-contest-toast-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        banner.style.display = "none";
      });
    }
  }

  function encodeContestSharePayload(payloadObj) {
    const jsonStr = JSON.stringify(payloadObj);
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function decodeContestSharePayload(rawCodeOrUrl) {
    let token = String(rawCodeOrUrl || "").trim();
    if (!token) throw new Error("Empty code");

    if (token.includes("importPicks=")) {
      try {
        const u = new URL(token);
        token = u.searchParams.get("importPicks") || token;
      } catch (_) {
        const m = token.match(/[?&]importPicks=([^&#\s]+)/);
        if (m) token = decodeURIComponent(m[1]);
      }
    }

    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  }

  function buildShareCodeForPlayers(playersList) {
    const dayPrefix = `${state.selectedBashoId}-D${state.selectedDay}-`;
    const dayKey = getContestDayKey();
    const compactPlayers = playersList.map((p) => {
      const compactPicks = {};
      Object.keys(p.picks || {}).forEach((k) => {
        if (k.startsWith(dayPrefix)) {
          const shortKey = k.slice(dayPrefix.length); // e.g. Makuuchi-B21
          compactPicks[shortKey] = p.picks[k] === "East" ? "E" : "W";
        }
      });
      const tb = (p.tiebreakers && p.tiebreakers[dayKey]) || {
        kimariteId: "yorikiri",
        kenshoCount: 15
      };
      return {
        n: p.name,
        c: p.color,
        p: compactPicks,
        tb: [tb.kimariteId || "yorikiri", Number(tb.kenshoCount ?? 15)]
      };
    });

    const payload = {
      v: 1,
      b: state.selectedBashoId,
      d: state.selectedDay,
      s: state.contest.contestScope,
      pl: compactPlayers
    };
    return encodeContestSharePayload(payload);
  }

  function importDecodedPayload(decoded) {
    if (!decoded || !Array.isArray(decoded.pl) || decoded.pl.length === 0) {
      throw new Error("Invalid picks payload");
    }
    const bashoId = decoded.b || state.selectedBashoId;
    const dayNum = Number(decoded.d) || state.selectedDay;
    const dayPrefix = `${bashoId}-D${dayNum}-`;
    const dayKey = `${bashoId}-D${dayNum}`;

    if (bashoId !== state.selectedBashoId || dayNum !== state.selectedDay) {
      state.selectedBashoId = bashoId;
      state.selectedDay = dayNum;
      const bashoSelect = document.getElementById("basho-select");
      if (bashoSelect) bashoSelect.value = bashoId;
      initDayStrip();
      generateScheduleForDay(dayNum);
    }

    const importedNames = [];
    decoded.pl.forEach((item) => {
      const name = String(item.n || "Friend").trim().slice(0, 28) || "Friend";
      importedNames.push(name);
      let existing = state.contest.players.find(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );
      if (!existing) {
        existing = {
          id: "p_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6),
          name,
          color:
            item.c ||
            PLAYER_COLORS[state.contest.players.length % PLAYER_COLORS.length],
          picks: {},
          tiebreakers: {}
        };
        state.contest.players.push(existing);
      }
      if (!existing.picks) existing.picks = {};
      if (!existing.tiebreakers) existing.tiebreakers = {};

      Object.keys(item.p || {}).forEach((shortKey) => {
        const val = item.p[shortKey];
        existing.picks[dayPrefix + shortKey] = val === "E" ? "East" : "West";
      });

      if (Array.isArray(item.tb)) {
        existing.tiebreakers[dayKey] = {
          kimariteId: item.tb[0] || "yorikiri",
          kenshoCount: Number(item.tb[1] ?? 15)
        };
      }
      state.contest.activePlayerId = existing.id;
    });

    saveContestState();
    return importedNames;
  }

  function checkUrlAutoImportPicks() {
    try {
      const params = new URLSearchParams(window.location.search);
      const importParam = params.get("importPicks");
      if (!importParam) return;
      const decoded = decodeContestSharePayload(importParam);
      const names = importDecodedPayload(decoded);
      // Clean URL
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      // Switch to Tab 5
      state.activeTab = "predictions";
      document.querySelectorAll(".nav-tab-btn").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-tab") === "predictions");
      });
      document.querySelectorAll(".tab-panel").forEach((p) => {
        p.classList.toggle("active", p.id === "panel-predictions");
      });
      showContestToast(`✓ Imported ${names.join(", ")}'s predictions into the leaderboard!`);
    } catch (err) {
      showContestToast("Could not decode shared picks link. Paste the code manually below.");
    }
  }

  function renderInlineContestPickerBar() {
    const bar = document.getElementById("inline-contest-picker-bar");
    if (!bar) return;

    const activePlayer = getActiveContestPlayer();
    const standings = computeContestStandings();
    const leader = standings[0];
    const loser = standings.length > 1 ? standings[standings.length - 1] : null;

    const playerPillsHtml = state.contest.players
      .map((p) => {
        const row = standings.find((r) => r.player.id === p.id);
        const pts = row ? row.correct : 0;
        const picked = row ? row.pickedCount : 0;
        const total = row ? row.totalBouts : 0;
        return `
          <button
            type="button"
            class="player-picker-pill ${activePlayer && activePlayer.id === p.id ? "active" : ""}"
            data-select-player="${p.id}"
            title="Switch active picker to ${escapeHtml(p.name)}"
          >
            <span class="player-dot" style="background:${p.color};"></span>
            <span>${escapeHtml(p.name)}</span>
            <span style="font-family:var(--font-mono); font-size:0.68rem; opacity:0.85;">(${pts}pt • ${picked}/${total})</span>
          </button>
        `;
      })
      .join("");

    bar.innerHTML = `
      <div class="picker-bar-left">
        <span class="picker-bar-label">🎯 Pass-and-Play Picker (予想者):</span>
        ${playerPillsHtml}
      </div>
      <div class="picker-bar-right">
        ${
          leader && loser
            ? `<span class="mini-standings-pill">
                👑 ${escapeHtml(leader.player.name)} (${leader.correct}pt) • 💸 Pays All: ${escapeHtml(loser.player.name)} (${loser.correct}pt)
              </span>`
            : ""
        }
        <button type="button" class="action-btn" data-open-tab="predictions">
          🏆 Tab 5: 4-Player Contest
        </button>
      </div>
    `;
  }

  function renderPredictionsTab() {
    const container = document.getElementById("predictions-dashboard-container");
    if (!container) return;

    const basho = DATA.bashoList.find((b) => b.id === state.selectedBashoId) || DATA.bashoList[0];
    const dateStr = getDayDateStr(basho, state.selectedDay);
    const dayBadge = document.getElementById("contest-day-badge");
    if (dayBadge) {
      dayBadge.innerHTML = `<span>🏮 ${basho.city} • ${dateStr} • Day ${state.selectedDay} (Saved on Device)</span>`;
    }

    const activePlayer = getActiveContestPlayer();
    const standings = computeContestStandings();
    const scopeBouts = getBoutsInContestScope();
    const dayKey = getContestDayKey();
    const activeTb = (activePlayer &&
      activePlayer.tiebreakers &&
      activePlayer.tiebreakers[dayKey]) || {
      kimariteId: "yorikiri",
      kenshoCount: 15
    };
    const actualKenshoVal =
      state.contest.actualMusubiKensho[dayKey] !== undefined
        ? state.contest.actualMusubiKensho[dayKey]
        : "";
    const musubiBout = getMusubiBout();
    const musubiEast = musubiBout ? rikishiById.get(musubiBout.eastId) : null;
    const musubiWest = musubiBout ? rikishiById.get(musubiBout.westId) : null;

    const rosterSlotsHtml = state.contest.players
      .map((p, idx) => {
        const row = standings.find((r) => r.player.id === p.id);
        const pts = row ? row.correct : 0;
        const picked = row ? row.pickedCount : 0;
        const total = row ? row.totalBouts : 0;
        const isActive = activePlayer && activePlayer.id === p.id;
        return `
          <div class="roster-slot-card ${isActive ? "active-slot" : ""}" data-roster-slot="${p.id}">
            <button
              type="button"
              class="roster-slot-badge"
              style="background:${p.color};"
              data-select-player="${p.id}"
              title="Tap to make P${idx + 1} the Active Pass-and-Play Picker"
            >
              P${idx + 1}
            </button>
            <input
              type="text"
              class="roster-name-input"
              data-player-name-input="${p.id}"
              value="${escapeHtml(p.name)}"
              placeholder="Player ${idx + 1} Name"
              maxlength="22"
              aria-label="Player ${idx + 1} Name"
            />
            <span class="roster-slot-score" data-roster-score="${p.id}" title="Correct Picks • Picked / Total">
              ${pts}pt (${picked}/${total})
            </span>
            ${
              state.contest.players.length > 2
                ? `<button
                    type="button"
                    class="inspect-btn"
                    data-remove-player="${p.id}"
                    title="Remove ${escapeHtml(p.name)}"
                    style="padding:0.15rem 0.38rem; font-size:0.68rem;"
                  >✕</button>`
                : ""
            }
          </div>
        `;
      })
      .join("");

    const leaderboardHtml = standings
      .map((row, idx) => {
        const isFirst = idx === 0;
        const isLastPays = standings.length > 1 && idx === standings.length - 1;
        const kObj = kimariteById.get(row.tb.kimariteId) || DATA.kimarite[0];

        return `
          <div class="leaderboard-row ${isFirst ? "rank-first" : ""} ${isLastPays ? "rank-last-pays" : ""}">
            <div class="lb-player-info">
              <div class="lb-name-line">
                <span style="font-family:var(--font-mono); font-size:0.82rem;">#${idx + 1}</span>
                <span class="player-dot" style="background:${row.player.color};"></span>
                <span data-player-name-mirror="${row.player.id}">${escapeHtml(row.player.name)}</span>
                ${isFirst ? `<span class="lb-badge-yokozuna">👑 YOKOZUNA LEADER</span>` : ""}
                ${isLastPays ? `<span class="lb-badge-pays">💸 PAYS FOR EVERYTHING / 全額ゴチ決定枠!</span>` : ""}
              </div>
              <div class="lb-sub-meta">
                Tiebreaker (結び): <strong>${kObj ? kObj.kanji + " (" + kObj.romaji + ")" : row.tb.kimariteId}</strong>
                • <strong>${row.tb.kenshoCount ?? 15}</strong> Kenshō banners
                ${row.kenshoDiff < 999 ? ` (Diff: ±${row.kenshoDiff})` : ""}
              </div>
            </div>
            <div class="lb-score-block">
              <div class="lb-points">${row.correct} <span style="font-size:0.75rem; font-weight:600;">pts</span></div>
              <div class="lb-record-detail">
                ✓ ${row.correct}W - ✗ ${row.wrong}L • ${row.pending} left (${row.winPct}% • Max ${row.maxPossible})
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    const kimariteOptionsHtml = DATA.kimarite
      .map(
        (k) =>
          `<option value="${k.id}" ${k.id === activeTb.kimariteId ? "selected" : ""}>${k.kanji} (${k.romaji} — ${k.nameEn})</option>`
      )
      .join("");

    const rapidRowsHtml = scopeBouts
      .map((bout) => {
        const div = bout.division || "Makuuchi";
        const divJp = bout.divisionJp || "幕内";
        const east = rikishiById.get(bout.eastId);
        const west = rikishiById.get(bout.westId);
        if (!east || !west) return "";

        const bKey = getBoutKey(bout);
        const pick = activePlayer && activePlayer.picks ? activePlayer.picks[bKey] : null;
        const sim = state.simulatedWinners[bKey];
        const effectiveWinner = sim ? sim.side : bout.winnerSide;

        const matrixCellsHtml = state.contest.players
          .map((p) => {
            const pPick = p.picks ? p.picks[bKey] : null;
            let statusClass = "";
            let statusIcon = "";
            if (effectiveWinner && pPick) {
              if (pPick === effectiveWinner) {
                statusClass = "is-correct";
                statusIcon = "✓";
              } else {
                statusClass = "is-wrong";
                statusIcon = "✗";
              }
            }
            return `
              <div class="matrix-player-cell ${statusClass}">
                <span class="matrix-player-name" title="${escapeHtml(p.name)}">
                  <span class="player-dot" style="background:${p.color};"></span>
                  <span data-player-name-mirror="${p.id}">${escapeHtml(p.name)}</span>
                  ${statusIcon ? `<strong style="font-size:0.68rem;">${statusIcon}</strong>` : ""}
                </span>
                <div class="matrix-ew-btns">
                  <button
                    type="button"
                    class="matrix-ew-btn ${pPick === "East" ? "selected-east" : ""}"
                    data-pick-player="${p.id}"
                    data-pick-bout="${bKey}"
                    data-pick-side="East"
                    title="${escapeHtml(p.name)} picks East: ${east.shikonaKanji} (${east.romaji})"
                  >東E</button>
                  <button
                    type="button"
                    class="matrix-ew-btn ${pPick === "West" ? "selected-west" : ""}"
                    data-pick-player="${p.id}"
                    data-pick-bout="${bKey}"
                    data-pick-side="West"
                    title="${escapeHtml(p.name)} picks West: ${west.shikonaKanji} (${west.romaji})"
                  >西W</button>
                </div>
              </div>
            `;
          })
          .join("");

        return `
          <div class="rapid-pick-row">
            <div class="rapid-pick-top">
              <div class="rapid-pick-num">
                ${divJp} #${bout.boutNo}
                ${effectiveWinner ? `<div style="font-size:0.65rem; color:var(--gold-primary);">Win: ${effectiveWinner}</div>` : ""}
              </div>
              <button
                type="button"
                class="rapid-choice-btn ${pick === "East" ? "selected-east" : ""}"
                data-pick-bout="${bKey}"
                data-pick-side="East"
              >
                <span>東 ${east.shikonaKanji} (${east.romaji})</span>
                <span style="font-family:var(--font-mono); font-size:0.68rem; opacity:0.85;">${east.currentRecord}</span>
              </button>
              <span style="font-size:0.7rem; font-weight:800; color:var(--text-muted); text-align:center;">VS</span>
              <button
                type="button"
                class="rapid-choice-btn ${pick === "West" ? "selected-west" : ""}"
                data-pick-bout="${bKey}"
                data-pick-side="West"
              >
                <span>西 ${west.shikonaKanji} (${west.romaji})</span>
                <span style="font-family:var(--font-mono); font-size:0.68rem; opacity:0.85;">${west.currentRecord}</span>
              </button>
            </div>
            <div class="matrix-4p-strip">
              ${matrixCellsHtml}
            </div>
          </div>
        `;
      })
      .join("");

    container.innerHTML = `
      <!-- 1. 4-Player Roster & Contest Scope Card -->
      <div class="contest-card" style="margin-bottom:1rem;">
        <h3>
          <span>👥 4-Player Roster &amp; Contest Setup (4人のプレイヤー名・設定)</span>
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            <button type="button" class="inspect-btn" data-contest-add-player="1" title="Add another player slot">
              + Add Player
            </button>
            ${
              state.contest.players.length !== 4
                ? `<button type="button" class="inspect-btn" id="reset-4p-slots-btn" title="Set roster to 4 player slots">
                    4-Player Preset
                  </button>`
                : ""
            }
            <button type="button" class="inspect-btn" id="reset-today-picks-btn" style="color:var(--higashi-primary);" title="Clear today's picks for all players while keeping the 4 player names">
              🔄 Reset Today's Picks (本日の予想をリセット)
            </button>
          </div>
        </h3>
        <p style="font-size:0.79rem; color:var(--text-secondary);">
          Type the 4 player names below — names and picks <strong>auto-save permanently on this device</strong>. Tap a player's colored <strong>P1–P4</strong> badge (or pill below) to make them the Active Pass-and-Play Picker!
        </p>

        <!-- 4-Name Inline Input Grid -->
        <div class="roster-grid-4p">
          ${rosterSlotsHtml}
        </div>

        <!-- Contest Scope & Active Picker Bar -->
        <div class="filter-pills-row" style="border-top:1px solid var(--border-subtle); padding-top:0.65rem; margin-top:0.15rem;">
          <div class="control-group">
            <span class="control-label">Contest Scope 対象取組:</span>
            <div class="filter-pills" id="contest-scope-pills">
              <button type="button" class="filter-pill ${state.contest.contestScope === "Makuuchi" ? "active" : ""}" data-contest-scope="Makuuchi">
                Makuuchi 幕内 (Default)
              </button>
              <button type="button" class="filter-pill ${state.contest.contestScope === "Sanyaku" ? "active" : ""}" data-contest-scope="Sanyaku">
                San'yaku Final 7 三役・上位
              </button>
              <button type="button" class="filter-pill ${state.contest.contestScope === "Juryo" ? "active" : ""}" data-contest-scope="Juryo">
                Juryo 十両
              </button>
              <button type="button" class="filter-pill ${state.contest.contestScope === "All" ? "active" : ""}" data-contest-scope="All">
                All Divisions 全階級
              </button>
            </div>
          </div>

          <div class="picker-bar-left">
            <span class="picker-bar-label">🎯 Active Turn:</span>
            ${state.contest.players
              .map(
                (p) => `
                <button
                  type="button"
                  class="player-picker-pill ${activePlayer && activePlayer.id === p.id ? "active" : ""}"
                  data-select-player="${p.id}"
                >
                  <span class="player-dot" style="background:${p.color};"></span>
                  <span data-player-name-mirror="${p.id}">${escapeHtml(p.name)}</span>
                </button>
              `
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- 2. Two-Column Grid: Live Leaderboard + Musubi Tiebreaker -->
      <div class="contest-grid-layout">
        <!-- Left Card: Live Leaderboard ("Who Pays the Tab? 💸") -->
        <div class="contest-card">
          <h3>
            <span>🏆 Live Leaderboard — Who Pays the Tab? (順位表・ゴチ決定戦)</span>
            <span style="font-size:0.74rem; font-family:var(--font-sans); color:var(--text-muted);">
              ${scopeBouts.length} Bouts in Scope
            </span>
          </h3>
          <p style="font-size:0.79rem; color:var(--text-secondary);">
            1 pt per correct winner. Ties are broken by <strong>Musubi no Ichiban (#21) Kimarite</strong> and closest <strong>Kenshō-maku banner count</strong> so one person unequivocally pays!
          </p>
          <div class="leaderboard-list" id="contest-leaderboard-list">
            ${leaderboardHtml}
          </div>
        </div>

        <!-- Right Column: Musubi no Ichiban Tiebreaker Card -->
        <div class="contest-card">
          <h3>
            <span>🎌 Musubi no Ichiban Tiebreaker (結びの一番タイブレーク)</span>
          </h3>
          <p style="font-size:0.78rem; color:var(--text-secondary);">
            Final Bout: <strong>${musubiEast ? musubiEast.shikonaKanji + " (" + musubiEast.romaji + ")" : "East"}</strong> vs. <strong>${musubiWest ? musubiWest.shikonaKanji + " (" + musubiWest.romaji + ")" : "West"}</strong>.
            Set <strong data-active-player-label="1">${activePlayer ? escapeHtml(activePlayer.name) : "Player"}</strong>'s tiebreaker call (or switch active player above):
          </p>
          <div style="display:flex; flex-direction:column; gap:0.65rem;">
            <div>
              <label for="tb-kimarite-select" style="font-size:0.74rem; font-weight:700; display:block; margin-bottom:0.2rem;">
                1. Predicted Winning Kimarite (決まり手予想):
              </label>
              <select id="tb-kimarite-select" class="select-input" style="width:100%;">
                ${kimariteOptionsHtml}
              </select>
            </div>
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap; align-items:flex-end;">
              <div style="flex:1; min-width:130px;">
                <label for="tb-kensho-input" style="font-size:0.74rem; font-weight:700; display:block; margin-bottom:0.2rem;">
                  2. <span data-active-player-label="1">${activePlayer ? escapeHtml(activePlayer.name) : "Player"}</span>'s Kenshō Call (0–60):
                </label>
                <input
                  type="number"
                  id="tb-kensho-input"
                  class="select-input"
                  min="0"
                  max="60"
                  value="${activeTb.kenshoCount ?? 15}"
                  style="width:100%;"
                />
              </div>
              <div style="flex:1; min-width:130px;">
                <label for="actual-musubi-kensho-input" style="font-size:0.74rem; font-weight:700; color:var(--gold-primary); display:block; margin-bottom:0.2rem;">
                  🎌 Actual Ring Kenshō (実際の懸賞本数):
                </label>
                <input
                  type="number"
                  id="actual-musubi-kensho-input"
                  class="select-input"
                  min="0"
                  max="60"
                  placeholder="Enter when paraded..."
                  value="${actualKenshoVal}"
                  style="width:100%;"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Pass-and-Play + 4-Player Matrix Pick Sheet (一括予想＆4人マトリックス) -->
      <div class="contest-card">
        <h3>
          <span>⚡ Pass-and-Play &amp; 4-Player Pick Sheet (予想シート — Active: <span style="color:var(--higashi-primary);" data-active-player-label="1">${activePlayer ? escapeHtml(activePlayer.name) : "Player"}</span>)</span>
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            <button type="button" class="inspect-btn" id="autofill-remaining-picks-btn">
              🎲 Auto-Fill Active Player
            </button>
            <button type="button" class="inspect-btn" id="autofill-all-4p-btn">
              🎲 Auto-Fill All ${state.contest.players.length} Players
            </button>
            <button type="button" class="inspect-btn" id="clear-active-picks-btn">
              🗑 Clear Active Player's Picks
            </button>
          </div>
        </h3>
        <p style="font-size:0.78rem; color:var(--text-secondary);">
          <strong>Two ways to enter picks on one device:</strong>
          (1) Tap the big <strong style="color:var(--higashi-primary);">東 East</strong> / <strong style="color:var(--nishi-primary);">西 West</strong> buttons for the Active Player and pass the phone, OR
          (2) Tap any player's <strong>東E / 西W</strong> mini-buttons directly in the 4-player strip under each bout!
        </p>
        <div class="rapid-pick-list">
          ${rapidRowsHtml}
        </div>
      </div>
    `;
  }

  /* ========================================================================
     Modal Inspector: Rikishi Kanji Deep-Dive & Kimarite Details
     ======================================================================== */
  function openRikishiModal(rikishiId) {
    const r = rikishiById.get(rikishiId);
    if (!r) return;

    const backdrop = document.getElementById("detail-modal-backdrop");
    const body = document.getElementById("modal-body-content");

    body.innerHTML = `
      <div style="padding-right:2rem;">
        <span class="rank-stamp ${r.side === "West" ? "west-stamp" : ""}">${r.rankJp} • ${r.rankEn}</span>
        <h2 id="modal-title" style="font-family:var(--font-mincho); font-size:2rem; margin-top:0.35rem;">
          ${r.rubyHtml} <span style="font-family:var(--font-sans); font-size:1.15rem; color:var(--text-secondary);">${r.romaji}</span>
        </h2>
        <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:0.75rem;">
          ${r.givenName ? `Given Name: ${r.givenName} • ` : ""}Stable: ${r.heyaEn} (${r.heyaJp}) • Origin: ${r.originEn} • Build: <strong>${r.heightCm}cm / ${r.weightKg}kg</strong>
        </p>
      </div>

      <div class="shikona-literal-banner" style="margin-bottom:0.85rem;">
        <div><strong>Literal Shikona Meaning:</strong> "${r.literalMeaningEn}"</div>
        <div style="font-size:0.78rem; color:var(--text-secondary);">${r.literalMeaningJp}</div>
      </div>

      <h4 style="font-size:0.78rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-bottom:0.45rem;">
        Character-by-Character Kanji Etymology (一文字ずつの読みと由来)
      </h4>
      <div class="kanji-breakdown-grid" style="margin-bottom:0.95rem;">
        ${r.kanjiBreakdown
          .map(
            (kb) => `
          <div class="kanji-tile">
            <span class="kanji-char">${kb.char}</span>
            <span class="kanji-reading">${kb.reading}</span>
            <span class="kanji-meaning">${kb.meaningEn}</span>
            <span class="kanji-note">${kb.noteEn}</span>
          </div>
        `
          )
          .join("")}
      </div>

      <div style="background:var(--bg-secondary); padding:0.75rem; border-radius:var(--radius-sm); margin-bottom:0.85rem;">
        <div style="font-weight:700; font-size:0.82rem; margin-bottom:0.25rem;">Wrestler Background &amp; Storyline:</div>
        <p style="font-size:0.84rem; margin-bottom:0.35rem;">${r.storyEn}</p>
        <p style="font-size:0.8rem; color:var(--text-secondary);">${r.storyJp}</p>
      </div>

      <div class="rikishi-meta-table">
        <div class="meta-item">
          <span class="meta-k">Current Record (今場所)</span>
          <span class="meta-v">${r.currentRecord}</span>
        </div>
        <div class="meta-item">
          <span class="meta-k">Career Record (通算成績)</span>
          <span class="meta-v" id="modal-career-record">${r.careerRecord}</span>
        </div>
        <div class="meta-item">
          <span class="meta-k">Build &amp; Style (体格・型)</span>
          <span class="meta-v">${r.heightCm}cm • ${r.weightKg}kg — ${r.styleEn}</span>
        </div>
        <div class="meta-item">
          <span class="meta-k">Yūshō &amp; Achievements (優勝・三賞)</span>
          <span class="meta-v" id="modal-career-yusho">🏆 ${r.makuuchiYusho} Yūshō • ${r.sansho}</span>
        </div>
      </div>
    `;

    backdrop.classList.add("open");

    if (r.apiId) {
      fetch(`https://sumo-api.com/api/rikishi/${r.apiId}/stats`)
        .then((res) => (res.ok ? res.json() : null))
        .then((stats) => {
          if (!stats || typeof stats.totalWins !== "number") return;
          const careerStr = `${stats.totalWins}-${stats.totalLosses}${stats.totalAbsences ? `-${stats.totalAbsences}` : ""} (${stats.basho || 0} basho)`;
          r.careerRecord = careerStr;
          const careerEl = document.getElementById("modal-career-record");
          if (careerEl) careerEl.textContent = careerStr;

          if (typeof stats.yusho === "number") {
            const yushoEl = document.getElementById("modal-career-yusho");
            if (yushoEl) {
              yushoEl.textContent = `🏆 ${stats.yusho} Total Yūshō (${r.makuuchiYusho} Makuuchi) • ${stats.totalMatches} Career Bouts`;
            }
          }
        })
        .catch(() => {});
    }
  }

  function closeModal() {
    document.getElementById("detail-modal-backdrop").classList.remove("open");
  }

  /* ========================================================================
     Tab 6 Renderer: All-Division Leaderboard & Potential Final-Days Matchups
     ======================================================================== */
  const divisionHistoryCache = new Map(); // `${bashoApiId}_${division}_${upToDay}` -> { bouts, source }

  function parseBanzukeOrder(rankEn) {
    const s = String(rankEn || "");
    const tierWeights = {
      Yokozuna: 0,
      Ozeki: 100,
      Sekiwake: 200,
      Komusubi: 300,
      Maegashira: 400,
      Juryo: 1000,
      Makushita: 2000,
      Sandanme: 3000,
      Jonidan: 4000,
      Jonokuchi: 5000
    };
    const m = s.match(
      /(Yokozuna|Ozeki|Sekiwake|Komusubi|Maegashira|Juryo|Makushita|Sandanme|Jonidan|Jonokuchi)\s*(\d+)?\s*(East|West)?/i
    );
    if (!m) return 9999;
    const tierKey = Object.keys(tierWeights).find((k) => k.toLowerCase() === m[1].toLowerCase()) || "Maegashira";
    const num = m[2] ? parseInt(m[2], 10) : 1;
    const sideOffset = m[3] && m[3].toLowerCase() === "west" ? 0.5 : 0;
    return tierWeights[tierKey] + num * 2 + sideOffset;
  }

  function compactRankCode(rankEn) {
    const m = String(rankEn || "").match(
      /(Yokozuna|Ozeki|Sekiwake|Komusubi|Maegashira|Juryo|Makushita|Sandanme|Jonidan|Jonokuchi)\s*(\d+)?\s*(East|West)?/i
    );
    if (!m) return rankEn || "—";
    const abbr = {
      yokozuna: "Y",
      ozeki: "O",
      sekiwake: "S",
      komusubi: "K",
      maegashira: "M",
      juryo: "J",
      makushita: "Ms",
      sandanme: "Sd",
      jonidan: "Jd",
      jonokuchi: "Jk"
    }[m[1].toLowerCase()] || m[1].slice(0, 2);
    const num = m[2] || (["yokozuna", "ozeki", "sekiwake", "komusubi"].includes(m[1].toLowerCase()) ? "1" : "");
    const side = m[3] ? (m[3].toLowerCase() === "west" ? "W" : "E") : "";
    return `${abbr}${num}${side}`;
  }

  function buildOfflineMakuuchiHistory(upToDay) {
    const bouts = [];
    const sanyakuPool = DATA.rikishi.slice(0, 10);
    const maegashiraPool = DATA.rikishi.slice(10);
    for (let d = 1; d <= upToDay; d++) {
      if (state.selectedBashoId === "202611" && d === 9) {
        DATA.defaultTorikumi.forEach((b) => {
          const winnerId =
            b.winnerSide === "East" ? b.eastId : b.winnerSide === "West" ? b.westId : null;
          bouts.push({
            day: d,
            eastId: b.eastId,
            westId: b.westId,
            winnerId,
            kimarite: b.kimariteId || ""
          });
        });
        continue;
      }
      for (let i = 0; i < 5; i++) {
        const east = sanyakuPool[i];
        const west = sanyakuPool[5 + ((i + d) % 5)];
        const seed = (d * 7 + i * 3) % 5;
        bouts.push({
          day: d,
          eastId: east.id,
          westId: west.id,
          winnerId: d < 9 ? (seed % 2 === 0 ? east.id : west.id) : null,
          kimarite: d < 9 ? (seed % 2 === 0 ? "yorikiri" : "oshidashi") : ""
        });
      }
      const mCount = Math.floor(maegashiraPool.length / 2);
      for (let j = 0; j < mCount; j++) {
        const east = maegashiraPool[j];
        const west = maegashiraPool[mCount + ((j + d) % mCount)];
        const seed = (d + j * 2) % 4;
        bouts.push({
          day: d,
          eastId: east.id,
          westId: west.id,
          winnerId: d < 9 ? (seed % 2 === 1 ? east.id : west.id) : null,
          kimarite: d < 9 ? "yorikiri" : ""
        });
      }
    }
    return { bouts, source: "offline" };
  }

  async function ensureDivisionHistoryLoaded(bashoApiId, divisionKey, upToDay) {
    const cacheKey = `${bashoApiId}_${divisionKey}_${upToDay}`;
    if (divisionHistoryCache.has(cacheKey)) {
      return divisionHistoryCache.get(cacheKey);
    }

    state.standings.loading = true;
    const dot = document.getElementById("standings-status-dot");
    const statusText = document.getElementById("standings-status-text");
    if (dot) dot.classList.add("syncing");
    if (statusText) statusText.textContent = `Loading ${divisionKey} Days 1–${upToDay}...`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);

      const dayNumbers = Array.from({ length: upToDay }, (_, i) => i + 1);
      const [, dayResults] = await Promise.all([
        ensureRikishiAndBanzukeLoaded(bashoApiId),
        Promise.allSettled(
          dayNumbers.map(async (d) => {
            const url = `https://sumo-api.com/api/basho/${bashoApiId}/torikumi/${divisionKey}/${d}`;
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return { day: d, torikumi: json && Array.isArray(json.torikumi) ? json.torikumi : [] };
          })
        )
      ]);
      clearTimeout(timeout);

      const bouts = [];
      dayResults.forEach((r) => {
        if (r.status !== "fulfilled") return;
        const { day, torikumi } = r.value;
        torikumi.forEach((item) => {
          const east = resolveOrCreateRikishi(item.eastId, item.eastShikona, item.eastRank, "East");
          const west = resolveOrCreateRikishi(item.westId, item.westShikona, item.westRank, "West");
          let winnerId = null;
          if (item.winnerId && item.winnerId === item.eastId) winnerId = east.id;
          else if (item.winnerId && item.winnerId === item.westId) winnerId = west.id;
          bouts.push({
            day,
            eastId: east.id,
            westId: west.id,
            winnerId,
            kimarite: item.kimarite || ""
          });
        });
      });

      state.standings.loading = false;
      if (dot) dot.classList.remove("syncing");

      if (bouts.length > 0 || (liveBanzukeByBasho.get(bashoApiId) && liveBanzukeByBasho.get(bashoApiId).size > 0)) {
        const result = { bouts, source: "live" };
        divisionHistoryCache.set(cacheKey, result);
        if (statusText) {
          statusText.textContent = `Live API • ${divisionKey} Days 1–${upToDay} (${bouts.length} bouts)`;
        }
        return result;
      }
      throw new Error("Empty live division history");
    } catch (_) {
      state.standings.loading = false;
      if (dot) dot.classList.remove("syncing");
      const fallback =
        divisionKey === "Makuuchi"
          ? buildOfflineMakuuchiHistory(upToDay)
          : { bouts: [], source: "offline" };
      divisionHistoryCache.set(cacheKey, fallback);
      if (statusText) {
        statusText.textContent =
          divisionKey === "Makuuchi"
            ? `Offline Curated Mode (Days 1–${upToDay})`
            : `Offline Mode (Connect to load ${divisionKey})`;
      }
      return fallback;
    }
  }

  function getDivisionRosterWithRecords(bashoApiId, divisionKey, history) {
    const bMap = liveBanzukeByBasho.get(bashoApiId);
    const list = [];

    if (bMap && bMap.size > 0) {
      bMap.forEach((entry) => {
        if (entry.division !== divisionKey) return;
        const r = resolveOrCreateRikishi(entry.rikishiID, entry.shikonaEn, entry.rank, entry.side);
        const wins = typeof entry.wins === "number" ? entry.wins : 0;
        const losses = typeof entry.losses === "number" ? entry.losses : 0;
        const absences = typeof entry.absences === "number" ? entry.absences : 0;
        list.push({
          ...r,
          rankEn: entry.rank || r.rankEn,
          rankJp: rankJpFromEn(entry.rank || r.rankEn),
          wins,
          losses,
          absences,
          banzukeOrder: parseBanzukeOrder(entry.rank || r.rankEn)
        });
      });
    } else if (divisionKey === "Makuuchi") {
      DATA.rikishi.forEach((r) => {
        const parts = String(r.currentRecord || "0-0").split("-").map((n) => parseInt(n, 10) || 0);
        list.push({
          ...r,
          wins: parts[0] || 0,
          losses: parts[1] || 0,
          absences: parts[2] || 0,
          banzukeOrder: parseBanzukeOrder(r.rankEn)
        });
      });
    }

    const foughtLatest = new Set();
    const maxDay = history && history.bouts.length > 0 ? Math.max(...history.bouts.map((b) => b.day)) : 0;
    if (history && maxDay > 0) {
      history.bouts.forEach((b) => {
        if (b.day >= maxDay - 1) {
          foughtLatest.add(b.eastId);
          foughtLatest.add(b.westId);
        }
      });
    }

    list.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      if (a.absences !== b.absences) return a.absences - b.absences;
      return a.banzukeOrder - b.banzukeOrder;
    });

    const leaderWins = list.length > 0 ? list[0].wins : 0;
    const leaderLosses = list.length > 0 ? list[0].losses : 0;

    let currentPos = 1;
    list.forEach((w, idx) => {
      if (
        idx > 0 &&
        (w.wins !== list[idx - 1].wins || w.losses !== list[idx - 1].losses || w.absences !== list[idx - 1].absences)
      ) {
        currentPos = idx + 1;
      }
      const isTied =
        (idx > 0 && w.wins === list[idx - 1].wins && w.losses === list[idx - 1].losses) ||
        (idx < list.length - 1 && w.wins === list[idx + 1].wins && w.losses === list[idx + 1].losses);
      w.standingPos = currentPos;
      w.isTied = isTied;
      w.gamesBehind = ((leaderWins - w.wins) + (w.losses - leaderLosses)) / 2;
      w.isKyujo = w.absences > 0 && maxDay > 0 && !foughtLatest.has(w.id);
    });

    return list;
  }

  function formatShikonaDisplay(r) {
    return `
      <span class="standings-shikona-main">
        <span class="lang-jp-only">${r.rubyHtml || r.shikonaKanji}</span>
        <span class="lang-en-only">${r.romaji}</span>
      </span>
      <span class="standings-shikona-sub">
        <span class="lang-jp-only">${r.romaji} • ${r.heyaEn}</span>
        <span class="lang-en-only">${r.shikonaKanji} • ${r.heyaEn}</span>
      </span>
    `;
  }

  function renderStandingsTab() {
    const basho = DATA.bashoList.find((b) => b.id === state.selectedBashoId) || DATA.bashoList[0];
    const divKey = state.standings.division;
    const upToDay = state.selectedDay;
    const cacheKey = `${basho.apiId}_${divKey}_${upToDay}`;

    document.querySelectorAll("#standings-division-pills .filter-pill").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-division") === divKey);
    });
    document.querySelectorAll("#standings-topn-pills .filter-pill").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-topn") === state.standings.topN);
    });

    const cachedHistory = divisionHistoryCache.get(cacheKey);
    if (!cachedHistory && !state.standings.loading) {
      renderStandingsLoadingState(divKey, upToDay);
      ensureDivisionHistoryLoaded(basho.apiId, divKey, upToDay).then(() => {
        if (state.activeTab === "standings") {
          renderStandingsTab();
        }
      });
      return;
    }

    const history = cachedHistory || { bouts: [], source: "offline" };
    const roster = getDivisionRosterWithRecords(basho.apiId, divKey, history);

    renderStandingsLeaderboard(roster, divKey, upToDay);
    renderStandingsMatchups(roster, history, divKey, upToDay);
  }

  function renderStandingsLoadingState(divKey, upToDay) {
    const lb = document.getElementById("standings-leaderboard-container");
    const mu = document.getElementById("standings-matchups-container");
    if (lb) {
      lb.innerHTML = `
        <div class="standings-card" style="text-align:center; padding:2rem;">
          <p style="font-weight:700;">⏳ Loading ${divKey} standings &amp; Days 1–${upToDay} bout history...</p>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.35rem;">Syncing banzuke records and torikumi pairings from sumo-api.com</p>
        </div>
      `;
    }
    if (mu) mu.innerHTML = "";
  }

  function renderStandingsLeaderboard(roster, divKey, upToDay) {
    const container = document.getElementById("standings-leaderboard-container");
    if (!container) return;

    const divMeta = DIVISION_MAP.get(divKey) || { key: divKey, jp: "" };
    const kkThreshold = divKey === "Makuuchi" || divKey === "Juryo" ? 8 : 4;
    const query = state.standings.search.trim().toLowerCase();

    let displayList = roster;
    if (query) {
      displayList = roster.filter((r) =>
        `${r.romaji} ${r.shikonaKanji} ${r.furigana} ${r.heyaEn} ${r.rankEn}`.toLowerCase().includes(query)
      );
    } else if (state.standings.topN !== "all") {
      const n = parseInt(state.standings.topN, 10) || 15;
      if (roster.length > n) {
        const cutoffWins = roster[n - 1].wins;
        const cutoffLosses = roster[n - 1].losses;
        displayList = roster.filter(
          (r, idx) => idx < n || (r.wins === cutoffWins && r.losses === cutoffLosses)
        );
      }
    }

    if (roster.length === 0) {
      container.innerHTML = `
        <div class="standings-card" style="text-align:center; padding:2rem;">
          <p style="font-weight:700;">No standings data available offline for ${divKey}.</p>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.3rem;">Connect to the internet or switch to Makuuchi 幕内.</p>
        </div>
      `;
      return;
    }

    const leader = roster[0];
    const leaderCount = roster.filter((r) => r.wins === leader.wins && r.losses === leader.losses).length;
    const cutoffLabel = query
      ? `Search: "${state.standings.search}" (${displayList.length})`
      : state.standings.topN === "all"
      ? `All ${roster.length} Wrestlers`
      : `Showing ${displayList.length} of ${roster.length} (Top ${state.standings.topN} + ties)`;

    container.innerHTML = `
      <div class="standings-card">
        <div class="standings-header-row">
          <h3>
            <span class="lang-en-only">📊 ${divKey} Division Leaderboard — Day ${upToDay}</span>
            <span class="lang-jp-only">📊 ${divMeta.jp}（${divKey}）星取ランキング・${upToDay}日目</span>
          </h3>
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            <span class="standings-meta-pill">Leader: ${leader.wins}-${leader.losses} (${leaderCount > 1 ? `${leaderCount}-way tie` : leader.romaji})</span>
            <span class="standings-meta-pill">${cutoffLabel}</span>
          </div>
        </div>

        <div class="standings-table-wrap">
          <table class="standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Rank</th>
                <th>Rikishi 四股名</th>
                <th>Record</th>
                <th>GB</th>
                <th>Status</th>
                <th>Matchups</th>
              </tr>
            </thead>
            <tbody>
              ${displayList
                .map((r) => {
                  const isLeader = r.wins === leader.wins && r.losses === leader.losses;
                  const isSelected = state.standings.selectedRikishiId === r.id;
                  const gbText =
                    r.gamesBehind <= 0
                      ? "Lead"
                      : `-${Number.isInteger(r.gamesBehind) ? r.gamesBehind : r.gamesBehind.toFixed(1)}`;
                  const recText = `${r.wins}-${r.losses}${r.absences ? `-${r.absences}` : ""}`;
                  const sideClass = (r.side || "").toLowerCase() === "west" ? "west" : "east";

                  let badgeHtml = "";
                  if (r.isKyujo) {
                    badgeHtml = `<span class="standings-badge kyujo">Kyūjō 休場</span>`;
                  } else if (isLeader) {
                    badgeHtml = `<span class="standings-badge leader">${leaderCount > 1 ? "Co-Leader 並走" : "Yūshō Leader 単独"}</span>`;
                  } else if (r.wins >= kkThreshold) {
                    badgeHtml = `<span class="standings-badge kk">Kachi-koshi ✓</span>`;
                  }

                  return `
                    <tr class="standings-row ${isLeader ? "is-leader" : ""} ${isSelected ? "is-selected" : ""}">
                      <td>
                        <span class="standing-pos">${r.isTied ? "=" : ""}${r.standingPos}</span>
                      </td>
                      <td>
                        <span class="standings-rank-tag ${sideClass}" title="${r.rankEn}">${compactRankCode(r.rankEn)}</span>
                      </td>
                      <td>
                        <button type="button" class="standings-shikona-btn" data-inspect-rikishi="${r.id}" title="View Shikona Kanji &amp; Profile">
                          ${formatShikonaDisplay(r)}
                        </button>
                      </td>
                      <td>
                        <span class="standings-record-pill">${recText}</span>
                      </td>
                      <td style="font-family:var(--font-mono); font-size:0.78rem; color:var(--text-muted); font-weight:700;">
                        ${gbText}
                      </td>
                      <td>${badgeHtml}</td>
                      <td>
                        <button type="button" class="action-btn" style="padding:0.25rem 0.55rem; font-size:0.72rem;" data-select-matchup-rikishi="${r.id}">
                          🔮 Matchups
                        </button>
                      </td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function computeMatchupAnalysis(target, roster, history, divKey, upToDay) {
    const maxBouts = divKey === "Makuuchi" || divKey === "Juryo" ? 15 : 7;
    const leaderWins = roster.length > 0 ? roster[0].wins : 0;

    const foughtList = [];
    const foughtIds = new Set();

    (history.bouts || []).forEach((b) => {
      if (b.eastId === target.id || b.westId === target.id) {
        const oppId = b.eastId === target.id ? b.westId : b.eastId;
        const opp = roster.find((r) => r.id === oppId) || rikishiById.get(oppId);
        if (!opp) return;
        foughtIds.add(oppId);
        let result = "Pending";
        if (b.winnerId) {
          result = b.winnerId === target.id ? "W" : "L";
        }
        foughtList.push({
          day: b.day,
          opponent: opp,
          result,
          kimarite: b.kimarite || ""
        });
      }
    });

    foughtList.sort((a, b) => a.day - b.day);
    const remainingBouts = Math.max(0, maxBouts - Math.max(foughtList.length, target.wins + target.losses + target.absences));

    const candidates = [];
    roster.forEach((opp) => {
      if (opp.id === target.id) return;
      if (foughtIds.has(opp.id)) return;
      if (opp.isKyujo) return;
      if (
        target.heyaEn &&
        opp.heyaEn &&
        target.heyaEn !== "Grand Sumo" &&
        target.heyaEn === opp.heyaEn
      ) {
        return;
      }

      const winDiff = Math.abs(target.wins - opp.wins);
      const lossDiff = Math.abs(target.losses - opp.losses);
      const recordDiff = winDiff + lossDiff;
      const rankDiff = Math.abs(target.banzukeOrder - opp.banzukeOrder);
      const bothContenders = leaderWins - target.wins <= 2 && leaderWins - opp.wins <= 2;

      let score = 100 - recordDiff * 18 - Math.min(35, rankDiff * 0.15);
      if (bothContenders) score += 12;

      let tier = "possible";
      let tierLabelEn = "Possible";
      let tierLabelJp = "対決候補";
      if (score >= 78) {
        tier = "very-likely";
        tierLabelEn = "Very Likely";
        tierLabelJp = "有力・大";
      } else if (score >= 56) {
        tier = "likely";
        tierLabelEn = "Likely";
        tierLabelJp = "有力候補";
      }

      const reasons = [];
      if (winDiff === 0 && lossDiff === 0) {
        reasons.push(`Identical ${opp.wins}-${opp.losses} record`);
      } else if (winDiff <= 1) {
        reasons.push(`${winDiff} win apart (${opp.wins}-${opp.losses})`);
      } else {
        reasons.push(`${opp.wins}-${opp.losses} record`);
      }
      if (bothContenders) reasons.push("Yūshō race clash");
      else if (rankDiff <= 6) reasons.push("Adjacent rank");

      candidates.push({
        opponent: opp,
        score,
        tier,
        tierLabelEn,
        tierLabelJp,
        reason: reasons.join(" • "),
        recordDiff,
        rankDiff
      });
    });

    candidates.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.recordDiff !== b.recordDiff) return a.recordDiff - b.recordDiff;
      return a.rankDiff - b.rankDiff;
    });

    return {
      maxBouts,
      remainingBouts,
      foughtList,
      candidates: candidates.slice(0, 12),
      totalEligible: candidates.length
    };
  }

  function renderStandingsMatchups(roster, history, divKey, upToDay) {
    const container = document.getElementById("standings-matchups-container");
    if (!container || roster.length === 0) {
      if (container) container.innerHTML = "";
      return;
    }

    let selected = roster.find((r) => r.id === state.standings.selectedRikishiId);
    if (!selected) {
      selected = roster[0];
      state.standings.selectedRikishiId = selected.id;
    }

    const analysis = computeMatchupAnalysis(selected, roster, history, divKey, upToDay);
    const contenders = roster.filter((r) => !r.isKyujo).slice(0, 6);

    const boutMap = new Map();
    (history.bouts || []).forEach((b) => {
      boutMap.set(`${b.eastId}__${b.westId}`, b);
      boutMap.set(`${b.westId}__${b.eastId}`, b);
    });

    container.innerHTML = `
      <div class="standings-card">
        <div class="standings-header-row">
          <h3>
            <span class="lang-en-only">🔮 Final-Days Potential Matchups Inspector</span>
            <span class="lang-jp-only">🔮 終盤戦・未対戦＆有力対戦カード予想</span>
          </h3>
          <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
            <label for="matchup-rikishi-select" style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">
              Inspect Wrestler:
            </label>
            <select id="matchup-rikishi-select" class="select-input" aria-label="Select wrestler for final-days matchup analysis">
              ${roster
                .map(
                  (r) =>
                    `<option value="${r.id}" ${r.id === selected.id ? "selected" : ""}>${r.romaji} (${r.shikonaKanji}) — ${r.wins}-${r.losses} • ${compactRankCode(r.rankEn)}</option>`
                )
                .join("")}
            </select>
          </div>
        </div>

        <div class="matchup-inspector-header">
          <div>
            <div style="font-family:var(--font-mincho); font-size:1.1rem; font-weight:800;">
              <span class="lang-jp-only">${selected.rubyHtml || selected.shikonaKanji}（${selected.romaji}）</span>
              <span class="lang-en-only">${selected.romaji} (${selected.shikonaKanji})</span>
            </div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">
              ${selected.rankEn} • ${selected.heyaEn} Stable • Current: <strong>${selected.wins}-${selected.losses}${selected.absences ? `-${selected.absences}` : ""}</strong>
            </div>
          </div>
          <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
            <span class="standings-meta-pill">Fought: ${analysis.foughtList.length} / ${analysis.maxBouts}</span>
            <span class="standings-meta-pill" style="background:var(--gold-bg); border-color:var(--gold-border); color:var(--gold-primary);">
              Remaining Bouts: ${analysis.remainingBouts}
            </span>
          </div>
        </div>

        <div class="matchup-columns-grid">
          <div class="matchup-col-box">
            <div class="matchup-col-title">
              <span>
                <span class="lang-en-only">✓ Already Fought (Days 1–${upToDay})</span>
                <span class="lang-jp-only">✓ 対戦済み（1〜${upToDay}日目）</span>
              </span>
              <span style="font-size:0.72rem; color:var(--text-muted);">${analysis.foughtList.length} bouts</span>
            </div>
            <div class="matchup-list">
              ${
                analysis.foughtList.length === 0
                  ? `<p style="font-size:0.8rem; color:var(--text-muted);">No recorded bouts found for Days 1–${upToDay}.</p>`
                  : analysis.foughtList
                      .map((f) => {
                        const resBadge =
                          f.result === "W"
                            ? `<span class="shiroboshi-circle" title="Win"></span>`
                            : f.result === "L"
                            ? `<span class="kuroboshi-circle" title="Loss"></span>`
                            : `<span style="font-size:0.72rem; color:var(--text-muted);">Scheduled</span>`;
                        return `
                          <div class="matchup-item">
                            <div class="matchup-item-left">
                              <span style="font-family:var(--font-mono); font-size:0.72rem; font-weight:700; color:var(--text-muted);">D${f.day}</span>
                              ${resBadge}
                              <button type="button" class="standings-shikona-btn" data-select-matchup-rikishi="${f.opponent.id}">
                                <span style="font-weight:700;">${f.opponent.romaji} <span style="font-weight:500; color:var(--text-muted);">(${f.opponent.shikonaKanji})</span></span>
                              </button>
                            </div>
                            <div class="matchup-item-right">
                              <span class="standings-rank-tag">${compactRankCode(f.opponent.rankEn)}</span>
                              ${f.kimarite ? `<span style="font-size:0.7rem; color:var(--text-muted);">${f.kimarite}</span>` : ""}
                            </div>
                          </div>
                        `;
                      })
                      .join("")
              }
            </div>
          </div>

          <div class="matchup-col-box">
            <div class="matchup-col-title">
              <span>
                <span class="lang-en-only">🎯 Likely Final-Days Opponents (Unfought)</span>
                <span class="lang-jp-only">🎯 終盤戦・有力な未対戦相手</span>
              </span>
              <span style="font-size:0.72rem; color:var(--text-muted);">${analysis.totalEligible} eligible</span>
            </div>
            <div class="matchup-list">
              ${
                analysis.candidates.length === 0
                  ? `<p style="font-size:0.8rem; color:var(--text-muted);">No eligible unfought opponents remaining.</p>`
                  : analysis.candidates
                      .map((c) => {
                        const opp = c.opponent;
                        return `
                          <div class="matchup-item">
                            <div class="matchup-item-left">
                              <span class="standings-rank-tag">${compactRankCode(opp.rankEn)}</span>
                              <div style="min-width:0;">
                                <button type="button" class="standings-shikona-btn" data-select-matchup-rikishi="${opp.id}">
                                  <span style="font-weight:700;">${opp.romaji} <span style="font-weight:500; color:var(--text-muted);">(${opp.shikonaKanji})</span></span>
                                </button>
                                <div style="font-size:0.7rem; color:var(--text-muted);">${c.reason} • ${opp.heyaEn}</div>
                              </div>
                            </div>
                            <div class="matchup-item-right">
                              <span class="standings-record-pill" style="font-size:0.74rem;">${opp.wins}-${opp.losses}</span>
                              <span class="likelihood-pill ${c.tier}">
                                <span class="lang-en-only">${c.tierLabelEn}</span>
                                <span class="lang-jp-only">${c.tierLabelJp}</span>
                              </span>
                            </div>
                          </div>
                        `;
                      })
                      .join("")
              }
            </div>
          </div>
        </div>
      </div>

      <div class="standings-card">
        <div class="standings-header-row">
          <h3>
            <span class="lang-en-only">⚔️ Top ${contenders.length} Contenders Clash Matrix (Who Still Needs to Fight Whom)</span>
            <span class="lang-jp-only">⚔️ 上位${contenders.length}名 優勝争い直接対決マトリックス</span>
          </h3>
          <span class="standings-meta-pill">⚔️ = Unfought potential final-days clash</span>
        </div>

        <div class="clash-matrix-wrap">
          <table class="clash-matrix-table">
            <thead>
              <tr>
                <th style="text-align:left;">Contender</th>
                ${contenders
                  .map(
                    (c) =>
                      `<th>${c.romaji}<br><span style="font-weight:500; color:var(--text-muted);">${c.wins}-${c.losses}</span></th>`
                  )
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${contenders
                .map(
                  (rowR) => `
                  <tr>
                    <td class="row-label">
                      <button type="button" class="standings-shikona-btn" data-select-matchup-rikishi="${rowR.id}">
                        <span>${rowR.romaji} <span style="font-weight:500; color:var(--text-muted);">(${rowR.wins}-${rowR.losses})</span></span>
                      </button>
                    </td>
                    ${contenders
                      .map((colR) => {
                        if (rowR.id === colR.id) {
                          return `<td class="clash-cell-self">—</td>`;
                        }
                        if (
                          rowR.heyaEn &&
                          colR.heyaEn &&
                          rowR.heyaEn !== "Grand Sumo" &&
                          rowR.heyaEn === colR.heyaEn
                        ) {
                          return `<td class="clash-cell-heya">Same Heya</td>`;
                        }
                        const bout = boutMap.get(`${rowR.id}__${colR.id}`);
                        if (bout) {
                          if (!bout.winnerId) {
                            return `<td class="clash-cell-unfought">D${bout.day}</td>`;
                          }
                          const won = bout.winnerId === rowR.id;
                          return `<td class="${won ? "clash-cell-win" : "clash-cell-loss"}">${won ? "○" : "●"} D${bout.day}</td>`;
                        }
                        return `<td class="clash-cell-unfought">⚔️ Unfought</td>`;
                      })
                      .join("")}
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* ========================================================================
     Event Delegation & Listeners
     ======================================================================== */
  function bindEvents() {
    // Theme toggle
    document.getElementById("theme-toggle-btn").addEventListener("click", () => {
      applyTheme(state.theme === "washi" ? "dark" : "washi");
    });

    // Language Mode Switcher
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyLanguageMode(btn.getAttribute("data-lang-mode"));
      });
    });

    // Navigation Tabs
    document.querySelectorAll(".nav-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        state.activeTab = targetTab;

        document.querySelectorAll(".nav-tab-btn").forEach((b) => {
          b.classList.toggle("active", b.getAttribute("data-tab") === targetTab);
        });
        document.querySelectorAll(".tab-panel").forEach((p) => {
          p.classList.toggle("active", p.id === `panel-${targetTab}`);
        });
        if (targetTab === "predictions") {
          renderPredictionsTab();
        } else if (targetTab === "standings") {
          renderStandingsTab();
        }
      });
    });

    // Basho Selector
    document.getElementById("basho-select").addEventListener("change", (e) => {
      state.selectedBashoId = e.target.value;
      state.standings.selectedRikishiId = null;
      generateScheduleForDay(state.selectedDay);
      renderTorikumiList();
      renderPredictionsTab();
      if (state.activeTab === "standings") renderStandingsTab();
      syncWithLiveSumoApi();
    });

    // Day 1-15 Strip
    document.getElementById("day-strip").addEventListener("click", (e) => {
      const btn = e.target.closest(".day-btn");
      if (!btn) return;
      state.selectedDay = parseInt(btn.getAttribute("data-day"), 10);
      initDayStrip();
      generateScheduleForDay(state.selectedDay);
      renderTorikumiList();
      renderPredictionsTab();
      if (state.activeTab === "standings") renderStandingsTab();
      syncWithLiveSumoApi();
    });

    // Standings & Race Controls
    const standingsDivPills = document.getElementById("standings-division-pills");
    if (standingsDivPills) {
      standingsDivPills.addEventListener("click", (e) => {
        const pill = e.target.closest(".filter-pill");
        if (!pill) return;
        state.standings.division = pill.getAttribute("data-division");
        state.standings.selectedRikishiId = null;
        renderStandingsTab();
      });
    }

    const standingsTopNPills = document.getElementById("standings-topn-pills");
    if (standingsTopNPills) {
      standingsTopNPills.addEventListener("click", (e) => {
        const pill = e.target.closest(".filter-pill");
        if (!pill) return;
        state.standings.topN = pill.getAttribute("data-topn");
        renderStandingsTab();
      });
    }

    const standingsSearch = document.getElementById("standings-search");
    if (standingsSearch) {
      standingsSearch.addEventListener("input", (e) => {
        state.standings.search = e.target.value;
        renderStandingsTab();
      });
    }

    const standingsMatchupsContainer = document.getElementById("standings-matchups-container");
    if (standingsMatchupsContainer) {
      standingsMatchupsContainer.addEventListener("change", (e) => {
        if (e.target.id === "matchup-rikishi-select") {
          state.standings.selectedRikishiId = e.target.value;
          renderStandingsTab();
        }
      });
    }

    // Bout Order Toggle (Last Match First vs. Last Match at Bottom)
    document.getElementById("bout-order-toggle-btn").addEventListener("click", () => {
      state.boutOrder = state.boutOrder === "desc" ? "asc" : "desc";
      localStorage.setItem("dohyo_bout_order", state.boutOrder);
      updateBoutOrderButton();
      renderTorikumiList();
    });

    // Live API Sync button
    document.getElementById("sync-live-api-btn").addEventListener("click", () => {
      syncWithLiveSumoApi();
    });

    // Torikumi Search & Filter Pills
    document.getElementById("torikumi-search").addEventListener("input", (e) => {
      state.torikumiSearch = e.target.value;
      renderTorikumiList();
    });

    document.getElementById("torikumi-division-pills").addEventListener("click", (e) => {
      const pill = e.target.closest(".filter-pill");
      if (!pill) return;
      state.divisionFilter = pill.getAttribute("data-division");
      updateDivisionPills();
      renderTorikumiList();
    });

    document.getElementById("torikumi-filter-pills").addEventListener("click", (e) => {
      const pill = e.target.closest(".filter-pill");
      if (!pill) return;
      state.torikumiFilter = pill.getAttribute("data-filter");
      document.querySelectorAll("#torikumi-filter-pills .filter-pill").forEach((p) => {
        p.classList.toggle("active", p === pill);
      });
      renderTorikumiList();
    });

    // Rikishi Search & Rank Filter Pills
    document.getElementById("rikishi-search").addEventListener("input", (e) => {
      state.rikishiSearch = e.target.value;
      renderRikishiDirectory();
    });

    document.getElementById("rikishi-rank-pills").addEventListener("click", (e) => {
      const pill = e.target.closest(".filter-pill");
      if (!pill) return;
      state.rikishiRankFilter = pill.getAttribute("data-rank");
      document.querySelectorAll("#rikishi-rank-pills .filter-pill").forEach((p) => {
        p.classList.toggle("active", p === pill);
      });
      renderRikishiDirectory();
    });

    // Kimarite Search & Category Pills
    document.getElementById("kimarite-search").addEventListener("input", (e) => {
      state.kimariteSearch = e.target.value;
      renderKimariteExplorer();
    });

    document.getElementById("kimarite-cat-pills").addEventListener("click", (e) => {
      const pill = e.target.closest(".filter-pill");
      if (!pill) return;
      state.kimariteCatFilter = pill.getAttribute("data-cat");
      document.querySelectorAll("#kimarite-cat-pills .filter-pill").forEach((p) => {
        p.classList.toggle("active", p === pill);
      });
      renderKimariteExplorer();
    });

    // Kensho Calculator
    document.getElementById("kensho-input").addEventListener("input", updateKenshoCalculator);

    // Real-time auto-save for the 4-Player Roster Name Inputs (without losing cursor focus)
    document.body.addEventListener("input", (e) => {
      const nameInput = e.target.closest("[data-player-name-input]");
      if (!nameInput) return;
      const pid = nameInput.getAttribute("data-player-name-input");
      const player = state.contest.players.find((p) => p.id === pid);
      if (!player) return;
      const idx = state.contest.players.indexOf(player);
      const val = nameInput.value.trim().slice(0, 22);
      player.name = val || `Player ${idx + 1}`;
      saveContestState();

      // Update mirrored player labels in Tab 5 and Tab 1 without destroying input focus
      document.querySelectorAll(`[data-player-name-mirror="${pid}"]`).forEach((el) => {
        el.textContent = player.name;
      });
      if (state.contest.activePlayerId === pid) {
        document.querySelectorAll("[data-active-player-label]").forEach((el) => {
          el.textContent = player.name;
        });
      }
      renderInlineContestPickerBar();
    });

    // Delegated change events for Tab 5 Roster Blur & Tiebreakers
    document.body.addEventListener("change", (e) => {
      if (e.target.matches("[data-player-name-input]")) {
        renderTorikumiList();
        renderPredictionsTab();
        return;
      }
      if (e.target.id === "tb-kimarite-select") {
        const activePlayer = getActiveContestPlayer();
        if (!activePlayer) return;
        const dayKey = getContestDayKey();
        if (!activePlayer.tiebreakers) activePlayer.tiebreakers = {};
        const cur = activePlayer.tiebreakers[dayKey] || { kimariteId: "yorikiri", kenshoCount: 15 };
        cur.kimariteId = e.target.value;
        activePlayer.tiebreakers[dayKey] = cur;
        saveContestState();
        renderPredictionsTab();
      } else if (e.target.id === "tb-kensho-input") {
        const activePlayer = getActiveContestPlayer();
        if (!activePlayer) return;
        const dayKey = getContestDayKey();
        if (!activePlayer.tiebreakers) activePlayer.tiebreakers = {};
        const cur = activePlayer.tiebreakers[dayKey] || { kimariteId: "yorikiri", kenshoCount: 15 };
        cur.kenshoCount = Math.max(0, Math.min(60, parseInt(e.target.value, 10) || 0));
        activePlayer.tiebreakers[dayKey] = cur;
        saveContestState();
        renderPredictionsTab();
      } else if (e.target.id === "actual-musubi-kensho-input") {
        const dayKey = getContestDayKey();
        const rawVal = e.target.value.trim();
        if (rawVal === "") {
          delete state.contest.actualMusubiKensho[dayKey];
        } else {
          state.contest.actualMusubiKensho[dayKey] = Math.max(0, Math.min(60, parseInt(rawVal, 10) || 0));
        }
        saveContestState();
        renderPredictionsTab();
      }
    });

    // Delegated clicks for Rikishi Inspector, Watchlist Stars, Winner Markers, and 4-Player Contest
    document.body.addEventListener("click", (e) => {
      const openTabEl = e.target.closest("[data-open-tab]");
      if (openTabEl) {
        const tabName = openTabEl.getAttribute("data-open-tab");
        const tabBtn = document.getElementById(`tab-btn-${tabName}`);
        if (tabBtn) tabBtn.click();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const selectPlayerEl = e.target.closest("[data-select-player]");
      if (selectPlayerEl) {
        state.contest.activePlayerId = selectPlayerEl.getAttribute("data-select-player");
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
        return;
      }

      const addPlayerEl = e.target.closest("[data-contest-add-player]");
      if (addPlayerEl) {
        const nextNum = state.contest.players.length + 1;
        const newPlayer = {
          id: "p_" + Date.now().toString(36),
          name: `Player ${nextNum}`,
          color: PLAYER_COLORS[(nextNum - 1) % PLAYER_COLORS.length],
          picks: {},
          tiebreakers: {}
        };
        state.contest.players.push(newPlayer);
        state.contest.activePlayerId = newPlayer.id;
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
        return;
      }

      const removePlayerEl = e.target.closest("[data-remove-player]");
      if (removePlayerEl) {
        if (state.contest.players.length <= 2) return;
        const pid = removePlayerEl.getAttribute("data-remove-player");
        state.contest.players = state.contest.players.filter((p) => p.id !== pid);
        if (state.contest.activePlayerId === pid) {
          state.contest.activePlayerId = state.contest.players[0].id;
        }
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
        return;
      }

      if (e.target.id === "reset-4p-slots-btn") {
        while (state.contest.players.length < 4) {
          const nextNum = state.contest.players.length + 1;
          state.contest.players.push({
            id: "p_" + Date.now().toString(36) + "_" + nextNum,
            name: `Player ${nextNum}`,
            color: PLAYER_COLORS[(nextNum - 1) % PLAYER_COLORS.length],
            picks: {},
            tiebreakers: {}
          });
        }
        if (state.contest.players.length > 4) {
          state.contest.players = state.contest.players.slice(0, 4);
        }
        state.contest.activePlayerId = state.contest.players[0].id;
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
        return;
      }

      if (e.target.id === "reset-today-picks-btn") {
        const dayPrefix = `${state.selectedBashoId}-D${state.selectedDay}-`;
        const dayKey = getContestDayKey();
        state.contest.players.forEach((p) => {
          if (p.picks) {
            Object.keys(p.picks).forEach((k) => {
              if (k.startsWith(dayPrefix)) delete p.picks[k];
            });
          }
          if (p.tiebreakers) {
            delete p.tiebreakers[dayKey];
          }
        });
        delete state.contest.actualMusubiKensho[dayKey];
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
        showContestToast("✓ Reset today's predictions for all players (player names kept)!");
        return;
      }

      const scopePillEl = e.target.closest("[data-contest-scope]");
      if (scopePillEl) {
        state.contest.contestScope = scopePillEl.getAttribute("data-contest-scope");
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
        return;
      }

      const pickBoutEl = e.target.closest("[data-pick-bout]");
      if (pickBoutEl) {
        const bKey = pickBoutEl.getAttribute("data-pick-bout");
        const side = pickBoutEl.getAttribute("data-pick-side");
        const explicitPlayerId = pickBoutEl.getAttribute("data-pick-player");
        const targetPlayer = explicitPlayerId
          ? state.contest.players.find((p) => p.id === explicitPlayerId)
          : getActiveContestPlayer();
        if (!targetPlayer) return;
        if (!targetPlayer.picks) targetPlayer.picks = {};
        if (targetPlayer.picks[bKey] === side) {
          delete targetPlayer.picks[bKey];
        } else {
          targetPlayer.picks[bKey] = side;
        }
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
        return;
      }

      if (e.target.id === "autofill-remaining-picks-btn") {
        const activePlayer = getActiveContestPlayer();
        if (!activePlayer) return;
        if (!activePlayer.picks) activePlayer.picks = {};
        const pIdx = Math.max(0, state.contest.players.indexOf(activePlayer));
        const scopeBouts = getBoutsInContestScope();
        scopeBouts.forEach((bout, idx) => {
          const bKey = getBoutKey(bout);
          if (!activePlayer.picks[bKey]) {
            activePlayer.picks[bKey] = (bout.boutNo + idx + pIdx) % 2 === 0 ? "East" : "West";
          }
        });
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
        return;
      }

      if (e.target.id === "autofill-all-4p-btn") {
        const scopeBouts = getBoutsInContestScope();
        state.contest.players.forEach((p, pIdx) => {
          if (!p.picks) p.picks = {};
          scopeBouts.forEach((bout, idx) => {
            const bKey = getBoutKey(bout);
            if (!p.picks[bKey]) {
              p.picks[bKey] = ((bout.boutNo * (pIdx + 1)) + idx + pIdx) % 2 === 0 ? "East" : "West";
            }
          });
        });
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
        showContestToast(`✓ Auto-filled remaining picks for all ${state.contest.players.length} players!`);
        return;
      }

      if (e.target.id === "clear-active-picks-btn") {
        const activePlayer = getActiveContestPlayer();
        if (!activePlayer || !activePlayer.picks) return;
        const scopeBouts = getBoutsInContestScope();
        scopeBouts.forEach((bout) => {
          delete activePlayer.picks[getBoutKey(bout)];
        });
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
        return;
      }

      const selectMatchupEl = e.target.closest("[data-select-matchup-rikishi]");
      if (selectMatchupEl) {
        state.standings.selectedRikishiId = selectMatchupEl.getAttribute("data-select-matchup-rikishi");
        renderStandingsTab();
        const matchupsEl = document.getElementById("standings-matchups-container");
        if (matchupsEl) matchupsEl.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const inspectRikishiEl = e.target.closest("[data-inspect-rikishi]");
      if (inspectRikishiEl) {
        openRikishiModal(inspectRikishiEl.getAttribute("data-inspect-rikishi"));
        return;
      }

      const starBoutEl = e.target.closest("[data-star-bout]");
      if (starBoutEl) {
        const key = starBoutEl.getAttribute("data-star-bout");
        if (state.starredBouts.has(key)) {
          state.starredBouts.delete(key);
        } else {
          state.starredBouts.add(key);
        }
        localStorage.setItem("dohyo_starred_bouts", JSON.stringify([...state.starredBouts]));
        renderTorikumiList();
        return;
      }

      const starRikishiEl = e.target.closest("[data-star-rikishi]");
      if (starRikishiEl) {
        const rid = starRikishiEl.getAttribute("data-star-rikishi");
        if (state.starredRikishi.has(rid)) {
          state.starredRikishi.delete(rid);
        } else {
          state.starredRikishi.add(rid);
        }
        localStorage.setItem("dohyo_starred_rikishi", JSON.stringify([...state.starredRikishi]));
        renderRikishiDirectory();
        renderTorikumiList();
        return;
      }

      const markWinnerEl = e.target.closest("[data-mark-winner]");
      if (markWinnerEl) {
        const boutKey = markWinnerEl.getAttribute("data-mark-winner");
        const side = markWinnerEl.getAttribute("data-side");
        const move = markWinnerEl.getAttribute("data-move") || "yorikiri";
        state.simulatedWinners[boutKey] = {
          side,
          kimariteId: kimariteById.has(move) ? move : "yorikiri"
        };
        saveSimulatedWinners();
        renderTorikumiList();
        renderPredictionsTab();
        return;
      }

      const clearWinnerEl = e.target.closest("[data-clear-winner]");
      if (clearWinnerEl) {
        const boutKey = clearWinnerEl.getAttribute("data-clear-winner");
        delete state.simulatedWinners[boutKey];
        saveSimulatedWinners();
        renderTorikumiList();
        renderPredictionsTab();
        return;
      }

      const inspectKimariteEl = e.target.closest("[data-inspect-kimarite]");
      if (inspectKimariteEl) {
        const kid = inspectKimariteEl.getAttribute("data-inspect-kimarite");
        document.getElementById("tab-btn-kimarite").click();
        const card = document.getElementById(`kimarite-card-${kid}`);
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    // Modal close
    document.getElementById("modal-close-btn").addEventListener("click", closeModal);
    document.getElementById("detail-modal-backdrop").addEventListener("click", (e) => {
      if (e.target.id === "detail-modal-backdrop") closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  function renderAll() {
    renderTorikumiList();
    renderRikishiDirectory();
    renderKimariteExplorer();
    renderVenueGuide();
    renderPredictionsTab();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
