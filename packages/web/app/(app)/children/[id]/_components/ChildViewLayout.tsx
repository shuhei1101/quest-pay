"use client"

import { Box, Card, Group, Stack, Text } from "@mantine/core"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
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
  
  // 4月1日より前に生まれた場合は1歳引く
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

/** 統計カード */
const StatCard = ({ 
  label, 
  value, 
  color, 
  onClick 
}: { 
  label: string
  value: string | number
  color: string
  onClick?: () => void
}) => {
  return (
    <Card
      shadow="sm"
      padding="xs"
      radius="md"
      withBorder
      onClick={onClick}
      className={onClick ? "cursor-pointer" : ""}
      style={{
        backgroundColor: color,
        minWidth: "100px",
        textAlign: "center",
      }}
    >
      <Stack gap="xs">
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

/** 子供閲覧画面レイアウト */
export const ChildViewLayout = ({
  child,
  questStats,
  onRankClick,
  onCompletedQuestClick,
  onTotalRewardClick,
  onFixedRewardClick,
  onSavingsClick,
  onMonthlyRewardClick,
}: {
  child: Child | undefined
  questStats?: { inProgressCount: number; completedCount: number }
  onRankClick?: () => void
  onCompletedQuestClick?: () => void
  onTotalRewardClick?: () => void
  onFixedRewardClick?: () => void
  onSavingsClick?: () => void
  onMonthlyRewardClick?: () => void
}) => {
  // 年齢を計算する
  const age = calculateAge(child?.profiles?.birthday)
  
  // 学年を計算する
  const grade = calculateGrade(child?.profiles?.birthday)
  
  // 誕生日をフォーマットする
  const formattedBirthday = formatDate(child?.profiles?.birthday)
  
  // 合計報酬額を計算する（ダミーデータ、実際のロジックは後で実装）
  const totalReward = 10000
  
  // 定額報酬を取得する（ダミーデータ、実際のロジックは後で実装）
  const fixedReward = 1900
  
  // 今月の報酬を取得する（ダミーデータ、実際のロジックは後で実装）
  const monthlyReward = 3000
  const monthlyRewardDate = "2024/6/30"

  return (
    <Box>
      {/* プロフィールカード */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md" style={{ backgroundColor: "#E0F2F7" }}>
        <Stack gap="md">
          {/* アイコンと名前 */}
          <Group gap="md" align="center">
            <Box
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "#B3E5FC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RenderIcon iconName={child?.icons?.name} iconColor={child?.profiles?.iconColor} size={40} />
            </Box>
            <div>
              <Text size="xl" fw={700}>
                {child?.profiles?.name ?? ""}くん
              </Text>
              <Text size="sm" c="dimmed">
                @test
              </Text>
            </div>
          </Group>
          
          {/* プロフィール情報 */}
          <Stack gap="xs">
            {age !== null && (
              <Text size="sm">年齢：{age}歳</Text>
            )}
            {formattedBirthday && (
              <Text size="sm">誕生日：{formattedBirthday}</Text>
            )}
            {grade && (
              <Text size="sm">学年：{grade}</Text>
            )}
          </Stack>
          
          {/* 統計カード群（2行） */}
          <Stack gap="md">
            {/* 1行目：ランク、達成クエスト、合計報酬額 */}
            <Group gap="md" justify="space-between">
              <StatCard 
                label="ランク" 
                value={child?.children?.currentLevel ?? 1} 
                color="#9C27B0"
                onClick={onRankClick}
              />
              <StatCard 
                label="達成クエスト" 
                value={questStats?.completedCount ?? 0} 
                color="#F44336"
                onClick={onCompletedQuestClick}
              />
              <StatCard 
                label="合計報酬額" 
                value={`${totalReward}円`} 
                color="#FF9800"
                onClick={onTotalRewardClick}
              />
            </Group>
            
            {/* 2行目：定額報酬、貯金 */}
            <Group gap="md" justify="flex-start">
              <StatCard 
                label="定額報酬" 
                value={`${fixedReward}円/月`} 
                color="#00BCD4"
                onClick={onFixedRewardClick}
              />
              <StatCard 
                label="貯金" 
                value={`${child?.children?.currentSavings ?? 0}円`} 
                color="#4CAF50"
                onClick={onSavingsClick}
              />
            </Group>
          </Stack>
        </Stack>
      </Card>
      
      {/* 今月の報酬カード */}
      <Card 
        shadow="sm" 
        padding="lg" 
        radius="md" 
        withBorder 
        mb="md"
        onClick={onMonthlyRewardClick}
        className={onMonthlyRewardClick ? "cursor-pointer" : ""}
        style={{ backgroundColor: "#FFC107" }}
      >
        <Stack gap="xs">
          <Group gap="xs" align="center">
            <Text size="sm" fw={500} c="white">
              ◇ 今月の報酬金
            </Text>
          </Group>
          <Text size="3rem" fw={700} c="white" ta="center">
            {monthlyReward}円
          </Text>
          <Text size="sm" c="white" ta="right">
            支払い日：{monthlyRewardDate}
          </Text>
        </Stack>
      </Card>
    </Box>
  )
}
