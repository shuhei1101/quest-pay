"use client"

import { ActionIcon, Tooltip } from "@mantine/core"
import { IconWorld } from "@tabler/icons-react"
import { useTheme } from "@/app/(core)/_theme/useTheme"

/** 公開アイコンボタンを表示する */
export const PublishIconButton = ({
  onClick,
  loading = false,
  disabled = false,
  color,
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
  /** テーマ情報 */
  const { colors: themeColors } = useTheme()

  return (
    <Tooltip label={tooltip}>
      <ActionIcon
        color={color || themeColors.buttonColors.success}
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
