"use client"

import { Box, Paper, LoadingOverlay, Stack, Text, Group, Select } from "@mantine/core"
import { useState, useMemo } from "react"
import { CommentItemLayout } from "./CommentItemLayout"

type CommentItem = {
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

type CommentsLayoutProps = {
  comments: CommentItem[] | undefined
  isDark: boolean
  isLoading: boolean
  isQuestCreator: (familyId: string) => boolean
  hasLiked: (familyId: string) => boolean
  isPublisherFamily: boolean
  isCurrentUser: (profileId: string) => boolean
  onUpvote: (commentId: string) => void
  onDownvote: (commentId: string) => void
  onReport: (commentId: string) => void
  onDelete: (commentId: string) => void
  onPin: (commentId: string, isPinned: boolean) => void
  onPublisherLike: (commentId: string, isLiked: boolean) => void
}

type SortType = "newest" | "likes"

/** コメント一覧レイアウト */
export const CommentsLayout = ({
  comments,
  isDark,
  isLoading,
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
}: CommentsLayoutProps) => {
  /** ソート方法 */
  const [sortType, setSortType] = useState<SortType>("newest")

  /** ソート済みのコメント一覧を取得する */
  const sortedComments = useMemo(() => {
    if (!comments || comments.length === 0) return []

    // コメントをコピーしてソート
    const sorted = [...comments]

    // ピン留めされたコメントを最上位に固定
    sorted.sort((a, b) => {
      // ピン留めされたコメントを優先
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      // ピン留めされていない場合はソート方法に従う
      if (sortType === "newest") {
        // 新着順（作成日時の降順）
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortType === "likes") {
        // いいね順（高評価数 - 低評価数の降順）
        const aScore = a.upvoteCount - a.downvoteCount
        const bScore = b.upvoteCount - b.downvoteCount
        return bScore - aScore
      }

      return 0
    })

    return sorted
  }, [comments, sortType])

  return (
    <Paper
      className="flex-1 min-h-0"
      p="md"
      radius="md"
      style={{
        backgroundColor: isDark ? "#544c4c" : "#fffef5",
        boxShadow: "4px 4px 8px rgba(0,0,0,0.15)",
        overflow: "auto",
      }}
    >
      <Box pos="relative" className="h-full">
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        {/* ソート選択 */}
        <Group justify="flex-end" mb="md">
          <Select
            size="xs"
            value={sortType}
            onChange={(value) => setSortType(value as SortType)}
            data={[
              { value: "newest", label: "新着順" },
              { value: "likes", label: "いいね順" },
            ]}
            w={120}
          />
        </Group>

        {/* コメント一覧 */}
        <Stack gap="md">
          {sortedComments && sortedComments.length > 0 ? (
            sortedComments.map((commentItem) => (
              <CommentItemLayout
                key={commentItem.id}
                commentItem={commentItem}
                isDark={isDark}
                isQuestCreator={isQuestCreator(commentItem.profile.familyId)}
                hasLiked={hasLiked(commentItem.profile.familyId)}
                isPublisherFamily={isPublisherFamily}
                isCurrentUser={isCurrentUser(commentItem.profileId)}
                onUpvote={() => onUpvote(commentItem.id)}
                onDownvote={() => onDownvote(commentItem.id)}
                onReport={() => onReport(commentItem.id)}
                onDelete={() => onDelete(commentItem.id)}
                onPin={() => onPin(commentItem.id, commentItem.isPinned)}
                onPublisherLike={() => onPublisherLike(commentItem.id, commentItem.isLikedByPublisher)}
              />
            ))
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              まだコメントがありません
            </Text>
          )}
        </Stack>
      </Box>
    </Paper>
  )
}
