import React, { useEffect } from 'react'
import Caro from './components/Caro'
import { BarLoader } from 'react-spinners'
import { axiosClient } from './utils/axiosClient'
import CreateTableModal , { CreateName } from './components/Modal'
import { useGameStore } from './store/game'
import { useNavigate, useParams } from 'react-router-dom'


export function CreateTableView() {
  return (
    <div className='w-svw h-svh pl-[80px] flex justify-center items-center bg-[#212F40]'>
      <CreateTableModal />
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

