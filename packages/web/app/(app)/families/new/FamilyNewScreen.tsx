'use client'
import { ActionIcon, Box, Button, Checkbox, Group, Input, LoadingOverlay, Space, Textarea} from "@mantine/core"
import { DateInput } from '@mantine/dates'
import { IconAt } from "@tabler/icons-react"
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { useRegisterFamily } from "./_hooks/useRegisterFamily"
import { useFamilyRegisterForm } from "./_hooks/useFamilyRegisterForm"
import { RenderIcon } from "../../icons/_components/RenderIcon"
import { IconSelectPopup } from "../../icons/_components/IconSelectPopup"
import { useIcons } from "../../icons/_hooks/useIcons"
// dayjs のロケールを日本語に設定
dayjs.locale('ja')

/** 家族新規登録画面 */
export const FamilyNewScreen = () => {
  /** ハンドル */
  const { handleRegister } = useRegisterFamily()

  /** アイコン情報 */
  const { iconById } = useIcons()
  
  /** 家族アイコン選択ポップアッププロパティ */
  const [familyIconOpened, { open: openFamilyIcon, close: closeFamilyIcon }] = useDisclosure(false)
  /** 親アイコン選択ポップアッププロパティ */
  const [parentIconOpened, { open: openParentIcon, close: closeParentIcon }] = useDisclosure(false)

  // 家族フォームを取得する
  const { register: familyRegister, errors, setValue: setFamilyValue, watch: watchFamily, isValueChanged, handleSubmit } = useFamilyRegisterForm()

  return (
    <>
        <div>
        <Box pos="relative" className="max-w-120">
          {/* 家族入力フォーム */}
          <form onSubmit={handleSubmit((form) => handleRegister({form}))}>
            {/* 入力欄のコンテナ */}
            <div className="flex flex-col gap-2">
              {/* ローカル家族名入力欄 */}
              <div>
                <Input.Wrapper label="家族名" 
                  description="家族にのみ表示されます。"
                  required error={errors.localName?.message}>
                  <Input className="max-w-120" {...familyRegister("localName")} />
                </Input.Wrapper>
              </div>
              {/* オンライン家族名入力欄 */}
              <div>
                <Input.Wrapper label="オンライン家族名"
                  description="世界中に公開されます。"
                   error={errors.onlineName?.message}>
                  <Input className="max-w-120" {...familyRegister("onlineName")} />
                </Input.Wrapper>
              </div>
              {/* ID入力欄 */}
              <div>
                <Input.Wrapper label="家族ID" required error={errors.displayId?.message}>
                  <Input leftSection={<IconAt size={16} />} className="max-w-120" {...familyRegister("displayId")} />
                </Input.Wrapper>
              </div>
              {/* 家紋選択欄 */}
              <div>
                <Input.Wrapper label="家紋" required error={errors.familyIconId?.message}>
                  <div>
                    <ActionIcon variant="outline" radius="xl"
                      onClick={ () => openFamilyIcon() }>
                      <RenderIcon 
                        iconName={iconById && iconById[watchFamily().familyIconId].name}
                        iconSize={iconById && iconById[watchFamily().familyIconId].size}
                        iconColor={watchFamily().familyIconColor}
                      />
                    </ActionIcon>
                  </div>
                </Input.Wrapper>
              </div>
              {/* 親名入力欄 */}
              <div>
                <Input.Wrapper label="親の名前" required error={errors.parentName?.message}
                description="あなたの名前を入力してください。">
                  <Input className="max-w-120" {...familyRegister("parentName")} />
                </Input.Wrapper>
              </div>
              {/* 親アイコン選択欄 */}
              <div>
                <Input.Wrapper label="親アイコン" required error={errors.parentIconId?.message}>
                  <div>
                    <ActionIcon variant="outline" radius="xl"
                      onClick={ () => openParentIcon() }>
                      <RenderIcon 
                        iconName={iconById && iconById[watchFamily().parentIconId].name}
                        iconSize={iconById && iconById[watchFamily().parentIconId].size}
                        iconColor={watchFamily().parentIconColor}
                      />
                    </ActionIcon>
                  </div>
                </Input.Wrapper>
              </div>
              {/* 親の誕生日欄 */}
              <div>
                <Input.Wrapper label="誕生日" required error={errors.parentBirthday?.message}>
                  <DateInput
                    value={watchFamily().parentBirthday ? new Date(watchFamily().parentBirthday) : null}
                    onChange={(value) => setFamilyValue("parentBirthday", value ?? "" )}
                    locale="ja"
                  />
                </Input.Wrapper>
              </div>
            </div>
            <Space h="md" />
            {/* サブミットボタン */}
            <Group>
              <Button type="submit" variant="gradient" >保存</Button>
            </Group>
          </form>
        </Box>
        </div>
      {/* 家族アイコン選択ポップアップ */}
      <IconSelectPopup opened={ familyIconOpened } close={ closeFamilyIcon } 
        setIcon={ () => (iconId: number) => setFamilyValue("familyIconId", iconId) }
        setColor={ () => (iconColor: string) => setFamilyValue("familyIconColor", iconColor) }
        currentIconId={watchFamily().familyIconId} 
        currentColor={watchFamily().familyIconColor} 
      />
      {/* 親アイコン選択ポップアップ */}
      <IconSelectPopup opened={ parentIconOpened } close={ closeParentIcon } 
        setIcon={ () => (iconId: number) => setFamilyValue("parentIconId", iconId) }
        setColor={ () => (iconColor: string) => setFamilyValue("parentIconColor", iconColor) }
        currentIconId={watchFamily().parentIconId} 
        currentColor={watchFamily().parentIconColor} 
      />
    </>
  )
}
