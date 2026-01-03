import { ActionIcon, Group, Input, NumberInput, Pill, PillsInput, Select, Switch, Textarea, TextInput } from "@mantine/core"
import { useState } from "react"
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { FamilyQuestFormType } from "../form"
import { useIcons } from "@/app/(app)/icons/_hooks/useIcons"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { QuestCategoryCombobox } from "../../../category/_component/QuestCategoryCombobox"
import { RequiredMark } from "@/app/(core)/_components/RequiredMark"


export const BasicSettings = ({register, errors, setValue, watch, openIconPopup, tagInputValue, setTagInputValue, handleTag, isComposing, setIsComposing}: {
  register: UseFormRegister<FamilyQuestFormType>
  errors: FieldErrors<FamilyQuestFormType>
  setValue: UseFormSetValue<FamilyQuestFormType>
  watch: UseFormWatch<FamilyQuestFormType>
  openIconPopup: () => void
  tagInputValue: string
  setTagInputValue: (value: string) => void
  handleTag: () => void
  isComposing: boolean
  setIsComposing: (value: boolean) => void
}) => {
  const [hasTargetAge, setHasTargetAge] = useState(() => {
    const form = watch()
    return form.ageFrom !== null || form.ageTo !== null
  })
  const [hasPublishedMonth, setHasPublishedMonth] = useState(() => {
    const form = watch()
    return form.monthFrom !== null || form.monthTo !== null
  })

  /** アイコン情報 */
  const { iconById } = useIcons()

  return (
    <div className="flex flex-col gap-4 max-w-lg p-4">
      {/* 家族クエスト名入力 */}
      <div>
        <Input.Wrapper label={<>家族クエスト名 <RequiredMark /></>} error={errors.name?.message}>
          <Input placeholder="例: お皿洗い" {...register("name")} />
        </Input.Wrapper>
      </div>
      
      {/* アイコン選択 */}
      <div>
        <Input.Wrapper label="家族クエストアイコン" error={errors.iconId?.message}>
          <div>
            <ActionIcon
              variant="default"
              radius="xl"
              onClick={openIconPopup}
            >
              <RenderIcon 
                iconName={iconById && iconById[watch().iconId]?.name} 
                iconSize={iconById && iconById[watch().iconId]?.size}
                color={watch().iconColor}
              />
            </ActionIcon>
          </div>
        </Input.Wrapper>
      </div>

      {/* カテゴリ選択リストボックス */}
      <Input.Wrapper label="カテゴリ" error={errors.categoryId?.message}>
        <QuestCategoryCombobox
          currentValue={watch().categoryId}
          onChanged={(id: number | null) => setValue("categoryId", id)}
        />
      </Input.Wrapper>

      {/* タグ選択 */}
      <div>
        <PillsInput label="タグ"
        description={"条件絞り込みで使用"}
        error={errors.tags?.message}>
          <Pill.Group>
            {watch().tags.map((tag) => (
              <Pill key={tag} withRemoveButton onRemove={() => {
                setValue("tags", watch().tags.filter((t) => t !== tag))
              }}>{tag}</Pill>
            ))}
            <PillsInput.Field placeholder="タグを追加"
              value={tagInputValue}
              onChange={(e) => setTagInputValue(e.target.value)}
              onBlur={() => handleTag()}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isComposing) {
                  e.preventDefault()
                  handleTag()
                }
              }}
            />
          </Pill.Group>
        </PillsInput>
      </div>

      <TextInput label="依頼者氏名" placeholder="例: お母さん" {...register("client")} />

      <Textarea 
        label="依頼詳細" 
        placeholder="クエストの詳しい説明を記入してください"
        autosize
        minRows={3}
        error={errors.requestDetail?.message}
        {...register("requestDetail")}
      />

      <div className="w-fit">
        <Switch 
          label="対象年齢を設定する" 
          checked={hasTargetAge}
          onChange={(e) => {
            const checked = e.currentTarget.checked
            setHasTargetAge(checked)
            if (!checked) {
              setValue("ageFrom", null)
              setValue("ageTo", null)
            }
          }}
        />
      </div>

      {hasTargetAge && (
        <Group grow>
          <NumberInput 
            label="対象年齢(開始)" 
            placeholder="例: 5" 
            min={0} 
            suffix="歳"
            value={watch().ageFrom ?? undefined}
            onChange={(value) => setValue("ageFrom", typeof value === "number" ? value : null)}
            error={errors.ageFrom?.message}
          />
          <NumberInput 
            label="対象年齢(終了)" 
            placeholder="例: 12" 
            min={0} 
            suffix="歳"
            value={watch().ageTo ?? undefined}
            onChange={(value) => setValue("ageTo", typeof value === "number" ? value : null)}
            error={errors.ageTo?.message}
          />
        </Group>
      )}

      <div className="w-fit">
        <Switch
          label="公開月を指定する" 
          checked={hasPublishedMonth}
          onChange={(e) => {
            const checked = e.currentTarget.checked
            setHasPublishedMonth(checked)
            if (!checked) {
              setValue("monthFrom", null)
              setValue("monthTo", null)
            }
          }}
        />
      </div>

      {hasPublishedMonth && (
        <Group grow>
          <Select 
            label="公開開始月" 
            placeholder="月を選択"
            data={[
              { value: '1', label: '1月' },
              { value: '2', label: '2月' },
              { value: '3', label: '3月' },
              { value: '4', label: '4月' },
              { value: '5', label: '5月' },
              { value: '6', label: '6月' },
              { value: '7', label: '7月' },
              { value: '8', label: '8月' },
              { value: '9', label: '9月' },
              { value: '10', label: '10月' },
              { value: '11', label: '11月' },
              { value: '12', label: '12月' },
            ]}
            value={watch().monthFrom?.toString() ?? null}
            onChange={(value) => setValue("monthFrom", value ? parseInt(value) : null)}
            error={errors.monthFrom?.message}
          />
          <Select 
            label="公開終了月" 
            placeholder="月を選択"
            data={[
              { value: '1', label: '1月' },
              { value: '2', label: '2月' },
              { value: '3', label: '3月' },
              { value: '4', label: '4月' },
              { value: '5', label: '5月' },
              { value: '6', label: '6月' },
              { value: '7', label: '7月' },
              { value: '8', label: '8月' },
              { value: '9', label: '9月' },
              { value: '10', label: '10月' },
              { value: '11', label: '11月' },
              { value: '12', label: '12月' },
            ]}
            value={watch().monthTo?.toString() ?? null}
            onChange={(value) => setValue("monthTo", value ? parseInt(value) : null)}
            error={errors.monthTo?.message}
          />
        </Group>
      )}
    </div>
  )
}
