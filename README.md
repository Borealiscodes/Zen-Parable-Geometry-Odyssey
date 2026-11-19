# ⛩️ Zen Parable Geometry Odyssey (`v1.0.0`)

A zero-dependency, side-scrolling puzzle game translating classical Buddhist koans and teaching parables into deterministic `Q16.16` fixed-point geometric node puzzles against parallax *sumi-e* Japanese ink landscapes.

[![License: MIT](https://shields.io)](LICENSE)
[![Tests: 4/4 Passing](https://shields.io)](#-quickstart--verification)
[![Math: Q16.16 Fixed-Point](https://shields.io)](#-parable--puzzle-matrix)
[![Audio: 4-Layer Yo-Scale](https://shields.io)](#-release-v100-highlights)

---

## 🍵 What Are Koans & Parables? (A Brief Lesson)

Zen koans (e.g., *"What is the sound of one hand?"*) and teaching parables (such as the raft or the empty teacup) use paradox and everyday metaphors to bypass rigid, literal thinking. This game playfully inverts that concept by mapping those non-literal stories into exact `Q16.16` geometric gate puzzles.

> 📖 **Explore Deeper:** See [`docs/koan-interpretations-guide.md`](docs/koan-interpretations-guide.md) for philosophical analyses, or [`tiles/bill-nye-zen-parable-explainer.md`](tiles/bill-nye-zen-parable-explainer.md) for a plain-language mechanics breakdown.

---

## 🌟 Release v1.0.0 Highlights

* **Four Playable Parables (`4/4` Verified):** Interactive spatial puzzles for *The Sound of One Hand*, *The Raft & The Shore*, *Two Monks & The Flag*, and *The Empty Cup*.
* **Strict Dual-Ledger Architecture:** Deterministic 32-bit `Q16.16` math for physics and logic (`Ledger 1`) separated from read-only WebAudio and canvas rendering (`Ledger 2`).
* **Multi-Layer *Yo-Scale* Soundtrack:** Mute-by-default WebAudio synth in the traditional Japanese *Yo* pentatonic scale (`D4, E4, G4, A4, B4`), layering stems (*Shakuhachi → Koto → Taiko → Bonshō*) as stages complete.
* **Sumi-e Scenery:** Parallax Japanese ink aesthetics featuring Mount Fuji, bamboo groves, bronze *bonshō* bells, *tōrō* lanterns, and *tsukubai* basins.

---

## 🧩 Parable & Puzzle Matrix

| Stage | Classical Parable / Koan | Geometric Puzzle Mechanics | Audio Layer Unlocked |
| :--- | :--- | :--- | :--- |
| **1** | *The Sound of One Hand* *(Hakuin)* | Chiming twin *Bonshō* bells triggers a mist barrier; chiming the solitary *Tōrō* lantern parts the gate. | **Layer 1:** *Shakuhachi* flute drone |
| **2** | *The Raft & The Shore* *(MN 22)* | Board the wooden raft at the West Pier, then release it (`C`) on the East Bank so weight doesn't hold the gate. | **Layer 2:** Plucked *Koto* arpeggio |
| **3** | *Two Monks & The Flag* *(Mumonkan 29)* | Align three out-of-phase silk banners by chiming the central stillness stone (*Iwakura*). | **Layer 3:** *Taiko* heartbeat pulse |
| **4** | *The Empty Cup* *(Nan-in)* | Drain the overflowing *Tsukubai* basin from `4 / 4` to `0 / 4` using four release commands (`C`). | **Layer 4:** *Bonshō* temple bell overtones |

---

## 📁 Repository Structure

The project is organized with a zero-dependency ESM core, deterministic physics kernel, custom *sumi-e* renderer, and built-in test suite:
* `src/core.js`, `src/parables-data.js`, `src/parable-kernel.js`, `src/japanese-audio.js`, `src/sumi-renderer.js`, `src/parable-app.js`
* Documentation and tests under `docs/`, `tiles/`, and `test/parable-kernel.test.mjs`

---

## 🚀 Quickstart & Verification

```bash
# 1. Run deterministic test suite (4/4 passing)
node --test test/parable-kernel.test.mjs

# 2. Launch local development server
python3 -m http.server 8080
```

Open **`http://localhost:8080`**, toggle **`Sound: Muted`**, steer with `WASD` / touch, emit chimes with `Space`, and release rafts or empty basins using `C`.

---

## 🤝 Provenance & License

* **Architectural Lineage:** Built on deterministic `Q16.16` patterns from [`Borealiscodes/ndh-game-dev-kit`](https://github.com), [`Borealiscodes/Cosmic-Ballet-Traversal`](https://github.com), and [`Borealiscodes/Radial-Cosmology-Comic-Odyssey`](https://github.com).
* **Maintainer & License:** Borealis Serenity Hedling (`NDH-RESEARCH-PILOT` • County Dublin, Ireland) • MIT License.
