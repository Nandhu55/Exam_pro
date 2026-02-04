import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Welcome back!');
      // Navigate will be handled by auth context
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } else {
      toast.error(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  // Demo credentials helper
  const fillDemoCredentials = (role: string) => {
    const credentials: Record<string, { email: string; password: string }> = {
      admin: { email: 'admin@examplatform.com', password: 'admin123' },
      examiner: { email: 'john.smith@university.edu', password: 'password' },
      student: { email: 'alice.wonder@student.edu', password: 'password' },
    };
    setFormData(prev => ({
      ...prev,
      email: credentials[role].email,
      password: credentials[role].password,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left: Login Form */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                Exam<span className="text-primary">Platform</span>
              </span>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, rememberMe: checked as boolean })
                    }
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Right: Demo Credentials */}
        <div className="hidden lg:block space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Quick Demo Access
            </h2>
            <p className="text-muted-foreground">
              Click any role below to auto-fill demo credentials
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                role: 'admin',
                title: 'Administrator',
                description: 'Full system access and management',
                color: 'bg-purple-500',
                icon: '👨‍💼',
              },
              {
                role: 'examiner',
                title: 'Examiner',
                description: 'Create and monitor exams',
                color: 'bg-blue-500',
                icon: '👨‍🏫',
              },
              {
                role: 'student',
                title: 'Student',
                description: 'Take exams and view results',
                color: 'bg-green-500',
                icon: '👨‍🎓',
              },
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => fillDemoCredentials(item.role)}
                className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-left hover:scale-[1.02]"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <CheckCircle2 className={`w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity ${
                  formData.email.includes(item.role) ? 'opacity-100' : ''
                }`} />
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-white/50 rounded-xl border border-dashed border-primary/30">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> This is a demo environment. All data is reset on page refresh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
