"use client"

import { ActionIcon, CopyButton as MantineCopyButton, Tooltip } from "@mantine/core"
import { IconCheck, IconCopy } from "@tabler/icons-react"

/** コピーボタン */
export const CopyButton = ({value}: {
  value: string
}) => {
  return (
    <MantineCopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label="コピーしました" withArrow position="right" opened={copied}>
          <ActionIcon color={copied ? "teal" : "gray"} variant="subtle" onClick={copy}>
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </ActionIcon>
        </Tooltip>
      )}
    </MantineCopyButton>
  )
}
