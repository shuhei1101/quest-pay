---
name: child-reward-structure
description: 子供個別の報酬設定画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。
---

# 子供個別の報酬設定画面 スキル

## 概要

このスキルは、子供ごとにカスタマイズされた年齢別・レベル別報酬テーブルを設定する画面の知識を提供します。タブ切り替え、React Hook Form、共通レイアウトコンポーネントの再利用を含みます。

## メインソースファイル

### ページコンポーネント
- `packages/web/app/(app)/children/[id]/reward/page.tsx`: 子供の報酬設定ページ（編集）
- `packages/web/app/(app)/children/[id]/reward/view/page.tsx`: 子供の報酬設定ページ（閲覧）

### メインコンポーネント
- `packages/web/app/(app)/children/[id]/reward/_components/ChildRewardEdit.tsx`: 報酬編集画面
- `packages/web/app/(app)/children/[id]/reward/_components/ChildRewardView.tsx`: 報酬閲覧画面

### フォーム管理
- `packages/web/app/(app)/reward/by-age/form.ts`: 年齢別報酬Zodスキーマ（共通）
- `packages/web/app/(app)/reward/by-level/form.ts`: レベル別報酬Zodスキーマ（共通）
- `packages/web/app/(app)/children/[id]/reward/by-age/_hooks/useChildAgeRewardForm.ts`: 年齢別報酬フォームフック
- `packages/web/app/(app)/children/[id]/reward/by-level/_hooks/useChildLevelRewardForm.ts`: レベル別報酬フォームフック

### 共通レイアウトコンポーネント
- `packages/web/app/(app)/reward/by-age/_components/AgeRewardEditLayout.tsx`: 年齢別報酬編集レイアウト
- `packages/web/app/(app)/reward/by-level/_components/LevelRewardEditLayout.tsx`: レベル別報酬編集レイアウト

### API
- `packages/web/app/api/children/[id]/reward/by-age/table/client.ts`: 年齢別報酬APIクライアント
- `packages/web/app/api/children/[id]/reward/by-level/table/client.ts`: レベル別報酬APIクライアント

## 主要機能グループ

### 1. タブ切り替え
- お小遣いタブ（年齢別報酬）
- ランク報酬タブ（レベル別報酬）
- ScrollableTabs によるタブUI

### 2. フォーム管理
- 各タブで独立したフォーム状態
- React Query によるデータ取得
- JSON.stringify による深い比較で変更検知

### 3. 更新処理
- React Query Mutation による更新
- 成功時: キャッシュ無効化 → 閲覧画面へ遷移
- 失敗時: トースト通知

### 4. FABアクション
- 保存: 現在のタブのフォーム送信
- 破棄: 取得時の値にリセット
- 閲覧: 閲覧画面へ遷移

## Reference Files Usage

### コンポーネント構造を把握する場合
画面階層、タブ構成、FABアクションを確認：
```
references/component_structure.md
```

### フォーム管理を理解する場合
複数フォームの管理、Mutation、キャッシュ無効化を確認：
```
references/form_management.md
```

### 画面フローを把握する場合
初期化 → タブ切り替え → 編集 → 保存/破棄の流れを確認：
```
references/flow_diagram.md
```

### バリデーションルールを確認する場合
配列要素のスキーマ、範囲検証、エラー表示パターンを確認：
```
references/validation_rules.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でタブ切り替えと保存フロー確認
2. **コンポーネント構造の理解**: `references/component_structure.md`でタブ構成確認
3. **実装時**: `references/form_management.md`で複数フォーム管理詳細確認
4. **バリデーション実装時**: `references/validation_rules.md`で配列検証ルール確認

## 実装上の注意点

### 必須パターン
- タブごとに独立したフォーム管理
- React Query Mutation + invalidateQueries
- 共通レイアウトコンポーネントの再利用

### 共通化戦略
- 家族全体の報酬設定（/reward/）と子供個別の報酬設定でレイアウトコンポーネントを共有
- フォームスキーマも共通化
- フックのみ child-specific に実装

### データフェッチング
- staleTime: 0、refetchOnMount: "always" で常に最新データ取得
- 更新後は invalidateQueries で再フェッチ

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

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


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
