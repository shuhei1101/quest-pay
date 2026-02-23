import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { Parent } from "@/app/api/parents/query"
import { Avatar, Box, Group, Text, Stack } from "@mantine/core"
import { calculateAge } from "@/app/(core)/util"
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
    <Box
      px="xs"
      py="sm"
      onClick={() => onClick(parent.parents.id)}
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
          <RenderIcon iconName={parent.icons?.name} iconColor="#FFFFFF" size={20} />
        </Avatar>
        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" fw={500} truncate c={colors.textColors.primary}>{parent.profiles?.name}</Text>
          {age !== null && (
            <Text size="xs" c="dimmed">{age}歳</Text>
          )}
        </Stack>
      </Group>
    </Box>
  )
}
