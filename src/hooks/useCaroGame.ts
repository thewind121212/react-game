import { useEffect, useState } from "react"
import { useGameStore } from "../store/game"
import { useWebSocket } from "./useWebSocket"
import { useParams } from "react-router"


export function useCaroGame() {
    const [playerState, setPlayerState] = useState<string>('p1')
    const [gridInteract, setGridInteract] = useState<string[][]>([])
    const [isJoin, setIsJoin] = useState<boolean>(false)
    const { playerName, playerId } = useGameStore()



    const { connect, sendMessage, lastMessage, disconnect, isConnect } = useWebSocket()

    const { roomId } = useParams()

    useEffect(() => {
        if (isConnect) {
            if (!isJoin && lastMessage && lastMessage.Status === 'Waiting for Player') {
                console.log('run')
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

            if (lastMessage && lastMessage.Status === 'Game Start' && gridInteract.length === 0) {
                setGridInteract(lastMessage.Grid)
            }


        }

    }, [gridInteract.length, isConnect, isJoin, lastMessage, playerId, playerName, roomId, sendMessage])



    const onPlayerMove = (coordinate: string) => {
        sendMessage({
            gameID: roomId,
            type: 'move',
            Data: {
                player: playerState,
                coordinate
            }
        })
    }

    const resetToDefault = () => {
        setGridInteract([])
        setPlayerState('p1')
        setIsJoin(false)
    }



    useEffect(() => {
        connect(`ws://localhost:4296/game?gameID=${roomId}`)

        return () => {
            disconnect()
            resetToDefault()
        }
    }, [])



    return { gridInteract, playerState, isJoin, setGridInteract, setPlayerState, setIsJoin, playerName, playerId, onPlayerMove, resetToDefault, isConnect }
}