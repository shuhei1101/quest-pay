"use client"
import { useEffect, useRef, useState, useCallback, ReactNode } from "react"
import { ActionIcon, MantineColor } from "@mantine/core"
import { IconPlus, IconX } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { useWindow } from "../useConstants"

export type FloatingActionItem = {
  /** アイコン要素 */
  icon: ReactNode
  /** X軸の移動距離 */
  x: number
  /** Y軸の移動距離 */
  y: number
  /** クリック時のコールバック */
  onClick: () => void
  /** 個別の色設定(オプション) */
  color?: MantineColor
}

/** 展開型フローティングアクションボタンを表示する */
export const FloatingActionButton = ({
  items,
  open: externalOpen,
  onToggle: externalOnToggle,
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
  /** 開閉状態（外部制御する場合のみ指定） */
  open?: boolean
  /** 開閉状態を変更する関数（外部制御する場合のみ指定） */
  onToggle?: (open: boolean) => void
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

  /** 内部で管理する開閉状態 */
  const [internalOpen, setInternalOpen] = useState(false)

  /** 外部制御かどうかを判定する */
  const isExternalControl = externalOpen !== undefined && externalOnToggle !== undefined

  /** 実際に使用する開閉状態 */
  const open = isExternalControl ? externalOpen : internalOpen

  /** 実際に使用する開閉切り替え関数 */
  const handleToggle = useCallback((newOpen: boolean) => {
    if (isExternalControl) {
      externalOnToggle(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }, [isExternalControl, externalOnToggle])

  // 外側クリックで閉じる
  useEffect(() => {
    if (!closeOnOutsideClick) return

    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current) return

      // 展開中 ＋ コンテナの外をクリックした場合
      if (open && !containerRef.current.contains(e.target as Node)) {
        handleToggle(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, closeOnOutsideClick, handleToggle])

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
          items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x: item.x, y: item.y }}
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
          ))}
      </AnimatePresence>

      {/* メインボタン */}
      <ActionIcon
        radius="xl"
        variant="filled"
        color={mainButtonColor}
        onClick={() => handleToggle(!open)}
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
