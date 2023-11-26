import React from "react";
import Insights_Analysis from "./Insights_Analysis";
import Summary from "../mainPage/Summary";

function ImprovementsDashboard() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      {/* <DashboardStatsGrid /> */}
      <div className="flex flex-row gap-4 w-full">
        <Insights_Analysis />
        <Summary />
      </div>
      <div className="flex flex-row gap-4 w-full"></div>
    </div>
  );
}

export default ImprovementsDashboard;
