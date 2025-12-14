import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon";
import { ParentView } from "@/app/api/parents/view";
import { Badge, Card, Group, Text } from "@mantine/core";

export const ParentCardLayout = ({parent, onClick, isSelected}: {
  parent: ParentView,
  onClick: (parentId: string) => void,
  isSelected?: boolean
}) => (
  <Card shadow="sm" padding="md" radius="md" withBorder
    onClick={() => onClick(parent.id)}
    className={`cursor-pointer quest-card ${isSelected ? 'rainbow-border' : ''}`}
  >
    <Group mb="xs">
      <Badge color="pink">{parent.name}</Badge>
      <RenderIcon iconName={parent.icon_name} iconColor={parent.icon_color}/>
    </Group>
    <Text size="sm" mb="xs">{parent.name}</Text>
  </Card>
)
