'use client'

import { MantineProvider } from '@mantine/core'
import { theme } from './theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider 
        theme={theme} 
      >
        {children}
      </MantineProvider>
    </QueryClientProvider>
  )
}
