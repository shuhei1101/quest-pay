import { useRef, useCallback } from "react"

type SwipeDirection = "left" | "right"
type SwipeCallback = (direction: SwipeDirection) => void

/**
 * タブ切り替え用タッチスワイプフック
 * 横方向のスワイプを検出してコールバックを実行する
 */
export const useSwipeTab = (onSwipe: SwipeCallback) => {
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const touchEndY = useRef<number>(0)

  // スワイプの最小距離（px）
  const minSwipeDistance = 50

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
    touchEndY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback(() => {
    const diffX = touchStartX.current - touchEndX.current
    const diffY = touchStartY.current - touchEndY.current

    // 横方向の移動が縦方向より大きい場合のみ処理（誤検知防止）
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // 左スワイプ（次のタブへ）
        onSwipe("left")
      } else {
        // 右スワイプ（前のタブへ）
        onSwipe("right")
      }
    }
  }, [onSwipe])

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}
