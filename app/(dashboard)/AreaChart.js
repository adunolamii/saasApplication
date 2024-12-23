// "use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2"; // Change Bar to Line for area chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import TrancLists from "./transactions/TrancLists";

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement, // LineElement for creating an area chart
  Title,
  Tooltip,
  Legend
);

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
        label: "Amount by Category",
        data: data,
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Teal background
        borderColor: "rgba(75, 192, 192, 1)", // Teal border
        borderWidth: 2,
        fill: true, // To create the area effect
      },
    ];

    setChartData({
      labels, // Categories for the X-axis
      datasets, // Amounts for the Y-axis
    });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto mt-8">
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : chartData ? (
        <div style={{ width: "100%", maxWidth: "800px", height: "400px", margin: "0 auto" }}>
          <Line
            data={chartData}
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
                  beginAtZero: true,
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
