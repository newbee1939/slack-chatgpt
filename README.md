# slack-chatgpt
実際に作りながら、
0. [x] Slack BotをBoltで開発した
  - https://zenn.dev/peg/articles/a3597550a61006
1. [x] Bolt の概要（ドキュメント）
  - https://slack.dev/java-slack-sdk/guides/ja/bolt-basics
2. [] Boltを使ったSlack BotをTypescriptで開発する方法（基本的にはこれを参考にするで良さそう）
  - https://qiita.com/winuim/items/5db662622bbc84ecf92a
3. [] Slack API入門 -Boltを使ってSlack アプリを開発する
  - https://tech-blog.rakus.co.jp/entry/20210514/api
4. [] Bolt フレームワークを使って Slack Bot を作ろう
  - https://api.slack.com/lang/ja-jp/hello-world-bolt
5. [] GCP CloudRunにSlack Bolt(TypeScriptで)を導入してSlackBotを作成する
  - https://zenn.dev/ryurock/articles/qiita-20200727-b54d6fa40fb5e7f486ee
6. [] OpenAIの言語モデル、GPT-3を社内Slackに導入したら捗りすぎてやばい
  - https://zenn.dev/nickel/articles/9c5b8cd56e76c0
  - AIに前提知識を伝える、 prompt プロパティが重要です。この prompt で、うまく値を設定することで、弊社のおぷたんは対話形式で質問することも可能にしています
7. [] ChatGPTに「ChatGPTに質問出来るslack botのtypescriptのコードを書いて下さい」とリクエストしてみた件
  - https://note.com/yoshihiko_k/n/na3181e9d1581
8. [] ChatGPTに以下の質問
  - 「BoltとTypeScriptを使って、ChatGPTの回答結果を返すSlack Botを作る方法を教えてください」
9. [] Bolt for JavaScrip
  - https://github.com/slackapi/bolt-js
10. [x] Slackアプリをまずは作る必要がある
  - https://slack.dev/bolt-js/ja-jp/tutorial/getting-started
11. Bolt フレームワークを使って Slack Bot を作ろう(公式のチュートリアル)
  - https://api.slack.com/lang/ja-jp/hello-world-bolt
  - イベントの設定方法はこちらにある
12. GPT-3 APIの利用申請から承認まで
  - https://qiita.com/nissan_lab/items/8d0a887b6d32881d6d80
13. OpenAIの公式ドキュメント
  - https://beta.openai.com/docs/introduction/overview
  - この辺でリクエストの作り方学べそう
    - https://beta.openai.com/docs/api-reference/introduction

# 学びメモ
- ngrokのインストールと起動
  - dockerのngrokだと内部の通信しかできない？？わからんけど
  - 普通にMacにインストール 
    - 手順:https://ngrok.com/download
    - ngrok configの設定:https://dashboard.ngrok.com/get-started/setup
- イベント発生時に、Slackサーバーからペイロードを受け取るには、イベントのサブスクリプションの設定が必要 
  - Slack ワークスペースで発生するイベント (メッセージが投稿されたときや、メッセージに対するリアクションが投稿されたときなど) をリッスンするには、Events API を使用してイベントタイプに登録します。
- Glitchでnode.jsのバージョンを変更する方法
  - https://help.glitch.com/kb/article/59-can-i-change-the-version-of-node-js-my-project-uses/  
- GlitchのURL（エンドポイント）をSlackに設定
  - https://techblog.cartaholdings.co.jp/entry/archives/3864
- GlitchでGitHubからコードをimportする
  - https://help-glitch-com.translate.goog/kb/article/20-importing-code-from-github/?_x_tr_sl=en&_x_tr_tl=ja&_x_tr_hl=ja&_x_tr_pto=sc
- OpenAI APIの始め方
  - npm install openai
  - 以下のページからAPIキーを取得
    - https://beta.openai.com/account/api-keys
  - 全てのHTTPリクエストのHEADに以下のようにキーを含ませる必要がある
    - Authorization: Bearer YOUR_API_KEY
  - リクエストの例
    - curlの場合
      - curl https://api.openai.com/v1/models -H 'Authorization: Bearer YOUR_API_KEY'
    - Node.jsの場合
      - `import { Configuration, OpenAIApi } from "openai";
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.listEngines();`
  - 細かいリクエストの作り方はこちらに
    - https://beta.openai.com/docs/api-reference/making-requests
  - promptとかの設定方法はこちらを見たら分かる
    - https://github.com/openai/openai-node

# 使用技術(個人開発の際は、一つは使ったことない技術を組み込む)(それぞれのデプロイ方法を記事にまとめる)
- Slack Bolt(フレームワーク)
- Node.js
- TypeScript
- JavaScript
- Docker(ngrokを使ったローカル開発環境)
- Cloud Run(Cloud Run Jobs)(デプロイ先)
  - Cloud Run Jobsとか、Cloud RunのAlways on CPUとか記事にまとめたい
- ngrok(ローカル開発環境)
  - 参考：https://www.engilaboo.com/ngrok-docker/
- Glitch(デプロイ先)
  - ngrokと同じようなもの？
    - サクッと記事にまとめたい
  - なぜかうまくいかないので一旦スキップ。。（リポジトリimportのところが動かない。。） 
  - https://glitch.com/dashboard
- Vercel(デプロイ先)
- GitHub Actionsでそれぞれの環境に自動デプロイ出来るようにする
  - 最新のものを取り込む
- Jest
  - テストもちゃんと書きたい
- その他

# その他
- サンプルテスト用Slcakチャンネル
  - https://app.slack.com/client/T04E9JJ0VC7/C04EHGWSKQW
- サンプル用Slack App
  - https://api.slack.com/apps/A04EM70BXQD
  - xoxbから始まるトークンとかはこれ
    - https://api.slack.com/apps/A04EM70BXQD/oauth?success=1
- Tokenがきちんと使えるのか確認する方法
  - https://zenn.dev/apo_zenn/articles/855ab0a46eb815
- 対象のGitリポジトリのURL
  - https://github.com/newbee1939/slack-chatgpt.git
- Event Subscriptionsの設定
  - https://api.slack.com/apps/A04EM70BXQD/event-subscriptions?

# TODO
- とりあえずGlitchを連携させて、Slackでメッセージを送ったときにシンプルなメッセージを返答するようにしたい（いまここ！）
- GPT-3を組み込んでみる
- 会社に導入を提案してみたい
  - 社員の生産性はかなり上がりそう
  - 使わない理由がない
- 全ての工程を自動化する
  - できればngrokもDockerにしたい
- 色々触ってみて理解を深める