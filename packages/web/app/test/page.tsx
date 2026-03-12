"use client"

import { Card, Text, SimpleGrid, Badge, Group } from "@mantine/core"
import { 
  IconHome, 
  IconSettings, 
  IconBrandStripe,
  IconAlertTriangle,
  IconMenu2
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { 
  TEST_FAMILY_PROFILE_MOCK_URL,
  TEST_SETTINGS_MOCK_URL,
  TEST_STRIPE_TEST_URL,
  TEST_ERROR_UNKNOWN_URL,
  TEST_SIDE_MENU_URL
} from "@/app/(core)/endpoints"

type MockItem = {
  title: string
  description: string
  url: string
  icon: React.ReactNode
  badge?: string
}

export default function MockListPage() {
  const router = useRouter()

  const mockItems: MockItem[] = [
    {
      title: "家族プロフィールモック",
      description: "家族プロフィール画面のモック",
      url: TEST_FAMILY_PROFILE_MOCK_URL,
      icon: <IconHome size={32} />,
      badge: "UI"
    },
    {
      title: "設定モック",
      description: "設定画面のモック",
      url: TEST_SETTINGS_MOCK_URL,
      icon: <IconSettings size={32} />,
      badge: "UI"
    },
    {
      title: "Stripeテスト",
      description: "Stripe決済のテスト",
      url: TEST_STRIPE_TEST_URL,
      icon: <IconBrandStripe size={32} />,
      badge: "Integration"
    },
    {
      title: "エラー: 不明",
      description: "不明なエラー画面のモック（3つのレイアウト）",
      url: TEST_ERROR_UNKNOWN_URL,
      icon: <IconAlertTriangle size={32} />,
      badge: "Test"
    },
    {
      title: "サイドメニュー",
      description: "サイドメニューのデザインバリエーション（4つ）",
      url: TEST_SIDE_MENU_URL,
      icon: <IconMenu2 size={32} />,
      badge: "UI"
    }
  ]

  return (
    <div className="p-4">
      <Text size="xl" fw={700} mb="md">モック画面一覧</Text>
      <Text size="sm" c="dimmed" mb="xl">
        UI/UX検証、プロトタイピング用のモック画面です
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {mockItems.map((item) => (
          <Card
            key={item.url}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(item.url)}
          >
            <Group justify="space-between" mb="xs">
              <div className="text-blue-600">{item.icon}</div>
              {item.badge && (
                <Badge color="blue" variant="light" size="sm">
                  {item.badge}
                </Badge>
              )}
            </Group>

            <Text fw={500} size="lg" mb="xs">
              {item.title}
            </Text>

            <Text size="sm" c="dimmed">
              {item.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  )
}
