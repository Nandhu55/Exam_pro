import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Exam } from '@/types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Clock,
  Users,
  MoreHorizontal,
  Filter,
  Download,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    filterExams();
  }, [exams, searchQuery]);

  const loadExams = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          questions (*)
        `)
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

  const filterExams = () => {
    let filtered = [...exams];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        exam =>
          exam.title.toLowerCase().includes(query) ||
          exam.description?.toLowerCase().includes(query)
      );
    }
    setFilteredExams(filtered);
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', examId);
      
      if (error) throw error;
      
      toast.success('Exam deleted successfully');
      loadExams();
    } catch (error) {
      toast.error('Failed to delete exam');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      active: 'default',
      scheduled: 'outline',
      completed: 'secondary',
      draft: 'destructive',
      paused: 'outline',
      cancelled: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exam Management</h1>
          <p className="text-slate-500">Manage all exams in the system</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link to="/admin/exams/create">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Create Exam
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Exams ({filteredExams.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Exam</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Questions</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Examiner</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((exam) => (
                    <tr key={exam.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{exam.title}</p>
                            <p className="text-sm text-slate-500">{exam.totalMarks} marks</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadge(exam.status)} className="capitalize">
                          {exam.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{exam.duration} min</td>
                      <td className="py-3 px-4 text-slate-600">{exam.questions.length}</td>
                      <td className="py-3 px-4 text-slate-600">{exam.examinerId}</td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteExam(exam.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
