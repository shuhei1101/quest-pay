"use client"

import { Box, Container, SegmentedControl, Stack, Title, Text, Select, Paper, Divider } from "@mantine/core"
import { useState } from "react"
import { ParentDesign1 } from "./_components/ParentDesign1"
import { ParentDesign2 } from "./_components/ParentDesign2"
import { ParentDesign3 } from "./_components/ParentDesign3"
import { ParentDesign4 } from "./_components/ParentDesign4"
import { ChildDesign1 } from "./_components/ChildDesign1"
import { ChildDesign2 } from "./_components/ChildDesign2"
import { ChildDesign3 } from "./_components/ChildDesign3"
import { ChildDesign4 } from "./_components/ChildDesign4"

/** 設定画面モックページ */
export default function SettingsMockPage() {
  /** 表示する設定画面のタイプ */
  const [settingsType, setSettingsType] = useState<"parent" | "child">("parent")
  /** 表示するデザイン（1-4） */
  const [designNumber, setDesignNumber] = useState<string>("1")

  const parentDesigns = [
    { value: "1", label: "デザイン1: iPhone風リスト形式", component: <ParentDesign1 /> },
    { value: "2", label: "デザイン2: カードグリッド形式", component: <ParentDesign2 /> },
    { value: "3", label: "デザイン3: アコーディオン形式", component: <ParentDesign3 /> },
    { value: "4", label: "デザイン4: 2カラム形式", component: <ParentDesign4 /> },
  ]

  const childDesigns = [
    { value: "1", label: "デザイン1: iPhone風リスト形式", component: <ChildDesign1 /> },
    { value: "2", label: "デザイン2: カラフルカード形式", component: <ChildDesign2 /> },
    { value: "3", label: "デザイン3: シンプルセクション形式", component: <ChildDesign3 /> },
    { value: "4", label: "デザイン4: ダッシュボード形式", component: <ChildDesign4 /> },
  ]

  const currentDesigns = settingsType === "parent" ? parentDesigns : childDesigns
  const currentComponent = currentDesigns.find((d) => d.value === designNumber)?.component

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* ページヘッダー */}
        <Box>
          <Title order={1} mb="xs">
            設定画面モック
          </Title>
          <Text c="dimmed">
            親と子供の設定画面のレイアウトを4パターンずつ確認できます
          </Text>
        </Box>

        {/* コントロールパネル */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            {/* 設定タイプ切り替え */}
            <Box>
              <Text size="sm" fw={600} mb="xs">
                ユーザータイプ
              </Text>
              <SegmentedControl
                value={settingsType}
                onChange={(value) => {
                  setSettingsType(value as "parent" | "child")
                  setDesignNumber("1")
                }}
                data={[
                  { label: "親の設定", value: "parent" },
                  { label: "子供の設定", value: "child" },
                ]}
                fullWidth
              />
            </Box>

            <Divider />

            {/* デザイン選択 */}
            <Box>
              <Text size="sm" fw={600} mb="xs">
                デザインパターン
              </Text>
              <Select
                value={designNumber}
                onChange={(value) => setDesignNumber(value || "1")}
                data={currentDesigns}
              />
            </Box>

            {/* デザイン説明 */}
            <Paper p="sm" bg="gray.0" radius="sm">
              <Text size="xs" c="dimmed">
                {settingsType === "parent" ? (
                  <>
                    <strong>デザイン1:</strong> iPhone風のシンプルなリスト形式（モバイル最適化）
                    <br />
                    <strong>デザイン2:</strong> カテゴリごとのカードグリッド形式
                    <br />
                    <strong>デザイン3:</strong> 折りたたみ可能なアコーディオン形式
                    <br />
                    <strong>デザイン4:</strong> 左メニュー＋右詳細の2カラム形式（PC向け）
                  </>
                ) : (
                  <>
                    <strong>デザイン1:</strong> iPhone風のシンプルなリスト形式（モバイル最適化）
                    <br />
                    <strong>デザイン2:</strong> カラフルなカード形式（子供向け）
                    <br />
                    <strong>デザイン3:</strong> セクションごとに分かれたシンプル形式
                    <br />
                    <strong>デザイン4:</strong> ダッシュボード＋クイック設定形式
                  </>
                )}
              </Text>
            </Paper>
          </Stack>
        </Paper>

        {/* 設定画面表示 */}
        <Paper withBorder style={{ minHeight: "80vh", overflow: "hidden" }}>
          {currentComponent}
        </Paper>
      </Stack>
    </Container>
  )
}
