"use client"

import { Accordion, Button, Input } from "@mantine/core"
import { Dispatch, SetStateAction, useState } from "react"
import { UserFilterSchema } from "../../api/users/entity"
import { UserTypeCombobox } from "../[id]/_component/UserTypeCombobox"
import { RawUserType } from "../../_schema/userTypeSchema"

export const UserFilterWithType = ({filter, setFilter, handleSearch, types}: {
  filter: UserFilterSchema,
  setFilter: Dispatch<SetStateAction<UserFilterSchema>> ,
  types: RawUserType[],
  handleSearch: () => void
}) => {

  // アコーディオンの開閉状態（デフォルトは開いた状態）
  const [openedAccordion, setOpenedAccordion] = useState<string | null>("");


  // 検索ボタン押下時のイベント
  const onSearchClick = () => {
    setOpenedAccordion(null)
    handleSearch()
  }

  // タイプ変更時のイベント
  const onStutasChanged = (val: number | undefined) => {
    // 選択された値をタイプにセットする
    setFilter((prev) => ({
      ...prev,
      type_id: val !== -1 ? val : undefined
    }))
  }

  return (
    <div>
      <Accordion variant="contained" value={openedAccordion} onChange={setOpenedAccordion}>
        <Accordion.Item value="search" key="search">
          <Accordion.Control icon={"🔍"}>検索条件</Accordion.Control>
          <Accordion.Panel>
          <div className="flex gap-6  items-center p-2">
            <Input.Wrapper label="氏名">
              <Input onChange={(event) => {
                const value = event.currentTarget.value.trim();
                setFilter((prev) => ({
                  ...prev,
                  name: value
                }))
              }} className="max-w-120" />
            </Input.Wrapper>
            <Input.Wrapper label="タイプ" >
              <UserTypeCombobox onChanged={onStutasChanged} userTypes={types} currentValue={filter?.type_id} />
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
