/**
 * Demo Data Generator
 * Creates sample analysis data for demonstration purposes
 */

import { analysisStorage } from '@/services/analysisStorage';
import { AnalysisResults, SecurityIssue } from '@/hooks/useAnalysis';

export class DemoDataGenerator {
  /**
   * Create mock analysis data for testing
   */
  static createMockAnalysis(
    fileName: string,
    issueCount: number = 5,
    timestamp?: number
  ): any {
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
   * Generate multiple sample analyses
   */
  static async generateSampleData(count: number = 5): Promise<void> {
    console.log(`🧪 Creating ${count} sample analyses...`);

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

    console.log(`✅ Created ${count} sample analyses successfully!`);
    
    // Reload the page to show the new data
    window.location.reload();
  }
}
