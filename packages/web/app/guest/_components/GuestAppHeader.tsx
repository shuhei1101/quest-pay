"use client"

import { HOME_URL, LOGIN_URL } from '@/app/(core)/endpoints'
import { ActionIcon, Title, Text, Button, LoadingOverlay } from '@mantine/core'
import { IconHome2, IconMenu2, IconLogin } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useWindow } from '@/app/(core)/useConstants'
import { ThemeToggleButton } from '@/app/(app)/_components/ThemeToggleButton'

/** ゲスト用アプリヘッダーを取得する */
export const GuestAppHeader = ({isMobile, onToggleMenu}: {isMobile: boolean, onToggleMenu: () => void}) => {
  const router = useRouter()
  const {isDark} = useWindow()

  /** ハンバーガーメニューボタン */
  const MenuButton = () => (
    <ActionIcon onClick={onToggleMenu} variant="subtle" size="xl" >
      <IconMenu2 style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
  )

  return (
    <>
      {/* ハンバーガーメニュー切り替えボタン */}
      {!isMobile && <MenuButton/>}
      {/* ホームボタン */}
      <ActionIcon onClick={()=>{
        router.push(`${HOME_URL}`)
      }} variant="subtle" size="xl" >
        <IconHome2 style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
      {/* タイトル */}
      <Title 
       textWrap='nowrap' order={5} 
        c={`${isDark ? 'white' : 'black'}`}
      >お小遣いクエストボード</Title>
      {/* スペース */}
      <div className='w-full' />
      {/* ゲストユーザ表示 */}
      <Text 
        className={`text-nowrap text-sm`}
        c={`${isDark ? 'white' : 'black'}`}
      >
        ゲスト
      </Text>
      {/* テーマ切り替えボタン */}
      <ThemeToggleButton />
      {/* ログインボタン */}
      {isMobile ? (
        <ActionIcon
          onClick={() => router.push(LOGIN_URL)}
          variant="gradient"
          size="lg"
          aria-label="ログイン"
        >
          <IconLogin style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      ) : (
        <Button variant='gradient' className='shrink-0' onClick={() => router.push(LOGIN_URL)}>ログイン</Button>
      )}
      {/* ハンバーガーメニュー切り替えボタン */}
      {isMobile && <MenuButton/>}
    </>
  )
}
