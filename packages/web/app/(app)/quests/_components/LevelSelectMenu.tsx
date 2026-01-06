"use client"

import { Button, Menu } from "@mantine/core"
import { IconChevronDown } from "@tabler/icons-react"

/** レベル切り替えメニュー */
export const LevelSelectMenu = ({
  availableLevels,
  selectedLevel,
  onLevelChange,
  size = "md",
  color = "orange",
  variant = "light",
}: {
  availableLevels: number[]
  selectedLevel: number
  onLevelChange: (level: number) => void
  size?: string
  color?: string
  variant?: string
}) => {
  // レベルが1つ以下の場合は非表示
  if (!availableLevels || availableLevels.length <= 1) {
    return null
  }

  return (
    <Menu shadow="md" width={200}>
      {/* メニュートリガーボタン */}
      <Menu.Target>
        <Button 
          size={size}
          radius="xl" 
          color={color}
          variant={variant}
          rightSection={<IconChevronDown size={18} />}
        >
          レベル {selectedLevel}
        </Button>
      </Menu.Target>
      {/* レベル選択メニュー */}
      <Menu.Dropdown>
        <Menu.Label>レベルを選択</Menu.Label>
        {availableLevels.map((level) => (
          <Menu.Item
            key={level}
            onClick={() => onLevelChange(level)}
            style={{
              backgroundColor: level === selectedLevel ? "rgba(255, 159, 0, 0.1)" : undefined,
              fontWeight: level === selectedLevel ? "bold" : undefined,
            }}
          >
            レベル {level}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
