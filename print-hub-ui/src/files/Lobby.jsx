import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Box, VStack, HStack, Text, Input, Button,
  Separator, Heading, For, Grid,
} from '@chakra-ui/react'
import { usePlayer } from '../context/PlayerContext.jsx'
import { initSocket } from '../socket/socket.js'

const API = '/api/rooms'

export default function Lobby() {
  const navigate            = useNavigate()
  const { player, register } = usePlayer()

  const [nickname, setNickname] = useState(player?.nickname || '')
  const [joinCode, setJoinCode] = useState('')
  const [loading,  setLoading]  = useState(null)
  const [error,    setError]    = useState('')

  const getPlayer = () => {
    if (player) return player
    if (!nickname.trim()) { setError('Enter a nickname first'); return null }
    return register(nickname)
  }

  const call = async (url, body, key) => {
    const p = getPlayer(); if (!p) return
    setLoading(key); setError('')
    try {
      initSocket(p.guestId, p.nickname)
      const res  = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, guestId: p.guestId, nickname: p.nickname }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      navigate(`/room/${data.data.code}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Box minH="100vh" bg="gray.950" position="relative" display="flex" alignItems="center" justifyContent="center" p={6}>
      {/* Grid background */}
      <Box
        position="fixed" inset={0} pointerEvents="none" opacity={0.35}
        backgroundImage="linear-gradient(gray.800 1px, transparent 1px), linear-gradient(90deg, gray.800 1px, transparent 1px)"
        backgroundSize="40px 40px"
        style={{
          backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <VStack gap={8} w="100%" maxW="400px" position="relative" zIndex={1}>
        {/* Logo */}
        <VStack gap={1}>
          <Heading
            fontFamily="heading"
            fontSize="6xl"
            fontWeight="800"
            letterSpacing="-3px"
            color="brand.300"
            lineHeight={1}
            style={{ textShadow: '0 0 40px rgba(200,240,96,0.25)' }}
          >
            NIMU
          </Heading>
          <Text fontSize="10px" letterSpacing="4px" color="gray.600" textTransform="uppercase">
            guess the number · beat the clock
          </Text>
        </VStack>

        {/* Card */}
        <Box w="100%" bg="gray.900" border="1px solid" borderColor="gray.800" borderRadius="xl" p={6}>
          <VStack gap={5}>
            {/* Nickname */}
            <Box w="100%">
              <Text fontSize="10px" letterSpacing="2px" color="gray.600" mb={2}>YOUR HANDLE</Text>
              <Input
                placeholder="enter nickname"
                value={nickname}
                maxLength={20}
                onChange={e => { setNickname(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && call(`${API}/create`, {}, 'create')}
                bg="gray.800"
                border="1px solid"
                borderColor="gray.700"
                borderRadius="md"
                color="gray.100"
                fontFamily="mono"
                px={4} py={3}
                _focus={{ borderColor: 'brand.300', outline: 'none' }}
                _placeholder={{ color: 'gray.600' }}
              />
            </Box>

            {/* Divider */}
            <HStack w="100%" gap={3}>
              <Separator flex={1} borderColor="gray.800" />
              <Text fontSize="10px" letterSpacing="2px" color="gray.600">PLAY</Text>
              <Separator flex={1} borderColor="gray.800" />
            </HStack>

            {/* Create + Quick match */}
            <VStack gap={3} w="100%">
              <Button
                w="100%" py={5}
                bg="brand.300" color="gray.950"
                fontFamily="mono" fontSize="12px" fontWeight="700" letterSpacing="2px"
                borderRadius="md"
                _hover={{ bg: 'brand.400' }}
                disabled={!!loading}
                onClick={() => call(`${API}/create`, {}, 'create')}
              >
                {loading === 'create' ? '...' : '+ CREATE ROOM'}
              </Button>

              <Button
                w="100%" py={5}
                bg="transparent" color="gray.400"
                border="1px solid" borderColor="gray.700"
                fontFamily="mono" fontSize="12px" fontWeight="700" letterSpacing="2px"
                borderRadius="md"
                _hover={{ borderColor: 'gray.500', color: 'gray.100' }}
                disabled={!!loading}
                onClick={() => call(`${API}/random`, {}, 'random')}
              >
                {loading === 'random' ? '...' : '⚡ QUICK MATCH'}
              </Button>
            </VStack>

            {/* Join by code */}
            <HStack w="100%" gap={2}>
              <Input
                placeholder="ROOM CODE"
                value={joinCode}
                maxLength={6}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && call(`${API}/join`, { code: joinCode }, 'join')}
                bg="gray.800"
                border="1px solid" borderColor="gray.700"
                borderRadius="md" color="brand.300"
                fontFamily="mono" fontSize="15px" fontWeight="700"
                letterSpacing="4px" px={4} py={3}
                _focus={{ borderColor: 'brand.300', outline: 'none' }}
                _placeholder={{ color: 'gray.600', letterSpacing: '2px', fontSize: '13px', fontWeight: '400' }}
              />
              <Button
                flexShrink={0} px={5} py={5}
                bg="gray.800" color="gray.100"
                border="1px solid" borderColor="gray.700"
                fontFamily="mono" fontSize="12px" fontWeight="700" letterSpacing="1px"
                borderRadius="md"
                _hover={{ borderColor: 'brand.300', color: 'brand.300' }}
                disabled={!!loading}
                onClick={() => call(`${API}/join`, { code: joinCode }, 'join')}
              >
                {loading === 'join' ? '...' : 'JOIN →'}
              </Button>
            </HStack>

            {error && (
              <Text color="red.400" fontSize="12px" textAlign="center">{error}</Text>
            )}
          </VStack>
        </Box>

        {/* How to play */}
        <VStack gap={1} textAlign="center">
          <Text fontSize="10px" letterSpacing="2px" color="gray.700">HOW IT WORKS</Text>
          {[
            'Each player picks a secret 4-digit number.',
            'Take turns guessing. You\'re told how many digits are correct.',
            'First to crack the code wins.',
          ].map((t, i) => (
            <Text key={i} fontSize="12px" color="gray.600">{t}</Text>
          ))}
        </VStack>
      </VStack>
    </Box>
  )
}
