import { ActionIcon, Avatar, Button, Group, Indicator, Tooltip } from "@mantine/core"
import { IconArrowLeft, IconHeart, IconHeartFilled } from "@tabler/icons-react"
import { LevelSelectMenu } from "../../../../_components/LevelSelectMenu"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"

/** クエスト閲覧フッター（オンライン向け） */
export const PublicQuestViewFooter = ({
  familyIcon,
  likeCount,
  isLiked,
  onLikeToggle,
  onFamilyClick,
  availableLevels,
  selectedLevel,
  onLevelChange,
  onBack,
  isLikeLoading,
}: {
  familyIcon?: string
  likeCount: number
  isLiked: boolean
  onLikeToggle?: () => void
  onFamilyClick?: () => void
  availableLevels?: number[]
  selectedLevel?: number
  onLevelChange?: (level: number) => void
  onBack?: () => void
  isLikeLoading?: boolean
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
    </Group>
  )
}
