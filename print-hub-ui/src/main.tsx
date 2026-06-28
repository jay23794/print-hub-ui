import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import { system } from './chakra.ts'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { AppToaster } from './lib/toaster.tsx'

createRoot(document.getElementById('root')!).render(

   <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider value={system}>
        <AuthProvider>
          <App />
          <AppToaster />
        </AuthProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>

)
