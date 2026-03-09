"use client"
import { useEffect, useRef, useState, useCallback, ReactNode } from "react"
import { ActionIcon, MantineColor } from "@mantine/core"
import { IconDots, IconChevronRight, IconChevronLeft, IconChevronUp, IconChevronDown, IconApps, IconMenu, IconArrowLeft } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../_theme/useTheme"
import { FABChildItem, FAB_SPACING } from "./FABChildItem"
import { useRouter } from "next/navigation"
import { useWindow } from "../useConstants"

/** 展開パターンの種類 */
export type ExpandPattern = "slide" | "radial-up" | "radial-down" | "radial-left" | "radial-right" | "hybrid-left"

/** スライド方向 */
export type SlideDirection = "left" | "right"

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
  pattern,
  slideDirection = "right",
  activeIndex,
  open: externalOpen,
  onToggle: externalOnToggle,
  spacing = 70,
  mainIcon = <IconMenu size={24} />,
  defaultOpen = false,
  showBackButton = true,
}: {
  /** 展開するアクションアイテムの配列 */
  items: FloatingActionItem[]
  /** 展開パターン（省略時はslide） */
  pattern?: ExpandPattern
  /** スライド方向（slideパターン時のみ使用、デフォルトright） */
  slideDirection?: SlideDirection
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
  /** デフォルトで展開状態にするか */
  defaultOpen?: boolean
  /** 戻るボタンを表示するか（デフォルトtrue） */
  showBackButton?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  /** テーマ情報 */
  const { colors: themeColors } = useTheme()
  /** デバイス判定 */
  const { isMobile } = useWindow()

  /** 戻るボタンを含めた最終的なアイテム配列を作成する */
  const finalItems = (() => {
    // 戻るボタンを表示しない、またはアイテムが1つの場合はそのまま返す
    if (!showBackButton || items.length === 1) {
      return items
    }
    
    // 戻るボタンを作成
    const backButton: FloatingActionItem = {
      icon: <IconArrowLeft size={20} />,
      label: "戻る",
      onClick: () => router.back(),
      color: "gray",
    }
    
    // モバイル・PC共に最初に追加（モバイルは上方向、PCは左方向の左端）
    return [backButton, ...items]
  })()

  /** 実際の展開パターン（省略時はslide） */
  const actualPattern = pattern || "slide"

  /** slideパターンかどうか */
  const isSlidePattern = actualPattern === "slide"

  /** hybrid-leftパターンかどうか */
  const isHybridLeftPattern = actualPattern === "hybrid-left"

  /** 内部で管理する開閉状態 */
  const [internalOpen, setInternalOpen] = useState(defaultOpen)

  /** 外部制御かどうかを判定する */
  const isExternalControl = externalOpen !== undefined && externalOnToggle !== undefined

  /** 実際に使用する開閉状態 */
  const actualOpen = isExternalControl ? externalOpen : internalOpen

  /** 実際に使用する開閉切り替え関数 */
  const handleToggle = useCallback((newOpen: boolean) => {
    // アイテムが1つの場合は直接アクションを実行
    if (finalItems.length === 1) {
      finalItems[0].onClick()
      return
    }
    
    if (isExternalControl) {
      externalOnToggle(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }, [isExternalControl, externalOnToggle, finalItems])

  /** 子アイテムをクリックする（slideパターンまたはhybrid-leftパターンの場合は自動でクローズ） */
  const handleItemClick = useCallback((item: FloatingActionItem) => {
    item.onClick()
    if (isSlidePattern || isHybridLeftPattern) {
      handleToggle(false)
    }
  }, [isSlidePattern, isHybridLeftPattern, handleToggle])

  // パターンに基づいてアイテムの座標を計算する（radialパターンの場合のみ使用）
  const itemPositions = calculateItemPositions(finalItems, actualPattern, spacing)

  /** 表示するメインアイコンを取得する */
  const displayMainIcon = (() => {
    if (finalItems.length === 1) return finalItems[0].icon
    if (actualOpen && finalItems.length > 1 && isSlidePattern) {
      // slideパターンで開いているときは、閉じる方向を示す
      return slideDirection === "right" ? <IconChevronLeft size={24} /> : <IconChevronRight size={24} />
    }
    if (actualOpen && finalItems.length > 1 && isHybridLeftPattern) {
      // hybrid-leftパターンで開いているときは、閉じるアイコンを示す
      return <IconChevronRight size={24} />
    }
    return mainIcon
  })()

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      {isHybridLeftPattern ? (
        /* hybrid-leftパターン: モバイルは最初のアイテムを上、PCはすべて左にスライド */
        <>
          {/* 左にスライド配置するアイテム */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: FAB_SPACING.mainToItemsGap,
            }}
          >
            <AnimatePresence>
              {actualOpen && finalItems.length > 1 && (
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
                  {/* モバイルの場合：2番目以降を左に配置、PCの場合：すべてを左に配置 */}
                  {(() => {
                    const itemsToDisplay = isMobile ? finalItems.slice(1) : finalItems
                    // PCの場合：戻るボタン(最初の要素)を先頭に、残りを逆順で配置
                    const orderedItems = isMobile 
                      ? [...itemsToDisplay].reverse()
                      : [itemsToDisplay[0], ...[...itemsToDisplay.slice(1)].reverse()]
                    
                    return orderedItems.map((item, index) => (
                      <FABChildItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        onClick={() => handleItemClick(item)}
                        color={item.color || themeColors.buttonColors.primary}
                        variant={themeColors.fab.variant}
                        opacity={themeColors.fab.opacity.inactive}
                        border={`${themeColors.fab.border.inactiveWidth} solid transparent`}
                      />
                    ))
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* メインボタン */}
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: FAB_SPACING.mainButtonSize,
                height: FAB_SPACING.mainButtonSize,
              }}
            >
              {/* モバイルの場合のみ、最初のアイテム(戻るボタン)を上に配置 */}
              <AnimatePresence>
                {actualOpen && isMobile && finalItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                      position: "absolute",
                      bottom: `calc(100% + ${FAB_SPACING.mainToItemsGap}px)`,
                    }}
                  >
                    <FABChildItem
                      icon={finalItems[0].icon}
                      label={finalItems[0].label}
                      onClick={() => handleItemClick(finalItems[0])}
                      color={finalItems[0].color || themeColors.buttonColors.primary}
                      variant={themeColors.fab.variant}
                      opacity={themeColors.fab.opacity.inactive}
                      border={`${themeColors.fab.border.inactiveWidth} solid transparent`}
                      boxShadow="0 6px 16px rgba(0,0,0,0.18)"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

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
                  opacity: 1,
                  backdropFilter: "blur(1px)",
                  WebkitBackdropFilter: "blur(1px)",
                }}
              >
                {displayMainIcon}
              </ActionIcon>
            </div>
          </div>
        </>
      ) : isSlidePattern ? (
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
                    {[...finalItems].reverse().map((item, index) => {
                      const originalIndex = finalItems.length - 1 - index
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
                  opacity: 1,
                  backdropFilter: "blur(1px)",
                  WebkitBackdropFilter: "blur(1px)",
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
                    {finalItems.map((item, index) => (
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
            {actualOpen && finalItems.length > 1 &&
              finalItems.map((item, i) => {
                const position = itemPositions[i]
                
                // パターンに応じた基準位置を設定
                const basePosition = (() => {
                  if (actualPattern === "radial-up" || actualPattern === "radial-down") {
                    return { top: 0, left: "50%" }
                  }
                  if (actualPattern === "radial-left" || actualPattern === "radial-right") {
                    return { top: "50%", left: 0 }
                  }
                  return { top: 0, left: 0 }
                })()
                
                // パターンに応じた中央配置用のスタイル
                const centeringStyle = (() => {
                  if (actualPattern === "radial-up" || actualPattern === "radial-down") {
                    return { transform: "translateX(-50%)" }
                  }
                  if (actualPattern === "radial-left" || actualPattern === "radial-right") {
                    return { transform: "translateY(-50%)" }
                  }
                  return {}
                })()
                
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, x: position.x, y: position.y }}
                    exit={{ opacity: 0, x: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ 
                      position: "absolute",
                      ...basePosition,
                    }}
                  >
                    <FABChildItem
                      icon={item.icon}
                      label={item.label}
                      onClick={item.onClick}
                      color={item.color || themeColors.buttonColors.primary}
                      variant={themeColors.fab.variant}
                      boxShadow="0 6px 16px rgba(0,0,0,0.18)"
                      additionalStyle={centeringStyle}
                    />
                  </motion.div>
                )
              })}
          </AnimatePresence>

          {/* メインボタン */}
          <ActionIcon
            radius="xl"
            variant={themeColors.fab.variant}
            color={finalItems.length === 1 && finalItems[0].color 
              ? finalItems[0].color 
              : themeColors.buttonColors.primary}
            onClick={() => handleToggle(!actualOpen)}
            style={{
              width: FAB_SPACING.mainButtonSize,
              height: FAB_SPACING.mainButtonSize,
              boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
              border: actualOpen && finalItems.length > 1
                ? `${themeColors.fab.border.activeWidth} solid #228be6` 
                : `${themeColors.fab.border.activeWidth} solid ${themeColors.borderColors.focus}`,
              boxSizing: "border-box",
              opacity: 1,
              backdropFilter: "blur(1px)",
              WebkitBackdropFilter: "blur(1px)",
            }}
          >
            {displayMainIcon}
          </ActionIcon>
        </>
      )}
    </div>
  )
}
