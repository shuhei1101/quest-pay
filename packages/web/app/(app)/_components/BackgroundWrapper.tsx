"use client"

import { Box, useMantineColorScheme } from '@mantine/core'
import { useSystemTheme } from '../../(core)/useSystemTheme'
import { useEffect, useState } from 'react'
import { FeedbackMessage } from '../../(core)/_components/FeedbackMessageWrapper'

/** 背景とカラースキーム管理のラッパーを取得する */
export const BackgroundWrapper = ({children}: {children: React.ReactNode}) => {
  // システムカラースキーム
  const { isDark: isSystemDark } = useSystemTheme()
  // Mantineカラースキーム
  const { setColorScheme } = useMantineColorScheme()
  
  useEffect(() => {
    setColorScheme(isSystemDark ? "dark" : "light")
  }, [isSystemDark, setColorScheme])

  // SSRレンダリング時の処理
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null

  return (
    <>
      <Box
        style={{
          width: "100vw",
          minHeight: "100vh",
          backgroundColor: isSystemDark ? "#1a1b1e" : "#faf8f3",
          // iOSのセーフエリア対応
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {children}
      </Box>
      <FeedbackMessage />
    </>
  )
}
