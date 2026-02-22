"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"

type FABContextType = {
  /** 現在開いているFABのID */
  openFabId: string | null
  /** FABを開く */
  openFab: (id: string) => void
  /** FABを閉じる */
  closeFab: (id: string) => void
  /** FABが開いているかどうかを確認する */
  isOpen: (id: string) => boolean
}

const FABContext = createContext<FABContextType | undefined>(undefined)

/** FABの開閉状態を管理するプロバイダー */
export const FABProvider = ({ children }: { children: ReactNode }) => {
  const [openFabId, setOpenFabId] = useState<string | null>(null)

  const openFab = useCallback((id: string) => {
    setOpenFabId(id)
  }, [])

  const closeFab = useCallback((id: string) => {
    setOpenFabId(prev => prev === id ? null : prev)
  }, [])

  const isOpen = useCallback((id: string) => {
    return openFabId === id
  }, [openFabId])

  return (
    <FABContext.Provider value={{ openFabId, openFab, closeFab, isOpen }}>
      {children}
    </FABContext.Provider>
  )
}

/** FABの開閉状態を管理するフックを取得する */
export const useFABContext = () => {
  const context = useContext(FABContext)
  if (context === undefined) {
    throw new Error("useFABContext must be used within a FABProvider")
  }
  return context
}
