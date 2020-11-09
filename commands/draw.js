const gameState = require('../game_state')
// const IDtoCard = require('../IDtoCard.json')
const {reportStatus} = require('./lib/message.js')

module.exports = {
    name: 'draw',
    usage: '[number_of_cards]',
    description: 'Draw a card. Optionally provide a number to draw multiple cards. **!draw n** is equivalent to **! hand +n** and **! deck -n**',

    execute(message, args) {
        let n = 1;
        if (args.length === 1){
            n = parseInt(args[0])
        }

        gameState.cardsInHand[message.author.id] += n
        gameState.cardsInDeck[message.author.id] -= n
        gameState.dump_cache()
        return reportStatus(message)
    },
};