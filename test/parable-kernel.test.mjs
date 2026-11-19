/**
 * test/parable-kernel.test.mjs — Verification of All 4 Buddhist Parable Puzzles
 * Run: node --test test/parable-kernel.test.mjs
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import test from "node:test";
import assert from "node:assert/strict";

import { toQ16 } from "../src/core.js";
import {
  createParableGameState,
  triggerParableChime,
  triggerReleaseCollapse,
  stepParableFrame,
} from "../src/parable-kernel.js";

test("1. Stage I (Sound of One Hand): Solitary Lantern opens gate; Twin Bells block", () => {
  let s = createParableGameState(0);
  // Move to Twin Bell A (300, 290) and chime -> triggers alert, keeps gate closed
  s.traveler.xQ16 = toQ16(300);
  s.traveler.yQ16 = toQ16(290);
  s = triggerParableChime(s);
  assert.equal(s.gateOpen, false);
  assert.ok(s.twinBellAlertTicks > 0);

  // Let alert expire, move to Solitary Lantern (410, 135) and chime -> opens gate
  s.twinBellAlertTicks = 0;
  s.traveler.xQ16 = toQ16(410);
  s.traveler.yQ16 = toQ16(135);
  s = triggerParableChime(s);
  assert.equal(s.gateOpen, true);
});

test("2. Stage II (Raft & Shore): Board raft at West Pier and release on East Bank", () => {
  let s = createParableGameState(1);
  s.traveler.xQ16 = toQ16(245);
  s.traveler.yQ16 = toQ16(310);
  s = triggerParableChime(s);
  assert.equal(s.carryingRaft, true);

  // Move across river to East Bank (660, 310) and release raft
  s.traveler.xQ16 = toQ16(660);
  s = triggerReleaseCollapse(s);
  assert.equal(s.carryingRaft, false);
  assert.equal(s.gateOpen, true);
});

test("3. Stage III (Two Monks & Flag): Stillness Stone aligns banners and stops wind pushback", () => {
  let s = createParableGameState(2);
  s.traveler.xQ16 = toQ16(450);
  s.traveler.yQ16 = toQ16(315);
  s = triggerParableChime(s);
  assert.equal(s.bannersAligned, true);
  assert.equal(s.gateOpen, true);
});

test("4. Stage IV (The Empty Cup): Draining basin from 4/4 to 0/4 opens summit Torii gate", () => {
  let s = createParableGameState(3);
  assert.equal(s.cupLevel, 4);
  s.traveler.xQ16 = toQ16(460);
  s.traveler.yQ16 = toQ16(295);

  for (let i = 0; i < 4; i++) {
    s = triggerReleaseCollapse(s);
  }
  assert.equal(s.cupLevel, 0);
  assert.equal(s.gateOpen, true);

  // Glide through open Torii gate (gateX = 900 -> 930) to complete stage
  s.traveler.xQ16 = toQ16(930);
  s = stepParableFrame(s, 0, 0);
  assert.equal(s.stageCompleted, true);
  assert.equal(s.unlockedLayers, 4);
});
