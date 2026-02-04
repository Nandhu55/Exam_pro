import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Users,
  FileText,
  Award,
  Calendar,
  BarChart3,
} from 'lucide-react';

export function AdminAnalytics() {
  const monthlyData = [
    { month: 'Jan', exams: 45, attempts: 320, avgScore: 72 },
    { month: 'Feb', exams: 52, attempts: 380, avgScore: 75 },
    { month: 'Mar', exams: 48, attempts: 350, avgScore: 73 },
    { month: 'Apr', exams: 60, attempts: 420, avgScore: 78 },
    { month: 'May', exams: 55, attempts: 400, avgScore: 76 },
    { month: 'Jun', exams: 65, attempts: 480, avgScore: 80 },
  ];

  const userGrowth = [
    { month: 'Jan', students: 800, examiners: 45 },
    { month: 'Feb', students: 950, examiners: 50 },
    { month: 'Mar', students: 1100, examiners: 55 },
    { month: 'Apr', students: 1250, examiners: 60 },
    { month: 'May', students: 1400, examiners: 65 },
    { month: 'Jun', students: 1600, examiners: 72 },
  ];

  const examTypes = [
    { name: 'MCQ', value: 45, color: '#2467ec' },
    { name: 'Descriptive', value: 25, color: '#10b981' },
    { name: 'Coding', value: 15, color: '#f59e0b' },
    { name: 'Mixed', value: 15, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="text-slate-500">Comprehensive platform analytics and insights</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Exams</p>
              <p className="text-2xl font-bold">325</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Users</p>
              <p className="text-2xl font-bold">1,672</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg. Score</p>
              <p className="text-2xl font-bold">76%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pass Rate</p>
              <p className="text-2xl font-bold">82%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Exam Activity</CardTitle>
            <Badge variant="secondary">Last 6 Months</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="exams" fill="#2467ec" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attempts" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">User Growth</CardTitle>
            <Badge variant="secondary">Last 6 Months</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#2467ec" strokeWidth={2} />
                  <Line type="monotone" dataKey="examiners" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Exam Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={examTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {examTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: 'Computer Science', avgScore: 85, attempts: 450 },
                { subject: 'Mathematics', avgScore: 78, attempts: 380 },
                { subject: 'Physics', avgScore: 72, attempts: 290 },
                { subject: 'Chemistry', avgScore: 75, attempts: 250 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-slate-500">{item.attempts} attempts</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{item.avgScore}%</p>
                    <p className="text-xs text-slate-500">avg score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
