'use client'
import { getTypeName, RawUserType } from "@/app/(user)/_schema/userTypeSchema"
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core"


/** ユーザタイプコンボボックス */
export const UserTypeCombobox = ({ onChanged, currentValue, userTypes }: {
  onChanged: (val: number | undefined) => void
  currentValue: number | undefined
  userTypes: RawUserType[]
}) => {

  // コンボボックスの選択肢を初期化する
  const statusOptions = [
    <Combobox.Option value={"-1"} key={-1}>
      -
    </Combobox.Option>,
    userTypes.map((item) => (
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
    const selectedValue = val !== "-1" ? Number(val) : undefined
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
          onClick={() => combobox.toggleDropdown()} className="w-40"
        >
          {getTypeName(userTypes, currentValue) || <Input.Placeholder>-</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{statusOptions}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
