import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useExamTimer } from '@/hooks/useExamTimer';
import type { Exam, Question, ExamAttempt } from '@/types';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Send,
  Eye,
  Bookmark,
  Maximize2,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function TakeExam() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [exam, setExam] = useState<Exam | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);

  // Load exam data
  useEffect(() => {
    loadExam();
  }, [examId]);

  const loadExam = async () => {
    if (!examId) return;
    setIsLoading(true);
    try {
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
        const mappedExam: Exam = {
          id: e.id,
          title: e.title,
          description: e.description,
          subjectId: e.subject_id,
          examinerId: e.examiner_id,
          status: e.status,
          duration: e.duration,
          totalMarks: e.total_marks,
          passingMarks: e.passing_marks,
          startTime: e.start_time,
          endTime: e.end_time,
          maxAttempts: e.max_attempts,
          shuffleQuestions: e.shuffle_questions,
          shuffleOptions: e.shuffle_options,
          negativeMarking: e.negative_marking,
          negativeMarkingValue: e.negative_marking_value,
          showResultImmediately: e.show_result_immediately,
          allowReview: e.allow_review,
          instructions: e.instructions,
          proctoringEnabled: e.proctoring_enabled,
          webcamInterval: e.webcam_interval,
          questions: e.questions?.map((q: any) => ({
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
        };
        setExam(mappedExam);
        
        // Create attempt
        const { data: attemptData, error: attemptError } = await supabase
          .from('exam_attempts')
          .insert({
            exam_id: examId,
            student_id: user?.id || '',
            attempt_number: 1,
            status: 'in_progress',
          } as any)
          .select()
          .single();
        
        if (attemptError) throw attemptError;
        
        const mappedAttempt: ExamAttempt = {
          id: attemptData.id,
          examId: attemptData.exam_id,
          studentId: attemptData.student_id,
          attemptNumber: attemptData.attempt_number,
          status: attemptData.status,
          startedAt: attemptData.started_at,
          submittedAt: attemptData.submitted_at,
          timeSpent: attemptData.time_spent,
          totalMarks: attemptData.total_marks,
          obtainedMarks: attemptData.obtained_marks,
          percentage: attemptData.percentage,
          result: attemptData.result,
          ipAddress: attemptData.ip_address,
          userAgent: attemptData.user_agent,
          answers: [],
          proctorLogs: [],
        };
        setAttempt(mappedAttempt);
      }
    } catch (error) {
      toast.error('Failed to load exam');
    }
    setIsLoading(false);
  };

  // Timer
  const handleTimeUp = useCallback(() => {
    toast.error('Time is up! Your exam will be submitted automatically.');
    handleSubmit();
  }, []);

  const { timeRemaining, formattedTime, isWarning, progress } = useExamTimer({
    duration: (exam?.duration || 60) * 60,
    onTimeUp: handleTimeUp,
    autoStart: examStarted,
  });

  // Real-time subscriptions
  useEffect(() => {
    if (!examId) return;
    
    // Subscribe to exam control messages
    const channel = supabase.channel(`exam-control-${examId}`);
    
    channel.on('broadcast', { event: 'time-update' }, (payload) => {
      // Sync time with server
    });
    
    channel.on('broadcast', { event: 'warning-issued' }, (payload) => {
      toast.warning(payload.message);
    });
    
    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [examId]);

  const currentQuestion = exam?.questions[currentQuestionIndex];

  const handleAnswerChange = (answer: any) => {
    if (!currentQuestion) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));

    // Save answer to database
    if (attempt && currentQuestion) {
      supabase
        .from('student_answers')
        .upsert({
          attempt_id: attempt.id,
          question_id: currentQuestion.id,
          answer: answer,
          answered_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.error('Failed to save answer:', error);
        });
    }
  };

  const handleMarkForReview = () => {
    if (!currentQuestion) return;
    
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const handleNavigate = (index: number) => {
    if (index >= 0 && index < (exam?.questions.length || 0)) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleSubmit = async () => {
    if (!attempt || !exam) return;

    try {
      const { error } = await supabase
        .from('exam_attempts')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          time_spent: (exam.duration * 60) - timeRemaining,
        })
        .eq('id', attempt.id);
      
      if (error) throw error;

      toast.success('Exam submitted successfully!');
      navigate('/student/results');
    } catch (error) {
      toast.error('Failed to submit exam');
    }
  };

  const getQuestionStatus = (questionId: string, index: number) => {
    if (markedForReview.has(questionId)) return 'review';
    if (answers[questionId]) return 'answered';
    if (index < currentQuestionIndex) return 'skipped';
    return 'unanswered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white';
      case 'review':
        return 'bg-amber-500 text-white';
      case 'skipped':
        return 'bg-red-500 text-white';
      default:
        return 'bg-slate-200 text-slate-600';
    }
  };

  const answeredCount = Object.keys(answers).length;
  const reviewCount = markedForReview.size;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{exam?.title}</h1>
              <p className="text-slate-500">Please read the instructions carefully before starting</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="text-xl font-semibold">{exam?.duration} minutes</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Total Marks</p>
                  <p className="text-xl font-semibold">{exam?.totalMarks}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Questions</p>
                  <p className="text-xl font-semibold">{exam?.questions.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Passing Marks</p>
                  <p className="text-xl font-semibold">{exam?.passingMarks || 'N/A'}</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Instructions
                </h3>
                <ul className="space-y-2 text-sm text-amber-700">
                  <li>• Once started, the timer cannot be paused</li>
                  <li>• Do not refresh or close the browser</li>
                  <li>• Switching tabs will be recorded</li>
                  <li>• All answers are auto-saved</li>
                  <li>• Click "Submit" when you're done</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={() => setExamStarted(true)}
              className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
            >
              Start Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-lg">{exam?.title}</h1>
              <p className="text-sm text-slate-500">
                Question {currentQuestionIndex + 1} of {exam?.questions.length}
              </p>
            </div>
            
            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isWarning ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="text-xl font-mono font-bold">{formattedTime}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                {currentQuestion && (
                  <div className="space-y-6">
                    {/* Question Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          Q{currentQuestionIndex + 1}
                        </Badge>
                        <Badge className="capitalize">{currentQuestion.difficulty}</Badge>
                        <Badge variant="secondary">{currentQuestion.marks} marks</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkForReview}
                        className={markedForReview.has(currentQuestion.id) ? 'bg-amber-100' : ''}
                      >
                        <Flag className="w-4 h-4 mr-1" />
                        {markedForReview.has(currentQuestion.id) ? 'Unmark' : 'Mark for Review'}
                      </Button>
                    </div>

                    {/* Question Text */}
                    <div className="text-lg leading-relaxed">
                      {currentQuestion.question}
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-3">
                      {currentQuestion.type === 'mcq' && (
                        <RadioGroup
                          value={answers[currentQuestion.id] || ''}
                          onValueChange={handleAnswerChange}
                        >
                          {currentQuestion.options.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                                {option.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {currentQuestion.type === 'multi_select' && (
                        <div className="space-y-3">
                          {currentQuestion.options.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <Checkbox
                                id={option.id}
                                checked={(answers[currentQuestion.id] || []).includes(option.id)}
                                onCheckedChange={(checked) => {
                                  const current = answers[currentQuestion.id] || [];
                                  if (checked) {
                                    handleAnswerChange([...current, option.id]);
                                  } else {
                                    handleAnswerChange(current.filter((id: string) => id !== option.id));
                                  }
                                }}
                              />
                              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                                {option.text}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {currentQuestion.type === 'true_false' && (
                        <RadioGroup
                          value={answers[currentQuestion.id] || ''}
                          onValueChange={handleAnswerChange}
                        >
                          {currentQuestion.options.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                                {option.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {(currentQuestion.type === 'fill_blank' || currentQuestion.type === 'descriptive') && (
                        <Textarea
                          value={answers[currentQuestion.id] || ''}
                          onChange={(e) => handleAnswerChange(e.target.value)}
                          placeholder="Type your answer here..."
                          className="min-h-32"
                        />
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={() => handleNavigate(currentQuestionIndex - 1)}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => handleNavigate(currentQuestionIndex + 1)}
                        disabled={currentQuestionIndex === (exam?.questions.length || 0) - 1}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Question Palette */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Question Palette</h3>
                
                {/* Legend */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-500"></div>
                    <span>For Review ({reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span>Skipped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-200"></div>
                    <span>Unanswered</span>
                  </div>
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {exam?.questions.map((q, i) => {
                    const status = getQuestionStatus(q.id, i);
                    return (
                      <button
                        key={q.id}
                        onClick={() => handleNavigate(i)}
                        className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                          currentQuestionIndex === i
                            ? 'ring-2 ring-primary ring-offset-2'
                            : ''
                        } ${getStatusColor(status)}`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="mt-6 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Answered</span>
                    <span className="font-medium">{answeredCount} / {exam?.questions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">For Review</span>
                    <span className="font-medium">{reviewCount}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={() => setIsSubmitDialogOpen(true)}
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                  variant={answeredCount < (exam?.questions.length || 0) ? 'outline' : 'default'}
                >
                  <Send className="w-4 h-4 mr-1" />
                  Submit Exam
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {exam?.questions.length} questions.
              {reviewCount > 0 && ` ${reviewCount} questions are marked for review.`}
              <br /><br />
              Once submitted, you cannot change your answers. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
              Yes, Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
