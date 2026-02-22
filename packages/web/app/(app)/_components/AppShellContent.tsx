"use client"

import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Suspense } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { IconHome2, IconClipboard, IconUsers, IconEdit } from '@tabler/icons-react'
import { useWindow } from '../../(core)/useConstants'
import { BackgroundWrapper } from './BackgroundWrapper'
import { SideMenu } from './SideMenu'
import { AccessErrorHandler } from '../../(core)/_components/AccessErrorHandler'
import { FloatingActionButton, FloatingActionItem } from '../../(core)/_components/FloatingActionButton'
import { FABProvider, useFABContext } from '../../(core)/_components/FABContext'
import { HOME_URL, QUESTS_URL, FAMILY_MEMBERS_URL, FAMILY_QUEST_NEW_URL } from '../../(core)/endpoints'
import { useLoginUserInfo } from '../../(auth)/login/_hooks/useLoginUserInfo'

/** AppShellコンテンツを取得する */
export const AppShellContent = ({children}: {children: React.ReactNode}) => {
  return (
    <FABProvider>
      <AppShellContentInner>{children}</AppShellContentInner>
    </FABProvider>
  )
}

/** AppShellコンテンツの内部実装 */
const AppShellContentInner = ({children}: {children: React.ReactNode}) => {
  /** メニューの表示状態 */
  const [opened, { toggle, close }] = useDisclosure()
  /** ブレークポイント */
  const { isMobile, isDark } = useWindow()
  /** ルーター */
  const router = useRouter()
  /** 現在のパス */
  const pathname = usePathname()
  /** ログインユーザ情報 */
  const { isParent } = useLoginUserInfo()
  /** FABの開閉状態管理 */
  const { openFab, closeFab, isOpen } = useFABContext()

  /** ナビゲーションアイテム */
  const navigationItems: FloatingActionItem[] = [
    {
      icon: <IconHome2 size={20} />,
      label: "ホーム",
      onClick: () => router.push(HOME_URL),
    },
    {
      icon: <IconClipboard size={20} />,
      label: "クエスト",
      onClick: () => router.push(QUESTS_URL),
    },
    ...(isParent ? [{
      icon: <IconUsers size={20} />,
      label: "メンバー",
      onClick: () => router.push(FAMILY_MEMBERS_URL),
    }] : []),
  ]

  /** 現在のパスに基づいてナビゲーションの選択インデックスを決定する */
  const getActiveNavigationIndex = () => {
    if (isParent && pathname.startsWith(FAMILY_MEMBERS_URL)) return 2
    if (pathname.startsWith(QUESTS_URL)) return 1
    return 0
  }

  return (
    <BackgroundWrapper>
      {/* アクセスエラーハンドラー（useSearchParamsを使用するためSuspenseでラップ） */}
      <Suspense fallback={null}>
        <AccessErrorHandler />
      </Suspense>
      <AppShell
        navbar={{
          width: opened ? 200 : 60,
          breakpoint: 601,
          collapsed: { 
            mobile: true,
            desktop: false,
          },
        }}
        padding="md"
      >
        {/* サイドメニュー */}
        <AppShell.Navbar>
          <SideMenu isMobile={isMobile} isDark={isDark} opened={opened} onClose={close} onToggle={toggle} />
        </AppShell.Navbar>

        {/* メインコンテンツ */}
        <AppShell.Main style={{
          overflow: 'auto',
        }}>
          {children}
        </AppShell.Main>
      </AppShell>

      {/* GitHub mobile風のナビゲーションFAB（モバイル時のみ表示） */}
      {isMobile && (
        <FloatingActionButton
          items={navigationItems}
          position="bottom-left"
          activeIndex={getActiveNavigationIndex()}
          open={isOpen("navigation-fab")}
          onToggle={(open) => open ? openFab("navigation-fab") : closeFab("navigation-fab")}
          defaultOpen={false}
        />
      )}
    </BackgroundWrapper>
  )
}
