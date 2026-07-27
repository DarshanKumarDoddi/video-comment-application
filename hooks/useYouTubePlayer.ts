import { useState, useRef, useCallback } from "react";

type PlayerState = "idle" | "ready" | "playing" | "paused" | "ended";

export function useYouTubePlayer() {
  const [playerState, setPlayerState] = useState<PlayerState>("idle");
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const playerRef = useRef<any>(null);

  const onReady = useCallback(() => {
    setPlayerState("ready");
  }, []);

  const onChangeState = useCallback((state: string) => {
    if (state === "playing") setPlayerState("playing");
    else if (state === "paused") setPlayerState("paused");
    else if (state === "ended") setPlayerState("ended");
    else if (state === "ready") setPlayerState("ready");
  }, []);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
  }, []);

  const getCurrentTime = useCallback(async (): Promise<number | null> => {
    try {
      const time = await playerRef.current?.getCurrentTime();
      setCurrentTime(time ?? null);
      return time ?? null;
    } catch {
      return null;
    }
  }, []);

  return {
    playerRef,
    playerState,
    currentTime,
    onReady,
    onChangeState,
    seekTo,
    getCurrentTime,
  };
}
