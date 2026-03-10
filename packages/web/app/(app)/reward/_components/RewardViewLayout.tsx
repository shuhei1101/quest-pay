"use client"
import { Box, LoadingOverlay, Button, Tabs } from "@mantine/core"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { PageHeader } from "@/app/(core)/_components/PageHeader"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { REWARD_URL } from "@/app/(core)/endpoints"
import { IconEdit } from "@tabler/icons-react"
import { AgeRewardViewLayout } from "../by-age/view/AgeRewardViewLayout"
import { LevelRewardViewLayout } from "../by-level/view/LevelRewardViewLayout"
import { useSwipeTab } from "../_hooks/useSwipeTab"

/** 報酬閲覧レイアウト */
export const RewardViewLayout = ({
  ageRewards,
  levelRewards,
  isLoading,
  hideEditButton = false
}: {
  ageRewards: Array<{ age: number; amount: number }>
  levelRewards: Array<{ level: number; amount: number }>
  isLoading: boolean
  hideEditButton?: boolean
}) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string | null>("age")

  // タブの順序を定義
  const tabOrder = ["age", "level"]

  // スワイプでタブを切り替える
  const handleSwipe = useCallback((direction: "left" | "right") => {
    if (!activeTab) return

    const currentIndex = tabOrder.indexOf(activeTab)
    let nextIndex: number

    if (direction === "left") {
      // 左スワイプ = 次のタブ
      nextIndex = (currentIndex + 1) % tabOrder.length
    } else {
      // 右スワイプ = 前のタブ
      nextIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length
    }

    setActiveTab(tabOrder[nextIndex])
  }, [activeTab])

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeTab(handleSwipe)

  return (
    <Box pos="relative" className="h-full flex flex-col">
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* ヘッダー */}
      <PageHeader 
        title="定額報酬"
        rightSection={
          !hideEditButton ? (
            <Button 
              leftSection={<IconEdit size={16} />} 
              onClick={() => router.push(REWARD_URL)}
              variant="light"
            >
              編集
            </Button>
          ) : undefined
        }
      />

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
        <Tabs.Panel 
          value="age"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AgeRewardViewLayout ageRewards={ageRewards} />
        </Tabs.Panel>

        {/* ランク報酬タブ */}
        <Tabs.Panel 
          value="level"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <LevelRewardViewLayout levelRewards={levelRewards} />
        </Tabs.Panel>
      </ScrollableTabs>
    </Box>
  )
}
