import { ActionIcon, Anchor, Group, Paper, Switch, Text } from "@mantine/core"
import { IconExternalLink } from "@tabler/icons-react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { useChildren } from "@/app/(app)/children/_hook/useChildren"
import { ChildSettingType } from "../form"
import { CHILD_QUEST_VIEW_URL } from "@/app/(core)/endpoints"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"

/** childSettingsを持つフォーム型 */
export type FormWithChildSettings = {
  childSettings: ChildSettingType[]
}

/** 子供設定コンポーネント */
export const ChildSettings = ({ watch, setValue, familyQuestId }: {
  watch: UseFormWatch<FormWithChildSettings>
  setValue: UseFormSetValue<FormWithChildSettings>
  familyQuestId?: string
}) => {
  /** 子供リストを取得する */
  const { children, isLoading } = useChildren()

  /** 子供の公開フラグを切り替える */
  const toggleChildActivate = (childId: string) => {
    const currentSettings = watch().childSettings
    const existingSetting = currentSettings.find(s => s.childId === childId)
    
    if (existingSetting) {
      // 既存の設定がある場合
      if (!existingSetting.hasQuestChildren && existingSetting.isActivate) {
        // QuestChildrenがなく、ONからOFFにする場合は設定を削除する
        const updatedSettings = currentSettings.filter(setting => setting.childId !== childId)
        setValue("childSettings", updatedSettings)
      } else {
        // それ以外の場合はisActivateを切り替える
        const updatedSettings = currentSettings.map(setting => 
          setting.childId === childId 
            ? { ...setting, isActivate: !setting.isActivate }
            : setting
        )
        setValue("childSettings", updatedSettings)
      }
    } else {
      // 設定がない場合（hasQuestChildren=false）で、スイッチをONにした場合のみ新しい設定を追加
      setValue("childSettings", [...currentSettings, { childId, isActivate: true, hasQuestChildren: false }])
    }
  }

  /** 子供の設定を取得する */
  const getChildSetting = (childId: string): ChildSettingType | undefined => {
    return watch().childSettings.find(s => s.childId === childId)
  }

  if (isLoading) {
    return <Text>読み込み中...</Text>
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl p-4">
      {/* 説明テキスト */}
      <Text size="sm" c="dimmed">
        公開/非公開を切り替えて、子供からの表示を制御できます。
      </Text>

      {/* 全子供リスト */}
      {children.length === 0 ? (
        <Text size="sm" c="dimmed">家族に子供がいません。</Text>
      ) : (
        children.map((child) => {
          const setting = getChildSetting(child.children.id)
          const isActivated = setting?.isActivate ?? false
          const hasQuestChildren = setting?.hasQuestChildren ?? false
          
          return (
            <Paper key={child.children.id} p="md" withBorder>
              <Group justify="space-between" align="center">
                {/* 子供のアイコンと名前 */}
                <Group gap="md">
                  {/* アイコン */}
                  <RenderIcon iconName={child.icons?.name} iconSize={20} color={child.profiles?.iconColor} />
                  
                  {/* 名前 - 子供画面へのリンク */}
                  <Anchor 
                    href={`/children/${child.children.id}`} 
                    size="md"
                    fw={500}
                  >
                    {child.profiles?.name}
                  </Anchor>
                </Group>

                {/* 右側の操作エリア */}
                <Group gap="md">
                  {/* 子供クエスト画面へのリンクアイコン（QuestChildrenがある場合のみ表示） */}
                  {hasQuestChildren && familyQuestId && (
                    <ActionIcon
                      component="a"
                      href={CHILD_QUEST_VIEW_URL(familyQuestId, child.children.id)}
                      variant="subtle"
                      color="blue"
                      title="子供クエスト画面を開く"
                    >
                      <IconExternalLink size={18} />
                    </ActionIcon>
                  )}

                  {/* 公開/非公開スイッチ */}
                  <Switch 
                    label={isActivated ? "公開" : "非公開"}
                    labelPosition="left"
                    checked={isActivated}
                    onChange={() => toggleChildActivate(child.children.id)}
                  />
                </Group>
              </Group>
            </Paper>
          )
        })
      )}
    </div>
  )
}
