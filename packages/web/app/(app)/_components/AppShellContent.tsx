"use client"

import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useWindow } from '../../(core)/useConstants'
import { BackgroundWrapper } from './BackgroundWrapper'
import { AppHeader } from './AppHeader'
import { SideMenu } from './SideMenu'
import { BottomBar } from './BottomBar'

/** AppShellコンテンツを取得する */
export const AppShellContent = ({children}: {children: React.ReactNode}) => {
  /** メニューの表示状態 */
  const [opened, { toggle, close }] = useDisclosure()
  /** ブレークポイント */
  const { isMobile, isDark } = useWindow()

  return (
    <BackgroundWrapper>
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
        footer={isMobile ? { height: 60 } : undefined}
        padding="md"
        styles={{
          main: {
            height: isMobile 
              ? "calc(100dvh - var(--app-shell-header-offset, 60px) - var(--app-shell-footer-offset, 60px))"
              : "calc(100dvh - var(--app-shell-header-offset, 60px))",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
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
          <SideMenu isMobile={isMobile} isDark={isDark} opened={opened} onClose={close} />
        </AppShell.Navbar>

        {/* メインコンテンツ */}
        <AppShell.Main>{children}</AppShell.Main>

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
