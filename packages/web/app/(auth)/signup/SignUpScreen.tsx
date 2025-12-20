"use client"

import { Button, Paper, PasswordInput, TextInput, Title, Text, Anchor, Alert } from "@mantine/core"
import { FeedbackMessage } from "../../(core)/_components/FeedbackMessageWrapper"
import { IconMail, IconLock, IconAlertCircle } from "@tabler/icons-react"
import { useLoginForm } from "../login/_hook/useLoginForm"
import { useSignUp } from "./_hook/useSignUp"
import Link from "next/link"
import { LOGIN_URL } from "@/app/(core)/constants"

export const SignUpScreen = () => {
  /** 新規登録ハンドル */
  const { signUp, isLoading } = useSignUp()

  /** 新規登録フォーム状態 */
  const { register, handleSubmit } = useLoginForm()
  
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
          {/* タイトルセクション */}
          <div className="text-center mb-6">
            <Title order={2} className="mb-2">新規登録</Title>
            <Text size="sm" c="dimmed">クエストペイを始めましょう</Text>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit((form) => signUp(form))}>
            <div className="flex flex-col gap-4">
              {/* メールアドレス入力欄 */}
              <TextInput
                label="メールアドレス"
                placeholder="your-email@example.com"
                leftSection={<IconMail size={16} />}
                required
                {...register("email")}
              />
              {/* パスワード入力欄 */}
              <PasswordInput
                label="パスワード"
                placeholder="6文字以上"
                leftSection={<IconLock size={16} />}
                required
                {...register("password")}
              />

              {/* アラート */}
              <Alert icon={<IconAlertCircle size={16} />} color="blue" className="mt-2">
                登録後、確認メールをお送りします
              </Alert>

              {/* アカウント作成ボタン */}
              <Button fullWidth size="md" className="mt-2" type="submit" loading={isLoading}>
                アカウントを作成
              </Button>
              
              {/* ログインリンク */}
              <Text size="sm" className="text-center">
                すでにアカウントをお持ちの方は <Link href={LOGIN_URL}><Anchor>ログイン</Anchor></Link>
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
