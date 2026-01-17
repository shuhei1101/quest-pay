"use client"

import { Badge, Box, Divider, Group, Paper, Rating, ScrollArea, Stack, Text } from "@mantine/core"
import { IconCategory, IconChartBar, IconCoin, IconRepeat, IconSparkles, IconTarget } from "@tabler/icons-react"
import { LevelIcon } from "@/app/(core)/_components/LevelIcon"
import { useTheme } from "@/app/(core)/_theme/useTheme"

/** クエスト条件タブ */
export const QuestConditionTab = ({
  level,
  maxLevel = 5,
  category,
  successCondition,
  requiredCompletionCount,
  currentCompletionCount,
  reward,
  exp,
  type,
}: {
  level: number
  maxLevel?: number
  category: string
  successCondition: string
  requiredCompletionCount: number
  currentCompletionCount?: number
  reward: number
  exp: number
  type?: "parent" | "child" | "online"
}) => {
  const { colors } = useTheme()
  
  return (
    <Stack gap="md" className="overflow-y-auto">
      {/* クエストレベル */}
      <Box>
        <Group gap="xs" mb={4}>
          <LevelIcon size={20} />
          <Text fw={500}>クエストレベル</Text>
        </Group>
        <Group justify="end">
          <Rating value={level} count={maxLevel} readOnly size="lg" />
        </Group>
      </Box>

      <Divider />

      {/* クエストカテゴリ */}
      <Box>
        <Group gap="xs" mb={4}>
          <IconCategory size={20} />
          <Text fw={500}>クエストカテゴリ</Text>
        </Group>
        <Text ta="right" c="dimmed">{category}</Text>
      </Box>

      <Divider />

      {/* 成功条件 */}
      <Box>
        <Group gap="xs" mb={4}>
          <IconTarget size={20} />
          <Text fw={500}>成功条件</Text>
        </Group>
          <ScrollArea p="sm" h={100} type="auto" style={{ backgroundColor: "#ffffff20" }}>
            <Text size="sm" style={{ whiteSpace: "pre-line" }}>{successCondition}</Text>
          </ScrollArea>
      </Box>

      {/* 必要達成回数 */}
      <Box>
        <Group gap="xs" mb={4}>
          <IconRepeat size={20} />
          <Text fw={500}>必要達成回数</Text>
        </Group>
        {type === "child" && currentCompletionCount !== undefined ? (
          // 現在の達成状況（子供のみ表示）
          <Group justify="flex-end" gap="xs">
            <Badge variant="filled" color={colors.buttonColors.success} size="lg">
              {currentCompletionCount}/{requiredCompletionCount}回クリア
            </Badge>
          </Group>
        ) : (
          // 通常表示
          <Text ta="right" fw={600}>{requiredCompletionCount}回</Text>
        )}
      </Box>

      {/* 報酬 */}
      <Box>
        <Group gap="xs" mb={4}>
          <IconCoin size={20} />
          <Text fw={500}>報酬</Text>
        </Group>
        <Text ta="right" fw={600} c="yellow.8" size="xl">{reward}円</Text>
      </Box>

      {/* 獲得経験値 */}
      <Box>
        <Group gap="xs" mb={4}>
          <IconSparkles size={20} />
          <Text fw={500}>獲得経験値</Text>
        </Group>
        <Text ta="right" fw={600} c="blue.6" size="lg">+{exp} EXP</Text>
      </Box>
    </Stack>
  )
}
