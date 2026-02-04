import { supabase } from '@/lib/supabase';
import type {
  User, Exam, Question, ExamAttempt, StudentAnswer, ProctorLog,
  Subject, Topic, ChatMessage, Notification, DashboardStats,
  ExamAnalytics, StudentPerformance, LiveExamSession
} from '@/types';

// ============================================
// User Operations
// ============================================

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(mapUserFromDB) || [];
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data ? mapUserFromDB(data) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data ? mapUserFromDB(data) : null;
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      role: userData.role || 'student',
      status: 'active',
      institution: userData.institution,
      department: userData.department,
    })
    .select()
    .single();

  if (error) throw error;
  return mapUserFromDB(data);
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const updateData: any = {};
  if (updates.firstName) updateData.first_name = updates.firstName;
  if (updates.lastName) updateData.last_name = updates.lastName;
  if (updates.email) updateData.email = updates.email;
  if (updates.role) updateData.role = updates.role;
  if (updates.status) updateData.status = updates.status;
  if (updates.phone) updateData.phone = updates.phone;
  if (updates.institution) updateData.institution = updates.institution;
  if (updates.department) updateData.department = updates.department;
  if (updates.avatar) updateData.avatar_url = updates.avatar;

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data ? mapUserFromDB(data) : null;
}

export async function deleteUser(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  return !error;
}

// ============================================
// Subject Operations
// ============================================

export async function getSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name');

  if (error) throw error;
  return data?.map(mapSubjectFromDB) || [];
}

export async function createSubject(subjectData: Partial<Subject>): Promise<Subject> {
  const { data, error } = await supabase
    .from('subjects')
    .insert({
      name: subjectData.name,
      description: subjectData.description,
      code: subjectData.code,
      created_by: subjectData.createdBy,
    })
    .select()
    .single();

  if (error) throw error;
  return mapSubjectFromDB(data);
}

// ============================================
// Topic Operations
// ============================================

export async function getTopics(): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('name');

  if (error) throw error;
  return data?.map(mapTopicFromDB) || [];
}

export async function getTopicsBySubject(subjectId: string): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('subject_id', subjectId)
    .order('name');

  if (error) throw error;
  return data?.map(mapTopicFromDB) || [];
}

// ============================================
// Exam Operations
// ============================================

export async function getExams(): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select(`
      *,
      questions (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(mapExamFromDB) || [];
}

export async function getExamById(id: string): Promise<Exam | null> {
  const { data, error } = await supabase
    .from('exams')
    .select(`
      *,
      questions (*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data ? mapExamFromDB(data) : null;
}

export async function getExamsByExaminer(examinerId: string): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select(`
      *,
      questions (*)
    `)
    .eq('examiner_id', examinerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(mapExamFromDB) || [];
}

export async function createExam(examData: Partial<Exam>): Promise<Exam> {
  const { data, error } = await supabase
    .from('exams')
    .insert({
      title: examData.title,
      description: examData.description,
      subject_id: examData.subjectId,
      examiner_id: examData.examinerId,
      status: examData.status || 'draft',
      duration: examData.duration || 60,
      total_marks: examData.totalMarks || 100,
      passing_marks: examData.passingMarks,
      start_time: examData.startTime,
      end_time: examData.endTime,
      max_attempts: examData.maxAttempts || 1,
      shuffle_questions: examData.shuffleQuestions || false,
      shuffle_options: examData.shuffleOptions || false,
      negative_marking: examData.negativeMarking || false,
      negative_marking_value: examData.negativeMarkingValue,
      show_result_immediately: examData.showResultImmediately ?? true,
      allow_review: examData.allowReview ?? true,
      instructions: examData.instructions,
      proctoring_enabled: examData.proctoringEnabled ?? true,
      webcam_interval: examData.webcamInterval,
    })
    .select()
    .single();

  if (error) throw error;
  return mapExamFromDB({ ...data, questions: [] });
}

export async function updateExam(id: string, updates: Partial<Exam>): Promise<Exam | null> {
  const updateData: any = {};
  if (updates.title) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.subjectId) updateData.subject_id = updates.subjectId;
  if (updates.status) updateData.status = updates.status;
  if (updates.duration) updateData.duration = updates.duration;
  if (updates.totalMarks) updateData.total_marks = updates.totalMarks;
  if (updates.passingMarks !== undefined) updateData.passing_marks = updates.passingMarks;
  if (updates.startTime !== undefined) updateData.start_time = updates.startTime;
  if (updates.endTime !== undefined) updateData.end_time = updates.endTime;
  if (updates.maxAttempts) updateData.max_attempts = updates.maxAttempts;
  if (updates.shuffleQuestions !== undefined) updateData.shuffle_questions = updates.shuffleQuestions;
  if (updates.shuffleOptions !== undefined) updateData.shuffle_options = updates.shuffleOptions;
  if (updates.negativeMarking !== undefined) updateData.negative_marking = updates.negativeMarking;
  if (updates.negativeMarkingValue !== undefined) updateData.negative_marking_value = updates.negativeMarkingValue;
  if (updates.showResultImmediately !== undefined) updateData.show_result_immediately = updates.showResultImmediately;
  if (updates.allowReview !== undefined) updateData.allow_review = updates.allowReview;
  if (updates.instructions !== undefined) updateData.instructions = updates.instructions;
  if (updates.proctoringEnabled !== undefined) updateData.proctoring_enabled = updates.proctoringEnabled;
  if (updates.webcamInterval !== undefined) updateData.webcam_interval = updates.webcamInterval;

  const { data, error } = await supabase
    .from('exams')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data ? mapExamFromDB({ ...data, questions: [] }) : null;
}

export async function deleteExam(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('exams')
    .delete()
    .eq('id', id);

  return !error;
}

// ============================================
// Question Operations
// ============================================

export async function createQuestion(questionData: Partial<Question>): Promise<Question> {
  const { data, error } = await supabase
    .from('questions')
    .insert({
      exam_id: questionData.examId,
      subject_id: questionData.subjectId,
      topic_id: questionData.topicId,
      type: questionData.type,
      question: questionData.question,
      options: questionData.options || [],
      correct_answer: questionData.correctAnswer,
      marks: questionData.marks || 5,
      negative_marks: questionData.negativeMarks,
      explanation: questionData.explanation,
      difficulty: questionData.difficulty || 'medium',
      tags: questionData.tags,
      code_template: questionData.codeTemplate,
      test_cases: questionData.testCases,
      order: questionData.order || 0,
      created_by: questionData.createdBy,
    })
    .select()
    .single();

  if (error) throw error;
  return mapQuestionFromDB(data);
}

// ============================================
// Exam Attempt Operations
// ============================================

export async function getAttempts(): Promise<ExamAttempt[]> {
  const { data, error } = await supabase
    .from('exam_attempts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(mapAttemptFromDB) || [];
}

export async function getAttemptById(id: string): Promise<ExamAttempt | null> {
  const { data, error } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data ? mapAttemptFromDB(data) : null;
}

export async function getAttemptsByStudent(studentId: string): Promise<ExamAttempt[]> {
  const { data, error } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(mapAttemptFromDB) || [];
}

export async function getAttemptsByExam(examId: string): Promise<ExamAttempt[]> {
  const { data, error } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('exam_id', examId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(mapAttemptFromDB) || [];
}

export async function createAttempt(attemptData: Partial<ExamAttempt>): Promise<ExamAttempt> {
  const { data, error } = await supabase
    .from('exam_attempts')
    .insert({
      exam_id: attemptData.examId,
      student_id: attemptData.studentId,
      attempt_number: attemptData.attemptNumber || 1,
      status: attemptData.status || 'in_progress',
      ip_address: attemptData.ipAddress,
      user_agent: attemptData.userAgent,
    })
    .select()
    .single();

  if (error) throw error;
  return mapAttemptFromDB(data);
}

export async function updateAttempt(id: string, updates: Partial<ExamAttempt>): Promise<ExamAttempt | null> {
  const updateData: any = {};
  if (updates.status) updateData.status = updates.status;
  if (updates.submittedAt) updateData.submitted_at = updates.submittedAt;
  if (updates.timeSpent) updateData.time_spent = updates.timeSpent;
  if (updates.totalMarks) updateData.total_marks = updates.totalMarks;
  if (updates.obtainedMarks) updateData.obtained_marks = updates.obtainedMarks;
  if (updates.percentage) updateData.percentage = updates.percentage;
  if (updates.result) updateData.result = updates.result;

  const { data, error } = await supabase
    .from('exam_attempts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data ? mapAttemptFromDB(data) : null;
}

// ============================================
// Student Answer Operations
// ============================================

export async function saveAnswer(answerData: Partial<StudentAnswer>): Promise<StudentAnswer> {
  const { data, error } = await supabase
    .from('student_answers')
    .insert({
      attempt_id: answerData.attemptId,
      question_id: answerData.questionId,
      answer: answerData.answer,
      for_review: answerData.forReview || false,
      answered_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return mapAnswerFromDB(data);
}

export async function updateAnswer(id: string, updates: Partial<StudentAnswer>): Promise<StudentAnswer | null> {
  const updateData: any = {};
  if (updates.answer !== undefined) updateData.answer = updates.answer;
  if (updates.forReview !== undefined) updateData.for_review = updates.forReview;
  if (updates.timeSpent) updateData.time_spent = updates.timeSpent;

  const { data, error } = await supabase
    .from('student_answers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data ? mapAnswerFromDB(data) : null;
}

// ============================================
// Proctor Log Operations
// ============================================

export async function createProctorLog(logData: Partial<ProctorLog>): Promise<ProctorLog> {
  const { data, error } = await supabase
    .from('proctor_logs')
    .insert({
      attempt_id: logData.attemptId,
      event_type: logData.eventType,
      details: logData.details,
      screenshot_url: logData.screenshotUrl,
      severity: logData.severity || 'low',
    })
    .select()
    .single();

  if (error) throw error;
  return mapProctorLogFromDB(data);
}

export async function getProctorLogsByAttempt(attemptId: string): Promise<ProctorLog[]> {
  const { data, error } = await supabase
    .from('proctor_logs')
    .select('*')
    .eq('attempt_id', attemptId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data?.map(mapProctorLogFromDB) || [];
}

// ============================================
// Chat Message Operations
// ============================================

export async function getChatMessages(examId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('exam_id', examId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data?.map(mapChatMessageFromDB) || [];
}

export async function sendChatMessage(messageData: Partial<ChatMessage>): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      exam_id: messageData.examId,
      attempt_id: messageData.attemptId,
      sender_id: messageData.senderId,
      sender_name: messageData.senderName,
      sender_role: messageData.senderRole,
      message: messageData.message,
      is_announcement: messageData.isAnnouncement || false,
    })
    .select()
    .single();

  if (error) throw error;
  return mapChatMessageFromDB(data);
}

// ============================================
// Notification Operations
// ============================================

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(mapNotificationFromDB) || [];
}

export async function createNotification(notificationData: Partial<Notification>): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: notificationData.userId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      link: notificationData.link,
    })
    .select()
    .single();

  if (error) throw error;
  return mapNotificationFromDB(data);
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);
}

// ============================================
// Real-time Subscriptions
// ============================================

export function subscribeToExamAttempts(examId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`exam-attempts-${examId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'exam_attempts',
        filter: `exam_id=eq.${examId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToChatMessages(examId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`chat-messages-${examId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `exam_id=eq.${examId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToProctorLogs(attemptId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`proctor-logs-${attemptId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'proctor_logs',
        filter: `attempt_id=eq.${attemptId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToNotifications(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

// ============================================
// Dashboard Stats
// ============================================

export async function getDashboardStats(role: string, userId?: string): Promise<DashboardStats> {
  // Get total users
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  // Get total exams
  const { count: totalExams } = await supabase
    .from('exams')
    .select('*', { count: 'exact', head: true });

  // Get total attempts
  const { count: totalAttempts } = await supabase
    .from('exam_attempts')
    .select('*', { count: 'exact', head: true });

  // Get active exams
  const { count: activeExams } = await supabase
    .from('exams')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Get recent exams
  const { data: recentExams } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get recent attempts
  let attemptsQuery = supabase
    .from('exam_attempts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (role === 'student' && userId) {
    attemptsQuery = attemptsQuery.eq('student_id', userId);
  }

  const { data: recentAttempts } = await attemptsQuery;

  return {
    totalUsers: totalUsers || 0,
    totalExams: totalExams || 0,
    totalAttempts: totalAttempts || 0,
    activeExams: activeExams || 0,
    recentExams: recentExams?.map(mapExamFromDB) || [],
    recentAttempts: recentAttempts?.map(mapAttemptFromDB) || [],
    performanceTrend: [],
  };
}

// ============================================
// Mapper Functions
// ============================================

function mapUserFromDB(data: any): User {
  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    status: data.status,
    avatar: data.avatar_url || undefined,
    phone: data.phone || undefined,
    institution: data.institution || undefined,
    department: data.department || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    lastLogin: data.last_login || undefined,
  };
}

function mapSubjectFromDB(data: any): Subject {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    code: data.code,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapTopicFromDB(data: any): Topic {
  return {
    id: data.id,
    subjectId: data.subject_id,
    name: data.name,
    description: data.description,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapExamFromDB(data: any): Exam {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    subjectId: data.subject_id,
    examinerId: data.examiner_id,
    status: data.status,
    duration: data.duration,
    totalMarks: data.total_marks,
    passingMarks: data.passing_marks,
    startTime: data.start_time,
    endTime: data.end_time,
    maxAttempts: data.max_attempts,
    shuffleQuestions: data.shuffle_questions,
    shuffleOptions: data.shuffle_options,
    negativeMarking: data.negative_marking,
    negativeMarkingValue: data.negative_marking_value,
    showResultImmediately: data.show_result_immediately,
    allowReview: data.allow_review,
    instructions: data.instructions,
    proctoringEnabled: data.proctoring_enabled,
    webcamInterval: data.webcam_interval,
    questions: data.questions?.map(mapQuestionFromDB) || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapQuestionFromDB(data: any): Question {
  return {
    id: data.id,
    examId: data.exam_id,
    subjectId: data.subject_id,
    topicId: data.topic_id,
    type: data.type,
    question: data.question,
    options: data.options || [],
    correctAnswer: data.correct_answer,
    marks: data.marks,
    negativeMarks: data.negative_marks,
    explanation: data.explanation,
    difficulty: data.difficulty,
    tags: data.tags,
    codeTemplate: data.code_template,
    testCases: data.test_cases,
    order: data.order,
    createdBy: data.created_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapAttemptFromDB(data: any): ExamAttempt {
  return {
    id: data.id,
    examId: data.exam_id,
    studentId: data.student_id,
    attemptNumber: data.attempt_number,
    status: data.status,
    startedAt: data.started_at,
    submittedAt: data.submitted_at,
    timeSpent: data.time_spent,
    totalMarks: data.total_marks,
    obtainedMarks: data.obtained_marks,
    percentage: data.percentage,
    result: data.result,
    ipAddress: data.ip_address,
    userAgent: data.user_agent,
    answers: [],
    proctorLogs: [],
  };
}

function mapAnswerFromDB(data: any): StudentAnswer {
  return {
    id: data.id,
    attemptId: data.attempt_id,
    questionId: data.question_id,
    answer: data.answer,
    marksObtained: data.marks_obtained,
    isCorrect: data.is_correct,
    timeSpent: data.time_spent,
    answeredAt: data.answered_at,
    forReview: data.for_review,
  };
}

function mapProctorLogFromDB(data: any): ProctorLog {
  return {
    id: data.id,
    attemptId: data.attempt_id,
    eventType: data.event_type,
    timestamp: data.timestamp,
    details: data.details,
    screenshotUrl: data.screenshot_url,
    severity: data.severity,
  };
}

function mapChatMessageFromDB(data: any): ChatMessage {
  return {
    id: data.id,
    examId: data.exam_id,
    attemptId: data.attempt_id,
    senderId: data.sender_id,
    senderName: data.sender_name,
    senderRole: data.sender_role,
    message: data.message,
    timestamp: data.created_at,
    isAnnouncement: data.is_announcement,
  };
}

function mapNotificationFromDB(data: any): Notification {
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    message: data.message,
    type: data.type,
    isRead: data.is_read,
    link: data.link,
    createdAt: data.created_at,
  };
}
