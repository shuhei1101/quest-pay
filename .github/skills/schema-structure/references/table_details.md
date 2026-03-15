(2026年3月記載)

# テーブル詳細定義

## ファイル構成

### メインスキーマファイル
- `drizzle/schema.ts`: すべてのテーブル定義

## Enum型定義

### user_type
ユーザータイプ
- `parent`: 親
- `child`: 子供

### child_quest_status
子供クエストのステータス
- `not_started`: 未着手
- `in_progress`: 進行中
- `pending_review`: 報告中（親の承認待ち）
- `completed`: 完了

### notification_type
通知タイプ
- `family_quest_review`: 家族クエスト承認依頼
- `quest_report_rejected`: クエスト報告却下
- `quest_report_approved`: クエスト報告承認
- `quest_cleared`: クエストクリア
- `quest_level_up`: クエストレベルアップ
- `quest_completed`: クエスト完了
- `other`: その他

### reward_type
報酬タイプ
- `quest`: クエスト報酬
- `age_monthly`: お小遣い（年齢別定期報酬）
- `level_monthly`: レベル別定期報酬
- `other`: その他

### family_timeline_action_type
家族タイムラインのアクションタイプ
- `quest_created`: クエスト作成
- `quest_completed`: クエスト完了
- `quest_cleared`: クエストクリア
- `quest_level_up`: クエストレベルアップ
- `child_joined`: 子供が参加
- `parent_joined`: 親が参加
- `reward_received`: 報酬受け取り
- `savings_updated`: 貯金額更新
- `savings_milestone_reached`: 貯金額マイルストーン達成
- `quest_milestone_reached`: クエスト達成マイルストーン
- `comment_posted`: コメント投稿
- `other`: その他

### public_timeline_action_type
公開タイムラインのアクションタイプ
- `quest_published`: クエスト公開
- `likes_milestone_reached`: いいね数マイルストーン達成
- `posts_milestone_reached`: 投稿数マイルストーン達成
- `comments_milestone_reached`: コメント数マイルストーン達成
- `comment_posted`: コメント投稿
- `like_received`: いいね受け取り
- `other`: その他

## 認証・プロフィール系テーブル

### auth.users
Supabase認証ユーザー（authスキーマ）

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL | ユーザーID |

**関連**:
- `profiles.user_id` (1対1)

### profiles
ユーザープロフィール

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | プロフィールID |
| user_id | uuid | UNIQUE, FK → auth.users.id ON DELETE CASCADE | ユーザーID |
| name | text | NOT NULL | プロフィール名 |
| birthday | date | | 生年月日 |
| family_id | uuid | NOT NULL, FK → families.id ON DELETE RESTRICT | 家族ID |
| icon_id | integer | NOT NULL, FK → icons.id ON DELETE RESTRICT | アイコンID |
| icon_color | text | NOT NULL | アイコンカラー（HEX） |
| type | user_type | NOT NULL | ユーザータイプ（parent/child） |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**関連**:
- `auth.users` (多対1)
- `families` (多対1)
- `icons` (多対1)
- `parents` (1対0..1)
- `children` (1対0..1)

### parents
親ユーザー拡張情報

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 親ID |
| profile_id | uuid | UNIQUE, NOT NULL, FK → profiles.id ON DELETE CASCADE | プロフィールID |

**関連**:
- `profiles` (1対1)

### children
子供ユーザー拡張情報

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 子供ID |
| profile_id | uuid | UNIQUE, NOT NULL, FK → profiles.id ON DELETE CASCADE | プロフィールID |
| total_earned | integer | NOT NULL, DEFAULT 0 | 累計獲得金額 |
| total_savings | integer | NOT NULL, DEFAULT 0 | 総貯金額 |
| level | integer | NOT NULL, DEFAULT 1 | レベル |
| exp | integer | NOT NULL, DEFAULT 0 | 経験値 |

**関連**:
- `profiles` (1対1)
- `child_quests` (1対多)
- `reward_history` (1対多)

## 家族系テーブル

### families
家族グループ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 家族ID |
| display_id | text | NOT NULL, UNIQUE | 表示用ID |
| local_name | text | NOT NULL | ローカル名（家族内での名前） |
| online_name | text | | オンライン名（公開時の名前） |
| introduction | text | NOT NULL, DEFAULT '' | 紹介文 |
| icon_id | integer | NOT NULL, FK → icons.id ON DELETE RESTRICT | アイコンID |
| icon_color | text | NOT NULL | アイコンカラー（HEX） |
| invite_code | text | NOT NULL, DEFAULT '', UNIQUE | 招待コード |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**関連**:
- `profiles` (1対多)
- `family_quests` (1対多)
- `reward_tables` (1対多)
- `timeline_posts` (1対多)

## アイコン系テーブル

### icon_categories
アイコンカテゴリマスター

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | integer | PK, GENERATED ALWAYS AS IDENTITY | カテゴリID |
| name | text | NOT NULL, DEFAULT '', UNIQUE | カテゴリ名 |
| icon_name | text | NOT NULL, DEFAULT '' | 代表アイコン名 |
| icon_size | integer | | アイコンサイズ |
| sort_order | integer | NOT NULL, DEFAULT 999 | 表示順 |

**関連**:
- `icons` (1対多)

### icons
アイコンマスター

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | integer | PK, GENERATED ALWAYS AS IDENTITY | アイコンID |
| name | text | NOT NULL, DEFAULT '', UNIQUE | アイコン名 |
| category_id | integer | FK → icon_categories.id ON DELETE RESTRICT | カテゴリID |
| size | integer | | アイコンサイズ |

**関連**:
- `icon_categories` (多対1)
- `families` (1対多)
- `profiles` (1対多)
- `family_quests` (1対多)
- `template_quests` (1対多)

## クエスト関連テーブル

### quest_categories
クエストカテゴリマスター

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | integer | PK, GENERATED ALWAYS AS IDENTITY | カテゴリID |
| name | text | NOT NULL, DEFAULT '', UNIQUE | カテゴリ名 |
| icon_name | text | NOT NULL, DEFAULT '', UNIQUE | アイコン名 |
| icon_size | integer | | アイコンサイズ |
| sort_order | integer | NOT NULL, DEFAULT 999 | 表示順 |

**関連**:
- `family_quests` (1対多)
- `template_quests` (1対多)

### family_quests
家族クエスト

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | クエストID |
| family_id | uuid | NOT NULL, FK → families.id ON DELETE RESTRICT | 家族ID |
| parent_id | uuid | NOT NULL, FK → parents.id ON DELETE RESTRICT | 作成した親ID |
| title | text | NOT NULL | タイトル |
| description | text | NOT NULL, DEFAULT '' | 説明 |
| category_id | integer | FK → quest_categories.id ON DELETE RESTRICT | カテゴリID |
| icon_id | integer | FK → icons.id ON DELETE RESTRICT | アイコンID |
| icon_color | text | NOT NULL | アイコンカラー（HEX） |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**関連**:
- `families` (多対1)
- `parents` (多対1)
- `quest_categories` (多対1)
- `icons` (多対1)
- `family_quest_details` (1対多)
- `child_quests` (1対多、間接）
- `public_quests` (1対0..1)

### family_quest_details
家族クエストレベル詳細

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 詳細ID |
| family_quest_id | uuid | NOT NULL, FK → family_quests.id ON DELETE CASCADE | 家族クエストID |
| level | integer | NOT NULL | レベル |
| reward | integer | NOT NULL | 報酬額 |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**関連**:
- `family_quests` (多対1)
- `child_quests` (1対多)

### child_quests
子供クエスト（受注情報）

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 子供クエストID |
| child_id | uuid | NOT NULL, FK → children.id ON DELETE CASCADE | 子供ID |
| family_quest_detail_id | uuid | NOT NULL, FK → family_quest_details.id ON DELETE CASCADE | 家族クエスト詳細ID |
| status | child_quest_status | NOT NULL, DEFAULT 'not_started' | ステータス |
| started_at | timestamp | | 開始日時 |
| completed_at | timestamp | | 完了日時 |
| reported_at | timestamp | | 報告日時 |
| reviewed_at | timestamp | | 承認/却下日時 |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**関連**:
- `children` (多対1)
- `family_quest_details` (多対1)

### public_quests
公開クエスト

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 公開クエストID |
| family_quest_id | uuid | UNIQUE, NOT NULL, FK → family_quests.id ON DELETE CASCADE | 家族クエストID |
| family_id | uuid | NOT NULL, FK → families.id ON DELETE RESTRICT | 家族ID |
| is_active | boolean | NOT NULL, DEFAULT true | 公開中フラグ |
| total_likes | integer | NOT NULL, DEFAULT 0 | 総いいね数 |
| total_comments | integer | NOT NULL, DEFAULT 0 | 総コメント数 |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 公開日時 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**関連**:
- `family_quests` (1対1)
- `families` (多対1)
- `public_quest_likes` (1対多)
- `public_quest_comments` (1対多)

### template_quests
テンプレートクエスト

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | テンプレートID |
| title | text | NOT NULL | タイトル |
| description | text | NOT NULL, DEFAULT '' | 説明 |
| category_id | integer | FK → quest_categories.id ON DELETE RESTRICT | カテゴリID |
| icon_id | integer | FK → icons.id ON DELETE RESTRICT | アイコンID |
| icon_color | text | NOT NULL | アイコンカラー（HEX） |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**関連**:
- `quest_categories` (多対1)
- `icons` (多対1)
- `template_quest_details` (1対多)

### template_quest_details
テンプレートクエストレベル詳細

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 詳細ID |
| template_quest_id | uuid | NOT NULL, FK → template_quests.id ON DELETE CASCADE | テンプレートID |
| level | integer | NOT NULL | レベル |
| reward | integer | NOT NULL | 報酬額 |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**関連**:
- `template_quests` (多対1)

## コメント・いいね系テーブル

### public_quest_likes
公開クエストいいね

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | いいねID |
| public_quest_id | uuid | NOT NULL, FK → public_quests.id ON DELETE CASCADE | 公開クエストID |
| profile_id | uuid | NOT NULL, FK → profiles.id ON DELETE CASCADE | プロフィールID |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | いいね日時 |

**関連**:
- `public_quests` (多対1)
- `profiles` (多対1)

### public_quest_comments
公開クエストコメント

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | コメントID |
| public_quest_id | uuid | NOT NULL, FK → public_quests.id ON DELETE CASCADE | 公開クエストID |
| profile_id | uuid | NOT NULL, FK → profiles.id ON DELETE CASCADE | プロフィールID |
| content | text | NOT NULL | コメント内容 |
| upvotes | integer | NOT NULL, DEFAULT 0 | 高評価数 |
| downvotes | integer | NOT NULL, DEFAULT 0 | 低評価数 |
| is_pinned | boolean | NOT NULL, DEFAULT false | ピン留めフラグ |
| is_publisher_liked | boolean | NOT NULL, DEFAULT false | 投稿者いいねフラグ |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 投稿日時 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**関連**:
- `public_quests` (多対1)
- `profiles` (多対1)
- `comment_votes` (1対多)

### comment_votes
コメント投票

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 投票ID |
| comment_id | uuid | NOT NULL, FK → public_quest_comments.id ON DELETE CASCADE | コメントID |
| profile_id | uuid | NOT NULL, FK → profiles.id ON DELETE CASCADE | プロフィールID |
| vote | integer | NOT NULL | 投票値（1: 高評価, -1: 低評価） |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 投票日時 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**関連**:
- `public_quest_comments` (多対1)
- `profiles` (多対1)

## 報酬系テーブル

### reward_tables
報酬テーブル（レベル別報酬設定）

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 報酬テーブルID |
| family_id | uuid | NOT NULL, FK → families.id ON DELETE CASCADE | 家族ID |
| level | integer | NOT NULL | レベル |
| reward | integer | NOT NULL | 報酬額 |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 作成日時 |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() | 更新日時 |

**関連**:
- `families` (多対1)

### reward_history
報酬履歴

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 履歴ID |
| child_id | uuid | NOT NULL, FK → children.id ON DELETE CASCADE | 子供ID |
| reward_type | reward_type | NOT NULL | 報酬タイプ |
| amount | integer | NOT NULL | 金額 |
| source_id | uuid | | 報酬元ID（クエストIDなど） |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 受け取り日時 |

**関連**:
- `children` (多対1)

## 通知・タイムライン系テーブル

### notifications
通知

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 通知ID |
| profile_id | uuid | NOT NULL, FK → profiles.id ON DELETE CASCADE | プロフィールID |
| notification_type | notification_type | NOT NULL | 通知タイプ |
| title | text | NOT NULL | タイトル |
| message | text | NOT NULL | メッセージ |
| link | text | | リンク先 |
| is_read | boolean | NOT NULL, DEFAULT false | 既読フラグ |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 通知日時 |

**関連**:
- `profiles` (多対1)

### timeline_posts
タイムライン投稿

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | 投稿ID |
| family_id | uuid | NOT NULL, FK → families.id ON DELETE CASCADE | 家族ID |
| profile_id | uuid | FK → profiles.id ON DELETE CASCADE | プロフィールID（投稿者） |
| action_type | family_timeline_action_type | NOT NULL | アクションタイプ |
| content | text | NOT NULL | 投稿内容 |
| metadata | text | | メタデータ（JSON） |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | 投稿日時 |

**関連**:
- `families` (多対1)
- `profiles` (多対1)

## 共通要素

### timestamps
すべてのテーブルに含まれる共通タイムスタンプ：
- `created_at`: 作成日時（自動設定）
- `updated_at`: 更新日時（自動設定）

### UUID生成
主キーのUUID生成には`gen_random_uuid()`を使用。
