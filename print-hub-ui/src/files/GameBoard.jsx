import { useState, useRef, useEffect } from 'react'
import { VStack, HStack, Box, Text, Input, Button } from '@chakra-ui/react'

export default function GameBoard({ player, players, guesses, currentTurn, onGuess, error }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const refs    = [useRef(), useRef(), useRef(), useRef()]
  const logRef  = useRef(null)
  const isMyTurn = currentTurn === player.guestId
  const opponent = players.find(p => p.guestId !== player.guestId)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [guesses])

  // Re-focus first digit when it becomes my turn
  useEffect(() => {
    if (isMyTurn) setTimeout(() => refs[0].current?.focus(), 100)
  }, [isMyTurn])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]; next[i] = val; setDigits(next)
    if (val && i < 3) refs[i + 1].current?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus()
    if (e.key === 'Enter' && digits.every(d => d)) submit()
  }

  const submit = () => {
    const guess = digits.join('')
    if (guess.length === 4) { onGuess(guess); setDigits(['', '', '', '']); refs[0].current?.focus() }
  }

  const full = digits.every(d => d !== '')

  const badgeColor = (n) => {
    if (n === 4) return { bg: 'rgba(200,240,96,0.15)', color: 'brand.300' }
    if (n >= 2)  return { bg: 'rgba(255,180,0,0.15)',  color: '#ffb400' }
    return            { bg: 'rgba(255,255,255,0.05)', color: 'gray.500' }
  }

  return (
    <VStack gap={4} w="100%" maxW="480px">
      {/* Turn banner */}
      <Box
        w="100%" py={3} textAlign="center"
        bg={isMyTurn ? 'rgba(200,240,96,0.08)' : 'gray.900'}
        border="1px solid"
        borderColor={isMyTurn ? 'rgba(200,240,96,0.35)' : 'gray.800'}
        borderRadius="md"
      >
        <Text
          fontFamily="mono" fontSize="11px" fontWeight="700" letterSpacing="2px"
          color={isMyTurn ? 'brand.300' : 'gray.500'}
        >
          {isMyTurn
            ? '⚡ YOUR TURN — MAKE A GUESS'
            : `WAITING FOR ${(opponent?.nickname || 'OPPONENT').toUpperCase()}…`
          }
        </Text>
      </Box>

      {/* Players */}
      <HStack w="100%" gap={3}>
        {players.map(p => (
          <HStack
            key={p.guestId} flex={1} justify="center" gap={2} py={2} px={3}
            bg="gray.900" border="1px solid"
            borderColor={currentTurn === p.guestId ? 'brand.300' : 'gray.800'}
            borderRadius="md"
            transition="border-color 0.2s"
          >
            {currentTurn === p.guestId && (
              <Text color="brand.300" fontSize="10px">▶</Text>
            )}
            <Text fontFamily="mono" fontSize="12px" color={currentTurn === p.guestId ? 'gray.100' : 'gray.500'}>
              {p.nickname}
            </Text>
          </HStack>
        ))}
      </HStack>

      {/* Guess log */}
      <Box
        ref={logRef}
        w="100%" minH="220px" maxH="300px" overflowY="auto"
        bg="gray.900" border="1px solid" borderColor="gray.800" borderRadius="xl" p={4}
        display="flex" flexDir="column" gap={2}
      >
        {guesses.length === 0 ? (
          <Text color="gray.700" fontSize="12px" textAlign="center" m="auto">
            No guesses yet. Make your move.
          </Text>
        ) : (
          guesses.map((g, i) => {
            const bc = badgeColor(g.correctDigits)
            const mine = g.byGuestId === player.guestId
            return (
              <HStack
                key={i}
                px={3} py={2} borderRadius="md"
                bg={mine ? 'rgba(200,240,96,0.03)' : 'gray.800'}
                border="1px solid"
                borderColor={mine ? 'rgba(200,240,96,0.12)' : 'gray.700'}
                style={{ animation: 'slideIn 0.2s ease' }}
              >
                <Text fontSize="11px" color="gray.600" w="24px">#{g.turnNumber}</Text>
                <Text fontSize="11px" color="gray.500" flex={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                  {g.byNickname}
                </Text>
                <Text fontFamily="mono" fontSize="15px" fontWeight="700" letterSpacing="3px" color="gray.100">
                  {g.guess}
                </Text>
                <Box
                  px={2} py={1} borderRadius="sm"
                  bg={bc.bg}
                >
                  <Text fontFamily="mono" fontSize="11px" fontWeight="700" letterSpacing="1px" color={bc.color}>
                    {g.correctDigits}/4
                  </Text>
                </Box>
                {g.correctDigits === 4 && <Text fontSize="14px">🎯</Text>}
              </HStack>
            )
          })
        )}
        <style>{`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </Box>

      {/* Guess input */}
      {isMyTurn && (
        <Box
          w="100%" bg="gray.900" border="1px solid" borderColor="gray.800"
          borderRadius="xl" p={5}
        >
          <VStack gap={4} align="center">
            <HStack gap={3}>
              {digits.map((d, i) => (
                <Input
                  key={i}
                  ref={refs[i]}
                  w="58px" h="68px"
                  bg="gray.800"
                  border="2px solid" borderColor={d ? 'brand.300' : 'gray.700'}
                  borderRadius="xl"
                  color="brand.300"
                  fontFamily="mono" fontSize="xl" fontWeight="700"
                  textAlign="center"
                  maxLength={1}
                  value={d}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  inputMode="numeric"
                  _focus={{ borderColor: 'brand.300', outline: 'none', boxShadow: 'none' }}
                />
              ))}
            </HStack>

            {error && <Text color="red.400" fontSize="12px">{error}</Text>}

            <Button
              w="100%" py={5}
              bg="brand.300" color="gray.950"
              fontFamily="mono" fontSize="12px" fontWeight="700" letterSpacing="2px"
              borderRadius="md"
              _hover={{ bg: 'brand.400' }}
              disabled={!full}
              onClick={submit}
            >
              GUESS →
            </Button>
          </VStack>
        </Box>
      )}
    </VStack>
  )
}
