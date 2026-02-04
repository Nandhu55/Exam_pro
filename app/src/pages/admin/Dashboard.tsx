import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { User, Exam, DashboardStats } from '@/types';
import {
  Users,
  FileText,
  TrendingUp,
  Activity,
  ArrowRight,
  Plus,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentExams, setRecentExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get total exams count
      const { count: totalExams } = await supabase
        .from('exams')
        .select('*', { count: 'exact', head: true });

      // Get total attempts count
      const { count: totalAttempts } = await supabase
        .from('exam_attempts')
        .select('*', { count: 'exact', head: true });

      // Get active exams count
      const { count: activeExams } = await supabase
        .from('exams')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get recent users
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent exams
      const { data: examsData } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: totalUsers || 0,
        totalExams: totalExams || 0,
        totalAttempts: totalAttempts || 0,
        activeExams: activeExams || 0,
        recentExams: examsData?.map(mapExamFromDB) || [],
        recentAttempts: [],
        performanceTrend: [
          { date: '2024-01-15', score: 72 },
          { date: '2024-01-16', score: 75 },
          { date: '2024-01-17', score: 73 },
          { date: '2024-01-18', score: 78 },
          { date: '2024-01-19', score: 76 },
          { date: '2024-01-20', score: 80 },
          { date: '2024-01-21', score: 82 },
        ],
      });

      setRecentUsers(usersData?.map(mapUserFromDB) || []);
      setRecentExams(examsData?.map(mapExamFromDB) || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
    setIsLoading(false);
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'Total Exams',
      value: stats?.totalExams || 0,
      change: '+8%',
      icon: FileText,
      color: 'bg-purple-500',
      link: '/admin/exams',
    },
    {
      title: 'Total Attempts',
      value: stats?.totalAttempts || 0,
      change: '+24%',
      icon: TrendingUp,
      color: 'bg-green-500',
      link: '/admin/analytics',
    },
    {
      title: 'Active Exams',
      value: stats?.activeExams || 0,
      change: '+3',
      icon: Activity,
      color: 'bg-amber-500',
      link: '/admin/exams',
    },
  ];

  const userRoleData = [
    { name: 'Students', value: 85, color: '#2467ec' },
    { name: 'Examiners', value: 12, color: '#10b981' },
    { name: 'Admins', value: 3, color: '#f59e0b' },
  ];

  const examStatusData = [
    { name: 'Active', value: 3, color: '#10b981' },
    { name: 'Scheduled', value: 5, color: '#3b82f6' },
    { name: 'Draft', value: 4, color: '#6b7280' },
    { name: 'Completed', value: 33, color: '#8b5cf6' },
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
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/users/create">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </Link>
          <Link to="/admin/exams/create">
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
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
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
            <CardTitle className="text-lg">Performance Trend</CardTitle>
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
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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

        {/* User Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">User Distribution</CardTitle>
            <Badge variant="secondary">By Role</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col gap-2">
                {userRoleData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Exam Status Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Exam Status</CardTitle>
            <Badge variant="secondary">Overview</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={examStatusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={80} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {examStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
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
              <Link to="/admin/users">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary">
                  <Users className="w-6 h-6 text-primary" />
                  <span className="text-sm">Manage Users</span>
                </Button>
              </Link>
              <Link to="/admin/exams">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary">
                  <FileText className="w-6 h-6 text-primary" />
                  <span className="text-sm">Manage Exams</span>
                </Button>
              </Link>
              <Link to="/admin/subjects">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <span className="text-sm">Subjects</span>
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <span className="text-sm">Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Users</CardTitle>
            <Link to="/admin/users">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <Badge 
                    variant={user.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Exams */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Exams</CardTitle>
            <Link to="/admin/exams">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{exam.title}</p>
                    <p className="text-sm text-slate-500">
                      {exam.duration} min • {exam.totalMarks} marks
                    </p>
                  </div>
                  <Badge 
                    variant={
                      exam.status === 'active' ? 'default' :
                      exam.status === 'completed' ? 'secondary' :
                      exam.status === 'scheduled' ? 'outline' :
                      'destructive'
                    }
                    className="capitalize flex-shrink-0"
                  >
                    {exam.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Mapper functions
function mapUserFromDB(data: any): User {
  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    status: data.status,
    avatar: data.avatar_url || undefined,
    phone: data.phone || undefined,
    institution: data.institution || undefined,
    department: data.department || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    lastLogin: data.last_login || undefined,
  };
}

function mapExamFromDB(data: any): Exam {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    subjectId: data.subject_id,
    examinerId: data.examiner_id,
    status: data.status,
    duration: data.duration,
    totalMarks: data.total_marks,
    passingMarks: data.passing_marks,
    startTime: data.start_time,
    endTime: data.end_time,
    maxAttempts: data.max_attempts,
    shuffleQuestions: data.shuffle_questions,
    shuffleOptions: data.shuffle_options,
    negativeMarking: data.negative_marking,
    negativeMarkingValue: data.negative_marking_value,
    showResultImmediately: data.show_result_immediately,
    allowReview: data.allow_review,
    instructions: data.instructions,
    proctoringEnabled: data.proctoring_enabled,
    webcamInterval: data.webcam_interval,
    questions: [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
