const gameState = require('../game_state')


module.exports = {
    name: 'enter',
    aliases: ["compete"],
    guildOnly: true,
    description: 'Enter the game with 7 cards in hand and 93 cards in deck',
    execute(message) {
        const player = message.author;

        if (player.id in gameState.cardsInPlay){
            return message.channel.send("Player already in game");
        }else{
            return message.channel.send(`${player} just entered the game with 7 cards in hand and 93 cards in deck`).then(()=>{
                gameState.cardsInHand[player.id] = 7
                gameState.cardsInDeck[player.id] = 93;
                gameState.cardsInPlay[player.id] = []
                gameState.mana[player.id] = {'c':0, 'w':0, 'u':0, 'b': 0, 'r': 0, 'g': 0}
                gameState.dump_cache()
            })
        }

    },
};