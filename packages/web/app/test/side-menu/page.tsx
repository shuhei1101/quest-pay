/**
 * サイドメニュー モック: 4つのデザインバリエーション
 * タブで切り替え可能
 */
"use client"

import { useState } from 'react'
import { Card, Text, Divider, ActionIcon, ScrollArea, Avatar, Badge, Tabs, Container, Box } from '@mantine/core'
import { 
  IconHome2, IconMenu2, IconClipboard, IconUsers, IconSettings, 
  IconBell, IconLogout, IconChevronRight 
} from '@tabler/icons-react'
import Image from 'next/image'

export default function SideMenuMock() {
  const [activeTab, setActiveTab] = useState<string | null>("minimal")

  return (
    <Container size="100%" px={0}>
      <Box p="md">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="minimal">ミニマル</Tabs.Tab>
            <Tabs.Tab value="modern">モダン</Tabs.Tab>
            <Tabs.Tab value="avatar">アバター強調</Tabs.Tab>
            <Tabs.Tab value="glass">グラスモーフィズム</Tabs.Tab>
          </Tabs.List>

          {/* ミニマルデザイン */}
          <Tabs.Panel value="minimal" pt="md">
            <MinimalDesign />
          </Tabs.Panel>

          {/* モダンデザイン */}
          <Tabs.Panel value="modern" pt="md">
            <ModernDesign />
          </Tabs.Panel>

          {/* アバター強調デザイン */}
          <Tabs.Panel value="avatar" pt="md">
            <AvatarDesign />
          </Tabs.Panel>

          {/* グラスモーフィズムデザイン */}
          <Tabs.Panel value="glass" pt="md">
            <GlassDesign />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Container>
  )
}

// ミニマルデザイン
function MinimalDesign() {
  const [opened, setOpened] = useState(true)

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <div 
        className="h-full transition-all duration-300 border-r flex flex-col"
        style={{ 
          width: opened ? '280px' : '70px',
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        {opened ? (
          <ScrollArea h="100%">
            <div className='flex items-center justify-between p-3 border-b'>
              <div className='flex items-center gap-3'>
                <Image src="/icon512_maskable.png" alt="アプリアイコン" width={32} height={32} />
                <Text size="lg" className='font-bold'>クエストペイ</Text>
              </div>
              <ActionIcon variant="subtle" onClick={() => setOpened(false)} aria-label="メニューを閉じる">
                <IconMenu2 size={20} stroke={1.5} />
              </ActionIcon>
            </div>

            <div className='p-3'>
              <Card className='cursor-pointer transition-all hover:scale-[1.02]' padding="md" radius="md" withBorder>
                <div className='flex items-center gap-3'>
                  <IconHome2 size={32} stroke={1.5} />
                  <div className='flex flex-col'>
                    <Text size="xs" c="dimmed">西川家</Text>
                    <Text size="md" className='font-bold'>西川</Text>
                  </div>
                </div>
              </Card>
            </div>

            <Divider className="mx-3" />

            <div className='p-3 space-y-2'>
              {['ホーム', 'クエスト', 'メンバー'].map((label) => (
                <div key={label} className='flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
                  <IconHome2 size={18} stroke={1.2} />
                  <Text size="sm">{label}</Text>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <ActionIcon variant="subtle" onClick={() => setOpened(true)} size="lg">
              <IconMenu2 size={24} stroke={1.5} />
            </ActionIcon>
            <Divider className="w-4/5" />
            <ActionIcon variant="subtle" size="lg">
              <IconHome2 stroke={1.4} />
            </ActionIcon>
          </div>
        )}
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">ミニマルデザイン</h1>
          <div className="space-y-4">
            <Card padding="lg" radius="md" withBorder>
              <Text size="lg" className="font-bold mb-2">特徴</Text>
              <ul className="list-disc list-inside space-y-2">
                <li>ピン機能を完全に削除</li>
                <li>三本線アイコンのみでメニューを開閉</li>
                <li>ヘッダー部分をシンプルに統一</li>
                <li>プロフィールカードに控えめなホバーアニメーション</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// モダンフラットデザイン
function ModernDesign() {
  const [opened, setOpened] = useState(true)

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <div 
        className="h-full transition-all duration-300 border-r flex flex-col"
        style={{ 
          width: opened ? '280px' : '70px',
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        {opened ? (
          <ScrollArea h="100%">
            <div className='flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
              <div className='flex items-center gap-3'>
                <Image src="/icon512_maskable.png" alt="アプリアイコン" width={32} height={32} className="rounded" />
                <Text size="lg" className='font-bold'>クエストペイ</Text>
              </div>
              <ActionIcon variant="subtle" onClick={() => setOpened(false)} aria-label="メニューを閉じる" c="white">
                <IconMenu2 size={20} stroke={1.5} />
              </ActionIcon>
            </div>

            <div className='p-4 bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
              <div className='flex items-center gap-3'>
                <Avatar size="lg" radius="xl" color="blue">西</Avatar>
                <div className='flex flex-col'>
                  <Text size="xs" c="dimmed" className='font-medium'>西川家</Text>
                  <Text size="lg" className='font-bold'>西川</Text>
                </div>
              </div>
            </div>

            <div className='py-3'>
              {[
                { icon: IconHome2, label: 'ホーム', color: '#3b82f6', hover: 'blue' },
                { icon: IconClipboard, label: 'クエスト', color: '#a855f7', hover: 'purple' },
                { icon: IconUsers, label: 'メンバー', color: '#10b981', hover: 'green' },
                { icon: IconSettings, label: '設定', color: '#f97316', hover: 'orange' },
              ].map((item) => (
                <div 
                  key={item.label}
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-${item.hover}-50 dark:hover:bg-${item.hover}-900/20 border-l-4 border-transparent hover:border-${item.hover}-500 transition-all`}
                >
                  <item.icon size={20} stroke={1.5} color={item.color} />
                  <Text size="sm" className="font-medium">{item.label}</Text>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <ActionIcon variant="subtle" onClick={() => setOpened(true)} size="lg">
              <IconMenu2 size={24} stroke={1.5} />
            </ActionIcon>
          </div>
        )}
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">モダンフラットデザイン</h1>
          <div className="space-y-6">
            <div className="p-6 rounded-lg border">
              <Text size="lg" className="font-bold mb-3">特徴</Text>
              <ul className="list-disc list-inside space-y-2">
                <li>カードを使わず、背景色とボーダーで区別</li>
                <li>グラデーションヘッダーで視覚的アクセント</li>
                <li>左ボーダーのホバーエフェクト</li>
                <li>アバターを使用したプロフィール表示</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// アバター強調型デザイン
function AvatarDesign() {
  const [opened, setOpened] = useState(true)

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <div 
        className="h-full transition-all duration-300 border-r flex flex-col"
        style={{ 
          width: opened ? '280px' : '70px',
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        {opened ? (
          <ScrollArea h="100%">
            <div className='relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-6'>
              <ActionIcon 
                variant="subtle" 
                onClick={() => setOpened(false)} 
                className="absolute top-3 right-3"
                c="white"
              >
                <IconMenu2 size={20} stroke={1.5} />
              </ActionIcon>
              
              <div className='flex flex-col items-center gap-3 mt-4'>
                <Avatar 
                  size="xl" 
                  radius="xl" 
                  className="border-4 border-white shadow-lg"
                  color="indigo"
                >
                  西
                </Avatar>
                <div className='text-center'>
                  <Text size="xl" className='font-bold'>西川</Text>
                  <Badge variant="light" color="white" c="indigo" className="mt-1">西川家</Badge>
                </div>
              </div>
            </div>

            <div className='py-4 px-2'>
              {[
                { icon: IconHome2, label: 'ホーム' },
                { icon: IconClipboard, label: 'クエスト' },
                { icon: IconUsers, label: 'メンバー' },
                { icon: IconSettings, label: '設定' },
              ].map((item) => (
                <div 
                  key={item.label}
                  className='flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                >
                  <item.icon size={22} stroke={1.5} />
                  <Text size="sm" className="font-medium">{item.label}</Text>
                </div>
              ))}

              <Divider my="md" />

              <div className='flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
                <IconBell size={22} stroke={1.5} />
                <Text size="sm" className="font-medium">通知</Text>
                <Badge size="sm" color="red" className="ml-auto">3</Badge>
              </div>
              
              <div className='flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400'>
                <IconLogout size={22} stroke={1.5} />
                <Text size="sm" className="font-medium">ログアウト</Text>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <ActionIcon variant="subtle" onClick={() => setOpened(true)} size="lg">
              <IconMenu2 size={24} stroke={1.5} />
            </ActionIcon>
          </div>
        )}
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">アバター強調型デザイン</h1>
          <div className="space-y-6">
            <div className="p-6 rounded-lg border bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
              <Text size="lg" className="font-bold mb-3">特徴</Text>
              <ul className="list-disc list-inside space-y-2">
                <li>プロフィール部分にグラデーション背景</li>
                <li>大きなアバターで視覚的インパクト</li>
                <li>ユーザー情報を中央配置で強調</li>
                <li>通知バッジで未読数を表示</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// グラスモーフィズムデザイン
function GlassDesign() {
  const [opened, setOpened] = useState(true)

  return (
    <div className="flex h-[calc(100vh-120px)] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 -z-10" />
      
      <div 
        className="h-full transition-all duration-300 flex flex-col"
        style={{ 
          width: opened ? '280px' : '70px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {opened ? (
          <ScrollArea h="100%">
            <div className='flex items-center justify-between p-4' style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <div className='flex items-center gap-3'>
                <Image src="/icon512_maskable.png" alt="アプリアイコン" width={32} height={32} className="rounded-lg shadow" />
                <Text size="lg" className='font-bold text-white'>クエストペイ</Text>
              </div>
              <ActionIcon 
                variant="subtle" 
                onClick={() => setOpened(false)} 
                aria-label="メニューを閉じる"
                style={{ color: 'white' }}
              >
                <IconMenu2 size={20} stroke={1.5} />
              </ActionIcon>
            </div>

            <div className='p-4'>
              <div 
                className='cursor-pointer transition-all hover:scale-[1.02] rounded-xl p-4'
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                }}
              >
                <div className='flex items-center gap-3'>
                  <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center backdrop-blur">
                    <IconHome2 size={24} stroke={1.5} color="white" />
                  </div>
                  <div className='flex flex-col'>
                    <Text size="xs" className="text-white/70 font-medium">西川家</Text>
                    <Text size="md" className='font-bold text-white'>西川</Text>
                  </div>
                </div>
              </div>
            </div>

            <div className='px-3 py-3 space-y-2'>
              {[
                { icon: IconHome2, label: 'ホーム' },
                { icon: IconClipboard, label: 'クエスト' },
                { icon: IconUsers, label: 'メンバー' },
                { icon: IconSettings, label: '設定' },
              ].map((item) => (
                <div 
                  key={item.label}
                  className='flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all'
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <item.icon size={20} stroke={1.5} color="white" />
                  <Text size="sm" className="font-medium text-white">{item.label}</Text>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <ActionIcon 
              variant="subtle" 
              onClick={() => setOpened(true)} 
              size="lg"
              style={{ color: 'white' }}
            >
              <IconMenu2 size={24} stroke={1.5} />
            </ActionIcon>
          </div>
        )}
      </div>

      <div className="flex-1 p-8" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }}>
        <div 
          className="max-w-4xl mx-auto p-8 rounded-2xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h1 className="text-3xl font-bold mb-6">グラスモーフィズムデザイン</h1>
          <div className="space-y-6">
            <div className="p-6 rounded-lg border bg-white/50 backdrop-blur">
              <Text size="lg" className="font-bold mb-3">特徴</Text>
              <ul className="list-disc list-inside space-y-2">
                <li>半透明な背景とぼかし効果（backdrop-filter）</li>
                <li>柔らかく洗練された印象</li>
                <li>背景が透けて見える</li>
                <li>白ベースで統一されたカラーリング</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
