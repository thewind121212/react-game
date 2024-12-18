
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GameState {
    playerName: string
    playerId: string
}

interface GameAction {
    setPlayerName: (playerName: string) => void
    setPlayerId: (playerId: string) => void
}





export const useGameStore = create<GameState & GameAction>()(
    persist(
        (set) => ({
            playerName: '',
            playerId: '',
            setPlayerName: (playerName) => set({ playerName }),
            setPlayerId: (playerId) => set({ playerId }),
            resetPlayer: () => set({ playerName: '', playerId: '' }),
        }),
        {
            name: 'game-storage',
            storage: createJSONStorage(() => localStorage),
            version: 1,
        }
    )
);




export function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}