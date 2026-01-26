"use client"

import { ActionIcon, Tooltip } from "@mantine/core"
import { IconEye } from "@tabler/icons-react"

/** 表示確認アイコンボタンを表示する */
export const ViewIconButton = ({
  onClick,
  loading = false,
  disabled = false,
  color = "cyan",
  size = "lg",
  tooltip = "表示確認",
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
        <IconEye style={{ width: "70%", height: "70%" }} />
      </ActionIcon>
    </Tooltip>
  )
}
