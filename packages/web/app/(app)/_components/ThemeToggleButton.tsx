"use client"

import { ActionIcon, Menu } from '@mantine/core'
import { IconPalette, IconCheck } from '@tabler/icons-react'
import { useTheme } from '@/app/(core)/_theme/useTheme'
import { themes, ThemeKey } from '@/app/(core)/_theme/themes'

/** テーマ切り替えボタンを取得する */
export const ThemeToggleButton = () => {
  const { themeKey, setTheme } = useTheme()

  return (
    <Menu shadow="md" width={200}>
      {/* テーマ切り替えボタン */}
      <Menu.Target>
        <ActionIcon variant="subtle" size="xl" aria-label="テーマ切り替え">
          <IconPalette style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Menu.Target>

      {/* テーマリスト */}
      <Menu.Dropdown>
        <Menu.Label>テーマを選択</Menu.Label>
        {(Object.keys(themes) as ThemeKey[]).map((key) => (
          <Menu.Item
            key={key}
            onClick={() => setTheme(key)}
            leftSection={
              themeKey === key ? (
                <IconCheck size={16} />
              ) : (
                <div style={{ width: 16 }} />
              )
            }
          >
            {themes[key].name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
