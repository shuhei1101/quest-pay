"use client"

import { useState, Suspense, useRef, useEffect } from "react"
import { Tabs, Paper, Text, Button } from "@mantine/core"
import { IconAdjustments, IconClipboard, IconClipboardOff, IconEdit, IconHome2, IconLogout, IconTrash, IconWorld } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useSwipeable } from "react-swipeable"
import { FAMILY_QUEST_NEW_URL, LOGIN_URL } from "@/app/(core)/endpoints"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { FamilyQuestList } from "./_components/FamilyQuestList"
import { FloatingActionButton, FloatingActionItem } from "@/app/(core)/_components/FloatingActionButton"
import { PublicQuestList } from "../public/PublicQuestList"
import { TemplateQuestList } from "../template/_components/TemplateQuestList"

export function FamilyQuestsScreen() {
  const router = useRouter()

  /** ログインユーザ情報 */
  const { isGuest } = useLoginUserInfo()

  const [tabValue, setTabValue] = useState<string | null>('public')

  /** フローティングアクションボタンの開閉状態 */
  const [open, setOpen] = useState(false)

  /** タブリストコンテナの参照 */
  const tabListRef = useRef<HTMLDivElement>(null)

  /** タブリスト */
  const tabList = ['public', 'family', 'penalty', 'template']

  /** タブ変更時に選択されたタブを画面内にスクロールする */
  useEffect(() => {
    if (!tabListRef.current || !tabValue) return

    const container = tabListRef.current
    const selectedTabElement = container.querySelector(`[data-value="${tabValue}"]`) as HTMLElement

    if (selectedTabElement) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = selectedTabElement.getBoundingClientRect()

      // タブが画面外にある場合、スクロールして表示する
      if (tabRect.left < containerRect.left) {
        // タブが左側に隠れている場合
        container.scrollLeft += tabRect.left - containerRect.left - 16 // 16pxの余白を追加
      } else if (tabRect.right > containerRect.right) {
        // タブが右側に隠れている場合
        container.scrollLeft += tabRect.right - containerRect.right + 16 // 16pxの余白を追加
      }
    }
  }, [tabValue])

  /** 左右スワイプ時のハンドル */
  const handlers = useSwipeable({
    onSwiped: (event) => {
      const idx = tabList.indexOf(tabValue ?? 'public')

      if (event.dir === "Left") {
        // 次のタブへ
        const next = tabList[idx + 1]
        if (next) setTabValue(next)
      }

      if (event.dir === "Right") {
        // 前のタブへ
        const prev = tabList[idx - 1]
        if (prev) setTabValue(prev)
      }
    },
    trackMouse: true
  })
  
  const actionItems: FloatingActionItem[] = [
    { 
      icon: <IconAdjustments />, // 左
      x: -75, y: 10,
      onClick: () => router.push(FAMILY_QUEST_NEW_URL)
    },
    { 
      icon: <IconTrash />, // 左上
      x: -55, y: -55,
      onClick: () => router.push(FAMILY_QUEST_NEW_URL)
    },
    { 
      icon: <IconEdit />, // 上
      x: 10, y: -75,
      onClick: () => router.push(FAMILY_QUEST_NEW_URL)
    },
  ]

    const GuestScreen = () => (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center">
      <Text className="text-lg mb-4">ログインが必要です。</Text>
      <Button
        onClick={() => router.push(`${LOGIN_URL}`)}
      >
        <>
          <Text>ログイン</Text>
          <IconLogout style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </>
      </Button>
    </div>
  )

  return (
      <>
    <div {...handlers}>
    <Tabs variant="pills" value={tabValue} onChange={setTabValue} color={
      tabValue == 'public' ? "rgb(96 165 250)" :
      tabValue == 'family' ? "rgb(74, 222, 128)" :
      tabValue == 'penalty' ? "rgb(252, 132, 132" :
      tabValue == 'template' ? "rgb(250 204 21)" : "blue"
    }  >
      <div className="flex flex-col gap-4">
      <Paper p="xs" withBorder>
        <Tabs.List>
          <div ref={tabListRef} className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2">
            <Tabs.Tab value="public" data-value="public" leftSection={<IconWorld color={tabValue == 'public' ? "white" : "rgb(96 165 250)"} size={18} />}>
              公開
            </Tabs.Tab>
            <Tabs.Tab value="family" data-value="family" leftSection={<IconHome2 color={tabValue == 'family' ? "white" : "rgb(74, 222, 128)"} size={18} />}>
              家族
            </Tabs.Tab>
            <Tabs.Tab value="penalty" data-value="penalty" leftSection={<IconClipboardOff color={tabValue == 'penalty' ? "white" : "rgb(252, 132, 132)"} size={18} />}>
              違反リスト
            </Tabs.Tab>
            <Tabs.Tab value="template" data-value="template" leftSection={<IconClipboard color={tabValue == 'template' ? "white" : "rgb(250 204 21)"} size={18} />}>
              テンプレート
            </Tabs.Tab>
          </div>
          </Tabs.List>
      </Paper>

      <Paper p="xs" withBorder>

      <Tabs.Panel value="public">
        <PublicQuestList />
      </Tabs.Panel>
      <Tabs.Panel value="family">
        <FamilyQuestList />
      </Tabs.Panel>
      <Tabs.Panel value="penalty">
        違反リスト
      </Tabs.Panel>
      <Tabs.Panel value="template">
        <TemplateQuestList />
      </Tabs.Panel>
    </Paper>
    </div>
    </Tabs>
    </div>
    
    <FloatingActionButton
      items={actionItems}
      open={open}
      onToggle={setOpen}
      mainButtonColor="pink"
      subButtonColor="pink"
    />
    </>
  )
}
