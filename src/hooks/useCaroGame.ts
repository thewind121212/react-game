import { useEffect, useState } from "react"
import { useGameStore } from "../store/game"
import { useWebSocket } from "./useWebSocket"
import { useNavigate, useParams } from "react-router"


export function useCaroGame() {
    const [gridInteract, setGridInteract] = useState<string[][]>([])
    const [renderGrid, setRenderGrid] = useState<string[][]>([])
    const [isJoin, setIsJoin] = useState<boolean>(false)
    const { playerName, playerId } = useGameStore()
    const navigate = useNavigate()

    const [gameInfo, setGameInfo] = useState<
        {
            yourRole: "P1" | "P2"
            P1Name: string
            P2Name: string
            IsFinished: boolean
            winnerId: string
            whoWinner: string
            currentTurn: "P1" | "P2"
        }
    >({
        yourRole: 'P1',
        P1Name: '',
        P2Name: '',
        IsFinished: false,
        winnerId: '',
        whoWinner: '',
        currentTurn: 'P1'
    })




    const { connect, sendMessage, lastMessage, disconnect, isConnect } = useWebSocket()

    const { roomId } = useParams()

    useEffect(() => {
        if (isConnect) {

            if (lastMessage && lastMessage.Status === 'Player left the game' && lastMessage.PlayerID === playerId) {
                console.log('hit left game')
                navigate('/caro')
                disconnect(roomId || 'null', playerId)
                return
            }

            if (!isJoin && lastMessage && lastMessage.Status === 'Waiting for Player') {
                console.log('hit join game')
                sendMessage({
                    gameID: roomId,
                    type: 'join',
                    Data: {
                        name: playerName,
                        playerID: playerId,
                    }
                })
                setIsJoin(true)
                return
            }

            if (!isJoin && lastMessage && lastMessage.Status === 'One Player Left') {
                console.log('hit rejoin game')
                sendMessage({
                    gameID: roomId,
                    type: 'join',
                    Data: {
                        name: playerName,
                        playerID: playerId,
                    }
                })
                setIsJoin(true)
                return 
            }

            if (isJoin && lastMessage && lastMessage.Status === 'One Player Left') {
                console.log('hit op left game')
                setRenderGrid([])
                setGridInteract([])
                setGameInfo({
                    ...gameInfo,
                    IsFinished: false,
                    winnerId: '',
                    whoWinner: '',
                })
                return
            }



            if (lastMessage?.P1Name && lastMessage?.P2Name) {
                setGameInfo({
                    yourRole: playerId === lastMessage.P1ID ? 'P1' : 'P2',
                    P1Name: lastMessage.P1Name,
                    P2Name: lastMessage.P2Name,
                    IsFinished: lastMessage.IsFinished,
                    winnerId: lastMessage.WinnerID,
                    whoWinner: lastMessage.Winner,
                    currentTurn: lastMessage.PlayerTurn
                })
                setGridInteract(lastMessage.InteractGrid)
            }

            if (lastMessage && lastMessage.Status === 'Game Start' && renderGrid.length === 0) {
                setRenderGrid(lastMessage.Grid)
            }


        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderGrid.length, isConnect, lastMessage, playerId, playerName, roomId, sendMessage, disconnect, navigate])


    const leaveGameHander = () => {
        sendMessage({
            gameID: roomId,
            type: 'leave',
            Data: {
                playerID: playerId
            }
        })
    }





    const onPlayerMove = (coordinate: string) => {
        sendMessage({
            gameID: roomId,
            type: 'move',
            Data: {
                coordinate
            }
        })
    }

    const resetToDefault = () => {
        setRenderGrid([])
        setIsJoin(false)
        setGameInfo({
            ...gameInfo,
            IsFinished: false,
            winnerId: '',
            whoWinner: '',
        })
    }

    const rematchHandler = () => {
        sendMessage({
            gameID: roomId,
            type: 'rematch',
        })
    }



    useEffect(() => {
        connect(`ws://10.10.0.216:4296/game?gameID=${roomId}`)

        return () => {
            disconnect(roomId || 'null', playerId)
            resetToDefault()
        }
    }, [])

    const isYourTurn = gameInfo.yourRole === gameInfo.currentTurn

    return { renderGrid, isJoin, setRenderGrid, setIsJoin, playerName, playerId, onPlayerMove, resetToDefault, isConnect, gameInfo, isYourTurn, gridInteract, leaveGameHander, rematchHandler }
}