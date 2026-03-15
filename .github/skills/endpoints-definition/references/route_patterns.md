# Route Patterns リファレンス
> 2026年3月記載

## 概要

Quest Payアプリケーションのルート定義パターンと使用方法のベストプラクティス。

## 基本原則

### 1. すべてのURLは`endpoints.ts`で一元管理

**✅ 良い例**
```typescript
import { FAMILY_QUESTS_URL } from '@/(core)/endpoints'
router.push(FAMILY_QUESTS_URL)
```

**❌ 悪い例**
```typescript
router.push('/quests/family')  // ハードコーディング禁止
```

### 2. 動的URLは関数形式で定義

**パターン**
```typescript
// 単一ID
export const FAMILY_QUEST_URL = (id: string) => `${FAMILY_QUESTS_URL}/${id}`

// 複数ID
export const APPROVE_REPORT_API_URL = (questId: string, childId: string) => 
  `${FAMILY_QUEST_API_URL(questId)}/child/${childId}/approve`
```

### 3. 階層構造を保つ

**構造例**
```typescript
// ベースURL
export const QUESTS_URL = `/quests`

// カテゴリ別
export const FAMILY_QUESTS_URL = `${QUESTS_URL}/family`
export const PUBLIC_QUESTS_URL = `${QUESTS_URL}/public`

// 詳細ページ
export const FAMILY_QUEST_URL = (id: string) => `${FAMILY_QUESTS_URL}/${id}`
export const FAMILY_QUEST_VIEW_URL = (id: string) => `${FAMILY_QUEST_URL(id)}/view`
```

## ルートパターン

### パターン1: 一覧・詳細・編集

```typescript
// 一覧
export const FAMILIES_URL = `/families`

// 新規作成
export const FAMILY_NEW_URL = `${FAMILIES_URL}/new`

// 詳細（編集）
export const FAMILY_URL = (id: string) => `${FAMILIES_URL}/${id}`

// 閲覧専用
export const FAMILY_VIEW_URL = (id: string) => `${FAMILY_URL(id)}/view`
```

### パターン2: ネストした操作

```typescript
// 親リソース
export const FAMILY_QUEST_API_URL = (id: string) => `${FAMILY_QUESTS_API_URL}/${id}`

// 子リソースの操作
export const APPROVE_REPORT_API_URL = (questId: string, childId: string) => 
  `${FAMILY_QUEST_API_URL(questId)}/child/${childId}/approve`

export const REJECT_REPORT_API_URL = (questId: string, childId: string) => 
  `${FAMILY_QUEST_API_URL(questId)}/child/${childId}/reject`
```

### パターン3: アクション

```typescript
// リソースベース
export const PUBLIC_QUEST_API_URL = (id: string) => `${PUBLIC_QUESTS_API_URL}/${id}`

// アクション
export const PUBLIC_QUEST_ACTIVATE_API_URL = (id: string) => 
  `${PUBLIC_QUEST_API_URL(id)}/activate`

export const PUBLIC_QUEST_DEACTIVATE_API_URL = (id: string) => 
  `${PUBLIC_QUEST_API_URL(id)}/deactivate`

export const PUBLIC_QUEST_LIKE_API_URL = (id: string) => 
  `${PUBLIC_QUEST_API_URL(id)}/like`
```

### パターン4: カウント取得

```typescript
// リソースベース
export const PUBLIC_QUEST_LIKE_API_URL = (id: string) => 
  `${PUBLIC_QUEST_API_URL(id)}/like`

// カウント取得
export const PUBLIC_QUEST_LIKE_COUNT_API_URL = (id: string) => 
  `${PUBLIC_QUEST_LIKE_API_URL(id)}/count`
```

## 命名規則

### ページURL
- 末尾: `_URL`
- 例: `FAMILY_QUESTS_URL`, `LOGIN_URL`

### API URL
- 末尾: `_API_URL`
- 例: `FAMILY_QUESTS_API_URL`, `LOGIN_USER_API_URL`

### 動的URL
- 関数形式: `(id: string) => string`
- 例: `FAMILY_QUEST_URL(id)`, `CHILD_API_URL(childId)`

### 新規作成
- 末尾: `_NEW_URL`
- 例: `FAMILY_NEW_URL`, `CHILD_NEW_URL`

### 閲覧専用
- 末尾: `_VIEW_URL`
- 例: `FAMILY_VIEW_URL(id)`, `PUBLIC_QUEST_VIEW_URL(id)`

## ページとAPIの対応

### 対応パターン1: 同一構造
```typescript
// ページ
export const FAMILY_QUESTS_URL = `/quests/family`

// API
export const FAMILY_QUESTS_API_URL = `/api/quests/family`
```

### 対応パターン2: ページとAPIで異なる場合
```typescript
// ページは `/children/:id` でアクセス
export const CHILD_URL = (id: string) => `${CHILDREN_URL}/${id}`

// APIは `/api/children/:id` でアクセス
export const CHILD_API_URL = (id: string) => `${CHILDREN_API_URL}/${id}`
```

## 環境別設定

### ドメイン設定
```typescript
// 環境変数から取得（本番/開発で切り替え）
export const APP_DOMAIN = process.env.APP_DOMAIN || `http://localhost:3000`
```

### 完全URL生成
```typescript
// 相対URL
const relativePath = FAMILY_QUEST_VIEW_URL('quest-123')
// => '/quests/family/quest-123/view'

// 絶対URL（メール送信など外部参照用）
const absoluteUrl = `${APP_DOMAIN}${relativePath}`
// => 'https://yourdomain.com/quests/family/quest-123/view'
```

## 使用例

### コンポーネントでの使用
```typescript
import { FAMILY_QUESTS_URL, FAMILY_QUEST_VIEW_URL } from '@/(core)/endpoints'
import Link from 'next/link'

export function QuestList() {
  return (
    <div>
      {/* 一覧ページへのリンク */}
      <Link href={FAMILY_QUESTS_URL}>家族クエスト一覧</Link>
      
      {/* 詳細ページへのリンク */}
      <Link href={FAMILY_QUEST_VIEW_URL('quest-123')}>
        クエスト詳細
      </Link>
    </div>
  )
}
```

### API呼び出しでの使用
```typescript
import { FAMILY_QUEST_API_URL, PUBLIC_QUEST_LIKE_API_URL } from '@/(core)/endpoints'

// GET リクエスト
async function getQuest(questId: string) {
  const response = await fetch(FAMILY_QUEST_API_URL(questId))
  return response.json()
}

// POST リクエスト
async function likeQuest(publicQuestId: string) {
  await fetch(PUBLIC_QUEST_LIKE_API_URL(publicQuestId), {
    method: 'POST',
  })
}
```

### ナビゲーションでの使用
```typescript
import { useRouter } from 'next/navigation'
import { FAMILY_QUEST_VIEW_URL } from '@/(core)/endpoints'

export function NavigateToQuest() {
  const router = useRouter()
  
  const handleNavigate = (questId: string) => {
    router.push(FAMILY_QUEST_VIEW_URL(questId))
  }
  
  return <button onClick={() => handleNavigate('quest-123')}>詳細を見る</button>
}
```

## 注意事項

1. **直接文字列でURLを書かない**: すべて`endpoints.ts`から参照
2. **型安全性**: 動的URLは関数のパラメータで型チェック
3. **一貫性**: 同じリソースは同じURL構造を使用
4. **ドキュメント**: 新しいエンドポイント追加時はこのスキルも更新
