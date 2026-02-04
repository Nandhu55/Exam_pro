import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Clock,
  Zap,
  Star,
} from 'lucide-react';

export function Performance() {
  const topicPerformance = [
    { topic: 'Data Structures', score: 90, fullMark: 100 },
    { topic: 'Algorithms', score: 80, fullMark: 100 },
    { topic: 'Web Dev', score: 85, fullMark: 100 },
    { topic: 'Databases', score: 75, fullMark: 100 },
    { topic: 'Networks', score: 70, fullMark: 100 },
    { topic: 'Security', score: 88, fullMark: 100 },
  ];

  const monthlyScores = [
    { month: 'Jan', score: 72 },
    { month: 'Feb', score: 78 },
    { month: 'Mar', score: 80 },
    { month: 'Apr', score: 82 },
    { month: 'May', score: 85 },
    { month: 'Jun', score: 88 },
  ];

  const weakAreas = [
    { topic: 'Database Normalization', score: 65, recommendation: 'Practice more SQL queries' },
    { topic: 'Network Protocols', score: 70, recommendation: 'Review TCP/IP fundamentals' },
  ];

  const achievements = [
    { title: 'Perfect Score', description: 'Scored 100% in an exam', icon: Star, color: 'text-amber-500' },
    { title: 'Fast Finisher', description: 'Completed exam in record time', icon: Zap, color: 'text-blue-500' },
    { title: 'Consistent Performer', description: 'Top 10% for 5 consecutive exams', icon: Target, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>
        <p className="text-slate-500">Track your learning progress and identify areas for improvement</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Overall Score</p>
              <p className="text-2xl font-bold">82%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Improvement</p>
              <p className="text-2xl font-bold">+12%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Class Rank</p>
              <p className="text-2xl font-bold">#8</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg Time</p>
              <p className="text-2xl font-bold">48m</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Topic-wise Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={topicPerformance}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11 }} />
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weak Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weakAreas.map((area, i) => (
              <div key={i} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-amber-900">{area.topic}</p>
                  <Badge variant="outline" className="text-amber-700">{area.score}%</Badge>
                </div>
                <Progress value={area.score} className="h-2 mb-2" />
                <p className="text-sm text-amber-700">
                  <strong>Recommendation:</strong> {area.recommendation}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {achievements.map((achievement, i) => (
              <div key={i} className="p-4 border rounded-lg text-center hover:bg-slate-50 transition-colors">
                <achievement.icon className={`w-10 h-10 mx-auto mb-2 ${achievement.color}`} />
                <p className="font-medium">{achievement.title}</p>
                <p className="text-sm text-slate-500">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
