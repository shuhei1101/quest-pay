import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { Child } from "@/app/api/children/query"
import { Badge, Card, Group, Text, Stack, Progress } from "@mantine/core"
import { calculateAge } from "@/app/(core)/util"
import { useTheme } from "@/app/(core)/_theme/useTheme"

export const ChildCardLayout = ({child, questStats, onClick, isSelected}: {
  child: Child,
  questStats?: {inProgressCount: number, completedCount: number},
  onClick: (childId: string) => void,
  isSelected?: boolean
}) => {
  /** テーマ情報 */
  const { colors } = useTheme()

  const age = calculateAge(child.profiles?.birthday)
  const currentSavings = child.children?.currentSavings ?? 0
  const minSavings = child.children?.minSavings ?? 0
  const savingsProgress = minSavings > 0 ? (currentSavings / minSavings) * 100 : 0
  
  const handleClick = () => {
    if (child.children?.id) {
      onClick(child.children.id)
    }
  }
  
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder
      onClick={handleClick}
      className={`cursor-pointer quest-card ${isSelected ? 'rainbow-border' : ''}`}
      style={{
        backgroundColor: colors.cardStyles.background,
        borderColor: colors.cardStyles.border,
      }}
    >
      {/* アイコンとプロフィール名 */}
      <Group mb="xs" align="center">
        <RenderIcon iconName={child.icons?.name} iconColor={child.profiles?.iconColor} size={40}/>
        <Text size="lg" fw={600} c={colors.textColors.primary}>{child.profiles?.name}</Text>
      </Group>
      
      {/* レベルと年齢 */}
      <Group mb="xs" gap="md">
        <Badge color="blue" size="lg">Lv.{child.children?.currentLevel ?? 1}</Badge>
        {age !== null && (
          <Text size="sm" c={colors.textColors.secondary}>年齢: {age}歳</Text>
        )}
      </Group>
      
      {/* 貯金額 */}
      <Stack gap="xs" mb="xs">
        <Group gap="xs" align="center">
          <Text size="sm" fw={500} c={colors.textColors.primary}>💰 貯金額:</Text>
          <Text size="sm" c={colors.textColors.primary}>¥{currentSavings.toLocaleString()}</Text>
        </Group>
        {minSavings > 0 && (
          <Progress value={savingsProgress} size="sm" color={savingsProgress >= 100 ? "green" : "blue"} />
        )}
      </Stack>
      
      {/* 経験値 */}
      <Group gap="xs" mb="xs">
        <Text size="sm" fw={500} c={colors.textColors.primary}>⭐ 経験値:</Text>
        <Text size="sm" c={colors.textColors.primary}>{child.children?.totalExp ?? 0}</Text>
      </Group>
      
      {/* クエスト統計 */}
      {questStats && (
        <Group gap="md">
          <Group gap="xs">
            <Text size="sm" fw={500} c={colors.textColors.primary}>📋 進行中:</Text>
            <Text size="sm" c={colors.textColors.primary}>{questStats.inProgressCount}件</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" fw={500} c={colors.textColors.primary}>完了:</Text>
            <Text size="sm" c={colors.textColors.primary}>{questStats.completedCount}件</Text>
          </Group>
        </Group>
      )}
    </Card>
  )
}
