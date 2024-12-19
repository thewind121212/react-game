import React from 'react'
import { useCaroGame } from '../hooks/useCaroGame'
import { HashLoader } from 'react-spinners'
import PlayerCard from './PlayerCard'



const HR = 16
const VR = 16


export default function Caro() {
    const { renderGrid, onPlayerMove, isConnect, gameInfo, isYourTurn, playerName, gridInteract } = useCaroGame()

    const onHoverHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        const appendChild = document.createElement('div')
        appendChild.style.width = '37px'
        appendChild.style.aspectRatio = '1/1'
        appendChild.setAttribute("x-temp", 'true')
        appendChild.style.position = 'fixed'
        appendChild.style.zIndex = '999'
        appendChild.style.backgroundColor = gameInfo.yourRole === 'P1' ? '#EE6677' : '#37BC9C'
        appendChild.style.pointerEvents = 'none'
        appendChild.style.borderRadius = '50%'
        if (target.innerHTML.length === 0) {
            target.appendChild(appendChild)
        }

    }

    console.log( "current your role", gameInfo.yourRole)
    console.log( "current game turn" ,gameInfo.currentTurn)

    const onMouseOutHandler = () => {
        const tempTarge = document.querySelector('[x-temp]')
        if (tempTarge) {
            tempTarge.remove()
        }
    }


    const onClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isYourTurn) return
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
    }





    if (renderGrid.length === 0) {
        return (
            <div className="w-screen h-screen flex justify-center items-center flex-col gap-8 relative">
                <h1 className='text-3xl text-white font-light'>Waiting For Another Player Join</h1>
                <HashLoader color='#EE6677' size={50} />
            </div>

        )
    }

    return (

        <div className='w-screen h-screen relative flex justify-center items-center'>
            <div className="w-[640px] absolute left-[50%] bg-slate-600 h-20 -translate-x-1/2 top-6 rounded-xl">
                <div className="w-full h-auto relative">
                    <PlayerCard playerName={playerName} position="left" isTurn={isYourTurn} />
                    <PlayerCard playerName={gameInfo.yourRole === 'P1' ? gameInfo.P2Name : gameInfo.P1Name } position="right" isTurn={!isYourTurn} />
                </div>
            </div>
            {
                renderGrid.length > 0 && !isConnect && (
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
                                    <div className="w-[40px] aspect-square border border-[#2c3e50] bg-gray-[#0C141D] pointer-events-none" key={j}></div>
                                ))
                            }
                        </div>
                    ))
                }
                <div className="w-auto h-auto justify-start items-end absolute left-[20px] top-[20px]" id='interact-grid'>
                    {
                        renderGrid.map((row: string[], i) => (
                            <div className="flex justify-start items-center" key={i}>
                                {
                                    row.map((box, j) => (
                                        <div className="w-[40px] aspect-square flex justify-center items-center cursor-pointer" key={box} id={box}
                                            onMouseEnter={onHoverHandler}
                                            onMouseLeave={onMouseOutHandler}
                                            onClick={onClickHandler}
                                        >
                                            {
                                                gridInteract[i][j] !== '' && (
                                                    <div
                                                    x-official="true"
                                                    style={{
                                                      width: 37,
                                                      aspectRatio: "1 / 1",
                                                      backgroundColor: gridInteract[i][j] === 'P1' ? '#EE6677' : '#37BC9C',
                                                      borderRadius: "50%"
                                                    }}
                                                  />
                                                )
                                            }
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