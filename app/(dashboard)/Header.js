import React from 'react'
import Logo from './Logo'
import Navigation from './Navigation'
import WelcomeMsg from './WelcomeMsg'

const Header = () => {
  return (
    <div className=' bg-blue-400 px-4 py-8 lg:px-14 pb-36'>
    <div className=' max-w-screen-2xl mx-auto'>
      <div className='w-full flex items-center justify-between mb-14'>
        <div className=' flex items-center lg:gap-x-16'>
          <Logo/>
          <Navigation/>
        </div>
      </div>

    </div>
    <WelcomeMsg/>
    
    </div>
  )
}

export default Header