"use client"
import React from 'react'
import Link from 'next/link';
import { useState } from 'react';

function Navigation() {
  const routes = [
    {
      id: 1,
      href: "/",
      label: "Overview",
    },
    {
      id: 2,
      href: "/transactions",
      label: "Transactions",
    },
    {
      id: 3,
      href: "/accounts",
      label: "Accounts",
    },
    {
      id: 4,
      href: "/categories",
      label: "Categories",
    },
    {
      id: 5,
      href: "/settings",
      label: "Settings",
    },
  ];
  const [showLabels, setShowLabels] = useState(false);
  const toggleLabels = () => {
    setShowLabels((prev) => !prev);
  };
  return (
//     <div>
// <div className="flex items-center gap-2 overflow-x-auto">
//       {routes.map((route) => (
//         <div key={route.id} className="flex items-center gap-2">
//           {/* Icon Button - Visible on small screens */}
//           <button className="p-2 bg-gray-200 rounded-full lg:hidden">
//             <span role="img" aria-label="icon">🔍</span> {/* Replace with your actual icon */}
//           </button>

//           {/* Label - Visible on large screens */}
//           <Link href={route.href} className="hidden lg:flex">
//             <p
//               className="hover:text-purple-600 hover:bg-black flex gap-2 text-gray-200 font-medium p-5 cursor-pointer rounded-lg ${
//               "
//             >
//               {route.label}
//             </p>
//           </Link>
//         </div>
//       ))}
//     </div>
//     </div>
<div className="flex items-center gap-2 overflow-x-auto">
      {/* Icon Button - Always visible, clicking will toggle the labels */}
      <button 
        className="p-2 bg-gray-200 rounded-full lg:hidden" 
        onClick={toggleLabels}
      >
        <span role="img" aria-label="icon">🔍</span> {/* Replace with your actual icon */}
      </button>

      {/* Display labels on small screens if showLabels is true */}
      {showLabels && (
        <div className="flex flex-col gap-2 lg:hidden">
          {routes.map((route) => (
            <Link key={route.id} href={route.href}>
              <p
                className={`hover:text-purple-600 hover:bg-black text-gray-200 font-medium p-5 cursor-pointer rounded-lg ${
                  route.href === name ? "text-blue-600" : ""
                }`}
              >
                {route.label}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Display the label on larger screens */}
      <div className="hidden lg:flex">
        {routes.map((route) => (
          <Link key={route.id} href={route.href}>
            <p
              className={`hover:text-purple-600 hover:bg-black flex gap-2 text-gray-200 font-medium p-5 cursor-pointer rounded-lg ${
                route.href === name ? "text-blue-600" : ""
              }`}
            >
              {route.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Navigation