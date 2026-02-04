import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Subject, Topic } from '@/types';
import {
  Search,
  Plus,
  BookOpen,
  Folder,
  MoreHorizontal,
  Edit2,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export function SubjectManagement() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSubject, setNewSubject] = useState({ name: '', description: '', code: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [{ data: subjectsData, error: subjectsError }, { data: topicsData, error: topicsError }] = await Promise.all([
        supabase.from('subjects').select('*').order('name'),
        supabase.from('topics').select('*').order('name'),
      ]);
      
      if (subjectsError) throw subjectsError;
      if (topicsError) throw topicsError;
      
      const mappedSubjects: Subject[] = (subjectsData as any[])?.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        code: s.code,
        createdBy: s.created_by,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      })) || [];
      
      const mappedTopics: Topic[] = (topicsData as any[])?.map(t => ({
        id: t.id,
        subjectId: t.subject_id,
        name: t.name,
        description: t.description,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      })) || [];
      
      setSubjects(mappedSubjects);
      setTopics(mappedTopics);
    } catch (error) {
      toast.error('Failed to load data');
    }
    setIsLoading(false);
  };

  const handleCreateSubject = async () => {
    try {
      const { error } = await supabase
        .from('subjects')
        .insert({
          name: newSubject.name,
          description: newSubject.description,
          code: newSubject.code,
          created_by: user?.id,
        } as any);
      
      if (error) throw error;
      
      toast.success('Subject created successfully');
      setIsDialogOpen(false);
      setNewSubject({ name: '', description: '', code: '' });
      loadData();
    } catch (error) {
      toast.error('Failed to create subject');
    }
  };

  const getTopicsForSubject = (subjectId: string) => {
    return topics.filter(t => t.subjectId === subjectId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subjects & Topics</h1>
          <p className="text-slate-500">Manage subjects and their topics</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  placeholder="e.g., CS"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>
              <Button onClick={handleCreateSubject} className="w-full bg-primary hover:bg-primary/90">
                Create Subject
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline">{subject.code}</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{subject.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{subject.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Folder className="w-4 h-4" />
                  {getTopicsForSubject(subject.id).length} topics
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
