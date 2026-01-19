"use client"

import { Group } from "@mantine/core"
import { ReactNode, useRef, useEffect } from "react"

/** 横スクロール可能なボタングループコンポーネント */
export const HorizontalScrollButtons = ({ children, ...props }: {
  /** ボタンなどの子要素 */
  children: ReactNode
  /** Groupコンポーネントに渡すプロパティ */
  [key: string]: unknown
}) => {
  /** ボタングループコンテナの参照 */
  const containerRef = useRef<HTMLDivElement>(null)

  /** マウスホイールでの横スクロールを有効化する */
  useEffect(() => {
    const container = containerRef.current
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
  }, [])

  return (
    <Group {...props}>
      <div 
        ref={containerRef} 
        className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2 w-full"
      >
        {children}
      </div>
    </Group>
  )
}
