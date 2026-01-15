"use client"

import { Button, Group } from "@mantine/core"
import { IconArrowLeft, IconEdit } from "@tabler/icons-react"
import { LevelSelectMenu } from "../../../../_components/LevelSelectMenu"
import { useTheme } from "@/app/(core)/_theme/useTheme"

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
  const { theme } = useTheme()
  
  return (
    <Group justify="center" mt="xl" gap="md">
      {/* レベル切り替えボタン */}
      <LevelSelectMenu 
        availableLevels={availableLevels || []}
        selectedLevel={selectedLevel || 1}
        onLevelChange={onLevelChange || (() => {})}
      />
      {/* 編集するボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color={theme.buttonColors.primary}
        leftSection={<IconEdit size={18} />}
        onClick={onEdit}
      >
        編集する
      </Button>
      {/* 戻るボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color={theme.buttonColors.default}
        variant="outline"
        leftSection={<IconArrowLeft size={18} />}
        onClick={onBack}
      >
        戻る
      </Button>
    </Group>
  )
}
