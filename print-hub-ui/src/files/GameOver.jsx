import { VStack, HStack, Box, Text, Button, Separator } from '@chakra-ui/react'

export default function GameOver({ gameOver, player, guesses, onRematch, onLeave }) {
  if (!gameOver) return null

  const iWon         = gameOver.winnerGuestId === player.guestId
  const disconnected = gameOver.reason === 'opponent_disconnected'
  const myGuesses    = guesses.filter(g => g.byGuestId === player.guestId).length
  const theirGuesses = guesses.filter(g => g.byGuestId !== player.guestId).length
  const totalTurns   = gameOver.totalTurns ?? guesses.length

  return (
    <VStack gap={7} align="center" textAlign="center" maxW="400px" w="100%">
      {/* Result */}
      <VStack gap={3}>
        <Text fontSize="4xl">{iWon ? '🏆' : '💀'}</Text>
        <Text
          fontFamily="heading" fontSize="2xl" fontWeight="800" letterSpacing="2px"
          color={iWon ? 'brand.300' : 'red.400'}
        >
          {disconnected
            ? 'OPPONENT BAILED'
            : iWon ? 'YOU CRACKED IT' : 'GOT CRACKED'}
        </Text>
        {disconnected && (
          <Text fontSize="12px" color="gray.500">Opponent disconnected — you win by default</Text>
        )}
      </VStack>

      {/* Secret reveal */}
      {gameOver.secret && !disconnected && (
        <Box
          bg="gray.900" border="1px solid" borderColor="gray.800"
          borderRadius="xl" px={8} py={5} w="100%"
        >
          <VStack gap={2}>
            <Text fontSize="10px" letterSpacing="3px" color="gray.600">
              {iWon ? 'THE NUMBER WAS' : 'YOUR NUMBER WAS'}
            </Text>
            <Text
              fontFamily="mono" fontSize="3xl" fontWeight="700"
              letterSpacing="8px" color={iWon ? 'brand.300' : 'red.400'}
            >
              {gameOver.secret}
            </Text>
          </VStack>
        </Box>
      )}

      {/* Stats */}
      <HStack
        w="100%" bg="gray.900" border="1px solid" borderColor="gray.800"
        borderRadius="xl" p={5} justify="space-around"
      >
        {[
          { val: totalTurns,   label: 'TOTAL TURNS' },
          { val: myGuesses,    label: 'YOUR GUESSES' },
          { val: theirGuesses, label: 'THEIR GUESSES' },
        ].map((s, i) => (
          <VStack key={i} gap={1} flex={1}>
            <Text fontFamily="mono" fontSize="2xl" fontWeight="700" color="gray.100">{s.val}</Text>
            <Text fontSize="9px" letterSpacing="1px" color="gray.600">{s.label}</Text>
          </VStack>
        ))}
      </HStack>

      {/* Actions */}
      <VStack gap={3} w="100%">
        <Button
          w="100%" py={6}
          bg="brand.300" color="gray.950"
          fontFamily="mono" fontSize="12px" fontWeight="700" letterSpacing="2px"
          borderRadius="md" _hover={{ bg: 'brand.400' }}
          onClick={onRematch}
        >
          ↺ REMATCH
        </Button>
        <Button
          w="100%" py={5}
          bg="transparent" color="gray.500"
          border="1px solid" borderColor="gray.800"
          fontFamily="mono" fontSize="12px" letterSpacing="2px"
          borderRadius="md" _hover={{ borderColor: 'gray.600', color: 'gray.300' }}
          onClick={onLeave}
        >
          BACK TO LOBBY
        </Button>
      </VStack>
    </VStack>
  )
}
