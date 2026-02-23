---
name: reward-structure
description: 報酬設定画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。
---

# 報酬設定画面 スキル

## 概要

報酬設定画面は、家族全体または子供個別に、年齢別・レベル別の報酬テーブルを設定する画面。

## ファイル構成

### 家族全体の報酬設定

#### メインファイル
- `app/(app)/reward/page.tsx`: 報酬設定ページ（編集）
- `app/(app)/reward/view/page.tsx`: 報酬設定ページ（閲覧）

#### コンポーネント
- `app/(app)/reward/_components/RewardEdit.tsx`: 報酬編集画面
- `app/(app)/reward/_components/RewardView.tsx`: 報酬閲覧画面
- `app/(app)/reward/_components/RewardViewLayout.tsx`: 報酬閲覧レイアウト
- `app/(app)/reward/by-age/_components/AgeRewardEditLayout.tsx`: 年齢別報酬編集レイアウト
- `app/(app)/reward/by-age/view/AgeRewardViewLayout.tsx`: 年齢別報酬閲覧レイアウト
- `app/(app)/reward/by-level/_components/LevelRewardEditLayout.tsx`: レベル別報酬編集レイアウト
- `app/(app)/reward/by-level/view/LevelRewardViewLayout.tsx`: レベル別報酬閲覧レイアウト

#### フック
- `app/(app)/reward/_hooks/useReward.ts`: 報酬データ取得フック
- `app/(app)/reward/by-age/_hooks/useAgeRewardForm.ts`: 年齢別報酬フォーム
- `app/(app)/reward/by-level/_hooks/useLevelRewardForm.ts`: レベル別報酬フォーム

#### フォーム定義
- `app/(app)/reward/by-age/form.ts`: 年齢別報酬フォームスキーマ
- `app/(app)/reward/by-level/form.ts`: レベル別報酬フォームスキーマ

### 子供個別の報酬設定

#### メインファイル
- `app/(app)/children/[id]/reward/page.tsx`: 子供の報酬設定ページ（編集）
- `app/(app)/children/[id]/reward/view/page.tsx`: 子供の報酬設定ページ（閲覧）

#### コンポーネント
- `app/(app)/children/[id]/reward/_components/ChildRewardEdit.tsx`: 子供の報酬編集画面
- `app/(app)/children/[id]/reward/_components/ChildRewardView.tsx`: 子供の報酬閲覧画面

#### フック
- `app/(app)/children/[id]/reward/_hooks/useChildReward.ts`: 子供の報酬データ取得フック
- `app/(app)/children/[id]/reward/by-age/_hooks/useChildAgeRewardForm.ts`: 子供の年齢別報酬フォーム
- `app/(app)/children/[id]/reward/by-level/_hooks/useChildLevelRewardForm.ts`: 子供のレベル別報酬フォーム

### 共通コンポーネント

年齢別・レベル別のレイアウトコンポーネントとフォームスキーマは、家族全体と子供個別で共通利用されます：
- `AgeRewardEditLayout.tsx`
- `AgeRewardViewLayout.tsx`
- `LevelRewardEditLayout.tsx`
- `LevelRewardViewLayout.tsx`
- `form.ts` (by-age, by-level)

## 主要コンポーネント

### RewardEdit（家族全体）
**責務:** 家族全体の報酬テーブルの表示と設定管理

**主要機能:**
- 年齢別報酬テーブル表示・編集
- レベル別報酬設定・編集
- タブ切り替え（お小遣い/ランク報酬）

### ChildRewardEdit（子供個別）
**責務:** 子供個別の報酬テーブルの表示と設定管理

**主要機能:**
- 子供専用の年齢別報酬テーブル表示・編集
- 子供専用のレベル別報酬設定・編集
- タブ切り替え（お小遣い/ランク報酬）

## 注意点

- 親ユーザーのみ設定可能
- 年齢とレベルの両方を考慮した報酬設定
- 家族全体の設定と子供個別の設定は独立して管理
- レイアウトコンポーネントは共通化されており、家族・子供の両方で利用可能
