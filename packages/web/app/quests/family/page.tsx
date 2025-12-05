"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { DataTable, DataTableSortStatus } from "mantine-datatable"
import { useEffect, useState, Suspense } from "react"
import { Button } from "@mantine/core"
import Link from "next/link"
import { FamilyQuestColumns, FamilyQuestView } from "../../api/quests/family/view"
import { useFamilyQuests } from "./_hooks/useFamilyQuests"
import { FAMILY_QUESTS_URL } from "@/app/(core)/constants"
import { AuthorizedPageLayout } from "@/app/login/_components/AuthorizedPageLayout"
import { FamilyQuestFilter } from "./_components/FamilyQuestFilter"
import { FamilyQuestFilterSchema, FamilyQuestFilterType } from "../../api/quests/family/schema"

function QuestsContent() {
  const router = useRouter(); 

  /** クエストフィルター状態 */
  const [questFilter, setQuestFilter] = useState<FamilyQuestFilterType>({tags: []})
  
  /** 検索実行用フィルター状態 */
  const [searchFilter, setSearchFilter] = useState<FamilyQuestFilterType>({tags: []})
  
  /** クエリストリングの状態 */
  const searchParams = useSearchParams()
  
  // パラメータをクエストフィルターにセットする
  useEffect(() => {
    if (!searchParams) return
    const queryObj = searchParams ? Object.fromEntries(searchParams.entries()): {}
    // tags を配列に変換
    const parsedQuery = {
      ...queryObj,
      tags: queryObj.tags ? queryObj.tags.split(",") : []
    }
    setQuestFilter(FamilyQuestFilterSchema.parse(parsedQuery))
  }, [searchParams])

  /** ソート状態 */
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<FamilyQuestView>>({
    columnAccessor: 'id' as FamilyQuestColumns,
    direction: 'asc',
  })

  /** ページャ状態 */
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  /** ページ変更時のイベント */
  const handleChangedPage = (page: number) => {
    setPage(page)
  }
  
  // クエスト一覧を取得する
  const { fetchedQuests, isLoading, totalRecords } = useFamilyQuests({
    filter: searchFilter,
    sortColumn: sortStatus.columnAccessor as FamilyQuestColumns,
    sortOrder: sortStatus.direction,
    page,
    pageSize
  })

  /** 検索ボタン押下時のハンドル */
  const handleSerch = () => {
    // クエストフィルターをクエリストリングに変換する
    const paramsObj = Object.fromEntries(
      Object.entries(questFilter)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    );
    const params = new URLSearchParams(paramsObj)

    // フィルターをURLに反映する
    router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)

    // 検索フィルターを更新し、一覧を更新する
    setSearchFilter(questFilter)
  }

  return (
    <AuthorizedPageLayout title="クエスト一覧" actionButtons={(
      <Button hidden={false} onClick={() => {
        router.push("/quests/new")
      }}>新規作成</Button>
    )}>
      {/* 検索条件欄 */}
      <FamilyQuestFilter filter={questFilter} handleSearch={handleSerch} setFilter={setQuestFilter} 
       />
      <div className="m-5" />
      {/* クエスト一覧テーブル */}
      <DataTable<FamilyQuestView> 
        withTableBorder 
        highlightOnHover
        noRecordsText=""
        noRecordsIcon={<></>}
        records={fetchedQuests}
        columns={[
          { accessor: 'id', title: 'ID', sortable: true, resizable: true,
            render: (quest) => {
            const url = `${FAMILY_QUESTS_URL}/${quest.id}`
            return (<Link href={url} className="text-blue-400">{quest.id}</Link>)}
          },
          { accessor: 'name', title: 'クエスト名', sortable: true, resizable: true },
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
      <QuestsContent />
    </Suspense>
  )
}
