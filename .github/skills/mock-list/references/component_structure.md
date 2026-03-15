# Mock List - Component Structure

**記載日**: 2026年3月

## 概要

このドキュメントは、テスト一覧画面（`/test`）のコンポーネント構造とレイアウトを定義します。

## ファイル構成

```
/packages/web/app/test/
├── page.tsx                     # メインテスト一覧ページ
├── error-data/                  # データ取得エラーモック
├── error-network/               # ネットワークエラーモック
├── error-server/                # サーバーエラーモック
├── error-timeout/               # タイムアウトエラーモック
├── error-unknown/               # 不明エラーモック
├── family-profile-mock/         # 家族プロフィールモック
├── settings-mock/               # 設定モック
├── side-menu-avatar/            # サイドメニュー（Avatar）
├── side-menu-glass/             # サイドメニュー（Glass）
├── side-menu-minimal/           # サイドメニュー（Minimal）
├── side-menu-modern/            # サイドメニュー（Modern）
└── stripe-test/                 # Stripeテスト
```

## コンポーネント階層

```
MockListPage (page.tsx)
└── Container (div.p-4)
    ├── Header
    │   ├── Title (Text size="xl" fw={700})
    │   └── Description (Text size="sm" c="dimmed")
    └── Grid (SimpleGrid)
        └── MockCard[] (Card)
            ├── CardHeader (Group)
            │   ├── Icon (Tabler Icon)
            │   └── Badge (optional)
            ├── Title (Text fw={500} size="lg")
            └── Description (Text size="sm" c="dimmed")
```

## レイアウト構造

### ページ全体レイアウト

```tsx
<div className="p-4">
  {/* ヘッダーセクション */}
  <Text size="xl" fw={700} mb="md">
    モック画面一覧
  </Text>
  <Text size="sm" c="dimmed" mb="xl">
    UI/UX検証、プロトタイピング用のモック画面です
  </Text>

  {/* グリッドレイアウト */}
  <SimpleGrid 
    cols={{ base: 1, sm: 2, md: 3 }} 
    spacing="md"
  >
    {/* カード配列 */}
  </SimpleGrid>
</div>
```

### 個別カード構造

```tsx
<Card
  shadow="sm"
  padding="lg"
  radius="md"
  withBorder
  className="cursor-pointer hover:shadow-md transition-shadow"
  onClick={() => router.push(item.url)}
>
  {/* ヘッダー: アイコンとバッジ */}
  <Group justify="space-between" mb="xs">
    <div className="text-blue-600">
      {item.icon}
    </div>
    {item.badge && (
      <Badge color="blue" variant="light" size="sm">
        {item.badge}
      </Badge>
    )}
  </Group>

  {/* タイトル */}
  <Text fw={500} size="lg" mb="xs">
    {item.title}
  </Text>

  {/* 説明 */}
  <Text size="sm" c="dimmed">
    {item.description}
  </Text>
</Card>
```

## データ構造

### MockItem Type

```typescript
type MockItem = {
  title: string          // モック画面のタイトル
  description: string    // モック画面の説明
  url: string           // モック画面のURL（endpoints.tsから）
  icon: React.ReactNode // アイコン要素（Tablerアイコン）
  badge?: string        // バッジラベル（UI, Integration, Test）
}
```

### mockItems Array

```typescript
const mockItems: MockItem[] = [
  {
    title: "家族プロフィールモック",
    description: "家族プロフィール画面のモック",
    url: TEST_FAMILY_PROFILE_MOCK_URL,
    icon: <IconHome size={32} />,
    badge: "UI"
  },
  // ... 他のモック項目
]
```

## レスポンシブデザイン

### グリッドカラム設定

```typescript
<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
```

- **base** (モバイル): 1列
- **sm** (タブレット): 2列
- **md** (デスクトップ): 3列

### カードのインタラクティブ効果

- **通常状態**: `shadow="sm"`
- **ホバー時**: `hover:shadow-md`
- **トランジション**: `transition-shadow`
- **カーソル**: `cursor-pointer`

## バッジの種類と用途

### UI バッジ
- **色**: blue
- **用途**: UI/UX検証用モック
- **例**: 家族プロフィール、設定、サイドメニュー

### Integration バッジ
- **色**: blue
- **用途**: 外部サービス連携テスト
- **例**: Stripe決済テスト

### Test バッジ
- **色**: blue
- **用途**: 機能テストやデバッグ用
- **例**: エラー画面モック

## アイコンの選択基準

### 一般的なパターン

| モック内容 | アイコン | 理由 |
|-----------|---------|------|
| ホーム/プロフィール | IconHome | 家族・ホーム画面を表現 |
| 設定 | IconSettings | 設定機能を表現 |
| メニュー/ナビゲーション | IconMenu2 | メニュー構造を表現 |
| 決済/Stripe | IconBrandStripe | サービス固有アイコン |
| エラー | IconAlertTriangle | 警告・エラーを表現 |

### アイコンサイズ

- **カード内**: `size={32}` (標準)
- **大きな要素**: `size={48}` (特別な場合)
- **小さな要素**: `size={24}` (コンパクトな場合)

## インタラクション設計

### カードクリック処理

```typescript
const router = useRouter()

<Card onClick={() => router.push(item.url)}>
```

- **動作**: クライアントサイドルーティング
- **遷移先**: endpoints.ts で定義されたURL
- **フィードバック**: hover時のshadow変化

### キーボードナビゲーション

カードは`<Card>`要素のため、基本的なキーボードナビゲーションは自動対応。
アクセシビリティ向上のため、必要に応じて`tabIndex`や`role`を追加可能。

## スタイリングの原則

### Mantineコンポーネント活用
- **Text**: タイポグラフィ
- **Card**: カードコンテナ
- **SimpleGrid**: レスポンシブグリッド
- **Group**: 水平配置
- **Badge**: ステータス表示

### Tailwind CSS補完
- **padding**: `p-4`（ページ全体）
- **text-color**: `text-blue-600`（アイコン）
- **cursor**: `cursor-pointer`（カード）
- **transition**: `transition-shadow`（ホバー効果）

## 拡張性

### 新規モック追加手順

1. **URL定義** (`endpoints.ts`)
```typescript
export const TEST_NEW_MOCK_URL = `${TEST_URL}/new-mock`
```

2. **インポート追加** (`test/page.tsx`)
```typescript
import { IconNewIcon } from "@tabler/icons-react"
import { TEST_NEW_MOCK_URL } from "@/app/(core)/endpoints"
```

3. **mockItems配列に追加**
```typescript
{
  title: "新しいモック",
  description: "新しいモックの説明",
  url: TEST_NEW_MOCK_URL,
  icon: <IconNewIcon size={32} />,
  badge: "UI"
}
```

### カスタマイズポイント

- **カードのスタイル**: Card propsでshadow, padding, radius等を調整
- **グリッドレイアウト**: colsプロパティでカラム数を変更
- **バッジの色**: colorプロパティで色を変更
- **アイコンのサイズ**: sizeプロパティで調整

## アクセシビリティ考慮

- **セマンティックHTML**: `<Text>`でh1相当のタイトル
- **色のコントラスト**: `c="dimmed"`で十分なコントラスト
- **ホバー効果**: マウスユーザーへの視覚的フィードバック
- **クリック可能範囲**: カード全体がクリック可能

## パフォーマンス考慮

- **クライアントサイドルーティング**: useRouterで高速遷移
- **静的データ**: mockItems配列は静的に定義
- **最小限のstate**: routerのみ使用（activeTabなどのstateなし）
