import { ActionIcon, Anchor, Box, Group, Paper, Switch, Text } from "@mantine/core"
import { useState } from "react"
import { IconUser } from "@tabler/icons-react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { FamilyQuestFormType } from "../form"
import { useChildren } from "@/app/(app)/children/_hook/useChildren"

export const ChildSettings = ({watch, setValue}: {
  watch: UseFormWatch<FamilyQuestFormType>
  setValue: UseFormSetValue<FamilyQuestFormType>
}) => {
  /** 子供リストを取得する */
  const { children, isLoading } = useChildren()

  /** 子供の公開フラグを切り替える */
  const toggleChild = (childId: string, checked: boolean) => {
    const currentChildIds = watch().childIds
    if (checked) {
      // 追加する
      if (!currentChildIds.includes(childId)) {
        setValue("childIds", [...currentChildIds, childId])
      }
    } else {
      // 削除する
      setValue("childIds", currentChildIds.filter(id => id !== childId))
    }
  }

  if (isLoading) {
    return <Text>読み込み中...</Text>
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl p-4">
      <Text size="sm" c="dimmed">
        クエストを掲載する子供を選択してください。<br />子供の名前をクリックすると、その子供の詳細ページに遷移します。
      </Text>

      {children.map((child) => (
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

            {/* 公開フラグ */}
            <Switch 
              label="公開"
              labelPosition="left"
              checked={watch().childIds.includes(child.children.id)}
              onChange={(e) => toggleChild(child.children.id, e.currentTarget.checked)}
            />
          </Group>
        </Paper>
      ))}
    </div>
  )
}
