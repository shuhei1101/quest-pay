import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { TemplateQuest } from "@/app/api/quests/template/query"
import { Badge, Card, Group, Text } from "@mantine/core"
import { formatAgeRange, formatMonthRange, formatRelativeTime } from "@/app/(core)/util"

/** テンプレートクエストカードレイアウトコンポーネント */
export const TemplateQuestCardLayout = ({templateQuest, onClick}: {
  templateQuest: TemplateQuest,
  onClick: (questId: string) => void
}) => {
  // レベル1の報酬を取得する
  const level1Detail = templateQuest.details.find(d => d.level === 1)
  const reward = level1Detail?.reward ?? 0
  
  // 年齢範囲を取得する
  const ageRange = formatAgeRange(templateQuest.quest.ageFrom, templateQuest.quest.ageTo)
  
  // 月範囲を取得する
  const monthRange = formatMonthRange(templateQuest.quest.monthFrom, templateQuest.quest.monthTo)
  
  // 保存日を取得する
  const savedDate = formatRelativeTime(templateQuest.base.createdAt)
  
  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder
      onClick={() => onClick(templateQuest.base.id)}
      className="cursor-pointer quest-card hover:shadow-md transition-shadow"
      style={{ borderColor: templateQuest.quest.iconColor || undefined }}
    >
      {/* カードヘッダー部分 */}
      <Group justify="space-between" mb="xs">
        {/* アイコン */}
        <RenderIcon 
          iconName={templateQuest.icon?.name} 
          size={48} 
          iconColor={templateQuest.quest.iconColor}
        />
        
        {/* 保存日 */}
        <Text size="xs" c="dimmed">
          {savedDate}に保存
        </Text>
      </Group>
      
      {/* クエスト名 */}
      <Text fw={700} size="lg" mb="xs" lineClamp={2}>
        {templateQuest.quest.name}
      </Text>
      
      {/* 対象年齢 */}
      <Text size="sm" c="dimmed" mb="xs">
        対象年齢: {ageRange}
      </Text>
      
      {/* 報酬の目安 */}
      <Text size="sm" fw={500} mb="xs">
        報酬: {reward}円〜
      </Text>
      
      {/* タグ */}
      {templateQuest.tags.length > 0 && (
        <Group gap="xs" mb="xs">
          {templateQuest.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} size="sm" variant="light">
              {tag.name}
            </Badge>
          ))}
        </Group>
      )}
      
      {/* 対象月 */}
      {monthRange && (
        <Text size="xs" c="dimmed" mb="xs">
          {monthRange}
        </Text>
      )}
      
      {/* 保存元の家族 */}
      {templateQuest.family && (
        <Group gap="xs" mt="sm">
          {templateQuest.familyIcon && (
            <RenderIcon 
              iconName={templateQuest.familyIcon.name} 
              size={20} 
              iconColor={templateQuest.family.iconColor}
            />
          )}
          <Text size="xs" c="dimmed">
            {templateQuest.family.onlineName || "不明な家族"}
          </Text>
        </Group>
      )}
    </Card>
  )
}
