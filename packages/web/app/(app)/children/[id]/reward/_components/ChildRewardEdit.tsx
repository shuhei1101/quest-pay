"use client"
import { Box, Text, LoadingOverlay, Button, Group, ActionIcon, Tabs } from "@mantine/core"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CHILD_REWARD_VIEW_URL } from "@/app/(core)/endpoints"
import { IconDeviceFloppy, IconRotate } from "@tabler/icons-react"
import { useChildAgeRewardForm } from "../by-age/_hooks/useChildAgeRewardForm"
import { useChildLevelRewardForm } from "../by-level/_hooks/useChildLevelRewardForm"
import { AgeRewardEditLayout } from "@/app/(app)/reward/by-age/_components/AgeRewardEditLayout"
import { LevelRewardEditLayout } from "@/app/(app)/reward/by-level/_components/LevelRewardEditLayout"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { putChildAgeRewardTable } from "@/app/api/children/[id]/reward/by-age/table/client"
import { putChildLevelRewardTable } from "@/app/api/children/[id]/reward/by-level/table/client"
import toast from "react-hot-toast"
import { AgeRewardFormType } from "@/app/(app)/reward/by-age/form"
import { LevelRewardFormType } from "@/app/(app)/reward/by-level/form"

type Props = {
  childId: string
}

/** 子供個別の報酬編集画面 */
export const ChildRewardEdit = ({ childId }: Props) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<string | null>("age")

  // フォームを取得する
  const ageForm = useChildAgeRewardForm(childId)
  const levelForm = useChildLevelRewardForm(childId)

  // お小遣い更新処理
  const ageUpdateMutation = useMutation({
    mutationFn: async (data: AgeRewardFormType) => await putChildAgeRewardTable(childId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["childAgeRewardTable", childId] })
      toast.success("定額報酬を更新しました")
      router.push(CHILD_REWARD_VIEW_URL(childId))
    },
    onError: () => {
      toast.error("定額報酬の更新に失敗しました")
    }
  })

  // ランク報酬更新処理
  const levelUpdateMutation = useMutation({
    mutationFn: async (data: LevelRewardFormType) => await putChildLevelRewardTable(childId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["childLevelRewardTable", childId] })
      toast.success("ランク報酬を更新しました")
      router.push(CHILD_REWARD_VIEW_URL(childId))
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
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>定額報酬の編集（子供個別）</Text>
        {/* アクションボタン */}
        <Group>
          <ActionIcon 
            size="lg" 
            variant="light" 
            color="blue"
            onClick={() => {
              if (window.confirm("入力内容を破棄してもよろしいですか？")) {
                if (activeTab === "age") {
                  ageForm.setForm(ageForm.fetchedAgeReward)
                } else {
                  levelForm.setForm(levelForm.fetchedLevelReward)
                }
              }
            }}
          >
            <IconRotate size={18} />
          </ActionIcon>
          <Button 
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={() => {
              if (activeTab === "age") {
                ageForm.handleSubmit((data) => ageUpdateMutation.mutate(data))()
              } else {
                levelForm.handleSubmit((data) => levelUpdateMutation.mutate(data))()
              }
            }}
          >
            保存
          </Button>
        </Group>
      </Group>

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

      {/* フローティング保存ボタン（モバイル用） */}
      <Box className="md:hidden fixed bottom-4 right-4 z-50">
        <Button 
          size="lg"
          leftSection={<IconDeviceFloppy size={20} />}
          onClick={() => {
            if (activeTab === "age") {
              ageForm.handleSubmit((data) => ageUpdateMutation.mutate(data))()
            } else {
              levelForm.handleSubmit((data) => levelUpdateMutation.mutate(data))()
            }
          }}
        >
          保存
        </Button>
      </Box>
    </Box>
  )
}
