"use client"

import { useLoginUserInfo } from '@/app/(auth)/login/_hook/useLoginUserInfo'
import { HOME_URL, LOGIN_URL } from '@/app/(core)/endpoints'
import { ActionIcon, Title, Text, Button, LoadingOverlay } from '@mantine/core'
import { IconHome2, IconMenu2 } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { appStorage } from '../../(core)/_sessionStorage/appStorage'
import { createClient } from '../../(core)/_supabase/client'

/** アプリヘッダーを取得する */
export const AppHeader = ({isMobile, onToggleMenu}: {isMobile: boolean, onToggleMenu: () => void}) => {
  const router = useRouter()
  /** ログインユーザ情報 */
  const { userInfo, isLoading, isGuest } = useLoginUserInfo()

  /** ログアウトボタン押下時のハンドル */
  const handleLogout = async () => {
    // ログアウトする
    await createClient().auth.signOut()
    // 次画面で表示するメッセージを登録する
    appStorage.feedbackMessage.set({ message: "サインアウトしました", type: "success" })
    // ログイン画面に遷移する
    router.push(`${LOGIN_URL}`)
  }

  /** ハンバーガーメニューボタン */
  const MenuButton = () => (
    <ActionIcon onClick={onToggleMenu} variant="subtle" size="xl" >
      <IconMenu2 style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
  )

  return (
    <>
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 0 }} loaderProps={{ children: ' ' }} />
      {/* ハンバーガーメニュー切り替えボタン */}
      {!isMobile && <MenuButton/>}
      {/* ホームボタン */}
      <ActionIcon onClick={()=>{
        router.push(`${HOME_URL}`)
      }} variant="subtle" size="xl" >
        <IconHome2 style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
      {/* タイトル */}
      <Title textWrap='nowrap' order={5} c="var(--mantine-color-text)" >お小遣いクエストボード</Title>
      {/* スペース */}
      <div className='w-full' />
      {/* ユーザ情報を表示する */}
      <Text c="var(--mantine-color-text)" className='text-nowrap text-sm'>{userInfo?.profile_name}</Text>
      {/* サインアウトボタン */}
      {isGuest ? 
        <Button variant='gradient' className='shrink-0' onClick={() => router.push(LOGIN_URL)}>ログイン</Button>
        :
        <Button variant='gradient' className='shrink-0' onClick={handleLogout}>ログアウト</Button>
      }
      {/* ハンバーガーメニュー切り替えボタン */}
      {isMobile && <MenuButton/>}
    </>
  )
}
