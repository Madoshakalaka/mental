const gameState = require('../game_state')


module.exports = {
    name: 'exit',
    aliases: ["kick", "kill"],
    usage: "[player]",
    description: 'Exit the game. Optionally tag somebody to kick him.',
    guildOnly: true,
    execute(message) {


        let messagePromise;
        let quitUser;

        if (!message.mentions.users.size) {
            quitUser = message.author;
            messagePromise = message.channel.send(`${quitUser} left the game.`);
        }else{
            quitUser = message.mentions.users.first();
            messagePromise = message.channel.send(`${quitUser} is kicked out of the game`);
        }

        return messagePromise.then(()=>{
            delete gameState.cardsInHand[quitUser.id]
            delete gameState.cardsInDeck[quitUser.id]
            delete gameState.cardsInPlay[quitUser.id]
            delete gameState.mana[quitUser.id]
            if (Object.keys(gameState.mana).length === 0){
                gameState.stack = []
                return message.channel.send("No player left. Game ended.")
            }
            // todo: clear cards on stack owned by the player
            gameState.dump_cache()
        })

    },
};