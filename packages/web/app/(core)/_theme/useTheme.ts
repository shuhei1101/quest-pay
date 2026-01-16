"use client"

import { useThemeContext } from "./themeContext"
import { useSystemTheme } from "../useSystemTheme"

/** テーマを利用するためのカスタムフック */
export const useTheme = () => {
  const { currentTheme, currentThemeKey, getCurrentColors, setTheme } = useThemeContext()
  const { isDark } = useSystemTheme()

  return {
    /** 現在のテーマキー */
    themeKey: currentThemeKey,
    /** OSのカラースキーム（ダークモードかどうか） */
    isDark,
    /** 現在のテーマ設定 */
    theme: currentTheme,
    /** カラースキームに応じた現在の色設定を取得する */
    colors: getCurrentColors(),
    /** テーマを変更する */
    setTheme,
  }
}
