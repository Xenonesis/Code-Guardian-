import React, { useEffect, useRef, useState } from 'react';
import { Users, FileCode, Shield, Award, TrendingUp, Globe } from 'lucide-react';
import { getTotalFilesAnalyzed } from '@/services/analysisTracker';

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: string;
}

export const InteractiveStatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats: StatItem[] = [
    {
      icon: <Users className="w-6 h-6" />,
      label: "Enterprise Clients",
      value: "25000",
      description: "Trusted by developers worldwide",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FileCode className="w-6 h-6" />,
      label: "Files Analyzed",
      value: getTotalFilesAnalyzed().toString(),
      description: "Lines of code scanned",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      label: "Vulnerabilities Found",
      value: "150000",
      description: "Security issues detected",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: "Languages Supported",
      value: "20",
      description: "Programming languages",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: "Accuracy Rate",
      value: "98",
      description: "Detection accuracy",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      label: "Countries",
      value: "150",
      description: "Global reach",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          
          // Animate numbers
          stats.forEach((stat, index) => {
            const targetValue = parseInt(stat.value);
            let current = 0;
            const increment = targetValue / 60; // 60 frames for smooth animation
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= targetValue) {
                current = targetValue;
                clearInterval(timer);
              }
              
              setAnimatedValues(prev => {
                const newValues = [...prev];
                newValues[index] = Math.floor(current);
                return newValues;
              });
            }, 16); // ~60fps
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                Trusted by Developers
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Join thousands of developers and organizations who rely on Code Guardian for their security needs
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="space-y-2">
                  <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                    {animatedValues[index]?.toLocaleString() || '0'}
                    {stat.label === "Accuracy Rate" && '%'}
                    {stat.label === "Enterprise Clients" && '+'}
                    {stat.label === "Vulnerabilities Found" && '+'}
                    {stat.label === "Languages Supported" && '+'}
                    {stat.label === "Countries" && '+'}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                      {stat.label}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {stat.description}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-full border border-blue-200 dark:border-blue-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Real-time statistics updated daily
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};