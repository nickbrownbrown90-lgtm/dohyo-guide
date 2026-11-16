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

  function loadContestState() {
    try {
      const raw = localStorage.getItem("dohyo_contest_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.players) && parsed.players.length > 0) {
          return {
            players: parsed.players,
            activePlayerId: parsed.activePlayerId || parsed.players[0].id,
            contestScope: parsed.contestScope || "Makuuchi",
            actualMusubiKensho: parsed.actualMusubiKensho || {}
          };
        }
      }
    } catch (_) {}
    return {
      players: [
        {
          id: "p1",
          name: "Player 1",
          color: PLAYER_COLORS[0],
          picks: {},
          tiebreakers: {}
        },
        {
          id: "p2",
          name: "Player 2",
          color: PLAYER_COLORS[1],
          picks: {},
          tiebreakers: {}
        }
      ],
      activePlayerId: "p1",
      contestScope: "Makuuchi",
      actualMusubiKensho: {}
    };
  }

  // Application State
  const state = {
    activeTab: "torikumi",
    langMode: localStorage.getItem("dohyo_lang") || "dual",
    theme: localStorage.getItem("dohyo_theme") || "washi",
    selectedBashoId: "202611",
    selectedDay: 9, // Defaults to Day 9 (2026-11-16 JST)
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
    editingPlayerId: null
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
     Live sumo-api.com Sync with Instant Offline Fallback
     ======================================================================== */
  function resolveOrCreateRikishi(apiId, shikonaRaw, rankRaw, side) {
    if (apiId && rikishiByApiId.has(apiId)) return rikishiByApiId.get(apiId);
    const norm = (shikonaRaw || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (norm && rikishiByRomaji.has(norm)) return rikishiByRomaji.get(norm);

    const slug = (norm || `rikishi-${apiId || Math.random()}`).replace(/[^a-z0-9]/g, "");
    const dynamicProfile = {
      id: slug,
      apiId: apiId || 0,
      shikonaKanji: shikonaRaw || "力士",
      furigana: shikonaRaw || "",
      rubyHtml: shikonaRaw || "力士",
      romaji: shikonaRaw || "Rikishi",
      givenName: "",
      rankEn: rankRaw || "Makuuchi",
      rankJp: rankRaw || "幕内",
      rankTier: "Maegashira",
      side: side || "East",
      heyaEn: "JSA",
      heyaJp: "日本相撲協会",
      originEn: "Grand Sumo",
      originJp: "大相撲",
      heightCm: 185,
      weightKg: 150,
      styleCode: "Makuuchi",
      styleEn: "Grand Sumo top-division competitor",
      styleJp: "幕内力士",
      signatureMoves: ["Yorikiri", "Oshidashi"],
      makuuchiYusho: 0,
      sansho: "Active",
      kinboshi: 0,
      careerRecord: "Live API",
      currentRecord: "Live",
      literalMeaningEn: shikonaRaw || "Rikishi",
      literalMeaningJp: shikonaRaw || "力士",
      kanjiBreakdown: [],
      storyEn: `${shikonaRaw} (${rankRaw}) competing in Grand Sumo.`,
      storyJp: `${shikonaRaw}（${rankRaw}）の取組。`
    };
    registerRikishi(dynamicProfile);
    return dynamicProfile;
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
    text.textContent = `Syncing all 6 divisions (${dateStr} • Day ${state.selectedDay})...`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const curatedByBoutNo = new Map();
      if (state.selectedBashoId === "202611" && state.selectedDay === 9) {
        DATA.defaultTorikumi.forEach((b) => curatedByBoutNo.set(b.boutNo, b));
      }

      const results = await Promise.allSettled(
        DIVISIONS.map(async (divMeta) => {
          const url = `https://sumo-api.com/api/basho/${basho.apiId}/torikumi/${divMeta.key}/${state.selectedDay}`;
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          return { divMeta, torikumi: (json && Array.isArray(json.torikumi)) ? json.torikumi : [] };
        })
      );
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

          allMapped.push({
            division: divMeta.key,
            divisionJp: divMeta.jp,
            divisionOrder: divMeta.order,
            boutNo: bno,
            boutTitleEn: curated ? curated.boutTitleEn : `${divMeta.key} Bout #${bno}: ${eastMatch.romaji} vs. ${westMatch.romaji}`,
            boutTitleJp: curated ? curated.boutTitleJp : `${divMeta.jp}第${bno}番：${eastMatch.shikonaKanji} vs ${westMatch.shikonaKanji}`,
            approxTime: curated ? curated.approxTime : approxTime,
            isSanyaku: curated ? curated.isSanyaku : (divMeta.key === "Makuuchi" && bno >= 15),
            stakesTagEn: curated ? curated.stakesTagEn : `${item.eastRank || eastMatch.rankEn} vs. ${item.westRank || westMatch.rankEn}`,
            stakesTagJp: curated ? curated.stakesTagJp : `${item.eastRank || eastMatch.rankJp} vs ${item.westRank || westMatch.rankJp}`,
            eastId: eastMatch.id,
            westId: westMatch.id,
            h2hEast: curated ? curated.h2hEast : 1,
            h2hWest: curated ? curated.h2hWest : 1,
            lastMeetingEn: item.kimarite ? `Result: ${item.kimarite}` : curated ? curated.lastMeetingEn : `${dateStr} • Day ${state.selectedDay}`,
            lastMeetingJp: item.kimarite ? `決まり手：${item.kimarite}` : curated ? curated.lastMeetingJp : `${dateStr}（${state.selectedDay}日目）`,
            winnerSide,
            kimariteId: item.kimarite ? item.kimarite.toLowerCase() : null,
            storylineEn: curated ? curated.storylineEn : `${divMeta.key} division matchup: ${eastMatch.romaji} (${item.eastRank || eastMatch.rankEn}) vs. ${westMatch.romaji} (${item.westRank || westMatch.rankEn}).`,
            storylineJp: curated ? curated.storylineJp : `${divMeta.jp}の取組：${eastMatch.shikonaKanji} 対 ${westMatch.shikonaKanji}。`
          });
        });
      });

      if (allMapped.length > 0) {
        state.boutsForCurrentSelection = allMapped;
        dot.classList.remove("syncing");
        text.textContent = `Live API Synced • ${dateStr} (${allMapped.length} Bouts across 6 Divisions)`;
        updateDivisionPills();
        renderTorikumiList();
        renderPredictionsTab();
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
                  🏆 Open Leaderboard &amp; Share Picks →
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

    container.innerHTML = filtered
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
        <span class="picker-bar-label">🎯 Active Picker (予想者):</span>
        ${playerPillsHtml}
        <button type="button" class="inspect-btn" data-contest-add-player="1" title="Add another friend to the contest">
          + Add Friend
        </button>
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
          🏆 Tab 5: Leaderboard &amp; Share
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
      dayBadge.innerHTML = `<span>🏮 ${basho.city} • ${dateStr} • Day ${state.selectedDay}</span>`;
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
                <span>${escapeHtml(row.player.name)}</span>
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

        return `
          <div class="rapid-pick-row">
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
        `;
      })
      .join("");

    container.innerHTML = `
      <!-- Contest Scope & Player Switcher Controls -->
      <div class="torikumi-controls">
        <div class="controls-top-row">
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
        </div>

        <!-- Player Management Row -->
        <div class="filter-pills-row">
          <div class="picker-bar-left">
            <span class="picker-bar-label">👥 Players (参加者):</span>
            ${state.contest.players
              .map(
                (p) => `
                <button
                  type="button"
                  class="player-picker-pill ${activePlayer && activePlayer.id === p.id ? "active" : ""}"
                  data-select-player="${p.id}"
                >
                  <span class="player-dot" style="background:${p.color};"></span>
                  <span>${escapeHtml(p.name)}</span>
                </button>
              `
              )
              .join("")}
            <button type="button" class="inspect-btn" data-contest-add-player="1">
              + Add Friend (友達を追加)
            </button>
          </div>

          ${
            activePlayer
              ? `<div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
                  <input
                    type="text"
                    id="rename-active-player-input"
                    class="search-input"
                    value="${escapeHtml(activePlayer.name)}"
                    maxlength="24"
                    style="width:145px; padding:0.28rem 0.5rem; font-size:0.78rem;"
                    aria-label="Rename active player"
                  />
                  <button type="button" class="inspect-btn" id="save-rename-player-btn">Rename 名前変更</button>
                  ${
                    state.contest.players.length > 1
                      ? `<button type="button" class="inspect-btn" id="delete-active-player-btn" style="color:var(--higashi-primary);">🗑 Remove</button>`
                      : ""
                  }
                </div>`
              : ""
          }
        </div>
      </div>

      <!-- Two-Column Grid: Live Leaderboard + Tiebreaker & Multi-Phone Share/Import -->
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
          <div class="leaderboard-list">
            ${leaderboardHtml}
          </div>
        </div>

        <!-- Right Column: Tiebreaker + Pass-and-Play / Share Link & Import -->
        <div style="display:flex; flex-direction:column; gap:1rem;">
          <!-- Musubi no Ichiban Tiebreaker Card -->
          <div class="contest-card">
            <h3>
              <span>🎌 Musubi no Ichiban Tiebreaker (結びの一番タイブレーク)</span>
            </h3>
            <p style="font-size:0.78rem; color:var(--text-secondary);">
              Final Bout: <strong>${musubiEast ? musubiEast.shikonaKanji + " (" + musubiEast.romaji + ")" : "East"}</strong> vs. <strong>${musubiWest ? musubiWest.shikonaKanji + " (" + musubiWest.romaji + ")" : "West"}</strong>.
              Set <strong>${activePlayer ? escapeHtml(activePlayer.name) : "Player"}'s</strong> tiebreaker call:
            </p>
            <div style="display:flex; flex-direction:column; gap:0.55rem;">
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
                    2. ${activePlayer ? escapeHtml(activePlayer.name) : "Player"}'s Kenshō Call (予想懸賞本数 0–60):
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

          <!-- Share & Import Card (Multi-Phone Zero-Backend Sync) -->
          <div class="contest-card">
            <h3>
              <span>📲 Share or Import Picks (LINE / AirDrop / URL同期)</span>
            </h3>
            <p style="font-size:0.78rem; color:var(--text-secondary);">
              Everyone picking on their own phone? Tap <strong>Share Link</strong> to send your picks via LINE/iMessage/AirDrop, or paste a friend's link/code below to merge into the leaderboard!
            </p>
            <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
              <button type="button" class="action-btn" id="share-active-player-btn">
                📤 Share ${activePlayer ? escapeHtml(activePlayer.name) : "My"}'s Picks Link
              </button>
              <button type="button" class="inspect-btn" id="share-all-group-btn">
                📤 Share All Group Picks (${state.contest.players.length})
              </button>
            </div>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-top:0.2rem;">
              <input
                type="text"
                id="import-picks-input"
                class="search-input"
                placeholder="Paste friend's Share Link or Code here..."
                style="flex:1; min-width:180px; font-size:0.78rem;"
                aria-label="Paste friend's share link or code"
              />
              <button type="button" class="action-btn" id="import-picks-submit-btn">
                📥 Import Friend
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Rapid Pick Sheet (一括予想シート) -->
      <div class="contest-card">
        <h3>
          <span>⚡ Rapid Pick Sheet for <span style="color:var(--higashi-primary);">${activePlayer ? escapeHtml(activePlayer.name) : "Player"}</span> (一括予想シート)</span>
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            <button type="button" class="inspect-btn" id="autofill-remaining-picks-btn">
              🎲 Auto-Fill Remaining (おまかせ選択)
            </button>
            <button type="button" class="inspect-btn" id="clear-active-picks-btn">
              🗑 Clear ${activePlayer ? escapeHtml(activePlayer.name) : ""}'s Picks
            </button>
          </div>
        </h3>
        <p style="font-size:0.78rem; color:var(--text-secondary);">
          Tap East (<strong style="color:var(--higashi-primary);">東</strong>) or West (<strong style="color:var(--nishi-primary);">西</strong>) down the card to lock in all ${scopeBouts.length} bouts in seconds. Switch active player above to pass the phone!
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
          Given Name: ${r.givenName} • Stable: ${r.heyaEn} (${r.heyaJp}) • Origin: ${r.originEn} (${r.originJp})
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
          <span class="meta-v">${r.careerRecord}</span>
        </div>
        <div class="meta-item">
          <span class="meta-k">Fighting Style (得意な型)</span>
          <span class="meta-v">${r.styleEn} (${r.styleJp})</span>
        </div>
        <div class="meta-item">
          <span class="meta-k">Yūshō &amp; Special Prizes (三賞・金星)</span>
          <span class="meta-v">🏆 ${r.makuuchiYusho} Yūshō • Sanshō: ${r.sansho} • Kinboshi: ${r.kinboshi}</span>
        </div>
      </div>
    `;

    backdrop.classList.add("open");
  }

  function closeModal() {
    document.getElementById("detail-modal-backdrop").classList.remove("open");
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
        }
      });
    });

    // Basho Selector
    document.getElementById("basho-select").addEventListener("change", (e) => {
      state.selectedBashoId = e.target.value;
      generateScheduleForDay(state.selectedDay);
      renderTorikumiList();
      renderPredictionsTab();
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
      syncWithLiveSumoApi();
    });

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

    // Delegated change events for Tab 5 Tiebreakers
    document.body.addEventListener("change", (e) => {
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

    // Delegated clicks for Rikishi Inspector, Watchlist Stars, Winner Markers, and Predictions Contest
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
        const renameInput = document.getElementById("rename-active-player-input");
        if (renameInput && state.activeTab === "predictions") {
          renameInput.focus();
          renameInput.select();
        }
        return;
      }

      if (e.target.id === "save-rename-player-btn") {
        const input = document.getElementById("rename-active-player-input");
        const activePlayer = getActiveContestPlayer();
        if (input && activePlayer) {
          const cleaned = input.value.trim().slice(0, 24);
          if (cleaned) {
            activePlayer.name = cleaned;
            saveContestState();
            renderTorikumiList();
            renderPredictionsTab();
          }
        }
        return;
      }

      if (e.target.id === "delete-active-player-btn") {
        if (state.contest.players.length <= 1) return;
        const activePlayer = getActiveContestPlayer();
        if (!activePlayer) return;
        state.contest.players = state.contest.players.filter((p) => p.id !== activePlayer.id);
        state.contest.activePlayerId = state.contest.players[0].id;
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
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
        const activePlayer = getActiveContestPlayer();
        if (!activePlayer) return;
        if (!activePlayer.picks) activePlayer.picks = {};
        if (activePlayer.picks[bKey] === side) {
          delete activePlayer.picks[bKey];
        } else {
          activePlayer.picks[bKey] = side;
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
        const scopeBouts = getBoutsInContestScope();
        scopeBouts.forEach((bout, idx) => {
          const bKey = getBoutKey(bout);
          if (!activePlayer.picks[bKey]) {
            activePlayer.picks[bKey] = (bout.boutNo + idx) % 2 === 0 ? "East" : "West";
          }
        });
        saveContestState();
        renderTorikumiList();
        renderPredictionsTab();
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

      if (e.target.id === "share-active-player-btn" || e.target.id === "share-all-group-btn") {
        const isAll = e.target.id === "share-all-group-btn";
        const activePlayer = getActiveContestPlayer();
        const playersToShare = isAll
          ? state.contest.players
          : activePlayer
          ? [activePlayer]
          : state.contest.players;
        const code = buildShareCodeForPlayers(playersToShare);
        const shareUrl = `${window.location.origin}${window.location.pathname}?importPicks=${code}`;
        const label = isAll
          ? `All ${playersToShare.length} players`
          : activePlayer
          ? activePlayer.name
          : "My";

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).catch(() => {});
        }
        showContestToast(`✓ Copied ${label}'s Share Link to clipboard! Send it via LINE/iMessage/AirDrop.`);

        if (navigator.share) {
          navigator
            .share({
              title: `Dohyō Guide — ${label}'s Sumo Predictions`,
              text: `Import ${label}'s Sumo Contest Picks (Loser Pays Everything! 💸):`,
              url: shareUrl
            })
            .catch(() => {});
        }
        return;
      }

      if (e.target.id === "import-picks-submit-btn") {
        const input = document.getElementById("import-picks-input");
        if (!input || !input.value.trim()) return;
        try {
          const decoded = decodeContestSharePayload(input.value.trim());
          const names = importDecodedPayload(decoded);
          input.value = "";
          renderTorikumiList();
          renderPredictionsTab();
          showContestToast(`✓ Imported ${names.join(", ")}'s picks into the leaderboard!`);
        } catch (err) {
          showContestToast("⚠ Invalid Share Link or Code. Please copy the full link or code from your friend.");
        }
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
