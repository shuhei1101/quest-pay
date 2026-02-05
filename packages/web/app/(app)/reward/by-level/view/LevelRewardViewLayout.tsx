"use client"
import { Box, Table, Text } from "@mantine/core"

/** ランク報酬閲覧レイアウト */
export const LevelRewardViewLayout = ({
  levelRewards
}: {
  levelRewards: Array<{ level: number; amount: number }>
}) => {
  /** 合計金額を計算する */
  const calculateTotal = () => {
    return levelRewards.reduce((sum, reward) => sum + reward.amount, 0)
  }

  return (
    <Box className="space-y-4">
      {/* 説明文 */}
      <Text size="sm" c="dimmed">
        お子様がクエストをこなすとレベルが上がります。レベルごとに毎月のお小遣いがアップする仕組みです。お子様のモチベーション向上につながります。
      </Text>

      <Table striped withTableBorder withColumnBorders>
        <Table.Tbody>
          {levelRewards.map((reward) => (
            <Table.Tr key={reward.level}>
              <Table.Td width="50%">ランク{reward.level}</Table.Td>
              <Table.Td width="50%" className="text-right">{reward.amount.toLocaleString()}円/月</Table.Td>
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
