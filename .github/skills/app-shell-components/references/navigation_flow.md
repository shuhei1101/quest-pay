# ナビゲーションフロー

**作成日: 2026年3月記載**

## 概要

AppShellのナビゲーションは、ユーザーロール（親/子供）、デバイスタイプ（デスクトップ/モバイル）、ゲストユーザー状態に応じて動的に変化します。

---

## ナビゲーション構成

### 1. 共通ナビゲーション（親・子供）

#### ホーム
- **URL**: `/`（HOME_URL）
- **アイコン**: IconHome2
- **色**: menuColors.home
- **表示**: 全ユーザー

#### クエスト（親展開メニュー）
- **親の場合**: サブメニュー展開
  - 公開クエスト: `/quests/family?tab=public`
  - 家族クエスト: `/quests/family?tab=family`
  - お気に入り: `/quests/family?tab=template`
- **子供の場合**: クエストメニュー項目のみ（サブメニューなし）

#### 設定
- **サブメニュー展開**:
  - 全般設定: `/settings`（SETTINGS_URL）
  - お小遣い設定: `/rewards/view`（親のみ、REWARD_URL）
- **アイコン**: IconSettings
- **色**: menuColors.settings
- **表示**: 全ユーザー

#### カラーパレット
- **機能**: ダーク/ライトモード切替
- **コンポーネント**: ThemeToggleButton
- **表示**: 全ユーザー

#### 通知
- **表示条件**: !isGuest
- **未読バッジ**: 未読数表示（赤バッジ）
- **アイコン**: IconBell
- **機能**: NotificationModal表示
- **表示**: ゲスト以外

#### ログアウト
- **表示条件**: !isGuest
- **アイコン**: IconLogout
- **機能**: Supabase認証のサインアウト + ログイン画面遷移
- **フィードバック**: "サインアウトしました"メッセージ
- **表示**: ゲスト以外

#### モック（開発用）
- **URL**: `/test`（TEST_URL）
- **アイコン**: IconSettings
- **表示**: 全ユーザー（開発・デバッグ用）

---

### 2. 親専用ナビゲーション

#### メンバー
- **URL**: `/families/members`（FAMILY_MEMBERS_URL）
- **アイコン**: IconUsers
- **色**: menuColors.members
- **表示**: isParent === true

#### クエスト > 公開
- **URL**: `/quests/family?tab=public`
- **アイコン**: IconWorld
- **色**: menuColors.publicQuest
- **表示**: isParent === true

#### クエスト > 家族
- **URL**: `/quests/family?tab=family`
- **アイコン**: IconHome2
- **色**: menuColors.familyQuest
- **表示**: isParent === true

#### クエスト > お気に入り
- **URL**: `/quests/family?tab=template`
- **アイコン**: IconClipboardPlus
- **色**: menuColors.favoriteQuest
- **表示**: isParent === true

#### 設定 > お小遣い設定
- **URL**: `/rewards/view`
- **アイコン**: IconCoin
- **色**: menuColors.settings
- **表示**: isParent === true

---

### 3. 子供のナビゲーション

子供ユーザーは以下のメニューのみ表示：
- ホーム
- クエスト（サブメニューなし）
- 設定 > 全般設定
- カラーパレット
- 通知
- ログアウト
- モック

---

## デバイス別ナビゲーション

### デスクトップ（> 600px）

#### 通常モード（opened=true, 240px幅）
```
┌─────────────────────────┐
│ [アプリアイコン] クエストペイ [≡] │  ← ヘッダー
├─────────────────────────┤
│ [👤] 家族名              │  ← プロフィールカード
│      ユーザー名           │
├─────────────────────────┤
│ [🏠] ホーム              │
├─────────────────────────┤
│ [📋] クエスト ▼          │  ← 親のみ展開
│   [🌐] 公開              │
│   [🏠] 家族              │
│   [📋+] お気に入り       │
├─────────────────────────┤
│ [👥] メンバー            │  ← 親のみ
├─────────────────────────┤
│ [⚙️] 設定 ▼              │
│   [⚙️] 全般              │
│   [💰] お小遣い設定       │  ← 親のみ
├─────────────────────────┤
│ [🎨] カラーパレット       │
│ [🔔] 通知 (3)            │  ← 未読バッジ
│ [🚪] ログアウト          │
└─────────────────────────┘
```

#### ミニモード（opened=false, 60px幅）
```
┌───┐
│ ≡ │  ← トグルボタン
├───┤
│ 🏠│  ← ホーム
│ 📋│  ← クエスト
│ 👥│  ← メンバー（親のみ）
│ ⚙️ │  ← 設定
├───┤
│ 🎨│  ← テーマ切替
│ 🔔│  ← 通知
│ 🚪│  ← ログアウト
└───┘
```

---

### モバイル（≤ 600px）

#### BottomBar（画面下部固定）
```
┌────────────────────────────────┐
│  [🏠]  [📋]  [👥]  [≡]        │
│ ホーム クエスト メンバー メニュー  │
└────────────────────────────────┘
```

#### NavigationFAB（右下フローティング）
```
展開時:
┌────┐
│ 🏠 │ ホーム
├────┤
│ 📋 │ クエスト
├────┤
│ 👥 │ メンバー（親のみ）
├────┤
│ 🔔 │ 通知 (3)  ← 未読バッジ
├────┤
│ [▼]│  ← 折りたたみボタン
└────┘

折りたたみ時:
┌────┐
│ [▲]│  ← 展開ボタン
└────┘
```

#### ドロワーメニュー
- **表示**: BottomBarの[≡]アイコンクリック
- **内容**: デスクトップの通常モードと同じフルメニュー
- **アニメーション**: 左からスライドイン

---

## ロール判定ロジック

### useLoginUserInfo フック
```typescript
const { 
  isParent,    // 親ユーザーかどうか
  isGuest,     // ゲストユーザーかどうか
  userInfo,    // ユーザー情報
  isLoading    // ローディング状態
} = useLoginUserInfo()
```

### 親判定の実装
```typescript
{isParent && (
  <NavLink
    href={`${FAMILY_MEMBERS_URL}`}
    label="メンバー"
    leftSection={<IconUsers />}
  />
)}
```

### ゲスト判定の実装
```typescript
{!isGuest && (
  <NavLink
    onClick={handleLogout}
    label="ログアウト"
    leftSection={<IconLogout />}
  />
)}
```

---

## ルート処理

### Next.js Router
```typescript
import { useRouter } from 'next/navigation'
const router = useRouter()

// ナビゲーション
router.push(HOME_URL)
```

### エンドポイント定義
すべてのURLは `app/(core)/endpoints.ts` で一元管理

```typescript
export const HOME_URL = "/"
export const FAMILY_QUESTS_URL = "/quests/family"
export const FAMILY_MEMBERS_URL = "/families/members"
export const SETTINGS_URL = "/settings"
export const REWARD_URL = "/rewards"
export const LOGIN_URL = "/auth/login"
export const TEST_URL = "/test"
```

### パラメータ付きURL
```typescript
// クエストタブ切替
`${FAMILY_QUESTS_URL}?tab=public`
`${FAMILY_QUESTS_URL}?tab=family`
`${FAMILY_QUESTS_URL}?tab=template`

// 家族詳細
FAMILY_VIEW_URL(userInfo?.families?.id || '')
```

---

## 状態管理

### メニュー開閉状態
```typescript
// Mantine UIのuseDisclosureフック
const [opened, { toggle, close }] = useDisclosure()

// 開閉トグル
toggle()

// 強制的に閉じる
close()
```

### 通知モーダル状態
```typescript
const [isNotificationOpen, setIsNotificationOpen] = useState(false)

// モーダル表示
setIsNotificationOpen(true)

// モーダル非表示
setIsNotificationOpen(false)
```

### FAB状態管理
```typescript
const { openFab, closeFab, isOpen } = useFABContext()

// NavigationFAB開く（SubMenuFAB閉じる）
openFab("navigation-fab")
closeFab("submenu-fab")

// 状態確認
isOpen("navigation-fab")  // boolean
```

---

## アクティブ状態管理

### pathName判定
```typescript
import { usePathname } from 'next/navigation'
const pathname = usePathname()

// アクティブナビゲーションインデックス判定
const getActiveNavigationIndex = () => {
  if (isParent && pathname.startsWith(FAMILY_MEMBERS_URL)) return 2  // メンバー
  if (pathname.startsWith(QUESTS_URL)) return 1                       // クエスト
  return 0                                                            // ホーム
}
```

### Mantine NavLinkのアクティブスタイル
```typescript
<NavLink
  href={`${HOME_URL}`}
  label="ホーム"
  // 現在のURLと一致すると自動でactive状態になる
/>
```

---

## 画面遷移時の処理

### 画面遷移時FAB制御
```typescript
useEffect(() => {
  if (isMobile) {
    openFab("navigation-fab")    // NavigationFAB開く
    closeFab("submenu-fab")      // SubMenuFAB閉じる
  }
}, [pathname, isMobile, openFab, closeFab])
```

### ログアウト処理
```typescript
const handleLogout = async () => {
  try {
    // Supabase認証のサインアウト
    await createClient().auth.signOut()
    
    // フィードバックメッセージ登録
    appStorage.feedbackMessage.set({ 
      message: "サインアウトしました", 
      type: "success" 
    })
    
    // ログイン画面へ遷移
    router.push(`${LOGIN_URL}`)
  } catch (error) {
    console.error('ログアウトエラー:', error)
    appStorage.feedbackMessage.set({ 
      message: "ログアウトに失敗しました", 
      type: "error" 
    })
  }
}
```

---

## 通知バッジ

### 未読数計算
```typescript
const { notifications } = useNotifications()
const unreadCount = notifications.filter(n => !n.isRead).length
```

### バッジ表示
```typescript
<Indicator 
  label={unreadCount > 0 ? unreadCount : null}
  size={16} 
  color="red" 
  disabled={unreadCount === 0}
  inline
>
  <IconBell size={18} stroke={1.2} />
</Indicator>
```

---

## スクロール連動ナビゲーション

### スクロール検知
```typescript
const lastScrollY = useRef(0)

const handleScroll = () => {
  const currentScrollY = window.scrollY

  // トップ位置: FAB展開
  if (currentScrollY === 0) {
    openFab("navigation-fab")
  } 
  // 下スクロール（50px以上）: FAB閉じる
  else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
    closeFab("navigation-fab")
    closeFab("submenu-fab")
  }

  lastScrollY.current = currentScrollY
}

window.addEventListener('scroll', handleScroll, { passive: true })
```

---

## 注意事項

1. **ロール判定**: isParentは必ずチェック（親専用メニューの表示制御）
2. **ゲスト判定**: isGuestはログアウトと通知の表示制御に必須
3. **URL定義**: endpoints.tsの定数を使用（直接文字列記述は禁止）
4. **FAB競合**: NavigationFABとSubMenuFABは排他制御
5. **未読バッジ**: 未読がない場合はバッジ非表示（disabled={unreadCount === 0}）
6. **モバイル判定**: isMobileフラグで表示切り替え
7. **画面遷移**: router.pushを使用（<Link>は使用しない）
8. **スクロール最適化**: passive: trueでパフォーマンス向上
