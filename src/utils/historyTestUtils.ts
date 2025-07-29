/**
 * Test utilities for History functionality
 * Provides functions to create mock data and test the history features
 */

import { analysisStorage, type StoredAnalysisData } from '@/services/analysisStorage';
import { exportService, type ExportFormat } from '@/services/exportService';
import { AnalysisResults, SecurityIssue } from '@/hooks/useAnalysis';

export class HistoryTestUtils {
  /**
   * Create mock analysis data for testing
   */
  static createMockAnalysis(
    fileName: string,
    issueCount: number = 5,
    timestamp?: number
  ): StoredAnalysisData {
    const mockIssues: SecurityIssue[] = Array.from({ length: issueCount }, (_, i) => ({
      id: `issue-${i}`,
      type: ['SQL Injection', 'XSS', 'CSRF', 'Path Traversal', 'Buffer Overflow'][i % 5],
      severity: ['critical', 'high', 'medium', 'low'][i % 4] as 'critical' | 'high' | 'medium' | 'low',
      message: `Mock security issue ${i + 1} found in ${fileName}`,
      filename: fileName,
      line: Math.floor(Math.random() * 100) + 1,
      column: Math.floor(Math.random() * 50) + 1,
      description: `Detailed description of security issue ${i + 1}`,
      recommendation: `Fix recommendation for issue ${i + 1}`,
      cweId: `CWE-${Math.floor(Math.random() * 900) + 100}`,
      confidence: Math.floor(Math.random() * 100) + 1
    }));

    const criticalIssues = mockIssues.filter(i => i.severity === 'critical').length;
    const highIssues = mockIssues.filter(i => i.severity === 'high').length;
    const mediumIssues = mockIssues.filter(i => i.severity === 'medium').length;
    const lowIssues = mockIssues.filter(i => i.severity === 'low').length;

    const mockResults: AnalysisResults = {
      issues: mockIssues,
      totalFiles: Math.floor(Math.random() * 10) + 1,
      analysisTime: `${(Math.random() * 5 + 0.5).toFixed(1)}s`,
      summary: {
        criticalIssues,
        highIssues,
        mediumIssues,
        lowIssues,
        securityScore: Math.floor(Math.random() * 100),
        qualityScore: Math.floor(Math.random() * 100),
        coveragePercentage: Math.floor(Math.random() * 100),
        linesAnalyzed: Math.floor(Math.random() * 1000) + 100
      },
      metrics: {
        vulnerabilityDensity: Math.random() * 10,
        technicalDebt: `${Math.floor(Math.random() * 24)}h`,
        maintainabilityIndex: Math.floor(Math.random() * 100),
        duplicatedLines: Math.floor(Math.random() * 50),
        testCoverage: Math.floor(Math.random() * 100)
      },
      dependencies: {
        total: Math.floor(Math.random() * 50) + 10,
        vulnerable: Math.floor(Math.random() * 5),
        outdated: Math.floor(Math.random() * 10),
        licenses: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause']
      }
    };

    const mockFile = new File(['mock content'], fileName, { type: 'text/plain' });
    
    return {
      id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: timestamp || Date.now(),
      fileName,
      fileSize: mockFile.size,
      fileHash: `hash-${Math.random().toString(36).substr(2, 16)}`,
      version: '2.0.0',
      results: mockResults,
      metadata: {
        userAgent: navigator.userAgent,
        analysisEngine: 'EnhancedAnalysisEngine',
        engineVersion: '3.0.0',
        sessionId: `session-${Math.random().toString(36).substr(2, 16)}`
      }
    };
  }

  /**
   * Populate history with mock data for testing
   */
  static async populateTestHistory(count: number = 8): Promise<void> {
    console.log(`🧪 Creating ${count} mock analyses for testing...`);

    const fileNames = [
      'app.js',
      'server.py',
      'database.sql',
      'auth.php',
      'config.json',
      'main.java',
      'security.ts',
      'api.go',
      'frontend.vue',
      'backend.rb'
    ];

    // Create analyses with different timestamps (spread over last 30 days)
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < count; i++) {
      const fileName = fileNames[i % fileNames.length];
      const timestamp = thirtyDaysAgo + (i * (now - thirtyDaysAgo) / count);
      const issueCount = Math.floor(Math.random() * 15) + 1;

      const mockAnalysis = this.createMockAnalysis(fileName, issueCount, timestamp);

      // Simulate storing the analysis
      const mockFile = new File(['mock content'], fileName, { type: 'text/plain' });
      await analysisStorage.storeAnalysisResults(mockAnalysis.results, mockFile);

      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    console.log(`✅ Created ${count} mock analyses successfully!`);
  }

  /**
   * Create a single test analysis and store it
   */
  static async createSingleTestAnalysis(fileName: string = 'test-file.js'): Promise<void> {
    console.log(`🧪 Creating single test analysis for ${fileName}...`);

    const mockAnalysis = this.createMockAnalysis(fileName, 5);
    const mockFile = new File(['mock content for testing'], fileName, { type: 'text/plain' });

    try {
      await analysisStorage.storeAnalysisResults(mockAnalysis.results, mockFile);
      console.log(`✅ Test analysis created and stored successfully!`);

      // Debug the storage immediately after
      this.debugStorage();
    } catch (error) {
      console.error(`❌ Failed to create test analysis:`, error);
    }
  }

  /**
   * Test export functionality
   */
  static async testExportFunctionality(): Promise<void> {
    console.log('🧪 Testing export functionality...');
    
    const history = analysisStorage.getAnalysisHistory();
    const allAnalyses = [
      ...(history.currentAnalysis ? [history.currentAnalysis] : []),
      ...history.previousAnalyses
    ];

    if (allAnalyses.length === 0) {
      console.log('⚠️ No analyses found for export testing');
      return;
    }

    const formats: ExportFormat[] = ['json', 'csv', 'txt'];
    
    for (const format of formats) {
      try {
        const result = await exportService.exportMultipleAnalyses(allAnalyses, {
          format,
          includeMetadata: true,
          includeFullDetails: true
        });
        
        console.log(`✅ ${format.toUpperCase()} export test passed:`, {
          filename: result.filename,
          mimeType: result.mimeType,
          dataSize: typeof result.data === 'string' ? result.data.length : result.data.size
        });
      } catch (error) {
        console.error(`❌ ${format.toUpperCase()} export test failed:`, error);
      }
    }
  }

  /**
   * Test storage operations
   */
  static async testStorageOperations(): Promise<void> {
    console.log('🧪 Testing storage operations...');
    
    try {
      // Test getting history
      const history = analysisStorage.getAnalysisHistory();
      console.log('✅ Get history test passed:', {
        currentAnalysis: !!history.currentAnalysis,
        previousCount: history.previousAnalyses.length,
        totalStorage: history.totalStorageUsed
      });

      // Test storage stats
      const stats = analysisStorage.getStorageStats();
      console.log('✅ Storage stats test passed:', stats);

      // Test delete operation (if there are analyses)
      if (history.previousAnalyses.length > 0) {
        const analysisToDelete = history.previousAnalyses[history.previousAnalyses.length - 1];
        await analysisStorage.deleteAnalysis(analysisToDelete.id);
        console.log('✅ Delete analysis test passed');
      }

      // Test restore operation (if there are analyses)
      if (history.previousAnalyses.length > 0) {
        const analysisToRestore = history.previousAnalyses[0];
        await analysisStorage.restoreAnalysis(analysisToRestore.id);
        console.log('✅ Restore analysis test passed');
      }

    } catch (error) {
      console.error('❌ Storage operations test failed:', error);
    }
  }

  /**
   * Clear all test data
   */
  static async clearTestData(): Promise<void> {
    console.log('🧹 Clearing test data...');
    
    try {
      await analysisStorage.clearHistory();
      analysisStorage.clearCurrentAnalysis();
      console.log('✅ Test data cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear test data:', error);
    }
  }

  /**
   * Run comprehensive test suite
   */
  static async runTestSuite(): Promise<void> {
    console.log('🚀 Starting History functionality test suite...');
    console.log('='.repeat(50));

    try {
      // Clear existing data
      await this.clearTestData();
      
      // Populate with test data
      await this.populateTestHistory(8);
      
      // Test storage operations
      await this.testStorageOperations();
      
      // Test export functionality
      await this.testExportFunctionality();
      
      console.log('='.repeat(50));
      console.log('✅ All tests completed successfully!');
      console.log('📝 Check the History page at /history to see the results');
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  /**
   * Get test summary
   */
  static getTestSummary(): void {
    const history = analysisStorage.getAnalysisHistory();
    const stats = analysisStorage.getStorageStats();

    console.log('📊 History Test Summary:');
    console.log('-'.repeat(30));
    console.log(`Current Analysis: ${history.currentAnalysis ? history.currentAnalysis.fileName : 'None'}`);
    console.log(`Previous Analyses: ${history.previousAnalyses.length}`);
    console.log(`Total Storage Used: ${(stats.currentSize / 1024).toFixed(2)} KB`);
    console.log(`Storage Usage: ${stats.usagePercentage.toFixed(1)}%`);
    console.log(`History Count: ${stats.historyCount}`);
  }

  /**
   * Debug storage contents
   */
  static debugStorage(): void {
    console.log('🔍 Storage Debug Information:');
    console.log('='.repeat(50));

    // Check raw localStorage
    const currentKey = 'codeGuardianAnalysis';
    const historyKey = 'codeGuardianHistory';

    const currentRaw = localStorage.getItem(currentKey);
    const historyRaw = localStorage.getItem(historyKey);

    console.log('📦 Raw Storage Contents:');
    console.log(`Current Analysis Key (${currentKey}):`, currentRaw ? 'EXISTS' : 'MISSING');
    console.log(`History Key (${historyKey}):`, historyRaw ? 'EXISTS' : 'MISSING');

    if (currentRaw) {
      try {
        const currentData = JSON.parse(currentRaw);
        console.log('📄 Current Analysis Data:', {
          id: currentData.id,
          fileName: currentData.fileName,
          timestamp: new Date(currentData.timestamp).toLocaleString(),
          issueCount: currentData.results?.issues?.length || 0
        });
      } catch (error) {
        console.error('❌ Failed to parse current analysis:', error);
      }
    }

    if (historyRaw) {
      try {
        const historyData = JSON.parse(historyRaw);
        console.log('📚 History Data:', {
          previousCount: historyData.previousAnalyses?.length || 0,
          maxHistorySize: historyData.maxHistorySize,
          totalStorageUsed: historyData.totalStorageUsed
        });

        if (historyData.previousAnalyses?.length > 0) {
          console.log('📋 Previous Analyses:');
          historyData.previousAnalyses.forEach((analysis: any, index: number) => {
            console.log(`  ${index + 1}. ${analysis.fileName} (${new Date(analysis.timestamp).toLocaleString()})`);
          });
        }
      } catch (error) {
        console.error('❌ Failed to parse history:', error);
      }
    }

    // Check using service methods
    console.log('\n🔧 Service Method Results:');
    const currentAnalysis = analysisStorage.getCurrentAnalysis();
    const history = analysisStorage.getAnalysisHistory();
    const stats = analysisStorage.getStorageStats();

    console.log('Current Analysis (service):', currentAnalysis ? {
      id: currentAnalysis.id,
      fileName: currentAnalysis.fileName,
      timestamp: new Date(currentAnalysis.timestamp).toLocaleString()
    } : 'None');

    console.log('History (service):', {
      currentAnalysis: history.currentAnalysis ? history.currentAnalysis.fileName : 'None',
      previousCount: history.previousAnalyses.length,
      maxHistorySize: history.maxHistorySize
    });

    console.log('Storage Stats:', stats);

    console.log('='.repeat(50));
  }
}

// Make it available globally for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).HistoryTestUtils = HistoryTestUtils;
}
