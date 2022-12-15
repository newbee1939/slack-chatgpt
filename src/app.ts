import { App } from "@slack/bolt";
import { Configuration, OpenAIApi } from "openai";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.event("app_mention", async({say}) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.listEngines();

  // Requestを作る
  
  console.log(response);

  await say("メンションされたので返信!!");
});

(async () => {
  // Start your app
  // Slack Boltはport 3000で起動
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();