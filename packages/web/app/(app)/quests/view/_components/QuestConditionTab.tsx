"use client"

import { Badge, Box, Divider, Group, Paper, Rating, ScrollArea, Slider, Stack, Text, Grid, Menu, ActionIcon } from "@mantine/core"
import { IconCategory, IconChartBar, IconCoin, IconRepeat, IconSparkles, IconTarget, IconChevronDown } from "@tabler/icons-react"
import { LevelIcon } from "@/app/(core)/_components/LevelIcon"
import { useWindow } from "@/app/(core)/useConstants"
import { QuestViewIcon } from "./QuestViewIcon"
import { useState } from "react"

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
  currentClearCount,
  requiredClearCount,
  iconName,
  iconSize,
  iconColor,
  availableLevels,
  onLevelChange,
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
  currentClearCount?: number
  requiredClearCount?: number
  iconName?: string
  iconSize?: number
  iconColor?: string
  availableLevels?: number[]
  onLevelChange?: (level: number) => void
}) => {

  const { isMobile, isDark } = useWindow()
  const [menuOpened, setMenuOpened] = useState(false)
  
  // レベル切り替えが可能かどうか
  const canChangeLevel = availableLevels && availableLevels.length > 1 && onLevelChange
 
  return (
    <Stack gap="md" className="overflow-x-hidden overflow-y-auto">
      {/* 上部：アイコンとレベル・カテゴリ */}
      <Grid gutter="md">
        {/* 左側：クエストアイコン（1の割合） */}
        <Grid.Col span={4}>
          <Box className="flex items-center justify-center h-full">
            <QuestViewIcon
              iconColor={iconColor}
              iconName={iconName}
              iconSize={iconSize ?? 48}
            />
          </Box>
        </Grid.Col>

        {/* 右側：レベルとカテゴリ（2の割合） */}
        <Grid.Col span={8}>
          <Stack gap="md">
            {/* クエストレベル */}
            <Box>
              <Group gap="xs" mb={4}>
                <LevelIcon size={20} />
                <Text fw={500}>クエストレベル</Text>
              </Group>
              
              {/* レベル選択メニュー */}
              {canChangeLevel ? (
                <Menu 
                  opened={menuOpened} 
                  onChange={setMenuOpened}
                  position="bottom-end"
                  width={200}
                >
                  <Menu.Target>
                    <Box 
                      style={{ 
                        cursor: "pointer",
                        borderRadius: 8,
                        padding: "4px 8px",
                        transition: "background-color 0.2s",
                        backgroundColor: menuOpened 
                          ? (isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)")
                          : "transparent"
                      }}
                      onMouseEnter={(e) => {
                        if (!menuOpened) {
                          e.currentTarget.style.backgroundColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!menuOpened) {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }
                      }}
                    >
                      <Group justify="flex-end" gap="xs">
                        <Rating value={level} count={maxLevel} readOnly size="lg" />
                        <ActionIcon 
                          variant="subtle" 
                          size="sm"
                          color={isDark ? "gray" : "dark"}
                        >
                          <IconChevronDown size={16} />
                        </ActionIcon>
                      </Group>
                    </Box>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>レベルを選択</Menu.Label>
                    {availableLevels.map((lvl) => (
                      <Menu.Item
                        key={lvl}
                        onClick={() => onLevelChange(lvl)}
                        style={{
                          backgroundColor: lvl === level 
                            ? (isDark ? "rgba(255, 159, 0, 0.2)" : "rgba(255, 159, 0, 0.1)")
                            : undefined,
                          fontWeight: lvl === level ? 600 : undefined,
                        }}
                      >
                        <Group gap="xs">
                          <Rating value={lvl} count={maxLevel} readOnly size="sm" />
                          <Text size="sm">レベル {lvl}</Text>
                        </Group>
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Group justify="flex-end">
                  <Rating value={level} count={maxLevel} readOnly size="lg" />
                </Group>
              )}
              
              {/* レベルアップまでの進捗（子供用） */}
              {type === "child" && currentClearCount !== undefined && requiredClearCount !== undefined && requiredClearCount > 0 && (
                <Box mt={8} className="w-full flex flex-col items-end">
                  <Text size="sm" c="dimmed" mb={4}>
                    次レベルまで: {currentClearCount} / {requiredClearCount} 回クリア
                  </Text>
                  <Slider className={isMobile ? "w-full" : "w-1/2"}
                    value={Math.min(currentClearCount, requiredClearCount)}
                    max={requiredClearCount}
                    marks={[
                      { value: 0, label: '0' },
                      { value: requiredClearCount, label: `${requiredClearCount}` },
                    ]}
                    label={(value) => `${value}回`}
                    color="blue"
                    size="md"
                    disabled
                    styles={{
                      markLabel: { fontSize: '12px' },
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* クエストカテゴリ */}
            <Box>
              <Group gap="xs" mb={4}>
                <IconCategory size={20} />
                <Text fw={500}>クエストカテゴリ</Text>
              </Group>
              <Group justify="flex-end">
                <Text>{category}</Text>
              </Group>
            </Box>
          </Stack>
        </Grid.Col>
      </Grid>

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
