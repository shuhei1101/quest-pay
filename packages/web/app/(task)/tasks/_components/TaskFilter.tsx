"use client"

import { Accordion, Button, Input } from "@mantine/core"
import { TaskStatusCombobox } from "../[id]/_component/TaskStatusCombobox"
import { Dispatch, SetStateAction, useState } from "react"
import { TaskFilterSchema } from "../../_schema/taskSchema"
import { RawTaskStatus } from "../../_schema/taskStatusSchema"

export const TaskFilter = ({filter, setFilter, statuses, handleSearch}: {
  filter: TaskFilterSchema,
  setFilter: Dispatch<SetStateAction<TaskFilterSchema>> ,
  statuses: RawTaskStatus[],
  handleSearch: () => void
}) => {

  // アコーディオンの開閉状態（デフォルトは開いた状態）
  const [openedAccordion, setOpenedAccordion] = useState<string | null>("search");

  // 検索ボタン押下時のイベント
  const onSearchClick = () => {
    setOpenedAccordion(null)
    handleSearch()
  }

  // ステータス変更時のイベント
  const onStutasChanged = (val: number | undefined) => {
    // 選択された値をステータスにセットする
    setFilter((prev) => ({
      ...prev,
      status_id: val !== -1 ? val : undefined
    }))
  }

  return (
    <div>
      <Accordion variant="contained" value={openedAccordion} onChange={setOpenedAccordion}>
        <Accordion.Item value="search" key="search">
          <Accordion.Control icon={"🔍"}>検索条件</Accordion.Control>
          <Accordion.Panel>
          <div className="flex gap-6  items-center p-2 flex-wrap">
            <div className="flex gap-6 flex-nowrap">
              <Input.Wrapper label="ID">
                <Input onChange={(event) => {
                  const value = event.currentTarget.value.trim();
                  setFilter((prev) => ({
                    ...prev,
                    id: value ? Number(value) : undefined
                  }))
                }} className="max-w-20" type="number" />
              </Input.Wrapper>
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
            <Input.Wrapper label="ステータス" >
              <TaskStatusCombobox onChanged={onStutasChanged} taskStatuses={statuses} currentValue={filter?.status_id} />
            </Input.Wrapper>
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
