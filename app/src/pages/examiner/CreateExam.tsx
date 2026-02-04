import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  Plus,
  Save,
  Clock,
  BarChart3,
  Shield,
  Shuffle,
  Eye,
} from 'lucide-react';

export function CreateExam() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    totalMarks: 100,
    passingMarks: 40,
    maxAttempts: 1,
    shuffleQuestions: false,
    shuffleOptions: false,
    negativeMarking: false,
    negativeMarkingValue: 0.25,
    showResultImmediately: true,
    allowReview: true,
    proctoringEnabled: true,
    instructions: '',
  });

  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error('Please enter exam title');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('exams')
        .insert({
          title: formData.title,
          description: formData.description,
          examiner_id: user?.id,
          status: 'draft',
          duration: formData.duration,
          total_marks: formData.totalMarks,
          passing_marks: formData.passingMarks,
          max_attempts: formData.maxAttempts,
          shuffle_questions: formData.shuffleQuestions,
          shuffle_options: formData.shuffleOptions,
          negative_marking: formData.negativeMarking,
          negative_marking_value: formData.negativeMarkingValue,
          show_result_immediately: formData.showResultImmediately,
          allow_review: formData.allowReview,
          proctoring_enabled: formData.proctoringEnabled,
          instructions: formData.instructions,
        } as any);
      
      if (error) throw error;
      
      toast.success('Exam created successfully');
      navigate('/examiner/exams');
    } catch (error) {
      toast.error('Failed to create exam');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Exam</h1>
          <p className="text-slate-500">Set up your exam details and configuration</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Exam Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Data Structures Mid-Term"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the exam"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Duration (min)</Label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Marks</Label>
              <Input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Passing Marks</Label>
              <Input
                type="number"
                value={formData.passingMarks}
                onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exam Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Shuffle Questions</p>
              <p className="text-sm text-slate-500">Randomize question order for each student</p>
            </div>
            <Switch
              checked={formData.shuffleQuestions}
              onCheckedChange={(checked) => setFormData({ ...formData, shuffleQuestions: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Shuffle Options</p>
              <p className="text-sm text-slate-500">Randomize answer options for each student</p>
            </div>
            <Switch
              checked={formData.shuffleOptions}
              onCheckedChange={(checked) => setFormData({ ...formData, shuffleOptions: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Negative Marking</p>
              <p className="text-sm text-slate-500">Deduct marks for wrong answers</p>
            </div>
            <Switch
              checked={formData.negativeMarking}
              onCheckedChange={(checked) => setFormData({ ...formData, negativeMarking: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Results Immediately</p>
              <p className="text-sm text-slate-500">Display score after submission</p>
            </div>
            <Switch
              checked={formData.showResultImmediately}
              onCheckedChange={(checked) => setFormData({ ...formData, showResultImmediately: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Proctoring</p>
              <p className="text-sm text-slate-500">Monitor students during exam</p>
            </div>
            <Switch
              checked={formData.proctoringEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, proctoringEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Enter exam instructions for students..."
            className="min-h-32"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary/90 gap-2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Create Exam
        </Button>
      </div>
    </div>
  );
}
