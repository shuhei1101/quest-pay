"use client"

import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Suspense } from 'react'
import { useWindow } from '../../(core)/useConstants'
import { BackgroundWrapper } from './BackgroundWrapper'
import { SideMenu } from './SideMenu'
import { AccessErrorHandler } from '../../(core)/_components/AccessErrorHandler'

/** AppShellコンテンツを取得する */
export const AppShellContent = ({children}: {children: React.ReactNode}) => {
  /** メニューの表示状態 */
  const [opened, { toggle, close }] = useDisclosure()
  /** ブレークポイント */
  const { isMobile, isDark } = useWindow()

  /** コンテンツ領域の高さ（パディング2rem） */
  const contentHeight = 'calc(100dvh - 2rem)'

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
    </BackgroundWrapper>
  )
}
