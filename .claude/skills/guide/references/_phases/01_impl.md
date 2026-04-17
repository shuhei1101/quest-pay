# フェーズ詳細: 実装・改修

SKILL.md の「フロー A」の詳細ワークフロー。

## 機能選択（A-1）の表示形式

```
どの機能の実装を行いますか？

【機能系】
  home / login / family / family-member / family-quest /
  child-management / child-quest / child-reward /
  public-quest / quest-edit / quest-list / quest-view /
  template-quest / comment / notification / reward / timeline / settings

【コア系】
  common-components / app-shell / mock /
  database / schema / endpoints / environment / error / logger /
  test-data-generator

番号または名前で選択してください（複数可）:
```

## 作業種別（A-3）の推定ロジック

サブエージェントに以下を渡して推定させる:
- ユーザーの実装内容テキスト
- 選択された機能のリファレンスファイル

推定する種別:
1. 画面新規実装
2. 画面改修
3. API追加/変更/削除
4. DBスキーマ変更
5. E2Eテスト追加/変更

## 実装フェーズの実行順序

種別に応じて以下の順で実行（該当するものだけ）:

1. **Phase DB** — DBスキーマ変更がある場合
2. **Phase API** — API追加/変更がある場合
3. **Phase Mock** — 画面新規実装 & Mockを作る場合
4. **Phase 画面** — 画面新規/改修がある場合
5. **Phase E2E後処理** — E2E関連がある場合

## Mockページについて

要件確認（A-4）の最後の選択肢でMockを選んだ場合、または
ユーザーが最初から「Mock作って」と言っていた場合（確認不要）は
Phase MockをPhase 画面より前に実行する。

## サブエージェント利用の判断基準

以下のいずれかに該当する場合、サブエージェントの使用をユーザーに提案:
- 3つ以上の機能にまたがる実装
- 複数のPhaseが全て必要な複雑な実装
- AIが「コンテキストが肥大化する」と判断した場合
