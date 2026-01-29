"use client"

import { Box, Paper, Text, Textarea, Button, LoadingOverlay, Stack, Group } from "@mantine/core"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWindow } from "@/app/(core)/useConstants"
import { IconArrowLeft } from "@tabler/icons-react"
import { usePublicQuestComments } from "./_hooks/usePublicQuestComments"
import { usePostComment } from "./_hooks/usePostComment"
import { useUpvoteComment } from "./_hooks/useUpvoteComment"
import { useDownvoteComment } from "./_hooks/useDownvoteComment"
import { useReportComment } from "./_hooks/useReportComment"
import { useDeleteComment } from "./_hooks/useDeleteComment"
import { usePinComment } from "./_hooks/usePinComment"
import { usePublisherLike } from "./_hooks/usePublisherLike"
import { usePublicQuest } from "../view/_hooks/usePublicQuest"
import { useIsLike } from "../view/_hooks/useIsLike"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { CommentItemLayout } from "./_components/CommentItemLayout"

/** 公開クエストコメント画面 */
export const PublicQuestComments = ({ id }: { id: string }) => {
  const router = useRouter()
  const { isDark } = useWindow()
  const { userInfo } = useLoginUserInfo()

  /** コメント内容 */
  const [comment, setComment] = useState("")

  /** コメント一覧 */
  const { comments, refetch } = usePublicQuestComments({ publicQuestId: id })
  /** コメント投稿 */
  const { handlePostComment, isLoading: isPostingComment } = usePostComment()
  /** 高評価 */
  const { handleUpvote, isLoading: isUpvoting } = useUpvoteComment()
  /** 低評価 */
  const { handleDownvote, isLoading: isDownvoting } = useDownvoteComment()
  /** 報告 */
  const { handleReport, isLoading: isReporting } = useReportComment()
  /** 削除 */
  const { handleDelete, isLoading: isDeleting } = useDeleteComment()
  /** ピン留め */
  const { handlePin, handleUnpin, isLoading: isPinning } = usePinComment()
  /** 公開者いいね */
  const { handleLike: handlePublisherLike, handleUnlike: handlePublisherUnlike, isLoading: isPublisherLiking } = usePublisherLike()
  /** 公開クエスト情報 */
  const { publicQuest } = usePublicQuest({ id })
  /** いいねされているかどうか */
  const { isLike } = useIsLike({ id })

  /** ローディング状態を統合する */
  const isLoading = isPostingComment || isUpvoting || isDownvoting || isReporting || isDeleting || isPinning || isPublisherLiking

  /** コメント投稿ハンドル */
  const handleSubmit = () => {
    if (!comment.trim()) return

    handlePostComment({
      publicQuestId: id,
      content: comment,
      onSuccess: () => {
        setComment("")
        refetch()
      },
    })
  }

  /** 高評価ハンドル */
  const handleUpvoteClick = (commentId: string) => {
    handleUpvote({
      publicQuestId: id,
      commentId,
      onSuccess: refetch,
    })
  }

  /** 低評価ハンドル */
  const handleDownvoteClick = (commentId: string) => {
    handleDownvote({
      publicQuestId: id,
      commentId,
      onSuccess: refetch,
    })
  }

  /** 報告ハンドル */
  const handleReportClick = (commentId: string) => {
    const reason = prompt("報告理由を入力してください")
    if (!reason) return

    handleReport({
      publicQuestId: id,
      commentId,
      reason,
      onSuccess: refetch,
    })
  }

  /** 削除ハンドル */
  const handleDeleteClick = (commentId: string) => {
    if (!confirm("このコメントを削除しますか？")) return

    handleDelete({
      publicQuestId: id,
      commentId,
      onSuccess: refetch,
    })
  }

  /** ピン留めハンドル */
  const handlePinClick = (commentId: string, isPinned: boolean) => {
    if (isPinned) {
      handleUnpin({
        publicQuestId: id,
        commentId,
        onSuccess: refetch,
      })
    } else {
      handlePin({
        publicQuestId: id,
        commentId,
        onSuccess: refetch,
      })
    }
  }

  /** 公開者いいねハンドル */
  const handlePublisherLikeClick = (commentId: string, isLiked: boolean) => {
    if (isLiked) {
      handlePublisherUnlike({
        publicQuestId: id,
        commentId,
        onSuccess: refetch,
      })
    } else {
      handlePublisherLike({
        publicQuestId: id,
        commentId,
        onSuccess: refetch,
      })
    }
  }

  /** クエスト作成者かどうか確認する */
  const isQuestCreator = (familyId: string) => {
    return publicQuest?.base.familyId === familyId
  }

  /** いいねしているかどうか確認する */
  const hasLiked = (familyId: string) => {
    return isLike && userInfo?.profiles?.familyId === familyId
  }

  /** 公開クエストの家族に所属しているか確認する */
  const isPublisherFamily = () => {
    return publicQuest?.base.familyId === userInfo?.profiles?.familyId
  }

  return (
    <div
      className="flex flex-col p-4 h-full min-h-0"
      style={{
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(120, 53, 15, 0.2)",
      }}
    >
      {/* コメント一覧カード */}
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
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

          {/* コメント一覧 */}
          <Stack gap="md">
            {comments && comments.length > 0 ? (
              comments.map((commentItem) => (
                <CommentItemLayout
                  key={commentItem.id}
                  commentItem={commentItem}
                  isDark={isDark}
                  isQuestCreator={isQuestCreator(commentItem.profile.familyId)}
                  hasLiked={hasLiked(commentItem.profile.familyId)}
                  isPublisherFamily={isPublisherFamily()}
                  isCurrentUser={userInfo?.profiles?.id === commentItem.profileId}
                  onUpvote={() => handleUpvoteClick(commentItem.id)}
                  onDownvote={() => handleDownvoteClick(commentItem.id)}
                  onReport={() => handleReportClick(commentItem.id)}
                  onDelete={() => handleDeleteClick(commentItem.id)}
                  onPin={() => handlePinClick(commentItem.id, commentItem.isPinned)}
                  onPublisherLike={() => handlePublisherLikeClick(commentItem.id, commentItem.isLikedByPublisher)}
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

      {/* コメント入力欄 */}
      <Box mt="md">
        <Group align="" gap="md">
          <Textarea
            placeholder="コメントを入力してください"
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            minRows={1}
            maxRows={4}
            className="flex-1"
          />
          <Button
            size="md"
            radius="xl"
            onClick={handleSubmit}
            disabled={!comment.trim() || isLoading}
          >
            投稿
          </Button>
        </Group>
      </Box>
    </div>
  )
}
