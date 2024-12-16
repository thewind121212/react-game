import React, { useState } from 'react'



const HR = 16
const VR = 16


const playHR = 15
const playVR = 15



export default function Caro() {
    const [playerState, setPlayerState] = useState<string>('p1')


    const onHoverHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        const appendChild = document.createElement('div')
        appendChild.style.width = '44px'
        appendChild.style.aspectRatio = '1/1'
        appendChild.setAttribute("x-temp", 'true')
        appendChild.style.position = 'fixed'
        appendChild.style.backgroundColor = playerState === 'p1' ? '#EE6677' : '#37BC9C'
        appendChild.style.pointerEvents = 'none'
        appendChild.style.borderRadius = '50%'
        if (target.innerHTML.length === 0) {
            target.appendChild(appendChild)
        }


    }

    const onMouseOutHandler = () => {
        const tempTarge = document.querySelector('[x-temp]')
        if (tempTarge) {
            tempTarge.remove()
        }
    }


    const onClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        const appendChild = document.createElement('div')
        appendChild.style.width = '44px'
        appendChild.style.aspectRatio = '1/1'
        appendChild.style.backgroundColor = playerState === 'p1' ? '#EE6677' : '#37BC9C'
        appendChild.style.borderRadius = '50%'
        console.log(target.attributes)
        target.appendChild(appendChild)

        setPlayerState(playerState === 'p1' ? 'p2' : 'p1')
    }



    return (

        <div className='w-auto h-auto'>
            <div className="flex justify-start items-center relative cursor-none" id='grid'>
                {
                    Array.from({ length: HR }, (_, i) => (
                        <div className="flex justify-start items-center flex-col pointer-events-none" key={i}>
                            {
                                Array.from({ length: VR }, (_, j) => (
                                    <div className="w-[50px] aspect-square border border-[#2c3e50] bg-gray-[#0C141D] pointer-events-none" key={j}></div>
                                ))
                            }
                        </div>
                    ))
                }
                <div className="w-auto h-auto justify-start items-end absolute left-[25px] top-[25px]" id='interact-grid'>
                    {
                        Array.from({ length: playHR }, (_, i) => (
                            <div className="flex justify-start items-center" key={i}>
                                {
                                    Array.from({ length: playVR }, (_, j) => (
                                        <div className="w-[50px] aspect-square flex justify-center items-center cursor-pointer" key={j} id={"interact-grid" + i + j}
                                            onMouseEnter={onHoverHandler}
                                            onMouseLeave={onMouseOutHandler}
                                            onClick={onClickHandler}
                                        >
                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>
            </div>


        </div>
    )
}