"use client"

import { useThemeContext } from "./themeContext"

/** テーマを利用するためのカスタムフック */
export const useTheme = () => {
  const { currentTheme, currentThemeKey, colorScheme, getCurrentColors, setTheme, setColorScheme, toggleColorScheme } = useThemeContext()

  return {
    /** 現在のテーマキー */
    themeKey: currentThemeKey,
    /** 現在のカラースキーム（light/dark） */
    colorScheme,
    /** 現在のテーマ設定 */
    theme: currentTheme,
    /** カラースキームに応じた現在の色設定を取得する */
    colors: getCurrentColors(),
    /** テーマを変更する */
    setTheme,
    /** カラースキームを変更する */
    setColorScheme,
    /** カラースキームをトグルする */
    toggleColorScheme,
  }
}
