import { supabase } from '@/lib/supabase';
import type { ProctorEventType, ChatMessage, LiveExamSession } from '@/types';

// Real-time service using Supabase
class RealtimeService {
  private channels: Map<string, any> = new Map();

  // Join exam room
  async joinExam(examId: string, attemptId: string, studentInfo: { id: string; name: string }) {
    // Create or get channel for this exam
    const channelName = `exam-${examId}`;
    
    let channel = this.channels.get(channelName);
    if (!channel) {
      channel = supabase.channel(channelName, {
        config: {
          broadcast: { self: true },
        },
      });
      this.channels.set(channelName, channel);
    }

    // Subscribe to the channel
    channel.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        // Broadcast student joined event
        await channel.send({
          type: 'broadcast',
          event: 'student-joined',
          payload: {
            examId,
            attemptId,
            studentId: studentInfo.id,
            studentName: studentInfo.name,
            timestamp: new Date().toISOString(),
          },
        });
      }
    });

    return channel;
  }

  // Leave exam room
  async leaveExam(examId: string, attemptId: string) {
    const channelName = `exam-${examId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'student-left',
        payload: {
          examId,
          attemptId,
          timestamp: new Date().toISOString(),
        },
      });
      
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  // Subscribe to exam events
  onExamEvent(examId: string, event: string, callback: (payload: any) => void) {
    const channelName = `exam-${examId}`;
    
    let channel = this.channels.get(channelName);
    if (!channel) {
      channel = supabase.channel(channelName);
      this.channels.set(channelName, channel);
    }

    channel.on('broadcast', { event }, callback);
    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  // Send proctor event
  async sendProctorEvent(examId: string, attemptId: string, event: ProctorEventType, details?: string) {
    const channelName = `exam-${examId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'proctor-alert',
        payload: {
          attemptId,
          event,
          details,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Also save to database
    await supabase.from('proctor_logs').insert({
      attempt_id: attemptId,
      event_type: event,
      details,
      severity: event === 'tab_switch' || event === 'fullscreen_exit' ? 'medium' : 'low',
    } as any);
  }

  // Subscribe to proctor events
  onProctorEvent(examId: string, callback: (payload: any) => void) {
    return this.onExamEvent(examId, 'proctor-alert', callback);
  }

  // Send chat message
  async sendChatMessage(examId: string, message: string, senderInfo: { 
    id: string; 
    name: string; 
    role: string;
    attemptId?: string;
  }) {
    // Save to database
    const { data } = await supabase.from('chat_messages').insert({
      exam_id: examId,
      attempt_id: senderInfo.attemptId,
      sender_id: senderInfo.id,
      sender_name: senderInfo.name,
      sender_role: senderInfo.role,
      message,
      is_announcement: false,
    } as any).select().single();

    return data;
  }

  // Send announcement
  async sendAnnouncement(examId: string, message: string, senderInfo: { id: string; name: string; role: string }) {
    const { data } = await supabase.from('chat_messages').insert({
      exam_id: examId,
      sender_id: senderInfo.id,
      sender_name: senderInfo.name,
      sender_role: senderInfo.role,
      message,
      is_announcement: true,
    } as any).select().single();

    return data;
  }

  // Subscribe to chat messages
  subscribeToChat(examId: string, callback: (message: ChatMessage) => void) {
    return supabase
      .channel(`chat-${examId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `exam_id=eq.${examId}`,
        },
        (payload) => {
          callback({
            id: payload.new.id,
            examId: payload.new.exam_id,
            attemptId: payload.new.attempt_id,
            senderId: payload.new.sender_id,
            senderName: payload.new.sender_name,
            senderRole: payload.new.sender_role,
            message: payload.new.message,
            timestamp: payload.new.created_at,
            isAnnouncement: payload.new.is_announcement,
          } as ChatMessage);
        }
      )
      .subscribe();
  }

  // Subscribe to exam attempts (for live monitoring)
  subscribeToAttempts(examId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`attempts-${examId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exam_attempts',
          filter: `exam_id=eq.${examId}`,
        },
        callback
      )
      .subscribe();
  }

  // Subscribe to answer updates
  subscribeToAnswers(attemptId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`answers-${attemptId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_answers',
          filter: `attempt_id=eq.${attemptId}`,
        },
        callback
      )
      .subscribe();
  }

  // Update answer
  async updateAnswer(attemptId: string, questionId: string, answer: any) {
    // Check if answer exists
    const { data: existing } = await supabase
      .from('student_answers')
      .select('id')
      .eq('attempt_id', attemptId)
      .eq('question_id', questionId)
      .single();

    if (existing) {
      // Update existing answer
      await supabase
        .from('student_answers')
        .update({ answer, answered_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      // Create new answer
      await supabase.from('student_answers').insert({
        attempt_id: attemptId,
        question_id: questionId,
        answer,
        answered_at: new Date().toISOString(),
      });
    }

    // Broadcast answer saved event
    const channelName = `attempt-${attemptId}`;
    const channel = this.channels.get(channelName);
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'answer-saved',
        payload: { questionId, success: true },
      });
    }
  }

  // Submit exam
  async submitExam(attemptId: string) {
    await supabase
      .from('exam_attempts')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', attemptId);

    // Broadcast exam submitted event
    const { data: attempt } = await supabase
      .from('exam_attempts')
      .select('exam_id')
      .eq('id', attemptId)
      .single();

    if (attempt) {
      const channelName = `exam-${attempt.exam_id}`;
      const channel = this.channels.get(channelName);
      if (channel) {
        await channel.send({
          type: 'broadcast',
          event: 'exam-submitted',
          payload: { attemptId, success: true },
        });
      }
    }
  }

  // Exam control functions (for examiners)
  async startExam(examId: string) {
    await supabase
      .from('exams')
      .update({ status: 'active' })
      .eq('id', examId);

    const channelName = `exam-${examId}`;
    const channel = this.channels.get(channelName);
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'exam-started',
        payload: { examId, startTime: new Date().toISOString() },
      });
    }
  }

  async pauseExam(examId: string) {
    await supabase
      .from('exams')
      .update({ status: 'paused' })
      .eq('id', examId);

    const channelName = `exam-${examId}`;
    const channel = this.channels.get(channelName);
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'exam-paused',
        payload: { examId },
      });
    }
  }

  async resumeExam(examId: string) {
    await supabase
      .from('exams')
      .update({ status: 'active' })
      .eq('id', examId);

    const channelName = `exam-${examId}`;
    const channel = this.channels.get(channelName);
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'exam-resumed',
        payload: { examId },
      });
    }
  }

  async endExam(examId: string) {
    await supabase
      .from('exams')
      .update({ status: 'completed' })
      .eq('id', examId);

    const channelName = `exam-${examId}`;
    const channel = this.channels.get(channelName);
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'exam-ended',
        payload: { examId },
      });
    }
  }

  // Cleanup
  cleanup() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

export const realtimeService = new RealtimeService();

// React hook for realtime
import { useEffect, useCallback, useState } from 'react';

export function useRealtime() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    return () => {
      realtimeService.cleanup();
    };
  }, []);

  const joinExam = useCallback((examId: string, attemptId: string, studentInfo: { id: string; name: string }) => {
    return realtimeService.joinExam(examId, attemptId, studentInfo);
  }, []);

  const leaveExam = useCallback((examId: string, attemptId: string) => {
    return realtimeService.leaveExam(examId, attemptId);
  }, []);

  const submitExam = useCallback((attemptId: string) => {
    return realtimeService.submitExam(attemptId);
  }, []);

  const updateAnswer = useCallback((attemptId: string, questionId: string, answer: any) => {
    return realtimeService.updateAnswer(attemptId, questionId, answer);
  }, []);

  const sendProctorEvent = useCallback((examId: string, attemptId: string, event: ProctorEventType, details?: string) => {
    return realtimeService.sendProctorEvent(examId, attemptId, event, details);
  }, []);

  const sendChatMessage = useCallback((examId: string, message: string, senderInfo: any) => {
    return realtimeService.sendChatMessage(examId, message, senderInfo);
  }, []);

  const sendAnnouncement = useCallback((examId: string, message: string, senderInfo: any) => {
    return realtimeService.sendAnnouncement(examId, message, senderInfo);
  }, []);

  const startExam = useCallback((examId: string) => {
    return realtimeService.startExam(examId);
  }, []);

  const pauseExam = useCallback((examId: string) => {
    return realtimeService.pauseExam(examId);
  }, []);

  const resumeExam = useCallback((examId: string) => {
    return realtimeService.resumeExam(examId);
  }, []);

  const endExam = useCallback((examId: string) => {
    return realtimeService.endExam(examId);
  }, []);

  const subscribeToChat = useCallback((examId: string, callback: (message: ChatMessage) => void) => {
    return realtimeService.subscribeToChat(examId, callback);
  }, []);

  const subscribeToAttempts = useCallback((examId: string, callback: (payload: any) => void) => {
    return realtimeService.subscribeToAttempts(examId, callback);
  }, []);

  const onProctorEvent = useCallback((examId: string, callback: (payload: any) => void) => {
    return realtimeService.onProctorEvent(examId, callback);
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
    subscribeToChat,
    subscribeToAttempts,
    onProctorEvent,
  };
}
