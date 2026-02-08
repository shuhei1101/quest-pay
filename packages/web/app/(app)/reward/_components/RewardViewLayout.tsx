"use client"
import { Box, Text, LoadingOverlay, Button, Group, Tabs } from "@mantine/core"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { REWARD_URL } from "@/app/(core)/endpoints"
import { IconEdit } from "@tabler/icons-react"
import { AgeRewardViewLayout } from "../by-age/view/AgeRewardViewLayout"
import { LevelRewardViewLayout } from "../by-level/view/LevelRewardViewLayout"

/** 報酬閲覧レイアウト */
export const RewardViewLayout = ({
  ageRewards,
  levelRewards,
  isLoading
}: {
  ageRewards: Array<{ age: number; amount: number }>
  levelRewards: Array<{ level: number; amount: number }>
  isLoading: boolean
}) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string | null>("age")

  return (
    <Box pos="relative" className="h-full flex flex-col">
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* ヘッダー */}
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>定額報酬</Text>
        {/* 編集ボタン */}
        <Button 
          leftSection={<IconEdit size={16} />} 
          onClick={() => router.push(REWARD_URL)}
          variant="light"
        >
          編集
        </Button>
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
          <AgeRewardViewLayout ageRewards={ageRewards} />
        </Tabs.Panel>

        {/* ランク報酬タブ */}
        <Tabs.Panel value="level">
          <LevelRewardViewLayout levelRewards={levelRewards} />
        </Tabs.Panel>
      </ScrollableTabs>
    </Box>
  )
}
