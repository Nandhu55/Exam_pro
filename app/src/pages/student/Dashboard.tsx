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
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  Play,
  Calendar,
  CheckCircle,
  AlertCircle,
  BookOpen,
  BarChart3,
  Star,
  Target,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [myAttempts, setMyAttempts] = useState<ExamAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get active exams
      const { data: examsData, error: examsError } = await supabase
        .from('exams')
        .select(`
          *,
          questions (*)
        `)
        .eq('status', 'active')
        .limit(3);
      
      if (examsError) throw examsError;
      
      // Get student's attempts
      const { data: attemptsData, error: attemptsError } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('student_id', user?.id || '')
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
        totalAttempts: mappedAttempts.length,
        activeExams: mappedExams.length,
        recentExams: mappedExams,
        recentAttempts: mappedAttempts,
        performanceTrend: [],
      });
      setAvailableExams(mappedExams);
      setMyAttempts(mappedAttempts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
    setIsLoading(false);
  };

  const statCards = [
    {
      title: 'Available Exams',
      value: availableExams.length,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/student/exams',
    },
    {
      title: 'Completed',
      value: myAttempts.filter(a => a.status === 'evaluated').length,
      icon: CheckCircle,
      color: 'bg-green-500',
      link: '/student/results',
    },
    {
      title: 'Avg. Score',
      value: '82%',
      change: '+5%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/student/performance',
    },
    {
      title: 'Rank',
      value: '#12',
      change: 'Top 10%',
      icon: Award,
      color: 'bg-amber-500',
      link: '/student/performance',
    },
  ];

  const topicPerformance = [
    { subject: 'Data Structures', score: 90, fullMark: 100 },
    { subject: 'Algorithms', score: 80, fullMark: 100 },
    { subject: 'Web Dev', score: 85, fullMark: 100 },
    { subject: 'Databases', score: 75, fullMark: 100 },
    { subject: 'Networks', score: 70, fullMark: 100 },
    { subject: 'Security', score: 88, fullMark: 100 },
  ];

  const upcomingExams = [
    { title: 'Advanced Algorithms', date: 'Feb 10, 2024', time: '10:00 AM', duration: 120 },
    { title: 'Database Design', date: 'Feb 15, 2024', time: '2:00 PM', duration: 90 },
    { title: 'Web Development', date: 'Feb 20, 2024', time: '9:00 AM', duration: 60 },
  ];

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
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-slate-500">Here's your learning progress and upcoming exams.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/student/exams">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Play className="w-4 h-4" />
              Take Exam
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
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
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
            <CardTitle className="text-lg">Your Performance Trend</CardTitle>
            <Badge variant="secondary">Last 7 Exams</Badge>
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
                    formatter={(value) => [`${value}%`, 'Score']}
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

        {/* Topic-wise Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Topic-wise Performance</CardTitle>
            <Badge variant="secondary">Skills</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={topicPerformance}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#2467ec"
                    fill="#2467ec"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Exams & Upcoming */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Available Exams */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Available Exams</CardTitle>
              <p className="text-sm text-slate-500">Exams you can take now</p>
            </div>
            <Link to="/student/exams">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableExams.length > 0 ? (
                availableExams.map((exam) => (
                  <div key={exam.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{exam.title}</p>
                      <p className="text-sm text-slate-500">
                        {exam.duration} min • {exam.totalMarks} marks
                      </p>
                    </div>
                    <Link to={`/exam/${exam.id}`}>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No exams available right now</p>
                  <p className="text-sm text-slate-400">Check back later for new exams</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Upcoming Exams</CardTitle>
              <p className="text-sm text-slate-500">Mark your calendar</p>
            </div>
            <Link to="/student/exams">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExams.map((exam, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-slate-500 font-medium">
                      {exam.date.split(' ')[0]}
                    </span>
                    <span className="text-lg font-bold text-slate-700">
                      {exam.date.split(' ')[1].replace(',', '')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{exam.title}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exam.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {exam.duration} min
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Results</CardTitle>
            <p className="text-sm text-slate-500">Your latest exam performances</p>
          </div>
          <Link to="/student/results">
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
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Exam</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Result</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myAttempts.length > 0 ? (
                  myAttempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900">Exam Name</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(attempt.submittedAt || attempt.startedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={attempt.percentage || 0} className="w-20 h-2" />
                          <span className="text-sm text-slate-600">{attempt.percentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={attempt.result === 'pass' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {attempt.result}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Link to={`/student/results/${attempt.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      <Award className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>No results yet</p>
                      <p className="text-sm text-slate-400">Take an exam to see your results here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Missing import
import { Eye } from 'lucide-react';
