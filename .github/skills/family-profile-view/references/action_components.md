(2026年3月記載)

# 家族プロフィール閲覧画面 アクションコンポーネント

## アクションコンポーネント概要

家族プロフィール閲覧画面では、以下のアクションが可能です：

1. **フォロー/アンフォロー**: 家族をフォロー・アンフォローする
2. **シェア**: 家族プロフィールのURLをシェアする
3. **タイムライン項目クリック**: イベント詳細への遷移

## フォローボタン

### FollowButton コンポーネント

**ファイル:** `app/(app)/families/[id]/view/_components/FamilyProfileViewFooter.tsx` 内

**責務:** フォロー/アンフォローアクション

**Props:**
```typescript
type Props = {
  familyId: string
  isFollowing: boolean
  onToggle: () => Promise<void>
  isLoading: boolean
}
```

**実装例:**
```typescript
export function FollowButton({ 
  familyId, 
  isFollowing, 
  onToggle, 
  isLoading 
}: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  
  const handleClick = () => {
    if (isFollowing) {
      // フォロー解除時は確認ダイアログ
      setIsConfirmOpen(true)
    } else {
      // フォロー時は直接実行
      onToggle()
    }
  }
  
  const handleConfirm = async () => {
    await onToggle()
    setIsConfirmOpen(false)
  }
  
  return (
    <>
      <Button
        flex={1}
        variant={isFollowing ? 'outline' : 'filled'}
        color={isFollowing ? 'gray' : 'blue'}
        leftSection={isFollowing ? <IconCheck /> : <IconPlus />}
        disabled={isLoading}
        loading={isLoading}
        onClick={handleClick}
      >
        {isFollowing ? 'フォロー中' : 'フォロー'}
      </Button>
      
      <ConfirmModal
        opened={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="フォロー解除"
        message="この家族のフォローを解除しますか？"
        confirmLabel="解除する"
        cancelLabel="キャンセル"
      />
    </>
  )
}
```

**ボタンスタイル:**
- **フォロー**: プライマリーボタン（青・塗りつぶし） + プラスアイコン
- **フォロー中**: アウトラインボタン（グレー・枠のみ） + チェックアイコン

**動作:**
1. フォローボタンクリック → 即座にフォロー処理
2. フォロー中ボタンクリック → 確認ダイアログ表示
3. 確認ダイアログでOK → アンフォロー処理

### useFollowToggle フック

**ファイル:** `app/(app)/families/[id]/view/_hooks/useFamilyProfile.ts`

**責務:** フォロー/アンフォローのAPI呼び出しと楽観的更新

**実装:**
```typescript
export function useFollowToggle(familyId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (isFollowing: boolean) => {
      // 現在の状態に応じてAPIを切り替え
      if (isFollowing) {
        return await unfollowFamily(familyId)
      } else {
        return await followFamily(familyId)
      }
    },
    onMutate: async (isFollowing) => {
      // 楽観的更新: UIを先に更新
      await queryClient.cancelQueries({ 
        queryKey: ['family', familyId, 'follow-status'] 
      })
      
      const previousData = queryClient.getQueryData([
        'family', familyId, 'follow-status'
      ])
      
      // キャッシュを更新（UIが即座に反映される）
      queryClient.setQueryData(
        ['family', familyId, 'follow-status'],
        {
          isFollowing: !isFollowing,
          followedAt: !isFollowing ? new Date().toISOString() : null,
        }
      )
      
      return { previousData }
    },
    onError: (err, variables, context) => {
      // エラー時は元の状態にロールバック
      if (context?.previousData) {
        queryClient.setQueryData(
          ['family', familyId, 'follow-status'],
          context.previousData
        )
      }
      
      showNotification({
        title: 'エラー',
        message: 'フォロー状態の更新に失敗しました',
        color: 'red',
        icon: <IconX />,
      })
    },
    onSuccess: (data, isFollowing) => {
      // キャッシュ無効化（最新データを取得）
      queryClient.invalidateQueries({ 
        queryKey: ['family', familyId, 'detail'] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['family', familyId, 'follow-status'] 
      })
      
      // 成功トースト
      showNotification({
        title: isFollowing ? 'フォローを解除しました' : 'フォローしました',
        message: isFollowing 
          ? '' 
          : 'この家族の最新情報を受け取れます',
        color: 'green',
        icon: <IconCheck />,
      })
    },
  })
}
```

**API呼び出し:**
```typescript
// client.ts
export async function followFamily(familyId: string) {
  const response = await fetch(`/api/families/${familyId}/follow`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to follow family')
  return response.json()
}

export async function unfollowFamily(familyId: string) {
  const response = await fetch(`/api/families/${familyId}/follow`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to unfollow family')
  return response.json()
}
```

## シェアボタン

### ShareButton コンポーネント

**責務:** 家族プロフィールのURLをシェア

**Props:**
```typescript
type Props = {
  familyId: string
  familyName: string
}
```

**実装例:**
```typescript
export function ShareButton({ familyId, familyName }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const profileUrl = `${window.location.origin}/families/${familyId}/view`
  
  const handleShare = async () => {
    // Web Share APIをサポートしているか確認
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${familyName}のプロフィール - Quest Pay`,
          text: `${familyName}のプロフィールをチェック！`,
          url: profileUrl,
        })
        
        showNotification({
          title: 'シェアしました',
          color: 'green',
        })
      } catch (error) {
        // ユーザーがキャンセルした場合など
        if (error.name !== 'AbortError') {
          // フォールバック: モーダル表示
          setIsModalOpen(true)
        }
      }
    } else {
      // Web Share API非サポート: モーダル表示
      setIsModalOpen(true)
    }
  }
  
  return (
    <>
      <Button
        flex={1}
        variant="outline"
        leftSection={<IconShare />}
        onClick={handleShare}
      >
        シェア
      </Button>
      
      <ShareModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={profileUrl}
        title={`${familyName}のプロフィール`}
      />
    </>
  )
}
```

### ShareModal コンポーネント

**ファイル:** `app/(core)/_components/ShareModal.tsx` (共通コンポーネント)

**責務:** シェアオプションの表示

**Props:**
```typescript
type Props = {
  opened: boolean
  onClose: () => void
  url: string
  title: string
}
```

**実装例:**
```typescript
export function ShareModal({ opened, onClose, url, title }: Props) {
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url)
      showNotification({
        title: 'URLをコピーしました',
        color: 'green',
        icon: <IconCheck />,
      })
    } catch (error) {
      showNotification({
        title: 'コピーに失敗しました',
        color: 'red',
        icon: <IconX />,
      })
    }
  }
  
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    line: `https://line.me/R/msg/text/?${encodeURIComponent(`${title} ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  }
  
  return (
    <Modal opened={opened} onClose={onClose} title="シェア" centered>
      <Stack gap="md">
        {/* URL表示とコピーボタン */}
        <Card withBorder p="sm">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Text size="sm" truncate flex={1}>
              {url}
            </Text>
            <Button 
              size="xs" 
              variant="light" 
              onClick={handleCopyUrl}
              leftSection={<IconCopy size={14} />}
            >
              コピー
            </Button>
          </Group>
        </Card>
        
        {/* SNSシェアボタン */}
        <Stack gap="xs">
          <Text size="sm" fw={600}>SNSでシェア</Text>
          
          <Button
            fullWidth
            variant="outline"
            leftSection={<IconBrandTwitter />}
            component="a"
            href={shareUrls.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter でシェア
          </Button>
          
          <Button
            fullWidth
            variant="outline"
            leftSection={<IconBrandLine />}
            component="a"
            href={shareUrls.line}
            target="_blank"
            rel="noopener noreferrer"
          >
            LINE でシェア
          </Button>
          
          <Button
            fullWidth
            variant="outline"
            leftSection={<IconBrandFacebook />}
            component="a"
            href={shareUrls.facebook}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook でシェア
          </Button>
        </Stack>
      </Stack>
    </Modal>
  )
}
```

## フッター統合コンポーネント

### FamilyProfileViewFooter

**ファイル:** `app/(app)/families/[id]/view/_components/FamilyProfileViewFooter.tsx`

**責務:** フォローボタンとシェアボタンの配置

**実装例:**
```typescript
export function FamilyProfileViewFooter({ 
  familyId, 
  familyName,
  isFollowing, 
  onFollowToggle, 
  isLoading 
}: Props) {
  return (
    <Group grow gap="xs" style={{ position: 'sticky', bottom: 0, padding: '16px', backgroundColor: 'white', borderTop: '1px solid #e0e0e0' }}>
      <FollowButton
        familyId={familyId}
        isFollowing={isFollowing}
        onToggle={onFollowToggle}
        isLoading={isLoading}
      />
      
      <ShareButton
        familyId={familyId}
        familyName={familyName}
      />
    </Group>
  )
}
```

**レイアウト:**
- 画面下部に固定（sticky footer）
- フォローボタンとシェアボタンを均等配置
- ボーダーで区切り

## タイムライン項目クリック

### TimelineItem インタラクティブ

**ファイル:** `app/(core)/_components/TimelineItem.tsx`

**責務:** タイムライン項目のクリックでイベント詳細へ遷移

**実装例:**
```typescript
export function TimelineItem({ item }: { item: TimelineItemData }) {
  const router = useRouter()
  
  const handleClick = () => {
    switch (item.eventType) {
      case 'quest_completed':
      case 'quest_published':
        if (item.questId) {
          router.push(`/quests/public/${item.questId}`)
        }
        break
      case 'level_up':
        if (item.childId) {
          router.push(`/children/${item.childId}`)
        }
        break
    }
  }
  
  const isClickable = !!item.questId || !!item.childId
  
  return (
    <Card
      withBorder
      p="md"
      style={{ 
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.2s',
      }}
      onClick={isClickable ? handleClick : undefined}
      className={isClickable ? 'hover-card' : ''}
    >
      <Group align="flex-start" wrap="nowrap">
        {/* アイコン */}
        <Avatar size={40} radius="xl">
          {getEventIcon(item.eventType)}
        </Avatar>
        
        {/* 内容 */}
        <Stack gap={4} flex={1}>
          <Text size="sm">{item.message}</Text>
          <Text size="xs" c="dimmed">{item.relativeTime}</Text>
        </Stack>
        
        {/* 矢印アイコン（クリック可能な場合） */}
        {isClickable && (
          <IconChevronRight size={18} color="gray" />
        )}
      </Group>
    </Card>
  )
}
```

**ホバー効果CSS:**
```css
.hover-card:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}
```

## 確認ダイアログ

### ConfirmModal の使用

**ファイル:** `app/(core)/_components/ConfirmModal.tsx` (共通コンポーネント)

**フォロー解除時の確認:**
```typescript
<ConfirmModal
  opened={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  onConfirm={handleUnfollow}
  title="フォロー解除"
  message="この家族のフォローを解除しますか？"
  confirmLabel="解除する"
  cancelLabel="キャンセル"
  confirmColor="red"
/>
```

## トースト通知

### showNotification の使用

**ライブラリ:** `@mantine/notifications`

**フォロー成功時:**
```typescript
showNotification({
  title: 'フォローしました',
  message: 'この家族の最新情報を受け取れます',
  color: 'green',
  icon: <IconCheck />,
  autoClose: 3000,
})
```

**アンフォロー成功時:**
```typescript
showNotification({
  title: 'フォローを解除しました',
  color: 'gray',
  icon: <IconCheck />,
  autoClose: 3000,
})
```

**エラー時:**
```typescript
showNotification({
  title: 'エラー',
  message: 'フォロー状態の更新に失敗しました',
  color: 'red',
  icon: <IconX />,
  autoClose: 5000,
})
```

## 楽観的更新（Optimistic Update）

### メリット
- ユーザーに即座にフィードバック
- APIレスポンス待ち時間を感じさせない
- ネットワーク遅延の影響を最小化

### 実装パターン

```typescript
onMutate: async (isFollowing) => {
  // 1. 現在の状態を保存（ロールバック用）
  const previousData = queryClient.getQueryData([...])
  
  // 2. 進行中のクエリをキャンセル
  await queryClient.cancelQueries({ queryKey: [...] })
  
  // 3. キャッシュを即座に更新
  queryClient.setQueryData([...], newData)
  
  // 4. 元の状態を返す（エラー時に使用）
  return { previousData }
}
```

### ロールバック処理

```typescript
onError: (err, variables, context) => {
  // エラー時は保存しておいた元の状態に戻す
  if (context?.previousData) {
    queryClient.setQueryData([...], context.previousData)
  }
  
  showNotification({ ... })
}
```

## アクション状態管理

### フォロー状態別UI一覧

| フォロー状態 | ボタンラベル | ボタンスタイル | アイコン | 確認ダイアログ |
|-------------|------------|--------------|---------|---------------|
| 未フォロー   | フォロー    | 塗りつぶし（青） | + | なし |
| フォロー中   | フォロー中   | アウトライン（グレー） | ✓ | あり |

## アクセシビリティ対応

### キーボードナビゲーション

```typescript
<Button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
>
```

### スクリーンリーダー対応

```typescript
<Button
  aria-label={isFollowing ? '家族のフォローを解除' : '家族をフォロー'}
  aria-pressed={isFollowing}
>
  {isFollowing ? 'フォロー中' : 'フォロー'}
</Button>
```
