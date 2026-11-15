# Dohyō Guide (土俵ガイド) — Grand Sumo Bilingual Companion

**Dohyō Guide (土俵ガイド)** is a mobile-first, bilingual (English + Japanese) web application designed for in-person Grand Sumo (*Ōzumo*) attendance and tournament fans. Built with a traditional **Modern Banzuke & Woodblock** aesthetic, it lets spectators read the arena scoreboard (*denkō keijiban*), follow daily *Torikumi* match schedules, decode *Shikona* ring names character-by-character, and explore *Kimarite* winning techniques.

## Core Features

1. **Torikumi (取組 — Today's Matches & Storylines)**
   - **East (*Higashi* 東) vs. West (*Nishi* 西) Bout Cards**: Mirrors the arena's electric scoreboard with crimson East and indigo West sides, `<ruby>` furigana readings, Romaji, Rank, Stable (*Heya*), and current tournament record.
   - **Head-to-Head (顔合わせ) & Style Clash**: Visual H2H tally, previous meeting *kimarite*, and fighting style comparison (*Yotsu-zumo* belt grapplers vs. *Oshi-zumo* pusher-thrusters).
   - **Bilingual Match Insights (見どころ)**: Explains the storyline, stakes (*Kachi-koshi*, *Kinboshi*, *San'yaku* promotion), and family/stable rivalries behind every bout.
   - **Hybrid Live + Offline Engine**: Syncs live tournament data from `sumo-api.com` when online, with an instant offline-ready curated Makuuchi dataset so it works reliably inside packed arenas.

2. **Rikishi & Shikona Kanji Deep-Dive (力士名鑑・四股名漢字解説)**
   - **Character-by-Character Kanji Etymology**: Breaks down every wrestler's *Shikona* into individual kanji tiles with *On'yomi/Kun'yomi* readings, literal meanings, and stable naming traditions (e.g., why Isegahama wrestlers carry `富士` *Fuji*, why Sadogatake wrestlers carry `琴` *Koto*, how `大の里` *Ōnosato* links to Yokozuna Kisenosato, why `美ノ海` *Churanoumi* uses the Okinawan reading *Chura*, and why `翔猿` *Tobizaru* means "Flying Monkey").
   - Includes 26 top Makuuchi wrestlers with career *Yūshō*, *Sanshō* special prizes, *Kinboshi*, and bio notes.

3. **Kimarite Explorer (決まり手図鑑 — Winning Moves)**
   - Categorized guide to sumo winning moves (*Kihon-waza*, *Nage-waza*, *Kake-waza*, *Hineri-waza*, *Tokushu-waza*, and *Hi-waza*), complete with Makuuchi frequency percentages, compound kanji breakdowns, and active specialists.

4. **Live Venue & Ritual Companion (観戦・土俵儀礼ガイド)**
   - **Hour-by-Hour Arena Timeline**: From `08:30` *Ichiban-daiko* drums and lower divisions through `14:15` *Jūryō Dohyō-iri*, `15:40` *Makuuchi Dohyō-iri*, `15:55` *Yokozuna Dohyō-iri*, and `18:00` *Yumitori-shiki* bow-twirling.
   - **Interactive Kenshō-maku Prize Calculator**: Count the sponsor banners paraded before a bout to calculate total yen (¥70,000/banner), cash in the envelope on the referee's *gunbai* fan, and JSA retirement fund deposits.
   - **Gyōji Referee Tassel Rank Decoder & Arena Vocabulary**: Decode referee tassel colors (*Murasaki* purple, vermilion red, red-and-white, green-and-white) and essential calls (*Hakkeyoi! Nokotta!*, *Mono-ii*, *Matta*).

## Bilingual & Theme Modes

- **Bilingual Switcher**: Toggle instantly between `Dual 日/EN` (side-by-side Kanji + Furigana + English), `EN` (English focus), and `日本語` (Japanese banzuke focus).
- **Washi Light & Arena Dark Mode**: Switch between warm *Washi* paper mode (`#FAF6EE`) and low-glare **Arena Dark Mode** (`#111113`) for dim arena seating.

## Running Locally

No build step or external dependencies required. Serve the static directory with any HTTP server:

```bash
python3 -m http.server 8080
```
