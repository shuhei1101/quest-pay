"use client"

import { ActionIcon, Tooltip } from "@mantine/core"
import { IconDeviceFloppy } from "@tabler/icons-react"
import { useTheme } from "@/app/(core)/_theme/useTheme"

/** 保存/更新アイコンボタンを表示する */
export const SaveIconButton = ({
  onClick,
  loading = false,
  disabled = false,
  color,
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
  /** テーマ情報 */
  const { colors: themeColors } = useTheme()

  /** クリックハンドラを取得する（submit時はonClickを無効化） */
  const handleClick = type === "submit" ? undefined : onClick

  return (
    <Tooltip label={tooltip}>
      <ActionIcon
        color={color || themeColors.buttonColors.primary}
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
