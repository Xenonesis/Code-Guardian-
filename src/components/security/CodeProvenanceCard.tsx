import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  AlertTriangle,
  FileCheck,
  FileX,
  Scan,
  Clock,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  Activity,
  Database,
  Settings,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { 
  CodeProvenanceService, 
  TamperingAlert, 
  ProvenanceReport,
  FileIntegrityRecord 
} from '@/services/codeProvenanceService';
import { toast } from 'sonner';

interface CodeProvenanceCardProps {
  files?: { filename: string; content: string }[];
  onInitializeMonitoring?: () => void;
  className?: string;
}

export const CodeProvenanceCard: React.FC<CodeProvenanceCardProps> = ({
  files = [],
  onInitializeMonitoring,
  className = ''
}) => {
  const [provenanceService] = useState(() => new CodeProvenanceService());
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<ProvenanceReport | null>(null);
  const [alerts, setAlerts] = useState<TamperingAlert[]>([]);
  const [statistics, setStatistics] = useState({
    totalFiles: 0,
    criticalFiles: 0,
    alertCount: 0,
    lastScanTime: null as Date | null,
    monitoringStatus: false
  });

  const loadInitialData = useCallback(() => {
    const stats = provenanceService.getMonitoringStatistics();
    setStatistics(stats || {
      totalFiles: 0,
      criticalFiles: 0,
      alertCount: 0,
      lastScanTime: null,
      monitoringStatus: false
    });

    const currentAlerts = provenanceService.getAlerts();
    setAlerts(currentAlerts || []);
  }, [provenanceService]);

  const performIntegrityScan = useCallback(async () => {
    if (files.length === 0) return;

    setIsScanning(true);
    try {
      const scanReport = await provenanceService.performIntegrityScan(files);
      if (scanReport) {
        setReport(scanReport);
        loadInitialData();

        if (scanReport.integrityViolations && scanReport.integrityViolations > 0) {
          toast.warning(`Integrity scan complete: ${scanReport.integrityViolations} violations found`);
        } else {
          toast.success('Integrity scan complete: No violations detected');
        }
      } else {
        toast.error('Integrity scan failed: No report generated');
      }
    } catch (error) {
      toast.error('Integrity scan failed');
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  }, [files, provenanceService, loadInitialData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (files.length > 0) {
      performIntegrityScan();
    }
  }, [performIntegrityScan, files]);



  const initializeMonitoring = async () => {
    if (files.length === 0) {
      toast.error('No files available for monitoring');
      return;
    }

    setIsScanning(true);
    try {
      await provenanceService.initializeMonitoring(files);
      loadInitialData();
      toast.success(`Monitoring initialized for ${files.length} files`);
      onInitializeMonitoring?.();
    } catch (error) {
      toast.error('Failed to initialize monitoring');
      console.error('Monitoring initialization error:', error);
    } finally {
      setIsScanning(false);
    }
  };



  const resolveAlert = async (alertId: string) => {
    const success = provenanceService.resolveAlert(alertId);
    if (success) {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alert resolved');
    } else {
      toast.error('Failed to resolve alert');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'modification': return <FileCheck className="h-4 w-4" />;
      case 'deletion': return <FileX className="h-4 w-4" />;
      case 'unauthorized_access': return <Eye className="h-4 w-4" />;
      case 'suspicious_pattern': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 dark:text-red-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getRiskScoreIconColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-br from-red-500 to-red-600';
    if (score >= 60) return 'bg-gradient-to-br from-orange-500 to-orange-600';
    if (score >= 40) return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-br from-green-500 to-green-600';
  };

  const getAlertSeverityColor = (count: number) => {
    if (count >= 20) return 'text-red-600 dark:text-red-400';
    if (count >= 10) return 'text-orange-600 dark:text-orange-400';
    if (count >= 1) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getAlertSeverityIconColor = (count: number) => {
    if (count >= 20) return 'bg-gradient-to-br from-red-500 to-red-600';
    if (count >= 10) return 'bg-gradient-to-br from-orange-500 to-orange-600';
    if (count >= 1) return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-br from-green-500 to-green-600';
  };

  return (
    <Card className={`bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Code Provenance & Integrity Monitoring
          <Badge variant="outline" className="text-green-600 border-green-300">
            {statistics.monitoringStatus ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Monitor file integrity, detect unauthorized changes, and track code provenance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-xl p-1.5">
            <TabsTrigger 
              value="overview" 
              className="relative flex items-center justify-center py-3 px-3 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 data-[state=active]:text-white data-[state=active]:bg-slate-900 dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-b-slate-900 dark:data-[state=active]:border-b-white transition-all duration-300 rounded-lg"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="relative flex items-center justify-center py-3 px-3 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 data-[state=active]:text-white data-[state=active]:bg-red-600 data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-b-red-600 transition-all duration-300 rounded-lg"
            >
              <span className="hidden sm:inline">Alerts ({alerts.length})</span>
              <span className="sm:hidden">Alerts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="monitoring" 
              className="relative flex items-center justify-center py-3 px-3 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 data-[state=active]:text-white data-[state=active]:bg-green-600 data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-b-green-600 transition-all duration-300 rounded-lg"
            >
              Monitoring
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="relative flex items-center justify-center py-3 px-3 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 data-[state=active]:text-white data-[state=active]:bg-purple-600 data-[state=active]:shadow-lg data-[state=active]:border-b-2 data-[state=active]:border-b-purple-600 transition-all duration-300 rounded-lg"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">

            {/* Enhanced Risk Assessment */}
            {report && (
              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/60 dark:from-purple-950/40 dark:via-slate-800/80 dark:to-indigo-950/30 border-0 shadow-lg rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/10 opacity-50" />
                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl blur-sm opacity-30" />
                      <div className="relative bg-gradient-to-br from-purple-500 to-indigo-500 p-2.5 rounded-xl shadow-lg">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-6">
                    {/* Enhanced Risk Score Progress */}
                    <div className="relative">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <span className="text-base font-semibold text-slate-700 dark:text-slate-300">Overall Risk Score</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl sm:text-3xl font-bold ${getRiskScoreColor(report.riskScore)}`}>
                            {report.riskScore}
                          </span>
                          <span className="text-lg text-slate-500 dark:text-slate-400">/100</span>
                        </div>
                      </div>
                      <div className="relative mb-2">
                        <Progress 
                          value={report.riskScore} 
                          className={`h-4 rounded-full transition-all duration-1000 ${
                            report.riskScore >= 80 ? 'bg-red-100 dark:bg-red-950' :
                            report.riskScore >= 60 ? 'bg-orange-100 dark:bg-orange-950' :
                            report.riskScore >= 40 ? 'bg-yellow-100 dark:bg-yellow-950' :
                            'bg-green-100 dark:bg-green-950'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse opacity-60" />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Low Risk</span>
                        <span>High Risk</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Statistics Grid with Better Spacing */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-red-50/80 to-pink-50/60 dark:from-red-950/30 dark:to-pink-950/20 p-5 rounded-xl border border-red-200/50 dark:border-red-800/30">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg shadow-lg">
                            <AlertTriangle className="h-4 w-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xl font-bold text-red-600 dark:text-red-400">
                              {report.integrityViolations || 0}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-red-600/80 dark:text-red-400/80">Integrity Violations</p>
                        <p className="text-xs text-red-500/60 dark:text-red-400/60 mt-1">
                          {(report.integrityViolations || 0) > 0 ? 'Requires immediate attention' : 'No violations detected'}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/20 p-5 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-blue-600/80 dark:text-blue-400/80">Last Scan</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                          {new Date(report.lastScanTime).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(report.lastScanTime).toLocaleTimeString()}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/60 dark:from-green-950/30 dark:to-emerald-950/20 p-5 rounded-xl border border-green-200/50 dark:border-green-800/30">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg">
                            <FileCheck className="h-4 w-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                              {report.monitoredFiles}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-green-600/80 dark:text-green-400/80">Monitored Files</p>
                        <p className="text-xs text-green-500/60 dark:text-green-400/60 mt-1">
                          Active monitoring enabled
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Action Section - Better Integrated */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50/80 via-white to-gray-50/60 dark:from-slate-950/40 dark:via-slate-800/80 dark:to-gray-950/30 border-0 shadow-lg rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-gray-500/10 opacity-50" />
              <CardContent className="relative z-10 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {!statistics.monitoringStatus ? 'Initialize Security Monitoring' : 'Security Actions'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {!statistics.monitoringStatus 
                        ? 'Start monitoring your codebase for integrity violations and security threats.'
                        : 'Run integrity scans to detect unauthorized changes and security issues.'
                      }
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {!statistics.monitoringStatus ? (
                      <Button 
                        onClick={initializeMonitoring} 
                        disabled={isScanning || files.length === 0}
                        className="relative group overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3 font-semibold"
                      >
                        <div className="relative flex items-center justify-center gap-3">
                          <div className="p-1 bg-white/20 rounded-lg">
                            <Upload className="h-5 w-5" />
                          </div>
                          <span>Initialize Monitoring</span>
                        </div>
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={performIntegrityScan} 
                          disabled={isScanning}
                          className="relative group overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3 font-semibold"
                        >
                          <div className="relative flex items-center justify-center gap-3">
                            <div className="p-1 bg-white/20 rounded-lg">
                              {isScanning ? (
                                <RefreshCw className="h-5 w-5 animate-spin" />
                              ) : (
                                <Scan className="h-5 w-5" />
                              )}
                            </div>
                            <span>
                              {isScanning ? 'Scanning...' : 'Run Integrity Scan'}
                            </span>
                          </div>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 rounded-xl px-4 py-3"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No integrity alerts detected
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  All monitored files are secure
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {getAlertTypeIcon(alert.alertType)}
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">{alert.alertType}</Badge>
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <Clock className="h-3 w-3" />
                              {alert.detectedAt.toLocaleString()}
                            </div>
                          </div>
                          <CardTitle className="text-lg">{alert.filename}</CardTitle>
                          <CardDescription>{alert.description}</CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Risk Assessment</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {alert.riskAssessment}
                          </p>
                        </div>

                        {alert.changes.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Detected Changes</h4>
                            <div className="space-y-2">
                              {alert.changes.map((change, index) => (
                                <div key={index} className="bg-slate-50 dark:bg-slate-800 p-3 rounded">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-xs">
                                      {change.type}
                                    </Badge>
                                    <span className="text-sm font-medium">{change.field}</span>
                                    <span className="text-xs text-slate-500">
                                      {change.confidence}% confidence
                                    </span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-red-600">- {change.oldValue}</span>
                                    <br />
                                    <span className="text-green-600">+ {change.newValue}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold mb-2">Recommended Actions</h4>
                          <ul className="space-y-1">
                            {alert.recommendedActions.map((action, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-600 dark:text-slate-400">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">False Positive Risk:</span>
                          <Badge variant="outline" className="text-xs">
                            {alert.falsePositiveRisk}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Monitoring Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Monitoring Status</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      File integrity monitoring is {statistics.monitoringStatus ? 'active' : 'inactive'}
                    </p>
                  </div>
                  <Badge variant={statistics.monitoringStatus ? 'default' : 'secondary'}>
                    {statistics.monitoringStatus ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">File Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Files:</span>
                        <span>{statistics.totalFiles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Critical Files:</span>
                        <span className="text-red-600">{statistics.criticalFiles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Alerts:</span>
                        <span className="text-orange-600">{statistics.alertCount}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Last Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {statistics.lastScanTime 
                            ? statistics.lastScanTime.toLocaleString()
                            : 'No scans performed'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            {report ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Latest Integrity Report
                  </CardTitle>
                  <CardDescription>
                    Generated on {report.lastScanTime.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(report.fileStatistics.byCategory).map(([category, count]) => (
                      <div key={category} className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{count}</p>
                        <p className="text-sm text-slate-600 capitalize">{category} Files</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">File Distribution by Importance</h4>
                    <div className="space-y-2">
                      {Object.entries(report.fileStatistics.byImportance).map(([importance, count]) => (
                        <div key={importance} className="flex items-center gap-2">
                          <Badge variant="outline" className="w-20 justify-center">
                            {importance}
                          </Badge>
                          <Progress value={(count / report.totalFiles) * 100} className="flex-1 h-2" />
                          <span className="text-sm w-12 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No integrity reports available
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Run an integrity scan to generate a report
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
