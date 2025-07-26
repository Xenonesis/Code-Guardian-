import React, { useState } from 'react';
import { CodeProvenanceCard } from './CodeProvenanceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Demo data with different risk scenarios
const createDemoFiles = (scenario: 'low' | 'medium' | 'high' | 'critical') => {
  const baseFiles = [
    {
      filename: 'src/components/auth/LoginForm.tsx',
      content: `import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication logic
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit">Sign In</Button>
    </form>
  );
};`
    },
    {
      filename: 'src/services/apiService.ts',
      content: `const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export class ApiService {
  private static instance: ApiService;
  private token: string | null = null;
  
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return response.json();
  }
  
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': \`Bearer \${this.token}\` })
    };
  }
}`
    }
  ];

  // Add more files based on scenario to simulate different risk levels
  const additionalFiles = [];
  const fileCount = scenario === 'low' ? 2 : scenario === 'medium' ? 5 : scenario === 'high' ? 8 : 12;
  
  for (let i = baseFiles.length; i < fileCount; i++) {
    additionalFiles.push({
      filename: `src/components/Component${i}.tsx`,
      content: `import React from 'react';

export const Component${i}: React.FC = () => {
  return <div>Component ${i}</div>;
};`
    });
  }

  return [...baseFiles, ...additionalFiles];
};

const scenarios = [
  {
    id: 'low',
    name: 'Low Risk Scenario',
    description: 'Minimal files, no alerts, low risk score',
    color: 'bg-green-100 text-green-800 border-green-300',
    riskScore: 15
  },
  {
    id: 'medium',
    name: 'Medium Risk Scenario', 
    description: 'Some files, few alerts, moderate risk',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    riskScore: 45
  },
  {
    id: 'high',
    name: 'High Risk Scenario',
    description: 'Many files, multiple alerts, high risk',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    riskScore: 75
  },
  {
    id: 'critical',
    name: 'Critical Risk Scenario',
    description: 'Maximum files, many alerts, critical risk',
    color: 'bg-red-100 text-red-800 border-red-300',
    riskScore: 95
  }
] as const;

export const ImprovedCodeProvenanceDemo: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [demoFiles, setDemoFiles] = useState(() => createDemoFiles('medium'));

  const handleScenarioChange = (scenario: 'low' | 'medium' | 'high' | 'critical') => {
    setCurrentScenario(scenario);
    setDemoFiles(createDemoFiles(scenario));
  };

  const currentScenarioInfo = scenarios.find(s => s.id === currentScenario);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      {/* Header Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
              🎯 All Issues Fixed - Enhanced Dashboard
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Experience the fully improved Code Provenance & Integrity Monitoring dashboard with all identified issues resolved and enhanced features implemented.
            </p>
          </div>

          {/* Issue Fixes Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Risk Score Colors</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Fixed color confusion - high risk scores now show in red, with dynamic color coding based on risk level.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Tab Highlighting</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Enhanced tab design with clear active states, color coding, and proper visual hierarchy.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Button Integration</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Improved button placement with dedicated action cards and contextual descriptions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Text Alignment</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Fixed spacing and alignment issues with improved grid layouts and proper typography.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Alert Color Coding</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Dynamic alert colors based on severity levels with proper urgency indication.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
                    <span className="text-white font-bold text-sm">+</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Enhanced Features</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Added tooltips, animated progress bars, and quick action links for better UX.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Scenario Selector */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border-0 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                  <span className="text-white font-bold text-sm">🎮</span>
                </div>
                Interactive Demo Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {scenarios.map((scenario) => (
                  <Button
                    key={scenario.id}
                    onClick={() => handleScenarioChange(scenario.id as any)}
                    variant={currentScenario === scenario.id ? "default" : "outline"}
                    className={`flex-1 ${currentScenario === scenario.id ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : ''}`}
                  >
                    {scenario.name}
                  </Button>
                ))}
              </div>
              {currentScenarioInfo && (
                <div className="flex items-center gap-3">
                  <Badge className={currentScenarioInfo.color}>
                    {currentScenarioInfo.name}
                  </Badge>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {currentScenarioInfo.description}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <CodeProvenanceCard 
            files={demoFiles}
            onInitializeMonitoring={() => {
              console.log(`Monitoring initialized for ${currentScenario} risk scenario`);
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Key Improvements Summary */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
            🚀 Key Improvements Implemented
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Visual Enhancements</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Dynamic color coding for risk levels and alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Enhanced tab design with clear active states
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Improved spacing and text alignment
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Animated progress bars with visual feedback
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">User Experience</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                  Integrated action buttons with context
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  Quick navigation links between sections
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Contextual tooltips and explanations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  Responsive design for all screen sizes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};