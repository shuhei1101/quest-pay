(2026年3月15日 14:30記載)

# 家族一覧画面 コンポーネント構造

## ファイル構成

```
packages/web/app/(app)/families/
├── page.tsx                    # ルート（サーバーコンポーネント）
├── FamiliesScreen.tsx          # 一覧画面メイン
└── _components/
    ├── FamilyList.tsx          # 家族一覧表示
    └── FamilyCard.tsx          # 家族カード
```

## コンポーネント階層

```
page.tsx (Server Component)
└── FamiliesScreen (Client Component)
    └── FamilyList
        └── FamilyCard × N
```

## 主要コンポーネント

### FamiliesScreen
**パス**: `app/(app)/families/FamiliesScreen.tsx`  
**タイプ**: Client Component (`"use client"`)

**責務**:
- 家族一覧の表示統括
- ヘッダーとレイアウト管理
- 新規作成ボタンの配置

**主要Props**: なし（自己完結型）

**使用するフック**:
- `useFamilies()`: 家族データ取得

**表示要素**:
- ページヘッダー
- FamilyList コンポーネント
- FloatingActionButton（新規作成）

---

### FamilyList
**パス**: `app/(app)/families/_components/FamilyList.tsx`  
**タイプ**: Client Component

**責務**:
- 家族カードのリスト表示
- クリックイベントハンドリング

**Props**:
```typescript
{
  families: Family[]        // 家族一覧データ
  onClick?: (familyId: string) => void
}
```

**レイアウト**:
- `<Stack>` による縦並び配置
- 各カードは `<FamilyCard>` で表示

---

### FamilyCard
**パス**: `app/(app)/families/_components/FamilyCard.tsx`  
**タイプ**: Client Component

**責務**:
- 1件の家族情報表示
- クリック可能なカードUIの提供

**Props**:
```typescript
{
  family: Family                // 家族データ
  isSelected?: boolean          // 選択状態
  onClick?: (familyId: string) => void
}
```

**表示項目**:
- 家族名
- メンバー数
- アイコン/画像

**スタイル**:
- Mantineの `<Card>` コンポーネント使用
- ホバー時のエフェクト
- 選択状態のハイライト

---

## レイアウトパターン

### デスクトップ表示
```
┌─────────────────────────────────┐
│  ページヘッダー: "家族一覧"      │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │  FamilyCard 1             │  │
│  ├───────────────────────────┤  │
│  │  FamilyCard 2             │  │
│  ├───────────────────────────┤  │
│  │  FamilyCard 3             │  │
│  └───────────────────────────┘  │
│                                 │
│  [FloatingActionButton: +]      │
└─────────────────────────────────┘
```

### モバイル表示
- デスクトップと同じ縦並びレイアウト
- カードの幅が画面幅に追従
- FABは画面右下に固定配置

---

## 共通UIパーツ

### PageHeader
- タイトル: "家族一覧"
- 戻るボタン（必要に応じて）

### FloatingActionButton
- アイコン: `<IconPlus>`
- アクション: 新規家族作成画面へ遷移
- 配置: 画面右下固定

---

## スタイリング

### Mantineコンポーネント使用
- `Stack`: カード縦並び配置
- `Card`: 家族カード表示
- `Paper`: 背景ラッパー
- `Text`: テキスト表示

### カスタムスタイル
- gap: 4（カード間隔）
- padding: "sm"
- borderRadius: "md"
- shadow: "sm"
