"use client"

import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { Child } from "@/app/api/children/query"
import { Badge, Card, Group, Text } from "@mantine/core"
import { useTheme } from "@/app/(core)/_theme/useTheme"

export const ChildCardLayout = ({child, onClick, isSelected}: {
  child: Child,
  onClick: (childId: string) => void,
  isSelected?: boolean
}) => {
  const { theme } = useTheme()
  
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder
      onClick={() => onClick(child.children.id)}
      className={`cursor-pointer quest-card ${isSelected ? 'rainbow-border' : ''}`}
      style={{ backgroundColor: theme.backgroundColors.card }}
    >
      <Group mb="xs">
        <Badge color={theme.buttonColors.primary}>{child.profiles?.name}</Badge>
        <RenderIcon iconName={child.icons?.name} iconColor={child.profiles?.iconColor}/>
      </Group>
      <Text size="sm" mb="xs" style={{ color: theme.textColors.primary }}>{child.profiles?.name}</Text>
    </Card>
  )
}
