"use client";

import { useState, useEffect } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import CountdownView from "@/components/CountdownView";

export default function Home() {
  const [now, setNow] = useState(() => new Date());
  const countdown = useCountdown();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden">
      <CountdownView
        now={now}
        durationSeconds={countdown.durationSeconds}
        remaining={countdown.remaining}
        status={countdown.status}
        onSetDuration={countdown.setDuration}
        onStart={countdown.start}
        onPause={countdown.pause}
        onReset={countdown.reset}
        onDismiss={countdown.dismiss}
      />
    </main>
  );
}
