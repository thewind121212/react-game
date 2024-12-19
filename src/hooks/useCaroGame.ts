import { useEffect, useState } from "react"
import { useGameStore } from "../store/game"
import { useWebSocket } from "./useWebSocket"
import { useParams } from "react-router"


export function useCaroGame() {
    const [gridInteract, setGridInteract] = useState<string[][]>([])
    const [renderGrid, setRenderGrid] = useState<string[][]>([])
    const [isJoin, setIsJoin] = useState<boolean>(false)
    const { playerName, playerId } = useGameStore()

    const [gameInfo, setGameInfo] = useState<
        {
            yourRole: "P1" | "P2"
            P1Name: string
            P2Name: string
            IsFinished: boolean
            currentTurn: "P1" | "P2"
        }
    >({
        yourRole: 'P1',
        P1Name: '',
        P2Name: '',
        IsFinished: false,
        currentTurn: 'P1'
    })



    const { connect, sendMessage, lastMessage, disconnect, isConnect } = useWebSocket()

    const { roomId } = useParams()

    useEffect(() => {
        if (isConnect) {
            if (!isJoin && lastMessage && lastMessage.Status === 'Waiting for Player') {
                sendMessage({
                    gameID: roomId,
                    type: 'join',
                    Data: {
                        name: playerName,
                        playerID: playerId,
                    }
                })
                setIsJoin(true)
            }

            if (lastMessage?.P1Name && lastMessage?.P2Name) {
                setGameInfo({
                    yourRole: playerId === lastMessage.P1ID ? 'P1' : 'P2',
                    P1Name: lastMessage.P1Name,
                    P2Name: lastMessage.P2Name,
                    IsFinished: lastMessage.IsFinished,
                    currentTurn: lastMessage.PlayerTurn
                })
                setGridInteract(lastMessage.InteractGrid)
            }

            if (lastMessage && lastMessage.Status === 'Game Start' && renderGrid.length === 0) {
                setRenderGrid(lastMessage.Grid)
            }


        }

    }, [renderGrid.length, isConnect, isJoin, lastMessage, playerId, playerName, roomId, sendMessage])





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
    }



    useEffect(() => {
        connect(`ws://localhost:4296/game?gameID=${roomId}`)

        return () => {
            disconnect()
            resetToDefault()
        }
    }, [])

    const isYourTurn = gameInfo.yourRole === gameInfo.currentTurn

    return { renderGrid, isJoin, setRenderGrid, setIsJoin, playerName, playerId, onPlayerMove, resetToDefault, isConnect, gameInfo, isYourTurn, gridInteract }
}