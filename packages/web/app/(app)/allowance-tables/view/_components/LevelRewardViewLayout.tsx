'use client'
import { Box, Text } from "@mantine/core"

type LevelReward = {
  level: number
  amount: number
}

/** ランク報酬閲覧画面レイアウト */
export const LevelRewardViewLayout = ({
  levelRewards = []
}: {
  levelRewards?: LevelReward[]
}) => {
  return (
    <Box className="flex flex-col gap-2 pb-20">
      {/* ランクリスト */}
      {levelRewards.map(reward => (
        <div key={reward.level} className="flex justify-between py-3 border-b border-gray-200">
          <Text>ランク{reward.level}</Text>
          <Text>{reward.amount.toLocaleString()}円/月</Text>
        </div>
      ))}
      
      {levelRewards.length === 0 && (
        <Text c="dimmed" ta="center" py="xl">
          ランク報酬が設定されていません
        </Text>
      )}
    </Box>
  )
}
