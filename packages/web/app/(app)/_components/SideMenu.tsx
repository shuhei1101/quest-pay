"use client"

import { HOME_URL, PROFILE_URL, SETTINGS_URL, QUESTS_URL, FAMILY_MEMBERS_URL, PUBLIC_QUESTS_URL, FAMILY_QUESTS_URL, TEMPLATE_QUESTS_URL } from '@/app/(core)/endpoints'
import { NavLink, ScrollArea, Drawer, ActionIcon } from '@mantine/core'
import { IconHome2, IconClipboard, IconUsers, IconUser, IconSettings, IconWorld, IconClipboardPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useLoginUserInfo } from '@/app/(auth)/login/_hooks/useLoginUserInfo'

/** サイドメニューを取得する */
export const SideMenu = ({isMobile, isDark, opened, onClose}: {isMobile: boolean, isDark: boolean, opened: boolean, onClose: () => void}) => {
  const router = useRouter()
  /** ログインユーザ情報 */
  const { isParent } = useLoginUserInfo()

  /** メニューアイテム */
  const menuItems = (
    <>
      {/* ホーム */}
      <NavLink
        className='side-nav'
        href={`${HOME_URL}`}
        label="ホーム"
        leftSection={<IconHome2 className='home-color' size={18} stroke={1.2} />}
      />
      {/* クエスト */}
      <NavLink
        className='side-nav'
        href="#required-for-focus"
        label="クエスト"
        leftSection={<IconClipboard className='clipboard-color' size={18} stroke={1.2} />}
        childrenOffset={28}
      >
        {/* 公開（親のみ） */}
        {isParent && (
          <NavLink
            className='side-nav'
            href={`${PUBLIC_QUESTS_URL}`}
            label="公開"
            leftSection={<IconWorld className='clipboard-color' size={18} stroke={1.2} />}
          />
        )}
        {/* 家族（親のみ） */}
        {isParent && (
          <NavLink
            className='side-nav'
            href={`${FAMILY_QUESTS_URL}`}
            label="家族"
            leftSection={<IconHome2 className='clipboard-color' size={18} stroke={1.2} />}
          />
        )}
        {/* お気に入り（親のみ） */}
        {isParent && (
          <NavLink
            className='side-nav'
            href={`${TEMPLATE_QUESTS_URL}`}
            label="お気に入り"
            leftSection={<IconClipboardPlus className='clipboard-color' size={18} stroke={1.2} />}
          />
        )}
      </NavLink>
      {/* メンバー（親のみ） */}
      {isParent && (
        <NavLink
          className='side-nav'
          href={`${FAMILY_MEMBERS_URL}`}
          label="メンバー"
          leftSection={<IconUsers className='users-color' size={18} stroke={1.2} />}
        />
      )}
      {/* プロフィール */}
      <NavLink
        className='side-nav'
        href={`${PROFILE_URL}`}
        label="プロフィール"
        leftSection={<IconUser size={18} stroke={1.2} />}
      />
      {/* 設定 */}
      <NavLink
        className='side-nav'
        href={`${SETTINGS_URL}`}
        label="設定"
        leftSection={<IconSettings size={18} stroke={1.2} />}
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
      {/* メンバーアイコン（親のみ） */}
      {isParent && (
        <ActionIcon variant="subtle" onClick={() => router.push(FAMILY_MEMBERS_URL)}>
          <IconUsers className='users-color' stroke={1.4} />
        </ActionIcon>
      )}
      {/* プロフィールアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(PROFILE_URL)}>
        <IconUser stroke={1.4} />
      </ActionIcon>
      {/* 設定アイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(SETTINGS_URL)}>
        <IconSettings stroke={1.4} />
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
