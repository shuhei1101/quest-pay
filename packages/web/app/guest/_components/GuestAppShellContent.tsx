"use client"

import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useWindow } from '../../(core)/useConstants'
import { BackgroundWrapper } from '../../(core)/_components/layout/BackgroundWrapper'
import { GuestAppHeader } from './GuestAppHeader'
import { GuestSideMenu } from './GuestSideMenu'
import { GuestBottomBar } from './GuestBottomBar'

/** ゲスト用AppShellコンテンツを取得する */
export const GuestAppShellContent = ({children}: {children: React.ReactNode}) => {
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
        padding="md"
        styles={{
          main: {
            height: isMobile 
              ? "calc(100dvh - var(--app-shell-header-offset, 60px) - 60px)"
              : "calc(100dvh - var(--app-shell-header-offset, 60px))",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            paddingBottom: isMobile ? "60px" : undefined,
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
          <GuestAppHeader isMobile={isMobile} onToggleMenu={toggle} />
        </AppShell.Header>

        {/* サイドメニュー */}
        <AppShell.Navbar>
          <GuestSideMenu isMobile={isMobile} isDark={isDark} opened={opened} onClose={close} />
        </AppShell.Navbar>

        {/* メインコンテンツ */}
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>

      {/* モバイル用ボトムバー */}
      {isMobile && <GuestBottomBar />}
    </BackgroundWrapper>
  )
}
