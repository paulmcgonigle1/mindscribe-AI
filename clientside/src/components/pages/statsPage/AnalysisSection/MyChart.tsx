import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EmotionChartProps {
  data: any[]; // Define a proper type for your data
}

const EmotionChart: React.FC<EmotionChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="emotion" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_occurrences" fill="#8884d8" />
        {/* You can add more Bars for different data keys if needed */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EmotionChart;
