"use client"

import { HOME_URL, SETTINGS_URL, QUESTS_URL, FAMILY_MEMBERS_URL, PUBLIC_QUESTS_URL, FAMILY_QUESTS_URL, TEMPLATE_QUESTS_URL, PROFILE_URL, LOGIN_URL } from '@/app/(core)/endpoints'
import { NavLink, ScrollArea, Drawer, ActionIcon, Card, Text, Indicator, Divider, LoadingOverlay } from '@mantine/core'
import { IconHome2, IconClipboard, IconUsers, IconSettings, IconWorld, IconClipboardPlus, IconChevronLeft, IconChevronRight, IconBell, IconLogout } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useLoginUserInfo } from '@/app/(auth)/login/_hooks/useLoginUserInfo'
import { menuColors } from '@/app/(core)/_theme/colors'
import { RenderIcon } from '@/app/(app)/icons/_components/RenderIcon'
import Image from 'next/image'
import { ThemeToggleButton } from './ThemeToggleButton'
import { useState } from 'react'
import { NotificationModal } from '../notifications/_components/NotificationModal'
import { useNotifications } from '../notifications/_hooks/useNotifications'
import { appStorage } from '../../(core)/_sessionStorage/appStorage'
import { createClient } from '../../(core)/_supabase/client'

/** サイドメニューを取得する */
export const SideMenu = ({isMobile, isDark, opened, onClose, onToggle}: {isMobile: boolean, isDark: boolean, opened: boolean, onClose: () => void, onToggle: () => void}) => {
  const router = useRouter()
  /** ログインユーザ情報 */
  const { isParent, userInfo, isLoading, isGuest } = useLoginUserInfo()
  /** 通知モーダルの開閉状態 */
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  
  /** 通知データ */
  const { notifications } = useNotifications()
  
  /** 未読数を計算する */
  const unreadCount = notifications.filter(n => !n.isRead).length

  /** ログアウトボタン押下時のハンドル */
  const handleLogout = async () => {
    try {
      // ログアウトする
      await createClient().auth.signOut()
      // 次画面で表示するメッセージを登録する
      appStorage.feedbackMessage.set({ message: "サインアウトしました", type: "success" })
      // ログイン画面に遷移する
      router.push(`${LOGIN_URL}`)
    } catch (error) {
      console.error('ログアウトエラー:', error)
      appStorage.feedbackMessage.set({ message: "ログアウトに失敗しました", type: "error" })
    }
  }

  /** メニューアイテム */
  const menuItems = (
    <>
      {/* プロフィールカード */}
      <Card 
        className='m-3 cursor-pointer hover:shadow-md transition-shadow'
        onClick={() => router.push(PROFILE_URL)}
        padding="md"
        radius="md"
        withBorder
      >
        <div className='flex items-center gap-3'>
          {/* アイコン */}
          <RenderIcon 
            iconName={userInfo?.icons?.name} 
            iconColor={userInfo?.profiles?.iconColor} 
            size={32} 
            stroke={1.5} 
          />
          {/* 名前情報 */}
          <div className='flex flex-col'>
            {/* 家族名 */}
            <Text size="xs" c="dimmed" className='font-medium'>
              {userInfo?.families?.localName}
            </Text>
            {/* 自身の名前 */}
            <Text size="md" className='font-bold'>
              {userInfo?.profiles?.name}
            </Text>
          </div>
        </div>
      </Card>
      {/* ホーム */}
      <NavLink
        className='side-nav'
        href={`${HOME_URL}`}
        label="ホーム"
        leftSection={<IconHome2 color={menuColors.home} size={18} stroke={1.2} />}
      />
      {/* クエスト */}
      <NavLink
        className='side-nav'
        href="#required-for-focus"
        label="クエスト"
        leftSection={<IconClipboard color={menuColors.quest} size={18} stroke={1.2} />}
        childrenOffset={28}
      >
        {/* 公開（親のみ） */}
        {isParent && (
          <NavLink
            className='side-nav'
            href={`${PUBLIC_QUESTS_URL}`}
            label="公開"
            leftSection={<IconWorld color={menuColors.publicQuest} size={18} stroke={1.2} />}
          />
        )}
        {/* 家族（親のみ） */}
        {isParent && (
          <NavLink
            className='side-nav'
            href={`${FAMILY_QUESTS_URL}`}
            label="家族"
            leftSection={<IconHome2 color={menuColors.familyQuest} size={18} stroke={1.2} />}
          />
        )}
        {/* お気に入り（親のみ） */}
        {isParent && (
          <NavLink
            className='side-nav'
            href={`${TEMPLATE_QUESTS_URL}`}
            label="お気に入り"
            leftSection={<IconClipboardPlus color={menuColors.favoriteQuest} size={18} stroke={1.2} />}
          />
        )}
      </NavLink>
      {/* メンバー（親のみ） */}
      {isParent && (
        <NavLink
          className='side-nav'
          href={`${FAMILY_MEMBERS_URL}`}
          label="メンバー"
          leftSection={<IconUsers color={menuColors.members} size={18} stroke={1.2} />}
        />
      )}
      {/* 設定 */}
      <NavLink
        className='side-nav'
        href={`${SETTINGS_URL}`}
        label="設定"
        leftSection={<IconSettings color={menuColors.settings} size={18} stroke={1.2} />}
      />
    </>
  )

  /** ミニメニューアイテム */
  const miniMenuItems = (
    <>
      {/* ホームボタン（アプリアイコン） */}
      <ActionIcon variant="subtle" onClick={() => router.push(HOME_URL)} size="xl" aria-label="ホーム">
        <Image src="/icon512_maskable.png" alt="ホーム" width={32} height={32} />
      </ActionIcon>
      {/* メニュー開閉ボタン */}
      <ActionIcon variant="subtle" onClick={onToggle} size="xl" aria-label="メニュー切り替え">
        {opened ? (
          <IconChevronLeft size={24} stroke={1.5} />
        ) : (
          <IconChevronRight size={24} stroke={1.5} />
        )}
      </ActionIcon>
      {/* 薄い線で境界 */}
      <Divider className="w-4/5" />
      {/* クエストアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(QUESTS_URL)}>
        <IconClipboard color={menuColors.quest} stroke={1.4} />
      </ActionIcon>
      {/* メンバーアイコン（親のみ） */}
      {isParent && (
        <ActionIcon variant="subtle" onClick={() => router.push(FAMILY_MEMBERS_URL)}>
          <IconUsers color={menuColors.members} stroke={1.4} />
        </ActionIcon>
      )}
      {/* 設定アイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(SETTINGS_URL)}>
        <IconSettings color={menuColors.settings} stroke={1.4} />
      </ActionIcon>
      {/* カラーパレット */}
      <ThemeToggleButton />
      {/* 通知ボタン */}
      {!isGuest && (
        <Indicator label={unreadCount > 0 ? unreadCount : null} size={16} color="red" disabled={unreadCount === 0}>
          <ActionIcon
            onClick={() => setIsNotificationOpen(true)} 
            variant="subtle" 
            size="xl"
            aria-label="通知"
          >
            <IconBell style={{ width: '60%', height: '60%' }} stroke={1.5} />
          </ActionIcon>
        </Indicator>
      )}
      {/* ログアウトボタン */}
      {!isGuest && (
        <ActionIcon
          onClick={handleLogout}
          variant="subtle"
          size="xl"
          aria-label="ログアウト"
        >
          <IconLogout style={{ width: '60%', height: '60%' }} stroke={1.5} />
        </ActionIcon>
      )}
    </>
  )

  if (isMobile) {
    return (
      <Drawer opened={opened} onClose={onClose} title="メニュー" size="xs" >
        {menuItems}
      </Drawer>
    )
  }

  return (
    <div className={`${isDark ? "bg-zinc-800!" : "bg-zinc-600!"} text-white h-full relative`}>
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 0 }} loaderProps={{ children: ' ' }} />
      {opened ? (
        <ScrollArea h="100%">{menuItems}</ScrollArea>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          {miniMenuItems}
        </div>
      )}
      {/* 通知モーダル */}
      <NotificationModal 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </div>
  )
}
