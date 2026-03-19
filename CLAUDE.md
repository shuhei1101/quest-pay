# Quest Pay - プロジェクト設定

## アーキテクチャ

### フロントエンド（3層構成）
```
page.tsx          ← ルートページ（データフェッチなし）
  └── XxxScreen.tsx   ← データ取得・状態管理・イベントハンドラー
        └── XxxLayout.tsx  ← データ表示のみ（ロジックなし）
```

### バックエンド API（5層構成）
```
client.ts   ← フロントからの API 呼び出し
  └── route.ts    ← Next.js API ルート（認証・バリデーション）
        └── service.ts  ← ビジネスロジック
              └── query.ts    ← SQLクエリ構築
                    └── db.ts       ← 低レベル DB 操作
```

### ディレクトリ構造

```
packages/web/
├── app/
│   ├── (app)/          ← 認証必須の画面
│   │   ├── _components/    ← AppShell コンポーネント
│   │   ├── home/           ← ホーム画面
│   │   ├── families/       ← 家族管理
│   │   ├── quests/         ← クエスト管理
│   │   ├── children/       ← 子供管理
│   │   ├── reward/         ← 報酬設定
│   │   ├── notifications/  ← 通知
│   │   └── settings/       ← 設定
│   ├── (auth)/         ← 認証不要の画面（ログインなど）
│   ├── (core)/         ← 共通機能
│   │   ├── _components/    ← 共通UIコンポーネント
│   │   ├── errors/         ← エラークラス・ハンドラー
│   │   ├── endpoints.ts    ← URL定義（全て集約）
│   │   └── logger.ts       ← ロガー設定
│   ├── api/            ← API routes
│   └── test/           ← モック画面
├── drizzle/
│   ├── schema.ts       ← DB スキーマ（全テーブル定義）
│   └── migrations/     ← マイグレーションファイル
└── tmp/                ← 一時ファイル（Git管理外）
```

### 命名規則

| 種別 | 命名パターン | 例 |
|------|------------|-----|
| 画面コンポーネント | `XxxScreen.tsx` | `FamilyQuestListScreen.tsx` |
| レイアウトコンポーネント | `XxxLayout.tsx` | `QuestEditLayout.tsx` |
| フック | `useXxx.ts` | `useFamilies.ts` |
| API クライアント | `client.ts` | - |
| API ルート | `route.ts` | - |
| エンティティ型 | `entity.ts` | `quest.entity.ts` |

### 必須パターン

- `ScreenWrapper`: 全 Screen コンポーネントでラップ（パディング・最大幅制御）
- `LoadingButton`: 画面遷移時のローディング管理
- `withRouteErrorHandling`: 全 route.ts をラップ
- `getAuthContext()`: 認証情報取得（全 API で必須）
- 共通コンポーネントは `app/(core)/_components/`、画面固有は `_components/`、`_hooks/`

---

## コーディング規約

### 基本

- **セミコロン禁止**: ステートメントの末尾にセミコロンを付けない
- **関数定義**: `const` + アロー関数を使用（`function` 宣言は使わない）
- **コメント**: 日本語で記述。自明なコードにはコメント不要、複雑なロジックのみ追加

```typescript
// ✅ OK
const handleClick = () => {}
const name = "test"

// ❌ NG
function handleClick() {};
const name = "test";
```

### TypeScript

- 型定義は `entity.ts` に集約（`types.ts` は使わない）
- `interface` より `type` を優先
- `any` 型禁止
- `as` キャストは最小限（型安全が保証できる場合のみ）
- `!` 非 null アサーション演算子は原則禁止

### React

- `export default` ではなく名前付きエクスポートを使用
- コンポーネント: PascalCase（`MyComponent.tsx`）
- フック・ユーティリティ: camelCase（`useMyHook.ts`）

### YAGNI 原則

- 現在必要なものだけを実装する
- 「将来使うかもしれない」コードは書かない
- 過度な抽象化を避ける

### ロガー

```typescript
import { logger } from "@/app/(core)/logger"

logger.info("クエスト一覧を取得", { userId })
logger.error("クエスト取得に失敗", error)
```

`console.log` は使わず、必ずロガー経由で統一する。

### Import 順序

1. React / Next.js
2. 外部ライブラリ
3. 内部モジュール（`@/app/...`）
4. 相対パス
