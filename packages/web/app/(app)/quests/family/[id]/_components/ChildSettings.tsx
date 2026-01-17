import { ActionIcon, Anchor, Group, Paper, Switch, Text } from "@mantine/core"
import { IconRefresh, IconUser } from "@tabler/icons-react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { useChildren } from "@/app/(app)/children/_hook/useChildren"
import { ChildSettingType } from "../form"
import { modals } from "@mantine/modals"

/** childSettingsを持つフォーム型 */
export type FormWithChildSettings = {
  childSettings: ChildSettingType[]
}

/** 子供設定コンポーネント */
export const ChildSettings = ({ watch, setValue }: {
  watch: UseFormWatch<FormWithChildSettings>
  setValue: UseFormSetValue<FormWithChildSettings>
}) => {
  /** 子供リストを取得する */
  const { children, isLoading } = useChildren()

  /** 子供の公開フラグを切り替える */
  const toggleChildEnable = (childId: string) => {
    const currentSettings = watch().childSettings
    const existingSetting = currentSettings.find(s => s.childId === childId)
    
    if (existingSetting) {
      // 既存の設定がある場合は、isEnableを切り替える
      const updatedSettings = currentSettings.map(setting => 
        setting.childId === childId 
          ? { ...setting, isEnable: !setting.isEnable }
          : setting
      )
      setValue("childSettings", updatedSettings)
    } else {
      // 設定がない場合は、新しい設定を追加（isEnable=true）
      setValue("childSettings", [...currentSettings, { childId, isEnable: true, hasQuestChildren: false }])
    }
  }

  /** 進捗をリセットする */
  const resetProgress = (childId: string, childName: string) => {
    modals.openConfirmModal({
      title: "進捗リセット",
      children: (
        <Text size="sm">
          {childName}の進捗状況をリセットしますか？<br />
          リセットすると、クエストの進行状況が削除されます。
        </Text>
      ),
      labels: { confirm: "リセット", cancel: "キャンセル" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        // hasQuestChildrenがtrueの設定を削除する（リセット）
        const currentSettings = watch().childSettings
        setValue("childSettings", currentSettings.filter(setting => setting.childId !== childId))
      },
    })
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
        公開/非公開を切り替えて、子供からの表示を制御できます。<br />
        進捗リセットボタンでクエストの進行状況を削除できます。
      </Text>

      {/* 全子供リスト */}
      {children.length === 0 ? (
        <Text size="sm" c="dimmed">家族に子供がいません。</Text>
      ) : (
        children.map((child) => {
          const setting = getChildSetting(child.children.id)
          const isEnabled = setting?.isEnable ?? false
          const hasQuestChildren = setting?.hasQuestChildren ?? false
          
          return (
            <Paper key={child.children.id} p="md" withBorder>
              <Group justify="space-between" align="center">
                {/* 子供のアイコンと名前 */}
                <Group gap="md">
                  <ActionIcon 
                    size="lg" 
                    radius="xl" 
                    variant="filled"
                    style={{ backgroundColor: child.profiles?.iconColor }}
                  >
                    <IconUser size={20} />
                  </ActionIcon>
                  
                  <Anchor 
                    href={`/children/${child.children.id}`} 
                    size="md"
                    fw={500}
                  >
                    {child.profiles?.name}
                  </Anchor>
                </Group>

                {/* 操作ボタン */}
                <Group gap="md">
                  {/* 公開/非公開スイッチ */}
                  <Switch 
                    label={isEnabled ? "公開" : "非公開"}
                    labelPosition="left"
                    checked={isEnabled}
                    onChange={() => toggleChildEnable(child.children.id)}
                  />

                  {/* 進捗リセットボタン（QuestChildrenが存在する場合のみ表示） */}
                  {hasQuestChildren && (
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => resetProgress(child.children.id, child.profiles?.name || "")}
                      title="進捗リセット"
                    >
                      <IconRefresh size={18} />
                    </ActionIcon>
                  )}
                </Group>
              </Group>
            </Paper>
          )
        })
      )}
    </div>
  )
}
