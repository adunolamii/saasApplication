import React from 'react'

const CategoryTable = ({id,name, type, color,  mongoId, deleteCategory}) => {
  return (
    <tr className="text-center">
        <td className="p-2 border border-gray-300">{id+1}</td>
       <td className="p-2 border border-gray-300"> {name} </td> 
        <td className="p-2 border border-gray-300">{type}</td>
        <td className="p-2 border border-gray-300">{color}</td>
        <td className="p-2 border border-gray-300  flex px-6 py-4 gap-1">
        <button className=" bg-green-800 text-white" onClick={()=>deleteCategory(mongoId)}>DELETE</button>
        <button className=" bg-red-800 text-white">DONE</button>
        </td>
        
      </tr>
  )
}

export default CategoryTable