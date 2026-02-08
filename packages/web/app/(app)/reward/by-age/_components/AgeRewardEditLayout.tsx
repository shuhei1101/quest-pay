"use client"
import { Box, Text, Table, Button, Group, NumberInput, ActionIcon, Modal, Select } from "@mantine/core"
import { GRADE_GROUPS, getGradeName, getDisplayName, DisplayMode } from "../../util/utils"
import { UseFormReturn } from "react-hook-form"
import { AgeRewardFormType } from "../form"
import { IconSwitchHorizontal, IconFilter } from "@tabler/icons-react"
import { useState } from "react"

/** お小遣い編集レイアウト */
export const AgeRewardEditLayout = ({
  form,
  onSubmit
}: {
  form: UseFormReturn<AgeRewardFormType>
  onSubmit: (data: AgeRewardFormType) => void
}) => {
  const ageRewards = form.watch("rewards")
  const [displayMode, setDisplayMode] = useState<DisplayMode>("grade")
  const [ageRange, setAgeRange] = useState<[number, number]>([5, 22])
  const [ageRangeModalOpened, setAgeRangeModalOpened] = useState(false)
  const [ageFrom, setAgeFrom] = useState(5)
  const [ageTo, setAgeTo] = useState(22)
  const [batchModalOpened, setBatchModalOpened] = useState(false)
  const [batchAmount, setBatchAmount] = useState<number>(0)
  const [selectedGroup, setSelectedGroup] = useState<{name: string, ages: number[]} | null>(null)

  /** 年齢別の合計金額を計算する（年額） */
  const calculateAgeTotal = () => {
    return ageRewards.reduce((sum, reward) => sum + reward.amount * 12, 0)
  }

  /** 学年区分ごとの合計金額を計算する（年額） */
  const calculateGroupTotal = (ages: number[]) => {
    return ages.reduce((sum, age) => {
      const reward = ageRewards.find(r => r.age === age)
      return sum + (reward?.amount || 0) * 12
    }, 0)
  }

  /** 一括設定処理 */
  const handleBatchSet = (ages: number[]) => {
    const updatedRewards = ageRewards.map(reward => {
      if (ages.includes(reward.age)) {
        return { ...reward, amount: batchAmount }
      }
      return reward
    })
    form.setValue("rewards", updatedRewards, { shouldDirty: true })
    setBatchModalOpened(false)
    setBatchAmount(0)
  }

  /** 年齢範囲でフィルタリングされたグループを取得する */
  const getFilteredGroups = () => {
    return GRADE_GROUPS.map(group => ({
      ...group,
      ages: group.ages.filter(age => age >= ageRange[0] && age <= ageRange[1])
    })).filter(group => group.ages.length > 0)
  }

  return (
    <Box className="space-y-6" style={{ overflow: "hidden", width: "100%" }}>
      {/* 表示切り替えと年齢範囲設定のコントロール */}
      <Group justify="flex-end" gap="xs">
        {/* 表示モード切り替えボタン */}
        <Button
          size="compact-sm"
          variant="light"
          leftSection={<IconSwitchHorizontal size={16} />}
          onClick={() => setDisplayMode(displayMode === "age" ? "grade" : "age")}
        >
          {displayMode === "age" ? "学年表示" : "年齢表示"}
        </Button>
        {/* 年齢範囲設定ボタン */}
        <Button
          size="compact-sm"
          variant="light"
          leftSection={<IconFilter size={16} />}
          onClick={() => {
            setAgeFrom(ageRange[0])
            setAgeTo(ageRange[1])
            setAgeRangeModalOpened(true)
          }}
        >
          {ageRange[0]}歳〜{ageRange[1]}歳
        </Button>
      </Group>

      {/* 年齢範囲設定モーダル */}
      <Modal
        opened={ageRangeModalOpened}
        onClose={() => setAgeRangeModalOpened(false)}
        title="年齢範囲を設定"
        centered
      >
        <Box className="space-y-4">
          <Group grow>
            <Select
              label="開始年齢"
              data={Array.from({ length: 100 }, (_, i) => ({
                value: String(i + 1),
                label: `${i + 1}歳`
              }))}
              value={String(ageFrom)}
              onChange={(value) => setAgeFrom(Number(value) || 5)}
            />
            <Select
              label="終了年齢"
              data={Array.from({ length: 100 }, (_, i) => ({
                value: String(i + 1),
                label: `${i + 1}歳`
              }))}
              value={String(ageTo)}
              onChange={(value) => setAgeTo(Number(value) || 22)}
            />
          </Group>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="default"
              onClick={() => setAgeRangeModalOpened(false)}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => {
                if (ageFrom > ageTo) {
                  alert("開始年齢は終了年齢以下にしてください")
                  return
                }
                setAgeRange([ageFrom, ageTo])
                setAgeRangeModalOpened(false)
              }}
            >
              OK
            </Button>
          </Group>
        </Box>
      </Modal>

      {getFilteredGroups().map((group) => {
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
                    setSelectedGroup(group)
                    setBatchModalOpened(true)
                  }}
                >
                  設定
                </Button>
              </Group>
            </Group>
            
            {/* テーブル */}
            <Table striped withTableBorder withColumnBorders style={{ tableLayout: "fixed", width: "100%" }}>
              <Table.Tbody>
                {group.ages.map((age) => {
                  const rewardIndex = ageRewards.findIndex(r => r.age === age)
                  
                  return (
                    <Table.Tr key={age}>
                      <Table.Td width="40%" style={{ whiteSpace: "nowrap" }}>{getDisplayName(age, displayMode)}</Table.Td>
                      <Table.Td width="60%">
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
                  <Table.Td width="40%" fw={700}>合計</Table.Td>
                  <Table.Td width="60%" className="text-right" fw={700} style={{ whiteSpace: "nowrap" }}>
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
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td width="40%" fw={700}>
                <Text size="lg" fw={700}>合計</Text>
              </Table.Td>
              <Table.Td width="60%" className="text-right" fw={700} style={{ whiteSpace: "nowrap" }}>
                <Text size="lg" fw={700}>{calculateAgeTotal().toLocaleString()}円/{ageRewards.length}年</Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>

      {/* 一括設定モーダル */}
      <Modal
        opened={batchModalOpened}
        onClose={() => {
          setBatchModalOpened(false)
          setBatchAmount(0)
        }}
        title={`${selectedGroup?.name}の一括設定`}
        centered
      >
        <Box className="space-y-4">
          <NumberInput
            label="金額（円/月）"
            value={batchAmount}
            onChange={(value) => setBatchAmount(Number(value) || 0)}
            min={0}
            placeholder="金額を入力してください"
          />
          <Group justify="flex-end" gap="xs">
            <Button
              variant="light"
              onClick={() => {
                setBatchModalOpened(false)
                setBatchAmount(0)
              }}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => selectedGroup && handleBatchSet(selectedGroup.ages)}
            >
              設定
            </Button>
          </Group>
        </Box>
      </Modal>
    </Box>
  )
}
