"use client"

import { Button } from "@mantine/core"
import { IconArrowLeft, IconEdit } from "@tabler/icons-react"
import { LevelSelectMenu } from "../../../../_components/LevelSelectMenu"
import { HorizontalScrollButtons } from "@/app/(core)/_components/HorizontalScrollButtons"

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
    <HorizontalScrollButtons justify="center" mt="xl" gap="md">
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
    </HorizontalScrollButtons>
  )
}
