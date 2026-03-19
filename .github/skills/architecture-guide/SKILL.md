---
name: architecture-guide
description: This skill should be used when implementing new features, understanding the project structure, or navigating the Quest Pay codebase. It provides architectural patterns, module responsibilities, and file organization guidelines. Trigger Keywords: アーキテクチャ、プロジェクト構造、コードベースナビゲーション、モジュール構成、設計パターン、他の画面
---

# Architecture Guide

## 概要

このスキルは、お小遣いクエストボードプロジェクトのアーキテクチャと設計パターンを説明する。新機能の実装やコードベースの理解に必要な情報を提供する。

## メインソースファイル

### アプリケーション概要
- **app-overview.md**: アプリケーション概要とドメイン知識
- **file-paths.md**: よく使うファイルパスの一覧

### アーキテクチャドキュメント
- **フロント**: `packages/web/app/(app)/`
- **API**: `packages/web/app/api/`
- **コア機能**: `packages/web/app/(core)/`
- **DBスキーマ**: `packages/web/drizzle/schema.ts`

## 主要アーキテクチャパターン

### 1. レイヤードアーキテクチャ
- page.tsx → XxxScreen.tsx → XxxLayout.tsx
- client.ts → route.ts → service.ts → query.ts/db.ts

### 2. モジュール責務
- **フロント**: 画面、レイアウト、フック
- **バック**: APIルート、ビジネスロジック、DB操作
- **共通**: コンポーネント、ユーティリティ

### 3. ファイル構成
- 機能ごとにディレクトリを分割
- APIとフロントは対応する構造
- 共通機能は`(core)`に配置

## Reference Files Usage

### レイヤードアーキテクチャを理解する場合
フロント3層構成、API設計、フックパターンを確認：
```
references/layered_architecture.md
```

### モジュール責務を把握する場合
各コンポーネントの役割、ローディング管理、ファイル構成を確認：
```
references/module_responsibilities.md
```

### ファイル構成を確認する場合
ディレクトリ構造、命名規則、配置ルールを確認：
```
references/file_organization.md
```

## クイックスタート

1. **全体像の把握**: `references/layered_architecture.md`でアーキテクチャ確認
2. **モジュール理解**: `references/module_responsibilities.md`で各モジュールの役割確認
3. **実装時**: `references/file_organization.md`でファイル配置確認

## 実装上の注意点

### 必須パターン
- **page.tsx + XxxScreen.tsx + XxxLayout.tsx**: 画面の3層構成
- **client.ts + route.ts**: APIの必須セット
- **ScreenWrapper**: すべての画面で使用
- **LoadingButton**: 画面遷移時のローディング管理

### ファイル配置
- **共通コンポーネント**: `app/(core)/_components/`
- **画面固有**: 各画面の`_components/`
- **仮ファイル**: `tmp/`ディレクトリ

### 命名規則
- **画面**: `XxxScreen.tsx`, `XxxLayout.tsx`
- **API**: `client.ts`, `route.ts`, `service.ts`, `query.ts`, `db.ts`
- **フック**: `useXxx.ts`

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## References

- [app-overview.md](references/app-overview.md): アプリケーション概要とドメイン知識
- [file-paths.md](references/file-paths.md): よく使うファイルパスの一覧
