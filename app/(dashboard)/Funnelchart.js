"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ColorfulFunnelChart = () => {
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
    const stages = ["Stage 1", "Stage 2", "Stage 3", "Stage 4"];
    const amounts = [0, 0, 0, 0]; // Placeholder for amounts at each stage

    // For simplicity, we'll assign data points to different stages based on category or another factor
    transactions.forEach((transaction) => {
      // Just an example of assigning to stages
      if (transaction.amount > 100) amounts[0] += parseFloat(transaction.amount); // Stage 1
      if (transaction.amount <= 100 && transaction.amount > 50) amounts[1] += parseFloat(transaction.amount); // Stage 2
      if (transaction.amount <= 50 && transaction.amount > 20) amounts[2] += parseFloat(transaction.amount); // Stage 3
      if (transaction.amount <= 20) amounts[3] += parseFloat(transaction.amount); // Stage 4
    });

    const colors = generateRandomColors(stages.length); // Get random colors for each stage

    setChartData({
      labels: stages, // Stages as X-axis labels
      datasets: [
        {
          label: "Transaction Amounts by Stage",
          data: amounts, // Y-axis data (amounts at each stage)
          backgroundColor: colors, // Apply the generated colors
          borderRadius: 10,
        },
      ],
    });
  };

  // Generate random colors for bars
  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const randomColor = `rgba(${getRandomInt(0, 255)}, ${getRandomInt(
        0,
        255
      )}, ${getRandomInt(0, 255)}, 0.7)`; // Generate RGB color with alpha transparency
      colors.push(randomColor);
    }
    return colors;
  };

  // Helper function to get random numbers for RGB values
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
          <Bar
            data={chartData} // Bar chart data
            options={{
              responsive: true,
              indexAxis: "y", // Horizontal bars
              plugins: {
                title: {
                  display: true,
                  text: "Transaction Funnel Chart (Simulated)",
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Amount",
                  },
                  beginAtZero: true,
                },
                y: {
                  title: {
                    display: true,
                    text: "Stage",
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

export default ColorfulFunnelChart;
