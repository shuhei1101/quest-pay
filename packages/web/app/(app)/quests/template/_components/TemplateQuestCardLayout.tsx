import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { TemplateQuest } from "@/app/api/quests/template/query"
import { Badge, Card, Group, Text } from "@mantine/core"

/** テンプレートクエストカードレイアウトコンポーネント */
export const TemplateQuestCardLayout = ({templateQuest, onClick}: {
  templateQuest: TemplateQuest,
  onClick: (questId: string) => void
}) => (
  <Card shadow="sm" padding="md" radius="md" withBorder
    onClick={() => onClick(templateQuest.base.id)}
    className="cursor-pointer quest-card"
  >
    <Group mb="xs">
      <Badge color="pink">{templateQuest.quest.name}</Badge>
      <RenderIcon iconName={templateQuest.icon?.name} size={templateQuest.icon?.size ?? undefined}  iconColor={templateQuest.quest.iconColor}/>
    </Group>
    <Text size="sm" mb="xs">{templateQuest.quest.name}</Text>
  </Card>
)
