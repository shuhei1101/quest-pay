
"use client"

import { Button, Center, Paper, Title, Text, Alert } from "@mantine/core"
import { IconLock, IconHome, IconArrowLeft, IconShieldX } from "@tabler/icons-react"

/** パターンA: シンプルでセンター配置 */
export const MockUnauthorizedA = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
        {/* アイコン */}
        <Center className="mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <IconLock size={40} color="#ef4444" />
          </div>
        </Center>

        {/* タイトル */}
        <div className="text-center mb-6">
          <Title order={2} className="mb-2">アクセスが制限されています</Title>
          <Text size="sm" c="dimmed">このページを表示する権限がありません</Text>
        </div>

        {/* 説明 */}
        <Alert color="red" className="mb-4">
          <Text size="sm">
            申し訳ございません。このページにアクセスする権限がありません。
            適切な権限をお持ちのアカウントでログインしてください。
          </Text>
        </Alert>

        {/* アクション */}
        <div className="flex flex-col gap-3">
          <Button fullWidth leftSection={<IconHome size={16} />}>
            ホーム画面に戻る
          </Button>
          <Button fullWidth variant="outline" leftSection={<IconArrowLeft size={16} />}>
            前のページに戻る
          </Button>
        </div>

        {/* サポート */}
        <div className="mt-6 p-3 bg-gray-50 rounded">
          <Text size="xs" c="dimmed" className="mb-1">
            <strong>このエラーが繰り返し表示される場合:</strong>
          </Text>
          <Text size="xs" c="dimmed">
            お手数ですが、管理者にお問い合わせください
          </Text>
        </div>
      </Paper>
    </div>
  )
}

/** パターンB: 403エラー風のデザイン */
export const MockUnauthorizedB = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-2xl">
        <Paper shadow="sm" p="xl" radius="md">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 左側: エラーコード */}
            <div className="text-center md:border-r md:pr-8">
              <Text size="6rem" fw={900} c="red" style={{ lineHeight: 1 }}>403</Text>
              <Text size="lg" fw={600} c="dark.1">Forbidden</Text>
            </div>

            {/* 右側: メッセージ */}
            <div className="flex-1">
              <Title order={2} className="mb-3">アクセスが拒否されました</Title>
              <Text size="sm" c="dimmed" className="mb-4">
                このページにアクセスする権限がありません。
                適切な権限を持つアカウントでログインするか、
                管理者に権限の付与を依頼してください。
              </Text>

              <div className="flex flex-col gap-2">
                <Button leftSection={<IconHome size={16} />}>
                  ホーム画面に戻る
                </Button>
                <Button variant="light" leftSection={<IconArrowLeft size={16} />}>
                  前のページに戻る
                </Button>
              </div>
            </div>
          </div>
        </Paper>

        {/* 追加情報 */}
        <Paper shadow="sm" p="md" radius="md" className="mt-4">
          <Text size="sm" fw={600} c="dark.1" className="mb-2">考えられる原因:</Text>
          <div className="flex flex-col gap-1">
            <Text size="sm" c="dimmed">• ログインしているアカウントに権限がない</Text>
            <Text size="sm" c="dimmed">• 直接URLを入力してアクセスした</Text>
            <Text size="sm" c="dimmed">• セッションの有効期限が切れている</Text>
          </div>
        </Paper>
      </div>
    </div>
  )
}

/** パターンC: イラスト風でフレンドリー */
export const MockUnauthorizedC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Paper shadow="xl" p="xl" radius="lg" className="w-full max-w-lg">
        {/* アイコン */}
        <Center className="mb-6">
          <div className="w-32 h-32 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)' }}>
            <IconShieldX size={64} color="white" />
          </div>
        </Center>

        {/* タイトル */}
        <div className="text-center mb-6">
          <Title order={1} className="mb-3" c="dark.1">おっと！</Title>
          <Text size="lg" fw={600} c="dark.1" className="mb-2">
            ここには入れません
          </Text>
          <Text size="sm" c="dark.2">
            このページを表示する権限がないようです
          </Text>
        </div>

        {/* メッセージ */}
        <div className="mb-6 p-4 bg-red-50 rounded-lg">
          <Text size="sm" c="dark.1">
            申し訳ございません。このページにアクセスするには、
            特別な権限が必要です。別のアカウントでログインするか、
            管理者に権限の確認をお願いしてください。
          </Text>
        </div>

        {/* アクション */}
        <div className="flex flex-col gap-3">
          <Button fullWidth size="md" 
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            leftSection={<IconHome size={18} />}>
            ホーム画面に戻る
          </Button>
          <Button fullWidth size="md" variant="outline"
            leftSection={<IconArrowLeft size={18} />}>
            前のページに戻る
          </Button>
        </div>

        {/* ヘルプ */}
        <Text size="xs" c="dark.3" className="text-center mt-6">
          問題が解決しない場合は、管理者にお問い合わせください
        </Text>
      </Paper>
    </div>
  )
}

/** パターンD: ミニマルでコンパクト */
export const MockUnauthorizedD = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* メインカード */}
        <Paper shadow="sm" p="lg" radius="md" className="mb-4">
          {/* アイコンとタイトル */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <IconLock size={24} color="#ef4444" />
            </div>
            <div>
              <Title order={3}>アクセス権限がありません</Title>
              <Text size="sm" c="dimmed">Error 403 - Forbidden</Text>
            </div>
          </div>

          {/* 説明 */}
          <Text size="sm" c="dark.1" className="mb-4">
            このページを表示する権限がありません。
            管理者に権限の付与を依頼してください。
          </Text>

          {/* ボタン */}
          <div className="flex gap-2">
            <Button flex={1} variant="filled" leftSection={<IconHome size={16} />}>
              ホーム
            </Button>
            <Button flex={1} variant="light" leftSection={<IconArrowLeft size={16} />}>
              戻る
            </Button>
          </div>
        </Paper>

        {/* サポートカード */}
        <Paper shadow="sm" p="md" radius="md">
          <Text size="xs" c="dimmed">
            <strong>問題が解決しない場合:</strong><br />
            お手数ですが、システム管理者までお問い合わせください
          </Text>
        </Paper>
      </div>
    </div>
  )
}
