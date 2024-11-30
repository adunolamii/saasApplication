"use client";
import React, { useEffect, useState } from "react";
// import { UserButton } from "@clerk/nextjs";
import Header from "./Header";
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
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
// Register the Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import Piechart from "./Piechart"
import Linegraph from "./Linegraph"
import Histogram from "./Histogram"
// import Funnelchart from "./Funnelchart"

const page = () => {
  const [chartData, setChartData] = useState(null); // State to hold the chart data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const fetchData = async () => {
    try {
      const response = await fetch("/api/transaction");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data); // Log the full structure here

      const processedData = processTransactionData(data);
      setChartData(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processTransactionData = (data) => {
    const transactions = data.transactions || []; // Access the array within the object

    if (!Array.isArray(transactions)) {
      console.error(
        "Expected transactions to be an array, but got:",
        transactions
      );
      return {
        labels: [],
        datasets: [],
      };
    }

    const categories = {};

    // Group data by category
    transactions.forEach((transaction) => {
      const { category, amount } = transaction;
      categories[category] = (categories[category] || 0) + amount;
    });

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          label: "Transaction Amount by Category",
          data: Object.values(categories),
          backgroundColor: ["#4CAF50", "#FFC107", "#FF5722"],
        },
      ],
    };
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
    
   
<div>
      
      {/* <UserButton afterSignOutUrl="/"/> */}
      <Header />
{/* RESPONSIVENESS */}
<div className=" h-screen w-full grid grid-col-4 bg-blue-500 gap-3 lg:grid">
<div className="bg-green-500">A</div>
<div className=" bg-orange-600">b</div>
<div className=" bg-red-600">c</div>
<div className=" bg-purple-800">A</div>
</div>



      <div className="chart-container" style={{ position: 'relative', height: '400px', width: '600px' }}>
      
      {isLoading ? (
        <p>Loading data...</p>
      ) : chartData ? ( // Check if chartData is not null before rendering
        
        <Bar
         data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Transaction Amount by Category',
                font: {
                  size: 20,
                  family: 'Arial, sans-serif',
                },
                color: '#333',
              },
              tooltip: {
                backgroundColor: '#333',
                titleColor: '#fff',
                bodyColor: '#fff',
                cornerRadius: 4,
              },
              legend: {
                position: 'top',
                labels: {
                  font: {
                    size: 14,
                    family: 'Arial, sans-serif',
                  },
                  color: '#333',
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  font: {
                    size: 14,
                    family: 'Arial, sans-serif',
                  },
                  color: '#333',
                },
              },
              y: {
                ticks: {
                  font: {
                    size: 14,
                    family: 'Arial, sans-serif',
                  },
                  color: '#333',
                },
                beginAtZero: true,
              },
            },
          }}
        />
      ) : (
        <p>No data available</p>
      
      )}
       
      </div>
      <Piechart/>
      {/* <Linegraph/> */}
      <Histogram/> 
      {/* <Funnelchart/> */}
    </div>
    
  );
};

export default page;
