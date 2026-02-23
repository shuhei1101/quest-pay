import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { Child } from "@/app/api/children/query"
import { Avatar, Badge, Box, Group, Text, Stack } from "@mantine/core"
import { useTheme } from "@/app/(core)/_theme/useTheme"

export const ChildCardLayout = ({child, questStats, onClick, isSelected}: {
  child: Child,
  questStats?: {inProgressCount: number, completedCount: number},
  onClick: (childId: string) => void,
  isSelected?: boolean
}) => {
  /** テーマ情報 */
  const { colors } = useTheme()
  
  const handleClick = () => {
    if (child.children?.id) {
      onClick(child.children.id)
    }
  }
  
  return (
    <Box
      px="xs"
      py="sm"
      onClick={handleClick}
      className="cursor-pointer hover:bg-gray-50 transition-colors rounded"
      style={{
        backgroundColor: isSelected ? "#F0F4FF" : "transparent",
        borderLeft: isSelected ? "3px solid #667eea" : "3px solid transparent"
      }}
    >
      <Group gap="sm" wrap="nowrap">
        <Avatar
          size={32}
          radius="xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          }}
        >
          <RenderIcon iconName={child.icons?.name} iconColor="#FFFFFF" size={20} />
        </Avatar>
        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs" wrap="nowrap">
            <Text size="sm" fw={500} truncate style={{ flex: 1 }} c={colors.textColors.primary}>{child.profiles?.name}</Text>
            <Badge size="xs" color="violet" variant="light">Lv.{child.children?.currentLevel ?? 1}</Badge>
          </Group>
        </Stack>
      </Group>
    </Box>
  )
}
