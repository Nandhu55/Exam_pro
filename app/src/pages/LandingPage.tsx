import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  GraduationCap,
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
  MapPin,
  ChevronDown,
  Play,
  Award,
  TrendingUp,
  Eye,
  Smartphone,
  MessageSquare,
  Calendar,
  Download,
  HelpCircle,
  Plus,
  Minus,
} from 'lucide-react';

// Animation hook
function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

// Animated Section Component
function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Counter Animation Component
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: LayoutDashboard,
      title: 'Intuitive Dashboard',
      description: 'Clean, modern interface for easy navigation and exam management with real-time analytics.',
    },
    {
      icon: Shield,
      title: 'Secure Exam Browser',
      description: 'Lockdown browser environment prevents cheating and unauthorized access during exams.',
    },
    {
      icon: Eye,
      title: 'Real-time Monitoring',
      description: 'Live proctoring with AI-powered suspicious activity detection and alerts.',
    },
    {
      icon: CheckCircle,
      title: 'Automated Grading',
      description: 'Instant results for objective questions with detailed analytics and reporting.',
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Reports',
      description: 'In-depth performance analysis and exportable statistics for better insights.',
    },
    {
      icon: Smartphone,
      title: 'Multi-device Support',
      description: 'Works seamlessly on desktop, tablet, and mobile devices for flexibility.',
    },
  ];

  const steps = [
    {
      icon: FileText,
      title: 'Create Exam',
      description: 'Set up your exam with custom questions, time limits, and rules in minutes.',
    },
    {
      icon: Users,
      title: 'Invite Candidates',
      description: 'Send secure invitation links to students or candidates via email.',
    },
    {
      icon: Monitor,
      title: 'Monitor Live',
      description: 'Watch exam progress in real-time with advanced proctoring features.',
    },
    {
      icon: Award,
      title: 'Get Results',
      description: 'Receive instant automated grading and detailed analytics reports.',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Department Head',
      institution: 'Harvard University',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      quote: 'ExamPlatform has transformed our examination process. The security features and ease of use are unmatched.',
      rating: 5,
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Online Learning Director',
      institution: 'Stanford Online',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      quote: 'Real-time monitoring gives us confidence in online assessments. Highly recommended for any institution!',
      rating: 5,
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Curriculum Coordinator',
      institution: 'MIT Distance Learning',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      quote: 'The analytics and reporting have helped us improve our courses significantly. Outstanding platform!',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: 29,
      description: 'Perfect for small institutions',
      features: [
        'Up to 100 students',
        '10 exams per month',
        'Basic analytics',
        'Email support',
        'Standard security',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      price: 79,
      description: 'For growing institutions',
      features: [
        'Up to 500 students',
        'Unlimited exams',
        'Advanced analytics',
        'Priority support',
        'AI proctoring',
        'Custom branding',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'For large organizations',
      features: [
        'Unlimited students',
        'Unlimited exams',
        'Full analytics suite',
        '24/7 dedicated support',
        'Advanced security',
        'API access',
        'Custom integrations',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const faqs = [
    {
      question: 'How secure is the exam platform?',
      answer: 'Our platform uses bank-grade encryption, secure browser lockdown, AI-powered proctoring, and comprehensive audit logs. All data is encrypted at rest and in transit, and we comply with GDPR, FERPA, and other major data protection regulations.',
    },
    {
      question: 'Can I customize the exam interface?',
      answer: 'Yes! You can fully customize the exam interface with your institution\'s branding, including logos, colors, and custom instructions. You can also configure question types, time limits, and scoring rules to match your requirements.',
    },
    {
      question: 'What types of questions are supported?',
      answer: 'We support multiple question types including Multiple Choice (MCQ), Multi-Select, True/False, Fill in the Blanks, Descriptive/Essay, and even Coding questions with integrated compilers for 20+ programming languages.',
    },
    {
      question: 'How does the AI proctoring work?',
      answer: 'Our AI proctoring monitors students via webcam, detects tab switching, prevents copy-paste, tracks eye movements, and identifies suspicious behaviors. All activities are logged and can be reviewed later by administrators.',
    },
    {
      question: 'Can I integrate with my existing LMS?',
      answer: 'Absolutely! We offer integrations with popular LMS platforms like Canvas, Blackboard, Moodle, and D2L. We also provide a comprehensive REST API for custom integrations with your existing systems.',
    },
    {
      question: 'What happens if a student loses internet connection?',
      answer: 'Our platform auto-saves answers every few seconds. If connection is lost, students can resume from where they left off once reconnected. The timer pauses during disconnection to ensure fair assessment.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <AnimatedSection>
              <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1.5">
                <Star className="w-3 h-3 mr-1 fill-primary" />
                Trusted by 500+ institutions worldwide
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Online{' '}
                <span className="text-primary relative">
                  Examination
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6C50 2 150 2 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30"/>
                  </svg>
                </span>{' '}
                Platform
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Create, conduct, and evaluate exams with ease. Our secure platform offers real-time monitoring, 
                automated grading, and comprehensive analytics for educational institutions and businesses.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link to={`/${user?.role}/dashboard`}>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                        Start Free Trial
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="gap-2">
                      <Play className="w-4 h-4" />
                      Watch Demo
                    </Button>
                  </>
                )}
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-8">
                {[
                  { value: '500+', label: 'Institutions' },
                  { value: '10M+', label: 'Exams Conducted' },
                  { value: '99.9%', label: 'Uptime' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Right Content - Hero Illustration */}
            <AnimatedSection delay={200} className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl transform rotate-3" />
                <img
                  src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop"
                  alt="Online Examination Platform"
                  className="relative rounded-3xl shadow-2xl w-full object-cover"
                />
                
                {/* Floating Cards */}
                <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-xl p-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Exam Completed</p>
                      <p className="text-xs text-muted-foreground">Score: 95%</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Live Students</p>
                      <p className="text-xs text-muted-foreground">1,234 active</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create and manage professional examinations
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">Process</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with ExamPlatform in four simple steps
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="relative text-center">
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  {/* Connector Line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-primary/20" />
                  )}
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: '+', label: 'Institutions' },
              { value: 99.9, suffix: '%', label: 'Uptime Guaranteed' },
              { value: 10, suffix: 'M+', label: 'Exams Conducted' },
              { value: 150, suffix: '+', label: 'Countries Served' },
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 100} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {typeof stat.value === 'number' && stat.value % 1 !== 0 ? (
                    <AnimatedCounter end={stat.value * 10} suffix={stat.suffix} duration={2000} />
                  ) : (
                    <><AnimatedCounter end={stat.value} duration={2000} />{stat.suffix}</>
                  )}
                </p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover why institutions trust our platform
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-primary/20 mb-4" />
                    <p className="text-muted-foreground mb-6">{testimonial.quote}</p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <p className="text-xs text-primary">{testimonial.institution}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <Card className={`h-full relative ${plan.popular ? 'border-primary shadow-xl scale-105' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                    <div className="mb-6">
                      {plan.price ? (
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                      ) : (
                        <div className="text-4xl font-bold">Custom</div>
                      )}
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-slate-900 hover:bg-slate-800'}`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 50}>
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {openFaq === i ? (
                      <Minus className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of institutions already using our platform to conduct secure, 
              efficient online examinations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/60">
              No credit card required
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

// Missing icon imports
function LayoutDashboard(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
