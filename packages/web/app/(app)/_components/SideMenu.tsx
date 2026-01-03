"use client"

import { HOME_URL, QUESTS_URL, QUESTS_NEW_URL, USERS_URL, FAMILY_MEMBERS_URL, FAMILY_QUESTS_URL } from '@/app/(core)/endpoints'
import { NavLink, ScrollArea, Drawer, ActionIcon } from '@mantine/core'
import { IconFiles, IconFilePlus } from '@tabler/icons-react'
import { ClipboardIcon, HomeIcon, UsersIcon, WorldIcon } from '../../(core)/_components/icon'
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
        leftSection={<HomeIcon size={18} stroke={1.2} />}
      />
      <NavLink
        className='side-nav'
        href="#required-for-focus"
        label="クエスト"
        leftSection={<ClipboardIcon size={18} stroke={1.2} />}
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
      {/* 管理者のみ */}
      <NavLink
        className='side-nav'
        href={`${USERS_URL}`}
        label="ユーザ管理"
        leftSection={<WorldIcon size={18} stroke={1.2} />}
      />
      <NavLink
        className='side-nav'
        href={`${USERS_URL}`}
        label="ユーザ管理"
        leftSection={<UsersIcon size={18} stroke={1.2} />}
      />
    </>
  )

  /** ミニメニューアイテム */
  const miniMenuItems = (
    <>
      {/* ホームアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(HOME_URL)}>
        <HomeIcon stroke={1.4} />
      </ActionIcon>
      {/* クエストアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(FAMILY_QUESTS_URL)}>
        <ClipboardIcon stroke={1.4} />
      </ActionIcon>
      {/* 地球アイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(FAMILY_QUESTS_URL)}>
        <WorldIcon stroke={1.4} />
      </ActionIcon>
      {/* 人アイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(FAMILY_MEMBERS_URL)}>
        <UsersIcon stroke={1.4} />
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
