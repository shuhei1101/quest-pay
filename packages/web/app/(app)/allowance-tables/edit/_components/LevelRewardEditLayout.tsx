'use client'
import { useState, useEffect } from "react"
import { Box, Text, TextInput } from "@mantine/core"

type LevelReward = {
  level: number
  amount: number
}

/** ランク報酬編集画面レイアウト */
export const LevelRewardEditLayout = ({
  initialLevelRewards = [],
  onUpdate
}: {
  initialLevelRewards?: LevelReward[]
  onUpdate?: (levelRewards: LevelReward[]) => void
}) => {
  // 編集中のデータ
  const [levelRewards, setLevelRewards] = useState<LevelReward[]>(initialLevelRewards)

  /** 初期データを設定する */
  useEffect(() => {
    if (initialLevelRewards.length === 0) {
      // デフォルトでランク1から12までのデータを作成する
      const defaultLevels: LevelReward[] = []
      for (let level = 1; level <= 12; level++) {
        defaultLevels.push({ level, amount: 0 })
      }
      setLevelRewards(defaultLevels)
    } else {
      setLevelRewards(initialLevelRewards)
    }
  }, [initialLevelRewards])

  /** 金額を更新する */
  const updateAmount = (level: number, amount: number) => {
    const updated = levelRewards.map(item => 
      item.level === level ? { ...item, amount } : item
    )
    setLevelRewards(updated)
    onUpdate?.(updated)
  }

  return (
    <Box className="flex flex-col gap-2 pb-20">
      {/* ランクリスト */}
      {levelRewards.map(reward => (
        <div key={reward.level} className="flex justify-between items-center py-2 border-b border-gray-200">
          <Text>ランク{reward.level}</Text>
          <TextInput
            size="sm"
            w={120}
            value={reward.amount}
            onChange={(e) => updateAmount(reward.level, Number(e.target.value) || 0)}
            rightSection={<Text size="sm">円/月</Text>}
            rightSectionWidth={50}
          />
        </div>
      ))}
    </Box>
  )
}
