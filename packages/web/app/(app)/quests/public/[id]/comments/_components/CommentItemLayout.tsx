"use client"

import { Box, Paper, Text, Group, ActionIcon, Menu, Avatar, Badge } from "@mantine/core"
import { IconDots, IconThumbUp, IconThumbDown, IconFlag, IconTrash, IconHeart, IconCrown, IconPin } from "@tabler/icons-react"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"

type CommentItemLayoutProps = {
  commentItem: {
    id: string
    content: string
    createdAt: string
    upvoteCount: number
    downvoteCount: number
    isUpvoted: boolean
    isDownvoted: boolean
    isPinned: boolean
    isLikedByPublisher: boolean
    profileId: string
    profile: {
      name: string
      familyId: string
      iconColor: string
    }
    icon: {
      name: string
    }
  }
  isDark: boolean
  isQuestCreator: boolean
  hasLiked: boolean
  isPublisherFamily: boolean
  isCurrentUser: boolean
  onUpvote: () => void
  onDownvote: () => void
  onReport: () => void
  onDelete: () => void
  onPin: () => void
  onPublisherLike: () => void
}

/** コメントアイテムレイアウト */
export const CommentItemLayout = ({
  commentItem,
  isDark,
  isQuestCreator,
  hasLiked,
  isPublisherFamily,
  isCurrentUser,
  onUpvote,
  onDownvote,
  onReport,
  onDelete,
  onPin,
  onPublisherLike,
}: CommentItemLayoutProps) => {
  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      style={{
        backgroundColor: isDark ? "#3d3838" : "#ffffff",
      }}
    >
      <Group align="flex-start" gap="md" wrap="nowrap">
        {/* 家族アイコン */}
        <Box pos="relative" style={{ flexShrink: 0 }}>
          <Avatar size="md" radius="xl" color={commentItem.profile.iconColor}>
            <RenderIcon iconName={commentItem.icon.name} size={28} />
          </Avatar>
          {/* 王冠アイコン（作成者） */}
          {isQuestCreator && (
            <Box
              pos="absolute"
              top={-6}
              right={-6}
              style={{
                backgroundColor: "#ffd700",
                borderRadius: "50%",
                padding: 3,
              }}
            >
              <IconCrown size={12} color="#fff" />
            </Box>
          )}
          {/* ハートアイコン（いいね） */}
          {hasLiked && (
            <Box
              pos="absolute"
              bottom={-6}
              right={-6}
              style={{
                backgroundColor: "#ff6b6b",
                borderRadius: "50%",
                padding: 3,
              }}
            >
              <IconHeart size={12} color="#fff" />
            </Box>
          )}
        </Box>

        {/* コメント本体 */}
        <Box style={{ flex: 1, minWidth: 0 }}>
          {/* ヘッダー行：ユーザ名、バッジ、日時、メニュー */}
          <Group justify="space-between" gap="xs" wrap="nowrap">
            <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
              <Text fw={700} size="sm" style={{ flexShrink: 0 }}>
                {commentItem.profile.name}
              </Text>
              {/* ピン留めアイコン */}
              {commentItem.isPinned && <IconPin size={14} color="#228be6" style={{ flexShrink: 0 }} />}
              {/* 公開者いいねバッジ */}
              {commentItem.isLikedByPublisher && (
                <Badge size="xs" variant="light" color="red" leftSection={<IconHeart size={10} />} style={{ flexShrink: 0 }}>
                  公開者
                </Badge>
              )}
              <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
                {new Date(commentItem.createdAt).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Group>

            {/* 三点リーダメニュー */}
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" size="sm">
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {/* ピン留め（公開者家族のみ） */}
                {isPublisherFamily && (
                  <Menu.Item leftSection={<IconPin size={16} />} onClick={onPin}>
                    {commentItem.isPinned ? "ピン留め解除" : "ピン留め"}
                  </Menu.Item>
                )}

                {/* 公開者いいね（公開者家族のみ） */}
                {isPublisherFamily && (
                  <Menu.Item
                    leftSection={<IconHeart size={16} />}
                    onClick={onPublisherLike}
                    color={commentItem.isLikedByPublisher ? "red" : undefined}
                  >
                    {commentItem.isLikedByPublisher ? "公開者いいね解除" : "公開者いいね"}
                  </Menu.Item>
                )}

                {/* 区切り線（公開者家族の場合） */}
                {isPublisherFamily && <Menu.Divider />}

                {/* 高評価 */}
                <Menu.Item 
                  leftSection={<IconThumbUp size={16} />} 
                  onClick={onUpvote}
                  color={commentItem.isUpvoted ? "blue" : undefined}
                >
                  {commentItem.isUpvoted ? "高評価を取り消す" : "高評価"} ({commentItem.upvoteCount})
                </Menu.Item>

                {/* 低評価 */}
                <Menu.Item 
                  leftSection={<IconThumbDown size={16} />} 
                  onClick={onDownvote}
                  color={commentItem.isDownvoted ? "gray" : undefined}
                >
                  {commentItem.isDownvoted ? "低評価を取り消す" : "低評価"} ({commentItem.downvoteCount})
                </Menu.Item>

                {/* 報告 */}
                <Menu.Item leftSection={<IconFlag size={16} />} onClick={onReport}>
                  報告
                </Menu.Item>

                {/* 削除（自分のコメントのみ） */}
                {isCurrentUser && (
                  <>
                    <Menu.Divider />
                    <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={onDelete}>
                      削除
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>

          {/* コメント内容 */}
          <Text size="sm" mt={4} style={{ wordBreak: "break-word" }}>
            {commentItem.content}
          </Text>

          {/* 評価ボタン */}
          <Group gap="md" mt="xs">
            <ActionIcon
              variant={commentItem.isUpvoted ? "filled" : "subtle"}
              color="blue"
              size="sm"
              onClick={onUpvote}
            >
              <IconThumbUp size={14} />
            </ActionIcon>
            <Text size="xs" c={commentItem.isUpvoted ? "blue" : "dimmed"}>
              {commentItem.upvoteCount}
            </Text>

            <ActionIcon
              variant={commentItem.isDownvoted ? "filled" : "subtle"}
              color="gray"
              size="sm"
              onClick={onDownvote}
            >
              <IconThumbDown size={14} />
            </ActionIcon>
            <Text size="xs" c={commentItem.isDownvoted ? "gray" : "dimmed"}>
              {commentItem.downvoteCount}
            </Text>
          </Group>
        </Box>
      </Group>
    </Paper>
  )
}
