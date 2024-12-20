import React, { createContext, useRef, useState } from "react"


export interface WebSocketMessage {
    ID: string
    Status: string
    P1ID: string
    P2ID: string
    P1Name: string
    P2Name: string
    PlayerID: string
    PlayerTurn: "P1" | "P2"
    Grid: string[][]
    InteractGrid: string[][]
    IsFinished: boolean
    WinnerID: string,
    Winner: string
}


export interface WebSocketWrapperProps {
    sendMessage: (message: unknown) => void
    connect: (url: string) => void,
    disconnect: (roomId: string, playerID: string) => void,
    lastMessage: WebSocketMessage | null,
    isConnect: boolean
}


export const WebSocketContext = createContext<WebSocketWrapperProps | undefined>(undefined)

interface WebSocketProviderProps {
    reconnectInterval?: number;
    isEnableReconnect?: boolean;
    children: React.ReactNode;
}


export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ reconnectInterval = 5000, children, isEnableReconnect = false }) => {

    const [lastMessage, setLastMessage] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeout = useRef<number | null>(null);



    const connect = (url: string) => {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            //debug
            console.log('WebSocket connected');
            setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data)
            setLastMessage(data);
            console.log('WebSocket message:', data)
        };

        ws.current.onclose = () => {
            //debug
            console.log('WebSocket closed');
            setLastMessage(null);
            setIsConnected(false);

            if (reconnectTimeout.current === null && isEnableReconnect) {
                reconnectTimeout.current = window.setTimeout(() => {
                    reconnectTimeout.current = null;
                    connect(url); // Attempt to reconnect
                }, reconnectInterval);
            }
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setLastMessage(null);
        };
    };

    const sendMessage = (message: unknown) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    };

    const disconnect = (roomId: string, playerId: string) => {
        if (ws.current) {
            sendMessage({
                type: 'disconnect', data: {
                    gameID: roomId,
                    type: 'leave',
                    Data: {
                        playerID: playerId
                    }
                }
            });
            ws.current.close();
        }
    }




    return (
        <WebSocketContext.Provider value={{ sendMessage, lastMessage: lastMessage, isConnect: isConnected, connect, disconnect }}>
            {children}
        </WebSocketContext.Provider>
    )
}