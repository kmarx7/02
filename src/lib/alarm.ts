let alarmIntervalId: ReturnType<typeof setInterval> | null = null;
let alarmCtx: AudioContext | null = null;

function beep(ctx: AudioContext, startTime: number) {
  const freq = [880, 1100, 880, 1100];
  freq.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(f, startTime + i * 0.15);
    gain.gain.setValueAtTime(0, startTime + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.2, startTime + i * 0.15 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.15 + 0.13);
    osc.start(startTime + i * 0.15);
    osc.stop(startTime + i * 0.15 + 0.15);
  });
}

export function startAlarm() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    alarmCtx = new AudioCtx();
    const ctx = alarmCtx;

    const play = () => beep(ctx, ctx.currentTime);
    play();
    alarmIntervalId = setInterval(play, 2000);
  } catch {
    // audio not available
  }
}

export function stopAlarm() {
  if (alarmIntervalId !== null) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
  if (alarmCtx) {
    alarmCtx.close().catch(() => {});
    alarmCtx = null;
  }
}

export function playChime(type: "break" | "wrapup") {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes =
      type === "break"
        ? [523.25, 659.25, 783.99, 1046.5]
        : [392.0, 493.88, 587.33, 392.0];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.25);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.25);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.25 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 0.8);
      osc.start(ctx.currentTime + i * 0.25);
      osc.stop(ctx.currentTime + i * 0.25 + 0.9);
    });
  } catch {
    // audio not available
  }
}
