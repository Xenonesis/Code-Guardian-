import React from 'react';
import { Shield, Bot, Key, Server, Cloud, Download, ExternalLink, CheckCircle, AlertTriangle, Info, Code, Settings, Zap, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/Navigation';
import { useDarkMode } from '@/hooks/useDarkMode';

const Documentation = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const aiProviders = [
    {
      id: 'openai',
      name: 'OpenAI GPT-4',
      icon: '🤖',
      type: 'cloud',
      description: 'Most advanced AI model for code analysis',
      features: ['Code Analysis', 'Security Insights', 'Fix Suggestions', 'Natural Language Processing'],
      pricing: 'Pay-per-use',
      setupComplexity: 'Easy',
      performance: 'Excellent'
    },
    {
      id: 'claude',
      name: 'Anthropic Claude 3.5',
      icon: '🧠',
      type: 'cloud',
      description: 'Constitutional AI with strong security focus',
      features: ['Security Analysis', 'Compliance Checking', 'Detailed Explanations', 'Safety Analysis'],
      pricing: 'Pay-per-use',
      setupComplexity: 'Easy',
      performance: 'Excellent'
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      icon: '💎',
      type: 'cloud',
      description: 'Multi-modal AI with code understanding',
      features: ['Code Understanding', 'Multi-language Support', 'Context Analysis', 'Pattern Recognition'],
      pricing: 'Free tier available',
      setupComplexity: 'Easy',
      performance: 'Very Good'
    },
    {
      id: 'ollama',
      name: 'Ollama',
      icon: '🦙',
      type: 'local',
      description: 'Run large language models locally',
      features: ['Privacy-First', 'Offline Analysis', 'No API Costs', 'Custom Models'],
      pricing: 'Free',
      setupComplexity: 'Medium',
      performance: 'Good (Hardware dependent)'
    },
    {
      id: 'lmstudio',
      name: 'LM Studio',
      icon: '🏠',
      type: 'local',
      description: 'User-friendly local LLM interface',
      features: ['Easy Setup', 'Model Management', 'Local Processing', 'No Internet Required'],
      pricing: 'Free',
      setupComplexity: 'Easy',
      performance: 'Good (Hardware dependent)'
    }
  ];

  const coreFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Security Analysis Engine',
      description: 'OWASP Top 10 compliance, vulnerability detection, and security scoring',
      capabilities: ['SQL Injection Detection', 'XSS Prevention', 'CSRF Protection', 'Authentication Issues', 'Authorization Flaws']
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: 'AI-Powered Insights',
      description: 'Intelligent code analysis with natural language explanations',
      capabilities: ['Code Fix Suggestions', 'Security Recommendations', 'Best Practice Guidance', 'Threat Modeling', 'Risk Assessment']
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: 'Code Quality Assessment',
      description: 'Comprehensive code quality metrics and maintainability analysis',
      capabilities: ['Technical Debt Analysis', 'Complexity Metrics', 'Code Smells Detection', 'Refactoring Suggestions', 'Performance Impact']
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Privacy-First Architecture',
      description: 'All analysis performed locally in your browser',
      capabilities: ['Local Processing', 'No Data Transmission', 'Encrypted Storage', 'GDPR Compliant', 'Zero Trust Model']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
                Code Guardian Documentation
              </h1>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Complete setup guide and configuration instructions for the AI-powered security analysis platform
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="setup">Quick Setup</TabsTrigger>
              <TabsTrigger value="ai-config">AI Configuration</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    What is Code Guardian?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-slate-600 dark:text-slate-300">
                    Code Guardian is a next-generation AI-powered static code analysis platform designed to help developers identify security vulnerabilities, 
                    code quality issues, and maintainability concerns in their codebase. Built with modern web technologies and enhanced with cutting-edge AI capabilities, 
                    it provides comprehensive security analysis while maintaining complete privacy and data protection.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {coreFeatures.map((feature, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
                              {feature.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                              <p className="text-slate-600 dark:text-slate-300 mb-3">{feature.description}</p>
                              <div className="space-y-1">
                                {feature.capabilities.map((capability, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>{capability}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Privacy-First Design:</strong> All code analysis is performed locally in your browser. 
                      Your code never leaves your device unless you explicitly choose to use optional AI features, 
                      which only send minimal context to AI providers.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* System Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>System Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Browser Requirements</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Chrome 90+</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Firefox 88+</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Safari 14+</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Edge 90+</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Hardware Requirements</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />4GB RAM minimum</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />8GB RAM recommended</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Modern CPU (2015+)</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Internet for AI features</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Local LLM Requirements</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />16GB RAM for 7B models</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />32GB RAM for 13B models</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />GPU optional but recommended</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />10GB+ free disk space</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Setup Tab */}
            <TabsContent value="setup" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Quick Setup Guide
                  </CardTitle>
                  <CardDescription>
                    Get Code Guardian running in minutes with this step-by-step guide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">1</div>
                      <div>
                        <h3 className="font-semibold mb-2">Clone or Download</h3>
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                          <code className="text-sm">git clone https://github.com/Xenonesis/Code-Guardian-.git</code>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Or download the ZIP file from GitHub releases</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">2</div>
                      <div>
                        <h3 className="font-semibold mb-2">Install Dependencies</h3>
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                          <code className="text-sm">cd code-guardian<br />npm install</code>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Requires Node.js 18+ and npm</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">3</div>
                      <div>
                        <h3 className="font-semibold mb-2">Start Development Server</h3>
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                          <code className="text-sm">npm run dev</code>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Opens at http://localhost:5173</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">✓</div>
                      <div>
                        <h3 className="font-semibold mb-2">Ready to Use!</h3>
                        <p className="text-slate-600 dark:text-slate-300">Code Guardian is now running locally. Upload files to start analyzing your code.</p>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>No Configuration Required:</strong> Code Guardian works out of the box with local analysis. 
                      AI features are optional and can be configured later.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Configuration Tab */}
            <TabsContent value="ai-config" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Analysis Integration
                  </CardTitle>
                  <CardDescription>
                    Configure AI providers for enhanced code analysis and intelligent insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      AI features are completely optional. Code Guardian provides comprehensive analysis without any AI configuration.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-6">
                    {aiProviders.map((provider) => (
                      <Card key={provider.id} className="border-2">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{provider.icon}</span>
                              <div>
                                <h3 className="font-semibold text-lg">{provider.name}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{provider.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={provider.type === 'local' ? 'secondary' : 'default'}>
                                {provider.type === 'local' ? <Server className="h-3 w-3 mr-1" /> : <Cloud className="h-3 w-3 mr-1" />}
                                {provider.type}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium mb-2">Features</h4>
                              <ul className="space-y-1">
                                {provider.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Pricing:</span>
                                <span className="font-medium">{provider.pricing}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Setup:</span>
                                <span className="font-medium">{provider.setupComplexity}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Performance:</span>
                                <span className="font-medium">{provider.performance}</span>
                              </div>
                            </div>
                          </div>

                          {provider.type === 'cloud' ? (
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">Setup Instructions:</h4>
                              <ol className="list-decimal list-inside space-y-1 text-sm">
                                <li>Get API key from {provider.name} dashboard</li>
                                <li>Open Code Guardian AI settings</li>
                                <li>Enter your API key for {provider.name}</li>
                                <li>Test connection and start analyzing</li>
                              </ol>
                            </div>
                          ) : (
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">Local Setup Instructions:</h4>
                              <ol className="list-decimal list-inside space-y-1 text-sm">
                                <li>Install {provider.name} on your system</li>
                                <li>Download and configure a model</li>
                                <li>Start the local server</li>
                                <li>Configure server URL in Code Guardian</li>
                                <li>Test connection and start analyzing</li>
                              </ol>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API Key Management
                      </h3>
                      <div className="space-y-3">
                        <p className="text-sm">API keys are stored locally in your browser and never transmitted to our servers.</p>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-500" />Encrypted local storage</li>
                          <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-500" />No server transmission</li>
                          <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-500" />Easy to update or remove</li>
                          <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-500" />Automatic validation</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Core Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid gap-6">
                    <Card className="border-l-4 border-l-red-500">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-red-500" />
                          Security Analysis Engine
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">OWASP Top 10 Coverage</h4>
                            <ul className="space-y-1 text-sm">
                              <li>• Injection vulnerabilities</li>
                              <li>• Broken authentication</li>
                              <li>• Sensitive data exposure</li>
                              <li>• XML external entities</li>
                              <li>• Broken access control</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Advanced Detection</h4>
                            <ul className="space-y-1 text-sm">
                              <li>• Secret detection (API keys, tokens)</li>
                              <li>• Dependency vulnerabilities</li>
                              <li>• Code provenance monitoring</li>
                              <li>• Custom security rules</li>
                              <li>• Real-time threat assessment</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Bot className="h-5 w-5 text-blue-500" />
                          AI-Powered Analysis
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Intelligent Insights</h4>
                            <ul className="space-y-1 text-sm">
                              <li>• Natural language explanations</li>
                              <li>• Context-aware recommendations</li>
                              <li>• Automated fix suggestions</li>
                              <li>• Threat modeling assistance</li>
                              <li>• Best practice guidance</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Multi-Provider Support</h4>
                            <ul className="space-y-1 text-sm">
                              <li>• OpenAI GPT-4 integration</li>
                              <li>• Anthropic Claude 3.5</li>
                              <li>• Google Gemini support</li>
                              <li>• Local LLM compatibility</li>
                              <li>• Fallback mechanisms</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Code className="h-5 w-5 text-green-500" />
                          Code Quality Assessment
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Quality Metrics</h4>
                            <ul className="space-y-1 text-sm">
                              <li>• Cyclomatic complexity</li>
                              <li>• Technical debt analysis</li>
                              <li>• Code smell detection</li>
                              <li>• Maintainability index</li>
                              <li>• Performance impact</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Language Support</h4>
                            <ul className="space-y-1 text-sm">
                              <li>• JavaScript/TypeScript</li>
                              <li>• Python</li>
                              <li>• Java</li>
                              <li>• C#</li>
                              <li>• PHP and more</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Settings className="h-5 w-5 text-purple-500" />
                          Advanced Features
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Analytics & Reporting</h4>
                            <ul className="space-y-1 text-sm">
                              <li>• Interactive dashboards</li>
                              <li>• Real-time metrics</li>
                              <li>• Historical tracking</li>
                              <li>• Export capabilities</li>
                              <li>• Custom reports</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">User Experience</h4>
                            <ul className="space-y-1 text-sm">
                              <li>• Dark/light mode</li>
                              <li>• Responsive design</li>
                              <li>• PWA support</li>
                              <li>• Floating AI assistant</li>
                              <li>• Keyboard shortcuts</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Troubleshooting Tab */}
            <TabsContent value="troubleshooting" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Common Issues & Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Card className="border-amber-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">AI Analysis Not Working</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Symptoms:</strong> AI insights not appearing, connection errors</p>
                          <p><strong>Solutions:</strong></p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Verify API key is correctly entered</li>
                            <li>Check internet connection</li>
                            <li>Ensure API key has sufficient credits</li>
                            <li>Try refreshing the page</li>
                            <li>Check browser console for errors</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-amber-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Local LLM Connection Issues</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Symptoms:</strong> Cannot connect to Ollama/LM Studio</p>
                          <p><strong>Solutions:</strong></p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Ensure local LLM server is running</li>
                            <li>Check server URL (default: http://localhost:11434 for Ollama)</li>
                            <li>Verify CORS settings are configured</li>
                            <li>Try different model if current one fails</li>
                            <li>Check firewall/antivirus settings</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-amber-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">File Upload Problems</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Symptoms:</strong> Files not uploading or analyzing</p>
                          <p><strong>Solutions:</strong></p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Check file size (max 10MB per file)</li>
                            <li>Ensure supported file types (.js, .ts, .jsx, .tsx, .py, etc.)</li>
                            <li>Clear browser cache and cookies</li>
                            <li>Try uploading fewer files at once</li>
                            <li>Disable browser extensions temporarily</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-amber-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Performance Issues</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Symptoms:</strong> Slow analysis, browser freezing</p>
                          <p><strong>Solutions:</strong></p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Close other browser tabs</li>
                            <li>Increase browser memory limit</li>
                            <li>Analyze smaller code batches</li>
                            <li>Disable unnecessary browser extensions</li>
                            <li>Use latest browser version</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Still having issues?</strong> Check the browser console (F12) for error messages, 
                      or visit our GitHub repository for more detailed troubleshooting guides.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      GitHub Issues
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Documentation;