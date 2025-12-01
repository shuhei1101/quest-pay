'use client'
import { AuthorizedPageLayout } from "@/app/(auth)/_components/AuthorizedPageLayout"
import { ActionIcon, Box, Button, Checkbox, Group, Input, LoadingOverlay, Space, Textarea} from "@mantine/core"
import { DateInput } from '@mantine/dates';
import { FormBackButton } from "@/app/(shared)/_components/FormBackButton"
import { TASKS_URL } from "@/app/(core)/appConstants"
import { IconAt } from "@tabler/icons-react"
import { IconSelectPopup } from '@/app/(shared)/_icon/IconSelectPopup'
import { useDisclosure } from '@mantine/hooks'
import { RenderIcon } from "@/app/(shared)/_icon/_components/RenderIcon";
import { useFamilyCreateForm } from "./_hooks/useFamilyForm"
import { useState } from "react"
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { useFamilySave } from "./_hooks/handleFamilySave";
import { useSession } from "@/app/(auth)/_hooks/useSession";
// dayjs のロケールを日本語に設定
dayjs.locale('ja');

export default function Page() {
  /** ハンドル */
  const { handleSave } = useFamilySave()

  /** セッション情報を取得する */
  const { session, isLoading } = useSession()

  /** アイコン選択ポップアッププロパティ */
  const [popupOpened, { open: openPopup, close: closePopup }] = useDisclosure(false)

  // 家族フォームを取得する
  const { register: familyRegister, errors, setValue: setFamilyValue, watch: watchFamily, isValueChanged, handleSubmit } = useFamilyCreateForm()

  // アイコンセット状態
  const [iconSetter, setIconSetter] = useState<(icon: string) => void>(() => (icon: string) => {})

  if (isLoading) return <div>読み込み中...</div>;
  if (!session) return <div>セッションが存在しません</div>;

  return (
    <>
      <AuthorizedPageLayout title={"家族作成"} 
      actionButtons={<FormBackButton isValueChanged={isValueChanged} previousScreenURL={TASKS_URL} />}>
        <div>

        <Box pos="relative" className="max-w-120">
          {/* 家族入力フォーム */}
          <form onSubmit={handleSubmit((form) => handleSave({form, userId: session?.user.id}))}>
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
                <Input.Wrapper label="家紋" required error={errors.familyIcon?.message}>
                  <div>
                    <ActionIcon variant="outline" radius="xl"
                      onClick={ () => {
                        setIconSetter(() => (icon: string) => setFamilyValue("familyIcon", icon))
                        openPopup()
                      } }>
                      <RenderIcon iconName={watchFamily().familyIcon} />
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
                <Input.Wrapper label="親アイコン" required error={errors.parentIcon?.message}>
                  <div>
                    <ActionIcon variant="outline" radius="xl"
                      onClick={ () => {
                        setIconSetter(() => (icon: string) => setFamilyValue("parentIcon", icon))
                        openPopup()
                      } }>
                      <RenderIcon iconName={watchFamily().parentIcon} />
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
              <Button type="submit" >保存</Button>
            </Group>
          </form>
        </Box>
        </div>
        <IconSelectPopup opened={ popupOpened } close={ closePopup } setIcon={ (icon) => iconSetter(icon) } />
      </AuthorizedPageLayout>
    </>
  )
}
