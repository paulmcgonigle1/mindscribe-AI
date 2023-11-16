import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function TransactionChart() {
  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-7090 font-medium">Transactions</strong>
      <div className="w-full mt-3 flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey={"name"} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Income" fill="#0ea5e9" />
            <Bar dataKey="Expense" fill="#ea580c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
const data = [
  {
    name: "Jan",
    Income: 4000,
    Expense: 2000,
  },
  {
    name: "Feb",
    Income: 3000,
    Expense: 1500,
  },
  {
    name: "Mar",
    Income: 2000,
    Expense: 1000,
  },
  {
    name: "Apr",
    Income: 2780,
    Expense: 1390,
  },
  {
    name: "May",
    Income: 1890,
    Expense: 945,
  },
  {
    name: "Jun",
    Income: 2390,
    Expense: 1195,
  },
  {
    name: "Jul",
    Income: 3490,
    Expense: 1745,
  },
  {
    name: "Aug",
    Income: 2000,
    Expense: 1000,
  },
  {
    name: "Sep",
    Income: 2780,
    Expense: 1390,
  },
  {
    name: "Oct",
    Income: 1890,
    Expense: 945,
  },
  {
    name: "Nov",
    Income: 2390,
    Expense: 1195,
  },
  {
    name: "Dec",
    Income: 3490,
    Expense: 1745,
  },
];

export default TransactionChart;
