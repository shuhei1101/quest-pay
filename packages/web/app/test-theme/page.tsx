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
} from "@tabler/icons-react"
import { useTheme } from "../(core)/_theme/useTheme"
import { themes, ThemeKey } from "../(core)/_theme/themes"

export default function Page() {
  const { theme, themeKey, setTheme, getButtonColor, getTextColor, getBackgroundColor, getBorderColor } = useTheme()
  const [activeTab, setActiveTab] = useState<string | null>("home")

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: getBackgroundColor("default") }}>
      {/* ヘッダー */}
      <div className="mb-8">
        <Title order={1} className="mb-4" style={{ color: getTextColor("primary") }}>
          テーマ切り替えデモページ
        </Title>
        <Text size="sm" style={{ color: getTextColor("secondary") }}>
          このページでは、アプリのカラーテーマを切り替えて各コンポーネントの見た目を確認できます。
        </Text>
      </div>

      {/* テーマ選択 */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: getBackgroundColor("card") }}>
        <Title order={3} className="mb-4" style={{ color: getTextColor("primary") }}>
          テーマ選択
        </Title>
        <Group gap="md">
          {(Object.keys(themes) as ThemeKey[]).map((key) => (
            <Button
              key={key}
              variant={themeKey === key ? "filled" : "outline"}
              color={getButtonColor("primary")}
              onClick={() => setTheme(key)}
            >
              {themes[key].name}
            </Button>
          ))}
        </Group>
        <Divider className="my-4" />
        <Text size="sm" style={{ color: getTextColor("secondary") }}>
          現在のテーマ: <strong>{theme.name}</strong>
        </Text>
      </Card>

      {/* ボタンサンプル */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: getBackgroundColor("card") }}>
        <Title order={3} className="mb-4" style={{ color: getTextColor("primary") }}>
          ボタンサンプル
        </Title>
        <Stack gap="md">
          <Group gap="md">
            <Button color={getButtonColor("default")}>デフォルト</Button>
            <Button color={getButtonColor("primary")}>プライマリ</Button>
            <Button color={getButtonColor("secondary")}>セカンダリ</Button>
            <Button color={getButtonColor("success")}>成功</Button>
            <Button color={getButtonColor("danger")}>危険</Button>
          </Group>
          <Group gap="md">
            <Button variant="outline" color={getButtonColor("primary")}>
              アウトライン
            </Button>
            <Button variant="light" color={getButtonColor("primary")}>
              ライト
            </Button>
            <Button variant="subtle" color={getButtonColor("primary")}>
              サブトル
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* バッジとアイコン */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: getBackgroundColor("card") }}>
        <Title order={3} className="mb-4" style={{ color: getTextColor("primary") }}>
          バッジとアイコン
        </Title>
        <Group gap="md" className="mb-4">
          <Badge color={getButtonColor("primary")}>プライマリ</Badge>
          <Badge color={getButtonColor("secondary")}>セカンダリ</Badge>
          <Badge color={getButtonColor("success")}>成功</Badge>
          <Badge color={getButtonColor("danger")}>危険</Badge>
        </Group>
        <Group gap="md">
          <ActionIcon color={getButtonColor("primary")} variant="filled">
            <IconHeart size={18} />
          </ActionIcon>
          <ActionIcon color={getButtonColor("secondary")} variant="filled">
            <IconStar size={18} />
          </ActionIcon>
          <ActionIcon color={getButtonColor("success")} variant="filled">
            <IconCheck size={18} />
          </ActionIcon>
          <ActionIcon color={getButtonColor("danger")} variant="filled">
            <IconX size={18} />
          </ActionIcon>
        </Group>
      </Card>

      {/* フォーム要素 */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: getBackgroundColor("card") }}>
        <Title order={3} className="mb-4" style={{ color: getTextColor("primary") }}>
          フォーム要素
        </Title>
        <Stack gap="md">
          <TextInput
            label="テキスト入力"
            placeholder="入力してください"
            leftSection={<IconSearch size={16} />}
            styles={{
              input: {
                borderColor: getBorderColor("default"),
                "&:focus": {
                  borderColor: getBorderColor("focus"),
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
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: getBackgroundColor("card") }}>
        <Title order={3} className="mb-4" style={{ color: getTextColor("primary") }}>
          タブ
        </Title>
        <Tabs value={activeTab} onChange={setActiveTab} color={getButtonColor("primary")}>
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
            <Text style={{ color: getTextColor("primary") }}>ホームタブの内容</Text>
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt="md">
            <Text style={{ color: getTextColor("primary") }}>設定タブの内容</Text>
          </Tabs.Panel>

          <Tabs.Panel value="profile" pt="md">
            <Text style={{ color: getTextColor("primary") }}>プロフィールタブの内容</Text>
          </Tabs.Panel>
        </Tabs>
      </Card>

      {/* テキストとカラー情報 */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-6" style={{ backgroundColor: getBackgroundColor("card") }}>
        <Title order={3} className="mb-4" style={{ color: getTextColor("primary") }}>
          テキストカラー
        </Title>
        <Stack gap="sm">
          <Text style={{ color: getTextColor("primary") }}>プライマリテキスト</Text>
          <Text style={{ color: getTextColor("secondary") }}>セカンダリテキスト</Text>
          <Text style={{ color: getTextColor("disabled") }}>無効化テキスト</Text>
        </Stack>
      </Card>

      {/* カラー設定の詳細 */}
      <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: getBackgroundColor("card") }}>
        <Title order={3} className="mb-4" style={{ color: getTextColor("primary") }}>
          現在のテーマ設定詳細
        </Title>
        <Box>
          <Paper p="md" radius="md" className="mb-4" style={{ backgroundColor: getBackgroundColor("hover") }}>
            <Text fw={700} className="mb-2" style={{ color: getTextColor("primary") }}>
              ボタンカラー
            </Text>
            <Stack gap="xs">
              <Text size="sm" style={{ color: getTextColor("secondary") }}>
                デフォルト: {theme.buttonColors.default}
              </Text>
              <Text size="sm" style={{ color: getTextColor("secondary") }}>
                プライマリ: {theme.buttonColors.primary}
              </Text>
              <Text size="sm" style={{ color: getTextColor("secondary") }}>
                セカンダリ: {theme.buttonColors.secondary}
              </Text>
              <Text size="sm" style={{ color: getTextColor("secondary") }}>
                危険: {theme.buttonColors.danger}
              </Text>
              <Text size="sm" style={{ color: getTextColor("secondary") }}>
                成功: {theme.buttonColors.success}
              </Text>
            </Stack>
          </Paper>

          <Paper p="md" radius="md" className="mb-4" style={{ backgroundColor: getBackgroundColor("hover") }}>
            <Text fw={700} className="mb-2" style={{ color: getTextColor("primary") }}>
              テキストカラー
            </Text>
            <Stack gap="xs">
              <Text size="sm" style={{ color: getTextColor("secondary") }}>
                プライマリ: {theme.textColors.primary}
              </Text>
              <Text size="sm" style={{ color: getTextColor("secondary") }}>
                セカンダリ: {theme.textColors.secondary}
              </Text>
              <Text size="sm" style={{ color: getTextColor("secondary") }}>
                無効化: {theme.textColors.disabled}
              </Text>
            </Stack>
          </Paper>

          <Paper p="md" radius="md" style={{ backgroundColor: getBackgroundColor("hover") }}>
            <Text fw={700} className="mb-2" style={{ color: getTextColor("primary") }}>
              背景カラー
            </Text>
            <Stack gap="xs">
              <Text size="sm" style={{ color: getTextColor("secondary") }}>
                デフォルト: {theme.backgroundColors.default}
              </Text>
              <Text size="sm" style={{ color: getTextColor("secondary") }}>
                カード: {theme.backgroundColors.card}
              </Text>
              <Text size="sm" style={{ color: getTextColor("secondary") }}>
                ホバー: {theme.backgroundColors.hover}
              </Text>
            </Stack>
          </Paper>
        </Box>
      </Card>
    </div>
  )
}
