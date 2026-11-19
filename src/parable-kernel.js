/**
 * src/parable-kernel.js — Side-Scrolling Q16.16 Physics & 4 Parable State Machines (Ledger 1)
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { toQ16, fromQ16, qAdd, qSub, qMul } from "./core.js";
import { PARABLE_STAGES } from "./parables-data.js";

export const VIEW_W = 680;
export const VIEW_H = 440;
export const WORLD_W = 1040;

export function createParableGameState(stageIndex = 0, unlockedLayers = 1) {
  const idx = Math.max(0, Math.min(PARABLE_STAGES.length - 1, stageIndex | 0));
  const stageDef = PARABLE_STAGES.at(idx);

  const startX = toQ16(110);
  const startY = toQ16(275);

  const ribbon = Array.from({ length: 12 }, (_, i) => ({
    xQ16: qSub(startX, toQ16(i * 5)),
    yQ16: startY,
    oldXQ16: qSub(startX, toQ16(i * 5)),
    oldYQ16: startY,
  }));

  return {
    tick: 0,
    stageIndex: idx,
    stageDef,
    unlockedLayers: Math.max(1, Math.min(4, unlockedLayers | 0)),
    traveler: {
      xQ16: startX,
      yQ16: startY,
      vxQ16: 0,
      vyQ16: 0,
    },
    cameraXQ16: 0,
    ribbon,
    pulseRadiusQ16: 0,
    // Parable-specific state flags
    twinBellAlertTicks: 0,
    carryingRaft: false,
    raftXQ16: toQ16(295),
    bannersAligned: false,
    cupLevel: idx === 3 ? 4 : 0, // Stage IV starts full (4/4)
    gateOpen: false,
    stageCompleted: false,
  };
}

/**
 * Emit a harmonic chime at the traveler's current position (solves proximity triggers).
 */
export function triggerParableChime(state) {
  const tx = fromQ16(state.traveler.xQ16);
  const ty = fromQ16(state.traveler.yQ16);
  let next = { ...state, pulseRadiusQ16: toQ16(14) };

  // Stage I: The Sound of One Hand
  if (state.stageIndex === 0) {
    for (const node of state.stageDef.nodes) {
      const dist = Math.hypot(tx - node.x, ty - node.y);
      if (dist < 64) {
        if (node.kind === "TWIN_BELL") {
          next.twinBellAlertTicks = 90;
          next.gateOpen = false;
        } else if (node.kind === "SOLITARY_BELL" && next.twinBellAlertTicks === 0) {
          next.gateOpen = true;
        }
      }
    }
  }

  // Stage II: The Raft & The Shore (Chime boards the raft at West Pier)
  if (state.stageIndex === 1) {
    const west = state.stageDef.nodes.at(0);
    if (Math.hypot(tx - west.x, ty - west.y) < 68) {
      next.carryingRaft = true;
    }
  }

  // Stage III: Two Monks & The Flag (Chime at Central Stillness Stone synchronizes banners)
  if (state.stageIndex === 2) {
    const stone = state.stageDef.nodes.find((n) => n.kind === "STILLNESS_STONE");
    if (stone && Math.hypot(tx - stone.x, ty - stone.y) < 68) {
      next.bannersAligned = true;
      next.gateOpen = true;
    }
  }

  // Stage IV: The Empty Cup (Chiming pours more tea into an already full cup; Collapse empties it)
  if (state.stageIndex === 3) {
    const basin = state.stageDef.nodes.at(0);
    if (Math.hypot(tx - basin.x, ty - basin.y) < 75) {
      next.cupLevel = Math.min(4, next.cupLevel + 1);
      next.gateOpen = next.cupLevel === 0;
    }
  }

  return next;
}

/**
 * Apply Release / Collapse (C) operator:
 * - Stage II: Releases the raft on the East Shore so the pressure-plate bridge holds
 * - Stage IV: Empties one measure from the overflowing stone cup (4 -> 0)
 */
export function triggerReleaseCollapse(state) {
  const tx = fromQ16(state.traveler.xQ16);
  const ty = fromQ16(state.traveler.yQ16);
  let next = { ...state, pulseRadiusQ16: toQ16(10) };

  if (state.stageIndex === 1 && state.carryingRaft) {
    // Only allow releasing once across the river on the East Shore
    if (tx >= state.stageDef.riverEndX - 10) {
      next.carryingRaft = false;
      next.gateOpen = true;
    }
  }

  if (state.stageIndex === 3) {
    const basin = state.stageDef.nodes.at(0);
    if (Math.hypot(tx - basin.x, ty - basin.y) < 85 && next.cupLevel > 0) {
      next.cupLevel = Math.max(0, next.cupLevel - 1);
      if (next.cupLevel === 0) {
        next.gateOpen = true;
      }
    }
  }

  return next;
}

export function stepParableFrame(state, accelXQ16 = 0, accelYQ16 = 0) {
  const tick = state.tick + 1;
  const dtQ16 = toQ16(1.0 / 60.0);
  const dampQ16 = toQ16(0.92);

  let vx = qMul(qAdd(state.traveler.vxQ16, qMul(accelXQ16, dtQ16)), dampQ16);
  let vy = qMul(qAdd(state.traveler.vyQ16, qMul(accelYQ16, dtQ16)), dampQ16);

  // Stage III crosswind pushback if banners are not yet aligned
  if (state.stageIndex === 2 && !state.bannersAligned && fromQ16(state.traveler.xQ16) > 360) {
    vx = qSub(vx, toQ16(14));
  }

  let x = qAdd(state.traveler.xQ16, qMul(vx, dtQ16));
  let y = qAdd(state.traveler.yQ16, qMul(vy, dtQ16));

  let fx = fromQ16(x);
  let fy = fromQ16(y);

  // Arena bounds
  fx = Math.max(36, Math.min(WORLD_W - 40, fx));
  fy = Math.max(55, Math.min(VIEW_H - 65, fy));

  // Stage II river crossing barrier unless riding the raft
  if (state.stageIndex === 1) {
    const { riverStartX, riverEndX } = state.stageDef;
    if (fx > riverStartX && fx < riverEndX && !state.carryingRaft) {
      fx = riverStartX;
      vx = 0;
    }
  }

  // Torii gate barrier until puzzle is solved
  const gateX = state.stageDef.gateX;
  if (!state.gateOpen && fx > gateX - 18) {
    fx = gateX - 18;
    vx = 0;
  }

  x = toQ16(fx);
  y = toQ16(fy);

  // Smooth side-scrolling camera follow
  const targetCam = Math.max(0, Math.min(WORLD_W - VIEW_W, fx - VIEW_W * 0.38));
  const curCam = fromQ16(state.cameraXQ16);
  const cameraXQ16 = toQ16(curCam + (targetCam - curCam) * 0.12);

  // Update 12-segment Verlet traveler scarf
  const nextRibbon = state.ribbon.map((seg) => ({ ...seg }));
  nextRibbon.at(0).xQ16 = x;
  nextRibbon.at(0).yQ16 = y;
  const restLen = 5.0;
  const segDamp = toQ16(0.84);

  for (let i = 1; i < nextRibbon.length; i++) {
    const cur = nextRibbon.at(i);
    const prev = nextRibbon.at(i - 1);
    const svx = qMul(qSub(cur.xQ16, cur.oldXQ16), segDamp);
    const svy = qMul(qSub(cur.yQ16, cur.oldYQ16), segDamp);
    cur.oldXQ16 = cur.xQ16;
    cur.oldYQ16 = cur.yQ16;
    cur.xQ16 = qAdd(cur.xQ16, svx);
    cur.yQ16 = qAdd(cur.yQ16, svy);

    const dx = fromQ16(qSub(cur.xQ16, prev.xQ16));
    const dy = fromQ16(qSub(cur.yQ16, prev.yQ16));
    const dist = Math.hypot(dx, dy);
    if (dist > restLen && dist > 0.001) {
      const ratio = (dist - restLen) / dist;
      cur.xQ16 = qSub(cur.xQ16, toQ16(dx * ratio));
      cur.yQ16 = qSub(cur.yQ16, toQ16(dy * ratio));
    }
  }

  const nextPulse =
    state.pulseRadiusQ16 > 0 && state.pulseRadiusQ16 < toQ16(110)
      ? qAdd(state.pulseRadiusQ16, toQ16(4.5))
      : 0;

  const twinBellAlertTicks = Math.max(0, state.twinBellAlertTicks - 1);
  const raftXQ16 = state.carryingRaft ? x : state.raftXQ16;

  // Crossing through the open Torii gate completes the parable stage
  const stageCompleted = state.gateOpen && fx >= gateX + 24;
  const unlockedLayers = stageCompleted
    ? Math.min(4, Math.max(state.unlockedLayers, state.stageIndex + 2))
    : state.unlockedLayers;

  return {
    ...state,
    tick,
    traveler: { xQ16: x, yQ16: y, vxQ16: vx, vyQ16: vy },
    cameraXQ16,
    ribbon: nextRibbon,
    pulseRadiusQ16: nextPulse,
    twinBellAlertTicks,
    raftXQ16,
    stageCompleted,
    unlockedLayers,
  };
}
