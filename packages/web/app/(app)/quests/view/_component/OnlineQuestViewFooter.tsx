import { ActionIcon, Avatar, Group, Indicator, Tooltip } from "@mantine/core"
import { IconHeart, IconHeartFilled, IconMessage } from "@tabler/icons-react"

/** クエスト閲覧フッター（オンライン向け） */
export const OnlineQuestViewFooter = ({
  familyName,
  familyInitial,
  likeCount,
  commentCount,
  isLiked,
  onLikeToggle,
  onComment,
  onFamilyClick,
}: {
  familyName: string
  familyInitial: string
  likeCount: number
  commentCount: number
  isLiked: boolean
  onLikeToggle?: () => void
  onComment?: () => void
  onFamilyClick?: () => void
}) => {
  return (
    <Group justify="center" mt="xl" gap="xl">
      {/* 作成者家族アイコン */}
      <Tooltip label={familyName}>
        <ActionIcon variant="light" color="blue" size={56} radius="xl" onClick={onFamilyClick}>
          <Avatar size="md" color="blue">{familyInitial}</Avatar>
        </ActionIcon>
      </Tooltip>

      {/* いいねボタン */}
      <Indicator label={likeCount} size={18} color="red" offset={4}>
        <ActionIcon 
          variant="light" 
          color={isLiked ? "red" : "gray"} 
          size={56} 
          radius="xl"
          onClick={onLikeToggle}
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
    </Group>
  )
}
