"use client"

import { Button, Center, Paper, Title, Text, Alert } from "@mantine/core"
import { FeedbackMessage } from "../../../(core)/_components/FeedbackMessageWrapper"
import { IconMail } from "@tabler/icons-react"
import { useResendEmail } from "./_hook/useResendEmail"
import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { useSearchParams } from "next/navigation"
import { LOGIN_URL } from "@/app/(core)/endpoints"

export const VerifyEmail = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your-email@example.com'

  /** メール再送ハンドル */
  const { resendEmail, isLoading } = useResendEmail()

  return (
    <>
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
            <Text size="sm" c="dimmed">{email}</Text>
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
            <Button 
              fullWidth 
              variant="outline" 
              onClick={() => resendEmail(email)}
              loading={isLoading}
            >
              メールを再送信
            </Button>
            <Button fullWidth onClick={() => router.push(LOGIN_URL)}>
              ログイン画面に戻る
            </Button>
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
      
      {/* フィードバックメッセージ */}
      <FeedbackMessage />
    </>
  )
}
