"use client";
import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data from API
  const fetchChartData = async () => {
    try {
      const response = await axios.get("/api/transaction");
      const transactions = response.data.Transaction || [];

      // Check if data is an array
      if (!Array.isArray(transactions)) {
        throw new Error("Unexpected data format");
      }

      processData(transactions);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setError("Failed to fetch chart data");
    }
  };

  // Process data for the Pie Chart
  const processData = (transactions) => {
    const categories = {};
    transactions.forEach((transaction) => {
      const { category, amount } = transaction;
      categories[category] = (categories[category] || 0) + amount;
    });

    setChartData({
      labels: Object.keys(categories),
      datasets: [
        {
          label: "Transaction Amount by Category",
          data: Object.values(categories),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
        },
      ],
    });
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : chartData ? (
        // <Pie data={chartData} />
        <Pie
  data={chartData}
  options={{
    maintainAspectRatio: false,
  }}
  width={300}
  height={300}
/>

      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default PieChart;
