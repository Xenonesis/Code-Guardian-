import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ApiSecurityScanner,
  ContainerSecurityAnalyzer,
  DependencyRiskMonitor,
  CodeQualityGate,
  SecurityTrainingDashboard,
  IncidentResponseTracker
} from '@/components/specialized';
import FloatingChatBot from '@/components/FloatingChatBot';

export const SecurityDashboard: React.FC = () => {
  const mockAnalysisResults = {
    issues: [],
    totalFiles: 0,
    summary: {
      securityScore: 85,
      qualityScore: 78
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Security Dashboard</h1>
      
      <Tabs defaultValue="api-scanner" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="api-scanner">API Scanner</TabsTrigger>
          <TabsTrigger value="containers">Containers</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="quality-gate">Quality Gate</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="api-scanner">
          <ApiSecurityScanner />
        </TabsContent>
        
        <TabsContent value="containers">
          <ContainerSecurityAnalyzer />
        </TabsContent>
        
        <TabsContent value="dependencies">
          <DependencyRiskMonitor />
        </TabsContent>
        
        <TabsContent value="quality-gate">
          <CodeQualityGate />
        </TabsContent>
        
        <TabsContent value="training">
          <SecurityTrainingDashboard />
        </TabsContent>
        
        <TabsContent value="incidents">
          <IncidentResponseTracker />
        </TabsContent>
      </Tabs>

      <FloatingChatBot analysisResults={mockAnalysisResults} />
    </div>
  );
};