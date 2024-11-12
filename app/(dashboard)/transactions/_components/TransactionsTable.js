"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../page"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import TrancLists from "./TrancLists";
import TrancLists from "../TrancLists";


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

  const handleOnchangeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((form) => ({ ...form, [name]: value }));
  };

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
            {datas.map((item, index) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TransactionsTable;
