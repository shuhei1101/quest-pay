# テンプレートクエスト ER図

(2026年3月15日 14:30記載)

## テーブル構造

```mermaid
erDiagram
    template_quests ||--o{ template_quest_details : "has"
    
    template_quests {
        uuid id PK
        text title "クエストタイトル"
        text description "クエスト説明"
        text category "カテゴリー"
        integer difficulty "難易度(1-5)"
        integer estimated_minutes "推定所要時間"
        text[] tags "タグ配列"
        boolean is_active "有効フラグ"
        timestamp created_at
        timestamp updated_at
    }
    
    template_quest_details {
        uuid id PK
        uuid template_quest_id FK "テンプレートID"
        integer level "レベル(1-10)"
        text detail_description "レベル別詳細説明"
        integer reward_amount_min "最小報酬額"
        integer reward_amount_max "最大報酬額"
        integer experience_points "経験値"
        timestamp created_at
        timestamp updated_at
    }
```

## テーブル説明

### template_quests
システムが提供するクエストテンプレート本体。管理者のみが作成・編集可能。

**主要カラム**:
- `title`: クエスト名（例: "お部屋の片付け", "宿題サポート"）
- `category`: カテゴリー（例: "家事", "勉強", "お手伝い"）
- `difficulty`: 難易度レベル（1=簡単、5=難しい）
- `is_active`: 表示制御フラグ（falseの場合は非表示）

### template_quest_details
テンプレートのレベル別詳細設定。子供のレベルに応じた報酬と経験値を定義。

**主要カラム**:
- `level`: 子供のレベル（1-10）
- `reward_amount_min` / `reward_amount_max`: 報酬の範囲
- `experience_points`: このレベルでの獲得経験値

## リレーション特徴

- **読み取り専用**: ユーザーはテンプレートの閲覧のみ可能
- **採用時の動作**: テンプレートから family_quests へコピー
- **レベル対応**: 子供のレベルに応じた適切な詳細を選択

## 採用先テーブル（参照）

テンプレートが採用される際の遷移先：
- `template_quests` → `family_quests`（基本情報コピー）
- `template_quest_details` → `family_quest_details`（レベル対応詳細コピー）
