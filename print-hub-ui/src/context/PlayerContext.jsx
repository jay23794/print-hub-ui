import { createContext, useContext, useState } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState(null)
  const register = (nickname) => {
    const p = { guestId: 'preview-guest', nickname }
    setPlayer(p)
    return p
  }
  return (
    <PlayerContext.Provider value={{ player, register }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}
