'use client'

import { Box, Button, Card, Container, Group, SimpleGrid, Stack, Text, Tabs, Badge, Divider, ThemeIcon, Progress, RingProgress, Center } from "@mantine/core"
import { IconCake, IconCalendar, IconSchool, IconTrophy, IconChecklist, IconCoin, IconWallet, IconArrowUpRight, IconCurrencyDollar, IconStar } from "@tabler/icons-react"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { useState } from "react"

/** モックデータ */
const mockChild = {
  profiles: {
    name: "太郎",
    birthday: "2015-04-15",
    iconColor: "#FF6B6B"
  },
  icons: {
    name: "star"
  },
  children: {
    currentLevel: 5,
    currentSavings: 12500,
    currentExp: 750,  // 現在の経験値
    nextLevelExp: 1000  // 次のレベルまでに必要な経験値
  }
}

const mockQuestStats = {
  inProgressCount: 3,
  completedCount: 42
}

/** 統計カード（共通） */
const StatCard = ({ 
  label, 
  value, 
  color, 
  onClick,
  icon 
}: { 
  label: string
  value: string | number
  color: string
  onClick?: () => void
  icon?: React.ReactNode
}) => {
  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      onClick={onClick}
      className={onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}
      style={{
        backgroundColor: color,
        minWidth: "100px",
      }}
    >
      <Stack gap="xs">
        {icon && (
          <Box>{icon}</Box>
        )}
        <Text size="sm" fw={500} c="white" style={{ opacity: 0.9 }}>
          {label}
        </Text>
        <Text size="xl" fw={700} c="white">
          {value}
        </Text>
      </Stack>
    </Card>
  )
}

/** 最終デザイン案: カード分割型 + 経験値円グラフ */
const FinalDesign = () => {
  // 経験値のパーセンテージを計算
  const expPercentage = (mockChild.children.currentExp / mockChild.children.nextLevelExp) * 100
  
  return (
    <Box>
      <Text size="xl" fw={700} mb="md">最終デザイン案</Text>
      
      {/* プロフィールカード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Group gap="lg" align="center">
          <Box
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            <RenderIcon iconName={mockChild.icons.name} iconColor="#FFFFFF" size={50} />
          </Box>
          
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text size="2rem" fw={700}>{mockChild.profiles.name}くん</Text>
            <Group gap="lg">
              <Group gap="xs">
                <IconCake size={20} color="#666" />
                <Text size="sm" c="dimmed">10歳</Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={20} color="#666" />
                <Text size="sm" c="dimmed">2015年4月15日</Text>
              </Group>
              <Group gap="xs">
                <IconSchool size={20} color="#666" />
                <Text size="sm" c="dimmed">小学5年生</Text>
              </Group>
            </Group>
          </Stack>
        </Group>
      </Card>

      {/* レベルと経験値カード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text size="lg" fw={600} mb="md">レベル・経験値</Text>
        <Group gap="xl" align="center">
          {/* 円グラフ */}
          <Box>
            <RingProgress
              size={160}
              thickness={16}
              roundCaps
              sections={[
                { value: expPercentage, color: '#667eea' }
              ]}
              label={
                <Center>
                  <Stack gap={0} align="center">
                    <Group gap="xs">
                      <IconStar size={24} color="#667eea" />
                      <Text size="xl" fw={700} c="#667eea">Lv.{mockChild.children.currentLevel}</Text>
                    </Group>
                    <Text size="xs" c="dimmed" mt="xs">
                      {expPercentage.toFixed(1)}%
                    </Text>
                  </Stack>
                </Center>
              }
            />
          </Box>
          
          {/* 経験値情報 */}
          <Stack gap="md" style={{ flex: 1 }}>
            <Box>
              <Text size="sm" c="dimmed" mb="xs">現在の経験値</Text>
              <Group gap="xs">
                <Text size="2rem" fw={700} c="#667eea">{mockChild.children.currentExp}</Text>
                <Text size="sm" c="dimmed">EXP</Text>
              </Group>
            </Box>
            
            <Divider />
            
            <Box>
              <Text size="sm" c="dimmed" mb="xs">次のレベルまで</Text>
              <Group gap="xs">
                <Text size="xl" fw={700} c="#999">
                  {mockChild.children.nextLevelExp - mockChild.children.currentExp}
                </Text>
                <Text size="sm" c="dimmed">EXP</Text>
              </Group>
            </Box>
            
            <Box>
              <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed">進捗</Text>
                <Text size="xs" fw={600}>{expPercentage.toFixed(1)}%</Text>
              </Group>
              <Progress value={expPercentage} color="#667eea" size="md" radius="xl" />
            </Box>
          </Stack>
        </Group>
      </Card>

      {/* クエスト統計カード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text size="lg" fw={600} mb="md">クエスト実績</Text>
        <SimpleGrid cols={3} spacing="md">
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="violet" mb="xs">
              <IconTrophy size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">ランク</Text>
            <Text size="xl" fw={700}>{mockChild.children.currentLevel}</Text>
          </Box>
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="red" mb="xs">
              <IconChecklist size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">達成クエスト</Text>
            <Text size="xl" fw={700}>{mockQuestStats.completedCount}</Text>
          </Box>
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="blue" mb="xs">
              <IconChecklist size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">進行中</Text>
            <Text size="xl" fw={700}>{mockQuestStats.inProgressCount}</Text>
          </Box>
        </SimpleGrid>
      </Card>

      {/* お金の統計カード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text size="lg" fw={600} mb="md">お金の管理</Text>
        <Stack gap="md">
          <Card padding="md" radius="md" withBorder style={{ backgroundColor: "#FFF9C4" }}>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <IconWallet size={24} color="#F57C00" />
                <Text fw={600}>今月の報酬</Text>
              </Group>
              <Text size="xs" c="dimmed">支払い日: 2024/6/30</Text>
            </Group>
            <Text size="2.5rem" fw={700} c="#F57C00">3,000円</Text>
          </Card>
          
          <SimpleGrid cols={3} spacing="md">
            <Card padding="sm" radius="md" withBorder style={{ backgroundColor: "#E1F5FE" }}>
              <Text size="xs" c="dimmed" mb="xs">合計報酬額</Text>
              <Text size="lg" fw={700} c="#0277BD">10,000円</Text>
            </Card>
            <Card padding="sm" radius="md" withBorder style={{ backgroundColor: "#F3E5F5" }}>
              <Text size="xs" c="dimmed" mb="xs">定額報酬</Text>
              <Text size="lg" fw={700} c="#6A1B9A">1,900円/月</Text>
            </Card>
            <Card padding="sm" radius="md" withBorder style={{ backgroundColor: "#E8F5E9" }}>
              <Text size="xs" c="dimmed" mb="xs">現在の貯金</Text>
              <Text size="lg" fw={700} c="#2E7D32">{mockChild.children.currentSavings.toLocaleString()}円</Text>
            </Card>
          </SimpleGrid>
        </Stack>
      </Card>
    </Box>
  )
}

/** デザイン案1: カード分割型 */
const Design1 = () => {
  return (
    <Box>
      <Text size="xl" fw={700} mb="md">デザイン案1: カード分割型</Text>
      
      {/* プロフィールカード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Group gap="lg" align="center">
          <Box
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            <RenderIcon iconName={mockChild.icons.name} iconColor="#FFFFFF" size={50} />
          </Box>
          
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text size="2rem" fw={700}>{mockChild.profiles.name}くん</Text>
            <Group gap="lg">
              <Group gap="xs">
                <IconCake size={20} color="#666" />
                <Text size="sm" c="dimmed">10歳</Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={20} color="#666" />
                <Text size="sm" c="dimmed">2015年4月15日</Text>
              </Group>
              <Group gap="xs">
                <IconSchool size={20} color="#666" />
                <Text size="sm" c="dimmed">小学5年生</Text>
              </Group>
            </Group>
          </Stack>
        </Group>
      </Card>

      {/* クエスト統計カード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text size="lg" fw={600} mb="md">クエスト実績</Text>
        <SimpleGrid cols={3} spacing="md">
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="violet" mb="xs">
              <IconTrophy size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">ランク</Text>
            <Text size="xl" fw={700}>{mockChild.children.currentLevel}</Text>
          </Box>
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="red" mb="xs">
              <IconChecklist size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">達成クエスト</Text>
            <Text size="xl" fw={700}>{mockQuestStats.completedCount}</Text>
          </Box>
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="blue" mb="xs">
              <IconChecklist size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">進行中</Text>
            <Text size="xl" fw={700}>{mockQuestStats.inProgressCount}</Text>
          </Box>
        </SimpleGrid>
      </Card>

      {/* お金の統計カード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text size="lg" fw={600} mb="md">お金の管理</Text>
        <Stack gap="md">
          <Card padding="md" radius="md" withBorder style={{ backgroundColor: "#FFF9C4" }}>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <IconWallet size={24} color="#F57C00" />
                <Text fw={600}>今月の報酬</Text>
              </Group>
              <Text size="xs" c="dimmed">支払い日: 2024/6/30</Text>
            </Group>
            <Text size="2.5rem" fw={700} c="#F57C00">3,000円</Text>
          </Card>
          
          <SimpleGrid cols={3} spacing="md">
            <Card padding="sm" radius="md" withBorder style={{ backgroundColor: "#E1F5FE" }}>
              <Text size="xs" c="dimmed" mb="xs">合計報酬額</Text>
              <Text size="lg" fw={700} c="#0277BD">10,000円</Text>
            </Card>
            <Card padding="sm" radius="md" withBorder style={{ backgroundColor: "#F3E5F5" }}>
              <Text size="xs" c="dimmed" mb="xs">定額報酬</Text>
              <Text size="lg" fw={700} c="#6A1B9A">1,900円/月</Text>
            </Card>
            <Card padding="sm" radius="md" withBorder style={{ backgroundColor: "#E8F5E9" }}>
              <Text size="xs" c="dimmed" mb="xs">現在の貯金</Text>
              <Text size="lg" fw={700} c="#2E7D32">{mockChild.children.currentSavings.toLocaleString()}円</Text>
            </Card>
          </SimpleGrid>
        </Stack>
      </Card>
    </Box>
  )
}

/** デザイン案2: ダッシュボード型 */
const Design2 = () => {
  return (
    <Box>
      <Text size="xl" fw={700} mb="md">デザイン案2: ダッシュボード型</Text>
      
      {/* ヒーローセクション */}
      <Card 
        shadow="lg" 
        padding="xl" 
        radius="md" 
        mb="md"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white"
        }}
      >
        <Group justify="space-between" align="flex-start">
          <Group gap="lg">
            <Box
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid rgba(255,255,255,0.3)"
              }}
            >
              <RenderIcon iconName={mockChild.icons.name} iconColor="#FFFFFF" size={60} />
            </Box>
            
            <Stack gap="xs">
              <Group gap="md">
                <Text size="2.5rem" fw={700}>{mockChild.profiles.name}くん</Text>
                <Badge size="lg" variant="light" color="yellow">
                  ランク {mockChild.children.currentLevel}
                </Badge>
              </Group>
              <Group gap="md">
                <Text size="sm" style={{ opacity: 0.9 }}>10歳 • 小学5年生</Text>
                <Text size="sm" style={{ opacity: 0.7 }}>| 2015年4月15日</Text>
              </Group>
            </Stack>
          </Group>
          
          <Stack gap="xs" align="flex-end">
            <Text size="xs" style={{ opacity: 0.9 }}>現在の貯金</Text>
            <Text size="2rem" fw={700}>{mockChild.children.currentSavings.toLocaleString()}円</Text>
          </Stack>
        </Group>
      </Card>

      <SimpleGrid cols={2} spacing="md" mb="md">
        {/* クエスト進捗 */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Text fw={600}>クエスト進捗</Text>
            <IconArrowUpRight size={20} color="#888" />
          </Group>
          
          <Stack gap="lg">
            <Box>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">達成率</Text>
                <Text size="sm" fw={600}>93%</Text>
              </Group>
              <Progress value={93} color="violet" size="lg" radius="xl" />
            </Box>
            
            <SimpleGrid cols={2} spacing="md">
              <Box>
                <Text size="xs" c="dimmed" mb="xs">達成</Text>
                <Group gap="xs">
                  <ThemeIcon size="sm" radius="xl" color="green">
                    <IconChecklist size={14} />
                  </ThemeIcon>
                  <Text size="xl" fw={700}>{mockQuestStats.completedCount}</Text>
                </Group>
              </Box>
              <Box>
                <Text size="xs" c="dimmed" mb="xs">進行中</Text>
                <Group gap="xs">
                  <ThemeIcon size="sm" radius="xl" color="blue">
                    <IconChecklist size={14} />
                  </ThemeIcon>
                  <Text size="xl" fw={700}>{mockQuestStats.inProgressCount}</Text>
                </Group>
              </Box>
            </SimpleGrid>
          </Stack>
        </Card>

        {/* 今月の報酬 */}
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: "#FFF9C4" }}>
          <Group justify="space-between" mb="md">
            <Text fw={600}>今月の報酬</Text>
            <Badge color="orange">6月</Badge>
          </Group>
          
          <Stack gap="md">
            <Box>
              <Group gap="xs" mb="xs">
                <IconCoin size={20} color="#F57C00" />
                <Text size="xs" c="dimmed">支払い予定額</Text>
              </Group>
              <Text size="3rem" fw={700} c="#F57C00">3,000円</Text>
            </Box>
            
            <Divider />
            
            <Group justify="space-between">
              <Text size="xs" c="dimmed">支払い日</Text>
              <Text size="sm" fw={600}>2024/6/30</Text>
            </Group>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* 報酬サマリー */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={600} mb="md">報酬サマリー</Text>
        <SimpleGrid cols={3} spacing="md">
          <Box style={{ textAlign: "center", padding: "1rem", borderRight: "1px solid #e0e0e0" }}>
            <IconCoin size={32} color="#0277BD" style={{ margin: "0 auto 0.5rem" }} />
            <Text size="xs" c="dimmed" mb="xs">合計報酬額</Text>
            <Text size="xl" fw={700} c="#0277BD">10,000円</Text>
          </Box>
          <Box style={{ textAlign: "center", padding: "1rem", borderRight: "1px solid #e0e0e0" }}>
            <IconWallet size={32} color="#6A1B9A" style={{ margin: "0 auto 0.5rem" }} />
            <Text size="xs" c="dimmed" mb="xs">定額報酬</Text>
            <Text size="xl" fw={700} c="#6A1B9A">1,900円/月</Text>
          </Box>
          <Box style={{ textAlign: "center", padding: "1rem" }}>
            <IconCurrencyDollar size={32} color="#2E7D32" style={{ margin: "0 auto 0.5rem" }} />
            <Text size="xs" c="dimmed" mb="xs">貯金</Text>
            <Text size="xl" fw={700} c="#2E7D32">{mockChild.children.currentSavings.toLocaleString()}円</Text>
          </Box>
        </SimpleGrid>
      </Card>
    </Box>
  )
}

/** デザイン案3: タイムライン型 */
const Design3 = () => {
  return (
    <Box>
      <Text size="xl" fw={700} mb="md">デザイン案3: タイムライン型</Text>
      
      {/* プロフィールヘッダー */}
      <Card shadow="sm" padding="xl" radius="md" withBorder mb="md">
        <Stack gap="md" align="center">
          <Box
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(102,126,234,0.3)"
            }}
          >
            <RenderIcon iconName={mockChild.icons.name} iconColor="#FFFFFF" size={70} />
          </Box>
          
          <Stack gap="xs" align="center">
            <Group gap="md" align="center">
              <Text size="2.5rem" fw={700}>{mockChild.profiles.name}くん</Text>
              <Badge size="xl" variant="gradient" gradient={{ from: 'violet', to: 'grape' }}>
                Lv.{mockChild.children.currentLevel}
              </Badge>
            </Group>
            
            <Group gap="lg">
              <Group gap="xs">
                <IconCake size={18} />
                <Text size="sm">10歳</Text>
              </Group>
              <Text size="sm" c="dimmed">•</Text>
              <Group gap="xs">
                <IconSchool size={18} />
                <Text size="sm">小学5年生</Text>
              </Group>
              <Text size="sm" c="dimmed">•</Text>
              <Group gap="xs">
                <IconCalendar size={18} />
                <Text size="sm">2015年4月15日</Text>
              </Group>
            </Group>
          </Stack>
        </Stack>
      </Card>

      {/* 今月のハイライト */}
      <Card 
        shadow="md" 
        padding="lg" 
        radius="md" 
        mb="md"
        style={{
          background: "linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)",
          color: "white"
        }}
      >
        <Stack gap="xs">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <IconWallet size={28} />
              <Text size="lg" fw={600}>今月の報酬金</Text>
            </Group>
            <Badge color="yellow" variant="light">6月予定</Badge>
          </Group>
          <Text size="3.5rem" fw={700} ta="center">3,000円</Text>
          <Text size="sm" ta="right" style={{ opacity: 0.9 }}>支払い日: 2024/6/30</Text>
        </Stack>
      </Card>

      {/* クエスト実績 */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text fw={600} mb="md" size="lg">
          <Group gap="xs">
            <IconTrophy size={24} color="#667eea" />
            クエスト実績
          </Group>
        </Text>
        
        <Stack gap="md">
          <Card padding="md" radius="md" style={{ backgroundColor: "#F3E5F5" }}>
            <Group justify="space-between">
              <Box style={{ flex: 1 }}>
                <Text size="xs" c="dimmed" mb="xs">達成クエスト</Text>
                <Text size="2rem" fw={700} c="#6A1B9A">{mockQuestStats.completedCount}</Text>
              </Box>
              <ThemeIcon size={60} radius="xl" color="violet" variant="light">
                <IconChecklist size={36} />
              </ThemeIcon>
            </Group>
          </Card>
          
          <Card padding="md" radius="md" style={{ backgroundColor: "#E3F2FD" }}>
            <Group justify="space-between">
              <Box style={{ flex: 1 }}>
                <Text size="xs" c="dimmed" mb="xs">進行中のクエスト</Text>
                <Text size="2rem" fw={700} c="#1976D2">{mockQuestStats.inProgressCount}</Text>
              </Box>
              <ThemeIcon size={60} radius="xl" color="blue" variant="light">
                <IconChecklist size={36} />
              </ThemeIcon>
            </Group>
          </Card>
        </Stack>
      </Card>

      {/* お金の管理 */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={600} mb="md" size="lg">
          <Group gap="xs">
            <IconCurrencyDollar size={24} color="#2E7D32" />
            お金の管理
          </Group>
        </Text>
        
        <Stack gap="lg">
          <Box>
            <Group justify="space-between" mb="lg">
              <Text size="sm" c="dimmed">現在の貯金</Text>
              <Text size="xs" c="dimmed">クリックで詳細</Text>
            </Group>
            <Card padding="lg" radius="md" style={{ backgroundColor: "#C8E6C9", cursor: "pointer" }} className="hover:shadow-md transition-shadow">
              <Text size="3rem" fw={700} c="#2E7D32" ta="center">
                {mockChild.children.currentSavings.toLocaleString()}円
              </Text>
            </Card>
          </Box>
          
          <Divider />
          
          <SimpleGrid cols={2} spacing="md">
            <Box>
              <Text size="xs" c="dimmed" mb="xs">累計報酬</Text>
              <Group gap="xs">
                <IconCoin size={20} color="#0277BD" />
                <Text size="lg" fw={700} c="#0277BD">10,000円</Text>
              </Group>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" mb="xs">定額報酬</Text>
              <Group gap="xs">
                <IconWallet size={20} color="#6A1B9A" />
                <Text size="lg" fw={700} c="#6A1B9A">1,900円/月</Text>
              </Group>
            </Box>
          </SimpleGrid>
        </Stack>
      </Card>
    </Box>
  )
}

/** メインコンポーネント */
export default function ChildViewMock() {
  const [activeTab, setActiveTab] = useState<string | null>("final")

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Box>
          <Text size="2rem" fw={700} mb="xs">子供閲覧画面 - デザイン案</Text>
          <Text c="dimmed">カード分割型をベースに経験値の円グラフを追加した最終デザインです。他のデザイン案も確認できます。</Text>
        </Box>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="final">
              ✨ 最終デザイン
            </Tabs.Tab>
            <Tabs.Tab value="design1">
              カード分割型
            </Tabs.Tab>
            <Tabs.Tab value="design2">
              ダッシュボード型
            </Tabs.Tab>
            <Tabs.Tab value="design3">
              タイムライン型
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="final" pt="xl">
            <FinalDesign />
          </Tabs.Panel>

          <Tabs.Panel value="design1" pt="xl">
            <Design1 />
          </Tabs.Panel>

          <Tabs.Panel value="design2" pt="xl">
            <Design2 />
          </Tabs.Panel>

          <Tabs.Panel value="design3" pt="xl">
            <Design3 />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  )
}
