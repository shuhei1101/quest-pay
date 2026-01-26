"use client"

import { useState, useRef, ReactNode, useCallback } from "react"
import { Loader, Center } from "@mantine/core"

/** プル トゥ リフレッシュコンポーネントのプロパティ */
type PullToRefreshProps = {
  /** 子要素 */
  children: ReactNode
  /** リフレッシュ時のコールバック */
  onRefresh: () => Promise<void>
  /** プルダウンの閾値（ピクセル） */
  threshold?: number
}

/** プルを開始するための最小距離（ピクセル） */
const MIN_PULL_DISTANCE = 10

/** プル トゥ リフレッシュコンポーネント */
export const PullToRefresh = ({
  children,
  onRefresh,
  threshold = 80,
}: PullToRefreshProps) => {
  /** プルダウンの距離 */
  const [pullDistance, setPullDistance] = useState(0)
  /** リフレッシュ中かどうか */
  const [isRefreshingState, setIsRefreshingState] = useState(false)
  /** タッチ開始位置 */
  const touchStartY = useRef(0)
  /** スクロール可能かどうか */
  const canPull = useRef(false)

  /** タッチ開始時のハンドル */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // スクロール位置が最上部の場合のみプル可能にする
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY
      canPull.current = true
    }
  }, [])

  /** タッチ移動時のハンドル */
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!canPull.current || isRefreshingState) return

    const touchY = e.touches[0].clientY
    const distance = touchY - touchStartY.current

    // 下方向にプルしている場合のみ処理する
    if (distance > 0 && window.scrollY === 0) {
      // プルダウンの距離を更新する（最大値を設定）
      setPullDistance(Math.min(distance, threshold * 1.5))
      
      // デフォルトのスクロール動作を防ぐ
      if (distance > MIN_PULL_DISTANCE) {
        e.preventDefault()
      }
    }
  }, [isRefreshingState, threshold])

  /** タッチ終了時のハンドル */
  const handleTouchEnd = useCallback(async () => {
    canPull.current = false

    // 閾値を超えていればリフレッシュを実行する
    if (pullDistance >= threshold && !isRefreshingState) {
      setIsRefreshingState(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshingState(false)
      }
    }

    // プルダウンの距離をリセットする
    setPullDistance(0)
  }, [pullDistance, threshold, isRefreshingState, onRefresh])

  /** リフレッシュインジケーターの高さを計算する */
  const indicatorHeight = Math.min(pullDistance, threshold)

  /** リフレッシュインジケーターの透明度を計算する */
  const indicatorOpacity = Math.min(pullDistance / threshold, 1)

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* リフレッシュインジケーター */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${indicatorHeight}px`,
          opacity: indicatorOpacity,
          transition: isRefreshingState ? "height 0.3s ease" : "none",
          zIndex: 10,
        }}
      >
        <Center style={{ height: "100%" }}>
          <Loader size="sm" />
        </Center>
      </div>

      {/* コンテンツ */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshingState || pullDistance === 0 ? "transform 0.3s ease" : "none",
        }}
      >
        {children}
      </div>
    </div>
  )
}
