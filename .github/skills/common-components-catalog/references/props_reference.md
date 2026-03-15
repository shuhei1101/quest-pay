# 共通コンポーネント Props リファレンス

**最終更新:** 2026年3月記載

## PageHeader

```typescript
type PageHeaderProps = {
  /** ページタイトル */
  title: string
  /** 右側に配置する要素（オプション） */
  rightSection?: React.ReactNode
  /** プロフィールボタンを表示するかどうか（デフォルト: true） */
  showProfileButton?: boolean
}
```

## ScrollableTabs

```typescript
type ScrollableTabItem = {
  value: string
  label: ReactNode
  leftSection?: ReactNode
  rightSection?: ReactNode
}

type ScrollableTabsProps = {
  activeTab: string | null
  onChange: (value: string | null) => void
  tabs: ScrollableTabItem[]
  children: ReactNode  // タブパネルの内容
}
```

## NavigationFAB

```typescript
type NavigationFABItem = {
  icon: ReactNode
  label: string
  onClick: () => void
}

type NavigationFABProps = {
  items: NavigationFABItem[]
  activeIndex?: number
  defaultOpen?: boolean
}
```

## SubMenuFAB

```typescript
type SubMenuFABItem = {
  icon: ReactNode
  label: string
  onClick: () => void
  color?: MantineColor
}

type SubMenuFABProps = {
  items: SubMenuFABItem[]
}
```

## FloatingActionButton

```typescript
type FloatingActionButtonItem = {
  icon: ReactNode
  label: string
  onClick: () => void
  color?: MantineColor
}

type FloatingActionButtonProps = {
  items: FloatingActionButtonItem[]
  pattern?: 'radial-up' | 'radial-down' | 'radial-left' | 'radial-right'
  slideDirection?: 'up' | 'down' | 'left' | 'right'
  mainIcon: ReactNode
  mainColor?: MantineColor
  position?: { bottom?: number; right?: number; left?: number; top?: number }
}
```

## NavigationButton

```typescript
type NavigationButtonProps = {
  href: string
  children: ReactNode
  variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default'
  color?: MantineColor
  leftSection?: ReactNode
  rightSection?: ReactNode
  fullWidth?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}
```

## LoadingButton

```typescript
type LoadingButtonProps = {
  onClick: () => Promise<void> | void
  children: ReactNode
  variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default'
  color?: MantineColor
  leftSection?: ReactNode
  rightSection?: ReactNode
  fullWidth?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loadingMessage?: string
}
```

## QuestCard

```typescript
type QuestCardProps = {
  quest: {
    id: string
    title: string
    description?: string
    status: QuestStatus
    reward?: number
    thumbnailUrl?: string
  }
  onClick?: () => void
  showActions?: boolean
}
```

## QuestStatusBadge

```typescript
type QuestStatusBadgeProps = {
  status: 'not_started' | 'in_progress' | 'pending_review' | 'completed' | 'rejected'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}
```

## SearchBar

```typescript
type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}
```

## FilterPopup

```typescript
type FilterOption = {
  value: string
  label: string
}

type FilterPopupProps = {
  options: FilterOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  label?: string
}
```

## SortPopup

```typescript
type SortOption = {
  value: string
  label: string
}

type SortPopupProps = {
  options: SortOption[]
  selectedValue: string
  onChange: (value: string) => void
  order?: 'asc' | 'desc'
  onOrderChange?: (order: 'asc' | 'desc') => void
}
```

## LoadingSpinner

```typescript
type LoadingSpinnerProps = {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: MantineColor
}
```

## ErrorMessage

```typescript
type ErrorMessageProps = {
  message: string
  onRetry?: () => void
  retryLabel?: string
}
```

## EmptyState

```typescript
type EmptyStateProps = {
  message: string
  icon?: ReactNode
  actionLabel?: string
  onAction?: () => void
}
```

## LikeButton

```typescript
type LikeButtonProps = {
  liked: boolean
  likeCount: number
  onLike: () => Promise<void>
  disabled?: boolean
}
```

## ReportButton

```typescript
type ReportButtonProps = {
  onReport: () => Promise<void>
  disabled?: boolean
  confirmMessage?: string
}
```

## LoadingContext

```typescript
type LoadingContextType = {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

type LoadingProviderProps = {
  children: ReactNode
}
```

## ScreenWrapper

```typescript
type ScreenWrapperProps = {
  children: ReactNode
}
```

## SideMenu

```typescript
type SideMenuProps = {
  items: NavigationItem[]
  activeIndex?: number
}

type NavigationItem = {
  icon: ReactNode
  label: string
  onClick: () => void
}
```

## BottomBar

```typescript
type BottomBarProps = {
  items: NavigationItem[]
  activeIndex?: number
}
```

## UserInfo

```typescript
type UserInfoProps = {
  name: string
  role: 'parent' | 'child'
  avatarUrl?: string
  onClick?: () => void
}
```

## QuestForm

```typescript
type QuestFormValues = {
  title: string
  description?: string
  reward?: number
  thumbnailUrl?: string
  dueDate?: Date
  category?: string
}

type QuestFormProps = {
  initialValues?: Partial<QuestFormValues>
  onSubmit: (values: QuestFormValues) => Promise<void>
  submitLabel?: string
}
```

## QuestDetail

```typescript
type QuestDetailProps = {
  quest: {
    id: string
    title: string
    description?: string
    status: QuestStatus
    reward?: number
    thumbnailUrl?: string
    createdAt: Date
    updatedAt?: Date
    dueDate?: Date
    category?: string
  }
  showActions?: boolean
}
```

## 共通型定義

### QuestStatus

```typescript
type QuestStatus = 
  | 'not_started'
  | 'in_progress'
  | 'pending_review'
  | 'completed'
  | 'rejected'
```

### MantineColor

```typescript
type MantineColor = 
  | 'blue'
  | 'red'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'gray'
  | 'pink'
  | 'teal'
  | 'cyan'
  | 'lime'
  | 'indigo'
  | 'violet'
  | 'grape'
  | string
```

## Props 命名規則

### DO

- ✅ `onClick`, `onChange`, `onSubmit` - イベントハンドラには `on` プレフィックス
- ✅ `isLoading`, `isDisabled` - 真偽値には `is` プレフィックス
- ✅ `leftSection`, `rightSection` - 位置を表す場合は `Section` サフィックス
- ✅ `children` - React要素を受け取る場合は `children`

### DON'T

- ❌ `clickHandler` - `onClick` を使用
- ❌ `loading` - `isLoading` を使用
- ❌ `leftElement` - `leftSection` を使用
- ❌ `content` - `children` を使用（React標準）
