import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Layouts
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ExamLayout } from '@/components/layout/ExamLayout';

// Public Pages
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

// Role-based Dashboards
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { ExaminerDashboard } from '@/pages/examiner/Dashboard';
import { StudentDashboard } from '@/pages/student/Dashboard';

// Admin Pages
import { UserManagement } from '@/pages/admin/UserManagement';
import { ExamManagement } from '@/pages/admin/ExamManagement';
import { SubjectManagement } from '@/pages/admin/SubjectManagement';
import { SystemSettings } from '@/pages/admin/SystemSettings';
import { AdminAnalytics } from '@/pages/admin/Analytics';

// Examiner Pages
import { MyExams } from '@/pages/examiner/MyExams';
import { CreateExam } from '@/pages/examiner/CreateExam';
import { EditExam } from '@/pages/examiner/EditExam';
import { QuestionBank } from '@/pages/examiner/QuestionBank';
import { LiveMonitoring } from '@/pages/examiner/LiveMonitoring';
import { ExamResults } from '@/pages/examiner/ExamResults';
import { ExaminerAnalytics } from '@/pages/examiner/Analytics';

// Student Pages
import { AvailableExams } from '@/pages/student/AvailableExams';
import { TakeExam } from '@/pages/student/TakeExam';
import { MyResults } from '@/pages/student/MyResults';
import { Performance } from '@/pages/student/Performance';
import { PracticeMode } from '@/pages/student/PracticeMode';

// Shared Pages
import { ProfilePage } from '@/pages/ProfilePage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Protected Route Component
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles?: string[];
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
}

// Role-based Dashboard Redirect
function DashboardRouter() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/${user?.role}/dashboard`} replace />;
}

function AppContent() {
  useEffect(() => {
    // Check for connection status
    const handleOnline = () => toast.success('Connected to server');
    const handleOffline = () => toast.error('Connection lost. Some features may not work.');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard Redirect */}
        <Route path="/dashboard" element={<DashboardRouter />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="exams" element={<ExamManagement />} />
          <Route path="subjects" element={<SubjectManagement />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Examiner Routes */}
        <Route path="/examiner" element={
          <ProtectedRoute allowedRoles={['examiner', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<ExaminerDashboard />} />
          <Route path="exams" element={<MyExams />} />
          <Route path="exams/create" element={<CreateExam />} />
          <Route path="exams/edit/:examId" element={<EditExam />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="monitoring/:examId?" element={<LiveMonitoring />} />
          <Route path="results/:examId?" element={<ExamResults />} />
          <Route path="analytics" element={<ExaminerAnalytics />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="exams" element={<AvailableExams />} />
          <Route path="practice" element={<PracticeMode />} />
          <Route path="results" element={<MyResults />} />
          <Route path="performance" element={<Performance />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Exam Taking Route - Special Layout */}
        <Route path="/exam/:examId" element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <ExamLayout />
          </ProtectedRoute>
        }>
          <Route index element={<TakeExam />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
