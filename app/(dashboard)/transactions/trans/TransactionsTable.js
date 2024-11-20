"use client";
import React from "react";
import { useState, useEffect } from "react";
import TrancLists from "./TrancLists";
import axios from "axios";
import Header from "../../Header";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Pagination from "../../Pagination";

const TransactionsTable = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    category: "",
    description: "",
  });
  // HYDRATION ERROR
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formRef = useRef(null);
  const handleButtonClick = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsFormVisible(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  // // FETCH DATAS
  const [datas, setDatas] = useState([]);

  const listDatas = async () => {
    const response = await axios("/api/transaction");
    setDatas(response.data.Transaction);
  };
  //
  const deleteTransaction = async (id) => {
    const response = await axios.delete("/api/transaction", {
      params: {
        mongoId: id,
      },
    });
    console.log(response.data.msg);
    listDatas();
  };

  useEffect(() => {
    listDatas();
  }, []);

  // PAGINATION
  const itemsPerPage = 3; // 3 items per page
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [data, setData] = useState([]); // Store data from API

  // Get the data to display for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = datas.slice(startIndex, startIndex + itemsPerPage);
  // Calculate total pages based on the number of items and items per page
  const totalPages = Math.ceil(datas.length / itemsPerPage);

  // INPUT FIELD
  const handleOnchangeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((form) => ({ ...form, [name]: value }));
    console.log(formData);
  };

  // SUBMIT FIELD
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    //   //  console.log(data);

    // CONNECT TO API
    try {
      const response = await axios.post("/api/transaction", formData);
      console.log(response.data.msg);
      setFormData({ date: "", amount: "", category: "", description: "" });
    } catch (error) {
      console.log("error", error);
    }
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
              Add New Transactions{" "}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Transactions</DialogTitle>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <label className=" font-sans text-xl font-bold">Date</label>
              <Input
                type="text"
                placeholder="DATE"
                className="text-xl mt-3"
                name="date"
                value={formData.date}
                onChange={handleOnchangeInput}
              />
              <label className=" font-sans text-xl font-bold">Amount</label>
              <Input
                type="text"
                placeholder="Amount"
                className="text-xl mt-3"
                name="amount"
                value={formData.amount}
                onChange={handleOnchangeInput}
              />
              <label className=" font-sans text-xl font-bold">Category</label>
              <Input
                type="text"
                placeholder="category"
                className="text-xl mt-3"
                name="category"
                value={formData.category}
                onChange={handleOnchangeInput}
              />
              <label className=" font-sans text-xl font-bold ">
                Description
              </label>
              <Input
                type="text"
                placeholder="description"
                className="text-xl mt-3"
                name="description"
                value={formData.description}
                onChange={handleOnchangeInput}
              />
              <button className=" bg-black text-white rounded-md mt-15 w-full text-xl">
                ADD
              </button>
            </form>

            <DialogFooter className="sm:justify-start">
              <DialogClose asChild></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <table className="w-full border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr>
              <th className="p-2 border border-gray-300">Id</th>
              <th className="p-2 border border-gray-300">Date</th>
              <th className="p-2 border border-gray-300">Amount</th>
              <th className="p-2 border border-gray-300">Category</th>
              <th className="p-2 border border-gray-300">Description</th>
              <th className="p-2 border border-gray-300">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {/* PAGINATION DATA RENDERING */}
            {datas.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-2">
                  No data available
                </td>
              </tr>
            ) : (
              datas
                .slice(startIndex, startIndex + itemsPerPage)
                .map((item, index) => {
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

            {/* {datas.map((item, index) => {
            return (
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
            );
          })} */}
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
