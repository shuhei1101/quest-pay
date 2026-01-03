import { ActionIcon, Menu, Tooltip } from "@mantine/core"
import { IconCopy } from "@tabler/icons-react"
import { useState } from "react"

/** レベル詳細をコピーするボタン */
export const LevelCopyButton = ({
  currentLevel,
  visibleLevels,
  onCopy
}: {
  currentLevel: string | null
  visibleLevels: number[]
  onCopy: (fromLevel: number) => void
}) => {
  const [copied, setCopied] = useState(false)

  if (!currentLevel) return null

  const currentLevelNum = parseInt(currentLevel)
  const otherLevels = visibleLevels.filter(level => level !== currentLevelNum)

  if (otherLevels.length === 0) return null

  const handleCopy = (level: number) => {
    onCopy(level)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Menu position="bottom-end" shadow="md" width={200}>
      <Menu.Target>
        <Tooltip label="コピーしました" withArrow position="bottom" opened={copied}>
          <ActionIcon 
            variant="default" 
            size="lg"
            title="他のレベルから詳細をコピー"
          >
            <IconCopy size={18} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>コピー元のレベルを選択</Menu.Label>
        {otherLevels.length === 0 ? (
          <Menu.Item disabled>
            コピー元のレベルがありません
          </Menu.Item>
        ) : (
          otherLevels.map((level) => (
            <Menu.Item 
              key={level}
              onClick={() => handleCopy(level)}
            >
              レベル {level} からコピー
            </Menu.Item>
          ))
        )}
      </Menu.Dropdown>
    </Menu>
  )
}
