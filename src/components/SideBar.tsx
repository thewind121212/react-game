import React from 'react'




export default function Sidebar() {


  return (
    <div className='w-[80px] h-svh border-l border-l-[#1E1E1E] bg-gray-800 fixed left-0 top-0 z-[899]'>
      <div className="img-container">
        <img src="/src/assets/logo.webp" className='w-[80px] h-[80px]' alt="log" />
      </div>
      <div className="game-list flex justify-center items-center flex-col mt-8">
        <div className="w-[60px] h-[60px] bg-white overflow-hidden rounded-md cursor-pointer">
          <img src="/src/assets/gomoku.png" className='w-full h-full' alt="game" />
        </div>
      </div>


    </div>
  )
}