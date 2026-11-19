> ### 🚧 UNDER CONSTRUCTION — ZEN PARABLE & GEOMETRIC OBSTACLE ODYSSEY (PRE-ALPHA)
> **Status:** Active Architectural Scaffolding & Parable-Puzzle Prototyping • Zero-Float `Q16.16` • Zero Dependencies  
> 
> **Design Scope:** A side-scrolling puzzle game pairing four classical Buddhist parables with deterministic `Q16.16` node mechanics, *sumi-e* ink landscapes, and a looped *Yo-scale* WebAudio soundtrack.

# ⛩️ Zen Parable Geometry Odyssey — Side-Scrolling Koan & Geometric Obstacle Adventure

An interactive, zero-dependency side-scrolling puzzle game featuring a traveler navigating Japanese ink landscapes, solving classical Buddhist parables through geometric node alignment, weight mechanics, and phase-locking while unlocking a multi-part WebAudio soundtrack.

[![License: MIT](https://shields.io)](LICENSE)
[![Status: Pre-Alpha Scaffolding](https://shields.io)](#-build-roadmap-v01--v10)
[![Math: Q16.16 Fixed-Point](https://shields.io)](#-four-core-parables--geometric-puzzles)
[![Audio: 4-Layer Yo-Scale Loop](https://shields.io)](#-multi-part-looped-japanese-soundtrack-ledger-2)

---

## 🪷 Philosophical & Design Clarity

* **Classical Parables & Geometry:** Translates stories from Zen and the Pāli Canon (*The Sound of One Hand*, *The Raft and the Shore*, *Two Monks and the Flag*, *The Empty Cup*) into spatial and harmonic puzzles.
* **Deterministic Architecture:** Uses signed 32-bit `Q16.16` fixed-point integers for game state (`Ledger 1`), while audio and visuals operate separately as read-only presentation (`Ledger 2`).
* **Calm Aesthetics:** Designed with steady *sumi-e* ink wash gradients and zero screen strobing.

---

## 🧩 Four Core Parables & Geometric Puzzles

| Stage | Classical Parable / Koan | Geometric Obstacle & Node Puzzle | Soundtrack Layer Unlocked |
| :--- | :--- | :--- | :--- |
| **1** | **The Sound of One Hand** *(Hakuin Ekaku)* | Twin resonance bells versus a solitary lantern node. Chiming the solitary lantern parts the mist gate. | **Layer 1:** *Shakuhachi* flute drone (`D4 – A4`). |
| **2** | **The Raft & The Shore** *(Majjhima Nikāya 22)* | Weight-shifting crossing; use `Release` (`Collapse`) to leave the raft behind on the far bank. | **Layer 2:** Plucked *Koto* arpeggio (`D – E – G – A – B`). |
| **3** | **Two Monks & The Flag** *(Mumonkan Case 29)* | Three out-of-phase silk banners synchronized via a chime at the Central Stillness Stone. | **Layer 3:** *Taiko* pulse (`D2 – A2`). |
| **4** | **The Empty Cup** *(Nan-in)* | An overflowing stone basin drained via Collapse (`C`) to open the summit torii gate. | **Layer 4:** *Bonshō* temple bell overtones (`D5 – A5`). |

---

## 🎵 Multi-Part Looped Japanese Soundtrack (`Ledger 2`)

Built using native WebAudio API oscillators tuned to the traditional Japanese ***Yo* pentatonic scale (`D – E – G – A – B`)**:
* **Mute-by-Default:** Browser audio unlocks cleanly on tap, stacking instruments (*Shakuhachi Flute → Koto Plucks → Taiko Pulse → Bonshō Bell*) as each stage is completed.

---

## 📁 Repository Scaffolding

```text
Zen-Parable-Geometry-Odyssey/
├── index.html                  # Viewport, parable scroll & operator controls
├── style.css                   # Sumi-e ink & warm parchment styling
├── package.json                # Zero-dependency ESM manifest
├── LICENSE                     # MIT License
├── README.md                   # Documentation
├── src/
│   ├── core.js                 # Zero-float Q16.16 math & PRNG
│   ├── parables-data.js        # Parables, narrative text & stage layouts
│   ├── parable-kernel.js       # Physics, ribbon, node triggers & gate logic
│   ├── japanese-audio.js       # 4-layer WebAudio Yo-scale soundtrack
│   ├── sumi-renderer.js        # Parallax Japanese scenery renderer
│   └── parable-app.js          # 60 Hz loop & input controls
└── test/
    └── parable-kernel.test.mjs # Verification test suite
```

---

## 🛠️ Build Roadmap (`v0.1` → `v1.0`)

* **`v0.1`:** Core `Q16.16` kernel, wind-glide physics, and parable puzzle state machines (`Ledger 1`).
* **`v0.2`:** Additive WebAudio synthesizer (`Ledger 2`).
* **`v0.3`:** *Sumi-e* parallax landscape renderer (`Ledger 2`).
* **`v1.0`:** Full 4-parable playthrough and test verification.

---

## 🤝 Provenance & License

* **Lineage:** Built on deterministic `Q16.16` architecture from [`Borealiscodes/ndh-game-dev-kit`](https://github.com), [`Borealiscodes/Cosmic-Ballet-Traversal`](https://github.com), and [`Borealiscodes/Radial-Cosmology-Comic-Odyssey`](https://github.com).
* **Author & License:** Borealis Serenity Hedling • MIT License.
