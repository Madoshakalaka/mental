const {tryGetCard} = require("../card.js")
const gameState = require('../game_state')
const {stripMentions} = require('./lib/arg.js')
const {reportStatus} = require('./lib/message.js')

module.exports = {
    name: 'delete',
    description: 'Delete something from graveyard, board, or exile.' +
        'Note this is not a normal game process.',
    usage: "[player] \"graveyard\"|\"exile\"|\"board\" card_name [digit]",
    guildOnly: true,
    execute(message, args) {
        const noMentionArgs = stripMentions(args)
        let maybeCardName;
        const place = noMentionArgs[0];
        if (! ["grave", "graveyard", "exile", "board"].includes(place)){
            return message.channel.send("Must specify one of graveyard, exile, and board")
        }

        let distinguisher = 0;
        if (/\d/.test(noMentionArgs[noMentionArgs.length-1])){
            distinguisher = parseInt(noMentionArgs[noMentionArgs.length -1])
            maybeCardName = noMentionArgs.slice(1,-1).join(" ")
        }else{
            maybeCardName = noMentionArgs.slice(1).join(" ")
        }

        let playerID
        if (message.mentions.users.size === 1) {
            playerID = message.mentions.users.first().id
        } else {
            playerID = message.author.id
        }

        const res = gameState.delete(playerID, maybeCardName, place, distinguisher)
        gameState.dump_cache()


        if (res) {
            return reportStatus(message)
        } else {
            return message.channel.send("Failed to delete")
        }


    },
}