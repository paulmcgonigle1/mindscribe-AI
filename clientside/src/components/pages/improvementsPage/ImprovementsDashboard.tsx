import React from "react";
import Insights_Analysis from "./Insights_Analysis";
import Summary from "../mainPage/Summary";

function ImprovementsDashboard() {
  return (
    <div className="flex-column gap-4 p-4 md:p-8">
      {/* <DashboardStatsGrid /> */}
      <div className="flex flex-row gap-4 w-full px-4">
        <div className="flex flex-1 min-w-0">
          <Insights_Analysis />
        </div>
        <div className="flex flex-1 min-w-0">
          <Summary />
        </div>
      </div>
    </div>
  );
}

export default ImprovementsDashboard;
