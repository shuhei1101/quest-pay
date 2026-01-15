"use client"

import React, { createContext, useState, useCallback, useMemo } from "react"
import { themes, ThemeKey } from "./themes"
import { AppThemeConfig } from "./themeConfig"
import { useSystemTheme } from "../useSystemTheme"

type ThemeContextType = {
  /** 現在のテーマキー */
  currentThemeKey: ThemeKey
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
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/** テーマコンテキストを提供する */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentThemeKey, setCurrentThemeKey] = useState<ThemeKey>("default")
  const { isDark } = useSystemTheme()

  const currentTheme = useMemo(() => themes[currentThemeKey], [currentThemeKey])

  const getCurrentColors = useCallback(() => {
    return currentTheme[isDark ? "dark" : "light"]
  }, [currentTheme, isDark])

  const setTheme = useCallback((themeKey: ThemeKey) => {
    setCurrentThemeKey(themeKey)
  }, [])

  const contextValue = useMemo(
    () => ({
      currentThemeKey,
      currentTheme,
      getCurrentColors,
      setTheme,
    }),
    [currentThemeKey, currentTheme, getCurrentColors, setTheme]
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
