import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { FamilyQuest } from "@/app/api/quests/family/query"
import { Badge, Card, Group, Text, Avatar, Tooltip } from "@mantine/core"
import { IconWorld } from "@tabler/icons-react"

/** 家族クエストカードレイアウトコンポーネント */
export const FamilyQuestCardLayout = ({familyQuest, onClick}: {
  familyQuest: FamilyQuest,
  onClick: (questId: string) => void
}) => {
  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder
      onClick={() => onClick(familyQuest.base.id)}
      className="cursor-pointer quest-card hover:shadow-md transition-shadow"
      style={{ borderColor: familyQuest.quest.iconColor || undefined }}
    >
      {/* カードヘッダー部分 */}
      <Group justify="space-between" mb="xs">
        {/* アイコン */}
        <RenderIcon 
          iconName={familyQuest.icon?.name} 
          size={48} 
          iconColor={familyQuest.quest.iconColor}
        />
        
        {/* TODO: 公開ステータスを表示するため、publicQuestsテーブルとのjoinが必要 */}
        {/* 暫定で常に非表示 */}
      </Group>
      
      {/* クエスト名 */}
      <Text fw={700} size="lg" mb="xs" lineClamp={2}>
        {familyQuest.quest.name}
      </Text>
      
      {/* 受注している子供の人数とアイコン */}
      {familyQuest.children.length > 0 ? (
        <Group gap="xs" mb="xs">
          <Text size="sm" c="dimmed">
            受注中:
          </Text>
          <Avatar.Group spacing="sm">
            {familyQuest.children.slice(0, 3).map((child, index) => (
              <Tooltip key={child.id} label="受注中の子供">
                <Avatar 
                  size="sm" 
                  radius="xl"
                  style={{ cursor: "pointer" }}
                >
                  {/* TODO: 子供のアイコンを表示する場合は、子供情報も取得する必要がある */}
                  {index + 1}
                </Avatar>
              </Tooltip>
            ))}
            {familyQuest.children.length > 3 && (
              <Avatar size="sm" radius="xl">
                +{familyQuest.children.length - 3}
              </Avatar>
            )}
          </Avatar.Group>
        </Group>
      ) : (
        <Text size="sm" c="dimmed" mb="xs">
          受注なし
        </Text>
      )}
    </Card>
  )
}
