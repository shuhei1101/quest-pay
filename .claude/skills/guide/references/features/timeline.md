
# タイムライン スキル

## 概要

家族タイムラインと公開タイムラインのアクティビティフィード管理。クエスト完了・報酬獲得・マイルストーン達成などを自動記録する。

## メインソースファイル

### API Routes
- `packages/web/app/api/timeline/family/route.ts`: 家族タイムライン一覧 (GET)
- `packages/web/app/api/timeline/family/[id]/route.ts`: 家族タイムライン詳細 (GET)
- `packages/web/app/api/timeline/public/route.ts`: 公開タイムライン一覧 (GET)

### クライアント側
- `packages/web/app/api/timeline/family/client.ts`: APIクライアント
- `packages/web/app/api/timeline/family/query.ts`: React Queryフック（`useFamilyTimelines`）
- `packages/web/app/api/timeline/public/client.ts`: APIクライアント
- `packages/web/app/api/timeline/public/query.ts`: React Queryフック（`usePublicTimelines`）

### DB操作
- `packages/web/app/api/timeline/db.ts`: `insertFamilyTimeline` / `insertPublicTimeline`

## タイムライン投稿作成（必須パターン）

```typescript
import { insertFamilyTimeline } from "@/app/api/timeline/db"

// クエスト完了時
await insertFamilyTimeline({
  db,
  record: {
    familyId,
    type: "quest_completed",
    profileId: childProfileId,
    message: `${childName}がクエスト「${questName}」を完了しました`,
    url: `/quests/family/${questId}`
  }
})
```

## マイルストーン判定

```typescript
const milestones = [100, 500, 1000, 5000, 10000]
if (milestones.includes(newSavings)) {
  await insertFamilyTimeline({
    db,
    record: {
      familyId,
      type: "savings_milestone_reached",
      profileId: childProfileId,
      message: `${childName}の貯金額が${newSavings}円を突破しました！`,
      url: `/children/${childId}`
    }
  })
}
```

## アクションタイプ一覧

### 家族タイムライン (family_timeline_action_type)
- `quest_created`, `quest_completed`, `quest_cleared`, `quest_level_up`
- `child_joined`, `parent_joined`
- `reward_received`, `savings_updated`, `savings_milestone_reached`, `quest_milestone_reached`
- `comment_posted`, `other`

### 公開タイムライン (public_timeline_action_type)
- `quest_published`, `likes_milestone_reached`, `posts_milestone_reached`, `comments_milestone_reached`
- `comment_posted`, `like_received`, `other`

## 他機能との連携

- **クエスト承認時**: `insertFamilyTimeline` で `quest_completed` 投稿
- **報酬付与時**: `insertFamilyTimeline` で `reward_received` 投稿
- **クエスト公開時**: `insertPublicTimeline` で `quest_published` 投稿

## 実装上の注意点

- 直接 SQL でテーブルに挿入しない → `insertFamilyTimeline` / `insertPublicTimeline` を使う
- family/public のアクションタイプを混在させない
- トランザクション内での呼び出し推奨
- 認証コンテキスト (`getAuthContext()`) 必須
