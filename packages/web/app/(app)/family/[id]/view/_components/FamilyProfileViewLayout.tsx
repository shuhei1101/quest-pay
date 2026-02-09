"use client"

import { Box, Paper, LoadingOverlay, Avatar, Text, Button, Group, Stack, Divider } from "@mantine/core"
import { ReactNode } from "react"
import { useWindow } from "@/app/(core)/useConstants"
import { IconUserCircle } from "@tabler/icons-react"

/** タイムラインアイテムのプロパティ */
type TimelineItemProps = {
  message: string
  time: string
}

/** タイムラインアイテムコンポーネント */
const TimelineItem = ({ message, time }: TimelineItemProps) => (
  <Paper className="p-3 mb-2" withBorder>
    <Text size="sm">{message}</Text>
    <Text size="xs" c="dimmed" className="mt-1">{time}</Text>
  </Paper>
)

/** 家族プロフィール画面のレイアウトプロパティ */
type FamilyProfileViewLayoutProps = {
  /** 家族名 */
  familyName: string | null
  /** 表示ID */
  displayId: string
  /** アイコンカラー */
  iconColor: string
  /** 紹介文 */
  introduction: string
  /** フォロワー数 */
  followerCount: number
  /** フォロー数 */
  followingCount: number
  /** 共有クエスト数 */
  publicQuestCount: number
  /** お気に入り登録された数 */
  likeCount: number
  /** タイムライン */
  timelines: TimelineItemProps[]
  /** ローディング状態 */
  isLoading: boolean
  /** フォロー中かどうか */
  isFollowing: boolean
  /** フォローボタン押下時のハンドラ */
  onFollowClick: () => void
  /** フッター要素 */
  footer?: ReactNode
}

/** 家族プロフィール画面のレイアウト */
export const FamilyProfileViewLayout = ({
  familyName,
  displayId,
  iconColor,
  introduction,
  followerCount,
  followingCount,
  publicQuestCount,
  likeCount,
  timelines,
  isLoading,
  isFollowing,
  onFollowClick,
  footer,
}: FamilyProfileViewLayoutProps) => {
  const { isDark } = useWindow()

  return (
    <Box pos="relative" className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* メインコンテンツ */}
      <Box className="flex-1 overflow-y-auto p-4">
        {/* プロフィールヘッダー */}
        <Paper className="p-4 mb-4" withBorder>
          <Group>
            {/* アイコン */}
            <Avatar
              size={80}
              radius="xl"
              color={iconColor}
              className="flex-shrink-0"
            >
              <IconUserCircle size={60} />
            </Avatar>

            {/* 家族情報 */}
            <Stack gap="xs" className="flex-1">
              {/* 家族名とID */}
              <div>
                <Text size="xl" fw={700}>
                  {familyName || "未設定"}
                </Text>
                <Text size="sm" c="dimmed">
                  @{displayId}
                </Text>
              </div>

              {/* フォローボタン */}
              <Button
                size="sm"
                variant={isFollowing ? "outline" : "filled"}
                onClick={onFollowClick}
                className="w-32"
              >
                {isFollowing ? "フォロー中" : "フォロー"}
              </Button>
            </Stack>
          </Group>

          {/* 紹介文 */}
          <Text size="sm" className="mt-3">
            {introduction || "紹介文はありません。"}
          </Text>
        </Paper>

        {/* 統計情報 */}
        <Paper className="p-4 mb-4" withBorder>
          <Group justify="space-around">
            {/* フォロー数 */}
            <Stack gap={4} align="center">
              <Text size="lg" fw={700}>
                {followingCount}人
              </Text>
              <Text size="xs" c="dimmed">
                フォロー
              </Text>
            </Stack>

            {/* フォロワー数 */}
            <Stack gap={4} align="center">
              <Text size="lg" fw={700}>
                {followerCount}人
              </Text>
              <Text size="xs" c="dimmed">
                フォロワー
              </Text>
            </Stack>

            {/* 共有クエスト数 */}
            <Stack gap={4} align="center">
              <Text size="lg" fw={700}>
                {publicQuestCount}
              </Text>
              <Text size="xs" c="dimmed">
                共有クエスト
              </Text>
            </Stack>

            {/* お気に入り登録数 */}
            <Stack gap={4} align="center">
              <Text size="lg" fw={700}>
                {likeCount}
              </Text>
              <Text size="xs" c="dimmed">
                お気に入り登録された
              </Text>
            </Stack>
          </Group>
        </Paper>

        {/* タイムライン */}
        <Paper className="p-4" withBorder>
          <Text size="md" fw={600} className="mb-3">
            タイムライン
          </Text>
          <Divider className="mb-3" />
          {timelines.length > 0 ? (
            timelines.map((item, index) => (
              <TimelineItem key={index} message={item.message} time={item.time} />
            ))
          ) : (
            <Text size="sm" c="dimmed" className="text-center py-4">
              タイムラインがありません
            </Text>
          )}
        </Paper>
      </Box>

      {/* フッター */}
      {footer && (
        <Box className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {footer}
        </Box>
      )}
    </Box>
  )
}
