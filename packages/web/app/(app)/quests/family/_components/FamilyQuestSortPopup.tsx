"use client"
import { useTheme } from "@/app/(core)/_theme/useTheme"

import { useWindow } from "@/app/(core)/useConstants"
import { QuestSort, QuestColumn } from "@/drizzle/schema"
import { ActionIcon, Button, ColorPicker, Input, Modal, Pill, PillsInput, Popover, SimpleGrid, Space, Tabs, Text } from "@mantine/core"
import { IconArrowDown, IconArrowsSort, IconArrowUp, IconCheck, IconGrid3x3, IconWorld } from "@tabler/icons-react"
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"

const ColumnButton = ({name, column, leftSection, sort, onClick}: {
  name: string,
  column: QuestColumn,
  leftSection: ReactNode,
  sort: QuestSort,
  onClick: () => void
}) => (
  <Button variant={sort.column == column ? "outline" : "default"} justify="space-between"
    rightSection={sort.column == column && (sort.order === "asc" ? <IconArrowUp size={18}/> : <IconArrowDown size={18}/>)}
    onClick={onClick}
    ><div className="flex gap-2 items-center">
      {leftSection}
      {name}
    </div></Button>
)

/** 家族クエストソートポップアップ */
export const FamilyQuestSortPopup = ({opened, close, currentSort, handleSearch}: {
  opened: boolean,
  close: () => void,
  currentSort: QuestSort,
  handleSearch: (sort: QuestSort) => void
}) => {
  /** 画面定数 */
  const { isMobile, isTablet, isDesktop } = useWindow()
  const { colors } = useTheme()

  /** ソート状態 */
  const [sort, setSort] = useState<QuestSort>({column: "id", order: "asc"})

  // ポップアップ起動時のイベント
  useEffect(() => {
    if (!opened) return
    setSort(currentSort)
  }, [opened])

  // 検索ボタン押下時のイベント
  const onSearchClick = () => {
    handleSearch(sort)
    close()
  }

  const onColumnClick = (column: QuestColumn) => setSort(prev => ({
      order: prev.column !== column ? "asc" : prev.order === "asc" ? "desc" : "asc",
      column: column
    }))

  return (
    <Modal opened={opened} onClose={close} title="ソート">
          <Text>並び替え項目</Text>
          <SimpleGrid
            cols={isMobile ? 1 : isTablet ? 2 : isDesktop ? 2 : 2}
            spacing="md"
          >
            <ColumnButton column="id" name="ID" leftSection={<IconGrid3x3 size={18}/>} onClick={() => onColumnClick("id")} sort={sort} />
            <ColumnButton column="name" name="クエスト名" leftSection={<IconArrowsSort size={18}/>} onClick={() => onColumnClick("name")} sort={sort} />
          </SimpleGrid>
          <div className="mb-5" />
          <div className="flex justify-end">
            <Button variant="gradient" gradient={{ from: colors.buttonColors.gradient, to: colors.buttonColors.primary, deg: 90 }} onClick={onSearchClick}>検索</Button>
          </div>
    </Modal>
  )
}
