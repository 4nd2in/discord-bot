# 4nd2in's Discord Bot  
> Work In Progress

# Features
## Enhancements and Bugs
To improve this bot and the servers using it, just create an issue with the `enhancement` label for new features or `bug` for bugs. It might take a while until your issue will be resolved. 

## Announcements (WIP)
### Description
A user can set the date on which the event is to take place and a custom message to be sent to the specified channel on the day of the event. The message is able to tag roles and users.
### Usage
`/addAnnouncement {date} {channelId} {message}`

## Reaction Role (WIP)
### Description
Adds a reaction to an existing message. When a user reacts to the created reaction, they receive the role associated with that reaction.
### Usage
To add a new reaction role:  
`/addReactionRole {channelId} {messageId} {reaction} {roleId}`  
To list all reaction roles on the guild:  
`/listReactionRole`  
To remove an existing reaction role:  
`/removeReactionRole {reactionRoleId}`

# Running The Project 
Clone the project:  
`git clone https://github.com/4nd2in/discord-bot.git`
To run this project you need [Node.js](https://nodejs.org/en/) `v16.6.0` or higher installed. If you are new to [Discord.js](https://discord.js.org/#/) have a look at [Discord.js Guide](https://discordjs.guide/) which is very helful for getting started.  
This project is using yarn. Run this to install it via `npm`:  
`npm install --global yarn`  
After that install the needed packages:  
`yarn install`  
In the root directory of the project create a new file with the name `.env` and the following content:

```
TOKEN={YOUR-DISCORD-BOT-TOKEN}`
CLIENT={YOUR-CLIENT-ID}
GUILD={DEV-GUILD-ID}
DB={DATABASE-NAME}
DB_USER={DATABASE-USER}
DB_PW={DATABASE-PASSWORD}
```
