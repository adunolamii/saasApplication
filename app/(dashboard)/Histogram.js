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

const ColorfulBarChart = () => {
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
    const categories = {}; // Object to store category totals

    transactions.forEach((transaction) => {
      if (!categories[transaction.category]) {
        categories[transaction.category] = 0;
      }
      categories[transaction.category] += parseFloat(transaction.amount); // Sum the amounts by category
    });

    const labels = Object.keys(categories); // Categories for X-axis
    const data = Object.values(categories); // Total amounts for Y-axis

    const colors = generateRandomColors(labels.length); // Get random colors for each bar

    setChartData({
      labels, // Categories as labels for the X-axis
      datasets: [
        {
          label: "Transaction Amount by Category",
          data, // Y-axis data (total amount per category)
          backgroundColor: colors, // Apply the generated colors
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
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-8">
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : chartData ? (
        <div style={{ width: "600px", height: "400px" }}>
          <Bar
            data={chartData} // Bar chart data
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Transaction Amount by Category",
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Category",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Amount",
                  },
                  beginAtZero: true, // Start the Y-axis from 0
                },
              },
            }}
            height={550}
        width={450}
          />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default ColorfulBarChart;
