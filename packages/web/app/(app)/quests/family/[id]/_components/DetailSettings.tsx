import { ActionIcon, Badge, Box, Button, Checkbox, Group, Input, Menu, NumberInput, Paper, PillsInput, Select, Tabs, Text, Textarea, TextInput } from "@mantine/core"
import { IconAlertCircle, IconCheck, IconCircleCheck, IconCopy, IconLock, IconMinus, IconPlus } from "@tabler/icons-react"
import { LevelDetailForm } from "./LevelDetailForm"
import { LevelCopyButton } from "./LevelCopyButton"
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { modals } from "@mantine/modals"
import { BaseQuestFormType, isDefaultDetail } from "../../../form"
import { ScrollableTabs, ScrollableTabItem } from "@/app/(core)/_components/ScrollableTabs"
import { useWindow } from "@/app/(core)/useConstants"

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
  // モバイル判定
  const { isMobile } = useWindow()
  
  // 表示するレベルのリスト
  const visibleLevels = watch().details.map(d => d.level).sort((a, b) => a - b)

  /** レベルを追加する */
  const handleAddLevel = () => {
    if (visibleLevels.length < 5 && activeLevel) {
      const currentLevel = parseInt(activeLevel)
      const newLevel = currentLevel + 1
      
      // 現在のレベルより大きいレベルを+1して繰り上げる
      const currentDetails = watch().details
      const updatedDetails = currentDetails.map(d => 
        d.level > currentLevel ? { ...d, level: d.level + 1 } : d
      )
      
      // 新しいレベルを挿入する
      const willBeMaxLevel = newLevel >= 5
      const newDetail = {
        level: newLevel,
        successCondition: "",
        requiredClearCount: willBeMaxLevel ? null : 1,
        reward: 0,
        childExp: 0,
        requiredCompletionCount: 1,
      }
      
      setValue("details", [...updatedDetails, newDetail].sort((a, b) => a.level - b.level))
      setActiveLevel(newLevel.toString())
    }
  }

  /** レベルを削除する */
  const handleRemoveLevel = () => {
    if (visibleLevels.length > 1 && activeLevel) {
      const currentLevel = parseInt(activeLevel)
      const currentDetails = watch().details
      const targetDetail = currentDetails.find(d => d.level === currentLevel)
      
      /** レベルを削除する処理 */
      const executeRemove = () => {
        // 現在のレベルを削除し、それ以降のレベルを-1する
        const newDetails = currentDetails
          .filter(d => d.level !== currentLevel)
          .map(d => d.level > currentLevel ? { ...d, level: d.level - 1 } : d)
          .sort((a, b) => a.level - b.level)
        
        setValue("details", newDetails)
        
        // アクティブなタブを適切に設定する
        // 削除したレベルより前のレベルがあればそちらに、なければ次のレベル（繰り下げ後）に移動
        const remainingLevels = newDetails.map(d => d.level).sort((a, b) => a - b)
        const newActiveLevel = remainingLevels.find(l => l < currentLevel) ?? remainingLevels[0]
        setActiveLevel(newActiveLevel.toString())
      }
      
      // デフォルト値のままの場合は確認せずに削除する
      if (targetDetail && isDefaultDetail(targetDetail)) {
        executeRemove()
        return
      }
      
      // 入力内容がある場合は確認メッセージを表示する
      modals.openConfirmModal({
        title: "レベル削除の確認",
        children: `レベル${currentLevel}の入力を破棄しますか?`,
        labels: { confirm: "削除", cancel: "キャンセル" },
        confirmProps: { color: "red" },
        onConfirm: executeRemove
      })
    }
  }

  const maxLevel = visibleLevels.length > 0 ? Math.max(...visibleLevels) : 1
  const canAddLevel = visibleLevels.length < 5

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

  /** レベル操作ボタン群 */
  const levelActionButtons = (
    <Group gap="xs" style={{ flexShrink: 0 }}>
      {/* コピーボタン */}
      <LevelCopyButton 
        currentLevel={activeLevel}
        visibleLevels={visibleLevels}
        onCopy={handleCopyLevel}
      />

      {/* 削除ボタン(レベルが2つ以上ある場合のみ表示) */}
      {visibleLevels.length > 1 && (
        <ActionIcon 
          variant="default" 
          size="lg"
          onClick={handleRemoveLevel}
          title="現在のレベルを削除"
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
  )

  return (
    <div className="flex flex-col gap-4" style={{ height: '100%' }}>
      <Tabs value={activeLevel} onChange={setActiveLevel} variant="outline" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* レベルタブヘッダー（固定） */}
        <div className="px-4 pt-4">
          {isMobile ? (
            // モバイル: 縦並び
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* レベルタブ */}
              <ScrollableTabs
                activeTab={activeLevel}
                onChange={setActiveLevel}
                tabs={tabItems}
              >
                {/* タブパネルコンテンツはここでは表示しない（下で別途表示） */}
                <></>
              </ScrollableTabs>
              
              {/* タブ操作ボタン */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {levelActionButtons}
              </div>
            </div>
          ) : (
            // デスクトップ: 横並び
            <Group gap="xs" wrap="nowrap" style={{ alignItems: 'flex-start' }}>
              {/* レベルタブ（スクロール可能領域） */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <ScrollableTabs
                  activeTab={activeLevel}
                  onChange={setActiveLevel}
                  tabs={tabItems}
                >
                  {/* タブパネルコンテンツはここでは表示しない（下で別途表示） */}
                  <></>
                </ScrollableTabs>
              </div>

              {/* タブ操作ボタン（固定） */}
              {levelActionButtons}
            </Group>
          )}
        </div>

        {/* タブパネルコンテンツ（スクロール可能） */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {visibleLevels.map((level) => (
            <Tabs.Panel key={level} value={level.toString()} p="md">
              <LevelDetailForm 
                level={level}
                maxLevel={maxLevel}
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
