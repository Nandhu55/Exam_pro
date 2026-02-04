import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Exam } from '@/types';
import {
  Plus,
  FileText,
  Edit2,
  Trash2,
  Eye,
  Monitor,
  BarChart3,
  MoreHorizontal,
  Clock,
  Calendar,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function MyExams() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, [user]);

  const loadExams = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          questions (*)
        `)
        .eq('examiner_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedExams: Exam[] = (data as any[])?.map(e => ({
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
      })) || [];
      
      setExams(mappedExams);
    } catch (error) {
      toast.error('Failed to load exams');
    }
    setIsLoading(false);
  };

  const handleDelete = async (examId: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', examId);
      
      if (error) throw error;
      
      toast.success('Exam deleted');
      loadExams();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      active: 'default',
      scheduled: 'outline',
      completed: 'secondary',
      draft: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Exams</h1>
          <p className="text-slate-500">Manage your created exams</p>
        </div>
        <Link to="/examiner/exams/create">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Create Exam
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <Badge variant={getStatusBadge(exam.status)} className="capitalize">
                  {exam.status}
                </Badge>
              </div>

              <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                {exam.description || 'No description'}
              </p>

              <div className="space-y-2 mb-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {exam.duration} minutes
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  {exam.totalMarks} marks • {exam.questions.length} questions
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/examiner/exams/edit/${exam.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                {exam.status === 'active' && (
                  <Link to={`/examiner/monitoring/${exam.id}`}>
                    <Button variant="outline" size="sm">
                      <Monitor className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleDelete(exam.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No exams yet</h3>
          <p className="text-slate-500 mb-4">Create your first exam to get started</p>
          <Link to="/examiner/exams/create">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-1" />
              Create Exam
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
