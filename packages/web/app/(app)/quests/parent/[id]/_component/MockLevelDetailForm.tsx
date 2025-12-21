import { Box, Button, Checkbox, Group, Input, NumberInput, Paper, PillsInput, Select, Tabs, Text, Textarea, TextInput } from "@mantine/core"
import { useState } from "react"
import { IconCircleCheck, IconLock } from "@tabler/icons-react"



export const MockLevelDetailFormA = ({ level, onSave }: { level: number, onSave: () => void }) => {
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
        />

        <Group grow>
          <NumberInput 
            label="目標回数" 
            description="成功条件を何回達成したらクリアか"
            defaultValue={1} 
            min={1} 
            suffix="回" 
            required 
          />
          <NumberInput 
            label="報酬額" 
            description="クリア時に獲得できるお小遣い額"
            defaultValue={10} 
            min={0} 
            prefix="¥" 
            required 
          />
        </Group>

        <Group grow>
          <NumberInput label="獲得経験値 (子供)" defaultValue={10} min={0} suffix="exp" />
          <NumberInput label="クエスト経験値" defaultValue={5} min={0} suffix="exp" />
        </Group>
        
        <NumberInput label="レベルアップ必要経験値" description="次のレベルに行くために必要な経験値" defaultValue={100} min={0} suffix="exp" />

      </div>
    </Paper>
  )
}
