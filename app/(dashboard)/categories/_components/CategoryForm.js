"use client";
import { useState, useEffect } from "react";
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
import CategoryTable from "./CategoryTable";
import Pagination from "../../Pagination";

export default function CategoryForm() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [color, setColor] = useState("#000000");
 

 
 // // FETCH DATAS
 const [datas, setDatas] = useState([]);

 const listDatas = async () => {
   const response = await axios("/api/category");
   setDatas(response.data.Category);
 };
 //
 const deleteCategory = async (id) => {
   const response = await axios.delete("/api/category", {
     params: {
       mongoId: id,
     },
   });
   console.log(response.data.msg);
   listDatas();
 };

 useEffect(() => {

  const mockData = [...Array(100).keys()].map(i => ({
    date: `2024-11-19`,
    amount: `$${(i + 1) * 10}`,
    description: `Transaction ${i + 1}`,
  }));
  setData(mockData);
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
 


  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newCategory = { name, type, color };
  
    try {
      const response = await axios.post("/api/category", newCategory);
      console.log("Category submitted successfully:", response.data);
  
      setName("");
      setType("expense");
      setColor("#000000");
    } catch (error) {
      console.error("Error submitting category:", error);
    }}

    
    
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
      <Header />
      <div className="p-4">
        <div style={{ height: "3px" }} />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={handleButtonClick}
              className="text-xl font-bold mb-4 w-full"
            >
              Add New Category{" "}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Category</DialogTitle>

            <form onSubmit={handleSubmit} className="category-form">
              <Input
                className="text-xl mt-3"
                type="text"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <select
                className="text-xl mt-3"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <Input
                className="text-xl mt-3"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
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
              <th className="p-2 border border-gray-300">Name</th>
              <th className="p-2 border border-gray-300">Type</th>
              <th className="p-2 border border-gray-300">Color</th>
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
                    <CategoryTable
                      key={index}
                      id={index}
                      mongoId={item._id}
                      name={item.name}
                      type={item.type}
                      color={item.color}
                      deleteCategory={deleteCategory}
                    />
                  );
                })
            )}
            {/* RENDERING WITHOUT PAGINATION */}

            {/* {datas.map((item, index) => {
              
            return (
              <CategoryTable
                key={index}
                id={index}
                mongoId={item._id}
                name={item.name}
                type={item.type}
                color={item.color}
                deleteCategory={deleteCategory}
              />
            );
          })} */}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
