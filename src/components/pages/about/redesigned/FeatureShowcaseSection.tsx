import React, { useState } from 'react';
import { Shield, Brain, Zap, Database, Code, Lock, CheckCircle, ArrowRight, Eye, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  color: string;
  category: string;
}

export const FeatureShowcaseSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string>('security');

  const features: Feature[] = [
    {
      id: 'security',
      icon: <Shield className="w-8 h-8" />,
      title: 'Advanced Security Analysis',
      description: 'Comprehensive vulnerability detection with OWASP Top 10 compliance and CVE database integration.',
      benefits: ['OWASP Top 10 Detection', 'CVE Database Integration', 'SQL Injection Prevention', 'XSS Protection', 'Authentication Analysis'],
      color: 'from-red-500 to-pink-500',
      category: 'Security'
    },
    {
      id: 'ai',
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Insights',
      description: 'Leverage cutting-edge AI for intelligent code analysis and automated fix suggestions.',
      benefits: ['GPT-4 Integration', 'Claude AI Analysis', 'Smart Recommendations', 'Context Understanding', 'Auto-Fix Generation'],
      color: 'from-purple-500 to-indigo-500',
      category: 'AI & ML'
    },
    {
      id: 'performance',
      icon: <Zap className="w-8 h-8" />,
      title: 'Performance Optimization',
      description: 'Real-time performance monitoring with bottleneck detection and optimization suggestions.',
      benefits: ['Real-time Monitoring', 'Bottleneck Detection', 'Memory Analysis', 'Speed Optimization', 'Resource Tracking'],
      color: 'from-yellow-500 to-orange-500',
      category: 'Performance'
    },
    {
      id: 'quality',
      icon: <Code className="w-8 h-8" />,
      title: 'Code Quality Assessment',
      description: 'Comprehensive code quality analysis with maintainability and complexity metrics.',
      benefits: ['Complexity Analysis', 'Maintainability Score', 'Code Smells Detection', 'Best Practices', 'Technical Debt'],
      color: 'from-blue-500 to-cyan-500',
      category: 'Quality'
    },
    {
      id: 'dependencies',
      icon: <Database className="w-8 h-8" />,
      title: 'Dependency Management',
      description: 'Advanced dependency analysis with vulnerability scanning and update recommendations.',
      benefits: ['Vulnerability Scanning', 'Version Analysis', 'License Compliance', 'Update Suggestions', 'Risk Assessment'],
      color: 'from-green-500 to-emerald-500',
      category: 'Dependencies'
    },
    {
      id: 'compliance',
      icon: <Lock className="w-8 h-8" />,
      title: 'Compliance & Standards',
      description: 'Ensure compliance with industry standards and regulatory requirements.',
      benefits: ['GDPR Compliance', 'SOC 2 Standards', 'ISO 27001', 'HIPAA Requirements', 'PCI DSS'],
      color: 'from-teal-500 to-blue-500',
      category: 'Compliance'
    }
  ];

  const activeFeatureData = features.find(f => f.id === activeFeature) || features[0];

  return (
    <section className="py-20 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Platform Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Comprehensive security and quality analysis tools designed for modern development workflows
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Feature Navigation */}
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`group cursor-pointer transition-all duration-300 ${
                    activeFeature === feature.id ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <Card className={`border-2 transition-all duration-300 ${
                    activeFeature === feature.id
                      ? 'border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          {feature.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {feature.title}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {feature.category}
                            </Badge>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                          {activeFeature === feature.id && (
                            <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Feature Details */}
            <div className="lg:sticky lg:top-8">
              <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${activeFeatureData.color} text-white`}>
                      {activeFeatureData.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {activeFeatureData.title}
                      </h3>
                      <Badge className={`bg-gradient-to-r ${activeFeatureData.color} text-white border-0`}>
                        {activeFeatureData.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
                    {activeFeatureData.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Key Benefits
                    </h4>
                    <div className="grid gap-3">
                      {activeFeatureData.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-slate-200/50 dark:border-slate-700/50"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Ready to try this feature?
                      </span>
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:gap-3 transition-all duration-300">
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};