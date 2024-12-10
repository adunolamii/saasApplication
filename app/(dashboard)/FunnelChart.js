// "use client";
// import { Line } from "react-chartjs-2";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// ChartJS.register(ArcElement, Tooltip, Legend);
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';
// import { Bar } from "react-chartjs-2";


// const FunnelChart = () => {
//     const [chartData, setChartData] = useState(null);
//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
  
//     // Fetch data from API
//     const fetchChartData = async () => {
//       try {
//         const response = await axios.get("/api/transaction");
//         const transactions = response.data.Transaction || [];
  
//         // Check if data is an array
//         if (!Array.isArray(transactions)) {
//           throw new Error("Unexpected data format");
//         }
  
//         processData(transactions);
//       } catch (error) {
//         console.error("Error fetching chart data:", error);
//         setError("Failed to fetch chart data");
//         setIsLoading(false); // Stop loading on error
//       }
//     };
  
//     // Process data for the funnel chart
//     const processData = (transactions) => {
//       const categories = {};
//       transactions.forEach((transaction) => {
//         const { category, amount } = transaction;
//         categories[category] = (categories[category] || 0) + amount;
//       });
  
//       setChartData({
//         labels: Object.keys(categories),
//         datasets: [
//           {
//             label: "Transaction Amount by Category",
//             data: Object.values(categories),
//             backgroundColor: [
//               "rgba(128, 0, 128, 0.6)", // Purple
//               "rgba(255, 165, 0, 0.6)", // Orange
//               "rgba(0, 128, 0, 0.6)", // Green
//               "rgba(0, 0, 255, 0.6)", // Blue
//               "rgba(255, 99, 132, 0.6)", // Pink
//             ],
//             borderColor: [
//               "rgba(128, 0, 128, 1)", // Purple
//               "rgba(255, 165, 0, 1)", // Orange
//               "rgba(0, 128, 0, 1)", // Green
//               "rgba(0, 0, 255, 1)", // Blue
//               "rgba(255, 99, 132, 1)", // Pink
//             ],
//             borderWidth: 2,
//           },
//         ],
//       });
//       setIsLoading(false); // Stop loading after data is set
//     };
  
//     useEffect(() => {
//       fetchChartData(); // Fetch chart data only once
//     }, []);
  
//     // Handle loading and error states
//     if (isLoading) {
//       return (
//         <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
//           <p className="text-center text-gray-500 font-semibold">Loading chart...</p>
//         </div>
//       );
//     }
  
//     if (error) {
//       return (
//         <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
//           <p className="text-center text-red-500 font-semibold">{error}</p>
//         </div>
//       );
//     }
  
//   return (
//     <div>
//            <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-8">
//       {chartData ? (
//         <Bar
//           data={chartData}
//           options={{
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//               title: {
//                 display: true,
//                 text: "Transaction Amount by Category",
//                 font: { size: 16, weight: "bold" },
//               },
//             },
//             scales: {
//               x: {
//                 title: {
//                   display: true,
//                   text: "Category",
//                   font: { size: 14, weight: "bold" },
//                 },
//                 grid: {
//                   color: "rgba(200, 200, 200, 0.3)",
//                 },
//               },
//               y: {
//                 title: {
//                   display: true,
//                   text: "Amount",
//                   font: { size: 14, weight: "bold" },
//                 },
//                 grid: {
//                   color: "rgba(200, 200, 200, 0.3)",
//                 },
//                 beginAtZero: true, // Start the Y-axis from 0
//               },
//             },
//           }}
//           height={550}
//           width={450}
//         />
//       ) : (
//         <p className="text-center text-gray-500 font-semibold">No chart data available</p>
//       )}
//     </div>
//     </div>
//   )
// }

// export default FunnelChart

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // Using Bar as a funnel substitute
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import TrancLists from "./transactions/TrancLists";

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement, // Using Bar for funnel-like visualization
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
        barThickness: 60, // To give the funnel effect by making the bars wide
        categoryPercentage: 0.5,
        barPercentage: 0.6,
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
          <Bar
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

