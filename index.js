const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log("Spectra Update Bot 已上線");
});

/*
使用方式：
!update <版本> | <Roblox版本> | <下載連結> | <更新內容>

更新內容可用 \n 換行

範例：
!update 3.1.05 | version-f8734e043e1e40a2 | https://spectra-executor.vercel.app | [+] A better-looking editor\n[+] UI improvement
*/

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!update")) return;

  const raw = message.content.replace("!update", "").trim();
  const parts = raw.split("|").map(p => p.trim());

  if (parts.length < 4) {
    return message.reply(
      "指令格式錯誤\n" +
      "`!update 版本 | Roblox版本 | 下載連結 | 更新內容`"
    );
  }

  let [version, robloxVersion, downloadLink, updateLogs] = parts;

  updateLogs = updateLogs
  .replace(/\\n/g, "\n")
  .split("\n")
  .map(line => {
    const l = line.trim();

    // [+] 開頭 → 轉成 + （diff 才會綠）
    if (l.startsWith("[+]")) {
      return "+ " + l.slice(3).trim();
    }

    // 已經是 diff 語法
    if (l.startsWith("+") || l.startsWith("-")) {
      return l;
    }

    // 其他情況 → 自動補 +
    return "+ " + l;
  })
  .join("\n");

  const embed = new EmbedBuilder()
    .setColor(0xFFD400)
    .setTitle("Spectra Has Updated")
    .addFields(
      {
        name: "Version",
        value: `**${version}**`,
        inline: false
      },
      {
        name: "Roblox Version",
        value: robloxVersion,
        inline: false
      },
      {
        name: "Download Link",
        value: `${downloadLink}`,
        inline: false
      },
      {
        name: "Update Logs",
        value: "```diff\n" + updateLogs + "\n```",
        inline: false
      }
    )
    .setFooter({
      text: "Spectra Executor"
    })
    .setTimestamp();

  await message.channel.send({
    content: "@everyone",
    embeds: [embed]
  });

  await message.delete();
});


client.login(process.env.TOKEN);

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});
