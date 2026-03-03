---
name: quest-view-api
description: クエスト閲覧画面のAPI操作知識を提供するスキル。エンドポイント、リクエスト/レスポンス、フック、DB操作を含む。
---

# quest-view-api

このスキルは、クエスト閲覧画面（QuestView）のAPI操作に関する知識を提供する。各クエストタイプ（家族、公開、テンプレート、子供）の閲覧画面で使用されるAPIクライアント、フック、エンドポイント、リクエスト/レスポンスの型定義を網羅する。

## 対象範囲

- 家族クエスト閲覧API (`app/api/quests/family/[id]/`)
- 公開クエスト閲覧API (`app/api/quests/public/[id]/`)
- テンプレートクエスト閲覧API (`app/api/quests/template/[id]/`)
- 子供クエスト閲覧API (`app/api/quests/family/[id]/child/[childId]/`)
- 関連フック (`_hooks/`)

## 家族クエスト閲覧API

### エンドポイント

**URL:** `FAMILY_QUEST_API_URL(familyQuestId)` - `/api/quests/family/[id]`

**定義場所:** `app/(core)/endpoints.ts`

### GET /api/quests/family/[id]

**役割:** 家族クエストの詳細を取得する

**パラメータ:**
- `id: string` - 家族クエストID（パスパラメータ）

**レスポンス型:** `GetFamilyQuestResponse`

```typescript
export type GetFamilyQuestResponse = {
  familyQuest: Awaited<ReturnType<typeof fetchFamilyQuest>>
}
```

**主要フィールド:**
- `base` - 基本情報（id, familyId, questId, updatedAt等）
- `quest` - クエスト情報（name, requestDetail, client等）
- `details` - レベル別詳細（level, successCondition, reward, childExp等）
- `icon` - アイコン情報（name, size）
- `category` - カテゴリ情報
- `tags` - タグ情報

**クライアント関数:** `getFamilyQuest({ familyQuestId })`

**実装場所:** `app/api/quests/family/[id]/client.ts`

### PUT /api/quests/family/[id]

**役割:** 家族クエストを更新する

**リクエスト型:** `PutFamilyQuestRequest`

```typescript
export const PutFamilyQuestRequestScheme = z.object({
  form: FamilyQuestFormScheme,
  familyQuestUpdatedAt: z.string(),
  questUpdatedAt: z.string(),
})
```

**クライアント関数:** `putFamilyQuest({ request, familyQuestId })`

### DELETE /api/quests/family/[id]

**役割:** 家族クエストを削除する

**リクエスト型:** `DeleteFamilyQuestRequest`

```typescript
export const DeleteFamilyQuestRequestScheme = z.object({
  updatedAt: z.string(),
})
```

**クライアント関数:** `deleteFamilyQuest({ request, familyQuestId })`

### フック: useFamilyQuest

**パス:** `app/(app)/quests/family/[id]/view/_hooks/useFamilyQuest.ts`

**役割:** 家族クエストデータを取得するカスタムフック

**パラメータ:**
- `id: string` - 家族クエストID

**返り値:**
- `familyQuest` - 取得した家族クエストデータ
- `isLoading` - ローディング状態

**実装:**
```typescript
export const useFamilyQuest = ({id}: {id: string}) => {
  const router = useRouter()
  
  const { data, error, isLoading } = useQuery({
    queryKey: ["familyQuest", id],
    retry: false,
    queryFn: () => getFamilyQuest({ familyQuestId: id }),
    enabled: !!id
  })

  if (error) handleAppError(error, router)

  return {
    familyQuest: data?.familyQuest,
    isLoading,
  }
}
```

## 公開クエスト閲覧API

### エンドポイント

**URL:** `PUBLIC_QUEST_API_URL(publicQuestId)` - `/api/quests/public/[id]`

**定義場所:** `app/(core)/endpoints.ts`

### GET /api/quests/public/[id]

**役割:** 公開クエストの詳細を取得する

**パラメータ:**
- `id: string` - 公開クエストID（パスパラメータ）

**レスポンス型:** `GetPublicQuestResponse`

```typescript
export type GetPublicQuestResponse = {
  publicQuest: Awaited<ReturnType<typeof fetchPublicQuest>>
}
```

**主要フィールド:**
- `base` - 基本情報（id, updatedAt等）
- `quest` - クエスト詳細
- `details` - レベル別詳細
- `icon` - アイコン情報
- `familyIcon` - 家族アイコン情報
- `tags` - タグ情報

**クライアント関数:** `getPublicQuest({ publicQuestId })`

**実装場所:** `app/api/quests/public/[id]/client.ts`

### PUT /api/quests/public/[id]

**役割:** 公開クエストを更新する（編集権限がある場合のみ）

**リクエスト型:** `PutPublicQuestRequest`

```typescript
export const PutPublicQuestRequestScheme = z.object({
  form: PublicQuestFormScheme,
  updatedAt: z.string(),
})
```

### DELETE /api/quests/public/[id]

**役割:** 公開クエストを削除する

**リクエスト型:** `DeletePublicQuestRequest`

```typescript
export const DeletePublicQuestRequestScheme = z.object({
  updatedAt: z.string(),
})
```

### フック: usePublicQuest

**パス:** `app/(app)/quests/public/[id]/view/_hooks/usePublicQuest.ts`

**役割:** 公開クエストデータを取得するカスタムフック

**パラメータ:**
- `id: string` - 公開クエストID

**返り値:**
- `publicQuest` - 取得した公開クエストデータ
- `isLoading` - ローディング状態

### フック: useLikeQuest

**パス:** `app/(app)/quests/public/[id]/view/_hooks/useLikeQuest.ts`

**役割:** 公開クエストにいいねを追加するカスタムフック

**返り値:**
- `handleLike` - いいねハンドラー関数
- `isLoading` - ローディング状態

**パラメータ（handleLike）:**
- `publicQuestId: string` - 公開クエストID

### フック: useCancelQuestLike

**パス:** `app/(app)/quests/public/[id]/view/_hooks/useCancelQuestLike.ts`

**役割:** 公開クエストのいいねを解除するカスタムフック

**返り値:**
- `handleCancelLike` - いいね解除ハンドラー関数
- `isLoading` - ローディング状態

### フック: useLikeCount

**パス:** `app/(app)/quests/public/[id]/view/_hooks/useLikeCount.ts`

**役割:** 公開クエストのいいね数を取得するカスタムフック

**パラメータ:**
- `id: string` - 公開クエストID

**返り値:**
- `likeCount` - いいね数

### フック: useIsLike

**パス:** `app/(app)/quests/public/[id]/view/_hooks/useIsLike.ts`

**役割:** ログインユーザーがいいねしているかどうかを取得するカスタムフック

**パラメータ:**
- `id: string` - 公開クエストID

**返り値:**
- `isLike` - いいねしているかどうか（boolean）

## テンプレートクエスト閲覧API

### エンドポイント

**URL:** `TEMPLATE_QUEST_API_URL(templateQuestId)` - `/api/quests/template/[id]`

**定義場所:** `app/(core)/endpoints.ts`

### GET /api/quests/template/[id]

**役割:** テンプレートクエストの詳細を取得する

**パラメータ:**
- `id: string` - テンプレートクエストID（パスパラメータ）

**レスポンス型:** `GetTemplateQuestResponse`

```typescript
export type GetTemplateQuestResponse = {
  templateQuest: Awaited<ReturnType<typeof fetchTemplateQuest>>
}
```

**主要フィールド:**
- `base` - 基本情報
- `quest` - クエスト詳細
- `details` - レベル別詳細
- `icon` - アイコン情報
- `tags` - タグ情報

**クライアント関数:** `getTemplateQuest({ templateQuestId })`

**実装場所:** `app/api/quests/template/[id]/client.ts`

### PUT /api/quests/template/[id]

**役割:** テンプレートクエストを更新する

**リクエスト型:** `PutTemplateQuestRequest`

```typescript
export const PutTemplateQuestRequestScheme = z.object({
  form: TemplateQuestFormScheme,
  updatedAt: z.string(),
})
```

### DELETE /api/quests/template/[id]

**役割:** テンプレートクエストを削除する

**リクエスト型:** `DeleteTemplateQuestRequest`

```typescript
export const DeleteTemplateQuestRequestScheme = z.object({
  updatedAt: z.string(),
})
```

### フック: useTemplateQuest

**パス:** `app/(app)/quests/template/[id]/view/_hooks/useTemplateQuest.ts`

**役割:** テンプレートクエストデータを取得するカスタムフック

**パラメータ:**
- `id: string` - テンプレートクエストID

**返り値:**
- `templateQuest` - 取得したテンプレートクエストデータ
- `isLoading` - ローディング状態

## 子供クエスト閲覧API

### エンドポイント

**URL:** `CHILD_QUEST_API_URL(familyQuestId, childId)` - `/api/quests/family/[id]/child/[childId]`

**定義場所:** `app/(core)/endpoints.ts`

### GET /api/quests/family/[id]/child/[childId]

**役割:** 子供クエストの詳細を取得する

**パラメータ:**
- `id: string` - 家族クエストID（パスパラメータ）
- `childId: string` - 子供ID（パスパラメータ）

**レスポンス型:** `GetChildQuestResponse`

```typescript
export type GetChildQuestResponse = {
  childQuest: Awaited<ReturnType<typeof fetchChildQuest>>
}
```

**主要フィールド:**
- `base` - 基本情報（家族クエストのベース）
- `quest` - クエスト情報
- `details` - レベル別詳細
- `children` - 子供別クエスト情報（status, level, completionCount, requestMessage等）
- `icon` - アイコン情報
- `category` - カテゴリ情報
- `tags` - タグ情報

**クライアント関数:** `getChildQuest({ familyQuestId, childId })`

**実装場所:** `app/api/quests/family/[id]/child/[childId]/client.ts`

### フック: useChildQuest

**パス:** `app/(app)/quests/family/[id]/view/child/[childId]/_hooks/useChildQuest.ts`

**役割:** 子供クエストデータを取得するカスタムフック

**パラメータ:**
- `id: string` - 家族クエストID
- `childId: string` - 子供ID

**返り値:**
- `childQuest` - 取得した子供クエストデータ
- `isLoading` - ローディング状態

**特記事項:** データ取得失敗時は自動的にホーム画面へリダイレクトし、フィードバックメッセージを表示する

### フック: useReviewRequest

**パス:** `app/(app)/quests/family/[id]/view/child/[childId]/_hooks/useReviewRequest.ts`

**役割:** 完了報告を送信するカスタムフック（子供用）

**返り値:**
- `handleReviewRequest` - 報告リクエストハンドラー（モーダルオープン）
- `executeReviewRequest` - 実際の報告実行関数
- `closeModal` - モーダルクローズ関数
- `isModalOpen` - モーダル開閉状態
- `isLoading` - ローディング状態

### フック: useCancelReview

**パス:** `app/(app)/quests/family/[id]/view/child/[childId]/_hooks/useCancelReview.ts`

**役割:** 完了報告を取り消すカスタムフック（子供用）

**返り値:**
- `handleCancelReview` - 報告取消ハンドラー（モーダルオープン）
- `executeCancelReview` - 実際の取消実行関数
- `closeModal` - モーダルクローズ関数
- `isModalOpen` - モーダル開閉状態
- `isLoading` - ローディング状態

### フック: useRejectReport

**パス:** `app/(app)/quests/family/[id]/view/child/[childId]/_hooks/useRejectReport.ts`

**役割:** 完了報告を却下するカスタムフック（親用）

**返り値:**
- `handleRejectReport` - 報告却下ハンドラー
- `executeRejectReport` - 実際の却下実行関数
- `closeModal` - モーダルクローズ関数
- `isModalOpen` - モーダル開閉状態
- `isLoading` - ローディング状態

### フック: useApproveReport

**パス:** `app/(app)/quests/family/[id]/view/child/[childId]/_hooks/useApproveReport.ts`

**役割:** 完了報告を承認するカスタムフック（親用）

**返り値:**
- `handleApproveReport` - 報告承認ハンドラー（モーダルオープン）
- `executeApproveReport` - 実際の承認実行関数
- `closeModal` - モーダルクローズ関数
- `isModalOpen` - モーダル開閉状態
- `isLoading` - ローディング状態

### フック: useDeleteChildQuest

**パス:** `app/(app)/quests/family/[id]/view/child/[childId]/_hooks/useDeleteChildQuest.ts`

**役割:** 子供クエストを削除（リセット）するカスタムフック（親用）

**返り値:**
- `handleDelete` - 削除ハンドラー関数
- `isLoading` - ローディング状態

**パラメータ（handleDelete）:**
- `familyQuestId: string` - 家族クエストID
- `childId: string` - 子供ID

## 共通のAPI設計パターン

### エラーハンドリング
- すべてのAPIは`withRouteErrorHandling`でラップされる
- クライアント側では`AppError.fromResponse`で例外を生成
- フック内で`handleAppError(error, router)`を使用してエラー処理

### 認証コンテキスト
- すべてのAPIルートで`getAuthContext()`を使用
- `db`インスタンスと`userId`を取得
- `fetchUserInfoByUserId`でユーザー情報・家族情報を取得

### 排他制御
- 更新・削除時は`updatedAt`を使用した楽観的ロック
- バックエンド側で`updatedAt`を検証

### useQuery設定
- `retry: false` - リトライなし
- `enabled: !!id` - IDが存在する場合のみクエリ実行
- `queryKey` - 適切なキャッシュキーを設定

### useMutation設定
- `onSuccess`でキャッシュ無効化（`queryClient.invalidateQueries`）
- ローディング状態を管理
- 成功時はフィードバックメッセージ表示
