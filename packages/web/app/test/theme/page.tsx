"use client"

import { useState } from "react"
import {
  Button,
  Card,
  Group,
  Stack,
  Title,
  Text,
  Badge,
  TextInput,
  Select,
  Tabs,
  ActionIcon,
  Box,
  Paper,
  Divider,
  SegmentedControl,
} from "@mantine/core"
import {
  IconHeart,
  IconStar,
  IconCheck,
  IconX,
  IconSearch,
  IconHome,
  IconSettings,
  IconUser,
  IconSun,
  IconMoon,
} from "@tabler/icons-react"
import { useTheme } from "../../(core)/_theme/useTheme"
import { themes, ThemeKey } from "../../(core)/_theme/themes"

export default function Page() {
  const { theme, themeKey, colorScheme, colors, setTheme, setColorScheme } = useTheme()
  const [activeTab, setActiveTab] = useState<string | null>("home")

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: colors.backgroundColors.default }}>
      {/* ヘッダー */}
      <div className="mb-8">
        <Title order={1} className="mb-4" style={{ color: colors.textColors.primary }}>
          テーマ切り替えデモページ
        </Title>
        <Text size="sm" style={{ color: colors.textColors.secondary }}>
          このページでは、アプリのカラーテーマを切り替えて各コンポーネントの見た目を確認できます。
        </Text>
      </div>

      {/* カラースキーム選択 */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: colors.backgroundColors.card }}>
        <Title order={3} className="mb-4" style={{ color: colors.textColors.primary }}>
          カラースキーム選択
        </Title>
        <Group gap="md" align="center">
          <SegmentedControl
            value={colorScheme}
            onChange={(value) => {
              if (value === "light" || value === "dark") {
                setColorScheme(value)
              }
            }}
            data={[
              {
                value: "light",
                label: (
                  <Group gap="xs" justify="center">
                    <IconSun size={16} />
                    <span>ライト</span>
                  </Group>
                ),
              },
              {
                value: "dark",
                label: (
                  <Group gap="xs" justify="center">
                    <IconMoon size={16} />
                    <span>ダーク</span>
                  </Group>
                ),
              },
            ]}
          />
          <Text size="sm" style={{ color: colors.textColors.secondary }}>
            現在のカラースキーム: <strong>{colorScheme === "light" ? "ライト" : "ダーク"}</strong>
          </Text>
        </Group>
      </Card>

      {/* テーマ選択 */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: colors.backgroundColors.card }}>
        <Title order={3} className="mb-4" style={{ color: colors.textColors.primary }}>
          テーマ選択
        </Title>
        <Group gap="md">
          {(Object.keys(themes) as ThemeKey[]).map((key) => (
            <Button
              key={key}
              variant={themeKey === key ? "filled" : "outline"}
              color={colors.buttonColors.primary}
              onClick={() => setTheme(key)}
            >
              {themes[key].name}
            </Button>
          ))}
        </Group>
        <Divider className="my-4" />
        <Text size="sm" style={{ color: colors.textColors.secondary }}>
          現在のテーマ: <strong>{theme.name}</strong>
        </Text>
      </Card>

      {/* ボタンサンプル */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: colors.backgroundColors.card }}>
        <Title order={3} className="mb-4" style={{ color: colors.textColors.primary }}>
          ボタンサンプル
        </Title>
        <Stack gap="md">
          <Group gap="md">
            <Button color={colors.buttonColors.default}>デフォルト</Button>
            <Button color={colors.buttonColors.primary}>プライマリ</Button>
            <Button color={colors.buttonColors.secondary}>セカンダリ</Button>
            <Button color={colors.buttonColors.success}>成功</Button>
            <Button color={colors.buttonColors.danger}>危険</Button>
          </Group>
          <Group gap="md">
            <Button variant="outline" color={colors.buttonColors.primary}>
              アウトライン
            </Button>
            <Button variant="light" color={colors.buttonColors.primary}>
              ライト
            </Button>
            <Button variant="subtle" color={colors.buttonColors.primary}>
              サブトル
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* バッジとアイコン */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: colors.backgroundColors.card }}>
        <Title order={3} className="mb-4" style={{ color: colors.textColors.primary }}>
          バッジとアイコン
        </Title>
        <Group gap="md" className="mb-4">
          <Badge color={colors.buttonColors.primary}>プライマリ</Badge>
          <Badge color={colors.buttonColors.secondary}>セカンダリ</Badge>
          <Badge color={colors.buttonColors.success}>成功</Badge>
          <Badge color={colors.buttonColors.danger}>危険</Badge>
        </Group>
        <Group gap="md">
          <ActionIcon color={colors.buttonColors.primary} variant="filled">
            <IconHeart size={18} />
          </ActionIcon>
          <ActionIcon color={colors.buttonColors.secondary} variant="filled">
            <IconStar size={18} />
          </ActionIcon>
          <ActionIcon color={colors.buttonColors.success} variant="filled">
            <IconCheck size={18} />
          </ActionIcon>
          <ActionIcon color={colors.buttonColors.danger} variant="filled">
            <IconX size={18} />
          </ActionIcon>
        </Group>
      </Card>

      {/* フォーム要素 */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: colors.backgroundColors.card }}>
        <Title order={3} className="mb-4" style={{ color: colors.textColors.primary }}>
          フォーム要素
        </Title>
        <Stack gap="md">
          <TextInput
            label="テキスト入力"
            placeholder="入力してください"
            leftSection={<IconSearch size={16} />}
            styles={{
              input: {
                borderColor: colors.borderColors.default,
                "&:focus": {
                  borderColor: colors.borderColors.focus,
                },
              },
            }}
          />
          <Select
            label="選択"
            placeholder="選択してください"
            data={["オプション1", "オプション2", "オプション3"]}
          />
        </Stack>
      </Card>

      {/* タブ */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: colors.backgroundColors.card }}>
        <Title order={3} className="mb-4" style={{ color: colors.textColors.primary }}>
          タブ
        </Title>
        <Tabs value={activeTab} onChange={setActiveTab} color={colors.buttonColors.primary}>
          <Tabs.List>
            <Tabs.Tab value="home" leftSection={<IconHome size={16} />}>
              ホーム
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
              設定
            </Tabs.Tab>
            <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
              プロフィール
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="home" pt="md">
            <Text style={{ color: colors.textColors.primary }}>ホームタブの内容</Text>
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt="md">
            <Text style={{ color: colors.textColors.primary }}>設定タブの内容</Text>
          </Tabs.Panel>

          <Tabs.Panel value="profile" pt="md">
            <Text style={{ color: colors.textColors.primary }}>プロフィールタブの内容</Text>
          </Tabs.Panel>
        </Tabs>
      </Card>

      {/* テキストとカラー情報 */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: colors.backgroundColors.card }}>
        <Title order={3} className="mb-4" style={{ color: colors.textColors.primary }}>
          テキストカラー
        </Title>
        <Stack gap="sm">
          <Text style={{ color: colors.textColors.primary }}>プライマリテキスト</Text>
          <Text style={{ color: colors.textColors.secondary }}>セカンダリテキスト</Text>
          <Text style={{ color: colors.textColors.disabled }}>無効化テキスト</Text>
        </Stack>
      </Card>

      {/* カラー設定の詳細 */}
      <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: colors.backgroundColors.card }}>
        <Title order={3} className="mb-4" style={{ color: colors.textColors.primary }}>
          現在のテーマ設定詳細
        </Title>
        <Box>
          <Paper p="md" radius="md" className="mb-4" style={{ backgroundColor: colors.backgroundColors.hover }}>
            <Text fw={700} className="mb-2" style={{ color: colors.textColors.primary }}>
              ボタンカラー
            </Text>
            <Stack gap="xs">
              <Text size="sm" style={{ color: colors.textColors.secondary }}>
                デフォルト: {colors.buttonColors.default}
              </Text>
              <Text size="sm" style={{ color: colors.textColors.secondary }}>
                プライマリ: {colors.buttonColors.primary}
              </Text>
              <Text size="sm" style={{ color: colors.textColors.secondary }}>
                セカンダリ: {colors.buttonColors.secondary}
              </Text>
              <Text size="sm" style={{ color: colors.textColors.secondary }}>
                危険: {colors.buttonColors.danger}
              </Text>
              <Text size="sm" style={{ color: colors.textColors.secondary }}>
                成功: {colors.buttonColors.success}
              </Text>
            </Stack>
          </Paper>

          <Paper p="md" radius="md" className="mb-4" style={{ backgroundColor: colors.backgroundColors.hover }}>
            <Text fw={700} className="mb-2" style={{ color: colors.textColors.primary }}>
              テキストカラー
            </Text>
            <Stack gap="xs">
              <Text size="sm" style={{ color: colors.textColors.secondary }}>
                プライマリ: {colors.textColors.primary}
              </Text>
              <Text size="sm" style={{ color: colors.textColors.secondary }}>
                セカンダリ: {colors.textColors.secondary}
              </Text>
              <Text size="sm" style={{ color: colors.textColors.secondary }}>
                無効化: {colors.textColors.disabled}
              </Text>
            </Stack>
          </Paper>

          <Paper p="md" radius="md" style={{ backgroundColor: colors.backgroundColors.hover }}>
            <Text fw={700} className="mb-2" style={{ color: colors.textColors.primary }}>
              背景カラー
            </Text>
            <Stack gap="xs">
              <Text size="sm" style={{ color: colors.textColors.secondary }}>
                デフォルト: {colors.backgroundColors.default}
              </Text>
              <Text size="sm" style={{ color: colors.textColors.secondary }}>
                カード: {colors.backgroundColors.card}
              </Text>
              <Text size="sm" style={{ color: colors.textColors.secondary }}>
                ホバー: {colors.backgroundColors.hover}
              </Text>
            </Stack>
          </Paper>
        </Box>
      </Card>
    </div>
  )
}
