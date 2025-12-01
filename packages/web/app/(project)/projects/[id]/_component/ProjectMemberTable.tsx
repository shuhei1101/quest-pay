import { UserEntitySchema } from "@/app/(user)/_schema/userSchema"
import { Button, Table } from "@mantine/core"

const BTN_SIZE = 60

/** プロジェクトメンバーテーブル */
export const ProjectMemberTable = ({members, onDeleteClick, onAddClick}: {
  members: UserEntitySchema[],
  onDeleteClick: (userId: string) => void,
  onAddClick: () => void,
}) => {
  
  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          {/* メンバー名 */}
          <Table.Th>氏名</Table.Th>
          {/* 追加ボタン */}
          <Table.Th w={BTN_SIZE}>
            <Button size="xs" variant="light" w={BTN_SIZE} onClick={onAddClick}>
              <p>追加</p>
            </Button>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {members.map((member) => (
          <Table.Tr key={member.user_id}>
            {/* メンバー名 */}
            <Table.Td>{member.name}</Table.Td>
            {/* 削除ボタン */}
            <Table.Td w={BTN_SIZE}>
              <Button w={BTN_SIZE} color="red" size="xs" variant="light" onClick={() => onDeleteClick(member.user_id)}>
                <p>削除</p>
              </Button>
            </Table.Td>
          </Table.Tr>
          ))
        }
      </Table.Tbody>
    </Table>

  )
}
