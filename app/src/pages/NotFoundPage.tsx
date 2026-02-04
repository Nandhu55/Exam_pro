import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">Page Not Found</h2>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Go Back
          </Button>
          
          {isAuthenticated ? (
            <Link to={`/${user?.role}/dashboard`}>
              <Button className="bg-primary hover:bg-primary/90">
                <Home className="w-4 h-4 mr-1" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
