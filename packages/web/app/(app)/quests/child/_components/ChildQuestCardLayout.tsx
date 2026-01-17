import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { ChildQuest } from "@/app/api/quests/family/[id]/child/query"
import { Badge, Card, Group, Text, Progress, Stack } from "@mantine/core"
import { formatRelativeTime } from "@/app/(core)/util"
import { IconStar } from "@tabler/icons-react"

/** 子供クエストカードレイアウトコンポーネント */
export const ChildQuestCardLayout = ({childQuest, onClick}: {
  childQuest: ChildQuest,
  onClick: (questId: string) => void
}) => {
  // 子供クエスト情報を取得する（最初の子供の情報を使用）
  const questChild = childQuest.children[0]
  
  // 子供情報がない場合はプレースホルダーを表示する
  if (!questChild) {
    return (
      <Card 
        shadow="sm" 
        padding="md" 
        radius="md" 
        withBorder
        className="quest-card"
        style={{ opacity: 0.6 }}
      >
        <Text c="dimmed" ta="center">
          クエストデータが見つかりません
        </Text>
      </Card>
    )
  }
  
  // 現在のレベルの詳細情報を取得する
  const currentLevelDetail = childQuest.details.find(d => d.level === questChild.level)
  
  // 報酬と経験値を取得する
  const reward = currentLevelDetail?.reward ?? 0
  const exp = currentLevelDetail?.childExp ?? 0
  
  // 進捗状況を計算する
  const requiredCompletionCount = currentLevelDetail?.requiredCompletionCount ?? 1
  const currentCompletionCount = questChild.currentCompletionCount ?? 0
  const completionProgress = (currentCompletionCount / requiredCompletionCount) * 100
  
  // 次レベルまでの情報を取得する
  const requiredClearCount = currentLevelDetail?.requiredClearCount ?? 1
  const currentClearCount = questChild.currentClearCount ?? 0
  const remainingClearCount = Math.max(0, requiredClearCount - currentClearCount)
  
  // ステータスに応じた色を設定する
  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started": return "gray"
      case "in_progress": return "blue"
      case "pending_review": return "yellow"
      case "completed": return "green"
      default: return "gray"
    }
  }
  
  // ステータスに応じたラベルを設定する
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not_started": return "未着手"
      case "in_progress": return "進行中"
      case "pending_review": return "報告中"
      case "completed": return "完了"
      default: return status
    }
  }
  
  // 最終更新日を取得する
  const lastUpdated = formatRelativeTime(questChild.statusUpdatedAt)
  
  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder
      onClick={() => onClick(childQuest.base.id)}
      className="cursor-pointer quest-card hover:shadow-md transition-shadow"
      style={{ borderColor: childQuest.quest.iconColor || undefined }}
    >
      {/* カードヘッダー部分 */}
      <Group justify="space-between" mb="xs">
        {/* アイコン */}
        <RenderIcon 
          iconName={childQuest.icon?.name} 
          size={48} 
          iconColor={childQuest.quest.iconColor}
        />
        
        {/* レベルとステータスバッジ */}
        <Stack gap="xs" align="flex-end">
          <Badge size="lg" variant="filled">
            Lv.{questChild.level}
          </Badge>
          <Badge size="sm" color={getStatusColor(questChild.status)}>
            {getStatusLabel(questChild.status)}
          </Badge>
        </Stack>
      </Group>
      
      {/* クエスト名 */}
      <Text fw={700} size="lg" mb="xs" lineClamp={2}>
        {childQuest.quest.name}
      </Text>
      
      {/* 報酬と経験値 */}
      <Group gap="md" mb="xs">
        <Text size="sm" fw={500}>
          報酬: {reward}円
        </Text>
        <Group gap={4}>
          <IconStar size={16} color="gold" fill="gold" />
          <Text size="sm" fw={500}>
            {exp} EXP
          </Text>
        </Group>
      </Group>
      
      {/* 進捗状況 */}
      <Stack gap="xs" mb="xs">
        <Text size="sm" c="dimmed">
          進捗: {currentCompletionCount}/{requiredCompletionCount}回達成
        </Text>
        <Progress 
          value={completionProgress} 
          size="sm" 
          radius="xl"
          color={getStatusColor(questChild.status)}
        />
      </Stack>
      
      {/* 次レベルまで */}
      {remainingClearCount > 0 && (
        <Text size="xs" c="dimmed" mb="xs">
          次のレベルまであと{remainingClearCount}回
        </Text>
      )}
      
      {/* 最終更新日 */}
      <Text size="xs" c="dimmed" ta="right">
        {lastUpdated}
      </Text>
    </Card>
  )
}
