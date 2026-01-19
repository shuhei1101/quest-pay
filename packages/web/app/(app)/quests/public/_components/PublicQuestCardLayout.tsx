"use client"

import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { PublicQuest } from "@/app/api/quests/public/query"
import { Badge, Card, Group, Text, Stack, Flex } from "@mantine/core"
import { IconHeart, IconMessageCircle } from "@tabler/icons-react"
import { formatAgeRange, formatMonthRange } from "@/app/(core)/util"
import { usePublicQuestLikeCount } from "../_hooks/usePublicQuestLikeCount"

/** 公開クエストカードレイアウトコンポーネント */
export const PublicQuestCardLayout = ({publicQuest, onClick}: {
  publicQuest: PublicQuest,
  onClick: (questId: string) => void
}) => {
  // レベル1の報酬を取得する
  const level1Detail = publicQuest.details.find(d => d.level === 1)
  const reward = level1Detail?.reward ?? 0
  
  // 年齢範囲を取得する
  const ageRange = formatAgeRange(publicQuest.quest.ageFrom, publicQuest.quest.ageTo)
  
  // 月範囲を取得する
  const monthRange = formatMonthRange(publicQuest.quest.monthFrom, publicQuest.quest.monthTo)
  
  // いいね数を取得する
  const { likeCount } = usePublicQuestLikeCount({publicQuestId: publicQuest.base.id})
  
  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder
      onClick={() => onClick(publicQuest.base.id)}
      className="cursor-pointer quest-card hover:shadow-md transition-shadow"
      style={{ borderColor: publicQuest.quest.iconColor || undefined }}
    >
      {/* カードヘッダー部分 */}
      <Flex justify="space-between" align="flex-start" mb="xs">
        <Group gap="md" style={{ flex: 1 }}>
          {/* アイコン */}
          <RenderIcon 
            iconName={publicQuest.icon?.name} 
            size={40} 
            iconColor={publicQuest.quest.iconColor}
          />
          
          {/* クエスト名と基本情報 */}
          <Stack gap={4} style={{ flex: 1 }}>
            <Text fw={700} size="md" lineClamp={1}>
              {publicQuest.quest.name}
            </Text>
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                {ageRange}
              </Text>
              <Text size="xs" fw={500}>
                {reward}円〜
              </Text>
            </Group>
          </Stack>
        </Group>
        
        {/* いいね数とコメント数 */}
        <Group gap="xs">
          <Group gap={4}>
            <IconHeart size={16} color="red" />
            <Text size="xs" fw={500}>{likeCount}</Text>
          </Group>
          
          {/* TODO: コメント数をAPIから取得して表示する */}
          <Group gap={4}>
            <IconMessageCircle size={16} />
            <Text size="xs" fw={500}>0</Text>
          </Group>
        </Group>
      </Flex>
      
      {/* タグと対象月 */}
      <Group gap="xs" mb="xs">
        {publicQuest.tags.slice(0, 3).map((tag) => (
          <Badge key={tag.id} size="sm" variant="light">
            {tag.name}
          </Badge>
        ))}
        {monthRange && (
          <Badge size="sm" variant="outline" color="gray">
            {monthRange}
          </Badge>
        )}
      </Group>
      
      {/* 共有元の家族 */}
      <Group gap={4}>
        {publicQuest.familyIcon && (
          <RenderIcon 
            iconName={publicQuest.familyIcon.name} 
            size={16} 
            iconColor={publicQuest.family?.iconColor}
          />
        )}
        <Text size="xs" c="dimmed">
          {publicQuest.family?.onlineName || "不明な家族"}
        </Text>
      </Group>
    </Card>
  )
}
