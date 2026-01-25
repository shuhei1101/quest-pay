"use client"
import { useEffect, useRef } from "react"

/** タブの自動スクロールを行うカスタムフック */
export const useTabAutoScroll = (tabValue: string | null) => {
  /** タブリストコンテナの参照 */
  const tabListRef = useRef<HTMLDivElement>(null)

  /** スクロール時の余白（ピクセル） */
  const SCROLL_MARGIN = 16

  /** タブ変更時に選択されたタブを画面内にスクロールする */
  useEffect(() => {
    if (!tabListRef.current || !tabValue) return

    const container = tabListRef.current
    const selectedTabElement = container.querySelector(`[data-value="${tabValue}"]`) as HTMLElement | null

    if (selectedTabElement) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = selectedTabElement.getBoundingClientRect()

      // タブが画面外にある場合、スクロールして表示する
      if (tabRect.left < containerRect.left) {
        // タブが左側に隠れている場合
        container.scrollLeft += tabRect.left - containerRect.left - SCROLL_MARGIN
      } else if (tabRect.right > containerRect.right) {
        // タブが右側に隠れている場合
        container.scrollLeft += tabRect.right - containerRect.right + SCROLL_MARGIN
      }
    }
  }, [tabValue])

  return { tabListRef }
}

/** マウスホイールでの横スクロールを有効化するカスタムフック */
export const useTabHorizontalScroll = (tabListRef: React.RefObject<HTMLDivElement | null>) => {
  /** マウスホイールでの横スクロールを有効化する */
  useEffect(() => {
    const container = tabListRef.current
    if (!container) return

    /** ホイールイベントハンドラ */
    const handleWheel = (e: WheelEvent) => {
      // 縦スクロールを横スクロールに変換する
      if (e.deltaY !== 0) {
        e.preventDefault()
        container.scrollLeft += e.deltaY
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [tabListRef])
}
