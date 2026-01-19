import { ActionIcon, Avatar, Button, Indicator, Tooltip } from "@mantine/core"
import { IconArrowLeft, IconHeart, IconHeartFilled, IconMessage } from "@tabler/icons-react"
import { LevelSelectMenu } from "../../../../_components/LevelSelectMenu"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { HorizontalScrollButtons } from "@/app/(core)/_components/HorizontalScrollButtons"

/** クエスト閲覧フッター（オンライン向け） */
export const PublicQuestViewFooter = ({
  familyIcon,
  likeCount,
  commentCount,
  isLiked,
  onLikeToggle,
  onComment,
  onFamilyClick,
  availableLevels,
  selectedLevel,
  onLevelChange,
  onBack,
  isLikeLoading,
}: {
  familyIcon?: string
  likeCount: number
  commentCount: number
  isLiked: boolean
  onLikeToggle?: () => void
  onComment?: () => void
  onFamilyClick?: () => void
  availableLevels?: number[]
  selectedLevel?: number
  onLevelChange?: (level: number) => void
  onBack?: () => void
  isLikeLoading?: boolean
}) => {
  return (
    <HorizontalScrollButtons justify="center" mt="xl" gap="xl">
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

      {/* いいねボタン */}
      <Indicator label={likeCount} size={18} color="red" offset={4}>
        <ActionIcon 
          variant="light" 
          color={isLiked ? "red" : "gray"} 
          size={56} 
          radius="xl"
          onClick={onLikeToggle}
          loading={isLikeLoading}
          disabled={isLikeLoading}
        >
          {isLiked ? (
            <IconHeartFilled size={28} />
          ) : (
            <IconHeart size={28} />
          )}
        </ActionIcon>
      </Indicator>

      {/* コメントボタン */}
      <Indicator label={commentCount} size={18} color="blue" offset={4}>
        <ActionIcon variant="light" color="blue" size={56} radius="xl" onClick={onComment}>
          <IconMessage size={28} />
        </ActionIcon>
      </Indicator>
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
