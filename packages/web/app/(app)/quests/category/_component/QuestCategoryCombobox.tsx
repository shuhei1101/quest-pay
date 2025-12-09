'use client'
import { useQuestCategories } from "@/app/api/quests/category/_hook/useQuestCategories"
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core"

/** タスクステータスコンボボックス */
export const QuestCategoryCombobox = ({ onChanged, currentValue }: {
  onChanged: (val: number | null) => void
  currentValue: number | null
}) => {

  const {questCategories, questCategoryById} = useQuestCategories()

  /** コンボボックスの選択肢 */
  const statusOptions = [
    <Combobox.Option value={"-1"} key={-1}>
      -
    </Combobox.Option>,
    questCategories.map((item) => (
      <Combobox.Option value={item.id.toString()} key={item.id}>
        {item.name}
      </Combobox.Option>
    ))
  ]

  // コンボボックスを初期化する
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  /** コンボボックス選択時 */
  const onOptionalSubmit = (val: string) => {
    const selectedValue = val !== "-1" ? Number(val) : null
    // 変更を通知する
    onChanged(selectedValue)
    // ドロップダウンを閉じる
    combobox.closeDropdown()
  }

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={onOptionalSubmit}
    >
      {/* コンボボックス入力中の設定 */}
      <Combobox.Target>
        <InputBase
          component="button" type="button"
          pointer rightSection={<Combobox.Chevron />} rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()} className="min-w-30 max-w-50"
        >
          {currentValue && questCategoryById ? questCategoryById[String(currentValue)].name : <Input.Placeholder>-</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{statusOptions}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
