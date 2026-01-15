"use client"

import { Badge, Box, Divider, Group, Paper, Rating, ScrollArea, Stack, Text } from "@mantine/core"
import { IconCategory, IconChartBar, IconCoin, IconRepeat, IconSparkles, IconTarget } from "@tabler/icons-react"
import { LevelIcon } from "@/app/(core)/_components/LevelIcon"

/** 次レベルまでに必要な経験値を計算する */
const calculateRequiredExp = (currentLevel: number): number => {
  // レベルごとの必要経験値（仮の計算式）
  // TODO: 将来的にはDBや設定ファイルから取得する
  return currentLevel * 100
}

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
  childCurrentLevel,
  childTotalExp,
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
  childCurrentLevel?: number
  childTotalExp?: number
}) => {
  /** 現在のレベルでの経験値を計算する */
  const currentLevelExp = childCurrentLevel && childTotalExp !== undefined 
    ? (() => {
        let totalRequiredExp = 0
        for (let i = 1; i < childCurrentLevel; i++) {
          totalRequiredExp += calculateRequiredExp(i)
        }
        return childTotalExp - totalRequiredExp
      })()
    : undefined

  /** 次レベルまでに必要な経験値を計算する */
  const requiredExpForNextLevel = childCurrentLevel 
    ? calculateRequiredExp(childCurrentLevel)
    : undefined

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
        {/* 現在の経験値（子供用） */}
        {childCurrentLevel !== undefined && currentLevelExp !== undefined && requiredExpForNextLevel !== undefined && (
          <Text ta="right" size="sm" c="dimmed" mt={4}>
            現在の経験値: {currentLevelExp} / {requiredExpForNextLevel}
          </Text>
        )}
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
            <Badge variant="filled" color="green" size="lg">
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
