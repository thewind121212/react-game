import React, { FormEvent, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { useNavigate } from 'react-router';
import { axiosClient } from '../utils/axiosClient';
import { IoClose } from "react-icons/io5";
import Button from '../share-components/Button';
import { useGameStore, generateRandomString } from '../store/game';



export default function CreateTable() {
    const [showModal, setShowModal] = useState<boolean>(false)
    const { setPlayerName, setPlayerId, playerName, playerId } = useGameStore()
    const [name, setName] = useState<string>(playerName)
    const navigate = useNavigate()


    const onClickEventHandler = () => {
        setShowModal(!showModal)
    }

    const showModalAnimation = useSpring({
        opacity: showModal ? 1 : 0,
        from: {
            opacity: 0,
        },
        config: {
            duration: 200
        },
        delay: 100
    })


    const submitName = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        const { data } = await axiosClient.get('/create-room')
        const { roomId } = data

        navigate(`/caro/${roomId}`)

        setPlayerName(name)
        if (playerId === '') {
            setPlayerId(generateRandomString(10))
        }
        setShowModal(false)
    }



    return (
        <>
            {
                showModal &&
                <animated.div className="flex fixed justify-center items-center w-svw h-svh pl-[80px] z-[999] left-0 top-0" style={showModalAnimation}>
                    <div className="wraper w-full h-full flex justify-center items-center relative">
                        <div className="absolute w-full h-full bg-[#9898981b] z-10"
                            onClick={() => setShowModal(false)}
                        ></div>
                        <div className="w-full max-w-[482px] h-auto bg-white relative z-20 flex justify-center items-center flex-col rounded-[3px] overflow-hidden">
                            <div className="form-header bg-[#0C141D] w-full h-auto p-4 relative">
                                <h1 className='text-white text-lg font-bold'>Create Room</h1>
                                <IoClose className='absolute top-1/2 -translate-y-1/2 right-2 text-white cursor-pointer' size={28} onClick={() => setShowModal(false)} />
                            </div>
                            <div className="w-full h-auto bg-[#101C26] flex justify-center items-center py-6">
                                <form className='flex flex-col gap-4' onSubmit={submitName} >
                                    <div className="flex flex-col gap-2">
                                        <input type="text" placeholder='Nick Name' className='p-4 bg-[#1B2838] text-white border-transparent text-3xl text-center  rounded-md outline-none' id='name'
                                            onChange={(e) => setName(e.target.value)}
                                            value={name}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-4 mt-4">
                                        <label htmlFor="name" className='text-white font-semibold'>Enter Pin Pass (If empty there is no password)</label>
                                        <input type="text" placeholder='PIN' className='p-4 bg-[#1B2838] text-white border-transparent text-3xl text-center  rounded-md outline-none' id='name' />
                                    </div>
                                </form>
                            </div>
                            <div className="form-header bg-[#0C141D] w-full h-auto p-4 relative flex justify-end">
                                <Button onClickEventHandler={submitName} className='bg-[#18BC9C] w-fit' content='Create Game' />
                            </div>
                        </div>
                    </div>
                </animated.div>
            }
            <div className="flex flex-col items-center justify-center ">
                <Button onClickEventHandler={onClickEventHandler} content='Create Room' />
            </div>
        </>
    )
}


export function CreateName({ isShowModal = true }: { isShowModal: boolean }) {

    const [showModal, setShowModal] = useState<boolean>(isShowModal)
    const { setPlayerName, setPlayerId, playerName, playerId } = useGameStore()
    const [name, setName] = useState<string>(playerName)



    const showModalAnimation = useSpring({
        opacity: showModal ? 1 : 0,
        from: {
            opacity: 0,
        },
        config: {
            duration: 200
        },
        delay: 100
    })

    const createUser = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        setPlayerName(name)
        if (playerId === '') {
            setPlayerId(generateRandomString(10))
        }
        setShowModal(false)
    }

    return (

        <>
            <animated.div className="flex fixed justify-center items-center w-svw h-svh pl-[80px] z-[999] left-0 top-0" style={showModalAnimation}>
                <div className="wraper w-full h-full flex justify-center items-center relative">
                    <div className="absolute w-full h-full bg-[#9898981b] z-10"
                        onClick={() => setShowModal(false)}
                    ></div>
                    <div className="w-full max-w-[482px] h-auto bg-white relative z-20 flex justify-center items-center flex-col rounded-[3px] overflow-hidden">
                        <div className="form-header bg-[#0C141D] w-full h-auto p-4 relative flex justify-center items-center">
                            <h1 className='text-white text-lg font-bold'>Create User</h1>
                        </div>
                        <div className="w-full h-auto bg-[#101C26] flex justify-center items-center py-6">
                            <form className='flex flex-col gap-4' onSubmit={createUser}>
                                <div className="flex flex-col gap-2">
                                    <input type="text" placeholder='Nick Name' className='p-4 bg-[#1B2838] text-white border-transparent text-3xl text-center  rounded-md outline-none' id='name'
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="form-header bg-[#0C141D] w-full h-auto p-4 relative flex justify-end">
                            <Button onClickEventHandler={createUser} className='bg-[#18BC9C] w-fit' content='Create User' />
                        </div>
                    </div>
                </div>
            </animated.div>
        </>
    )

}

export function JoinTable({ isShowModal = true }: { isShowModal: boolean }) {

    const [showModal, setShowModal] = useState<boolean>(isShowModal)
    const [roomInput, setRoomInput] = useState<string>('')
    const navigate = useNavigate()



    const showModalAnimation = useSpring({
        opacity: showModal ? 1 : 0,
        from: {
            opacity: 0,
        },
        config: {
            duration: 200
        },
        delay: 100
    })

    const joinGame = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        if (roomInput === '') {
            setShowModal(false)
            return
        }
        setShowModal(false)
        navigate(`/caro/${roomInput}`)
    }

    return (
        <>
            {
                showModal && (
                    <animated.div className="flex fixed justify-center items-center w-svw h-svh pl-[80px] z-[999] left-0 top-0" style={showModalAnimation}>
                        <div className="wraper w-full h-full flex justify-center items-center relative">
                            <div className="absolute w-full h-full bg-[#9898981b] z-10"
                                onClick={() => setShowModal(false)}
                            ></div>
                            <div className="w-full max-w-[482px] h-auto bg-white relative z-20 flex justify-center items-center flex-col rounded-[3px] overflow-hidden">
                                <div className="form-header bg-[#0C141D] w-full h-auto p-4 relative flex justify-center items-center">
                                    <h1 className='text-white text-lg font-bold'>Join Game</h1>
                                    <IoClose className='absolute top-1/2 -translate-y-1/2 right-2 text-white cursor-pointer' size={28} onClick={() => setShowModal(false)} />
                                </div>
                                <div className="w-full h-auto bg-[#101C26] flex justify-center items-center py-6">
                                    <form className='flex flex-col gap-4' onSubmit={joinGame}>
                                        <div className="flex flex-col gap-2">
                                            <input type="text" placeholder='Enter Room Id' className='p-4 bg-[#1B2838] text-white border-transparent text-3xl text-center  rounded-md outline-none' id='name'
                                                onChange={(e) => setRoomInput(e.target.value)}
                                                value={roomInput}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="form-header bg-[#0C141D] w-full h-auto p-4 relative flex justify-end">
                                    <Button onClickEventHandler={joinGame} className='bg-[#18BC9C] w-fit' content='Join Room' />
                                </div>
                            </div>
                        </div>
                    </animated.div>

                )
            }

            <div className="flex flex-col items-center justify-center ">
                <Button onClickEventHandler={() => setShowModal(true)} content='Join Room' className='bg-red-400' />
            </div>
        </>
    )

}