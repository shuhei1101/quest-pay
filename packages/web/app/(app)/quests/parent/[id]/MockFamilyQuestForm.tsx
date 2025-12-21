"use client"

import { Box, Button, Checkbox, Group, Input, NumberInput, Paper, PillsInput, Select, Tabs, Text, Textarea, TextInput } from "@mantine/core"
import { useState } from "react"
import { IconCircleCheck, IconLock } from "@tabler/icons-react"
import { MockDetailSettingsA, MockDetailSettingsB, MockDetailSettingsC } from "./_component/MockDetailSettings"
import { MockBasicSettingsA } from "./_component/MockBasicSettings"
import { MockOnlineSettingsA } from "./_component/MockOnlineSettings"
import { MockChildSettingsA } from "./_component/MockChildSettings"

export const MockQuestFormA = () => {
  const [activeTab, setActiveTab] = useState<string | null>("basic")
  const [activeLevel, setActiveLevel] = useState<string | null>("1")

  // Mock state for demonstration
  const [levels, setLevels] = useState<Record<string, boolean>>({
    "1": false, 
    "2": false,
    "3": false,
    "4": false,
    "5": false,
  })

  const handleLevelSave = (level: string) => {
    // Mark current level as done
    setLevels(prev => ({ ...prev, [level]: true }))
    
    // Switch to next level if available
    const nextLevel = (parseInt(level) + 1).toString()
    if (parseInt(nextLevel) <= 5) {
      setActiveLevel(nextLevel)
    }
  }

  return (
    <Paper p="md" withBorder style={{ height: 'calc(100vh - 60px - 2rem)', display: 'flex', flexDirection: 'column' }}>
      <Tabs value={activeTab} onChange={setActiveTab} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Tabs.List>
          <Tabs.Tab value="basic">基本設定</Tabs.Tab>
          <Tabs.Tab value="details">詳細設定</Tabs.Tab>
          <Tabs.Tab value="children">子供設定</Tabs.Tab>
          <Tabs.Tab value="online">オンライン設定</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="basic" pt="xs" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <MockBasicSettingsA />
        </Tabs.Panel>

        <Tabs.Panel value="details" pt="xs" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <MockDetailSettingsC
            activeLevel={activeLevel} 
            setActiveLevel={setActiveLevel} 
            levels={levels}
            onSave={handleLevelSave}
          />
        </Tabs.Panel>

        <Tabs.Panel value="children" pt="xs" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <MockChildSettingsA />
        </Tabs.Panel>

        <Tabs.Panel value="online" pt="xs" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <MockOnlineSettingsA />
        </Tabs.Panel>

      </Tabs>
    </Paper>
  )
}
