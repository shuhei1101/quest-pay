"use client"

import { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from "react"

type LoadingContextType = {
  /** ローディング中かどうか */
  isLoading: boolean
  /** ローディングを開始する */
  startLoading: () => void
  /** ローディングを停止する */
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

/** ローディング状態を管理するプロバイダー */
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startLoading = useCallback(() => {
    setIsLoading(true)
    
    // タイムアウト方式：3秒後に自動的にローディングを停止
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }, [])

  const stopLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsLoading(false)
  }, [])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

/** ローディング状態を管理するフックを取得する */
export const useLoadingContext = () => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoadingContext must be used within a LoadingProvider")
  }
  return context
}
