import MetricsDashboard from "../components/MetricsDashboard";
import { useState, Suspense, lazy } from 'react';
import { Link } from "react-router-dom";
import { PageLayout } from '@/components/layouts/PageLayout';
import { UploadForm } from '@/components/UploadForm';
import { AnalysisTabs } from '@/components/pages/home/AnalysisTabs';
import { StorageBanner } from '@/components/pages/home/StorageBanner';
import { useAnalysisHandlers } from '@/components/pages/home/AnalysisHandlers';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useEnhancedAnalysis } from '@/hooks/useEnhancedAnalysis';

// Lazy load heavy components for better performance
const FloatingChatBot = lazy(() => import('@/components/FloatingChatBot'));
const StorageStatus = lazy(() => import('@/components/StorageStatus'));
const AnalysisHistoryModal = lazy(() => import('@/components/AnalysisHistoryModal'));

const Index = () => {
  const [currentTab, setCurrentTab] = useState('prompts');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showStorageStatus, setShowStorageStatus] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showMetrics, setShowMetrics] = useState(false);
  
  const {
    analysisResults,
    hasStoredData,
    isNewFile,
    storedAnalysis,
    storageStats,
    handleFileSelect,
    handleAnalysisComplete,
    clearStoredData,
    exportAnalysis,
    importAnalysis,
    getAnalysisHistory,
    optimizeStorage,
    restoreFromHistory,
  } = useEnhancedAnalysis();

  const {
    handleAnalysisCompleteWithRedirect,
    handleClearStoredData,
    handleExportAnalysis,
    handleImportAnalysis,
    handleOptimizeStorage,
    handleRestoreFromHistory
  } = useAnalysisHandlers({
    hasStoredData,
    onAnalysisComplete: handleAnalysisComplete,
    onSetCurrentTab: setCurrentTab,
    onSetIsRedirecting: setIsRedirecting,
    onClearStoredData: clearStoredData,
    onExportAnalysis: exportAnalysis,
    onImportAnalysis: importAnalysis,
    onOptimizeStorage: optimizeStorage,
    onRestoreFromHistory: (analysisData) => {
      restoreFromHistory(analysisData);
      setShowHistoryModal(false);
    }
  });

  return (
    <PageLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    >
      <div className="relative z-10">
        {/* Hero Section with Enhanced Background - Matching terms page */}
        <section className="relative max-w-4xl mx-auto py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
          {/* Enhanced Background for Hero Section Only */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {/* Main dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl"></div>
            
            {/* Floating gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl animate-float-delayed"></div>
            
            {/* Additional atmospheric elements */}
            <div className="absolute top-1/2 right-1/6 w-32 h-32 bg-gradient-to-r from-pink-500/15 to-rose-500/15 rounded-full blur-2xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/6 left-1/3 w-40 h-40 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '1s'}}></div>
            
            {/* Scattered decorative elements */}
            <div className="absolute top-1/6 right-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 left-1/6 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-2/3 left-1/2 w-1 h-1 bg-pink-400/60 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          {/* Upload Form with relative positioning to appear above background */}
          <div className="relative z-10">
            <UploadForm
              onFileSelect={handleFileSelect}
              onAnalysisComplete={handleAnalysisCompleteWithRedirect}
            />
            {/* Dashboard Metrics Button */}
          <div className="flex flex-col items-center mt-6">
            <button
              onClick={() => setShowMetrics((prev) => !prev)}
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600           to-indigo-600 text-white font-semibold shadow-lg hover:from-indigo-600           hover:to-purple-600 transition-colors duration-200 focus:outline-none           focus:ring-2 focus:ring-purple-400"
            >
              {showMetrics ? "Hide Security Metrics Dashboard" : "View Security Metrics           Dashboard"}
            </button>
            {showMetrics && (          
              <div className="w-full mt-8">
                <MetricsDashboard
                  totalVulnerabilities={42}
                  critical={2}
                  high={8}
                  medium={15}
                  low={17}
                  codeCoverage={87}
                  scanDate="2025-07-28"
                />
              </div>
            )}
            </div>
          </div>
        </section>

      <StorageBanner
        hasStoredData={hasStoredData}
        storedAnalysis={storedAnalysis}
        storageStats={storageStats}
        isNewFile={isNewFile}
        showStorageStatus={showStorageStatus}
        onToggleStorageStatus={() => setShowStorageStatus(!showStorageStatus)}
      />

      {/* Storage Status Component */}
      {showStorageStatus && (
        <div className="max-w-6xl mx-auto mb-6">
          <Suspense fallback={<div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>}>
            <StorageStatus
              hasStoredData={hasStoredData}
              storedAnalysis={storedAnalysis}
              storageStats={storageStats}
              onClearData={handleClearStoredData}
              onExportAnalysis={handleExportAnalysis}
              onImportAnalysis={handleImportAnalysis}
              onOptimizeStorage={handleOptimizeStorage}
              onShowHistory={() => setShowHistoryModal(true)}
            />
          </Suspense>
        </div>
      )}

      <AnalysisTabs
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        analysisResults={analysisResults}
        onFileSelect={handleFileSelect}
        onAnalysisComplete={handleAnalysisCompleteWithRedirect}
        isRedirecting={isRedirecting}
      />

      {/* Analysis History Modal */}
      <Suspense fallback={null}>
        <AnalysisHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          history={getAnalysisHistory()}
          onRestoreAnalysis={handleRestoreFromHistory}
        />
      </Suspense>

      {/* Floating Chat Bot */}
      <Suspense fallback={null}>
        {analysisResults && <FloatingChatBot analysisResults={analysisResults} />}
      </Suspense>
      </div>
    </PageLayout>
  );
};

export default Index;
