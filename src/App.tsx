import React, { useEffect } from 'react'
import Caro from './components/Caro'
import { BarLoader } from 'react-spinners'
import { axiosClient } from './utils/axiosClient'
import NameInput from './components/NameInput'
import { useGameStore } from './store/game'
import { useNavigate, useParams } from 'react-router-dom'


export function CreateTable() {
  return (
    <div className='w-svw h-svh pl-[80px] flex justify-center items-center bg-[#212F40]'>
      <NameInput />
    </div>
  )
}



export function CaroGame() {
  const { playerId } = useGameStore()
  const [loading, setLoading] = React.useState<boolean>(true)

  const navigate = useNavigate()
  const { roomId } = useParams()


  useEffect(() => {

    if (playerId === '' || roomId === '') {
      navigate('/caro')
    }

    const checkRoomExist = async () => {
      try {
        const { data } = await axiosClient.get(`/check-room?roomId=${roomId}`)
        if (data.status === 'Room Not Found') {
          return navigate('/caro')
        }
        setLoading(false)

      } catch (error) {
        console.log(error)
        return navigate('/caro')
      }
    }

    checkRoomExist()
  }, [navigate, roomId, playerId])



  if (loading) {
    return (
      <div className='w-svw h-svh pl-[80px] flex justify-center items-center bg-[#212F40]'>
        <BarLoader color='#fff' width={100} />
      </div>
    )
  }

  return (
    <div className='w-svw h-svh pl-[80px] flex justify-center items-center bg-[#212F40]'>
      {
        playerId === '' &&
        <NameInput />
      }
      {
        playerId !== '' &&
        <Caro />
      }
    </div>
  )
}

