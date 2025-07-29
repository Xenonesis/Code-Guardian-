/**
 * Analysis History Page
 * Displays the last 10 analysis results with full details, search/filter capabilities, and export options
 */

import React, { useState } from 'react';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Download,
  Trash2,
  RotateCcw,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Shield,
  Bug,
  Zap,
  Info,
  Eye,
  EyeOff,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  Code,
  Package,
  GitBranch,
  Users,
  Award,
  Target,
  Layers,
  BarChart3,
  PieChart,
  LineChart,
  FileJson,
  FileSpreadsheet,
  FileImage,
  Sparkles,
  Zap as Lightning,
  Cpu,
  HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';
import { ExportFormat } from '@/services/exportService';
import Navigation from '@/components/Navigation';
import { useDarkMode } from '@/hooks/useDarkMode';

const History: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { 
    filteredAnalyses, 
    currentAnalysis, 
    isLoading, 
    error, 
    totalCount, 
    storageStats, 
    filters, 
    actions 
  } = useAnalysisHistory();

  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);
  const [autoInitialized, setAutoInitialized] = useState(false);

  // Helper functions
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25';
      case 'high': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/25';
      case 'low': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      case 'high': return <Zap className="h-3 w-3" />;
      case 'medium': return <Info className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return <Bug className="h-3 w-3" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-600';
    if (score >= 60) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getFileTypeIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': case 'jsx': case 'ts': case 'tsx': return <Code className="h-4 w-4 text-yellow-500" />;
      case 'py': return <Code className="h-4 w-4 text-blue-500" />;
      case 'java': return <Code className="h-4 w-4 text-red-500" />;
      case 'php': return <Code className="h-4 w-4 text-purple-500" />;
      case 'rb': return <Code className="h-4 w-4 text-red-600" />;
      case 'go': return <Code className="h-4 w-4 text-cyan-500" />;
      case 'rs': return <Code className="h-4 w-4 text-orange-600" />;
      case 'cpp': case 'c': return <Code className="h-4 w-4 text-blue-600" />;
      case 'sql': return <Database className="h-4 w-4 text-blue-700" />;
      case 'json': case 'xml': return <Package className="h-4 w-4 text-green-600" />;
      default: return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  // Event handlers
  const handleSelectAnalysis = (analysisId: string, checked: boolean) => {
    if (checked) {
      setSelectedAnalyses(prev => [...prev, analysisId]);
    } else {
      setSelectedAnalyses(prev => prev.filter(id => id !== analysisId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAnalyses(filteredAnalyses.map(a => a.id));
    } else {
      setSelectedAnalyses([]);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    if (selectedAnalyses.length === 0) {
      await actions.exportAll(format);
    } else {
      await actions.exportMultiple(selectedAnalyses, format);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedAnalyses.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedAnalyses.length} analysis(es)?`)) {
      for (const id of selectedAnalyses) {
        await actions.deleteAnalysis(id);
      }
      setSelectedAnalyses([]);
    }
  };

  const toggleAnalysisDetails = (analysisId: string) => {
    setExpandedAnalysis(expandedAnalysis === analysisId ? null : analysisId);
  };

  const handleDebugStorage = () => {
    // Import and use debug function
    import('@/utils/historyTestUtils').then(({ HistoryTestUtils }) => {
      HistoryTestUtils.debugStorage();
    });
  };

  const handleCreateTestData = async () => {
    // Create test data for demonstration
    try {
      const { HistoryTestUtils } = await import('@/utils/historyTestUtils');
      await HistoryTestUtils.populateTestHistory(3);
      actions.refreshHistory();
    } catch (error) {
      console.error('Failed to create test data:', error);
    }
  };

  // Auto-initialize with test data in development mode if no data exists
  React.useEffect(() => {
    if (import.meta.env.DEV && !isLoading && totalCount === 0 && !autoInitialized) {
      console.log('🧪 No analysis data found in development mode, creating test data...');
      setAutoInitialized(true);
      handleCreateTestData();
    }
  }, [isLoading, totalCount, autoInitialized]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Animated Background Pattern */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="relative pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Loading Analysis History</h3>
              <p className="text-slate-600 dark:text-slate-400">Retrieving your security analysis data...</p>
              <div className="flex items-center justify-center gap-1 mt-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Animated Background Pattern */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className="relative pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-50"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/25">
                      <HistoryIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                      Analysis History
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                      Comprehensive security analysis tracking and management
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Activity className="h-4 w-4" />
                        <span>Real-time monitoring</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Shield className="h-4 w-4" />
                        <span>Secure storage</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <BarChart3 className="h-4 w-4" />
                        <span>Advanced analytics</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={actions.refreshHistory}
                    variant="outline"
                    className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  {import.meta.env.DEV && (
                    <>
                      <Button
                        onClick={handleDebugStorage}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-600"
                      >
                        <Bug className="h-3 w-3 mr-1" />
                        Debug
                      </Button>
                      <Button
                        onClick={handleCreateTestData}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-600"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Test Data
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Debug info in development */}
            {import.meta.env.DEV && (
              <Card className="md:col-span-4 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={isLoading ? 'w-2 h-2 rounded-full bg-yellow-500' : error ? 'w-2 h-2 rounded-full bg-red-500' : 'w-2 h-2 rounded-full bg-green-500'}></div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Status: {isLoading ? 'Loading...' : error ? 'Error' : 'Ready'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Dev Mode - Storage: {typeof localStorage !== 'undefined' ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
                  )}
                </CardContent>
              </Card>
            )}
            {/* Enhanced Statistics Cards */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 animate-scaleIn animate-delay-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Analyses</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {filteredAnalyses.length !== totalCount && `${filteredAnalyses.length} filtered`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl">📊</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 animate-scaleIn animate-delay-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Analysis</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                        {currentAnalysis ? currentAnalysis.fileName : 'None'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {currentAnalysis ? formatDate(currentAnalysis.timestamp) : 'No active analysis'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl">{currentAnalysis ? '🎯' : '⏸️'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 animate-scaleIn animate-delay-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Storage Used</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatFileSize(storageStats.currentSize)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        of {formatFileSize(storageStats.maxSize)} available
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl">💾</div>
                    <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(storageStats.usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 animate-scaleIn animate-delay-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg group-hover:shadow-amber-500/25 transition-all duration-300">
                      <PieChart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Storage Usage</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {storageStats.usagePercentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {storageStats.historyCount} items stored
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl">
                      {storageStats.usagePercentage > 80 ? '⚠️' : storageStats.usagePercentage > 50 ? '📈' : '✅'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Controls */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-750 dark:to-slate-800">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Enhanced Search */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Search & Filter
                </label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  <Input
                    placeholder="Search by filename, analysis ID, issue type, or content..."
                    value={filters.searchTerm}
                    onChange={(e) => actions.updateFilters({ searchTerm: e.target.value })}
                    className="pl-12 pr-4 py-3 text-base border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 bg-white dark:bg-slate-800"
                  />
                  {filters.searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => actions.updateFilters({ searchTerm: '' })}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Enhanced Filter Toggle */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-200 group hover:scale-[1.02] ${
                    showFilters
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-700 dark:text-blue-300 shadow-lg shadow-blue-500/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-slate-800 hover:shadow-lg'
                  }`}
                >
                  <div className={`p-1 rounded-lg transition-all duration-200 ${
                    showFilters
                      ? 'bg-blue-500 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50'
                  }`}>
                    <Filter className={`h-3 w-3 transition-all duration-200 ${
                      showFilters
                        ? 'text-white'
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`} />
                  </div>
                  <span className="font-medium">Advanced Filters</span>
                  {showFilters ? (
                    <ChevronUp className="h-4 w-4 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  )}
                </Button>
              </div>

              {/* Enhanced Export Options */}
              <div className="flex items-end gap-3">
                <div className="flex flex-col">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    Export Data
                  </label>
                  <Select onValueChange={(value) => handleExport(value as ExportFormat)}>
                    <SelectTrigger className="w-48 py-3 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl hover:scale-[1.02] group">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-200">
                          <Download className="h-3.5 w-3.5 text-white group-hover:animate-bounce" />
                        </div>
                        <SelectValue placeholder="Choose Format" className="font-medium" />
                        <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-200 ml-auto" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="w-64 p-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-2xl">
                      <div className="mb-2 px-2 py-1">
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Export Formats
                        </div>
                      </div>

                      <SelectItem value="json" className="rounded-lg p-3 mb-1 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                            <FileJson className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">JSON Format</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Structured data for developers</div>
                          </div>
                          <div className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                            .json
                          </div>
                        </div>
                      </SelectItem>

                      <SelectItem value="csv" className="rounded-lg p-3 mb-1 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 dark:hover:from-emerald-950/50 dark:hover:to-green-950/50 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
                            <FileSpreadsheet className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">CSV Format</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Spreadsheet compatible data</div>
                          </div>
                          <div className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-medium">
                            .csv
                          </div>
                        </div>
                      </SelectItem>

                      <SelectItem value="txt" className="rounded-lg p-3 mb-1 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 dark:hover:from-purple-950/50 dark:hover:to-violet-950/50 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 shadow-sm">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">Text Format</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Human-readable report</div>
                          </div>
                          <div className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium">
                            .txt
                          </div>
                        </div>
                      </SelectItem>

                      <SelectItem value="pdf" className="rounded-lg p-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-950/50 dark:hover:to-red-950/50 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-sm">
                            <FileImage className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white">PDF Report</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Professional document</div>
                          </div>
                          <div className="text-xs bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full font-medium">
                            .pdf
                          </div>
                        </div>
                      </SelectItem>

                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                        <div className="px-2 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                              <div className="p-1 rounded-full bg-blue-500/20">
                                <Lightning className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                              </div>
                              {selectedAnalyses.length > 0
                                ? `${selectedAnalyses.length} selected`
                                : `${filteredAnalyses.length} total`
                              }
                            </p>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Ready</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {selectedAnalyses.length > 0 && (
                  <Button
                    variant="destructive"
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/25 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected ({selectedAnalyses.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Enhanced Advanced Filters */}
            {showFilters && (
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      <AlertTriangle className="h-4 w-4" />
                      Severity Level
                    </label>
                    <Select
                      value={filters.severityFilter}
                      onValueChange={(value) => actions.updateFilters({ severityFilter: value as any })}
                    >
                      <SelectTrigger className="rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-56 p-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-xl">
                        <div className="mb-2 px-2 py-1">
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Filter by Severity
                          </p>
                        </div>

                        <SelectItem value="all" className="rounded-lg p-3 mb-1 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-gradient-to-r from-slate-400 to-slate-500 shadow-sm">
                              <Shield className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 dark:text-white">All Severities</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Show all security issues</div>
                            </div>
                          </div>
                        </SelectItem>

                        <SelectItem value="critical" className="rounded-lg p-3 mb-1 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 shadow-sm animate-pulse">
                              <AlertTriangle className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 dark:text-white">Critical Only</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Immediate attention required</div>
                            </div>
                          </div>
                        </SelectItem>

                        <SelectItem value="high" className="rounded-lg p-3 mb-1 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-200 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-sm">
                              <Zap className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 dark:text-white">High Priority</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Should be addressed soon</div>
                            </div>
                          </div>
                        </SelectItem>

                        <SelectItem value="medium" className="rounded-lg p-3 mb-1 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-all duration-200 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-sm">
                              <Info className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 dark:text-white">Medium Risk</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Moderate security concern</div>
                            </div>
                          </div>
                        </SelectItem>

                        <SelectItem value="low" className="rounded-lg p-3 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 dark:text-white">Low Impact</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Minor issues to review</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      <Code className="h-4 w-4" />
                      File Extension
                    </label>
                    <Input
                      placeholder="e.g., .js, .py, .java, .php"
                      value={filters.fileTypeFilter}
                      onChange={(e) => actions.updateFilters({ fileTypeFilter: e.target.value })}
                      className="rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      <Target className="h-4 w-4" />
                      Score Range
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        min="0"
                        max="100"
                        value={filters.scoreRange.min}
                        onChange={(e) => actions.updateFilters({
                          scoreRange: { ...filters.scoreRange, min: parseInt(e.target.value) || 0 }
                        })}
                        className="w-20 rounded-lg border-2 border-slate-200 dark:border-slate-600"
                      />
                      <span className="text-slate-500">-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        min="0"
                        max="100"
                        value={filters.scoreRange.max}
                        onChange={(e) => actions.updateFilters({
                          scoreRange: { ...filters.scoreRange, max: parseInt(e.target.value) || 100 }
                        })}
                        className="w-20 rounded-lg border-2 border-slate-200 dark:border-slate-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={actions.resetFilters}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                      Reset All Filters
                    </Button>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(filters.searchTerm || filters.severityFilter !== 'all' || filters.fileTypeFilter ||
                  filters.scoreRange.min > 0 || filters.scoreRange.max < 100) && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Active Filters:</span>
                        <div className="flex flex-wrap gap-2">
                          {filters.searchTerm && (
                            <Badge variant="outline" className="bg-white dark:bg-slate-800">
                              Search: "{filters.searchTerm}"
                            </Badge>
                          )}
                          {filters.severityFilter !== 'all' && (
                            <Badge variant="outline" className="bg-white dark:bg-slate-800">
                              Severity: {filters.severityFilter}
                            </Badge>
                          )}
                          {filters.fileTypeFilter && (
                            <Badge variant="outline" className="bg-white dark:bg-slate-800">
                              Type: {filters.fileTypeFilter}
                            </Badge>
                          )}
                          {(filters.scoreRange.min > 0 || filters.scoreRange.max < 100) && (
                            <Badge variant="outline" className="bg-white dark:bg-slate-800">
                              Score: {filters.scoreRange.min}-{filters.scoreRange.max}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {filteredAnalyses.length} of {totalCount} results
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Card className="mb-6 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredAnalyses.length === 0 ? (
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-750 dark:to-slate-800">
            <CardContent className="p-16 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <HistoryIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping"></div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {totalCount === 0 ? "Welcome to Analysis History" : "No Results Found"}
              </h3>

              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                {totalCount === 0
                  ? "Start your security journey by uploading and analyzing your first file. All your analysis results will appear here."
                  : "No analyses match your current filters. Try adjusting your search criteria or clearing the filters."
                }
              </p>

              {totalCount === 0 ? (
                <div className="space-y-6">
                  {import.meta.env.DEV && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Development Mode</span>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-500"></div>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                        Create sample analysis data to explore the history features
                      </p>
                      <Button
                        onClick={handleCreateTestData}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Generate Sample Data
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Shield className="h-4 w-4" />
                      <span>Secure local storage</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Activity className="h-4 w-4" />
                      <span>Real-time tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Download className="h-4 w-4" />
                      <span>Export capabilities</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={actions.resetFilters}
                    variant="outline"
                    className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {filteredAnalyses.length} of {totalCount} total analyses
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center gap-2 px-4">
              <Checkbox
                checked={selectedAnalyses.length === filteredAnalyses.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Select all ({filteredAnalyses.length} analyses)
              </span>
            </div>

            {/* Enhanced Analysis List */}
            {filteredAnalyses.map((analysis, index) => (
              <Card
                key={analysis.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 card-hover animate-fadeInUp"
                style={{ animationDelay: `${Math.min(index * 100, 500)}ms` }}
              >
                <CardContent className="p-0">
                  {/* Header Section */}
                  <div className="relative p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-750 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedAnalyses.includes(analysis.id)}
                          onCheckedChange={(checked) => handleSelectAnalysis(analysis.id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex items-center gap-2">
                          {getFileTypeIcon(analysis.fileName)}
                          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                              {analysis.fileName}
                            </h3>
                            {analysis.id === currentAnalysis?.id && (
                              <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg animate-pulse">
                                <Activity className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAnalysisDetails(analysis.id)}
                              className="hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200"
                            >
                              {expandedAnalysis === analysis.id ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => actions.restoreAnalysis(analysis.id)}
                              disabled={analysis.id === currentAnalysis?.id}
                              className="hover:bg-green-100 dark:hover:bg-green-900/50 transition-all duration-200"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => actions.exportAnalysis(analysis.id, 'json')}
                              className="hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-200"
                            >
                              <Download className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => actions.deleteAnalysis(analysis.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Enhanced Metrics Grid - Temporarily Disabled */}
                        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-slate-500" />
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Analysis Date</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {new Date(analysis.timestamp).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(analysis.timestamp).toLocaleTimeString()}
                            </p>
                          </div>

                          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="h-4 w-4 text-slate-500" />
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Security Score</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className={`text-lg font-bold ${getScoreColor(analysis.results.summary.securityScore)}`}>
                                {analysis.results.summary.securityScore}
                              </p>
                              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.results.summary.securityScore)} transition-all duration-500`}
                                  style={{ width: `${analysis.results.summary.securityScore}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                              <Bug className="h-4 w-4 text-slate-500" />
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Issues</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-bold text-slate-900 dark:text-white">
                                {analysis.results.issues.length}
                              </p>
                              {analysis.results.summary.criticalIssues > 0 && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>

                          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-slate-500" />
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Analysis Time</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                              {analysis.results.analysisTime}
                            </p>
                          </div>
                        </div> */}

                        {/* Enhanced Severity Badges */}
                        <div className="flex flex-wrap gap-3">
                          {analysis.results.summary.criticalIssues > 0 && (
                            <Badge className={`${getSeverityColor('critical')} px-3 py-1 rounded-lg font-semibold flex items-center gap-1 animate-pulse`}>
                              {getSeverityIcon('critical')}
                              {analysis.results.summary.criticalIssues} Critical
                            </Badge>
                          )}
                          {analysis.results.summary.highIssues > 0 && (
                            <Badge className={`${getSeverityColor('high')} px-3 py-1 rounded-lg font-semibold flex items-center gap-1`}>
                              {getSeverityIcon('high')}
                              {analysis.results.summary.highIssues} High
                            </Badge>
                          )}
                          {analysis.results.summary.mediumIssues > 0 && (
                            <Badge className={`${getSeverityColor('medium')} px-3 py-1 rounded-lg font-semibold flex items-center gap-1`}>
                              {getSeverityIcon('medium')}
                              {analysis.results.summary.mediumIssues} Medium
                            </Badge>
                          )}
                          {analysis.results.summary.lowIssues > 0 && (
                            <Badge className={`${getSeverityColor('low')} px-3 py-1 rounded-lg font-semibold flex items-center gap-1`}>
                              {getSeverityIcon('low')}
                              {analysis.results.summary.lowIssues} Low
                            </Badge>
                          )}
                          {analysis.results.issues.length === 0 && (
                            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-lg font-semibold flex items-center gap-1 shadow-lg">
                              <CheckCircle className="h-3 w-3" />
                              No Issues Found
                            </Badge>
                          )}
                        </div>

                        {/* Additional Metrics */}
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Files</span>
                            </div>
                            <p className="text-lg font-bold text-blue-600">{analysis.results.totalFiles}</p>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Code className="h-4 w-4 text-purple-600" />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Lines</span>
                            </div>
                            <p className="text-lg font-bold text-purple-600">{analysis.results.summary.linesAnalyzed.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-xl">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Award className="h-4 w-4 text-emerald-600" />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Quality</span>
                            </div>
                            <p className="text-lg font-bold text-emerald-600">
                              {analysis.results.summary.qualityScore}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Enhanced Expanded Details */}
                {expandedAnalysis === analysis.id && (
                  <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      🔍 Debug: Expanded analysis ID: {expandedAnalysis} | Analysis ID: {analysis.id} | Has results: {analysis.results ? 'Yes' : 'No'}
                    </p>
                    {analysis.results && (
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Summary exists: {analysis.results.summary ? 'Yes' : 'No'} | 
                        Issues count: {analysis.results.issues?.length || 0} | 
                        Security Score: {analysis.results.summary?.securityScore || 'N/A'}
                      </p>
                    )}
                  </div>
                )}
                {expandedAnalysis === analysis.id && analysis.results && (
                  <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                    <div className="space-y-6">
                      {/* Analysis Results Preview - Similar to Home Page */}
                      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5 text-blue-600" />
                          Analysis Results Preview
                        </h4>
                        
                        {/* Security Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          {/* Security Score Card */}
                          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Security Score</span>
                              </div>
                              <div className={`text-2xl font-bold ${getScoreColor(analysis.results.summary.securityScore)}`}>
                                {analysis.results.summary.securityScore}
                              </div>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.results.summary.securityScore)} transition-all duration-500`}
                                style={{ width: `${analysis.results.summary.securityScore}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Quality Score Card */}
                          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Quality Score</span>
                              </div>
                              <div className="text-2xl font-bold text-emerald-600">
                                {analysis.results.summary.qualityScore}
                              </div>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500"
                                style={{ width: `${analysis.results.summary.qualityScore}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Total Issues Card */}
                          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Bug className="h-4 w-4 text-red-600" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Issues</span>
                              </div>
                              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {analysis.results.issues.length}
                              </div>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Found in {analysis.results.totalFiles} files
                            </div>
                          </div>
                        </div>

                        {/* Issue Breakdown */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                          <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-red-600">{analysis.results.summary.criticalIssues}</div>
                            <div className="text-xs text-red-600/80">Critical</div>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-orange-600">{analysis.results.summary.highIssues}</div>
                            <div className="text-xs text-orange-600/80">High</div>
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-yellow-600">{analysis.results.summary.mediumIssues}</div>
                            <div className="text-xs text-yellow-600/80">Medium</div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-blue-600">{analysis.results.summary.lowIssues}</div>
                            <div className="text-xs text-blue-600/80">Low</div>
                          </div>
                        </div>

                        {/* Recent Issues Preview */}
                        {analysis.results.issues.length > 0 && (
                          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                            <h5 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              Recent Issues ({Math.min(analysis.results.issues.length, 3)} of {analysis.results.issues.length})
                            </h5>
                            <div className="space-y-2">
                              {analysis.results.issues.slice(0, 3).map((issue, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                  <div className={`p-1 rounded ${getSeverityColor(issue.severity)} flex-shrink-0`}>
                                    {getSeverityIcon(issue.severity)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-slate-900 dark:text-white truncate">
                                      {issue.type}
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                      {issue.file} - Line {issue.line}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {analysis.results.issues.length > 3 && (
                                <div className="text-center pt-2">
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    +{analysis.results.issues.length - 3} more issues
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Analysis Metadata */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Files</span>
                            </div>
                            <p className="text-lg font-bold text-blue-600">{analysis.results.totalFiles}</p>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Code className="h-4 w-4 text-purple-600" />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Lines</span>
                            </div>
                            <p className="text-lg font-bold text-purple-600">{analysis.results.summary.linesAnalyzed.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Clock className="h-4 w-4 text-emerald-600" />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Time</span>
                            </div>
                            <p className="text-lg font-bold text-emerald-600">{analysis.results.analysisTime}</p>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Calendar className="h-4 w-4 text-amber-600" />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Date</span>
                            </div>
                            <p className="text-sm font-bold text-amber-600">{new Date(analysis.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
