// const {tryGetCard} = require("../card.js")
const gameState = require('../game_state')
// const IDtoCard = require('../IDtoCard.json')
const {reportStatus} = require('./lib/message.js')

module.exports = {
    name: 'hand',
    description: 'control hand size. for example **! hand +1** adds one card to hand, **! hand -2** removes two cards from hand',
    usage:"+n|-n",
    execute(message, args) {

        if (args[0].includes('-')){
            const split = args[0].split('-')
            const num = parseInt(split[split.length-1])
            gameState.cardsInHand[message.author.id] -= num
        }else if(args[0].includes('+')){

            const split = args[0].split('+')
            const num = parseInt(split[split.length-1])
            gameState.cardsInHand[message.author.id] += num
        }
        gameState.dump_cache()
        return reportStatus(message)

    },
};