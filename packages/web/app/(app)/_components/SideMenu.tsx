"use client"

import { HOME_URL, QUESTS_URL, QUESTS_NEW_URL, USERS_URL, FAMILY_MEMBERS_URL, FAMILY_QUESTS_URL } from '@/app/(core)/endpoints'
import { NavLink, ScrollArea, Drawer, ActionIcon } from '@mantine/core'
import { IconFiles, IconFilePlus, IconBell, IconHome2, IconClipboard, IconUsers, IconWorld } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

/** サイドメニューを取得する */
export const SideMenu = ({isMobile, isDark, opened, onClose}: {isMobile: boolean, isDark: boolean, opened: boolean, onClose: () => void}) => {
  const router = useRouter()

  /** メニューアイテム */
  const menuItems = (
    <>
      <NavLink
        className='side-nav'
        href={`${HOME_URL}`}
        label="ホーム"
        leftSection={<IconHome2 className='home-color' size={18} stroke={1.2} />}
      />
      <NavLink
        className='side-nav'
        href="#required-for-focus"
        label="クエスト"
        leftSection={<IconClipboard className='clipboard-color' size={18} stroke={1.2} />}
        childrenOffset={28}
      >
        <NavLink
          className='side-nav'
          href={`${QUESTS_URL}`}
          label="パブリック"
          leftSection={<IconFiles size={18} stroke={1.2} />}
        />
        <NavLink
          className='side-nav'
          href={`${QUESTS_URL}`}
          label="テンプレート"
          leftSection={<IconFiles size={18} stroke={1.2} />}
        />
        <NavLink
          className='side-nav'
          href={`${QUESTS_URL}`}
          label="ローカル"
          leftSection={<IconFiles size={18} stroke={1.2} />}
        />
        {/* ゲスト以外 */}
        <NavLink
          className='side-nav'
          href={`${QUESTS_NEW_URL}`}
          label="クエスト作成"
          leftSection={<IconFilePlus size={18} stroke={1.2} />}
        />
      </NavLink>
      <NavLink
        className='side-nav'
        href={`${USERS_URL}`}
        label="通知"
        leftSection={<IconBell color='rgb(250 204 21)' size={18} stroke={1.2} />}
      />
      <NavLink
        className='side-nav'
        href={`${USERS_URL}`}
        label="ユーザ管理"
        leftSection={<IconUsers className='users-color' size={18} stroke={1.2} />}
      />
    </>
  )

  /** ミニメニューアイテム */
  const miniMenuItems = (
    <>
      {/* ホームアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(HOME_URL)}>
        <IconHome2 className='home-color' stroke={1.4} />
      </ActionIcon>
      {/* クエストアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(QUESTS_URL)}>
        <IconClipboard className='clipboard-color' stroke={1.4} />
      </ActionIcon>
      {/* 通知アイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(QUESTS_URL)}>
        <IconBell color='rgb(250 204 21)' stroke={1.4} />
      </ActionIcon>
      {/* 人アイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(FAMILY_MEMBERS_URL)}>
        <IconUsers className='users-color' stroke={1.4} />
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
