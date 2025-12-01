"use client"

import { Accordion, Button, Input, Pill, PillsInput } from "@mantine/core"
import { Dispatch, SetStateAction, useState } from "react"
import { TaskFilterType } from "../_schema/taskFilterSchema"

export const TaskFilter = ({filter, setFilter, handleSearch}: {
  filter: TaskFilterType,
  setFilter: Dispatch<SetStateAction<TaskFilterType>> ,
  handleSearch: () => void
}) => {

  // アコーディオンの開閉状態（デフォルトは開いた状態）
  const [openedAccordion, setOpenedAccordion] = useState<string | null>("search");

  // 検索ボタン押下時のイベント
  const onSearchClick = () => {
    setOpenedAccordion(null)
    handleSearch()
  }

  // タグ更新ラッパー関数
  const setTags = (tags: string[]) => {
    setFilter(prev => ({
      ...prev,
      tags
    }))
  }

  /** タグ入力状態 */
  const [tagInputValue, setTagInputValue] = useState("")

  /** タグ入力時のハンドル */
  const handleTag = () => {
    const newTag = tagInputValue.trim()
    // タグが空白もしくは既に登録済みの場合、処理を終了する
    if (newTag && !filter.tags.includes(newTag)) {
      // タグを追加する
      setTags([...filter.tags, newTag])
    }
    // タグ入力状態を初期化する
    setTagInputValue("")
  }

  /** IME入力状態 */
  const [isComposing, setIsComposing] = useState(false);

  return (
    <div>
      <Accordion variant="contained" value={openedAccordion} onChange={setOpenedAccordion}>
        <Accordion.Item value="search" key="search">
          <Accordion.Control icon={"🔍"}>検索条件</Accordion.Control>
          <Accordion.Panel>
          <div className="flex gap-6  items-center p-2 flex-wrap">
            <div className="flex gap-6 flex-nowrap">
              {/* タスク名 */}
              <Input.Wrapper label="タスク名">
                <Input onChange={(event) => {
                  const value = event.currentTarget.value.trim();
                  setFilter((prev) => ({
                    ...prev,
                    name: value
                  }))
                }} className="max-w-120" />
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
                />
              </Pill.Group>
            </PillsInput>

          </div>
          <div className="mb-5" />
          <div className="flex justify-end">
            <Button variant="filled" onClick={onSearchClick}>検索</Button>
          </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
