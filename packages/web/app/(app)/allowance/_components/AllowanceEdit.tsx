"use client"
import { AllowanceEditLayout } from "./AllowanceEditLayout"
import { useAgeRewardTable, useLevelRewardTable } from "../_hooks/useAllowance"
import { useAgeRewardForm, useLevelRewardForm } from "../_hooks/useAllowanceForm"
import { useMemo } from "react"

/** お小遣い編集画面 */
export const AllowanceEdit = () => {
  // データを取得する
  const { data: ageData, isLoading: isAgeLoading } = useAgeRewardTable()
  const { data: levelData, isLoading: isLevelLoading } = useLevelRewardTable()

  // デフォルト値を設定する
  const ageDefaultValues = useMemo(() => ({
    rewards: ageData?.ageRewardTable.rewards || []
  }), [ageData])

  const levelDefaultValues = useMemo(() => ({
    rewards: levelData?.levelRewardTable.rewards || []
  }), [levelData])

  // フォームを取得する
  const ageForm = useAgeRewardForm({ defaultValues: ageDefaultValues })
  const levelForm = useLevelRewardForm({ defaultValues: levelDefaultValues })

  const isLoading = isAgeLoading || isLevelLoading || ageForm.mutation.isPending || levelForm.mutation.isPending

  // データが取得できるまで待つ
  if (!ageData || !levelData) {
    return null
  }

  return (
    <AllowanceEditLayout
      ageForm={ageForm}
      levelForm={levelForm}
      isLoading={isLoading}
      onAgeSubmit={(data) => ageForm.mutation.mutate(data)}
      onLevelSubmit={(data) => levelForm.mutation.mutate(data)}
    />
  )
}
