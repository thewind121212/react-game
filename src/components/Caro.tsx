import React from 'react'
import { useCaroGame } from '../hooks/useCaroGame'
import { HashLoader } from 'react-spinners'



const HR = 16
const VR = 16


export default function Caro() {
    const { gridInteract, playerState, setPlayerState, onPlayerMove, isConnect } = useCaroGame()

    const onHoverHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        const appendChild = document.createElement('div')
        appendChild.style.width = '44px'
        appendChild.style.aspectRatio = '1/1'
        appendChild.setAttribute("x-temp", 'true')
        appendChild.style.position = 'fixed'
        appendChild.style.zIndex = '999'
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
        //check decide player can move or not
        for (let i = 0; i < target.children.length; i++) {
            if (target.children[i].hasAttribute('x-official')) {
                return
            }
        }
        if (target.hasAttribute('x-official')) return
        // after check
        onPlayerMove(target.id)
        const appendChild = document.createElement('div')
        appendChild.style.width = '44px'
        appendChild.style.aspectRatio = '1/1'
        appendChild.style.backgroundColor = playerState === 'p1' ? '#EE6677' : '#37BC9C'
        appendChild.style.borderRadius = '50%'
        appendChild.setAttribute("x-official", 'true')
        target.appendChild(appendChild)
        setPlayerState(playerState === 'p1' ? 'p2' : 'p1')
    }



    if (gridInteract.length === 0) {
        return (
            <>game init</>
        )
    }

    return (

        <div className='w-auto h-auto relative'>
            {
                gridInteract.length > 0 && !isConnect && (
                    <div className="w-full h-full bg-[#1E1E1E2d] backdrop-blur-sm absolute top-0 left-0 z-[99] flex justify-center items-center">
                        <HashLoader color='#EE6677' size={50} />
                    </div>
                )
            }
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
                        gridInteract.map((row: string[], i) => (
                            <div className="flex justify-start items-center" key={i}>
                                {
                                    row.map((box,) => (
                                        <div className="w-[50px] aspect-square flex justify-center items-center cursor-pointer" key={box} id={box}
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