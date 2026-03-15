# 家族クエスト閲覧画面 - アクションコンポーネント

**(2026年3月記載)**

## FABメニュー（SubMenuFAB）

### 基本構造
**ファイル:** `app/(core)/_components/SubMenuFAB.tsx`

**用途:** 画面右下に固定配置されるFABメニュー

### 親ユーザー向けFABアイテム

```typescript
items={[
  {
    icon: <IconArrowLeft size={20} />,
    label: "戻る",
    onClick: () => router.back(),
  },
  {
    icon: <IconEdit size={20} />,
    label: "編集",
    onClick: () => router.push(FAMILY_QUEST_EDIT_URL(id)),
    color: "blue",
  },
  {
    icon: <IconTrash size={20} />,
    label: "削除",
    onClick: handleDelete,
    color: "red",
  },
  {
    icon: <IconSend size={20} />,
    label: "公開",
    onClick: handlePublish,
    color: "green",
  },
  ...(availableLevels.length > 1 ? [{
    icon: (
      <Indicator label={selectedLevel} size={18} color="blue" offset={4}>
        <LevelIcon size={20} />
      </Indicator>
    ),
    label: "レベル",
    onClick: () => {
      closeFab("family-quest-fab")
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
openFab("family-quest-fab")

// FABを閉じる
closeFab("family-quest-fab")

// FABの開閉状態を確認
isOpen("family-quest-fab")
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

## 子供専用アクションボタン

### 受注ボタン
**表示条件:** クエスト状態が `not_started`

**アクション:**
```typescript
POST /api/quests/family/[id]/child/[childId]/start
```

**実装:**
```typescript
<Button
  onClick={handleStart}
  disabled={isLoading}
>
  受注する
</Button>
```

### 完了報告ボタン
**表示条件:** クエスト状態が `in_progress`

**アクション:**
```typescript
POST /api/quests/family/[id]/review-request
```

**実装:**
```typescript
<Button
  onClick={handleReviewRequest}
  disabled={isLoading}
  color="green"
>
  完了報告
</Button>
```

### 報告キャンセルボタン
**表示条件:** クエスト状態が `pending_review`

**アクション:**
```typescript
POST /api/quests/family/[id]/cancel-review
```

**実装:**
```typescript
<Button
  onClick={handleCancelReview}
  disabled={isLoading}
  color="yellow"
>
  報告キャンセル
</Button>
```

## モーダルダイアログ

### 削除確認モーダル
```typescript
import { modals } from '@mantine/modals'

const handleDelete = () => {
  modals.openConfirmModal({
    title: 'クエストを削除',
    children: (
      <Text size="sm">
        このクエストを削除してもよろしいですか？
        この操作は取り消せません。
      </Text>
    ),
    labels: { confirm: '削除', cancel: 'キャンセル' },
    confirmProps: { color: 'red' },
    onConfirm: async () => {
      // DELETE APIコール
      await deleteQuest({ id })
      router.push(HOME_URL)
    },
  })
}
```

### 公開確認モーダル
```typescript
const handlePublish = () => {
  modals.openConfirmModal({
    title: 'クエストを公開',
    children: (
      <Text size="sm">
        このクエストを公開クエストとして公開しますか？
        公開後は他の家族も閲覧・採用できるようになります。
      </Text>
    ),
    labels: { confirm: '公開', cancel: 'キャンセル' },
    confirmProps: { color: 'green' },
    onConfirm: async () => {
      // POST /publish APIコール
      await publishQuest({ id })
      notifications.show({
        title: '公開完了',
        message: 'クエストを公開しました',
        color: 'green',
      })
    },
  })
}
```

## Indicator（バッジ）

### レベルインジケーター
```typescript
<Indicator label={selectedLevel} size={18} color="blue" offset={4}>
  <LevelIcon size={20} />
</Indicator>
```

**用途:** 現在選択中のレベルを表示

## 通知（Notifications）

### 成功通知
```typescript
import { notifications } from '@mantine/notifications'

notifications.show({
  title: '操作完了',
  message: '処理が正常に完了しました',
  color: 'green',
})
```

### エラー通知
```typescript
notifications.show({
  title: 'エラー',
  message: 'エラーが発生しました',
  color: 'red',
})
```

## ローディング状態の管理

### ButtonのLoading
```typescript
<Button
  onClick={handleAction}
  loading={isLoading}
  disabled={isLoading}
>
  アクション
</Button>
```

### 画面全体のLoading Overlay
```typescript
<LoadingOverlay visible={isLoading} />
```
