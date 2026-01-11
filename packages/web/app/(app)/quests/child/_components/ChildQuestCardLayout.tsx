import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { ChildQuest } from "@/app/api/quests/child/query"
import { Badge, Card, Group, Text } from "@mantine/core"

/** 子供クエストカードレイアウトコンポーネント */
export const ChildQuestCardLayout = ({childQuest, onClick}: {
  childQuest: ChildQuest,
  onClick: (questId: string) => void
}) => (
  <Card shadow="sm" padding="md" radius="md" withBorder
    onClick={() => onClick(childQuest.base.id)}
    className="cursor-pointer quest-card"
  >
    <Group mb="xs">
      <Badge color="pink">{childQuest.quest.name}</Badge>
      <RenderIcon iconName={childQuest.icon?.name} size={childQuest.icon?.size ?? undefined}  iconColor={childQuest.quest.iconColor}/>
    </Group>
    <Text size="sm" mb="xs">{childQuest.quest.name}</Text>
  </Card>
)
