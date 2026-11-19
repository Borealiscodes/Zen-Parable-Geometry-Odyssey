import { fromQ16 } from "./core.js";
import { WORLD_W } from "./parable-kernel.js";

export function renderSumiWorld(ctx, state) {
  const { width, height } = ctx.canvas;
  const camX = fromQ16(state.cameraXQ16);

  // 1. Steady parchment & indigo dawn sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#1c2536");
  sky.addColorStop(0.55, "#3b4d63");
  sky.addColorStop(1, "#cbd5e1");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // 2. Distant Parallax Mount Fuji silhouette
  const fujiX = 520 - camX * 0.18;
  ctx.fillStyle = "rgba(30, 41, 59, 0.55)";
  ctx.beginPath();
  ctx.moveTo(fujiX - 240, height - 60);
  ctx.lineTo(fujiX - 42, 118);
  ctx.lineTo(fujiX + 42, 118);
  ctx.lineTo(fujiX + 240, height - 60);
  ctx.closePath();
  ctx.fill();

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

  // 3. Midground Parallax Ink Hills & Bamboo Silhouettes
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

  ctx.strokeStyle = "rgba(15, 23, 42, 0.45)";
  ctx.lineWidth = 4;
  for (let b = 0; b < 8; b++) {
    const bx = ((b * 165 + 70) - camX * 0.55 + 1400) % 1100 - 60;
    ctx.beginPath();
    ctx.moveTo(bx, height - 55);
    ctx.lineTo(bx + Math.sin(state.tick * 0.015 + b) * 4, 80);
    ctx.stroke();
  }

  // 4. World-Space Foreground Ground & Parable Obstacles
  ctx.save();
  ctx.translate(-camX, 0);

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, height - 56, WORLD_W, 56);

  // Stage II: Flowing River & Floating Geometric Raft
  if (state.stageIndex === 1) {
    const { riverStartX, riverEndX } = state.stageDef;
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(riverStartX, height - 56, riverEndX - riverStartX, 56);

    ctx.strokeStyle = "#bae6fd";
    ctx.lineWidth = 1.5;
    for (let rx = riverStartX + 16; rx < riverEndX - 16; rx += 38) {
      const waveY = height - 42 + Math.sin(state.tick * 0.06 + rx * 0.05) * 3;
      ctx.beginPath();
      ctx.moveTo(rx, waveY);
      ctx.lineTo(rx + 18, waveY);
      ctx.stroke();
    }

    const raftX = fromQ16(state.raftXQ16);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(raftX - 28, height - 66, 56, 11);
    ctx.strokeStyle = "#78350f";
    ctx.strokeRect(raftX - 28, height - 66, 56, 11);
  }

  // Render Distinct Japanese Assets for Every Parable Node
  for (const node of state.stageDef.nodes) {
    ctx.textAlign = "center";

    if (node.kind === "TWIN_BELL") {
      // Hanging Temple Bell (Bonshō) on wooden frame
      const isAlert = state.twinBellAlertTicks > 0;
      ctx.fillStyle = "#475569";
      ctx.fillRect(node.x - 20, node.y - 24, 4, 62);
      ctx.fillRect(node.x + 16, node.y - 24, 4, 62);
      ctx.fillRect(node.x - 24, node.y - 26, 48, 5);

      ctx.fillStyle = isAlert ? "#f87171" : "#d97706";
      ctx.beginPath();
      ctx.moveTo(node.x - 10, node.y - 18);
      ctx.lineTo(node.x + 10, node.y - 18);
      ctx.lineTo(node.x + 14, node.y + 12);
      ctx.lineTo(node.x - 14, node.y + 12);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillText(node.label, node.x, node.y - 34);
    } else if (node.kind === "SOLITARY_BELL") {
      // Glowing Stone Tōrō Lantern
      ctx.fillStyle = "#64748b";
      ctx.fillRect(node.x - 8, node.y + 10, 16, 18);
      ctx.fillRect(node.x - 14, node.y + 26, 28, 6);

      // Warm lantern paper window
      ctx.fillStyle = state.gateOpen ? "#fde047" : "#fef08a";
      ctx.fillRect(node.x - 9, node.y - 8, 18, 18);

      // Pagoda cap
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.moveTo(node.x - 18, node.y - 8);
      ctx.lineTo(node.x, node.y - 22);
      ctx.lineTo(node.x + 18, node.y - 8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#fde047";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText(node.label, node.x, node.y - 30);
    } else if (node.kind === "RAFT_DOCK" || node.kind === "SHORE_STONE") {
      // Wooden River Pier Pilings & Lantern Post
      ctx.fillStyle = "#78350f";
      ctx.fillRect(node.x - 22, node.y + 14, 44, 8);
      ctx.fillRect(node.x - 16, node.y + 22, 6, 52);
      ctx.fillRect(node.x + 10, node.y + 22, 6, 52);

      ctx.fillStyle = state.gateOpen ? "#fde047" : "#fef3c7";
      ctx.beginPath();
      ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillText(node.label, node.x, node.y - 18);
    } else if (node.kind === "WIND_BANNER") {
      // Wooden banner pole & flowing silk cloth
      ctx.fillStyle = "#475569";
      ctx.fillRect(node.x - 16, node.y - 20, 4, 86);
      ctx.fillRect(node.x - 16, node.y - 16, 34, 4);

      const flutter = state.bannersAligned
        ? Math.sin(state.tick * 0.03) * 3
        : Math.sin(state.tick * 0.16 + node.phase * 2.1) * 18;

      ctx.fillStyle = state.bannersAligned ? "#fde047" : "#93c5fd";
      ctx.beginPath();
      ctx.moveTo(node.x - 12, node.y - 12);
      ctx.lineTo(node.x + 14, node.y - 12);
      ctx.quadraticCurveTo(node.x + 14 + flutter, node.y + 22, node.x + 12 + flutter * 1.2, node.y + 52);
      ctx.lineTo(node.x - 12 + flutter * 0.8, node.y + 52);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillText(node.label, node.x, node.y - 28);
    } else if (node.kind === "STILLNESS_STONE") {
      // Carved Zen Standing Rock (Iwakura)
      ctx.fillStyle = state.bannersAligned ? "#fde047" : "#94a3b8";
      ctx.beginPath();
      ctx.moveTo(node.x - 18, node.y + 24);
      ctx.lineTo(node.x - 12, node.y - 16);
      ctx.lineTo(node.x + 4, node.y - 22);
      ctx.lineTo(node.x + 18, node.y + 24);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillText(node.label, node.x, node.y - 30);
    } else if (node.kind === "OVERFLOW_BASIN") {
      // Carved Tsukubai Stone Water Basin / Ceramic Tea Cup
      ctx.fillStyle = "#475569";
      ctx.beginPath();
      ctx.moveTo(node.x - 34, node.y + 4);
      ctx.lineTo(node.x + 34, node.y + 4);
      ctx.lineTo(node.x + 24, node.y + 38);
      ctx.lineTo(node.x - 24, node.y + 38);
      ctx.closePath();
      ctx.fill();

      // Water level inside basin (4 -> 0)
      if (state.cupLevel > 0) {
        ctx.fillStyle = "#38bdf8";
        const fillH = state.cupLevel * 6;
        ctx.fillRect(node.x - 28, node.y + 4 - fillH, 56, fillH);
      }

      // Cleanly separated stacked labels (zero overlap)
      ctx.fillStyle = "#f8fafc";
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillText(node.label, node.x, node.y - 44);

      ctx.fillStyle = "#fde047";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`Cup Level: ${state.cupLevel} / 4`, node.x, node.y - 28);
    }

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
  ctx.fillRect(gx - 18, height - 156, 8, 100);
  ctx.fillRect(gx + 10, height - 156, 8, 100);
  ctx.fillRect(gx - 28, height - 164, 56, 9);
  ctx.fillRect(gx - 22, height - 144, 44, 6);

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
