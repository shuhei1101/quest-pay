"use client"

import { ActionIcon, Button, ColorPicker, Input, Modal, Popover, Space, Tabs, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import { RenderIcon } from "./RenderIcon"
import { useIcons } from "../_hooks/useIcons"
import { devLog } from "@/app/(core)/util"
import { useIconCategories } from "../category/_hook/useIconCategories"
import { IconSelect } from "@/drizzle/schema"
import { ScrollableTabs, ScrollableTabItem } from "@/app/(core)/_components/ScrollableTabs"
import { useWindow } from "@/app/(core)/useConstants"

/** アイコン選択ポップアップ */
export const IconSelectPopup = ({opened, close, currentIconId ,setIcon, setColor, currentColor}: {
  opened: boolean,
  close: () => void,
  currentIconId: number,
  setIcon: (id: number) => void,
  setColor: (color: string) => void,
  currentColor: string | null
}) => {
  /** テーマ */
  const { isDark } = useWindow()
  /** アイコンカテゴリ */
  const { iconCategories } = useIconCategories()
  /** アイコン */
  const { icons } = useIcons()

  /** カラーピッカーの状態 */
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  /** 選択中のアイコン */
  const [selectedIconId, setSelectedIconId] = useState<number | undefined>(undefined)

  /** アクティブタブ */
  const [activeTab, setActiveTab] = useState<string | null>(iconCategories.at(0)?.name ?? null)

  // ポップアップ起動時のイベント
  useEffect(() => {
    if (!opened) return
    // 現在の値をセットする
    setSelectedColor(currentColor)
    setSelectedIconId(currentIconId)
    setActiveTab(iconCategories.at(0)?.name ?? null)
  }, [opened, iconCategories])

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

  /** タブアイテムを生成する */
  const tabItems: ScrollableTabItem[] = iconCategories.map((category) => ({
    value: category.name,
    label: category.name,
    leftSection: <RenderIcon iconName={category.iconName} iconSize={category.iconSize} />
  }))

  return (
    <Modal opened={opened} onClose={close} title="アイコン選択">
      <ScrollableTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={tabItems}
      >
        {/* カテゴリごとのアイコン一覧 */}
        {iconCategories.map((category) => 
          <Tabs.Panel value={category.name} key={category.id}>
            <div className="flex flex-wrap justify-start gap-3 m-3">
              {icons.filter((icon) => icon.categoryId === category.id).map((icon) => (
                <ActionIcon 
                  key={icon.id} 
                  variant="transparent" 
                  radius="sm" 
                  onClick={() => onIconSelect(icon)}
                  style={{ backgroundColor: selectedIconId === icon.id ? (isDark ? "rgba(0, 0, 0, 0.377)" : "rgba(3, 3, 3, 0.111)") : "transparent" }}
                >
                  <RenderIcon iconName={icon.name} iconColor={selectedColor} />
                </ActionIcon>
              ))}
            </div>
          </Tabs.Panel>
        )}
      </ScrollableTabs>
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
