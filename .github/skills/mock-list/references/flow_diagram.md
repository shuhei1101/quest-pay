# Mock List - Flow Diagram

**記載日**: 2026年3月

## 概要

このドキュメントは、テスト一覧画面のユーザーフローとインタラクションを図解します。

## ページアクセスフロー

```
ユーザー: /test にアクセス
    ↓
MockListPage コンポーネント読み込み
    ↓
useRouter() 初期化
    ↓
mockItems 配列の定義
    ├── 各モックの情報を配列に格納
    │   ├── title: "モック名"
    │   ├── description: "説明"
    │   ├── url: エンドポイントURL
    │   ├── icon: Tablerアイコン
    │   └── badge: "UI" | "Integration" | "Test"
    └── 配列が完成
    ↓
UIレンダリング
    ├── ヘッダーセクション表示
    │   ├── タイトル: "モック画面一覧"
    │   └── 説明: "UI/UX検証、プロトタイピング用..."
    └── SimpleGrid レンダリング
        └── mockItems.map() で各カード生成
    ↓
画面表示完了
```

## カードインタラクションフロー

```
ユーザー: カードにマウスホバー
    ↓
CSS transition発動
    ├── shadow: sm → md
    └── トランジション効果適用
    ↓
視覚的フィードバック表示
```

```
ユーザー: カードをクリック
    ↓
onClick イベント発火
    ↓
router.push(item.url) 実行
    ↓
Next.js クライアントサイドルーティング
    ↓
モック画面へ遷移
    ├── 単一パターンモック → 直接コンテンツ表示
    └── タブ型モック → バリエーション選択画面
```

## データフロー

```
endpoints.ts
    ├── TEST_FAMILY_PROFILE_MOCK_URL
    ├── TEST_SETTINGS_MOCK_URL
    ├── TEST_STRIPE_TEST_URL
    ├── TEST_ERROR_UNKNOWN_URL
    └── TEST_SIDE_MENU_URL
    ↓
    ↓ (import)
    ↓
test/page.tsx
    ├── MockItem type定義
    └── mockItems配列
        ├── {title, description, url, icon, badge}
        ├── {title, description, url, icon, badge}
        └── ...
    ↓
    ↓ (rendering)
    ↓
UI表示
    └── カード一覧
```

## 新規モック追加フロー

```
開発者: 新しいモックを追加
    ↓
Step 1: モックページ作成
    └── test/<mock-name>/page.tsx
    ↓
Step 2: エンドポイント定義
    └── endpoints.ts に TEST_<MOCK_NAME>_URL 追加
    ↓
Step 3: test/page.tsx を更新
    ├── インポート追加
    │   ├── import { IconNewIcon } from "@tabler/icons-react"
    │   └── import { TEST_NEW_MOCK_URL } from "@/app/(core)/endpoints"
    └── mockItems配列に新規アイテム追加
        └── {
              title: "新しいモック",
              description: "説明",
              url: TEST_NEW_MOCK_URL,
              icon: <IconNewIcon size={32} />,
              badge: "UI"
            }
    ↓
Step 4: 検証
    ├── /test にアクセス
    ├── 新しいカードが表示されることを確認
    └── カードクリックで画面遷移を確認
    ↓
完了
```

## レスポンシブ動作フロー

```
画面サイズ変更
    ↓
SimpleGrid のブレークポイント判定
    ↓
    ├── base (< sm): 1列レイアウト
    │   └── カードが縦に積み重なる
    │
    ├── sm (≥ 640px): 2列レイアウト
    │   └── カードが2列に並ぶ
    │
    └── md (≥ 768px): 3列レイアウト
        └── カードが3列に並ぶ
    ↓
レイアウト再計算
    ↓
画面再描画
```

## カードレンダリングフロー

```
mockItems.map((item) => ...)
    ↓
各mockItemについて
    ↓
Card コンポーネント生成
    ├── key={item.url} (一意性保証)
    ├── onClick={() => router.push(item.url)}
    └── プロパティ設定
        ├── shadow="sm"
        ├── padding="lg"
        ├── radius="md"
        ├── withBorder
        └── className="..."
    ↓
Card 内部構造レンダリング
    ├── Group (ヘッダー)
    │   ├── Icon表示
    │   │   └── <div className="text-blue-600">{item.icon}</div>
    │   └── Badge表示（条件付き）
    │       └── {item.badge && <Badge>...</Badge>}
    ├── Title表示
    │   └── <Text fw={500} size="lg">{item.title}</Text>
    └── Description表示
        └── <Text size="sm" c="dimmed">{item.description}</Text>
    ↓
カード完成
```

## バッジ表示ロジック

```
item.badge の値を評価
    ↓
    ├── undefined → バッジ非表示
    │   └── Groupにアイコンのみ表示
    │
    └── 値あり → バッジ表示
        ├── "UI" → 青色バッジ "UI"
        ├── "Integration" → 青色バッジ "Integration"
        └── "Test" → 青色バッジ "Test"
    ↓
Groupの右側に配置
```

## エラーハンドリング

```
モック画面遷移時
    ↓
    ├── 正常 → モック画面表示
    │
    └── エラー → Next.js エラーバウンダリ
        ├── error.tsx が呼ばれる
        └── エラー画面表示
```

## パフォーマンス最適化フロー

```
ページ読み込み
    ↓
静的データ使用
    ├── mockItems は静的配列
    ├── API呼び出しなし
    └── 外部データ依存なし
    ↓
高速レンダリング
    ↓
ユーザーインタラクション
    ↓
クライアントサイドルーティング
    ├── ページリロードなし
    └── 即座に遷移
    ↓
高速なユーザー体験
```

## 典型的な使用シナリオ

### シナリオ1: 既存モックの確認

```
1. ユーザー: /test にアクセス
    ↓
2. モック一覧が表示される
    ↓
3. "家族プロフィールモック" カードを見つける
    ↓
4. カードをクリック
    ↓
5. TEST_FAMILY_PROFILE_MOCK_URL へ遷移
    ↓
6. 家族プロフィールモック画面が表示
    ↓
7. UI/UX確認
    ↓
8. ブラウザバックで一覧に戻る
```

### シナリオ2: 新しいモックの探索

```
1. 開発者: 新しいサイドメニューモックを追加
    ↓
2. test/side-menu-mock/page.tsx 作成
    ↓
3. endpoints.ts に TEST_SIDE_MENU_URL 追加
    ↓
4. test/page.tsx に新規アイテム追加
    {
      title: "サイドメニュー",
      description: "サイドメニューのデザインバリエーション（4つ）",
      url: TEST_SIDE_MENU_URL,
      icon: <IconMenu2 size={32} />,
      badge: "UI"
    }
    ↓
5. /test にアクセス
    ↓
6. 新しい "サイドメニュー" カードが表示される
    ↓
7. カードクリック
    ↓
8. サイドメニューモック画面表示
    ↓
9. 4つのバリエーションをタブで切り替え
    ↓
10. 最適なデザインを選択
```

### シナリオ3: バッジによるフィルタリング（将来機能）

```
1. ユーザー: /test にアクセス
    ↓
2. バッジフィルタを選択（将来実装）
    ├── "UI" のみ表示
    ├── "Integration" のみ表示
    └── "Test" のみ表示
    ↓
3. フィルタ適用
    ↓
4. 該当するモックのみ表示
    ↓
5. 目的のモックを効率的に探索
```

## 状態管理

### 現在の状態

```
MockListPage コンポーネント
    └── useRouter() のみ使用
        └── ナビゲーション用

静的データ
    └── mockItems 配列（定数）
        └── 状態変更なし
```

### 将来の拡張候補

```
useState() の追加可能性
    ├── フィルタリング
    │   └── 選択されたバッジタイプ
    ├── ソート
    │   └── 名前順、作成日順など
    └── 検索
        └── モック名の絞り込み
```

## ナビゲーション整合性

```
テスト一覧ページ (test/page.tsx)
    ↓
    ├── mockItems[0].url → /test/family-profile-mock
    ├── mockItems[1].url → /test/settings-mock
    ├── mockItems[2].url → /test/stripe-test
    ├── mockItems[3].url → /test/error-unknown
    └── mockItems[4].url → /test/side-menu-mock
    ↓
各モックページ
    ├── test/family-profile-mock/page.tsx
    ├── test/settings-mock/page.tsx
    ├── test/stripe-test/page.tsx
    ├── test/error-unknown/page.tsx
    └── test/side-menu-mock/page.tsx
```

確認事項:
- endpoints.ts のURL定義が存在すること
- モックページディレクトリが存在すること
- URL path が一致していること
