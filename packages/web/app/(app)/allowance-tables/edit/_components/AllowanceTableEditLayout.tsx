'use client'
import { useState, useEffect } from "react"
import { Box, Button, Text, TextInput, Switch } from "@mantine/core"
import { useRouter } from "next/navigation"
import { ALLOWANCE_TABLE_VIEW_URL } from "@/app/(core)/endpoints"

type AllowanceByAge = {
  age: number
  amount: number
}

/** お小遣い編集画面レイアウト */
export const AllowanceTableEditLayout = ({
  initialAllowanceByAges = [],
  onUpdate
}: {
  initialAllowanceByAges?: AllowanceByAge[]
  onUpdate?: (allowanceByAges: AllowanceByAge[]) => void
}) => {
  const router = useRouter()
  
  // 表示モード（false: 学年別, true: 年齢別）
  const [isAgeMode, setIsAgeMode] = useState(false)
  
  // 編集中のデータ
  const [allowanceByAges, setAllowanceByAges] = useState<AllowanceByAge[]>(initialAllowanceByAges)

  /** 初期データを設定する */
  useEffect(() => {
    setAllowanceByAges(initialAllowanceByAges)
  }, [initialAllowanceByAges])

  /** 年齢を学年に変換する */
  const ageToGrade = (age: number): { category: string, grade: number, displayLabel: string } => {
    if (age < 7) return { category: "小学生以前", grade: 0, displayLabel: `${age}歳` }
    if (age <= 12) return { category: "小学生", grade: age - 6, displayLabel: `${age - 6}年生(${age}歳)` }
    if (age <= 15) return { category: "中学生", grade: age - 12, displayLabel: `${age - 12}年生(${age}歳)` }
    if (age <= 18) return { category: "高校生", grade: age - 15, displayLabel: `${age - 15}年生(${age}歳)` }
    if (age <= 22) return { category: "大学生", grade: age - 18, displayLabel: `${age - 18}年生(${age}歳)` }
    return { category: "その他", grade: 0, displayLabel: `${age}歳` }
  }

  /** 学年カテゴリごとにグループ化する */
  const groupedByCategory = () => {
    const groups: Record<string, AllowanceByAge[]> = {}
    
    allowanceByAges.forEach(item => {
      const { category } = ageToGrade(item.age)
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
    })

    return groups
  }

  /** カテゴリの合計金額を計算する */
  const calculateCategoryTotal = (items: AllowanceByAge[]) => {
    const years = items.length
    const totalPerYear = items.reduce((sum, item) => sum + item.amount * 12, 0)
    return { totalPerYear, years }
  }

  /** 金額を更新する */
  const updateAmount = (age: number, amount: number) => {
    const updated = allowanceByAges.map(item => item.age === age ? { ...item, amount } : item)
    setAllowanceByAges(updated)
    onUpdate?.(updated)
  }

  /** 年数設定ボタンをクリックする */
  const handleYearsSet = (category: string) => {
    // TODO: 年数設定ダイアログを表示する
    console.log("年数設定:", category)
  }

  /** 一括設定ボタンをクリックする */
  const handleBulkSet = (category: string) => {
    // TODO: 一括設定ダイアログを表示する
    console.log("一括設定:", category)
  }

  const grouped = groupedByCategory()
  const categories = ["小学生以前", "小学生", "中学生", "高校生", "大学生"]

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* ヘッダー */}
      <div className="flex items-center justify-center">
        <Text size="xl" fw={700}>定額報酬の編集</Text>
      </div>

      {/* 年齢別表示切り替え */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Text size="sm">年齢別表示</Text>
          <Switch
            checked={isAgeMode}
            onChange={(e) => setIsAgeMode(e.currentTarget.checked)}
          />
        </div>
      </div>

      {/* お小遣い設定フォーム */}
      <Box>
        {categories.map(category => {
          const items = grouped[category]
          if (!items || items.length === 0) return null

          const { totalPerYear, years } = calculateCategoryTotal(items)

          return (
            <div key={category} className="mb-6">
              {/* カテゴリヘッダー */}
              <div className="flex justify-between items-center mb-2">
                <Text size="lg" fw={600}>{category}</Text>
                <div className="flex gap-2">
                  <Button size="xs" variant="light" onClick={() => handleYearsSet(category)}>
                    年数設定
                  </Button>
                  <Button size="xs" variant="light" onClick={() => handleBulkSet(category)}>
                    一括設定
                  </Button>
                </div>
              </div>

              {/* 年齢別表示の場合の範囲入力 */}
              {isAgeMode && items.length > 0 && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                  <Text>{category}</Text>
                  <TextInput
                    size="xs"
                    w={60}
                    value={items[0].age}
                    readOnly
                  />
                  <Text size="sm">歳 〜</Text>
                  <TextInput
                    size="xs"
                    w={60}
                    value={items[items.length - 1].age}
                    readOnly
                  />
                  <Text size="sm">歳</Text>
                </div>
              )}
              
              {/* 学年/年齢リスト */}
              {items.map(item => {
                const { displayLabel } = ageToGrade(item.age)

                return (
                  <div key={item.age} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <Text>{isAgeMode ? `${item.age}歳` : displayLabel}</Text>
                    <div className="flex items-center gap-2">
                      <TextInput
                        size="sm"
                        w={120}
                        value={item.amount}
                        onChange={(e) => updateAmount(item.age, Number(e.target.value) || 0)}
                        rightSection={<Text size="sm">円/月</Text>}
                        rightSectionWidth={50}
                      />
                    </div>
                  </div>
                )
              })}

              {/* カテゴリ合計 */}
              <div className="flex justify-between py-3 bg-gray-50 px-2 font-bold mt-2">
                <Text fw={700}>合計</Text>
                <Text fw={700}>{totalPerYear.toLocaleString()}円/{years}年</Text>
              </div>
            </div>
          )
        })}
      </Box>
    </div>
  )
}
