"use client"
import { Box, Text, Table, Button, Group, NumberInput } from "@mantine/core"
import { GRADE_GROUPS, getGradeName } from "../../util/gradeUtil"
import { UseFormReturn } from "react-hook-form"
import { AgeRewardFormType } from "../form"

/** お小遣い編集レイアウト */
export const AgeRewardEditLayout = ({
  form,
  onSubmit
}: {
  form: UseFormReturn<AgeRewardFormType>
  onSubmit: (data: AgeRewardFormType) => void
}) => {
  const ageRewards = form.watch("rewards")

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
    form.setValue("rewards", updatedRewards, { shouldDirty: true })
  }

  return (
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
                {group.ages.map((age) => {
                  const rewardIndex = ageRewards.findIndex(r => r.age === age)
                  
                  return (
                    <Table.Tr key={age}>
                      <Table.Td width="50%">{getGradeName(age)}</Table.Td>
                      <Table.Td width="50%">
                        <NumberInput
                          value={ageRewards[rewardIndex]?.amount || 0}
                          onChange={(value) => {
                            const newRewards = [...ageRewards]
                            newRewards[rewardIndex] = {
                              ...newRewards[rewardIndex],
                              amount: Number(value) || 0
                            }
                            form.setValue("rewards", newRewards, { shouldDirty: true })
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
  )
}
