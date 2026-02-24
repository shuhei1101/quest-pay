"use client"

import { Card, Text, Badge, Group, Stack, Progress, Avatar, Tooltip, Tabs, Container, Title, Divider } from "@mantine/core"
import { IconHeart, IconMessageCircle, IconStar, IconClock, IconTrophy, IconWorld, IconCheck } from "@tabler/icons-react"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"

/** モッククエストデータ */
const mockQuestData = {
  name: "お部屋のお掃除",
  iconName: "IconBroom",
  iconColor: "#4CAF50",
  categoryName: "掃除",
  ageFrom: 6,
  ageTo: 12,
  monthFrom: null,
  monthTo: null,
  client: "お母さん",
  requestDetail: "リビングと自分の部屋を綺麗にしてください",
  tags: ["毎週", "基本", "必須"],
  reward: 100,
  exp: 50,
  level: 2,
  requiredCompletionCount: 5,
  currentCompletionCount: 3,
  requiredClearCount: 10,
  currentClearCount: 7,
  likeCount: 245,
  commentCount: 12,
  childrenCount: 2,
  status: "in_progress",
  familyName: "山田ファミリー",
  familyIconColor: "#2196F3",
}

/** クエストカードレイアウトモック画面 */
const QuestCardLayoutsPage = () => {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">クエストカードレイアウト案</Title>
      
      <Tabs defaultValue="family">
        <Tabs.List>
          <Tabs.Tab value="family">家族クエスト</Tabs.Tab>
          <Tabs.Tab value="public">公開クエスト</Tabs.Tab>
          <Tabs.Tab value="template">テンプレートクエスト</Tabs.Tab>
          <Tabs.Tab value="child">子供クエスト</Tabs.Tab>
        </Tabs.List>

        {/* 家族クエスト */}
        <Tabs.Panel value="family" pt="xl">
          <Title order={2} mb="md">家族クエスト レイアウト案</Title>
          
          <Stack gap="xl">
            {/* レイアウト案1: シンプル・コンパクト */}
            <div>
              <Title order={3} size="h4" mb="md">案1: シンプル・コンパクト（現行ベース）</Title>
              <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400, borderColor: mockQuestData.iconColor }}>
                <Group justify="space-between" mb="xs">
                  <RenderIcon iconName={mockQuestData.iconName} size={48} iconColor={mockQuestData.iconColor} />
                </Group>
                
                <Text fw={700} size="lg" mb="xs" lineClamp={2}>{mockQuestData.name}</Text>
                
                <Group gap="xs" mb="xs">
                  <Text size="sm" c="dimmed">受注中:</Text>
                  <Avatar.Group spacing="sm">
                    <Avatar size="sm" radius="xl">1</Avatar>
                    <Avatar size="sm" radius="xl">2</Avatar>
                  </Avatar.Group>
                </Group>
              </Card>
            </div>

            {/* レイアウト案2: 情報充実型 */}
            <div>
              <Title order={3} size="h4" mb="md">案2: 情報充実型</Title>
              <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400, borderColor: mockQuestData.iconColor }}>
                <Group justify="space-between" mb="md">
                  <Group gap="md">
                    <RenderIcon iconName={mockQuestData.iconName} size={56} iconColor={mockQuestData.iconColor} />
                    <Stack gap={4}>
                      <Text fw={700} size="lg" lineClamp={1}>{mockQuestData.name}</Text>
                      <Badge size="sm" variant="light">{mockQuestData.categoryName}</Badge>
                    </Stack>
                  </Group>
                </Group>
                
                <Stack gap="xs" mb="md">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">報酬</Text>
                    <Text size="sm" fw={700}>{mockQuestData.reward}円</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">対象年齢</Text>
                    <Text size="sm">{mockQuestData.ageFrom}〜{mockQuestData.ageTo}歳</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">依頼者</Text>
                    <Text size="sm">{mockQuestData.client}</Text>
                  </Group>
                </Stack>
                
                <Group gap="xs" mb="xs">
                  {mockQuestData.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} size="sm" variant="outline">{tag}</Badge>
                  ))}
                </Group>
                
                <Group gap="xs">
                  <Text size="sm" c="dimmed">受注中:</Text>
                  <Avatar.Group spacing="sm">
                    <Avatar size="sm" radius="xl">1</Avatar>
                    <Avatar size="sm" radius="xl">2</Avatar>
                  </Avatar.Group>
                </Group>
              </Card>
            </div>

            {/* レイアウト案3: ビジュアル重視 */}
            <div>
              <Title order={3} size="h4" mb="md">案3: ビジュアル重視（カード型）</Title>
              <Card shadow="sm" padding={0} radius="md" withBorder style={{ maxWidth: 400, overflow: "hidden" }}>
                {/* ヘッダー部分（カラー背景） */}
                <div style={{ backgroundColor: mockQuestData.iconColor, padding: "16px" }}>
                  <Group justify="space-between" mb="xs">
                    <RenderIcon iconName={mockQuestData.iconName} size={64} iconColor="#FFFFFF" />
                    <Badge size="lg" variant="filled" color="dark">{mockQuestData.categoryName}</Badge>
                  </Group>
                  <Text fw={700} size="xl" c="white" lineClamp={2}>{mockQuestData.name}</Text>
                </div>
                
                {/* コンテンツ部分 */}
                <Stack gap="md" p="md">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconTrophy size={20} />
                      <Text size="lg" fw={700}>{mockQuestData.reward}円</Text>
                    </Group>
                    <Text size="sm" c="dimmed">{mockQuestData.ageFrom}〜{mockQuestData.ageTo}歳</Text>
                  </Group>
                  
                  <Text size="sm" c="dimmed" lineClamp={2}>{mockQuestData.requestDetail}</Text>
                  
                  <Group gap="xs">
                    {mockQuestData.tags.map((tag, i) => (
                      <Badge key={i} size="sm" variant="light">{tag}</Badge>
                    ))}
                  </Group>
                  
                  <Divider />
                  
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">依頼者: {mockQuestData.client}</Text>
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">受注中:</Text>
                      <Badge size="lg" variant="filled" circle>{mockQuestData.childrenCount}</Badge>
                    </Group>
                  </Group>
                </Stack>
              </Card>
            </div>
          </Stack>
        </Tabs.Panel>

        {/* 公開クエスト */}
        <Tabs.Panel value="public" pt="xl">
          <Title order={2} mb="md">公開クエスト レイアウト案</Title>
          
          <Stack gap="xl">
            {/* レイアウト案1: コンパクト・SNS風 */}
            <div>
              <Title order={3} size="h4" mb="md">案1: コンパクト・SNS風（現行ベース）</Title>
              <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400, borderColor: mockQuestData.iconColor }}>
                <Group justify="space-between" align="flex-start" mb="xs">
                  <Group gap="md" style={{ flex: 1 }}>
                    <RenderIcon iconName={mockQuestData.iconName} size={40} iconColor={mockQuestData.iconColor} />
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Text fw={700} size="md" lineClamp={1}>{mockQuestData.name}</Text>
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">{mockQuestData.ageFrom}〜{mockQuestData.ageTo}歳</Text>
                        <Text size="xs" fw={500}>{mockQuestData.reward}円〜</Text>
                      </Group>
                    </Stack>
                  </Group>
                  
                  <Group gap="xs">
                    <Group gap={4}>
                      <IconHeart size={16} color="red" />
                      <Text size="xs" fw={500}>{mockQuestData.likeCount}</Text>
                    </Group>
                    <Group gap={4}>
                      <IconMessageCircle size={16} />
                      <Text size="xs" fw={500}>{mockQuestData.commentCount}</Text>
                    </Group>
                  </Group>
                </Group>
                
                <Group gap="xs" mb="xs">
                  {mockQuestData.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} size="sm" variant="light">{tag}</Badge>
                  ))}
                </Group>
                
                <Group gap={4}>
                  <RenderIcon iconName="IconUsers" size={16} iconColor={mockQuestData.familyIconColor} />
                  <Text size="xs" c="dimmed">{mockQuestData.familyName}</Text>
                </Group>
              </Card>
            </div>

            {/* レイアウト案2: グリッド型・情報充実 */}
            <div>
              <Title order={3} size="h4" mb="md">案2: グリッド型・情報充実</Title>
              <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400, borderColor: mockQuestData.iconColor }}>
                <Group justify="space-between" mb="md">
                  <RenderIcon iconName={mockQuestData.iconName} size={56} iconColor={mockQuestData.iconColor} />
                  <Stack gap={4} align="flex-end">
                    <Badge size="lg" variant="filled" leftSection={<IconWorld size={14} />}>公開中</Badge>
                    <Text size="xs" c="dimmed">{mockQuestData.categoryName}</Text>
                  </Stack>
                </Group>
                
                <Text fw={700} size="lg" mb="md" lineClamp={2}>{mockQuestData.name}</Text>
                
                <Stack gap="sm" mb="md">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">報酬</Text>
                    <Group gap="xs">
                      <IconTrophy size={18} color="gold" />
                      <Text size="sm" fw={700}>{mockQuestData.reward}円</Text>
                    </Group>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">対象年齢</Text>
                    <Text size="sm">{mockQuestData.ageFrom}〜{mockQuestData.ageTo}歳</Text>
                  </Group>
                </Stack>
                
                <Group gap="xs" mb="md">
                  {mockQuestData.tags.map((tag, i) => (
                    <Badge key={i} size="sm" variant="outline">{tag}</Badge>
                  ))}
                </Group>
                
                <Divider mb="md" />
                
                <Group justify="space-between">
                  <Group gap={4}>
                    <RenderIcon iconName="IconUsers" size={18} iconColor={mockQuestData.familyIconColor} />
                    <Text size="sm" c="dimmed">{mockQuestData.familyName}</Text>
                  </Group>
                  <Group gap="md">
                    <Group gap={4}>
                      <IconHeart size={18} color="red" fill="red" />
                      <Text size="sm" fw={600}>{mockQuestData.likeCount}</Text>
                    </Group>
                    <Group gap={4}>
                      <IconMessageCircle size={18} />
                      <Text size="sm" fw={600}>{mockQuestData.commentCount}</Text>
                    </Group>
                  </Group>
                </Group>
              </Card>
            </div>

            {/* レイアウト案3: カード型・画像風 */}
            <div>
              <Title order={3} size="h4" mb="md">案3: カード型・ビジュアル重視</Title>
              <Card shadow="md" padding={0} radius="md" withBorder style={{ maxWidth: 400, overflow: "hidden" }}>
                {/* ヘッダー（グラデーション背景） */}
                <div style={{
                  background: `linear-gradient(135deg, ${mockQuestData.iconColor} 0%, ${mockQuestData.iconColor}AA 100%)`,
                  padding: "24px 16px",
                  position: "relative"
                }}>
                  <Group justify="space-between" mb="lg">
                    <Badge size="lg" variant="filled" color="dark" leftSection={<IconWorld size={14} />}>
                      公開クエスト
                    </Badge>
                    <Group gap="sm">
                      <Group gap={4}>
                        <IconHeart size={18} color="white" fill="white" />
                        <Text size="sm" fw={700} c="white">{mockQuestData.likeCount}</Text>
                      </Group>
                      <Group gap={4}>
                        <IconMessageCircle size={18} color="white" />
                        <Text size="sm" fw={700} c="white">{mockQuestData.commentCount}</Text>
                      </Group>
                    </Group>
                  </Group>
                  
                  <Group gap="md" align="flex-start">
                    <RenderIcon iconName={mockQuestData.iconName} size={72} iconColor="#FFFFFF" />
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Text fw={700} size="xl" c="white" lineClamp={2}>{mockQuestData.name}</Text>
                      <Badge size="md" variant="filled" color="dark">{mockQuestData.categoryName}</Badge>
                    </Stack>
                  </Group>
                </div>
                
                {/* コンテンツ */}
                <Stack gap="md" p="md">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconTrophy size={24} color="gold" />
                      <Text size="xl" fw={700} style={{ color: mockQuestData.iconColor }}>{mockQuestData.reward}円</Text>
                    </Group>
                    <Text size="sm" c="dimmed">対象: {mockQuestData.ageFrom}〜{mockQuestData.ageTo}歳</Text>
                  </Group>
                  
                  <Group gap="xs">
                    {mockQuestData.tags.map((tag, i) => (
                      <Badge key={i} size="md" variant="light" style={{ borderColor: mockQuestData.iconColor }}>
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                  
                  <Divider />
                  
                  <Group gap="xs">
                    <RenderIcon iconName="IconUsers" size={20} iconColor={mockQuestData.familyIconColor} />
                    <Text size="sm" fw={500}>{mockQuestData.familyName}</Text>
                  </Group>
                </Stack>
              </Card>
            </div>
          </Stack>
        </Tabs.Panel>

        {/* テンプレートクエスト */}
        <Tabs.Panel value="template" pt="xl">
          <Title order={2} mb="md">テンプレートクエスト レイアウト案</Title>
          
          <Stack gap="xl">
            {/* レイアウト案1: シンプル・リスト型 */}
            <div>
              <Title order={3} size="h4" mb="md">案1: シンプル・リスト型（現行ベース）</Title>
              <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400, borderColor: mockQuestData.iconColor }}>
                <Group justify="space-between" mb="xs">
                  <RenderIcon iconName={mockQuestData.iconName} size={48} iconColor={mockQuestData.iconColor} />
                  <Text size="xs" c="dimmed">3日前に保存</Text>
                </Group>
                
                <Text fw={700} size="lg" mb="xs" lineClamp={2}>{mockQuestData.name}</Text>
                
                <Text size="sm" c="dimmed" mb="xs">対象年齢: {mockQuestData.ageFrom}〜{mockQuestData.ageTo}歳</Text>
                
                <Text size="sm" fw={500} mb="xs">報酬: {mockQuestData.reward}円〜</Text>
                
                <Group gap="xs" mb="xs">
                  {mockQuestData.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} size="sm" variant="light">{tag}</Badge>
                  ))}
                </Group>
                
                <Group gap="xs">
                  <RenderIcon iconName="IconUsers" size={20} iconColor={mockQuestData.familyIconColor} />
                  <Text size="xs" c="dimmed">{mockQuestData.familyName}</Text>
                </Group>
              </Card>
            </div>

            {/* レイアウト案2: ブックマーク風 */}
            <div>
              <Title order={3} size="h4" mb="md">案2: ブックマーク風</Title>
              <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400, borderColor: mockQuestData.iconColor, position: "relative" }}>
                {/* ブックマークリボン */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  right: 16,
                  width: 32,
                  height: 48,
                  backgroundColor: mockQuestData.iconColor,
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)",
                }}>
                  <IconStar size={16} color="white" style={{ margin: "8px auto", display: "block" }} />
                </div>
                
                <Group gap="md" mb="md">
                  <RenderIcon iconName={mockQuestData.iconName} size={56} iconColor={mockQuestData.iconColor} />
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Badge size="sm" variant="light">テンプレート</Badge>
                    <Text size="xs" c="dimmed">3日前に保存</Text>
                  </Stack>
                </Group>
                
                <Text fw={700} size="lg" mb="sm" lineClamp={2}>{mockQuestData.name}</Text>
                
                <Stack gap="xs" mb="md">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">報酬目安</Text>
                    <Text size="sm" fw={600}>{mockQuestData.reward}円〜</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">対象年齢</Text>
                    <Text size="sm">{mockQuestData.ageFrom}〜{mockQuestData.ageTo}歳</Text>
                  </Group>
                </Stack>
                
                <Group gap="xs" mb="md">
                  {mockQuestData.tags.map((tag, i) => (
                    <Badge key={i} size="sm" variant="outline">{tag}</Badge>
                  ))}
                </Group>
                
                <Divider mb="sm" />
                
                <Group gap={4}>
                  <Text size="xs" c="dimmed">保存元:</Text>
                  <RenderIcon iconName="IconUsers" size={16} iconColor={mockQuestData.familyIconColor} />
                  <Text size="xs" fw={500}>{mockQuestData.familyName}</Text>
                </Group>
              </Card>
            </div>

            {/* レイアウト案3: カタログ風 */}
            <div>
              <Title order={3} size="h4" mb="md">案3: カタログ風</Title>
              <Card shadow="sm" padding={0} radius="md" withBorder style={{ maxWidth: 400, overflow: "hidden" }}>
                {/* 画像エリア風の背景 */}
                <div style={{
                  backgroundColor: `${mockQuestData.iconColor}22`,
                  padding: "32px 16px",
                  textAlign: "center",
                  borderBottom: `3px solid ${mockQuestData.iconColor}`
                }}>
                  <RenderIcon iconName={mockQuestData.iconName} size={80} iconColor={mockQuestData.iconColor} />
                  <Text fw={700} size="xl" mt="md" lineClamp={2}>{mockQuestData.name}</Text>
                  <Badge size="lg" variant="filled" mt="sm" style={{ backgroundColor: mockQuestData.iconColor }}>
                    {mockQuestData.categoryName}
                  </Badge>
                </div>
                
                <Stack gap="md" p="md">
                  <Group justify="space-between">
                    <Stack gap={4}>
                      <Text size="xs" c="dimmed">報酬目安</Text>
                      <Group gap="xs">
                        <IconTrophy size={20} color="gold" />
                        <Text size="lg" fw={700}>{mockQuestData.reward}円〜</Text>
                      </Group>
                    </Stack>
                    <Stack gap={4} align="flex-end">
                      <Text size="xs" c="dimmed">対象年齢</Text>
                      <Text size="md" fw={600}>{mockQuestData.ageFrom}〜{mockQuestData.ageTo}歳</Text>
                    </Stack>
                  </Group>
                  
                  <Divider />
                  
                  <Group gap="xs" justify="center">
                    {mockQuestData.tags.map((tag, i) => (
                      <Badge key={i} size="md" variant="light">{tag}</Badge>
                    ))}
                  </Group>
                  
                  <Divider />
                  
                  <Group justify="space-between">
                    <Group gap="xs">
                      <RenderIcon iconName="IconUsers" size={18} iconColor={mockQuestData.familyIconColor} />
                      <Text size="sm" c="dimmed">{mockQuestData.familyName}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">3日前に保存</Text>
                  </Group>
                </Stack>
              </Card>
            </div>
          </Stack>
        </Tabs.Panel>

        {/* 子供クエスト */}
        <Tabs.Panel value="child" pt="xl">
          <Title order={2} mb="md">子供クエスト レイアウト案</Title>
          
          <Stack gap="xl">
            {/* レイアウト案1: プログレス重視 */}
            <div>
              <Title order={3} size="h4" mb="md">案1: プログレス重視（現行ベース）</Title>
              <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400, borderColor: mockQuestData.iconColor }}>
                <Group justify="space-between" mb="xs">
                  <RenderIcon iconName={mockQuestData.iconName} size={48} iconColor={mockQuestData.iconColor} />
                  <Badge size="lg" color="blue">進行中</Badge>
                </Group>
                
                <Text fw={700} size="lg" mb="xs" lineClamp={2}>{mockQuestData.name}</Text>
                
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <IconTrophy size={18} color="gold" />
                    <Text size="sm" fw={600}>{mockQuestData.reward}円</Text>
                  </Group>
                  <Group gap="xs">
                    <IconStar size={18} color="orange" />
                    <Text size="sm" fw={600}>+{mockQuestData.exp} EXP</Text>
                  </Group>
                </Group>
                
                <Stack gap="xs" mb="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">進捗</Text>
                    <Text size="sm" fw={500}>{mockQuestData.currentCompletionCount}/{mockQuestData.requiredCompletionCount}回</Text>
                  </Group>
                  <Progress 
                    value={(mockQuestData.currentCompletionCount / mockQuestData.requiredCompletionCount) * 100} 
                    color={mockQuestData.iconColor}
                    size="md"
                  />
                </Stack>
                
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">レベル{mockQuestData.level}クリア</Text>
                    <Text size="sm" fw={500}>{mockQuestData.currentClearCount}/{mockQuestData.requiredClearCount}回</Text>
                  </Group>
                  <Progress 
                    value={(mockQuestData.currentClearCount / mockQuestData.requiredClearCount) * 100} 
                    color="blue"
                    size="sm"
                  />
                </Stack>
                
                <Text size="xs" c="dimmed" mt="xs">最終更新: 2時間前</Text>
              </Card>
            </div>

            {/* レイアウト案2: ゲーム風 */}
            <div>
              <Title order={3} size="h4" mb="md">案2: ゲーム風・RPG風</Title>
              <Card shadow="md" padding="md" radius="md" withBorder style={{ maxWidth: 400, borderColor: mockQuestData.iconColor, background: "linear-gradient(180deg, #fff 0%, #f8f9fa 100%)" }}>
                <Group justify="space-between" mb="md">
                  <Badge size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>Lv.{mockQuestData.level}</Badge>
                  <Badge size="lg" color="blue" leftSection={<IconClock size={14} />}>進行中</Badge>
                </Group>
                
                <Group gap="md" mb="md">
                  <div style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: `${mockQuestData.iconColor}22`,
                    border: `2px solid ${mockQuestData.iconColor}`
                  }}>
                    <RenderIcon iconName={mockQuestData.iconName} size={56} iconColor={mockQuestData.iconColor} />
                  </div>
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Text fw={700} size="xl" lineClamp={2}>{mockQuestData.name}</Text>
                    <Text size="sm" c="dimmed" lineClamp={1}>{mockQuestData.requestDetail}</Text>
                  </Stack>
                </Group>
                
                <Stack gap="md" mb="md" p="sm" style={{ backgroundColor: 'white', borderRadius: 8, border: '1px solid #dee2e6' }}>
                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconTrophy size={24} color="gold" />
                      <div>
                        <Text size="xs" c="dimmed">報酬</Text>
                        <Text size="lg" fw={700}>{mockQuestData.reward}円</Text>
                      </div>
                    </Group>
                    <Group gap="xs">
                      <IconStar size={24} color="orange" />
                      <div>
                        <Text size="xs" c="dimmed">経験値</Text>
                        <Text size="lg" fw={700}>+{mockQuestData.exp}</Text>
                      </div>
                    </Group>
                  </Group>
                </Stack>
                
                <Stack gap="sm" mb="md">
                  <div>
                    <Group justify="space-between" mb={4}>
                      <Text size="sm" fw={600}>クエスト進行度</Text>
                      <Text size="sm" fw={600}>{mockQuestData.currentCompletionCount}/{mockQuestData.requiredCompletionCount}</Text>
                    </Group>
                    <Progress value={(mockQuestData.currentCompletionCount / mockQuestData.requiredCompletionCount) * 100} color={mockQuestData.iconColor} size="lg" />
                  </div>
                  
                  <div>
                    <Group justify="space-between" mb={4}>
                      <Text size="xs" c="dimmed">レベルアップまで</Text>
                      <Text size="xs" c="dimmed">{mockQuestData.requiredClearCount - mockQuestData.currentClearCount}回</Text>
                    </Group>
                    <Progress value={(mockQuestData.currentClearCount / mockQuestData.requiredClearCount) * 100} color="blue" size="sm" />
                  </div>
                </Stack>
                
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">依頼者: {mockQuestData.client}</Text>
                  <Text size="xs" c="dimmed">2時間前に更新</Text>
                </Group>
              </Card>
            </div>

            {/* レイアウト案3: ステータス重視・シンプル */}
            <div>
              <Title order={3} size="h4" mb="md">案3: ステータス重視・シンプル</Title>
              <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 400, borderLeft: `6px solid ${mockQuestData.iconColor}` }}>
                <Group justify="space-between" mb="md">
                  <Group gap="md">
                    <RenderIcon iconName={mockQuestData.iconName} size={48} iconColor={mockQuestData.iconColor} />
                    <div>
                      <Text fw={700} size="lg" lineClamp={1}>{mockQuestData.name}</Text>
                      <Text size="xs" c="dimmed">レベル {mockQuestData.level}</Text>
                    </div>
                  </Group>
                  <Badge size="lg" color="blue" variant="light">進行中</Badge>
                </Group>
                
                <div style={{ backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                  <Group justify="space-between" mb="sm">
                    <Text size="sm" fw={600}>今回の目標</Text>
                    <Badge size="md" variant="filled" style={{ backgroundColor: mockQuestData.iconColor }}>
                      {mockQuestData.currentCompletionCount}/{mockQuestData.requiredCompletionCount}回
                    </Badge>
                  </Group>
                  <Progress 
                    value={(mockQuestData.currentCompletionCount / mockQuestData.requiredCompletionCount) * 100} 
                    color={mockQuestData.iconColor} 
                    size="xl" 
                  />
                </div>
                
                <Group justify="space-between" mb="md">
                  <Group gap="md">
                    <Stack gap={4} align="center">
                      <IconTrophy size={20} color="gold" />
                      <Text size="xs" c="dimmed">報酬</Text>
                      <Text size="md" fw={700}>{mockQuestData.reward}円</Text>
                    </Stack>
                    <Stack gap={4} align="center">
                      <IconStar size={20} color="orange" />
                      <Text size="xs" c="dimmed">経験値</Text>
                      <Text size="md" fw={700}>+{mockQuestData.exp}</Text>
                    </Stack>
                    <Stack gap={4} align="center">
                      <IconCheck size={20} color="green" />
                      <Text size="xs" c="dimmed">クリア</Text>
                      <Text size="md" fw={700}>{mockQuestData.currentClearCount}回</Text>
                    </Stack>
                  </Group>
                </Group>
                
                <Divider mb="sm" />
                
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">依頼者: {mockQuestData.client}</Text>
                  <Text size="xs" c="dimmed">2時間前</Text>
                </Group>
              </Card>
            </div>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

export default QuestCardLayoutsPage
