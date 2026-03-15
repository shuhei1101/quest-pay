---
name: schema-relations
description: テーブル間リレーションの知識を提供するスキル。外部キー、リレーション定義を含む。
---

# テーブル間リレーション スキル

## 概要

このスキルは、データベーステーブル間のリレーション設計、外部キー制約、カスケードルール、インデックス戦略の知識を提供します。Drizzle ORMを使用した型安全なリレーション定義を含みます。

## メインソースファイル

### スキーマ定義
- `drizzle/schema.ts`: 全テーブル定義、外部キー制約、インデックス、リレーション定義

### マイグレーション
- `supabase/migrations/`: SQLマイグレーションファイル

## 主要機能グループ

### 1. 外部キー制約
- users → profiles (1:1)
- families → family_quests (1:N)
- family_quests → family_quest_details (1:N)
- public_quests → public_quest_likes (1:N)
- 循環参照の回避、複合外部キー

### 2. カスケードルール
- CASCADE: 親削除時に子も削除（家族→クエスト）
- RESTRICT: 子が存在する場合、親削除不可（カテゴリー）
- SET NULL: 親削除時、子の外部キーをnullに（報酬テーブル）
- NO ACTION: デフォルト動作

### 3. インデックス戦略
- Primary Key: 主キー（自動インデックス）
- Unique Index: 一意制約 + 高速検索
- Index: 検索速度向上
- Composite Index: 複数カラムの組み合わせ検索

### 4. Drizzle Relations
- one(): 1対1、N対1のリレーション
- many(): 1対Nのリレーション
- クエリの簡略化、型安全なデータ取得

## Reference Files Usage

### 外部キー制約の詳細を確認する場合
主要な外部キー定義、1:1/1:N/N:1の実装パターン、unique制約との組み合わせを確認：
```
references/foreign_keys.md
```

### カスケードルールを理解する場合
CASCADE/RESTRICT/SET NULL/NO ACTIONの動作、選択基準、実装パターンを確認：
```
references/cascade_rules.md
```

### インデックス戦略を設計する場合
インデックスの種類、主要テーブルのインデックス設計、複合インデックスの順序、パフォーマンス分析を確認：
```
references/index_strategy.md
```

## クイックスタート

1. **外部キー理解**: `references/foreign_keys.md`でリレーション定義確認
2. **カスケードルール選択**: `references/cascade_rules.md`で削除動作設計
3. **インデックス設計**: `references/index_strategy.md`でパフォーマンス最適化
4. **実装**: schema.tsに外部キー、カスケードルール、インデックスを定義

## 実装上の注意点

### 必須パターン
- **外部キー**: すべてのリレーションで外部キー制約を定義
- **カスケードルール**: 削除時の動作を明示的に指定（onDelete）
- **インデックス**: 外部キーカラムには必ずインデックスを作成
- **Drizzle Relations**: クエリ簡略化のためにrelationsを定義

### カスケードルールの選択基準
- **CASCADE**: 子が親なしで意味を持たない（家族クエスト、コメント）
- **RESTRICT**: マスターデータ保護（カテゴリー、アイコン）
- **SET NULL**: 履歴データ保持（報酬履歴）
- **NO ACTION**: 特別な制御不要

### インデックス設計の原則
- WHERE句で頻繁に使用されるカラム
- JOIN句で使用されるカラム
- ORDER BY句で使用されるカラム
- 複合インデックスは等価比較を先に配置

### リレーション定義（Drizzle）
- 外部キー制約とは別にrelationsを定義
- クエリ時にWITH句を自動生成
- 型安全なデータ取得を実現

### 避けるべきパターン
- 循環参照の外部キー
- すべてのカラムへのインデックス
- カーディナリティが低いカラムへのインデックス
- 重複する複合インデックス
