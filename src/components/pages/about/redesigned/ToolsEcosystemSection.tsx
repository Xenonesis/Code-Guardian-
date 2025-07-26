import React, { useState } from 'react';
import { Search, Filter, Star, Download, TrendingUp, Shield, Code, Bug, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Tool {
  name: string;
  language: string;
  type: string;
  description: string;
  rating: number;
  downloads: string;
  color: string;
  icon: React.ReactNode;
}

export const ToolsEcosystemSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const tools: Tool[] = [
    {
      name: 'Bandit',
      language: 'Python',
      type: 'Security Scanner',
      description: 'Advanced Python security scanner for vulnerability detection',
      rating: 4.8,
      downloads: '2M+',
      color: 'from-red-500 to-pink-500',
      icon: <Shield className="w-5 h-5" />
    },
    {
      name: 'ESLint',
      language: 'JavaScript',
      type: 'Code Quality',
      description: 'JavaScript linting utility for code quality and consistency',
      rating: 4.9,
      downloads: '25M+',
      color: 'from-blue-500 to-cyan-500',
      icon: <Code className="w-5 h-5" />
    },
    {
      name: 'SonarQube',
      language: 'Multi-Language',
      type: 'Quality Gate',
      description: 'Comprehensive code quality and security analysis platform',
      rating: 4.7,
      downloads: '5M+',
      color: 'from-green-500 to-emerald-500',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      name: 'Semgrep',
      language: 'Multi-Language',
      type: 'Security Scanner',
      description: 'Fast, open-source static analysis tool for finding bugs',
      rating: 4.6,
      downloads: '1M+',
      color: 'from-purple-500 to-indigo-500',
      icon: <Bug className="w-5 h-5" />
    },
    {
      name: 'CodeQL',
      language: 'Multi-Language',
      type: 'Security Scanner',
      description: 'GitHub\'s semantic code analysis engine',
      rating: 4.8,
      downloads: '3M+',
      color: 'from-orange-500 to-red-500',
      icon: <Shield className="w-5 h-5" />
    },
    {
      name: 'Prettier',
      language: 'Multi-Language',
      type: 'Code Formatter',
      description: 'Opinionated code formatter for consistent styling',
      rating: 4.9,
      downloads: '30M+',
      color: 'from-teal-500 to-cyan-500',
      icon: <Code className="w-5 h-5" />
    }
  ];

  const categories = ['all', 'Security Scanner', 'Code Quality', 'Quality Gate', 'Code Formatter'];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-20 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              Tools Ecosystem
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-orange-700 to-red-700 dark:from-white dark:via-orange-300 dark:to-red-300 bg-clip-text text-transparent">
                Powered by Industry Leaders
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              We integrate with the best security and quality tools to provide comprehensive analysis
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search tools, languages, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {category === 'all' ? 'All Tools' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredTools.map((tool, index) => (
              <Card
                key={index}
                className="group hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                        {tool.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {tool.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {tool.language}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={`bg-gradient-to-r ${tool.color} text-white border-0`}>
                      {tool.type}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {tool.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">{tool.downloads}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Integration Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Security Tools', value: '15+', icon: Shield, color: 'text-red-600' },
              { label: 'Quality Tools', value: '12+', icon: Code, color: 'text-blue-600' },
              { label: 'Languages', value: '20+', icon: Zap, color: 'text-green-600' },
              { label: 'Integrations', value: '50+', icon: TrendingUp, color: 'text-purple-600' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
                <div className={`inline-flex p-3 rounded-xl bg-slate-100 dark:bg-slate-700 mb-3`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Note */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-full border border-green-200 dark:border-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Continuously expanding our tool ecosystem
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};