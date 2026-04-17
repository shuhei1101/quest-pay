"use client"

import { Box, Paper, LoadingOverlay, Text, Button, Group, Stack, Divider, ThemeIcon, SimpleGrid, Card } from "@mantine/core"
import { ReactNode } from "react"
import { useWindow } from "@/app/(core)/useConstants"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { IconUser, IconBabyCarriage, IconTrophy, IconChecklist } from "@tabler/icons-react"

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
  /** アイコン名 */
  iconName?: string
  /** アイコンサイズ */
  iconSize?: number | null
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
  /** 自分の家族かどうか */
  isOwnFamily: boolean
  /** フォロー中かどうか */
  isFollowing: boolean
  /** フォローボタン押下時のハンドラ */
  onFollowClick: () => void
  /** 編集ボタン押下時のハンドラ */
  onEdit?: () => void
  /** フッター要素 */
  footer?: ReactNode
  /** メンバー統計 */
  memberStats?: {
    parentCount: number
    childCount: number
  }
  /** クエスト実績統計 */
  questStats?: {
    totalCount: number
    completedCount: number
    inProgressCount: number
  }
}

/** 家族プロフィール画面のレイアウト */
export const FamilyProfileViewLayout = ({
  familyName,
  displayId,
  iconName,
  iconSize,
  iconColor,
  introduction,
  followerCount,
  followingCount,
  publicQuestCount,
  likeCount,
  timelines,
  isLoading,
  isOwnFamily,
  isFollowing,
  onFollowClick,
  onEdit,
  footer,
  memberStats,
  questStats,
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
          <Group align="flex-start">
            {/* アイコン */}
            <Box className="shrink-0">
              <RenderIcon 
                iconName={iconName}
                iconSize={iconSize ?? 80}
                iconColor={iconColor}
              />
            </Box>

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

              {/* フォローボタンまたは編集ボタン */}
              {!isOwnFamily && (
                <Button
                  size="xs"
                  variant={isFollowing ? "outline" : "filled"}
                  onClick={onFollowClick}
                  className="w-24"
                >
                  {isFollowing ? "フォロー中" : "フォロー"}
                </Button>
              )}
              {isOwnFamily && onEdit && (
                <Button
                  size="xs"
                  variant="light"
                  onClick={onEdit}
                  className="w-24"
                >
                  編集
                </Button>
              )}
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
                {followingCount}
              </Text>
              <Text size="xs" c="dimmed">
                フォロー
              </Text>
            </Stack>

            {/* フォロワー数 */}
            <Stack gap={4} align="center">
              <Text size="lg" fw={700}>
                {followerCount}
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

        {/* メンバー統計カード */}
        {memberStats && (
          <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-4">
            <Text size="lg" fw={600} className="mb-3">メンバー構成</Text>
            <SimpleGrid cols={2} spacing="md">
              <Box style={{ textAlign: "center" }}>
                <ThemeIcon size={50} radius="xl" variant="light" color="blue" className="mb-2">
                  <IconUser size={28} />
                </ThemeIcon>
                <Text size="xs" c="dimmed">親</Text>
                <Text size="xl" fw={700}>{memberStats.parentCount}人</Text>
              </Box>
              <Box style={{ textAlign: "center" }}>
                <ThemeIcon size={50} radius="xl" variant="light" color="pink" className="mb-2">
                  <IconBabyCarriage size={28} />
                </ThemeIcon>
                <Text size="xs" c="dimmed">子供</Text>
                <Text size="xl" fw={700}>{memberStats.childCount}人</Text>
              </Box>
            </SimpleGrid>
          </Card>
        )}

        {/* クエスト実績統計カード */}
        {questStats && (
          <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-4">
            <Text size="lg" fw={600} className="mb-3">クエスト実績</Text>
            <SimpleGrid cols={3} spacing="md">
              <Box style={{ textAlign: "center" }}>
                <ThemeIcon size={50} radius="xl" variant="light" color="grape" className="mb-2">
                  <IconTrophy size={28} />
                </ThemeIcon>
                <Text size="xs" c="dimmed">総クエスト数</Text>
                <Text size="xl" fw={700}>{questStats.totalCount}</Text>
              </Box>
              <Box style={{ textAlign: "center" }}>
                <ThemeIcon size={50} radius="xl" variant="light" color="green" className="mb-2">
                  <IconChecklist size={28} />
                </ThemeIcon>
                <Text size="xs" c="dimmed">完了</Text>
                <Text size="xl" fw={700}>{questStats.completedCount}</Text>
              </Box>
              <Box style={{ textAlign: "center" }}>
                <ThemeIcon size={50} radius="xl" variant="light" color="orange" className="mb-2">
                  <IconChecklist size={28} />
                </ThemeIcon>
                <Text size="xs" c="dimmed">進行中</Text>
                <Text size="xl" fw={700}>{questStats.inProgressCount}</Text>
              </Box>
            </SimpleGrid>
          </Card>
        )}

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
