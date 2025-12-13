'use client'

import { MantineProvider } from '@mantine/core'
import { theme } from './theme'
import { FeedbackMessageWrapper } from './(core)/_components/FeedbackMessageWrapper'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSystemTheme } from './(core)/useSystemTheme'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider 
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
