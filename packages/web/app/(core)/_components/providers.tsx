"use client"

import { MantineProvider, createTheme } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '../error/ErrorFallback'
import { queryClient } from '../tanstack'
import { ThemeProvider, useThemeContext } from '../_theme/themeContext'
import { useMemo } from 'react'

/** MantineProviderのラッパー（テーマを適用する） */
const MantineThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { currentTheme } = useThemeContext()

  const mantineTheme = useMemo(() => {
    const themeConfig: any = {
      fontSizes: {
        xs: "14px",
        sm: "15px",
        md: "16px",
        lg: "18px",
        xl: "20px",
      },
      defaultRadius: "sm",
      components: {
        Input: {
          defaultProps: {
            size: "md",
          },
        },
        TextInput: {
          defaultProps: {
            size: "md",
          },
        },
        PasswordInput: {
          defaultProps: {
            size: "md",
          },
        },
        NumberInput: {
          defaultProps: {
            size: "md",
          },
        },
        Textarea: {
          defaultProps: {
            size: "md",
          },
        },
        Select: {
          defaultProps: {
            size: "md",
          },
        },
        PillsInput: {
          defaultProps: {
            size: "md",
          },
        },
      },
    }

    // カスタムカラーが定義されている場合のみ設定する
    if (currentTheme.colors) {
      themeConfig.colors = currentTheme.colors
    }

    // プライマリカラーをカスタムカラーが定義されている場合のみ設定する
    if (currentTheme.colors && currentTheme.primaryColor) {
      themeConfig.primaryColor = currentTheme.primaryColor
    }

    return createTheme(themeConfig)
  }, [currentTheme])

  return (
    // プロバイダの適用
    <MantineProvider theme={mantineTheme}>
      <ModalsProvider>
        {children}
      </ModalsProvider>
    </MantineProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={(props) => <ErrorFallback {...props} />}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MantineThemeWrapper>
            {children}
          </MantineThemeWrapper>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
