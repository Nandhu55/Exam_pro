import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Search,
  Download,
  Award,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function ExamResults() {
  const scoreDistribution = [
    { range: '90-100', count: 8 },
    { range: '80-89', count: 15 },
    { range: '70-79', count: 22 },
    { range: '60-69', count: 18 },
    { range: '50-59', count: 10 },
    { range: '40-49', count: 5 },
    { range: '0-39', count: 3 },
  ];

  const results = [
    { student: 'Alice Wonder', score: 85, time: '75 min', status: 'pass' },
    { student: 'Bob Builder', score: 72, time: '82 min', status: 'pass' },
    { student: 'Charlie Chaplin', score: 45, time: '45 min', status: 'fail' },
    { student: 'Diana Prince', score: 92, time: '68 min', status: 'pass' },
    { student: 'Eve Adam', score: 78, time: '80 min', status: 'pass' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exam Results</h1>
          <p className="text-slate-500">View and analyze student performance</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Results
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Students</p>
              <p className="text-2xl font-bold">81</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Passed</p>
              <p className="text-2xl font-bold">73</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Failed</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg Score</p>
              <p className="text-2xl font-bold">76%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#2467ec" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Student Results</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input placeholder="Search students..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Time Taken</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => (
                  <tr key={i} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium">{result.student}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={result.score} className="w-20 h-2" />
                        <span>{result.score}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{result.time}</td>
                    <td className="py-3 px-4">
                      <Badge variant={result.status === 'pass' ? 'default' : 'destructive'}>
                        {result.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
