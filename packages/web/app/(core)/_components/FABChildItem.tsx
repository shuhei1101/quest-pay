"use client"
import { ReactNode, CSSProperties } from "react"
import { ActionIcon, MantineColor } from "@mantine/core"

/** FABのスペーシング定数 */
export const FAB_SPACING = {
  /** アイコンとラベルの間のギャップ */
  iconLabelGap: 2,
  /** 子アイテム間のギャップ */
  itemsGap: 12,
  /** メインボタンと子アイテムコンテナの間のギャップ */
  mainToItemsGap: 8,
  /** 子アイテムコンテナの左右パディング */
  itemsContainerPadding: 16,
  /** メインボタンのサイズ */
  mainButtonSize: 60,
  /** サブボタンのサイズ */
  subButtonSize: 48,
} as const

/** FABの子アイテム（アイコン+ラベル）を表示する */
export const FABChildItem = ({
  icon,
  label,
  onClick,
  color,
  variant,
  opacity,
  border,
  boxShadow,
  cursor = "pointer",
  additionalStyle,
}: {
  /** アイコン要素 */
  icon: ReactNode
  /** ラベル（最大4文字程度） */
  label?: string
  /** クリック時のコールバック */
  onClick: () => void
  /** ボタンの色 */
  color: MantineColor
  /** ボタンのバリアント */
  variant: string
  /** 透明度 */
  opacity?: number
  /** ボーダー */
  border?: string
  /** ボックスシャドウ */
  boxShadow?: string
  /** カーソル */
  cursor?: string
  /** 追加のスタイル */
  additionalStyle?: CSSProperties
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: FAB_SPACING.iconLabelGap,
        ...additionalStyle,
      }}
    >
      <ActionIcon
        size="xl"
        radius="xl"
        variant={variant}
        color={color}
        onClick={onClick}
        style={{
          width: FAB_SPACING.subButtonSize,
          height: FAB_SPACING.subButtonSize,
          marginTop: (FAB_SPACING.mainButtonSize - FAB_SPACING.subButtonSize) / 2,
          cursor,
          opacity,
          border,
          boxShadow,
          boxSizing: "border-box",
        }}
      >
        {icon}
      </ActionIcon>
      {label && (
        <span
          style={{
            fontSize: "10px",
            fontWeight: "bold",
            color: "white",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
