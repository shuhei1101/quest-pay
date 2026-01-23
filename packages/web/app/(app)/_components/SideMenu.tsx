"use client"

import { HOME_URL, SETTINGS_URL, QUESTS_URL, FAMILY_MEMBERS_URL, PUBLIC_QUESTS_URL, FAMILY_QUESTS_URL, TEMPLATE_QUESTS_URL } from '@/app/(core)/endpoints'
import { NavLink, ScrollArea, Drawer, ActionIcon, Card, Text } from '@mantine/core'
import { IconHome2, IconClipboard, IconUsers, IconSettings, IconWorld, IconClipboardPlus } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useLoginUserInfo } from '@/app/(auth)/login/_hooks/useLoginUserInfo'
import { menuColors } from '@/app/(core)/_theme/colors'
import { RenderIcon } from '@/app/(app)/icons/_components/RenderIcon'
import { PROFILE_URL } from '@/app/(core)/endpoints'

/** サイドメニューを取得する */
export const SideMenu = ({isMobile, isDark, opened, onClose}: {isMobile: boolean, isDark: boolean, opened: boolean, onClose: () => void}) => {
  const router = useRouter()
  /** ログインユーザ情報 */
  const { isParent, userInfo } = useLoginUserInfo()

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
      {/* ホームアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(HOME_URL)}>
        <IconHome2 color={menuColors.home} stroke={1.4} />
      </ActionIcon>
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
