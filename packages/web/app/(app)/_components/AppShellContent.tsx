"use client"

import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Suspense } from 'react'
import { useWindow } from '../../(core)/useConstants'
import { BackgroundWrapper } from './BackgroundWrapper'
import { AppHeader } from './AppHeader'
import { SideMenu } from './SideMenu'
import { BottomBar } from './BottomBar'
import { AccessErrorHandler } from '../../(core)/_components/AccessErrorHandler'

/** AppShellコンテンツを取得する */
export const AppShellContent = ({children}: {children: React.ReactNode}) => {
  /** メニューの表示状態 */
  const [opened, { toggle, close }] = useDisclosure()
  /** ブレークポイント */
  const { isMobile, isDark } = useWindow()

  /** コンテンツ領域の高さ（ヘッダー60px + パディング2rem + モバイル時フッター70px） */
  const contentHeight = isMobile
    ? 'calc(100dvh - 60px - 2rem - 70px)'
    : 'calc(100dvh - 60px - 2rem)'

  return (
    <BackgroundWrapper>
      {/* アクセスエラーハンドラー（useSearchParamsを使用するためSuspenseでラップ） */}
      <Suspense fallback={null}>
        <AccessErrorHandler />
      </Suspense>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: opened ? 200 : 60,
          breakpoint: 601,
          collapsed: { 
            mobile: true,
            desktop: false,
          },
        }}
        footer={isMobile ? { height: 70, offset: true } : undefined}
        padding="md"
        __vars={{
          '--content-height': contentHeight,
        }}
      >
        {/* ヘッダー */}
        <AppShell.Header style={{
          display: "flex",
          alignItems: "center",
          color: "black",
          paddingLeft: "10px",
          paddingRight: "10px",
          gap: "8px",
        }} >
          <AppHeader isMobile={isMobile} onToggleMenu={toggle} />
        </AppShell.Header>

        {/* サイドメニュー */}
        <AppShell.Navbar>
          <SideMenu isMobile={isMobile} opened={opened} onClose={close} />
        </AppShell.Navbar>

        {/* メインコンテンツ */}
        <AppShell.Main>
          {children}
        </AppShell.Main>

        {/* モバイル用フッター */}
        {isMobile && (
          <AppShell.Footer>
            <BottomBar />
          </AppShell.Footer>
        )}
      </AppShell>
    </BackgroundWrapper>
  )
}
