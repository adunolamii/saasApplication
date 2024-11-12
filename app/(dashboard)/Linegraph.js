"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ColorfulLineChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data function
  const fetchChartData = async () => {
    try {
      const response = await axios.get("/api/transaction");
      const transactions = response.data.Transaction || [];

      if (!Array.isArray(transactions)) {
        throw new Error("Unexpected data format");
      }

      processData(transactions); // Process the data if it's valid
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setError("Failed to fetch chart data");
    }
  };

  // Process the data into chart format
  const processData = (transactions) => {
    const labels = [];
    const data = [];

    // Example: categorize transactions by 'category' and separate data into different colors
    const categoryData = {};
    transactions.forEach((transaction) => {
      labels.push(transaction.date); // Date for X axis
      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = [];
      }
      categoryData[transaction.category].push(transaction.amount); // Amount for Y axis
    });

    const datasets = Object.keys(categoryData).map((category, index) => ({
      label: category,
      data: categoryData[category],
      borderColor: getColor(index), // Dynamic color for each category
      backgroundColor: getColor(index, true), // Lighter color for fill under the line
      tension: 0.4, // Line smoothing
    }));

    setChartData({
      labels, // Date labels for X axis
      datasets, // Data for multiple categories
    });
  };

  // Generate dynamic colors based on index
  const getColor = (index, isBackground = false) => {
    const colors = [
      "rgba(255, 99, 132, 1)", // Red
      "rgba(54, 162, 235, 1)", // Blue
      "rgba(255, 206, 86, 1)", // Yellow
      "rgba(75, 192, 192, 1)", // Green
      "rgba(153, 102, 255, 1)", // Purple
      "rgba(255, 159, 64, 1)", // Orange
    ];
    return isBackground
      ? colors[index % colors.length].replace("1)", "0.2)") // Lighter background color
      : colors[index % colors.length];
  };

  useEffect(() => {
    fetchChartData(); // Fetch chart data when component mounts
  }, []);

  return (
    <div>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : chartData ? (
        <div style={{ width: "600px", height: "400px" }}>
          <Line
            data={chartData} // Chart data
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Transaction Data Over Time",
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Date",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Amount",
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default ColorfulLineChart;
