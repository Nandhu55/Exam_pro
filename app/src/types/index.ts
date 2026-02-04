// User Roles
export type UserRole = 'admin' | 'examiner' | 'student';

// User Status
export type UserStatus = 'active' | 'inactive' | 'suspended';

// Exam Status
export type ExamStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';

// Question Types
export type QuestionType = 'mcq' | 'multi_select' | 'true_false' | 'fill_blank' | 'descriptive' | 'coding';

// Attempt Status
export type AttemptStatus = 'in_progress' | 'submitted' | 'evaluated' | 'abandoned';

// Proctoring Event Types
export type ProctorEventType = 
  | 'tab_switch' 
  | 'copy_paste' 
  | 'right_click' 
  | 'fullscreen_exit' 
  | 'webcam_violation' 
  | 'multiple_faces' 
  | 'no_face' 
  | 'ip_change'
  | 'login';

// User Interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  institution?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  metadata?: Record<string, any>;
}

// Subject Interface
export interface Subject {
  id: string;
  name: string;
  description?: string;
  code?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Topic Interface
export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Question Option Interface
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

// Question Interface
export interface Question {
  id: string;
  examId?: string;
  subjectId?: string;
  topicId?: string;
  type: QuestionType;
  question: string;
  options: QuestionOption[];
  correctAnswer?: string | string[];
  marks: number;
  negativeMarks?: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  codeTemplate?: string;
  testCases?: TestCase[];
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Test Case Interface (for coding questions)
export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  marks: number;
}

// Exam Interface
export interface Exam {
  id: string;
  title: string;
  description?: string;
  subjectId?: string;
  examinerId: string;
  status: ExamStatus;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks?: number;
  startTime?: string;
  endTime?: string;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  negativeMarking: boolean;
  negativeMarkingValue?: number;
  showResultImmediately: boolean;
  allowReview: boolean;
  instructions?: string;
  proctoringEnabled: boolean;
  webcamInterval?: number; // in seconds
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

// Exam Attempt Interface
export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  attemptNumber: number;
  status: AttemptStatus;
  startedAt: string;
  submittedAt?: string;
  timeSpent?: number; // in seconds
  totalMarks?: number;
  obtainedMarks?: number;
  percentage?: number;
  result?: 'pass' | 'fail' | 'pending';
  ipAddress?: string;
  userAgent?: string;
  answers: StudentAnswer[];
  proctorLogs: ProctorLog[];
}

// Student Answer Interface
export interface StudentAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  answer: string | string[];
  marksObtained?: number;
  isCorrect?: boolean;
  timeSpent?: number;
  answeredAt?: string;
  forReview: boolean;
}

// Proctor Log Interface
export interface ProctorLog {
  id: string;
  attemptId: string;
  eventType: ProctorEventType;
  timestamp: string;
  details?: string;
  screenshotUrl?: string;
  severity: 'low' | 'medium' | 'high';
}

// Live Exam Session Interface
export interface LiveExamSession {
  attemptId: string;
  studentId: string;
  studentName: string;
  examId: string;
  examTitle: string;
  startedAt: string;
  timeRemaining: number;
  currentQuestion?: number;
  totalQuestions: number;
  answeredQuestions: number;
  status: 'active' | 'paused' | 'submitted';
  warnings: number;
  isOnline: boolean;
  lastActivity: string;
}

// Analytics Interface
export interface ExamAnalytics {
  examId: string;
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  averageTimeSpent: number;
  scoreDistribution: { range: string; count: number }[];
  questionWisePerformance: {
    questionId: string;
    correctAttempts: number;
    wrongAttempts: number;
    averageTime: number;
  }[];
}

// Student Performance Interface
export interface StudentPerformance {
  studentId: string;
  studentName: string;
  totalExams: number;
  completedExams: number;
  averageScore: number;
  highestScore: number;
  topicWisePerformance: {
    topicId: string;
    topicName: string;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
  }[];
  recentAttempts: {
    examId: string;
    examTitle: string;
    score: number;
    completedAt: string;
  }[];
}

// Notification Interface
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// Chat Message Interface
export interface ChatMessage {
  id: string;
  examId: string;
  attemptId?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
  isAnnouncement: boolean;
}

// Dashboard Stats Interface
export interface DashboardStats {
  totalUsers: number;
  totalExams: number;
  totalAttempts: number;
  activeExams: number;
  recentExams: Exam[];
  recentAttempts: ExamAttempt[];
  performanceTrend: { date: string; score: number }[];
}

// Filter Options Interface
export interface FilterOptions {
  search?: string;
  role?: UserRole;
  status?: ExamStatus | UserStatus;
  subject?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// API Response Interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
  page?: number;
  totalPages?: number;
}

// WebSocket Events
export interface WebSocketEvents {
  // Client to Server
  'join-exam': { examId: string; attemptId: string };
  'leave-exam': { attemptId: string };
  'answer-update': { attemptId: string; questionId: string; answer: any };
  'exam-submit': { attemptId: string };
  'proctor-event': { attemptId: string; event: ProctorEventType; details?: string };
  'chat-message': { examId: string; message: string; attemptId?: string };
  
  // Server to Client
  'exam-started': { examId: string; startTime: string };
  'exam-ended': { examId: string };
  'time-update': { timeRemaining: number };
  'answer-saved': { questionId: string; success: boolean };
  'warning-issued': { message: string; severity: 'low' | 'medium' | 'high' };
  'exam-submitted': { attemptId: string; success: boolean };
  'new-chat-message': ChatMessage;
  'student-joined': { studentId: string; studentName: string };
  'student-left': { studentId: string };
  'proctor-alert': { attemptId: string; event: ProctorEventType; studentName: string };
}
