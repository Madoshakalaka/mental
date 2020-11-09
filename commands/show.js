const gameState = require('../game_state.js')
const {reportStatus} = require('./lib/message.js')

module.exports = {
    name: 'show',
    aliases: ["status"],
    description: 'Show the current board, stack, and player states. You can try this in direct message with the Bot',
    execute(message) {
        return reportStatus(message)

    },
}