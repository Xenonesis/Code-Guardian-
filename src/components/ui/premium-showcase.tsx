import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Star, Sparkles, Brain, Lock, Rocket, Globe } from 'lucide-react';

export const PremiumShowcase: React.FC = () => {
  return (
    <div className="container-responsive py-16 space-y-16">
      {/* Premium Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-responsive-6xl font-bold gradient-text-enterprise text-enterprise-heading">
            Enterprise-Grade
          </h1>
          <h2 className="text-responsive-4xl font-bold gradient-text-enterprise text-enterprise-heading">
            AI Security Platform
          </h2>
        </div>
        <p className="text-responsive-lg text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
          Experience the future of code security with our premium enterprise-grade platform featuring 
          ultra-modern design, advanced AI capabilities, and unparalleled performance.
        </p>
        
        {/* Premium Feature Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <div className="glass-ultra px-6 py-3 rounded-2xl shadow-enterprise-lg hover:shadow-glow-blue transition-all duration-700 hover:scale-110">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Enterprise Security
              </span>
            </div>
          </div>
          <div className="glass-ultra px-6 py-3 rounded-2xl shadow-enterprise-lg hover:shadow-glow-purple transition-all duration-700 hover:scale-110">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-400" />
              <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI-Powered
              </span>
            </div>
          </div>
          <div className="glass-ultra px-6 py-3 rounded-2xl shadow-enterprise-lg hover:shadow-glow-blue transition-all duration-700 hover:scale-110">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-yellow-400" />
              <span className="font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Real-Time
              </span>
            </div>
          </div>
        </div>

        {/* Premium CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
          <Button size="xl" variant="ultra" className="btn-enterprise min-w-[280px]">
            <Brain className="h-6 w-6 mr-3" />
            Start AI Analysis
            <Sparkles className="h-6 w-6 ml-3" />
          </Button>
          <Button size="xl" variant="glass" className="min-w-[280px]">
            <Rocket className="h-6 w-6 mr-3" />
            Live Demo
          </Button>
        </div>
      </section>

      {/* Premium Cards Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h3 className="text-responsive-3xl font-bold gradient-text-enterprise text-enterprise-heading">
            Premium Features
          </h3>
          <p className="text-responsive-lg text-slate-600 dark:text-slate-300">
            Discover our enterprise-grade capabilities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card variant="modern" className="group">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl gradient-enterprise shadow-glow-blue animate-float-enterprise">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <Badge variant="default" className="badge-modern-primary">
                  Enterprise
                </Badge>
              </div>
              <CardTitle className="gradient-text-enterprise">
                Advanced Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Military-grade encryption and enterprise-level security protocols 
                to protect your most sensitive code assets.
              </p>
            </CardContent>
          </Card>

          <Card variant="glass" className="group">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl gradient-enterprise shadow-glow-purple animate-float-enterprise" style={{animationDelay: '1s'}}>
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <Badge variant="default" className="badge-modern-success">
                  AI-Powered
                </Badge>
              </div>
              <CardTitle className="gradient-text-enterprise">
                Intelligent Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Advanced machine learning algorithms that understand context 
                and provide intelligent security recommendations.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated" className="group">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl gradient-enterprise shadow-glow-blue animate-float-enterprise" style={{animationDelay: '2s'}}>
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <Badge variant="default" className="badge-modern-warning">
                  Performance
                </Badge>
              </div>
              <CardTitle className="gradient-text-enterprise">
                Lightning Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Optimized for speed with real-time analysis capabilities 
                that scale to enterprise-level codebases.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h3 className="text-responsive-3xl font-bold gradient-text-enterprise text-enterprise-heading">
            Trusted by Enterprises
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '100M+', label: 'Lines Analyzed', color: 'from-blue-400 to-indigo-400' },
            { value: '500K+', label: 'Threats Detected', color: 'from-emerald-400 to-teal-400' },
            { value: '99.9%', label: 'Accuracy Rate', color: 'from-purple-400 to-pink-400' },
            { value: '10K+', label: 'Enterprise Users', color: 'from-orange-400 to-red-400' }
          ].map((stat, index) => (
            <div key={index} className="text-center group hover:scale-110 transition-all duration-500">
              <div className="glass-ultra p-8 rounded-3xl shadow-enterprise-lg hover:shadow-glow-blue transition-all duration-700">
                <div className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3 animate-pulse-enterprise`}>
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-semibold">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PremiumShowcase;