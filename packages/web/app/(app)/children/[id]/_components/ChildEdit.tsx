'use client'
import { ActionIcon, Box, Button, Checkbox, Group, Input, LoadingOverlay, Space, Textarea} from "@mantine/core"
import { DateInput } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { useState } from "react"
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { useRegisterChild } from "../_hook/useRegisterChild"
import { useIcons } from "@/app/(app)/icons/_hooks/useIcons"
import { useChildForm } from "../_hook/useChildForm"
import { devLog } from "@/app/(core)/util"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { IconSelectPopup } from "@/app/(app)/icons/_components/IconSelectPopup"
// dayjs のロケールを日本語に設定
dayjs.locale('ja')

/** 子供フォーム */
export const ChildForm = ( params: {
  id?: string
}) => {
  /** 子供ID */
  const [id, setId] = useState<string | undefined>(params.id)

  /** ハンドル */
  const { handleRegister, isLoading: isSubmitting } = useRegisterChild({setId})

  /** アイコン情報 */
  const { iconById } = useIcons()
  
  /** 子供アイコン選択ポップアッププロパティ */
  const [childIconOpened, { open: openChildIcon, close: closeChildIcon }] = useDisclosure(false)

  /** 元に戻すハンドル */
  const handleReset = () => {
    if (!window.confirm('入力内容を元に戻します。よろしいですか？')) return
    setForm(fetchedChild)
  }

  // 子供登録フォームを取得する
  const { register: childRegister, errors, setValue: setChildValue, watch: watchChild, isValueChanged, handleSubmit, setForm, isLoading, fetchedChild } = useChildForm({childId: id})

  return (
    <>
        <div>
        <Box pos="relative" className="max-w-120">
          {/* ロード中のオーバーレイ */}
          <LoadingOverlay visible={isLoading || isSubmitting} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
          {/* 子供入力フォーム */}
          <form onSubmit={handleSubmit((form) => handleRegister({form}))}>
            {/* 入力欄のコンテナ */}
            <div className="flex flex-col gap-2">
              {/* 子供名入力欄 */}
              <div>
                <Input.Wrapper label="子供の名前" required error={errors.name?.message}
                description="あなたの名前を入力してください。">
                  <Input className="max-w-120" {...childRegister("name")} />
                </Input.Wrapper>
              </div>
              {/* 子供アイコン選択欄 */}
              <div>
                <Input.Wrapper label="子供アイコン" required error={errors.iconId?.message}>
                  <div>
                    <ActionIcon variant="outline" radius="xl"
                      onClick={ () => openChildIcon() }>
                      <RenderIcon 
                        iconName={iconById && iconById[watchChild().iconId].name}
                        iconSize={iconById && iconById[watchChild().iconId].size}
                        iconColor={watchChild().iconColor}
                      />
                    </ActionIcon>
                  </div>
                </Input.Wrapper>
              </div>
              {/* 子供の誕生日欄 */}
              <div>
                <Input.Wrapper label="誕生日" required error={errors.birthday?.message}>
                  <DateInput
                    value={watchChild().birthday ? new Date(watchChild().birthday) : null}
                    onChange={(value) => setChildValue("birthday", value ?? "" )}
                    locale="ja"
                  />
                </Input.Wrapper>
              </div>
            </div>
            <Space h="md" />
            {/* サブミットボタン */}
            <Group justify="space-between">
              {/* 左側のボタン */}
              <Group>
                {id && (
                  <Button 
                    color="gray.6" 
                    onClick={handleReset} 
                    disabled={!isValueChanged}
                  >
                    元に戻す
                  </Button>
                )}
              </Group>
              {/* 右側のボタン */}
              <Group>
                <Button type="submit" variant="gradient" loading={isSubmitting} disabled={isLoading || isSubmitting}>保存</Button>
              </Group>
            </Group>
          </form>
        </Box>
        </div>
      {/* 子供アイコン選択ポップアップ */}
      <IconSelectPopup opened={ childIconOpened } close={ closeChildIcon }
        setIcon={ (iconId: number) => setChildValue("iconId", iconId) }
        setColor={ (iconColor: string) => setChildValue("iconColor", iconColor) }
        currentIconId={watchChild().iconId ?? 0}
        currentColor={watchChild().iconColor ?? null}
      />
    </>
  )
}
