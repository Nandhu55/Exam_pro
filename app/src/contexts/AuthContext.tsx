import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase, getCurrentUser, onAuthStateChange } from '@/lib/supabase';
import type { User, UserRole } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  institution?: string;
  department?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (data) {
        const userData = data as any;
        return {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.role as UserRole,
          status: userData.status as 'active' | 'inactive' | 'suspended',
          avatar: userData.avatar_url || undefined,
          phone: userData.phone || undefined,
          institution: userData.institution || undefined,
          department: userData.department || undefined,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
          lastLogin: userData.last_login || undefined,
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
      setIsLoading(false);
    };

    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() } as any)
          .eq('id', data.user.id);

        const profile = await fetchUserProfile(data.user.id);
        setUser(profile);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  }, [fetchUserProfile]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role || 'student',
            institution: data.institution,
            department: data.department,
          },
        },
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // The trigger will create the user profile automatically
        const profile = await fetchUserProfile(authData.user.id);
        setUser(profile);
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  }, [fetchUserProfile]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  const hasRole = useCallback((roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      if (!user) return { success: false, error: 'Not authenticated' };

      const updateData: any = {};
      if (updates.firstName) updateData.first_name = updates.firstName;
      if (updates.lastName) updateData.last_name = updates.lastName;
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.institution) updateData.institution = updates.institution;
      if (updates.department) updateData.department = updates.department;
      if (updates.avatar) updateData.avatar_url = updates.avatar;

      const { error } = await supabase
        .from('users')
        .update(updateData as any)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Refresh user profile
      const profile = await fetchUserProfile(user.id);
      setUser(profile);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Update failed' };
    }
  }, [user, fetchUserProfile]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
