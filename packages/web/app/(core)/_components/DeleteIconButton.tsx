"use client"

import { ActionIcon, Tooltip } from "@mantine/core"
import { IconTrash } from "@tabler/icons-react"
import { useTheme } from "@/app/(core)/_theme/useTheme"

/** 削除アイコンボタンを表示する */
export const DeleteIconButton = ({
  onClick,
  loading = false,
  disabled = false,
  color,
  size = "lg",
  tooltip = "削除",
}: {
  /** クリック時のハンドラ */
  onClick?: () => void
  /** ローディング状態 */
  loading?: boolean
  /** 無効状態 */
  disabled?: boolean
  /** ボタンの色 */
  color?: string
  /** ボタンのサイズ */
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  /** ツールチップテキスト */
  tooltip?: string
}) => {
  /** テーマ情報 */
  const { colors: themeColors } = useTheme()

  return (
    <Tooltip label={tooltip}>
      <ActionIcon
        color={color || themeColors.buttonColors.danger}
        size={size}
        loading={loading}
        disabled={disabled}
        onClick={onClick}
        variant="filled"
      >
        <IconTrash style={{ width: "70%", height: "70%" }} />
      </ActionIcon>
    </Tooltip>
  )
}
