// "use client"
// import { useRouter, useSearchParams } from "next/navigation"
// import { createQuestFilterFromQueryObj, RawQuest, QuestColumns, QuestFilterSchema } from "../_schema/questSchema"
// import { useQuestStatuses } from "../_hooks/useQuestStatuses"
// import { DataTable, DataTableSortStatus } from "mantine-datatable"
// import { useEffect, useState, Suspense } from "react"
// import { useQuests } from "./_hooks/useQuests"
// import { QuestFilter } from "./_components/QuestFilter"
// import { QUESTS_URL } from "../../(core)/appConstants"
// import { AuthorizedPageLayout } from "../../(auth)/_components/AuthorizedPageLayout"
// import { Button, LoadingOverlay } from "@mantine/core"
// import Link from "next/link"
// import { getStatusName } from "../_schema/questStatusSchema"
// import { useLoginUserInfo } from "@/app/(auth)/_hooks/useLoginUserInfo"

// function QuestsContent() {
//   const router = useRouter();

//   /** ログインユーザ情報を取得する */
//   const {isGuest, isAdmin} = useLoginUserInfo()

//   /** クエストフィルター状態 */
//   const [questFilter, setQuestFilter] = useState<QuestFilterSchema>({})
  
//   /** 検索実行用フィルター状態 */
//   const [searchFilter, setSearchFilter] = useState<QuestFilterSchema>({})
  
//   /** クエリストリングの状態 */
//   const searchParams = useSearchParams();
  
//   // パラメータをクエストフィルターにセットする
//   useEffect(() => {
//     const queryObj: QuestFilterSchema = searchParams ? Object.fromEntries(searchParams.entries()): {}
//     setQuestFilter(createQuestFilterFromQueryObj(queryObj))
//   }, [searchParams])

//   // クエストステータスマスタを取得する
//   const { fetchedStatuses, isLoading: statusLoading } = useQuestStatuses()
  
//   /** ソート状態 */
//   const [sortStatus, setSortStatus] = useState<DataTableSortStatus<RawQuest>>({
//     columnAccessor: 'id' as QuestColumns,
//     direction: 'asc',
//   })

//   /** ページャ状態 */
//   const [page, setPage] = useState<number>(1)
//   const pageSize = 10

//   /** ページ変更時のイベント */
//   const handleChangedPage = (page: number) => {
//     setPage(page)
//   }
  
//   // クエスト一覧を取得する
//   const { fetchedQuests, isLoading: questLoading, totalRecords } = useQuests({
//     filter: searchFilter,
//     sortColumn: sortStatus.columnAccessor as QuestColumns,
//     sortOrder: sortStatus.direction,
//     page,
//     pageSize
//   })

//   /** 全体のロード状態 */
//   const loading = statusLoading || questLoading;

//   /** 検索ボタン押下時のハンドル */
//   const handleSerch = () => {
//     // クエストフィルターをクエリストリングに変換する
//     const paramsObj = Object.fromEntries(
//       Object.entries(questFilter)
//         .filter(([_, v]) => v !== undefined && v !== null && v !== '')
//         .map(([k, v]) => [k, String(v)])
//     );
//     const params = new URLSearchParams(paramsObj)

//     // フィルターをURLに反映する
//     router.push(`${QUESTS_URL}?${params.toString()}`)

//     // 検索フィルターを更新し、一覧を更新する
//     setSearchFilter(questFilter)
//   }

//   return (
//     <AuthorizedPageLayout title="クエスト一覧" actionButtons={(
//       <Button hidden={isGuest} onClick={() => {
//         router.push("/quests/new")
//       }}>新規作成</Button>
//     )}>
//       {/* 検索条件欄 */}
//       <QuestFilter statuses={fetchedStatuses} filter={questFilter} handleSearch={handleSerch} setFilter={setQuestFilter} 
//        />
//       <div className="m-5" />
//       {/* クエスト一覧テーブル */}
//       <DataTable<RawQuest> 
//         withTableBorder 
//         highlightOnHover
//         noRecordsText=""
//         noRecordsIcon={<></>}
//         records={fetchedQuests}
//         columns={[
//           { accessor: 'id', title: 'ID', sortable: true, resizable: true,
//             render: (quest) => {
//             const url = `${QUESTS_URL}/${quest.id}`
//             return (<Link href={url} className="text-blue-400">{quest.id}</Link>)}
//           },
//           { accessor: 'name', title: 'クエスト名', sortable: true, resizable: true },
//           { accessor: 'detail', title: '詳細', sortable: true, resizable: true,
//             render: (record) => {
//               const text = record.detail || '';
//               return text.length > 30 ? text.slice(0, 30) + '...' : text;
//             }
//            },
//           { accessor: 'status_id', title: 'ステータス', sortable: true, resizable: true,
//             render: (quest) => getStatusName(fetchedStatuses, quest.status_id)
//           }
//         ]}
//         sortStatus={sortStatus}
//         onSortStatusChange={setSortStatus}
//         totalRecords={totalRecords}
//         recordsPerPage={pageSize}
//         page={page}
//         onPageChange={handleChangedPage}
//       />
//     </AuthorizedPageLayout>
//   )
// }

// export default function Page() {
//   return (
//     <Suspense fallback={<div></div>}>
//       <QuestsContent />
//     </Suspense>
//   )
// }
