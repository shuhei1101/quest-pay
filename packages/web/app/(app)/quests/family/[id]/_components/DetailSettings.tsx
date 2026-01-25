import { ActionIcon, Badge, Box, Button, Checkbox, Group, Input, Menu, NumberInput, Paper, PillsInput, Select, Tabs, Text, Textarea, TextInput } from "@mantine/core"
import { IconAlertCircle, IconCheck, IconCircleCheck, IconCopy, IconLock, IconMinus, IconPlus } from "@tabler/icons-react"
import { LevelDetailForm } from "./LevelDetailForm"
import { LevelCopyButton } from "./LevelCopyButton"
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { modals } from "@mantine/modals"
import { BaseQuestFormType, isDefaultDetail } from "../../../form"
import { ScrollableTabs, ScrollableTabItem } from "@/app/(core)/_components/ScrollableTabs"

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

  /** タブアイテムを生成する */
  const tabItems: ScrollableTabItem[] = visibleLevels.map((level) => {
    const levelStr = level.toString()
    const isCompleted = levels[levelStr]
    
    // 該当レベルのdetailインデックスを取得する
    const detailIndex = watch().details.findIndex(d => d.level === level)
    // 該当レベルにエラーがあるかチェックする
    const hasError = detailIndex !== -1 && errors.details?.[detailIndex]

    return {
      value: levelStr,
      label: (
        <Group gap={4} wrap="nowrap">
          <Text size="sm">レベル {level}</Text>
          {level === 1 && <Text size="xs" c="red">*</Text>}
        </Group>
      ),
      rightSection: hasError ? <IconAlertCircle size={14} color="red" /> :
                    isCompleted ? <IconCheck size={14} color="green" /> : 
                    null
    }
  })

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
    <div className="flex flex-col gap-4" style={{ height: '100%' }}>
      <Tabs value={activeLevel} onChange={setActiveLevel} variant="outline" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* レベルタブヘッダー（固定） */}
        <div className="px-4 pt-4">
          <Group gap="xs" wrap="nowrap" style={{ alignItems: 'flex-start' }}>
            {/* レベルタブ（スクロール可能領域） */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <ScrollableTabs
                value={activeLevel}
                onChange={setActiveLevel}
                items={tabItems}
              >
                {/* タブパネルコンテンツはここでは表示しない（下で別途表示） */}
                <></>
              </ScrollableTabs>
            </div>

            {/* タブ操作ボタン（固定） */}
            <Group gap="xs" style={{ flexShrink: 0 }}>
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
        </div>

        {/* タブパネルコンテンツ（スクロール可能） */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {visibleLevels.map((level) => (
            <Tabs.Panel key={level} value={level.toString()} p="md">
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
        </div>
      </Tabs>
    </div>
  )
}
