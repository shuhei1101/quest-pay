"use client"

import { Box, Card, Group, Stack, Text, SimpleGrid, RingProgress, Center, ThemeIcon, Progress, Divider } from "@mantine/core"
import { IconCake, IconCalendar, IconSchool, IconTrophy, IconChecklist, IconCoin, IconWallet, IconStar, IconEdit, IconExternalLink } from "@tabler/icons-react"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { SubMenuFAB } from "@/app/(core)/_components/SubMenuFAB"
import { Child } from "@/app/api/children/query"
import { calculateAge, formatDate } from "@/app/(core)/util"
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

// dayjs のロケールを日本語に設定
dayjs.locale('ja')

/** 学年を計算する */
const calculateGrade = (birthday: string | null | undefined): string | null => {
  if (!birthday) return null
  
  const birthDate = new Date(birthday)
  if (isNaN(birthDate.getTime())) return null
  
  const today = new Date()
  const birthYear = birthDate.getFullYear()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1 // 0-11 -> 1-12
  
  // 4月1日時点での年齢を基準に学年を計算する
  let ageAtApril = currentYear - birthYear
  
  // 4月1日より後に生まれた場合は1歳引く
  if (birthDate.getMonth() + 1 > 4 || (birthDate.getMonth() + 1 === 4 && birthDate.getDate() > 1)) {
    ageAtApril--
  }
  
  // 現在の月が4月より前の場合は前年度の学年を計算する
  if (currentMonth < 4) {
    ageAtApril--
  }
  
  // 学年を判定する
  if (ageAtApril < 6) return "未就学"
  if (ageAtApril >= 6 && ageAtApril <= 11) {
    const grade = ageAtApril - 5
    return `小学${grade}年生`
  }
  if (ageAtApril >= 12 && ageAtApril <= 14) {
    const grade = ageAtApril - 11
    return `中学${grade}年生`
  }
  if (ageAtApril >= 15 && ageAtApril <= 17) {
    const grade = ageAtApril - 14
    return `高校${grade}年生`
  }
  if (ageAtApril >= 18) return "高校卒業以上"
  
  return null
}

/** 子供閲覧画面レイアウト */
export const ChildViewLayout = ({
  child,
  questStats,
  rewardStats,
  fixedReward,
  onSavingsClick,
  onFixedRewardClick,
  onFixedRewardEditClick,
}: {
  child: Child | undefined
  questStats?: { inProgressCount: number; completedCount: number }
  rewardStats?: { totalReward: number; monthlyReward: number }
  fixedReward?: { ageReward: number | null; levelReward: number | null; totalFixedReward: number }
  onSavingsClick?: () => void
  onFixedRewardClick?: () => void
  onFixedRewardEditClick?: () => void
}) => {
  // 年齢を計算する
  const age = calculateAge(child?.profiles?.birthday)
  
  // 学年を計算する
  const grade = calculateGrade(child?.profiles?.birthday)
  
  // 誕生日をフォーマットする
  const formattedBirthday = formatDate(child?.profiles?.birthday)
  
  // 現在のレベルと経験値を取得
  const currentLevel = child?.children?.currentLevel ?? 1
  const totalExp = child?.children?.totalExp ?? 0
  
  // レベルごとの必要経験値を計算（レベル * 100）
  const getExpForLevel = (level: number): number => {
    return level * 100
  }
  
  // 現在のレベルの開始時の累積経験値を計算
  const getStartExpForLevel = (level: number): number => {
    let exp = 0
    for (let i = 1; i < level; i++) {
      exp += getExpForLevel(i)
    }
    return exp
  }
  
  // 現在のレベルでの経験値
  const startExpForCurrentLevel = getStartExpForLevel(currentLevel)
  const currentExp = totalExp - startExpForCurrentLevel
  
  // 次のレベルまでに必要な経験値
  const nextLevelExp = getExpForLevel(currentLevel)
  
  // 経験値のパーセンテージを計算
  const expPercentage = nextLevelExp > 0 ? (currentExp / nextLevelExp) * 100 : 0
  
  // 実際のデータを使用（未設定の場合は0）
  const totalReward = rewardStats?.totalReward ?? 0
  const monthlyReward = rewardStats?.monthlyReward ?? 0
  const totalFixedReward = fixedReward?.totalFixedReward ?? 0
  
  // 支払い予定日を計算（次月末）
  const nextMonthEnd = dayjs().add(1, 'month').endOf('month').format('YYYY/M/D')

  return (
    <Box>
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
            <RenderIcon iconName={child?.icons?.name} iconColor="#FFFFFF" size={50} />
          </Box>
          
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text size="2rem" fw={700}>{child?.profiles?.name ?? ""}</Text>
            <Group gap="lg">
              <Group gap="xs">
                <IconCake size={20} color="#666" />
                <Text size="sm" c="dimmed">{age !== null ? `${age}歳` : ""}</Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={20} color="#666" />
                <Text size="sm" c="dimmed">{formattedBirthday || ""}</Text>
              </Group>
              <Group gap="xs">
                <IconSchool size={20} color="#666" />
                <Text size="sm" c="dimmed">{grade || ""}</Text>
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
                      <Text size="xl" fw={700} c="#667eea">Lv.{child?.children?.currentLevel ?? 1}</Text>
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
                <Text size="2rem" fw={700} c="#667eea">{currentExp}</Text>
                <Text size="sm" c="dimmed">EXP</Text>
              </Group>
            </Box>
            
            <Divider />
            
            <Box>
              <Text size="sm" c="dimmed" mb="xs">次のレベルまで</Text>
              <Group gap="xs">
                <Text size="xl" fw={700} c="#999">
                  {nextLevelExp - currentExp}
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
            <Text size="xl" fw={700}>{child?.children?.currentLevel ?? 1}</Text>
          </Box>
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="red" mb="xs">
              <IconChecklist size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">達成クエスト</Text>
            <Text size="xl" fw={700}>{questStats?.completedCount ?? 0}</Text>
          </Box>
          <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={50} radius="xl" variant="light" color="blue" mb="xs">
              <IconChecklist size={28} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">進行中</Text>
            <Text size="xl" fw={700}>{questStats?.inProgressCount ?? 0}</Text>
          </Box>
        </SimpleGrid>
      </Card>

      {/* お金の統計カード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text size="lg" fw={600} mb="md">お金の管理</Text>
        <Stack gap="md">
          <Card padding="md" radius="md" style={{ backgroundColor: "#FFF9C4" }}>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <IconWallet size={24} color="#F57C00" />
                <Text fw={600}>今月の報酬</Text>
              </Group>
              <Text size="xs" c="dimmed">支払い日: {nextMonthEnd}</Text>
            </Group>
            <Text size="2.5rem" fw={700} c="#F57C00">{monthlyReward.toLocaleString()}円</Text>
          </Card>
          
          <SimpleGrid cols={3} spacing="md">
            <Card padding="sm" radius="md" style={{ backgroundColor: "#E1F5FE" }}>
              <Text size="xs" c="dimmed" mb="xs">報酬合計</Text>
              <Text size="lg" fw={700} c="#0277BD">{totalReward.toLocaleString()}円</Text>
            </Card>
            <Card 
              padding="sm" 
              radius="md" 
              style={{ backgroundColor: "#F3E5F5", cursor: onFixedRewardClick ? "pointer" : "default", position: "relative" }}
              onClick={onFixedRewardClick}
              className={onFixedRewardClick ? "hover:shadow-md transition-shadow" : ""}
            >
              {onFixedRewardClick && (
                <Box style={{ position: "absolute", top: 8, right: 8 }}>
                  <IconExternalLink size={16} color="#6A1B9A" />
                </Box>
              )}
              <Text size="xs" c="dimmed" mb="xs">定額報酬</Text>
              <Text size="lg" fw={700} c="#6A1B9A">{totalFixedReward.toLocaleString()}円/月</Text>
            </Card>
            <Card 
              padding="sm" 
              radius="md" 
              style={{ backgroundColor: "#E8F5E9", cursor: onSavingsClick ? "pointer" : "default", position: "relative" }}
              onClick={onSavingsClick}
              className={onSavingsClick ? "hover:shadow-md transition-shadow" : ""}
            >
              {onSavingsClick && (
                <Box style={{ position: "absolute", top: 8, right: 8 }}>
                  <IconExternalLink size={16} color="#2E7D32" />
                </Box>
              )}
              <Text size="xs" c="dimmed" mb="xs">貯金</Text>
              <Text size="lg" fw={700} c="#2E7D32">{(child?.children?.currentSavings ?? 0).toLocaleString()}円</Text>
            </Card>
          </SimpleGrid>
        </Stack>
      </Card>

      {/* 定額報酬設定FAB */}
      {onFixedRewardEditClick && (
        <SubMenuFAB
          items={[
            {
              icon: <IconEdit size={20} />,
              label: "編集",
              onClick: onFixedRewardEditClick,
              color: "violet"
            }
          ]}
        />
      )}
    </Box>
  )
}
