'use client'

import { MantineProvider } from '@mantine/core'
import { theme } from './theme'
import { FeedbackMessageWrapper } from './(core)/_components/FeedbackMessageWrapper'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useColorScheme, useLocalStorage } from '@mantine/hooks'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  
  
  const preferred = useColorScheme(); 
  const [scheme, setScheme] = useLocalStorage<'light' | 'dark'>({
    key: "color-scheme",
    defaultValue: preferred,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="dark"
        theme={theme} 
      >
        {/* フィードバックメッセージラッパー */}
        <FeedbackMessageWrapper>
          {children}
        </FeedbackMessageWrapper>
      </MantineProvider>
    </QueryClientProvider>
  )
}
