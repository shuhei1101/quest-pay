"use client"

import { Box, Stack, Group, Paper, Title, Text, Badge, Progress, Avatar, SimpleGrid, Card, ThemeIcon } from "@mantine/core"
import { IconBell, IconTarget, IconShield, IconSettings, IconStar, IconTrophy } from "@tabler/icons-react"
import { useState } from "react"

/** 子供用設定デザイン4: ダッシュボード＋クイック設定形式 */
export const ChildDesign4 = () => {
  const [quickSettings, setQuickSettings] = useState({
    notifications: true,
    privacy: true,
  })

  const stats = [
    { label: "レベル", value: "5", icon: IconStar, color: "blue" },
    { label: "貯金額", value: "12,500円", icon: IconTarget, color: "green" },
    { label: "達成率", value: "62.5%", icon: IconTrophy, color: "orange" },
  ]

  const settingsLinks = [
    {
      id: "profile",
      title: "プロフィール",
      description: "名前やアイコンを変更",
      icon: IconSettings,
      color: "blue",
    },
    {
      id: "notification",
      title: "通知設定",
      description: "お知らせの受け取り方",
      icon: IconBell,
      color: "orange",
    },
    {
      id: "goals",
      title: "目標設定",
      description: "貯金の目標を設定",
      icon: IconTarget,
      color: "green",
    },
    {
      id: "privacy",
      title: "プライバシー",
      description: "公開範囲を設定",
      icon: IconShield,
      color: "indigo",
    },
  ]

  return (
    <Box p="md">
      <Stack gap="xl">
        {/* ヘッダー - プロフィールサマリー */}
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group gap="lg">
            <Avatar size={80} radius="xl" color="blue">
              <Text size="xl" fw={700}>
                太
              </Text>
            </Avatar>
            <Box style={{ flex: 1 }}>
              <Text size="xl" fw={700} mb="xs">
                太郎
              </Text>
              <Badge size="lg" variant="gradient" gradient={{ from: "blue", to: "cyan" }} mb="sm">
                Level 5
              </Badge>
              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="xs" c="dimmed">
                    あと250XPでレベル6
                  </Text>
                  <Text size="xs" c="dimmed">
                    750 / 1000 XP
                  </Text>
                </Group>
                <Progress value={75} size="md" radius="xl" striped animated />
              </Box>
            </Box>
          </Group>
        </Paper>

        {/* 統計カード */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {stats.map((stat) => (
            <Paper key={stat.label} shadow="sm" p="md" radius="md" withBorder>
              <Group gap="sm">
                <ThemeIcon size={40} radius="md" variant="light" color={stat.color}>
                  <stat.icon size={24} />
                </ThemeIcon>
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase">
                    {stat.label}
                  </Text>
                  <Text size="lg" fw={700}>
                    {stat.value}
                  </Text>
                </Box>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        {/* クイック設定 */}
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Title order={4} mb="md">
            クイック設定
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Card
              padding="md"
              radius="md"
              withBorder
              style={{
                cursor: "pointer",
                backgroundColor: quickSettings.notifications
                  ? "var(--mantine-color-blue-0)"
                  : undefined,
              }}
              onClick={() =>
                setQuickSettings({
                  ...quickSettings,
                  notifications: !quickSettings.notifications,
                })
              }
            >
              <Group gap="sm">
                <ThemeIcon
                  size={36}
                  radius="md"
                  variant={quickSettings.notifications ? "filled" : "light"}
                  color="orange"
                >
                  <IconBell size={20} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" fw={600}>
                    通知
                  </Text>
                  <Text size="xs" c="dimmed">
                    {quickSettings.notifications ? "オン" : "オフ"}
                  </Text>
                </Box>
              </Group>
            </Card>
            <Card
              padding="md"
              radius="md"
              withBorder
              style={{
                cursor: "pointer",
                backgroundColor: quickSettings.privacy
                  ? "var(--mantine-color-indigo-0)"
                  : undefined,
              }}
              onClick={() =>
                setQuickSettings({ ...quickSettings, privacy: !quickSettings.privacy })
              }
            >
              <Group gap="sm">
                <ThemeIcon
                  size={36}
                  radius="md"
                  variant={quickSettings.privacy ? "filled" : "light"}
                  color="indigo"
                >
                  <IconShield size={20} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" fw={600}>
                    公開設定
                  </Text>
                  <Text size="xs" c="dimmed">
                    {quickSettings.privacy ? "公開中" : "非公開"}
                  </Text>
                </Box>
              </Group>
            </Card>
          </SimpleGrid>
        </Paper>

        {/* 詳細設定リンク */}
        <Box>
          <Title order={4} mb="md">
            詳細設定
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {settingsLinks.map((link) => (
              <Card
                key={link.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ cursor: "pointer" }}
                onClick={() => console.log(link.id)}
              >
                <Group gap="md">
                  <ThemeIcon size={48} radius="md" variant="light" color={link.color}>
                    <link.icon size={24} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={600} mb={4}>
                      {link.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {link.description}
                    </Text>
                  </Box>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </Stack>
    </Box>
  )
}
