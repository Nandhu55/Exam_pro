import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Exam } from '@/types';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit2,
  GripVertical,
} from 'lucide-react';

export function EditExam() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExam();
  }, [examId]);

  const loadExam = async () => {
    if (!examId) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          questions (*)
        `)
        .eq('id', examId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const examData = data as any;
        const mappedExam: Exam = {
          id: examData.id,
          title: examData.title,
          description: examData.description,
          subjectId: examData.subject_id,
          examinerId: examData.examiner_id,
          status: examData.status,
          duration: examData.duration,
          totalMarks: examData.total_marks,
          passingMarks: examData.passing_marks,
          startTime: examData.start_time,
          endTime: examData.end_time,
          maxAttempts: examData.max_attempts,
          shuffleQuestions: examData.shuffle_questions,
          shuffleOptions: examData.shuffle_options,
          negativeMarking: examData.negative_marking,
          negativeMarkingValue: examData.negative_marking_value,
          showResultImmediately: examData.show_result_immediately,
          allowReview: examData.allow_review,
          instructions: examData.instructions,
          proctoringEnabled: examData.proctoring_enabled,
          webcamInterval: examData.webcam_interval,
          questions: examData.questions?.map((q: any) => ({
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
          createdAt: examData.created_at,
          updatedAt: examData.updated_at,
        };
        setExam(mappedExam);
      }
    } catch (error) {
      toast.error('Failed to load exam');
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!exam) return;
    try {
      const { error } = await supabase
        .from('exams')
        .update({
          title: exam.title,
          description: exam.description,
          duration: exam.duration,
          total_marks: exam.totalMarks,
          passing_marks: exam.passingMarks,
          max_attempts: exam.maxAttempts,
          shuffle_questions: exam.shuffleQuestions,
          shuffle_options: exam.shuffleOptions,
          negative_marking: exam.negativeMarking,
          negative_marking_value: exam.negativeMarkingValue,
          show_result_immediately: exam.showResultImmediately,
          allow_review: exam.allowReview,
          proctoring_enabled: exam.proctoringEnabled,
          instructions: exam.instructions,
        } as any)
        .eq('id', exam.id);
      
      if (error) throw error;
      
      toast.success('Exam updated successfully');
    } catch (error) {
      toast.error('Failed to update exam');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-slate-900">Exam not found</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Exam</h1>
          <p className="text-slate-500">{exam.title}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Exam Title</Label>
            <Input
              value={exam.title}
              onChange={(e) => setExam({ ...exam, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={exam.description}
              onChange={(e) => setExam({ ...exam, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Duration (min)</Label>
              <Input
                type="number"
                value={exam.duration}
                onChange={(e) => setExam({ ...exam, duration: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Marks</Label>
              <Input
                type="number"
                value={exam.totalMarks}
                onChange={(e) => setExam({ ...exam, totalMarks: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Passing Marks</Label>
              <Input
                type="number"
                value={exam.passingMarks}
                onChange={(e) => setExam({ ...exam, passingMarks: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Questions ({exam.questions.length})</CardTitle>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" />
            Add Question
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exam.questions.map((question, index) => (
              <div key={question.id} className="flex items-start gap-3 p-4 border rounded-lg">
                <GripVertical className="w-5 h-5 text-slate-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Q{index + 1}</span>
                    <Badge variant="outline" className="capitalize">{question.type}</Badge>
                    <Badge variant="secondary">{question.marks} marks</Badge>
                  </div>
                  <p className="text-slate-700">{question.question}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
