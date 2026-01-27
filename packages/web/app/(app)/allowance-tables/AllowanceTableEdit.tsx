'use client'
import { useState } from "react"
import { LoadingOverlay, Tabs, Button, ActionIcon } from "@mantine/core"
import { useRouter } from "next/navigation"
import { useAllowanceTables } from "../_hook/useAllowanceTables"
import { useUpdateAllowanceTables } from "../_hook/useUpdateAllowanceTables"
import { AllowanceTableEditLayout } from "./edit/_components/AllowanceTableEditLayout"
import { LevelRewardEditLayout } from "./edit/_components/LevelRewardEditLayout"
import { ScrollableTabs, ScrollableTabItem } from "@/app/(core)/_components/ScrollableTabs"
import { ALLOWANCE_TABLE_VIEW_URL } from "@/app/(core)/endpoints"
import { IconArrowLeft, IconDeviceFloppy, IconRefresh } from "@tabler/icons-react"

type LevelReward = {
  level: number
  amount: number
}

/** お小遣いテーブル編集画面 */
export const AllowanceTableEdit = () => {
  const router = useRouter()
  const { allowanceTable, levelTable, isLoading } = useAllowanceTables()
  const { updateAllowanceTables, isUpdating } = useUpdateAllowanceTables()
  const [activeTab, setActiveTab] = useState<string | null>("allowance")
  
  // レベル報酬の一時保存用
  const [tempLevelRewards, setTempLevelRewards] = useState<LevelReward[]>([])

  /** タブアイテム */
  const tabItems: ScrollableTabItem[] = [
    { value: "allowance", label: "お小遣い" },
    { value: "level", label: "ランク報酬" }
  ]

  /** 保存する */
  const handleSave = () => {
    // TODO: お小遣いとランク報酬の両方のデータを保存する
    // 現在のタブに応じて適切なデータを保存する
    if (activeTab === "level") {
      updateAllowanceTables({
        allowanceByAges: allowanceTable?.allowanceByAges?.map(item => ({ age: item.age, amount: item.amount })) || [],
        levelRewards: tempLevelRewards
      })
    }
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4 px-4 pt-4">
        {/* 戻るボタン */}
        <ActionIcon
          variant="subtle"
          onClick={() => router.push(ALLOWANCE_TABLE_VIEW_URL)}
        >
          <IconArrowLeft size={24} />
        </ActionIcon>

        {/* 右側のボタン群 */}
        <div className="flex gap-2">
          {/* リフレッシュボタン */}
          <ActionIcon
            variant="subtle"
            onClick={() => window.location.reload()}
          >
            <IconRefresh size={24} />
          </ActionIcon>

          {/* 保存ボタン */}
          <ActionIcon
            variant="subtle"
            onClick={handleSave}
            loading={isUpdating}
          >
            <IconDeviceFloppy size={24} />
          </ActionIcon>
        </div>
      </div>

      {/* タブ */}
      <ScrollableTabs value={activeTab} onChange={setActiveTab} items={tabItems}>
        {/* お小遣いタブ */}
        <Tabs.Panel value="allowance">
          <AllowanceTableEditLayout
            initialAllowanceByAges={allowanceTable?.allowanceByAges || []}
          />
        </Tabs.Panel>

        {/* ランク報酬タブ */}
        <Tabs.Panel value="level">
          <LevelRewardEditLayout
            initialLevelRewards={levelTable?.levelRewards || []}
            onUpdate={setTempLevelRewards}
          />
        </Tabs.Panel>
      </ScrollableTabs>
    </div>
  )
}
