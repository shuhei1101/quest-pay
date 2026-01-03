"use client"

import { Button, Group, Menu } from "@mantine/core"
import { IconArrowLeft, IconEdit, IconChevronDown } from "@tabler/icons-react"

/** クエスト閲覧フッター（親向け） */
export const ParentQuestViewFooter = ({
  onEdit,
  onBack,
  availableLevels,
  selectedLevel,
  onLevelChange,
}: {
  onEdit?: () => void
  onBack?: () => void
  availableLevels?: number[]
  selectedLevel?: number
  onLevelChange?: (level: number) => void
}) => {
  return (
    <Group justify="center" mt="xl" gap="md">
      {/* レベル切り替えボタン */}
      {availableLevels && availableLevels.length > 1 && (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button 
              size="md" 
              radius="xl" 
              color="orange"
              variant="light"
              rightSection={<IconChevronDown size={18} />}
            >
              レベル {selectedLevel}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>レベルを選択</Menu.Label>
            {availableLevels.map((level) => (
              <Menu.Item
                key={level}
                onClick={() => onLevelChange?.(level)}
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
      )}
      {/* 編集するボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color="blue"
        leftSection={<IconEdit size={18} />}
        onClick={onEdit}
      >
        編集する
      </Button>
      {/* 戻るボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color="gray"
        variant="outline"
        leftSection={<IconArrowLeft size={18} />}
        onClick={onBack}
      >
        戻る
      </Button>
    </Group>
  )
}
