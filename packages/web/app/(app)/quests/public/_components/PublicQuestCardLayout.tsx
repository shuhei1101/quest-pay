import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { PublicQuest } from "@/app/api/quests/public/query"
import { Badge, Card, Group, Text, Stack, Box } from "@mantine/core"
import { IconHeart, IconMessageCircle } from "@tabler/icons-react"
import { formatAgeRange, formatMonthRange } from "@/app/(core)/util"

/** 公開クエストカードレイアウトコンポーネント */
export const PublicQuestCardLayout = ({publicQuest, onClick}: {
  publicQuest: PublicQuest,
  onClick: (questId: string) => void
}) => {
  // レベル1の報酬を取得する
  const level1Detail = publicQuest.details.find(d => d.level === 1)
  const reward = level1Detail?.reward ?? 0
  
  // 年齢範囲を取得する
  const ageRange = formatAgeRange(publicQuest.quest.ageFrom, publicQuest.quest.ageTo)
  
  // 月範囲を取得する
  const monthRange = formatMonthRange(publicQuest.quest.monthFrom, publicQuest.quest.monthTo)
  
  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder
      onClick={() => onClick(publicQuest.base.id)}
      className="cursor-pointer quest-card hover:shadow-md transition-shadow"
      style={{ borderColor: publicQuest.quest.iconColor || undefined }}
    >
      {/* カードヘッダー部分 */}
      <Group justify="space-between" mb="xs">
        {/* アイコン */}
        <RenderIcon 
          iconName={publicQuest.icon?.name} 
          size={48} 
          iconColor={publicQuest.quest.iconColor}
        />
        
        {/* いいね数とコメント数 */}
        <Group gap="xs">
          {/* TODO: いいね数をAPIから取得して表示する */}
          <Box style={{ position: "relative" }}>
            <IconHeart size={20} color="red" />
            <Text size="xs" style={{ position: "absolute", top: -5, right: -10 }}>0</Text>
          </Box>
          
          {/* TODO: コメント数をAPIから取得して表示する */}
          <Box style={{ position: "relative" }}>
            <IconMessageCircle size={20} />
            <Text size="xs" style={{ position: "absolute", top: -5, right: -10 }}>0</Text>
          </Box>
        </Group>
      </Group>
      
      {/* クエスト名 */}
      <Text fw={700} size="lg" mb="xs" lineClamp={2}>
        {publicQuest.quest.name}
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
      {publicQuest.tags.length > 0 && (
        <Group gap="xs" mb="xs">
          {publicQuest.tags.slice(0, 3).map((tag) => (
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
      
      {/* 共有元の家族 */}
      <Group gap="xs" mt="sm">
        {publicQuest.familyIcon && (
          <RenderIcon 
            iconName={publicQuest.familyIcon.name} 
            size={20} 
            iconColor={publicQuest.family?.iconColor}
          />
        )}
        <Text size="xs" c="dimmed">
          {publicQuest.family?.onlineName || "不明な家族"}
        </Text>
      </Group>
    </Card>
  )
}
