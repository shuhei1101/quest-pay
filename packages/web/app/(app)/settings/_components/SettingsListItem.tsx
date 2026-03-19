"use client"

import { Box, Group, Text, Switch, UnstyledButton } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons-react"
import { ReactNode } from "react"

/** 設定リストアイテムのタイプ */
type SettingsListItemType = "button" | "switch" | "value"

/** 設定リストアイテムProps */
type SettingsListItemProps = {
  /** タイプ */
  type?: SettingsListItemType
  /** ラベル */
  label: string
  /** 説明 */
  description?: string
  /** 値（type="value"の場合） */
  value?: string
  /** アイコン */
  icon?: ReactNode
  /** スイッチの状態（type="switch"の場合） */
  checked?: boolean
  /** スイッチ変更時のハンドラ */
  onSwitchChange?: (checked: boolean) => void
  /** クリック時のハンドラ（type="button"の場合） */
  onClick?: () => void
  /** 危険な操作かどうか */
  danger?: boolean
}

/** iPhone風設定リストアイテムコンポーネント */
export const SettingsListItem = ({
  type = "button",
  label,
  description,
  value,
  icon,
  checked,
  onSwitchChange,
  onClick,
  danger = false,
}: SettingsListItemProps) => {
  const content = (
    <Group
      justify="space-between"
      wrap="nowrap"
      style={{
        padding: "12px 16px",
        backgroundColor: "var(--mantine-color-body)",
        borderBottom: "1px solid var(--mantine-color-gray-2)",
      }}
    >
      <Group gap="md" style={{ flex: 1, minWidth: 0 }}>
        {icon && <Box style={{ flexShrink: 0 }}>{icon}</Box>}
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text
            size="sm"
            fw={500}
            c={danger ? "red" : undefined}
            style={{ wordBreak: "break-word" }}
          >
            {label}
          </Text>
          {description && (
            <Text size="xs" c="dimmed" mt={2} style={{ wordBreak: "break-word" }}>
              {description}
            </Text>
          )}
        </Box>
      </Group>

      {type === "switch" && (
        <Switch
          checked={checked}
          onChange={(e) => onSwitchChange?.(e.currentTarget.checked)}
          style={{ flexShrink: 0 }}
        />
      )}

      {type === "value" && value && (
        <Group gap={4} style={{ flexShrink: 0 }}>
          <Text size="sm" c="dimmed">
            {value}
          </Text>
          <IconChevronRight size={16} color="var(--mantine-color-gray-5)" />
        </Group>
      )}

      {type === "button" && (
        <IconChevronRight size={16} color="var(--mantine-color-gray-5)" style={{ flexShrink: 0 }} />
      )}
    </Group>
  )

  if (type === "switch") {
    return content
  }

  return (
    <UnstyledButton onClick={onClick} style={{ width: "100%", display: "block" }}>
      {content}
    </UnstyledButton>
  )
}

/** 設定セクションProps */
type SettingsSectionProps = {
  /** タイトル */
  title?: string
  /** 子要素 */
  children: ReactNode
  /** フッター説明 */
  footer?: string
}

/** iPhone風設定セクションコンポーネント */
export const SettingsSection = ({ title, children, footer }: SettingsSectionProps) => {
  return (
    <Box mb="xl">
      {title && (
        <Text size="xs" tt="uppercase" fw={600} c="dimmed" mb="xs" px="md">
          {title}
        </Text>
      )}
      <Box
        style={{
          backgroundColor: "var(--mantine-color-body)",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid var(--mantine-color-gray-2)",
        }}
      >
        {children}
      </Box>
      {footer && (
        <Text size="xs" c="dimmed" mt="xs" px="md">
          {footer}
        </Text>
      )}
    </Box>
  )
}
