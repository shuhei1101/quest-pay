"use client"

import { ActionIcon, Tooltip } from "@mantine/core"
import { IconWorld } from "@tabler/icons-react"

/** 公開アイコンボタンを表示する */
export const PublishIconButton = ({
  onClick,
  loading = false,
  disabled = false,
  color = "green.7",
  size = "lg",
  tooltip = "オンラインに公開",
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
        <IconWorld style={{ width: "70%", height: "70%" }} />
      </ActionIcon>
    </Tooltip>
  )
}
