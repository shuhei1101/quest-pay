'use client'
import { useState } from "react"
import { LoadingOverlay, Tabs } from "@mantine/core"
import { useAllowanceTables } from "../_hook/useAllowanceTables"
import { AllowanceTableViewLayout } from "./_components/AllowanceTableViewLayout"
import { LevelRewardViewLayout } from "./_components/LevelRewardViewLayout"
import { ScrollableTabs, ScrollableTabItem } from "@/app/(core)/_components/ScrollableTabs"

/** お小遣いテーブル閲覧画面 */
export const AllowanceTableView = () => {
  const { allowanceTable, levelTable, isLoading } = useAllowanceTables()
  const [activeTab, setActiveTab] = useState<string | null>("allowance")

  /** タブアイテム */
  const tabItems: ScrollableTabItem[] = [
    { value: "allowance", label: "お小遣い" },
    { value: "level", label: "ランク報酬" }
  ]

  return (
    <div className="relative flex flex-col h-full">
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* タブ */}
      <ScrollableTabs value={activeTab} onChange={setActiveTab} items={tabItems}>
        {/* お小遣いタブ */}
        <Tabs.Panel value="allowance">
          <AllowanceTableViewLayout
            allowanceByAges={allowanceTable?.allowanceByAges || []}
            levelRewards={levelTable?.levelRewards || []}
          />
        </Tabs.Panel>

        {/* ランク報酬タブ */}
        <Tabs.Panel value="level">
          <LevelRewardViewLayout levelRewards={levelTable?.levelRewards || []} />
        </Tabs.Panel>
      </ScrollableTabs>
    </div>
  )
}
