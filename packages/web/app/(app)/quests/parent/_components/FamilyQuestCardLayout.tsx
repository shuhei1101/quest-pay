import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { FamilyQuest } from "@/app/api/quests/family/query"
import { Badge, Card, Group, Text } from "@mantine/core"

export const FamilyQuestCardLayout = ({familyQuest, onClick}: {
  familyQuest: FamilyQuest,
  onClick: (questId: string) => void
}) => (
  <Card shadow="sm" padding="md" radius="md" withBorder
    onClick={() => onClick(familyQuest.id)}
    className="cursor-pointer quest-card"
  >
    <Group mb="xs">
      <Badge color="pink">{familyQuest.quest.name}</Badge>
      <RenderIcon iconName={familyQuest.quest.icon?.name} size={familyQuest.quest.icon?.size ?? undefined}  iconColor={familyQuest.quest.iconColor}/>
    </Group>
    <Text size="sm" mb="xs">{familyQuest.quest.name}</Text>
  </Card>
)
