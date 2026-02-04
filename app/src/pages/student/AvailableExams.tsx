import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Exam } from '@/types';
import {
  Search,
  Filter,
  Clock,
  FileText,
  Calendar,
  Play,
  CheckCircle,
  AlertCircle,
  BookOpen,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

export function AvailableExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    filterExams();
  }, [exams, searchQuery, statusFilter]);

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

    if (statusFilter !== 'all') {
      filtered = filtered.filter(exam => exam.status === statusFilter);
    }

    setFilteredExams(filtered);
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; label: string }> = {
      active: { variant: 'default', label: 'Active' },
      scheduled: { variant: 'outline', label: 'Scheduled' },
      completed: { variant: 'secondary', label: 'Completed' },
      draft: { variant: 'destructive', label: 'Draft' },
    };
    const config = configs[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const canTakeExam = (exam: Exam) => {
    return exam.status === 'active';
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Available Exams</h1>
          <p className="text-slate-500">Browse and take your exams</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exams Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                {getStatusBadge(exam.status)}
              </div>

              <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                {exam.description || 'No description available'}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{exam.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>{exam.totalMarks} marks</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{exam.questions.length} questions</span>
                </div>
                {exam.startTime && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(exam.startTime).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {canTakeExam(exam) ? (
                <Link to={`/exam/${exam.id}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Play className="w-4 h-4 mr-1" />
                    Start Exam
                  </Button>
                </Link>
              ) : exam.status === 'scheduled' ? (
                <Button variant="outline" className="w-full" disabled>
                  <Calendar className="w-4 h-4 mr-1" />
                  Coming Soon
                </Button>
              ) : (
                <Link to={`/student/results`}>
                  <Button variant="outline" className="w-full">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    View Results
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No exams found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
