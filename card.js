const IDtoName = require('./IDtoName.json')
const nameToID = require('./nameToID.json')
const IDtoCard = require('./IDtoCard.json')
const Fuse = require('fuse.js')
const scryfall = require("scryfall-client")

const options = {
    includeScore: false
}

const fuse = new Fuse(Object.keys(nameToID), options)


class Card{



    /**
     *
     * @param {string} id
     * @param {string} name
     * @param {Array<string>} types
     * @param {boolean} [tapped=false]
     */
    constructor(id, name, types, tapped) {
        this.id = id
        this.name = name
        this.types = types
        this.tapped = tapped || false
    }


    static async imageURLbyID(id){
        console.log(id)
        const card = await scryfall.getCard(id)
        return card.getImage()
    }

    static toRichString(that){
        return `**${that.name}**`
    }
}


/**
 *
 * @param {string} maybeName
 * @return {?Card}
 */
function tryGetCard(maybeName){
    const results = fuse.search(maybeName)
    if (results.length >= 1){
        const name = results[0]["item"]
        const ID = nameToID[name]
        return IDtoCard[ID]
    }else{
        return null
    }
}

module.exports = {tryGetCard, Card}

