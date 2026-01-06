import { ActionIcon, Avatar, Button, Group, Indicator, Tooltip } from "@mantine/core"
import { IconArrowLeft, IconHeart, IconHeartFilled, IconMessage } from "@tabler/icons-react"
import { LevelSelectMenu } from "../../../../_components/LevelSelectMenu"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"

/** クエスト閲覧フッター（テンプレート向け） */
export const TemplateQuestViewFooter = ({
  familyIcon,
  onLikeToggle,
  onFamilyClick,
  availableLevels,
  selectedLevel,
  onLevelChange,
  onBack,
  onDelete,
}: {
  familyIcon?: string
  onLikeToggle?: () => void
  onFamilyClick?: () => void
  availableLevels?: number[]
  selectedLevel?: number
  onLevelChange?: (level: number) => void
  onBack?: () => void
  onDelete?: () => void
}) => {
  return (
    <Group justify="center" mt="xl" gap="xl">
      {/* レベル切り替えボタン */}
      <LevelSelectMenu 
        availableLevels={availableLevels || []}
        selectedLevel={selectedLevel || 1}
        onLevelChange={onLevelChange || (() => {})}
      />
      {/* 作成者家族アイコン */}
      <ActionIcon 
        variant="light" 
        color="gray"
        size={56} 
        radius="xl"
        onClick={onLikeToggle}
      >
        <RenderIcon 
          iconName={familyIcon} 
          onClick={onFamilyClick} 
        />
      </ActionIcon>

      {/* 削除ボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color="gray"
        variant="outline"
        leftSection={<IconArrowLeft size={18} />}
        onClick={onDelete}
      >
        削除
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
