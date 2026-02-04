import { useState, useEffect, useCallback, useRef } from 'react';

interface UseExamTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  autoStart?: boolean;
  warningThreshold?: number; // in seconds, default 5 minutes
}

interface UseExamTimerReturn {
  timeRemaining: number;
  formattedTime: string;
  isRunning: boolean;
  isWarning: boolean;
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useExamTimer({
  duration,
  onTimeUp,
  autoStart = true,
  warningThreshold = 300, // 5 minutes
}: UseExamTimerProps): UseExamTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasTriggeredTimeUp = useRef(false);

  const formattedTime = useCallback(() => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  const progress = ((duration - timeRemaining) / duration) * 100;
  const isWarning = timeRemaining <= warningThreshold;

  const start = useCallback(() => {
    if (!isRunning && timeRemaining > 0) {
      setIsRunning(true);
    }
  }, [isRunning, timeRemaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (timeRemaining > 0) {
      setIsRunning(true);
    }
  }, [timeRemaining]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (!hasTriggeredTimeUp.current) {
              hasTriggeredTimeUp.current = true;
              onTimeUp();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUp]);

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart, start]);

  return {
    timeRemaining,
    formattedTime: formattedTime(),
    isRunning,
    isWarning,
    progress,
    start,
    pause,
    resume,
    stop,
  };
}
