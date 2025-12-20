
"use client"

import { Box, Button, Center, Checkbox, Paper, PasswordInput, TextInput, Title, Text, Anchor, Alert } from "@mantine/core"
import { IconMail, IconLock, IconAlertCircle } from "@tabler/icons-react"

/** メール認証待ち画面A */
export const MockVerifyEmailA = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
        {/* 成功アイコン */}
        <Center className="mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <Text size="xl" c="green">✓</Text>
          </div>
        </Center>

        {/* タイトル */}
        <div className="text-center mb-6">
          <Title order={2} className="mb-2">確認メールを送信しました</Title>
          <Text size="sm" c="dimmed">your-email@example.com</Text>
        </div>

        {/* 説明 */}
        <Alert icon={<IconMail size={16} />} color="blue" className="mb-4">
          <div className="flex flex-col gap-2">
            <Text size="sm" fw={600}>メールをご確認ください</Text>
            <Text size="sm">
              登録したメールアドレスに確認メールを送信しました。
              メール内のリンクをクリックして、アカウントを有効化してください。
            </Text>
          </div>
        </Alert>

        {/* アクション */}
        <div className="flex flex-col gap-3">
          <Button fullWidth variant="outline">メールを再送信</Button>
          <Button fullWidth>ログイン画面に戻る</Button>
        </div>

        {/* 注意事項 */}
        <div className="mt-6 p-3 bg-gray-50 rounded">
          <Text size="xs" c="dimmed" className="mb-2">
            <strong>メールが届かない場合:</strong>
          </Text>
          <div className="flex flex-col gap-1">
            <Text size="xs" c="dimmed">• 迷惑メールフォルダをご確認ください</Text>
            <Text size="xs" c="dimmed">• メールアドレスが正しいかご確認ください</Text>
            <Text size="xs" c="dimmed">• 数分待ってから再送信してください</Text>
          </div>
        </div>
      </Paper>
    </div>
  )
}

/** メール認証待ち画面B: グラデーション背景でコンパクト */
export const MockVerifyEmailB = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Paper shadow="xl" p="xl" radius="lg" className="w-full max-w-md">
        {/* メールアイコン */}
        <Center className="mb-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }}>
            <IconMail size={40} color="white" />
          </div>
        </Center>

        {/* タイトル */}
        <div className="text-center mb-6">
          <Title order={2} className="mb-3" c="dark.1">メールを確認してください</Title>
          <Text size="sm" c="dark.2" fw={600} className="mb-2">your-email@example.com</Text>
          <Text size="sm" c="dark.2">
            上記のアドレスに確認メールを送信しました
          </Text>
        </div>

        {/* 手順 */}
        <div className="mb-6">
          <Text size="sm" fw={600} c="dark.1" className="mb-3">次のステップ:</Text>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Text size="xs" fw={700} c="blue">1</Text>
              </div>
              <Text size="sm" c="dark.2">メールボックスを開く</Text>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Text size="xs" fw={700} c="blue">2</Text>
              </div>
              <Text size="sm" c="dark.2">確認メール内のリンクをクリック</Text>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Text size="xs" fw={700} c="blue">3</Text>
              </div>
              <Text size="sm" c="dark.2">アカウントが有効化されます</Text>
            </div>
          </div>
        </div>

        {/* アクション */}
        <div className="flex flex-col gap-3">
          <Button fullWidth size="md" 
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            ログイン画面に戻る
          </Button>
          <Button fullWidth size="md" variant="outline">メールを再送信</Button>
        </div>

        {/* 注意 */}
        <Text size="xs" c="dark.3" className="text-center mt-4">
          メールが届かない場合は、迷惑メールフォルダをご確認ください
        </Text>
      </Paper>
    </div>
  )
}

/** メール認証待ち画面C: シンプルでミニマル */
export const MockVerifyEmailC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-lg">
        {/* メインカード */}
        <Paper shadow="sm" p="xl" radius="md" className="mb-4">
          {/* アイコンとタイトル */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center">
              <IconMail size={32} color="#3b82f6" />
            </div>
            <div>
              <Title order={2} c="dark.1">確認メールを送信</Title>
              <Text size="sm" c="dark.2">アカウントを有効化してください</Text>
            </div>
          </div>

          {/* 送信先 */}
          <div className="mb-6 p-4 bg-blue-50 rounded">
            <Text size="xs" c="dark.2" className="mb-1">送信先:</Text>
            <Text size="md" fw={600} c="blue">your-email@example.com</Text>
          </div>

          {/* 説明 */}
          <Text size="sm" c="dark.1" className="mb-4">
            確認メールに記載されているリンクをクリックすると、アカウントが有効化されます。
            メールが届くまで数分かかる場合があります。
          </Text>

          {/* ボタン */}
          <div className="flex gap-3">
            <Button flex={1} variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
              ログイン画面へ
            </Button>
            <Button flex={1} variant="light">再送信</Button>
          </div>
        </Paper>

        {/* ヘルプカード */}
        <Paper shadow="sm" p="md" radius="md">
          <Text size="sm" fw={600} c="dark.1" className="mb-2">メールが届かない場合</Text>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <Text size="sm" c="blue">•</Text>
              <Text size="sm" c="dark.2">迷惑メールフォルダを確認してください</Text>
            </div>
            <div className="flex items-start gap-2">
              <Text size="sm" c="blue">•</Text>
              <Text size="sm" c="dark.2">メールアドレスが正しいか確認してください</Text>
            </div>
            <div className="flex items-start gap-2">
              <Text size="sm" c="blue">•</Text>
              <Text size="sm" c="dark.2">数分待ってから再送信をお試しください</Text>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  )
}
