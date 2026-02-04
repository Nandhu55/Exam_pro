import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useProctoring } from '@/hooks/useProctoring';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function ExamLayout() {
  const { user } = useAuth();

  const handleProctorEvent = (event: any) => {
    console.log('Proctor event:', event);
    
    switch (event.type) {
      case 'tab_switch':
        toast.warning('Warning: Tab switching detected!', {
          description: 'Please stay on the exam page.',
          duration: 5000,
        });
        break;
      case 'fullscreen_exit':
        toast.warning('Warning: Fullscreen mode exited!', {
          description: 'Please return to fullscreen mode.',
          duration: 5000,
        });
        break;
      case 'copy_paste':
        toast.error('Copy/Paste is not allowed during the exam!', {
          duration: 3000,
        });
        break;
      case 'right_click':
        toast.error('Right-click is disabled during the exam!', {
          duration: 2000,
        });
        break;
    }
  };

  const { 
    isFullscreen, 
    requestFullscreen, 
    startProctoring, 
    stopProctoring,
    warnings 
  } = useProctoring({
    enabled: true,
    fullscreenEnforcement: true,
    tabSwitchDetection: true,
    copyPastePrevention: true,
    rightClickPrevention: true,
    webcamCapture: false,
    webcamInterval: 30,
  }, handleProctorEvent);

  useEffect(() => {
    // Start proctoring when exam starts
    startProctoring();

    // Warn before leaving
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your exam progress may be lost.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      stopProctoring();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [startProctoring, stopProctoring]);

  useEffect(() => {
    if (warnings >= 3) {
      toast.error('Multiple violations detected! Your exam may be terminated.', {
        duration: 10000,
      });
    }
  }, [warnings]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Proctoring Warning Bar */}
      {!isFullscreen && (
        <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white px-4 py-2 z-50 flex items-center justify-between">
          <span className="font-medium">⚠️ Please enable fullscreen mode for the exam</span>
          <button
            onClick={requestFullscreen}
            className="px-4 py-1 bg-white text-amber-600 rounded font-medium text-sm hover:bg-amber-50 transition-colors"
          >
            Enter Fullscreen
          </button>
        </div>
      )}

      {/* Warning Count */}
      {warnings > 0 && (
        <div className={`fixed top-${!isFullscreen ? '12' : '0'} left-0 right-0 px-4 py-2 z-40 flex justify-center`}>
          <div className={`px-4 py-2 rounded-lg font-medium text-sm ${
            warnings >= 3 ? 'bg-red-500 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            Warnings: {warnings}/5
          </div>
        </div>
      )}

      {/* Exam Content */}
      <div className={!isFullscreen ? 'pt-12' : ''}>
        <Outlet />
      </div>
    </div>
  );
}
