export function playChime(type: "break" | "wrapup") {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    const notes =
      type === "break"
        ? [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6 — 밝은 화음
        : [392.0, 493.88, 587.33, 392.0]; // G4 B4 D5 G4 — 마무리 화음

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.25);

      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.25);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.25 + 0.05);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + i * 0.25 + 0.8
      );

      osc.start(ctx.currentTime + i * 0.25);
      osc.stop(ctx.currentTime + i * 0.25 + 0.9);
    });
  } catch {
    // audio not available
  }
}
