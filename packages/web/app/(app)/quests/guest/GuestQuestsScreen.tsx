"use client"

import { useState, Suspense, useEffect } from "react"
import { Tabs, Paper, Text, Button } from "@mantine/core"
import { IconAdjustments, IconClipboard, IconClipboardOff, IconEdit, IconHome2, IconLogout, IconTrash, IconWorld } from "@tabler/icons-react"
import { useRouter, useSearchParams } from "next/navigation"
import { FAMILY_QUEST_NEW_URL, LOGIN_URL } from "@/app/(core)/endpoints"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { PublicQuestList } from "../public/PublicQuestList"

/** 有効なタブ値の一覧 */
const VALID_TABS = ['public', 'family', 'penalty', 'template'] as const

export function GuestQuestsScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()

  /** ログインユーザ情報 */
  const { isGuest } = useLoginUserInfo()

  /** クエリパラメータからタブ値を取得する */
  const getTabFromParams = () => {
    const tabParam = searchParams.get('tab')
    return tabParam && VALID_TABS.includes(tabParam as any) ? tabParam : 'public'
  }

  const [tabValue, setTabValue] = useState<string | null>(getTabFromParams())

  /** クエリパラメータが変更された時にタブを更新する */
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    const newTab = tabParam && VALID_TABS.includes(tabParam as any) ? tabParam : 'public'
    setTabValue(newTab)
  }, [searchParams])

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
    <Tabs variant="pills" value={tabValue} onChange={setTabValue} color={
      tabValue == 'public' ? "rgb(96 165 250)" :
      tabValue == 'family' ? "rgb(74, 222, 128)" :
      tabValue == 'penalty' ? "rgb(252, 132, 132" :
      tabValue == 'template' ? "rgb(250 204 21)" : "blue"
    }  >
      <div className="flex flex-col gap-4">
      <Paper p="xs" withBorder>
        <Tabs.List>
          <div className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2">
            <Tabs.Tab value="public" leftSection={<IconWorld color={tabValue == 'public' ? "white" : "rgb(96 165 250)"} size={18} />}>
              公開
            </Tabs.Tab>
            <Tabs.Tab value="family" leftSection={<IconHome2 color={tabValue == 'family' ? "white" : "rgb(74, 222, 128)"} size={18} />}>
              家族
            </Tabs.Tab>
            <Tabs.Tab value="penalty" leftSection={<IconClipboardOff color={tabValue == 'penalty' ? "white" : "rgb(252, 132, 132)"} size={18} />}>
              違反リスト
            </Tabs.Tab>
            <Tabs.Tab value="template" leftSection={<IconClipboard color={tabValue == 'template' ? "white" : "rgb(250 204 21)"} size={18} />}>
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
        <GuestScreen/>
      </Tabs.Panel>
      <Tabs.Panel value="penalty">
        <GuestScreen/>
      </Tabs.Panel>
      <Tabs.Panel value="template">
        <GuestScreen/>
      </Tabs.Panel>
    </Paper>
    </div>
    </Tabs>
    </>
  )
}
