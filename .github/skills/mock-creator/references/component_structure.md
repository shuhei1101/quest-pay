# Mock Creator - Component Structure

**記載日**: 2026年3月

## 概要

このドキュメントは、Mock Creatorが生成するモック画面のコンポーネント構造とレイアウトパターンを定義します。

## ディレクトリ構成

```
/packages/web/app/test/
├── page.tsx                              # テスト一覧ページ
├── <mock-name>/                          # 各モック画面
│   └── page.tsx                          # モック画面実装
```

## コンポーネント階層

### 単一パターンモック

```
MockPage (page.tsx)
└── Container (div.p-4)
    ├── Title (h1)
    └── Content (mock-specific)
```

**特徴**:
- シンプルな1コンポーネント構成
- 検証内容に特化したコンテンツ
- 最小限のレイアウトラッパー

### レイアウト系モック（複数バリエーション）

```
MockPage (page.tsx)
├── Header
│   ├── Title (h1)
│   └── Description (p)
└── Tabs (Mantine Tabs)
    ├── TabsList
    │   ├── Tab: "バリエーション1"
    │   ├── Tab: "バリエーション2"
    │   └── Tab: "バリエーション3"
    └── TabsPanels
        ├── Panel: Variant1Component
        ├── Panel: Variant2Component
        └── Panel: Variant3Component
```

**特徴**:
- タブ切り替えによる比較可能な設計
- 各バリエーションは独立したコンポーネント
- 統一されたヘッダー構造

## レイアウトパターン

### パターン1: 機能テストモック

**用途**: 特定機能の動作確認、コンポーネント単体テスト

**構造**:
```tsx
<div className="p-4">
  <h1>機能名テスト</h1>
  <TestComponent />
</div>
```

### パターン2: レイアウト検証モック

**用途**: UI/UXデザインの比較検証、レイアウトパターン評価

**構造**:
```tsx
<div className="p-4">
  <Header />
  <Tabs>
    <TabsList />
    <TabPanel value="variant1">
      <Variant1 />
    </TabPanel>
    <TabPanel value="variant2">
      <Variant2 />
    </TabPanel>
    <TabPanel value="variant3">
      <Variant3 />
    </TabPanel>
  </Tabs>
</div>
```

### パターン3: 統合テストモック

**用途**: 外部サービス連携テスト、複雑なフロー検証

**構造**:
```tsx
<div className="p-4">
  <h1>統合テスト</h1>
  <SetupSection />
  <TestControls />
  <ResultDisplay />
</div>
```

## コンポーネント設計原則

### 1. シンプルさ優先
- モック画面は検証目的に徹する
- 不要な複雑さは避ける
- ファイル数を最小限に保つ

### 2. 既存コンポーネント活用
- Mantineコンポーネントを積極的に使用
- 共通コンポーネント（ScrollableTabs、PageHeaderなど）を再利用

### 3. 独立性
- 各モックは独立して動作
- 他のモックや本番コードへの依存を最小化
- テストデータはモック内で完結

### 4. 比較可能性（レイアウト系）
- 複数バリエーションを同一画面で表示
- タブ切り替えで即座に比較可能
- 各バリエーションは明確に異なるアプローチ

## ファイル命名規則

### モックディレクトリ名
- **形式**: `<purpose>-mock` または `<feature>-test`
- **例**: `button-test-mock`, `layout-experiment-mock`, `stripe-test`

### コンポーネントファイル名（複雑な場合）
- **形式**: `<Variant><Number>.tsx`
- **例**: `Variant1.tsx`, `Variant2.tsx`, `Variant3.tsx`

## 典型的な使用例

### 例1: ボタンスタイルテスト
```tsx
// test/button-styles-mock/page.tsx
"use client"

import { Button, Stack } from "@mantine/core"

export default function ButtonStylesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ボタンスタイルテスト</h1>
      <Stack>
        <Button variant="filled">Filled</Button>
        <Button variant="light">Light</Button>
        <Button variant="outline">Outline</Button>
      </Stack>
    </div>
  )
}
```

### 例2: レイアウトバリエーション
```tsx
// test/layout-comparison-mock/page.tsx
"use client"

import { Tabs } from "@mantine/core"
import { useState } from "react"

export default function LayoutComparisonPage() {
  const [activeTab, setActiveTab] = useState<string | null>("minimal")

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">レイアウト比較</h1>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="minimal">ミニマル</Tabs.Tab>
          <Tabs.Tab value="modern">モダン</Tabs.Tab>
          <Tabs.Tab value="glass">ガラス</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="minimal" pt="md">
          {/* ミニマルレイアウト */}
        </Tabs.Panel>
        <Tabs.Panel value="modern" pt="md">
          {/* モダンレイアウト */}
        </Tabs.Panel>
        <Tabs.Panel value="glass" pt="md">
          {/* ガラスレイアウト */}
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}
```
