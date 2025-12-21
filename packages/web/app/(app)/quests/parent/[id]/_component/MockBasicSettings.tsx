import { Box, Button, Checkbox, Group, Input, NumberInput, Paper, PillsInput, Select, Switch, Tabs, Text, Textarea, TextInput } from "@mantine/core"
import { useState } from "react"
import { IconCircleCheck, IconLock } from "@tabler/icons-react"


export const MockBasicSettingsA = () => {
  const [hasTargetAge, setHasTargetAge] = useState(false)
  const [hasPublishedMonth, setHasPublishedMonth] = useState(false)

  return (
    <div className="flex flex-col gap-4 max-w-lg p-4">
      <TextInput label="家族クエスト名" placeholder="例: お皿洗い" required />
      
      <Input.Wrapper label="家族クエストアイコン" required>
        <Box w={50} h={50} bg="gray.1" style={{ borderRadius: '50%' }} className="flex items-center justify-center border cursor-pointer">
          <span>Icon</span>
        </Box>
      </Input.Wrapper>

      <Select label="カテゴリ" placeholder="カテゴリを選択" data={['家事', '勉強', 'その他']} />

      <PillsInput label="タグ" description="条件絞り込みで使用">
        <PillsInput.Field placeholder="タグを追加" />
      </PillsInput>

      <TextInput label="依頼者氏名" placeholder="例: お母さん" />

      <Textarea 
        label="依頼詳細" 
        placeholder="クエストの詳しい説明を記入してください"
        autosize
        minRows={3}
      />

      <Switch 
        label="対象年齢を設定する" 
        checked={hasTargetAge}
        onChange={(e) => setHasTargetAge(e.currentTarget.checked)}
      />

      {hasTargetAge && (
        <Group grow>
          <NumberInput label="対象年齢（開始）" placeholder="例: 5" min={0} suffix="歳" />
          <NumberInput label="対象年齢（終了）" placeholder="例: 12" min={0} suffix="歳" />
        </Group>
      )}

      <Switch
        label="公開月を指定する" 
        checked={hasPublishedMonth}
        onChange={(e) => setHasPublishedMonth(e.currentTarget.checked)}
      />

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
          />
        </Group>
      )}

      <Group justify="flex-end" mt="md">
        <Button>保存</Button>
      </Group>
    </div>
  )
}
