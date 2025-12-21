import { ActionIcon, Badge, Box, Button, Checkbox, Group, Input, Menu, NumberInput, Paper, PillsInput, Select, Tabs, Text, Textarea, TextInput } from "@mantine/core"
import { useState } from "react"
import { IconAlertCircle, IconCheck, IconCircleCheck, IconCopy, IconLock, IconMinus, IconPlus } from "@tabler/icons-react"
import { MockLevelDetailFormA } from "./MockLevelDetailForm"
import { LevelCopyButton } from "./LevelCopyButton"


export const MockDetailSettingsA = ({ 
  activeLevel, 
  setActiveLevel, 
  levels,
  onSave 
}: { 
  activeLevel: string | null, 
  setActiveLevel: (v: string | null) => void,
  levels: Record<string, boolean>,
  onSave: (level: string) => void
}) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Text size="sm" c="dimmed">レベル1から順に設定してください。前のレベルを設定すると次のレベルが解放されます。</Text>
      
      <Tabs value={activeLevel} onChange={setActiveLevel} variant="outline">
        <Tabs.List>
          {[1, 2, 3, 4, 5].map((level) => {
            const levelStr = level.toString()
            // Level 1 is always editable.
            // Level N is editable if Level N-1 is set (true in levels map).
            const isEditable = level === 1 || levels[(level - 1).toString()]

            return (
              <Tabs.Tab 
                key={level} 
                value={levelStr} 
                disabled={!isEditable}
                rightSection={!isEditable ? <IconLock size={14} /> : (levels[levelStr] ? <IconCircleCheck size={14} color="green" /> : null)}
              >
                レベル {level}
              </Tabs.Tab>
            )
          })}
        </Tabs.List>

        {[1, 2, 3, 4, 5].map((level) => (
          <Tabs.Panel key={level} value={level.toString()} pt="md">
            <MockLevelDetailFormA level={level} onSave={() => onSave(level.toString())} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  )
}

export const MockDetailSettingsB = ({ 
  activeLevel, 
  setActiveLevel, 
  levels,
  onSave 
}: { 
  activeLevel: string | null, 
  setActiveLevel: (v: string | null) => void,
  levels: Record<string, boolean>,
  onSave: (level: string) => void
}) => {
  // 入力状態を管理（実際にはフォームの値から判定）
  const [inputStatus, setInputStatus] = useState<Record<string, 'empty' | 'partial' | 'complete'>>({
    "1": "empty",
    "2": "empty", 
    "3": "empty",
    "4": "empty",
    "5": "empty",
  })

  const getTabColor = (status: 'empty' | 'partial' | 'complete') => {
    switch(status) {
      case 'complete': return 'green'
      case 'partial': return 'yellow'
      case 'empty': return 'gray'
    }
  }

  const getTabIcon = (level: string, status: 'empty' | 'partial' | 'complete') => {
    if (status === 'complete') {
      return <IconCheck size={14} />
    }
    if (status === 'partial') {
      return <IconAlertCircle size={14} />
    }
    return null
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 説明とステータス表示 */}
      <Paper p="sm" withBorder>
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            全てのレベルを自由に編集できます。レベル1は必須です。
          </Text>
          <Group gap="xs">
            <Badge color="gray" variant="dot">未入力</Badge>
            <Badge color="yellow" variant="dot">入力中</Badge>
            <Badge color="green" variant="dot">完了</Badge>
          </Group>
        </Group>
      </Paper>
      
      <Tabs value={activeLevel} onChange={setActiveLevel} variant="outline">
        <Tabs.List>
          {[1, 2, 3, 4, 5].map((level) => {
            const levelStr = level.toString()
            const status = inputStatus[levelStr]

            return (
              <Tabs.Tab 
                key={level} 
                value={levelStr}
                color={getTabColor(status)}
                rightSection={getTabIcon(levelStr, status)}
              >
                <Group gap={4}>
                  <Text size="sm">レベル {level}</Text>
                  {level === 1 && <Text size="xs" c="red">*</Text>}
                </Group>
              </Tabs.Tab>
            )
          })}
        </Tabs.List>

        {[1, 2, 3, 4, 5].map((level) => (
          <Tabs.Panel key={level} value={level.toString()} pt="md">
            <MockLevelDetailFormA 
              level={level} 
              onSave={() => {
                // 入力状態を更新
                setInputStatus(prev => ({ ...prev, [level.toString()]: 'complete' }))
                onSave(level.toString())
              }} 
            />
          </Tabs.Panel>
        ))}
      </Tabs>

      {/* 全体保存ボタンとバリデーション表示 */}
      <Paper p="md" withBorder>
        <Group justify="space-between" align="center">
          <div>
            {inputStatus["1"] !== 'complete' && (
              <Group gap="xs">
                <IconAlertCircle size={16} color="red" />
                <Text size="sm" c="red">レベル1は必須項目です</Text>
              </Group>
            )}
          </div>
          <Button 
            size="md"
            disabled={inputStatus["1"] !== 'complete'}
          >
            全てのレベルを保存
          </Button>
        </Group>
      </Paper>
    </div>
  )
}

export const MockDetailSettingsC = ({ 
  activeLevel, 
  setActiveLevel, 
  levels,
  onSave 
}: { 
  activeLevel: string | null, 
  setActiveLevel: (v: string | null) => void,
  levels: Record<string, boolean>,
  onSave: (level: string) => void
}) => {
  // 表示するレベルのリストを管理
  const [visibleLevels, setVisibleLevels] = useState<number[]>([1])

  /** レベルを追加する */
  const handleAddLevel = () => {
    if (visibleLevels.length < 5) {
      const nextLevel = Math.max(...visibleLevels) + 1
      setVisibleLevels([...visibleLevels, nextLevel])
      setActiveLevel(nextLevel.toString())
    }
  }

  /** レベルを削除する */
  const handleRemoveLevel = () => {
    if (visibleLevels.length > 1) {
      const newLevels = visibleLevels.slice(0, -1)
      setVisibleLevels(newLevels)
      setActiveLevel(newLevels[newLevels.length - 1].toString())
    }
  }

  const maxLevel = Math.max(...visibleLevels)
  const canAddLevel = maxLevel < 5

  /** レベル詳細をコピーする */
  const handleCopyLevel = (fromLevel: number) => {
    console.log(`レベル${fromLevel}の詳細を現在のレベル${activeLevel}にコピー`)
    // 実際の実装ではフォームの値をコピーする処理を実装
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

            {/* 削除ボタン（レベル2以上の場合のみ表示） */}
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

            {/* 追加ボタン（レベル5で無効化） */}
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
            <MockLevelDetailFormA 
              level={level} 
              onSave={() => onSave(level.toString())} 
            />
          </Tabs.Panel>
        ))}
      </Tabs>

    </div>
  )
}
