/**
 * Analysis History Hook
 * Manages history state, filtering, search, and export operations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { analysisStorage, type StoredAnalysisData } from '@/services/analysisStorage';
import { exportService, type ExportFormat, type ExportOptions } from '@/services/exportService';
import { toast } from 'sonner';

export interface HistoryFilters {
  searchTerm: string;
  severityFilter: 'all' | 'critical' | 'high' | 'medium' | 'low';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  fileTypeFilter: string;
  scoreRange: {
    min: number;
    max: number;
  };
}

export interface HistoryState {
  analyses: StoredAnalysisData[];
  filteredAnalyses: StoredAnalysisData[];
  currentAnalysis: StoredAnalysisData | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  storageStats: {
    currentSize: number;
    maxSize: number;
    usagePercentage: number;
    historyCount: number;
  };
}

export interface HistoryActions {
  refreshHistory: () => void;
  deleteAnalysis: (analysisId: string) => Promise<void>;
  restoreAnalysis: (analysisId: string) => Promise<void>;
  exportAnalysis: (analysisId: string, format: ExportFormat, options?: Partial<ExportOptions>) => Promise<void>;
  exportMultiple: (analysisIds: string[], format: ExportFormat, options?: Partial<ExportOptions>) => Promise<void>;
  exportAll: (format: ExportFormat, options?: Partial<ExportOptions>) => Promise<void>;
  clearHistory: () => Promise<void>;
  updateFilters: (filters: Partial<HistoryFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: HistoryFilters = {
  searchTerm: '',
  severityFilter: 'all',
  dateRange: {
    start: null,
    end: null
  },
  fileTypeFilter: '',
  scoreRange: {
    min: 0,
    max: 100
  }
};

export const useAnalysisHistory = () => {
  const [state, setState] = useState<HistoryState>({
    analyses: [],
    filteredAnalyses: [],
    currentAnalysis: null,
    isLoading: true,
    error: null,
    totalCount: 0,
    storageStats: {
      currentSize: 0,
      maxSize: 0,
      usagePercentage: 0,
      historyCount: 0
    }
  });

  const [filters, setFilters] = useState<HistoryFilters>(defaultFilters);

  // Initialize storage service on mount
  useEffect(() => {
    console.log('🔧 Initializing analysis history hook...');

    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      setState(prev => ({
        ...prev,
        error: 'Local storage is not available',
        isLoading: false
      }));
      return;
    }

    console.log('✅ Storage available, loading history...');
  }, []);

  // Load history data
  const loadHistory = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const history = analysisStorage.getAnalysisHistory();
      const storageStats = analysisStorage.getStorageStats();

      console.log('🔍 Loading history data:', {
        currentAnalysis: history.currentAnalysis ? {
          id: history.currentAnalysis.id,
          fileName: history.currentAnalysis.fileName,
          timestamp: new Date(history.currentAnalysis.timestamp).toLocaleString()
        } : null,
        previousCount: history.previousAnalyses.length,
        storageStats
      });

      const allAnalyses = [
        ...(history.currentAnalysis ? [history.currentAnalysis] : []),
        ...history.previousAnalyses
      ];

      console.log('📊 Total analyses found:', allAnalyses.length);

      setState(prev => ({
        ...prev,
        analyses: allAnalyses,
        currentAnalysis: history.currentAnalysis,
        totalCount: allAnalyses.length,
        storageStats,
        isLoading: false
      }));

    } catch (error) {
      console.error('Failed to load analysis history:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load analysis history',
        isLoading: false
      }));
    }
  }, []);

  // Filter analyses based on current filters
  const filteredAnalyses = useMemo(() => {
    let filtered = [...state.analyses];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(analysis =>
        analysis.fileName.toLowerCase().includes(searchLower) ||
        analysis.id.toLowerCase().includes(searchLower) ||
        analysis.results.issues.some(issue =>
          issue.message.toLowerCase().includes(searchLower) ||
          issue.type.toLowerCase().includes(searchLower)
        )
      );
    }

    // Severity filter
    if (filters.severityFilter !== 'all') {
      filtered = filtered.filter(analysis => {
        const summary = analysis.results.summary;
        switch (filters.severityFilter) {
          case 'critical':
            return summary.criticalIssues > 0;
          case 'high':
            return summary.highIssues > 0;
          case 'medium':
            return summary.mediumIssues > 0;
          case 'low':
            return summary.lowIssues > 0;
          default:
            return true;
        }
      });
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(analysis => {
        const analysisDate = new Date(analysis.timestamp);
        const start = filters.dateRange.start;
        const end = filters.dateRange.end;
        
        if (start && analysisDate < start) return false;
        if (end && analysisDate > end) return false;
        return true;
      });
    }

    // File type filter
    if (filters.fileTypeFilter) {
      const extension = filters.fileTypeFilter.toLowerCase();
      filtered = filtered.filter(analysis =>
        analysis.fileName.toLowerCase().endsWith(extension)
      );
    }

    // Score range filter
    filtered = filtered.filter(analysis => {
      const score = analysis.results.summary.securityScore;
      return score >= filters.scoreRange.min && score <= filters.scoreRange.max;
    });

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [state.analyses, filters]);

  // Update filtered analyses when filters change
  useEffect(() => {
    setState(prev => ({ ...prev, filteredAnalyses }));
  }, [filteredAnalyses]);

  // Load history on mount and set up storage listener
  useEffect(() => {
    loadHistory();

    // Subscribe to storage changes to auto-refresh
    const unsubscribe = analysisStorage.subscribe(() => {
      console.log('🔄 Storage changed, refreshing history...');
      loadHistory();
    });

    return unsubscribe;
  }, [loadHistory]);

  // Actions
  const actions: HistoryActions = {
    refreshHistory: loadHistory,

    deleteAnalysis: async (analysisId: string) => {
      try {
        await analysisStorage.deleteAnalysis(analysisId);
        await loadHistory();
        toast.success('Analysis deleted successfully');
      } catch (error) {
        console.error('Failed to delete analysis:', error);
        toast.error('Failed to delete analysis');
        throw error;
      }
    },

    restoreAnalysis: async (analysisId: string) => {
      try {
        await analysisStorage.restoreAnalysis(analysisId);
        await loadHistory();
        toast.success('Analysis restored successfully');
      } catch (error) {
        console.error('Failed to restore analysis:', error);
        toast.error('Failed to restore analysis');
        throw error;
      }
    },

    exportAnalysis: async (analysisId: string, format: ExportFormat, options: Partial<ExportOptions> = {}) => {
      try {
        const analysis = state.analyses.find(a => a.id === analysisId);
        if (!analysis) {
          throw new Error('Analysis not found');
        }

        const exportOptions: ExportOptions = {
          format,
          includeMetadata: true,
          includeFullDetails: true,
          ...options
        };

        const result = await exportService.exportAnalysis(analysis, exportOptions);
        exportService.downloadFile(result);
        toast.success(`Analysis exported as ${format.toUpperCase()}`);
      } catch (error) {
        console.error('Failed to export analysis:', error);
        toast.error('Failed to export analysis');
        throw error;
      }
    },

    exportMultiple: async (analysisIds: string[], format: ExportFormat, options: Partial<ExportOptions> = {}) => {
      try {
        const selectedAnalyses = state.analyses.filter(a => analysisIds.includes(a.id));
        if (selectedAnalyses.length === 0) {
          throw new Error('No analyses selected');
        }

        const exportOptions: ExportOptions = {
          format,
          includeMetadata: true,
          includeFullDetails: true,
          ...options
        };

        const result = await exportService.exportMultipleAnalyses(selectedAnalyses, exportOptions);
        exportService.downloadFile(result);
        toast.success(`${selectedAnalyses.length} analyses exported as ${format.toUpperCase()}`);
      } catch (error) {
        console.error('Failed to export analyses:', error);
        toast.error('Failed to export analyses');
        throw error;
      }
    },

    exportAll: async (format: ExportFormat, options: Partial<ExportOptions> = {}) => {
      try {
        if (state.analyses.length === 0) {
          throw new Error('No analyses to export');
        }

        const exportOptions: ExportOptions = {
          format,
          includeMetadata: true,
          includeFullDetails: true,
          ...options
        };

        const result = await exportService.exportMultipleAnalyses(state.analyses, exportOptions);
        exportService.downloadFile(result);
        toast.success(`All ${state.analyses.length} analyses exported as ${format.toUpperCase()}`);
      } catch (error) {
        console.error('Failed to export all analyses:', error);
        toast.error('Failed to export all analyses');
        throw error;
      }
    },

    clearHistory: async () => {
      try {
        await analysisStorage.clearHistory();
        await loadHistory();
        toast.success('History cleared successfully');
      } catch (error) {
        console.error('Failed to clear history:', error);
        toast.error('Failed to clear history');
        throw error;
      }
    },

    updateFilters: (newFilters: Partial<HistoryFilters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    },

    resetFilters: () => {
      setFilters(defaultFilters);
    }
  };

  return {
    ...state,
    filters,
    actions
  };
};
