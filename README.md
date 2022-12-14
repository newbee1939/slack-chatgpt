# slack-chatgpt

Slack ワークスペースからのメッセージを listen して、対応する OpenAI GPT-3 からの回答を応答するアプリ

## ローカル開発の手順

1. Slack アプリの作成

- https://api.slack.com/apps
  - Create New App から

2. Basic Information の Signing Secret(重要な認証情報)を控えておく

- https://api.slack.com/apps/A04EM70BXQD

3. OAuth & Permissions のボットトークン(xoxb-)を控えておく

- https://api.slack.com/apps/A04EM70BXQD/oauth?
  - Slack アプリは、OAuth を使用して、Slack の API へのアクセスを管理する
  - トークンを使って、アプリは API メソッドを呼び出すことができる

4. Add an OAuth Scope で許可する処理を指定する

- https://api.slack.com/apps/A04EM70BXQD/oauth?
- 以下を追加する(必要になったら追加する)
  - app_mentions:read
  - chat:write

5. 以下のページから OpenAI のキーを取得して控えておく

- https://beta.openai.com/account/api-keys

6. アプリ用のディレクトリ作成

- mkdir slack-chatgpt
- cd slack-chatgpt

7. npm init

- 新しいプロジェクトを初期化
- package.json の作成

8. .env に以下の値を追加する

- SLACK_SIGNING_SECRET=
- SLACK_BOT_TOKEN=
- OPENAI_API_KEY=

9. 必要なパッケージをインストールする

- npm install @slack/bolt
- npm install openai

10. 細かい設定の追加

- package.json の scripts
- tsconfig.json
  - など

11. app.ts に Slack Bot の処理を追加

- 今回だと、GPT-3 の API を叩いて結果を取得する

12. Build してアプリを立ち上げる

- npm run start

12. ngrok をインストールしてローカル確認ができるように

- 手順:https://ngrok.com/download

13. ngrok を listen する

- ngrok http 8080
  - PORT はアプリの PORT に合わせる

13. Slack App のイベントの設定

- 設定ページ
  - https://api.slack.com/apps/A04EM70BXQD/event-subscriptions?
- 参考:https://slack.dev/bolt-js/ja-jp/tutorial/getting-started-http
- Event Subscription の Enable Events のスイッチをオンにする
- RequestURL に ngrok の URL（Forwarding の所の URL）を追加する
  - 最後に /slack/events を付ける
    - ex. https://112e-2001-318-2103-434-ac3d-882a-1a89-8e7c.jp.ngrok.io/slack/events

14. これでローカルで開発・検証ができるようになるはず

- Slack からメッセージを送れば返すようになる

## Cloud Run にデプロイする手順

### 手動デプロイ

1. gcloud コマンドが使えるようにしておく

- Docker の構成等も必要

2. Dockerfile 作成
3. アプリ image の build と push

- gcloud builds submit --project sample-328713 --tag gcr.io/sample-328713/slack-chatgpt-2
- 一時的に.gitignore から.env を外しておく

4. Cloud Run へのデプロイ

- gcloud run deploy --image gcr.io/sample-328713/slack-chatgpt-2 --allow-unauthenticated --platform managed
  - --allow-unauthenticated
    - サービスを公開してアクセス可能にする
      - https://cloud.google.com/run/docs/authenticating/public?hl=ja#gcloud

5. Request URL に Cloud Run の URL を設定する

- 最後に /slack/events を付ける

6. これで本番環境で検証ができるようになるはず

- Slack からメッセージを送れば返すようになる
- 403 になった場合
  - Cloud Run アプリに対するアクセス権がないので、付与すれば良い

### Cloud Deploy を使った自動デプロイ

0. 参考記事:https://cloud.google.com/deploy/docs/deploy-app-run?hl=ja
1. Skaffold 構成を作成（https://cloud.google.com/skaffold?hl=ja）

- Google Cloud Deploy では、Skaffold を使用して、デプロイする対象と個々のターゲットに適切にデプロイする方法の詳細を提供します
- skaffold.yaml ファイルを作成して、サンプルアプリのデプロイに使用する Kubernetes マニフェストを識別

2. Cloud Run サービス用のサービス定義ファイルを作成

- サービスを定義し、デプロイする（ビルド済みの）コンテナ イメージを指定

3. Google Cloud Deploy デリバリー パイプラインとデプロイ ターゲットを定義

- パイプラインとターゲットは、1 つのファイルまたは個別のファイルで定義できます。このクイックスタートでは、ファイルを 1 つ作成します
- gcloud deploy apply --file=clouddeploy.yaml --region=us-central1 --project=sample-328713
  - これで、ターゲットを使用してパイプラインを最初のターゲットにデプロイする準備が整いました

4. 最初のターゲットに自動的にデプロイするリリースを作成して、デリバリー パイプラインをインスタンス化します

- リリースは、デプロイされる変更を表す中央の Google Cloud Deploy リソースです。デリバリー パイプラインは、そのリリースのライフサイクルを定義します
- デプロイするコンテナ イメージを表す release リソースを作成

  - gcloud deploy releases create test-release-011 \
    --project=sample-328713 \
    --region=us-central1 \
    --delivery-pipeline=my-run-demo-app-1 \
    --images=my-app-image=gcr.io/sample-328713/slack-chatgpt-2 #ここにデプロイしたイメージを指定
    <!-- --allow-unauthenticated -->
    <!-- --allow-unauthenticated #これではダメっぽい。。どうするんや。。 -->
    <!-- ↑これはあり？ -->
    <!-- --images=my-app-image=gcr.io/cloudrun/hello #ここにデプロイしたイメージを指定 -->

5. 公開（未認証）アクセスを許可する

- デプロイした後でええか。。

- https://cloud.google.com/run/docs/authenticating/public?hl=ja#yaml
- gcloud run services set-iam-policy deploy-qs-prod-2 policy.yaml
- とりあえずこれでできた

6. クリーンアップ

- deploy-qs-dev Cloud Run サービスを削除

  - gcloud run services delete deploy-qs-prod-2 --region=us-central1 --project=sample-328713

- リリースとロールアウトを含む、デリバリー パイプラインを削除

  - gcloud deploy delivery-pipelines delete my-run-demo-app-1 --force --region=us-central1 --project=sample-328713

- Cloud Storage の中のオブジェクトも削除する

- デリバリーパイプラインのページ

  - https://console.cloud.google.com/deploy/delivery-pipelines?hl=ja&_ga=2.99582878.168409258.1673069602-660558282.1668514800&project=sample-328713

- Skaffold コマンド。これ使う？
  - Skaffold を使用してアプリをビルドする
    - skaffold build
  - Skaffold を使用してアプリを Cloud Run にデプロイする
    - skaffold deploy

## 関連記事・URL

- テスト用 Slack チャンネル
  - https://app.slack.com/client/T04E9JJ0VC7/C04EHGW7C14
- Bolt 入門ガイド (HTTP)
  - https://slack.dev/bolt-js/ja-jp/tutorial/getting-started-http
- OpenAI のリファレンス
  - https://beta.openai.com/docs/api-reference/making-requests
- Bolt フレームワークを使って Slack Bot を作ろう
  - https://api.slack.com/lang/ja-jp/hello-world-bolt
- Cloud Deploy ドキュメント
  - https://cloud.google.com/deploy/docs?hl=ja
- Cloud Deploy の概要
  - https://cloud.google.com/deploy?hl=ja
- デプロイに全集中！新サービス Cloud Deploy
  - https://medium.com/google-cloud-jp/cloud-deploy-397c8a7c68c0
- Cloud Deploy 実践編: CI との連携
  - https://medium.com/google-cloud-jp/cloud-deploy-%E5%AE%9F%E8%B7%B5%E7%B7%A8-ci-%E3%81%A8%E3%81%AE%E9%80%A3%E6%90%BA-c22a6bc96286
- Google Cloud Deploy でデリバリーしてみた
  - https://blog.grasys.io/post/izumi/gcd/

## 使用技術

- Slack Bolt(フレームワーク)
  - 初めて使う技術
- Node.js
- TypeScript
- JavaScript
- Cloud Run(Always on CPU?)
  - Always on CPU は初めて使う設定
- ngrok
  - Docker じゃない ngrok は初めて使う
- Cloud Deploy
  - 初めて使う技術
  - 参考 1:https://medium.com/google-cloud-jp/cloud-deploy-397c8a7c68c0
  - 参考 2:https://www.youtube.com/watch?v=Il8FlhR9jKM
  - 参考 3:https://cloud.google.com/deploy?hl=ja
  - 参考 4:Google Cloud Deploy を使用してアプリを Cloud Run にデプロイする(https://cloud.google.com/deploy/docs/deploy-app-run?hl=ja)

## OpenAI API の Request・Response 形式

<!-- Request -->

curl https://api.openai.com/v1/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer OPENAI_API_KEY" \
-d '{"model": "text-davinci-003", "prompt": "プログラミングとはなんですか？", "temperature": 0, "max_tokens": 100}' -k

<!-- Response -->

{"id":"hoge","object":"text_completion","created":1671111296,"model":"text-davinci-003","choices":[{"text":"\n\n プログラミングとは、コンピューターに特定の処理を行わせるために、特定の言語を使って書かれたプログラムを作成することを指します。プログラミング言語は、コン","index":0,"logprobs":null,"finish_reason":"length"}],"usage":{"prompt_tokens":17,"completion_tokens":100,"total_tokens":117}}

## TODO

1. [x] コード内の TODO を解消する
2. [x] よりコードを洗練させる

- OpenAI の prompt の設定とか
- リファクタリング
- 細かいところ

3. [] Cloud Deploy で Cloud Run に自動デプロイできるようにする

- とりあえず Cloud Run に普通のデプロイ -> Slack から叩けることを確認 -> Cloud Deploy でやってみる
- コードを main にマージしたときに
- (イマココ)GitHub Actions に組み込む

4. [] .env を Dockerfile 上で生成できるようにしたい

- 現状は一時的に.env の.gitignore を外してデプロイしている

5. [] SlackBot の応答速度を上げる

- Slack に書き込んでからメッセージが返ってくるまでを最速に

6. [] 学んだことを分解していくつかのブログ記事にまとめる

- 曖昧な部分を残さない
- 全て腹落ちして完全に理解する
- 全てをブログにまとめる
- Cloud Deploy とか Skaffold とかもブログにまとめる
- GCP の Service Account とか IAM をちゃんと調べる
  - 他の Cloud にも応用できる
  - AWS の本とかも読む

7. [] ローカルの環境構築自動化シェルスクリプトを作る

8. [] 会社の Slack に導入する

9. [] 全てのコードを完全に理解する
