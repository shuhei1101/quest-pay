'use client'

import { Box, Card, Container, Group, Stack, Text, Tabs, Badge, Avatar, Divider, Progress, ThemeIcon, SimpleGrid } from "@mantine/core"
import { IconUser, IconStar, IconCoin, IconChecklist, IconCalendar, IconTrophy } from "@tabler/icons-react"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { useState } from "react"

/** モックデータ - 親 */
const mockParents = [
  {
    id: "parent1",
    name: "お父さん",
    icon: "user",
    iconColor: "#4A90E2",
    age: 38,
    createdAt: "2024-01-15"
  },
  {
    id: "parent2",
    name: "お母さん",
    icon: "heart",
    iconColor: "#E91E63",
    age: 36,
    createdAt: "2024-01-15"
  }
]

/** モックデータ - 子供 */
const mockChildren = [
  {
    id: "child1",
    name: "太郎",
    icon: "star",
    iconColor: "#FF6B6B",
    age: 10,
    level: 5,
    exp: 750,
    savings: 12500,
    inProgressCount: 3,
    completedCount: 42
  },
  {
    id: "child2",
    name: "花子",
    icon: "flower",
    iconColor: "#FFA500",
    age: 8,
    level: 3,
    exp: 450,
    savings: 8200,
    inProgressCount: 2,
    completedCount: 28
  },
  {
    id: "child3",
    name: "次郎",
    icon: "rocket",
    iconColor: "#4CAF50",
    age: 6,
    level: 2,
    exp: 180,
    savings: 3500,
    inProgressCount: 1,
    completedCount: 15
  }
]

/** デザイン案1: コンパクトリスト型（2ペイン向け） */
const Design1 = () => {
  const [selected, setSelected] = useState<string | null>("child1")
  
  return (
    <Box>
      <Text size="xl" fw={700} mb="md">デザイン案1: コンパクトリスト型</Text>
      <Text size="sm" c="dimmed" mb="md">2ペイン表示に最適化。左ペインでの選択を想定</Text>
      
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400 }}>
        <Stack gap="xs">
          {/* 親セクション */}
          <Text size="sm" fw={600} c="dimmed" mb="xs">親</Text>
          {mockParents.map((parent) => (
            <Card
              key={parent.id}
              padding="sm"
              radius="md"
              withBorder
              onClick={() => setSelected(parent.id)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              style={{
                backgroundColor: selected === parent.id ? "#F0F4FF" : "white",
                borderColor: selected === parent.id ? "#667eea" : "#e0e0e0",
                borderWidth: selected === parent.id ? "2px" : "1px"
              }}
            >
              <Group gap="md" wrap="nowrap">
                <Box
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <RenderIcon iconName={parent.icon} iconColor="#FFFFFF" size={28} />
                </Box>
                <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={600} truncate>{parent.name}</Text>
                  <Text size="xs" c="dimmed">{parent.age}歳 • 親</Text>
                </Stack>
              </Group>
            </Card>
          ))}
          
          <Divider my="xs" />
          
          {/* 子供セクション */}
          <Text size="sm" fw={600} c="dimmed" mb="xs">子供</Text>
          {mockChildren.map((child) => (
            <Card
              key={child.id}
              padding="sm"
              radius="md"
              withBorder
              onClick={() => setSelected(child.id)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              style={{
                backgroundColor: selected === child.id ? "#F0F4FF" : "white",
                borderColor: selected === child.id ? "#667eea" : "#e0e0e0",
                borderWidth: selected === child.id ? "2px" : "1px"
              }}
            >
              <Group gap="md" wrap="nowrap">
                <Box
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <RenderIcon iconName={child.icon} iconColor="#FFFFFF" size={28} />
                </Box>
                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                  <Group gap="xs" wrap="nowrap">
                    <Text size="sm" fw={600} truncate style={{ flex: 1 }}>{child.name}</Text>
                    <Badge size="sm" color="violet">Lv.{child.level}</Badge>
                  </Group>
                  <Group gap="md">
                    <Text size="xs" c="dimmed">{child.age}歳</Text>
                    <Text size="xs" c="dimmed">¥{child.savings.toLocaleString()}</Text>
                  </Group>
                </Stack>
              </Group>
            </Card>
          ))}
        </Stack>
      </Card>
    </Box>
  )
}

/** デザイン案2: カード詳細型 */
const Design2 = () => {
  const [selected, setSelected] = useState<string | null>("child1")
  
  return (
    <Box>
      <Text size="xl" fw={700} mb="md">デザイン案2: カード詳細型</Text>
      <Text size="sm" c="dimmed" mb="md">情報量を重視。全画面表示向け</Text>
      
      <Stack gap="md" style={{ maxWidth: 600 }}>
        {/* 親カード */}
        <Box>
          <Text size="sm" fw={600} c="dimmed" mb="xs">親</Text>
          <SimpleGrid cols={2} spacing="md">
            {mockParents.map((parent) => (
              <Card
                key={parent.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                onClick={() => setSelected(parent.id)}
                className="cursor-pointer hover:shadow-md transition-shadow"
                style={{
                  borderColor: selected === parent.id ? "#667eea" : "#e0e0e0",
                  borderWidth: selected === parent.id ? "2px" : "1px"
                }}
              >
                <Stack gap="md" align="center">
                  <Box
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <RenderIcon iconName={parent.icon} iconColor="#FFFFFF" size={45} />
                  </Box>
                  <Stack gap="xs" align="center">
                    <Text size="lg" fw={700}>{parent.name}</Text>
                    <Group gap="xs">
                      <IconUser size={16} color="#666" />
                      <Text size="sm" c="dimmed">{parent.age}歳</Text>
                    </Group>
                    <Group gap="xs">
                      <IconCalendar size={16} color="#666" />
                      <Text size="xs" c="dimmed">{parent.createdAt}</Text>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* 子供カード */}
        <Box>
          <Text size="sm" fw={600} c="dimmed" mb="xs">子供</Text>
          <Stack gap="md">
            {mockChildren.map((child) => (
              <Card
                key={child.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                onClick={() => setSelected(child.id)}
                className="cursor-pointer hover:shadow-md transition-shadow"
                style={{
                  borderColor: selected === child.id ? "#667eea" : "#e0e0e0",
                  borderWidth: selected === child.id ? "2px" : "1px"
                }}
              >
                <Group gap="lg" align="flex-start">
                  <Box
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    <RenderIcon iconName={child.icon} iconColor="#FFFFFF" size={45} />
                  </Box>
                  
                  <Stack gap="md" style={{ flex: 1 }}>
                    <Group justify="space-between">
                      <Text size="lg" fw={700}>{child.name}</Text>
                      <Badge size="lg" color="violet">Lv.{child.level}</Badge>
                    </Group>
                    
                    <SimpleGrid cols={2} spacing="md">
                      <Box>
                        <Group gap="xs" mb="xs">
                          <IconUser size={18} color="#666" />
                          <Text size="sm" c="dimmed">年齢</Text>
                        </Group>
                        <Text size="sm" fw={600}>{child.age}歳</Text>
                      </Box>
                      <Box>
                        <Group gap="xs" mb="xs">
                          <IconCoin size={18} color="#666" />
                          <Text size="sm" c="dimmed">貯金</Text>
                        </Group>
                        <Text size="sm" fw={600}>¥{child.savings.toLocaleString()}</Text>
                      </Box>
                      <Box>
                        <Group gap="xs" mb="xs">
                          <IconStar size={18} color="#666" />
                          <Text size="sm" c="dimmed">経験値</Text>
                        </Group>
                        <Text size="sm" fw={600}>{child.exp} EXP</Text>
                      </Box>
                      <Box>
                        <Group gap="xs" mb="xs">
                          <IconChecklist size={18} color="#666" />
                          <Text size="sm" c="dimmed">クエスト</Text>
                        </Group>
                        <Text size="sm" fw={600}>{child.completedCount}件完了</Text>
                      </Box>
                    </SimpleGrid>
                  </Stack>
                </Group>
              </Card>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

/** デザイン案3: ミニマルリスト型（最もコンパクト） */
const Design3 = () => {
  const [selected, setSelected] = useState<string | null>("child1")
  
  return (
    <Box>
      <Text size="xl" fw={700} mb="md">デザイン案3: ミニマルリスト型</Text>
      <Text size="sm" c="dimmed" mb="md">最小限の情報のみ。超コンパクト</Text>
      
      <Card shadow="sm" padding="sm" radius="md" withBorder style={{ maxWidth: 350 }}>
        <Stack gap={4}>
          {/* 親セクション */}
          <Text size="xs" fw={600} c="dimmed" px="xs" py={4}>親</Text>
          {mockParents.map((parent) => (
            <Box
              key={parent.id}
              px="xs"
              py="sm"
              onClick={() => setSelected(parent.id)}
              className="cursor-pointer hover:bg-gray-50 transition-colors rounded"
              style={{
                backgroundColor: selected === parent.id ? "#F0F4FF" : "transparent",
                borderLeft: selected === parent.id ? "3px solid #667eea" : "3px solid transparent"
              }}
            >
              <Group gap="sm" wrap="nowrap">
                <Avatar
                  size={32}
                  radius="xl"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  }}
                >
                  <RenderIcon iconName={parent.icon} iconColor="#FFFFFF" size={20} />
                </Avatar>
                <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={500} truncate>{parent.name}</Text>
                  <Text size="xs" c="dimmed">{parent.age}歳</Text>
                </Stack>
              </Group>
            </Box>
          ))}
          
          <Divider my={4} />
          
          {/* 子供セクション */}
          <Text size="xs" fw={600} c="dimmed" px="xs" py={4}>子供</Text>
          {mockChildren.map((child) => (
            <Box
              key={child.id}
              px="xs"
              py="sm"
              onClick={() => setSelected(child.id)}
              className="cursor-pointer hover:bg-gray-50 transition-colors rounded"
              style={{
                backgroundColor: selected === child.id ? "#F0F4FF" : "transparent",
                borderLeft: selected === child.id ? "3px solid #667eea" : "3px solid transparent"
              }}
            >
              <Group gap="sm" wrap="nowrap">
                <Avatar
                  size={32}
                  radius="xl"
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  }}
                >
                  <RenderIcon iconName={child.icon} iconColor="#FFFFFF" size={20} />
                </Avatar>
                <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                  <Group gap="xs" wrap="nowrap">
                    <Text size="sm" fw={500} truncate style={{ flex: 1 }}>{child.name}</Text>
                    <Badge size="xs" color="violet" variant="light">Lv.{child.level}</Badge>
                  </Group>
                  <Text size="xs" c="dimmed">{child.age}歳 • ¥{child.savings.toLocaleString()}</Text>
                </Stack>
              </Group>
            </Box>
          ))}
        </Stack>
      </Card>
    </Box>
  )
}

/** メインコンポーネント */
export default function FamilyMemberListMock() {
  const [activeTab, setActiveTab] = useState<string | null>("design1")

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Box>
          <Text size="2rem" fw={700} mb="xs">家族メンバー一覧画面 - デザイン案</Text>
          <Text c="dimmed">2ペイン表示（PC）とモバイル表示の両方を考慮したデザイン案</Text>
        </Box>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="design1">
              コンパクトリスト型
            </Tabs.Tab>
            <Tabs.Tab value="design2">
              カード詳細型
            </Tabs.Tab>
            <Tabs.Tab value="design3">
              ミニマルリスト型
            </Tabs.Tab>
          </Tabs.List>

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

        {/* 2ペイン表示のプレビュー */}
        <Box>
          <Text size="xl" fw={700} mb="md">2ペイン表示プレビュー（PC時）</Text>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <div style={{ display: "flex", height: "500px", gap: "1rem" }}>
              {/* 左ペイン */}
              <Box style={{ width: "33%", borderRight: "1px solid #e0e0e0", paddingRight: "1rem", overflowY: "auto" }}>
                <Text size="sm" fw={600} c="dimmed" mb="md">一覧（左ペイン）</Text>
                <Design3 />
              </Box>
              {/* 右ペイン */}
              <Box style={{ flex: 1, paddingLeft: "1rem" }}>
                <Text size="sm" fw={600} c="dimmed" mb="md">詳細（右ペイン）</Text>
                <Card shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: "#f9f9f9" }}>
                  <Stack gap="md" align="center">
                    <Text size="lg" c="dimmed">選択したメンバーの詳細がここに表示されます</Text>
                    <Text size="sm" c="dimmed">（子供閲覧画面など）</Text>
                  </Stack>
                </Card>
              </Box>
            </div>
          </Card>
        </Box>
      </Stack>
    </Container>
  )
}
