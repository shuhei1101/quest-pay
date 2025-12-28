import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { Parent } from "@/app/api/parents/query"
import { Badge, Card, Group, Text } from "@mantine/core"

export const ParentCardLayout = ({parent, onClick, isSelected}: {
  parent: Parent,
  onClick: (parentId: string) => void,
  isSelected?: boolean
}) => (
  <Card shadow="sm" padding="md" radius="md" withBorder
    onClick={() => onClick(parent.parents.id)}
    className={`cursor-pointer quest-card ${isSelected ? 'rainbow-border' : ''}`}
  >
    <Group mb="xs">
      <Badge color="pink">{parent.profiles?.name}</Badge>
      <RenderIcon iconName={parent.icons?.name} iconColor={parent.profiles?.iconColor}/>
    </Group>
    <Text size="sm" mb="xs">{parent.profiles?.name}</Text>
  </Card>
)
