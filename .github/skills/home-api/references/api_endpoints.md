(2026年3月記載)

# ホームダッシュボードAPI エンドポイント仕様

## 概要

ホームダッシュボードAPIは、親と子供それぞれに最適化されたダッシュボードデータを提供します。ユーザーロールに応じて異なるデータセットを返します。

## エンドポイント一覧

### GET /api/home/dashboard

ユーザーのロール（親/子供）に応じたダッシュボードデータを取得。

#### リクエスト

**Headers:**
```
Authorization: Bearer <token>
Cookie: session=<session_id>
```

**Query Parameters:**
なし（認証情報から自動判定）

#### レスポンス（親ユーザー）

**Status Code:** 200 OK

**Response Body:**
```typescript
{
  role: "parent"
  stats: {
    children_count: number           // 子供の総数
    active_quests_count: number      // 進行中クエスト数
    pending_review_count: number     // 完了待ちクエスト数
    unread_notifications_count: number  // 未読通知数
  }
  children: Array<{
    id: string
    display_name: string
    total_earned: number             // 累計獲得報酬
    total_savings: number            // 現在の貯金
    level: number                    // レベル
    exp: number                      // 経験値
    active_quests_count: number      // 子供ごとの進行中クエスト数
  }>
  recent_quests: Array<{
    id: string
    child_id: string
    child_name: string
    quest_id: string
    quest_title: string
    quest_icon_id: number
    quest_icon_color: string
    level: number
    reward: number
    status: "not_started" | "in_progress" | "pending_review" | "completed"
    updated_at: string               // ISO 8601
  }>
  notifications: Array<{
    id: string
    type: string
    title: string
    message: string
    is_read: boolean
    created_at: string               // ISO 8601
    metadata?: Record<string, any>
  }>
  timeline: Array<{
    id: string
    child_id: string
    child_name: string
    quest_id: string | null
    quest_title: string | null
    post_type: "quest_completed" | "level_up" | "achievement"
    content: string
    created_at: string               // ISO 8601
    metadata?: Record<string, any>
  }>
}
```

#### レスポンス（子供ユーザー）

**Status Code:** 200 OK

**Response Body:**
```typescript
{
  role: "child"
  stats: {
    total_earned: number             // 累計獲得報酬
    total_savings: number            // 現在の貯金
    level: number                    // レベル
    exp: number                      // 経験値
    next_level_exp: number           // 次のレベルまでの必要経験値
    active_quests_count: number      // 進行中クエスト数
    pending_review_count: number     // 完了待ちクエスト数
    completed_quests_count: number   // 完了済みクエスト総数
  }
  active_quests: Array<{
    id: string
    quest_id: string
    quest_title: string
    quest_description: string
    quest_icon_id: number
    quest_icon_color: string
    level: number
    reward: number
    status: "not_started" | "in_progress"
    started_at: string | null        // ISO 8601
    updated_at: string               // ISO 8601
  }>
  pending_quests: Array<{
    id: string
    quest_id: string
    quest_title: string
    level: number
    reward: number
    status: "pending_review"
    reported_at: string              // ISO 8601
  }>
  notifications: Array<{
    id: string
    type: string
    title: string
    message: string
    is_read: boolean
    created_at: string               // ISO 8601
    metadata?: Record<string, any>
  }>
}
```

#### エラーレスポンス

**401 Unauthorized**
```typescript
{
  error: "UNAUTHORIZED"
  message: "認証が必要です"
}
```

**500 Internal Server Error**
```typescript
{
  error: "DATABASE_ERROR" | "DATA_INCONSISTENCY"
  message: string
}
```

**504 Gateway Timeout**
```typescript
{
  error: "QUERY_TIMEOUT"
  message: "データ取得がタイムアウトしました"
}
```

---

## データ集約ロジック

### 親ダッシュボード

**データソース:**
1. **families**: 家族情報
2. **children**: 子供一覧
3. **child_quests**: クエスト進捗
4. **family_quests**: クエスト詳細
5. **notifications**: 通知
6. **timeline_posts**: タイムライン

**集約クエリ:**
```sql
-- 統計情報
SELECT 
  COUNT(DISTINCT c.id) as children_count,
  COUNT(CASE WHEN cq.status = 'in_progress' THEN 1 END) as active_quests_count,
  COUNT(CASE WHEN cq.status = 'pending_review' THEN 1 END) as pending_review_count,
  COUNT(CASE WHEN n.is_read = false THEN 1 END) as unread_notifications_count
FROM children c
LEFT JOIN child_quests cq ON c.id = cq.child_id
LEFT JOIN notifications n ON n.family_id = c.family_id AND n.is_read = false
WHERE c.family_id = :familyId;

-- 最近のクエスト
SELECT 
  cq.id,
  cq.child_id,
  c.display_name as child_name,
  fq.id as quest_id,
  fq.title as quest_title,
  fq.icon_id as quest_icon_id,
  fq.icon_color as quest_icon_color,
  fqd.level,
  fqd.reward,
  cq.status,
  cq.updated_at
FROM child_quests cq
JOIN children c ON cq.child_id = c.id
JOIN family_quests fq ON cq.family_quest_id = fq.id
JOIN family_quest_details fqd ON cq.family_quest_detail_id = fqd.id
WHERE c.family_id = :familyId
ORDER BY cq.updated_at DESC
LIMIT 5;

-- 通知
SELECT * FROM notifications
WHERE family_id = :familyId
ORDER BY is_read ASC, created_at DESC
LIMIT 10;

-- タイムライン
SELECT 
  tp.*,
  c.display_name as child_name,
  fq.title as quest_title
FROM timeline_posts tp
JOIN children c ON tp.child_id = c.id
LEFT JOIN family_quests fq ON tp.quest_id = fq.id
WHERE tp.family_id = :familyId
ORDER BY tp.created_at DESC
LIMIT 10;
```

### 子供ダッシュボード

**データソース:**
1. **children**: 子供情報
2. **child_quests**: 自分のクエスト
3. **family_quests**: クエスト詳細
4. **family_quest_details**: レベル詳細
5. **notifications**: 自分宛て通知

**集約クエリ:**
```sql
-- 統計情報
SELECT 
  c.total_earned,
  c.total_savings,
  c.level,
  c.exp,
  (SELECT exp_required FROM level_definitions WHERE level = c.level + 1) as next_level_exp,
  COUNT(CASE WHEN cq.status = 'in_progress' THEN 1 END) as active_quests_count,
  COUNT(CASE WHEN cq.status = 'pending_review' THEN 1 END) as pending_review_count,
  COUNT(CASE WHEN cq.status = 'completed' THEN 1 END) as completed_quests_count
FROM children c
LEFT JOIN child_quests cq ON c.id = cq.child_id
WHERE c.id = :childId
GROUP BY c.id;

-- 進行中クエスト
SELECT 
  cq.id,
  cq.quest_id,
  fq.title as quest_title,
  fq.description as quest_description,
  fq.icon_id as quest_icon_id,
  fq.icon_color as quest_icon_color,
  fqd.level,
  fqd.reward,
  cq.status,
  cq.started_at,
  cq.updated_at
FROM child_quests cq
JOIN family_quests fq ON cq.family_quest_id = fq.id
JOIN family_quest_details fqd ON cq.family_quest_detail_id = fqd.id
WHERE cq.child_id = :childId
  AND cq.status IN ('not_started', 'in_progress')
ORDER BY cq.updated_at DESC
LIMIT 5;

-- 完了待ちクエスト
SELECT 
  cq.id,
  cq.quest_id,
  fq.title as quest_title,
  fqd.level,
  fqd.reward,
  cq.status,
  cq.reported_at
FROM child_quests cq
JOIN family_quests fq ON cq.family_quest_id = fq.id
JOIN family_quest_details fqd ON cq.family_quest_detail_id = fqd.id
WHERE cq.child_id = :childId
  AND cq.status = 'pending_review'
ORDER BY cq.reported_at DESC;

-- 通知
SELECT * FROM notifications
WHERE recipient_id = :childId
ORDER BY is_read ASC, created_at DESC
LIMIT 10;
```

---

## パフォーマンス考慮事項

### インデックス推奨
```sql
CREATE INDEX idx_child_quests_child_status ON child_quests(child_id, status, updated_at);
CREATE INDEX idx_notifications_family_unread ON notifications(family_id, is_read, created_at);
CREATE INDEX idx_timeline_posts_family ON timeline_posts(family_id, created_at);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read, created_at);
```

### キャッシュ戦略
- **TTL**: 5分間
- **キャッシュキー**: `dashboard:family:{familyId}` または `dashboard:child:{childId}`
- **無効化トリガー**:
  - クエストステータス変更
  - 報酬付与
  - 通知作成
  - タイムライン投稿

### レート制限
- **制限**: 10 requests/minute per user
- **バースト**: 20 requests/minute
- **ヘッダー**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

---

## セキュリティ

### 認証
- すべてのエンドポイントで `authGuard()` 必須
- Supabase Session による認証

### 認可
- **親**: 自分の家族のデータのみアクセス可能
- **子供**: 自分のデータのみアクセス可能
- 家族IDは認証情報から自動取得（クエリパラメータで指定不可）

### データ保護
- 個人情報（名前、報酬額）は家族内に閉じる
- 他家族のデータは一切返さない
- SQLインジェクション対策：パラメータバインディング必須
