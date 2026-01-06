"use client"

import { Badge, Box, Divider, Group, Paper, ScrollArea, Stack, Text } from "@mantine/core"
import { IconFileText, IconTag, IconUser } from "@tabler/icons-react"

/** 依頼情報タブ */
export const QuestDetailTab = ({
  client,
  requestDetail,
}: {
  client: string
  requestDetail: string

}) => {
  return (
    <Stack gap="md" className="overflow-y-auto">
      {/* 依頼主 */}
      <Box>
        <Group gap="xs" mb={4}>
          <IconUser size={20} />
          <Text fw={500}>依頼主</Text>
        </Group>
        <Text ta="right">{client}</Text>
      </Box>

      <Divider />

      {/* 依頼内容 */}
      <Box>
        <Group gap="xs" mb={4}>
          <IconFileText size={20} />
          <Text fw={500}>依頼内容</Text>
        </Group>
        <ScrollArea p="sm" h={100} type="auto" style={{ backgroundColor: "#ffffff20" }}>
          <Text size="sm">{requestDetail}</Text>
        </ScrollArea>
      </Box>

    </Stack>
  )
}
