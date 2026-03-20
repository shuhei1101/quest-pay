---
name: quest-edit
description: 'クエスト編集機能の知識を提供するスキル。QuestEditLayout共通コンポーネント・タブ設定・FAB・エラーバッジの使い方と、家族/公開クエスト編集APIの5層構成（route/service/query/db）を含む。'
---

# クエスト編集 スキル

## 概要

クエスト編集画面で使用する共通レイアウトコンポーネント `QuestEditLayout` と、クエスト編集に関わる API（家族・公開クエスト）の実装パターンを提供する。

---

## フロントエンド

### メインソースファイル

- `packages/web/app/(app)/quests/_components/QuestEditLayout.tsx`: 共通編集レイアウト
- `packages/web/app/(app)/quests/_components/QuestEditLayout.types.ts`: 型定義

### コンポーネント構造

```
QuestEditLayout
├── ScrollableTabs（タブナビゲーション）
│   └── タブラベル（エラーがある場合は赤いバッジ）
├── タブコンテンツ（各タブのフォーム）
└── SubMenuFAB（保存・追加アクション）
```

### Props

```typescript
type QuestEditLayoutProps = {
  questId?: string          // 編集時のクエストID（新規作成時はundefined）
  tabs: TabConfig[]         // タブ設定配列
  editActions: ActionConfig[] // 保存ボタンなどのアクション
  fabEditActions?: ActionConfig[] // FABに表示するアクション
}

type TabConfig = {
  value: string             // タブの識別子
  label: string             // タブのラベル
  hasErrors?: boolean       // エラーがある場合にバッジを表示
  content: ReactNode        // タブの内容
}
```

### 使用例（家族クエスト編集）

```typescript
<QuestEditLayout
  questId={questId}
  tabs={[
    {
      value: "basic",
      label: "基本設定",
      hasErrors: !!errors.title,
      content: <BasicSettingsForm />
    },
    {
      value: "detail",
      label: "詳細設定",
      content: <DetailSettingsForm />
    },
    {
      value: "child",
      label: "子供設定",
      content: <ChildSettingsForm />
    }
  ]}
  editActions={[
    { label: "保存", onClick: handleSave, loading: isSaving }
  ]}
  fabEditActions={[
    { label: "レベル追加", onClick: handleAddLevel }
  ]}
/>
```

### 実装上の注意点

- タブエラーバッジ: `hasErrors: true` の場合に赤いバッジを表示
- `ScrollableTabs` は横スクロール可能（タブが多い場合）
- FABの表示制御は `fabEditActions` が空配列 or undefined の場合に非表示
- 各タブのバリデーションエラーは各フォームコンポーネントで管理

### 使用画面

- `packages/web/app/(app)/quests/family/new/page.tsx`: 家族クエスト新規作成
- `packages/web/app/(app)/quests/family/[id]/page.tsx`: 家族クエスト編集
- `packages/web/app/(app)/quests/public/[id]/page.tsx`: 公開クエスト編集

---

## API（5層構成）

### 家族クエスト編集

| レイヤー | ファイル |
|----------|---------|
| route    | `packages/web/app/api/quests/family/[id]/route.ts` |
| service  | `packages/web/app/api/quests/family/service.ts` |
| query    | `packages/web/app/api/quests/family/query.ts` |
| db       | `packages/web/app/api/quests/family/db.ts` |
| client   | `packages/web/app/api/quests/family/[id]/client.ts` |
| 共有DB   | `packages/web/app/api/quests/db.ts` |
| 共有DBヘルパー | `packages/web/app/api/quests/dbHelper.ts` |

エンドポイント:
- `GET /api/quests/family/[id]`: 詳細取得
- `PUT /api/quests/family/[id]`: 更新（楽観的ロック: `version` 必須）
- `DELETE /api/quests/family/[id]`: 削除
- `POST /api/quests/family`: 新規作成

### 公開クエスト編集

| レイヤー | ファイル |
|----------|---------|
| route    | `packages/web/app/api/quests/public/[id]/route.ts` |
| client   | `packages/web/app/api/quests/public/[id]/client.ts` |
| 共有DB   | `packages/web/app/api/quests/db.ts` |
| 共有DBヘルパー | `packages/web/app/api/quests/dbHelper.ts` |

エンドポイント:
- `GET /api/quests/public/[id]`: 詳細取得
- `PUT /api/quests/public/[id]`: 更新
- `DELETE /api/quests/public/[id]`: 削除

### 共有DBファイル

- `packages/web/app/api/quests/db.ts`: `insertQuest` / `updateQuest` など汎用クエスト操作
- `packages/web/app/api/quests/dbHelper.ts`: 楽観的ロック (`checkVersion`) などの共通ヘルパー
- `packages/web/app/api/quests/detail/db.ts`: クエスト詳細取得の共通クエリ

### 実装パターン

```typescript
// route.ts の基本パターン
export const PUT = withRouteErrorHandling(async (req, { params }) => {
  const { user } = await getAuthContext()
  const body = await req.json()
  const result = await updateFamilyQuestService({ userId: user.id, questId: params.id, ...body })
  return NextResponse.json(result)
})
```
