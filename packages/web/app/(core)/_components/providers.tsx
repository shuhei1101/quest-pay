"use client"

import { MantineProvider, createTheme } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '../error/ErrorFallback'
import { queryClient } from '../tanstack'
import { ThemeProvider, useThemeContext } from '../_theme/themeContext'
import { useMemo } from 'react'
import { ServiceWorkerRegistration } from './ServiceWorkerRegistration'

/** MantineProviderのラッパー（テーマを適用する） */
const MantineThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { currentTheme } = useThemeContext()

  const mantineTheme = useMemo(() => {
    // 入力コンポーネントのデフォルトサイズ（モバイルで拡大しないように16px以上に設定）
    const inputDefaultProps = { size: "md" }

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
        Input: { defaultProps: inputDefaultProps },
        TextInput: { defaultProps: inputDefaultProps },
        PasswordInput: { defaultProps: inputDefaultProps },
        NumberInput: { defaultProps: inputDefaultProps },
        Textarea: { defaultProps: inputDefaultProps },
        Select: { defaultProps: inputDefaultProps },
        PillsInput: { defaultProps: inputDefaultProps },
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
            {/* Service Workerの登録 */}
            <ServiceWorkerRegistration />
            {children}
          </MantineThemeWrapper>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
