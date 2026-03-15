(2026年3月15日 14:30記載)

# 報酬API エンドポイント詳細仕様

## 報酬履歴API

### GET /api/children/[id]/reward/histories - 報酬履歴取得

#### リクエスト
- **Method**: GET
- **Path Parameters**:
  - `id` (uuid): 子供ID
- **Query Parameters**:
  - `yearMonth` (string, optional): 絞り込む年月 (例: "2026-03")

#### レスポンス
```typescript
{
  histories: Array<{
    id: string                    // 報酬履歴ID
    childId: string               // 子供ID
    type: RewardType              // 報酬タイプ
    title: string                 // タイトル
    amount: number                // 報酬額
    exp: number                   // 経験値
    rewardedAt: string           // 報酬付与日時
    scheduledPaymentDate?: string // 支払い予定日
    isPaid: boolean              // 支払い済みフラグ
    paidAt?: string              // 支払い日時
    url?: string                 // 関連URL
    createdAt: string
    updatedAt: string
  }>
  monthlyStats: Array<{
    yearMonth: string            // 年月 (YYYY-MM)
    totalAmount: number          // 合計報酬額
    totalExp: number             // 合計経験値
    paidAmount: number          // 支払済報酬額
    unpaidAmount: number        // 未払報酬額
  }>
}
```

#### エラーレスポンス
- 500: 家族IDの取得に失敗、子供情報の取得に失敗
- 500: 同じ家族に所属していないデータにアクセス

#### DB操作
```typescript
// クエリ: fetchRewardHistories
SELECT * FROM reward_histories
WHERE child_id = $childId
  AND (yearMonth IS NULL OR to_char(rewarded_at, 'YYYY-MM') = $yearMonth)
ORDER BY rewarded_at DESC

// クエリ: fetchRewardHistoryMonthlyStats
SELECT 
  to_char(rewarded_at, 'YYYY-MM') as year_month,
  SUM(amount) as total_amount,
  SUM(exp) as total_exp,
  SUM(CASE WHEN is_paid THEN amount ELSE 0 END) as paid_amount,
  SUM(CASE WHEN NOT is_paid THEN amount ELSE 0 END) as unpaid_amount
FROM reward_histories
WHERE child_id = $childId
GROUP BY to_char(rewarded_at, 'YYYY-MM')
ORDER BY year_month DESC
```

---

### POST /api/children/[id]/reward/pay/complete - 報酬支払い完了

#### リクエスト
- **Method**: POST
- **Path Parameters**:
  - `id` (uuid): 子供ID
- **Body**:
```typescript
{
  yearMonth: string  // 支払い完了する年月 (例: "2026-03")
}
```

#### レスポンス
```typescript
{
  success: boolean
}
```

#### エラーレスポンス
- 500: 家族IDの取得に失敗、子供情報の取得に失敗
- 500: 同じ家族に所属していないデータにアクセス
- 500: 子供ユーザのみが支払い完了を実行可能
- 500: 自分自身の報酬のみ受取完了可能

#### 権限チェック
1. ユーザーが子供であること（親は実行不可）
2. 自分自身の報酬であること（他の子供の報酬は実行不可）
3. 同じ家族に所属していること

#### DB操作
```typescript
// 更新: updateRewardHistoriesPaymentStatus
UPDATE reward_histories
SET is_paid = $isPaid,
    paid_at = $paidAt,
    updated_at = NOW()
WHERE child_id = $childId
  AND to_char(rewarded_at, 'YYYY-MM') = $yearMonth
  AND is_paid = false
```

---

### POST /api/children/[id]/reward/pay/start - 報酬支払い開始

#### リクエスト
- **Method**: POST
- **Path Parameters**:
  - `id` (uuid): 子供ID
- **Body**:
```typescript
{
  yearMonth: string  // 支払い開始する年月 (例: "2026-03")
}
```

#### レスポンス
```typescript
{
  success: boolean
}
```

#### 権限チェック
- 子供ユーザのみが実行可能
- 自分自身の報酬のみ対象

#### DB操作
```typescript
// 更新: updateRewardHistoriesPaymentStatus
UPDATE reward_histories
SET is_paid = false,
    paid_at = NULL,
    updated_at = NOW()
WHERE child_id = $childId
  AND to_char(rewarded_at, 'YYYY-MM') = $yearMonth
  AND is_paid = true
```

---

## 報酬テーブル設定API（家族全体）

### GET /api/reward/by-age/table - 家族の年齢別報酬テーブル取得

#### リクエスト
- **Method**: GET

#### レスポンス
```typescript
{
  rewards: Array<{
    id: string
    type: "family"
    ageRewardTableId: string
    age: number              // 年齢 (6-18)
    amount: number           // 報酬額
  }>
}
```

#### DB操作
```typescript
// 1. 家族の年齢別報酬テーブルマスタ取得
SELECT * FROM family_age_reward_tables
WHERE family_id = $familyId

// 2. 報酬データ取得
SELECT * FROM reward_by_ages
WHERE age_reward_table_id = $ageRewardTableId
  AND type = 'family'
ORDER BY age ASC
```

---

### PUT /api/reward/by-age/table - 家族の年齢別報酬テーブル更新

#### リクエスト
- **Method**: PUT
- **Body**:
```typescript
{
  rewards: Array<{
    age: number      // 年齢 (6-18)
    amount: number   // 報酬額
  }>
  updatedAt: string  // 排他制御用
}
```

#### レスポンス
```typescript
{
  success: boolean
}
```

#### DB操作
```typescript
// トランザクション内で実行
BEGIN TRANSACTION

// 1. 各報酬データを更新
UPDATE reward_by_ages
SET amount = $amount,
    updated_at = NOW()
WHERE age_reward_table_id = $ageRewardTableId
  AND age = $age
  AND type = 'family'

COMMIT
```

---

### GET /api/reward/by-level/table - 家族のレベル別報酬テーブル取得

#### リクエスト
- **Method**: GET

#### レスポンス
```typescript
{
  rewards: Array<{
    id: string
    type: "family"
    levelRewardTableId: string
    level: number            // レベル (1-100)
    amount: number           // 報酬額
  }>
}
```

#### DB操作
```typescript
// 1. 家族のレベル別報酬テーブルマスタ取得
SELECT * FROM family_level_reward_tables
WHERE family_id = $familyId

// 2. 報酬データ取得
SELECT * FROM reward_by_levels
WHERE level_reward_table_id = $levelRewardTableId
  AND type = 'family'
ORDER BY level ASC
```

---

### PUT /api/reward/by-level/table - 家族のレベル別報酬テーブル更新

#### リクエスト
- **Method**: PUT
- **Body**:
```typescript
{
  rewards: Array<{
    level: number    // レベル (1-100)
    amount: number   // 報酬額
  }>
  updatedAt: string  // 排他制御用
}
```

#### レスポンス
```typescript
{
  success: boolean
}
```

#### DB操作
```typescript
// トランザクション内で実行
BEGIN TRANSACTION

// 1. 各報酬データを更新
UPDATE reward_by_levels
SET amount = $amount,
    updated_at = NOW()
WHERE level_reward_table_id = $levelRewardTableId
  AND level = $level
  AND type = 'family'

COMMIT
```

---

## 報酬テーブル設定API（子供個別）

### GET /api/children/[id]/reward/by-age/table - 子供の年齢別報酬テーブル取得

#### リクエスト
- **Method**: GET
- **Path Parameters**:
  - `id` (uuid): 子供ID

#### レスポンス
```typescript
{
  rewards: Array<{
    id: string
    type: "child"
    ageRewardTableId: string
    age: number              // 年齢 (6-18)
    amount: number           // 報酬額
  }>
}
```

---

### PUT /api/children/[id]/reward/by-age/table - 子供の年齢別報酬テーブル更新

#### リクエスト
- **Method**: PUT
- **Path Parameters**:
  - `id` (uuid): 子供ID
- **Body**:
```typescript
{
  rewards: Array<{
    age: number      // 年齢 (6-18)
    amount: number   // 報酬額
  }>
  updatedAt: string  // 排他制御用
}
```

---

### GET /api/children/[id]/reward/by-level/table - 子供のレベル別報酬テーブル取得

#### リクエスト
- **Method**: GET
- **Path Parameters**:
  - `id` (uuid): 子供ID

#### レスポンス
```typescript
{
  rewards: Array<{
    id: string
    type: "child"
    levelRewardTableId: string
    level: number            // レベル (1-100)
    amount: number           // 報酬額
  }>
}
```

---

### PUT /api/children/[id]/reward/by-level/table - 子供のレベル別報酬テーブル更新

#### リクエスト
- **Method**: PUT
- **Path Parameters**:
  - `id` (uuid): 子供ID
- **Body**:
```typescript
{
  rewards: Array<{
    level: number    // レベル (1-100)
    amount: number   // 報酬額
  }>
  updatedAt: string  // 排他制御用
}
```

---

## 報酬付与内部ロジック（approveReport）

### クエスト承認時の報酬付与処理

この処理は `PUT /api/quests/family/[id]/child/[childId]/approve` 内で呼ばれる内部関数です。

#### 呼び出し
```typescript
await approveReport({
  db,
  familyQuestId,
  childId,
  responseMessage,
  profileId,
  updatedAt
})
```

#### 処理フロー

1. **クエスト子供情報取得**
   - `quest_children` から現在のレベル、達成回数、クリア回数を取得

2. **子供情報取得**
   - `children` から現在の貯金額、経験値、レベルを取得

3. **現在レベルの詳細取得**
   - `quest_details` から報酬額、経験値、必要達成回数、必要クリア回数を取得

4. **達成判定**
   ```typescript
   nextCompletionCount = currentCompletionCount + 1
   isCompletionAchieved = nextCompletionCount >= requiredCompletionCount
   ```

5. **クリア判定**
   ```typescript
   nextClearCount = currentClearCount + (isCompletionAchieved ? 1 : 0)
   isClearAchieved = requiredClearCount !== null && nextClearCount >= requiredClearCount
   ```

6. **レベルアップ判定**
   ```typescript
   nextLevel = currentLevel + 1
   isLevelUpPossible = nextLevel <= 5
   ```

7. **報酬付与条件分岐**

   **Case 1: 達成回数未到達**
   - 達成回数のみ+1
   - 通知タイプ: `quest_report_approved`

   **Case 2: 達成到達 & クリア未到達**
   - 報酬・経験値付与 (children.current_savings, total_exp更新)
   - 報酬履歴記録 (type: `quest`)
   - クリア回数+1、達成回数リセット
   - 通知タイプ: `quest_cleared`

   **Case 3: 達成到達 & クリア到達 & 最大レベル**
   - 報酬・経験値付与
   - 報酬履歴記録 (type: `quest`)
   - ステータス: `completed`
   - 通知タイプ: `quest_completed`

   **Case 4: 達成到達 & クリア到達 & 次レベルあり**
   - 報酬・経験値付与
   - 報酬履歴記録 (type: `quest_level_up`)
   - レベル+1、達成・クリア回数リセット
   - 通知タイプ: `quest_level_up`

8. **子供レベル計算（TODO実装予定）**
   ```typescript
   // 経験値に基づいて子供レベルを計算
   // 未実装: children.current_level の更新
   ```

#### DB更新

**children テーブル**
```sql
UPDATE children
SET current_savings = current_savings + $reward,
    total_exp = total_exp + $exp,
    -- current_level = $newLevel,  -- TODO実装
    updated_at = NOW()
WHERE id = $childId
```

**reward_histories テーブル**
```sql
INSERT INTO reward_histories (
  child_id,
  type,
  title,
  amount,
  exp,
  url,
  rewarded_at
) VALUES (
  $childId,
  $type,  -- 'quest', 'quest_level_up'
  $title,
  $reward,
  $exp,
  $url,
  NOW()
)
```

**quest_children テーブル**
```sql
-- Case 1: 達成回数のみ更新
UPDATE quest_children
SET current_completion_count = current_completion_count + 1,
    updated_at = NOW()
WHERE family_quest_id = $familyQuestId
  AND child_id = $childId

-- Case 2: クリア回数更新
UPDATE quest_children
SET current_clear_count = current_clear_count + 1,
    current_completion_count = 0,
    updated_at = NOW()
WHERE family_quest_id = $familyQuestId
  AND child_id = $childId

-- Case 3: 完了
UPDATE quest_children
SET status = 'completed',
    updated_at = NOW()
WHERE family_quest_id = $familyQuestId
  AND child_id = $childId

-- Case 4: レベルアップ
UPDATE quest_children
SET level = level + 1,
    current_clear_count = 0,
    current_completion_count = 0,
    updated_at = NOW()
WHERE family_quest_id = $familyQuestId
  AND child_id = $childId
```

---

## 共通化されたDB操作

### 年齢別報酬

**fetchAgeRewards** - 年齢別報酬取得
```typescript
fetchAgeRewards({ db, ageRewardTableId, type })
// type: "family" | "child" | "template"
```

**insertDefaultAgeRewards** - デフォルト年齢別報酬作成
```typescript
insertDefaultAgeRewards({ db, ageRewardTableId, type })
// 年齢6-18で各0円の報酬を作成
```

**updateAgeReward** - 年齢別報酬更新
```typescript
updateAgeReward({ db, ageRewardTableId, age, amount, type })
```

### レベル別報酬

**fetchLevelRewards** - レベル別報酬取得
```typescript
fetchLevelRewards({ db, levelRewardTableId, type })
// type: "family" | "child" | "template"
```

**insertDefaultLevelRewards** - デフォルトレベル別報酬作成
```typescript
insertDefaultLevelRewards({ db, levelRewardTableId, type })
// レベル1-100で各0円の報酬を作成
```

**updateLevelReward** - レベル別報酬更新
```typescript
updateLevelReward({ db, levelRewardTableId, level, amount, type })
```

---

## 報酬タイプ一覧

```typescript
type RewardType = 
  | "quest"                   // クエスト達成（クリア・完了時）
  | "quest_level_up"          // クエストレベルアップ
  | "level_up"                // 子供レベルアップ（TODO実装）
  | "age_monthly"             // 年齢別定期報酬（rewardByAges）
  | "level_monthly"           // レベル別定期報酬（rewardByLevels）
  | "child_day"               // こどもの日
  | "quest_like_milestone"    // お気に入り数突破
  | "child_birthday"          // 子供の誕生日
  | "other"                   // その他
```
