/**
 * src/parables-data.js — Four Classical Buddhist Parables & Geometric Node Layouts
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

export const PARABLE_STAGES = [
  {
    id: 1,
    slug: "one-hand",
    title: "Stage I: The Sound of One Hand (Hakuin Ekaku)",
    koan: "“Two hands clap and there is a sound; what is the sound of one hand?”",
    hint: "Two twin bells mirror each other and summon a mist wall. Chime only the solitary lantern on the upper ridge to part the gate.",
    unlockLabel: "Layer 1 Unlocked: Shakuhachi Bamboo Flute",
    gateX: 880,
    nodes: [
      { id: "twin-left", kind: "TWIN_BELL", x: 300, y: 290, label: "Twin Bell A" },
      { id: "twin-right", kind: "TWIN_BELL", x: 520, y: 290, label: "Twin Bell B" },
      { id: "solitary-lantern", kind: "SOLITARY_BELL", x: 410, y: 135, label: "Solitary Lantern" },
    ],
  },
  {
    id: 2,
    slug: "raft-shore",
    title: "Stage II: The Raft & The Shore (Majjhima Nikāya 22)",
    koan: "“A raft is for crossing over, not for carrying on your head once you reach the far bank.”",
    hint: "Chime at the West Pier to board the floating geometric raft across the river, then press Release (Collapse) on the East Bank so your weight does not sink the pressure bridge.",
    unlockLabel: "Layer 2 Unlocked: Plucked Koto Arpeggio",
    gateX: 900,
    riverStartX: 290,
    riverEndX: 610,
    nodes: [
      { id: "west-pier", kind: "RAFT_DOCK", x: 245, y: 310, label: "West Pier (Board Raft)" },
      { id: "east-shore", kind: "SHORE_STONE", x: 660, y: 310, label: "East Bank (Release Raft)" },
    ],
  },
  {
    id: 3,
    slug: "two-monks-flag",
    title: "Stage III: Two Monks & The Flag (Mumonkan Case 29)",
    koan: "“One monk said the wind moves; another said the flag moves. Huineng said: neither moves—mind moves.”",
    hint: "Three silk wind banners flutter out of phase, blocking the mountain pass. Chime at the Central Stillness Stone to synchronize all three banners into calm alignment.",
    unlockLabel: "Layer 3 Unlocked: Deep Taiko Pulse",
    gateX: 900,
    nodes: [
      { id: "banner-1", kind: "WIND_BANNER", x: 270, y: 170, phase: 0, label: "Banner I" },
      { id: "stillness-stone", kind: "STILLNESS_STONE", x: 450, y: 315, label: "Stillness Stone" },
      { id: "banner-2", kind: "WIND_BANNER", x: 450, y: 150, phase: 1, label: "Banner II" },
      { id: "banner-3", kind: "WIND_BANNER", x: 630, y: 170, phase: 2, label: "Banner III" },
    ],
  },
  {
    id: 4,
    slug: "empty-cup",
    title: "Stage IV: The Empty Cup (Nan-in)",
    koan: "“How can I show you Zen unless you first empty your cup?”",
    hint: "The shrine stone basin overflows at level 4/4. Approach the basin and press Release / Empty (Collapse) four times to drain it to 0/4 and open the summit torii gate.",
    unlockLabel: "Layer 4 Unlocked: Bonshō Temple Bell",
    gateX: 900,
    nodes: [
      { id: "stone-basin", kind: "OVERFLOW_BASIN", x: 460, y: 295, label: "Stone Basin" },
    ],
  },
];
