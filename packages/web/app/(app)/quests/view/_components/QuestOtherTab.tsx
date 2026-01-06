"use client"

import { Badge, Box, Divider, Group, Stack, Text } from "@mantine/core"
import { IconCalendar, IconChartBar, IconRepeat, IconTag, IconTrophy, IconUsers } from "@tabler/icons-react"

/** その他情報タブ */
export const QuestOtherTab = ({
  ageFrom,
  ageTo,
  monthFrom,
  monthTo,
  requiredClearCount,
  tags,
  type,
}: {
  ageFrom?: number | null
  ageTo?: number | null
  monthFrom?: number | null
  monthTo?: number | null
  requiredClearCount: number
  
  tags: string[]
  type?: "parent" | "child" | "online"
}) => {
  /** 年齢表示を生成する */
  const formatAge = () => {
    if (ageFrom && ageTo) return `${ageFrom}歳〜${ageTo}歳`
    if (ageFrom) return `${ageFrom}歳以上`
    if (ageTo) return `${ageTo}歳以下`
    return "制限なし"
  }

  /** 掲載期間表示を生成する */
  const formatPeriod = () => {
    if (monthFrom && monthTo) return `${monthFrom}月〜${monthTo}月`
    if (monthFrom) return `${monthFrom}月以降`
    if (monthTo) return `${monthTo}月まで`
    return "通年"
  }

  return (
    <Stack gap="md">
      {/* 受注可能年齢 */}
      <Box>
        <Group gap="xs" mb={4}>
          <IconUsers size={20} />
          <Text fw={500}>受注可能年齢</Text>
        </Group>
        <Text ta="right">{formatAge()}</Text>
      </Box>

      <Divider />

      {/* 掲載期間 */}
      <Box>
        <Group gap="xs" mb={4}>
          <IconCalendar size={20} />
          <Text fw={500}>掲載期間</Text>
        </Group>
        <Text ta="right">{formatPeriod()}</Text>
      </Box>

      <Divider />

      {/* レベルアップに必要なクリア回数 */}
      <Box>
        <Group gap="xs" mb={4}>
          <IconTrophy size={20} />
          <Text fw={500}>レベルUPに必要なクリア回数</Text>
        </Group>
        <Text ta="right">{requiredClearCount}回</Text>
      </Box>



      {/* タグ */}
      {tags.length > 0 && (
        <Box>
          <Group gap="xs" mb={4}>
            <IconTag size={20} />
            <Text fw={500}>タグ</Text>
          </Group>
          <Group gap="xs">
            {tags.map((tag, index) => (
              <Badge key={index} variant="light" color="blue">{tag}</Badge>
            ))}
          </Group>
        </Box>
      )}
      
      
      
    </Stack>
  )
}
