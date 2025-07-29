/**
 * Export Service for Analysis Results
 * Supports multiple export formats: JSON, CSV, PDF
 */

import { StoredAnalysisData } from './analysisStorage';
import { AnalysisResults, SecurityIssue } from '@/hooks/useAnalysis';

export type ExportFormat = 'json' | 'csv' | 'pdf' | 'txt';

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  includeFullDetails?: boolean;
  selectedFields?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ExportResult {
  data: string | Blob;
  filename: string;
  mimeType: string;
}

export class ExportService {
  /**
   * Export single analysis result
   */
  public async exportAnalysis(
    analysis: StoredAnalysisData,
    options: ExportOptions
  ): Promise<ExportResult> {
    switch (options.format) {
      case 'json':
        return this.exportAsJSON([analysis], options);
      case 'csv':
        return this.exportAsCSV([analysis], options);
      case 'pdf':
        return this.exportAsPDF([analysis], options);
      case 'txt':
        return this.exportAsText([analysis], options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Export multiple analysis results
   */
  public async exportMultipleAnalyses(
    analyses: StoredAnalysisData[],
    options: ExportOptions
  ): Promise<ExportResult> {
    if (analyses.length === 0) {
      throw new Error('No analyses to export');
    }

    // Filter by date range if specified
    let filteredAnalyses = analyses;
    if (options.dateRange) {
      filteredAnalyses = analyses.filter(analysis => {
        const analysisDate = new Date(analysis.timestamp);
        return analysisDate >= options.dateRange!.start && 
               analysisDate <= options.dateRange!.end;
      });
    }

    switch (options.format) {
      case 'json':
        return this.exportAsJSON(filteredAnalyses, options);
      case 'csv':
        return this.exportAsCSV(filteredAnalyses, options);
      case 'pdf':
        return this.exportAsPDF(filteredAnalyses, options);
      case 'txt':
        return this.exportAsText(filteredAnalyses, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Export as JSON format
   */
  private exportAsJSON(
    analyses: StoredAnalysisData[],
    options: ExportOptions
  ): ExportResult {
    const exportData = {
      exportedAt: new Date().toISOString(),
      exportOptions: options,
      totalAnalyses: analyses.length,
      analyses: analyses.map(analysis => this.formatAnalysisForExport(analysis, options))
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const filename = this.generateFilename('analysis-export', 'json', analyses.length);

    return {
      data: jsonString,
      filename,
      mimeType: 'application/json'
    };
  }

  /**
   * Export as CSV format
   */
  private exportAsCSV(
    analyses: StoredAnalysisData[],
    options: ExportOptions
  ): ExportResult {
    const headers = [
      'Analysis ID',
      'File Name',
      'Timestamp',
      'Total Issues',
      'Critical Issues',
      'High Issues',
      'Medium Issues',
      'Low Issues',
      'Security Score',
      'Quality Score',
      'Lines Analyzed',
      'Analysis Time'
    ];

    if (options.includeMetadata) {
      headers.push('File Size', 'Engine Version', 'Session ID');
    }

    const rows = analyses.map(analysis => {
      const row = [
        analysis.id,
        analysis.fileName,
        new Date(analysis.timestamp).toISOString(),
        analysis.results.issues.length.toString(),
        analysis.results.summary.criticalIssues.toString(),
        analysis.results.summary.highIssues.toString(),
        analysis.results.summary.mediumIssues.toString(),
        analysis.results.summary.lowIssues.toString(),
        analysis.results.summary.securityScore.toString(),
        analysis.results.summary.qualityScore.toString(),
        analysis.results.summary.linesAnalyzed.toString(),
        analysis.results.analysisTime
      ];

      if (options.includeMetadata) {
        row.push(
          analysis.fileSize.toString(),
          analysis.metadata.engineVersion,
          analysis.metadata.sessionId
        );
      }

      return row;
    });

    // Add detailed issues if requested
    if (options.includeFullDetails) {
      headers.push('Issue Type', 'Severity', 'Message', 'File', 'Line', 'Column');
      
      const detailedRows: string[][] = [];
      analyses.forEach(analysis => {
        analysis.results.issues.forEach(issue => {
          const baseRow = new Array(headers.length - 6).fill('');
          baseRow[0] = analysis.id; // Analysis ID
          baseRow[1] = analysis.fileName; // File Name
          
          detailedRows.push([
            ...baseRow,
            issue.type,
            issue.severity,
            issue.message,
            issue.filename,
            issue.line?.toString() || '',
            issue.column?.toString() || ''
          ]);
        });
      });
      
      rows.push(...detailedRows);
    }

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const filename = this.generateFilename('analysis-export', 'csv', analyses.length);

    return {
      data: csvContent,
      filename,
      mimeType: 'text/csv'
    };
  }

  /**
   * Export as PDF format (simplified - would need a PDF library for full implementation)
   */
  private exportAsPDF(
    analyses: StoredAnalysisData[],
    options: ExportOptions
  ): ExportResult {
    // For now, create a formatted text that could be converted to PDF
    const content = this.generatePDFContent(analyses, options);
    const filename = this.generateFilename('analysis-export', 'pdf', analyses.length);

    // In a real implementation, you would use a library like jsPDF or PDFKit
    // For now, return as text with PDF mime type
    return {
      data: content,
      filename,
      mimeType: 'application/pdf'
    };
  }

  /**
   * Export as plain text format
   */
  private exportAsText(
    analyses: StoredAnalysisData[],
    options: ExportOptions
  ): ExportResult {
    const content = this.generateTextContent(analyses, options);
    const filename = this.generateFilename('analysis-export', 'txt', analyses.length);

    return {
      data: content,
      filename,
      mimeType: 'text/plain'
    };
  }

  /**
   * Format analysis data for export
   */
  private formatAnalysisForExport(
    analysis: StoredAnalysisData,
    options: ExportOptions
  ): any {
    const formatted: any = {
      id: analysis.id,
      timestamp: analysis.timestamp,
      fileName: analysis.fileName,
      results: {
        summary: analysis.results.summary,
        totalFiles: analysis.results.totalFiles,
        analysisTime: analysis.results.analysisTime,
        issueCount: analysis.results.issues.length
      }
    };

    if (options.includeMetadata) {
      formatted.metadata = analysis.metadata;
      formatted.fileSize = analysis.fileSize;
      formatted.fileHash = analysis.fileHash;
    }

    if (options.includeFullDetails) {
      formatted.results.issues = analysis.results.issues;
      formatted.results.metrics = analysis.results.metrics;
      formatted.results.dependencies = analysis.results.dependencies;
      formatted.results.languageDetection = analysis.results.languageDetection;
    }

    return formatted;
  }

  /**
   * Generate filename for export
   */
  private generateFilename(
    prefix: string,
    extension: string,
    count: number
  ): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const countSuffix = count > 1 ? `-${count}-analyses` : '';
    return `${prefix}${countSuffix}-${timestamp}.${extension}`;
  }

  /**
   * Generate PDF content (formatted text)
   */
  private generatePDFContent(
    analyses: StoredAnalysisData[],
    options: ExportOptions
  ): string {
    let content = `CODE GUARDIAN ANALYSIS REPORT\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Total Analyses: ${analyses.length}\n\n`;
    content += `${'='.repeat(50)}\n\n`;

    analyses.forEach((analysis, index) => {
      content += `ANALYSIS ${index + 1}\n`;
      content += `-`.repeat(20) + '\n';
      content += `File: ${analysis.fileName}\n`;
      content += `Date: ${new Date(analysis.timestamp).toLocaleString()}\n`;
      content += `Analysis Time: ${analysis.results.analysisTime}\n`;
      content += `Security Score: ${analysis.results.summary.securityScore}/100\n`;
      content += `Quality Score: ${analysis.results.summary.qualityScore}/100\n`;
      content += `Total Issues: ${analysis.results.issues.length}\n`;
      content += `  - Critical: ${analysis.results.summary.criticalIssues}\n`;
      content += `  - High: ${analysis.results.summary.highIssues}\n`;
      content += `  - Medium: ${analysis.results.summary.mediumIssues}\n`;
      content += `  - Low: ${analysis.results.summary.lowIssues}\n\n`;

      if (options.includeFullDetails && analysis.results.issues.length > 0) {
        content += `ISSUES FOUND:\n`;
        analysis.results.issues.forEach((issue, issueIndex) => {
          content += `${issueIndex + 1}. [${issue.severity.toUpperCase()}] ${issue.type}\n`;
          content += `   ${issue.message}\n`;
          content += `   File: ${issue.filename}:${issue.line || '?'}\n\n`;
        });
      }

      content += `\n${'='.repeat(50)}\n\n`;
    });

    return content;
  }

  /**
   * Generate plain text content
   */
  private generateTextContent(
    analyses: StoredAnalysisData[],
    options: ExportOptions
  ): string {
    return this.generatePDFContent(analyses, options);
  }

  /**
   * Download file helper
   */
  public downloadFile(exportResult: ExportResult): void {
    const blob = typeof exportResult.data === 'string' 
      ? new Blob([exportResult.data], { type: exportResult.mimeType })
      : exportResult.data;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportResult.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();
