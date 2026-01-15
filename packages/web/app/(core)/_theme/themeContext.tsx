"use client"

import React, { createContext, useState, useCallback, useMemo } from "react"
import { themes, ThemeKey } from "./themes"
import { AppThemeConfig, ColorScheme } from "./themeConfig"

type ThemeContextType = {
  /** 現在のテーマキー */
  currentThemeKey: ThemeKey
  /** 現在のカラースキーム */
  colorScheme: ColorScheme
  /** 現在のテーマ設定 */
  currentTheme: AppThemeConfig
  /** カラースキームに応じた現在の色設定を取得する */
  getCurrentColors: () => {
    buttonColors: AppThemeConfig["light"]["buttonColors"]
    textColors: AppThemeConfig["light"]["textColors"]
    backgroundColors: AppThemeConfig["light"]["backgroundColors"]
    borderColors: AppThemeConfig["light"]["borderColors"]
  }
  /** テーマを変更する */
  setTheme: (themeKey: ThemeKey) => void
  /** カラースキームを変更する */
  setColorScheme: (scheme: ColorScheme) => void
  /** カラースキームをトグルする */
  toggleColorScheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/** テーマコンテキストを提供する */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentThemeKey, setCurrentThemeKey] = useState<ThemeKey>("default")
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light")

  const currentTheme = useMemo(() => themes[currentThemeKey], [currentThemeKey])

  const getCurrentColors = useCallback(() => {
    return currentTheme[colorScheme]
  }, [currentTheme, colorScheme])

  const setTheme = useCallback((themeKey: ThemeKey) => {
    setCurrentThemeKey(themeKey)
  }, [])

  const handleSetColorScheme = useCallback((scheme: ColorScheme) => {
    setColorScheme(scheme)
  }, [])

  const toggleColorScheme = useCallback(() => {
    setColorScheme((prev) => (prev === "light" ? "dark" : "light"))
  }, [])

  const contextValue = useMemo(
    () => ({
      currentThemeKey,
      colorScheme,
      currentTheme,
      getCurrentColors,
      setTheme,
      setColorScheme: handleSetColorScheme,
      toggleColorScheme,
    }),
    [currentThemeKey, colorScheme, currentTheme, getCurrentColors, setTheme, handleSetColorScheme, toggleColorScheme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

/** テーマコンテキストを利用する */
export const useThemeContext = () => {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}
