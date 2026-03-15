(2026年3月記載)

# 構造分析パターン

## 概要

画面やAPIの構造分析における典型的なパターンと分析方法を定義する。

## 画面構造の分析パターン

### パターン1: 基本CRUD画面

**特徴**:
- 一覧、詳細、編集の3画面構成
- 標準的なディレクトリ構造
- QuestListLayout/QuestEditLayoutを使用

**ディレクトリ構造**:
```
{resource}/
├── page.tsx                    # 一覧画面エントリー
├── {Resource}Screen.tsx        # 一覧画面実装
├── [id]/
│   ├── page.tsx                # 編集画面エントリー
│   ├── {Resource}EditScreen.tsx # 編集画面実装
│   └── view/
│       ├── page.tsx            # 閲覧画面エントリー
│       └── {Resource}ViewScreen.tsx # 閲覧画面実装
├── new/
│   └── page.tsx                # 新規作成エントリー
└── _components/
    └── ...
```

**分析ポイント**:
1. 各Screen.tsxファイルの役割
2. 使用しているレイアウトコンポーネント
3. _components/配下のコンポーネント構成
4. API通信の有無（client.ts, query.ts）

**具体例**:
- 家族クエスト画面（`app/(app)/families/quests/`）
- 公開クエスト画面（`app/(app)/public-quests/`）
- テンプレートクエスト画面（`app/(app)/template-quests/`）

### パターン2: 閲覧専用画面

**特徴**:
- 編集機能なし
- 詳細表示のみ
- データ取得専用API

**ディレクトリ構造**:
```
{resource}/
├── page.tsx
├── {Resource}Screen.tsx
└── _components/
    └── ...
```

**分析ポイント**:
1. データ取得方法（SSR, CSR）
2. 表示専用コンポーネント
3. 更新処理の不在

**具体例**:
- タイムライン画面（`app/(app)/timeline/`）
- 通知一覧画面（`app/(app)/notifications/`）

### パターン3: 認証画面

**特徴**:
- (auth)配下に配置
- フォームバリデーション
- 認証APIとの連携

**ディレクトリ構造**:
```
(auth)/
└── login/
    ├── page.tsx
    ├── LoginScreen.tsx
    └── _components/
        └── LoginForm.tsx
```

**分析ポイント**:
1. 認証フロー
2. エラーハンドリング
3. リダイレクト処理

**具体例**:
- ログイン画面（`app/(auth)/login/`）

### パターン4: 子供向け画面

**特徴**:
- 子供専用の閲覧・操作画面
- 簡略化されたUI
- 親画面とは独立

**ディレクトリ構造**:
```
children/
└── quests/
    ├── page.tsx
    ├── ChildQuestsScreen.tsx
    └── [id]/
        └── view/
            └── ChildQuestViewScreen.tsx
```

**分析ポイント**:
1. 権限制御（子供のみアクセス可能）
2. UI/UXの簡略化
3. 親画面との関係性

**具体例**:
- 子供クエスト一覧（`app/(app)/children/quests/`）
- 子供報酬設定（`app/(app)/children/[id]/rewards/`）

### パターン5: 2ペイン画面

**特徴**:
- 左側に一覧、右側に詳細/編集
- 動的なペイン切り替え
- AppShell + SideMenu構造

**ディレクトリ構造**:
```
{resource}/
├── page.tsx
├── {Resource}Screen.tsx       # 2ペインレイアウト
├── _components/
│   ├── LeftPane.tsx
│   └── RightPane.tsx
└── ...
```

**分析ポイント**:
1. 状態管理（選択中のアイテム）
2. ペイン間の連携
3. モバイル対応（シングルペイン）

**具体例**:
- 家族メンバー一覧（`app/(app)/families/[id]/members/`）

## API構造の分析パターン

### パターン1: RESTful CRUD API

**特徴**:
- 標準的なREST設計
- HTTPメソッドに応じたCRUD操作
- 階層的なルーティング

**ディレクトリ構造**:
```
api/{resource}/
├── route.ts           # GET（一覧）、POST（作成）
├── client.ts          # クライアント関数
├── query.ts           # React Query フック
└── [id]/
    └── route.ts       # GET（詳細）、PUT（更新）、DELETE（削除）
```

**分析ポイント**:
1. HTTPメソッドの使い分け
2. クエリパラメータ
3. リクエスト/レスポンス型

**具体例**:
- 家族API（`app/api/families/`）
- 子供管理API（`app/api/children/`）

### パターン2: ネストされたリソースAPI

**特徴**:
- 親リソースに紐づく操作
- 複雑な階層構造
- 特定アクションのエンドポイント

**ディレクトリ構造**:
```
api/{parent-resource}/[parentId]/{child-resource}/
├── route.ts
└── [childId]/
    ├── {action}/
    │   └── route.ts
    └── ...
```

**分析ポイント**:
1. 親子関係の管理
2. 権限チェック（親IDの所有権）
3. トランザクション処理

**具体例**:
- 家族クエスト子供操作（`app/api/quests/family/[id]/child/[childId]/`）
- 子供報酬API（`app/api/children/[id]/rewards/`）

### パターン3: アクション専用API

**特徴**:
- 単一アクション実行
- POSTメソッドのみ
- 副作用を伴う操作

**ディレクトリ構造**:
```
api/{resource}/[id]/{action}/
└── route.ts           # POST のみ
```

**分析ポイント**:
1. 副作用の範囲
2. トランザクション境界
3. 通知・ログ記録

**具体例**:
- クエスト公開（`app/api/quests/family/[id]/publish/`）
- クエスト承認（`app/api/quests/family/[id]/child/[childId]/approve/`）

### パターン4: バッチ操作API

**特徴**:
- 複数リソースの一括操作
- 配列型のリクエストボディ
- トランザクション必須

**ディレクトリ構造**:
```
api/{resource}/batch/
└── route.ts           # POST（一括作成/更新/削除）
```

**分析ポイント**:
1. 一括処理のロジック
2. エラーハンドリング（部分成功の扱い）
3. パフォーマンス最適化

**具体例**:
- （現時点では実装なし、将来追加予定）

## 分析ワークフロー

### ステップ1: ディレクトリ構造の把握
スクリプトを実行してファイル一覧を取得：
```bash
bash scripts/generate_screen_structure.sh {path}
```

### ステップ2: パターンの識別
出力結果から該当するパターンを識別：
- ファイル名の規則性
- ディレクトリの階層構造
- 特定ファイルの有無

### ステップ3: 詳細分析
必要に応じて個別ファイルを読み込み：
- コンポーネントのProps定義
- API のリクエスト/レスポンス型
- ビジネスロジックの実装

### ステップ4: ドキュメント化
分析結果をスキルのreferences/配下に記録：
- 構造図（ER図、フロー図、シーケンス図）
- API仕様
- コンポーネントカタログ

## ベストプラクティス

### 効率的な分析
1. まずスクリプトで全体像を把握
2. パターンを識別して理解を深める
3. 必要な箇所のみ詳細分析

### ドキュメント保守
1. 構造変更時はスクリプトを再実行
2. パターンが変わったら分析パターンを更新
3. 新しいパターンが見つかったらこのファイルに追記

### トークン効率化
1. 繰り返し分析はスクリプトに任せる
2. 詳細な実装はreferences/に記録
3. SKILL.mdは簡潔に保つ
