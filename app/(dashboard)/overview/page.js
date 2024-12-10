

"use client";
import React, { useEffect, useState } from "react";
// import { UserButton } from "@clerk/nextjs";
import Header from "../Header";
import { Bar } from "react-chartjs-2";
import Doughnurt from "../Doughnurt";


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
import Piechart from "../Piechart"
import Linegraph from "../Linegraph"
import Histogram from "../Histogram"
import AreaChart from "../AreaChart";
import FunnelChart from "../FunnelChart";
import Scatter from "../Scatter";
import Polar from "../Polar";


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
            <Header />

                        
                        <Doughnurt/>
                        <FunnelChart/>
                        <Piechart/>
                        <Linegraph/>
                        <Scatter/>
                        <Polar/>
                        <Histogram/> 
                        <AreaChart/>

    </div>
    
  );
};

export default page;
