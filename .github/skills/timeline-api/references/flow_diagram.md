(2026年3月記載)

# タイムライン生成フロー図

## クエスト完了からタイムライン投稿までのフロー

```mermaid
flowchart TD
    Start([子供がクエスト完了]) --> QuestComplete[quest_children<br/>status: pending_review]
    QuestComplete --> ParentReview{親が確認}
    
    ParentReview -->|承認| Approve[status: completed]
    ParentReview -->|却下| Reject[status: in_progress]
    
    Reject --> End1([タイムライン投稿なし])
    
    Approve --> CheckLevel{クエストのレベル}
    
    CheckLevel -->|最終レベル| QuestCleared[クエストクリア]
    CheckLevel -->|途中レベル| LevelComplete[レベル完了]
    
    LevelComplete --> CreateTimeline1[familyTimelines作成<br/>type: quest_completed]
    QuestCleared --> CreateTimeline2[familyTimelines作成<br/>type: quest_cleared]
    
    CreateTimeline1 --> CheckMilestone{マイルストーン達成?}
    CreateTimeline2 --> CheckMilestone
    
    CheckMilestone -->|10回, 50回, 100回...| CreateMilestone[familyTimelines作成<br/>type: quest_milestone_reached]
    CheckMilestone -->|該当なし| End2([完了])
    
    CreateMilestone --> End2
    
    style Start fill:#e1f5e1
    style End1 fill:#ffe1e1
    style End2 fill:#e1f5e1
    style Approve fill:#c3e6cb
    style Reject fill:#f5c6cb
    style QuestCleared fill:#b8daff
```

## 報酬受け取りからタイムライン投稿までのフロー

```mermaid
flowchart TD
    Start([報酬付与]) --> RewardGiven[reward_histories作成]
    RewardGiven --> UpdateSavings[children.current_savings更新]
    
    UpdateSavings --> CreateTimeline[familyTimelines作成<br/>type: reward_received]
    
    CreateTimeline --> CheckSavings{貯金額マイルストーン?}
    
    CheckSavings -->|100円, 500円, 1000円...| CreateMilestone[familyTimelines作成<br/>type: savings_milestone_reached]
    CheckSavings -->|該当なし| End([完了])
    
    CreateMilestone --> End
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
```

## クエスト公開から公開タイムライン投稿までのフロー

```mermaid
flowchart TD
    Start([親がクエスト公開]) --> PublishQuest[public_quests作成<br/>is_activate: true]
    
    PublishQuest --> CheckFirstPost{初回投稿?}
    
    CheckFirstPost -->|初投稿| CreateFirstPost[publicTimelines作成<br/>type: posts_milestone_reached<br/>message: 初めて公開]
    CheckFirstPost -->|2回目以降| CreatePost[publicTimelines作成<br/>type: quest_published]
    
    CreateFirstPost --> End([完了])
    CreatePost --> CheckMilestone{投稿数マイルストーン?}
    
    CheckMilestone -->|10, 50, 100...| CreateMilestone[publicTimelines作成<br/>type: posts_milestone_reached]
    CheckMilestone -->|該当なし| End
    
    CreateMilestone --> End
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
```

## いいね受け取りから公開タイムライン投稿までのフロー

```mermaid
flowchart TD
    Start([公開クエストに<br/>いいね受信]) --> UpdateLike[public_quest_likes更新]
    
    UpdateLike --> CountLikes[いいね数カウント]
    
    CountLikes --> CheckLikeMilestone{マイルストーン達成?}
    
    CheckLikeMilestone -->|初回, 10, 50, 100...| CreateMilestone[publicTimelines作成<br/>type: likes_milestone_reached]
    CheckLikeMilestone -->|該当なし| End([完了])
    
    CreateMilestone --> End
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
```

## タイムラインフィード集約フロー

```mermaid
flowchart TD
    Start([フィード取得リクエスト]) --> CheckType{タイムラインタイプ}
    
    CheckType -->|家族タイムライン| FetchFamily[familyTimelines取得<br/>WHERE family_id = :familyId]
    CheckType -->|公開タイムライン| FetchPublic[publicTimelines取得<br/>全家族対象]
    
    FetchFamily --> JoinProfiles1[profiles, families<br/>JOIN取得]
    FetchPublic --> JoinFamilies[families<br/>JOIN取得]
    
    JoinProfiles1 --> Sort1[created_at DESC<br/>並び替え]
    JoinFamilies --> Sort2[created_at DESC<br/>並び替え]
    
    Sort1 --> Return1([タイムライン配列返却])
    Sort2 --> Return2([タイムライン配列返却])
    
    style Start fill:#e1f5e1
    style Return1 fill:#b8daff
    style Return2 fill:#b8daff
```

## アクティビティ種別による投稿パターン

### 即時投稿型

- クエスト作成
- クエスト完了
- クエストクリア
- 報酬受け取り
- 家族メンバー参加

### 条件付き投稿型（マイルストーン）

- クエスト達成回数（10, 50, 100, 500...）
- 貯金額（100円, 500円, 1000円, 5000円...）
- いいね数（初回, 10, 50, 100, 500...）
- 投稿数（初回, 10, 50, 100, 500...）
