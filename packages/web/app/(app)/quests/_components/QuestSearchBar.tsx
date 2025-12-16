"use client"
import { Input, ActionIcon } from "@mantine/core"
import { IconSearch, IconFilter, IconArrowsSort } from "@tabler/icons-react"
import { useState, KeyboardEvent } from "react"

/** クエスト検索バーコンポーネント */
export const QuestSearchBar = ({ onSearch, onFilterClick, onSortClick, placeholder = "クエスト名で検索", defaultValue = "" }: {
  /** 検索実行時のハンドル */
  onSearch: (searchText: string) => void
  /** フィルターボタン押下時のハンドル */
  onFilterClick: () => void
  /** ソートボタン押下時のハンドル */
  onSortClick: () => void
  /** プレースホルダーテキスト */
  placeholder?: string
  /** 初期値 */
  defaultValue?: string
}) => {
  /** 検索テキスト状態 */
  const [searchText, setSearchText] = useState(defaultValue)
  
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
        onChange={(event) => setSearchText(event.currentTarget.value.trim())}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
      
      {/* フィルター設定ポップアップ起動 */}
      <ActionIcon variant="default" onClick={onFilterClick}>
        <IconFilter style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
      
      {/* ソート設定ポップアップ起動 */}
      <ActionIcon variant="default" onClick={onSortClick}>
        <IconArrowsSort style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
    </div>
  )
}
