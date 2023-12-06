import React from "react";

import DashboardStatsGrid from "./DashboardStatsGrid";
import TransactionChart from "./MoodSection/MoodChartBar";
import BuyerProfileChart from "./BuyerProfileChart";
import RecentOrders from "./RecentOrders";
import PopularProducts from "./PopularProducts";
import StreakChart from "./StreakChart";
import MoodChart from "./MoodSection/MoodStats";
import MoodChartBar from "./MoodSection/MoodChartBar";
import MoodStats from "./MoodSection/MoodStats";
import MoodAnalytics from "./MoodSection/MoodAnalytics";
export default function StatsDashboard() {
  return (
    <div className="flex flex-col gap-4 m-5">
      <StreakChart />
      <div className="flex flex-row gap-4 w-full">
        {/* Use flex-grow for flexible sizing */}
        <div className="flex flex-grow min-w-0">
          <MoodAnalytics />
        </div>
        <div className="flex flex-grow min-w-0">
          <BuyerProfileChart />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        {/* Allow both components to grow but give RecentOrders more space if needed */}
        <div className="flex flex-grow min-w-0">
          <RecentOrders />
        </div>
        <div className="flex flex-grow min-w-0">
          <PopularProducts />
        </div>
      </div>
    </div>
  );
}
