let DateTime = require("./dateTime");
let Corrector = require("./corrector");

const stringSimilarity = require("string-similarity");

var emojiRegex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
const emojiTest = str => emojiRegex.test(str);

const overlook = ["you"];

function StripMessage(text) {
    let returnText = text;
    returnText = returnText.replace(/[^\p{L}\s]/gu, "")
    returnText = returnText.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, "")
    return returnText;
}

function msgProcessor(msg) {
    return Corrector(StripMessage(DateTime.removeStamp(msg).toLowerCase()).trim())
}

function storeProcessor(store) {
    let result = []
    for (let i = 0; i < store.length; i++) {
        result.push(msgProcessor(store[i]))
    }

    return result;
}

function PureMatch(store, message, matchThreshold) {
    if (!message.content) message = {label: "Useless label.", content: message}
    let userMessage = msgProcessor(message.content)
    if (userMessage.trim().length < 1) return -1;
    if (emojiTest(userMessage)) return -1;

    let index = -1;
    let match = matchThreshold;
    for (let i = 0; i < store.length; i++) {
        let storeMessage = msgProcessor(store[i])
        let difference = stringSimilarity.compareTwoStrings(userMessage, storeMessage)

        if (difference >= match) {
            index = i;
            match = difference;
        }
    }

    return index;
}

function PureCompare(store, message, matchThreshold) {
    let userMessage = msgProcessor(message)
    let storeMessage = msgProcessor(store)

    if (userMessage.trim().length < 1) return false;
    if (emojiTest(userMessage)) return false;

    let difference = stringSimilarity.compareTwoStrings(userMessage, storeMessage)

    return difference >= matchThreshold;
}

function GetMatch(store, message, matchThreshold) {
    if (!message.content) message = {label: "Useless label.", content: message}
    let userMessage = msgProcessor(message.content)

    if (userMessage.trim().length < 1) return -1;
    
    let index = -1;
    let match = matchThreshold;
    for (let i = 0; i < store.length; i++) {
        let storeMessage = msgProcessor(store[i])
        let difference = stringSimilarity.compareTwoStrings(userMessage, storeMessage)

        if (difference >= match) {
            index = i;
            match = difference;
        }
    }

    if (index < 0) {
        let phrase = "";
        let phraseIndex = 0;
        for (let i = 0; i < store.length; i++) {
            if (store[i].length > 3 && !emojiTest(store[i])) {
                let storeMessage = msgProcessor(store[i])
                let processedStore = ` ${storeMessage} `
                let processedMessage = ` ${userMessage} `

                if (processedMessage.includes(processedStore) && !overlook.includes(processedStore.trim())) {
                    if ((processedMessage.indexOf(processedStore) > phraseIndex && !phrase.includes(processedStore)) || processedStore.includes(phrase)) {
                        if (processedStore.split(" ").length >= phrase.split(" ").length) {
                            phraseIndex = processedMessage.indexOf(processedStore);
                            index = i;
                            phrase = processedStore;
                        }
                    }
                }
            }
        }
    }

    if (index < 0) {
        let phrase = ""
        let phraseIndex = 0;
        for (let i = 0; i < store.length; i++) {
            if (store[i].length > 3 && !emojiTest(store[i])) {
                let userMessage = msgProcessor(message.content)
                let storeMessage = msgProcessor(store[i])
                let processedStore = ` ${storeMessage} `
                let processedMessage = ` ${userMessage} `

                if (processedStore.includes(processedMessage)) {
                    if ((processedStore.indexOf(processedMessage) > phraseIndex && !phrase.includes(processedStore)) || processedStore.includes(phrase)) {
                        if (processedStore.split(" ").length >= phrase.split(" ").length) {
                            phraseIndex = processedStore.indexOf(processedMessage);
                            index = i;
                            phrase = processedStore;
                        }
                    }
                }
            }
        }
    }

    if (emojiTest(store[index])) index = -1;

    return index;
}

function Compare(store, message, matchThreshold) {
    let userMessage = msgProcessor(message)
    let storeMessage = msgProcessor(store)

    if (userMessage.trim().length < 1) return false;
    if (emojiTest(userMessage)) return false;

    let difference = stringSimilarity.compareTwoStrings(userMessage, storeMessage)

    if (difference < matchThreshold) {
        let phrase = "";
        let phraseIndex = 0;
        if (store.length > 3 && !emojiTest(store)) {
            let storeMessage = msgProcessor(store)
            let processedStore = ` ${storeMessage} `
            let processedMessage = ` ${userMessage} `

            if (processedMessage.includes(processedStore) && !overlook.includes(processedStore.trim())) {
                if ((processedMessage.indexOf(processedStore) > phraseIndex && !phrase.includes(processedStore)) || processedStore.includes(phrase)) {
                    if (processedStore.split(" ").length >= phrase.split(" ").length) {
                        phraseIndex = processedMessage.indexOf(processedStore);
                        difference = 1;
                        phrase = processedStore;
                    }
                }
            }
        }
    }

    if (difference < matchThreshold) {
        let phrase = "";
        let phraseIndex = 0;
        if (store.length > 3 && !emojiTest(store)) {
            let storeMessage = msgProcessor(store)
            let processedStore = ` ${storeMessage} `
            let processedMessage = ` ${userMessage} `

            if (processedStore.includes(processedMessage)) {
                if ((processedStore.indexOf(processedMessage) > phraseIndex && !phrase.includes(processedStore)) || processedStore.includes(phrase)) {
                    if (processedStore.split(" ").length >= phrase.split(" ").length) {
                        phraseIndex = processedStore.indexOf(processedMessage);
                        difference = 1;
                        phrase = processedStore;
                    }
                }
            }
        }
    }

    return difference >= matchThreshold;
}

function GetArrayMatch(store, parent, message) {
    let parentIndex = -1;
    let messageIndex = -1;
    for (let i = 0; i < store.length; i++) {
        if (DateTime.removeStamp(store[i]) === DateTime.removeStamp(parent)) parentIndex = i;
    }
    if (parentIndex < 0) return parentIndex;
    else {
        for (let i = 0; i < store[parent].length; i++) {
            if (DateTime.removeStamp(store[parent][i]) === DateTime.removeStamp(message)) messageIndex = i;
        }
    }

    return messageIndex;
}

function GetParentIndex(store, parent) {
    let parentIndex = DateTime.removeArrayStamp(store).indexOf(DateTime.removeStamp(parent))
    return parentIndex;
}

const MatchService = {PureMatch, PureCompare, GetMatch, Compare, GetArrayMatch, GetParentIndex, StripMessage, msgProcessor, storeProcessor}

module.exports = MatchService;