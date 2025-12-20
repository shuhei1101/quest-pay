"use client"

import { Box, Button, Center, Checkbox, Paper, PasswordInput, TextInput, Title, Text, Anchor, Alert } from "@mantine/core"
import { IconMail, IconLock, IconAlertCircle } from "@tabler/icons-react"

/** 新規登録A: シンプルなカード型 */
export const MockRegistA = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
        {/* タイトルセクション */}
        <div className="text-center mb-6">
          <Title order={2} className="mb-2">新規登録</Title>
          <Text size="sm" c="dimmed">クエストペイを始めましょう</Text>
        </div>

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
            placeholder="6文字以上"
            leftSection={<IconLock size={16} />}
            required
          />
          <PasswordInput
            label="パスワード（確認）"
            placeholder="もう一度入力してください"
            leftSection={<IconLock size={16} />}
            required
          />

          <Alert icon={<IconAlertCircle size={16} />} color="blue" className="mt-2">
            登録後、確認メールをお送りします
          </Alert>

          <Button fullWidth size="md" className="mt-2">アカウントを作成</Button>
          
          <Text size="sm" className="text-center">
            すでにアカウントをお持ちの方は <Anchor>ログイン</Anchor>
          </Text>
        </div>
      </Paper>
    </div>
  )
}
  
/** 新規登録B: 2カラムレイアウト */
export const MockRegistB = () => {
  return (
    <div className="min-h-screen flex">
      {/* 左側: ブランドセクション */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 to-teal-600 items-center justify-center p-12">
        <div className="text-white text-center">
          <Title order={1} className="mb-4 text-white">クエストペイへようこそ</Title>
          <Text size="lg" className="text-white opacity-90 mb-6">
            家族みんなでお小遣いクエストを楽しもう
          </Text>
          <div className="flex flex-col gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Text c="white" fw={700}>✓</Text>
              </div>
              <Text c="white">クエストを作成・管理</Text>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Text c="white" fw={700}>✓</Text>
              </div>
              <Text c="white">お小遣いの見える化</Text>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Text c="white" fw={700}>✓</Text>
              </div>
              <Text c="white">家族みんなで楽しめる</Text>
            </div>
          </div>
        </div>
      </div>

      {/* 右側: 新規登録フォーム */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Title order={2} className="mb-6">新規登録</Title>
          
          <div className="flex flex-col gap-4">
            <TextInput
              label="メールアドレス"
              placeholder="your-email@example.com"
              size="md"
              required
            />
            <PasswordInput
              label="パスワード"
              placeholder="6文字以上"
              size="md"
              required
            />
            <PasswordInput
              label="パスワード（確認）"
              placeholder="もう一度入力してください"
              size="md"
              required
            />

            <Checkbox 
              label={
                <Text size="sm">
                  <Anchor size="sm">利用規約</Anchor>と<Anchor size="sm">プライバシーポリシー</Anchor>に同意する
                </Text>
              }
            />

            <Button size="lg" fullWidth className="mt-2">アカウントを作成</Button>
            
            <Alert icon={<IconAlertCircle size={16} />} color="blue" className="mt-2">
              登録後、確認メールをお送りします
            </Alert>

            <Text size="sm" className="text-center mt-4">
              すでにアカウントをお持ちの方は <Anchor>ログイン</Anchor>
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

/** 新規登録C: ステップ表示付き */
export const MockRegistC = () => {
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

        {/* タイトル */}
        <div className="text-center mb-6">
          <Title order={2} className="mb-2">アカウント作成</Title>
          <Text size="sm" c="dimmed">ステップ 1/2: 基本情報の入力</Text>
        </div>

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
            placeholder="6文字以上"
            leftSection={<IconLock size={16} />}
            required
          />
          <PasswordInput
            label="パスワード（確認）"
            placeholder="もう一度入力してください"
            leftSection={<IconLock size={16} />}
            required
          />

          <div className="mt-2">
            <Text size="xs" c="dimmed" className="mb-2">パスワードの条件:</Text>
            <div className="flex flex-col gap-1">
              <Text size="xs" c="dimmed">• 6文字以上</Text>
              <Text size="xs" c="dimmed">• 英字と数字を含む</Text>
            </div>
          </div>

          <Button fullWidth size="md" className="mt-4"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            次へ進む
          </Button>

          <Text size="sm" className="text-center mt-2">
            すでにアカウントをお持ちの方は <Anchor fw={600}>ログイン</Anchor>
          </Text>
        </div>
      </Paper>
    </div>
  )
}
