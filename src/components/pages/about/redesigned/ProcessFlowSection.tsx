import React, { useState } from 'react';
import { Upload, Scan, Brain, FileText, Download, ArrowRight, Play, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  color: string;
  duration: string;
}

export const ProcessFlowSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps: ProcessStep[] = [
    {
      id: 1,
      title: 'Upload Your Code',
      description: 'Drag and drop your files or entire project for analysis',
      icon: <Upload className="w-6 h-6" />,
      details: [
        'Support for ZIP files and individual files',
        'Multiple programming languages',
        'Secure file processing',
        'Instant file validation'
      ],
      color: 'from-blue-500 to-cyan-500',
      duration: '< 5 seconds'
    },
    {
      id: 2,
      title: 'AI-Powered Analysis',
      description: 'Advanced scanning with multiple security engines',
      icon: <Scan className="w-6 h-6" />,
      details: [
        'OWASP Top 10 vulnerability detection',
        'Code quality assessment',
        'Performance bottleneck identification',
        'Dependency vulnerability scanning'
      ],
      color: 'from-purple-500 to-pink-500',
      duration: '30-60 seconds'
    },
    {
      id: 3,
      title: 'Smart Insights',
      description: 'AI generates contextual recommendations and fixes',
      icon: <Brain className="w-6 h-6" />,
      details: [
        'GPT-4 powered analysis',
        'Custom fix suggestions',
        'Priority-based recommendations',
        'Context-aware solutions'
      ],
      color: 'from-green-500 to-emerald-500',
      duration: '10-20 seconds'
    },
    {
      id: 4,
      title: 'Comprehensive Report',
      description: 'Detailed results with actionable insights',
      icon: <FileText className="w-6 h-6" />,
      details: [
        'Interactive dashboard',
        'Detailed vulnerability reports',
        'Export in multiple formats',
        'Shareable team reports'
      ],
      color: 'from-orange-500 to-red-500',
      duration: 'Instant'
    }
  ];

  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-green-700 to-blue-700 dark:from-white dark:via-green-300 dark:to-blue-300 bg-clip-text text-transparent">
                Simple 4-Step Process
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              From upload to insights in under 2 minutes. Our streamlined process delivers comprehensive security analysis with minimal effort.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Process Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`group cursor-pointer transition-all duration-300 ${
                    activeStep === step.id ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <Card className={`border-2 transition-all duration-300 ${
                    activeStep === step.id
                      ? 'border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-lg'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Step Number & Icon */}
                        <div className="flex-shrink-0">
                          <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${step.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                            {step.icon}
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-600">
                              {step.id}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {step.title}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
                            {step.description}
                          </p>
                          
                          {activeStep === step.id && (
                            <div className="space-y-2 animate-fade-in">
                              {step.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span className="text-slate-600 dark:text-slate-400">{detail}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Arrow for non-last items */}
                        {index < steps.length - 1 && (
                          <div className="hidden lg:block absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                            <ArrowRight className="w-6 h-6 text-slate-400 dark:text-slate-600 rotate-90" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Interactive Demo */}
            <div className="lg:sticky lg:top-8">
              <Card className="border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      See It In Action
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Watch how Code Guardian analyzes your code
                    </p>
                  </div>

                  {/* Demo Preview */}
                  <div className="relative bg-slate-900 dark:bg-slate-800 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-slate-400 ml-2 text-sm">code-analysis.js</span>
                    </div>

                    <div className="space-y-3 font-mono text-sm">
                      <div className="text-slate-300">
                        <span className="text-blue-400">const</span> <span className="text-green-400">analysis</span> = <span className="text-yellow-400">await</span> <span className="text-purple-400">codeGuardian</span>.<span className="text-blue-400">scan</span>();
                      </div>
                      
                      {activeStep >= 1 && (
                        <div className="text-green-400 animate-fade-in">
                          ✅ Files uploaded successfully
                        </div>
                      )}
                      
                      {activeStep >= 2 && (
                        <div className="text-yellow-400 animate-fade-in">
                          🔍 Running security analysis...
                        </div>
                      )}
                      
                      {activeStep >= 3 && (
                        <div className="text-purple-400 animate-fade-in">
                          🧠 Generating AI insights...
                        </div>
                      )}
                      
                      {activeStep >= 4 && (
                        <div className="text-blue-400 animate-fade-in">
                          📊 Report generated successfully
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-400">Progress</span>
                        <span className="text-xs text-slate-400">{activeStep}/4 steps</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${(activeStep / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                      <Play className="w-4 h-4 mr-2" />
                      Try It Now
                    </Button>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      No registration required • Free to use
                    </p>
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