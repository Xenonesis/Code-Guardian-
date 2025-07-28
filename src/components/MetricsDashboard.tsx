import React from "react";

interface MetricsDashboardProps {
  totalVulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  codeCoverage: number;
  scanDate: string;
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  totalVulnerabilities,
  critical,
  high,
  medium,
  low,
  codeCoverage,
  scanDate,
}) => (
  <section className="metrics-dashboard" aria-label="Security Metrics Overview">
    <h2>Security Metrics Overview</h2>
    <ul>
      <li><strong>Total Vulnerabilities:</strong> {totalVulnerabilities}</li>
      <li><span style={{color: "#dc2626"}}>Critical:</span> {critical}</li>
      <li><span style={{color: "#f59e42"}}>High:</span> {high}</li>
      <li><span style={{color: "#fbbf24"}}>Medium:</span> {medium}</li>
      <li><span style={{color: "#38bdf8"}}>Low:</span> {low}</li>
      <li><strong>Code Coverage:</strong> {codeCoverage}%</li>
      <li><strong>Last Scan:</strong> {scanDate}</li>
    </ul>
  </section>
);

export default MetricsDashboard;