"use client"
import { SimpleGrid, Tabs } from "@mantine/core"
import { useWindow } from "@/app/(core)/useConstants"
import { ReactNode, useRef, useEffect } from "react"
import { QuestSelect } from "@/drizzle/schema"
import { QuestCategoryById } from "@/app/api/quests/category/service"
import { useSwipeable } from "react-swipeable"
import { TAB_ALL, TAB_OTHERS } from "./questTabConstants"

type QuestItem = {
  quest: QuestSelect
}

type QuestGridProps<T extends QuestItem> = {
  /** 表示するクエスト一覧 */
  quests: T[]
  /** クエストをレンダリングする関数 */
  renderQuest: (quest: T, index: number) => ReactNode
  /** 無限スクロール用のsentinelRef */
  sentinelRef?: (node?: Element | null) => void
  /** スクロール最下部検知時のコールバック */
  onScrollBottom?: () => void
  /** パネルの高さ */
  panelHeight?: string
  /** 現在のタブ値（フィルタリング用） */
  tabValue?: string | null
  /** クエストカテゴリ辞書 */
  questCategoryById?: QuestCategoryById
  /** タブ変更時のハンドル（スワイプ用） */
  onTabChange?: (value: string | null) => void
  /** 全タブリスト（スワイプ用） */
  tabList?: string[]
  /** スワイプ操作を有効にするか */
  enableSwipe?: boolean
}

/** クエストグリッドコンポーネント */
export const QuestGrid = <T extends QuestItem>({
  quests,
  renderQuest,
  sentinelRef,
  onScrollBottom,
  panelHeight = "calc(100vh - 200px)",
  tabValue,
  questCategoryById,
  onTabChange,
  tabList,
  enableSwipe = true
}: QuestGridProps<T>) => {
  /** 画面定数 */
  const { isMobile, isTablet, isDesktop } = useWindow()
  
  /** スクロールコンテナのref */
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  /** グリッドのカラム数を取得する */
  const getGridCols = () => {
    if (isMobile) return 1
    if (isTablet) return 2
    if (isDesktop) return 3
    return 4
  }

  /** スクロールイベントを監視する */
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || !onScrollBottom) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      // 下端から100px以内に到達したらコールバックを実行する
      if (scrollHeight - scrollTop - clientHeight < 100) {
        onScrollBottom()
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [onScrollBottom])

  /** コンテンツの高さを監視し、スクロールバーが表示されない場合は自動的に次のページを取得する */
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || !onScrollBottom) return

    // コンテンツの高さがコンテナの高さより小さい場合、次のページを取得する
    const checkContentHeight = () => {
      const { scrollHeight, clientHeight } = container
      if (scrollHeight <= clientHeight) {
        // スクロールバーが表示されていない（コンテンツが少ない）
        onScrollBottom()
      }
    }

    // 少し遅延させてから実行（レンダリング完了後）
    const timeoutId = setTimeout(checkContentHeight, 100)
    return () => clearTimeout(timeoutId)
  }, [quests.length, onScrollBottom])

  /** 左右スワイプ時のハンドル */
  const handlers = useSwipeable({
    onSwiped: (event) => {
      if (!enableSwipe || !onTabChange || !tabList || !tabValue) return
      
      const idx = tabList.indexOf(tabValue)
      
      // インデックスが見つからない場合は何もしない
      if (idx === -1) return

      if (event.dir === "Left") {
        // 次のタブへ
        const next = tabList[idx + 1]
        if (next) onTabChange(next)
      } else if (event.dir === "Right") {
        // 前のタブへ
        const prev = tabList[idx - 1]
        if (prev) onTabChange(prev)
      }
    },
    trackMouse: true
  })

  return (
    <div
      {...handlers}
      ref={(node) => {
        // swipeable handlersのrefとscrollContainerRefの両方をセットする
        if (handlers.ref) {
          if (typeof handlers.ref === 'function') {
            handlers.ref(node)
          } else {
            (handlers.ref as any).current = node
          }
        }
        scrollContainerRef.current = node
      }}
      style={{
        height: panelHeight,
        overflowY: "auto",
        paddingRight: "4px"
      }}
    >
      {/* クエストグリッド */}
      <SimpleGrid cols={getGridCols()} spacing="md">
        {quests.map((quest, index) => renderQuest(quest, index))}
      </SimpleGrid>
      
      {/* 無限スクロール用のセンチネル（カードが見切れないよう余白を確保する） */}
      {sentinelRef && <div ref={sentinelRef} style={{ height: 200 }} />}
    </div>
  )
}
