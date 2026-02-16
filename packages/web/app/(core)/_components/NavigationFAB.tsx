"use client"
import { useState, useEffect, ReactNode } from "react"
import { ActionIcon, MantineColor } from "@mantine/core"
import { IconPlus, IconX } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { useWindow } from "../useConstants"
import { useTheme } from "../_theme/useTheme"

export type NavigationItem = {
  /** アイコン要素 */
  icon: ReactNode
  /** ラベル */
  label: string
  /** クリック時のコールバック */
  onClick: () => void
  /** 個別の色設定(オプション) */
  color?: MantineColor
}

/** GitHub mobile風ナビゲーションFABを表示する */
export const NavigationFAB = ({
  items,
  activeIndex = 0,
  mainButtonColor = "blue",
  subButtonColor = "blue",
  bottomMobile = "20px",
  bottomDesktop = "40px",
  mainButtonSize = 60,
  subButtonSize = 50,
}: {
  /** ナビゲーションアイテムの配列 */
  items: NavigationItem[]
  /** 現在選択されているアイテムのインデックス */
  activeIndex?: number
  /** メインボタンの色 */
  mainButtonColor?: MantineColor
  /** サブボタンの色 */
  subButtonColor?: MantineColor
  /** 下からの距離(モバイル時) */
  bottomMobile?: string
  /** 下からの距離(デスクトップ時) */
  bottomDesktop?: string
  /** メインボタンのサイズ */
  mainButtonSize?: number
  /** サブボタンのサイズ */
  subButtonSize?: number
}) => {
  const { isMobile } = useWindow()
  /** テーマ情報 */
  const { colors: themeColors } = useTheme()

  /** 開閉状態 */
  const [isOpen, setIsOpen] = useState(false)

  /** 現在選択されているアイテム */
  const activeItem = items[activeIndex] || items[0]

  /** メニューを開閉する */
  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  /** メニューアイテムをクリックする */
  const handleItemClick = (item: NavigationItem) => {
    item.onClick()
    setIsOpen(false)
  }

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: isMobile ? bottomMobile : bottomDesktop,
        zIndex: 3000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 12,
              padding: "12px 16px",
              backgroundColor: "var(--mantine-color-body)",
              borderRadius: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
              border: "1px solid var(--mantine-color-gray-3)",
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                  opacity: index === activeIndex ? 1 : 0.6,
                }}
                onClick={() => handleItemClick(item)}
              >
                <ActionIcon
                  size="lg"
                  radius="xl"
                  variant={index === activeIndex ? "filled" : "light"}
                  color={item.color || subButtonColor || themeColors.buttonColors.primary}
                  style={{
                    width: subButtonSize,
                    height: subButtonSize,
                  }}
                >
                  {item.icon}
                </ActionIcon>
                <span style={{ fontSize: "11px", fontWeight: 500 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* メインボタン（現在選択中のタブを表示） */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <ActionIcon
          radius="xl"
          variant="filled"
          color={mainButtonColor || themeColors.buttonColors.primary}
          onClick={handleToggle}
          style={{
            width: mainButtonSize,
            height: mainButtonSize,
            boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
          }}
        >
          {isOpen ? (
            <IconX style={{ width: "70%", height: "70%" }} />
          ) : (
            activeItem.icon
          )}
        </ActionIcon>
        {!isOpen && (
          <span style={{ fontSize: "12px", fontWeight: 600 }}>
            {activeItem.label}
          </span>
        )}
      </div>
    </div>
  )
}
