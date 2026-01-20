import { ActionIcon, Badge, Box, Button, Checkbox, Group, Input, Menu, NumberInput, Paper, PillsInput, Select, Tabs, Text, Textarea, TextInput } from "@mantine/core"
import { IconAlertCircle, IconCheck, IconCircleCheck, IconCopy, IconLock, IconMinus, IconPlus } from "@tabler/icons-react"
import { LevelDetailForm } from "./LevelDetailForm"
import { LevelCopyButton } from "./LevelCopyButton"
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { modals } from "@mantine/modals"
import { BaseQuestFormType, isDefaultDetail } from "../../../form"
import { useTabAutoScroll, useTabHorizontalScroll } from "@/app/(core)/_hooks/useTabScrollControl"

/** 詳細設定コンポーネント */
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
  register: UseFormRegister<BaseQuestFormType>
  errors: FieldErrors<BaseQuestFormType>
  setValue: UseFormSetValue<BaseQuestFormType>
  watch: UseFormWatch<BaseQuestFormType>
}) => {
  // 表示するレベルのリスト
  const visibleLevels = watch().details.map(d => d.level).sort((a, b) => a - b)

  /** タブの自動スクロール制御 */
  const { tabListRef } = useTabAutoScroll(activeLevel)

  /** タブの横スクロール制御 */
  useTabHorizontalScroll(tabListRef)

  /** レベルを追加する */
  const handleAddLevel = () => {
    if (visibleLevels.length < 5) {
      const nextLevel = Math.max(...visibleLevels) + 1
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
      const lastLevel = Math.max(...visibleLevels)
      const currentDetails = watch().details
      const targetDetail = currentDetails.find(d => d.level === lastLevel)
      
      /** レベルを削除する処理 */
      const executeRemove = () => {
        const newDetails = currentDetails.filter(d => d.level !== lastLevel)
        setValue("details", newDetails)
        
        // アクティブなタブを前のレベルに変更する
        const remainingLevels = newDetails.map(d => d.level).sort((a, b) => a - b)
        setActiveLevel(remainingLevels[remainingLevels.length - 1].toString())
      }
      
      // デフォルト値のままの場合は確認せずに削除する
      if (targetDetail && isDefaultDetail(targetDetail)) {
        executeRemove()
        return
      }
      
      // 入力内容がある場合は確認メッセージを表示する
      modals.openConfirmModal({
        title: "レベル削除の確認",
        children: `レベル${lastLevel}の入力を破棄しますか?`,
        labels: { confirm: "削除", cancel: "キャンセル" },
        confirmProps: { color: "red" },
        onConfirm: executeRemove
      })
    }
  }

  const maxLevel = visibleLevels.length > 0 ? Math.max(...visibleLevels) : 1
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
            <div ref={tabListRef} className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2">
              {visibleLevels.map((level) => {
                const levelStr = level.toString()
                const isCompleted = levels[levelStr]
                
                // 該当レベルのdetailインデックスを取得する
                const detailIndex = watch().details.findIndex(d => d.level === level)
                // 該当レベルにエラーがあるかチェックする
                const hasError = detailIndex !== -1 && errors.details?.[detailIndex]

                return (
                  <Tabs.Tab 
                    key={level} 
                    value={levelStr}
                    data-value={levelStr}
                    rightSection={
                      hasError ? <IconAlertCircle size={14} color="red" /> :
                      isCompleted ? <IconCheck size={14} color="green" /> : 
                      null
                    }
                  >
                    <Group gap={4}>
                      <Text size="sm">レベル {level}</Text>
                      {level === 1 && <Text size="xs" c="red">*</Text>}
                    </Group>
                  </Tabs.Tab>
                )
              })}
            </div>
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
