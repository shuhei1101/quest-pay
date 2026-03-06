"use client"

import { ReactNode, useEffect } from "react"
import { useLoadingContext } from "./LoadingContext"

type ScreenWrapperProps = {
  /** 子要素 */
  children: ReactNode
}

/**
 * 画面コンポーネント用のラッパー
 * 
 * 画面がマウントされた時にローディング状態を停止する
 * （画面遷移完了を検知）
 * 
 * @example
 * // FamilyQuestsScreen.tsx
 * export const FamilyQuestsScreen = () => {
 *   return (
 *     <ScreenWrapper>
 *       <div>画面内容</div>
 *     </ScreenWrapper>
 *   )
 * }
 */
export const ScreenWrapper = ({ children }: ScreenWrapperProps) => {
  const { stopLoading } = useLoadingContext()

  useEffect(() => {
    // 画面がマウントされたらローディングを停止
    stopLoading()
  }, [stopLoading])

  return <>{children}</>
}
