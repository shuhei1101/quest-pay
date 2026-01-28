"use client"
import { Box, Text, Table, LoadingOverlay, Button, Group, NumberInput, ActionIcon, Tabs } from "@mantine/core"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { REWARD_VIEW_URL } from "@/app/(core)/endpoints"
import { IconDeviceFloppy, IconRotate } from "@tabler/icons-react"
import { UseFormReturn } from "react-hook-form"
import { AgeRewardFormType, LevelRewardFormType } from "../form"

/** 学年区分の定義 */
const GRADE_GROUPS = [
  { name: "小学生以前", ages: [5, 6] },
  { name: "小学生", ages: [7, 8, 9, 10, 11, 12] },
  { name: "中学生", ages: [13, 14, 15] },
  { name: "高校生", ages: [16, 17, 18] },
  { name: "大学生", ages: [19, 20, 21, 22] }
]

/** 学年名を取得する */
const getGradeName = (age: number): string => {
  if (age <= 6) return `${age}歳`
  if (age <= 12) return `${age - 6}年生(${age}歳)`
  if (age <= 15) return `${age - 12}年生`
  if (age <= 18) return `${age - 15}年生`
  if (age <= 22) return `${age - 18}年生`
  return `${age}歳`
}

/** 報酬編集レイアウト */
export const RewardEditLayout = ({
  ageForm,
  levelForm,
  isLoading,
  onAgeSubmit,
  onLevelSubmit
}: {
  ageForm: UseFormReturn<AgeRewardFormType>
  levelForm: UseFormReturn<LevelRewardFormType>
  isLoading: boolean
  onAgeSubmit: (data: AgeRewardFormType) => void
  onLevelSubmit: (data: LevelRewardFormType) => void
}) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string | null>("age")

  const ageRewards = ageForm.watch("rewards")
  const levelRewards = levelForm.watch("rewards")

  /** 年齢別の合計金額を計算する */
  const calculateAgeTotal = () => {
    return ageRewards.reduce((sum, reward) => sum + reward.amount, 0)
  }

  /** 学年区分ごとの合計金額を計算する */
  const calculateGroupTotal = (ages: number[]) => {
    return ages.reduce((sum, age) => {
      const reward = ageRewards.find(r => r.age === age)
      return sum + (reward?.amount || 0)
    }, 0)
  }

  /** 一括設定処理 */
  const handleBatchSet = (ages: number[], amount: number) => {
    const updatedRewards = ageRewards.map(reward => {
      if (ages.includes(reward.age)) {
        return { ...reward, amount }
      }
      return reward
    })
    ageForm.setValue("rewards", updatedRewards)
  }

  return (
    <Box pos="relative" className="h-full flex flex-col">
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* ヘッダー */}
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>定額報酬の編集</Text>
        {/* アクションボタン */}
        <Group>
          <ActionIcon 
            size="lg" 
            variant="light" 
            color="blue"
            onClick={() => {
              if (activeTab === "age") {
                ageForm.reset()
              } else {
                levelForm.reset()
              }
            }}
          >
            <IconRotate size={18} />
          </ActionIcon>
          <Button 
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={() => {
              if (activeTab === "age") {
                ageForm.handleSubmit(onAgeSubmit)()
              } else {
                levelForm.handleSubmit(onLevelSubmit)()
              }
            }}
          >
            保存
          </Button>
        </Group>
      </Group>

      {/* タブ切り替え */}
      <ScrollableTabs
        value={activeTab}
        onChange={setActiveTab}
        items={[
          { value: "age", label: "お小遣い" },
          { value: "level", label: "ランク報酬" }
        ]}
      >
        {/* お小遣いタブ */}
        <Tabs.Panel value="age">
          <Box className="space-y-6">
            {GRADE_GROUPS.map((group) => {
              const groupTotal = calculateGroupTotal(group.ages)
              const years = group.ages.length

              return (
                <Box key={group.name}>
                  {/* 学年区分見出しと一括設定ボタン */}
                  <Group justify="space-between" mb="xs">
                    <Text size="lg" fw={700}>{group.name}</Text>
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">一括設定</Text>
                      <Button 
                        size="compact-xs" 
                        variant="light"
                        onClick={() => {
                          const amount = window.prompt(`${group.name}の一括設定金額を入力してください（円/月）`)
                          if (amount !== null && amount.trim() !== "") {
                            handleBatchSet(group.ages, parseInt(amount, 10) || 0)
                          }
                        }}
                      >
                        設定
                      </Button>
                    </Group>
                  </Group>
                  
                  {/* テーブル */}
                  <Table striped withTableBorder withColumnBorders>
                    <Table.Tbody>
                      {group.ages.map((age, index) => {
                        const rewardIndex = ageRewards.findIndex(r => r.age === age)
                        
                        return (
                          <Table.Tr key={age}>
                            <Table.Td width="50%">{getGradeName(age)}</Table.Td>
                            <Table.Td width="50%">
                              <NumberInput
                                value={ageRewards[rewardIndex]?.amount || 0}
                                onChange={(value) => {
                                  ageForm.setValue(`rewards.${rewardIndex}.amount`, Number(value) || 0)
                                }}
                                min={0}
                                suffix="円/月"
                                hideControls
                                styles={{ input: { textAlign: "right" } }}
                              />
                            </Table.Td>
                          </Table.Tr>
                        )
                      })}
                      {/* 合計行 */}
                      <Table.Tr>
                        <Table.Td fw={700}>合計</Table.Td>
                        <Table.Td className="text-right" fw={700}>
                          {groupTotal.toLocaleString()}円/{years}年
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </Box>
              )
            })}

            {/* 全体合計 */}
            <Box className="border-t-2 border-gray-300 pt-4">
              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td width="50%" fw={700}>
                      <Text size="lg" fw={700}>合計</Text>
                    </Table.Td>
                    <Table.Td width="50%" className="text-right" fw={700}>
                      <Text size="lg" fw={700}>{calculateAgeTotal().toLocaleString()}円/{ageRewards.length}年</Text>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Box>
          </Box>
        </Tabs.Panel>

        {/* ランク報酬タブ */}
        <Tabs.Panel value="level">
          <Box>
            <Table striped withTableBorder withColumnBorders>
              <Table.Tbody>
                {levelRewards.map((reward, index) => (
                  <Table.Tr key={reward.level}>
                    <Table.Td width="50%">ランク{reward.level}</Table.Td>
                    <Table.Td width="50%">
                      <NumberInput
                        value={reward.amount}
                        onChange={(value) => {
                          levelForm.setValue(`rewards.${index}.amount`, Number(value) || 0)
                        }}
                        min={0}
                        suffix="円/月"
                        hideControls
                        styles={{ input: { textAlign: "right" } }}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        </Tabs.Panel>
      </ScrollableTabs>

      {/* フローティング保存ボタン（モバイル用） */}
      <Box className="md:hidden fixed bottom-4 right-4 z-50">
        <Button 
          size="lg"
          leftSection={<IconDeviceFloppy size={20} />}
          onClick={() => {
            if (activeTab === "age") {
              ageForm.handleSubmit(onAgeSubmit)()
            } else {
              levelForm.handleSubmit(onLevelSubmit)()
            }
          }}
        >
          保存
        </Button>
      </Box>
    </Box>
  )
}
