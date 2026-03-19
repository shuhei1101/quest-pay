---
name: mock
description: 'モック画面作成の知識を提供するスキル。テスト用モックページの作成・一覧登録・スクリプト・バッジ・アイコン設定の方法を含む。'
---

# モック画面作成 スキル

## 概要

UI/UX検証用のモック画面を `/packages/web/app/test/` 配下に作成し、テスト一覧ページ（`/test`）にリンクカードを追加する機能。

**注意**: モック作成時は `ui-ux-pro-max` スキルを必ず使用してデザイン品質を確保すること。

## メインソースファイル

### モック画面
- `packages/web/app/test/page.tsx`: テスト一覧ページ
- `packages/web/app/test/<mock-name>/page.tsx`: 各モック画面

### 設定ファイル
- `packages/web/app/(core)/endpoints.ts`: URL定義

### スクリプト
- `.github/skills/mock-creator/scripts/create_mock_page.sh`: モックページ生成スクリプト

## 作成ワークフロー

### Step 1: スクリプトでページを生成

```bash
# 単一パターン
bash .github/skills/mock-creator/scripts/create_mock_page.sh <mock-name> "<title>"

# タブバリエーション（レイアウト比較用）
bash .github/skills/mock-creator/scripts/create_mock_page.sh <mock-name> "<title>" tabs
```

### Step 2: endpoints.ts にURL追加

```typescript
export const TEST_<MOCK_NAME>_URL = `${TEST_URL}/<mock-name>`
```

### Step 3: test/page.tsx にカード追加

```typescript
import { TEST_<MOCK_NAME>_URL } from "@/app/(core)/endpoints"

const mockItems: MockItem[] = [
  // ... 既存のアイテム
  {
    title: "モック名",
    description: "説明",
    href: TEST_<MOCK_NAME>_URL,
    badge: "UI",           // "UI" | "Integration" | "Test"
    icon: <IconName size={24} />  // Tabler Icons から選択
  }
]
```

## レイアウト系モックの判定

以下のキーワードがある場合は `tabs` オプションでタブバリエーション作成:
- 「レイアウト」「デザイン」「スタイル」「パターン」「バリエーション」「比較」
- サイドメニュー、ヘッダー、フッター、カードなどUI要素名

## バッジの使い分け

- `UI`: UI/UXの検証用モック
- `Integration`: 外部サービス連携テスト
- `Test`: 機能テスト・デバッグ用

## 命名規則

- ディレクトリ名: `<purpose>-mock`（例: `button-test-mock`, `layout-experiment-mock`）
- URL定数: `TEST_<MOCK_NAME>_URL`（例: `TEST_BUTTON_TEST_MOCK_URL`）

## 実装上の注意点

- モック画面は検証目的に徹し、不要な複雑さを避ける
- 既存の共通コンポーネントを積極的に活用する
- タブバリエーションは3種類程度の異なるデザインスタイルを提案
- アイコンは [Tabler Icons](https://tabler.io/icons) から選択
