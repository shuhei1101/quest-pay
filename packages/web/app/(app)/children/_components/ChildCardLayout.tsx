import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon";
import { Child } from "@/app/api/children/query";
import { Badge, Card, Group, Text } from "@mantine/core";

export const ChildCardLayout = ({child, onClick, isSelected}: {
  child: Child,
  onClick: (childId: string) => void,
  isSelected?: boolean
}) => (
  <Card shadow="sm" padding="md" radius="md" withBorder
    onClick={() => onClick(child.children.id)}
    className={`cursor-pointer quest-card ${isSelected ? 'rainbow-border' : ''}`}
  >
    <Group mb="xs">
      <Badge color="pink">{child.profiles?.name}</Badge>
      <RenderIcon iconName={child.icons?.name} iconColor={child.profiles?.iconColor}/>
    </Group>
    <Text size="sm" mb="xs">{child.profiles?.name}</Text>
  </Card>
)
