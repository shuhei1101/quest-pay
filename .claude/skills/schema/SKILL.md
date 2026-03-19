---
name: schema
description: 'データベーススキーマの知識を提供するスキル。全テーブル定義・リレーション・外部キー制約・インデックスを含む。'
---

# データベーススキーマ スキル

## 概要

Quest Pay プロジェクトのデータベース構造（テーブル定義・リレーション・制約）の知識を提供する。

## スキーマファイル

- `packages/web/drizzle/schema.ts`: 全テーブル定義・Enum型・リレーション

## 主要テーブル一覧

### 認証・ユーザー
| テーブル | 説明 |
|---------|------|
| `auth.users` | Supabase 認証ユーザー（自動管理） |
| `profiles` | 全ユーザー共通プロフィール（auth.users と 1:1） |
| `parents` | 親ユーザー情報 |
| `children` | 子供ユーザー情報 |

### 家族
| テーブル | 説明 |
|---------|------|
| `families` | 家族情報（displayId・アイコン・家紋） |
| `family_members` | 家族メンバー（家族 × プロフィール） |
| `family_follows` | 家族フォロー関係 |

### クエスト
| テーブル | 説明 |
|---------|------|
| `family_quests` | 家族クエスト |
| `family_quest_details` | クエスト詳細（レベル・報酬・経験値） |
| `child_quests` | 子供クエスト（家族クエストの子供割り当て） |
| `public_quests` | 公開クエスト |
| `public_quest_comments` | 公開クエストコメント |
| `template_quests` | テンプレートクエスト（読み取り専用） |

### 報酬・履歴
| テーブル | 説明 |
|---------|------|
| `reward_histories` | 報酬付与・支払い履歴 |
| `age_reward_tables` | 年齢別報酬テーブル（家族/子供共有） |
| `level_reward_tables` | レベル別報酬テーブル（家族/子供共有） |

### タイムライン・通知
| テーブル | 説明 |
|---------|------|
| `family_timelines` | 家族タイムライン |
| `public_timelines` | 公開タイムライン |
| `notifications` | 通知 |

## 主要 Enum 型

```typescript
// ユーザータイプ
user_type: ["parent", "child"]

// クエストタイプ
quest_type: ["template", "public", "family"]

// 子供クエストステータス
child_quest_status: ["not_started", "in_progress", "pending_review", "completed"]

// 通知タイプ
notification_type: ["family_quest_review", "quest_report_approved", "quest_report_rejected", "quest_report_cleared", "level_up", "quest_completed"]

// 報酬タイプ
reward_type: ["quest", "age_monthly", "level_monthly", "other"]

// タイムラインアクションタイプ (family)
family_timeline_action_type: ["quest_created", "quest_completed", "quest_cleared", "quest_level_up", "child_joined", "parent_joined", "reward_received", "savings_updated", "savings_milestone_reached", "quest_milestone_reached", "comment_posted", "other"]

// タイムラインアクションタイプ (public)
public_timeline_action_type: ["quest_published", "likes_milestone_reached", "posts_milestone_reached", "comments_milestone_reached", "comment_posted", "like_received", "other"]
```

## リレーション設計原則

- **CASCADE 削除**: 親レコード削除時に子レコードも削除（例: family 削除 → family_members 削除）
- **RESTRICT**: 参照先が存在する間は削除不可
- **SET NULL**: 参照先削除時に NULL にセット
- Drizzle ORM: `relations()` で `one()` / `many()` を定義

## インデックス戦略

- 外部キーカラムには必ずインデックスを作成
- 頻繁に検索されるカラム（`status`, `created_at`）にインデックス
- 複合インデックスは JOIN やフィルター条件に合わせて設計

## 実装上の注意点

- `schema.ts` の最新状態を常に参照すること
- `drizzle/schema.ts` の Enum 値を必ず正確に使用
- マイグレーションは `drizzle-kit` で管理（`drizzle/` ディレクトリ）
