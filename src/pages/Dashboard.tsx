import React from "react";
import MetricsDashboard from "../components/MetricsDashboard";

const Dashboard = () => {
  return (
    <div>
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
  );
};

export default Dashboard;