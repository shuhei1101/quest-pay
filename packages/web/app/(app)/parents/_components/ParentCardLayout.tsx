import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { Parent } from "@/app/api/parents/query"
import { Badge, Card, Group, Text, Stack } from "@mantine/core"
import { calculateAge, formatDate } from "@/app/(core)/util"
import { useTheme } from "@/app/(core)/_theme/useTheme"

export const ParentCardLayout = ({parent, onClick, isSelected}: {
  parent: Parent,
  onClick: (parentId: string) => void,
  isSelected?: boolean
}) => {
  /** テーマ情報 */
  const { colors } = useTheme()

  const age = calculateAge(parent.profiles?.birthday)
  
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder
      onClick={() => onClick(parent.parents.id)}
      className={`cursor-pointer quest-card ${isSelected ? 'rainbow-border' : ''}`}
      style={{
        backgroundColor: colors.cardStyles.background,
        borderColor: colors.cardStyles.border,
      }}
    >
      {/* アイコンとプロフィール名 */}
      <Group mb="xs" align="center">
        <RenderIcon iconName={parent.icons?.name} iconColor={parent.profiles?.iconColor} size={40}/>
        <Text size="lg" fw={600} c={colors.textColors.primary}>{parent.profiles?.name}</Text>
      </Group>
      
      {/* 年齢と登録日 */}
      <Stack gap="xs">
        {age !== null && (
          <Text size="sm" c={colors.textColors.secondary}>年齢: {age}歳</Text>
        )}
        <Text size="sm" c={colors.textColors.secondary}>登録日: {formatDate(parent.parents.createdAt)}</Text>
      </Stack>
    </Card>
  )
}
