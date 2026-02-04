export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'admin' | 'examiner' | 'student'
          status: 'active' | 'inactive' | 'suspended'
          avatar_url: string | null
          phone: string | null
          institution: string | null
          department: string | null
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          role?: 'admin' | 'examiner' | 'student'
          status?: 'active' | 'inactive' | 'suspended'
          avatar_url?: string | null
          phone?: string | null
          institution?: string | null
          department?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: 'admin' | 'examiner' | 'student'
          status?: 'active' | 'inactive' | 'suspended'
          avatar_url?: string | null
          phone?: string | null
          institution?: string | null
          department?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          description: string | null
          code: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          code?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          code?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          subject_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          title: string
          description: string | null
          subject_id: string | null
          examiner_id: string
          status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled'
          duration: number
          total_marks: number
          passing_marks: number | null
          start_time: string | null
          end_time: string | null
          max_attempts: number
          shuffle_questions: boolean
          shuffle_options: boolean
          negative_marking: boolean
          negative_marking_value: number | null
          show_result_immediately: boolean
          allow_review: boolean
          instructions: string | null
          proctoring_enabled: boolean
          webcam_interval: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          subject_id?: string | null
          examiner_id: string
          status?: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled'
          duration?: number
          total_marks?: number
          passing_marks?: number | null
          start_time?: string | null
          end_time?: string | null
          max_attempts?: number
          shuffle_questions?: boolean
          shuffle_options?: boolean
          negative_marking?: boolean
          negative_marking_value?: number | null
          show_result_immediately?: boolean
          allow_review?: boolean
          instructions?: string | null
          proctoring_enabled?: boolean
          webcam_interval?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          subject_id?: string | null
          examiner_id?: string
          status?: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled'
          duration?: number
          total_marks?: number
          passing_marks?: number | null
          start_time?: string | null
          end_time?: string | null
          max_attempts?: number
          shuffle_questions?: boolean
          shuffle_options?: boolean
          negative_marking?: boolean
          negative_marking_value?: number | null
          show_result_immediately?: boolean
          allow_review?: boolean
          instructions?: string | null
          proctoring_enabled?: boolean
          webcam_interval?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          exam_id: string | null
          subject_id: string | null
          topic_id: string | null
          type: 'mcq' | 'multi_select' | 'true_false' | 'fill_blank' | 'descriptive' | 'coding'
          question: string
          options: Json
          correct_answer: string | null
          marks: number
          negative_marks: number | null
          explanation: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          tags: string[] | null
          code_template: string | null
          test_cases: Json
          order: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_id?: string | null
          subject_id?: string | null
          topic_id?: string | null
          type: 'mcq' | 'multi_select' | 'true_false' | 'fill_blank' | 'descriptive' | 'coding'
          question: string
          options?: Json
          correct_answer?: string | null
          marks?: number
          negative_marks?: number | null
          explanation?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          tags?: string[] | null
          code_template?: string | null
          test_cases?: Json
          order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exam_id?: string | null
          subject_id?: string | null
          topic_id?: string | null
          type?: 'mcq' | 'multi_select' | 'true_false' | 'fill_blank' | 'descriptive' | 'coding'
          question?: string
          options?: Json
          correct_answer?: string | null
          marks?: number
          negative_marks?: number | null
          explanation?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          tags?: string[] | null
          code_template?: string | null
          test_cases?: Json
          order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exam_attempts: {
        Row: {
          id: string
          exam_id: string
          student_id: string
          attempt_number: number
          status: 'in_progress' | 'submitted' | 'evaluated' | 'abandoned'
          started_at: string
          submitted_at: string | null
          time_spent: number | null
          total_marks: number | null
          obtained_marks: number | null
          percentage: number | null
          result: 'pass' | 'fail' | 'pending' | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          student_id: string
          attempt_number?: number
          status?: 'in_progress' | 'submitted' | 'evaluated' | 'abandoned'
          started_at?: string
          submitted_at?: string | null
          time_spent?: number | null
          total_marks?: number | null
          obtained_marks?: number | null
          percentage?: number | null
          result?: 'pass' | 'fail' | 'pending' | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          student_id?: string
          attempt_number?: number
          status?: 'in_progress' | 'submitted' | 'evaluated' | 'abandoned'
          started_at?: string
          submitted_at?: string | null
          time_spent?: number | null
          total_marks?: number | null
          obtained_marks?: number | null
          percentage?: number | null
          result?: 'pass' | 'fail' | 'pending' | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          answer: string | null
          marks_obtained: number | null
          is_correct: boolean | null
          time_spent: number | null
          answered_at: string | null
          for_review: boolean
          created_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          answer?: string | null
          marks_obtained?: number | null
          is_correct?: boolean | null
          time_spent?: number | null
          answered_at?: string | null
          for_review?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: string
          answer?: string | null
          marks_obtained?: number | null
          is_correct?: boolean | null
          time_spent?: number | null
          answered_at?: string | null
          for_review?: boolean
          created_at?: string
        }
      }
      proctor_logs: {
        Row: {
          id: string
          attempt_id: string
          event_type: 'tab_switch' | 'copy_paste' | 'right_click' | 'fullscreen_exit' | 'webcam_violation' | 'multiple_faces' | 'no_face' | 'ip_change' | 'login'
          timestamp: string
          details: string | null
          screenshot_url: string | null
          severity: 'low' | 'medium' | 'high'
          created_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          event_type: 'tab_switch' | 'copy_paste' | 'right_click' | 'fullscreen_exit' | 'webcam_violation' | 'multiple_faces' | 'no_face' | 'ip_change' | 'login'
          timestamp?: string
          details?: string | null
          screenshot_url?: string | null
          severity?: 'low' | 'medium' | 'high'
          created_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          event_type?: 'tab_switch' | 'copy_paste' | 'right_click' | 'fullscreen_exit' | 'webcam_violation' | 'multiple_faces' | 'no_face' | 'ip_change' | 'login'
          timestamp?: string
          details?: string | null
          screenshot_url?: string | null
          severity?: 'low' | 'medium' | 'high'
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          exam_id: string
          attempt_id: string | null
          sender_id: string
          sender_name: string
          sender_role: string
          message: string
          is_announcement: boolean
          created_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          attempt_id?: string | null
          sender_id: string
          sender_name: string
          sender_role: string
          message: string
          is_announcement?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          attempt_id?: string | null
          sender_id?: string
          sender_name?: string
          sender_role?: string
          message?: string
          is_announcement?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          is_read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
