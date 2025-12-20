
"use client"

import { Box, Button, Center, Checkbox, Paper, PasswordInput, TextInput, Title, Text, Anchor, Alert } from "@mantine/core"
import { IconMail, IconLock, IconAlertCircle } from "@tabler/icons-react"

/** パターンA: シンプルでモダンなセンター配置 */
export const MockLoginA = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
        {/* タイトルセクション */}
        <div className="text-center mb-6">
          <Title order={2} className="mb-2">ログイン</Title>
          <Text size="sm" c="dimmed">アカウントにサインインする</Text>
        </div>

        {/* アラート */}
        <Alert icon={<IconAlertCircle size={16} />} title="ログイン機能は準備中です" color="yellow" className="mb-4">
          これはデザインのモックアップです
        </Alert>

        {/* フォーム */}
        <div className="flex flex-col gap-4">
          <TextInput
            label="メールアドレス"
            placeholder="your-email@example.com"
            leftSection={<IconMail size={16} />}
            required
          />
          <PasswordInput
            label="パスワード"
            placeholder="パスワードを入力"
            leftSection={<IconLock size={16} />}
            required
          />
          
          <div className="flex items-center justify-between">
            <Checkbox label="ログイン状態を保持" />
            <Anchor size="sm">パスワードをお忘れですか？</Anchor>
          </div>

          <Button fullWidth size="md">ログイン</Button>
          
          <Text size="sm" className="text-center">
            アカウントをお持ちでない場合は <Anchor>新規登録</Anchor>
          </Text>
        </div>
      </Paper>
    </div>
  )
}

/** パターンB: 2カラムレイアウト（左側に画像、右側にフォーム） */
export const MockLoginB = () => {
  return (
    <div className="min-h-screen flex">
      {/* 左側: ブランドセクション */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center p-12">
        <div className="text-white text-center">
          <Title order={1} className="mb-4 text-white">クエストペイ</Title>
          <Text size="lg" className="text-white opacity-90">
            家族でお小遣いクエストを楽しもう
          </Text>
        </div>
      </div>

      {/* 右側: ログインフォーム */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Title order={2} className="mb-6">ログイン</Title>
          
          <div className="flex flex-col gap-4">
            <TextInput
              label="メールアドレス"
              placeholder="your-email@example.com"
              size="md"
              required
            />
            <PasswordInput
              label="パスワード"
              placeholder="パスワードを入力"
              size="md"
              required
            />
            
            <div className="flex items-center justify-between">
              <Checkbox label="ログイン状態を保持" />
              <Anchor size="sm">パスワードをお忘れですか？</Anchor>
            </div>

            <Button size="lg" fullWidth className="mt-2">ログイン</Button>
            
            <Text size="sm" className="text-center mt-4">
              アカウントをお持ちでない場合は <Anchor>新規登録</Anchor>
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

/** パターンC: カード型でコンパクト（参考画像に似たデザイン） */
export const MockLoginC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Paper shadow="xl" p="xl" radius="lg" className="w-full max-w-md">
        {/* アイコン */}
        <Center className="mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <Text size="xl" fw={700} c="white">QP</Text>
          </div>
        </Center>

        {/* アラート */}
        <Alert icon={<IconAlertCircle size={16} />} color="yellow" className="mb-4">
          ログイン機能は準備中です
        </Alert>

        {/* フォーム */}
        <div className="flex flex-col gap-3">
          <TextInput
            label="メールアドレス"
            placeholder="your-email@example.com"
            leftSection={<IconMail size={16} />}
            required
          />
          <PasswordInput
            label="パスワード"
            placeholder="パスワードを入力"
            leftSection={<IconLock size={16} />}
            required
          />
          
          <div className="flex items-center justify-between text-sm">
            <Checkbox label="ログイン状態を保持" size="sm" />
            <Anchor size="sm">パスワードをお忘れですか？</Anchor>
          </div>

          <Button fullWidth size="md" 
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            ログイン
          </Button>

          <div className="text-center mt-2">
            <Text size="sm" c="dimmed">または</Text>
          </div>

          <Text size="sm" className="text-center">
            アカウントをお持ちでない場合は <Anchor fw={600}>新規登録</Anchor>
          </Text>
        </div>

        {/* フッター */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-center gap-4 text-sm">
            <Anchor size="xs" c="dimmed">料金プラン</Anchor>
            <Anchor size="xs" c="dimmed">使い方ガイド</Anchor>
            <Anchor size="xs" c="dimmed">プライバシーポリシー</Anchor>
          </div>
          <Text size="xs" c="dimmed" className="text-center mt-2">
            © 2025 Quest Pay -「xxx」
          </Text>
        </div>
      </Paper>
    </div>
  )
}
