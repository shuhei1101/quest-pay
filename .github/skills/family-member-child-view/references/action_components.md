(2026年3月15日 14:30記載)

# 家族メンバー子供閲覧画面 アクションコンポーネント

## アクションコンポーネント概要

家族メンバー子供閲覧画面では、子供のユーザーリンク状態と親の権限に応じて以下のアクションが可能です：

1. **招待コード表示**: user_idがnullの場合（子供がまだアカウントを持っていない）
2. **報酬履歴表示**: すべての子供で可能
3. **編集**: 親ユーザーのみ（FABで提供）

## 招待コードボタン

### InviteCodeButton コンポーネント

**責務:** 招待コード表示アクションのトリガー

**Props:**
```typescript
type Props = {
  childId: string
  childName: string
  inviteCode: string
  visible: boolean  // user_idがnullの場合のみtrue
}
```

**実装例:**
```typescript
export function InviteCodeButton({ 
  childId, 
  childName, 
  inviteCode, 
  visible 
}: Props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  
  if (!visible) return null
  
  return (
    <>
      <Button
        fullWidth
        variant="light"
        color="blue"
        leftSection={<IconKey />}
        onClick={() => setIsPopupOpen(true)}
      >
        招待コードを表示
      </Button>
      
      <InviteCodePopup
        opened={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        inviteCode={inviteCode}
        childName={childName}
      />
    </>
  )
}
```

**表示条件:**
- `user_id === null` の場合のみ表示
- 初回マウント時に自動でポップアップ表示

**動作:**
1. ボタンクリック → 招待コードポップアップ表示
2. ポップアップでコピー可能
3. 何度でも再表示可能

## 招待コードポップアップ

### InviteCodePopup コンポーネント

**ファイル:** `app/(core)/_components/InviteCodePopup.tsx`

**責務:** 招待コードの表示とクリップボードコピー

**Props:**
```typescript
type Props = {
  opened: boolean
  onClose: () => void
  inviteCode: string
  childName: string
}
```

**実装例:**
```typescript
export function InviteCodePopup({ 
  opened, 
  onClose, 
  inviteCode, 
  childName 
}: Props) {
  const formattedCode = useMemo(() => {
    // ABC123DEF456 → ABC-123-DEF-456
    return inviteCode.match(/.{1,3}/g)?.join('-') || inviteCode
  }, [inviteCode])
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode)
      
      showNotification({
        title: 'コピーしました',
        message: '招待コードをクリップボードにコピーしました',
        color: 'green',
        icon: <IconCheck />,
      })
    } catch (error) {
      showNotification({
        title: 'エラー',
        message: 'コピーに失敗しました',
        color: 'red',
        icon: <IconX />,
      })
    }
  }
  
  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="招待コード"
      centered
    >
      <Stack gap="md">
        <Text size="sm">
          {childName}さんの招待コード
        </Text>
        
        <Card withBorder p="lg" radius="md" bg="gray.0">
          <Text 
            size="xl" 
            fw={700} 
            ta="center" 
            style={{ letterSpacing: '0.1em' }}
          >
            {formattedCode}
          </Text>
        </Card>
        
        <Button 
          onClick={handleCopy} 
          leftSection={<IconCopy />}
          fullWidth
        >
          クリップボードにコピー
        </Button>
        
        <Alert icon={<IconInfoCircle />} color="blue">
          この招待コードを子供のアカウント作成時に入力してもらってください
        </Alert>
        
        <Button 
          variant="subtle" 
          onClick={onClose}
          fullWidth
        >
          閉じる
        </Button>
      </Stack>
    </Modal>
  )
}
```

**機能:**
- 招待コードの視認性の高い表示（大きなフォント、間隔調整）
- ワンクリックでクリップボードにコピー
- コピー成功/失敗のトースト通知
- 使い方の説明テキスト

## 自動ポップアップロジック

### useAutoInvitePopup フック

**ファイル:** `app/(app)/children/[id]/_hooks/useAutoInvitePopup.ts`

**責務:** 初回表示時の招待コード自動ポップアップ

**実装:**
```typescript
export function useAutoInvitePopup(
  hasUserId: boolean,
  isLoading: boolean
) {
  const [showPopup, setShowPopup] = useState(false)
  const hasShownRef = useRef(false)
  
  useEffect(() => {
    // データロード完了 && user_idなし && 未表示
    if (!isLoading && !hasUserId && !hasShownRef.current) {
      setShowPopup(true)
      hasShownRef.current = true
    }
  }, [hasUserId, isLoading])
  
  return {
    showPopup,
    openPopup: () => setShowPopup(true),
    closePopup: () => setShowPopup(false),
  }
}
```

**使用例:**
```typescript
// ChildView.tsx
const { data, isLoading } = useChild(childId)
const { showPopup, openPopup, closePopup } = useAutoInvitePopup(
  !!data?.child.user_id,
  isLoading
)

return (
  <>
    {/* ... */}
    <InviteCodePopup
      opened={showPopup}
      onClose={closePopup}
      inviteCode={data?.child.invite_code || ''}
      childName={data?.child.name || ''}
    />
  </>
)
```

## 報酬履歴ボタン

### RewardHistoryButton コンポーネント

**責務:** 報酬履歴画面への遷移

**Props:**
```typescript
type Props = {
  childId: string
}
```

**実装例:**
```typescript
export function RewardHistoryButton({ childId }: Props) {
  const router = useRouter()
  
  const handleClick = () => {
    router.push(`/children/${childId}/rewards`)
  }
  
  return (
    <Button
      fullWidth
      variant="outline"
      leftSection={<IconHistory />}
      onClick={handleClick}
    >
      報酬履歴を見る
    </Button>
  )
}
```

**表示条件:**
- 常に表示
- すべての子供で利用可能

## 編集FAB（Floating Action Button）

### FloatingActionButton の使用

**ファイル:** `app/(app)/children/[id]/layout.tsx`

**責務:** 編集画面への遷移（親のみ）

**実装例:**
```typescript
// layout.tsx
'use client'

export default function ChildLayout({ 
  children,
  params: { id },
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  
  // 親ユーザー && 閲覧画面の場合のみFAB表示
  const showEditFab = user?.role === 'parent' && pathname.endsWith('/view')
  
  return (
    <>
      {children}
      
      {showEditFab && (
        <FloatingActionButton
          icon={<IconEdit />}
          onClick={() => router.push(`/children/${id}/edit`)}
          position="bottom-right"
          color="blue"
          size="lg"
          ariaLabel="子供情報を編集"
        />
      )}
    </>
  )
}
```

**FloatingActionButton Props:**
```typescript
type Props = {
  icon: React.ReactNode
  onClick: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  color?: string
  size?: 'sm' | 'md' | 'lg'
  ariaLabel: string
}
```

**スタイル:**
- 位置: 右下固定（position: fixed）
- サイズ: 大（56px x 56px）
- 色: プライマリーブルー
- シャドウ: 深めの影で浮遊感を演出
- アニメーション: ホバー時に拡大

## アクションエリア統合

### ChildView での実装

```typescript
export function ChildView({ childId }: { childId: string }) {
  const { data, isLoading } = useChild(childId)
  const { showPopup, openPopup, closePopup } = useAutoInvitePopup(
    !!data?.child.user_id,
    isLoading
  )
  
  if (isLoading) return <LoadingSpinner />
  if (!data) return <ErrorDisplay />
  
  const needsInvite = !data.child.user_id
  
  return (
    <Stack gap="md">
      {/* 子供情報表示 */}
      <ChildViewLayout child={data.child} />
      
      {/* アクションエリア */}
      <Stack gap="xs">
        {/* 招待コードボタン（user_idなしの場合のみ） */}
        {needsInvite && (
          <InviteCodeButton
            childId={childId}
            childName={data.child.name}
            inviteCode={data.child.invite_code || ''}
            visible={needsInvite}
          />
        )}
        
        {/* 報酬履歴ボタン（常に表示） */}
        <RewardHistoryButton childId={childId} />
      </Stack>
      
      {/* 招待コードポップアップ */}
      <InviteCodePopup
        opened={showPopup}
        onClose={closePopup}
        inviteCode={data.child.invite_code || ''}
        childName={data.child.name}
      />
    </Stack>
  )
}
```

## トースト通知

### showNotification の使用

**ライブラリ:** `@mantine/notifications`

**コピー成功時:**
```typescript
showNotification({
  title: 'コピーしました',
  message: '招待コードをクリップボードにコピーしました',
  color: 'green',
  icon: <IconCheck />,
  autoClose: 3000,
})
```

**コピー失敗時:**
```typescript
showNotification({
  title: 'エラー',
  message: 'コピーに失敗しました',
  color: 'red',
  icon: <IconX />,
  autoClose: 5000,
})
```

## 条件付きアクション表示

### user_id状態別アクション一覧

| user_id | 招待コードボタン | 自動ポップアップ | 報酬履歴ボタン | 編集FAB |
|---------|----------------|-----------------|---------------|---------|
| null    | 表示           | あり（初回のみ）| 表示          | 表示    |
| あり    | 非表示         | なし            | 表示          | 表示    |

### 権限別アクション一覧

| ユーザー種別 | 閲覧 | 招待コード表示 | 報酬履歴 | 編集 |
|-------------|------|---------------|---------|------|
| 親（同家族）| ○   | ○             | ○       | ○   |
| 親（別家族）| ×   | ×             | ×       | ×   |
| 子供        | ×   | ×             | ×       | ×   |
| ゲスト      | ×   | ×             | ×       | ×   |

## クリップボードAPI対応

### ブラウザ互換性対応

```typescript
async function copyToClipboard(text: string): Promise<boolean> {
  // モダンブラウザ: Clipboard API
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Clipboard API failed:', error)
    }
  }
  
  // フォールバック: execCommand (非推奨だが互換性のため)
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  } catch (error) {
    console.error('execCommand failed:', error)
    return false
  }
}
```

## アクセシビリティ対応

### キーボードナビゲーション

```typescript
// ポップアップの Escape キーでの閉じる
<Modal
  opened={opened}
  onClose={onClose}
  closeOnEscape={true}
  trapFocus={true}
  // ...
>
```

### スクリーンリーダー対応

```typescript
<Button
  onClick={handleCopy}
  aria-label="招待コードをクリップボードにコピー"
>
  <IconCopy />
  コピー
</Button>

<FloatingActionButton
  icon={<IconEdit />}
  onClick={handleEdit}
  ariaLabel="子供情報を編集"
/>
```
