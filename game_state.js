const fs = require("fs")
const {tryGetCard} = require("./card.js")


class GameState {

    /**
     *
     * @param {Object<string, number>} cardsInHand
     * @param {Object<string, number>} cardsInDeck
     * @param {Object<string, Array<Card>>} cardsInPlay
     * @param {[Card, string]} stack
     * @param {Object<string, Object<string, number>>} mana
     * @param {Object<string, Array<Card>>} grave
     * @param {Object<string, Array<Card>>} exile
     */
    constructor(cardsInHand, cardsInDeck,
                cardsInPlay, stack,
                mana, grave, exile) {
        this.cardsInHand = cardsInHand
        this.cardsInDeck = cardsInDeck
        this.cardsInPlay = cardsInPlay
        this.stack = stack
        this.mana = mana
        this.grave =grave
        this.exile = exile

        this.displayNameToAttr = {"grave": "grave", "graveyard": "grave", "exile": "exile", "stack": "stack", "board": "cardsInPlay"}
    }

    /**
     * delete card from board, graveyard, or exile. This is not part of the normal game process.
     *
     * @param {string} playerID
     * @param {string} maybeCardName
     * @param {string} place
     * @param {number} distinguisher
     * @return {boolean} whether deletion is successful
     */
    delete(playerID, maybeCardName, place, distinguisher){
        distinguisher = distinguisher || 1
        const card = tryGetCard(maybeCardName)
        if (!card) {
            return false
        }


        const placeAttr = this.displayNameToAttr[place]

        let order = 0
        for (let i = 0; i < this[placeAttr][playerID].length; i++) {
            if (this[placeAttr][playerID][i]["id"] === card.id) {
                order++
                if (order === distinguisher) {
                    this[placeAttr][playerID].pop(i)
                    return true
                }

            }
        }
        return false

    }

    /**
     *
     * @param {string} ownerID
     * @param {string} maybeCardName
     * @param {boolean} tap
     * @param {number} [distinguisher=1]
     * @return {boolean} if the card is found
     */
    setCardTap(ownerID, maybeCardName, tap, distinguisher) {
        distinguisher = distinguisher || 1
        const card = tryGetCard(maybeCardName)
        if (!card) {
            return false
        }


        let order = 0
        for (let i = 0; i < this.cardsInPlay[ownerID].length; i++) {
            if (this.cardsInPlay[ownerID][i]["id"] === card.id) {
                order++
                if (order === distinguisher) {

                    if (this.cardsInPlay[ownerID][i].tapped === tap) {
                        return false
                    }
                    this.cardsInPlay[ownerID][i] = {...this.cardsInPlay[ownerID][i]}
                    this.cardsInPlay[ownerID][i].tapped = tap;
                    return true
                }

            }
        }
        return false

    }

    /**
     *
     * @param {string} ownerID
     * @param {string} maybeCardName
     * @param {boolean} tap
     * @param {number} [distinguisher=1]
     * @return {boolean} if the card is found
     */
    setCardTap(ownerID, maybeCardName, tap, distinguisher) {
        distinguisher = distinguisher || 1
        const card = tryGetCard(maybeCardName)
        if (!card) {
            return false
        }


        let order = 0
        for (let i = 0; i < this.cardsInPlay[ownerID].length; i++) {
            if (this.cardsInPlay[ownerID][i]["id"] === card.id) {
                order++
                if (order === distinguisher) {

                    if (this.cardsInPlay[ownerID].tapped === tap) {
                        return false
                    }
                    this.cardsInPlay[ownerID][i] = {...this.cardsInPlay[ownerID][i]}
                    this.cardsInPlay[ownerID][i].tapped = tap;
                    return true
                }

            }
        }
        return false

    }



    manaStr(playerID, message) {
        let string = ""
        for (const [color, num] of Object.entries(this.mana[playerID])) {
            const emojiName = color + '_'
            string += `${message.client.emojis.cache.find(emoji=>emoji.name===emojiName)} `.repeat(num)
        }
        return string

    }

    /**
     *
     * @param {string} playerID
     * @returns {string}
     */
    boardStr(playerID) {
        return this.cardsInPlay[playerID].map(card => {
            let string = `**${card.name}**`
            if (card.tapped) string += "(tapped)"
            return string
        }).toString()
    }

    /**
     *
     * @returns {string}
     */
    stackStr() {
        return this.stack.map(i => {
            if (typeof i === 'string') return i
            else return `**${i.name}**`
        }).toString()
    }

    dump_cache() {
        fs.writeFile('game_state.json', JSON.stringify(this), () => {
        })
    }

    load_cache() {
        const cachedGameState = JSON.parse(fs.readFileSync('game_state.json'))
        for (const key in cachedGameState) {
            this[key] = cachedGameState[key]
        }
    }

}

module.exports = new GameState({}, {}, {}, [], {}, {}, {})