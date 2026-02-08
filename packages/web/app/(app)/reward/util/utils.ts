/** 学年区分の定義 */
export const GRADE_GROUPS = [
  { name: "小学生以前", ages: [5, 6] },
  { name: "小学生", ages: [7, 8, 9, 10, 11, 12] },
  { name: "中学生", ages: [13, 14, 15] },
  { name: "高校生", ages: [16, 17, 18] },
  { name: "大学生", ages: [19, 20, 21, 22] },
  { name: "大学生以降", ages: Array.from({ length: 78 }, (_, i) => i + 23) }
]

/** 学年名を取得する */
export const getGradeName = (age: number): string => {
  if (age <= 6) return `${age}歳`
  if (age <= 12) return `小学${age - 6}年生`
  if (age <= 15) return `中学${age - 12}年生`
  if (age <= 18) return `高校${age - 15}年生`
  if (age <= 22) return `大学${age - 18}年生`
  return `${age}歳`
}

/** 表示モード型 */
export type DisplayMode = "age" | "grade"

/** 表示名を取得する（年齢表示/学年表示を切り替え可能） */
export const getDisplayName = (age: number, mode: DisplayMode): string => {
  if (mode === "age") {
    return `${age}歳`
  }
  return getGradeName(age)
}
