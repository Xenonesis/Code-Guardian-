import React from 'react';
import { Code2, Cpu, Layers, Zap, Sparkles, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { APP_VERSION } from '@/utils/version';

export const TechStackSection: React.FC = () => {
  const techStack = [
    { 
      name: 'React 18', 
      icon: <Code2 className="w-6 h-6" />, 
      color: 'from-blue-500 to-cyan-500',
      description: 'Modern UI framework with concurrent features'
    },
    { 
      name: 'TypeScript', 
      icon: <Layers className="w-6 h-6" />, 
      color: 'from-blue-600 to-indigo-600',
      description: 'Type-safe development experience'
    },
    { 
      name: 'Vite', 
      icon: <Zap className="w-6 h-6" />, 
      color: 'from-purple-500 to-pink-500',
      description: 'Lightning-fast build tool and dev server'
    },
    { 
      name: 'Tailwind CSS', 
      icon: <Cpu className="w-6 h-6" />, 
      color: 'from-teal-500 to-emerald-500',
      description: 'Utility-first CSS framework'
    }
  ];

  const features = [
    { icon: <Star className="w-4 h-4" />, text: "Modern Architecture" },
    { icon: <Zap className="w-4 h-4" />, text: "High Performance" },
    { icon: <Sparkles className="w-4 h-4" />, text: "Developer Experience" },
    { icon: <Layers className="w-4 h-4" />, text: "Scalable Design" }
  ];

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Technology Stack
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-purple-700 to-blue-700 dark:from-white dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                Built with Modern Tech
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Powered by cutting-edge technologies for optimal performance and developer experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Version Info */}
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-blue-950/20 border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                      <Code2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Version {APP_VERSION}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Latest stable release
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-white/70 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-blue-600 dark:text-blue-400">
                          {feature.icon}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                        Production Ready
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Battle-tested in production environments with 99.9% uptime
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {techStack.map((tech, index) => (
                <Card
                  key={index}
                  className="group hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Icon & Name */}
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${tech.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                          {tech.icon}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {tech.name}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {tech.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Integration
                          </span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            100%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className={`h-2 bg-gradient-to-r ${tech.color} rounded-full transition-all duration-1000 group-hover:w-full`} style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Bundle Size', value: '< 2MB', color: 'text-green-600' },
              { label: 'Load Time', value: '< 1s', color: 'text-blue-600' },
              { label: 'Performance', value: '98/100', color: 'text-purple-600' },
              { label: 'Accessibility', value: 'AAA', color: 'text-orange-600' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};