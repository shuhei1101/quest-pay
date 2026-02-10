"use client"

import { Paper, Tabs, Text, Button, Badge } from "@mantine/core"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { useState } from "react"
import { useWindow } from "@/app/(core)/useConstants"
import dayjs from "dayjs"
import "dayjs/locale/ja"

dayjs.locale('ja')

/** 報酬履歴アイテム */
type RewardHistoryItem = {
  id: string
  title: string
  amount: number
  exp: number
  rewardedAt: string
  type: string
}

/** 月別統計 */
type MonthlyStatItem = {
  yearMonth: string
  totalAmount: number
  totalExp: number
  count: number
  isPaid: boolean
}

/** お小遣い管理画面レイアウトのプロパティ */
type RewardHistoryLayoutProps = {
  /** 子供名 */
  childName: string
  /** 報酬履歴リスト */
  histories: RewardHistoryItem[]
  /** 月別統計 */
  monthlyStats: MonthlyStatItem[]
  /** 選択中の年月 */
  selectedYearMonth: string
  /** 年月変更ハンドラ */
  onYearMonthChange: (yearMonth: string) => void
  /** 選択中のタイプ（報酬/経験値） */
  selectedType: "reward" | "exp"
  /** タイプ変更ハンドラ */
  onTypeChange: (type: "reward" | "exp") => void
  /** 親ユーザかどうか */
  isParent: boolean
  /** 支払いボタンクリック */
  onPaymentClick: () => void
  /** 受取完了ボタンクリック */
  onCompleteClick: () => void
  /** 支払い処理中かどうか */
  isProcessing: boolean
}

/** お小遣い管理画面レイアウト */
export const RewardHistoryLayout = ({
  childName,
  histories,
  monthlyStats,
  selectedYearMonth,
  onYearMonthChange,
  selectedType,
  onTypeChange,
  isParent,
  onPaymentClick,
  onCompleteClick,
  isProcessing
}: RewardHistoryLayoutProps) => {
  const { isDark } = useWindow()

  const currentMonthStat = monthlyStats.find(stat => stat.yearMonth === selectedYearMonth)
  const totalAmount = currentMonthStat?.totalAmount || 0
  const totalExp = currentMonthStat?.totalExp || 0
  const isPaid = currentMonthStat?.isPaid || false

  const [activeTab, setActiveTab] = useState<string | null>(selectedType)

  const handleTypeChange = (value: string | null) => {
    if (value === "reward" || value === "exp") {
      setActiveTab(value)
      onTypeChange(value)
    }
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <Text size="xl" fw={700}>{childName}のお小遣い管理</Text>
      </div>

      {/* 月タブ */}
      <div>
        <ScrollableTabs
          activeTab={selectedYearMonth}
          onChange={(value) => value && onYearMonthChange(value)}
          tabs={monthlyStats.map(stat => ({
            value: stat.yearMonth,
            label: dayjs(stat.yearMonth).format('YYYY/M')
          }))}
        >
          {monthlyStats.map(stat => (
            <Tabs.Panel key={stat.yearMonth} value={stat.yearMonth}>
              <div />
            </Tabs.Panel>
          ))}
        </ScrollableTabs>
      </div>

      {/* 合計金額カード */}
      <Paper
        p="lg"
        radius="md"
        style={{
          backgroundColor: isDark ? "#f59e0b" : "#fbbf24",
          color: "#ffffff"
        }}
      >
        <Text size="sm" fw={700} mb={8}>
          {selectedType === "reward" ? "報酬金" : "獲得経験値"}
        </Text>
        <Text size="36px" fw={700} mb={8}>
          {selectedType === "reward" ? `${totalAmount}円` : `${totalExp}EXP`}
        </Text>
        {isPaid && (
          <Text size="sm" mb={8}>
            支払い済み: {dayjs(currentMonthStat?.isPaid ? "済" : "未").format('YYYY/M/D')}
          </Text>
        )}
        {isParent && !isPaid && (
          <Button
            fullWidth
            variant="white"
            color="dark"
            onClick={onPaymentClick}
            disabled={isProcessing}
          >
            支払う
          </Button>
        )}
        {!isParent && !isPaid && (
          <Button
            fullWidth
            variant="white"
            color="dark"
            onClick={onCompleteClick}
            disabled={isProcessing}
          >
            受取完了
          </Button>
        )}
      </Paper>

      {/* 報酬/経験値タブ */}
      <div>
        <Tabs value={activeTab} onChange={handleTypeChange}>
          <Tabs.List>
            <Tabs.Tab value="reward">報酬</Tabs.Tab>
            <Tabs.Tab value="exp">経験値</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </div>

      {/* 報酬履歴リスト */}
      <Paper
        p="md"
        radius="md"
        style={{
          backgroundColor: isDark ? "#2e2e2e" : "#ffffff",
          flex: 1,
          overflow: "auto"
        }}
      >
        <Text size="lg" fw={700} mb="md">
          {selectedType === "reward" ? "クエスト報酬" : "獲得経験値"}
        </Text>
        <div className="flex flex-col gap-3">
          {histories.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              この月の履歴はありません
            </Text>
          ) : (
            histories.map((history) => (
              <div
                key={history.id}
                className="flex items-center justify-between p-3 border-b"
                style={{
                  borderColor: isDark ? "#444" : "#e5e5e5"
                }}
              >
                <div className="flex-1">
                  <Text fw={600}>{history.title}</Text>
                  <Text size="sm" c="dimmed">
                    {dayjs(history.rewardedAt).format('YYYY/M/D')}
                  </Text>
                </div>
                <div className="text-right">
                  <Text size="lg" fw={700}>
                    {selectedType === "reward" ? `${history.amount}円` : `${history.exp}EXP`}
                  </Text>
                </div>
              </div>
            ))
          )}
        </div>
        {histories.length > 0 && (
          <div
            className="flex items-center justify-between p-3 mt-3 border-t-2"
            style={{
              borderColor: isDark ? "#555" : "#d5d5d5"
            }}
          >
            <Text fw={700}>合計</Text>
            <Text size="xl" fw={700}>
              {selectedType === "reward" ? `${totalAmount}円` : `${totalExp}EXP`}
            </Text>
          </div>
        )}
      </Paper>
    </div>
  )
}
