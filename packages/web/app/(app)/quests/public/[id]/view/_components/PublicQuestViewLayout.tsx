"use client"

import { Box, Paper, Tabs, LoadingOverlay, Badge, Textarea, ActionIcon, Group } from "@mantine/core"
import { IconSend } from "@tabler/icons-react"
import { useState } from "react"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { useWindow } from "@/app/(core)/useConstants"
import { QuestViewHeader } from "@/app/(app)/quests/view/_components/QuestViewHeader"
import { QuestConditionTab } from "@/app/(app)/quests/view/_components/QuestConditionTab"
import { QuestDetailTab } from "@/app/(app)/quests/view/_components/QuestDetailTab"
import { QuestOtherTab } from "@/app/(app)/quests/view/_components/QuestOtherTab"
import { usePublicQuestComments } from "../../comments/_hooks/usePublicQuestComments"
import { usePostComment } from "../../comments/_hooks/usePostComment"
import { useUpvoteComment } from "../../comments/_hooks/useUpvoteComment"
import { useDownvoteComment } from "../../comments/_hooks/useDownvoteComment"
import { useReportComment } from "../../comments/_hooks/useReportComment"
import { useDeleteComment } from "../../comments/_hooks/useDeleteComment"
import { usePinComment } from "../../comments/_hooks/usePinComment"
import { usePublisherLike } from "../../comments/_hooks/usePublisherLike"
import { usePublicQuest } from "../_hooks/usePublicQuest"
import { useIsLike } from "../_hooks/useIsLike"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { CommentsLayout } from "../../comments/_components/CommentsLayout"

/** 公開クエスト閲覧レイアウトのプロパティ */
type PublicQuestViewLayoutProps = {
  /** クエスト名 */
  questName: string
  /** ヘッダーの色設定 */
  headerColor?: { light: string, dark: string }
  /** 背景色スタイル */
  backgroundColor: { light: string, dark: string }
  /** アイコン名 */
  iconName?: string
  /** アイコンサイズ */
  iconSize?: number
  /** アイコンカラー */
  iconColor?: string
  /** ローディング状態 */
  isLoading: boolean
  /** レベル */
  level: number
  /** カテゴリ */
  category: string
  /** 成功条件 */
  successCondition: string
  /** 報酬 */
  reward: number
  /** 経験値 */
  exp: number
  /** 必要達成回数 */
  requiredCompletionCount: number
  /** 依頼主 */
  client: string
  /** 依頼内容 */
  requestDetail: string
  /** タグ */
  tags: string[]
  /** 年齢From */
  ageFrom?: number | null
  /** 年齢To */
  ageTo?: number | null
  /** 月From */
  monthFrom?: number | null
  /** 月To */
  monthTo?: number | null
  /** 必要クリア回数 */
  requiredClearCount: number | null
  /** コメント数 */
  commentCount?: number
  /** 公開クエストID */
  publicQuestId: string
}

/** 公開クエスト閲覧画面の共通レイアウト */
export const PublicQuestViewLayout = ({
  questName,
  headerColor,
  backgroundColor,
  iconName,
  iconSize,
  iconColor,
  isLoading,
  level,
  category,
  successCondition,
  reward,
  exp,
  requiredCompletionCount,
  client,
  requestDetail,
  tags,
  ageFrom,
  ageTo,
  monthFrom,
  monthTo,
  requiredClearCount,
  commentCount = 0,
  publicQuestId,
}: PublicQuestViewLayoutProps) => {
  const {isDark} = useWindow()
  const { userInfo } = useLoginUserInfo()
  
  /** アクティブタブ */
  const [activeTab, setActiveTab] = useState<string | null>("condition")
  
  /** コメント内容 */
  const [comment, setComment] = useState("")

  /** コメント一覧 */
  const { comments, refetch } = usePublicQuestComments({ publicQuestId })
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
  const { publicQuest } = usePublicQuest({ id: publicQuestId })
  /** いいねされているかどうか */
  const { isLike } = useIsLike({ id: publicQuestId })

  /** ローディング状態を統合する */
  const isCommentLoading = isPostingComment || isUpvoting || isDownvoting || isReporting || isDeleting || isPinning || isPublisherLiking

  /** コメント投稿ハンドル */
  const handleSubmit = () => {
    if (!comment.trim()) return

    handlePostComment({
      publicQuestId,
      content: comment,
      onSuccess: () => {
        setComment("")
        refetch()
      },
    })
  }

  /** 高評価ハンドル */
  const handleUpvoteClick = (commentId: string) => {
    const commentItem = comments?.find((c) => c.id === commentId)
    if (!commentItem) return

    handleUpvote({
      publicQuestId,
      commentId,
      isUpvoted: commentItem.isUpvoted,
      onSuccess: refetch,
    })
  }

  /** 低評価ハンドル */
  const handleDownvoteClick = (commentId: string) => {
    const commentItem = comments?.find((c) => c.id === commentId)
    if (!commentItem) return

    handleDownvote({
      publicQuestId,
      commentId,
      isDownvoted: commentItem.isDownvoted,
      onSuccess: refetch,
    })
  }

  /** 報告ハンドル */
  const handleReportClick = (commentId: string) => {
    const reason = prompt("報告理由を入力してください")
    if (!reason) return

    handleReport({
      publicQuestId,
      commentId,
      reason,
      onSuccess: refetch,
    })
  }

  /** 削除ハンドル */
  const handleDeleteClick = (commentId: string) => {
    if (!confirm("このコメントを削除しますか？")) return

    handleDelete({
      publicQuestId,
      commentId,
      onSuccess: refetch,
    })
  }

  /** ピン留めハンドル */
  const handlePinClick = (commentId: string, isPinned: boolean) => {
    if (isPinned) {
      handleUnpin({
        publicQuestId,
        commentId,
        onSuccess: refetch,
      })
    } else {
      handlePin({
        publicQuestId,
        commentId,
        onSuccess: refetch,
      })
    }
  }

  /** 公開者いいねハンドル */
  const handlePublisherLikeClick = (commentId: string, isLiked: boolean) => {
    if (isLiked) {
      handlePublisherUnlike({
        publicQuestId,
        commentId,
        onSuccess: refetch,
      })
    } else {
      handlePublisherLike({
        publicQuestId,
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
    <Box pos="relative" className="flex flex-col p-4 h-full" style={{ backgroundColor: isDark ? backgroundColor.dark : backgroundColor.light }}>
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
      
      {/* ヘッダー部分 */}
      <QuestViewHeader 
        questName={questName}
        headerColor={headerColor}
      />

      {/* クエスト内容カード */}
      <Paper
        className="flex-1 min-h-0"
        p="md" 
        radius="md" 
        style={{ 
          backgroundColor: isDark ? "#544c4c" : "#fffef5",
          boxShadow: "4px 4px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* タブ切り替え */}
        <ScrollableTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { value: "condition", label: "クエスト条件" },
            { value: "detail", label: "依頼情報" },
            { value: "other", label: "その他" },
            { 
              value: "comment", 
              label: "コメント",
              rightSection: commentCount > 0 ? (
                <Badge size="xs" color="red" circle>
                  {commentCount}
                </Badge>
              ) : undefined
            },
          ]}
        >
          {/* クエスト条件タブ */}
          <Tabs.Panel value="condition" pt="md">
            <QuestConditionTab
              level={level}
              category={category}
              successCondition={successCondition}
              reward={reward}
              exp={exp}
              requiredCompletionCount={requiredCompletionCount}
              iconName={iconName}
              iconSize={iconSize}
              iconColor={iconColor}
            />
          </Tabs.Panel>

          {/* 依頼情報タブ */}
          <Tabs.Panel value="detail" pt="md">
            <QuestDetailTab 
              client={client}
              requestDetail={requestDetail}
            />
          </Tabs.Panel>

          {/* その他情報タブ */}
          <Tabs.Panel value="other" pt="md">
            <QuestOtherTab
              tags={tags}
              ageFrom={ageFrom}
              ageTo={ageTo}
              monthFrom={monthFrom}
              monthTo={monthTo}
              requiredClearCount={requiredClearCount}
            />
          </Tabs.Panel>

          {/* コメントタブ */}
          <Tabs.Panel value="comment">
            <div className="flex flex-col h-full min-h-0">
              {/* コメント一覧 */}
              <CommentsLayout
                comments={comments}
                isDark={isDark}
                isLoading={isCommentLoading}
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
                  <ActionIcon
                    size="lg"
                    radius="xl"
                    variant="filled"
                    onClick={handleSubmit}
                    disabled={!comment.trim() || isCommentLoading}
                  >
                    <IconSend size={20} />
                  </ActionIcon>
                </Group>
              </Box>
            </div>
          </Tabs.Panel>
        </ScrollableTabs>
      </Paper>
    </Box>
  )
}
