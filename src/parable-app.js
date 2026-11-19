/**
 * src/parable-app.js — Side-Scrolling Parable Odyssey Loop & Controls
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { toQ16, fromQ16 } from "./core.js";
import { PARABLE_STAGES } from "./parables-data.js";
import {
  VIEW_W,
  VIEW_H,
  createParableGameState,
  triggerParableChime,
  triggerReleaseCollapse,
  stepParableFrame,
} from "./parable-kernel.js";
import { createJapaneseYoAudio } from "./japanese-audio.js";
import { renderSumiWorld } from "./sumi-renderer.js";

const FIXED_DT_MS = 1000 / 60;

function initParableOdyssey() {
  const canvas = document.getElementById("parable-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const audio = createJapaneseYoAudio();

  const titleEl = document.getElementById("parable-title");
  const koanEl = document.getElementById("parable-koan");
  const hintEl = document.getElementById("parable-hint");
  const layersEl = document.getElementById("hud-layers");
  const audioBtn = document.getElementById("btn-audio");

  let state = createParableGameState(0, 1);
  let pointerTarget = null;
  const keys = new Set();

  const syncScrollHud = () => {
    const def = state.stageDef;
    if (titleEl) titleEl.textContent = def.title;
    if (koanEl) koanEl.textContent = def.koan;
    if (hintEl) {
      hintEl.textContent = state.gateOpen
        ? `Torii Gate Open! Glide right through the vermilion gate (${def.unlockLabel}).`
        : def.hint;
    }
    if (layersEl) layersEl.textContent = `Yo-Scale Layers: ${state.unlockedLayers} / 4`;
    audio.setLayers(state.unlockedLayers);
  };

  syncScrollHud();

  // Touch / Pointer steering (converts screen tap into world coordinates via cameraX)
  canvas?.addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const screenX = ((ev.clientX - rect.left) / rect.width) * VIEW_W;
    const screenY = ((ev.clientY - rect.top) / rect.height) * VIEW_H;
    pointerTarget = { x: screenX + fromQ16(state.cameraXQ16), y: screenY };
  });

  canvas?.addEventListener("pointermove", (ev) => {
    if (!pointerTarget) return;
    const rect = canvas.getBoundingClientRect();
    const screenX = ((ev.clientX - rect.left) / rect.width) * VIEW_W;
    const screenY = ((ev.clientY - rect.top) / rect.height) * VIEW_H;
    pointerTarget = { x: screenX + fromQ16(state.cameraXQ16), y: screenY };
  });

  window.addEventListener("pointerup", () => {
    pointerTarget = null;
  });

  window.addEventListener("keydown", (ev) => {
    keys.add(ev.key.toLowerCase());
    if (ev.key === " ") {
      ev.preventDefault();
      state = triggerParableChime(state);
      audio.playChime();
      syncScrollHud();
    } else if (ev.key.toLowerCase() === "c" || ev.key.toLowerCase() === "e") {
      state = triggerReleaseCollapse(state);
      audio.playChime();
      syncScrollHud();
    }
  });

  window.addEventListener("keyup", (ev) => {
    keys.delete(ev.key.toLowerCase());
  });

  document.getElementById("btn-chime")?.addEventListener("click", () => {
    state = triggerParableChime(state);
    audio.playChime();
    syncScrollHud();
  });

  document.getElementById("btn-collapse")?.addEventListener("click", () => {
    state = triggerReleaseCollapse(state);
    audio.playChime();
    syncScrollHud();
  });

  document.querySelectorAll("[data-stage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-stage")) || 0;
      state = createParableGameState(idx, state.unlockedLayers);
      syncScrollHud();
    });
  });

  audioBtn?.addEventListener("click", () => {
    const muted = audio.toggleMute();
    audioBtn.textContent = muted ? "Sound: Muted" : "Sound: Yo-Scale Loop (On)";
  });

  let lastTime = performance.now();
  let accumulator = 0;

  function loop(now) {
    accumulator += Math.min(100, now - lastTime);
    lastTime = now;

    while (accumulator >= FIXED_DT_MS) {
      let ax = 0;
      let ay = 0;

      if (keys.has("arrowleft") || keys.has("a")) ax -= 460;
      if (keys.has("arrowright") || keys.has("d")) ax += 460;
      if (keys.has("arrowup") || keys.has("w")) ay -= 460;
      if (keys.has("arrowdown") || keys.has("s")) ay += 460;

      if (pointerTarget) {
        const dx = pointerTarget.x - fromQ16(state.traveler.xQ16);
        const dy = pointerTarget.y - fromQ16(state.traveler.yQ16);
        ax += Math.max(-540, Math.min(540, dx * 4.5));
        ay += Math.max(-540, Math.min(540, dy * 4.5));
      }

      state = stepParableFrame(state, toQ16(ax), toQ16(ay));

      // Automatically advance to next parable stage upon crossing through the open Torii gate
      if (state.stageCompleted) {
        const nextStage = (state.stageIndex + 1) % PARABLE_STAGES.length;
        state = createParableGameState(nextStage, state.unlockedLayers);
        audio.playChime();
        syncScrollHud();
      }

      accumulator -= FIXED_DT_MS;
    }

    if (ctx) renderSumiWorld(ctx, state);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", initParableOdyssey);
