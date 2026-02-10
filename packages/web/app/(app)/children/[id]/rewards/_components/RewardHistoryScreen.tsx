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

  const [selectedYearMonth, setSelectedYearMonth] = useState<string>("")
  const [selectedType, setSelectedType] = useState<"reward" | "exp">("reward")

  const { histories, monthlyStats, isLoading } = useRewardHistory({ childId, yearMonth: selectedYearMonth })
  const { startPayment, isStarting } = useStartPayment({ childId })
  const { completePayment, isCompleting } = useCompletePayment({ childId })

  useEffect(() => {
    if (monthlyStats.length > 0 && !selectedYearMonth) {
      setSelectedYearMonth(monthlyStats[0].yearMonth)
    }
  }, [monthlyStats, selectedYearMonth])

  const handlePaymentClick = () => {
    if (!selectedYearMonth) return
    startPayment({ yearMonth: selectedYearMonth })
  }

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
