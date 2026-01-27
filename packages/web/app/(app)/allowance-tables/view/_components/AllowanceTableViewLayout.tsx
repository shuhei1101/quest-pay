'use client'
import { Box, Button, Text, Divider } from "@mantine/core"
import { useRouter } from "next/navigation"
import { ALLOWANCE_TABLE_EDIT_URL } from "@/app/(core)/endpoints"
import { IconEdit } from "@tabler/icons-react"

type AllowanceByAge = {
  age: number
  amount: number
}

type LevelReward = {
  level: number
  amount: number
}

/** お小遣いテーブル閲覧画面レイアウト */
export const AllowanceTableViewLayout = ({
  allowanceByAges = [],
  levelRewards = [],
  onPublicTableClick,
  onTemplateClick
}: {
  allowanceByAges?: AllowanceByAge[]
  levelRewards?: LevelReward[]
  onPublicTableClick?: () => void
  onTemplateClick?: () => void
}) => {
  const router = useRouter()

  /** 年齢を学年に変換する */
  const ageToGrade = (age: number): { category: string, grade: number } => {
    if (age < 7) return { category: "小学生以前", grade: 0 }
    if (age <= 12) return { category: "小学生", grade: age - 6 }
    if (age <= 15) return { category: "中学生", grade: age - 12 }
    if (age <= 18) return { category: "高校生", grade: age - 15 }
    if (age <= 22) return { category: "大学生", grade: age - 18 }
    return { category: "その他", grade: 0 }
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
    return { totalPerYear, years, total: totalPerYear * years }
  }

  /** 全体の合計金額を計算する */
  const calculateGrandTotal = () => {
    const years = allowanceByAges.length
    return allowanceByAges.reduce((sum, item) => sum + item.amount * 12, 0) * years
  }

  const grouped = groupedByCategory()
  const categories = ["小学生以前", "小学生", "中学生", "高校生", "大学生", "その他"]

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <Text size="xl" fw={700}>定額報酬</Text>
        
        {/* 右上のボタングループ */}
        <div className="flex gap-2">
          {/* 編集ボタン */}
          <Button
            variant="light"
            leftSection={<IconEdit size={18} />}
            onClick={() => router.push(ALLOWANCE_TABLE_EDIT_URL)}
          >
            編集
          </Button>
        </div>
      </div>

      {/* 機能ボタン群 */}
      <div className="flex gap-2 flex-wrap">
        {onPublicTableClick && (
          <Button variant="outline" onClick={onPublicTableClick}>
            公開テーブルを見る
          </Button>
        )}
        {onTemplateClick && (
          <Button variant="outline" onClick={onTemplateClick}>
            テンプレートから適用
          </Button>
        )}
      </div>

      {/* お小遣い設定 */}
      <Box>
        {categories.map(category => {
          const items = grouped[category]
          if (!items || items.length === 0) return null

          const { totalPerYear, years } = calculateCategoryTotal(items)

          return (
            <div key={category} className="mb-6">
              {/* カテゴリヘッダー */}
              <Text size="lg" fw={600} className="mb-2">{category}</Text>
              
              {/* 学年リスト */}
              {items.map(item => {
                const { grade } = ageToGrade(item.age)
                const gradeLabel = category === "小学生以前" 
                  ? `${item.age}歳` 
                  : `${grade}年生`

                return (
                  <div key={item.age} className="flex justify-between py-3 border-b border-gray-200">
                    <Text>{gradeLabel}</Text>
                    <Text>{item.amount.toLocaleString()}円/月</Text>
                  </div>
                )
              })}

              {/* カテゴリ合計 */}
              <div className="flex justify-between py-3 bg-gray-50 px-2 font-bold">
                <Text fw={700}>合計</Text>
                <Text fw={700}>{totalPerYear.toLocaleString()}円/{years}年</Text>
              </div>
            </div>
          )
        })}

        {/* 全体合計 */}
        {allowanceByAges.length > 0 && (
          <>
            <Divider my="md" />
            <div className="flex justify-between py-3 px-2 text-xl font-bold">
              <Text size="xl" fw={700}>合計</Text>
              <Text size="xl" fw={700}>
                {calculateGrandTotal().toLocaleString()}円/{allowanceByAges.length}年
              </Text>
            </div>
          </>
        )}
      </Box>
    </div>
  )
}
