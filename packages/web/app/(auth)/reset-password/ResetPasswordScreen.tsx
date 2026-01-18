"use client"

import { Button, Paper, PasswordInput, Title, Text, Anchor } from "@mantine/core"
import { FeedbackMessage } from "../../(core)/_components/FeedbackMessageWrapper"
import { IconLock } from "@tabler/icons-react"
import { useResetPasswordForm } from "./_hooks/useResetPasswordForm"
import { useResetPassword } from "./_hooks/useResetPassword"
import { useRouter } from "next/navigation"
import { LOGIN_URL } from "../../(core)/endpoints"
import Link from "next/link"

export const ResetPasswordScreen = () => {
  const router = useRouter()

  /** パスワード変更ハンドル */
  const { resetPassword, isLoading } = useResetPassword({onSuccess: () => {
    router.push(LOGIN_URL) // ログイン画面に遷移する
  }})

  /** パスワード変更フォーム状態 */
  const { register, handleSubmit, formState: { errors } } = useResetPasswordForm()
  
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
          {/* タイトルセクション */}
          <div className="text-center mb-6">
            <Title order={2} className="mb-2">パスワード変更</Title>
            <Text size="sm" c="dimmed">新しいパスワードを入力してください</Text>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit((form) => resetPassword(form))}>
            <div className="flex flex-col gap-4">
              {/* パスワード入力欄 */}
              <PasswordInput
                label="新しいパスワード"
                placeholder="新しいパスワードを入力"
                leftSection={<IconLock size={16} />}
                required
                error={errors.password?.message}
                {...register("password")}
              />
              
              {/* パスワード確認入力欄 */}
              <PasswordInput
                label="パスワード（確認）"
                placeholder="パスワードを再入力"
                leftSection={<IconLock size={16} />}
                required
                error={errors.passwordConfirm?.message}
                {...register("passwordConfirm")}
              />

              {/* 変更ボタン */}
              <Button fullWidth size="md" type="submit" loading={isLoading}>
                パスワードを変更
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
