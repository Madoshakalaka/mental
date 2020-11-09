const gameState = require('../game_state')
const {stripMentions} = require('./lib/arg.js')
const {reportStatus} = require('./lib/message.js')

module.exports = {
    name: 'untap',
    description: 'untap a card on board. By default untaps your own card. ' +
        'Optionally tag the owner and provide the card name. e.g. **!untap Black Lotus** or **!untap @Matt Black Lotus**',
    usage: "[player] card_name",
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

        let playerID
        if (message.mentions.users.size === 1) {
            playerID = message.mentions.users.first().id
        } else {
            playerID = message.author.id
        }

        const res = gameState.setCardTap(playerID, maybeCardName, false, distinguisher)
        gameState.dump_cache()


        if (res) {
            return reportStatus(message)
        } else {
            return message.channel.send("Failed to tap card")
        }


    },
}