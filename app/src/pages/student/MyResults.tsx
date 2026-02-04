import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import {
  Award,
  TrendingUp,
  Calendar,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export function MyResults() {
  const results = [
    {
      id: 1,
      exam: 'Data Structures Mid-Term',
      date: 'Jan 15, 2024',
      score: 85,
      totalMarks: 100,
      status: 'pass',
      rank: 5,
      totalStudents: 45,
    },
    {
      id: 2,
      exam: 'Algorithms Quiz',
      date: 'Jan 10, 2024',
      score: 72,
      totalMarks: 100,
      status: 'pass',
      rank: 12,
      totalStudents: 38,
    },
    {
      id: 3,
      exam: 'Web Development Final',
      date: 'Dec 20, 2023',
      score: 92,
      totalMarks: 100,
      status: 'pass',
      rank: 3,
      totalStudents: 42,
    },
    {
      id: 4,
      exam: 'Database Design',
      date: 'Dec 15, 2023',
      score: 68,
      totalMarks: 100,
      status: 'pass',
      rank: 18,
      totalStudents: 35,
    },
  ];

  const stats = {
    totalExams: 12,
    passed: 11,
    failed: 1,
    averageScore: 79,
    highestScore: 95,
    totalRank: 8,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Results</h1>
        <p className="text-slate-500">View your exam performance history</p>
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
              <p className="text-2xl font-bold">{stats.totalExams}</p>
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
              <p className="text-2xl font-bold">{stats.passed}</p>
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
              <p className="text-2xl font-bold">{stats.averageScore}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Highest</p>
              <p className="text-2xl font-bold">{stats.highestScore}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exam History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  result.score >= 80 ? 'bg-green-100' :
                  result.score >= 60 ? 'bg-blue-100' : 'bg-amber-100'
                }`}>
                  <span className={`text-xl font-bold ${
                    result.score >= 80 ? 'text-green-600' :
                    result.score >= 60 ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {result.score}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{result.exam}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {result.date}
                    </span>
                    <Badge variant={result.status === 'pass' ? 'default' : 'destructive'}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Rank</p>
                  <p className="font-bold">#{result.rank} <span className="text-slate-400">/ {result.totalStudents}</span></p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
