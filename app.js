/* ==========================================================================
   Dohyō Guide (土俵ガイド) — Application Controller & Hybrid Live API Engine
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.SUMO_DATA;

  // Application State
  const state = {
    activeTab: "torikumi",
    langMode: localStorage.getItem("dohyo_lang") || "dual",
    theme: localStorage.getItem("dohyo_theme") || "washi",
    selectedBashoId: "202611",
    selectedDay: 9, // Defaults to Day 9 (2026-11-16 JST)
    boutOrder: localStorage.getItem("dohyo_bout_order") || "desc", // "desc" = Last Match First, "asc" = Last Match at Bottom
    torikumiFilter: "all",
    torikumiSearch: "",
    rikishiRankFilter: "all",
    rikishiSearch: "",
    kimariteCatFilter: "all",
    kimariteSearch: "",
    starredBouts: new Set(JSON.parse(localStorage.getItem("dohyo_starred_bouts") || "[]")),
    starredRikishi: new Set(JSON.parse(localStorage.getItem("dohyo_starred_rikishi") || "[]")),
    simulatedWinners: {}, // boutKey -> { side: 'East'|'West', kimariteId: string }
    boutsForCurrentSelection: []
  };

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

  async function syncWithLiveSumoApi() {
    const dot = document.getElementById("api-status-dot");
    const text = document.getElementById("api-status-text");
    const basho = DATA.bashoList.find((b) => b.id === state.selectedBashoId) || DATA.bashoList[0];
    const dateStr = getDayDateStr(basho, state.selectedDay);

    dot.classList.add("syncing");
    text.textContent = `Syncing sumo-api.com (${dateStr} • Day ${state.selectedDay})...`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const url = `https://sumo-api.com/api/basho/${basho.apiId}/torikumi/Makuuchi/${state.selectedDay}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (json && Array.isArray(json.torikumi) && json.torikumi.length > 0) {
        const curatedByBoutNo = new Map();
        if (state.selectedBashoId === "202611" && state.selectedDay === 9) {
          DATA.defaultTorikumi.forEach((b) => curatedByBoutNo.set(b.boutNo, b));
        }

        const mapped = json.torikumi.map((item, idx) => {
          const bno = item.matchNo || item.boutNo || idx + 1;
          const curated = curatedByBoutNo.get(bno);
          const eastMatch = resolveOrCreateRikishi(item.eastId, item.eastShikona, item.eastRank, "East");
          const westMatch = resolveOrCreateRikishi(item.westId, item.westShikona, item.westRank, "West");

          const totalMins = 16 * 60 + 15 + (bno - 1) * 5;
          const approxTime = `${Math.floor(totalMins / 60)}:${String(totalMins % 60).padStart(2, "0")}`;

          const winnerSide =
            item.winnerId && item.winnerId === item.eastId
              ? "East"
              : item.winnerId && item.winnerId === item.westId
              ? "West"
              : null;

          return {
            boutNo: bno,
            boutTitleEn: curated ? curated.boutTitleEn : `Bout #${bno}: ${eastMatch.romaji} vs. ${westMatch.romaji}`,
            boutTitleJp: curated ? curated.boutTitleJp : `幕内第${bno}番：${eastMatch.shikonaKanji} vs ${westMatch.shikonaKanji}`,
            approxTime: curated ? curated.approxTime : approxTime,
            isSanyaku: curated ? curated.isSanyaku : bno >= 15,
            stakesTagEn: curated ? curated.stakesTagEn : `${item.eastRank || eastMatch.rankEn} vs. ${item.westRank || westMatch.rankEn}`,
            stakesTagJp: curated ? curated.stakesTagJp : `${eastMatch.rankJp} vs ${westMatch.rankJp}`,
            eastId: eastMatch.id,
            westId: westMatch.id,
            h2hEast: curated ? curated.h2hEast : 3,
            h2hWest: curated ? curated.h2hWest : 2,
            lastMeetingEn: item.kimarite ? `Result: ${item.kimarite}` : curated ? curated.lastMeetingEn : `${dateStr} • Day ${state.selectedDay}`,
            lastMeetingJp: item.kimarite ? `決まり手：${item.kimarite}` : curated ? curated.lastMeetingJp : `${dateStr}（${state.selectedDay}日目）`,
            winnerSide,
            kimariteId: item.kimarite ? item.kimarite.toLowerCase() : null,
            storylineEn: curated ? curated.storylineEn : `${eastMatch.romaji} (${eastMatch.styleCode}) meets ${westMatch.romaji} (${westMatch.styleCode}) on Day ${state.selectedDay}.`,
            storylineJp: curated ? curated.storylineJp : `${eastMatch.shikonaKanji}と${westMatch.shikonaKanji}の対戦。`
          };
        });

        state.boutsForCurrentSelection = mapped;
        dot.classList.remove("syncing");
        text.textContent = `Live API Synced • ${dateStr} (${mapped.length} Makuuchi Bouts)`;
        renderTorikumiList();
        return;
      }
      throw new Error("Empty torikumi payload");
    } catch (err) {
      dot.classList.remove("syncing");
      text.textContent = `Offline-First Curated Dataset Active (${dateStr} • Day ${state.selectedDay})`;
      generateScheduleForDay(state.selectedDay);
      renderTorikumiList();
    }
  }

  /* ========================================================================
     Tab 1 Renderer: Torikumi Bout Cards
     ======================================================================== */
  function renderTorikumiList() {
    const container = document.getElementById("bout-list-container");
    const watchlistCountEl = document.getElementById("watchlist-count");
    const summaryEl = document.getElementById("bout-count-summary");
    const basho = DATA.bashoList.find((b) => b.id === state.selectedBashoId) || DATA.bashoList[0];
    const dateStr = getDayDateStr(basho, state.selectedDay);

    watchlistCountEl.textContent = state.starredBouts.size + state.starredRikishi.size;
    renderDenkoScoreboardPreview();

    const query = state.torikumiSearch.trim().toLowerCase();

    const filtered = state.boutsForCurrentSelection
      .filter((bout) => {
        const east = rikishiById.get(bout.eastId);
        const west = rikishiById.get(bout.westId);
        if (!east || !west) return false;

        const boutKey = `${state.selectedBashoId}-D${state.selectedDay}-B${bout.boutNo}`;
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
      .sort((a, b) => (state.boutOrder === "asc" ? a.boutNo - b.boutNo : b.boutNo - a.boutNo));

    summaryEl.textContent = `Showing ${filtered.length} of ${state.boutsForCurrentSelection.length} Makuuchi bouts (${dateStr} • Day ${state.selectedDay})`;

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
          state.torikumiFilter = "all";
          state.torikumiSearch = "";
          document.getElementById("torikumi-search").value = "";
          document.querySelectorAll("#torikumi-filter-pills .filter-pill").forEach((p) => {
            p.classList.toggle("active", p.getAttribute("data-filter") === "all");
          });
          renderTorikumiList();
        });
      }
      return;
    }

    container.innerHTML = filtered
      .map((bout) => {
        const east = rikishiById.get(bout.eastId);
        const west = rikishiById.get(bout.westId);
        const boutKey = `${state.selectedBashoId}-D${state.selectedDay}-B${bout.boutNo}`;
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

        return `
          <article class="bout-card ${isStarred ? "starred-bout" : ""}" id="bout-card-${bout.boutNo}">
            <!-- Top Metadata Bar -->
            <div class="bout-meta-bar">
              <div class="bout-num-group">
                <span class="bout-number-badge">#${bout.boutNo}</span>
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

              <!-- Interactive Quick Kanji & Match Outcome Controls -->
              <div class="bout-quick-actions">
                <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                  <button type="button" class="inspect-btn" data-inspect-rikishi="${east.id}">
                    🔍 Decode ${east.shikonaKanji} (${east.romaji})
                  </button>
                  <button type="button" class="inspect-btn" data-inspect-rikishi="${west.id}">
                    🔍 Decode ${west.shikonaKanji} (${west.romaji})
                  </button>
                </div>
                <div style="display:flex; gap:0.35rem; align-items:center; flex-wrap:wrap;">
                  <span style="font-size:0.7rem; color:var(--text-muted);">Mark Winner:</span>
                  <button type="button" class="inspect-btn" data-mark-winner="${boutKey}" data-side="East" data-move="${east.signatureMoves[0].toLowerCase()}">
                    ○ ${east.shikonaKanji}
                  </button>
                  <button type="button" class="inspect-btn" data-mark-winner="${boutKey}" data-side="West" data-move="${west.signatureMoves[0].toLowerCase()}">
                    ○ ${west.shikonaKanji}
                  </button>
                </div>
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

    const topBouts = state.boutsForCurrentSelection
      .slice()
      .sort((a, b) => b.boutNo - a.boutNo)
      .slice(0, 3);

    if (topBouts.length === 0) return;

    const rowsHtml = topBouts
      .map((bout, idx) => {
        const east = rikishiById.get(bout.eastId);
        const west = rikishiById.get(bout.westId);
        if (!east || !west) return "";

        const boutKey = `${state.selectedBashoId}-D${state.selectedDay}-B${bout.boutNo}`;
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
      });
    });

    // Basho Selector
    document.getElementById("basho-select").addEventListener("change", (e) => {
      state.selectedBashoId = e.target.value;
      generateScheduleForDay(state.selectedDay);
      renderTorikumiList();
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

    // Delegated clicks for Rikishi Inspector, Watchlist Stars, and Winner Markers
    document.body.addEventListener("click", (e) => {
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
        renderTorikumiList();
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
  }

  document.addEventListener("DOMContentLoaded", init);
})();
