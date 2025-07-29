# Analysis History Feature Guide

## Overview

The Analysis History feature provides comprehensive management of your security analysis results, allowing you to view, search, filter, and export the last 10 analysis results with full details.

## Features

### 📊 History Dashboard
- **View Last 10 Results**: Displays the most recent 10 analysis results with complete details
- **Current Analysis Indicator**: Clearly shows which analysis is currently active
- **Storage Statistics**: Monitor storage usage and history count
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🔍 Search and Filter Capabilities
- **Text Search**: Search by filename, analysis ID, or issue content
- **Severity Filter**: Filter by issue severity (Critical, High, Medium, Low)
- **File Type Filter**: Filter by file extensions (e.g., .js, .py, .java)
- **Score Range Filter**: Filter by security/quality scores
- **Date Range Filter**: Filter analyses by date range

### 📤 Export Options
- **Multiple Formats**: Export as JSON, CSV, Text, or PDF
- **Flexible Selection**: Export single analysis, multiple selected, or all analyses
- **Detailed Options**: Include/exclude metadata and full issue details
- **Batch Operations**: Select multiple analyses for bulk operations

### 🛠️ Management Operations
- **Restore Analysis**: Set any previous analysis as the current one
- **Delete Analysis**: Remove specific analyses from history
- **Clear History**: Clear all previous analyses (keeps current)
- **Bulk Operations**: Perform operations on multiple selected analyses

## How to Use

### Accessing the History Page
1. Navigate to the application
2. Click on "History" in the navigation menu
3. The history page will load showing all available analyses

### Viewing Analysis Details
1. Each analysis card shows:
   - File name and timestamp
   - Security and quality scores
   - Issue counts by severity
   - Analysis time and file size
2. Click the expand button (chevron) to see detailed information:
   - Complete analysis metrics
   - Recent issues found
   - File and engine details

### Searching and Filtering
1. **Text Search**: Use the search bar to find specific analyses
2. **Advanced Filters**: Click "Filters" to access additional options:
   - Select severity levels
   - Filter by file type
   - Set score ranges
3. **Reset Filters**: Click "Reset Filters" to clear all filters

### Exporting Data
1. **Single Analysis**: Click the download icon on any analysis card
2. **Multiple Analyses**: 
   - Select analyses using checkboxes
   - Choose export format from dropdown
   - Click export
3. **All Analyses**: Use export dropdown without selecting any analyses

### Managing Analyses
1. **Restore**: Click the restore icon to make an analysis current
2. **Delete**: Click the trash icon to remove an analysis
3. **Bulk Delete**: Select multiple analyses and click "Delete (X)"

## Technical Details

### Storage Capacity
- **Maximum History**: 10 analysis results
- **Storage Limit**: 50MB total storage
- **Auto-Cleanup**: Automatically removes oldest entries when limit reached
- **Compression**: Large results are automatically compressed

### Data Persistence
- **Local Storage**: All data stored in browser's local storage
- **Cross-Tab Sync**: Changes sync across browser tabs
- **Version Management**: Handles data format upgrades automatically
- **Backup/Restore**: Export/import functionality for data backup

### Export Formats

#### JSON Format
- Complete analysis data with metadata
- Structured format for programmatic use
- Includes all issue details and metrics

#### CSV Format
- Tabular format for spreadsheet applications
- Summary data with optional detailed issues
- Compatible with Excel, Google Sheets

#### Text Format
- Human-readable format
- Suitable for reports and documentation
- Includes formatted issue summaries

#### PDF Format
- Professional report format
- Formatted for printing and sharing
- Includes charts and visual elements

## Testing the Feature

### Using Test Utilities (Development Mode)
In development mode, test utilities are available in the browser console:

```javascript
// Create mock data for testing
HistoryTestUtils.populateTestHistory(8);

// Run comprehensive test suite
HistoryTestUtils.runTestSuite();

// Test export functionality
HistoryTestUtils.testExportFunctionality();

// Clear test data
HistoryTestUtils.clearTestData();

// Get test summary
HistoryTestUtils.getTestSummary();
```

### Manual Testing Steps
1. **Upload Files**: Upload different types of files for analysis
2. **Generate History**: Perform multiple analyses to build history
3. **Test Search**: Try different search terms and filters
4. **Test Export**: Export in different formats and verify content
5. **Test Management**: Restore, delete, and manage analyses

## Troubleshooting

### Common Issues

#### No History Displayed
- **Cause**: No analyses have been performed yet
- **Solution**: Upload and analyze some files first

#### Export Not Working
- **Cause**: Browser blocking downloads or no data selected
- **Solution**: Check browser settings and ensure analyses are selected

#### Storage Full Warning
- **Cause**: Reached 50MB storage limit
- **Solution**: Delete old analyses or clear history

#### Search Not Finding Results
- **Cause**: Filters too restrictive or typos in search
- **Solution**: Reset filters and check search terms

### Performance Tips
- **Large Exports**: For large datasets, use compressed JSON format
- **Storage Management**: Regularly clean up old analyses
- **Filter Usage**: Use filters to improve performance with many analyses

## API Reference

### HistoryActions Interface
```typescript
interface HistoryActions {
  refreshHistory: () => void;
  deleteAnalysis: (analysisId: string) => Promise<void>;
  restoreAnalysis: (analysisId: string) => Promise<void>;
  exportAnalysis: (analysisId: string, format: ExportFormat) => Promise<void>;
  exportMultiple: (analysisIds: string[], format: ExportFormat) => Promise<void>;
  exportAll: (format: ExportFormat) => Promise<void>;
  clearHistory: () => Promise<void>;
  updateFilters: (filters: Partial<HistoryFilters>) => void;
  resetFilters: () => void;
}
```

### Export Options
```typescript
interface ExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'txt';
  includeMetadata?: boolean;
  includeFullDetails?: boolean;
  selectedFields?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}
```

## Future Enhancements

### Planned Features
- **Cloud Sync**: Synchronize history across devices
- **Advanced Analytics**: Trend analysis and insights
- **Custom Reports**: Template-based report generation
- **Collaboration**: Share analyses with team members
- **Integration**: Export to external tools and services

### Feedback and Contributions
- Report issues through the application's feedback system
- Suggest improvements for better user experience
- Contribute to the open-source development

---

**Note**: This feature requires a modern browser with local storage support. All data is stored locally and never transmitted to external servers unless explicitly exported by the user.
