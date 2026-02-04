-- ============================================
-- Online Examination Platform - Supabase Schema
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'examiner', 'student')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    avatar_url TEXT,
    phone TEXT,
    institution TEXT,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    code TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topics table
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exams table
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES public.subjects(id),
    examiner_id UUID REFERENCES public.users(id),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
    duration INTEGER NOT NULL DEFAULT 60, -- in minutes
    total_marks INTEGER NOT NULL DEFAULT 100,
    passing_marks INTEGER DEFAULT 40,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    max_attempts INTEGER DEFAULT 1,
    shuffle_questions BOOLEAN DEFAULT false,
    shuffle_options BOOLEAN DEFAULT false,
    negative_marking BOOLEAN DEFAULT false,
    negative_marking_value DECIMAL(3,2) DEFAULT 0.25,
    show_result_immediately BOOLEAN DEFAULT true,
    allow_review BOOLEAN DEFAULT true,
    instructions TEXT,
    proctoring_enabled BOOLEAN DEFAULT true,
    webcam_interval INTEGER DEFAULT 30, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id),
    topic_id UUID REFERENCES public.topics(id),
    type TEXT NOT NULL CHECK (type IN ('mcq', 'multi_select', 'true_false', 'fill_blank', 'descriptive', 'coding')),
    question TEXT NOT NULL,
    options JSONB DEFAULT '[]', -- Array of {id, text, isCorrect, order}
    correct_answer TEXT, -- For single answer, or JSON array for multiple
    marks INTEGER NOT NULL DEFAULT 5,
    negative_marks DECIMAL(3,2) DEFAULT 0,
    explanation TEXT,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    tags TEXT[],
    code_template TEXT,
    test_cases JSONB DEFAULT '[]',
    "order" INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exam Attempts table
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.users(id),
    attempt_number INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'evaluated', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER, -- in seconds
    total_marks INTEGER,
    obtained_marks DECIMAL(10,2),
    percentage DECIMAL(5,2),
    result TEXT CHECK (result IN ('pass', 'fail', 'pending')),
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Answers table
CREATE TABLE IF NOT EXISTS public.student_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id),
    answer TEXT, -- Can be single value or JSON array
    marks_obtained DECIMAL(10,2),
    is_correct BOOLEAN,
    time_spent INTEGER, -- in seconds
    answered_at TIMESTAMP WITH TIME ZONE,
    for_review BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proctor Logs table
CREATE TABLE IF NOT EXISTS public.proctor_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('tab_switch', 'copy_paste', 'right_click', 'fullscreen_exit', 'webcam_violation', 'multiple_faces', 'no_face', 'ip_change', 'login')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details TEXT,
    screenshot_url TEXT,
    severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    attempt_id UUID REFERENCES public.exam_attempts(id),
    sender_id UUID REFERENCES public.users(id),
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL,
    message TEXT NOT NULL,
    is_announcement BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_exams_examiner ON public.exams(examiner_id);
CREATE INDEX IF NOT EXISTS idx_exams_status ON public.exams(status);
CREATE INDEX IF NOT EXISTS idx_questions_exam ON public.questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_attempts_exam ON public.exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON public.exam_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON public.exam_attempts(status);
CREATE INDEX IF NOT EXISTS idx_answers_attempt ON public.student_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_proctor_logs_attempt ON public.proctor_logs(attempt_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proctor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users policies
CREATE POLICY "Users can view their own profile" 
    ON public.users FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" 
    ON public.users FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert users" 
    ON public.users FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update users" 
    ON public.users FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can update their own profile" 
    ON public.users FOR UPDATE 
    USING (auth.uid() = id);

-- Subjects policies
CREATE POLICY "Anyone can view subjects" 
    ON public.subjects FOR SELECT 
    TO authenticated USING (true);

CREATE POLICY "Admins and examiners can manage subjects" 
    ON public.subjects FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'examiner')));

-- Topics policies
CREATE POLICY "Anyone can view topics" 
    ON public.topics FOR SELECT 
    TO authenticated USING (true);

CREATE POLICY "Admins and examiners can manage topics" 
    ON public.topics FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'examiner')));

-- Exams policies
CREATE POLICY "Anyone can view active exams" 
    ON public.exams FOR SELECT 
    TO authenticated USING (status = 'active' OR status = 'scheduled');

CREATE POLICY "Examiners can view their own exams" 
    ON public.exams FOR SELECT 
    TO authenticated USING (examiner_id = auth.uid());

CREATE POLICY "Admins can view all exams" 
    ON public.exams FOR SELECT 
    TO authenticated USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Examiners can manage their exams" 
    ON public.exams FOR ALL 
    USING (examiner_id = auth.uid());

CREATE POLICY "Admins can manage all exams" 
    ON public.exams FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Questions policies
CREATE POLICY "Anyone can view questions of active exams" 
    ON public.questions FOR SELECT 
    TO authenticated USING (EXISTS (SELECT 1 FROM public.exams WHERE id = exam_id AND status IN ('active', 'scheduled', 'completed')));

CREATE POLICY "Examiners can manage their questions" 
    ON public.questions FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.exams WHERE id = exam_id AND examiner_id = auth.uid()));

CREATE POLICY "Admins can manage all questions" 
    ON public.questions FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Exam Attempts policies
CREATE POLICY "Students can view their own attempts" 
    ON public.exam_attempts FOR SELECT 
    TO authenticated USING (student_id = auth.uid());

CREATE POLICY "Examiners can view attempts for their exams" 
    ON public.exam_attempts FOR SELECT 
    TO authenticated USING (EXISTS (SELECT 1 FROM public.exams WHERE id = exam_id AND examiner_id = auth.uid()));

CREATE POLICY "Admins can view all attempts" 
    ON public.exam_attempts FOR SELECT 
    TO authenticated USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Students can create their own attempts" 
    ON public.exam_attempts FOR INSERT 
    TO authenticated WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own attempts" 
    ON public.exam_attempts FOR UPDATE 
    TO authenticated USING (student_id = auth.uid());

-- Student Answers policies
CREATE POLICY "Students can view their own answers" 
    ON public.student_answers FOR SELECT 
    TO authenticated USING (EXISTS (SELECT 1 FROM public.exam_attempts WHERE id = attempt_id AND student_id = auth.uid()));

CREATE POLICY "Examiners can view answers for their exams" 
    ON public.student_answers FOR SELECT 
    TO authenticated USING (EXISTS (SELECT 1 FROM public.exam_attempts ea JOIN public.exams e ON ea.exam_id = e.id WHERE ea.id = attempt_id AND e.examiner_id = auth.uid()));

CREATE POLICY "Students can create their own answers" 
    ON public.student_answers FOR INSERT 
    TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.exam_attempts WHERE id = attempt_id AND student_id = auth.uid()));

CREATE POLICY "Students can update their own answers" 
    ON public.student_answers FOR UPDATE 
    TO authenticated USING (EXISTS (SELECT 1 FROM public.exam_attempts WHERE id = attempt_id AND student_id = auth.uid()));

-- Proctor Logs policies
CREATE POLICY "Students can view their own proctor logs" 
    ON public.proctor_logs FOR SELECT 
    TO authenticated USING (EXISTS (SELECT 1 FROM public.exam_attempts WHERE id = attempt_id AND student_id = auth.uid()));

CREATE POLICY "Examiners can view proctor logs for their exams" 
    ON public.proctor_logs FOR SELECT 
    TO authenticated USING (EXISTS (SELECT 1 FROM public.exam_attempts ea JOIN public.exams e ON ea.exam_id = e.id WHERE ea.id = attempt_id AND e.examiner_id = auth.uid()));

CREATE POLICY "Anyone can create proctor logs" 
    ON public.proctor_logs FOR INSERT 
    TO authenticated WITH CHECK (true);

-- Chat Messages policies
CREATE POLICY "Anyone can view chat messages for their exams" 
    ON public.chat_messages FOR SELECT 
    TO authenticated USING (EXISTS (SELECT 1 FROM public.exam_attempts WHERE exam_id = chat_messages.exam_id AND student_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.exams WHERE id = exam_id AND examiner_id = auth.uid()));

CREATE POLICY "Anyone can send chat messages" 
    ON public.chat_messages FOR INSERT 
    TO authenticated WITH CHECK (true);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
    ON public.notifications FOR SELECT 
    TO authenticated USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" 
    ON public.notifications FOR INSERT 
    TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
    ON public.notifications FOR UPDATE 
    TO authenticated USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON public.topics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON public.exams
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attempts_updated_at BEFORE UPDATE ON public.exam_attempts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name, role, status, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        'active',
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- REALTIME SETUP
-- ============================================

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.exam_attempts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_answers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.proctor_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============================================
-- SEED DATA (Optional)
-- ============================================

-- Insert default admin user (you'll need to create this user in auth.users first)
-- Then run: INSERT INTO public.users (id, email, first_name, last_name, role) VALUES ('your-auth-uid', 'admin@example.com', 'Admin', 'User', 'admin');

-- Insert sample subjects
INSERT INTO public.subjects (name, description, code) VALUES
    ('Computer Science', 'Computer Science and Programming', 'CS'),
    ('Mathematics', 'Mathematics and Statistics', 'MATH'),
    ('Physics', 'Physics and Applied Sciences', 'PHY')
ON CONFLICT DO NOTHING;

-- Insert sample topics
INSERT INTO public.topics (subject_id, name, description) 
SELECT 
    s.id,
    t.name,
    t.description
FROM public.subjects s
CROSS JOIN (VALUES 
    ('Data Structures', 'Arrays, Linked Lists, Trees, Graphs'),
    ('Algorithms', 'Sorting, Searching, Dynamic Programming'),
    ('Web Development', 'HTML, CSS, JavaScript, React')
) AS t(name, description)
WHERE s.code = 'CS'
ON CONFLICT DO NOTHING;
