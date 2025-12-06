"use client"

import { Box, Button, Center, Fieldset, PasswordInput, Tabs, TextInput, Title } from "@mantine/core"
import { FeedbackMessageWrapper } from "../(core)/_components/FeedbackMessageWrapper"
import { useState, useEffect } from "react"
import { IconDualScreen, IconDualScreenFilled } from "@tabler/icons-react"
import { useLogin } from "./_hooks/useLogin"
import { useSignUp } from "./_hooks/useSignUp"
import { useLoginForm } from "./_hooks/useLoginForm"
import { LoginTypeSelectPopup } from "./_components/LoginTypeSelectPopup"
import { useDisclosure } from "@mantine/hooks"

const guest = {
  email: process.env.NEXT_PUBLIC_GUEST_EMAIL ?? "",
  pass: process.env.NEXT_PUBLIC_GUEST_PASS ?? ""
}

export default function Page() {
  /** セッションストレージを空にする */
  useEffect(() => {
    sessionStorage.clear()
  }, [])

  /** ハンドラ */
  const { handleLogin, userId } = useLogin()
  const { handleSignUp } = useSignUp()

  /** 名前入力ポップアッププロパティ */
  const [popupOpened, { open: openPopup, close: closePopup }] = useDisclosure(false)

  // 新規登録かサインインかを判定する状態
  const [isLogin, setIsLogin] = useState<boolean>(true)

  // ログインフォームを取得する
  const { register, handleSubmit } = useLoginForm()

  // ゲストでログイン押下時のハンドル
  const handleGuestLogin = () => {
    handleLogin({
      form: {email: guest.email, password: guest.pass},
      onSuccess: () => openPopup()
    })
  }

  return (
    <FeedbackMessageWrapper>
      <div className="h-screen flex flex-col items-center justify-center p-2">
        {/* 入力欄の背景 */}
        <Box className="w-full" maw={700} mih={350}
          style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            borderRadius: '8px'
          }}
        >
          <Center p="md" className="flex flex-col gap-5">
            {/* タイトル */}
            <Title order={1} c={"white"}>クエストペイ</Title>
            <form method="POST" onSubmit={handleSubmit((form) => isLogin ? handleLogin({form, onSuccess: () => openPopup()}) : handleSignUp(form))}>
              {/* タブ */}
              <Tabs defaultValue="ログイン" variant="outline">
                <Tabs.List>
                  <Tabs.Tab value="ログイン" leftSection={<IconDualScreen size={14} color="white"  />} 
                  onClick={() => setIsLogin(true)}>
                    <p className="text-white font-bold">ログイン</p>
                  </Tabs.Tab>
                  <Tabs.Tab value="新規登録" leftSection={<IconDualScreenFilled size={14} color="white" />} 
                  onClick={() => setIsLogin(false)}>
                    <p className="text-white font-bold">新規登録</p>
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
              {/* 入力フォーム */}
              <Fieldset legend="" w={300}>
                <TextInput required label="メールアドレス" type="email" {...register("email")} />
                <PasswordInput required
                  label="パスワード"
                  placeholder="6文字以上"
                  {...register("password")}
                  />
              </Fieldset>
              <div className="m-3" />
              {/* サブミットボタン */}
              <div className="flex justify-end gap-5 w-full">
                <Button onClick={handleGuestLogin} variant="default" bg={"yellow"}>ゲストログイン</Button>
                <Button type="submit" variant="default">続行</Button>
              </div>
            </form>
          </Center>
        </Box>
      </div>
      <LoginTypeSelectPopup close={closePopup} opened={popupOpened} />
    </FeedbackMessageWrapper>
  )
}
