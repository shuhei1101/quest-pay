import { ActionIcon, Avatar, Button, Indicator, Tooltip } from "@mantine/core"
import { IconArrowLeft, IconFilePencil, IconFileSearch, IconHeart, IconHeartFilled, IconMessage, IconSearch, IconTrash } from "@tabler/icons-react"
import { LevelSelectMenu } from "../../../../_components/LevelSelectMenu"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { HorizontalScrollButtons } from "@/app/(core)/_components/HorizontalScrollButtons"

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
  onCreateFromTemplate,
  onCheckSource,
  hasSourceQuest
}: {
  familyIcon?: string
  onLikeToggle?: () => void
  onFamilyClick?: () => void
  availableLevels?: number[]
  selectedLevel?: number
  onLevelChange?: (level: number) => void
  onBack?: () => void
  onDelete?: () => void
  onCreateFromTemplate?: () => void
  hasSourceQuest: boolean
  onCheckSource?: () => void
}) => {
  return (
    <HorizontalScrollButtons justify="center" mt="xl" gap="xl">
      {/* レベル切り替えボタン */}
      <LevelSelectMenu 
        availableLevels={availableLevels || []}
        selectedLevel={selectedLevel || 1}
        onLevelChange={onLevelChange || (() => {})}
      />

      {/* テンプレートから作成 */}
      <Button 
        size="md" 
        radius="xl" 
        color="blue"
        variant="outline"
        leftSection={<IconFilePencil size={18} />}
        onClick={onCreateFromTemplate}
      >
        テンプレートから作成
      </Button>
      {/* 元のクエストを確認する(元のクエストがある場合のみ表示) */}
      {hasSourceQuest && (
      <Button 
        size="md" 
        radius="xl" 
        color="gray"
        variant="outline"
        leftSection={<IconFileSearch size={18} />}
        onClick={onCheckSource}
      >
        元のクエスト確認
      </Button>
      )}
      {/* 削除ボタン */}
      <Button 
        size="md" 
        radius="xl" 
        color="red"
        leftSection={<IconTrash size={18} />}
        variant="outline"
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
    </HorizontalScrollButtons>
  )
}
