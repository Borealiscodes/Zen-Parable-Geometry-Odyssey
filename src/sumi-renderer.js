/**
 * src/sumi-renderer.js — Parallax Sumi-e Japanese Landscape & Geometric Puzzle Renderer (Ledger 2)
 * Zero-flicker steady parchment/mist gradient with parallax Mount Fuji, bamboo,
 * stone lanterns, interactive parable nodes, and vermilion Torii gate.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { fromQ16 } from "./core.js";
import { WORLD_W } from "./parable-kernel.js";

export function renderSumiWorld(ctx, state) {
  const { width, height } = ctx.canvas;
  const camX = fromQ16(state.cameraXQ16);

  // 1. Steady parchment & indigo dawn sky gradient (zero flicker)
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#1c2536");
  sky.addColorStop(0.55, "#3b4d63");
  sky.addColorStop(1, "#cbd5e1");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // 2. Distant Parallax Mount Fuji silhouette (0.18x parallax)
  const fujiX = 520 - camX * 0.18;
  ctx.fillStyle = "rgba(30, 41, 59, 0.55)";
  ctx.beginPath();
  ctx.moveTo(fujiX - 240, height - 60);
  ctx.lineTo(fujiX - 42, 118);
  ctx.lineTo(fujiX + 42, 118);
  ctx.lineTo(fujiX + 240, height - 60);
  ctx.closePath();
  ctx.fill();

  // Snow cap on Mount Fuji
  ctx.fillStyle = "rgba(248, 250, 252, 0.72)";
  ctx.beginPath();
  ctx.moveTo(fujiX - 42, 118);
  ctx.lineTo(fujiX + 42, 118);
  ctx.lineTo(fujiX + 74, 165);
  ctx.lineTo(fujiX + 24, 152);
  ctx.lineTo(fujiX, 170);
  ctx.lineTo(fujiX - 26, 150);
  ctx.lineTo(fujiX - 74, 165);
  ctx.closePath();
  ctx.fill();

  // 3. Midground Parallax Ink Hills & Bamboo Silhouettes (0.45x parallax)
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let sx = 0; sx <= width; sx += 24) {
    const wx = sx + camX * 0.45;
    const wy = height - 88 - Math.sin(wx * 0.008) * 18 - Math.cos(wx * 0.017) * 9;
    ctx.lineTo(sx, wy);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Bamboo stalks along midground
  ctx.strokeStyle = "rgba(15, 23, 42, 0.45)";
  ctx.lineWidth = 4;
  for (let b = 0; b < 8; b++) {
    const bx = ((b * 165 + 70) - camX * 0.55 + 1400) % 1100 - 60;
    ctx.beginPath();
    ctx.moveTo(bx, height - 55);
    ctx.lineTo(bx + Math.sin(state.tick * 0.015 + b) * 4, 80);
    ctx.stroke();
  }

  // 4. World-Space Foreground Ground & Parable Obstacles (1.0x camera)
  ctx.save();
  ctx.translate(-camX, 0);

  // Foreground ink earth path
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, height - 56, WORLD_W, 56);

  // Stage II: Flowing River & Floating Geometric Raft
  if (state.stageIndex === 1) {
    const { riverStartX, riverEndX } = state.stageDef;
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(riverStartX, height - 56, riverEndX - riverStartX, 56);

    // Animated water ripples
    ctx.strokeStyle = "#bae6fd";
    ctx.lineWidth = 1.5;
    for (let rx = riverStartX + 16; rx < riverEndX - 16; rx += 38) {
      const waveY = height - 42 + Math.sin(state.tick * 0.06 + rx * 0.05) * 3;
      ctx.beginPath();
      ctx.moveTo(rx, waveY);
      ctx.lineTo(rx + 18, waveY);
      ctx.stroke();
    }

    // Floating geometric raft
    const raftX = fromQ16(state.raftXQ16);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(raftX - 26, height - 64, 52, 10);
  }

  // Stage IV: Overflowing Stone Basin
  if (state.stageIndex === 3) {
    const basin = state.stageDef.nodes.at(0);
    ctx.fillStyle = "#475569";
    ctx.fillRect(basin.x - 32, basin.y + 18, 64, 24);

    // Water level inside basin (4 -> 0)
    if (state.cupLevel > 0) {
      ctx.fillStyle = "#38bdf8";
      const fillH = state.cupLevel * 5;
      ctx.fillRect(basin.x - 26, basin.y + 18 - fillH, 52, fillH);
    }

    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`Cup Level: ${state.cupLevel} / 4`, basin.x, basin.y - 26);
    ctx.textAlign = "left";
  }

  // Render Parable Nodes (Bells, Lanterns, Banners, Stones)
  for (const node of state.stageDef.nodes) {
    let drawY = node.y;
    if (node.kind === "WIND_BANNER" && !state.bannersAligned) {
      drawY += Math.sin(state.tick * 0.14 + node.phase * 2.1) * 14;
    }

    const isAlert = node.kind === "TWIN_BELL" && state.twinBellAlertTicks > 0;
    ctx.fillStyle = isAlert ? "#f87171" : state.gateOpen ? "#fde047" : "#fef3c7";
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(node.x, drawY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f8fafc";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(node.label, node.x, drawY - 20);
    ctx.textAlign = "left";
  }

  // Stage I Twin-Bell Mist Barrier warning
  if (state.stageIndex === 0 && state.twinBellAlertTicks > 0) {
    ctx.fillStyle = "rgba(248, 113, 113, 0.25)";
    ctx.fillRect(state.stageDef.gateX - 36, 40, 28, height - 96);
  }

  // Exit Vermilion Torii Gate
  const gx = state.stageDef.gateX;
  ctx.fillStyle = state.gateOpen ? "#ef4444" : "#7f1d1d";
  // Pillars
  ctx.fillRect(gx - 18, height - 156, 8, 100);
  ctx.fillRect(gx + 10, height - 156, 8, 100);
  // Top Kasagi lintel
  ctx.fillRect(gx - 28, height - 164, 56, 9);
  ctx.fillRect(gx - 22, height - 144, 44, 6);

  // Energy barrier across closed gate
  if (!state.gateOpen) {
    ctx.strokeStyle = "rgba(253, 224, 71, 0.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gx, height - 138);
    ctx.lineTo(gx, height - 56);
    ctx.stroke();
  }

  // Expanding Harmonic Chime Ring
  const pulseR = fromQ16(state.pulseRadiusQ16);
  if (pulseR > 0) {
    ctx.strokeStyle = "rgba(254, 249, 195, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(fromQ16(state.traveler.xQ16), fromQ16(state.traveler.yQ16), pulseR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Traveler 12-Segment Flowing Silk Scarf
  ctx.lineCap = "round";
  for (let i = 0; i < state.ribbon.length - 1; i++) {
    const a = state.ribbon.at(i);
    const b = state.ribbon.at(i + 1);
    const ratio = 1 - i / state.ribbon.length;
    ctx.strokeStyle = `rgba(253, 224, 71, ${0.3 + ratio * 0.7})`;
    ctx.lineWidth = 2 + ratio * 4.5;
    ctx.beginPath();
    ctx.moveTo(fromQ16(a.xQ16), fromQ16(a.yQ16));
    ctx.lineTo(fromQ16(b.xQ16), fromQ16(b.yQ16));
    ctx.stroke();
  }

  // Traveler Luminous Core
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(fromQ16(state.traveler.xQ16), fromQ16(state.traveler.yQ16), 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
