"use client"

import { AppShell, Indicator } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { IconHome2, IconClipboard, IconUsers, IconBell } from '@tabler/icons-react'
import { useWindow } from '../../(core)/useConstants'
import { BackgroundWrapper } from './BackgroundWrapper'
import { SideMenu } from './SideMenu'
import { AccessErrorHandler } from '../../(core)/_components/AccessErrorHandler'
import { FloatingActionItem } from '../../(core)/_components/FloatingActionButton'
import { NavigationFAB } from '../../(core)/_components/NavigationFAB'
import { FABProvider, useFABContext } from '../../(core)/_components/FABContext'
import { LoadingProvider } from '../../(core)/_components/LoadingContext'
import { LoadingIndicator } from '../../(core)/_components/LoadingIndicator'
import { HOME_URL, QUESTS_URL, FAMILY_MEMBERS_URL, FAMILY_QUEST_NEW_URL, FAMILY_QUESTS_URL } from '../../(core)/endpoints'
import { useLoginUserInfo } from '../../(auth)/login/_hooks/useLoginUserInfo'
import { NotificationModal } from '../notifications/_components/NotificationModal'
import { useNotifications } from '../notifications/_hooks/useNotifications'

/** AppShellコンテンツを取得する */
export const AppShellContent = ({children}: {children: React.ReactNode}) => {
  return (
    <FABProvider>
      <LoadingProvider>
        <AppShellContentInner>{children}</AppShellContentInner>
      </LoadingProvider>
    </FABProvider>
  )
}

/** AppShellコンテンツの内部実装 */
const AppShellContentInner = ({children}: {children: React.ReactNode}) => {
  /** メニューの表示状態 */
  const [opened, { toggle, close }] = useDisclosure()
  /** 通知モーダルの開閉状態 */
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  /** ブレークポイント */
  const { isMobile, isDark } = useWindow()
  /** ルーター */
  const router = useRouter()
  /** 現在のパス */
  const pathname = usePathname()
  /** ログインユーザ情報 */
  const { isParent, isGuest } = useLoginUserInfo()
  /** FABの開閉状態管理 */
  const { openFab, closeFab, isOpen } = useFABContext()
  /** 通知データ */
  const { notifications } = useNotifications()
  
  /** 前回のスクロール位置を保存 */
  const lastScrollY = useRef(0)

  /** 未読数を計算する */
  const unreadCount = notifications.filter(n => !n.isRead).length

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
      onClick: () => router.push(FAMILY_QUESTS_URL),
    },
    ...(isParent ? [{
      icon: <IconUsers size={20} />,
      label: "メンバー",
      onClick: () => router.push(FAMILY_MEMBERS_URL),
    }] : []),
    ...(!isGuest ? [{
      icon: (
        <Indicator label={unreadCount > 0 ? unreadCount : null} size={16} color="red" disabled={unreadCount === 0}>
          <IconBell size={20} />
        </Indicator>
      ),
      label: "通知",
      onClick: () => setIsNotificationOpen(true),
    }] : []),
  ]

  /** 現在のパスに基づいてナビゲーションの選択インデックスを決定する */
  const getActiveNavigationIndex = () => {
    if (isParent && pathname.startsWith(FAMILY_MEMBERS_URL)) return 2
    if (pathname.startsWith(QUESTS_URL)) return 1
    return 0
  }

  /** NavigationFABのトグル処理（SubMenuFABを閉じる機能を追加） */
  const handleNavigationToggle = (open: boolean) => {
    if (open) {
      // NavigationFABを開く時はSubMenuFABを閉じる
      closeFab("submenu-fab")
      openFab("navigation-fab")
    } else {
      closeFab("navigation-fab")
    }
  }

  /** 画面遷移時にNavigationFABを開き、SubMenuFABを閉じる */
  useEffect(() => {
    if (isMobile) {
      openFab("navigation-fab")
      closeFab("submenu-fab")
    }
  }, [pathname, isMobile, openFab, closeFab])

  /** スクロール検知でFABを自動開閉 */
  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 一番上までスクロールされたらNavigationFABを展開
      if (currentScrollY === 0) {
        openFab("navigation-fab")
      } 
      // 下スクロールしたら両方のFABを閉じる
      else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        closeFab("navigation-fab")
        closeFab("submenu-fab")
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, openFab, closeFab])

  return (
    <BackgroundWrapper>
      {/* ローディングインジケーター（画面左上に表示） */}
      <LoadingIndicator />
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
          paddingBottom: '100px', // FAB用の下部余白
        }}>
          {children}
        </AppShell.Main>
      </AppShell>

      {/* GitHub mobile風のナビゲーションFAB（モバイル時のみ表示） */}
      {isMobile && (
        <NavigationFAB
          items={navigationItems}
          activeIndex={getActiveNavigationIndex()}
          open={isOpen("navigation-fab")}
          onToggle={handleNavigationToggle}
          defaultOpen={false}
        />
      )}

      {/* 通知モーダル */}
      {!isGuest && (
        <NotificationModal 
          isOpen={isNotificationOpen} 
          onClose={() => setIsNotificationOpen(false)} 
        />
      )}
    </BackgroundWrapper>
  )
}
