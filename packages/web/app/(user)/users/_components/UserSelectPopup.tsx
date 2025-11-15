"use client"
import { DataTable, DataTableSortStatus } from "mantine-datatable"
import { useState } from "react"
import { Button, Modal } from "@mantine/core"
import { UserColumns, UserFilterSchema, RawUser } from "../../_schema/userSchema"
import { useUsers } from "../_hooks/useUsers"
import { UserFilter } from "./UserFilter"

export const UserSelectPopup = ({opened ,close, handleUsers}: {
  opened: boolean,
  close: () => void,
  handleUsers: (users: RawUser[]) => void
}) => {
  /** ユーザフィルター状態 */
  const [userFilter, setUserFilter] = useState<UserFilterSchema>({})
  
  /** 検索実行用フィルター状態 */
  const [searchFilter, setSearchFilter] = useState<UserFilterSchema>({})

  /** ソート状態 */
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<RawUser>>({
    columnAccessor: 'name' as UserColumns,
    direction: 'asc',
  })

  /** ページャ状態 */
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  /** ページ変更時のイベント */
  const handleChangedPage = (page: number) => {
    setPage(page)
  }
  
  // ユーザ一覧を取得する
  const { fetchedUsers, totalRecords } = useUsers({
    filter: searchFilter,
    sortColumn: sortStatus.columnAccessor as UserColumns,
    sortOrder: sortStatus.direction,
    page,
    pageSize
  })

  /** 選択状態 */
  const [selectedRecords, setSelectedRecords] = useState<RawUser[]>([]);

  /** 閉じる処理のラッパー */
  const handleClose = () => {
    // 選択中のユーザを空にする
    setSelectedRecords([])
    // ポップアップを閉じる
    close()
  }

  /** 検索ボタン押下時のハンドル */
  const handleSerch = () => {
    // 検索フィルターを更新し、一覧を更新する
    setSearchFilter(userFilter)
  }

  /** 確定ボタン押下時のハンドル */
  const handleConfirm = () => {
    // 引数のハンドルイベントを実行する
    handleUsers(selectedRecords)
    // ポップアップを閉じる
    handleClose()
  }

  return (
    <Modal opened={opened} onClose={close} title="ユーザ選択画面">
      {/* 検索条件欄 */}
      <UserFilter filter={userFilter} handleSearch={handleSerch} setFilter={setUserFilter} />
      <div className="m-5" />
      {/* ユーザ一覧テーブル */}
      <DataTable<RawUser> 
        withTableBorder
        highlightOnHover
        noRecordsText=""
        noRecordsIcon={<></>}
        records={fetchedUsers}
        idAccessor="user_id"
        columns={[
          { accessor: 'name', title: '氏名', sortable: true, resizable: true },
        ]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        totalRecords={totalRecords}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={handleChangedPage}
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={setSelectedRecords}
      />
      <div className="m-4" />
      {/* 確定ボタン */}
      <div className="flex w-full justify-end gap-4">
        <Button disabled={selectedRecords.length == 0} onClick={handleConfirm}>確定</Button>
        <Button onClick={() => close()} variant="outline" >キャンセル</Button>
      </div>
    </Modal>
  )
}
