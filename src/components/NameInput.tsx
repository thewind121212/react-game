import React, { useState } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { IoClose } from "react-icons/io5";
import Button from '../share-components/button';
import { useGameStore, generateRandomString } from '../store/game';



export default function NameInput() {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const { setPlayerName, setPlayerId } = useGameStore()


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


    const submitName = () => {
        setPlayerName(name)
        setPlayerId(generateRandomString(10))
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
                                <form className='flex flex-col gap-4'>
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
            <Button onClickEventHandler={onClickEventHandler} content='Create Room' />
        </>
    )
}