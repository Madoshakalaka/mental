const fs = require("fs")
const {Card} = require("../card.js")

const all = JSON.parse(fs.readFileSync('AllPrintings.json'))

const nameToID = {}
const IDtoName = {}

/**
 *
 * @type {Object<string, Card>}
 */
const IDtoCard = {}

data = all.data

for (const setCode in data){
    const setCards = data[setCode].cards
    for (const cardIndex in setCards){
        const card = setCards[cardIndex]
        const cardName = card.name;

        if (card.identifiers){

            const cardID = card.identifiers.scryfallId
            nameToID[cardName] = cardID
            IDtoName[cardID] = cardName
            IDtoCard[cardID] = new Card(cardID, cardName, card.types)
        }
    }
}

fs.writeFileSync("nameToID.json", JSON.stringify(nameToID))
fs.writeFileSync("IDtoName.json", JSON.stringify(IDtoName))
fs.writeFileSync("IDtoCard.json", JSON.stringify(IDtoCard))
