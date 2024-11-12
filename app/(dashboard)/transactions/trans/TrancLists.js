import React from "react";

const TrancLists = ({id,date, amount, category, description, mongoId, deleteTransaction}) => {
  const TransactionDate = new Date(date);
  
  return (
    
      <tr className="text-center">
        <td className="p-2 border border-gray-300">{id+1}</td>
       <td className="p-2 border border-gray-300"> {TransactionDate.toDateString()} </td> 
        <td className="p-2 border border-gray-300">{amount}</td>
        <td className="p-2 border border-gray-300">{category}</td>
        <td className="p-2 border border-gray-300">{description}</td>
        <td className="p-2 border border-gray-300  flex px-6 py-4 gap-1">
        <button className=" bg-green-800 text-white" onClick={()=>deleteTransaction(mongoId)}>DELETE</button>
        <button className=" bg-red-800 text-white">DONE</button>
        </td>
        
      </tr>
   
  );
};

export default TrancLists;
