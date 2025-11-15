"use client"

import { Accordion, Button, Input } from "@mantine/core"
import { Dispatch, SetStateAction, useState } from "react"
import { UserFilterSchema } from "../../_schema/userSchema"

export const UserFilter = ({filter, setFilter, handleSearch}: {
  filter: UserFilterSchema,
  setFilter: Dispatch<SetStateAction<UserFilterSchema>> ,
  handleSearch: () => void
}) => {

  // アコーディオンの開閉状態（デフォルトは開いた状態）
  const [openedAccordion, setOpenedAccordion] = useState<string | null>("");


  // 検索ボタン押下時のイベント
  const onSearchClick = () => {
    setOpenedAccordion(null)
    handleSearch()
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
