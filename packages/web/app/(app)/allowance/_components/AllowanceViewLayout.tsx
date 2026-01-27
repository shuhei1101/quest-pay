"use client"
import { Box, Text, Table, LoadingOverlay, Button, Group, Tabs } from "@mantine/core"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ALLOWANCE_URL } from "@/app/(core)/endpoints"
import { IconEdit } from "@tabler/icons-react"

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

/** お小遣い閲覧レイアウト */
export const AllowanceViewLayout = ({
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

  /** 年齢別の合計金額を計算する */
  const calculateAgeTotal = () => {
    return ageRewards.reduce((sum, reward) => sum + reward.amount, 0)
  }

  /** レベル別の合計金額を計算する */
  const calculateLevelTotal = () => {
    return levelRewards.reduce((sum, reward) => sum + reward.amount, 0)
  }

  /** 学年区分ごとの合計金額を計算する */
  const calculateGroupTotal = (ages: number[]) => {
    return ages.reduce((sum, age) => {
      const reward = ageRewards.find(r => r.age === age)
      return sum + (reward?.amount || 0)
    }, 0)
  }

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
          onClick={() => router.push(ALLOWANCE_URL)}
          variant="light"
        >
          編集
        </Button>
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
                  {/* 学年区分見出し */}
                  <Text size="lg" fw={700} mb="xs">{group.name}</Text>
                  
                  {/* テーブル */}
                  <Table striped withTableBorder withColumnBorders>
                    <Table.Tbody>
                      {group.ages.map((age) => {
                        const reward = ageRewards.find(r => r.age === age)
                        const amount = reward?.amount || 0
                        
                        return (
                          <Table.Tr key={age}>
                            <Table.Td width="50%">{getGradeName(age)}</Table.Td>
                            <Table.Td width="50%" className="text-right">{amount.toLocaleString()}円/月</Table.Td>
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
                {levelRewards.map((reward) => (
                  <Table.Tr key={reward.level}>
                    <Table.Td width="50%">ランク{reward.level}</Table.Td>
                    <Table.Td width="50%" className="text-right">{reward.amount.toLocaleString()}円/月</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        </Tabs.Panel>
      </ScrollableTabs>
    </Box>
  )
}
