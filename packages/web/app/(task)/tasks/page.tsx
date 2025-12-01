"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { TaskEntity, TaskColumns } from "../_schema/taskEntity"
import { DataTable, DataTableSortStatus } from "mantine-datatable"
import { useEffect, useState, Suspense } from "react"
import { useTasks } from "./_hooks/useTasks"
import { TASKS_URL } from "../../(core)/appConstants"
import { AuthorizedPageLayout } from "../../(auth)/_components/AuthorizedPageLayout"
import { Button } from "@mantine/core"
import Link from "next/link"
import { useLoginUserInfo } from "@/app/(auth)/_hooks/useLoginUserInfo"
import { TaskFilterSchema, TaskFilterType } from "./_schema/taskFilterSchema"
import { TaskFilter } from "./_components/TaskFilter"

function TasksContent() {
  const router = useRouter();

  /** ログインユーザ情報を取得する */
  const { userInfo } = useLoginUserInfo()

  /** タスクフィルター状態 */
  const [taskFilter, setTaskFilter] = useState<TaskFilterType>({tags: []})
  
  /** 検索実行用フィルター状態 */
  const [searchFilter, setSearchFilter] = useState<TaskFilterType>({tags: []})
  
  /** クエリストリングの状態 */
  const searchParams = useSearchParams()
  
  // パラメータをタスクフィルターにセットする
  useEffect(() => {
    if (!searchParams) return
    const queryObj = searchParams ? Object.fromEntries(searchParams.entries()): {}
    // tags を配列に変換
    const parsedQuery = {
      ...queryObj,
      tags: queryObj.tags ? queryObj.tags.split(",") : []
    }
    setTaskFilter(TaskFilterSchema.parse(parsedQuery))
  }, [searchParams])

  /** ソート状態 */
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<TaskEntity>>({
    columnAccessor: 'id' as TaskColumns,
    direction: 'asc',
  })

  /** ページャ状態 */
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  /** ページ変更時のイベント */
  const handleChangedPage = (page: number) => {
    setPage(page)
  }
  
  // タスク一覧を取得する
  const { fetchedTasks, isLoading: taskLoading, totalRecords } = useTasks({
    filter: searchFilter,
    sortColumn: sortStatus.columnAccessor as TaskColumns,
    sortOrder: sortStatus.direction,
    page,
    pageSize
  })

  /** 全体のロード状態 */
  const loading = taskLoading;

  /** 検索ボタン押下時のハンドル */
  const handleSerch = () => {
    // タスクフィルターをクエリストリングに変換する
    const paramsObj = Object.fromEntries(
      Object.entries(taskFilter)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    );
    const params = new URLSearchParams(paramsObj)

    // フィルターをURLに反映する
    router.push(`${TASKS_URL}?${params.toString()}`)

    // 検索フィルターを更新し、一覧を更新する
    setSearchFilter(taskFilter)
  }

  return (
    <AuthorizedPageLayout title="タスク一覧" actionButtons={(
      <Button hidden={false} onClick={() => {
        router.push("/tasks/new")
      }}>新規作成</Button>
    )}>
      {/* 検索条件欄 */}
      <TaskFilter filter={taskFilter} handleSearch={handleSerch} setFilter={setTaskFilter} 
       />
      <div className="m-5" />
      {/* タスク一覧テーブル */}
      <DataTable<TaskEntity> 
        withTableBorder 
        highlightOnHover
        noRecordsText=""
        noRecordsIcon={<></>}
        records={fetchedTasks}
        columns={[
          { accessor: 'id', title: 'ID', sortable: true, resizable: true,
            render: (task) => {
            const url = `${TASKS_URL}/${task.id}`
            return (<Link href={url} className="text-blue-400">{task.id}</Link>)}
          },
          { accessor: 'name', title: 'タスク名', sortable: true, resizable: true },
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
      <TasksContent />
    </Suspense>
  )
}
