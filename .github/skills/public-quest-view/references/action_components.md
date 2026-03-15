# 公開クエスト閲覧画面 - アクションコンポーネント

**(2026年3月15日 14:30記載)**

## FABメニュー（SubMenuFAB）

### 基本構造
**ファイル:** `app/(core)/_components/SubMenuFAB.tsx`

**用途:** 画面右下に固定配置されるFABメニュー

### FABアイテム構成

```typescript
items={[
  {
    icon: (
      <Indicator label={likeCount || 0} size={18} color="red" offset={4}>
        {isLike ? (
          <IconHeartFilled size={20} />
        ) : (
          <IconHeart size={20} />
        )}
      </Indicator>
    ),
    label: "いいね",
    onClick: likeToggleHandle,
    color: isLike ? "red" : "gray",
  },
  {
    icon: (
      <Indicator label={commentCount || 0} size={18} color="blue" offset={4}>
        <IconMessage size={20} />
      </Indicator>
    ),
    label: "コメント",
    onClick: openCommentModal,
  },
  {
    icon: <RenderIcon iconName={publicQuest?.familyIcon?.name} iconSize={20} />,
    label: "家族",
    onClick: () => {}, // 将来的に家族ページへ遷移
  },
  ...(availableLevels.length > 1 ? [{
    icon: (
      <Indicator label={selectedLevel} size={18} color="blue" offset={4}>
        <LevelIcon size={20} />
      </Indicator>
    ),
    label: "レベル",
    onClick: () => {
      closeFab("public-quest-fab")
      setLevelMenuOpened(true)
    },
  }] : []),
]}
```

### FAB制御フック
**ファイル:** `app/(core)/_components/FABContext.tsx`

**使用方法:**
```typescript
const { openFab, closeFab, isOpen } = useFABContext()

// FABを開く
openFab("public-quest-fab")

// FABを閉じる
closeFab("public-quest-fab")

// FABの開閉状態を確認
isOpen("public-quest-fab")
```

## いいねボタン

### いいね切り替えハンドラ
```typescript
const likeToggleHandle = () => {
  if (isLike) {
    // いいねされている場合、いいねを取り消す
    handleCancelLike({ publicQuestId: id })
  } else {
    // いいねされていない場合、いいねする
    handleLike({ publicQuestId: id })
  }
}
```

### useLikeQuest フック
**ファイル:** `app/(app)/quests/public/[id]/view/_hooks/useLikeQuest.ts`

**API:** `POST /api/quests/public/[id]/likes`

**使用方法:**
```typescript
const { handleLike, isLoading } = useLikeQuest()

handleLike({ publicQuestId: id })
```

### useCancelQuestLike フック
**ファイル:** `app/(app)/quests/public/[id]/view/_hooks/useCancelQuestLike.ts`

**API:** `DELETE /api/quests/public/[id]/likes`

**使用方法:**
```typescript
const { handleCancelLike, isLoading } = useCancelQuestLike()

handleCancelLike({ publicQuestId: id })
```

## コメントモーダル

### モーダル開閉制御
```typescript
import { useDisclosure } from '@mantine/hooks'

const [commentModalOpened, { open: openCommentModal, close: closeCommentModal }] = useDisclosure(false)

// モーダル表示
<PublicQuestComments
  id={id}
  opened={commentModalOpened}
  onClose={closeCommentModal}
/>
```

### コメント投稿
**ファイル:** `app/(app)/quests/public/[id]/comments/_hooks/usePostComment.ts`

**API:** `POST /api/quests/public/[id]/comments`

**使用方法:**
```typescript
const { handlePostComment, isLoading } = usePostComment()

const handleSubmit = () => {
  if (!comment.trim()) return

  handlePostComment({
    publicQuestId: id,
    content: comment,
    onSuccess: () => {
      setComment("")
      refetch()
    },
  })
}
```

### コメント一覧表示
```typescript
<Stack gap="md">
  {comments?.map((comment) => (
    <CommentItemLayout
      key={comment.id}
      commentId={comment.id}
      userName={comment.user.name}
      userIcon={comment.user.icon}
      content={comment.content}
      createdAt={comment.createdAt}
      likeCount={comment.likeCount}
      isUpvoted={comment.isUpvoted}
      isDownvoted={comment.isDownvoted}
      isPinned={comment.isPinned}
      hasPublisherLike={comment.hasPublisherLike}
      isOwnComment={comment.userId === userInfo?.profiles?.id}
      isPublisher={publicQuest?.familyId === userInfo?.profiles?.familyId}
      onUpvote={() => handleUpvoteClick(comment.id)}
      onDownvote={() => handleDownvoteClick(comment.id)}
      onReport={() => handleReportClick(comment.id)}
      onDelete={() => handleDeleteClick(comment.id)}
      onPin={() => handlePinClick(comment.id)}
      onPublisherLike={() => handlePublisherLikeClick(comment.id)}
    />
  ))}
</Stack>
```

## コメント操作

### 高評価
**ファイル:** `app/(app)/quests/public/[id]/comments/_hooks/useUpvoteComment.ts`

**API:** `PUT /api/comments/[commentId]/upvote`

**使用方法:**
```typescript
const { handleUpvote, isLoading } = useUpvoteComment()

const handleUpvoteClick = (commentId: string) => {
  const comment = comments?.find((c) => c.id === commentId)
  if (!comment) return

  handleUpvote({
    publicQuestId: id,
    commentId,
    isUpvoted: comment.isUpvoted,
    onSuccess: refetch,
  })
}
```

### 低評価
**ファイル:** `app/(app)/quests/public/[id]/comments/_hooks/useDownvoteComment.ts`

**API:** `PUT /api/comments/[commentId]/downvote`

**使用方法:**
```typescript
const { handleDownvote, isLoading } = useDownvoteComment()

const handleDownvoteClick = (commentId: string) => {
  const comment = comments?.find((c) => c.id === commentId)
  if (!comment) return

  handleDownvote({
    publicQuestId: id,
    commentId,
    isDownvoted: comment.isDownvoted,
    onSuccess: refetch,
  })
}
```

### コメント報告
**ファイル:** `app/(app)/quests/public/[id]/comments/_hooks/useReportComment.ts`

**API:** `POST /api/comments/[commentId]/report`

**使用方法:**
```typescript
const { handleReport, isLoading } = useReportComment()

const handleReportClick = (commentId: string) => {
  modals.openConfirmModal({
    title: 'コメントを報告',
    children: (
      <Text size="sm">
        このコメントを不適切なコンテンツとして報告しますか？
      </Text>
    ),
    labels: { confirm: '報告', cancel: 'キャンセル' },
    confirmProps: { color: 'red' },
    onConfirm: () => {
      handleReport({
        publicQuestId: id,
        commentId,
        onSuccess: () => {
          notifications.show({
            title: '報告完了',
            message: 'コメントを報告しました',
            color: 'green',
          })
        },
      })
    },
  })
}
```

### コメント削除（自コメントのみ）
**ファイル:** `app/(app)/quests/public/[id]/comments/_hooks/useDeleteComment.ts`

**API:** `DELETE /api/comments/[commentId]`

**使用方法:**
```typescript
const { handleDelete, isLoading } = useDeleteComment()

const handleDeleteClick = (commentId: string) => {
  modals.openConfirmModal({
    title: 'コメントを削除',
    children: (
      <Text size="sm">
        このコメントを削除してもよろしいですか？
        この操作は取り消せません。
      </Text>
    ),
    labels: { confirm: '削除', cancel: 'キャンセル' },
    confirmProps: { color: 'red' },
    onConfirm: () => {
      handleDelete({
        publicQuestId: id,
        commentId,
        onSuccess: refetch,
      })
    },
  })
}
```

### ピン留め（公開者のみ）
**ファイル:** `app/(app)/quests/public/[id]/comments/_hooks/usePinComment.ts`

**API:** `PUT /api/comments/[commentId]/pin`

**使用方法:**
```typescript
const { handlePin, handleUnpin, isLoading } = usePinComment()

const handlePinClick = (commentId: string) => {
  const comment = comments?.find((c) => c.id === commentId)
  if (!comment) return

  if (comment.isPinned) {
    handleUnpin({
      publicQuestId: id,
      commentId,
      onSuccess: refetch,
    })
  } else {
    handlePin({
      publicQuestId: id,
      commentId,
      onSuccess: refetch,
    })
  }
}
```

### 公開者いいね（公開者のみ）
**ファイル:** `app/(app)/quests/public/[id]/comments/_hooks/usePublisherLike.ts`

**API:** `PUT /api/comments/[commentId]/publisher-like`

**使用方法:**
```typescript
const { handleLike, handleUnlike, isLoading } = usePublisherLike()

const handlePublisherLikeClick = (commentId: string) => {
  const comment = comments?.find((c) => c.id === commentId)
  if (!comment) return

  if (comment.hasPublisherLike) {
    handleUnlike({
      publicQuestId: id,
      commentId,
      onSuccess: refetch,
    })
  } else {
    handleLike({
      publicQuestId: id,
      commentId,
      onSuccess: refetch,
    })
  }
}
```

## レベル選択メニュー

### コンポーネント構造
**表示位置:** 画面右下、FABの上部に表示

**スタイル:**
```typescript
<div 
  ref={levelMenuRef}
  style={{ 
    position: "fixed", 
    bottom: "90px", 
    right: isMobile ? "20px" : "40px", 
    zIndex: 3001 
  }}
>
  <Paper shadow="md" p="xs" radius="md" withBorder>
    <Stack gap="xs">
      <Text size="xs" fw={600} c="dimmed" px="xs">
        レベルを選択
      </Text>
      {availableLevels.map((level) => (
        <Paper
          key={level}
          p="xs"
          radius="md"
          onClick={() => handleLevelChange(level)}
          // ...スタイル
        >
          <Text size="sm">レベル {level}</Text>
        </Paper>
      ))}
    </Stack>
  </Paper>
</div>
```

### 外側クリック検知
```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (levelMenuRef.current && !levelMenuRef.current.contains(event.target as Node)) {
      setLevelMenuOpened(false)
    }
  }

  if (levelMenuOpened) {
    document.addEventListener("mousedown", handleClickOutside)
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
  }
}, [levelMenuOpened])
```

## Indicator（バッジ）

### いいね数インジケーター
```typescript
<Indicator label={likeCount || 0} size={18} color="red" offset={4}>
  {isLike ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
</Indicator>
```

### コメント数インジケーター
```typescript
<Indicator label={commentCount || 0} size={18} color="blue" offset={4}>
  <IconMessage size={20} />
</Indicator>
```

### レベルインジケーター
```typescript
<Indicator label={selectedLevel} size={18} color="blue" offset={4}>
  <LevelIcon size={20} />
</Indicator>
```

## 通知（Notifications）

### いいね通知
```typescript
notifications.show({
  title: 'いいねしました',
  message: 'クエストにいいねしました',
  color: 'red',
})
```

### コメント投稿通知
```typescript
notifications.show({
  title: 'コメント投稿完了',
  message: 'コメントを投稿しました',
  color: 'green',
})
```

### エラー通知
```typescript
notifications.show({
  title: 'エラー',
  message: '処理に失敗しました',
  color: 'red',
})
```

## ローディング状態の管理

### FABボタンのローディング
```typescript
<Button
  onClick={likeToggleHandle}
  loading={isLikeLoading || isCancelLikeLoading}
  disabled={isLikeLoading || isCancelLikeLoading}
>
  いいね
</Button>
```

### コメント投稿ボタンのローディング
```typescript
<Button
  onClick={handleSubmit}
  loading={isPostingComment}
  disabled={isPostingComment || !comment.trim()}
>
  投稿
</Button>
```

### モーダル全体のローディングオーバーレイ
```typescript
<LoadingOverlay visible={isLoading} />
```
