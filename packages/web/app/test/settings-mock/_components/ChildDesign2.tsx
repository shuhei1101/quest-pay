"use client"

import { Box, Card, Stack, Title, Text, Group, Grid, ThemeIcon, Badge, Progress, Avatar } from "@mantine/core"
import { IconUser, IconBell, IconTarget, IconShield, IconTrophy, IconStar } from "@tabler/icons-react"
import { useState } from "react"

/** 子供用設定デザイン2: カラフルカード形式 */
export const ChildDesign2 = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const settingsCards = [
    {
      id: "profile",
      title: "プロフィール",
      description: "名前とアイコンを変更しよう",
      icon: IconUser,
      gradient: { from: "blue", to: "cyan" },
      badge: "Level 5",
    },
    {
      id: "notification",
      title: "通知",
      description: "大事なお知らせを受け取ろう",
      icon: IconBell,
      gradient: { from: "orange", to: "yellow" },
      badge: "5件オン",
    },
    {
      id: "goals",
      title: "目標",
      description: "貯金の目標を設定しよう",
      icon: IconTarget,
      gradient: { from: "green", to: "lime" },
      badge: "62.5%",
    },
    {
      id: "achievements",
      title: "実績",
      description: "クリアした実績を見よう",
      icon: IconTrophy,
      gradient: { from: "grape", to: "pink" },
      badge: "15個",
    },
    {
      id: "privacy",
      title: "プライバシー",
      description: "公開する情報を選ぼう",
      icon: IconShield,
      gradient: { from: "indigo", to: "blue" },
      badge: null,
    },
    {
      id: "favorites",
      title: "お気に入り",
      description: "好きなクエストを登録",
      icon: IconStar,
      gradient: { from: "yellow", to: "orange" },
      badge: "3件",
    },
  ]

  return (
    <Box p="md">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group gap="md">
            <Avatar size={70} radius="xl" color="blue" />
            <Box style={{ flex: 1 }}>
              <Text fw={700} size="xl">
                太郎
              </Text>
              <Badge size="lg" variant="gradient" gradient={{ from: "blue", to: "cyan" }} mb="xs">
                Level 5
              </Badge>
              <Progress value={75} size="sm" radius="xl" striped animated />
              <Text size="xs" c="dimmed" mt={4}>
                あと250XPでレベル6
              </Text>
            </Box>
          </Group>
        </Card>

        {/* 設定カード */}
        <Grid gutter="md">
          {settingsCards.map((card) => (
            <Grid.Col key={card.id} span={{ base: 6, sm: 6, md: 4 }}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  transform: selectedCard === card.id ? "scale(0.98)" : "scale(1)",
                }}
                onClick={() => setSelectedCard(card.id)}
              >
                <Stack gap="md" align="center">
                  <ThemeIcon
                    size={60}
                    radius="xl"
                    variant="gradient"
                    gradient={card.gradient}
                  >
                    <card.icon size={32} />
                  </ThemeIcon>
                  <Box style={{ textAlign: "center" }}>
                    <Text fw={600} size="md" mb={4}>
                      {card.title}
                    </Text>
                    {card.badge && (
                      <Badge size="sm" variant="light" mb={4}>
                        {card.badge}
                      </Badge>
                    )}
                    <Text size="xs" c="dimmed">
                      {card.description}
                    </Text>
                  </Box>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {selectedCard && (
          <Card shadow="md" padding="lg" radius="md" withBorder>
            <Text fw={600} size="lg" mb="md">
              {settingsCards.find((c) => c.id === selectedCard)?.title}の設定
            </Text>
            <Text c="dimmed" size="sm">
              ここに{settingsCards.find((c) => c.id === selectedCard)?.title}
              の詳細な設定項目が表示されます。
            </Text>
          </Card>
        )}
      </Stack>
    </Box>
  )
}
