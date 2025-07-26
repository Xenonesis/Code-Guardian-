import { useState, useCallback } from 'react';
import { EnhancedAnalysisEngine } from '@/services/enhancedAnalysisEngine';
import { AnalysisResults } from '@/hooks/useAnalysis';
import { validateZipFile } from '@/utils/fileValidation';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface UseFileUploadProps {
  onFileSelect: (file: File) => void;
  onAnalysisComplete: (results: AnalysisResults) => void;
}

export const useFileUpload = ({ onFileSelect, onAnalysisComplete }: UseFileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [analysisEngine] = useState(() => new EnhancedAnalysisEngine());

  const analyzeCode = useCallback(async (file: File) => {
    console.log('Starting enhanced security analysis for:', file.name);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentAnalysisStep(0);

    // Show analysis started toast
    enhancedToast.analysisStarted(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      console.log('File size:', arrayBuffer.byteLength, 'bytes');

      // Simulate analysis progress with steps
      const analysisSteps = [
        { step: 0, progress: 10, delay: 500 },
        { step: 1, progress: 25, delay: 800 },
        { step: 2, progress: 45, delay: 1000 },
        { step: 3, progress: 70, delay: 1200 },
        { step: 4, progress: 90, delay: 800 },
        { step: 5, progress: 100, delay: 500 }
      ];

      // Progress simulation
      for (const { step, progress, delay } of analysisSteps) {
        await new Promise(resolve => setTimeout(resolve, delay));
        setCurrentAnalysisStep(step);
        setAnalysisProgress(progress);
      }

      try {
        const analysisResults = await analysisEngine.analyzeCodebase(file);
        console.log('Enhanced analysis complete:', {
          totalIssues: analysisResults.issues.length,
          totalFiles: analysisResults.totalFiles,
          analysisTime: analysisResults.analysisTime,
          securityScore: analysisResults.summary.securityScore,
          qualityScore: analysisResults.summary.qualityScore,
          criticalIssues: analysisResults.summary.criticalIssues,
          fullSummary: analysisResults.summary
        });

        setIsAnalyzing(false);
        setAnalysisProgress(100);
        
        // Show completion toast
        enhancedToast.analysisComplete(
          analysisResults.issues.length, 
          analysisResults.analysisTime
        );

        // Show security alerts if critical issues found
        if (analysisResults.summary.criticalIssues > 0) {
          enhancedToast.securityAlert('critical', analysisResults.summary.criticalIssues);
        } else if (analysisResults.summary.highIssues > 0) {
          enhancedToast.securityAlert('high', analysisResults.summary.highIssues);
        }

        onAnalysisComplete(analysisResults);
      } catch (analysisError) {
        console.error('Analysis engine error:', analysisError);
        setIsAnalyzing(false);
        
        if (analysisError instanceof Error && analysisError.message.includes('does not contain any code files')) {
          setError(analysisError.message);
          setSelectedFile(null);
          setUploadComplete(false);
          enhancedToast.error('Invalid ZIP file', {
            description: analysisError.message
          });
          return;
        }
        
        enhancedToast.error('Analysis failed', {
          description: 'An error occurred during analysis. Showing empty results.'
        });
        
        const emptyResults = {
          issues: [],
          totalFiles: 0,
          analysisTime: '0.1s',
          summary: {
            criticalIssues: 0,
            highIssues: 0,
            mediumIssues: 0,
            lowIssues: 0,
            securityScore: 100,
            qualityScore: 100,
            coveragePercentage: 0,
            linesAnalyzed: 0
          },
          metrics: {
            vulnerabilityDensity: 0,
            technicalDebt: '0',
            maintainabilityIndex: 100,
            duplicatedLines: 0
          },
          dependencies: {
            total: 0,
            vulnerable: 0,
            outdated: 0,
            licenses: []
          }
        };
        onAnalysisComplete(emptyResults);
      }

    } catch (error) {
      console.error('Error processing file:', error);
      setIsAnalyzing(false);
      setError('Failed to process the ZIP file. Please try again.');
      enhancedToast.error('Processing failed', {
        description: 'Failed to process the ZIP file. Please try again.'
      });
    }
  }, [onAnalysisComplete, analysisEngine]);

  const processZipFile = useCallback(async (file: File) => {
    console.log('Starting to process zip file:', file.name);
    
    const validation = await validateZipFile(file);
    if (!validation.isValid) {
      setError(validation.message);
      setSelectedFile(null);
      enhancedToast.error('Invalid file', {
        description: validation.message
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);
    setError(null);

    // Show file upload toast
    const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    enhancedToast.fileUploaded(file.name, fileSize);

    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          setUploadComplete(true);
          analyzeCode(file);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  }, [analyzeCode]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const zipFile = files.find(file => file.name.endsWith('.zip') || file.type === 'application/zip');

    if (zipFile) {
      console.log('File dropped:', zipFile.name);
      setSelectedFile(zipFile);
      onFileSelect(zipFile);
      processZipFile(zipFile);
    } else {
      console.log('No valid zip file found in dropped files');
    }
  }, [onFileSelect, processZipFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file?.name, 'Type:', file?.type);
    
    if (file && (file.name.endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed')) {
      console.log('Valid zip file selected via input:', file.name);
      setSelectedFile(file);
      onFileSelect(file);
      processZipFile(file);
    } else {
      console.log('Invalid file type selected');
      enhancedToast.error('Invalid file type', {
        description: 'Please select a valid .zip file containing your source code.'
      });
    }
    
    e.target.value = '';
  }, [onFileSelect, processZipFile]);

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setAnalysisProgress(0);
    setCurrentAnalysisStep(0);
    setIsUploading(false);
    setIsAnalyzing(false);
    setUploadComplete(false);
    setError(null);
  };

  return {
    isDragOver,
    uploadProgress,
    analysisProgress,
    currentAnalysisStep,
    selectedFile,
    isUploading,
    isAnalyzing,
    uploadComplete,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    removeFile
  };
};