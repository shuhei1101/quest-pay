"use client"

import { Box, LoadingOverlay } from "@mantine/core"
import { useState, useEffect } from "react"
import { useRewardHistory, useStartPayment, useCompletePayment } from "../_hook/useRewardHistory"
import { RewardHistoryLayout } from "./RewardHistoryLayout"
import { useRouter } from "next/navigation"
import dayjs from "dayjs"
import "dayjs/locale/ja"

dayjs.locale('ja')

/** お小遣い管理画面 */
export const RewardHistoryScreen = ({ 
  childId, 
  childName,
  isParent 
}: { 
  childId: string
  childName: string
  isParent: boolean
}) => {
  const router = useRouter()

  /** 選択された年月 */
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>("")
  /** 選択されたタイプ（報酬履歴 or 経験値履歴） */
  const [selectedType, setSelectedType] = useState<"reward" | "exp">("reward")

  /** 報酬履歴と経験値履歴を取得する */
  const { histories, monthlyStats, isLoading } = useRewardHistory({ childId, yearMonth: selectedYearMonth })
  /** 支払い開始処理 */
  const { startPayment, isStarting } = useStartPayment({ childId })
  /** 支払い完了処理 */
  const { completePayment, isCompleting } = useCompletePayment({ childId })

  useEffect(() => {
    if (monthlyStats.length > 0 && !selectedYearMonth) {
      setSelectedYearMonth(monthlyStats[0].yearMonth)
    }
  }, [monthlyStats, selectedYearMonth])

  /** 支払い開始ボタンがクリックされたときの処理 */
  const handlePaymentClick = () => {
    if (!selectedYearMonth) return
    startPayment({ yearMonth: selectedYearMonth })
  }

  /** 支払い完了ボタンがクリックされたときの処理 */
  const handleCompleteClick = () => {
    if (!selectedYearMonth) return
    completePayment({ yearMonth: selectedYearMonth })
  }

  return (
    <Box pos="relative" style={{ height: "100%" }}>
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      
      <RewardHistoryLayout
        childName={childName}
        histories={histories}
        monthlyStats={monthlyStats}
        selectedYearMonth={selectedYearMonth}
        onYearMonthChange={setSelectedYearMonth}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        isParent={isParent}
        onPaymentClick={handlePaymentClick}
        onCompleteClick={handleCompleteClick}
        isProcessing={isStarting || isCompleting}
      />
    </Box>
  )
}
