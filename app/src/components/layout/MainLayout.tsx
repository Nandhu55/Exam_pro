import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Menu,
  X,
  ChevronRight,
  Shield,
  Users,
  BarChart3,
  Clock,
  Lock,
  Monitor,
  FileText,
  CheckCircle,
  Globe,
  Zap,
  ArrowRight,
  Star,
  Quote,
  Check,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export function MainLayout() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // Don't show header/footer for auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Exam<span className="text-primary">Platform</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <Link to={`/${user?.role}/dashboard`}>
                  <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                    Dashboard
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-foreground hover:text-primary">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                      Get Started
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left px-4 py-3 text-foreground hover:bg-primary/5 rounded-lg transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-4 border-t space-y-2">
                {isAuthenticated ? (
                  <Link to={`/${user?.role}/dashboard`} className="block w-full">
                    <Button className="w-full bg-primary text-white">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="block w-full">
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/register" className="block w-full">
                      <Button className="w-full bg-primary text-white">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer - Only show on landing page */}
      {location.pathname === '/' && <Footer />}
    </div>
  );
}

function Footer() {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Integrations', 'API Documentation', 'Changelog'],
    Company: ['About Us', 'Blog', 'Careers', 'Contact', 'Partners'],
    Resources: ['Help Center', 'Community', 'Webinars', 'Case Studies', 'Guides'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'],
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                Exam<span className="text-primary">Platform</span>
              </span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              Secure online examination platform for educational institutions and businesses worldwide.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-primary transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2024 ExamPlatform. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              support@examplatform.com
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              1-800-EXAM-PRO
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
