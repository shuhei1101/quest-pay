# 画面パターン詳細説明

## パターン1: CRUD画面

CRUD画面は、データの作成・読取・更新・削除を行う画面のパターン。

### 構成要素

1. **一覧画面 (List Screen)**
   - 役割: データの一覧表示、検索、フィルタリング
   - ファイル: `{Screen}Screen.tsx`
   - レイアウト: `QuestListLayout.tsx` を使用

2. **詳細閲覧画面 (View Screen)**
   - 役割: データの詳細表示（読み取り専用）
   - ファイル: `{Screen}ViewScreen.tsx`
   - パス: `[id]/view/`

3. **編集画面 (Edit Screen)**
   - 役割: データの作成・更新
   - ファイル: `{Screen}EditScreen.tsx`
   - レイアウト: `QuestEditLayout.tsx` を使用
   - パス: `[id]/` または `new/`

4. **API ルート**
   - 役割: バックエンド処理
   - ファイル: `app/api/{resource}/route.ts`
   - メソッド: GET, POST, PUT, DELETE

### ディレクトリ構造例

```
app/(app)/{resource}/
├── page.tsx                    # リダイレクト（必須）
├── {Resource}Screen.tsx        # 一覧画面
├── [id]/
│   ├── page.tsx                # リダイレクト（必須）
│   ├── {Resource}EditScreen.tsx  # 編集画面
│   └── view/
│       ├── page.tsx            # リダイレクト（必須）
│       └── {Resource}ViewScreen.tsx  # 閲覧画面
├── new/
│   ├── page.tsx                # リダイレクト（必須）
│   └── {Resource}NewScreen.tsx # 新規作成画面（または EditScreen を再利用）
├── _components/                # 画面固有コンポーネント
│   ├── {Component1}.tsx
│   └── {Component2}.tsx
├── _hooks/                     # 画面固有フック
│   ├── use{Hook1}.ts
│   └── use{Hook2}.ts
└── form.ts                     # フォームスキーマ（Zodなど）

app/api/{resource}/
├── route.ts                    # 一覧取得・作成
└── [id]/
    └── route.ts                # 詳細取得・更新・削除
```

### スキル構成

- `{resource}-list-skill`: 一覧画面の構造
- `{resource}-view-skill`: 閲覧画面の構造
- `{resource}-edit-skill`: 編集画面の構造
- `{resource}-api-skill`: API操作の知識

## パターン2: レイアウトコンポーネント

レイアウトコンポーネントは、複数の画面で共有される表示構造を提供する。

### 構成要素

1. **レイアウトコンポーネント**
   - 役割: 共通の表示構造を提供
   - ファイル: `{Layout}Layout.tsx`
   - Props: データとイベントハンドラを受け取る

### 使用例

```tsx
<QuestListLayout
  quests={quests}
  onQuestClick={handleQuestClick}
  onFilterChange={handleFilterChange}
/>
```

### スキル構成

- `{layout}-structure-skill`: レイアウトの構造
- `{layout}-usage-skill`: 使用方法

## パターン3: 共通機能コンポーネント

共通機能コンポーネントは、アプリ全体で使用される再利用可能なコンポーネント。

### 配置場所

- **app/(core)/_components/**: ビジネスロジックを含む共通コンポーネント
- **app/(app)/_components/**: アプリレイアウトに関連する共通コンポーネント

### ディレクトリ構造例

```
app/(core)/_components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── index.ts
├── Form/
│   ├── FormField.tsx
│   └── index.ts
└── index.ts

app/(app)/_components/
├── SideMenu.tsx
├── BottomBar.tsx
└── AppHeader.tsx
```

### スキル構成

- `common-components-catalog-skill`: コンポーネント一覧と概要
- `common-components-usage-skill`: 各コンポーネントの使用方法

## パターン4: システム構成ファイル

システム全体の設定や定義を管理するファイル。

### エンドポイント定義（endpoints.ts）

**役割:** アプリ内のすべてのURL/APIパスを一元管理

**構造:**
```typescript
// 画面URL
export const RESOURCE_URL = `/resource`
export const RESOURCE_DETAIL_URL = (id: string) => `${RESOURCE_URL}/${id}`

// API URL
export const RESOURCE_API_URL = `/api${RESOURCE_URL}`
export const RESOURCE_DETAIL_API_URL = (id: string) => `${RESOURCE_API_URL}/${id}`
```

### DBスキーマ（schema.ts）

**役割:** データベースのテーブル定義を管理

**構造:**
```typescript
export const tableName = pgTable('table_name', {
  id: uuid('id').defaultRandom().primaryKey(),
  // その他のカラム定義
})
```

### スキル構成

- `endpoints-definition-skill`: エンドポイント定義の知識
- `schema-structure-skill`: スキーマ構造の知識
- `schema-relations-skill`: テーブル間のリレーションの知識

## アーキテクチャ原則

### フロント構成原則

1. **page.tsx の役割**: リダイレクトのみ（サーバーコンポーネント）
2. **Screen の役割**: API呼び出し、レイアウト構成
3. **Layout の役割**: データ表示のみ（API呼び出し禁止）

### API構成原則

1. **client.ts と route.ts のセット**: 必須
2. **フックの使用**: `useQuery` または `useMutation` を使用
3. **フック経由の呼び出し**: client.ts経由でAPI呼び出し

### DB操作原則

1. **Drizzle低レベルクエリ**: 必須（高レベルクエリ禁止）
2. **排他制御**: 必要に応じて `db_helper.ts` を使用
