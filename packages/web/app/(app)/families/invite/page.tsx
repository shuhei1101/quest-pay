'use client'

import { ActionIcon, Box, Text, Button, Checkbox, Group, Input, Loader, LoadingOverlay, Pill, PillsInput, Space, Textarea, CopyButton, Tooltip, TextInput} from "@mantine/core"
import { IconCheck, IconCopy } from "@tabler/icons-react"
import { useState } from "react"
import { useFamilyInviteForm } from "./_hook/useFamilyInviteForm"
import { useSendInviteMail } from "./_hook/useSendInviteMail"

/** 家族招待コード */
export default function Page() {

  const [email, setEmail] = useState("")

  const { register, handleSubmit, errors } = useFamilyInviteForm()

  const { sendInviteMail } = useSendInviteMail()

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* 家族招待コード */}
        <Input.Wrapper label="あなたの家族招待コード" aria-readonly description="招待したいユーザに送ってください" >
        <div className="flex gap-3 items-center">
          <Input readOnly value={""}/>
            <CopyButton value="https://mantine.dev" timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'コピーしました！' : 'コピー'} withArrow position="right">
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
        </div>
        </Input.Wrapper>
        <form onSubmit={handleSubmit((form) => sendInviteMail())} className="flex flex-col gap-3">
          <TextInput label="招待コードを送信" description="メールで送信することも可能です"
            placeholder="メールアドレスを入力"
            type="email" {...register("email")} error={errors.email?.message} />
            <div>
              <Button type="submit" size="md">送信</Button>
            </div>
        </form>
      </div>

    </>
  )
}
