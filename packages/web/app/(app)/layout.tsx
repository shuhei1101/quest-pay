"use client"

import { useLoginUserInfo } from '@/app/login/_hooks/useLoginUserInfo'
import { HOME_URL, LOGIN_URL, PROJECT_NEW_URL, PROJECTS_URL, QUESTS_NEW_URL, QUESTS_URL, USERS_URL } from '@/app/(core)/constants'
import { AppShell, Burger, Drawer, NavLink, ActionIcon, Title, ScrollArea, LoadingOverlay } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconHome2, IconUsers, IconFiles, IconFolders, IconBriefcase, IconFolderPlus, IconFilePlus, IconLogout, IconListCheck, IconMenu2, IconClipboard, IconWorld } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { appStorage } from '../(core)/_sessionStorage/appStorage'
import { ClipboardIcon, HomeIcon, UsersIcon, WorldIcon } from '../icon'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /** メニューの表示状態 */
  const [opened, { toggle, close }] = useDisclosure();
  const router = useRouter()
  /** ブレークポイント */
  const isMobile = useMediaQuery('(max-width: 768px)')
  /** ログインユーザ情報（キャッシュを使用しない） */
  const { userInfo, isLoading } = useLoginUserInfo({caching: false})
  /** メニュー */
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

  const miniMenuItems = (
    <>
      <ActionIcon variant="subtle" onClick={() => router.push(HOME_URL)}>
        <HomeIcon stroke={1.4} />
      </ActionIcon>

      <ActionIcon variant="subtle" onClick={() => router.push(QUESTS_URL)}>
        <ClipboardIcon stroke={1.4} />
      </ActionIcon>

      <ActionIcon variant="subtle" onClick={() => router.push(PROJECTS_URL)}>
        <WorldIcon stroke={1.4} />
      </ActionIcon>

      <ActionIcon variant="subtle" onClick={() => router.push(USERS_URL)}>
        <UsersIcon stroke={1.4} />
      </ActionIcon>
    </>
  )

  return (
    <>
    {/* ロード中のオーバーレイ */}
    <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 0 }} loaderProps={{ children: ' ' }} />
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: opened ? 260 : 60,
          breakpoint: "sm",
          collapsed: { 
            mobile: true, 
            desktop: false,
          },
        }}
        padding="md"
      >
        <AppShell.Header style={{
          display: "flex",
          alignItems: "center",
          color: "black",
          paddingLeft: "10px",
          paddingRight: "10px"
        }} >
            {/* ハンバーガーメニュー切り替えボタン */}
            <ActionIcon onClick={toggle} variant="subtle" size="xl" >
              <IconMenu2 style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            {/* ホームボタン */}
            <ActionIcon onClick={()=>{
              router.push(`${HOME_URL}`)
            }} variant="subtle" size="xl" >
              <IconHome2 style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            {/* タイトル */}
            <Title textWrap='nowrap' order={5} >お小遣いクエストボード</Title>
            {/* スペース */}
            <div className='w-full' />
            {/* ユーザ情報を表示する */}
            <p className='text-nowrap text-sm'>{userInfo?.profile_name}</p>
            {/* サインアウトボタン */}
            <ActionIcon onClick={()=>{
              // 次画面で表示するメッセージを登録する
              appStorage.feedbackMessage.set('サインアウトしました')
              // ログイン画面に遷移する
              router.push(`${LOGIN_URL}`)
            }} variant="subtle" size="xl" >
              <IconLogout style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
        </AppShell.Header>

        {/* （大画面のみ）左サイドメニュー */}
        <AppShell.Navbar className="bg-zinc-600! text-white">
          {!isMobile ? (
            opened ? (
              <ScrollArea h="100%">{menuItems}</ScrollArea>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                {miniMenuItems}
              </div>
            )
          ) : null}
        </AppShell.Navbar>
        {/* （子画面のみ）ハンバーガーメニュー */}
        {isMobile && (
          <Drawer opened={opened} onClose={close} title="メニュー" size="xs" >
            {menuItems}
          </Drawer>
        )}
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
