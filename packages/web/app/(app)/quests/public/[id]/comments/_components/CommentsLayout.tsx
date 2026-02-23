"use client"

import { Box, LoadingOverlay, Stack, Text, Textarea, Button, Group } from "@mantine/core"
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
  /** コメント内容 */
  comment: string
  /** コメント内容変更時のハンドル */
  onCommentChange: (value: string) => void
  /** コメント投稿時のハンドル */
  onSubmit: () => void
  /** コメント投稿中かどうか */
  isPostingComment: boolean
}

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
  comment,
  onCommentChange,
  onSubmit,
  isPostingComment,
}: CommentsLayoutProps) => {
  /** ソート済みのコメント一覧（ピン留めコメントを最上位に固定） */
  const sortedComments = comments || []

  return (
    <Box
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* スクロールエリア */}
      <Box
        style={{
          flex: 1,
          overflow: "auto",
          padding: "1rem",
        }}
      >
        <Box pos="relative">
          {/* ロード中のオーバーレイ */}
          <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

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
      </Box>

      {/* コメント入力欄 */}
      <Box
        style={{
          flexShrink: 0,
          borderTop: `1px solid ${isDark ? "#373A40" : "#dee2e6"}`,
          padding: "1rem",
        }}
      >
        <Group gap="md" align="flex-start">
          <Textarea
            placeholder="コメントを入力してください"
            value={comment}
            onChange={(e) => onCommentChange(e.currentTarget.value)}
            minRows={1}
            maxRows={4}
            style={{ flex: 1 }}
          />
          <Button
            size="md"
            radius="xl"
            onClick={onSubmit}
            disabled={!comment.trim() || isPostingComment}
          >
            投稿
          </Button>
        </Group>
      </Box>
    </Box>
  )
}
