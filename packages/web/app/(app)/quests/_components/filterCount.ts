type SearchableTagFilter = {
  name?: string
  tags?: string[]
}

/** フィルターモーダル内の入力項目数を集計する */
export const countModalFilterItems = (filter: SearchableTagFilter): number => {
  let count = 0

  if (filter.name?.trim()) count++
  if (filter.tags?.length) count += filter.tags.length

  return count
}
