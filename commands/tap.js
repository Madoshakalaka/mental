const {tryGetCard} = require("../card.js")
const gameState = require('../game_state')
const {stripMentions} = require('./lib/arg.js')
const {reportStatus} = require('./lib/message.js')

module.exports = {
    name: 'tap',
    description: 'tap a card on board. By default taps your own card. ' +
        'Optionally tag the owner to tap a specific person\'s card. ' +
        'If the player has copies of one card, supply a digit to distinguish.' +
        'e.g. **!tap Black Lotus** or **!tap @Matt Goblin 2**',
    usage: "[player] card_name [digit]",
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

        const res = gameState.setCardTap(playerID, maybeCardName, true, distinguisher)
        gameState.dump_cache()


        if (res) {
            return reportStatus(message)
        } else {
            return message.channel.send("Failed to tap card")
        }


    },
}