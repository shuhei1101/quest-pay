"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { createTaskFilterFromQueryObj, RawTask, TaskColumns, TaskFilterSchema } from "../_schema/taskSchema"
import { useTaskStatuses } from "../_hooks/useTaskStatuses"
import { DataTable, DataTableSortStatus } from "mantine-datatable"
import { useEffect, useState, Suspense } from "react"
import { useTasks } from "./_hooks/useTasks"
import { TaskFilter } from "./_components/TaskFilter"
import { TASKS_URL } from "../../(core)/appConstants"
import { AuthorizedPageLayout } from "../../(auth)/_components/AuthorizedPageLayout"
import { Button, LoadingOverlay } from "@mantine/core"
import Link from "next/link"
import { getStatusName } from "../_schema/taskStatusSchema"
import { useLoginUserInfo } from "@/app/(auth)/_hooks/useLoginUserInfo"

function TasksContent() {
  const router = useRouter();

  /** ログインユーザ情報を取得する */
  const {isGuest, isAdmin} = useLoginUserInfo()

  /** タスクフィルター状態 */
  const [taskFilter, setTaskFilter] = useState<TaskFilterSchema>({})
  
  /** 検索実行用フィルター状態 */
  const [searchFilter, setSearchFilter] = useState<TaskFilterSchema>({})
  
  /** クエリストリングの状態 */
  const searchParams = useSearchParams();
  
  // パラメータをタスクフィルターにセットする
  useEffect(() => {
    const queryObj: TaskFilterSchema = searchParams ? Object.fromEntries(searchParams.entries()): {}
    setTaskFilter(createTaskFilterFromQueryObj(queryObj))
  }, [searchParams])

  // タスクステータスマスタを取得する
  const { fetchedStatuses, isLoading: statusLoading } = useTaskStatuses()
  
  /** ソート状態 */
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<RawTask>>({
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
  const loading = statusLoading || taskLoading;

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
      <Button hidden={isGuest} onClick={() => {
        router.push("/tasks/new")
      }}>新規作成</Button>
    )}>
      {/* 検索条件欄 */}
      <TaskFilter statuses={fetchedStatuses} filter={taskFilter} handleSearch={handleSerch} setFilter={setTaskFilter} 
       />
      <div className="m-5" />
      {/* タスク一覧テーブル */}
      <DataTable<RawTask> 
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
          { accessor: 'detail', title: '詳細', sortable: true, resizable: true,
            render: (record) => {
              const text = record.detail || '';
              return text.length > 30 ? text.slice(0, 30) + '...' : text;
            }
           },
          { accessor: 'status_id', title: 'ステータス', sortable: true, resizable: true,
            render: (task) => getStatusName(fetchedStatuses, task.status_id)
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
      <TasksContent />
    </Suspense>
  )
}
