require("dotenv/config");
const Discord = require("discord.js");
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildPresences
    ]
});
const path = require("path");
require("./Web.js")()
const fs = require("fs");

subjects = [{
        name: "Math",
        name_localizations: { th: 'คณิตศาสตร์' },
        value: "ma"
    },
    {
        name: "Science Core",
        name_localizations: { th: 'วิทยาศาสตร์' },
        value: "sc"
    },
    {
        name: "Science Supplemental",
        name_localizations: { th: 'เสริมวิทยาศาสตร์' },
        value: "ss"
    },
    {
        name: "Thai",
        name_localizations: { th: 'ภาษาไทย' },
        value: "th"
    },
    {
        name: "English Grammar",
        name_localizations: { th: 'ไวยากรณ์ภาษาอังกฤษ' },
        value: "eg"
    },
    {
        name: "English Literature",
        name_localizations: { th: 'วรรณคดีอังกฤษ' },
        value: "el"
    },
    {
        name: "Computer Science",
        name_localizations: { th: 'วิทยาศาสตร์คอมพิวเตอร์' },
        value: "cs"
    },
    {
        name: "Food Science",
        name_localizations: { th: 'วิทยาศาสตร์การอาหาร' },
        value: "fs"
    },
    {
        name: "Chinese",
        name_localizations: { th: 'ภาษาจีน' },
        value: "ch"
    },
    {
        name: "Occupation",
        name_localizations: { th: 'การงานอาชีพ' },
        value: "oc"
    },
    {
        name: "Buddhism",
        name_localizations: { th: 'พุทธศาสนา' },
        value: "bu"
    },
    {
        name: "Society Education",
        name_localizations: { th: 'สังคมศึกษา' },
        value: "so"
    },
]

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}.`)
});

client.commands = new Discord.Collection();
const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON())
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        }
    }
});

client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (message.mentions.users.has(client.user.id) || message.mentions.users.has("1118174109801656451")) { 
        const presence = message.guild.members.cache.get("1118174109801656451").presence;
        if (!(presence && presence.status) || presence.status === "offline") {
            message.channel.send(`<@${message.author.id}>,\n[EN] JJ is currently offline. Please wait a moment. Please do not contact JJ after 10 PM.\n[TH] JJ ออฟไลน์อยู่ โปรดรอสักครู่. โปรดอย่าติดต่อ JJ หลังเวลา 22.00 น.`)
        }
    }
});

client.login(process.env["DISCORD_TOKEN"]).then(() => {
    const rest = new Discord.REST().setToken(client.token);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            const data = await rest.put(
                Discord.Routes.applicationCommands(client.user.id), {
                    body: commands
                },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
})