import React from 'react'
import Caro from './components/Caro'
import NameInput from './components/NameInput'
import { useGameStore } from './store/game'


export default function App() {
  const { playerName, playerId } = useGameStore()


console.log(playerName, playerId)

  return (
    <div className='w-svw h-svh pl-[80px] flex justify-center items-center bg-[#212F40]'>
      {
        (!playerName || !playerId) && <NameInput />
      }
      {
        playerName && playerId && <Caro />
      }
    </div>
  )
}