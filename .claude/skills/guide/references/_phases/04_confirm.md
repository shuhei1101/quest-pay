# フェーズ詳細: 確認

SKILL.md の「フロー E」の詳細ワークフロー。

## 機能選択（E-1）の表示形式

```
何の仕様を確認しますか?

【機能系】
  home / login / family / family-member / family-quest /
  child-management / child-quest / child-reward /
  public-quest / quest-edit / quest-list / quest-view /
  template-quest / comment / notification / reward / timeline / settings

【コア系】
  common-components / app-shell / mock /
  database / schema / endpoints / environment / error / logger /
  test-data-generator
```

## 確認内容（E-2）

機能を選択後、何を確認したいか直接入力してもらう。
例:
- 「このAPIのレスポンス型を知りたい」
- 「どのフックを使えばいいか」
- 「DBのテーブル構造を確認したい」

選択した機能のリファレンスファイルを読み込み、質問に答える。

## 複数機能にまたがる質問

複数の機能に関係する場合は、サブエージェントで各リファレンスを読み込み
統合した回答をメインに返す（ユーザーへの確認が必要）。
