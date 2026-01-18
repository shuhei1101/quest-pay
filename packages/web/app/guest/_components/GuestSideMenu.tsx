"use client"

import { HOME_URL, LOGIN_URL, GUEST_QUESTS_URL } from '@/app/(core)/endpoints'
import { NavLink, ScrollArea, Drawer, ActionIcon } from '@mantine/core'
import { IconHome2, IconWorld, IconLogin } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { menuColors } from '@/app/(core)/_theme/colors'

/** ゲスト用サイドメニューを取得する */
export const GuestSideMenu = ({isMobile, isDark, opened, onClose}: {isMobile: boolean, isDark: boolean, opened: boolean, onClose: () => void}) => {
  const router = useRouter()

  /** メニューアイテム */
  const menuItems = (
    <>
      {/* ホーム */}
      <NavLink
        className='side-nav'
        href={`${HOME_URL}`}
        label="ホーム"
        leftSection={<IconHome2 color={menuColors.home} size={18} stroke={1.2} />}
      />
      {/* ゲストクエスト */}
      <NavLink
        className='side-nav'
        href={`${GUEST_QUESTS_URL}`}
        label="公開クエスト"
        leftSection={<IconWorld color={menuColors.publicQuest} size={18} stroke={1.2} />}
      />
      {/* ログイン */}
      <NavLink
        className='side-nav'
        href={`${LOGIN_URL}`}
        label="ログイン"
        leftSection={<IconLogin color={menuColors.settings} size={18} stroke={1.2} />}
      />
    </>
  )

  /** ミニメニューアイテム */
  const miniMenuItems = (
    <>
      {/* ホームアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(HOME_URL)}>
        <IconHome2 color={menuColors.home} stroke={1.4} />
      </ActionIcon>
      {/* 公開クエストアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(GUEST_QUESTS_URL)}>
        <IconWorld color={menuColors.publicQuest} stroke={1.4} />
      </ActionIcon>
      {/* ログインアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(LOGIN_URL)}>
        <IconLogin color={menuColors.settings} stroke={1.4} />
      </ActionIcon>
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
    <div className={`${isDark ? "bg-zinc-800!" : "bg-zinc-600!"} text-white h-full`}>
      {opened ? (
        <ScrollArea h="100%">{menuItems}</ScrollArea>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          {miniMenuItems}
        </div>
      )}
    </div>
  )
}
