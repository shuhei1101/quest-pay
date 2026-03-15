# 家族プロフィール閲覧画面 - アクションコンポーネント

**(2026年3月15日 14:30記載)**

## フォローボタン

### 基本構造
**表示条件:** `isOwnFamily === false`（他家族の場合のみ）

### フォローボタン実装
```typescript
<Button
  onClick={handleFollowClick}
  disabled={isFollowToggleLoading}
  loading={isFollowToggleLoading}
  color={isFollowing ? "gray" : "blue"}
  variant={isFollowing ? "outline" : "filled"}
>
  {isFollowing ? "フォロー解除" : "フォローする"}
</Button>
```

### フォロー切り替えハンドラ
```typescript
const handleFollowClick = () => {
  if (isFollowing) {
    unfollow()
  } else {
    follow()
  }
}
```

### useFollowToggle フック
**ファイル:** `app/(app)/families/[id]/view/_hooks/useFamilyProfile.ts`

**提供される関数:**
```typescript
{
  follow: () => Promise<void>    // フォロー実行
  unfollow: () => Promise<void>  // フォロー解除実行
  isLoading: boolean             // ローディング状態
}
```

**API呼び出し:**
- フォロー: `POST /api/families/[id]/follow`
- フォロー解除: `DELETE /api/families/[id]/follow`

## 統計情報の表示

### 統計カード
```typescript
<Stack gap="md">
  <Group grow>
    <Paper p="md" radius="md" withBorder>
      <Text size="xs" c="dimmed">フォロワー</Text>
      <Text size="xl" fw={700}>{followerCount}</Text>
    </Paper>
    <Paper p="md" radius="md" withBorder>
      <Text size="xs" c="dimmed">フォロー</Text>
      <Text size="xl" fw={700}>{followingCount}</Text>
    </Paper>
  </Group>
  <Group grow>
    <Paper p="md" radius="md" withBorder>
      <Text size="xs" c="dimmed">公開クエスト</Text>
      <Text size="xl" fw={700}>{publicQuestCount}</Text>
    </Paper>
    <Paper p="md" radius="md" withBorder>
      <Text size="xs" c="dimmed">いいね</Text>
      <Text size="xl" fw={700}>{likeCount}</Text>
    </Paper>
  </Group>
</Stack>
```

### クリッカブル統計（将来実装）
```typescript
// フォロワー数クリック → フォロワー一覧画面へ
<Paper 
  p="md" 
  radius="md" 
  withBorder
  onClick={() => router.push(`/families/${id}/followers`)}
  style={{ cursor: "pointer" }}
>
  <Text size="xs" c="dimmed">フォロワー</Text>
  <Text size="xl" fw={700}>{followerCount}</Text>
</Paper>
```

## タイムライン表示

### タイムラインリスト
```typescript
<Stack gap="sm">
  {timelines.map((timeline, index) => (
    <Paper key={index} p="md" radius="md" withBorder>
      <Group justify="space-between">
        <Text size="sm">{timeline.message}</Text>
        <Text size="xs" c="dimmed">{timeline.time}</Text>
      </Group>
    </Paper>
  ))}
</Stack>
```

### 空のタイムライン
```typescript
{timelines.length === 0 && (
  <Paper p="xl" radius="md" withBorder>
    <Stack align="center" gap="xs">
      <IconInfoCircle size={32} color="gray" />
      <Text size="sm" c="dimmed">
        まだタイムラインがありません
      </Text>
    </Stack>
  </Paper>
)}
```

## アイコン表示

### RenderIcon コンポーネント
**ファイル:** `app/(app)/icons/_components/RenderIcon.tsx`

**使用方法:**
```typescript
<RenderIcon
  iconName={iconName}
  iconSize={iconSize}
  iconColor={iconColor}
/>
```

**Props:**
```typescript
{
  iconName?: string    // アイコン名（Tabler Icons）
  iconSize?: number    // アイコンサイズ
  iconColor?: string   // アイコン色（カラーコード）
}
```

### アイコンの背景色
```typescript
<div
  style={{
    width: iconSize,
    height: iconSize,
    borderRadius: "50%",
    backgroundColor: iconColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <RenderIcon iconName={iconName} iconSize={iconSize * 0.6} />
</div>
```

## フッター

### FamilyProfileViewFooter
**ファイル:** `app/(app)/families/[id]/view/_components/FamilyProfileViewFooter.tsx`

**責務:** フッター表示

**使用方法:**
```typescript
<FamilyProfileViewLayout
  // ...other props
  footer={<FamilyProfileViewFooter />}
/>
```

## ローディング状態

### ローディングオーバーレイ
```typescript
<LoadingOverlay 
  visible={isLoading} 
  overlayProps={{ blur: 2 }}
/>
```

**表示条件:**
```typescript
isLoading = 
  isFamilyLoading || 
  isFollowLoading || 
  isTimelineLoading || 
  isFollowToggleLoading
```

### ボタンのローディング
```typescript
<Button
  loading={isFollowToggleLoading}
  disabled={isFollowToggleLoading}
>
  {isFollowing ? "フォロー解除" : "フォローする"}
</Button>
```

## 通知（Notifications）

### フォロー成功通知
```typescript
import { notifications } from '@mantine/notifications'

notifications.show({
  title: 'フォロー完了',
  message: '家族をフォローしました',
  color: 'green',
})
```

### フォロー解除通知
```typescript
notifications.show({
  title: 'フォロー解除',
  message: 'フォローを解除しました',
  color: 'blue',
})
```

### エラー通知
```typescript
notifications.show({
  title: 'エラー',
  message: 'フォロー処理に失敗しました',
  color: 'red',
})
```

## 編集ボタン（親 & 自家族の場合）

### 編集ボタン実装（将来実装）
```typescript
{isOwnFamily && (
  <Button
    onClick={() => router.push(`/families/${id}/edit`)}
    variant="outline"
  >
    プロフィールを編集
  </Button>
)}
```

## レスポンシブ対応

### モバイル表示
```typescript
<Stack gap="md">
  {/* 縦並び */}
  <FamilyHeader />
  <FamilyStats />
  <FamilyIntroduction />
  <FamilyTimeline />
</Stack>
```

### デスクトップ表示
```typescript
<Grid>
  <Grid.Col span={4}>
    <FamilyHeader />
    <FamilyStats />
  </Grid.Col>
  <Grid.Col span={8}>
    <FamilyIntroduction />
    <FamilyTimeline />
  </Grid.Col>
</Grid>
```

## アクセシビリティ

### aria-label の追加
```typescript
<Button
  onClick={handleFollowClick}
  aria-label={isFollowing ? "フォローを解除する" : "家族をフォローする"}
>
  {isFollowing ? "フォロー解除" : "フォローする"}
</Button>
```

### キーボード操作対応
```typescript
<Paper
  tabIndex={0}
  onKeyPress={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleFollowClick()
    }
  }}
>
  {/* コンテンツ */}
</Paper>
```
