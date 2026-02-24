---
name: child-reward-structure
description: 子供個別の報酬設定画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。
---

# 子供個別の報酬設定画面 スキル

## 概要

子供個別の報酬設定画面は、各子供に対して独自の年齢別・レベル別報酬テーブルを設定する画面。家族全体の報酬設定とは独立して管理され、子供ごとにカスタマイズされた報酬体系を構築できる。

## 画面のアクセスパス

- 編集画面: `/children/[id]/reward`
- 閲覧画面: `/children/[id]/reward/view`

## ファイル構成

### メインファイル

#### ページコンポーネント
- `app/(app)/children/[id]/reward/page.tsx`: 子供の報酬設定ページ（編集）
- `app/(app)/children/[id]/reward/view/page.tsx`: 子供の報酬設定ページ（閲覧）

#### メインコンポーネント
- `app/(app)/children/[id]/reward/_components/ChildRewardEdit.tsx`: 子供の報酬編集画面
- `app/(app)/children/[id]/reward/_components/ChildRewardView.tsx`: 子供の報酬閲覧画面

### フック

- `app/(app)/children/[id]/reward/_hooks/useChildReward.ts`: 子供の報酬データ取得フック
- `app/(app)/children/[id]/reward/by-age/_hooks/useChildAgeRewardForm.ts`: 子供の年齢別報酬フォーム
- `app/(app)/children/[id]/reward/by-level/_hooks/useChildLevelRewardForm.ts`: 子供のレベル別報酬フォーム

### 共通コンポーネント（家族の報酬設定と共有）

以下のコンポーネントは`app/(app)/reward/`配下にあり、家族全体と子供個別の両方で利用される：

#### レイアウトコンポーネント
- `app/(app)/reward/by-age/_components/AgeRewardEditLayout.tsx`: 年齢別報酬編集レイアウト
- `app/(app)/reward/by-age/view/AgeRewardViewLayout.tsx`: 年齢別報酬閲覧レイアウト
- `app/(app)/reward/by-level/_components/LevelRewardEditLayout.tsx`: レベル別報酬編集レイアウト
- `app/(app)/reward/by-level/view/LevelRewardViewLayout.tsx`: レベル別報酬閲覧レイアウト
- `app/(app)/reward/_components/RewardViewLayout.tsx`: 報酬閲覧レイアウト（全体）

#### フォーム定義
- `app/(app)/reward/by-age/form.ts`: 年齢別報酬フォームスキーマ
- `app/(app)/reward/by-level/form.ts`: レベル別報酬フォームスキーマ

## 主要コンポーネント

### ChildRewardEdit

**責務:** 子供個別の報酬テーブルの表示と設定管理

**主要機能:**
- 子供専用の年齢別報酬テーブル表示・編集
- 子供専用のレベル別報酬設定・編集
- タブ切り替え（お小遣い/ランク報酬）
- 保存・リセット機能

**Props:**
```typescript
type Props = {
  childId: string  // 対象の子供ID
}
```

**処理フロー:**
1. `childId`を受け取る
2. `useChildAgeRewardForm(childId)`と`useChildLevelRewardForm(childId)`でフォーム初期化
3. タブ切り替えで年齢別/レベル別を表示
4. 共通レイアウトコンポーネント（`AgeRewardEditLayout`, `LevelRewardEditLayout`）を使用
5. 保存時は`putChildAgeRewardTable`または`putChildLevelRewardTable`を呼び出し

### ChildRewardView

**責務:** 子供個別の報酬テーブルの閲覧表示

**主要機能:**
- 子供専用の年齢別報酬テーブル閲覧
- 子供専用のレベル別報酬閲覧
- タブ切り替え（お小遣い/ランク報酬）

**Props:**
```typescript
type Props = {
  childId: string  // 対象の子供ID
}
```

**処理フロー:**
1. `childId`を受け取る
2. `useChildAgeRewardTable(childId)`と`useChildLevelRewardTable(childId)`でデータ取得
3. 共通レイアウトコンポーネント（`RewardViewLayout`）を使用して表示

## フック詳細

### useChildReward.ts

子供の報酬データ取得フック。

**エクスポート:**
```typescript
// 子供個別の年齢別報酬テーブルを取得する
export const useChildAgeRewardTable = (childId: string)

// 子供個別のレベル別報酬テーブルを取得する
export const useChildLevelRewardTable = (childId: string)
```

### useChildAgeRewardForm.ts

子供の年齢別報酬フォーム管理フック。

**使用方法:**
```typescript
const ageForm = useChildAgeRewardForm(childId)

// フォームの値
ageForm.watch()

// フォーム送信
ageForm.handleSubmit((data) => {
  // 保存処理
})

// リセット
ageForm.setForm(ageForm.fetchedAgeReward)

// 変更チェック
ageForm.isValueChanged
```

### useChildLevelRewardForm.ts

子供のレベル別報酬フォーム管理フック。

**使用方法:**
```typescript
const levelForm = useChildLevelRewardForm(childId)

// フォームの値
levelForm.watch()

// フォーム送信
levelForm.handleSubmit((data) => {
  // 保存処理
})

// リセット
levelForm.setForm(levelForm.fetchedLevelReward)

// 変更チェック
levelForm.isValueChanged
```

## データフロー

```
1. ページコンポーネント (page.tsx)
   ↓ childIdをパラメータから取得
   
2. メインコンポーネント (ChildRewardEdit/ChildRewardView)
   ↓ childIdをPropsとして受け取る
   
3. フック (useChildAgeRewardForm/useChildLevelRewardForm)
   ↓ childIdを使ってAPI呼び出し
   
4. API Client (client.ts)
   ↓ エンドポイント: /api/children/[id]/reward/by-age/table
   
5. API Route (route.ts)
   ↓ DB操作
   
6. データベース (child_age_reward_tables/child_level_reward_tables)
```

## 家族の報酬設定との違い

### 共通点
- レイアウトコンポーネントを共有
- フォームスキーマを共有
- 年齢別・レベル別の報酬テーブル構造が同じ

### 相違点
- **データの独立性**: 家族全体の設定と子供個別の設定は完全に独立
- **API エンドポイント**: `/api/reward/...` vs `/api/children/[id]/reward/...`
- **DBテーブル**: `family_*_reward_tables` vs `child_*_reward_tables`
- **フック**: 子供IDをパラメータとして受け取る

## 注意点

- 親ユーザーのみアクセス可能（`authGuard({ childNG: true, guestNG: true })`）
- 子供IDは必須パラメータ
- 家族全体の報酬設定とは独立して管理される
- 報酬テーブルが存在しない場合は自動的に作成される（デフォルト値0円）
- 年齢別報酬: 5歳～22歳（18段階）
- レベル別報酬: レベル1～12（12段階）

## 使用例

### 編集画面へのナビゲーション

```typescript
import { CHILD_REWARD_URL } from "@/app/(core)/endpoints"

// 子供ID = "child-123" の報酬設定画面へ
router.push(CHILD_REWARD_URL("child-123"))
```

### 閲覧画面へのナビゲーション

```typescript
import { CHILD_REWARD_VIEW_URL } from "@/app/(core)/endpoints"

// 子供ID = "child-123" の報酬閲覧画面へ
router.push(CHILD_REWARD_VIEW_URL("child-123"))
```

## 関連スキル

- `child-reward-api`: 子供個別の報酬API操作の知識
- `reward-structure`: 家族全体の報酬設定画面の構造知識
- `reward-api`: 家族全体の報酬API操作の知識
- `child-management-edit`: 子供編集画面の構造知識
