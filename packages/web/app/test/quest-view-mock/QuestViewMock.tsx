"use client"

import { Box, Button, Card, Group, Paper, SimpleGrid, Stack, Tabs, Text, ThemeIcon, Badge, Divider } from "@mantine/core"
import {
  IconBolt,
  IconCalendarDue,
  IconCheck,
  IconChevronRight,
  IconClockHour4,
  IconCoinYen,
  IconLayoutBoardSplit,
  IconSparkles,
  IconStars,
  IconTargetArrow,
  IconTrophy,
  IconUserCircle,
} from "@tabler/icons-react"
import { PageHeader } from "@/app/(core)/_components/PageHeader"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { QuestConditionTab } from "@/app/(app)/quests/view/_components/QuestConditionTab"
import { QuestDetailTab } from "@/app/(app)/quests/view/_components/QuestDetailTab"
import { QuestOtherTab } from "@/app/(app)/quests/view/_components/QuestOtherTab"

const mockQuest = {
  title: "朝の支度を15分で終わらせよう",
  status: "進行中",
  category: "生活習慣",
  reward: 120,
  exp: 35,
  level: 4,
  requiredCompletionCount: 5,
  client: "お母さん",
  successCondition: "朝ごはんの前に、着替え・洗顔・歯みがき・持ち物確認までを15分以内で完了する。",
  requestDetail:
    "最近は朝の準備に時間がかかっているので、流れを固定してテンポよく進めたい。終わったら自分で鏡の前チェックもしてね。",
  tags: ["朝活", "習慣化", "平日", "自分でできる"],
  ageFrom: 7,
  ageTo: 12,
  monthFrom: 4,
  monthTo: 12,
  requiredClearCount: 12,
  iconName: "IconSun",
  iconColor: "#ff8a3d",
}

const headerIdeas = [
  {
    key: "hero",
    title: "案A: ヒーローバナー型",
    note: "アイコン、状態、報酬、期限を1ブロックに集約。第一印象を強くする。",
  },
  {
    key: "split",
    title: "案B: 2カラム情報型",
    note: "左にタイトル、右に数値情報。密度は上がるが整理感がある。",
  },
  {
    key: "editorial",
    title: "案C: エディトリアル型",
    note: "クエスト名を主役にして補助情報はタグ化。今よりかなり大人っぽく見せやすい。",
  },
]

const sectionCardStyle = {
  border: "1px solid rgba(22, 37, 66, 0.08)",
  boxShadow: "0 18px 48px rgba(15, 23, 42, 0.08)",
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <Box
      mx="auto"
      maw={420}
      p={10}
      style={{
        borderRadius: 34,
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        boxShadow: "0 28px 80px rgba(15, 23, 42, 0.28)",
      }}
    >
      <Paper
        radius={26}
        p="md"
        style={{
          overflow: "hidden",
          background: "linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)",
        }}
      >
        {children}
      </Paper>
    </Box>
  )
}

function MetaPill({
  icon,
  label,
  value,
  tone = "#e2e8f0",
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone?: string
}) {
  return (
    <Paper
      radius="xl"
      px="sm"
      py={6}
      style={{
        background: tone,
        border: "1px solid rgba(15, 23, 42, 0.06)",
      }}
    >
      <Group gap={8} wrap="nowrap">
        {icon}
        <Box>
          <Text size="10px" tt="uppercase" c="dimmed" fw={700} lh={1.1}>
            {label}
          </Text>
          <Text size="sm" fw={700} lh={1.1}>
            {value}
          </Text>
        </Box>
      </Group>
    </Paper>
  )
}

function HeaderIdeaPreview({ mode }: { mode: string }) {
  if (mode === "hero") {
    return (
      <Paper
        p="md"
        radius="xl"
        style={{
          background: "linear-gradient(135deg, #fff7ed 0%, #ffe2cf 55%, #ffd3b2 100%)",
          border: "1px solid rgba(251, 146, 60, 0.25)",
        }}
      >
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group align="flex-start" wrap="nowrap">
            <ThemeIcon size={54} radius={18} style={{ background: "rgba(255,255,255,0.75)", color: "#ea580c" }}>
              <RenderIcon iconName={mockQuest.iconName} iconColor="#ea580c" size={28} />
            </ThemeIcon>
            <Stack gap={6}>
              <Group gap={8}>
                <Badge radius="xl" color="orange">進行中</Badge>
                <Badge radius="xl" variant="white">生活習慣</Badge>
              </Group>
              <Text fw={800} size="lg" lh={1.2}>{mockQuest.title}</Text>
              <Group gap={8}>
                <MetaPill icon={<IconCoinYen size={14} />} label="Reward" value={`${mockQuest.reward}円`} tone="rgba(255,255,255,0.72)" />
                <MetaPill icon={<IconCalendarDue size={14} />} label="期限" value="平日 朝" tone="rgba(255,255,255,0.72)" />
              </Group>
            </Stack>
          </Group>
        </Group>
      </Paper>
    )
  }

  if (mode === "split") {
    return (
      <Paper
        p="md"
        radius="xl"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(148, 163, 184, 0.24)",
        }}
      >
        <SimpleGrid cols={2} spacing="md" verticalSpacing="md">
          <Stack gap={8}>
            <Group gap={8}>
              <Badge radius="sm" color="lime">DAILY</Badge>
              <Text size="xs" fw={700} c="dimmed">LEVEL {mockQuest.level}</Text>
            </Group>
            <Text fw={800} size="lg" lh={1.25}>{mockQuest.title}</Text>
            <Text size="sm" c="dimmed">{mockQuest.client}からの依頼</Text>
          </Stack>
          <SimpleGrid cols={2} spacing="xs">
            <MetaPill icon={<IconTrophy size={14} />} label="EXP" value={`+${mockQuest.exp}`} tone="#eff6ff" />
            <MetaPill icon={<IconTargetArrow size={14} />} label="達成" value={`${mockQuest.requiredCompletionCount}回`} tone="#f5f3ff" />
            <MetaPill icon={<IconClockHour4 size={14} />} label="所要" value="15分" tone="#fef3c7" />
            <MetaPill icon={<IconUserCircle size={14} />} label="依頼主" value={mockQuest.client} tone="#ecfeff" />
          </SimpleGrid>
        </SimpleGrid>
      </Paper>
    )
  }

  return (
    <Paper
      p="lg"
      radius="xl"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid rgba(30, 41, 59, 0.08)",
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between">
          <Text size="xs" tt="uppercase" fw={800} c="dimmed" style={{ letterSpacing: "0.18em" }}>
            Morning Mission
          </Text>
          <Group gap={6}>
            <Badge radius="sm" variant="light" color="orange">120円</Badge>
            <Badge radius="sm" variant="light" color="grape">+35 EXP</Badge>
          </Group>
        </Group>
        <Text fw={900} size="1.45rem" lh={1.15}>
          {mockQuest.title}
        </Text>
        <Group gap={8}>
          <Badge radius="xl" variant="dot" color="teal">{mockQuest.status}</Badge>
          <Badge radius="xl" variant="outline">{mockQuest.category}</Badge>
          <Badge radius="xl" variant="outline">平日限定</Badge>
        </Group>
      </Stack>
    </Paper>
  )
}

function LayoutA() {
  return (
    <PhoneFrame>
      <Stack gap="md">
        <Paper
          p="lg"
          radius="xl"
          style={{
            background: "linear-gradient(135deg, #fff7ed 0%, #ffe7d1 48%, #fde68a 100%)",
            border: "1px solid rgba(245, 158, 11, 0.24)",
          }}
        >
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Stack gap={10} style={{ flex: 1 }}>
              <Group gap={8}>
                <Badge radius="xl" color="orange">毎日クエスト</Badge>
                <Badge radius="xl" variant="white">{mockQuest.status}</Badge>
              </Group>
              <Group align="flex-start" wrap="nowrap">
                <ThemeIcon size={58} radius={18} style={{ background: "rgba(255,255,255,0.75)" }}>
                  <RenderIcon iconName={mockQuest.iconName} iconColor={mockQuest.iconColor} size={30} />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text fw={900} size="1.45rem" lh={1.15}>
                    {mockQuest.title}
                  </Text>
                  <Text mt={6} size="sm" c="dimmed">
                    朝の定番クエスト。成功条件と報酬を上で把握できる構成。
                  </Text>
                </Box>
              </Group>
              <SimpleGrid cols={3} spacing="xs">
                <MetaPill icon={<IconCoinYen size={14} />} label="報酬" value={`${mockQuest.reward}円`} tone="rgba(255,255,255,0.72)" />
                <MetaPill icon={<IconSparkles size={14} />} label="経験値" value={`+${mockQuest.exp}`} tone="rgba(255,255,255,0.72)" />
                <MetaPill icon={<IconTargetArrow size={14} />} label="達成" value={`${mockQuest.requiredCompletionCount}回`} tone="rgba(255,255,255,0.72)" />
              </SimpleGrid>
            </Stack>
          </Group>
        </Paper>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Card radius="xl" p="md" style={sectionCardStyle}>
            <Text fw={800} mb="sm">条件</Text>
            <QuestConditionTab
              level={mockQuest.level}
              category={mockQuest.category}
              successCondition={mockQuest.successCondition}
              reward={mockQuest.reward}
              exp={mockQuest.exp}
              requiredCompletionCount={mockQuest.requiredCompletionCount}
              iconName={mockQuest.iconName}
              iconColor={mockQuest.iconColor}
            />
          </Card>
          <Card radius="xl" p="md" style={sectionCardStyle}>
            <Text fw={800} mb="sm">依頼情報</Text>
            <QuestDetailTab client={mockQuest.client} requestDetail={mockQuest.requestDetail} />
          </Card>
        </SimpleGrid>

        <Card radius="xl" p="md" style={sectionCardStyle}>
          <Text fw={800} mb="sm">その他</Text>
          <QuestOtherTab
            tags={mockQuest.tags}
            ageFrom={mockQuest.ageFrom}
            ageTo={mockQuest.ageTo}
            monthFrom={mockQuest.monthFrom}
            monthTo={mockQuest.monthTo}
            requiredClearCount={mockQuest.requiredClearCount}
          />
        </Card>
      </Stack>
    </PhoneFrame>
  )
}

function LayoutB() {
  return (
    <PhoneFrame>
      <Stack gap="md">
        <Paper
          p="lg"
          radius="xl"
          style={{
            ...sectionCardStyle,
            background: "#ffffff",
          }}
        >
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Box style={{ flex: 1 }}>
              <Text size="xs" tt="uppercase" fw={800} c="dimmed" style={{ letterSpacing: "0.14em" }}>
                Quest Overview
              </Text>
              <Text mt={8} fw={900} size="1.5rem" lh={1.15}>
                {mockQuest.title}
              </Text>
              <Group gap={8} mt="sm">
                <Badge radius="sm" color="teal">{mockQuest.status}</Badge>
                <Badge radius="sm" variant="light" color="blue">{mockQuest.category}</Badge>
              </Group>
            </Box>
            <ThemeIcon
              size={56}
              radius={18}
              style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", color: "#1d4ed8" }}
            >
              <IconLayoutBoardSplit size={28} />
            </ThemeIcon>
          </Group>

          <SimpleGrid cols={4} spacing="xs" mt="md">
            <MetaPill icon={<IconCoinYen size={14} />} label="報酬" value={`${mockQuest.reward}円`} tone="#fff7ed" />
            <MetaPill icon={<IconSparkles size={14} />} label="EXP" value={`+${mockQuest.exp}`} tone="#eef2ff" />
            <MetaPill icon={<IconClockHour4 size={14} />} label="所要" value="15分" tone="#fefce8" />
            <MetaPill icon={<IconCheck size={14} />} label="連続" value="12回" tone="#ecfccb" />
          </SimpleGrid>
        </Paper>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Card radius="xl" p="md" style={{ ...sectionCardStyle, background: "#fffdf8" }}>
            <Text fw={800} mb="xs">ミッション要約</Text>
            <Text size="sm" c="dimmed" mb="md">
              成功条件、依頼主、タグを短い単位で並べる。スクロール量を減らしやすい。
            </Text>
            <Stack gap="sm">
              <MetaPill icon={<IconTargetArrow size={14} />} label="成功条件" value="朝の準備を15分以内" tone="#ffffff" />
              <MetaPill icon={<IconUserCircle size={14} />} label="依頼主" value={mockQuest.client} tone="#ffffff" />
              <MetaPill icon={<IconCalendarDue size={14} />} label="対象期間" value="4月〜12月" tone="#ffffff" />
            </Stack>
            <Divider my="md" />
            <Group gap={8}>
              {mockQuest.tags.map((tag) => (
                <Badge key={tag} radius="xl" variant="light" color="orange">{tag}</Badge>
              ))}
            </Group>
          </Card>

          <Card radius="xl" p="md" style={{ ...sectionCardStyle, background: "#f8fbff" }}>
            <Text fw={800} mb="xs">サマリーカード</Text>
            <Stack gap="md">
              <Box>
                <Text size="xs" fw={700} c="dimmed">推奨年齢</Text>
                <Text fw={800}>7歳〜12歳</Text>
              </Box>
              <Box>
                <Text size="xs" fw={700} c="dimmed">必要達成回数</Text>
                <Text fw={800}>{mockQuest.requiredCompletionCount}回</Text>
              </Box>
              <Box>
                <Text size="xs" fw={700} c="dimmed">レベルアップ条件</Text>
                <Text fw={800}>{mockQuest.requiredClearCount}回クリア</Text>
              </Box>
              <Button radius="xl" rightSection={<IconChevronRight size={16} />}>
                完了報告に進む
              </Button>
            </Stack>
          </Card>
        </SimpleGrid>

        <Card radius="xl" p="md" style={sectionCardStyle}>
          <Text fw={800} mb="sm">本文エリア</Text>
          <QuestDetailTab client={mockQuest.client} requestDetail={mockQuest.requestDetail} />
        </Card>
      </Stack>
    </PhoneFrame>
  )
}

function LayoutC() {
  return (
    <PhoneFrame>
      <Stack gap="md">
        <Paper
          p="lg"
          radius="xl"
          style={{
            ...sectionCardStyle,
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <Group justify="space-between" align="center" mb="sm">
            <Badge radius="sm" color="grape">FOCUS QUEST</Badge>
            <Group gap={6}>
              <Badge radius="xl" variant="light" color="orange">{mockQuest.reward}円</Badge>
              <Badge radius="xl" variant="light" color="blue">+{mockQuest.exp} EXP</Badge>
            </Group>
          </Group>
          <Text fw={900} size="1.55rem" lh={1.15}>
            {mockQuest.title}
          </Text>
          <Group gap={8} mt="sm">
            <Badge radius="xl" variant="dot" color="teal">{mockQuest.status}</Badge>
            <Badge radius="xl" variant="outline">{mockQuest.category}</Badge>
            <Badge radius="xl" variant="outline">レベル {mockQuest.level}</Badge>
          </Group>
        </Paper>

        <Paper radius="xl" p={6} style={{ ...sectionCardStyle, background: "rgba(255,255,255,0.72)" }}>
          <Tabs defaultValue="condition" variant="pills" radius="xl">
            <Tabs.List grow>
              <Tabs.Tab value="condition">条件</Tabs.Tab>
              <Tabs.Tab value="detail">依頼情報</Tabs.Tab>
              <Tabs.Tab value="other">その他</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="condition" pt="md">
              <Card radius="xl" p="md" style={{ background: "#fffdf8" }}>
                <QuestConditionTab
                  level={mockQuest.level}
                  category={mockQuest.category}
                  successCondition={mockQuest.successCondition}
                  reward={mockQuest.reward}
                  exp={mockQuest.exp}
                  requiredCompletionCount={mockQuest.requiredCompletionCount}
                  iconName={mockQuest.iconName}
                  iconColor={mockQuest.iconColor}
                />
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="detail" pt="md">
              <Card radius="xl" p="md" style={{ background: "#ffffff" }}>
                <QuestDetailTab client={mockQuest.client} requestDetail={mockQuest.requestDetail} />
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="other" pt="md">
              <Card radius="xl" p="md" style={{ background: "#ffffff" }}>
                <QuestOtherTab
                  tags={mockQuest.tags}
                  ageFrom={mockQuest.ageFrom}
                  ageTo={mockQuest.ageTo}
                  monthFrom={mockQuest.monthFrom}
                  monthTo={mockQuest.monthTo}
                  requiredClearCount={mockQuest.requiredClearCount}
                />
              </Card>
            </Tabs.Panel>
          </Tabs>
        </Paper>

        <Paper
          p="md"
          radius="xl"
          style={{
            background: "linear-gradient(135deg, #ecfeff 0%, #eef2ff 100%)",
            border: "1px solid rgba(59, 130, 246, 0.12)",
          }}
        >
          <Group justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon size={42} radius="xl" color="blue" variant="light">
                <IconBolt size={20} />
              </ThemeIcon>
              <Box>
                <Text fw={800}>下部CTAは常設が良い</Text>
                <Text size="sm" c="dimmed">
                  子供側の導線は「今できること」を固定表示した方が迷いが少ない。
                </Text>
              </Box>
            </Group>
          </Group>
        </Paper>
      </Stack>
    </PhoneFrame>
  )
}

export const QuestViewMock = () => {
  return (
    <Box p="md">
      <PageHeader title="クエスト閲覧モック" showProfileButton={false} />

      <Stack gap="xl">
        <Paper
          p="xl"
          radius="xl"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #172554 48%, #1d4ed8 100%)",
            color: "#ffffff",
          }}
        >
          <Group justify="space-between" align="flex-end" gap="md">
            <Box maw={760}>
              <Group gap={8} mb="sm">
                <Badge color="cyan" variant="filled">UI Proposal</Badge>
                <Badge color="gray" variant="white">Quest View</Badge>
              </Group>
              <Text fw={900} size="2rem" lh={1.1}>
                クエスト名ブロックと閲覧レイアウトの改善モック
              </Text>
              <Text mt="sm" size="md" style={{ color: "rgba(255,255,255,0.78)" }}>
                今の「タイトル帯 + 大きい紙 + タブ」の平板さを崩して、上部の情報密度と本文の整理方法を3方向で比較できるようにしています。
              </Text>
            </Box>
            <Button radius="xl" color="cyan" variant="white" leftSection={<IconStars size={16} />}>
              比較しながら検討
            </Button>
          </Group>
        </Paper>

        <Box>
          <Text fw={900} size="xl" mb={6}>クエスト名ブロック案</Text>
          <Text c="dimmed" mb="md">
            上部に何を集約するかの違い。今の単独タイトル帯より、状態や報酬を含めて意味のある塊にした方が強いです。
          </Text>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            {headerIdeas.map((idea) => (
              <Card key={idea.key} radius="xl" p="lg" style={sectionCardStyle}>
                <HeaderIdeaPreview mode={idea.key} />
                <Text fw={800} mt="md">{idea.title}</Text>
                <Text size="sm" c="dimmed" mt={6}>
                  {idea.note}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        <Box>
          <Text fw={900} size="xl" mb={6}>閲覧レイアウト案</Text>
          <Text c="dimmed" mb="md">
            全体構成の比較です。A はヒーロー型、B は要約重視、C は現行のタブ構成を洗練させる方向です。
          </Text>

          <Tabs defaultValue="a" variant="outline" radius="xl">
            <Tabs.List mb="md">
              <Tabs.Tab value="a">案A: ヒーロー + セクション</Tabs.Tab>
              <Tabs.Tab value="b">案B: 要約カード + 本文</Tabs.Tab>
              <Tabs.Tab value="c">案C: タブ継承リデザイン</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="a">
              <LayoutA />
            </Tabs.Panel>

            <Tabs.Panel value="b">
              <LayoutB />
            </Tabs.Panel>

            <Tabs.Panel value="c">
              <LayoutC />
            </Tabs.Panel>
          </Tabs>
        </Box>
      </Stack>
    </Box>
  )
}
