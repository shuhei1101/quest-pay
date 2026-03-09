"use client"
import { Input, ActionIcon, Indicator } from "@mantine/core"
import { IconSearch, IconFilter, IconArrowsSort } from "@tabler/icons-react"
import { useState, KeyboardEvent } from "react"

/** クエスト検索バーコンポーネント */
export const QuestSearchBar = ({ onSearch, onFilterClick, onSortClick, onSearchTextChange, placeholder = "クエスト名で検索", value, filterCount = 0, sortCount = 0 }: {
  /** 検索実行時のハンドル */
  onSearch: (searchText: string) => void
  /** フィルターボタン押下時のハンドル */
  onFilterClick: () => void
  /** ソートボタン押下時のハンドル */
  onSortClick: () => void
  /** 検索テキスト変更時のハンドル */
  onSearchTextChange?: (searchText: string) => void
  /** プレースホルダーテキスト */
  placeholder?: string
  /** 検索テキスト値 */
  value?: string
  /** フィルター適用数 */
  filterCount?: number
  /** ソート適用数 */
  sortCount?: number
}) => {
  /** 検索テキスト状態（制御されていない場合のみ使用） */
  const [internalSearchText, setInternalSearchText] = useState("")
  
  /** 実際の検索テキスト値（制御されている場合はpropsから、そうでない場合は内部状態） */
  const searchText = value ?? internalSearchText
  
  /** IME入力状態 */
  const [isComposing, setIsComposing] = useState(false)

  /** Enterキー押下時のハンドル */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault()
      onSearch(searchText)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      {/* クエスト名で検索 */}
      <Input
        leftSection={<IconSearch size={16} />}
        placeholder={placeholder}
        value={searchText}
        onChange={(event) => {
          const newValue = event.currentTarget.value.trim()
          setInternalSearchText(newValue)
          onSearchTextChange?.(newValue)
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
      
      {/* フィルター設定ポップアップ起動 */}
      <Indicator label={filterCount} size={16} disabled={filterCount === 0}>
        <ActionIcon variant="default" onClick={onFilterClick}>
          <IconFilter style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Indicator>
      
      {/* ソート設定ポップアップ起動 */}
      <Indicator label={sortCount} size={16} disabled={sortCount === 0}>
        <ActionIcon variant="default" onClick={onSortClick}>
          <IconArrowsSort style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Indicator>
    </div>
  )
}
