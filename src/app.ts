import { App } from "@slack/bolt";
import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// いてる？二回動
app.event("app_mention", async({say}) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  // const response = await openai.listEngines();
  // これでリクエストを送信できそう
  // 型もちゃんと定義する
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Node.jsとDenoの違いを教えてください",
    temperature: 0,
    max_tokens: 500,
  });
  
  console.log("-----------");
  console.log(response);
  console.log("-----------");

  // curl https://api.openai.com/v1/completions \
  // -H "Content-Type: application/json" \
  // -H "Authorization: Bearer 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" \
  // -d '{"model": "text-davinci-003", "prompt": "プログラミングとはなんですか？", "temperature": 0, "max_tokens": 100}' -k  
  // 以下のレスポンスが返ってくるのでデータを取る
  // {"id":"cmpl-6NifwIWeRGdWktEcECykwqXjenH2I","object":"text_completion","created":1671111296,"model":"text-davinci-003","choices":[{"text":"\n\nプログラミングとは、コンピューターに特定の処理を行わせるために、特定の言語を使って書かれたプログラムを作成することを指します。プログラミング言語は、コン","index":0,"logprobs":null,"finish_reason":"length"}],"usage":{"prompt_tokens":17,"completion_tokens":100,"total_tokens":117}}

  // axios.get('https://www.example.com/')
  // .then(function (response) {
  //   // レスポンスが成功した場合の処理
  // })
  // .catch(function (error) {
  //   // レスポンスがエラーの場合の処理
  // });

  await say("メンションされたので返信!!");
  const responseText = response.data.choices[0].text;
  console.log(responseText);
  if (responseText === undefined) {
    // undefinedが入ってそう。。
    return;
  }
  await say(responseText);
});

(async () => {
  // Start your app
  // Slack Boltはport 3000で起動
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();