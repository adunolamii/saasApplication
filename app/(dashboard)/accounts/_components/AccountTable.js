import React from 'react'

const AccountTable = ({id,name, type, balance, description,  mongoId, deleteAccount}) => {
  return ( 
  <tr className="text-center">
    <td className="p-2 border border-gray-300">{id+1}</td>
    <td className="p-2 border border-gray-300">{ name}</td>
    <td className="p-2 border border-gray-300">{ type}</td>
    <td className="p-2 border border-gray-300">{balance}</td>
    <td className="p-2 border border-gray-300">{description}</td>
    <td className="p-2 border border-gray-300  flex px-6 py-4 gap-1">
    <button className=" bg-green-800 text-white w-40 m-auto h-8 rounded-sm font-bold" onClick={()=>deleteAccount(mongoId)}>DELETE</button>
   
    </td>
    
  </tr>
  )
}

export default AccountTable