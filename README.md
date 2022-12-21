# slack-chatgpt
Slackワークスペースからのメッセージをlistenして、対応するOpenAI GPT-3からの回答を応答するアプリ

## ローカル開発の手順
1. Slackアプリの作成 
  - https://api.slack.com/apps
    - Create New App から
2. Basic InformationのSigning Secret(重要な認証情報)を控えておく
  - https://api.slack.com/apps/A04EM70BXQD
3. OAuth & Permissionsのボットトークン(xoxb-)を控えておく
  - https://api.slack.com/apps/A04EM70BXQD/oauth?
    - Slack アプリは、OAuth を使用して、Slack の API へのアクセスを管理する
    - トークンを使って、アプリは API メソッドを呼び出すことができる
4. Add an OAuth Scopeで許可する処理を指定する
  - https://api.slack.com/apps/A04EM70BXQD/oauth?
  - 以下を追加する(必要になったら追加する)
    - app_mentions:read
    - chat:write
5. 以下のページからOpenAIのキーを取得して控えておく
  - https://beta.openai.com/account/api-keys
6. アプリ用のディレクトリ作成
  - mkdir slack-chatgpt
  - cd slack-chatgpt 
7. npm init
  - 新しいプロジェクトを初期化
  - package.jsonの作成
8. .envに以下の値を追加する
  - SLACK_SIGNING_SECRET=
  - SLACK_BOT_TOKEN=
  - OPENAI_API_KEY=
9. 必要なパッケージをインストールする
  - npm install @slack/bolt
  - npm install openai 
10. 細かい設定の追加
  - package.jsonのscripts
  - tsconfig.json
    - など
11. app.tsにSlack Botの処理を追加
  - 今回だと、GPT-3のAPIを叩いて結果を取得する
12. Buildしてアプリを立ち上げる
  - npm run start
12. ngrokをインストールしてローカル確認ができるように
  - 手順:https://ngrok.com/download
13. ngrokをlistenする
  - ngrok http 3000
13. Slack Appのイベントの設定
  - 参考:https://slack.dev/bolt-js/ja-jp/tutorial/getting-started-http
  - Event SubscriptionのEnable Events のスイッチをオンにする
  - Request URLにngrokのURLを追加する
    - 最後に /slack/events を付ける
14. これでローカルで開発・検証ができるようになるはず
  - Slackからメッセージを送れば返すようになる

## Cloud Runにデプロイする手順
### 手動デプロイ
1. gcloudコマンドが使えるようにしておく
  - Dockerの構成等も必要
2. Dockerfile作成
3. アプリimageのbuildとpush
  - gcloud builds submit --project sample-328713 --tag gcr.io/sample-328713/test
4. Cloud Runへのデプロイ
  - gcloud beta run deploy --image gcr.io/sample-328713/test3 --platform managed
5. Request URLにCloud RunのURLを設定する 
  - 最後に /slack/events を付ける
6. これで本番環境で検証ができるようになるはず
  - Slackからメッセージを送れば返すようになる 

### Cloud Deployを使った自動デプロイ
1. hoge

## 関連記事・URL
- テスト用Slackチャンネル
  - https://app.slack.com/client/T04E9JJ0VC7/C04EHGW7C14
- Bolt 入門ガイド (HTTP)
  - https://slack.dev/bolt-js/ja-jp/tutorial/getting-started-http
- OpenAIのリファレンス
  - https://beta.openai.com/docs/api-reference/making-requests
- Bolt フレームワークを使って Slack Bot を作ろう
  - https://api.slack.com/lang/ja-jp/hello-world-bolt

## 使用技術
- Slack Bolt(フレームワーク)
  - 初めて使う技術
- Node.js
- TypeScript
- JavaScript
- Cloud Run(Always on CPU?)
  - Always on CPUは初めて使う設定
- ngrok
  - Dockerじゃないngrokは初めて使う
- Cloud Deploy
  - 初めて使う技術
  - 参考:https://medium.com/google-cloud-jp/cloud-deploy-397c8a7c68c0

## OpenAI APIのRequest・Response形式
<!-- Request -->
curl https://api.openai.com/v1/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer OPENAI_API_KEY" \
-d '{"model": "text-davinci-003", "prompt": "プログラミングとはなんですか？", "temperature": 0, "max_tokens": 100}' -k  

<!-- Response -->
{"id":"hoge","object":"text_completion","created":1671111296,"model":"text-davinci-003","choices":[{"text":"\n\nプログラミングとは、コンピューターに特定の処理を行わせるために、特定の言語を使って書かれたプログラムを作成することを指します。プログラミング言語は、コン","index":0,"logprobs":null,"finish_reason":"length"}],"usage":{"prompt_tokens":17,"completion_tokens":100,"total_tokens":117}}

## TODO
1. Cloud DeployでCloud Runに自動デプロイできるようにする
  - コードをmainにマージしたときに
2. コード内のTODOを解消する
3. よりコードを洗練させる
  - OpenAIのpromptの設定とか
  - リファクタリング
  - 細かいところ
4. .envをDockerfile上で生成できるようにしたい
  - 現状は一時的に.envの.gitignoreを外してデプロイしている
5. 学んだことを分解していくつかのブログ記事にまとめる
  - 曖昧な部分を残さない
  - 全て腹落ちして完全に理解する
6. 会社のSlackに導入する