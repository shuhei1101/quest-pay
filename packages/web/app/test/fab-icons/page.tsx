"use client"

import { Container, Title, Paper, Group, Stack, Text, ActionIcon } from '@mantine/core'
import { 
  IconMenu2, 
  IconLayoutGrid, 
  IconApps, 
  IconDashboard, 
  IconList, 
  IconMenu,
  IconPlus,
  IconCirclePlus,
  IconPencilPlus,
  IconSparkles,
  IconWand,
  IconHome2,
  IconClipboard,
  IconUsers,
  IconChevronUp,
  IconChevronDown,
} from '@tabler/icons-react'
import { FloatingActionButton, FloatingActionItem } from '@/app/(core)/_components/FloatingActionButton'
import { useState } from 'react'

export default function FABIconsMockPage() {
  /** ナビゲーション用アイコン候補 */
  const navigationIconCandidates = [
    { icon: <IconMenu2 size={24} />, name: 'Menu2', description: 'ハンバーガーメニュー風' },
    { icon: <IconLayoutGrid size={24} />, name: 'LayoutGrid', description: 'グリッドレイアウト' },
    { icon: <IconApps size={24} />, name: 'Apps', description: 'アプリグリッド' },
    { icon: <IconDashboard size={24} />, name: 'Dashboard', description: 'ダッシュボード' },
    { icon: <IconList size={24} />, name: 'List', description: 'リスト' },
    { icon: <IconMenu size={24} />, name: 'Menu', description: 'メニュー' },
  ]

  /** サブメニュー用アイコン候補 */
  const submenuIconCandidates = [
    { icon: <IconPlus size={24} />, name: 'Plus', description: 'シンプルなプラス（現在）' },
    { icon: <IconCirclePlus size={24} />, name: 'CirclePlus', description: '円形プラス' },
    { icon: <IconPencilPlus size={24} />, name: 'PencilPlus', description: '編集プラス' },
    { icon: <IconSparkles size={24} />, name: 'Sparkles', description: 'きらきら' },
    { icon: <IconWand size={24} />, name: 'Wand', description: '魔法の杖' },
  ]

  /** ナビゲーションアイテム（デモ用） */
  const navigationItems: FloatingActionItem[] = [
    {
      icon: <IconHome2 size={20} />,
      label: "ホーム",
      onClick: () => {},
    },
    {
      icon: <IconClipboard size={20} />,
      label: "クエスト",
      onClick: () => {},
    },
    {
      icon: <IconUsers size={20} />,
      label: "メンバー",
      onClick: () => {},
    },
  ]

  /** サブメニューアイテム（デモ用） */
  const submenuItems: FloatingActionItem[] = [
    {
      icon: <IconPlus size={20} />,
      label: "新規",
      onClick: () => {},
    },
  ]

  const [selectedNavIcon, setSelectedNavIcon] = useState(0)
  const [selectedSubmenuIcon, setSelectedSubmenuIcon] = useState(0)

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">FAB アイコン候補一覧</Title>

      {/* ナビゲーションメニュー用アイコン */}
      <Paper shadow="sm" p="md" mb="xl">
        <Title order={2} size="h3" mb="md">
          1. ナビゲーションメニュー用アイコン（AppShellContent - 左下）
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          画面遷移メニューに適したアイコンを選択してください。
          モバイルで展開するとホーム・クエスト・メンバーの3つのボタンが表示されます。
        </Text>

        <Stack gap="md">
          {navigationIconCandidates.map((candidate, index) => (
            <Paper 
              key={index} 
              withBorder 
              p="md" 
              style={{ 
                cursor: 'pointer',
                backgroundColor: selectedNavIcon === index ? '#e7f5ff' : undefined,
                borderColor: selectedNavIcon === index ? '#228be6' : undefined,
                borderWidth: selectedNavIcon === index ? 2 : 1,
              }}
              onClick={() => setSelectedNavIcon(index)}
            >
              <Group justify="space-between">
                <Group>
                  <ActionIcon
                    size={60}
                    radius="xl"
                    variant="filled"
                    color="blue"
                  >
                    {candidate.icon}
                  </ActionIcon>
                  <div>
                    <Text fw={700}>{candidate.name}</Text>
                    <Text size="sm" c="dimmed">{candidate.description}</Text>
                  </div>
                </Group>
                <Group gap="xs">
                  <ActionIcon
                    size={60}
                    radius="xl"
                    variant="filled"
                    color="blue"
                  >
                    {candidate.icon}
                  </ActionIcon>
                  <Text c="dimmed">展開時 →</Text>
                  <ActionIcon
                    size={60}
                    radius="xl"
                    variant="filled"
                    color="blue"
                  >
                    <IconChevronDown size={24} />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>

        <Paper withBorder p="md" mt="md" bg="gray.0">
          <Text size="sm" fw={700} mb="xs">選択中: {navigationIconCandidates[selectedNavIcon].name}</Text>
          <Text size="xs" c="dimmed">
            このアイコンが展開ボタンとして使用され、展開時は下向き矢印（閉じるボタン）に変わります。
          </Text>
        </Paper>
      </Paper>

      {/* サブメニュー用アイコン */}
      <Paper shadow="sm" p="md" mb="xl">
        <Title order={2} size="h3" mb="md">
          2. サブメニュー用アイコン（各画面 - 右下）
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          アクション系ボタン（新規作成など）に適したアイコンを選択してください。
          クエスト新規作成などで使用されます。
        </Text>

        <Stack gap="md">
          {submenuIconCandidates.map((candidate, index) => (
            <Paper 
              key={index} 
              withBorder 
              p="md"
              style={{ 
                cursor: 'pointer',
                backgroundColor: selectedSubmenuIcon === index ? '#e7f5ff' : undefined,
                borderColor: selectedSubmenuIcon === index ? '#228be6' : undefined,
                borderWidth: selectedSubmenuIcon === index ? 2 : 1,
              }}
              onClick={() => setSelectedSubmenuIcon(index)}
            >
              <Group justify="space-between">
                <Group>
                  <ActionIcon
                    size={60}
                    radius="xl"
                    variant="filled"
                    color="blue"
                  >
                    {candidate.icon}
                  </ActionIcon>
                  <div>
                    <Text fw={700}>{candidate.name}</Text>
                    <Text size="sm" c="dimmed">{candidate.description}</Text>
                  </div>
                </Group>
                <Group gap="xs">
                  <ActionIcon
                    size={60}
                    radius="xl"
                    variant="filled"
                    color="blue"
                  >
                    {candidate.icon}
                  </ActionIcon>
                  <Text c="dimmed">展開時 →</Text>
                  <ActionIcon
                    size={60}
                    radius="xl"
                    variant="filled"
                    color="blue"
                  >
                    <IconChevronUp size={24} />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>

        <Paper withBorder p="md" mt="md" bg="gray.0">
          <Text size="sm" fw={700} mb="xs">選択中: {submenuIconCandidates[selectedSubmenuIcon].name}</Text>
          <Text size="xs" c="dimmed">
            このアイコンが展開ボタンとして使用され、展開時は上向き矢印（閉じるボタン）に変わります。
          </Text>
        </Paper>
      </Paper>

      {/* 実際の表示イメージ */}
      <Paper shadow="sm" p="md">
        <Title order={2} size="h3" mb="md">
          3. 実際の表示イメージ（プレビュー）
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          下記は選択したアイコンでの実際の表示イメージです。
        </Text>

        <div style={{ position: 'relative', height: 400, border: '1px solid #dee2e6', borderRadius: 8, backgroundColor: '#f8f9fa' }}>
          <Text ta="center" pt="xl" c="dimmed">アプリ画面イメージ</Text>
          
          {/* 左下: ナビゲーションメニュープレビュー */}
          <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
            <FloatingActionButton
              items={navigationItems}
              mainIcon={navigationIconCandidates[selectedNavIcon].icon}
              defaultOpen={false}
            />
          </div>

          {/* 右下: サブメニュープレビュー */}
          <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
            <FloatingActionButton
              items={submenuItems}
              pattern="radial-up"
              mainIcon={submenuIconCandidates[selectedSubmenuIcon].icon}
            />
          </div>
        </div>
      </Paper>

      <Paper withBorder p="md" mt="md" bg="blue.0">
        <Text size="sm" fw={700} mb="xs">📝 選択方法</Text>
        <Text size="xs">
          各アイコン候補をクリックして選択してください。
          選択したアイコンは青くハイライトされ、下部のプレビューで実際の表示を確認できます。
        </Text>
      </Paper>
    </Container>
  )
}
