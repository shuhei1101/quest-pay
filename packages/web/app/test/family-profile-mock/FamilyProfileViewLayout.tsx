"use client"

import { Box, Card, Group, Stack, Text, SimpleGrid, ThemeIcon, Badge, Divider } from "@mantine/core"
import { IconHome, IconUsers, IconCalendar, IconId, IconChecklist, IconCoin, IconUser, IconBabyCarriage, IconTrophy } from "@tabler/icons-react"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { formatDate } from "@/app/(core)/util"
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

// dayjs のロケールを日本語に設定
dayjs.locale('ja')

/** 家族プロフィール画面レイアウト */
export const FamilyProfileViewLayout = ({
  family,
}: {
  family: {
    displayId: string
    localName: string
    onlineName: string | null
    introduction: string
    iconName: string
    iconColor: string
    createdAt: string
    memberStats: {
      parentCount: number
      childCount: number
      totalCount: number
    }
    questStats: {
      totalCount: number
      completedCount: number
      inProgressCount: number
    }
    rewardStats: {
      totalReward: number
      monthlyReward: number
    }
  }
}) => {
  // 作成日をフォーマットする
  const formattedCreatedAt = formatDate(family.createdAt)
  
  // 家族の経過日数を計算
  const familyDays = dayjs().diff(dayjs(family.createdAt), 'day')

  return (
    <Box>
      {/* プロフィールカード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Group gap="lg" align="flex-start">
          <Box
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${family.iconColor} 0%, ${family.iconColor}dd 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            <RenderIcon iconName={family.iconName} iconColor="#FFFFFF" size={60} />
          </Box>
          
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group gap="sm" align="center">
              <Text size="2rem" fw={700}>{family.localName}</Text>
              {family.onlineName && (
                <Badge size="lg" variant="light" color="violet">
                  {family.onlineName}
                </Badge>
              )}
            </Group>
            
            <Text size="md" c="dimmed" style={{ whiteSpace: "pre-wrap" }}>
              {family.introduction}
            </Text>
            
            <Divider my="xs" />
            
            <Group gap="xl">
              <Group gap="xs">
                <IconId size={20} color="#666" />
                <Text size="sm" c="dimmed">ID: {family.displayId}</Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={20} color="#666" />
                <Text size="sm" c="dimmed">作成日: {formattedCreatedAt}</Text>
              </Group>
              <Group gap="xs">
                <IconHome size={20} color="#666" />
                <Text size="sm" c="dimmed">経過日数: {familyDays}日</Text>
              </Group>
            </Group>
          </Stack>
        </Group>
      </Card>

      {/* メンバー統計カード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text size="lg" fw={600} mb="md">メンバー構成</Text>
        <SimpleGrid cols={3} spacing="md">
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="blue" mb="xs">
              <IconUser size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">親</Text>
            <Text size="xl" fw={700}>{family.memberStats.parentCount}人</Text>
          </Box>
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="pink" mb="xs">
              <IconBabyCarriage size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">子供</Text>
            <Text size="xl" fw={700}>{family.memberStats.childCount}人</Text>
          </Box>
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="violet" mb="xs">
              <IconUsers size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">合計</Text>
            <Text size="xl" fw={700}>{family.memberStats.totalCount}人</Text>
          </Box>
        </SimpleGrid>
      </Card>

      {/* クエスト統計カード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text size="lg" fw={600} mb="md">クエスト実績</Text>
        <SimpleGrid cols={3} spacing="md">
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="grape" mb="xs">
              <IconTrophy size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">総クエスト数</Text>
            <Text size="xl" fw={700}>{family.questStats.totalCount}</Text>
          </Box>
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="green" mb="xs">
              <IconChecklist size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">完了</Text>
            <Text size="xl" fw={700}>{family.questStats.completedCount}</Text>
          </Box>
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="orange" mb="xs">
              <IconChecklist size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">進行中</Text>
            <Text size="xl" fw={700}>{family.questStats.inProgressCount}</Text>
          </Box>
        </SimpleGrid>
      </Card>

      {/* 報酬統計カード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text size="lg" fw={600} mb="md">報酬統計</Text>
        <Stack gap="md">
          <Card padding="md" radius="md" withBorder style={{ backgroundColor: "#FFF9C4" }}>
            <Group gap="xs" mb="xs">
              <IconCoin size={24} color="#F57C00" />
              <Text fw={600}>今月の報酬合計</Text>
            </Group>
            <Text size="2.5rem" fw={700} c="#F57C00">{family.rewardStats.monthlyReward.toLocaleString()}円</Text>
          </Card>
          
          <Card padding="md" radius="md" withBorder style={{ backgroundColor: "#E1F5FE" }}>
            <Group gap="xs" mb="xs">
              <IconCoin size={24} color="#0277BD" />
              <Text fw={600}>累計報酬</Text>
            </Group>
            <Text size="2rem" fw={700} c="#0277BD">{family.rewardStats.totalReward.toLocaleString()}円</Text>
          </Card>
        </Stack>
      </Card>
    </Box>
  )
}
