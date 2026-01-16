"use client"

import { Box, Paper, Text, Textarea, Button, LoadingOverlay, Stack, Group, ActionIcon, Menu, Avatar, Badge, Indicator } from "@mantine/core"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWindow } from "@/app/(core)/useConstants"
import { IconArrowLeft, IconDots, IconThumbUp, IconThumbDown, IconFlag, IconTrash, IconHeart, IconCrown } from "@tabler/icons-react"
import { usePublicQuestComments } from "./_hooks/usePublicQuestComments"
import { usePostComment } from "./_hooks/usePostComment"
import { useUpvoteComment } from "./_hooks/useUpvoteComment"
import { useDownvoteComment } from "./_hooks/useDownvoteComment"
import { useReportComment } from "./_hooks/useReportComment"
import { useDeleteComment } from "./_hooks/useDeleteComment"
import { usePublicQuest } from "../view/_hooks/usePublicQuest"
import { useIsLike } from "../view/_hooks/useIsLike"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"

/** 公開クエストコメント画面 */
export const PublicQuestComments = ({ id }: { id: string }) => {
  const router = useRouter()
  const { isDark } = useWindow()
  const { userInfo } = useLoginUserInfo()

  /** コメント内容 */
  const [comment, setComment] = useState("")
  /** ローディング状態 */
  const [isLoading, setIsLoading] = useState(false)

  /** コメント一覧 */
  const { comments, refetch } = usePublicQuestComments({ publicQuestId: id })
  /** コメント投稿 */
  const { handlePostComment } = usePostComment()
  /** 高評価 */
  const { handleUpvote } = useUpvoteComment()
  /** 低評価 */
  const { handleDownvote } = useDownvoteComment()
  /** 報告 */
  const { handleReport } = useReportComment()
  /** 削除 */
  const { handleDelete } = useDeleteComment()
  /** 公開クエスト情報 */
  const { publicQuest } = usePublicQuest({ id })
  /** いいねされているかどうか */
  const { isLike } = useIsLike({ id })

  /** コメント投稿ハンドル */
  const handleSubmit = async () => {
    if (!comment.trim()) return

    setIsLoading(true)
    await handlePostComment({
      publicQuestId: id,
      content: comment,
      onSuccess: () => {
        setComment("")
        refetch()
      },
    })
    setIsLoading(false)
  }

  /** 高評価ハンドル */
  const handleUpvoteClick = async (commentId: string) => {
    setIsLoading(true)
    await handleUpvote({
      publicQuestId: id,
      commentId,
      onSuccess: refetch,
    })
    setIsLoading(false)
  }

  /** 低評価ハンドル */
  const handleDownvoteClick = async (commentId: string) => {
    setIsLoading(true)
    await handleDownvote({
      publicQuestId: id,
      commentId,
      onSuccess: refetch,
    })
    setIsLoading(false)
  }

  /** 報告ハンドル */
  const handleReportClick = async (commentId: string) => {
    const reason = prompt("報告理由を入力してください")
    if (!reason) return

    setIsLoading(true)
    await handleReport({
      publicQuestId: id,
      commentId,
      reason,
      onSuccess: refetch,
    })
    setIsLoading(false)
  }

  /** 削除ハンドル */
  const handleDeleteClick = async (commentId: string) => {
    if (!confirm("このコメントを削除しますか？")) return

    setIsLoading(true)
    await handleDelete({
      publicQuestId: id,
      commentId,
      onSuccess: refetch,
    })
    setIsLoading(false)
  }

  /** クエスト作成者かどうか確認する */
  const isQuestCreator = (familyId: string) => {
    return publicQuest?.base.familyId === familyId
  }

  /** いいねしているかどうか確認する */
  const hasLiked = (familyId: string) => {
    return isLike && userInfo?.profiles?.familyId === familyId
  }

  return (
    <div
      className="flex flex-col p-4 h-full min-h-0"
      style={{
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(120, 53, 15, 0.2)",
      }}
    >
      {/* ヘッダー部分 */}
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>
          コメント
        </Text>
        <Button
          size="sm"
          radius="xl"
          color="gray"
          variant="outline"
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => router.back()}
        >
          戻る
        </Button>
      </Group>

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
                <Paper
                  key={commentItem.id}
                  p="md"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? "#3d3838" : "#ffffff",
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    {/* ユーザ情報 */}
                    <Group gap="sm">
                      {/* 家族アイコン */}
                      <Box pos="relative">
                        <Avatar size="lg" radius="xl" color={commentItem.profile.iconColor}>
                          <RenderIcon iconName={commentItem.icon.name} size={32} />
                        </Avatar>
                        {/* 王冠アイコン（作成者） */}
                        {isQuestCreator(commentItem.profile.familyId) && (
                          <Box
                            pos="absolute"
                            top={-8}
                            right={-8}
                            style={{
                              backgroundColor: "#ffd700",
                              borderRadius: "50%",
                              padding: 4,
                            }}
                          >
                            <IconCrown size={16} color="#fff" />
                          </Box>
                        )}
                        {/* ハートアイコン（いいね） */}
                        {hasLiked(commentItem.profile.familyId) && (
                          <Box
                            pos="absolute"
                            bottom={-8}
                            right={-8}
                            style={{
                              backgroundColor: "#ff6b6b",
                              borderRadius: "50%",
                              padding: 4,
                            }}
                          >
                            <IconHeart size={16} color="#fff" />
                          </Box>
                        )}
                      </Box>

                      {/* ユーザ名と投稿日時 */}
                      <Stack gap={0}>
                        <Text fw={700}>{commentItem.profile.name}</Text>
                        <Text size="xs" c="dimmed">
                          {new Date(commentItem.createdAt).toLocaleString("ja-JP")}
                        </Text>
                      </Stack>
                    </Group>

                    {/* 三点リーダメニュー */}
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDots size={18} />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        {/* 高評価 */}
                        <Menu.Item
                          leftSection={<IconThumbUp size={16} />}
                          onClick={() => handleUpvoteClick(commentItem.id)}
                          disabled={commentItem.isUpvoted}
                        >
                          高評価 ({commentItem.upvoteCount})
                        </Menu.Item>

                        {/* 低評価 */}
                        <Menu.Item
                          leftSection={<IconThumbDown size={16} />}
                          onClick={() => handleDownvoteClick(commentItem.id)}
                          disabled={commentItem.isDownvoted}
                        >
                          低評価 ({commentItem.downvoteCount})
                        </Menu.Item>

                        {/* 報告 */}
                        <Menu.Item
                          leftSection={<IconFlag size={16} />}
                          onClick={() => handleReportClick(commentItem.id)}
                        >
                          報告
                        </Menu.Item>

                        {/* 削除（自分のコメントのみ） */}
                        {userInfo?.profiles?.id === commentItem.profileId && (
                          <>
                            <Menu.Divider />
                            <Menu.Item
                              color="red"
                              leftSection={<IconTrash size={16} />}
                              onClick={() => handleDeleteClick(commentItem.id)}
                            >
                              削除
                            </Menu.Item>
                          </>
                        )}
                      </Menu.Dropdown>
                    </Menu>
                  </Group>

                  {/* コメント内容 */}
                  <Text mt="sm">{commentItem.content}</Text>

                  {/* 評価バッジ */}
                  <Group gap="xs" mt="sm">
                    <Badge
                      leftSection={<IconThumbUp size={12} />}
                      variant={commentItem.isUpvoted ? "filled" : "light"}
                      color="blue"
                    >
                      {commentItem.upvoteCount}
                    </Badge>
                    <Badge
                      leftSection={<IconThumbDown size={12} />}
                      variant={commentItem.isDownvoted ? "filled" : "light"}
                      color="gray"
                    >
                      {commentItem.downvoteCount}
                    </Badge>
                  </Group>
                </Paper>
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
        <Group align="flex-end" gap="md">
          <Textarea
            placeholder="コメントを入力してください"
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            minRows={2}
            maxRows={4}
            style={{ flex: 1 }}
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
