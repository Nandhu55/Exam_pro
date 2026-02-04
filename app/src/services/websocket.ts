import type { ChatMessage, ProctorEventType, LiveExamSession } from '@/types';

// Mock WebSocket service for real-time features
type WebSocketEventHandler = (data: any) => void;

class WebSocketService {
  private listeners: Map<string, WebSocketEventHandler[]> = new Map();
  private isConnected = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private mockInterval: ReturnType<typeof setInterval> | null = null;

  // Simulated live sessions
  private liveSessions: Map<string, LiveExamSession> = new Map();

  connect(): void {
    if (this.isConnected) return;
    
    console.log('WebSocket connected');
    this.isConnected = true;
    this.startMockUpdates();
    this.emit('connected', {});
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
    }
    console.log('WebSocket disconnected');
  }

  private startMockUpdates(): void {
    // Simulate periodic updates for live exams
    this.mockInterval = setInterval(() => {
      // Update time remaining for live sessions
      this.liveSessions.forEach((session, attemptId) => {
        if (session.status === 'active' && session.timeRemaining > 0) {
          session.timeRemaining -= 1;
          this.emit('time-update', { attemptId, timeRemaining: session.timeRemaining });
        }
      });
    }, 1000);
  }

  on(event: string, handler: WebSocketEventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  off(event: string, handler: WebSocketEventHandler): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(event: string, data: any): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  // Exam-related events
  joinExam(examId: string, attemptId: string, studentInfo: { id: string; name: string }): void {
    console.log(`Student ${studentInfo.name} joined exam ${examId}`);
    
    const session: LiveExamSession = {
      attemptId,
      studentId: studentInfo.id,
      studentName: studentInfo.name,
      examId,
      examTitle: 'Active Exam',
      startedAt: new Date().toISOString(),
      timeRemaining: 3600,
      currentQuestion: 1,
      totalQuestions: 10,
      answeredQuestions: 0,
      status: 'active',
      warnings: 0,
      isOnline: true,
      lastActivity: new Date().toISOString(),
    };
    
    this.liveSessions.set(attemptId, session);
    this.emit('student-joined', { examId, studentId: studentInfo.id, studentName: studentInfo.name });
    this.emit('exam-joined', { attemptId, session });
  }

  leaveExam(examId: string, attemptId: string): void {
    const session = this.liveSessions.get(attemptId);
    if (session) {
      session.isOnline = false;
      this.emit('student-left', { examId, studentId: session.studentId });
      this.liveSessions.delete(attemptId);
    }
  }

  submitExam(attemptId: string): void {
    const session = this.liveSessions.get(attemptId);
    if (session) {
      session.status = 'submitted';
      this.emit('exam-submitted', { attemptId, success: true });
    }
  }

  // Answer updates
  updateAnswer(attemptId: string, questionId: string, answer: any): void {
    this.emit('answer-saved', { attemptId, questionId, success: true });
    
    const session = this.liveSessions.get(attemptId);
    if (session) {
      session.lastActivity = new Date().toISOString();
    }
  }

  // Proctoring events
  sendProctorEvent(attemptId: string, event: ProctorEventType, details?: string): void {
    console.log(`Proctor event: ${event} for attempt ${attemptId}`);
    this.emit('proctor-alert', { attemptId, event, details, timestamp: new Date().toISOString() });
    
    const session = this.liveSessions.get(attemptId);
    if (session) {
      session.warnings += 1;
      
      if (session.warnings >= 3) {
        this.emit('warning-issued', { 
          attemptId, 
          message: 'Multiple violations detected. Your exam may be terminated.',
          severity: 'high'
        });
      } else {
        this.emit('warning-issued', { 
          attemptId, 
          message: `Warning: ${event.replace('_', ' ')} detected.`,
          severity: 'medium'
        });
      }
    }
  }

  // Chat messages
  sendChatMessage(examId: string, message: string, senderInfo: { 
    id: string; 
    name: string; 
    role: string;
    attemptId?: string;
  }): void {
    const chatMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2),
      examId,
      attemptId: senderInfo.attemptId,
      senderId: senderInfo.id,
      senderName: senderInfo.name,
      senderRole: senderInfo.role as any,
      message,
      timestamp: new Date().toISOString(),
      isAnnouncement: false,
    };
    
    this.emit('new-chat-message', chatMessage);
  }

  sendAnnouncement(examId: string, message: string, senderInfo: { id: string; name: string; role: string }): void {
    const announcement: ChatMessage = {
      id: Math.random().toString(36).substring(2),
      examId,
      senderId: senderInfo.id,
      senderName: senderInfo.name,
      senderRole: senderInfo.role as any,
      message,
      timestamp: new Date().toISOString(),
      isAnnouncement: true,
    };
    
    this.emit('new-chat-message', announcement);
  }

  // Exam control (for examiners)
  startExam(examId: string): void {
    this.emit('exam-started', { examId, startTime: new Date().toISOString() });
  }

  pauseExam(examId: string): void {
    this.liveSessions.forEach(session => {
      if (session.examId === examId) {
        session.status = 'paused';
      }
    });
    this.emit('exam-paused', { examId });
  }

  resumeExam(examId: string): void {
    this.liveSessions.forEach(session => {
      if (session.examId === examId) {
        session.status = 'active';
      }
    });
    this.emit('exam-resumed', { examId });
  }

  endExam(examId: string): void {
    this.liveSessions.forEach((session, attemptId) => {
      if (session.examId === examId) {
        session.status = 'submitted';
        this.emit('exam-ended', { examId, attemptId });
      }
    });
  }

  // Get live sessions
  getLiveSessions(examId?: string): LiveExamSession[] {
    const sessions = Array.from(this.liveSessions.values());
    if (examId) {
      return sessions.filter(s => s.examId === examId);
    }
    return sessions;
  }

  // Check connection status
  get isConnectedStatus(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
export const wsService = new WebSocketService();

// React hook for WebSocket
import { useEffect, useCallback, useState } from 'react';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    wsService.connect();
    setIsConnected(true);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    wsService.on('connected', handleConnect);
    
    return () => {
      wsService.off('connected', handleConnect);
    };
  }, []);

  const joinExam = useCallback((examId: string, attemptId: string, studentInfo: { id: string; name: string }) => {
    wsService.joinExam(examId, attemptId, studentInfo);
  }, []);

  const leaveExam = useCallback((examId: string, attemptId: string) => {
    wsService.leaveExam(examId, attemptId);
  }, []);

  const submitExam = useCallback((attemptId: string) => {
    wsService.submitExam(attemptId);
  }, []);

  const updateAnswer = useCallback((attemptId: string, questionId: string, answer: any) => {
    wsService.updateAnswer(attemptId, questionId, answer);
  }, []);

  const sendProctorEvent = useCallback((attemptId: string, event: ProctorEventType, details?: string) => {
    wsService.sendProctorEvent(attemptId, event, details);
  }, []);

  const sendChatMessage = useCallback((examId: string, message: string, senderInfo: any) => {
    wsService.sendChatMessage(examId, message, senderInfo);
  }, []);

  const sendAnnouncement = useCallback((examId: string, message: string, senderInfo: any) => {
    wsService.sendAnnouncement(examId, message, senderInfo);
  }, []);

  const startExam = useCallback((examId: string) => {
    wsService.startExam(examId);
  }, []);

  const pauseExam = useCallback((examId: string) => {
    wsService.pauseExam(examId);
  }, []);

  const resumeExam = useCallback((examId: string) => {
    wsService.resumeExam(examId);
  }, []);

  const endExam = useCallback((examId: string) => {
    wsService.endExam(examId);
  }, []);

  return {
    isConnected,
    joinExam,
    leaveExam,
    submitExam,
    updateAnswer,
    sendProctorEvent,
    sendChatMessage,
    sendAnnouncement,
    startExam,
    pauseExam,
    resumeExam,
    endExam,
    ws: wsService,
  };
}
