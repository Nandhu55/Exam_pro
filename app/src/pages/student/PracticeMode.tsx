import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Play,
  BookOpen,
  Clock,
  Target,
  RotateCcw,
  TrendingUp,
  CheckCircle,
  Star,
} from 'lucide-react';

export function PracticeMode() {
  const practiceSets = [
    {
      id: 1,
      title: 'Data Structures Basics',
      questions: 20,
      difficulty: 'Easy',
      topic: 'Arrays, Linked Lists',
      estimatedTime: 30,
      completed: 15,
    },
    {
      id: 2,
      title: 'Algorithm Complexity',
      questions: 15,
      difficulty: 'Medium',
      topic: 'Big O, Time Complexity',
      estimatedTime: 25,
      completed: 0,
    },
    {
      id: 3,
      title: 'Sorting Algorithms',
      questions: 25,
      difficulty: 'Medium',
      topic: 'Quick Sort, Merge Sort',
      estimatedTime: 40,
      completed: 25,
    },
    {
      id: 4,
      title: 'Tree Traversal',
      questions: 18,
      difficulty: 'Hard',
      topic: 'BST, AVL Trees',
      estimatedTime: 35,
      completed: 5,
    },
  ];

  const recentAttempts = [
    { set: 'Data Structures Basics', score: 85, date: '2 days ago' },
    { set: 'Sorting Algorithms', score: 92, date: '1 week ago' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: 'bg-green-100 text-green-700',
      Medium: 'bg-amber-100 text-amber-700',
      Hard: 'bg-red-100 text-red-700',
    };
    return colors[difficulty] || 'bg-slate-100 text-slate-700';
  };

  const handleStartPractice = (setId: number) => {
    toast.success('Starting practice session...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Practice Mode</h1>
        <p className="text-slate-500">Sharpen your skills with practice questions</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Sets Completed</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Questions Solved</p>
              <p className="text-2xl font-bold">245</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Accuracy</p>
              <p className="text-2xl font-bold">84%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Time Practiced</p>
              <p className="text-2xl font-bold">18h</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Sets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Practice Sets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {practiceSets.map((set) => (
              <div key={set.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{set.title}</h3>
                    <p className="text-sm text-slate-500">{set.topic}</p>
                  </div>
                  <Badge className={getDifficultyColor(set.difficulty)}>{set.difficulty}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                  <span>{set.questions} questions</span>
                  <span>~{set.estimatedTime} min</span>
                </div>

                {set.completed > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">Progress</span>
                      <span>{Math.round((set.completed / set.questions) * 100)}%</span>
                    </div>
                    <Progress value={(set.completed / set.questions) * 100} className="h-2" />
                  </div>
                )}

                <Button
                  onClick={() => handleStartPractice(set.id)}
                  className="w-full bg-primary hover:bg-primary/90"
                  variant={set.completed === set.questions ? 'outline' : 'default'}
                >
                  {set.completed === set.questions ? (
                    <><RotateCcw className="w-4 h-4 mr-1" /> Retry</>
                  ) : set.completed > 0 ? (
                    <><Play className="w-4 h-4 mr-1" /> Continue</>
                  ) : (
                    <><Play className="w-4 h-4 mr-1" /> Start Practice</>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Practice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Practice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAttempts.map((attempt, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">{attempt.set}</p>
                  <p className="text-sm text-slate-500">{attempt.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={attempt.score >= 80 ? 'default' : 'secondary'}>
                    {attempt.score}%
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <RotateCcw className="w-4 h-4" />
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
