"use client"

import { useThemeContext } from "./themeContext"

/** テーマを利用するためのカスタムフック */
export const useTheme = () => {
  const { currentTheme, currentThemeKey, setTheme } = useThemeContext()

  return {
    /** 現在のテーマキー */
    themeKey: currentThemeKey,
    /** 現在のテーマ設定 */
    theme: currentTheme,
    /** テーマを変更する */
    setTheme,
  }
}
