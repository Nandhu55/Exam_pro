import { useState, useEffect, useCallback, useRef } from 'react';
import type { ProctorEventType } from '@/types';

interface ProctoringConfig {
  enabled: boolean;
  fullscreenEnforcement: boolean;
  tabSwitchDetection: boolean;
  copyPastePrevention: boolean;
  rightClickPrevention: boolean;
  webcamCapture: boolean;
  webcamInterval: number;
}

interface ProctoringEvent {
  type: ProctorEventType;
  timestamp: Date;
  details?: string;
}

interface UseProctoringReturn {
  events: ProctoringEvent[];
  warnings: number;
  isFullscreen: boolean;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  captureScreenshot: () => Promise<string | null>;
  startProctoring: () => void;
  stopProctoring: () => void;
}

export function useProctoring(
  config: ProctoringConfig,
  onEvent?: (event: ProctoringEvent) => void
): UseProctoringReturn {
  const [events, setEvents] = useState<ProctoringEvent[]>([]);
  const [warnings, setWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addEvent = useCallback((type: ProctorEventType, details?: string) => {
    const event: ProctoringEvent = {
      type,
      timestamp: new Date(),
      details,
    };
    setEvents(prev => [...prev, event]);
    if (onEvent) onEvent(event);
    
    // Increment warnings for certain events
    if (['tab_switch', 'fullscreen_exit', 'copy_paste', 'multiple_faces'].includes(type)) {
      setWarnings(prev => prev + 1);
    }
  }, [onEvent]);

  // Fullscreen handling
  const requestFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error('Fullscreen request failed:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Exit fullscreen failed:', error);
    }
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    if (!config.enabled || !config.fullscreenEnforcement) return;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen && document.hasFocus()) {
        addEvent('fullscreen_exit', 'User exited fullscreen mode');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [config.enabled, config.fullscreenEnforcement, addEvent]);

  // Tab visibility detection
  useEffect(() => {
    if (!config.enabled || !config.tabSwitchDetection) return;

    let hiddenTime: number | null = null;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTime = Date.now();
        addEvent('tab_switch', 'User switched to another tab/window');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [config.enabled, config.tabSwitchDetection, addEvent]);

  // Copy/paste prevention
  useEffect(() => {
    if (!config.enabled || !config.copyPastePrevention) return;

    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      addEvent('copy_paste', `Attempted ${e.type}`);
      return false;
    };

    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);

    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
    };
  }, [config.enabled, config.copyPastePrevention, addEvent]);

  // Right-click prevention
  useEffect(() => {
    if (!config.enabled || !config.rightClickPrevention) return;

    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      addEvent('right_click', 'Right-click attempted');
      return false;
    };

    document.addEventListener('contextmenu', preventRightClick);
    return () => document.removeEventListener('contextmenu', preventRightClick);
  }, [config.enabled, config.rightClickPrevention, addEvent]);

  // Keyboard shortcuts prevention
  useEffect(() => {
    if (!config.enabled) return;

    const preventShortcuts = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', preventShortcuts);
    return () => document.removeEventListener('keydown', preventShortcuts);
  }, [config.enabled]);

  // Webcam capture
  const captureScreenshot = useCallback(async (): Promise<string | null> => {
    if (!webcamRef.current || !streamRef.current) return null;

    try {
      const video = webcamRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8);
      }
    } catch (error) {
      console.error('Screenshot capture failed:', error);
    }
    return null;
  }, []);

  // Initialize webcam
  useEffect(() => {
    if (!config.enabled || !config.webcamCapture) return;

    const initWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 },
          audio: false 
        });
        streamRef.current = stream;
        
        // Create hidden video element for captures
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        webcamRef.current = video;
      } catch (error) {
        console.error('Webcam access denied:', error);
        addEvent('webcam_violation', 'Webcam access denied or not available');
      }
    };

    initWebcam();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [config.enabled, config.webcamCapture, addEvent]);

  // Periodic webcam capture
  useEffect(() => {
    if (!config.enabled || !config.webcamCapture || !config.webcamInterval) return;

    const interval = setInterval(() => {
      captureScreenshot();
      // In real implementation, send to server
    }, config.webcamInterval * 1000);

    return () => clearInterval(interval);
  }, [config.enabled, config.webcamCapture, config.webcamInterval, captureScreenshot]);

  const startProctoring = useCallback(() => {
    if (config.fullscreenEnforcement) {
      requestFullscreen();
    }
    setEvents([]);
    setWarnings(0);
  }, [config.fullscreenEnforcement, requestFullscreen]);

  const stopProctoring = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    exitFullscreen();
  }, [exitFullscreen]);

  return {
    events,
    warnings,
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
    captureScreenshot,
    startProctoring,
    stopProctoring,
  };
}
