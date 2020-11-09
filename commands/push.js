// const {tryGetCard} = require("../card.js")
const gameState = require('../game_state')
// const IDtoCard = require('../IDtoCard.json')
const {reportStatus} = require('./lib/message.js')

module.exports = {
    name: 'push',
    description: 'Push an arbitrary thing to stack. e.g. **! push Kikijiki Trigger**. ' +
        'If you want to play a card on stack, use **!play card_name** instead',
    usage:"arbitrary_string",
    aliases: ["stack"],
    guildOnly: true,
    execute(message, args) {
        gameState.stack.push(args.join(" "))
        gameState.dump_cache()
        return reportStatus(message)

    },
};