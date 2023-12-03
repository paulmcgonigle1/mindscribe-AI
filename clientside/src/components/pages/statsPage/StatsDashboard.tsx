import React from "react";

import DashboardStatsGrid from "./DashboardStatsGrid";
import TransactionChart from "./TransactionChart";
import BuyerProfileChart from "./BuyerProfileChart";
import RecentOrders from "./RecentOrders";
import PopularProducts from "./PopularProducts";
import StreakChart from "./StreakChart";
import MoodChart from "./MoodSection/MoodChart";
export default function StatsDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <DashboardStatsGrid />
      <StreakChart />
      <div className="flex flex-row gap-4 w-full">
        <TransactionChart />
        <BuyerProfileChart />
      </div>
      <div className="flex flex-row gap-4 w-full">
        {/* <RecentOrders /> */}
        <MoodChart />
        <PopularProducts />
      </div>
    </div>
  );
}
