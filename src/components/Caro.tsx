import React from 'react'
import { useCaroGame } from '../hooks/useCaroGame'
import { HashLoader } from 'react-spinners'
import Button from './Button'
import PlayerCard from './PlayerCard'
import { SvgIconCry, SvgIconSmile } from './SVG'



const HR = 16
const VR = 16


export default function Caro() {
    const { renderGrid, onPlayerMove, isConnect, gameInfo, isYourTurn, playerName, gridInteract, leaveGameHander, rematchHandler } = useCaroGame()

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




    const onMouseOutHandler = () => {
        const tempTarge = document.querySelector('[x-temp]')
        if (tempTarge) {
            tempTarge.remove()
        }
    }


    const onClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isYourTurn || gameInfo.IsFinished) return
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




    if (renderGrid.length === 0 && !gameInfo.IsFinished) {
        return (
            <div className="w-screen h-screen flex justify-center items-center flex-col gap-8 relative">
                <h1 className='text-3xl text-white font-light'>Waiting For Another Player Join</h1>
                <HashLoader color='#EE6677' size={50} />
            </div>

        )
    }


    return (

        <div className='w-screen h-screen relative flex justify-center items-center'>
            <div className="w-auto h-auto absolute right-4 top-6">
                <Button content='Leave Room' onClick={() => leaveGameHander()} />
            </div>
            <div className="w-[640px] absolute left-[50%] bg-slate-600 h-20 -translate-x-1/2 top-6 rounded-xl">
                <div className="w-full h-auto relative">
                    <PlayerCard playerName={playerName} position="left" isTurn={isYourTurn && !gameInfo.IsFinished} />
                    <PlayerCard playerName={gameInfo.yourRole === 'P1' ? gameInfo.P2Name : gameInfo.P1Name} position="right" isTurn={!isYourTurn && !gameInfo.IsFinished} />
                </div>
            </div>
            {
                gameInfo.IsFinished && (
                    <div className="w-full h-full bg-[#1E1E1E2d] backdrop-blur-sm absolute top-0 left-0 flex justify-center items-center z-40">
                        <div className="w-[400px] h-[200px] bg-slate-600 rounded-xl flex justify-center items-center flex-col gap-2">
                            <h1 className='text-3xl text-white font-bold'>
                                {gameInfo.whoWinner === gameInfo.yourRole ? 'You Win' : 'You Lose'}
                            </h1>
                            <div className="w-full h-auto flex justify-center items-center gap-4">
                                <div className="w-[40px] aspect-square">
                                    {gameInfo.whoWinner === gameInfo.yourRole ? (
                                        <SvgIconSmile />
                                    ) : (
                                        <SvgIconCry />
                                    )}
                                </div>
                                <h1 className='text-xl text-white font-light'>{gameInfo.whoWinner === 'P1' ? gameInfo.P1Name : gameInfo.P2Name} Win</h1>
                            </div>
                            <div className="w-full h-auto flex justify-between items-center px-12 mt-3">
                            <Button content='Leave' onClick={() => leaveGameHander()} className='mt-4' />
                            <Button content='Rematch' onClick={() => rematchHandler()} className='mt-4  bg-green-400 text-slate-600'   />
                            </div>
                        </div>
                    </div>
                )
            }

            {
                renderGrid.length > 0 && !isConnect && (
                    <div className="w-full h-full bg-[#1E1E1E2d] backdrop-blur-sm absolute top-0 left-0 flex justify-center items-center z-50">
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
