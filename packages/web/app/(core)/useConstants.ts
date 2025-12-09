"use client"

import { useMantineColorScheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

export const useConstants = () => {
    // 画面サイズごとのプラットフォーム判定
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 900px)')
  const isDesktop = useMediaQuery('(max-width: 1200px)')
  const { colorScheme } = useMantineColorScheme();
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLight: colorScheme === "light"
  }
}
