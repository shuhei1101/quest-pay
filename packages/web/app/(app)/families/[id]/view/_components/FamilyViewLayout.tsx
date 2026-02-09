"use client"

import { Box, Paper, Avatar, Text, Group, Stack, LoadingOverlay, Button, Divider } from "@mantine/core"
import { IconArrowLeft, IconUsers, IconHeart, IconShare, IconCalendar } from "@tabler/icons-react"
import { useWindow } from "@/app/(core)/useConstants"
import { TimelineItem } from "@/app/(app)/timeline/_components/TimelineItem"
import { FamilyTimelineSelect, ProfileSelect } from "@/drizzle/schema"

/** 家族プロフィールレイアウトのプロパティ */
type FamilyViewLayoutProps = {
  /** 家族名 */
  familyName: string
  /** 家族ハンドル */
  familyHandle: string
  /** 紹介文 */
  introduction: string
  /** アイコン名 */
  iconName?: string
  /** アイコンカラー */
  iconColor?: string
  /** 公開クエスト数 */
  publicQuestCount: number
  /** お気に入り登録数 */
  likeCount: number
  /** タイムライン */
  timelines: Array<{
    family_timeline: FamilyTimelineSelect
    profiles: ProfileSelect | null
  }>
  /** ローディング状態 */
  isLoading: boolean
  /** 戻るボタンのハンドラ */
  onBack: () => void
}

/** 家族プロフィールレイアウト */
export const FamilyViewLayout = ({
  familyName,
  familyHandle,
  introduction,
  iconName,
  iconColor,
  publicQuestCount,
  likeCount,
  timelines,
  isLoading,
  onBack,
}: FamilyViewLayoutProps) => {
  const {isDark} = useWindow()

  return (
    <Box pos="relative" className="flex flex-col p-4 h-full" style={{ backgroundColor: isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(191, 219, 254, 0.5)" }}>
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
      
      {/* 戻るボタン */}
      <Box className="mb-4">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={20} />}
          onClick={onBack}
        >
          戻る
        </Button>
      </Box>

      {/* プロフィールカード */}
      <Paper shadow="sm" p="lg" radius="md" withBorder className="mb-4">
        {/* アイコンと基本情報 */}
        <Group align="flex-start" className="mb-4">
          {/* 家族アイコン */}
          <Avatar
            size={80}
            radius="md"
            color={iconColor || "blue"}
          >
            <IconUsers size={48} />
          </Avatar>
          
          {/* 家族名とハンドル */}
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text size="xl" fw={700}>
              {familyName}
            </Text>
            <Text size="sm" c="dimmed">
              @{familyHandle}
            </Text>
          </Stack>
        </Group>

        {/* 紹介文 */}
        {introduction && (
          <Text size="sm" className="mb-4">
            {introduction}
          </Text>
        )}

        <Divider className="my-4" />

        {/* 統計情報 */}
        <Group justify="space-around">
          {/* 共有クエスト数 */}
          <Stack gap={4} align="center">
            <Group gap={4}>
              <IconShare size={20} />
              <Text size="sm" fw={600}>
                共有クエスト
              </Text>
            </Group>
            <Text size="xl" fw={700}>
              {publicQuestCount}
            </Text>
          </Stack>

          {/* お気に入り登録数 */}
          <Stack gap={4} align="center">
            <Group gap={4}>
              <IconHeart size={20} />
              <Text size="sm" fw={600}>
                お気に入り登録された
              </Text>
            </Group>
            <Text size="xl" fw={700}>
              {likeCount}
            </Text>
          </Stack>
        </Group>
      </Paper>

      {/* タイムラインセクション */}
      <Paper shadow="sm" p="md" radius="md" withBorder style={{ flex: 1, overflow: "auto" }}>
        {/* タイムラインヘッダー */}
        <Group className="mb-4">
          <IconCalendar size={24} />
          <Text size="lg" fw={600}>
            活動タイムライン
          </Text>
        </Group>

        {/* タイムラインアイテム一覧 */}
        <Stack gap="md">
          {timelines.length === 0 ? (
            <Text c="dimmed" ta="center" className="py-8">
              まだ活動がありません
            </Text>
          ) : (
            timelines.map((timeline) => (
              <TimelineItem
                key={timeline.family_timeline.id}
                profileName={timeline.profiles?.name}
                profileIconColor={timeline.profiles?.iconColor}
                message={timeline.family_timeline.message}
                createdAt={timeline.family_timeline.createdAt}
                url={timeline.family_timeline.url}
              />
            ))
          )}
        </Stack>
      </Paper>
    </Box>
  )
}
