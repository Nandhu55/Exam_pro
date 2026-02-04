import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { DashboardStats, Exam, ExamAttempt } from '@/types';
import {
  FileText,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Monitor,
  Award,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export function ExaminerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [myExams, setMyExams] = useState<Exam[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<ExamAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get examiner's exams
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select(`
          *,
          questions (*)
        `)
        .eq('examiner_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (examsError) throw examsError;
      
      // Get attempts for examiner's exams
      const examIds = examsData?.map(e => e.id) || [];
      const { data: attemptsData, error: attemptsError } = await supabase
        .from('exam_attempts')
        .select('*')
        .in('exam_id', examIds.length > 0 ? examIds : [''])
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (attemptsError) throw attemptsError;
      
      const mappedExams: Exam[] = (examsData as any[])?.map(e => ({
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
      
      setStats({
        totalUsers: 0,
        totalExams: mappedExams.length,
        totalAttempts: attemptsData?.length || 0,
        activeExams: mappedExams.filter(e => e.status === 'active').length,
        recentExams: mappedExams,
        recentAttempts: mappedAttempts,
        performanceTrend: [],
      });
      setMyExams(mappedExams);
      setRecentAttempts(mappedAttempts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
    setIsLoading(false);
  };

  const statCards = [
    {
      title: 'My Exams',
      value: myExams.length,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/examiner/exams',
    },
    {
      title: 'Total Attempts',
      value: stats?.totalAttempts || 0,
      change: '+15%',
      icon: Users,
      color: 'bg-green-500',
      link: '/examiner/results',
    },
    {
      title: 'Active Now',
      value: 12,
      icon: Monitor,
      color: 'bg-amber-500',
      link: '/examiner/monitoring',
    },
    {
      title: 'Avg. Score',
      value: '76%',
      change: '+5%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/examiner/analytics',
    },
  ];

  const getExamStatusBadge = (status: string) => {
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
          <h1 className="text-2xl font-bold text-slate-900">Examiner Dashboard</h1>
          <p className="text-slate-500">Manage your exams and monitor student progress.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/examiner/exams/create">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Create Exam
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Link key={i} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    {stat.change && (
                      <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                    )}
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Student Performance Trend</CardTitle>
            <Badge variant="secondary">Last 7 Days</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.performanceTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`${value}%`, 'Average Score']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2467ec" 
                    strokeWidth={2}
                    dot={{ fill: '#2467ec', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/examiner/exams/create">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary">
                  <Plus className="w-6 h-6 text-primary" />
                  <span className="text-sm">Create Exam</span>
                </Button>
              </Link>
              <Link to="/examiner/monitoring">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary">
                  <Monitor className="w-6 h-6 text-primary" />
                  <span className="text-sm">Live Monitor</span>
                </Button>
              </Link>
              <Link to="/examiner/questions">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary">
                  <FileText className="w-6 h-6 text-primary" />
                  <span className="text-sm">Question Bank</span>
                </Button>
              </Link>
              <Link to="/examiner/results">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary">
                  <Award className="w-6 h-6 text-primary" />
                  <span className="text-sm">View Results</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exams */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">My Recent Exams</CardTitle>
          <Link to="/examiner/exams">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Exam Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Attempts</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Avg Score</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myExams.map((exam) => (
                  <tr key={exam.id} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-900">{exam.title}</p>
                        <p className="text-sm text-slate-500">{exam.totalMarks} marks</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getExamStatusBadge(exam.status)} className="capitalize">
                        {exam.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{exam.duration} min</td>
                    <td className="py-3 px-4 text-slate-600">{Math.floor(Math.random() * 50) + 10}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={75} className="w-16 h-2" />
                        <span className="text-sm text-slate-600">75%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link to={`/examiner/exams/edit/${exam.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {exam.status === 'active' && (
                          <Link to={`/examiner/monitoring/${exam.id}`}>
                            <Button variant="ghost" size="sm">
                              <Monitor className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Live Monitoring Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Live Monitoring</CardTitle>
            <p className="text-sm text-slate-500">Students currently taking exams</p>
          </div>
          <Link to="/examiner/monitoring">
            <Button variant="ghost" size="sm" className="gap-1">
              Full View
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Alice Wonder', exam: 'Data Structures', progress: 65, status: 'active' },
              { name: 'Bob Builder', exam: 'Data Structures', progress: 42, status: 'active' },
              { name: 'Charlie Chaplin', exam: 'Data Structures', progress: 78, status: 'warning' },
              { name: 'Diana Prince', exam: 'Data Structures', progress: 23, status: 'active' },
            ].map((student, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${
                    student.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                  }`} />
                  <span className="font-medium text-sm">{student.name}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{student.exam}</p>
                <div className="flex items-center gap-2">
                  <Progress value={student.progress} className="flex-1 h-2" />
                  <span className="text-xs text-slate-600">{student.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
