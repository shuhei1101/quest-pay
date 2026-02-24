---
name: child-reward-api
description: 子供個別の報酬API操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作、共通化戦略を含む。
---

# 子供個別の報酬API スキル

## 概要

子供個別の報酬APIは、各子供に対して独自の報酬テーブルのCRUD操作を行うAPI群。家族全体の報酬APIと多くのコードを共有しており、効率的な実装を実現している。

## API エンドポイント一覧

### 年齢別報酬テーブル

#### GET: 子供の年齢別報酬テーブル取得
```
GET /api/children/[id]/reward/by-age/table
```

**レスポンス:**
```typescript
{
  ageRewardTable: {
    table: ChildAgeRewardTableSelect  // テーブル情報
    rewards: RewardByAgeSelect[]      // 報酬データ（5歳～22歳）
  }
}
```

#### PUT: 子供の年齢別報酬テーブル更新
```
PUT /api/children/[id]/reward/by-age/table
```

**リクエストボディ:**
```typescript
{
  rewards: Array<{
    age: number     // 年齢（0-100）
    amount: number  // 金額（0以上）
  }>
}
```

### レベル別報酬テーブル

#### GET: 子供のレベル別報酬テーブル取得
```
GET /api/children/[id]/reward/by-level/table
```

**レスポンス:**
```typescript
{
  levelRewardTable: {
    table: ChildLevelRewardTableSelect  // テーブル情報
    rewards: RewardByLevelSelect[]      // 報酬データ（レベル1～12）
  }
}
```

#### PUT: 子供のレベル別報酬テーブル更新
```
PUT /api/children/[id]/reward/by-level/table
```

**リクエストボディ:**
```typescript
{
  rewards: Array<{
    level: number   // レベル（1-12）
    amount: number  // 金額（0以上）
  }>
}
```

## データベーススキーマ

### 子供の報酬テーブルマスタ

#### child_age_reward_tables
```typescript
{
  id: string           // UUID（主キー）
  childId: string      // 子供ID（外部キー → children.id）
  createdAt: Date      // 作成日時
  updatedAt: Date      // 更新日時
}
```

#### child_level_reward_tables
```typescript
{
  id: string           // UUID（主キー）
  childId: string      // 子供ID（外部キー → children.id）
  createdAt: Date      // 作成日時
  updatedAt: Date      // 更新日時
}
```

### 報酬データ（家族と共通テーブル）

#### reward_by_ages
```typescript
{
  id: string                // UUID（主キー）
  type: "child" | "family"  // 報酬テーブルタイプ
  ageRewardTableId: string  // 報酬テーブルID
  age: number               // 年齢
  amount: number            // 金額
}
```

#### reward_by_levels
```typescript
{
  id: string                  // UUID（主キー）
  type: "child" | "family"    // 報酬テーブルタイプ
  levelRewardTableId: string  // 報酬テーブルID
  level: number               // レベル
  amount: number              // 金額
}
```

## ファイル構成

```
/api/children/[id]/reward/
  by-age/
    table/
      route.ts         # 子供の年齢別報酬テーブルAPI
      client.ts        # 子供の年齢別報酬テーブルクライアント
      service.ts       # 子供の年齢別報酬テーブルサービス
      query.ts         # 子供の年齢別報酬テーブルクエリ
      db.ts            # 子供の年齢別報酬テーブルDB操作
  by-level/
    table/
      route.ts         # 子供のレベル別報酬テーブルAPI
      client.ts        # 子供のレベル別報酬テーブルクライアント
      service.ts       # 子供のレベル別報酬テーブルサービス
      query.ts         # 子供のレベル別報酬テーブルクエリ
      db.ts            # 子供のレベル別報酬テーブルDB操作
```

## 共通化戦略

子供個別の報酬APIは、家族全体の報酬APIと多くのコードを共有している。

### 共通化されているファイル（typeパラメータで対応）

以下のファイルは`/api/reward/`配下にあり、`type`パラメータを受け取ることで家族/子供両方に対応：

#### クエリ
- `/api/reward/by-age/query.ts`
  ```typescript
  export const fetchAgeRewards = async ({
    db,
    ageRewardTableId,
    type = "family"  // "family" | "child"
  })
  ```

- `/api/reward/by-level/query.ts`
  ```typescript
  export const fetchLevelRewards = async ({
    db,
    levelRewardTableId,
    type = "family"  // "family" | "child"
  })
  ```

#### DB操作
- `/api/reward/by-age/db.ts`
  ```typescript
  export const insertDefaultAgeRewards = async ({
    db,
    ageRewardTableId,
    type = "family"  // "family" | "child"
  })
  
  export const updateAgeReward = async ({
    db,
    ageRewardTableId,
    age,
    amount,
    type = "family"  // "family" | "child"
  })
  ```

- `/api/reward/by-level/db.ts`
  ```typescript
  export const insertDefaultLevelRewards = async ({
    db,
    levelRewardTableId,
    type = "family"  // "family" | "child"
  })
  
  export const updateLevelReward = async ({
    db,
    levelRewardTableId,
    level,
    amount,
    type = "family"  // "family" | "child"
  })
  ```

#### サービス
- `/api/reward/by-age/service.ts`
  ```typescript
  export const updateFamilyAgeRewards = async ({
    db,
    ageRewardTableId,
    rewards,
    type = "family"  // "family" | "child"
  })
  ```

- `/api/reward/by-level/service.ts`
  ```typescript
  export const updateFamilyLevelRewards = async ({
    db,
    levelRewardTableId,
    rewards,
    type = "family"  // "family" | "child"
  })
  ```

### 子供専用のファイル

以下は子供個別の報酬専用：

#### サービス（共通関数をラップ）
- `/api/children/[id]/reward/by-age/table/service.ts`
  ```typescript
  // 子供の年齢別報酬テーブルを取得または作成する
  export const getOrCreateChildAgeRewardTable = async ({ db, childId })
  
  // 共通関数のエイリアス
  export const updateAgeRewards = updateFamilyAgeRewards
  ```

- `/api/children/[id]/reward/by-level/table/service.ts`
  ```typescript
  // 子供のレベル別報酬テーブルを取得または作成する
  export const getOrCreateChildLevelRewardTable = async ({ db, childId })
  
  // 共通関数のエイリアス
  export const updateLevelRewards = updateFamilyLevelRewards
  ```

#### クエリ
- `/api/children/[id]/reward/by-age/table/query.ts`
  ```typescript
  // 子供の年齢別報酬テーブルを取得する
  export const fetchChildAgeRewardTable = async ({ db, childId })
  ```

- `/api/children/[id]/reward/by-level/table/query.ts`
  ```typescript
  // 子供のレベル別報酬テーブルを取得する
  export const fetchChildLevelRewardTable = async ({ db, childId })
  ```

#### DB操作
- `/api/children/[id]/reward/by-age/table/db.ts`
  ```typescript
  // 子供の年齢別報酬テーブルを作成する
  export const insertChildAgeRewardTable = async ({ db, childId })
  ```

- `/api/children/[id]/reward/by-level/table/db.ts`
  ```typescript
  // 子供のレベル別報酬テーブルを作成する
  export const insertChildLevelRewardTable = async ({ db, childId })
  ```

## API実装パターン

### route.ts（年齢別の例）

```typescript
export async function GET(req: NextRequest, context: Context) {
  return withRouteErrorHandling(async () => {
    const { db, userId } = await getAuthContext()
    const { id: childId } = await context.params
    
    // 親のみアクセス可能チェック
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (userInfo?.profiles?.type !== "parent") {
      throw new ServerError("親のみアクセス可能です。")
    }
    
    // テーブルを取得または作成
    const table = await getOrCreateChildAgeRewardTable({ db, childId })
    
    // 報酬データを取得（type="child"を指定）
    const rewards = await fetchAgeRewards({ 
      db, 
      ageRewardTableId: table.id, 
      type: "child" 
    })
    
    return NextResponse.json({ ageRewardTable: { table, rewards } })
  })
}

export async function PUT(req: NextRequest, context: Context) {
  return withRouteErrorHandling(async () => {
    const { db, userId } = await getAuthContext()
    const { id: childId } = await context.params
    
    // 親のみアクセス可能チェック
    const userInfo = await fetchUserInfoByUserId({ userId, db })
    if (userInfo?.profiles?.type !== "parent") {
      throw new ServerError("親のみ更新可能です。")
    }
    
    // リクエストボディをバリデーション
    const body = await req.json()
    const data = PutChildAgeRewardTableRequestSchema.parse(body)
    
    // テーブルを取得または作成
    const table = await getOrCreateChildAgeRewardTable({ db, childId })
    
    // 報酬を更新（type="child"を指定）
    await updateAgeRewards({
      db,
      ageRewardTableId: table.id,
      rewards: data.rewards,
      type: "child"
    })
    
    return NextResponse.json({})
  })
}
```

### client.ts（年齢別の例）

```typescript
export const getChildAgeRewardTable = async (childId: string) => {
  const url = CHILD_AGE_REWARD_TABLE_API_URL(childId)
  
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
  const data = await res.json()
  
  if (!res.ok) throw AppError.fromResponse(data, res.status)
  
  return data as GetChildAgeRewardTableResponse
}

export const putChildAgeRewardTable = async (
  childId: string, 
  request: PutChildAgeRewardTableRequest
) => {
  const url = CHILD_AGE_REWARD_TABLE_API_URL(childId)
  
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })
  
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
```

## 処理フロー

### 報酬テーブル取得フロー

```
1. クライアント
   ↓ getChildAgeRewardTable(childId)
   
2. API Route (GET)
   ↓ 認証チェック（親のみ）
   
3. getOrCreateChildAgeRewardTable
   ↓ トランザクション開始
   
4. fetchChildAgeRewardTable
   ↓ child_age_reward_tables から取得
   
5. テーブルが存在しない場合
   ↓ insertChildAgeRewardTable
   ↓ insertDefaultAgeRewards (type="child")
   
6. fetchAgeRewards (type="child")
   ↓ reward_by_ages から取得
   
7. レスポンス返却
```

### 報酬テーブル更新フロー

```
1. クライアント
   ↓ putChildAgeRewardTable(childId, data)
   
2. API Route (PUT)
   ↓ 認証チェック（親のみ）
   ↓ バリデーション
   
3. getOrCreateChildAgeRewardTable
   ↓ テーブル取得または作成
   
4. updateAgeRewards (type="child")
   ↓ トランザクション開始
   
5. 各報酬の更新ループ
   ↓ updateAgeReward (type="child")
   
6. reward_by_ages を更新
   
7. レスポンス返却
```

## 注意点

### アクセス制御
- 親ユーザーのみアクセス可能
- 子供・ゲストユーザーは不可

### トランザクション管理
- テーブル作成・報酬更新は必ずトランザクション内で実行
- エラー時は自動ロールバック

### デフォルト値
- 年齢別: 5歳～22歳まで18段階、初期値0円
- レベル別: レベル1～12まで12段階、初期値0円

### typeパラメータ
- 共通関数を呼び出す際は必ず`type: "child"`を指定
- デフォルト値は`"family"`のため、明示的な指定が必要

### バリデーション
- Zodスキーマによる厳密なバリデーション
- 年齢: 0-100
- レベル: 1-12
- 金額: 0以上

## 関連スキル

- `child-reward-structure`: 子供個別の報酬設定画面の構造知識
- `reward-api`: 家族全体の報酬API操作の知識（共通関数の詳細）
- `database-operations`: データベース操作のベストプラクティス
- `child-management-api`: 子供管理API操作の知識
