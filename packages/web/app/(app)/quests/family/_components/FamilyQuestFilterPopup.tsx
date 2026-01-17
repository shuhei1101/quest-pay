"use client"
import { useTheme } from "@/app/(core)/_theme/useTheme"

import { FamilyQuestFilterType } from "@/app/api/quests/family/query"
import { ActionIcon, Button, ColorPicker, Input, Modal, Pill, PillsInput, Popover, Space, Tabs, Text } from "@mantine/core"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
/** 家族クエストフィルターポップアップ */
export const FamilyQuestFilterPopup = ({opened, close, currentFilter, handleSearch}: {
  opened: boolean,
  close: () => void,
  currentFilter: FamilyQuestFilterType,
  handleSearch: (filter: FamilyQuestFilterType) => void
}) => {
  /** クエストフィルター状態 */
  const { colors } = useTheme()
  const [filter, setFilter] = useState<FamilyQuestFilterType>({tags: []})
  /** タグ入力状態 */
  const [tagInputValue, setTagInputValue] = useState("")
  
  // ポップアップ起動時のイベント
  useEffect(() => {
    if (!opened) return
    setFilter(currentFilter)
  }, [opened])
  // 検索ボタン押下時のイベント
  const onSearchClick = () => {
    handleSearch(filter)
    close()
  }
  // タグ更新ラッパー関数
  const setTags = (tags: string[]) => {
    setFilter(prev => ({
      ...prev,
      tags
    }))
    // タグが空白もしくは既に登録済みの場合、処理を終了する
    if (newTag && !filter.tags.includes(newTag)) {
      // タグを追加する
      setTags([...filter.tags, newTag])
    }
    // タグ入力状態を初期化する
    setTagInputValue("")
  /** IME入力状態 */
  const [isComposing, setIsComposing] = useState(false);
  return (
    <Modal opened={opened} onClose={close} title="フィルター">
          <div className="flex gap-6  items-center p-2 flex-wrap">
            <div className="flex gap-6 flex-nowrap">
              {/* クエスト名 */}
              <Input.Wrapper label="クエスト名">
                <Input onChange={(event) => {
                  const value = event.currentTarget.value.trim();
                  setFilter((prev) => ({
                    ...prev,
                    name: value
                  }))
                }} className="max-w-120"
                value={filter.name}
                />
              </Input.Wrapper>
            </div>
            {/* タグ */}
            <PillsInput label="タグ">
              <Pill.Group>
                {filter.tags.map((tag) => (
                  <Pill key={tag} withRemoveButton
                    onRemove={() => setTags(filter.tags.filter((t) => t !== tag))}
                  >{tag}</Pill>
                ))}
                <PillsInput.Field placeholder="タグを追加" 
                  value={tagInputValue}
                  onChange={(e) => setTagInputValue(e.target.value)}
                  onBlur={() => handleTag()}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  onKeyDown={(e) => {
                    if (e.key == "Enter" && !isComposing) {
                      e.preventDefault()
                      handleTag()
                    }
                  }}
              </Pill.Group>
            </PillsInput>
          </div>
          <div className="mb-5" /> 
          <div className="flex justify-end">
            <Button variant="gradient" gradient={{ from: colors.buttonColors.gradient, to: colors.buttonColors.primary, deg: 90 }} onClick={onSearchClick}>検索</Button>
    </Modal>
  )
}
