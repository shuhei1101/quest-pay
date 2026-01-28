"use client"

import { Button, Paper, TextInput, Title, Text, Anchor } from "@mantine/core"
import { FeedbackMessage } from "../../../(core)/_components/FeedbackMessageWrapper"
import { IconMail } from "@tabler/icons-react"
import { useForgotPasswordForm } from "./_hooks/useForgotPasswordForm"
import { useForgotPassword } from "./_hooks/useForgotPassword"
import { useRouter } from "next/navigation"
import { LOGIN_URL } from "../../../(core)/endpoints"
import Link from "next/link"

export const ForgotPasswordScreen = () => {
  const router = useRouter()

  /** パスワードリセット依頼ハンドル */
  const { forgotPassword, isLoading } = useForgotPassword({onSuccess: () => {
    router.push(LOGIN_URL) // ログイン画面に遷移する
  }})

  /** パスワードリセット依頼フォーム状態 */
  const { register, handleSubmit, formState: { errors } } = useForgotPasswordForm()
  
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
          {/* タイトルセクション */}
          <div className="text-center mb-6">
            <Title order={2} className="mb-2">パスワードリセット</Title>
            <Text size="sm" c="dimmed">登録したメールアドレスを入力してください</Text>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit((form) => forgotPassword(form))}>
            <div className="flex flex-col gap-4">
              {/* メールアドレス入力欄 */}
              <TextInput
                label="メールアドレス"
                placeholder="your-email@example.com"
                leftSection={<IconMail size={16} />}
                required
                error={errors.email?.message}
                {...register("email")}
              />

              {/* 送信ボタン */}
              <Button fullWidth size="md" type="submit" loading={isLoading}>
                リセットメールを送信
              </Button>
              
              {/* ログインに戻るリンク */}
              <Text size="sm" className="text-center">
                <Anchor component={Link} href={LOGIN_URL}>ログイン画面に戻る</Anchor>
              </Text>
            </div>
          </form>
        </Paper>
      </div>
      
      {/* フィードバックメッセージ */}
      <FeedbackMessage />
    </>
  )
}
