---
description: 報酬設定画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。
---

# 報酬設定画面の構造

## 概要

このスキルは、Quest Pay アプリの報酬設定画面の構造と実装詳細を提供します。家族全体と子供個別の両方の報酬設定機能（年齢別報酬・レベル別報酬）をカバーします。

**主要な特徴:**
- 家族全体と子供個別の2つのコンテキスト
- 年齢別報酬とレベル別報酬の2種類のタブ
- 年齢型（0〜100歳）と学年型（小1〜高3）の切り替え
- 共通レイアウトコンポーネントによるコード再利用
- 子供個別設定のリセット機能（家族全体設定へ戻す）

## 主要ソースファイル

### ページ（家族全体）
- `app/(app)/reward/page.tsx`: 報酬設定ページ（リダイレクト専用）
- `app/(app)/reward/_components/RewardEdit.tsx`: 家族全体の報酬設定画面メイン実装

### ページ（子供個別）
- `app/(app)/children/[id]/reward/page.tsx`: 子供報酬設定ページ（リダイレクト専用）
- `app/(app)/children/[id]/reward/_components/ChildRewardEdit.tsx`: 子供個別の報酬設定画面メイン実装

### 共通レイアウトコンポーネント
- `by-age/_components/AgeRewardEditLayout.tsx`: 年齢別報酬編集レイアウト（家族・子供共通）
- `by-level/_components/LevelRewardEditLayout.tsx`: レベル別報酬編集レイアウト（家族・子供共通）

### フォーム管理フック（家族全体）
- `by-age/_hooks/useAgeRewardForm.ts`: 家族の年齢別報酬フォーム管理
- `by-level/_hooks/useLevelRewardForm.ts`: 家族のレベル別報酬フォーム管理

### フォーム管理フック（子供個別）
- `children/[id]/reward/by-age/_hooks/useChildAgeRewardForm.ts`: 子供の年齢別報酬フォーム管理
- `children/[id]/reward/by-level/_hooks/useChildLevelRewardForm.ts`: 子供のレベル別報酬フォーム管理

### フォームスキーマ（共通）
- `by-age/form.ts`: AgeRewardFormSchema (Zod)
- `by-level/form.ts`: LevelRewardFormSchema (Zod)

### データベース
- `drizzle/schema.ts`: age_reward_tables, level_reward_tables

## 主要機能グループ

### 1. 年齢別報酬管理
- 年齢型（0〜100歳）と学年型（小1〜高3）の切り替え
- 各年齢/学年の報酬額設定
- 家族全体と子供個別の設定

### 2. レベル別報酬管理
- 1〜100レベルの報酬テーブル
- 各レベルの報酬額設定
- 家族全体と子供個別の設定

### 3. データ永続化
- 家族全体: PUT /api/reward/by-age/table, PUT /api/reward/by-level/table
- 子供個別: PUT /api/children/[id]/reward/by-age/table, PUT /api/children/[id]/reward/by-level/table
- React Query によるキャッシュ管理

### 4. フォールバック機能
- 子供個別設定がない場合は家族全体設定を表示
- データ取得優先順位: 子供個別設定 → 家族全体設定

### 5. リセット機能（子供個別のみ）
- 子供個別設定を削除
- 家族全体設定に戻す

## Reference Files Usage

### コンポーネント構造を把握する場合
画面階層、2つのタブ構成、FABアクション、レイアウトを確認：
```
references/component_structure.md
```

### フォーム管理を理解する場合
スキーマ定義（配列構造）、状態管理、送信処理、共通化戦略を確認：
```
references/form_management.md
```

### 画面フローを理解する場合
家族全体・子供個別の保存フロー、リセットフロー、年齢型切替、エラーハンドリングを確認：
```
references/flow_diagram.md
```

### バリデーションルールを確認する場合
年齢・レベル・報酬額のフィールド別制約、配列バリデーション、学年型変換を確認：
```
references/validation_rules.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md` で家族全体・子供個別フロー確認
2. **フォーム理解**: `references/form_management.md` でシンプルな配列ベースフォームスキーマ確認
3. **実装時**: `references/component_structure.md` でタブ構成とレイアウトコンポーネントの再利用パターン確認
4. **バリデーション追加時**: `references/validation_rules.md` で詳細な制約ルール確認

## 実装上の注意点

### 必須パターン

1. **認証制御**
   - 親ユーザーのみアクセス可能
   - authGuard で childNG, guestNG を設定

2. **フォーム状態管理**
   - 家族全体: useAgeRewardForm, useLevelRewardForm
   - 子供個別: useChildAgeRewardForm, useChildLevelRewardForm
   - 配列ベースで年齢/レベル別報酬を管理

3. **共通レイアウトの再利用**
   - AgeRewardEditLayout, LevelRewardEditLayout は家族・子供共通
   - Props経由でフォームとonSubmitを渡して再利用

4. **子供個別設定のフォールバック**
   - GET時に子供個別設定がなければ家族全体設定を返す
   - UIでは透過的に処理（ユーザーは意識しない）

5. **React Query統合**
   - 家族: ["ageRewardTable"], ["levelRewardTable"]
   - 子供: ["childAgeRewardTable", childId], ["childLevelRewardTable", childId]
   - 送信成功時にキャッシュ無効化

6. **FABアクション分岐**
   - 家族全体: 保存のみ
   - 子供個別: 保存、リセット（家族全体設定に戻す）

### アンチパターン（避けるべき実装）

❌ **配列要素の不整合**
```typescript
// NG: 年齢/レベルの連続性がない
const rewards = [
  { age: 0, amount: 100 },
  { age: 2, amount: 200 }, // age: 1 が抜けている
  ...
]
```

❌ **子供個別設定のフォールバック忘れ**
```typescript
// NG: 子供設定がない場合にエラー表示
if (!childRewards) {
  return <ErrorMessage>設定がありません</ErrorMessage>
}
// OK: 家族全体設定をフォールバック
const rewards = childRewards ?? familyRewards
```

❌ **共通レイアウトを使わずに重複実装**
```typescript
// NG: 家族・子供で別々にテーブルコンポーネントを実装
<FamilyAgeRewardTable />
<ChildAgeRewardTable />
// OK: 共通レイアウトを再利用
<AgeRewardEditLayout form={form} onSubmit={handleSubmit} />
```

### よくある実装ミス

1. **年齢型切替で配列長が変わらない**
   - 年齢型（101要素）→ 学年型（18要素）の切り替え時に配列再生成忘れ

2. **レベル報酬の上限チェック不足**
   - レベル100まで処理されることを確認せず、途中でエラー

3. **キャッシュ無効化の範囲ミス**
   - 家族全体更新時に子供個別キャッシュも無効化してしまう
   - 逆に子供個別更新時に家族全体を無効化し忘れ

4. **LoadingOverlay の条件不足**
   - データ取得中のみチェックし、送信中のローディングを表示しない

5. **リセット時の確認モーダル省略**
   - 子供個別設定削除を確認なしで実行（誤操作のリスク）

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## エンドポイント

### 画面URL（家族全体）
- `REWARD_URL`: 家族全体の報酬設定画面

### 画面URL（子供個別）
- `CHILD_REWARD_URL(childId)`: 子供個別の報酬設定画面

### API（家族全体）
- `GET /api/reward/by-age/table`: 家族の年齢別報酬テーブル取得
- `PUT /api/reward/by-age/table`: 家族の年齢別報酬テーブル更新
- `GET /api/reward/by-level/table`: 家族のレベル別報酬テーブル取得
- `PUT /api/reward/by-level/table`: 家族のレベル別報酬テーブル更新

### API（子供個別）
- `GET /api/children/[id]/reward/by-age/table`: 子供の年齢別報酬テーブル取得
- `PUT /api/children/[id]/reward/by-age/table`: 子供の年齢別報酬テーブル更新
- `DELETE /api/children/[id]/reward/by-age/table`: 子供の年齢別報酬設定削除（リセット用）
- `GET /api/children/[id]/reward/by-level/table`: 子供のレベル別報酬テーブル取得
- `PUT /api/children/[id]/reward/by-level/table`: 子供のレベル別報酬テーブル更新
- `DELETE /api/children/[id]/reward/by-level/table`: 子供のレベル別報酬設定削除（リセット用）
