import { App } from "@slack/bolt";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message("hello", async ({say}) => {
  console.log("helloに来たよ！！");
  // say() sends a message to the channel where the event was triggered

  await say("Hello!");
});

app.command(`/echo`, async ({ command, ack, say }) => {
  ack()
  say(`発言: ${command.text}`)
});

(async () => {
  // Start your app
  // Slack Boltはport 3000で起動
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();