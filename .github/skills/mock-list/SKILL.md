---
name: mock-list
description: テスト一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。
---

# Mock List スキル

## 概要

このスキルは、お小遣いクエストボードプロジェクトのテスト一覧画面（`/test`）の構造知識を提供する。モック画面へのナビゲーションハブとして機能し、すべてのモック画面にアクセス可能。

## メインソースファイル

### メインファイル
- `packages/web/app/test/page.tsx`: テスト一覧ページ実装

### モック画面ディレクトリ
- `packages/web/app/test/<mock-name>/page.tsx`: 各モック画面

### 設定ファイル
- `packages/web/app/(core)/endpoints.ts`: URL定義

## 主要機能グループ

### 1. モック一覧表示
- カードベースのグリッドレイアウト
- バッジとアイコンによる分類表示
- レスポンシブデザイン（1〜3列）

### 2. ナビゲーション
- クライアントサイドルーティング
- ホバー効果による視覚的フィードバック

### 3. モック管理
- mockItems配列による一元管理
- バッジによる分類（UI/Integration/Test）

## Reference Files Usage

### コンポーネント構造を理解する場合
ページレイアウト、カード階層、データ構造を確認：
```
references/component_structure.md
```

### ユーザーフローを把握する場合
アクセスフロー、インタラクション、新規追加手順を確認：
```
references/flow_diagram.md
```

## クイックスタート

1. **一覧確認**: `/test` にアクセスしてモック一覧を表示
2. **新規追加時**: endpoints.ts に URL 追加 → test/page.tsx に mockItem 追加
3. **カスタマイズ**: バッジ・アイコン・グリッドレイアウトを調整

## 使用時のトリガー

次の場合にこのスキルを使用する：

- テスト一覧ページの構造を理解したい時
- 新しいモックカードを追加したい時
- モック一覧の表示方法を変更したい時
- バッジやアイコンの使い方を確認したい時
- モックの分類方法を理解したい時

## データ構造

### MockItem Type

```typescript
type MockItem = {
  title: string          // モック画面のタイトル
  description: string    // モック画面の説明
  url: string           // モック画面のURL（endpoints.tsから）
  icon: React.ReactNode // アイコン要素
  badge?: string        // バッジラベル（UI, Integration, Test）
}
```

## 実装上の注意点

### 新規モック追加手順
1. **URL定義** (`endpoints.ts`)
2. **インポート追加** (`test/page.tsx`)
3. **mockItems配列に追加** (title, description, url, icon, badge)

### レスポンシブ設計
- **base** (モバイル): 1列
- **sm** (タブレット): 2列
- **md** (デスクトップ): 3列

### アイコンとバッジ
- **アイコンサイズ**: `size={32}` 推奨
- **バッジ色**: `color="blue"` 統一
- **バッジ種類**: UI, Integration, Test

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## Dependencies

### External Libraries

```typescript
import { Card, Text, SimpleGrid, Badge, Group } from "@mantine/core"
import { 
  IconHome, 
  IconSettings, 
  IconBrandStripe,
  IconAlertTriangle,
  IconWifi,
  IconClock,
  IconDatabase,
  IconServer,
  IconMenu2,
  IconLayoutSidebar,
  IconUser,
  IconSparkles
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
```

### Internal Modules

```typescript
import { 
  TEST_FAMILY_PROFILE_MOCK_URL,
  TEST_SETTINGS_MOCK_URL,
  TEST_STRIPE_TEST_URL,
  TEST_ERROR_UNKNOWN_URL,
  TEST_ERROR_NETWORK_URL,
  TEST_ERROR_TIMEOUT_URL,
  TEST_ERROR_DATA_URL,
  TEST_ERROR_SERVER_URL,
  TEST_SIDE_MENU_MINIMAL_URL,
  TEST_SIDE_MENU_MODERN_URL,
  TEST_SIDE_MENU_AVATAR_URL,
  TEST_SIDE_MENU_GLASS_URL
} from "@/app/(core)/endpoints"
```

## Process Flow

### 1. Page Load

```
1. ページコンポーネントがマウント
2. mockItems配列が初期化
3. UIがレンダリング
```

### 2. Mock Items Definition

```
1. 各モックのタイトル、説明、URL、アイコン、バッジを定義
2. mockItems配列に格納
3. 配列をマップしてカードを生成
```

### 3. User Interaction

```
1. ユーザーがカードをクリック
2. onClick イベントが発火
3. router.push(item.url) でモック画面に遷移
```

## Adding New Mock

新しいモックカードを追加する手順：

### Step 1: Import Endpoint

```typescript
import { 
  // 既存のインポート
  TEST_FAMILY_PROFILE_MOCK_URL,
  // 新規追加
  TEST_NEW_MOCK_URL
} from "@/app/(core)/endpoints"
```

### Step 2: Import Icon (if needed)

```typescript
import { 
  IconHome, 
  IconSettings,
  // 新規追加
  IconNewIcon
} from "@tabler/icons-react"
```

### Step 3: Add to mockItems Array

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
    title: "新しいモック",
    description: "新しいモックの説明",
    url: TEST_NEW_MOCK_URL,
    icon: <IconNewIcon size={32} />,
    badge: "UI" // または "Integration", "Test"
  }
]
```

## Badge Types

### UI
- **用途**: UI/UXの検証用モック
- **例**: 家族プロフィールモック、設定モック、サイドメニューバリエーション

### Integration
- **用途**: 外部サービス連携のテスト
- **例**: Stripeテスト、API連携テスト

### Test
- **用途**: 機能テストやデバッグ用
- **例**: エラー画面モック、エッジケーステスト

## Icon Selection

### Guidelines

1. **関連性**: モック内容に合ったアイコンを選択
2. **視認性**: 32pxサイズで明確に認識できるアイコン
3. **一貫性**: 似た機能のモックには似たアイコンを使用

### Common Icons

| モック種類 | アイコン | 用途 |
|-----------|---------|------|
| ホーム関連 | `IconHome` | 家族、プロフィール |
| 設定関連 | `IconSettings` | 設定、構成 |
| エラー関連 | `IconAlertTriangle` | 一般エラー |
| ネットワーク | `IconWifi` | ネットワークエラー |
| 時間関連 | `IconClock` | タイムアウト |
| データ関連 | `IconDatabase` | データエラー |
| サーバー関連 | `IconServer` | サーバーエラー |
| メニュー関連 | `IconMenu2`, `IconLayoutSidebar` | サイドメニュー |
| ユーザー関連 | `IconUser` | プロフィール、アバター |
| 特殊効果 | `IconSparkles` | ガラスモーフィズム |

### Icon Resources

- [Tabler Icons](https://tabler.io/icons) - 利用可能なアイコンの検索
- `@tabler/icons-react` - ReactコンポーネントとしてインポートN

## Layout and Styling

### Responsive Grid

```typescript
<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
  {/* カードをマップ */}
</SimpleGrid>
```

**Breakpoints**:
- `base`: 1列（モバイル）
- `sm`: 2列（タブレット）
- `md`: 3列（デスクトップ）

### Card Styling

```typescript
<Card
  shadow="sm"
  padding="lg"
  radius="md"
  withBorder
  className="cursor-pointer hover:shadow-md transition-shadow"
  onClick={() => router.push(item.url)}
>
  {/* カード内容 */}
</Card>
```

**Features**:
- ホバー時にシャドウ強調
- スムーズなトランジション
- クリック可能なカーソル表示

### Card Content Structure

```typescript
<Card>
  <Group justify="space-between" mb="xs">
    <div className="text-blue-600">{item.icon}</div>
    {item.badge && (
      <Badge color="blue" variant="light" size="sm">
        {item.badge}
      </Badge>
    )}
  </Group>

  <Text fw={500} size="lg" mb="xs">
    {item.title}
  </Text>

  <Text size="sm" c="dimmed">
    {item.description}
  </Text>
</Card>
```

## Best Practices

### Naming Conventions

- **タイトル**: 簡潔で分かりやすい日本語
- **説明**: 1行で目的を明確に記述
- **URL定義**: `TEST_<MOCK_NAME>_URL` の形式

### Organization

- **グループ化**: 関連するモックを近くに配置
- **順序**: 重要度や使用頻度順に配置
- **カテゴリ**: バッジで分類を明確化

### Maintenance

- **一貫性**: 既存のパターンに従う
- **ドキュメント**: 新しいパターンはスキルに追加
- **クリーンアップ**: 不要なモックは削除

## Common Patterns

### Pattern 1: Error Mock Series

```typescript
{
  title: "エラー: <エラー種類>",
  description: "<エラー種類>エラー画面のモック",
  url: TEST_ERROR_<TYPE>_URL,
  icon: <Icon適切なアイコン size={32} />,
  badge: "Test"
}
```

### Pattern 2: UI Variant Series

```typescript
{
  title: "<コンポーネント名>: <バリエーション>",
  description: "<バリエーション>デザインの<コンポーネント名>",
  url: TEST_<COMPONENT>_<VARIANT>_URL,
  icon: <Icon適切なアイコン size={32} />,
  badge: "UI"
}
```

### Pattern 3: Integration Test

```typescript
{
  title: "<サービス名>テスト",
  description: "<サービス名>の<機能>テスト",
  url: TEST_<SERVICE>_TEST_URL,
  icon: <IconBrand<Service> size={32} />,
  badge: "Integration"
}
```

## Related Files

### Endpoints Definition

**Path**: `/home/shuhei2441/repo/quest-pay/packages/web/app/(core)/endpoints.ts`

**Purpose**: モック画面のURL定義

**Example**:
```typescript
export const TEST_URL = "/test"
export const TEST_FAMILY_PROFILE_MOCK_URL = `${TEST_URL}/family-profile-mock`
export const TEST_SETTINGS_MOCK_URL = `${TEST_URL}/settings-mock`
// ...
```

### Mock Screens

**Pattern**: `/home/shuhei2441/repo/quest-pay/packages/web/app/test/<mock-name>/page.tsx`

**Purpose**: 個別のモック画面実装

## Troubleshooting

### Issue 1: 新しいモックが表示されない

**原因**:
- エンドポイントが定義されていない
- インポート文が不足
- `mockItems`配列に追加されていない

**解決策**:
1. `endpoints.ts` に URL を定義
2. `page.tsx` でエンドポイントをインポート
3. `mockItems` 配列に追加

### Issue 2: アイコンが表示されない

**原因**:
- アイコンがインポートされていない
- アイコン名が間違っている
- sizeプロパティが指定されていない

**解決策**:
1. `@tabler/icons-react` からアイコンをインポート
2. アイコン名を確認（[Tabler Icons](https://tabler.io/icons)）
3. `size={32}` プロパティを追加

### Issue 3: カードのクリックが動作しない

**原因**:
- URLが正しく定義されていない
- `onClick` ハンドラーの問題
- ルーターの初期化エラー

**解決策**:
1. URLを確認（`endpoints.ts`）
2. `onClick={() => router.push(item.url)}` を確認
3. `useRouter` が正しくインポートされているか確認

## Future Enhancements

### Potential Improvements

1. **カテゴリフィルター**: バッジでフィルタリング機能
2. **検索機能**: タイトルや説明で検索
3. **お気に入り機能**: よく使うモックをピン留め
4. **グループ表示**: カテゴリごとにセクション分け
5. **説明の充実**: より詳細な説明やスクリーンショット

### Considerations

- ユーザビリティの向上
- パフォーマンスの最適化
- メンテナンス性の維持
