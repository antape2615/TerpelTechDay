import { useState } from 'react'
import Game from './pages/Game'
import PlayerForm from './pages/PlayerForm'

function App() {
  const [playerInfo, setPlayerInfo] = useState(null)

  if (!playerInfo) {
    return <PlayerForm onPlayerSubmit={setPlayerInfo} />
  }

  return <Game playerInfo={playerInfo} onLogout={() => setPlayerInfo(null)} />
}

export default App
