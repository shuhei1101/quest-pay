"use client"

import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { FamilyQuest } from "@/app/api/quests/family/query"
import { Badge, Card, Group, Text } from "@mantine/core"
import { useTheme } from "@/app/(core)/_theme/useTheme"

/** 家族クエストカードレイアウトコンポーネント */
export const FamilyQuestCardLayout = ({familyQuest, onClick}: {
  familyQuest: FamilyQuest,
  onClick: (questId: string) => void
}) => {
  const { theme } = useTheme()
  
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder
      onClick={() => onClick(familyQuest.base.id)}
      className="cursor-pointer quest-card"
      style={{ backgroundColor: theme.backgroundColors.card }}
    >
      <Group mb="xs">
        <Badge color={theme.buttonColors.primary}>{familyQuest.quest.name}</Badge>
        <RenderIcon iconName={familyQuest.icon?.name} size={familyQuest.icon?.size ?? undefined}  iconColor={familyQuest.quest.iconColor}/>
      </Group>
      <Text size="sm" mb="xs" style={{ color: theme.textColors.primary }}>{familyQuest.quest.name}</Text>
    </Card>
  )
}
