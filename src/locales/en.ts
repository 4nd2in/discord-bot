
export const en = {
    replyPong: "pong!",
    pongDesc: "Simple command to test if the bot is responding to interactions.",
    helpDesc: "Shows the description of all commands",
    commandList: "Command List",
    commandDesc: "Description of commands",
    handleBirthday: "Handle birthdays",
    setChannelDesc:
        "Sets the channel to which notifications are being sent. " +
        "If unset, no message will be sent.",
    birthdayAddDesc: "Adds a user to birthday list.",
    birthdayAddUserDesc: "User from whom you want to add the birthday.",
    birthdayAddDateDesc: "Date of birthday {YYYY-MM-DD}.",
    birthdayShowDesc: "Displays a users birthday or all if no user is mentioned.",
    birthdayShowUserDesc: "User from whom you want to see the birthday.",
    birthdayRemoveDesc: "Removes a user from birthday list.",
    birthdayRemoveUserDesc: "User from whom you want to delete the birthday.",
    replyEnterChannel: "Please enter a text channel",
    replyNoGuild: "Could not find guild",
    replySetChannel:
        (channelId: string): string => `Set <#${channelId}> as birthday response channel`,
    replyDateInvalid: "Please enter a real date",
    replyNoUser: "Could not find user",
    replyBirthday: (username: string, age: number): string => {
        return `Added birthday for ${username}, age: ${age}`;
    },
    replyNoBirthday: (username: string): string => `Could not find birthday of ${username}`,
    replyNoBirthdays: "My database is currently empty :(",
    replyHappyBirthday: (username: string, date: string, age: number): string => {
        return `Brithday of ${username} is ${date}. They are ${age} years old 🎂`;
    },
    birthdayInfo: (age: number, date: string): string => `Age: ${age}, Birthday: ${date}`,
    replyRemoveBirthday: (username: string): string => `Removed ${username} from birthday list.`
};