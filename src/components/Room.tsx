import React, { useEffect, useRef } from 'react'
import { axiosClient } from '../utils/axiosClient'
import { GridLoader } from 'react-spinners'
import { IoMdRefreshCircle } from "react-icons/io";
import { useNavigate } from 'react-router';

export default function Room() {

    const [lobby, setLobby] = React.useState<{
        ID: string,
        Status: string,
        CurrentPlayer: number
    }[]>([])

    const [loading, setLoading] = React.useState<boolean>(true)
    const [refesh, setRefesh] = React.useState<boolean>(false)
    const [isThrottled, setIsThrottled] = React.useState<boolean>(false); 
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const navigate = useNavigate()



    useEffect(() => {
        const getAllRoom = async () => {
            try {
                const { data } = await axiosClient.get(`/get-all-room`)
                if (data === null) {
                    setLobby([])
                    setLoading(false)
                    return
                }
                setLobby(data)
                setLoading(false)
                setRefesh(false)

            } catch (error) {
                console.log(error)
                setLobby([])
                setRefesh(false)
            }
        }

        getAllRoom()

        if (refesh) {
            getAllRoom()
        }

        intervalRef.current = setInterval(() => {
            getAllRoom()
        }, 500)

        return () => {
            clearInterval(intervalRef.current as ReturnType<typeof setInterval>)
        }

    }, [refesh])


    const refeshHandler = () => {
        if (!isThrottled) {
            setRefesh(true); 
            setIsThrottled(true); 
            setTimeout(() => setIsThrottled(false), 1000); 
        }
    }


    const enterRoomHandler = (roomObj : {
        ID: string,
        Status: string,
        CurrentPlayer: number
    }) => {
        if (roomObj.CurrentPlayer === 2) return
        if (roomObj.Status === 'Game Start') return
        navigate(`/caro/${roomObj.ID}`)
    }



    return (
        <div className='w-[80%] h-auto aspect-square '>
            <div className="w-full h-16 border-[#b3b2b2] border rounded-md bg-[#1E2937] px-4 flex justify-start items-center gap-4">
                <h1 className='text-white font-bold uppercase'>Caro Room Game</h1>
                <div className="w-7 h-7 bg-white rounded-sm flex justify-center items-center text-center font-bold">
                    {loading ? "..." : lobby.length}
                </div>
                <IoMdRefreshCircle className='ml-auto' size={38} color='white' onClick={refeshHandler}
                    aria-label="Refresh Room List"/>
            </div>
            <div className="mt-4 h-full rounded-md w-full">
                <div className="w-full h-12 bg-[#F87171] rounded-md border-[#1E2937] flex justify-start items-center px-4">
                    <div className="text-white w-1/4 uppercase font-bold cursor-pointer">Room Id</div>
                    <div className="text-white w-2/3 uppercase font-bold cursor-pointer">Room Status</div>
                    <div className="text-white w-1/8 uppercase font-bold cursor-pointer">Player</div>
                </div>
                {
                    loading && (
                        <div className='w-full aspect-square flex justify-center items-center mt-2 bg-[#1E2937] rounded-md'>
                            <GridLoader color='white' />
                        </div>
                    )
                }
                {
                    !loading && (
                        <div className="mt-2 gap-2 flex flex-col">
                            {
                                lobby.map((room, i) => (
                                    <div key={room.ID + i} className="w-full h-9 bg-[#1E2937] rounded-md justify-start items-center px-4 flex"
                                    onClick={() => enterRoomHandler(room)} 
                                    >
                                        <h1 className="text-white w-1/4  font-bold cursor-pointer">{room.ID}</h1>
                                        <div className="text-white w-2/3 font-bold cursor-pointer">{room.Status === "One Player Disconnected" ? "Game Start" : room.Status === "One Player Left" ? "Waiting for Player" : room.Status}</div>
                                        <div className="text-white w-1/8 uppercase font-bold cursor-pointer flex justify-center items-center gap-2">
                                            <div className="w-4 h-4 border-white border rounded-full flex justify-center items-center">
                                                <div className="w-2 h-2 bg-red-400 rounded-full" />
                                            </div>
                                            <div className="w-4 h-4 border-white border rounded-full flex justify-center items-center">
                                                {
                                                    room.CurrentPlayer === 2 && (
                                                        <div className="w-2 h-2 bg-red-400 rounded-full" />
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                            {
                                lobby.length === 0 && (
                                    <div className='w-full aspect-square flex justify-center items-center mt-2 bg-[#1E2937] rounded-md'>
                                        <p className='text-white font-bold'>No Room Available</p>
                                    </div>
                                )
                            }
                        </div>
                    )
                }

            </div>
        </div>
    )
}

