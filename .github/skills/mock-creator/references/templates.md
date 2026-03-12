# Mock Page Templates

このドキュメントは、モック画面作成時のテンプレートコードを提供します。

## 通常のモック画面（単一パターン）

基本的なNext.js Page構造：

```tsx
"use client"

export default function <MockName>Page() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4"><Mock Title></h1>
      {/* モック内容 */}
    </div>
  )
}
```

## レイアウト系モック画面（複数バリエーション）

Mantineの`Tabs`コンポーネントを使用した構造：

```tsx
"use client"

import { Tabs } from "@mantine/core"
import { useState } from "react"

export default function <MockName>Page() {
  const [activeTab, setActiveTab] = useState<string | null>("variant1")

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4"><Mock Title></h1>
      <p className="text-sm text-gray-600 mb-4">
        複数のデザインバリエーションをタブで切り替えて比較できます
      </p>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="variant1">バリエーション1</Tabs.Tab>
          <Tabs.Tab value="variant2">バリエーション2</Tabs.Tab>
          <Tabs.Tab value="variant3">バリエーション3</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="variant1" pt="md">
          {/* バリエーション1の実装 */}
        </Tabs.Panel>

        <Tabs.Panel value="variant2" pt="md">
          {/* バリエーション2の実装 */}
        </Tabs.Panel>

        <Tabs.Panel value="variant3" pt="md">
          {/* バリエーション3の実装 */}
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}
```

## コンポーネント分離パターン

各バリエーションが複雑な場合は、別コンポーネントに分離：

```tsx
// page.tsx
import { Variant1 } from "./Variant1"
import { Variant2 } from "./Variant2"
import { Variant3 } from "./Variant3"

export default function <MockName>Page() {
  return (
    <Tabs>
      <Tabs.Panel value="variant1">
        <Variant1 />
      </Tabs.Panel>
      {/* ... */}
    </Tabs>
  )
}
```

## 完全な実装例: サイドメニューデザイン比較

```tsx
"use client"

import { Tabs, Card, Text } from "@mantine/core"
import { useState } from "react"

/**
 * サイドメニューデザインバリエーションのモック画面
 * 目的: 3つの異なるサイドメニューデザインを比較検証
 */
export default function SideMenuMockPage() {
  const [activeTab, setActiveTab] = useState<string | null>("minimal")

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">サイドメニューデザイン比較</h1>
      <p className="text-sm text-gray-600 mb-4">
        複数のデザインバリエーションをタブで切り替えて比較できます
      </p>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="minimal">ミニマル</Tabs.Tab>
          <Tabs.Tab value="modern">モダン</Tabs.Tab>
          <Tabs.Tab value="glass">ガラス</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="minimal" pt="md">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={500} mb="md">ミニマルデザイン</Text>
            <Text size="sm" c="dimmed" mb="md">
              シンプルで基本的なデザイン。余計な装飾を排除した清潔感のあるUI。
            </Text>
            {/* ミニマルデザインの実装 */}
            <div className="bg-white p-4 rounded border">
              {/* サイドメニューのミニマル実装例 */}
            </div>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="modern" pt="md">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={500} mb="md">モダンデザイン</Text>
            <Text size="sm" c="dimmed" mb="md">
              洗練された現代的なデザイン。グラデーションやシャドウを活用。
            </Text>
            {/* モダンデザインの実装 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded shadow-lg">
              {/* サイドメニューのモダン実装例 */}
            </div>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="glass" pt="md">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={500} mb="md">ガラスモーフィズムデザイン</Text>
            <Text size="sm" c="dimmed" mb="md">
              半透明の背景とぼかし効果を使用した実験的デザイン。
            </Text>
            {/* ガラスモーフィズムデザインの実装 */}
            <div className="bg-white/30 backdrop-blur-lg p-4 rounded border border-white/20">
              {/* サイドメニューのガラス実装例 */}
            </div>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}
```

## バリエーションの設計方針

- **バリエーション1**: ミニマルデザイン（シンプル、基本的）
- **バリエーション2**: モダンデザイン（洗練、現代的）
- **バリエーション3**: 実験的デザイン（ユニーク、特殊効果）
