"use client"

import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { TemplateQuest } from "@/app/api/quests/template/query"
import { Badge, Card, Group, Text } from "@mantine/core"
import { useTheme } from "@/app/(core)/_theme/useTheme"

/** テンプレートクエストカードレイアウトコンポーネント */
export const TemplateQuestCardLayout = ({templateQuest, onClick}: {
  templateQuest: TemplateQuest,
  onClick: (questId: string) => void
}) => {
  const { colors } = useTheme()
  
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder
      onClick={() => onClick(templateQuest.base.id)}
      className="cursor-pointer quest-card"
      style={{ backgroundColor: colors.backgroundColors.card }}
    >
      <Group mb="xs">
        <Badge color={colors.buttonColors.primary}>{templateQuest.quest.name}</Badge>
        <RenderIcon iconName={templateQuest.icon?.name} size={templateQuest.icon?.size ?? undefined}  iconColor={templateQuest.quest.iconColor}/>
      </Group>
      <Text size="sm" mb="xs" style={{ color: colors.textColors.primary }}>{templateQuest.quest.name}</Text>
    </Card>
  )
}
