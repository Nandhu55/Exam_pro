import type {
  User, UserRole, Exam, ExamStatus, Question, QuestionType,
  ExamAttempt, AttemptStatus, ProctorLog, ProctorEventType,
  Subject, Topic, LiveExamSession, ChatMessage, Notification,
  ExamAnalytics, StudentPerformance, DashboardStats
} from '@/types';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@examplatform.com',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'admin',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    phone: '+1-555-0100',
    institution: 'ExamPlatform Inc.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-02-04T10:30:00Z',
  },
  {
    id: 'examiner-1',
    email: 'john.smith@university.edu',
    firstName: 'John',
    lastName: 'Smith',
    role: 'examiner',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    phone: '+1-555-0101',
    institution: 'State University',
    department: 'Computer Science',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-02-04T09:00:00Z',
  },
  {
    id: 'examiner-2',
    email: 'sarah.jones@college.edu',
    firstName: 'Sarah',
    lastName: 'Jones',
    role: 'examiner',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    phone: '+1-555-0102',
    institution: 'City College',
    department: 'Mathematics',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    lastLogin: '2024-02-03T16:45:00Z',
  },
  {
    id: 'student-1',
    email: 'alice.wonder@student.edu',
    firstName: 'Alice',
    lastName: 'Wonder',
    role: 'student',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    phone: '+1-555-0201',
    institution: 'State University',
    department: 'Computer Science',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    lastLogin: '2024-02-04T08:15:00Z',
  },
  {
    id: 'student-2',
    email: 'bob.builder@student.edu',
    firstName: 'Bob',
    lastName: 'Builder',
    role: 'student',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    phone: '+1-555-0202',
    institution: 'State University',
    department: 'Computer Science',
    createdAt: '2024-01-26T00:00:00Z',
    updatedAt: '2024-01-26T00:00:00Z',
    lastLogin: '2024-02-04T07:30:00Z',
  },
  {
    id: 'student-3',
    email: 'charlie.chaplin@student.edu',
    firstName: 'Charlie',
    lastName: 'Chaplin',
    role: 'student',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    phone: '+1-555-0203',
    institution: 'City College',
    department: 'Mathematics',
    createdAt: '2024-01-27T00:00:00Z',
    updatedAt: '2024-01-27T00:00:00Z',
    lastLogin: '2024-02-03T20:00:00Z',
  },
  {
    id: 'student-4',
    email: 'diana.prince@student.edu',
    firstName: 'Diana',
    lastName: 'Prince',
    role: 'student',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana',
    phone: '+1-555-0204',
    institution: 'State University',
    department: 'Computer Science',
    createdAt: '2024-01-28T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
    lastLogin: '2024-02-04T06:45:00Z',
  },
  {
    id: 'student-5',
    email: 'eve.adam@student.edu',
    firstName: 'Eve',
    lastName: 'Adam',
    role: 'student',
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
    phone: '+1-555-0205',
    institution: 'City College',
    department: 'Mathematics',
    createdAt: '2024-01-29T00:00:00Z',
    updatedAt: '2024-01-29T00:00:00Z',
    lastLogin: '2024-01-30T14:20:00Z',
  },
];

// Mock Subjects
export const mockSubjects: Subject[] = [
  {
    id: 'subj-1',
    name: 'Computer Science',
    description: 'Computer Science and Programming',
    code: 'CS',
    createdBy: 'admin-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'subj-2',
    name: 'Mathematics',
    description: 'Mathematics and Statistics',
    code: 'MATH',
    createdBy: 'admin-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'subj-3',
    name: 'Physics',
    description: 'Physics and Applied Sciences',
    code: 'PHY',
    createdBy: 'admin-1',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

// Mock Topics
export const mockTopics: Topic[] = [
  { id: 'topic-1', subjectId: 'subj-1', name: 'Data Structures', description: 'Arrays, Linked Lists, Trees, Graphs', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'topic-2', subjectId: 'subj-1', name: 'Algorithms', description: 'Sorting, Searching, Dynamic Programming', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'topic-3', subjectId: 'subj-1', name: 'Web Development', description: 'HTML, CSS, JavaScript, React', createdAt: '2024-01-02T00:00:00Z', updatedAt: '2024-01-02T00:00:00Z' },
  { id: 'topic-4', subjectId: 'subj-2', name: 'Calculus', description: 'Differential and Integral Calculus', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'topic-5', subjectId: 'subj-2', name: 'Linear Algebra', description: 'Matrices, Vectors, Linear Transformations', createdAt: '2024-01-02T00:00:00Z', updatedAt: '2024-01-02T00:00:00Z' },
];

// Mock Questions
export const createMockQuestions = (examId: string): Question[] => [
  {
    id: `q-${examId}-1`,
    examId,
    subjectId: 'subj-1',
    topicId: 'topic-1',
    type: 'mcq',
    question: 'What is the time complexity of binary search?',
    options: [
      { id: 'opt-1', text: 'O(n)', isCorrect: false, order: 1 },
      { id: 'opt-2', text: 'O(log n)', isCorrect: true, order: 2 },
      { id: 'opt-3', text: 'O(n log n)', isCorrect: false, order: 3 },
      { id: 'opt-4', text: 'O(n²)', isCorrect: false, order: 4 },
    ],
    correctAnswer: 'opt-2',
    marks: 5,
    negativeMarks: 1,
    explanation: 'Binary search divides the search space in half each iteration, resulting in O(log n) complexity.',
    difficulty: 'easy',
    tags: ['algorithms', 'searching'],
    order: 1,
    createdBy: 'examiner-1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: `q-${examId}-2`,
    examId,
    subjectId: 'subj-1',
    topicId: 'topic-1',
    type: 'mcq',
    question: 'Which data structure uses LIFO (Last In First Out) principle?',
    options: [
      { id: 'opt-5', text: 'Queue', isCorrect: false, order: 1 },
      { id: 'opt-6', text: 'Stack', isCorrect: true, order: 2 },
      { id: 'opt-7', text: 'Array', isCorrect: false, order: 3 },
      { id: 'opt-8', text: 'Linked List', isCorrect: false, order: 4 },
    ],
    correctAnswer: 'opt-6',
    marks: 5,
    negativeMarks: 1,
    explanation: 'Stack follows LIFO principle where the last element added is the first one to be removed.',
    difficulty: 'easy',
    tags: ['data-structures'],
    order: 2,
    createdBy: 'examiner-1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: `q-${examId}-3`,
    examId,
    subjectId: 'subj-1',
    topicId: 'topic-2',
    type: 'multi_select',
    question: 'Which of the following sorting algorithms have O(n log n) average time complexity?',
    options: [
      { id: 'opt-9', text: 'Quick Sort', isCorrect: true, order: 1 },
      { id: 'opt-10', text: 'Merge Sort', isCorrect: true, order: 2 },
      { id: 'opt-11', text: 'Bubble Sort', isCorrect: false, order: 3 },
      { id: 'opt-12', text: 'Heap Sort', isCorrect: true, order: 4 },
    ],
    correctAnswer: ['opt-9', 'opt-10', 'opt-12'],
    marks: 10,
    negativeMarks: 2,
    explanation: 'Quick Sort, Merge Sort, and Heap Sort have O(n log n) average time complexity. Bubble Sort is O(n²).',
    difficulty: 'medium',
    tags: ['algorithms', 'sorting'],
    order: 3,
    createdBy: 'examiner-1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: `q-${examId}-4`,
    examId,
    subjectId: 'subj-1',
    topicId: 'topic-2',
    type: 'true_false',
    question: 'Dynamic Programming is an optimization technique that solves problems by breaking them into smaller overlapping subproblems.',
    options: [
      { id: 'opt-13', text: 'True', isCorrect: true, order: 1 },
      { id: 'opt-14', text: 'False', isCorrect: false, order: 2 },
    ],
    correctAnswer: 'opt-13',
    marks: 5,
    negativeMarks: 0,
    explanation: 'Dynamic Programming uses memoization or tabulation to solve overlapping subproblems efficiently.',
    difficulty: 'easy',
    tags: ['algorithms', 'dynamic-programming'],
    order: 4,
    createdBy: 'examiner-1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: `q-${examId}-5`,
    examId,
    subjectId: 'subj-1',
    topicId: 'topic-3',
    type: 'fill_blank',
    question: 'In React, the _______ hook is used to manage state in functional components.',
    options: [],
    correctAnswer: 'useState',
    marks: 5,
    negativeMarks: 0,
    explanation: 'useState is the React hook used to add state to functional components.',
    difficulty: 'easy',
    tags: ['react', 'hooks'],
    order: 5,
    createdBy: 'examiner-1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: `q-${examId}-6`,
    examId,
    subjectId: 'subj-1',
    topicId: 'topic-1',
    type: 'descriptive',
    question: 'Explain the difference between Array and Linked List. Discuss their advantages and disadvantages.',
    options: [],
    marks: 20,
    negativeMarks: 0,
    explanation: 'Arrays offer O(1) random access but fixed size. Linked Lists offer dynamic size but O(n) access time.',
    difficulty: 'medium',
    tags: ['data-structures'],
    order: 6,
    createdBy: 'examiner-1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

// Mock Exams
export const mockExams: Exam[] = [
  {
    id: 'exam-1',
    title: 'Data Structures & Algorithms Mid-Term',
    description: 'Comprehensive assessment of data structures and algorithms concepts covered in the first half of the semester.',
    subjectId: 'subj-1',
    examinerId: 'examiner-1',
    status: 'active',
    duration: 90,
    totalMarks: 50,
    passingMarks: 25,
    startTime: '2024-02-04T09:00:00Z',
    endTime: '2024-02-04T23:59:59Z',
    maxAttempts: 1,
    shuffleQuestions: true,
    shuffleOptions: true,
    negativeMarking: true,
    negativeMarkingValue: 0.25,
    showResultImmediately: true,
    allowReview: true,
    instructions: 'Read all questions carefully. Manage your time wisely. No external resources allowed.',
    proctoringEnabled: true,
    webcamInterval: 30,
    questions: createMockQuestions('exam-1'),
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'exam-2',
    title: 'Web Development Fundamentals',
    description: 'Test your knowledge of HTML, CSS, JavaScript, and React basics.',
    subjectId: 'subj-1',
    examinerId: 'examiner-1',
    status: 'scheduled',
    duration: 60,
    totalMarks: 100,
    passingMarks: 50,
    startTime: '2024-02-10T10:00:00Z',
    endTime: '2024-02-10T16:00:00Z',
    maxAttempts: 2,
    shuffleQuestions: false,
    shuffleOptions: false,
    negativeMarking: false,
    showResultImmediately: true,
    allowReview: true,
    instructions: 'This is an open-book exam. You may refer to documentation.',
    proctoringEnabled: false,
    questions: createMockQuestions('exam-2'),
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'exam-3',
    title: 'Calculus I Final Exam',
    description: 'Final examination covering limits, derivatives, and integrals.',
    subjectId: 'subj-2',
    examinerId: 'examiner-2',
    status: 'completed',
    duration: 120,
    totalMarks: 100,
    passingMarks: 40,
    startTime: '2024-01-20T09:00:00Z',
    endTime: '2024-01-20T12:00:00Z',
    maxAttempts: 1,
    shuffleQuestions: true,
    shuffleOptions: false,
    negativeMarking: false,
    showResultImmediately: false,
    allowReview: false,
    instructions: 'Show all your work. Partial credit will be given.',
    proctoringEnabled: true,
    webcamInterval: 60,
    questions: createMockQuestions('exam-3'),
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z',
  },
  {
    id: 'exam-4',
    title: 'Programming Basics Quiz',
    description: 'Quick assessment of programming fundamentals.',
    subjectId: 'subj-1',
    examinerId: 'examiner-1',
    status: 'draft',
    duration: 30,
    totalMarks: 30,
    passingMarks: 15,
    maxAttempts: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    negativeMarking: false,
    showResultImmediately: true,
    allowReview: true,
    instructions: 'Quick quiz - no pressure!',
    proctoringEnabled: false,
    questions: createMockQuestions('exam-4'),
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

// Mock Exam Attempts
export const mockAttempts: ExamAttempt[] = [
  {
    id: 'attempt-1',
    examId: 'exam-3',
    studentId: 'student-1',
    attemptNumber: 1,
    status: 'evaluated',
    startedAt: '2024-01-20T09:05:00Z',
    submittedAt: '2024-01-20T11:45:00Z',
    timeSpent: 9600,
    totalMarks: 100,
    obtainedMarks: 78,
    percentage: 78,
    result: 'pass',
    ipAddress: '192.168.1.100',
    answers: [],
    proctorLogs: [],
  },
  {
    id: 'attempt-2',
    examId: 'exam-3',
    studentId: 'student-2',
    attemptNumber: 1,
    status: 'evaluated',
    startedAt: '2024-01-20T09:10:00Z',
    submittedAt: '2024-01-20T11:30:00Z',
    timeSpent: 8400,
    totalMarks: 100,
    obtainedMarks: 65,
    percentage: 65,
    result: 'pass',
    ipAddress: '192.168.1.101',
    answers: [],
    proctorLogs: [],
  },
  {
    id: 'attempt-3',
    examId: 'exam-3',
    studentId: 'student-3',
    attemptNumber: 1,
    status: 'evaluated',
    startedAt: '2024-01-20T09:00:00Z',
    submittedAt: '2024-01-20T10:45:00Z',
    timeSpent: 6300,
    totalMarks: 100,
    obtainedMarks: 35,
    percentage: 35,
    result: 'fail',
    ipAddress: '192.168.1.102',
    answers: [],
    proctorLogs: [],
  },
];

// Mock Proctor Logs
export const mockProctorLogs: ProctorLog[] = [
  {
    id: 'log-1',
    attemptId: 'attempt-1',
    eventType: 'login',
    timestamp: '2024-01-20T09:05:00Z',
    details: 'Student logged in from approved IP',
    severity: 'low',
  },
  {
    id: 'log-2',
    attemptId: 'attempt-1',
    eventType: 'tab_switch',
    timestamp: '2024-01-20T10:15:00Z',
    details: 'Student switched tabs 2 times',
    severity: 'medium',
  },
  {
    id: 'log-3',
    attemptId: 'attempt-2',
    eventType: 'login',
    timestamp: '2024-01-20T09:10:00Z',
    details: 'Student logged in successfully',
    severity: 'low',
  },
];

// Mock Live Sessions
export const mockLiveSessions: LiveExamSession[] = [
  {
    attemptId: 'attempt-live-1',
    studentId: 'student-1',
    studentName: 'Alice Wonder',
    examId: 'exam-1',
    examTitle: 'Data Structures & Algorithms Mid-Term',
    startedAt: '2024-02-04T09:00:00Z',
    timeRemaining: 3600,
    currentQuestion: 3,
    totalQuestions: 6,
    answeredQuestions: 2,
    status: 'active',
    warnings: 0,
    isOnline: true,
    lastActivity: '2024-02-04T09:30:00Z',
  },
  {
    attemptId: 'attempt-live-2',
    studentId: 'student-2',
    studentName: 'Bob Builder',
    examId: 'exam-1',
    examTitle: 'Data Structures & Algorithms Mid-Term',
    startedAt: '2024-02-04T09:05:00Z',
    timeRemaining: 3200,
    currentQuestion: 5,
    totalQuestions: 6,
    answeredQuestions: 4,
    status: 'active',
    warnings: 1,
    isOnline: true,
    lastActivity: '2024-02-04T09:28:00Z',
  },
];

// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'chat-1',
    examId: 'exam-1',
    senderId: 'examiner-1',
    senderName: 'John Smith',
    senderRole: 'examiner',
    message: 'Welcome everyone! The exam will begin in 5 minutes. Please ensure your webcam is working.',
    timestamp: '2024-02-04T08:55:00Z',
    isAnnouncement: true,
  },
  {
    id: 'chat-2',
    examId: 'exam-1',
    attemptId: 'attempt-live-1',
    senderId: 'student-1',
    senderName: 'Alice Wonder',
    senderRole: 'student',
    message: 'I am having trouble with question 3. Can you clarify?',
    timestamp: '2024-02-04T09:25:00Z',
    isAnnouncement: false,
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'student-1',
    title: 'New Exam Available',
    message: 'Data Structures & Algorithms Mid-Term is now available.',
    type: 'info',
    isRead: false,
    createdAt: '2024-02-03T10:00:00Z',
    link: '/student/exams/exam-1',
  },
  {
    id: 'notif-2',
    userId: 'student-1',
    title: 'Results Published',
    message: 'Your Calculus I Final Exam results are now available.',
    type: 'success',
    isRead: true,
    createdAt: '2024-01-22T09:00:00Z',
    link: '/student/results/attempt-1',
  },
  {
    id: 'notif-3',
    userId: 'examiner-1',
    title: 'Exam Submitted',
    message: 'A student has submitted their exam for evaluation.',
    type: 'info',
    isRead: false,
    createdAt: '2024-02-04T09:30:00Z',
  },
];

// Mock Analytics
export const mockExamAnalytics: ExamAnalytics = {
  examId: 'exam-3',
  totalAttempts: 45,
  completedAttempts: 43,
  averageScore: 68.5,
  highestScore: 98,
  lowestScore: 22,
  passRate: 72,
  averageTimeSpent: 10500,
  scoreDistribution: [
    { range: '90-100', count: 5 },
    { range: '80-89', count: 8 },
    { range: '70-79', count: 12 },
    { range: '60-69', count: 10 },
    { range: '50-59', count: 5 },
    { range: '40-49', count: 3 },
    { range: '0-39', count: 2 },
  ],
  questionWisePerformance: [
    { questionId: 'q-exam-3-1', correctAttempts: 40, wrongAttempts: 5, averageTime: 45 },
    { questionId: 'q-exam-3-2', correctAttempts: 38, wrongAttempts: 7, averageTime: 60 },
    { questionId: 'q-exam-3-3', correctAttempts: 25, wrongAttempts: 20, averageTime: 120 },
    { questionId: 'q-exam-3-4', correctAttempts: 42, wrongAttempts: 3, averageTime: 30 },
    { questionId: 'q-exam-3-5', correctAttempts: 35, wrongAttempts: 10, averageTime: 90 },
    { questionId: 'q-exam-3-6', correctAttempts: 30, wrongAttempts: 15, averageTime: 300 },
  ],
};

// Mock Student Performance
export const mockStudentPerformances: StudentPerformance[] = [
  {
    studentId: 'student-1',
    studentName: 'Alice Wonder',
    totalExams: 5,
    completedExams: 5,
    averageScore: 82,
    highestScore: 95,
    topicWisePerformance: [
      { topicId: 'topic-1', topicName: 'Data Structures', totalQuestions: 20, correctAnswers: 18, accuracy: 90 },
      { topicId: 'topic-2', topicName: 'Algorithms', totalQuestions: 15, correctAnswers: 12, accuracy: 80 },
      { topicId: 'topic-3', topicName: 'Web Development', totalQuestions: 10, correctAnswers: 8, accuracy: 80 },
    ],
    recentAttempts: [
      { examId: 'exam-3', examTitle: 'Calculus I Final Exam', score: 78, completedAt: '2024-01-20T11:45:00Z' },
    ],
  },
  {
    studentId: 'student-2',
    studentName: 'Bob Builder',
    totalExams: 5,
    completedExams: 4,
    averageScore: 71,
    highestScore: 88,
    topicWisePerformance: [
      { topicId: 'topic-1', topicName: 'Data Structures', totalQuestions: 20, correctAnswers: 15, accuracy: 75 },
      { topicId: 'topic-2', topicName: 'Algorithms', totalQuestions: 15, correctAnswers: 10, accuracy: 67 },
      { topicId: 'topic-3', topicName: 'Web Development', totalQuestions: 10, correctAnswers: 7, accuracy: 70 },
    ],
    recentAttempts: [
      { examId: 'exam-3', examTitle: 'Calculus I Final Exam', score: 65, completedAt: '2024-01-20T11:30:00Z' },
    ],
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: Record<string, DashboardStats> = {
  admin: {
    totalUsers: 128,
    totalExams: 45,
    totalAttempts: 1250,
    activeExams: 3,
    recentExams: mockExams.slice(0, 3),
    recentAttempts: mockAttempts.slice(0, 5),
    performanceTrend: [
      { date: '2024-01-15', score: 72 },
      { date: '2024-01-16', score: 75 },
      { date: '2024-01-17', score: 73 },
      { date: '2024-01-18', score: 78 },
      { date: '2024-01-19', score: 76 },
      { date: '2024-01-20', score: 80 },
      { date: '2024-01-21', score: 82 },
    ],
  },
  examiner: {
    totalUsers: 0,
    totalExams: 12,
    totalAttempts: 156,
    activeExams: 1,
    recentExams: mockExams.filter(e => e.examinerId === 'examiner-1').slice(0, 3),
    recentAttempts: mockAttempts.slice(0, 5),
    performanceTrend: [
      { date: '2024-01-15', score: 70 },
      { date: '2024-01-16', score: 72 },
      { date: '2024-01-17', score: 74 },
      { date: '2024-01-18', score: 73 },
      { date: '2024-01-19', score: 76 },
      { date: '2024-01-20', score: 78 },
      { date: '2024-01-21', score: 77 },
    ],
  },
  student: {
    totalUsers: 0,
    totalExams: 5,
    totalAttempts: 5,
    activeExams: 1,
    recentExams: mockExams.filter(e => e.status === 'active').slice(0, 3),
    recentAttempts: mockAttempts.filter(a => a.studentId === 'student-1'),
    performanceTrend: [
      { date: '2024-01-15', score: 75 },
      { date: '2024-01-16', score: 78 },
      { date: '2024-01-17', score: 80 },
      { date: '2024-01-18', score: 82 },
      { date: '2024-01-19', score: 85 },
      { date: '2024-01-20', score: 78 },
      { date: '2024-01-21', score: 88 },
    ],
  },
};

// Database Service Class
class MockDatabaseService {
  private users = [...mockUsers];
  private exams = [...mockExams];
  private attempts = [...mockAttempts];
  private subjects = [...mockSubjects];
  private topics = [...mockTopics];
  private notifications = [...mockNotifications];
  private chatMessages = [...mockChatMessages];
  private liveSessions = [...mockLiveSessions];

  // User Methods
  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser: User = {
      id: generateId(),
      email: userData.email!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      role: userData.role || 'student',
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generateId()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...updates, updatedAt: new Date().toISOString() };
    return this.users[index];
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  // Exam Methods
  async getExams(): Promise<Exam[]> {
    return this.exams;
  }

  async getExamById(id: string): Promise<Exam | undefined> {
    return this.exams.find(e => e.id === id);
  }

  async createExam(examData: Partial<Exam>): Promise<Exam> {
    const newExam: Exam = {
      id: generateId(),
      title: examData.title!,
      description: examData.description || '',
      examinerId: examData.examinerId!,
      status: 'draft',
      duration: examData.duration || 60,
      totalMarks: examData.totalMarks || 100,
      maxAttempts: examData.maxAttempts || 1,
      shuffleQuestions: examData.shuffleQuestions || false,
      shuffleOptions: examData.shuffleOptions || false,
      negativeMarking: examData.negativeMarking || false,
      showResultImmediately: examData.showResultImmediately || true,
      allowReview: examData.allowReview || true,
      proctoringEnabled: examData.proctoringEnabled || false,
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...examData,
    };
    this.exams.push(newExam);
    return newExam;
  }

  async updateExam(id: string, updates: Partial<Exam>): Promise<Exam | undefined> {
    const index = this.exams.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    this.exams[index] = { ...this.exams[index], ...updates, updatedAt: new Date().toISOString() };
    return this.exams[index];
  }

  async deleteExam(id: string): Promise<boolean> {
    const index = this.exams.findIndex(e => e.id === id);
    if (index === -1) return false;
    this.exams.splice(index, 1);
    return true;
  }

  // Attempt Methods
  async getAttempts(): Promise<ExamAttempt[]> {
    return this.attempts;
  }

  async getAttemptById(id: string): Promise<ExamAttempt | undefined> {
    return this.attempts.find(a => a.id === id);
  }

  async getAttemptsByStudent(studentId: string): Promise<ExamAttempt[]> {
    return this.attempts.filter(a => a.studentId === studentId);
  }

  async getAttemptsByExam(examId: string): Promise<ExamAttempt[]> {
    return this.attempts.filter(a => a.examId === examId);
  }

  async createAttempt(attemptData: Partial<ExamAttempt>): Promise<ExamAttempt> {
    const newAttempt: ExamAttempt = {
      id: generateId(),
      examId: attemptData.examId!,
      studentId: attemptData.studentId!,
      attemptNumber: attemptData.attemptNumber || 1,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      ipAddress: attemptData.ipAddress,
      userAgent: attemptData.userAgent,
      answers: [],
      proctorLogs: [],
      ...attemptData,
    };
    this.attempts.push(newAttempt);
    return newAttempt;
  }

  async updateAttempt(id: string, updates: Partial<ExamAttempt>): Promise<ExamAttempt | undefined> {
    const index = this.attempts.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    this.attempts[index] = { ...this.attempts[index], ...updates };
    return this.attempts[index];
  }

  // Subject Methods
  async getSubjects(): Promise<Subject[]> {
    return this.subjects;
  }

  async createSubject(subjectData: Partial<Subject>): Promise<Subject> {
    const newSubject: Subject = {
      id: generateId(),
      name: subjectData.name!,
      description: subjectData.description || '',
      createdBy: subjectData.createdBy!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.subjects.push(newSubject);
    return newSubject;
  }

  // Topic Methods
  async getTopics(): Promise<Topic[]> {
    return this.topics;
  }

  async getTopicsBySubject(subjectId: string): Promise<Topic[]> {
    return this.topics.filter(t => t.subjectId === subjectId);
  }

  // Notification Methods
  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications.filter(n => n.userId === userId);
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
  }

  // Chat Methods
  async getChatMessages(examId: string): Promise<ChatMessage[]> {
    return this.chatMessages.filter(m => m.examId === examId);
  }

  async sendChatMessage(message: Partial<ChatMessage>): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      id: generateId(),
      examId: message.examId!,
      senderId: message.senderId!,
      senderName: message.senderName!,
      senderRole: message.senderRole!,
      message: message.message!,
      timestamp: new Date().toISOString(),
      isAnnouncement: message.isAnnouncement || false,
      ...message,
    };
    this.chatMessages.push(newMessage);
    return newMessage;
  }

  // Live Session Methods
  async getLiveSessions(examId?: string): Promise<LiveExamSession[]> {
    if (examId) {
      return this.liveSessions.filter(s => s.examId === examId);
    }
    return this.liveSessions;
  }

  // Dashboard Stats
  async getDashboardStats(role: string): Promise<DashboardStats> {
    return mockDashboardStats[role] || mockDashboardStats.student;
  }

  // Analytics
  async getExamAnalytics(examId: string): Promise<ExamAnalytics | undefined> {
    return mockExamAnalytics;
  }

  async getStudentPerformance(studentId: string): Promise<StudentPerformance | undefined> {
    return mockStudentPerformances.find(p => p.studentId === studentId);
  }
}

export const mockDB = new MockDatabaseService();
