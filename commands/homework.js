const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("homework")
        .setNameLocalization("th", "การบ้าน")
        .setDescription("Request Homework")
        .setDescriptionLocalization("th", "ขอการบ้าน")
        .addStringOption(option => option
            .setName("subject")
            .setDescription("Pick the subject")
            .setDescriptionLocalization("th", "เลือกวิชา")
            .setRequired(true)
            .addChoices(...subjects)
        )
        .addNumberOption(option => option
            .setName("page")
            .setDescription("Pick the page")
            .setDescriptionLocalization("th", "เลือกหน้า")
            .setRequired(true)
        ),
    async execute(interaction) {
        const subject = interaction.options.getString('subject');
        const page = interaction.options.getNumber('page');
        const homeworkSenderRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase().includes("homework sender"))
        // const homeworkSenderRole = "test"
        await interaction.reply({ content: `[EN] Please wait for <@&${homeworkSenderRole.id}>.\n[TH] โปรดรอ <@&${homeworkSenderRole.id}>.`, ephemeral: true });
        const embed = new EmbedBuilder()
            .setTitle("Requesting Homework")
            .setDescription(`
                __Homework was requested by **<@${interaction.user.id}>**!__

                Subject: **${subjects.filter(a => a.value === subject)[0].name}**
                Page: **${page}**
            `)
            .setAuthor({ name: "Made By Khao", iconURL: "https://cdn.discordapp.com/avatars/624819246177845270/a09ace2678b80d74faaa7d9957f88c68.webp?size=160" })
        await interaction.channel.send({ content: `<@&${homeworkSenderRole.id}>`, embeds: [embed] })
    }
}