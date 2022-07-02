// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Telegraf } from "telegraf";
const token = "5456720097:AAHJeyO-vEp_AZRGDWqBfSOAi9pszL91GKc";

const bot = new Telegraf(token);

/* bot start */
bot.start((ctx) => {
  let message = ` Здарова чел `;
  ctx.reply(message);
});

/* btns */
bot.command("media", (ctx) =>
  ctx.replyWithMediaGroup([
    {
      media: { url: "https://picsum.photos/200/300/?random" },
      caption: "Piped from URL",
      type: "photo",
    },
  ])
);

/* command "fact" */
bot.command("fact", async (ctx) => {
  try {
    ctx.reply("Газиvv");
  } catch (error) {
    console.log("error", error);
    ctx.reply("error sending image");
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export default function handler(req, res) {
  //res.status(200).json({ name: 'John Doe' })
  res.status(200).send("sdfsf" + bot.secretPathComponent());
}
