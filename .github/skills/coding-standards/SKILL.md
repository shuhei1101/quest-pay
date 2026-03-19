---
name: coding-standards
description: This skill should be used when writing or reviewing TypeScript, React, or Next.js code for the Quest Pay project. It provides coding conventions including style rules, naming conventions, comment formats, and preferred language constructs. Trigger Keywords: コーディングスタイル、TypeScript規約、Reactスタイルガイド、コードレビュー基準、命名規則
---

# Coding Standards

## 概要

このスキルは、お小遣いクエストボードプロジェクトにおけるコーディング規約を定義する。コードの一貫性を保つため、すべてのコード作成とレビュー時に適用すること。

## メインソースファイル

### コード
- **TypeScript**: `packages/web/app/`
- **React/Next.js**: `packages/web/app/(app)/`, `packages/web/app/(core)/`
- **Entity定義**: `packages/web/drizzle/entity.ts`

### 規約関連
- **ESLint設定**: `packages/web/eslint.config.mjs`
- **TypeScript設定**: `packages/web/tsconfig.json`

## 主要規約

### 1. 基本方針
- 言語は日本語、セミコロン禁止、YAGNI原則

### 2. 型定義
- `type`を優先、`entity.ts`の型を参照

### 3. 関数とコンポーネント
- `const`を使用、Props はインライン

### 4. コメント
- 関数は「~する」形式、JSXは細かくコメント

### 5. 命名規則
- 画面: `XxxView`, `XxxEdit`
- 関数: camelCase、イベントハンドラは`handle`プレフィックス

## Reference Files Usage

### スタイルルールを確認する場合
基本方針、型定義、関数・コンポーネント定義、フォーマットを確認：
```
references/style_rules.md
```

### 命名規則を確認する場合
コンポーネント、ファイル、変数、関数、API、データベースの命名を確認：
```
references/naming_conventions.md
```

### ベストプラクティスを確認する場合
コメント規則、JSX、エラーハンドリング、パフォーマンス、依存関係を確認：
```
references/best_practices.md
```

## クイックスタート

1. **基本ルール確認**: `references/style_rules.md`でスタイル確認
2. **命名確認**: `references/naming_conventions.md`で命名ルール確認
3. **実装時**: `references/best_practices.md`でベストプラクティス確認

## 実装上の注意点

### 必須パターン
- **日本語**: すべてのコメント、PR、WIP
- **セミコロン禁止**: 文末に`;`をつけない
- **YAGNI**: 不要な分割や共通化を避ける
- **entity.ts参照**: DB関連の型は必ずentity.tsから参照

### コンポーネントパターン
- **const使用**: `function`ではなく`const`
- **インラインProps**: 理由がない限りProps型を分離しない
- **ScreenWrapper**: すべての画面で使用

### コメントパターン
- **関数**: 「~する」形式
- **JSX**: 細かくコメント、コードの横には書かない

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## 共通コンポーネント

### 配置場所
- 共通コンポーネントは`app/(core)/_components/`以下に配置すること

### 利用可能な共通コンポーネント
- **共通タブ**: `ScrollableTabs`を使用すること
export const QuestView = () => { /* ... */ }

// 編集画面
export const QuestEdit = () => { /* ... */ }
```

## 共通コンポーネント

### 配置場所
- 共通コンポーネントは`app/(core)/_components/`以下に配置すること

### 利用可能な共通コンポーネント
- **共通タブ**: `ScrollableTabs`を使用すること
