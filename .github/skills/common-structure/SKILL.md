---
name: common-structure
description: 画面構造の自動生成とAPI構造説明を提供するスキル。スクリプトによる効率的な構造分析を実行。
---

# Common Structure スキル

## 概要

このスキルは、画面やAPIの構造を自動的に分析・生成するためのスクリプト群を提供する。繰り返しパターンをスクリプト化してトークン効率化と一貫性を実現。

## メインスクリプト

### 画面構造分析
- `scripts/generate_screen_structure.sh`: 画面のファイル構成、コンポーネント、フックを自動分析

### API構造分析
- `scripts/generate_api_structure.sh`: APIエンドポイントの構造を自動分析

## 主要機能グループ

### 1. 画面構造の自動生成
ファイル一覧、コンポーネント構造、フック一覧、APIエンドポイント

### 2. API構造の自動生成
エンドポイント一覧、動的ルート構造、クライアントファイル

### 3. 出力フォーマット標準化
一貫したMarkdown形式での構造出力

## Reference Files Usage

### スクリプトの使用方法を確認する場合
コマンド例、引数、出力内容を確認：
```
references/script_usage.md
```

### 出力フォーマットを理解する場合
出力される各セクションの詳細仕様を確認：
```
references/output_format.md
```

### 構造分析パターンを把握する場合
画面タイプ別、APIタイプ別の分析パターンを確認：
```
references/analysis_patterns.md
```

## クイックスタート

1. **画面構造の分析**:
   ```bash
   bash .github/skills/common-structure/scripts/generate_screen_structure.sh app/(app)/families
   ```

2. **API構造の分析**:
   ```bash
   bash .github/skills/common-structure/scripts/generate_api_structure.sh app/api/quests/family
   ```

3. **出力の活用**: 生成された構造情報をスキル作成や機能改修に利用

## 実装上の注意点

### スクリプトの利点
- **トークン効率化**: 構造分析コードをコンテキストにロードせずに実行
- **一貫性**: 同じフォーマットで構造を出力
- **速度**: 繰り返し作業を自動化
- **最新性**: 常に最新のファイル構成を反映

### 使用タイミング
- 画面やAPIの全体像を把握したい時
- スキルを作成・更新する時
- 機能改修前に現在の構造を確認したい時
- ドキュメント生成が必要な時

### 既存スキルとの統合
このスキルは以下の冗長なスキルを統合：
- `*-structure` スキル群（画面構造の記述）
- `*-list`スキル群（一覧画面の記述）
- `*-view`スキル群（閲覧画面の記述）

構造情報は動的に生成されるため、スキルファイルを手動で更新する必要がなくなる。
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


