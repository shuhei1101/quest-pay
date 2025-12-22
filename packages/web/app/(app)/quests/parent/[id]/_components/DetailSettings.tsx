import { ActionIcon, Badge, Box, Button, Checkbox, Group, Input, Menu, NumberInput, Paper, PillsInput, Select, Tabs, Text, Textarea, TextInput } from "@mantine/core"
import { useState } from "react"
import { IconAlertCircle, IconCheck, IconCircleCheck, IconCopy, IconLock, IconMinus, IconPlus } from "@tabler/icons-react"
import { LevelDetailForm } from "./LevelDetailForm"
import { LevelCopyButton } from "./LevelCopyButton"
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { FamilyQuestFormType } from "../form"

export const DetailSettings = ({ 
  activeLevel, 
  setActiveLevel, 
  levels,
  onSave,
  register,
  errors,
  setValue,
  watch
}: { 
  activeLevel: string | null
  setActiveLevel: (v: string | null) => void
  levels: Record<string, boolean>
  onSave: (level: string) => void
  register: UseFormRegister<FamilyQuestFormType>
  errors: FieldErrors<FamilyQuestFormType>
  setValue: UseFormSetValue<FamilyQuestFormType>
  watch: UseFormWatch<FamilyQuestFormType>
}) => {
  // 表示するレベルのリストを管理
  const [visibleLevels, setVisibleLevels] = useState<number[]>([1])

  /** レベルを追加する */
  const handleAddLevel = () => {
    if (visibleLevels.length < 5) {
      const nextLevel = Math.max(...visibleLevels) + 1
      setVisibleLevels([...visibleLevels, nextLevel])
      setActiveLevel(nextLevel.toString())
      
      // 新しいレベルのdetailを追加する
      const currentDetails = watch().details
      setValue("details", [...currentDetails, {
        level: nextLevel,
        successCondition: "",
        requiredClearCount: 1,
        reward: 0,
        childExp: 0,
        requiredCompletionCount: 1,
      }])
    }
  }

  /** レベルを削除する */
  const handleRemoveLevel = () => {
    if (visibleLevels.length > 1) {
      const newLevels = visibleLevels.slice(0, -1)
      setVisibleLevels(newLevels)
      setActiveLevel(newLevels[newLevels.length - 1].toString())
      
      // 最後のレベルのdetailを削除する
      const currentDetails = watch().details
      setValue("details", currentDetails.slice(0, -1))
    }
  }

  const maxLevel = Math.max(...visibleLevels)
  const canAddLevel = maxLevel < 5

  /** レベル詳細をコピーする */
  const handleCopyLevel = (fromLevel: number) => {
    if (!activeLevel) return
    
    const currentLevelNum = parseInt(activeLevel)
    const fromDetail = watch().details.find(d => d.level === fromLevel)
    
    if (fromDetail) {
      const currentDetails = watch().details
      const targetIndex = currentDetails.findIndex(d => d.level === currentLevelNum)
      
      if (targetIndex !== -1) {
        const newDetails = [...currentDetails]
        newDetails[targetIndex] = {
          ...fromDetail,
          level: currentLevelNum
        }
        setValue("details", newDetails)
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Tabs value={activeLevel} onChange={setActiveLevel} variant="outline">
        <Group gap="xs" wrap="nowrap">
          <Tabs.List style={{ flex: 1 }}>
            {visibleLevels.map((level) => {
              const levelStr = level.toString()
              const isCompleted = levels[levelStr]

              return (
                <Tabs.Tab 
                  key={level} 
                  value={levelStr}
                  rightSection={isCompleted ? <IconCheck size={14} color="green" /> : null}
                >
                  <Group gap={4}>
                    <Text size="sm">レベル {level}</Text>
                    {level === 1 && <Text size="xs" c="red">*</Text>}
                  </Group>
                </Tabs.Tab>
              )
            })}
          </Tabs.List>

          {/* タブ操作ボタン */}
          <Group gap="xs">
            {/* コピーボタン */}
            <LevelCopyButton 
              currentLevel={activeLevel}
              visibleLevels={visibleLevels}
              onCopy={handleCopyLevel}
            />

            {/* 削除ボタン(レベル2以上の場合のみ表示) */}
            {visibleLevels.length > 1 && (
              <ActionIcon 
                variant="default" 
                size="lg"
                onClick={handleRemoveLevel}
                title="最後のレベルを削除"
              >
                <IconMinus size={18} />
              </ActionIcon>
            )}

            {/* 追加ボタン(レベル5で無効化) */}
            <ActionIcon 
              variant="default" 
              size="lg"
              onClick={handleAddLevel}
              disabled={!canAddLevel}
              title={canAddLevel ? "新しいレベルを追加" : "最大レベルに達しました"}
            >
              <IconPlus size={18} />
            </ActionIcon>
          </Group>
        </Group>

        {visibleLevels.map((level) => (
          <Tabs.Panel key={level} value={level.toString()} pt="md">
            <LevelDetailForm 
              level={level} 
              onSave={() => onSave(level.toString())}
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          </Tabs.Panel>
        ))}
      </Tabs>

    </div>
  )
}
