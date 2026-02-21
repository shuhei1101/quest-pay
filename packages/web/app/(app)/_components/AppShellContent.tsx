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
import { NavigationFAB, NavigationItem } from '../../(core)/_components/NavigationFAB'
import { HOME_URL, QUESTS_URL, FAMILY_MEMBERS_URL, FAMILY_QUEST_NEW_URL } from '../../(core)/endpoints'
import { useLoginUserInfo } from '../../(auth)/login/_hooks/useLoginUserInfo'

/** AppShellコンテンツを取得する */
export const AppShellContent = ({children}: {children: React.ReactNode}) => {
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

  /** コンテンツ領域の高さ（パディング2rem） */
  const contentHeight = 'calc(100dvh - 2rem)'

  /** ナビゲーションアイテム */
  const navigationItems: NavigationItem[] = [
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
    {
      icon: <IconEdit size={20} />,
      label: "新規作成",
      onClick: () => router.push(FAMILY_QUEST_NEW_URL),
    },
  ]

  /** 現在のパスに基づいてナビゲーションの選択インデックスを決定する */
  const getActiveNavigationIndex = () => {
    if (pathname.startsWith(FAMILY_QUEST_NEW_URL)) return isParent ? 3 : 2
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
        __vars={{
          '--content-height': contentHeight,
        }}
      >
        {/* サイドメニュー */}
        <AppShell.Navbar>
          <SideMenu isMobile={isMobile} isDark={isDark} opened={opened} onClose={close} onToggle={toggle} />
        </AppShell.Navbar>

        {/* メインコンテンツ */}
        <AppShell.Main>
          {children}
        </AppShell.Main>
      </AppShell>

      {/* GitHub mobile風のナビゲーションFAB */}
      <NavigationFAB
        items={navigationItems}
        activeIndex={getActiveNavigationIndex()}
        mainButtonColor="blue"
        subButtonColor="blue"
      />
    </BackgroundWrapper>
  )
}
