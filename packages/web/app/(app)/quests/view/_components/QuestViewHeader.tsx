"use client"

import { useState } from "react"
import { useWindow } from "@/app/(core)/useConstants"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { ActionIcon, Badge, Box, Group, Menu, Paper, Rating, Stack, Text, ThemeIcon } from "@mantine/core"
import { IconChevronDown, IconCoinYen, IconSparkles } from "@tabler/icons-react"

/** クエスト閲覧ヘッダー */
export const QuestViewHeader = ({
  questName,
  headerColor,
  iconName,
  iconColor,
  category,
  level,
  reward,
  exp,
  availableLevels,
  onLevelChange,
}: {
  questName: string
  headerColor?: { light: string, dark: string }
  iconName?: string
  iconColor?: string
  category?: string
  level?: number
  reward?: number
  exp?: number
  availableLevels?: number[]
  onLevelChange?: (level: number) => void
}) => {
  const {isDark, isMobile} = useWindow()
  const color = headerColor || { light: "blue.2", dark: "blue.4" }
  const accentColor = (isDark ? color.dark : color.light).split(".")[0]
  const [menuOpened, setMenuOpened] = useState(false)
  const canChangeLevel = !isMobile && availableLevels && availableLevels.length > 1 && onLevelChange

  return (
    <Paper
      p="lg"
      radius="xl"
      mb="md"
      style={{
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
        border: isDark ? "1px solid rgba(148, 163, 184, 0.18)" : "1px solid rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Badge
            radius="sm"
            variant="filled"
            color={accentColor}
            style={{
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            QUEST VIEW
          </Badge>
          <Group gap={8}>
            {reward !== undefined && (
              <Badge radius="xl" variant="light" color="orange" leftSection={<IconCoinYen size={12} />}>
                {reward}円
              </Badge>
            )}
            {exp !== undefined && (
              <Badge radius="xl" variant="light" color="blue" leftSection={<IconSparkles size={12} />}>
                +{exp} EXP
              </Badge>
            )}
          </Group>
        </Group>

        <Group align="center" wrap="nowrap">
          {!isMobile && iconName && (
            <ThemeIcon
              size={56}
              radius={18}
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(71, 85, 105, 0.26) 100%)"
                  : "linear-gradient(135deg, rgba(239, 246, 255, 1) 0%, rgba(224, 231, 255, 1) 100%)",
                color: iconColor || "#2563eb",
                flexShrink: 0,
              }}
            >
              <RenderIcon iconName={iconName} iconColor={iconColor || "#2563eb"} size={28} />
            </ThemeIcon>
          )}
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text
              fw={900}
              lh={1.15}
              size="1.45rem"
              style={{ wordBreak: "break-word" }}
            >
              {questName}
            </Text>
            {!isMobile && (
              <Group gap={8} mt="sm">
                {category && (
                  <Badge radius="xl" variant="outline">
                    {category}
                  </Badge>
                )}
                {level !== undefined && (
                  canChangeLevel ? (
                    <Menu
                      key="level-menu"
                      opened={menuOpened}
                      onChange={setMenuOpened}
                      position="bottom-start"
                      width={220}
                    >
                      <Menu.Target>
                        <Box
                          style={{
                            cursor: "pointer",
                            borderRadius: 9999,
                            padding: "6px 10px",
                            border: isDark ? "1px solid rgba(167, 139, 250, 0.32)" : "1px solid rgba(124, 58, 237, 0.18)",
                            backgroundColor: isDark ? "rgba(76, 29, 149, 0.18)" : "rgba(245, 243, 255, 0.92)",
                          }}
                        >
                          <Group gap="xs" wrap="nowrap">
                            <Rating value={level} count={5} readOnly size="sm" color="grape" />
                            <ActionIcon variant="subtle" size="sm" color="grape">
                              <IconChevronDown size={14} />
                            </ActionIcon>
                          </Group>
                        </Box>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Label>レベルを選択</Menu.Label>
                        {availableLevels.map((lvl) => (
                          <Menu.Item
                            key={lvl}
                            onClick={() => onLevelChange(lvl)}
                            style={{
                              backgroundColor: lvl === level
                                ? (isDark ? "rgba(167, 139, 250, 0.18)" : "rgba(124, 58, 237, 0.08)")
                                : undefined,
                              fontWeight: lvl === level ? 700 : undefined,
                            }}
                          >
                            <Group gap="xs" wrap="nowrap">
                              <Rating value={lvl} count={5} readOnly size="sm" color="grape" />
                              <Text size="sm">レベル {lvl}</Text>
                            </Group>
                          </Menu.Item>
                        ))}
                      </Menu.Dropdown>
                    </Menu>
                  ) : (
                    <Box
                      key="level-static"
                      style={{
                        borderRadius: 9999,
                        padding: "6px 10px",
                        border: isDark ? "1px solid rgba(167, 139, 250, 0.32)" : "1px solid rgba(124, 58, 237, 0.18)",
                        backgroundColor: isDark ? "rgba(76, 29, 149, 0.18)" : "rgba(245, 243, 255, 0.92)",
                      }}
                    >
                      <Rating value={level} count={5} readOnly size="sm" color="grape" />
                    </Box>
                  )
                )}
              </Group>
            )}
          </Box>
        </Group>
      </Stack>
    </Paper>
  )
}
