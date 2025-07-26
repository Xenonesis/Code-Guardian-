import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Code, 
  Bug, 
  Search, 
  Brain, 
  Lock, 
  Rocket, 
  Globe, 
  Award, 
  Users,
  Play,
  CheckCircle,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

interface EnhancedHomeHeroProps {
  onStartAnalysis: () => void;
}

export const EnhancedHomeHero: React.FC<EnhancedHomeHeroProps> = ({ onStartAnalysis }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    { icon: Brain, text: "AI-Powered Analysis", color: "from-blue-500 to-indigo-500" },
    { icon: Shield, text: "Enterprise Security", color: "from-emerald-500 to-teal-500" },
    { icon: Zap, text: "Real-Time Scanning", color: "from-yellow-500 to-orange-500" },
    { icon: Target, text: "99.9% Accuracy", color: "from-purple-500 to-pink-500" }
  ];

  const stats = [
    { value: "100M+", label: "Lines Analyzed", icon: Code, gradient: "from-blue-400 to-indigo-400" },
    { value: "500K+", label: "Threats Detected", icon: Shield, gradient: "from-emerald-400 to-teal-400" },
    { value: "99.9%", label: "Accuracy Rate", icon: Target, gradient: "from-purple-400 to-pink-400" },
    { value: "10K+", label: "Enterprise Users", icon: Users, gradient: "from-orange-400 to-red-400" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-50/80 via-blue-50/60 to-indigo-50/80 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-gradient-flow" />
        
        {/* Dynamic Grid Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-800/50 opacity-60" />
        
        {/* Floating Orbs with Enhanced Animation */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400/30 via-teal-400/30 to-cyan-400/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-400/30 to-red-400/30 rounded-full blur-3xl animate-pulse-slow" />

        {/* Interactive Floating Elements */}
        <div className="absolute top-16 left-8 animate-float group cursor-pointer" style={{ animationDelay: "0s" }}>
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl backdrop-blur-xl border border-blue-500/30 shadow-xl hover:scale-125 transition-all duration-700 group-hover:shadow-2xl">
            <Brain className="h-8 w-8 text-blue-400 group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-blue-500/10 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
        
        <div className="absolute top-24 right-12 animate-float group cursor-pointer" style={{ animationDelay: "1s" }}>
          <div className="p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-2xl backdrop-blur-xl border border-red-500/30 shadow-xl hover:scale-125 transition-all duration-700 group-hover:shadow-2xl">
            <Lock className="h-8 w-8 text-red-400 group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-red-500/10 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
        
        <div className="absolute bottom-24 left-16 animate-float group cursor-pointer" style={{ animationDelay: "2s" }}>
          <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl backdrop-blur-xl border border-emerald-500/30 shadow-xl hover:scale-125 transition-all duration-700 group-hover:shadow-2xl">
            <Rocket className="h-8 w-8 text-emerald-400 group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-emerald-500/10 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
        
        <div className="absolute top-40 right-32 animate-float group cursor-pointer" style={{ animationDelay: "3s" }}>
          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl backdrop-blur-xl border border-purple-500/30 shadow-xl hover:scale-125 transition-all duration-700 group-hover:shadow-2xl">
            <Code className="h-8 w-8 text-purple-400 group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-purple-500/10 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
        
        <div className="absolute bottom-32 right-20 animate-float group cursor-pointer" style={{ animationDelay: "4s" }}>
          <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 rounded-2xl backdrop-blur-xl border border-indigo-500/30 shadow-xl hover:scale-125 transition-all duration-700 group-hover:shadow-2xl">
            <Shield className="h-8 w-8 text-indigo-400 group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-indigo-500/10 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
        
        <div className="absolute top-60 left-32 animate-float group cursor-pointer" style={{ animationDelay: "5s" }}>
          <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-2xl backdrop-blur-xl border border-yellow-500/30 shadow-xl hover:scale-125 transition-all duration-700 group-hover:shadow-2xl">
            <Zap className="h-8 w-8 text-yellow-400 group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Status Badge */}
        <div className="flex justify-center mb-8">
          <Badge className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-6 py-3 text-sm font-semibold backdrop-blur-xl hover:scale-105 transition-all duration-300">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse" />
            <Sparkles className="w-4 h-4 mr-2" />
            AI Security Platform • Live & Ready
          </Badge>
        </div>

        {/* Main Heading with Enhanced Typography */}
        <div className="space-y-6 mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none">
            <span className="block bg-gradient-to-r from-slate-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent animate-gradient-flow">
              Next-Gen
            </span>
            <span className="block text-slate-700 dark:text-slate-300 mt-2">
              AI Security
            </span>
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Platform
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl mx-auto font-medium">
            Revolutionary code analysis powered by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              advanced artificial intelligence
            </span>
            . Transform your development workflow with enterprise-grade security.
          </p>
        </div>

        {/* Dynamic Feature Showcase */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-xl border transition-all duration-500 cursor-pointer ${
                  currentFeature === index 
                    ? `bg-gradient-to-r ${feature.color}/20 border-white/40 scale-110 shadow-xl` 
                    : 'bg-white/10 dark:bg-black/10 border-white/20 hover:scale-105'
                }`}
                onClick={() => setCurrentFeature(index)}
              >
                <div className="p-2 rounded-xl bg-gradient-to-r from-current/20 to-current/20">
                  <feature.icon className="h-5 w-5 text-current" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {feature.text}
                </span>
                {currentFeature === index && (
                  <CheckCircle className="h-4 w-4 text-emerald-500 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="space-y-8 mb-16">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={onStartAnalysis}
              size="lg"
              className="group relative overflow-hidden px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl transition-all duration-700 hover:scale-110 focus:scale-110 w-full sm:w-auto min-w-[320px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-center gap-4 text-white">
                <Brain className="h-7 w-7 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300" />
                <span>Start AI Analysis</span>
                <ArrowRight className="h-7 w-7 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="group relative overflow-hidden px-12 py-6 rounded-3xl font-bold text-xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border-2 border-white/30 dark:border-white/20 hover:bg-white/20 dark:hover:bg-black/20 shadow-xl transition-all duration-700 hover:scale-110 w-full sm:w-auto min-w-[320px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative flex items-center justify-center gap-4">
                <Play className="h-7 w-7 group-hover:animate-bounce group-hover:scale-110 transition-all duration-300" />
                <span className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Watch Demo
                </span>
              </div>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Setup in 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative text-center hover:scale-110 transition-all duration-500 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 dark:from-black/10 dark:to-black/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              <div className="relative p-8 rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient}/20`}>
                    <stat.icon className={`h-8 w-8 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                  </div>
                </div>
                <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 animate-pulse`}>
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 pt-12 border-t border-white/20 dark:border-white/10">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Trusted by developers at leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {['Microsoft', 'Google', 'Amazon', 'Meta', 'Apple'].map((company, index) => (
              <div key={index} className="px-6 py-3 bg-white/10 dark:bg-black/10 rounded-xl backdrop-blur-xl border border-white/20 dark:border-white/10">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};