---
name: reward-api
description: 報酬API操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。
---

# 報酬API スキル

## 概要

報酬APIは、家族全体または子供個別の報酬テーブルのCRUD操作を行うAPI群。

## API エンドポイント一覧

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

#### クエリ（`/api/reward/by-age/query.ts`, `/api/reward/by-level/query.ts`）
- `fetchAgeRewards({ db, ageRewardTableId, type })`: 年齢別報酬データ取得
- `fetchLevelRewards({ db, levelRewardTableId, type })`: レベル別報酬データ取得

#### DB操作（`/api/reward/by-age/db.ts`, `/api/reward/by-level/db.ts`）
- `insertDefaultAgeRewards({ db, ageRewardTableId, type })`: デフォルト年齢別報酬作成
- `updateAgeReward({ db, ageRewardTableId, age, amount, type })`: 年齢別報酬更新
- `insertDefaultLevelRewards({ db, levelRewardTableId, type })`: デフォルトレベル別報酬作成
- `updateLevelReward({ db, levelRewardTableId, level, amount, type })`: レベル別報酬更新

#### サービス（`/api/reward/by-age/service.ts`, `/api/reward/by-level/service.ts`）
- `updateFamilyAgeRewards({ db, ageRewardTableId, rewards, type })`: 年齢別報酬一括更新
- `updateFamilyLevelRewards({ db, levelRewardTableId, rewards, type })`: レベル別報酬一括更新

### 操作原則
- Drizzle低レベルクエリを使用
- 排他制御が必要な場合は`db_helper.ts`を使用
- typeパラメータのデフォルト値は`"family"`

## ファイル構成

### 家族の報酬API
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

### 子供の報酬API
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

## 注意点

- client.ts と route.ts のセットが必須
- フック経由でclient.tsを呼び出す
- `useQuery` または `useMutation` を使用
- 子供個別のAPIは家族のAPIと共通のサービス・クエリ・DB操作を利用
- typeパラメータで家族（"family"）と子供（"child"）を区別
Files not intended to be loaded into context, but rather used within the output Claude produces.

**Examples from other skills:**
- Brand styling: PowerPoint template files (.pptx), logo files
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
