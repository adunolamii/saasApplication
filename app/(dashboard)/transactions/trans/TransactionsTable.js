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
      setFormData({date:"", amount: "", category: "", description: "" });
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
          {/* <div> */}
            <Button
              onClick={handleButtonClick}
              className="text-xl font-bold mb-4 w-full"
            >
              Add New Transactions{" "}
            </Button>
          {/* </div> */}
        </DialogTrigger>
        <DialogContent>
          {/* <DialogHeader> */}
            <DialogTitle>Add New Transactions</DialogTitle>
            {/* <DialogDescription> */}
              {/* {isFormVisible && ( 
                 <div ref={formRef} className="mt-8"> */}

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
                <label className=" font-sans text-xl font-bold ">Description</label>
                <Input
                  type="text"
                  placeholder="description"
                  className="text-xl mt-3"
                  name="description"
                  value={formData.description}
                  onChange={handleOnchangeInput}
                />
                <button className=" bg-black text-white rounded-md mt-15 w-full text-xl">ADD</button>
              </form>
              {/* </div>  */}
              {/* )} */}
            {/* </DialogDescription>
          </DialogHeader> */}

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
          {datas.map((item, index) => {
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
          })}
        </tbody>
      </table>
      </div>
    </>
  );
};

export default TransactionsTable;
