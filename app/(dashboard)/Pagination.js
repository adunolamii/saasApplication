"use client"
import React from 'react'
import { useState } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {


  return (
    <div>
       <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
      >
        Previous
      </button>

      {/* Generate page numbers dynamically */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`p-2 px-4 border rounded-md ${
            index + 1 === currentPage ? "bg-blue-500 text-white" : "hover:bg-gray-100"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
      >
        Next
      </button>
    </div>
    </div>
  )
}

export default Pagination