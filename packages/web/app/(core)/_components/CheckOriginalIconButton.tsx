"use client"

import { ActionIcon, Tooltip } from "@mantine/core"
import { IconLink } from "@tabler/icons-react"

/** 元のクエスト確認アイコンボタンを表示する */
export const CheckOriginalIconButton = ({
  onClick,
  loading = false,
  disabled = false,
  color = "blue.7",
  size = "lg",
  tooltip = "元の家族クエストを確認",
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
        <IconLink style={{ width: "70%", height: "70%" }} />
      </ActionIcon>
    </Tooltip>
  )
}
