'use client'
import { useState, useEffect } from "react"
import { LoadingOverlay, Tabs, ActionIcon } from "@mantine/core"
import { useRouter } from "next/navigation"
import { useAllowanceTables } from "../_hook/useAllowanceTables"
import { useUpdateAllowanceTables } from "../_hook/useUpdateAllowanceTables"
import { AllowanceTableEditLayout } from "./_components/AllowanceTableEditLayout"
import { LevelRewardEditLayout } from "./_components/LevelRewardEditLayout"
import { ScrollableTabs, ScrollableTabItem } from "@/app/(core)/_components/ScrollableTabs"
import { ALLOWANCE_TABLE_VIEW_URL } from "@/app/(core)/endpoints"
import { IconArrowLeft, IconDeviceFloppy, IconRefresh } from "@tabler/icons-react"

type AllowanceByAge = {
  age: number
  amount: number
}

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
  
  // 編集中のデータを保持する
  const [tempAllowanceByAges, setTempAllowanceByAges] = useState<AllowanceByAge[]>([])
  const [tempLevelRewards, setTempLevelRewards] = useState<LevelReward[]>([])

  /** 初期データを設定する */
  useEffect(() => {
    if (allowanceTable?.allowanceByAges) {
      setTempAllowanceByAges(allowanceTable.allowanceByAges)
    } else {
      // デフォルトで5歳から22歳までのデータを作成する
      const defaultAges: AllowanceByAge[] = []
      for (let age = 5; age <= 22; age++) {
        defaultAges.push({ age, amount: 0 })
      }
      setTempAllowanceByAges(defaultAges)
    }

    if (levelTable?.levelRewards) {
      setTempLevelRewards(levelTable.levelRewards)
    } else {
      // デフォルトでランク1から12までのデータを作成する
      const defaultLevels: LevelReward[] = []
      for (let level = 1; level <= 12; level++) {
        defaultLevels.push({ level, amount: 0 })
      }
      setTempLevelRewards(defaultLevels)
    }
  }, [allowanceTable, levelTable])

  /** タブアイテム */
  const tabItems: ScrollableTabItem[] = [
    { value: "allowance", label: "お小遣い" },
    { value: "level", label: "ランク報酬" }
  ]

  /** 保存する */
  const handleSave = () => {
    updateAllowanceTables({
      allowanceByAges: tempAllowanceByAges.map(item => ({ age: item.age, amount: item.amount })),
      levelRewards: tempLevelRewards.map(item => ({ level: item.level, amount: item.amount }))
    })
    // 保存後に閲覧画面に戻る
    router.push(ALLOWANCE_TABLE_VIEW_URL)
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
            disabled={isUpdating}
            color="blue"
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
            initialAllowanceByAges={tempAllowanceByAges}
            onUpdate={setTempAllowanceByAges}
          />
        </Tabs.Panel>

        {/* ランク報酬タブ */}
        <Tabs.Panel value="level">
          <LevelRewardEditLayout
            initialLevelRewards={tempLevelRewards}
            onUpdate={setTempLevelRewards}
          />
        </Tabs.Panel>
      </ScrollableTabs>
    </div>
  )
}
