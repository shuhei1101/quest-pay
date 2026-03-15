(2026年3月記載)

# 子供クエスト閲覧画面 アクションコンポーネント

## アクションコンポーネント概要

子供クエスト閲覧画面では、クエストのステータスに応じて以下のアクションが可能です：

1. **完了報告**: クエストが実行中（in_progress）の場合
2. **報告キャンセル**: 完了報告済み（pending_review）の場合

## 完了報告ボタン

### ReportButton コンポーネント

**ファイル:** `app/(app)/quests/child/_components/ReportButton.tsx`

**責務:** 完了報告アクションの実行

**Props:**
```typescript
type Props = {
  questId: string
  status: 'not_started' | 'in_progress' | 'pending_review' | 'completed'
  onReport: () => Promise<void>
  isLoading: boolean
}
```

**実装例:**
```typescript
export function ReportButton({ questId, status, onReport, isLoading }: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  
  // in_progress の場合のみ表示
  if (status !== 'in_progress') return null
  
  const handleClick = () => {
    setIsConfirmOpen(true)
  }
  
  const handleConfirm = async () => {
    await onReport()
    setIsConfirmOpen(false)
  }
  
  return (
    <>
      <Button
        fullWidth
        size="lg"
        color="blue"
        disabled={isLoading}
        loading={isLoading}
        onClick={handleClick}
      >
        完了報告
      </Button>
      
      <ConfirmModal
        opened={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="完了報告"
        message="クエストを完了報告しますか？親の承認待ちになります。"
        confirmLabel="報告する"
        cancelLabel="キャンセル"
      />
    </>
  )
}
```

**表示条件:**
- `status === 'in_progress'` のみ表示
- ローディング中は disabled 状態

**動作:**
1. ボタンクリック → 確認モーダル表示
2. 「報告する」クリック → `onReport()` 実行
3. API呼び出し成功 → ステータス更新、UI再レンダリング

### useReportCompletion フック

**ファイル:** `app/(app)/quests/child/_hooks/useReportCompletion.ts`

**責務:** 完了報告のAPI呼び出しとキャッシュ管理

**実装:**
```typescript
export function useReportCompletion(questId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => reportQuestCompletion(questId),
    onSuccess: () => {
      // キャッシュ無効化
      queryClient.invalidateQueries({ queryKey: ['childQuest', questId] })
      queryClient.invalidateQueries({ queryKey: ['childQuests'] })
      
      // 成功トースト表示
      showNotification({
        title: '完了報告しました',
        message: '親の承認をお待ちください',
        color: 'blue',
      })
    },
    onError: (error) => {
      // エラートースト表示
      showNotification({
        title: 'エラー',
        message: error.message || '完了報告に失敗しました',
        color: 'red',
      })
    },
  })
}
```

## 報告キャンセルボタン

### CancelReportButton コンポーネント

**ファイル:** `app/(app)/quests/child/_components/CancelReportButton.tsx`

**責務:** 報告キャンセルアクションの実行

**Props:**
```typescript
type Props = {
  questId: string
  status: 'not_started' | 'in_progress' | 'pending_review' | 'completed'
  onCancel: () => Promise<void>
  isLoading: boolean
}
```

**実装例:**
```typescript
export function CancelReportButton({ questId, status, onCancel, isLoading }: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  
  // pending_review の場合のみ表示
  if (status !== 'pending_review') return null
  
  const handleClick = () => {
    setIsConfirmOpen(true)
  }
  
  const handleConfirm = async () => {
    await onCancel()
    setIsConfirmOpen(false)
  }
  
  return (
    <>
      <Button
        fullWidth
        size="lg"
        variant="outline"
        color="gray"
        disabled={isLoading}
        loading={isLoading}
        onClick={handleClick}
      >
        報告をキャンセル
      </Button>
      
      <ConfirmModal
        opened={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="報告キャンセル"
        message="完了報告をキャンセルしますか？クエストは実行中に戻ります。"
        confirmLabel="キャンセルする"
        cancelLabel="戻る"
      />
    </>
  )
}
```

**表示条件:**
- `status === 'pending_review'` のみ表示
- ローディング中は disabled 状態

### useCancelReport フック

**ファイル:** `app/(app)/quests/child/_hooks/useCancelReport.ts`

**責務:** 報告キャンセルのAPI呼び出しとキャッシュ管理

**実装:**
```typescript
export function useCancelReport(questId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => cancelQuestReport(questId),
    onSuccess: () => {
      // キャッシュ無効化
      queryClient.invalidateQueries({ queryKey: ['childQuest', questId] })
      queryClient.invalidateQueries({ queryKey: ['childQuests'] })
      
      // 成功トースト表示
      showNotification({
        title: '報告をキャンセルしました',
        message: 'クエストを続けることができます',
        color: 'gray',
      })
    },
    onError: (error) => {
      // エラートースト表示
      showNotification({
        title: 'エラー',
        message: error.message || '報告のキャンセルに失敗しました',
        color: 'red',
      })
    },
  })
}
```

## 確認モーダル

### ConfirmModal コンポーネント

**ファイル:** `app/(core)/_components/ConfirmModal.tsx` (共通コンポーネント)

**Props:**
```typescript
type Props = {
  opened: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: string
}
```

**使用例:**
```typescript
<ConfirmModal
  opened={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  onConfirm={handleConfirm}
  title="完了報告"
  message="クエストを完了報告しますか？親の承認待ちになります。"
  confirmLabel="報告する"
  cancelLabel="キャンセル"
  confirmColor="blue"
/>
```

## 通知バナー

### NotificationBanner コンポーネント

**ファイル:** `app/(core)/_components/NotificationBanner.tsx`

**責務:** ユーザーへの情報通知

**Props:**
```typescript
type Props = {
  variant: 'info' | 'warning' | 'success' | 'error'
  message: string
  icon?: React.ReactNode
  onClose?: () => void
}
```

**使用例（pending_review時）:**
```typescript
{status === 'pending_review' && (
  <NotificationBanner
    variant="warning"
    message="親の承認待ちです。承認されると報酬がもらえます！"
    icon={<IconClock />}
  />
)}
```

**バナースタイル:**
- `info`: 青色背景
- `warning`: 黄色背景
- `success`: 緑色背景
- `error`: 赤色背景

## アクションボタンの統合使用

### ChildQuestViewScreen での実装

```typescript
export function ChildQuestViewScreen({ id }: { id: string }) {
  const { data, isLoading } = useChildQuest(id)
  const reportMutation = useReportCompletion(id)
  const cancelMutation = useCancelReport(id)
  
  const handleReport = async () => {
    await reportMutation.mutateAsync()
  }
  
  const handleCancel = async () => {
    await cancelMutation.mutateAsync()
  }
  
  return (
    <Stack>
      {/* ステータスバナー */}
      {data?.status === 'pending_review' && (
        <NotificationBanner
          variant="warning"
          message="親の承認待ちです"
        />
      )}
      
      {/* クエスト詳細 */}
      <ChildQuestDetail quest={data} />
      
      {/* 進捗トラッカー */}
      <ProgressTracker {...data} />
      
      {/* アクションボタン */}
      <ReportButton
        questId={id}
        status={data?.status}
        onReport={handleReport}
        isLoading={reportMutation.isPending}
      />
      
      <CancelReportButton
        questId={id}
        status={data?.status}
        onCancel={handleCancel}
        isLoading={cancelMutation.isPending}
      />
    </Stack>
  )
}
```

## トースト通知

### showNotification の使用

**ライブラリ:** `@mantine/notifications`

**成功時:**
```typescript
showNotification({
  title: '完了報告しました',
  message: '親の承認をお待ちください',
  color: 'blue',
  icon: <IconCheck />,
})
```

**エラー時:**
```typescript
showNotification({
  title: 'エラー',
  message: error.message || '完了報告に失敗しました',
  color: 'red',
  icon: <IconX />,
})
```

## ステータス別アクション一覧

| ステータス | 表示ボタン | アクション | API |
|-----------|-----------|-----------|-----|
| not_started | なし | - | - |
| in_progress | 完了報告 | 完了報告 | POST /api/quests/child/:id/report |
| pending_review | 報告キャンセル | キャンセル | POST /api/quests/child/:id/cancel-report |
| completed | なし | - | - |
