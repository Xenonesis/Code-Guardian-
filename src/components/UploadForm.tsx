import React from 'react';
import { FileCode, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnalysisResults } from '@/hooks/useAnalysis';
import { useFileUpload } from '@/hooks/useFileUpload';
import { FileUploadArea } from '@/components/upload/FileUploadArea';
import { FileStatus } from '@/components/upload/FileStatus';
import { UploadProgress } from '@/components/upload/UploadProgress';

interface UploadFormProps {
  onFileSelect: (file: File) => void;
  onAnalysisComplete: (results: AnalysisResults) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onFileSelect, onAnalysisComplete }) => {
  const {
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
  } = useFileUpload({ onFileSelect, onAnalysisComplete });

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-2xl card-hover">
      <CardHeader className="text-center pb-6 sm:pb-8">
        <CardTitle className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg animate-float">
            <FileCode className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
          </div>
          <span className="text-center">Upload Your Code</span>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mt-3 sm:mt-4 px-2 sm:px-4 lg:px-0 leading-relaxed">
          Upload a .zip file containing your source code for comprehensive security and quality analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 lg:space-y-8 px-3 sm:px-4 lg:px-6">
        {/* Progress indicators */}
        {(isUploading || isAnalyzing) && (
          <UploadProgress
            isUploading={isUploading}
            isAnalyzing={isAnalyzing}
            uploadProgress={uploadProgress}
            analysisProgress={analysisProgress}
            currentAnalysisStep={currentAnalysisStep}
          />
        )}

        {!selectedFile ? (
          <FileUploadArea
            isDragOver={isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileInput={handleFileInput}
          />
        ) : !isUploading && !isAnalyzing ? (
          <FileStatus
            selectedFile={selectedFile}
            isUploading={isUploading}
            isAnalyzing={isAnalyzing}
            uploadComplete={uploadComplete}
            uploadProgress={uploadProgress}
            onRemoveFile={removeFile}
          />
        ) : null}

        {/* Info and error alerts - only show when not processing */}
        {!isUploading && !isAnalyzing && (
          <>
            <Alert className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20 dark:border-l-amber-400" role="note">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <AlertDescription className="text-amber-800 dark:text-amber-200 text-xs sm:text-sm lg:text-base leading-relaxed">
                <strong>Privacy & Security:</strong> Your code is analyzed locally and securely. Files are processed in-browser with persistent storage for your convenience. Analysis results are automatically saved until you upload a new file.
              </AlertDescription>
            </Alert>
            {error && (
              <Alert className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20 dark:border-l-red-400" role="alert">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                <AlertDescription className="text-red-800 dark:text-red-200 text-xs sm:text-sm lg:text-base leading-relaxed">
                  <strong>Invalid ZIP File:</strong> {error}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadForm;
