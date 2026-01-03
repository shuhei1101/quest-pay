"use client"

import { Box, Divider, Group, Paper, Rating, ScrollArea, Stack, Text } from "@mantine/core"
import { IconCategory, IconCoin, IconSparkles, IconTarget } from "@tabler/icons-react"
import { LevelIcon } from "@/app/(core)/_components/LevelIcon"

/** クエスト条件タブ */
export const QuestConditionTab = ({
  level,
  maxLevel = 5,
  category,
  successCondition,
  reward,
  exp,
}: {
  level: number
  maxLevel?: number
  category: string
  successCondition: string
  reward: number
  exp: number
}) => {
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
