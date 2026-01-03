// "use client"
// import { useRouter, useSearchParams } from "next/navigation"
// import { useEffect, useState, Suspense } from "react"
// import { SimpleGrid, Tabs, Button, Text, Input, ActionIcon, Box, Paper } from "@mantine/core"
// import { useQuestCategories } from "@/app/(app)/quests/category/_hook/useQuestCategories"
// import { RenderIcon } from "../../icons/_components/RenderIcon"
// import { useDisclosure, useIntersection } from "@mantine/hooks"
// import { devLog } from "@/app/(core)/util"
// import { IconArrowsSort, IconFilter, IconLogout, IconSearch } from "@tabler/icons-react"
// import { useWindow } from "@/app/(core)/useConstants"
// import { useLoginUserInfo } from "@/app/(auth)/login/_hook/useLoginUserInfo"
// import { useSwipeable } from "react-swipeable"

// export const ChildQuestsScreen = () => {
//   const router = useRouter() 

//   /** タブ状態 */
//   const [tabValue, setTabValue] = useState<string | null>('すべて');
  
//   /** 画面定数 */
//   const { isMobile, isTablet, isDesktop } = useWindow()

//   /**  フィルターポップアップ制御状態 */
//   const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false)
//   /**  ソートポップアップ制御状態 */
//   const [sortOpened, { open: openSort, close: closeSort }] = useDisclosure(false)

//   /** 現在のクエスト一覧状態 */
//   const [displayQuests, setDisplayQuests] = useState<FetchChildQuestsItem[]>([])

//   /** クエストフィルター状態 */
//   const [questFilter, setQuestFilter] = useState<ChildQuestFilterType>({tags: []})
  
//   /** 検索実行用フィルター状態 */
//   const [searchFilter, setSearchFilter] = useState<ChildQuestFilterType>({tags: []})
  
//   /** ソート状態 */
//   const [sort, setSort] = useState<ChildQuestSort>({column: "id", order: "asc"})

//   /** クエリストリングの状態 */
//   const searchParams = useSearchParams()

  
//   // パラメータをクエストフィルターにセットする
//   useEffect(() => {
//     if (!searchParams) return
//     const queryObj = searchParams ? Object.fromEntries(searchParams.entries()): {}
//     // tags を配列に変換
//     const parsedQuery = {
//       ...queryObj,
//       tags: queryObj.tags ? queryObj.tags.split(",") : []
//     }
//     setQuestFilter(ChildQuestFilterScheme.parse(parsedQuery))
//   }, [searchParams])

//   /** ページャ状態 */
//   const [page, setPage] = useState<number>(1)
//   const pageSize = 10
  
//   /** クエストカテゴリ */
//   const { questCategories, isLoading: categoryLoading } = useQuestCategories()

//   /** タブリスト */
//   const tabList = [
//     "すべて",
//     ...questCategories.map(c => c.name),
//     "その他"
//   ]
//   /** 現在のタブインデックス */
//   const currentIndex = tabList.indexOf(tabValue ?? "すべて")

//   /** クエスト一覧 */
//   const { fetchedQuests, isLoading, totalRecords ,maxPage } = useChildQuests({
//     filter: searchFilter,
//     sortColumn: sort.column,
//     sortOrder: sort.order,
//     page,
//     pageSize
//   })

//   /** 無限スクロール用 Intersection Observer */
//   const { ref: sentinelRef, entry } = useIntersection({
//     threshold: 1,
//   })
//   /** 下まで来たら次ページを取得する */
//   useEffect(() => {
//     if (entry?.isIntersecting) {
//       devLog("ページ最下層検知。現在のページ: ", {page, maxPage, totalRecords})
//       // 次のページが存在するときだけセットする
//       if (page < maxPage && !isLoading) {
//         setPage((prev) => prev + 1)
//       }
//     }
//   }, [entry, totalRecords, page, isLoading])
  
//   /** 検索ボタン押下時のハンドル */
//   const handleSearch = () => {
//     // ページを初期化する
//     setPage(1)
//     setDisplayQuests([])

//     // クエストフィルターをクエリストリングに変換する
//     const paramsObj = Object.fromEntries(
//       Object.entries(questFilter)
//         .filter(([_, v]) => v !== undefined && v !== null && v !== '')
//         .map(([k, v]) => [k, String(v)])
//     )
//     const params = new URLSearchParams(paramsObj)

//     // フィルターをURLに反映する
//     router.push(`${Child_QUEST_NEW_URL}?${params.toString()}`)

//     // 検索フィルターを更新し、一覧を更新する
//     setSearchFilter(questFilter)
//   }

//   // データ取得時のハンドル
//   useEffect(() => {
//     if (page === 1) {
//       // 検索切り替え時などはリセット
//       setDisplayQuests(fetchedQuests)
//     } else {
//       setDisplayQuests(prev => [...prev, ...fetchedQuests])
//     }
//   }, [fetchedQuests, page])

//   /** クエスト選択時のハンドル */
//   const handleQuestId = (questId: string) => router.push(Child_QUEST_URL(questId))

//   /** IME入力状態 */
//   const [isComposing, setIsComposing] = useState(false)

//   return (
//       <div className="w-full h-[80vh]">
//       {/* クエスト一覧 */}
//       <Tabs value={tabValue} onChange={setTabValue}>
//         {/* アイコンカテゴリ */}
//         <Tabs.List>
//           <div className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2">
//           <Tabs.Tab
//             key={0}
//             value={"すべて"}
//           >
//             すべて
//           </Tabs.Tab>
//           {questCategories.map((category) => {
//             return (
//                 <Tabs.Tab
//                   key={category.id}
//                   value={category.name}
//                   leftSection={<RenderIcon iconName={category.iconName} size={category.iconSize ?? undefined} iconColor={category.iconColor} />}
//                 >
//                 {category.name}
//                 </Tabs.Tab>
//             )
//           })}
//           <Tabs.Tab
//             key={-1}
//             value={"その他"}
//           >
//             その他
//           </Tabs.Tab>
//         </div>
//         </Tabs.List>
//         <div className="m-3" />

//         {/* 検索バー */}
//         <div className="flex gap-2 items-center">
//           {/* クエスト名で検索 */}
//           <Input
//             leftSection={<IconSearch size={16} />}
//             placeholder="クエスト名で検索"
//             onChange={(event) => {
//               const value = event.currentTarget.value.trim()
//               setQuestFilter((prev) => ({
//                 ...prev,
//                 name: value
//               }))
//             }}
//             onCompositionStart={() => setIsComposing(true)}
//             onCompositionEnd={() => setIsComposing(false)}
//             onKeyDown={(e) => {
//               if (e.key == "Enter" && !isComposing) {
//                 e.preventDefault()
//                 handleSearch()
//               }
//             }}
//             className="w-full" 
//           />
//           {/* フィルター設定ポップアップ起動 */}
//           <ActionIcon variant="default"
//             onClick={() => openFilter()}
//           >
//             <IconFilter style={{ width: '70%', height: '70%' }} stroke={1.5} />
//           </ActionIcon>
//           {/* ソート設定ポップアップ起動 */}
//           <ActionIcon variant="default"
//             onClick={() => openSort()}
//           >
//             <IconArrowsSort style={{ width: '70%', height: '70%' }} stroke={1.5} />
//           </ActionIcon>
//         </div>
//         <div className="m-3" />
//         {/* 全件表示 */}
//         <Tabs.Panel value={"すべて"} key={0} style={{
//           height: "calc(100vh - 200px",
//           overflowY: "auto",
//           paddingRight: "4px"
//         }}>
//         <SimpleGrid
//           cols={isMobile ? 1 : isTablet ? 2 : isDesktop ? 3 : 4}
//           spacing="md"
//         >
//             {displayQuests.map((quest, index) => (
//               <ChildQuestCardLayout key={index} ChildQuest={quest} onClick={handleQuestId} />
//             ))}
//           </SimpleGrid>
//           <div ref={sentinelRef} style={{ height: 1 }} />
//         </Tabs.Panel>

//         {/* カテゴリごとのクエスト一覧 */}
//         {questCategories.map((category) => 
//           <Tabs.Panel value={category.name} key={category.id}>
//           <SimpleGrid
//             cols={isMobile ? 1 : isTablet ? 2 : isDesktop ? 3 : 4}
//             spacing="md"
//           >
//               {displayQuests.filter((ChildQuest) => ChildQuest.quest.categoryId === category.id).map((quest, index) => (
//                 <ChildQuestCardLayout key={index} ChildQuest={quest} onClick={handleQuestId} />
//               ))}
//             </SimpleGrid>
//           </Tabs.Panel>
//         )}

//         {/* その他表示 */}
//         <Tabs.Panel value={"その他"} key={-1} >
//         <SimpleGrid
//           cols={isMobile ? 1 : isTablet ? 2 : isDesktop ? 3 : 4}
//           spacing="md"
//           >
//             {displayQuests.filter((ChildQuest) => ChildQuest.quest.categoryId == undefined).map((quest, index) => (
//               <ChildQuestCardLayout key={index} ChildQuest={quest} onClick={handleQuestId} />
//             ))}
//           </SimpleGrid>
//         </Tabs.Panel>
//         <div className="m-5" />
//       </Tabs>

//       {/* フィルターポップアップ */}
//       <ChildQuestFilterPopup 
//         close={closeFilter}
//         handleSearch={(filter) => {
//           setQuestFilter(filter)
//           handleSearch()
//         }}
//         currentFilter={questFilter}
//         opened={filterOpened}
//       />
//       {/* ソートポップアップ */}
//       <ChildQuestSortPopup 
//         close={closeSort}
//         handleSearch={(sort) => {
//           setSort(sort)
//           handleSearch()
//         }}
//         opened={sortOpened}
//         currentSort={sort}
//       />
//     </div>
//   )
// }
