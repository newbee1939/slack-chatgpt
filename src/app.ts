import { App } from "@slack/bolt";
import { Configuration, OpenAIApi } from "openai";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.event("app_mention", async ({ event, say }) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: event.text.replace(/<@.*>/g, "").trim(),
    temperature: 0.9, // 創造的なアプリケーションには0.9を、明確に定義された答えがあるアプリケーションには0を
    max_tokens: 4096, // 返ってくるレスポンストークンの最大数。promptと合わせた数字
  });

  const responseText = response.data.choices[0].text;

  if (responseText === undefined) {
    await say("ごめんなさい。。わからにゃい。。。");
    return;
  }

  await say(responseText);
});

(async () => {
  await app.start(process.env.PORT || 8080);

  console.log("⚡️ Slack Bolt app is running!");
})();
