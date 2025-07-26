import React from 'react';
import { Shield, Sparkles, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export const ModernHeroSection: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-4 py-2 text-sm font-medium border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Security Platform
                </Badge>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                    Code Guardian
                  </span>
                  <br />
                  <span className="text-slate-700 dark:text-slate-300">
                    Enterprise
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  Advanced security analysis platform powered by artificial intelligence. 
                  Secure your codebase with comprehensive vulnerability detection and AI-driven insights.
                </p>
              </div>

              {/* Key Features */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Shield, text: "OWASP Top 10 Detection" },
                  { icon: Sparkles, text: "AI-Powered Analysis" },
                  { icon: Play, text: "Real-time Scanning" },
                  { icon: ArrowRight, text: "Instant Results" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <feature.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/" className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                {/* Code Preview */}
                <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-6 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-400 ml-2">security-scan.js</span>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div><span className="text-blue-400">const</span> <span className="text-green-400">scan</span> = <span className="text-yellow-400">await</span> <span className="text-purple-400">codeGuardian</span>.<span className="text-blue-400">analyze</span>();</div>
                    <div><span className="text-slate-500">// ✅ 0 Critical Issues Found</span></div>
                    <div><span className="text-slate-500">// 🛡️ Security Score: 98/100</span></div>
                    <div><span className="text-slate-500">// 🚀 Performance: Excellent</span></div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">98%</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Security Score</div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Critical Issues</div>
                </div>
              </div>

              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-3xl -z-10 transform scale-110"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};