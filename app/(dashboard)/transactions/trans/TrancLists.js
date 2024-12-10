import React from "react";

const TrancLists = ({id, amount, category, description, mongoId, deleteTransaction}) => {
 
  
  return (
    
      <tr className="text-center">
        <td className="p-2 border border-gray-300">{id+1}</td>
        <td className="p-2 border border-gray-300">{amount}</td>
        <td className="p-2 border border-gray-300">{category}</td>
        <td className="p-2 border border-gray-300">{description}</td>
        <td className="p-2 border border-gray-300  flex px-6 py-4 gap-1">
        <button className="  bg-green-800 text-white w-40 m-auto h-8 rounded-sm font-bold" onClick={()=>deleteTransaction(mongoId)}>DELETE</button>
        </td>
        
      </tr>
   
  );
};

export default TrancLists;
