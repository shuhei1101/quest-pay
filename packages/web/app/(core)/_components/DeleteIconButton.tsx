"use client"

import { ActionIcon, Tooltip } from "@mantine/core"
import { IconTrash } from "@tabler/icons-react"

/** 削除アイコンボタンを表示する */
export const DeleteIconButton = ({
  onClick,
  loading = false,
  disabled = false,
  color = "red.7",
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
  return (
    <Tooltip label={tooltip}>
      <ActionIcon
        color={color}
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
