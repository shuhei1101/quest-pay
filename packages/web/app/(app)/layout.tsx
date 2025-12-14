"use client"

import { useLoginUserInfo } from '@/app/login/_hooks/useLoginUserInfo'
import { FAMILY_MEMBERS_URL, HOME_URL, LOGIN_URL, QUESTS_NEW_URL, QUESTS_URL, USERS_URL } from '@/app/(core)/constants'
import { AppShell, Text, Image, Box, Drawer, NavLink, ActionIcon, Title, ScrollArea, LoadingOverlay, useMantineColorScheme, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconHome2, IconFiles, IconFilePlus, IconMenu2 } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { appStorage } from '../(core)/_sessionStorage/appStorage'
import { ClipboardIcon, HomeIcon, UsersIcon, WorldIcon } from '../icon'
import { useConstants } from '../(core)/useConstants'
import { createClient } from '../(core)/_supabase/client'
import { useSystemTheme } from '../(core)/useSystemTheme'
import { useEffect, useState } from 'react'
import { devLog } from '../(core)/util'
import { FeedbackMessage } from '../(core)/_components/FeedbackMessageWrapper'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // システムカラースキーム
  const { isDark: isSystemDark } = useSystemTheme()
  // Mantineカラースキーム
  const { setColorScheme } = useMantineColorScheme()
  useEffect(() => {
    devLog("カラー: ", isSystemDark ? "dark" : "light")
    setColorScheme(isSystemDark ? "dark" : "light")
  }, [isSystemDark])

  /** メニューの表示状態 */
  const [opened, { toggle, close }] = useDisclosure()
  const router = useRouter()
  /** ブレークポイント */
  const { isMobile, isDark } = useConstants()
  /** ログインユーザ情報（キャッシュを使用しない） */
  const { userInfo, isLoading, isGuest } = useLoginUserInfo({caching: false})
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
      {/* ホームアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(HOME_URL)}>
        <HomeIcon stroke={1.4} />
      </ActionIcon>
      {/* クエストアイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(QUESTS_URL)}>
        <ClipboardIcon stroke={1.4} />
      </ActionIcon>
      {/* 地球アイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(QUESTS_URL)}>
        <WorldIcon stroke={1.4} />
      </ActionIcon>
      {/* 人アイコン */}
      <ActionIcon variant="subtle" onClick={() => router.push(FAMILY_MEMBERS_URL)}>
        <UsersIcon stroke={1.4} />
      </ActionIcon>
    </>
  )

  // ログアウトボタン押下時のハンドル
  const handleLogout = async () => {
    // ログアウトする
    await createClient().auth.signOut()
    // 次画面で表示するメッセージを登録する
    appStorage.feedbackMessage.set('サインアウトしました')
    // ログイン画面に遷移する
    router.push(`${LOGIN_URL}`)
  }

  // ハンバーガーメニュー
  const MenuButton = () => (
    <ActionIcon onClick={toggle} variant="subtle" size="xl" >
      <IconMenu2 style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
  )

  // SSRレンダリング時の処理
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return (<></>)

  return (
    <>
    {/* ロード中のオーバーレイ */}
    <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 0 }} loaderProps={{ children: ' ' }} />
      <Box
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Image
          src={isDark ? "/images/bg-dark.png" : "/images/bg-light.png"}
          alt="bg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
        <Box
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
    
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: opened ? 200 : 60,
          breakpoint: 601,
          collapsed: { 
            mobile: true,
            desktop: false,
          },
        }}
        padding="md"
        styles={{
          main: {
            height: "100%",
            overflow: "hidden",
          },
        }}
      >
        <AppShell.Header style={{
          display: "flex",
          alignItems: "center",
          color: "black",
          paddingLeft: "10px",
          paddingRight: "10px",
          gap: "8px",
        }} >
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
        </AppShell.Header>

        {/* （大画面のみ）左サイドメニュー */}
        <AppShell.Navbar className={`${isDark ? "bg-zinc-800!" : "bg-zinc-600!"} text-white`}>
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
      {/* スマホ用ボトムバー */}
      {isMobile && (
        <Box
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "60px",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.15)",
            zIndex: 2000,
          }}
        >
          {miniMenuItems}
        </Box>
      )}
        </Box>
      </Box>
      <FeedbackMessage />
    </>
  )
}
