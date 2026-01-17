"use client"

import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { Parent } from "@/app/api/parents/query"
import { Badge, Card, Group, Text } from "@mantine/core"
import { useTheme } from "@/app/(core)/_theme/useTheme"

export const ParentCardLayout = ({parent, onClick, isSelected}: {
  parent: Parent,
  onClick: (parentId: string) => void,
  isSelected?: boolean
}) => {
  const { colors } = useTheme()
  
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder
      onClick={() => onClick(parent.parents.id)}
      className={`cursor-pointer quest-card ${isSelected ? 'rainbow-border' : ''}`}
      style={{ backgroundColor: colors.backgroundColors.card }}
    >
      <Group mb="xs">
        <Badge color={colors.buttonColors.primary}>{parent.profiles?.name}</Badge>
        <RenderIcon iconName={parent.icons?.name} iconColor={parent.profiles?.iconColor}/>
      </Group>
      <Text size="sm" mb="xs" style={{ color: colors.textColors.primary }}>{parent.profiles?.name}</Text>
    </Card>
  )
}
