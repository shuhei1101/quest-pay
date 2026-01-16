import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { Child } from "@/app/api/children/query"
import { Badge, Card, Group, Text, Stack, Progress } from "@mantine/core"
import { calculateAge } from "@/app/(core)/util"

export const ChildCardLayout = ({child, questStats, onClick, isSelected}: {
  child: Child,
  questStats?: {inProgressCount: number, completedCount: number},
  onClick: (childId: string) => void,
  isSelected?: boolean
}) => {
  const age = calculateAge(child.profiles?.birthday)
  const currentSavings = child.children?.currentSavings ?? 0
  const minSavings = child.children?.minSavings ?? 0
  const savingsProgress = minSavings > 0 ? (currentSavings / minSavings) * 100 : 0
  
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder
      onClick={() => { if (child.children?.id) onClick(child.children.id) }}
      className={`cursor-pointer quest-card ${isSelected ? 'rainbow-border' : ''}`}
    >
      {/* アイコンとプロフィール名 */}
      <Group mb="xs" align="center">
        <RenderIcon iconName={child.icons?.name} iconColor={child.profiles?.iconColor} size={40}/>
        <Text size="lg" fw={600}>{child.profiles?.name}</Text>
      </Group>
      
      {/* レベルと年齢 */}
      <Group mb="xs" gap="md">
        <Badge color="blue" size="lg">Lv.{child.children?.currentLevel ?? 1}</Badge>
        {age !== null && (
          <Text size="sm" c="dimmed">年齢: {age}歳</Text>
        )}
      </Group>
      
      {/* 貯金額 */}
      <Stack gap="xs" mb="xs">
        <Group gap="xs" align="center">
          <Text size="sm" fw={500}>💰 貯金額:</Text>
          <Text size="sm">¥{currentSavings.toLocaleString()} / ¥{minSavings.toLocaleString()}</Text>
        </Group>
        {minSavings > 0 && (
          <Progress value={savingsProgress} size="sm" color={savingsProgress >= 100 ? "green" : "blue"} />
        )}
      </Stack>
      
      {/* 経験値 */}
      <Group gap="xs" mb="xs">
        <Text size="sm" fw={500}>⭐ 経験値:</Text>
        <Text size="sm">{child.children?.totalExp ?? 0}</Text>
      </Group>
      
      {/* クエスト統計 */}
      {questStats && (
        <Group gap="md">
          <Group gap="xs">
            <Text size="sm" fw={500}>📋 進行中:</Text>
            <Text size="sm">{questStats.inProgressCount}件</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" fw={500}>完了:</Text>
            <Text size="sm">{questStats.completedCount}件</Text>
          </Group>
        </Group>
      )}
    </Card>
  )
}
