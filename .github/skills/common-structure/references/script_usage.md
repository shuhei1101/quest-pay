(2026年3月記載)

# スクリプト使用ガイド

## 概要

common-structureスキルは2つの主要スクリプトを提供し、画面やAPIの構造を自動分析する。

## スクリプト一覧

### 1. generate_screen_structure.sh

**目的**: 画面のファイル構成、コンポーネント、フックを自動的に分析・出力

**使用方法**:
```bash
bash .github/skills/common-structure/scripts/generate_screen_structure.sh <screen-path>
```

**引数**:
- `<screen-path>`: 分析対象の画面ディレクトリパス（packages/web/からの相対パス）

**使用例**:
```bash
# 家族一覧画面の構造を分析
bash .github/skills/common-structure/scripts/generate_screen_structure.sh app/(app)/families

# ログイン画面の構造を分析
bash .github/skills/common-structure/scripts/generate_screen_structure.sh app/(auth)/login

# 子供クエスト画面の構造を分析
bash .github/skills/common-structure/scripts/generate_screen_structure.sh app/(app)/children/quests
```

**出力内容**:
1. ファイル構成一覧（.tsx, .ts）
2. メインファイル（page.tsx, Screen.tsx）
3. コンポーネント一覧（_components/）
4. フック一覧（_hooks/）
5. API クライアント（client.ts）
6. React Query フック（query.ts）

**出力形式**:
```markdown
# 画面構造: app/(app)/families

## ファイル構成
```
app/(app)/families/page.tsx
app/(app)/families/FamiliesScreen.tsx
app/(app)/families/_components/FamilyCard.tsx
app/(app)/families/_hooks/useFamilies.ts
```

## メインファイル
- `app/(app)/families/page.tsx`: ページエントリーポイント
- `app/(app)/families/FamiliesScreen.tsx`: メイン画面実装

## コンポーネント
- `app/(app)/families/_components/FamilyCard.tsx`: FamilyCard コンポーネント
...
```

### 2. generate_api_structure.sh

**目的**: API エンドポイントの構造を自動的に分析・出力

**使用方法**:
```bash
bash .github/skills/common-structure/scripts/generate_api_structure.sh <api-path>
```

**引数**:
- `<api-path>`: 分析対象のAPIディレクトリパス（packages/web/からの相対パス）

**使用例**:
```bash
# 家族クエストAPIの構造を分析
bash .github/skills/common-structure/scripts/generate_api_structure.sh app/api/quests/family

# 通知APIの構造を分析
bash .github/skills/common-structure/scripts/generate_api_structure.sh app/api/notifications

# 子供管理APIの構造を分析
bash .github/skills/common-structure/scripts/generate_api_structure.sh app/api/children
```

**出力内容**:
1. API ルートファイル一覧（route.ts）
2. 動的ルート構造（[id]/）
3. クライアントファイル（client.ts）
4. React Query フック（query.ts）

**出力形式**:
```markdown
# API構造: app/api/quests/family

## ファイル構成
```
app/api/quests/family/route.ts
app/api/quests/family/client.ts
app/api/quests/family/query.ts
app/api/quests/family/[id]/route.ts
app/api/quests/family/[id]/publish/route.ts
...
```

## エンドポイント
- `app/api/quests/family/route.ts`: GET（一覧）、POST（作成）
- `app/api/quests/family/[id]/route.ts`: GET（詳細）、PUT（更新）、DELETE（削除）
...
```

## スクリプトの実行環境

### 前提条件
- bash 4.0以上
- find, grep, sed コマンド利用可能
- プロジェクトルートからの実行を推奨

### エラーハンドリング
- ディレクトリが存在しない場合はエラーメッセージを表示して終了
- 引数が不足している場合は使用方法を表示

## ベストプラクティス

### いつスクリプトを使うべきか
- 画面やAPIの全体像を把握したい時
- スキルを作成・更新する時
- 機能改修前に現在の構造を確認したい時
- ドキュメント生成が必要な時

### スクリプトの利点
1. **トークン効率化**: 構造分析コードをコンテキストにロードせずに実行
2. **一貫性**: 同じフォーマットで構造を出力
3. **速度**: 繰り返し作業を自動化
4. **最新性**: 常に最新のファイル構成を反映

### 手動分析が必要な場合
- コンポーネントの内部実装詳細を確認する時
- 特定の関数やロジックを理解する時
- バグの原因を調査する時
- コードレビューを行う時
