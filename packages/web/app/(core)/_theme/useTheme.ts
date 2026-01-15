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
    /** ボタンの色を取得する */
    getButtonColor: (type: keyof typeof currentTheme.buttonColors = "default") => {
      return currentTheme.buttonColors[type]
    },
    /** テキストの色を取得する */
    getTextColor: (type: keyof typeof currentTheme.textColors = "primary") => {
      return currentTheme.textColors[type]
    },
    /** 背景色を取得する */
    getBackgroundColor: (type: keyof typeof currentTheme.backgroundColors = "default") => {
      return currentTheme.backgroundColors[type]
    },
    /** 枠線の色を取得する */
    getBorderColor: (type: keyof typeof currentTheme.borderColors = "default") => {
      return currentTheme.borderColors[type]
    },
  }
}
