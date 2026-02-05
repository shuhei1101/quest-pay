"use client"
import { Box, Table } from "@mantine/core"

/** ランク報酬閲覧レイアウト */
export const LevelRewardViewLayout = ({
  levelRewards
}: {
  levelRewards: Array<{ level: number; amount: number }>
}) => {
  return (
    <Box>
      <Table striped withTableBorder withColumnBorders>
        <Table.Tbody>
          {levelRewards.map((reward) => (
            <Table.Tr key={reward.level}>
              <Table.Td width="50%">ランク{reward.level}</Table.Td>
              <Table.Td width="50%" className="text-right">{reward.amount.toLocaleString()}円/月</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  )
}
