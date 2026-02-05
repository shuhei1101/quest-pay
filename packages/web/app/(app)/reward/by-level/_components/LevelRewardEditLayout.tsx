"use client"
import { Box, Table, NumberInput } from "@mantine/core"
import { UseFormReturn } from "react-hook-form"
import { LevelRewardFormType } from "../form"

/** ランク報酬編集レイアウト */
export const LevelRewardEditLayout = ({
  form,
  onSubmit
}: {
  form: UseFormReturn<LevelRewardFormType>
  onSubmit: (data: LevelRewardFormType) => void
}) => {
  const levelRewards = form.watch("rewards")

  /** 合計金額を計算する */
  const calculateTotal = () => {
    return levelRewards.reduce((sum, reward) => sum + reward.amount, 0)
  }

  return (
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
                    const newRewards = [...levelRewards]
                    newRewards[index] = {
                      ...newRewards[index],
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
          ))}
          {/* 合計行 */}
          <Table.Tr>
            <Table.Td fw={700}>合計</Table.Td>
            <Table.Td className="text-right" fw={700}>
              {calculateTotal().toLocaleString()}円
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Box>
  )
}
