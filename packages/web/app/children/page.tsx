"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { ChildEntity, ChildColumns } from "../_schema/childEntity"
import { DataTable, DataTableSortStatus } from "mantine-datatable"
import { useEffect, useState, Suspense } from "react"
import { QUESTS_URL } from "../(core)/constants"
import { AuthorizedPageLayout } from "../login/_components/AuthorizedPageLayout"
import { Button } from "@mantine/core"
import Link from "next/link"
import { useChildren } from "./_hooks/useChildren"

function ChildrenContent() {
  const router = useRouter();

  /** ソート状態 */
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<ChildEntity>>({
    columnAccessor: 'id' as ChildColumns,
    direction: 'asc',
  })

  /** ページャ状態 */
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  /** ページ変更時のイベント */
  const handleChangedPage = (page: number) => {
    setPage(page)
  }
  
  // 子供一覧を取得する
  const { fetchedChildren, isLoading, totalRecords } = useChildren({
    sortColumn: sortStatus.columnAccessor as ChildColumns,
    sortOrder: sortStatus.direction,
    page,
    pageSize
  })

  return (
    <AuthorizedPageLayout title="子供一覧" actionButtons={(
      <Button hidden={false} onClick={() => {
        router.push("/childs/new")
      }}>新規作成</Button>
    )}>
      <div className="m-5" />
      {/* 子供一覧テーブル */}
      <DataTable<ChildEntity> 
        withTableBorder 
        highlightOnHover
        noRecordsText=""
        noRecordsIcon={<></>}
        records={fetchedChildren}
        columns={[
          { accessor: 'id', title: 'ID', sortable: true, resizable: true,
            render: (child) => {
            const url = `${QUESTS_URL}/${child.user_id}`
            return (<Link href={url} className="text-blue-400">{child.user_id}</Link>)}
          },
          { accessor: 'name', title: '子供名', sortable: true, resizable: true },
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
      <ChildrenContent />
    </Suspense>
  )
}
