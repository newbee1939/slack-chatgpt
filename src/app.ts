import { App } from "@slack/bolt";
import { Configuration, OpenAIApi } from "openai";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// TODO: messageを受け取るようにする
app.event("app_mention", async({say}) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "プログラミングの上達方法を教えてください",
    temperature: 0,
    max_tokens: 500,
  });
  
  const responseText = response.data.choices[0].text;
  if (responseText === undefined) {
    await say("ごめんなさい。。わからにゃい。。。")
    return;
  }
  // TODO:なぜか二回動いてしまうので解消する！（これ：https://dev.classmethod.jp/articles/slack-resend-matome/）
  // TODO:です、とかますとかを「にゃ」に変更する。猫の絵文字も付ける
  await say(responseText);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();