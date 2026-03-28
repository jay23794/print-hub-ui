import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import { system } from './chakra.ts'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(

   <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider value={system}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>

)
