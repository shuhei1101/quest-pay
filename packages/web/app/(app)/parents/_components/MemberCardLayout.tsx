import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon";
import { FamilyQuestView } from "@/app/api/quests/family/view";
import { Badge, Card, Group, Text } from "@mantine/core";

export const MemberCardLayout = ({quest, onClick}: {
  quest: FamilyQuestView,
  onClick: (questId: string) => void
}) => (
  <Card shadow="sm" padding="md" radius="md" withBorder
    onClick={() => onClick(quest.id)}
    className="cursor-pointer quest-card"
  >
    <Group mb="xs">
      <Badge color="pink">{quest.name}</Badge>
      <RenderIcon iconName={quest.icon_name} size={quest.icon_size ?? undefined}  iconColor={quest.icon_color}/>
    </Group>
    <Text size="sm" mb="xs">{quest.name}</Text>
  </Card>
)
