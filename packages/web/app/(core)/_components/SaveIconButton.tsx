"use client"

import { ActionIcon, Tooltip } from "@mantine/core"
import { IconDeviceFloppy } from "@tabler/icons-react"

/** 保存/更新アイコンボタンを表示する */
export const SaveIconButton = ({
  onClick,
  loading = false,
  disabled = false,
  color = "blue",
  size = "lg",
  tooltip = "保存",
  type = "button",
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
  /** ボタンのタイプ */
  type?: "button" | "submit"
}) => {
  /** クリックハンドラを取得する（submit時はonClickを無効化） */
  const handleClick = type === "submit" ? undefined : onClick

  return (
    <Tooltip label={tooltip}>
      <ActionIcon
        color={color}
        size={size}
        loading={loading}
        disabled={disabled}
        onClick={handleClick}
        type={type}
        variant="filled"
      >
        <IconDeviceFloppy style={{ width: "70%", height: "70%" }} />
      </ActionIcon>
    </Tooltip>
  )
}
