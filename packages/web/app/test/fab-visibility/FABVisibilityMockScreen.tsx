"use client"

import { Box, Title, ActionIcon, Stack, Group, Text } from "@mantine/core"
import { IconHome } from "@tabler/icons-react"
import { useSystemTheme } from "../../(core)/useSystemTheme"
import { FAB_SPACING } from "../../(core)/_components/FABChildItem"

/** FABぼかし＋透過度のテストパターン */
type BlurOpacityPattern = {
  /** パターン名 */
  name: string
  /** ぼかし値（px） */
  blur: number
  /** 不透明度（0-1） */
  opacity: number
}

/** テスト用のぼかし＋透過度パターン */
const patterns: BlurOpacityPattern[] = [
  // 低透過度パターン
  { name: "blur 0px + 不透明度 85%", blur: 0, opacity: 0.85 },
  { name: "blur 4px + 不透明度 85%", blur: 4, opacity: 0.85 },
  { name: "blur 8px + 不透明度 85%", blur: 8, opacity: 0.85 },
  
  // 中透過度パターン
  { name: "blur 0px + 不透明度 90%", blur: 0, opacity: 0.90 },
  { name: "blur 4px + 不透明度 90%", blur: 4, opacity: 0.90 },
  { name: "blur 8px + 不透明度 90%", blur: 8, opacity: 0.90 },
  
  // 高透過度パターン
  { name: "blur 0px + 不透明度 95%", blur: 0, opacity: 0.95 },
  { name: "blur 4px + 不透明度 95%", blur: 4, opacity: 0.95 },
  { name: "blur 8px + 不透明度 95%", blur: 8, opacity: 0.95 },
  { name: "blur 12px + 不透明度 95% (現在)", blur: 12, opacity: 0.95 },
  
  // 完全不透明パターン
  { name: "blur 0px + 不透明度 100%", blur: 0, opacity: 1.0 },
  { name: "blur 4px + 不透明度 100%", blur: 4, opacity: 1.0 },
  { name: "blur 8px + 不透明度 100%", blur: 8, opacity: 1.0 },
  { name: "blur 12px + 不透明度 100%", blur: 12, opacity: 1.0 },
]

/** FABぼかし＋透過度テスト用のモック画面を表示する */
export const FABVisibilityMockScreen = () => {
  const { isDark: isSystemDark } = useSystemTheme()
  const backgroundColor = isSystemDark ? "#1a1b1e" : "#faf8f3"

  return (
    <Box
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor,
        padding: "20px",
      }}
    >
      <Stack gap="lg">
        <Title order={2} style={{ color: isSystemDark ? "#f1f5f9" : "#1a1a1a" }}>
          FAB ぼかし＋不透明度テスト
        </Title>
        
        <Text size="sm" style={{ color: isSystemDark ? "#cbd5e1" : "#64748b" }}>
          背景: {isSystemDark ? "ダークモード" : "ライトモード"} ({backgroundColor})
        </Text>
        
        <Text size="sm" fw="bold" style={{ color: isSystemDark ? "#f1f5f9" : "#1a1a1a" }}>
          ラベルスタイル: 黒文字＋白影（固定）
        </Text>

        <Stack gap="xl">
          {patterns.map((pattern, index) => (
            <Box key={index}>
              <Text 
                size="sm" 
                fw="bold" 
                mb="xs"
                style={{ color: isSystemDark ? "#f1f5f9" : "#1a1a1a" }}
              >
                パターン{index + 1}: {pattern.name}
              </Text>
              
              <Group gap="md" align="center">
                {/* FAB子アイテム */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: FAB_SPACING.iconLabelGap,
                  }}
                >
                  <ActionIcon
                    size="xl"
                    radius="xl"
                    variant="light"
                    color="blue"
                    style={{
                      width: FAB_SPACING.subButtonSize,
                      height: FAB_SPACING.subButtonSize,
                      opacity: pattern.opacity,
                      backdropFilter: pattern.blur > 0 ? `blur(${pattern.blur}px)` : "none",
                      WebkitBackdropFilter: pattern.blur > 0 ? `blur(${pattern.blur}px)` : "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <IconHome size={20} />
                  </ActionIcon>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      color: "#1a1a1a",
                      textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ホーム
                  </span>
                </div>

                {/* 設定詳細 */}
                <Stack gap={4}>
                  <Text size="xs" c="dimmed">
                    ぼかし: {pattern.blur}px
                  </Text>
                  <Text size="xs" c="dimmed">
                    不透明度: {Math.round(pattern.opacity * 100)}%
                  </Text>
                </Stack>
              </Group>
            </Box>
          ))}
        </Stack>

        {/* 比較用: 複数並べた状態 */}
        <Box mt="xl">
          <Text 
            size="sm" 
            fw="bold" 
            mb="md"
            style={{ color: isSystemDark ? "#f1f5f9" : "#1a1a1a" }}
          >
            並べて比較
          </Text>
          
          <Group gap="lg">
            {patterns.map((pattern, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: FAB_SPACING.iconLabelGap,
                  }}
                >
                  <ActionIcon
                    size="xl"
                    radius="xl"
                    variant="light"
                    color="blue"
                    style={{
                      width: FAB_SPACING.subButtonSize,
                      height: FAB_SPACING.subButtonSize,
                      opacity: pattern.opacity,
                      backdropFilter: pattern.blur > 0 ? `blur(${pattern.blur}px)` : "none",
                      WebkitBackdropFilter: pattern.blur > 0 ? `blur(${pattern.blur}px)` : "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <IconHome size={20} />
                  </ActionIcon>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      color: "#1a1a1a",
                      textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ホーム
                  </span>
                </div>
                <Text size="xs" c="dimmed" ta="center">
                  #{index + 1}
                </Text>
              </div>
            ))}
          </Group>
        </Box>
      </Stack>
    </Box>
  )
}
