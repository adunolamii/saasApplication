"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../page"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import TrancLists from "../TrancLists";
import Pagination from "../../Pagination";


const TransactionsTable = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    category: "",
    description: "",
  });
  const [isClient, setIsClient] = useState(false);
  const [datas, setDatas] = useState([]);

  const formRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const listDatas = async () => {
    const response = await axios("/api/transaction");
    setDatas(response.data.Transaction);
  };

  useEffect(() => {
    listDatas();
  }, []);

  // PAGINATION
 const itemsPerPage = 3;  // 3 items per page
 const [currentPage, setCurrentPage] = useState(1);  // Track current page
 const [data, setData] = useState([]);  // Store data from API
 
 // Get the data to display for the current page
const startIndex = (currentPage - 1) * itemsPerPage;
const currentItems = datas.slice(startIndex, startIndex + itemsPerPage);
// Calculate total pages based on the number of items and items per page
const totalPages = Math.ceil(datas.length / itemsPerPage);


// HANDLE INPUT
  const handleOnchangeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((form) => ({ ...form, [name]: value }));
  };
// HANDLE SUBMIT
  const handleAddTransaction = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/transaction", formData);
      setFormData({ date: "", amount: "", category: "", description: "" });
      listDatas(); // Refresh the data after submission
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const deleteTransaction = async (id) => {
    const response = await axios.delete("/api/transaction", {
      params: { mongoId: id },
    });
    listDatas(); // Refresh the data after deletion
  };

  const handleButtonClick = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsFormVisible(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <Header />
      <div className="p-4">
        <div style={{ height: "3px" }} />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={handleButtonClick}
              className="text-xl font-bold mb-4 w-full"
            >
              Add New Transaction
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Add New Transaction</DialogTitle>
            {isFormVisible && (
              <div ref={formRef} className="mt-8">
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Date"
                    className="text-xl mt-3"
                    name="date"
                    value={formData.date}
                    onChange={handleOnchangeInput}
                  />
                  <Input
                    type="text"
                    placeholder="Amount"
                    className="text-xl mt-3"
                    name="amount"
                    value={formData.amount}
                    onChange={handleOnchangeInput}
                  />
                  <Input
                    type="text"
                    placeholder="Category"
                    className="text-xl mt-3"
                    name="category"
                    value={formData.category}
                    onChange={handleOnchangeInput}
                  />
                  <Input
                    type="text"
                    placeholder="Description"
                    className="text-xl mt-3"
                    name="description"
                    value={formData.description}
                    onChange={handleOnchangeInput}
                  />
                  <button className="bg-black text-white rounded-md mt-5 w-full text-xl">
                    ADD
                  </button>
                </form>
              </div>
            )}
          </DialogContent>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild />
          </DialogFooter>
        </Dialog>

        <table className="w-full border-collapse border border-gray-200 shadow-md mt-5">
          <thead>
            <tr>
              <th className="p-2 border border-gray-300">Id</th>
              <th className="p-2 border border-gray-300">Date</th>
              <th className="p-2 border border-gray-300">Amount</th>
              <th className="p-2 border border-gray-300">Category</th>
              <th className="p-2 border border-gray-300">Description</th>
              <th className="p-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
                  {/*  RENDERING WITH PAGINATION */}
                  {datas.length === 0 ? (
    <tr>
      <td colSpan="5" className="text-center p-2">
        No data available
      </td>
    </tr>
  ) : (
    datas.slice(startIndex, startIndex + itemsPerPage).map((item, index) => {
      return (
        <TrancLists
          key={index}
          id={index}
          mongoId={item._id}
          name={item.name}
          type={item.type}
          color={item.color}
          deleteTransaction={deleteTransaction}
        />
      );
    })
  )}

            {/* RENDERING WITHOUT PAGINATION */}
            {/* {datas.map((item, index) => (
              <TrancLists
                key={index}
                id={index}
                mongoId={item._id}
                date={item.date}
                amount={item.amount}
                category={item.category}
                description={item.description}
                deleteTransaction={deleteTransaction}
              />
            ))} */}
          </tbody>
        </table>
        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      </div>
    </>
  );
};

export default TransactionsTable;
