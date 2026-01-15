"use client"

import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { PublicQuest } from "@/app/api/quests/public/query"
import { Badge, Card, Group, Text } from "@mantine/core"
import { useTheme } from "@/app/(core)/_theme/useTheme"

/** 公開クエストカードレイアウトコンポーネント */
export const PublicQuestCardLayout = ({publicQuest, onClick}: {
  publicQuest: PublicQuest,
  onClick: (questId: string) => void
}) => {
  const { theme } = useTheme()
  
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder
      onClick={() => onClick(publicQuest.base.id)}
      className="cursor-pointer quest-card"
      style={{ backgroundColor: theme.backgroundColors.card }}
    >
      <Group mb="xs">
        <Badge color={theme.buttonColors.primary}>{publicQuest.quest.name}</Badge>
        <RenderIcon iconName={publicQuest.icon?.name} size={publicQuest.icon?.size ?? undefined}  iconColor={publicQuest.quest.iconColor}/>
      </Group>
      <Text size="sm" mb="xs" style={{ color: theme.textColors.primary }}>{publicQuest.quest.name}</Text>
    </Card>
  )
}
