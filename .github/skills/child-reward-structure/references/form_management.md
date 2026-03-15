# 子供個別の報酬設定画面 - フォーム管理

（2026年3月記載）

## React Hook Form セットアップ

### 年齢別報酬フォーム: useChildAgeRewardForm

**ファイルパス**: `packages/web/app/(app)/children/[id]/reward/by-age/_hooks/useChildAgeRewardForm.ts`

**依存関係**:
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AgeRewardFormSchema, AgeRewardFormType } from "@/app/(app)/reward/by-age/form"
```

**初期化**:
```typescript
const form = useForm<AgeRewardFormType>({
  resolver: zodResolver(AgeRewardFormSchema),
  defaultValues: defaultAgeReward
})
```

**デフォルト値**:
```typescript
const defaultAgeReward: AgeRewardFormType = {
  rewards: []
}
```

### レベル別報酬フォーム: useChildLevelRewardForm

**ファイルパス**: `packages/web/app/(app)/children/[id]/reward/by-level/_hooks/useChildLevelRewardForm.ts`

**初期化**:
```typescript
const form = useForm<LevelRewardFormType>({
  resolver: zodResolver(LevelRewardFormSchema),
  defaultValues: defaultLevelReward
})
```

**デフォルト値**:
```typescript
const defaultLevelReward: LevelRewardFormType = {
  rewards: []
}
```

## データフェッチング

### 年齢別報酬取得

```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ["childAgeRewardTable", childId],
  queryFn: async () => {
    const { ageRewardTable } = await getChildAgeRewardTable(childId)
    
    const fetchedAgeRewardForm: AgeRewardFormType = {
      rewards: ageRewardTable.rewards
    }
    
    setFetchedAgeReward(fetchedAgeRewardForm)
    reset(fetchedAgeRewardForm)

    return { ageRewardEntity: ageRewardTable }
  },
  staleTime: 0,
  refetchOnMount: "always"
})
```

### レベル別報酬取得

```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ["childLevelRewardTable", childId],
  queryFn: async () => {
    const { levelRewardTable } = await getChildLevelRewardTable(childId)
    
    const fetchedLevelRewardForm: LevelRewardFormType = {
      rewards: levelRewardTable.rewards
    }
    
    setFetchedLevelReward(fetchedLevelRewardForm)
    reset(fetchedLevelRewardForm)

    return { levelRewardEntity: levelRewardTable }
  },
  staleTime: 0,
  refetchOnMount: "always"
})
```

## フォーム送信処理

### 年齢別報酬更新 Mutation

```typescript
const ageUpdateMutation = useMutation({
  mutationFn: async (data: AgeRewardFormType) => 
    await putChildAgeRewardTable(childId, data),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ 
      queryKey: ["childAgeRewardTable", childId] 
    })
    toast.success("定額報酬を更新しました")
    router.push(CHILD_REWARD_VIEW_URL(childId))
  },
  onError: () => {
    toast.error("定額報酬の更新に失敗しました")
  }
})
```

### レベル別報酬更新 Mutation

```typescript
const levelUpdateMutation = useMutation({
  mutationFn: async (data: LevelRewardFormType) => 
    await putChildLevelRewardTable(childId, data),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ 
      queryKey: ["childLevelRewardTable", childId] 
    })
    toast.success("ランク報酬を更新しました")
    router.push(CHILD_REWARD_VIEW_URL(childId))
  },
  onError: () => {
    toast.error("ランク報酬の更新に失敗しました")
  }
})
```

## フォーム状態管理

### 変更検知

```typescript
const isValueChanged = 
  JSON.stringify(currentAgeReward) !== JSON.stringify(fetchedAgeReward)
```

- JSON.stringifyで深い比較を実施
- 配列の変更も検知可能

### リセット処理

```typescript
if (window.confirm("入力内容を破棄してもよろしいですか？")) {
  if (activeTab === "age") {
    ageForm.setForm(ageForm.fetchedAgeReward)
  } else {
    levelForm.setForm(levelForm.fetchedLevelReward)
  }
}
```

- 確認ダイアログ表示
- タブに応じてフォームをリセット

## タブごとの送信処理

### 保存ボタンのロジック

```typescript
onClick: () => {
  if (activeTab === "age") {
    ageForm.handleSubmit((data) => ageUpdateMutation.mutate(data))()
  } else {
    levelForm.handleSubmit((data) => levelUpdateMutation.mutate(data))()
  }
}
```

- activeTab に基づいて適切なフォームを送信
- handleSubmit でバリデーション → mutation 実行

## キャッシュ無効化

```typescript
await queryClient.invalidateQueries({ 
  queryKey: ["childAgeRewardTable", childId] 
})
```

- 更新成功後にキャッシュ無効化
- 再取得により最新データを表示

## フォーム共通化戦略

- AgeRewardFormSchema と LevelRewardFormSchema は共通スキーマを使用
- 家族全体の報酬設定 (reward/) と子供個別の報酬設定で同じレイアウトコンポーネントを再利用
- フックのみ child-specific に実装
