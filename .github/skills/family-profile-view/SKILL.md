---
name: family-profile-view
description: 家族プロフィール閲覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、フック、API、処理フローを含む。
---

# 家族プロフィール閲覧画面 スキル

## 概要

家族プロフィール閲覧画面は、家族の公開情報を表示する画面。
家族名、アイコン、紹介文、統計情報（公開クエスト数、いいね数）、フォロー情報、タイムラインを表示する。
親ユーザーのみアクセス可能。

## ファイル構成

### メインファイル
- `app/(app)/families/[id]/view/page.tsx`: 家族プロフィール閲覧ページ
- `app/(app)/families/[id]/view/FamilyProfileViewScreen.tsx`: 家族プロフィール閲覧画面実装

### コンポーネント
- `app/(app)/families/[id]/view/_components/FamilyProfileViewLayout.tsx`: 家族プロフィール閲覧レイアウト
- `app/(app)/families/[id]/view/_components/FamilyProfileViewFooter.tsx`: 家族プロフィール閲覧フッター

### フック
- `app/(app)/families/[id]/view/_hooks/useFamilyProfile.ts`: 家族プロフィール関連フック集
  - `useFamilyDetail`: 家族詳細情報取得
  - `useFollowStatus`: フォロー状態取得
  - `useFollowToggle`: フォロー切り替え
  - `useFamilyTimeline`: 家族タイムライン取得

### API
- `app/api/families/[id]/route.ts`: 家族詳細取得API
- `app/api/families/[id]/service.ts`: 家族詳細サービス層
- `app/api/families/[id]/client.ts`: クライアント側API呼び出し
- `app/api/families/[id]/follow/route.ts`: フォロー機能API
- `app/api/families/[id]/follow/client.ts`: フォロー機能クライアント側API
- `app/api/families/[id]/follow/status/route.ts`: フォロー状態取得API
- `app/api/timeline/family/[id]/client.ts`: 家族タイムライン取得API

## 主要コンポーネント

### FamilyProfileViewScreen
**責務:** 家族プロフィール閲覧画面のメイン実装

**Props:**
- `id: string`: 家族ID

**主要機能:**
- 家族詳細情報の表示
- フォロー/アンフォロー機能
- タイムライン表示
- 自分の家族判定

**使用フック:**
- `useLoginUserInfo()`: ログインユーザー情報取得
- `useFamilyDetail({ familyId })`: 家族詳細情報取得
- `useFollowStatus({ familyId })`: フォロー状態取得
- `useFollowToggle({ familyId })`: フォロー切り替え
- `useFamilyTimeline({ familyId })`: 家族タイムライン取得

### FamilyProfileViewLayout
**責務:** 家族プロフィール閲覧画面のレイアウト表示

**Props:**
- `familyName: string | null`: 家族名
- `displayId: string`: 表示ID
- `iconName?: string`: アイコン名
- `iconSize?: number | null`: アイコンサイズ
- `iconColor: string`: アイコンカラー
- `introduction: string`: 紹介文
- `followerCount: number`: フォロワー数
- `followingCount: number`: フォロー数
- `publicQuestCount: number`: 共有クエスト数
- `likeCount: number`: お気に入り登録された数
- `timelines: TimelineItemProps[]`: タイムライン配列
- `isLoading: boolean`: ローディング状態
- `isOwnFamily: boolean`: 自分の家族かどうか
- `isFollowing: boolean`: フォロー中かどうか
- `onFollowClick: () => void`: フォローボタン押下ハンドラ
- `footer: ReactNode`: フッターコンポーネント

**表示内容:**
- 家族アイコン
- 家族名
- 表示ID
- 紹介文
- 統計情報（フォロワー数、フォロー数、公開クエスト数、いいね数）
- フォローボタン（他の家族の場合のみ）
- タイムライン
- フッター

### FamilyProfileViewFooter
**責務:** 家族プロフィール閲覧画面のフッター

**主要機能:**
- ページ固有のフッターアクション（必要に応じて）

## フック詳細

### useFamilyDetail
**目的:** 家族詳細情報を取得する

**パラメータ:**
- `familyId: string`: 家族ID

**戻り値:**
```typescript
{
  familyDetail: FamilyDetailResponse | undefined
  isLoading: boolean
  error: Error | null
}
```

**使用API:** `GET /api/families/[id]`

### useFollowStatus
**目的:** フォロー状態を取得する

**パラメータ:**
- `familyId: string`: 家族ID

**戻り値:**
```typescript
{
  isFollowing: boolean
  isLoading: boolean
}
```

**使用API:** `GET /api/families/[id]/follow/status`

### useFollowToggle
**目的:** フォロー切り替えを行う

**パラメータ:**
- `familyId: string`: 家族ID

**戻り値:**
```typescript
{
  follow: () => void
  unfollow: () => void
  isLoading: boolean
}
```

**使用API:**
- `POST /api/families/[id]/follow`: フォロー
- `DELETE /api/families/[id]/follow`: アンフォロー

### useFamilyTimeline
**目的:** 家族タイムラインを取得する

**パラメータ:**
- `familyId: string`: 家族ID

**戻り値:**
```typescript
{
  timelines: TimelineItem[]
  isLoading: boolean
}
```

**使用API:** `GET /api/timeline/family/[id]`

## 処理フロー

### 初期表示フロー
1. `page.tsx` で認証ガード（親のみアクセス可能）
2. `FamilyProfileViewScreen` がマウント
3. 並列でデータ取得
   - `useFamilyDetail`: 家族詳細情報
   - `useFollowStatus`: フォロー状態
   - `useFamilyTimeline`: タイムライン
4. 自分の家族かどうかを判定（`userInfo?.profiles?.familyId === id`）
5. `FamilyProfileViewLayout` にデータを渡して表示

### フォロー切り替えフロー
1. フォローボタン押下
2. `handleFollowClick` 実行
3. `isFollowing` に応じて `follow()` または `unfollow()` を実行
4. API呼び出し（POST/DELETE）
5. `queryClient.invalidateQueries` でフォロー状態と家族詳細を再取得
6. UIが自動的に更新される

## API構造

### GET /api/families/[id]
**目的:** 家族詳細情報を取得する

**レスポンス型:**
```typescript
type FamilyDetailResponse = {
  family: {
    id: string
    displayId: string
    localName: string
    onlineName: string | null
    introduction: string
    iconId: number
    iconColor: string
  }
  icon: {
    name: string
    size: number | null
  } | null
  stats: {
    publicQuestCount: number
    likeCount: number
  }
  followCount: {
    followerCount: number
    followingCount: number
  }
}
```

**サービス層:**
- `fetchFamilyDetail({ db, familyId })`: 家族詳細情報取得
  - `fetchFamily({ db, familyId })`: 家族基本情報取得
  - `fetchFamilyStats({ db, familyId })`: 統計情報取得
  - `fetchFollowCount({ db, familyId })`: フォロー数取得

### POST /api/families/[id]/follow
**目的:** 家族をフォローする

**認証:** 必須（親のみ）

**処理:**
1. ログインユーザー情報取得
2. フォローレコード作成（`family_follows` テーブル）

### DELETE /api/families/[id]/follow
**目的:** 家族のフォローを解除する

**認証:** 必須（親のみ）

**処理:**
1. ログインユーザー情報取得
2. フォローレコード削除（`family_follows` テーブル）

### GET /api/families/[id]/follow/status
**目的:** フォロー状態を取得する

**認証:** 必須（親のみ）

**レスポンス型:**
```typescript
{
  isFollowing: boolean
}
```

### GET /api/timeline/family/[id]
**目的:** 家族タイムラインを取得する

**認証:** 必須

**レスポンス型:**
```typescript
{
  timelines: Array<{
    family_timeline: {
      message: string
      createdAt: string
    }
  }>
}
```

## 注意点

### アクセス制限
- 親ユーザーのみアクセス可能
- 子供ユーザーはアクセス不可（認証ガードでリダイレクト）

### 表示制御
- 自分の家族の場合、フォローボタンは非表示
- フォロー中の場合、「フォロー解除」ボタン表示
- 未フォローの場合、「フォロー」ボタン表示

### データ取得最適化
- 家族詳細、フォロー状態、タイムラインは並列取得
- いずれかのデータ取得中は `isLoading` が `true` になる
- フォロー切り替え中も `isLoading` が `true` になる

### タイムライン表示
- タイムラインアイテムは `{ message: string, time: string }` の配列
- 時刻は `formatTime()` ユーティリティで整形

## エンドポイント定義（endpoints.ts）

```typescript
export const FAMILY_VIEW_URL = (id: string) => `/families/${id}/view`
```

## 関連DBテーブル（schema.ts）

- `families`: 家族情報
- `icons`: アイコン情報
- `family_follows`: フォロー関係
- `family_timeline`: 家族タイムライン
- `public_quests`: 公開クエスト（統計用）
- `quest_likes`: クエストいいね（統計用）
