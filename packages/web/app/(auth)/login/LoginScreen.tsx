"use client"

import { Button, Checkbox, Paper, PasswordInput, TextInput, Title, Text, Anchor } from "@mantine/core"
import { FeedbackMessage } from "../../(core)/_components/FeedbackMessageWrapper"
import { useEffect } from "react"
import { IconMail, IconLock } from "@tabler/icons-react"
import { useLoginForm } from "./_hooks/useLoginForm"
import { useDisclosure } from "@mantine/hooks"
import { LoginTypeSelectPopup } from "./_components/LoginTypeSelectPopup"
import { useLogin } from "./_hooks/useLogin"
import { useRouter } from "next/navigation"
import { FAMILY_QUESTS_URL, QUESTS_URL, SIGNUP_URL } from "../../(core)/endpoints"
import Link from "next/link"
import { devLog } from "@/app/(core)/util"

export const LoginScreen = () => {
  /** セッションストレージを空にする */
  useEffect(() => {
    devLog("セッションストレージをクリア")
    sessionStorage.clear()
  }, [])

  const router = useRouter()

  /** 名前入力ポップアッププロパティ */
  const [popupOpened, { open: openPopup, close: closePopup }] = useDisclosure(false)

  /** ログインハンドル */
  const { login, isLoading } = useLogin({onSuccess: (userInfo) => {
    // ユーザ情報がない場合
    if (!userInfo) {
      openPopup() // タイプ選択ポップアップを表示する
    } else {
      router.push(QUESTS_URL) // ホーム画面に遷移する
    }
  }})

  /** ログインフォーム状態 */
  const { register, handleSubmit, watch, setValue } = useLoginForm()
  
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
          {/* タイトルセクション */}
          <div className="text-center mb-6">
            <Title order={2} className="mb-2">ログイン</Title>
            <Text size="sm" c="dimmed">アカウントにサインインする</Text>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit((form) => login(form))}>
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
                placeholder="パスワードを入力"
                leftSection={<IconLock size={16} />}
                required
                {...register("password")}
              />
              
              {/* ログイン状態保持とパスワード忘れ */}
              <div className="flex items-center justify-between">
                <Checkbox 
                  label="ログイン状態を保持" 
                  checked={watch("rememberMe")}
                  onChange={(event) => setValue("rememberMe", event.currentTarget.checked)}
                />
                <Anchor size="sm">パスワードをお忘れですか？</Anchor>
              </div>

              {/* ログインボタン */}
              <Button fullWidth size="md" type="submit" loading={isLoading}>
                ログイン
              </Button>
              
              {/* 新規登録リンク */}
              <Text size="sm" className="text-center">
                アカウントをお持ちでない場合は <Anchor component={Link} href={SIGNUP_URL}>新規登録</Anchor>
              </Text>
            </div>
          </form>
        </Paper>
      </div>
      
      {/* ポップアップ */}
      <LoginTypeSelectPopup close={closePopup} opened={popupOpened} />
      
      {/* フィードバックメッセージ */}
      <FeedbackMessage />
    </>
  )
}
