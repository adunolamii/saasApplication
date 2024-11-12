"use client"

import React from 'react'
// import { useUser } from '@clerk/nextjs'
import { useState } from 'react'

const WelcomeMsg = () => {
    const {user, isLoaded} = useState("")
  return (
    <div className='space-y-2 mb-2'>
        <h2 className=' text-2xl lg:text-4xl text-white font-medium'>Welcome Back🖐️ {isLoaded ? ", " : ""} </h2>
        <p className=' text-sm lg:text-base text-[#89b6fd]'>This is your Financial Overview Report</p>
    </div>
  )
}

export default WelcomeMsg