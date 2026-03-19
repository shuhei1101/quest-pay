'use client'

import { Box, Accordion, Card, Group, Stack, Text, Badge, ThemeIcon, SimpleGrid, Divider, Button } from "@mantine/core"
import { useState } from "react"
import { PageHeader } from "@/app/(core)/_components/PageHeader"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { formatDate } from "@/app/(core)/util"
import { IconHome, IconCalendar, IconId, IconUser, IconBabyCarriage, IconTrophy, IconChecklist, IconStar, IconCoin, IconGift } from "@tabler/icons-react"
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

dayjs.locale('ja')

/** モック用の家族データ型 */
type MockFamilyProfile = {
  id: string
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
  }
  questStats: {
    totalCount: number
    completedCount: number
    inProgressCount: number
  }
}

type PublicQuest = {
  id: string
  title: string
  description: string
  reward: number
  likes: number
}

type RewardTemplate = {
  id: string
  name: string
  type: string
  amount: number
}

/** サンプルデータ */
const mockFamily: MockFamilyProfile = {
  id: "mock-family-id-001",
  displayId: "tanaka-family",
  localName: "田中家",
  onlineName: "たなかファミリー",
  introduction: "みんなで協力して楽しくクエストをこなそう！家族の絆を大切にしています。",
  iconName: "IconHome",
  iconColor: "#667eea",
  createdAt: "2024-01-15T10:00:00Z",
  memberStats: {
    parentCount: 2,
    childCount: 3,
  },
  questStats: {
    totalCount: 125,
    completedCount: 98,
    inProgressCount: 27,
  },
}

const mockPublicQuests: PublicQuest[] = [
  {
    id: "1",
    title: "お部屋の掃除をしよう",
    description: "自分の部屋をきれいに整理整頓する",
    reward: 100,
    likes: 45,
  },
  {
    id: "2",
    title: "お風呂掃除",
    description: "浴槽と洗い場をピカピカにする",
    reward: 150,
    likes: 32,
  },
  {
    id: "3",
    title: "食器洗い",
    description: "夕食後の食器を洗って片付ける",
    reward: 80,
    likes: 28,
  },
]

const mockRewardTemplates: RewardTemplate[] = [
  {
    id: "1",
    name: "基本報酬セット",
    type: "固定額",
    amount: 500,
  },
  {
    id: "2",
    name: "クエスト達成ボーナス",
    type: "達成報酬",
    amount: 200,
  },
]

/** パターン2: アコーディオン方式 */
export const FamilyProfileAccordionMock = () => {
  const [family] = useState<MockFamilyProfile>(mockFamily)
  const [publicQuests] = useState<PublicQuest[]>(mockPublicQuests)
  const [rewardTemplates] = useState<RewardTemplate[]>(mockRewardTemplates)
  
  const formattedCreatedAt = formatDate(family.createdAt)
  const familyDays = dayjs().diff(dayjs(family.createdAt), 'day')

  return (
    <Box p="md">
      <PageHeader title="家族プロフィール（アコーディオン方式）" showProfileButton={false} />
      
      <div className="flex items-center gap-3 justify-end mb-4">
        <Button variant="filled">編集</Button>
      </div>

      {/* プロフィール情報（常に表示） */}
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
        <SimpleGrid cols={2} spacing="md">
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

      {/* アコーディオンセクション */}
      <Accordion variant="separated" radius="md">
        <Accordion.Item value="quests">
          <Accordion.Control icon={<IconStar size={20} />}>
            <Text fw={600} size="lg">公開クエスト一覧</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              {publicQuests.map((quest) => (
                <Card key={quest.id} padding="md" radius="md" withBorder style={{ backgroundColor: "#f8f9fa" }}>
                  <Group justify="space-between" mb="xs">
                    <Text fw={600} size="md">{quest.title}</Text>
                    <Badge color="grape" variant="light">{quest.reward}円</Badge>
                  </Group>
                  <Text size="sm" c="dimmed" mb="xs">{quest.description}</Text>
                  <Group gap="xs">
                    <IconStar size={16} color="#ffd700" />
                    <Text size="sm" c="dimmed">{quest.likes} いいね</Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="rewards">
          <Accordion.Control icon={<IconCoin size={20} />}>
            <Text fw={600} size="lg">報酬テンプレート</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              {rewardTemplates.map((template) => (
                <Card key={template.id} padding="md" radius="md" withBorder style={{ backgroundColor: "#fff9f0" }}>
                  <Group justify="space-between" mb="xs">
                    <Group gap="xs">
                      <IconGift size={20} color="#ff8c00" />
                      <Text fw={600} size="md">{template.name}</Text>
                    </Group>
                    <Badge color="orange" variant="light">{template.type}</Badge>
                  </Group>
                  <Text size="xl" fw={700} c="orange">{template.amount.toLocaleString()}円</Text>
                </Card>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  )
}
