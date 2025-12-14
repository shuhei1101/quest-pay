import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon";
import { ChildView } from "@/app/api/children/view";
import { Badge, Card, Group, Text } from "@mantine/core";

export const ChildCardLayout = ({child, onClick}: {
  child: ChildView,
  onClick: (childId: string) => void
}) => (
  <Card shadow="sm" padding="md" radius="md" withBorder
    onClick={() => onClick(child.id)}
    className="cursor-pointer quest-card"
  >
    <Group mb="xs">
      <Badge color="pink">{child.name}</Badge>
      <RenderIcon iconName={child.icon_name} iconColor={child.icon_color}/>
    </Group>
    <Text size="sm" mb="xs">{child.name}</Text>
  </Card>
)
