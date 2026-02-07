"use client"
import { Box, Text, Table } from "@mantine/core"
import { GRADE_GROUPS, getGradeName } from "../../util/utils"

/** お小遣い閲覧レイアウト */
export const AgeRewardViewLayout = ({
  ageRewards
}: {
  ageRewards: Array<{ age: number; amount: number }>
}) => {
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

  return (
    <Box className="space-y-6">
      {/* 説明文 */}
      <Text size="sm" c="dimmed">
        年齢ごとに毎月のお小遣い金額を設定できます。お子様の年齢に応じて、定額で支給される報酬額を確認できます。学校の学年に合わせて、成長とともに金額を調整しましょう。
      </Text>

      {GRADE_GROUPS.map((group) => {
        const groupTotal = calculateGroupTotal(group.ages)
        const years = group.ages.length

        return (
          <Box key={group.name}>
            {/* 学年区分見出し */}
            <Text size="lg" fw={700} mb="xs">{group.name}</Text>
            
            {/* テーブル */}
            <Box style={{ overflow: "auto" }}>
              <Table striped withTableBorder withColumnBorders style={{ tableLayout: "auto", width: "100%" }}>
                <Table.Tbody>
                  {group.ages.map((age) => {
                    const reward = ageRewards.find(r => r.age === age)
                    const amount = reward?.amount || 0
                    
                    return (
                      <Table.Tr key={age}>
                        <Table.Td style={{ whiteSpace: "nowrap" }}>{getGradeName(age)}</Table.Td>
                        <Table.Td className="text-right" style={{ whiteSpace: "nowrap" }}>{amount.toLocaleString()}円/月</Table.Td>
                      </Table.Tr>
                    )
                  })}
                  {/* 合計行 */}
                  <Table.Tr>
                    <Table.Td fw={700}>合計</Table.Td>
                    <Table.Td className="text-right" fw={700} style={{ whiteSpace: "nowrap" }}>
                      {groupTotal.toLocaleString()}円/{years}年
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Box>
          </Box>
        )
      })}

      {/* 全体合計 */}
      <Box className="border-t-2 border-gray-300 pt-4">
        <Box style={{ overflow: "auto" }}>
          <Table style={{ tableLayout: "auto", width: "100%" }}>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td fw={700}>
                  <Text size="lg" fw={700}>合計</Text>
                </Table.Td>
                <Table.Td className="text-right" fw={700} style={{ whiteSpace: "nowrap" }}>
                  <Text size="lg" fw={700}>{calculateAgeTotal().toLocaleString()}円/{ageRewards.length}年</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  )
}
