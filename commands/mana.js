const gameState = require('../game_state')
const {stripMentions} = require("./lib/arg.js")
const {reportStatus} = require("./lib/message.js")

module.exports = {
    name: 'mana',
    description: 'Add/remove mana. By default changes your own mana. Tag sombody to change his/her mana. ' +
        'Supports multiple syntaxes. e.g. **!mana add 3b**, ' +
        ' **!mana remove 3c**, **!mana + 3u**, **!mana +3u-2b**, **!mana +u**, **!mana +uuu**',
    guildOnly: true,
    execute(message, args) {

        args = stripMentions(args)

        const diff = {'c': 0, 'w': 0, 'u': 0, 'b': 0, 'r': 0, 'g': 0}

        const arg = args.join("")
        let action
        const numNotation = /\d/.test(arg)
        let num = ""
        let color


        for (let i = 0; i < arg.length; i++) {
            const char = arg[i]
            const sliced = arg.slice(i)
            if (char === '+') {
                action = '+'
                continue
            }
            if (char === '-') {
                action = '-'
                continue
            }
            if (sliced.startsWith('add')) {
                action = '+'
                i += 2
                continue
            }
            if (sliced.startsWith('remove')) {
                action = '-'
                i += 5
                continue
            }
            const loweredChar = char.toLowerCase()
            if (loweredChar in diff) {
                let change

                color = loweredChar
                if (numNotation) {
                    change = parseInt(num)
                    num = ""
                } else {
                    change = 1
                }

                if (action === '-') change *= -1

                diff[loweredChar] += change

                continue
            }

            if (/\d/.test(loweredChar)) {
                num += loweredChar
            }

        }

        let playerID
        if (message.mentions.users.size > 0){
            playerID = message.mentions.users.first().id
        }else{
            playerID = message.author.id
        }

        if (! (playerID in gameState.mana)){
            return message.channel.send("Player not in game!")
        }

        for (const [color, change] of Object.entries(diff)){
            gameState.mana[playerID][color] += change
        }
        gameState.dump_cache()

        return reportStatus(message)

    },
}