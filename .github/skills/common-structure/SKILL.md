---
name: common-structure
description: 画面構造の自動生成とAPI構造説明を提供するスキル。スクリプトによる効率的な構造分析を実行。
---

# Common Structure スキル

## 概要

画面やAPIの構造を自動的に分析・生成するスキル。繰り返しパターンをスクリプト化して効率化。

## 使用方法

### 画面構造の生成

画面のファイル構成、コンポーネント、フックを自動的に分析：

```bash
bash scripts/generate_screen_structure.sh <screen-path>
```

**例:**
```bash
bash .github/skills/common-structure/scripts/generate_screen_structure.sh app/(app)/families
```

**出力内容:**
- ファイル一覧
- コンポーネント構造
- フック一覧
- API エンドポイント

### API構造の生成

APIエンドポイントの構造を自動的に分析：

```bash
bash scripts/generate_api_structure.sh <api-path>
```

## スクリプトの利点

- **トークン効率化**: 構造分析コードをコンテキストにロードせずに実行
- **一貫性**: 同じフォーマットで構造を出力
- **速度**: 繰り返し作業を自動化

## 既存スキルとの統合

このスキルは以下の冗長なスキルを統合：
- `*-structure` スキル群（画面構造の記述）
- `*-list`スキル群（一覧画面の記述）
- `*-view`スキル群（閲覧画面の記述）

構造情報は動的に生成されるため、スキルファイルを手動で更新する必要がなくなる。
