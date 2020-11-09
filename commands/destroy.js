const {tryGetCard} = require("../card.js")
const gameState = require('../game_state')
const {stripMentions} = require('./lib/arg.js')
const {reportStatus} = require('./lib/message.js')

module.exports = {
    name: 'destroy',
    description: 'destroy a permanent on board. By default it destroys your own permanent in play. ' +
        'Optionally tag the owner to destroy someone else\'s permanent. ' +
        'If the player has copies of one card, supply a digit to distinguish.' +
        'e.g. **!destroy Black Lotus**, **!destroy @Matt Goblin 2**',
    usage: "[player] card_name [digit]",
    aliases: ["bury", "sac", "sacrifice", "kill"],
    guildOnly: true,
    execute(message, args) {

        const noMentionArgs = stripMentions(args)
        let maybeCardName;
        let distinguisher = 0;
        if (/\d/.test(noMentionArgs[noMentionArgs.length-1])){
            distinguisher = parseInt(noMentionArgs[noMentionArgs.length -1])
            maybeCardName = noMentionArgs.slice(0,-1).join(" ")
        }else{
            maybeCardName = noMentionArgs.join(" ")
        }


        stripMentions(args).join(' ')
        let playerID
        if (message.mentions.users.size === 1) {
            playerID = message.mentions.users.first().id
        } else {
            playerID = message.author.id
        }



        // todo: actually move things to graveyard
        const res = gameState.delete(playerID, maybeCardName, "board", distinguisher)
        gameState.dump_cache()


        if (res) {
            return reportStatus(message)
        } else {
            return message.channel.send("Failed to destroy card")
        }


    },
}