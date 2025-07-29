import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, X, MessageCircle, Loader2, Minimize2, Maximize2, Sparkles, Zap, TrendingUp, Code, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIService } from '@/services/aiService';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
  isImportant?: boolean;
}

interface AnalysisResults {
  issues: Array<{
    severity: string;
    type: string;
    message: string;
    filename: string;
    line: number;
  }>;
  totalFiles: number;
  summary?: {
    securityScore?: number;
    qualityScore?: number;
  };
}

interface FloatingChatBotProps {
  analysisResults: AnalysisResults;
}

const FloatingChatBot: React.FC<FloatingChatBotProps> = ({ analysisResults }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const aiService = new AIService();

  // Quick action suggestions
  const quickActions = [
    "What are the most critical security issues?",
    "Show me all high severity bugs",
    "How can I improve my code quality?",
    "What should I fix first?",
    "Summarize the analysis results"
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        role: 'assistant',
        content: `Hello! I'm your AI assistant for code analysis. I can help you understand the analysis results of your codebase. 

I found ${analysisResults?.issues?.length || 0} issues across ${analysisResults?.totalFiles || 0} files. Feel free to ask me questions like:
- "What are the most critical security issues?"
- "Show me all high severity bugs"
- "How can I improve my code quality?"
- "What should I fix first?"

How can I help you today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, analysisResults, messages.length]);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleQuickAction = (action: string) => {
    setInput(action);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const generateSmartSuggestions = useCallback((lastMessage: string) => {
    const suggestions = [];
    
    if (lastMessage.toLowerCase().includes('security')) {
      suggestions.push('Show me the most critical vulnerabilities');
      suggestions.push('How can I fix these security issues?');
    }
    
    if (lastMessage.toLowerCase().includes('performance')) {
      suggestions.push('What are the performance bottlenecks?');
      suggestions.push('How can I optimize this code?');
    }
    
    if (lastMessage.toLowerCase().includes('bug') || lastMessage.toLowerCase().includes('error')) {
      suggestions.push('Show me all high-priority bugs');
      suggestions.push('What causes these errors?');
    }
    
    // Always include some general suggestions
    suggestions.push('Explain this in more detail');
    suggestions.push('What should I prioritize?');
    
    setSmartSuggestions(suggestions.slice(0, 3));
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending question to AI service:', textToSend);
      console.log('Analysis results available:', !!analysisResults?.issues);
      
      if (!analysisResults || !analysisResults.issues) {
        throw new Error('No analysis results available. Please run an analysis first.');
      }

      const response = await aiService.answerQuestion(textToSend, analysisResults);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Generate smart suggestions based on the response
      generateSmartSuggestions(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      let errorMessage = 'Sorry, I encountered an error while processing your question.';
      
      if (error instanceof Error) {
        if (error.message.includes('No AI API keys configured')) {
          errorMessage = 'Please configure your AI API keys in the AI Configuration tab to use this feature.';
        } else if (error.message.includes('All AI providers failed')) {
          errorMessage = 'Unable to connect to AI services. Please check your API keys are valid and have sufficient credits.';
        } else if (error.message.includes('No analysis results')) {
          errorMessage = 'No analysis results found. Please upload and analyze a code file first.';
        } else {
          errorMessage = `AI Service Error: ${error.message}`;
        }
      }
      
      console.error('Detailed error for user:', errorMessage);
      toast.error(errorMessage);
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!analysisResults) {
    return null;
  }

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60]">
          <Button
            onClick={() => setIsOpen(true)}
            className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-800 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 focus-ring animate-float group overflow-hidden"
            size="sm"
            aria-label="Open AI chat assistant"
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-500/20 to-purple-600/20 animate-pulse"></div>
            
            {/* Icon with enhanced styling */}
            <div className="relative z-10 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse opacity-80" />
            </div>
            
            {/* Ripple effect on hover */}
            <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
          </Button>
          
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-xs font-bold text-white">{analysisResults?.issues?.length || 0}</span>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed shadow-2xl z-[60] bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 transition-all duration-500 ${
          isMaximized 
            ? 'top-4 left-4 right-4 bottom-4 w-auto h-auto rounded-xl animate-scale-in' 
            : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-2xl animate-slide-up'
        } ${
          isMinimized ? 'h-16' : isMaximized ? 'h-auto' : 'h-[75vh] max-h-[600px]'
        }`}>
          {/* Enhanced Header */}
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-gradient-flow"></div>
            <div className="relative flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <div className="relative">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                  <Sparkles className="absolute -top-1 -right-1 h-2 w-2 text-yellow-300 animate-pulse" />
                </div>
                <span className="hidden sm:inline">
                  AI Analysis Assistant {isMaximized && '• Maximized'}
                </span>
                <span className="sm:hidden">
                  AI Assistant {isMaximized && '• Max'}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (isMinimized) {
                      // If minimized, restore to normal size
                      setIsMinimized(false);
                    } else {
                      // Toggle between normal and maximized
                      setIsMaximized(!isMaximized);
                    }
                  }}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0 focus-ring transition-transform duration-200 hover:scale-110"
                  aria-label={isMinimized ? "Restore chat" : isMaximized ? "Restore to normal size" : "Maximize chat"}
                  title={isMinimized ? "Restore" : isMaximized ? "Restore" : "Maximize"}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : isMaximized ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0 focus-ring transition-transform duration-200 hover:scale-110"
                  aria-label="Close chat"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className={`p-0 flex flex-col ${
              isMaximized 
                ? 'h-[calc(100vh-12rem)]' 
                : 'h-[calc(75vh-80px)] max-h-[520px]'
            }`}>
              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Analysis Overview</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2 text-center border border-red-200 dark:border-red-800/30">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        <div className="text-lg font-bold text-red-600">{analysisResults?.issues?.length || 0}</div>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Issues Found</div>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2 text-center border border-blue-200 dark:border-blue-800/30">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Code className="h-3 w-3 text-blue-600" />
                        <div className="text-lg font-bold text-blue-600">{analysisResults?.totalFiles || 0}</div>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Files Analyzed</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Quick Actions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickActions.slice(0, 3).map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action)}
                        className="text-xs px-2 py-1 h-auto bg-white/80 dark:bg-slate-700/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-slate-300 dark:border-slate-600 transition-all duration-200 hover:scale-105 flex items-center gap-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        {action.length > 18 ? `${action.substring(0, 18)}...` : action}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollAreaRef}>
                <div className="space-y-3 sm:space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 relative transition-all duration-300 hover:scale-[1.02] ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg'
                        }`}
                      >
                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          
                          {message.role === 'assistant' && (
                            <div className="flex items-center gap-1 opacity-70">
                              <Bot className="h-3 w-3" />
                              <span className="text-xs">AI</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-md border border-slate-200 dark:border-slate-700 animate-pulse">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-blue-600 animate-bounce" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50/50 to-blue-50/30 dark:from-slate-800/50 dark:to-blue-900/20">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about your code analysis..."
                      disabled={isLoading}
                      maxLength={500}
                      className="pr-12 text-sm focus-ring bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:shadow-md focus:shadow-lg"
                      aria-label="Chat message input"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
                      {input.length}/500
                    </div>
                  </div>
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isLoading}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus-ring flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                      <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                </div>
                
                {/* Smart Suggestions */}
                {smartSuggestions.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-3 w-3 text-purple-500 animate-pulse" />
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Smart Suggestions:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {smartSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuickAction(suggestion)}
                          className="text-xs px-2 py-1 h-auto text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800 transition-all duration-200 hover:scale-105 animate-fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {suggestion.length > 18 ? `${suggestion.substring(0, 18)}...` : suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Quick Actions */}
                {messages.length > 1 && smartSuggestions.length === 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {quickActions.slice(3).map((action, index) => (
                      <Button
                        key={index + 3}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuickAction(action)}
                        className="text-xs px-2 py-1 h-auto text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-105"
                      >
                        {action.length > 20 ? `${action.substring(0, 20)}...` : action}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
};

export default FloatingChatBot;