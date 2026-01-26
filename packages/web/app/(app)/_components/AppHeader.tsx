"use client"

import { useLoginUserInfo } from '@/app/(auth)/login/_hooks/useLoginUserInfo'
import { HOME_URL, LOGIN_URL } from '@/app/(core)/endpoints'
import { ActionIcon, Title, Button, LoadingOverlay, Indicator } from '@mantine/core'
import { IconHome2, IconMenu2, IconBell, IconLogout, IconLogin } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { appStorage } from '../../(core)/_sessionStorage/appStorage'
import { createClient } from '../../(core)/_supabase/client'
import { useState } from 'react'
import { NotificationModal } from '../notifications/_components/NotificationModal'
import { useNotifications } from '../notifications/_hooks/useNotifications'
import { useWindow } from '@/app/(core)/useConstants'
import { ThemeToggleButton } from './ThemeToggleButton'
import { useTheme } from '@/app/(core)/_theme/useTheme'

/** アプリヘッダーを取得する */
export const AppHeader = ({isMobile, onToggleMenu}: {isMobile: boolean, onToggleMenu: () => void}) => {
  const router = useRouter()
  const {isDark} = useWindow()
  /** ログインユーザ情報 */
  const { userInfo, isLoading, isGuest } = useLoginUserInfo()
  /** 通知モーダルの開閉状態 */
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  /** テーマ情報 */
  const { colors } = useTheme()
  
  /** 通知データ */
  const { notifications } = useNotifications()
  
  /** 未読数を計算する */
  const unreadCount = notifications.filter(n => !n.isRead).length

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
      <Title 
       textWrap='nowrap' order={5} 
        c={colors.textColors.primary}
      >クエストペイ</Title>
      {/* スペース */}
      <div className='w-full' />
      {/* テーマ切り替えボタン */}
      <ThemeToggleButton />
      {/* 通知ボタン */}
      {!isGuest && (
        <Indicator label={unreadCount > 0 ? unreadCount : null} size={16} color="red" disabled={unreadCount === 0}>
          <ActionIcon
            onClick={() => setIsNotificationOpen(true)} 
            variant="subtle" 
            size="xl"
          >
            <IconBell style={{ width: '60%', height: '60%' }} stroke={1.5} />
          </ActionIcon>
        </Indicator>
      )}
      {/* サインアウトボタン */}
      {isGuest ? (
        isMobile ? (
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
        )
      ) : (
        isMobile ? (
          <ActionIcon
            onClick={handleLogout}
            variant="gradient"
            size="lg"
            aria-label="ログアウト"
          >
            <IconLogout style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        ) : (
          <Button variant='gradient' className='shrink-0' onClick={handleLogout}>ログアウト</Button>
        )
      )}
      {/* ハンバーガーメニュー切り替えボタン */}
      {isMobile && <MenuButton/>}
      
      {/* 通知モーダル */}
      <NotificationModal 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </>
  )
}
