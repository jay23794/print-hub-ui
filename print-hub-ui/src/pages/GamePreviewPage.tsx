import { useState } from 'react'
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react'
import { PlayerProvider } from '../context/PlayerContext.jsx'
import GameBoard from '../files/GameBoard.jsx'
import GameOver from '../files/GameOver.jsx'
import Lobby from '../files/Lobby.jsx'

const MOCK_PLAYER = { guestId: 'me', nickname: 'Player1' }
const MOCK_PLAYERS = [
  { guestId: 'me', nickname: 'Player1' },
  { guestId: 'opp', nickname: 'Player2' },
]
const MOCK_GUESSES = [
  { turnNumber: 1, byGuestId: 'me', byNickname: 'Player1', guess: '1234', correctDigits: 2 },
  { turnNumber: 2, byGuestId: 'opp', byNickname: 'Player2', guess: '5678', correctDigits: 1 },
  { turnNumber: 3, byGuestId: 'me', byNickname: 'Player1', guess: '9012', correctDigits: 3 },
]
const MOCK_GAME_OVER_WIN = {
  winnerGuestId: 'me',
  reason: 'solved',
  secret: '4242',
  totalTurns: 5,
}
const MOCK_GAME_OVER_LOSE = {
  winnerGuestId: 'opp',
  reason: 'solved',
  secret: '7777',
  totalTurns: 4,
}

type Tab = 'lobby' | 'gameboard' | 'gameover-win' | 'gameover-lose'

const TABS: { id: Tab; label: string }[] = [
  { id: 'lobby', label: 'Lobby' },
  { id: 'gameboard', label: 'Game Board' },
  { id: 'gameover-win', label: 'Game Over (Win)' },
  { id: 'gameover-lose', label: 'Game Over (Lose)' },
]

export default function GamePreviewPage() {
  const [tab, setTab] = useState<Tab>('lobby')

  return (
    <Box minH="100vh" bg="gray.950">
      {/* Tab bar */}
      <Box bg="gray.900" borderBottom="1px solid" borderColor="gray.800" px={4} py={3}>
        <HStack gap={2} flexWrap="wrap">
          <Text fontSize="10px" letterSpacing="2px" color="gray.600" mr={2}>PREVIEW</Text>
          {TABS.map(t => (
            <Button
              key={t.id}
              size="sm"
              variant="ghost"
              fontFamily="mono"
              fontSize="11px"
              letterSpacing="1px"
              color={tab === t.id ? 'brand.300' : 'gray.500'}
              borderBottom="2px solid"
              borderColor={tab === t.id ? 'brand.300' : 'transparent'}
              borderRadius={0}
              _hover={{ color: 'gray.100' }}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Content */}
      <Flex justify="center" align="center" minH="calc(100vh - 56px)" p={6}>
        {tab === 'lobby' && (
          <PlayerProvider>
            <Lobby />
          </PlayerProvider>
        )}

        {tab === 'gameboard' && (
          <GameBoard
            player={MOCK_PLAYER}
            players={MOCK_PLAYERS}
            guesses={MOCK_GUESSES}
            currentTurn="me"
            onGuess={(g: string) => console.log('guess:', g)}
            error=""
          />
        )}

        {tab === 'gameover-win' && (
          <GameOver
            gameOver={MOCK_GAME_OVER_WIN}
            player={MOCK_PLAYER}
            guesses={MOCK_GUESSES}
            onRematch={() => {}}
            onLeave={() => {}}
          />
        )}

        {tab === 'gameover-lose' && (
          <GameOver
            gameOver={MOCK_GAME_OVER_LOSE}
            player={MOCK_PLAYER}
            guesses={MOCK_GUESSES}
            onRematch={() => {}}
            onLeave={() => {}}
          />
        )}
      </Flex>
    </Box>
  )
}
