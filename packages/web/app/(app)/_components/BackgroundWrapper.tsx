"use client"

import { Box, Image, useMantineColorScheme } from '@mantine/core'
import { useSystemTheme } from '../../(core)/useSystemTheme'
import { useEffect, useState } from 'react'
import { devLog } from '../../(core)/util'
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
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: isSystemDark ? "#1a1b1e" : "#faf8f3",
        }}
      >
        {/* <Image
          src={isSystemDark ? "/images/bg-dark.png" : "/images/bg-light.png"}
          alt="bg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        /> */}

        <Box
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Box>
      <FeedbackMessage />
    </>
  )
}
