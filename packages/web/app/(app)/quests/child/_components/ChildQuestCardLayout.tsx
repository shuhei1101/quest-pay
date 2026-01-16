"use client"

import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { ChildQuest } from "@/app/api/quests/family/[id]/child/query"
import { Badge, Card, Group, Text } from "@mantine/core"
import { useTheme } from "@/app/(core)/_theme/useTheme"

/** 子供クエストカードレイアウトコンポーネント */
export const ChildQuestCardLayout = ({childQuest, onClick}: {
  childQuest: ChildQuest,
  onClick: (questId: string) => void
}) => {
  const { colors } = useTheme()
  
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder
      onClick={() => onClick(childQuest.base.id)}
      className="cursor-pointer quest-card"
      style={{ backgroundColor: colors.backgroundColors.card }}
    >
      <Group mb="xs">
        <Badge color={colors.buttonColors.primary}>{childQuest.quest.name}</Badge>
        <RenderIcon iconName={childQuest.icon?.name} size={childQuest.icon?.size ?? undefined}  iconColor={childQuest.quest.iconColor}/>
      </Group>
      <Text size="sm" mb="xs" style={{ color: colors.textColors.primary }}>{childQuest.quest.name}</Text>
    </Card>
  )
}
