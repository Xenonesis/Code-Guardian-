import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const mockAnalysisResults = {
  summary: {
    totalIssues: 5,
    criticalIssues: 1,
    highIssues: 2,
    mediumIssues: 1,
    lowIssues: 1,
    filesScanned: 10,
    linesOfCode: 1000,
    securityScore: 85,
    qualityScore: 90,
    maintainabilityIndex: 75
  },
  issues: [
    {
      id: '1',
      type: 'security',
      severity: 'critical',
      title: 'SQL Injection Vulnerability',
      description: 'Potential SQL injection in user input handling',
      file: 'src/api/users.ts',
      line: 45,
      column: 12,
      rule: 'security/detect-sql-injection',
      category: 'Security'
    }
  ],
  metrics: {
    complexity: 15,
    maintainability: 75,
    testCoverage: 80,
    duplicateCode: 5
  },
  dependencies: [],
  frameworks: ['React', 'TypeScript'],
  languages: ['TypeScript', 'JavaScript'],
  timestamp: new Date().toISOString()
};

export const mockFile = new File(['test content'], 'test.ts', {
  type: 'text/typescript'
});