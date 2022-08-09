import { connectToDatabase } from "../../util/mongodb";

//Services
import Auth from "../../services/auth";
import StoreService from "../../services/server/StoreService";
import MatchService from "../../services/server/matcher";
import DateTime from "../../services/server/dateTime";
import Override from "../../services/server/defaults";
import EmojiSense from "../../services/server/emojiSense";

const asdfjkl = require("asdfjkl").default;

export default async (req, response) => {
    const { db } = await connectToDatabase();

    let chatHistory = req.body.chatHistory;
    let parentHistory = req.body.parentHistory;
    let ancestor = req.body.ancestor;
    let context = req.body.context;
    let parent = req.body.parent;

    if (req.headers.origin === Auth.ClientURL) {
        let matchIndex = -1;
        if (chatHistory.length > 0) {

            let Yggdrasil = await StoreService.GetStore(db, "Yggdrasil")
            Yggdrasil = StoreService.StoreCompiler(Yggdrasil);
            let Atheneum = await StoreService.GetStore(db, "Atheneum")
            Atheneum = StoreService.StoreCompiler(Atheneum);

            let xalenMsg = chatHistory.filter(msg => msg.parent === "xalen")
            let userMsg = chatHistory.filter(msg => msg.parent === "user")

            if (xalenMsg.length >= 2) {
                if (MatchService.Compare(xalenMsg[xalenMsg.length - 1].fullContent, userMsg[userMsg.length - 1].fullContent, 0.7)
                    && MatchService.Compare(xalenMsg[xalenMsg.length - 2].fullContent, userMsg[userMsg.length - 2].fullContent, 0.7)) {
                    response.json({
                        replies: Override.copycat
                    })
                    return;
                }
            }

            if ((chatHistory.filter(msg => msg.parent === "user").length >= 3)
                && (MatchService.Compare(userMsg[userMsg.length - 1].fullContent, userMsg[userMsg.length - 2].fullContent, 0.7))
                && (MatchService.Compare(userMsg[userMsg.length - 2].fullContent, userMsg[userMsg.length - 3].fullContent, 0.7))) {
                    response.json({
                        replies: Override.tautology
                    })
                    return;
            }

            let matchIndex = MatchService.PureMatch(Object.keys(Override.Identity), parent, 0.9)
            if (matchIndex >= 0) {
                let keys = Object.keys(Override.Identity)
                let index = keys.indexOf(keys[matchIndex])

                response.json({
                    replies: Override.Identity[keys[index]]
                })
                return;
            }
            
            let parentContext = []
            if (ancestor) {
                parentContext = Object.keys(Yggdrasil);
                matchIndex = DateTime.removeArrayStamp(parentContext).indexOf(DateTime.removeStamp(parent))

                if (context.length > 0 && parentContext.length > 0 && matchIndex >= 0) {
                    let keys = Object.keys(Yggdrasil)
                    let index = keys.indexOf(parentContext[matchIndex])
                    let replies = Yggdrasil[keys[index]]
                    replies = replies.filter(reply => !reply.toLowerCase().includes("xalen"))
                    replies = replies.filter(reply => !reply.toLowerCase().includes("pluto"))
                    if (replies.length > 0) {
                        response.json({
                            replies: replies
                        })
                        return;
                    }
                }
            }

            if (asdfjkl(parent) && MatchService.GetMatch(Override.allowedGibberish, parent, 0.7) < 0) {
                response.json({
                    replies: Override.gibberish
                })
                return;
            }

            matchIndex = MatchService.PureMatch(Override.convoTrigger, parent, 0.7)
            if (matchIndex >= 0) {
                response.json({
                    replies: Override.convoStarter
                })
                return;
            }

            matchIndex = MatchService.PureMatch(Override.jokeTrigger, parent, 0.7)
            if (matchIndex >= 0) {
                response.json({
                    replies: Override.jokes
                })
                return;
            }

            let keys = Object.keys(Yggdrasil)
            if (!ancestor && userMsg.length >= 2) {
                let greatGrandParent = parentHistory[parentHistory.length - 3]
                // let greatGrandParent = MatchService.StripMessage(DateTime.removeStamp(userMsg[userMsg.length - 2].fullContent)).trim()
                let grandParent = parentHistory[parentHistory.length - 2]
                // let grandParent = MatchService.StripMessage(DateTime.removeStamp(xalenMsg[xalenMsg.length - 1].fullContent)).trim()

                if (Yggdrasil[grandParent] && Yggdrasil[greatGrandParent]) {
                    let references = keys.filter(record => (MatchService.PureMatch(record, parent, 0.8) >= 0 &&
                                        MatchService.PureMatch(Yggdrasil[greatGrandParent], grandParent, 0.8) >= 0 &&
                                        MatchService.PureMatch(Yggdrasil[grandParent], parent, 0.8) >= 0))
                    // let references = keys.filter(record => (MatchService.msgProcessor(record) === MatchService.msgProcessor(parent) && 
                    //                     MatchService.storeProcessor(Yggdrasil[greatGrandParent]).includes(MatchService.msgProcessor(grandParent)) &&
                    //                     MatchService.storeProcessor(Yggdrasil[grandParent]).includes(MatchService.msgProcessor(parent))))
                    if (references.length > 0) {
                        let replies = Yggdrasil[references[Math.floor(Math.random() * references.length)]]
                        replies = replies.filter(reply => !reply.toLowerCase().includes("xalen"))
                        replies = replies.filter(reply => !reply.toLowerCase().includes("pluto"))

                        if (replies.length > 0) {
                            response.json({
                                replies: replies
                            })
                            return;
                        }
                    }
                }
            }
            
            matchIndex = MatchService.GetMatch(Object.keys(Atheneum), parent, 0.7)
            if (matchIndex >= 0) {
                keys = Object.keys(Atheneum)
                let index = keys.indexOf(keys[matchIndex])
                let replies = Atheneum[keys[index]];

                if (replies.length > 0) {
                    response.json({
                        replies: replies
                    })
                    return;
                }
            }

            for (let i = 0; i < EmojiSense.length; i++) {
                let range = EmojiSense[i].target;
                for (let x = 0; x < range.length; x++) {
                    if (parent.includes(range[x])) {
                        let replies = EmojiSense[i].result;

                        response.json({
                            replies: replies
                        })
                        return;
                    }
                }
            }

            response.json({
                replies: []
            })
            return;
        }
    }
    else {
        response.json({
            error: "Failed Authentication."
        });
    }
};