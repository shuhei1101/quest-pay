import { ActionIcon, Button, Input, Modal, Space, Tabs, Text } from "@mantine/core"
import { useEffect } from "react"
import { RenderIcon } from "./_components/RenderIcon"
import { useIcons } from "./_hooks/useIcons"
import { useIconCategories } from "./_hooks/useIconCategories"
import { IconEntityWithCategoriesEntity } from "./_schema/iconSchema"
// import { useTypeSelect } from "../_hooks/useRoleSelect"

/** アイコン選択ポップアップ */
export const IconSelectPopup = ({opened, close, setIcon}: {
  opened: boolean,
  close: () => void,
  setIcon: (icon: string) => void
}) => {
  useEffect(() => {
    // ポップアップ起動時の処理
  }, [opened])

  /* アイコンカテゴリ **/
  const { iconCategories } = useIconCategories()
  /* アイコン **/
  const { icons } = useIcons()

  /** アイコン選択時のハンドル */
  const onIconSelect = (icon: IconEntityWithCategoriesEntity) => {
    // アイコンをセットする
    setIcon(icon.name)
    // ポップアップを閉じる
    close()
  }

  return (
    <Modal opened={opened} onClose={close} title="アイコン選択">
      <Tabs defaultValue={iconCategories.at(0) ? iconCategories.at(0)?.name : ""}>
        {/* アイコンカテゴリ */}
        <Tabs.List>
          {iconCategories.map((category) => {
            return (
                <Tabs.Tab
                  key={category.name}
                  value={category.name}
                  leftSection={<RenderIcon iconName={category.icon_name} size={category.icon_size ?? undefined} />}
                >
                {category.name}
                </Tabs.Tab>
            )
          })}
        </Tabs.List>

        {/* カテゴリごとのアイコン一覧 */}
        {iconCategories.map((category) => 
          <Tabs.Panel value={category.name} key={category.id}>
            <div className="flex flex-wrap justify-start gap-3 m-3">
              {icons.filter((icon) => icon.icon_categories.name === category.name).map((icon) => (
                <ActionIcon key={icon.name} variant="light" radius="sm" onClick={() => onIconSelect(icon)}>
                  <RenderIcon iconName={icon.name} />
                </ActionIcon>
              ))}
            </div>
          </Tabs.Panel>
        )}
      </Tabs>
    </Modal>
  )
}
