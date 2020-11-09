const gameState = require("../../game_state.js")

/**
 *
 * @param {Message} message
 */
async function reportStatus(message){
    const data = []

    const fetchIDs = []

    console.log(gameState.cardsInPlay)
    for (const userID of Object.keys(gameState.cardsInPlay)) {
        fetchIDs.push(message.guild.members.fetch(userID).then(m => {
            const boardStr = gameState.boardStr(m.id)
            data.push(`${m}:`)
            if (boardStr.length > 0){
                data.push(`Board: ${gameState.boardStr(m.id)}`)
            }
            data.push(`Hand: ${gameState.cardsInHand[userID]} Deck: ${gameState.cardsInDeck[userID]}`)

            const manaStr = gameState.manaStr(userID, message)
            if (manaStr.length > 0){
                data.push(`Mana: ${manaStr}`)
            }

        }))
    }


    if (gameState.stack.length > 0) {
        data.push(`Stack: ${gameState.stackStr()}`)
    }



    return Promise.all(fetchIDs).then(res => {
        if (res.length > 0){
            return message.channel.send(data, {split: true})
        }else{
            return message.channel.send("No player is currently in game. Try **! enter** to enter.")
        }
    })

}

module.exports = {reportStatus}