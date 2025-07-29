import React, { useState, useEffect } from 'react';
import { Search, Keyboard, Filter, Archive, BookOpen, Lightbulb, Target, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
  isImportant?: boolean;
}

interface ChatBotEnhancementsProps {
  messages: ChatMessage[];
  onSearchResults: (results: ChatMessage[]) => void;
  onShowKeyboardShortcuts: () => void;
}

export const ChatBotEnhancements: React.FC<ChatBotEnhancementsProps> = ({
  messages,
  onSearchResults,
  onShowKeyboardShortcuts
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'important' | 'liked'>('all');

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = messages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      onSearchResults(filtered);
    } else {
      onSearchResults(messages);
    }
  }, [searchQuery, messages, onSearchResults]);

  const getMessageStats = () => {
    const total = messages.length;
    const important = messages.filter(msg => msg.isImportant).length;
    const liked = messages.filter(msg => msg.liked).length;
    const assistant = messages.filter(msg => msg.role === 'assistant').length;
    
    return { total, important, liked, assistant };
  };

  const stats = getMessageStats();

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center gap-2 p-2 bg-white/80 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 border-0 bg-transparent focus:ring-0 text-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(false)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-1 text-center">
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-md p-1">
          <div className="text-xs font-bold text-blue-600">{stats.total}</div>
          <div className="text-xs text-slate-500">Total</div>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-md p-1">
          <div className="text-xs font-bold text-green-600">{stats.assistant}</div>
          <div className="text-xs text-slate-500">AI</div>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-md p-1">
          <div className="text-xs font-bold text-yellow-600">{stats.important}</div>
          <div className="text-xs text-slate-500">Important</div>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-md p-1">
          <div className="text-xs font-bold text-purple-600">{stats.liked}</div>
          <div className="text-xs text-slate-500">Liked</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSearch(!showSearch)}
          className="h-7 px-2 text-xs"
        >
          <Search className="h-3 w-3 mr-1" />
          Search
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowKeyboardShortcuts}
          className="h-7 px-2 text-xs"
        >
          <Keyboard className="h-3 w-3 mr-1" />
          Shortcuts
        </Button>
      </div>
    </div>
  );
};

// Keyboard Shortcuts Modal Component
export const KeyboardShortcutsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const shortcuts = [
    { key: 'Enter', action: 'Send message' },
    { key: 'Shift + Enter', action: 'New line' },
    { key: 'Ctrl + K', action: 'Clear chat' },
    { key: 'Ctrl + F', action: 'Search messages' },
    { key: 'Ctrl + E', action: 'Export chat' },
    { key: 'Ctrl + S', action: 'Share chat' },
    { key: 'Escape', action: 'Close chat' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            ×
          </Button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
              <span className="text-sm text-slate-600 dark:text-slate-400">{shortcut.action}</span>
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Smart Insights Component
export const SmartInsights: React.FC<{ analysisResults: any }> = ({ analysisResults }) => {
  const getInsights = () => {
    const insights = [];
    const issues = analysisResults?.issues || [];
    
    const securityIssues = issues.filter((issue: any) => 
      issue.type?.toLowerCase().includes('security') || 
      issue.severity === 'high'
    ).length;
    
    const performanceIssues = issues.filter((issue: any) => 
      issue.type?.toLowerCase().includes('performance')
    ).length;
    
    const codeQualityIssues = issues.filter((issue: any) => 
      issue.type?.toLowerCase().includes('quality') ||
      issue.type?.toLowerCase().includes('maintainability')
    ).length;

    if (securityIssues > 0) {
      insights.push({
        icon: AlertTriangle,
        color: 'text-red-600',
        title: 'Security Priority',
        description: `${securityIssues} security issues need immediate attention`,
        action: 'Show me critical security vulnerabilities'
      });
    }

    if (performanceIssues > 0) {
      insights.push({
        icon: Target,
        color: 'text-orange-600',
        title: 'Performance Impact',
        description: `${performanceIssues} performance bottlenecks detected`,
        action: 'How can I optimize performance?'
      });
    }

    if (codeQualityIssues > 0) {
      insights.push({
        icon: Lightbulb,
        color: 'text-blue-600',
        title: 'Code Quality',
        description: `${codeQualityIssues} maintainability improvements available`,
        action: 'What are the code quality recommendations?'
      });
    }

    return insights.slice(0, 3);
  };

  const insights = getInsights();

  if (insights.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-4 w-4 text-indigo-600" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Smart Insights</span>
      </div>
      {insights.map((insight, index) => (
        <div key={index} className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-2">
            <insight.icon className={`h-4 w-4 ${insight.color} mt-0.5`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">{insight.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{insight.description}</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 mt-2 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                {insight.action}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};