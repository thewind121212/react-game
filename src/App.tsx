import React, { useEffect } from 'react'
import Caro from './components/Caro'
import { BarLoader } from 'react-spinners'
import { axiosClient } from './utils/axiosClient'
import CreateTableModal, { CreateName, JoinTable } from './components/Modal'
import { useGameStore } from './store/game'
import { useNavigate, useParams } from 'react-router-dom'
import Room from './components/Room'


export function CreateTableView() {
  return (
    <div className='w-svw h-svh pl-[80px] bg-[#212F40] flex justify-center items-center flex-col lg:flex-row'>
      <div className="w-1/2 order-2 md:w-full h-1/2 md:h-full lg:border-l-[2px] border-[#2d3e53] flex justify-center items-center">
        <Room />
      </div>
      <div className="w-1/2 order-1 md:w-full h-1/2 md:h-full flex justify-center flex-col items-center">
        <h1 className='text-5xl text-white font-semibold mb-6 text-center'>Welcome to Caro Game!</h1>
        <p className='text-xl mb-10 text-slate-400 text-center'>Challenge your friends and have fun. Create your room to start!</p>
        <div className="flex justify-center items-center gap-4">
          <JoinTable isShowModal={false} />
          <CreateTableModal />
        </div>
      </div>
    </div>
  )
}



export function CaroGame() {
  const { playerId } = useGameStore()
  const [loading, setLoading] = React.useState<boolean>(true)

  const navigate = useNavigate()
  const { roomId } = useParams()


  useEffect(() => {
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

    if (playerId !== '' && roomId !== '') {
      checkRoomExist()
    }


  }, [navigate, roomId, playerId])



  if (loading) {
    return (
      <div className='w-svw h-svh pl-[80px] flex justify-center items-center bg-[#212F40] relative'>
        <BarLoader color='#fff' width={100} />
        <CreateName isShowModal={true} />
      </div>
    )
  }

  return (
    <div className='w-svw h-svh pl-[80px] flex justify-center items-center bg-[#212F40]'>
      <Caro />
    </div>
  )
}

