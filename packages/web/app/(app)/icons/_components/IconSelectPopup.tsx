"use client"

import { ActionIcon, Button, ColorPicker, Input, Modal, Popover, Space, Tabs, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import { RenderIcon } from "./RenderIcon"
import { useIcons } from "../_hooks/useIcons"
import { devLog } from "@/app/(core)/util"
import { useIconCategories } from "../category/_hook/useIconCategories"
import { IconSelect } from "@/drizzle/schema"

/** アイコン選択ポップアップ */
export const IconSelectPopup = ({opened, close, currentIconId ,setIcon, setColor, currentColor}: {
  opened: boolean,
  close: () => void,
  currentIconId: number,
  setIcon: (id: number) => void,
  setColor: (color: string) => void,
  currentColor: string | null
}) => {
  /** アイコンカテゴリ */
  const { iconCategories } = useIconCategories()
  /** アイコン */
  const { icons } = useIcons()

  /** カラーピッカーの状態 */
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  /** 選択中のアイコン */
  const [selectedIconId, setSelectedIconId] = useState<number | undefined>(undefined)

  // ポップアップ起動時のイベント
  useEffect(() => {
    if (!opened) return
    // 現在の値をセットする
    setSelectedColor(currentColor)
    setSelectedIconId(currentIconId)
  }, [opened])

  /** アイコン選択時のハンドル */
  const onIconSelect = (icon: IconSelect) => {
    setSelectedIconId(icon.id)
  }
  
  /** 確定ボタン押下時のハンドル */
  const onSubmit = () => {
    devLog("選択アイコン: ", {selectedIconId, selectedColor})
    // アイコンをセットする
    setIcon(selectedIconId!)
    // カラーをセットする
    setColor(selectedColor!)
    // 状態をリセットする
    setSelectedIconId(undefined)
    setSelectedColor(null)
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
                  leftSection={<RenderIcon iconName={category.iconName} iconSize={category.iconSize} />}
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
              {icons.filter((icon) => icon.categoryId === category.id).map((icon) => (
                <ActionIcon key={icon.id} variant={selectedIconId === icon.id ? "outline" : "white"} radius="sm" onClick={() => onIconSelect(icon)}>
                  <RenderIcon iconName={icon.name} iconColor={selectedColor} />
                </ActionIcon>
              ))}
            </div>
          </Tabs.Panel>
        )}
      </Tabs>
      <div className="flex justify-end gap-2.5">
        <Popover width={270} position="bottom" withArrow shadow="lg">
          <Popover.Target>
            <Button variant="outline">色変更</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <div className="flex flex-col items-center justify-center">
              <ColorPicker format="rgba" value={selectedColor ?? undefined} onChange={setSelectedColor} />
            </div>
          </Popover.Dropdown>
        </Popover>
        <Button disabled={(currentIconId === selectedIconId && currentColor === selectedColor) || selectedIconId === null} onClick={onSubmit} >確定</Button>
      </div>
    </Modal>
  )
}
