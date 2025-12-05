"use client";
import { useLoginUserInfo } from '@/app/login/_hooks/useLoginUserInfo';
import { HOME_URL, LOGIN_URL, PROJECT_NEW_URL, PROJECTS_URL, QUESTS_NEW_URL, QUESTS_URL, USERS_URL } from '@/app/(core)/constants';
import { Burger, Drawer, NavLink, ActionIcon, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHome2, IconUsers, IconFiles, IconFolders, IconGauge, IconChecklist, IconBriefcase, IconClipboardPlus, IconFolderPlus, IconFilePlus, IconFile, IconLogout, IconListCheck, IconUser, IconUserPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { appStorage } from '../_sessionStorage/appStorage';

export default function Header() {
  const router = useRouter()
  /** ポップアップの表示状態 */
  const [opened, { open, close }] = useDisclosure(false);
  /** ログインユーザ情報 */
  const { userInfo } = useLoginUserInfo()

  return (
    <>
      <div className='h-15 bg-blue-500 flex items-center p-2 gap-3'>
        {/* ハンバーガーメニュー切り替えボタン */}
        <Burger opened={opened} onClick={open} aria-label="Toggle navigation" color="rgba(255, 255, 255, 1)" />
        {/* ホームボタン */}
        <ActionIcon onClick={()=>{
          router.push(`${HOME_URL}`)
        }} variant="subtle" size="xl" color="rgba(255, 255, 255, 1)">
          <IconHome2 style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
        <Title textWrap='nowrap' order={5} c="rgba(255, 255, 255, 1)">サンプルアプリ</Title>
        {/* スペース */}
        <div className='w-full' />
        {/* ユーザ情報を表示する */}
        <p className='text-nowrap text-white text-sm'>{userInfo?.name}</p>
        {/* サインアウトボタン */}
        <ActionIcon onClick={()=>{
          // 次画面で表示するメッセージを登録する
          appStorage.feedbackMessage.set('サインアウトしました')

          // ログイン画面に遷移する
          router.push(`${LOGIN_URL}`)
        }} variant="subtle" size="xl" color="rgba(255, 255, 255, 1)">
          <IconLogout style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>

      </div>
      {/* ハンバーガーメニュー */}
      <Drawer opened={opened} onClose={close} title="メニュー" size="xs">
        <NavLink
          href={`${HOME_URL}`}
          label="ホーム"
          leftSection={<IconHome2 size={16} stroke={1.5} />}
        />
        <NavLink
          href="#required-for-focus"
          label="クエスト"
          leftSection={<IconListCheck size={16} stroke={1.5} />}
          childrenOffset={28}
        >
          <NavLink
            href={`${QUESTS_URL}`}
            label="クエスト一覧"
            leftSection={<IconFiles size={16} stroke={1.5} />}
          />
          {/* ゲスト以外 */}
          <NavLink
            href={`${QUESTS_NEW_URL}`}
            label="クエスト作成"
            leftSection={<IconFilePlus size={16} stroke={1.5} />}
          />
        </NavLink>
        <NavLink
          href="#required-for-focus"
          label="プロジェクト"
          leftSection={<IconBriefcase size={16} stroke={1.5} />}
        >
          <NavLink
            href={`${PROJECTS_URL}`}
            label="プロジェクト一覧"
            leftSection={<IconFolders size={16} stroke={1.5} />}
          />
          {/* ゲスト以外 */}
          <NavLink
            href={`${PROJECT_NEW_URL}`}
            label="プロジェクト作成"
            leftSection={<IconFolderPlus size={16} stroke={1.5} />}
          />
        </NavLink>
        {/* 管理者のみ */}
        <NavLink
          href={`${USERS_URL}`}
          label="ユーザ管理"
          leftSection={<IconUsers size={16} stroke={1.5} />}
        />
      </Drawer>
    </>
  )
}
