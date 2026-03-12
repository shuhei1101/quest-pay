---
name: mock-creator
description: このスキルはモック画面作成依頼を受けて `/packages/web/app/test` 配下にモック画面を作成し、テスト一覧ページ(`/test`)に自動的にリンクを追加する。UI/UXの検証、プロトタイピング、テスト画面の作成時に使用すべきスキル。
---

# Mock Creator

## Overview

このスキルは、お小遣いクエストボードプロジェクトのモック画面作成を効率化する。ユーザーからモック画面作成依頼を受けると、`/packages/web/app/test` 配下にモック画面を作成し、テスト一覧ページ(`/test`)に自動的にリンクカードを追加する。

## When to Use

次の場合にこのスキルを使用する：

- ユーザーがモック画面の作成を依頼した時
- UI/UXの検証やプロトタイピングが必要な時
- コンポーネントの動作確認用テストページが必要な時
- 既存機能の改善案をビジュアルで確認したい時

## Workflow

### Step 1: Requirements Gathering

ユーザーからモック画面作成依頼を受けたら、以下を確認する：

1. **モック画面の目的**: 何を検証・確認したいのか
2. **画面名**: モック画面のディレクトリ名（例: `button-test-mock`, `layout-experiment-mock`）
3. **必要なコンポーネント**: 既存コンポーネントを使用するか、新規作成するか
4. **表示内容**: どのような内容を表示するか

ユーザーが「内部の構造は何でもいい」と言う場合は、シンプルな構成で作成する。

**重要**: レイアウトやデザインパターンの検証依頼の場合は、**複数バリエーション（3つ程度）をタブで切り替える構成**にすることを前提とする。以下のキーワードが含まれる場合は自動的にこのアプローチを採用：
- 「レイアウト」「デザイン」「スタイル」「パターン」「バリエーション」
- 「比較」「検証」「プロトタイプ」
- サイドメニュー、ヘッダー、フッター、カード、ボタンなどのUI要素名

### Step 2: Create Mock Page

モック画面を以下の手順で作成する：

#### 2-A: 通常のモック画面（単一パターン）

1. `/home/shuhei2441/repo/quest-pay/packages/web/app/test/<mock-name>/page.tsx` を作成
2. 基本的なNext.js Page構造を実装：
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
3. 必要に応じて追加のコンポーネントやロジックを実装

#### 2-B: レイアウト系モック画面（複数バリエーション）

**重要**: レイアウトやデザインパターンの検証依頼を受けた場合は、**3つ程度のバリエーション**を提案し、**1つのページ内でタブ切り替え**で比較できるようにする。

1. `/home/shuhei2441/repo/quest-pay/packages/web/app/test/<mock-name>/page.tsx` を作成
2. Mantineの`Tabs`コンポーネントを使用した構造を実装：
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

3. **各バリエーションの設計方針**:
   - **バリエーション1**: ミニマルデザイン（シンプル、基本的）
   - **バリエーション2**: モダンデザイン（洗練、現代的）
   - **バリエーション3**: 実験的デザイン（ユニーク、特殊効果）

4. **コンポーネント分離**（複雑な場合）:
   - 各バリエーションが複雑な場合は、別コンポーネントに分離
   - 同じディレクトリ内に `Variant1.tsx`, `Variant2.tsx`, `Variant3.tsx` を作成
   - `page.tsx` からインポートして使用

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

#### レイアウト系モック判定基準

以下のキーワードが依頼に含まれる場合は、2-Bのアプローチを使用：
- 「レイアウト」「デザイン」「スタイル」
- 「パターン」「バリエーション」
- 「比較」「検証」「プロトタイプ」
- サイドメニュー、ヘッダー、フッター、カードなどのUI要素名

### Step 3: Update Endpoints

`/home/shuhei2441/repo/quest-pay/packages/web/app/(core)/endpoints.ts` にモック画面のURL定義を追加する：

```typescript
// 既存のテスト用URL定義の後に追加
export const TEST_<MOCK_NAME>_URL = `${TEST_URL}/<mock-name>`
```

### Step 4: Update Test Page

`/home/shuhei2441/repo/quest-pay/packages/web/app/test/page.tsx` を更新：

1. **インポート文を更新**:
   ```typescript
   import { 
     // 既存のインポート
     TEST_FAMILY_PROFILE_MOCK_URL,
     TEST_SETTINGS_MOCK_URL,
     // 新規追加
     TEST_<MOCK_NAME>_URL
   } from "@/app/(core)/endpoints"
   ```

2. **必要に応じてアイコンをインポート**:
   ```typescript
   import { 
     IconHome, 
     IconSettings,
     // 新規追加（例）
     Icon<適切なアイコン名>
   } from "@tabler/icons-react"
   ```

3. **mockItems配列に新しいモックを追加**:
   ```typescript
   const mockItems: MockItem[] = [
     // 既存のモック
     {
       title: "家族プロフィールモック",
       description: "家族プロフィール画面のモック",
       url: TEST_FAMILY_PROFILE_MOCK_URL,
       icon: <IconHome size={32} />,
       badge: "UI"
     },
     // 新規モック
     {
       title: "<モック画面のタイトル>",
       description: "<モック画面の説明>",
       url: TEST_<MOCK_NAME>_URL,
       icon: <Icon<適切なアイコン名> size={32} />,
       badge: "<UI|Integration|Test>" // 適切なバッジを選択
     }
   ]
   ```

### Step 5: Verify

作成したモック画面を確認：

1. テスト一覧ページ(`/test`)に新しいモックカードが表示されることを確認
2. カードをクリックして画面が正常に表示されることを確認
3. サイドメニューの「モック」ボタンから `/test` に遷移できることを確認

## Best Practices

- **命名規則**: モック画面のディレクトリ名は `<purpose>-mock` の形式を推奨（例: `button-test-mock`, `layout-experiment-mock`）
- **シンプルさ優先**: モック画面は検証目的に徹し、不要な複雑さは避ける
- **既存コンポーネント活用**: 既存の共通コンポーネントを積極的に活用する
- **コメント**: モック画面の目的や検証内容をファイル冒頭にコメントで記載する
- **バッジの使い分け**: 
  - `UI`: UI/UXの検証用モック
  - `Integration`: 外部サービス連携のテスト
  - `Test`: 機能テストやデバッグ用
- **アイコン選択**: モック内容に合った適切なTablerアイコンを選択する（[Tabler Icons](https://tabler.io/icons)を参照）

### レイアウト系モックのベストプラクティス

- **複数バリエーション**: レイアウト系モックは必ず3つ程度のバリエーションを提案
- **タブ切り替え**: 1ページ内でタブ切り替えできるようにし、比較を容易にする
- **明確な差異**: 各バリエーションは明確に異なるデザインアプローチを取る
- **説明文**: 各タブに簡単な説明を追加し、デザインコンセプトを明示
- **実装分離**: 複雑な場合は各バリエーションを別コンポーネントに分離
- **バリエーション命名**: 
  - `variant1`, `variant2`, `variant3` をvalue値として使用
  - タブラベルは日本語で分かりやすく（「ミニマル」「モダン」「ガラス」など）
- **一貫性**: 同じコンテンツを使用して、デザインの違いのみを比較できるようにする

## Project Structure Reference

### Test Directory Structure
```
/home/shuhei2441/repo/quest-pay/packages/web/app/test/
├── page.tsx                         # メインテストページ
├── child-view-mock/                 # 子供閲覧モック
├── fab-icons/                       # FABアイコンモック
├── fab-visibility/                  # FAB表示テスト
├── family-member-list-mock/         # 家族メンバー一覧モック
├── family-profile-mock/             # 家族プロフィールモック
├── quest-card-layouts/              # クエストカードレイアウト
├── settings-mock/                   # 設定モック
├── stripe-test/                     # Stripeテスト
├── theme/                           # テーマモック
└── side-menu-*/                     # サイドメニューバリエーション（タブ切り替え式）
    ├── page.tsx                     # タブで3つのバリエーションを切り替え
    ├── Variant1.tsx                 # オプション: バリエーション1コンポーネント
    ├── Variant2.tsx                 # オプション: バリエーション2コンポーネント
    └── Variant3.tsx                 # オプション: バリエーション3コンポーネント
```

### Key Files
- **Endpoints**: `/home/shuhei2441/repo/quest-pay/packages/web/app/(core)/endpoints.ts`
- **Test Page**: `/home/shuhei2441/repo/quest-pay/packages/web/app/test/page.tsx`
- **Test Directory**: `/home/shuhei2441/repo/quest-pay/packages/web/app/test/`

## Example: Layout Mock with Tabs

レイアウト系モック画面の完全な実装例：

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

## Resources

### references/
このスキルには参考資料は含まれていない。必要に応じて、コーディング規約は `coding-standards` スキル、アーキテクチャパターンは `architecture-guide` スキルを参照すること。
