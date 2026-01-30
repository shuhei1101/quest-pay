"use client"
import { useEffect, useRef, ReactNode } from "react"
import { ActionIcon, MantineColor } from "@mantine/core"
import { IconPlus, IconX } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { useWindow } from "../useConstants"

/** 展開パターンの種類 */
export type ExpandPattern = "manual" | "right" | "left"

export type FloatingActionItem = {
  /** アイコン要素 */
  icon: ReactNode
  /** X軸の移動距離（patternが"manual"の場合のみ必須） */
  x?: number
  /** Y軸の移動距離（patternが"manual"の場合のみ必須） */
  y?: number
  /** クリック時のコールバック */
  onClick: () => void
  /** 個別の色設定(オプション) */
  color?: MantineColor
}

/**
 * パターンに基づいてアイテムの座標を計算する
 * @param items アイテム配列
 * @param pattern 展開パターン
 * @param spacing アイテム間の間隔
 */
const calculateItemPositions = (
  items: FloatingActionItem[],
  pattern: ExpandPattern,
  spacing: number
): Array<{ x: number; y: number }> => {
  if (pattern === "manual") {
    // 手動指定の場合はそのまま返す
    return items.map(item => ({ x: item.x || 0, y: item.y || 0 }))
  }

  if (pattern === "right") {
    // 右に展開する
    return items.map((_, index) => ({
      x: spacing * (index + 1),
      y: 0,
    }))
  }

  if (pattern === "left") {
    // 左に展開する
    return items.map((_, index) => ({
      x: -spacing * (index + 1),
      y: 0,
    }))
  }

  return []
}

/** 展開型フローティングアクションボタンを表示する */
export const FloatingActionButton = ({
  items,
  open,
  onToggle,
  pattern = "manual",
  spacing = 70,
  mainButtonColor = "pink",
  subButtonColor = "pink",
  mainIcon = <IconPlus style={{ width: "70%", height: "70%" }} />,
  rightMobile = "20px",
  rightDesktop = "40px",
  bottomMobile = "80px",
  bottomDesktop = "40px",
  closeOnOutsideClick = true,
  mainButtonSize = 60,
  subButtonSize = 50,
}: {
  /** 展開するアクションアイテムの配列 */
  items: FloatingActionItem[]
  /** 開閉状態 */
  open: boolean
  /** 開閉状態を変更する関数 */
  onToggle: (open: boolean) => void
  /** 展開パターン */
  pattern?: ExpandPattern
  /** アイテム間の間隔（patternが"right"または"left"の場合に使用） */
  spacing?: number
  /** メインボタンの色 */
  mainButtonColor?: MantineColor
  /** サブボタンの色 */
  subButtonColor?: MantineColor
  /** メインボタンのアイコン */
  mainIcon?: ReactNode
  /** 右からの距離(モバイル時) */
  rightMobile?: string
  /** 右からの距離(デスクトップ時) */
  rightDesktop?: string
  /** 下からの距離(モバイル時) */
  bottomMobile?: string
  /** 下からの距離(デスクトップ時) */
  bottomDesktop?: string
  /** 外側クリックで閉じるか */
  closeOnOutsideClick?: boolean
  /** メインボタンのサイズ */
  mainButtonSize?: number
  /** サブボタンのサイズ */
  subButtonSize?: number
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { isMobile } = useWindow()

  // パターンに基づいてアイテムの座標を計算する
  const itemPositions = calculateItemPositions(items, pattern, spacing)

  // 外側クリックで閉じる
  useEffect(() => {
    if (!closeOnOutsideClick) return

    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current) return

      // 展開中 ＋ コンテナの外をクリックした場合
      if (open && !containerRef.current.contains(e.target as Node)) {
        onToggle(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, closeOnOutsideClick, onToggle])

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        zIndex: 3000,
        right: isMobile ? rightMobile : rightDesktop,
        bottom: isMobile ? bottomMobile : bottomDesktop,
      }}
    >
      <AnimatePresence>
        {open &&
          items.map((item, i) => {
            const position = itemPositions[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, x: position.x, y: position.y }}
                exit={{ opacity: 0, x: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ position: "absolute" }}
              >
                <ActionIcon
                  size="xl"
                  radius="xl"
                  variant="white"
                  color={item.color || subButtonColor}
                  onClick={item.onClick}
                  style={{
                    width: subButtonSize,
                    height: subButtonSize,
                    boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
                  }}
                >
                  {item.icon}
                </ActionIcon>
              </motion.div>
            )
          })}
      </AnimatePresence>

      {/* メインボタン */}
      <ActionIcon
        radius="xl"
        variant="filled"
        color={mainButtonColor}
        onClick={() => onToggle(!open)}
        style={{
          width: mainButtonSize,
          height: mainButtonSize,
          boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
        }}
      >
        {open ? <IconX style={{ width: "70%", height: "70%" }} /> : mainIcon}
      </ActionIcon>
    </div>
  )
}
