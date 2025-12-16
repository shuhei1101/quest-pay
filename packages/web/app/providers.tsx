'use client'

import { MantineProvider } from '@mantine/core'
import { theme } from './theme'
import { QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './(core)/error/ErrorFallback'
import { queryClient } from './(core)/tanstack'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={(props) => <ErrorFallback {...props} />}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider 
          theme={theme} 
        >
          {children}
        </MantineProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
