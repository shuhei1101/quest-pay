"use client"
import { Box, LoadingOverlay, Tabs } from "@mantine/core"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { PageHeader } from "@/app/(core)/_components/PageHeader"
import { useState } from "react"
import { IconDeviceFloppy, IconRotate } from "@tabler/icons-react"
import { SubMenuFAB } from "@/app/(core)/_components/SubMenuFAB"
import { useAgeRewardForm } from "../by-age/_hooks/useAgeRewardForm"
import { useLevelRewardForm } from "../by-level/_hooks/useLevelRewardForm"
import { AgeRewardEditLayout } from "../by-age/_components/AgeRewardEditLayout"
import { LevelRewardEditLayout } from "../by-level/_components/LevelRewardEditLayout"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { putFamilyAgeRewardTable } from "@/app/api/reward/by-age/table/client"
import { putFamilyLevelRewardTable } from "@/app/api/reward/by-level/table/client"
import toast from "react-hot-toast"
import { AgeRewardFormType } from "../by-age/form"
import { LevelRewardFormType } from "../by-level/form"

/** 報酬編集画面 */
export const RewardEdit = () => {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<string | null>("age")

  // フォームを取得する
  const ageForm = useAgeRewardForm()
  const levelForm = useLevelRewardForm()

  // お小遣い更新処理
  const ageUpdateMutation = useMutation({
    mutationFn: async (data: AgeRewardFormType) => await putFamilyAgeRewardTable(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ageRewardTable"] })
      toast.success("定額報酬を更新しました")
    },
    onError: () => {
      toast.error("定額報酬の更新に失敗しました")
    }
  })

  // ランク報酬更新処理
  const levelUpdateMutation = useMutation({
    mutationFn: async (data: LevelRewardFormType) => await putFamilyLevelRewardTable(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["levelRewardTable"] })
      toast.success("ランク報酬を更新しました")
    },
    onError: () => {
      toast.error("ランク報酬の更新に失敗しました")
    }
  })

  const isLoading = ageForm.isLoading || levelForm.isLoading || ageUpdateMutation.isPending || levelUpdateMutation.isPending

  // データが取得できるまで待つ
  if (ageForm.isLoading || levelForm.isLoading) {
    return null
  }

  return (
    <Box pos="relative" className="h-full flex flex-col">
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* ヘッダー */}
      <PageHeader title="定額報酬の編集" />

      {/* タブ切り替え */}
      <ScrollableTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { value: "age", label: "お小遣い" },
          { value: "level", label: "ランク報酬" }
        ]}
      >
        {/* お小遣いタブ */}
        <Tabs.Panel value="age">
          <AgeRewardEditLayout
            form={ageForm}
            onSubmit={(data) => ageUpdateMutation.mutate(data)}
          />
        </Tabs.Panel>

        {/* ランク報酬タブ */}
        <Tabs.Panel value="level">
          <LevelRewardEditLayout
            form={levelForm}
            onSubmit={(data) => levelUpdateMutation.mutate(data)}
          />
        </Tabs.Panel>
      </ScrollableTabs>

      {/* 定額報酬設定FAB */}
      <SubMenuFAB
        items={[
          {
            icon: <IconDeviceFloppy size={20} />,
            label: "保存",
            onClick: () => {
              if (activeTab === "age") {
                ageForm.handleSubmit((data) => ageUpdateMutation.mutate(data))()
              } else {
                levelForm.handleSubmit((data) => levelUpdateMutation.mutate(data))()
              }
            },
            color: "blue"
          },
          {
            icon: <IconRotate size={20} />,
            label: "破棄",
            onClick: () => {
              if (window.confirm("入力内容を破棄してもよろしいですか？")) {
                if (activeTab === "age") {
                  ageForm.setForm(ageForm.fetchedAgeReward)
                } else {
                  levelForm.setForm(levelForm.fetchedLevelReward)
                }
              }
            },
            color: "orange"
          }
        ]}
      />
    </Box>
  )
}
