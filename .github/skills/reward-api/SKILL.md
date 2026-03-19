---
name: reward-api
description: 報酬API操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。 Trigger Keywords: 報酬API、報酬設定API、お小遣いAPI、報酬CRUD
---

# 報酬API スキル

## 概要

このスキルは、報酬付与、報酬履歴管理、レベル進行システムを管理するAPI群の知識を提供します。クエスト承認時の報酬計算、履歴記録、ポイント/経験値更新、レベルアップ判定を扱います。

## メインソースファイル

### API Routes

#### 報酬履歴
- `packages/web/app/api/children/[id]/reward/histories/route.ts`: 報酬履歴取得
- `packages/web/app/api/children/[id]/reward/pay/complete/route.ts`: 報酬支払い完了
- `packages/web/app/api/children/[id]/reward/pay/start/route.ts`: 報酬支払い開始

#### 家族全体の報酬テーブル
- `packages/web/app/api/reward/by-age/table/route.ts`: 年齢別報酬テーブル
- `packages/web/app/api/reward/by-level/table/route.ts`: レベル別報酬テーブル

#### 子供個別の報酬テーブル
- `packages/web/app/api/children/[id]/reward/by-age/table/route.ts`: 年齢別報酬テーブル
- `packages/web/app/api/children/[id]/reward/by-level/table/route.ts`: レベル別報酬テーブル

### クライアント側
- `packages/web/app/api/children/[id]/reward/histories/client.ts`: 報酬履歴APIクライアント
- `packages/web/app/api/children/[id]/reward/histories/query.ts`: 報酬履歴React Queryフック

### 内部サービス
- `packages/web/app/api/quests/family/service.ts`: `approveReport()` - クエスト承認時の報酬付与処理

### データベース
- `drizzle/schema.ts`: reward_histories, children, quest_children, quest_details

## 主要機能グループ

### 1. 報酬履歴管理
- 報酬履歴取得（年月フィルター対応）
- 月別統計取得
- 支払い状態管理（開始/完了）

### 2. 報酬テーブル設定
- 家族全体の年齢別/レベル別報酬テーブルCRUD
- 子供個別の年齢別/レベル別報酬テーブルCRUD
- typeパラメータ（"family" / "child"）による共通化

### 3. 報酬付与システム（内部処理）
- クエスト承認時の報酬計算
- 達成回数 → クリア回数 → レベルアップ判定
- 報酬履歴記録、ポイント/経験値加算
- 通知送信（quest_cleared, quest_level_up, quest_completed）

### 4. レベル進行システム
- クエストレベル（1-5）の進行管理
- 子供レベルの経験値蓄積（TODO: レベルアップ計算実装予定）

## Reference Files Usage

### データベース構造を把握する場合
報酬履歴、子供、クエスト関連テーブルのER図と主要リレーションを確認：
```
references/er_diagram.md
```

### 報酬付与フローを理解する場合
報酬計算 → 履歴記録 → ポイント/経験値更新 → レベルアップ判定フローを確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各エンドポイントの処理シーケンス、報酬付与のトランザクション処理を確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、エラーコード、レベルアップロジックを確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`で報酬付与フロー確認
2. **データ構造の理解**: `references/er_diagram.md`でテーブル関係確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理フロー確認

## API エンドポイント一覧

### 報酬履歴
- `GET /api/children/[id]/reward/histories`: 報酬履歴取得（年月フィルター対応）
- `POST /api/children/[id]/reward/pay/complete`: 報酬支払い完了
- `POST /api/children/[id]/reward/pay/start`: 報酬支払い開始

### 家族全体の報酬テーブル

#### 年齢別報酬テーブル
- `GET /api/reward/by-age/table`: 家族の年齢別報酬テーブル取得
- `PUT /api/reward/by-age/table`: 家族の年齢別報酬テーブル更新

#### レベル別報酬テーブル
- `GET /api/reward/by-level/table`: 家族のレベル別報酬テーブル取得
- `PUT /api/reward/by-level/table`: 家族のレベル別報酬テーブル更新

### 子供個別の報酬テーブル

#### 年齢別報酬テーブル
- `GET /api/children/[id]/reward/by-age/table`: 子供の年齢別報酬テーブル取得
- `PUT /api/children/[id]/reward/by-age/table`: 子供の年齢別報酬テーブル更新

#### レベル別報酬テーブル
- `GET /api/children/[id]/reward/by-level/table`: 子供のレベル別報酬テーブル取得
- `PUT /api/children/[id]/reward/by-level/table`: 子供のレベル別報酬テーブル更新

## データベース操作

### テーブル構成

#### 報酬履歴
- `reward_histories`: 報酬履歴記録（子供ごと）
  - type: "quest", "quest_level_up", "level_up", "age_monthly", "level_monthly", etc.
  - amount: 報酬額, exp: 経験値
  - is_paid, paid_at: 支払い状態管理

#### 子供テーブル
- `children`: 子供情報（貯金額、経験値、レベル）
  - current_savings: 現在の貯金額（報酬付与時に加算）
  - total_exp: 総獲得経験値（報酬付与時に加算）
  - current_level: 現在のレベル（TODO: 経験値に基づき計算）

#### クエスト子供テーブル
- `quest_children`: クエスト進行状態
  - level: クエストの現在レベル（1-5）
  - current_completion_count: 現在の達成回数
  - current_clear_count: 現在のクリア回数

#### クエスト詳細テーブル
- `quest_details`: レベルごとの報酬設定
  - reward: 報酬額（承認時に付与）
  - child_exp: 獲得経験値（承認時に付与）
  - required_completion_count: 必要達成回数
  - required_clear_count: 次レベルに必要なクリア回数（nullの場合は最大レベル）

#### 報酬テーブル（共通）
- `reward_by_ages`: 年齢別報酬データ（typeカラムで家族/子供を区別）
- `reward_by_levels`: レベル別報酬データ（typeカラムで家族/子供を区別）

#### 報酬テーブルマスタ
- `family_age_reward_tables`: 家族の年齢別報酬テーブル
- `family_level_reward_tables`: 家族のレベル別報酬テーブル
- `child_age_reward_tables`: 子供の年齢別報酬テーブル
- `child_level_reward_tables`: 子供のレベル別報酬テーブル

### 共通化されたサービス・クエリ

以下の関数はtypeパラメータを受け取り、家族/子供両方で共通利用されます：

#### 報酬履歴クエリ（`/api/children/[id]/reward/histories/query.ts`）
- `fetchRewardHistories({ db, childId, yearMonth })`: 報酬履歴取得
- `fetchRewardHistoryMonthlyStats({ db, childId })`: 月別統計取得

#### 報酬履歴DB操作（`/api/children/[id]/reward/histories/db.ts`）
- `insertRewardHistory({ db, record })`: 報酬履歴記録
- `updateRewardHistoriesPaymentStatus({ db, childId, yearMonth, isPaid, paidAt })`: 支払い状態更新

#### 年齢別報酬クエリ（`/api/reward/by-age/query.ts`）
- `fetchAgeRewards({ db, ageRewardTableId, type })`: 年齢別報酬データ取得

#### 年齢別報酬DB操作（`/api/reward/by-age/db.ts`）
- `insertDefaultAgeRewards({ db, ageRewardTableId, type })`: デフォルト年齢別報酬作成
- `updateAgeReward({ db, ageRewardTableId, age, amount, type })`: 年齢別報酬更新

#### 年齢別報酬サービス（`/api/reward/by-age/service.ts`）
- `updateFamilyAgeRewards({ db, ageRewardTableId, rewards, type })`: 年齢別報酬一括更新

#### レベル別報酬クエリ（`/api/reward/by-level/query.ts`）
- `fetchLevelRewards({ db, levelRewardTableId, type })`: レベル別報酬データ取得

#### レベル別報酬DB操作（`/api/reward/by-level/db.ts`）
- `insertDefaultLevelRewards({ db, levelRewardTableId, type })`: デフォルトレベル別報酬作成
- `updateLevelReward({ db, levelRewardTableId, level, amount, type })`: レベル別報酬更新

#### レベル別報酬サービス（`/api/reward/by-level/service.ts`）
- `updateFamilyLevelRewards({ db, levelRewardTableId, rewards, type })`: レベル別報酬一括更新

### 操作原則
- Drizzle低レベルクエリを使用
- 排他制御が必要な場合は`db_helper.ts`を使用
- typeパラメータのデフォルト値は`"family"`
- 報酬付与はトランザクション内で実行（children, reward_histories, quest_children同時更新）

## 実装上の注意点

### 必須パターン

#### トランザクション管理
報酬付与時は必ずトランザクション内で以下を同時実行：
```typescript
await db.transaction(async (tx) => {
  // 1. 子供の貯金額・経験値更新
  await updateChild({ db: tx, id, record: { 
    currentSavings: current + reward, 
    totalExp: total + exp 
  }})
  
  // 2. 報酬履歴記録
  await insertRewardHistory({ db: tx, record: {
    childId, type, title, amount, exp, url
  }})
  
  // 3. クエスト状態更新（該当する場合）
  await updateQuestChild({ db: tx, familyQuestId, childId, record: { ... }})
})
```

#### レベルアップ判定ロジック
```typescript
// 達成回数判定
const nextCompletionCount = currentCompletionCount + 1
const isCompletionAchieved = nextCompletionCount >= requiredCompletionCount

// クリア回数判定
const nextClearCount = currentClearCount + (isCompletionAchieved ? 1 : 0)
const isClearAchieved = requiredClearCount !== null && nextClearCount >= requiredClearCount

// レベルアップ判定
const nextLevel = currentLevel + 1
const isLevelUpPossible = nextLevel <= 5
```

#### 通知タイプの使い分け
- `quest_report_approved`: 達成回数未到達（報酬なし）
- `quest_cleared`: クリア到達（報酬あり、レベルアップなし）
- `quest_level_up`: レベルアップ（報酬あり、次レベルへ）
- `quest_completed`: 完全クリア（報酬あり、最大レベル到達）

### API実装規約

#### client.ts と route.ts のセット
- 各エンドポイントには必ず client.ts と route.ts が必要
- client.ts からのみ API を呼び出す（直接 fetch は禁止）

#### React Query の使用
- フック経由で client.ts を呼び出す
- `useQuery` （GET） または `useMutation` （POST/PUT/DELETE）を使用

#### 権限チェック
報酬支払い完了APIの例：
```typescript
// 1. 子供ユーザのみ実行可能
if (userInfo.profiles.type === 'parent') {
  throw new ServerError("子供ユーザのみが支払い完了を実行できます。")
}

// 2. 自分自身の報酬のみ対象
if (child.profiles?.id !== userInfo.profiles.id) {
  throw new ServerError("自分自身の報酬のみ受取完了できます。")
}
```

### 共通化戦略

#### typeパラメータの使用
年齢別・レベル別報酬の家族/子供設定を共通化：
```typescript
// 家族設定
fetchAgeRewards({ db, ageRewardTableId, type: "family" })

// 子供個別設定
fetchAgeRewards({ db, ageRewardTableId, type: "child" })

// テンプレート設定（将来実装）
fetchLevelRewards({ db, levelRewardTableId, type: "template" })
```

### TODO実装予定

#### 子供レベル計算
現在、`children.total_exp` は加算されるが、`children.current_level` の更新は未実装：
```typescript
// TODO: 経験値テーブルに基づいてレベルを計算
// const newLevel = calculateChildLevel(child.totalExp)
// if (newLevel > child.currentLevel) {
//   await updateChild({ db: tx, id, record: { currentLevel: newLevel }})
//   await insertRewardHistory({ db: tx, record: { type: "level_up", ... }})
// }
```

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## ファイル構成

### 報酬履歴API
```
/api/children/[id]/reward/
  histories/
    route.ts           # 報酬履歴取得API
    client.ts          # 報酬履歴クライアント
    query.ts           # 報酬履歴React Queryフック
    db.ts              # 報酬履歴DB操作
  pay/
    complete/
      route.ts         # 報酬支払い完了API
    start/
      route.ts         # 報酬支払い開始API
```

### 家族の報酬テーブルAPI
```
/api/reward/
  by-age/
    db.ts              # 年齢別報酬DB操作（共通化、typeパラメータ対応）
    query.ts           # 年齢別報酬クエリ（共通化、typeパラメータ対応）
    service.ts         # 年齢別報酬サービス（共通化、typeパラメータ対応）
    table/
      route.ts         # 家族の年齢別報酬テーブルAPI
      client.ts        # 家族の年齢別報酬テーブルクライアント
      service.ts       # 家族の年齢別報酬テーブルサービス
      query.ts         # 家族の年齢別報酬テーブルクエリ
      db.ts            # 家族の年齢別報酬テーブルDB操作
  by-level/
    db.ts              # レベル別報酬DB操作（共通化、typeパラメータ対応）
    query.ts           # レベル別報酬クエリ（共通化、typeパラメータ対応）
    service.ts         # レベル別報酬サービス（共通化、typeパラメータ対応）
    table/
      route.ts         # 家族のレベル別報酬テーブルAPI
      client.ts        # 家族のレベル別報酬テーブルクライアント
      service.ts       # 家族のレベル別報酬テーブルサービス
      query.ts         # 家族のレベル別報酬テーブルクエリ
      db.ts            # 家族のレベル別報酬テーブルDB操作
```

### 子供の報酬テーブルAPI
```
/api/children/[id]/reward/
  by-age/
    table/
      route.ts         # 子供の年齢別報酬テーブルAPI
      client.ts        # 子供の年齢別報酬テーブルクライアント
      service.ts       # 子供の年齢別報酬テーブルサービス（共通関数を利用）
      query.ts         # 子供の年齢別報酬テーブルクエリ
      db.ts            # 子供の年齢別報酬テーブルDB操作
  by-level/
    table/
      route.ts         # 子供のレベル別報酬テーブルAPI
      client.ts        # 子供のレベル別報酬テーブルクライアント
      service.ts       # 子供のレベル別報酬テーブルサービス（共通関数を利用）
      query.ts         # 子供のレベル別報酬テーブルクエリ
      db.ts            # 子供のレベル別報酬テーブルDB操作
```

### 内部サービス
```
/api/quests/family/
  service.ts           # approveReport() - クエスト承認時の報酬付与処理
```
Files not intended to be loaded into context, but rather used within the output Claude produces.

**Examples from other skills:**
- Brand styling: PowerPoint template files (.pptx), logo files
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
