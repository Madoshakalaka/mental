const gameState = require('../game_state')
const {Card} = require('../card.js')
const {reportStatus} = require('./lib/message.js')

module.exports = {
    name: 'resolve',
    description: 'Resolve one thing from stack',

    execute(message) {

        let thing = gameState.stack.pop()
        if (typeof thing !== "string"){
            // todo: allow user tagging
            if (!(thing.types.includes("Instant") || thing.types.includes("Sorcery"))){
                gameState.cardsInPlay[message.author.id].push(thing)
            }
            thing = Card.toRichString(thing)
        }
        gameState.dump_cache()

        if (typeof thing !== "string") {
            thing = thing.name
        }

        return message.channel.send(`${thing} is resolved from stack`).then(()=>reportStatus(message))
    },
}