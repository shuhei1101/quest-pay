import { Box, Button, Checkbox, Group, Input, NumberInput, Paper, PillsInput, Select, Tabs, Text, Textarea, TextInput } from "@mantine/core"
import { useState } from "react"
import { IconCircleCheck, IconLock } from "@tabler/icons-react"
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { FamilyQuestFormType } from "../form"


export const LevelDetailForm = ({ level, onSave, register, errors, setValue, watch }: { 
  level: number
  onSave: () => void
  register: UseFormRegister<FamilyQuestFormType>
  errors: FieldErrors<FamilyQuestFormType>
  setValue: UseFormSetValue<FamilyQuestFormType>
  watch: UseFormWatch<FamilyQuestFormType>
}) => {
  /** 現在のレベルのdetailインデックスを取得する */
  const detailIndex = watch().details.findIndex(d => d.level === level)
  
  if (detailIndex === -1) return null

  const detail = watch().details[detailIndex]

  /** detailの値を更新する */
  const updateDetail = (field: keyof FamilyQuestFormType["details"][number], value: any) => {
    const newDetails = [...watch().details]
    newDetails[detailIndex] = { ...newDetails[detailIndex], [field]: value }
    setValue("details", newDetails)
  }

  return (
    <Paper className="flex flex-col gap-3 max-w-lg" p="md" withBorder>
      <Text fw={700} size="lg">レベル {level} の設定</Text>
      
      <div className="flex flex-col gap-2">
        <Textarea 
          label="成功条件" 
          placeholder="例: お皿を割らずに洗う" 
          required 
          autosize
          minRows={2}
          value={detail.successCondition}
          onChange={(e) => updateDetail("successCondition", e.target.value)}
          error={errors.details?.[detailIndex]?.successCondition?.message}
        />

        <Group grow>
          <NumberInput 
            label="目標回数" 
            description="成功条件を何回達成したらクリアか"
            value={detail.requiredClearCount}
            onChange={(value) => updateDetail("requiredClearCount", typeof value === "number" ? value : 1)}
            min={1} 
            suffix="回" 
            required
            error={errors.details?.[detailIndex]?.requiredClearCount?.message}
          />
          <NumberInput 
            label="報酬額" 
            description="クリア時に獲得できるお小遣い額"
            value={detail.reward}
            onChange={(value) => updateDetail("reward", typeof value === "number" ? value : 0)}
            min={0} 
            prefix="¥" 
            required
            error={errors.details?.[detailIndex]?.reward?.message}
          />
        </Group>

        <Group grow>
          <NumberInput 
            label="獲得経験値 (子供)" 
            description="クエストクリア時に子供が獲得する経験値"
            value={detail.childExp}
            onChange={(value) => updateDetail("childExp", typeof value === "number" ? value : 0)}
            min={0} 
            suffix="exp"
            error={errors.details?.[detailIndex]?.childExp?.message}
          />
        </Group>
          <NumberInput 
            label="次レベルまでに必要なクエストクリア回数" 
            description="クエストクリア時にクエストが獲得する経験値"
            value={detail.requiredCompletionCount}
            onChange={(value) => updateDetail("requiredCompletionCount", typeof value === "number" ? value : 0)}
            min={0} 
            suffix="exp"
            error={errors.details?.[detailIndex]?.requiredCompletionCount?.message}
          />
      </div>
    </Paper>
  )
}
