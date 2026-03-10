"use client"

import { Box, Card, Group, Stack, Text, SimpleGrid, ThemeIcon } from "@mantine/core"
import { IconCake, IconCalendar, IconChecklist, IconX } from "@tabler/icons-react"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { Parent } from "@/app/api/parents/query"
import { calculateAge, formatDate } from "@/app/(core)/util"
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

// dayjs のロケールを日本語に設定
dayjs.locale('ja')

/** 親閲覧画面レイアウト */
export const ParentViewLayout = ({
  parent,
  stats,
}: {
  parent: Parent | undefined
  stats?: {
    approvedCount: number
    rejectedCount: number
  }
}) => {
  // 年齢を計算する
  const age = calculateAge(parent?.profiles?.birthday)
  
  // 誕生日をフォーマットする
  const formattedBirthday = formatDate(parent?.profiles?.birthday)

  return (
    <Box>
      {/* プロフィールカード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Group gap="lg" align="center">
          <Box
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            <RenderIcon iconName={parent?.icons?.name} iconColor="#FFFFFF" size={50} />
          </Box>
          
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text size="2rem" fw={700}>{parent?.profiles?.name ?? ""}</Text>
            <Group gap="lg">
              {age !== null && (
                <Group gap="xs">
                  <IconCake size={20} color="#666" />
                  <Text size="sm" c="dimmed">{age}歳</Text>
                </Group>
              )}
              {formattedBirthday && (
                <Group gap="xs">
                  <IconCalendar size={20} color="#666" />
                  <Text size="sm" c="dimmed">{formattedBirthday}</Text>
                </Group>
              )}
            </Group>
          </Stack>
        </Group>
      </Card>

      {/* 承認・却下統計カード */}
      {stats && (
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
          <Text size="lg" fw={600} mb="md">承認・却下実績</Text>
          <SimpleGrid cols={2} spacing="md">
            <Box style={{ textAlign: "center" }}>
              <ThemeIcon size={50} radius="xl" variant="light" color="green" mb="xs">
                <IconChecklist size={28} />
              </ThemeIcon>
              <Text size="xs" c="dimmed">承認した回数</Text>
              <Text size="xl" fw={700}>{stats.approvedCount}</Text>
            </Box>
            <Box style={{ textAlign: "center" }}>
              <ThemeIcon size={50} radius="xl" variant="light" color="red" mb="xs">
                <IconX size={28} />
              </ThemeIcon>
              <Text size="xs" c="dimmed">却下した回数</Text>
              <Text size="xl" fw={700}>{stats.rejectedCount}</Text>
            </Box>
          </SimpleGrid>
        </Card>
      )}
    </Box>
  )
}
