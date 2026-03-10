"use client"

import { Box, Card, Stack, Title, Text, Group, Button, Grid, Badge } from "@mantine/core"
import { IconUser, IconBell, IconCoin, IconUsers } from "@tabler/icons-react"
import { useState } from "react"

/** 親用設定デザイン2: カードグリッド形式 */
export const ParentDesign2 = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const settingsCards = [
    {
      id: "profile",
      title: "プロフィール",
      description: "名前、アイコン、自己紹介を設定",
      icon: <IconUser size={32} />,
      color: "blue",
      badge: null,
    },
    {
      id: "notification",
      title: "通知",
      description: "通知の受け取り設定を管理",
      icon: <IconBell size={32} />,
      color: "orange",
      badge: "5件オン",
    },
    {
      id: "allowance",
      title: "お小遣い",
      description: "報酬額、承認設定など",
      icon: <IconCoin size={32} />,
      color: "green",
      badge: null,
    },
    {
      id: "family",
      title: "家族",
      description: "家族名、メンバー管理",
      icon: <IconUsers size={32} />,
      color: "grape",
      badge: "3人",
    },
  ]

  return (
    <Box p="md">
      <Stack gap="xl">
        <Box>
          <Title order={2}>設定</Title>
          <Text size="sm" c="dimmed" mt="xs">
            アカウントと家族の設定を管理
          </Text>
        </Box>

        <Grid gutter="md">
          {settingsCards.map((card) => (
            <Grid.Col key={card.id} span={{ base: 12, sm: 6, md: 6 }}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor:
                    selectedCard === card.id
                      ? "var(--mantine-color-gray-0)"
                      : undefined,
                  borderColor:
                    selectedCard === card.id
                      ? `var(--mantine-color-${card.color}-5)`
                      : undefined,
                  borderWidth: selectedCard === card.id ? 2 : 1,
                }}
                onClick={() => setSelectedCard(card.id)}
              >
                <Group justify="space-between" mb="md">
                  <Box
                    style={{
                      color: `var(--mantine-color-${card.color}-6)`,
                    }}
                  >
                    {card.icon}
                  </Box>
                  {card.badge && (
                    <Badge size="sm" variant="light" color={card.color}>
                      {card.badge}
                    </Badge>
                  )}
                </Group>
                <Text fw={600} size="lg" mb="xs">
                  {card.title}
                </Text>
                <Text size="sm" c="dimmed">
                  {card.description}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {selectedCard && (
          <Card shadow="md" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={3}>
                {settingsCards.find((c) => c.id === selectedCard)?.title}の設定
              </Title>
              <Text c="dimmed">
                ここに詳細な設定項目が表示されます。選択したカテゴリに応じた設定フォームが展開されます。
              </Text>
              <Group>
                <Button>保存</Button>
                <Button variant="default" onClick={() => setSelectedCard(null)}>
                  閉じる
                </Button>
              </Group>
            </Stack>
          </Card>
        )}
      </Stack>
    </Box>
  )
}
