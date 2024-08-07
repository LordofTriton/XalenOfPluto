let DateTime = require("./dateTime");
let Corrector = require("./corrector");

const stringSimilarity = require("string-similarity");

var emojiRegex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
const emojiTest = str => emojiRegex.test(str);

const AlphaTest = str => /[a-z]/i.test(str)

const overlook = ["you"];

// function StripMessage(text) {
//     let returnText = text;
//     returnText = returnText.replace(/[^\p{L}\s]/gu, "")
//     returnText = returnText.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, "")
//     return returnText;
// }

function StripPunctuation(text) {
    let returnText = text;
    returnText = returnText.replace(/[^\w\s]/gi, "")
    return returnText;
}

function StripSpecial(text) {
    let returnText = text;
    returnText = returnText.replace(/[^\p{L}\s]/gu, "")
    return returnText;
}

function EmojiDecoder(text) {
    const regex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug;
    let result = text.replace(regex, match => `${match.codePointAt(0)}`);
    return result;
}

function msgProcessor(msg) {
    const allEmoji = emojiTest(msg)
    if (allEmoji) {
        return Corrector(` ${StripPunctuation(EmojiDecoder(msg.toLowerCase()))} `).trim()
    }
    else {
        return Corrector(` ${StripSpecial(EmojiDecoder(msg.toLowerCase()))} `).trim()
    }
}

function storeProcessor(store) {
    let result = []
    for (let i = 0; i < store.length; i++) {
        result.push(msgProcessor(store[i]))
    }

    return result;
}

function PureMatch(store, message, matchThreshold, matchDuplicate = false) {
    if (!message.content) message = {label: "Useless label.", content: message}
    let userMessage = msgProcessor(message.content)
    if (userMessage.trim().length < 1) return -1;

    let indexes = [];
    let match = matchThreshold;
    for (let i = 0; i < store.length; i++) {
        if (!matchDuplicate && message.content.includes("_") && store[i] === message.content) continue;

        let storeMessage = msgProcessor(store[i])
        if (storeMessage.length > 0) {
            let difference = stringSimilarity.compareTwoStrings(userMessage, storeMessage)

            if (difference >= match) {
                indexes.push(i);
                match = difference;
            }
        }
    }

    let index = indexes.length > 0 ? indexes[Math.ceil(Math.random() * indexes.length - 1)] : -1;

    return index;
}

function PureCompare(store, message, matchThreshold) {
    if (!store && !message) return true;
    if ((!store && message) || (!message && store)) return false;
    
    let userMessage = msgProcessor(message)
    let storeMessage = msgProcessor(store)

    if (userMessage.trim().length < 1) return false;

    let difference = stringSimilarity.compareTwoStrings(userMessage, storeMessage)

    return difference >= matchThreshold;
}

function GetMatch(store, message, matchThreshold, matchDuplicate = false, blockSingleWord = false) {
    if (!message.content) message = {label: "Useless label.", content: message}
    let userMessage = msgProcessor(message.content)

    if (userMessage.trim().length < 1) return -1;
    
    let indexes = [];
    let match = matchThreshold;
    for (let i = 0; i < store.length; i++) {
        if (!matchDuplicate && message.content.includes("_") && store[i] === message.content) continue;

        let storeMessage = msgProcessor(store[i])
        
        if (storeMessage.length > 0) {
            let difference = stringSimilarity.compareTwoStrings(userMessage, storeMessage)

            if (difference >= match) {
                indexes.push(i);
                match = difference;
            }
        }
    }

    if (indexes.length < 1) {
        let phrase = "";
        let phraseIndex = 0;
        for (let i = 0; i < store.length; i++) {
            if (store[i].length > 3 && !emojiTest(store[i])) {
                if (message.content.includes("_") && store[i] === message.content) continue;

                let storeMessage = msgProcessor(store[i])
                let processedStore = ` ${storeMessage} `
                let processedMessage = ` ${userMessage} `

                if (blockSingleWord && processedStore.split(" ").length < 2) continue;

                if (processedMessage.includes(processedStore) && !overlook.includes(processedStore.trim())) {
                    if (processedStore.split(" ").length >= phrase.split(" ").length) {
                        if ((processedMessage.indexOf(processedStore) > phraseIndex && !phrase.includes(processedStore)) || processedStore.includes(phrase)) {
                            phraseIndex = processedMessage.indexOf(processedStore);
                            indexes.push(i);
                            phrase = processedStore;
                        }
                    }
                }
            }
        }
    }

    if (indexes.length < 1) {
        let phrase = ""
        let phraseIndex = 0;
        for (let i = 0; i < store.length; i++) {
            if (store[i].length > 3 && !emojiTest(store[i])) {
                if (message.content.includes("_") && store[i] === message.content) continue;
                
                let storeMessage = msgProcessor(store[i])
                let processedStore = ` ${storeMessage} `
                let processedMessage = ` ${userMessage} `

                if (blockSingleWord && processedMessage.split(" ").length < 2) continue;

                if (processedStore.includes(processedMessage)) {
                    if (processedStore.split(" ").length >= phrase.split(" ").length) {
                        if ((processedStore.indexOf(processedMessage) > phraseIndex && !phrase.includes(processedStore)) || processedStore.includes(phrase)) {
                            phraseIndex = processedStore.indexOf(processedMessage);
                            indexes.push(i);
                            phrase = processedStore;
                        }
                    }
                }
            }
        }
    }

    let index = indexes.length > 0 ? indexes[Math.ceil(Math.random() * indexes.length - 1)] : -1;

    if (index >= 0 && emojiTest(store[index])) index = -1;

    return index;
}

function Compare(store, message, matchThreshold) {
    if (!store && !message) return true;
    if ((!store && message) || (!message && store)) return false;

    let userMessage = msgProcessor(message)
    let storeMessage = msgProcessor(store)

    if (userMessage.trim().length < 1) return false;

    let difference = stringSimilarity.compareTwoStrings(userMessage, storeMessage)

    if (difference < matchThreshold) {
        let phrase = "";
        let phraseIndex = 0;
        if (store.length > 3 && !emojiTest(store)) {
            let storeMessage = msgProcessor(store)
            let processedStore = ` ${storeMessage} `
            let processedMessage = ` ${userMessage} `

            if (processedMessage.includes(processedStore) && !overlook.includes(processedStore.trim())) {
                if (processedStore.split(" ").length >= phrase.split(" ").length) {
                    if ((processedMessage.indexOf(processedStore) > phraseIndex && !phrase.includes(processedStore)) || processedStore.includes(phrase)) {
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
                if (processedStore.split(" ").length >= phrase.split(" ").length) {
                    if ((processedStore.indexOf(processedMessage) > phraseIndex && !phrase.includes(processedStore)) || processedStore.includes(phrase)) {
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
        if (store[i] === parent) parentIndex = i;
    }
    if (parentIndex < 0) return parentIndex;
    else {
        for (let i = 0; i < store[parent].length; i++) {
            if (store[parent][i] === message) messageIndex = i;
        }
    }

    return messageIndex;
}

function GetParentIndex(store, parent) {
    let parentIndex = DateTime.removeArrayStamp(store).indexOf(parent)
    return parentIndex;
}

const MatchService = {PureMatch, PureCompare, GetMatch, Compare, GetArrayMatch, GetParentIndex, msgProcessor, storeProcessor}

module.exports = MatchService;