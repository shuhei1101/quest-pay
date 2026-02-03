"use client"

import { Box, Textarea, Button, Group } from "@mantine/core"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWindow } from "@/app/(core)/useConstants"
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
import { CommentsLayout } from "./_components/CommentsLayout"

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
    // コメントの現在の高評価状態を取得する
    const comment = comments?.find((c) => c.id === commentId)
    if (!comment) return

    handleUpvote({
      publicQuestId: id,
      commentId,
      isUpvoted: comment.isUpvoted,
      onSuccess: refetch,
    })
  }

  /** 低評価ハンドル */
  const handleDownvoteClick = (commentId: string) => {
    // コメントの現在の低評価状態を取得する
    const comment = comments?.find((c) => c.id === commentId)
    if (!comment) return

    handleDownvote({
      publicQuestId: id,
      commentId,
      isDownvoted: comment.isDownvoted,
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
      {/* コメント一覧 */}
      <CommentsLayout
        comments={comments}
        isDark={isDark}
        isLoading={isLoading}
        isQuestCreator={isQuestCreator}
        hasLiked={hasLiked}
        isPublisherFamily={isPublisherFamily()}
        isCurrentUser={(profileId) => userInfo?.profiles?.id === profileId}
        onUpvote={handleUpvoteClick}
        onDownvote={handleDownvoteClick}
        onReport={handleReportClick}
        onDelete={handleDeleteClick}
        onPin={handlePinClick}
        onPublisherLike={handlePublisherLikeClick}
        onRefetch={refetch}
      />

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
