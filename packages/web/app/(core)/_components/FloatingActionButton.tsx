"use client"
import { useEffect, useRef, useState, useCallback, ReactNode } from "react"
import { ActionIcon, MantineColor } from "@mantine/core"
import { IconDots, IconChevronRight, IconChevronLeft } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { useWindow } from "../useConstants"
import { useTheme } from "../_theme/useTheme"
import { FABChildItem, FAB_SPACING } from "./FABChildItem"

/** FABの配置位置 */
export type FABPosition = "bottom-left" | "bottom-right" | "top-left" | "top-right"

/** 展開パターンの種類 */
export type ExpandPattern = "slide" | "radial-up" | "radial-down" | "radial-left" | "radial-right"

export type FloatingActionItem = {
  /** アイコン要素 */
  icon: ReactNode
  /** ラベル（最大4文字程度） */
  label?: string
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
  if (pattern === "radial-right") {
    // 右に展開する
    return items.map((_, index) => ({
      x: spacing * (index + 1),
      y: 0,
    }))
  }

  if (pattern === "radial-left") {
    // 左に展開する
    return items.map((_, index) => ({
      x: -spacing * (index + 1),
      y: 0,
    }))
  }

  if (pattern === "radial-up") {
    // 上に展開する
    return items.map((_, index) => ({
      x: 0,
      y: -spacing * (index + 1),
    }))
  }

  if (pattern === "radial-down") {
    // 下に展開する
    return items.map((_, index) => ({
      x: 0,
      y: spacing * (index + 1),
    }))
  }

  return []
}

/** 展開型フローティングアクションボタンを表示する */
export const FloatingActionButton = ({
  items,
  position,
  pattern,
  activeIndex,
  open: externalOpen,
  onToggle: externalOnToggle,
  spacing = 70,
  mainIcon = <IconDots size={24} />,
  disablePositioning = false,
  defaultOpen = true,
}: {
  /** 展開するアクションアイテムの配列 */
  items: FloatingActionItem[]
  /** FABの配置位置 */
  position: FABPosition
  /** 展開パターン（省略時はslide） */
  pattern?: ExpandPattern
  /** 現在選択されているアイテムのインデックス（slideパターンの場合のみ使用） */
  activeIndex?: number
  /** 開閉状態（外部制御する場合のみ指定） */
  open?: boolean
  /** 開閉状態を変更する関数（外部制御する場合のみ指定） */
  onToggle?: (open: boolean) => void
  /** アイテム間の間隔（radialパターンで使用） */
  spacing?: number
  /** メインボタンのアイコン */
  mainIcon?: ReactNode
  /** positioningを無効化するか（FloatingLayout内で使用する場合はtrueに設定） */
  disablePositioning?: boolean
  /** デフォルトで展開状態にするか */
  defaultOpen?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { isMobile } = useWindow()
  /** テーマ情報 */
  const { colors: themeColors } = useTheme()

  /** 実際の展開パターン（省略時はslide） */
  const actualPattern = pattern || "slide"

  /** slideパターンかどうか */
  const isSlidePattern = actualPattern === "slide"

  /** positionに基づいて画面上の配置位置を決定する */
  const positioning = {
    left: position === "bottom-left" || position === "top-left" ? (isMobile ? "20px" : "40px") : undefined,
    right: position === "bottom-right" || position === "top-right" ? (isMobile ? "20px" : "40px") : undefined,
    bottom: position === "bottom-left" || position === "bottom-right" ? (isMobile ? "20px" : "40px") : undefined,
    top: position === "top-left" || position === "top-right" ? (isMobile ? "20px" : "40px") : undefined,
  }

  /** slideパターン時の展開方向（左配置なら右へ、右配置なら左へ） */
  const slideDirection = position === "bottom-left" || position === "top-left" ? "right" : "left"

  /** 内部で管理する開閉状態 */
  const [internalOpen, setInternalOpen] = useState(defaultOpen)

  /** 外部制御かどうかを判定する */
  const isExternalControl = externalOpen !== undefined && externalOnToggle !== undefined

  /** 実際に使用する開閉状態 */
  const actualOpen = isExternalControl ? externalOpen : internalOpen

  /** 実際に使用する開閉切り替え関数 */
  const handleToggle = useCallback((newOpen: boolean) => {
    // アイテムが1つの場合は直接アクションを実行
    if (items.length === 1) {
      items[0].onClick()
      return
    }
    
    if (isExternalControl) {
      externalOnToggle(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }, [isExternalControl, externalOnToggle, items])

  /** 子アイテムをクリックする（slideパターンの場合は自動でクローズ） */
  const handleItemClick = useCallback((item: FloatingActionItem) => {
    item.onClick()
    if (isSlidePattern) {
      handleToggle(false)
    }
  }, [isSlidePattern, handleToggle])

  // パターンに基づいてアイテムの座標を計算する（radialパターンの場合のみ使用）
  const itemPositions = calculateItemPositions(items, actualPattern, spacing)

  /** 左配置かどうか */
  const isLeftPositioned = positioning.left !== undefined

  /** 表示するメインアイコンを取得する */
  const displayMainIcon = (() => {
    if (items.length === 1) return items[0].icon
    if (actualOpen && items.length > 1) {
      // 開いているときは、左配置なら<、右配置なら>
      return isLeftPositioned ? <IconChevronLeft size={24} /> : <IconChevronRight size={24} />
    }
    if (isSlidePattern) {
      // 閉じているときは、左配置なら>、右配置なら<（開く方向を示す）
      return isLeftPositioned ? <IconChevronRight size={24} /> : <IconChevronLeft size={24} />
    }
    return mainIcon
  })()

  return (
    <div
      ref={containerRef}
      style={disablePositioning ? {
        position: "relative",
        zIndex: 3000,
      } : {
        position: "fixed",
        zIndex: 3000,
        left: positioning.left,
        right: positioning.right,
        bottom: positioning.bottom,
        top: positioning.top,
      }}
    >
      {isSlidePattern ? (
        /* slideパターン: NavigationFAB風のレンダリング */
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: FAB_SPACING.mainToItemsGap,
            }}
          >
            {/* 左横展開の場合: 子アイテム → メインボタン */}
            {slideDirection === "left" && (
              <AnimatePresence>
                {actualOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: FAB_SPACING.itemsGap,
                      padding: `0 ${FAB_SPACING.itemsContainerPadding}px`,
                      height: FAB_SPACING.mainButtonSize,
                    }}
                  >
                    {[...items].reverse().map((item, index) => {
                      const originalIndex = items.length - 1 - index
                      return (
                        <FABChildItem
                          key={originalIndex}
                          icon={item.icon}
                          label={item.label}
                          onClick={() => handleItemClick(item)}
                          color={item.color || themeColors.buttonColors.primary}
                          variant={themeColors.fab.variant}
                          opacity={activeIndex !== undefined && originalIndex === activeIndex ? themeColors.fab.opacity.active : themeColors.fab.opacity.inactive}
                          border={activeIndex !== undefined && originalIndex === activeIndex 
                            ? `${themeColors.fab.border.activeWidth} solid ${themeColors.borderColors.focus}` 
                            : `${themeColors.fab.border.inactiveWidth} solid transparent`}
                        />
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* メインボタン */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: FAB_SPACING.mainButtonSize,
              }}
            >
              <ActionIcon
                radius="xl"
                variant={themeColors.fab.variant}
                color={themeColors.buttonColors.primary}
                onClick={() => handleToggle(!actualOpen)}
                style={{
                  width: FAB_SPACING.mainButtonSize,
                  height: FAB_SPACING.mainButtonSize,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
                  border: `${themeColors.fab.border.activeWidth} solid ${themeColors.borderColors.focus}`,
                  boxSizing: "border-box",
                }}
              >
                {displayMainIcon}
              </ActionIcon>
            </div>

            {/* 右横展開の場合: メインボタン → 子アイテム */}
            {slideDirection === "right" && (
              <AnimatePresence>
                {actualOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: FAB_SPACING.itemsGap,
                      padding: `0 ${FAB_SPACING.itemsContainerPadding}px`,
                      height: FAB_SPACING.mainButtonSize,
                    }}
                  >
                    {items.map((item, index) => (
                      <FABChildItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        onClick={() => handleItemClick(item)}
                        color={item.color || themeColors.buttonColors.primary}
                        variant={themeColors.fab.variant}
                        opacity={activeIndex !== undefined && index === activeIndex ? themeColors.fab.opacity.active : themeColors.fab.opacity.inactive}
                        border={activeIndex !== undefined && index === activeIndex 
                          ? `${themeColors.fab.border.activeWidth} solid ${themeColors.borderColors.focus}` 
                          : `${themeColors.fab.border.inactiveWidth} solid transparent`}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </>
      ) : (
        /* 通常パターン: 既存のabsolute配置レンダリング */
        <>
          <AnimatePresence>
            {actualOpen && items.length > 1 &&
              items.map((item, i) => {
                const position = itemPositions[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, x: position.x, y: position.y }}
                    exit={{ opacity: 0, x: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ 
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  >
                    <FABChildItem
                      icon={item.icon}
                      label={item.label}
                      onClick={item.onClick}
                      color={item.color || themeColors.buttonColors.primary}
                      variant={themeColors.fab.variant}
                      boxShadow="0 6px 16px rgba(0,0,0,0.18)"
                    />
                  </motion.div>
                )
              })}
          </AnimatePresence>

          {/* メインボタン */}
          <ActionIcon
            radius="xl"
            variant={themeColors.fab.variant}
            color={items.length === 1 && items[0].color 
              ? items[0].color 
              : themeColors.buttonColors.primary}
            onClick={() => handleToggle(!actualOpen)}
            style={{
              width: FAB_SPACING.mainButtonSize,
              height: FAB_SPACING.mainButtonSize,
              boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
              border: actualOpen && items.length > 1
                ? `${themeColors.fab.border.activeWidth} solid #228be6` 
                : `${themeColors.fab.border.activeWidth} solid ${themeColors.borderColors.focus}`,
              boxSizing: "border-box",
            }}
          >
            {displayMainIcon}
          </ActionIcon>
        </>
      )}
    </div>
  )
}
