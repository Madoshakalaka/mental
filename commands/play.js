const {tryGetCard, Card} = require("../card.js")
const gameState = require('../game_state')
const {reportStatus} = require('./lib/message.js')

module.exports = {
    name: 'play',
    description: 'Play a card from hand on stack. Lands automatically goes on board. Card name supports fuzzy match.',
    usage: "card_name",
    guildOnly: true,
    execute(message, args) {


        console.log(args)
        const playerID = message.author.id

        if (!(playerID in gameState.cardsInHand)) {
            return message.channel.send(`Please enter the game first. Try **!enter**`)
        }

        if (args.length === 0) {
            const data = ["Please provide a card name",
                "Fuzzy match is also supported",
                "For example: **!play Kess, teh Dissidont Maggle** will put Kess, Dissident Mage on stack",
                "For example: **!play Forest** will put a Forest on board"]

            return message.author.send(data, {split: true})
                .then(() => {
                    if (message.channel.type === 'dm') return
                    message.reply('I\'ve sent you a DM with usage!')
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
                    message.reply('it seems like I can\'t DM you!')
                })

        }

        const card = tryGetCard(args.join(" "))

        if (card) {
            console.log(card)
            let place
            if (card.types.includes('Land')) {
                place = 'board'
                gameState.cardsInPlay[playerID].push(card)
            } else {
                place = 'stack'
                gameState.stack.push(card)
            }
            gameState.cardsInHand[message.author.id] -= 1
            gameState.dump_cache()
            return Card.imageURLbyID(card.id)
                .then(url => message.channel.send(`**${card.name}** is placed on ${place}`, {files: [url]}))
                .then(()=> reportStatus(message))
        } else {
            return message.channel.send(`Can not find card!`)
        }


    },
}