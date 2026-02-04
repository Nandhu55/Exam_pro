import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Exam, ExamAttempt } from '@/types';
import {
  Monitor,
  Users,
  AlertTriangle,
  Clock,
  MessageSquare,
  Eye,
  Flag,
  Ban,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  Video,
  Activity,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function LiveMonitoring() {
  const { examId } = useParams<{ examId: string }>();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [liveAttempts, setLiveAttempts] = useState<ExamAttempt[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<ExamAttempt | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Subscribe to real-time attempt updates
    if (examId) {
      const channel = supabase
        .channel(`exam-attempts-${examId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'exam_attempts',
          filter: `exam_id=eq.${examId}`,
        }, () => {
          loadData();
        })
        .subscribe();
      
      return () => {
        channel.unsubscribe();
      };
    }
  }, [examId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (examId) {
        const { data: examData, error: examError } = await supabase
          .from('exams')
          .select(`
            *,
            questions (*)
          `)
          .eq('id', examId)
          .single();
        
        if (examError) throw examError;
        
        if (examData) {
          const e = examData as any;
          setExam({
            id: e.id,
            title: examData.title,
            description: examData.description,
            subjectId: examData.subject_id,
            examinerId: examData.examiner_id,
            status: examData.status,
            duration: examData.duration,
            totalMarks: examData.total_marks,
            passingMarks: examData.passing_marks,
            startTime: examData.start_time,
            endTime: examData.end_time,
            maxAttempts: examData.max_attempts,
            shuffleQuestions: examData.shuffle_questions,
            shuffleOptions: examData.shuffle_options,
            negativeMarking: examData.negative_marking,
            negativeMarkingValue: examData.negative_marking_value,
            showResultImmediately: examData.show_result_immediately,
            allowReview: examData.allow_review,
            instructions: examData.instructions,
            proctoringEnabled: examData.proctoring_enabled,
            webcamInterval: examData.webcam_interval,
            questions: examData.questions?.map((q: any) => ({
              id: q.id,
              examId: q.exam_id,
              subjectId: q.subject_id,
              topicId: q.topic_id,
              type: q.type,
              question: q.question,
              options: q.options || [],
              correctAnswer: q.correct_answer,
              marks: q.marks,
              negativeMarks: q.negative_marks,
              explanation: q.explanation,
              difficulty: q.difficulty,
              tags: q.tags,
              codeTemplate: q.code_template,
              testCases: q.test_cases,
              order: q.order,
              createdBy: q.created_by,
              createdAt: q.created_at,
              updatedAt: q.updated_at,
            })) || [],
            createdAt: e.created_at,
            updatedAt: e.updated_at,
          });
        }
        
        // Get in-progress attempts
        const { data: attemptsData, error: attemptsError } = await supabase
          .from('exam_attempts')
          .select('*')
          .eq('exam_id', examId)
          .eq('status', 'in_progress');
        
        if (attemptsError) throw attemptsError;
        
        const mappedAttempts: ExamAttempt[] = (attemptsData as any[])?.map(a => ({
          id: a.id,
          examId: a.exam_id,
          studentId: a.student_id,
          attemptNumber: a.attempt_number,
          status: a.status,
          startedAt: a.started_at,
          submittedAt: a.submitted_at,
          timeSpent: a.time_spent,
          totalMarks: a.total_marks,
          obtainedMarks: a.obtained_marks,
          percentage: a.percentage,
          result: a.result,
          ipAddress: a.ip_address,
          userAgent: a.user_agent,
          answers: [],
          proctorLogs: [],
        })) || [];
        
        setLiveAttempts(mappedAttempts);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setIsLoading(false);
  };

  const handleSendAnnouncement = async () => {
    if (!announcement.trim() || !examId) return;
    
    try {
      // Send announcement via chat messages
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          exam_id: examId,
          sender_id: 'system',
          sender_name: 'Examiner',
          sender_role: 'examiner',
          message: announcement,
          is_announcement: true,
        });
      
      if (error) throw error;
      
      toast.success('Announcement sent to all students');
      setAnnouncement('');
    } catch (error) {
      toast.error('Failed to send announcement');
    }
  };

  const handleFlagStudent = (studentId: string) => {
    toast.success(`Student flagged for review`);
  };

  const handleTerminateSession = async (attemptId: string) => {
    if (confirm('Are you sure you want to terminate this student\'s session?')) {
      try {
        const { error } = await supabase
          .from('exam_attempts')
          .update({ status: 'terminated' })
          .eq('id', attemptId);
        
        if (error) throw error;
        
        toast.success('Student session terminated');
        loadData();
      } catch (error) {
        toast.error('Failed to terminate session');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-amber-500';
      case 'warning':
        return 'bg-red-500';
      default:
        return 'bg-slate-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Live Monitoring</h1>
            <p className="text-slate-500">{exam?.title || 'All Active Exams'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          {examId && (
            <>
              <Button variant="destructive" onClick={async () => {
                if (confirm('Are you sure you want to end this exam?')) {
                  await supabase.from('exams').update({ status: 'completed' }).eq('id', examId);
                  toast.success('Exam ended');
                  loadData();
                }
              }}>
                End Exam
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Students</p>
              <p className="text-2xl font-bold">{liveAttempts.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Warnings</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg Progress</p>
              <p className="text-2xl font-bold">65%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Broadcast Announcement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Type an announcement to all students..."
              className="flex-1"
            />
            <Button onClick={handleSendAnnouncement} className="bg-primary hover:bg-primary/90">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Live Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Exam</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Progress</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Time Left</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Warnings</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {liveAttempts.map((attempt) => (
                  <tr key={attempt.id} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(attempt.status)}`} />
                        <span className="font-medium">{attempt.studentId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{exam?.title}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: '0%' }}
                          />
                        </div>
                        <span className="text-sm text-slate-600">0/{exam?.questions.length || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-4 h-4" />
                        {Math.floor(((exam?.duration || 0) * 60 - (attempt.timeSpent || 0)) / 60)}m
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="capitalize">{attempt.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-400">-</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStudent(attempt)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Student Details: {attempt.studentId}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                  <p className="text-sm text-slate-500">Attempt Number</p>
                                  <p className="text-xl font-semibold">{attempt.attemptNumber}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                  <p className="text-sm text-slate-500">Time Spent</p>
                                  <p className="text-xl font-semibold">{Math.floor((attempt.timeSpent || 0) / 60)} minutes</p>
                                </div>
                              </div>
                              <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-500 mb-2">Activity Log</p>
                                <div className="space-y-2 text-sm">
                                  <p>• Started at {new Date(attempt.startedAt).toLocaleTimeString()}</p>
                                  <p>• Status: {attempt.status}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagStudent(attempt.studentId)}
                        >
                          <Flag className="w-4 h-4 text-amber-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTerminateSession(attempt.id)}
                        >
                          <Ban className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {liveAttempts.length === 0 && (
            <div className="text-center py-16">
              <Monitor className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No active sessions</h3>
              <p className="text-slate-500">Students will appear here when they start the exam</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
