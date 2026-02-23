"use client"

import { useState, Suspense, useEffect } from "react"
import { Tabs, Paper, Text, Button, Loader, Center } from "@mantine/core"
import { IconClipboard, IconClipboardOff, IconHome2, IconWorld, IconPlus } from "@tabler/icons-react"
import { useRouter, useSearchParams } from "next/navigation"
import { LOGIN_URL, FAMILY_QUEST_NEW_URL } from "@/app/(core)/endpoints"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { FloatingActionButton } from "@/app/(core)/_components/FloatingActionButton"
import { FamilyQuestList } from "./_components/FamilyQuestList"
import { PublicQuestList } from "../public/PublicQuestList"
import { TemplateQuestList } from "../template/_components/TemplateQuestList"
import { useTabAutoScroll, useTabHorizontalScroll } from "@/app/(core)/_hooks/useTabScrollControl"

/** 有効なタブ値の一覧 */
const VALID_TABS = ['public', 'family', 'penalty', 'template'] as const

/** タブ値が有効かチェックする */
const isValidTab = (tab: string | null): tab is typeof VALID_TABS[number] => {
  return tab !== null && (VALID_TABS as readonly string[]).includes(tab)
}

export function FamilyQuestsScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()

  /** ログインユーザ情報 */
  const { isGuest } = useLoginUserInfo()

  /** クエリパラメータからタブ値を取得する */
  const getTabFromParams = () => {
    const tabParam = searchParams.get('tab')
    return isValidTab(tabParam) ? tabParam : 'public'
  }

  const [tabValue, setTabValue] = useState<string | null>(getTabFromParams())

  /** タブの自動スクロール制御 */
  const { tabListRef } = useTabAutoScroll(tabValue)

  /** タブの横スクロール制御 */
  useTabHorizontalScroll(tabListRef)

  /** クエリパラメータが変更された時にタブを更新する */
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    const newTab = isValidTab(tabParam) ? tabParam : 'public'
    setTabValue(newTab)
  }, [searchParams])
  
  return (
    <>
      <Tabs variant="pills" value={tabValue} onChange={setTabValue} style={{ display: 'flex', flexDirection: 'column', paddingBottom: '100px' }} color={
        tabValue == 'public' ? "rgb(96 165 250)" :
        tabValue == 'family' ? "rgb(74, 222, 128)" :
        tabValue == 'penalty' ? "rgb(252, 132, 132)" :
        tabValue == 'template' ? "rgb(250 204 21)" : "blue"
      }  >
        <div className="flex flex-col gap-4">
          {/* タブリスト */}
          <Paper p="xs" withBorder >
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

          {/* タブパネル */}
          <Paper p="xs" withBorder>

            <Tabs.Panel value="public">
              <Suspense fallback={
                <Center className="my-8">
                  <Loader size="lg" />
                </Center>
              }>
                <PublicQuestList />
              </Suspense>
            </Tabs.Panel>
            <Tabs.Panel value="family">
              <Suspense fallback={
                <Center className="my-8">
                  <Loader size="lg" />
                </Center>
              }>
                <FamilyQuestList />
              </Suspense>
            </Tabs.Panel>
            <Tabs.Panel value="penalty">
              違反リスト
            </Tabs.Panel>
            <Tabs.Panel value="template">
              <Suspense fallback={
                <Center className="my-8">
                  <Loader size="lg" />
                </Center>
              }>
                <TemplateQuestList />
              </Suspense>
            </Tabs.Panel>
        </Paper>
      </div>
      </Tabs>

      {/* 新規作成FAB */}
      <FloatingActionButton
        items={[
          {
            icon: <IconPlus size={20} />,
            onClick: () => router.push(FAMILY_QUEST_NEW_URL),
          },
        ]}
        position="bottom-right"
        pattern="radial-up"
        mainIcon={<IconPlus size={20} />}
      />
    </>
  )
}
