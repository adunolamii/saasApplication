"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../Header";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from "@/components/ui/toaster"



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
import AccountTable from "./AccountTable";

export const AccountForm = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "savings", 
        balance: "",
        description: "",
      });
      // // FETCH DATAS
  const [datas, setDatas] = useState([]);

  const listDatas = async () => {
    const response = await axios("/api/account");
    setDatas(response.data.Account);
  };
  //
  const deleteAccount = async (id) => {
    const response = await axios.delete("/api/account", {
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

    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData);
          // CONNECT TO API
    try {
        const response = await axios.post("/api/account", formData);
        console.log(response.data.msg);
        setFormData({name:"", type: "", balance: "", description: "" });
      } catch (error) {
        console.log("error", error);
      }
    }

      const formRef = useRef(null);
      const handleButtonClick = () => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
        setIsFormVisible(true);
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      };
  return (
    <div>
         <Toaster />
        <Header />
        <div className="p-4"> 
        <div style={{ height: "3px" }} /> 

        <Dialog>
        <DialogTrigger asChild>
          <Button
            onClick={handleButtonClick}
            className="text-xl font-bold mb-4 w-full"
          >
            Add New Account{" "}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add New Account</DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-4">
        <label className=" font-sans text-xl font-bold">Account Name</label>
        <Input
          className="text-xl mt-3"
          type="text"
          name="name"
          placeholder="Account Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label className=" font-sans text-xl font-bold">Account Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="text-xl mt-3 rounded-md border-2 border-black w-full h-8"
        >
          <option value="savings">Savings</option>
          <option value="current">Current</option>
          <option value="business">Business</option>
        </select>
        <label className=" font-sans text-xl font-bold">Balance</label>
        <Input
          className="text-xl mt-3 rounded-md border-2 border-black w-full"
          type="number"
          name="balance"
          placeholder="Initial Balance"
          value={formData.balance}
          onChange={handleChange}
          required
        />
        <label className=" font-sans text-xl font-bold">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="text-xl mt-3 rounded-md border-2 border-black w-full"
        />
       <button className=" bg-black text-white rounded-md mt-15 w-full text-xl">ADD</button>

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
            <th className="p-2 border border-gray-300">Account Name</th>
            <th className="p-2 border border-gray-300">Account Type</th>
            <th className="p-2 border border-gray-300">Balance</th>
            <th className="p-2 border border-gray-300">Description</th>
            <th className="p-2 border border-gray-300">ACTION</th>
          </tr>
        </thead>
        <tbody>
            <AccountTable/>
          {datas.map((item, index) => {
            return (
              <AccountTable
                key={index}
                id={index}
                mongoId={item._id}
                name={item.name}
                type={item.type}
                balance={item.balance}
                description={item.description}
                deleteAccount={deleteAccount}
              />
            );
          })}
        </tbody>
      </table>

    </div>
    </div>
  
  )
}
