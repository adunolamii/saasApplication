"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2"; // Change from Pie to Doughnut chart
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import TrancLists from "./transactions/TrancLists";

// Registering chart.js components
ChartJS.register(ArcElement, Title, Tooltip, Legend);

const TransactionsTable = () => {
  const [datas, setDatas] = useState([]);
  const [chartData, setChartData] = useState(null); // For the chart data
  const [error, setError] = useState(null);

  const listDatas = async () => {
    const response = await axios("/api/transaction");
    setDatas(response.data.transaction);
  };

  useEffect(() => {
    listDatas();
  }, []);

  useEffect(() => {
    // Prepare chart data after the transactions are fetched
    if (datas.length > 0) {
      prepareChartData(datas);
    }
  }, [datas]);

  // Prepare chart data by category
  const prepareChartData = (transactions) => {
    const categoryData = {};

    transactions.forEach((transaction) => {
      if (transaction.category && transaction.amount !== undefined) {
        if (!categoryData[transaction.category]) {
          categoryData[transaction.category] = 0;
        }
        categoryData[transaction.category] += transaction.amount;
      }
    });

    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);

    const datasets = [
      {
        data: data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Pink
          "rgba(54, 162, 235, 0.6)", // Blue
          "rgba(255, 206, 86, 0.6)", // Yellow
          "rgba(75, 192, 192, 0.6)", // Green
          "rgba(153, 102, 255, 0.6)", // Purple
          "rgba(255, 159, 64, 0.6)", // Orange
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", 
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ];

    setChartData({
      labels, // Categories for the doughnut chart
      datasets, // Amounts for the segments
    });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto mt-8">
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : chartData ? (
        <div style={{ width: "100%", maxWidth: "800px", height: "400px", margin: "0 auto" }}>
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Transaction Amount by Category",
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return `${tooltipItem.label}: $${tooltipItem.raw}`;
                    },
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

export default TransactionsTable;
