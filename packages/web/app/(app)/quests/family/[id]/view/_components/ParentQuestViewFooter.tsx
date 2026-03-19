"use client"

import { Button, Group } from "@mantine/core"
import { IconArrowLeft } from "@tabler/icons-react"
import { LevelSelectMenu } from "../../../../_components/LevelSelectMenu"

/** クエスト閲覧フッター（親向け） */
export const ParentQuestViewFooter = ({
  onBack,
  availableLevels,
  selectedLevel,
  onLevelChange,
}: {
  onBack?: () => void
  availableLevels?: number[]
  selectedLevel?: number
  onLevelChange?: (level: number) => void
}) => {
  return (
    <Group justify="center" mt="xl" gap="md">
      {/* レベル切り替えボタン */}
      <LevelSelectMenu 
        availableLevels={availableLevels || []}
        selectedLevel={selectedLevel || 1}
        onLevelChange={onLevelChange || (() => {})}
      />
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
