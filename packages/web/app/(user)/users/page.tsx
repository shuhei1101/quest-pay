"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { createUserFilterFromQueryObj, UserEntitySchema, UserColumns, UserFilterSchema } from "../_schema/userSchema"
import { useUserTypes } from "../_hooks/useUserTypes"
import { DataTable, DataTableSortStatus } from "mantine-datatable"
import { useEffect, useState, Suspense } from "react"
import { useUsers } from "./_hooks/useUsers"
import {  USERS_URL } from "../../(core)/appConstants"
import { AuthorizedPageLayout } from "../../(auth)/_components/AuthorizedPageLayout"
import Link from "next/link"
import { getTypeName } from "../_schema/userTypeSchema"
import { UserFilterWithType } from "./_components/UserFilterWithType"

function UsersContent() {
  const router = useRouter();

  /** ユーザフィルター状態 */
  const [userFilter, setUserFilter] = useState<UserFilterSchema>({})
  
  /** 検索実行用フィルター状態 */
  const [searchFilter, setSearchFilter] = useState<UserFilterSchema>({})
  
  /** クエリストリングの状態 */
  const searchParams = useSearchParams();
  
  // パラメータをユーザフィルターにセットする
  useEffect(() => {
    const queryObj: UserFilterSchema = searchParams ? Object.fromEntries(searchParams.entries()): {}
    setUserFilter(createUserFilterFromQueryObj(queryObj))
  }, [searchParams])

  // ユーザステータスマスタを取得する
  const { fetchedTypes, isLoading: typeLoading } = useUserTypes()
  
  /** ソート状態 */
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<UserEntitySchema>>({
    columnAccessor: 'user_id' as UserColumns,
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
  const { fetchedUsers, isLoading: userLoading, refresh, totalRecords } = useUsers({
    filter: searchFilter,
    sortColumn: sortStatus.columnAccessor as UserColumns,
    sortOrder: sortStatus.direction,
    page,
    pageSize
  })

  /** 全体のロード状態 */
  const loading = typeLoading || userLoading;

  /** 検索ボタン押下時のハンドル */
  const handleSerch = () => {
    // ユーザフィルターをクエリストリングに変換する
    const paramsObj = Object.fromEntries(
      Object.entries(userFilter)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    );
    const params = new URLSearchParams(paramsObj)

    // フィルターをURLに反映する
    router.push(`${USERS_URL}?${params.toString()}`)

    // 検索フィルターを更新し、一覧を更新する
    setSearchFilter(userFilter)
  }

  return (
    <AuthorizedPageLayout requiredParent={true} title="ユーザ一覧">
      {/* 検索条件欄 */}
      <UserFilterWithType types={fetchedTypes} filter={userFilter} handleSearch={handleSerch} setFilter={setUserFilter} 
       />
      <div className="m-5" />
      {/* ユーザ一覧テーブル */}
      <DataTable<UserEntitySchema> 
        withTableBorder 
        highlightOnHover
        noRecordsText=""
        noRecordsIcon={<></>}
        records={fetchedUsers}
        columns={[
          { accessor: 'user_id', title: 'ID', sortable: true, resizable: true,
            render: (user) => {
            const url = `${USERS_URL}/${user.user_id}`
            return (<Link href={url} className="text-blue-400">{user.user_id}</Link>)}
          },
          { accessor: 'name', title: 'ユーザ名', sortable: true, resizable: true },
          { accessor: 'type_id', title: 'ステータス', sortable: true, resizable: true,
            render: (user) => getTypeName(fetchedTypes, user.type_id)
          }
        ]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        totalRecords={totalRecords}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={handleChangedPage}
      />
    </AuthorizedPageLayout>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <UsersContent />
    </Suspense>
  )
}
