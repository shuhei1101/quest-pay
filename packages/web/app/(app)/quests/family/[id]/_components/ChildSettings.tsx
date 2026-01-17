import { ActionIcon, Anchor, Button, Group, Paper, Switch, Text } from "@mantine/core"
import { IconPlus, IconTrash, IconUser } from "@tabler/icons-react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { useChildren } from "@/app/(app)/children/_hook/useChildren"
import { ChildSettingType } from "../form"
import { modals } from "@mantine/modals"
import { useState } from "react"

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

  /** 子供追加モーダル表示状態 */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  /** 子供の公開フラグを切り替える */
  const toggleChildActivate = (childId: string) => {
    const currentSettings = watch().childSettings
    const updatedSettings = currentSettings.map(setting => 
      setting.childId === childId 
        ? { ...setting, isActivate: !setting.isActivate }
        : setting
    )
    setValue("childSettings", updatedSettings)
  }

  /** 子供を削除する */
  const removeChild = (childId: string) => {
    modals.openConfirmModal({
      title: "子供を削除",
      children: (
        <Text size="sm">
          この子供をクエストから削除しますか？<br />
          削除すると、進捗状況もリセットされます。
        </Text>
      ),
      labels: { confirm: "削除", cancel: "キャンセル" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        const currentSettings = watch().childSettings
        setValue("childSettings", currentSettings.filter(setting => setting.childId !== childId))
      },
    })
  }

  /** 子供を追加する */
  const addChild = (childId: string) => {
    const currentSettings = watch().childSettings
    if (!currentSettings.some(setting => setting.childId === childId)) {
      setValue("childSettings", [...currentSettings, { childId, isActivate: true }])
    }
  }

  /** 割り当て済みの子供リストを取得する */
  const assignedChildren = children.filter(child => 
    watch().childSettings.some(setting => setting.childId === child.children.id)
  )

  /** 未割り当ての子供リストを取得する */
  const unassignedChildren = children.filter(child => 
    !watch().childSettings.some(setting => setting.childId === child.children.id)
  )

  if (isLoading) {
    return <Text>読み込み中...</Text>
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl p-4">
      {/* 説明テキスト */}
      <Text size="sm" c="dimmed">
        クエストを割り当てる子供を追加してください。<br />
        公開/非公開を切り替えて、子供からの表示を制御できます。
      </Text>

      {/* 子供追加ボタン */}
      {unassignedChildren.length > 0 && (
        <Button
          leftSection={<IconPlus size={16} />}
          variant="light"
          onClick={() => setIsAddModalOpen(!isAddModalOpen)}
        >
          子供を追加
        </Button>
      )}

      {/* 未割り当ての子供リスト（追加モーダル） */}
      {isAddModalOpen && unassignedChildren.length > 0 && (
        <Paper p="md" withBorder style={{ backgroundColor: "#f8f9fa" }}>
          <Text size="sm" fw={500} mb="sm">追加可能な子供</Text>
          <div className="flex flex-col gap-2">
            {unassignedChildren.map((child) => (
              <Paper key={child.children.id} p="sm" withBorder>
                <Group justify="space-between" align="center">
                  {/* 子供のアイコンと名前 */}
                  <Group gap="md">
                    <ActionIcon 
                      size="md" 
                      radius="xl" 
                      variant="filled"
                      style={{ backgroundColor: child.profiles?.iconColor }}
                    >
                      <IconUser size={16} />
                    </ActionIcon>
                    <Text size="sm">{child.profiles?.name}</Text>
                  </Group>

                  {/* 追加ボタン */}
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => addChild(child.children.id)}
                  >
                    追加
                  </Button>
                </Group>
              </Paper>
            ))}
          </div>
        </Paper>
      )}

      {/* 割り当て済みの子供リスト */}
      {assignedChildren.length === 0 ? (
        <Text size="sm" c="dimmed">まだ子供が割り当てられていません。</Text>
      ) : (
        assignedChildren.map((child) => {
          const setting = watch().childSettings.find(s => s.childId === child.children.id)
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
                    label={setting?.isActivate ? "公開" : "非公開"}
                    labelPosition="left"
                    checked={setting?.isActivate !== false}
                    onChange={() => toggleChildActivate(child.children.id)}
                  />

                  {/* 削除ボタン */}
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => removeChild(child.children.id)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>
          )
        })
      )}
    </div>
  )
}
