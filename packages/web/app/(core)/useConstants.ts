"use client"

import { useMediaQuery } from "@mantine/hooks"

export const useConstants = () => {
    // 画面サイズごとのプラットフォーム判定
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 900px)')
  const isDesktop = useMediaQuery('(max-width: 1200px)')
  
  return {
    isMobile,
    isTablet,
    isDesktop,
  }
}
