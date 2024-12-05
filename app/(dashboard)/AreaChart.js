"use client";
import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import axios from "axios";
ChartJS.register(ArcElement, Tooltip, Legend);
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';



const AreaChart = () => {
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
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-8">
    {chartData ? (
      <Line
        data={{
          ...chartData,
          datasets: chartData.datasets.map((dataset, index) => ({
            ...dataset,
            fill: true, // Enable the area fill
            backgroundColor: [
              "rgba(128, 0, 128, 0.3)", // Purple
              "rgba(255, 165, 0, 0.3)", // Orange
              "rgba(0, 128, 0, 0.3)", // Green
              "rgba(0, 0, 255, 0.3)", // Blue
            ][index % 4], // Cycle colors
            borderColor: [
              "rgba(128, 0, 128, 1)", // Purple
              "rgba(255, 165, 0, 1)", // Orange
              "rgba(0, 128, 0, 1)", // Green
              "rgba(0, 0, 255, 1)", // Blue
            ][index % 4], // Cycle colors
            borderWidth: 3, // Make the lines bold
          })),
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false, // Allow resizing for smaller container
          plugins: {
            title: {
              display: true,
              text: "Transaction Amount by Category",
              font: {
                size: 16,
                weight: "bold",
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Category",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
              grid: {
                color: "rgba(200, 200, 200, 0.3)", // Subtle grid line color
              },
            },
            y: {
              title: {
                display: true,
                text: "Amount",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
              grid: {
                color: "rgba(200, 200, 200, 0.3)", // Subtle grid line color
              },
              beginAtZero: true, // Start the Y-axis from 0
            },
          },
        }}
        height={550}
        width={450}
      />
    ) : (
      <p>Loading chart...</p>
    )}
  </div>
  
    );
};

export default AreaChart;
