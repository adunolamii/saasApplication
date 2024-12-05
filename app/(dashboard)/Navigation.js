"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";

function Navigation() {
  const [label, setLabel] = useState("");
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
    {
      id: 6,
      href: "/signup",
      label: "Signup",
    },
    {
      id: 7,
      href: "/signin",
      label: "Signin",
    },
  ];
  const [showLabels, setShowLabels] = useState(false);
  const toggleLabels = () => {
    setShowLabels((prev) => !prev);
  };
  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {/* Icon Button - Always visible, clicking will toggle the labels */}
      <button
        className="p-2 bg-gray-200 rounded-full lg:hidden"
        onClick={toggleLabels}
      >
        <span role="img" aria-label="icon">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>{" "}
        {/* Replace with your actual icon */}
      </button>

      {/* Display labels on small screens if showLabels is true */}
      {showLabels && (
        <div className="flex flex-col gap-2 lg:hidden">
          {routes.map((route) => (
            <Link key={route.id} href={route.href}>
              <p
                className={`hover:text-purple-600 hover:bg-black text-gray-200 font-medium p-5 cursor-pointer rounded-lg ${
                  route.href === label ? "text-blue-600" : ""
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
            <h3 className="hover:text-purple-600 hover:bg-black flex gap-2 text-gray-200 font-medium p-5 cursor-pointer rounded-lg">
              {route.label}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Navigation;
