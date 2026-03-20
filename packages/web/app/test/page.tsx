"use client"

import { Card, Text, SimpleGrid, Badge, Group } from "@mantine/core"
import { 
  IconHome, 
  IconSettings, 
  IconBrandStripe,
  IconAlertTriangle,
  IconMenu2,
  IconArrowDown
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { 
  TEST_FAMILY_PROFILE_MOCK_URL,
  TEST_FAMILY_PROFILE_TABS_MOCK_URL,
  TEST_FAMILY_PROFILE_ACCORDION_MOCK_URL,
  TEST_FAMILY_PROFILE_SECTIONS_MOCK_URL,
  TEST_QUEST_VIEW_MOCK_URL,
  TEST_SETTINGS_MOCK_URL,
  TEST_STRIPE_TEST_URL,
  TEST_ERROR_UNKNOWN_URL,
  TEST_SIDE_MENU_URL,
  TEST_INFINITE_SCROLL_URL
} from "@/app/(core)/endpoints"
import { IconLayoutKanban } from "@tabler/icons-react"

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
      title: "家族プロフィール（タブ方式）",
      description: "プロフィール/公開クエスト/報酬テンプレートをタブで切替",
      url: TEST_FAMILY_PROFILE_TABS_MOCK_URL,
      icon: <IconHome size={32} />,
      badge: "UI"
    },
    {
      title: "家族プロフィール（アコーディオン方式）",
      description: "プロフィール表示＋下部セクションを折りたたみ展開",
      url: TEST_FAMILY_PROFILE_ACCORDION_MOCK_URL,
      icon: <IconHome size={32} />,
      badge: "UI"
    },
    {
      title: "家族プロフィール（縦スクロール方式）",
      description: "縦セクションで公開クエスト/報酬テンプレートを連続表示",
      url: TEST_FAMILY_PROFILE_SECTIONS_MOCK_URL,
      icon: <IconHome size={32} />,
      badge: "UI"
    },
    {
      title: "設定モック",
      description: "iPhone風リスト形式の設定画面（PC時は2ペイン構成）",
      url: TEST_SETTINGS_MOCK_URL,
      icon: <IconSettings size={32} />,
      badge: "UI"
    },
    {
      title: "クエスト閲覧モック",
      description: "クエスト名ブロック案と閲覧レイアウト案を比較するモック",
      url: TEST_QUEST_VIEW_MOCK_URL,
      icon: <IconLayoutKanban size={32} />,
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
    },
    {
      title: "無限スクロール検知テスト",
      description: "Intersection Observerを使った無限スクロールの検知テスト",
      url: TEST_INFINITE_SCROLL_URL,
      icon: <IconArrowDown size={32} />,
      badge: "Test"
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
