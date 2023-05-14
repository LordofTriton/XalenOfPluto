import { connectToDatabase } from "../../util/mongodb";

//Services
import Auth from "../../services/auth";
import Atheneum from "../../services/server/Atheneum";
import Tree from "../../services/server/Yggdrasil";
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
    let parent = parentHistory[parentHistory.length - 1];

    if (req.headers.origin === Auth.ClientURL) {
        if (chatHistory.length > 0) {

            let storedTree = await StoreService.GetStore(db, "Yggdrasil")
            let Yggdrasil = {...Tree, ...StoreService.StoreCompiler(storedTree)};

            let xalenMsg = chatHistory.filter(msg => msg.parent === "xalen")
            let userMsg = chatHistory.filter(msg => msg.parent === "user")

            // Copycat
            if (xalenMsg.length >= 2) {
                if (MatchService.PureCompare(xalenMsg[xalenMsg.length - 1].fullContent, userMsg[userMsg.length - 1].fullContent, 0.8)
                    && MatchService.PureCompare(xalenMsg[xalenMsg.length - 2].fullContent, userMsg[userMsg.length - 2].fullContent, 0.8)) {
                    response.json({
                        replies: Override.copycat
                    })
                    return;
                }
            }
            
            // Tautology
            if ((userMsg.length >= 3)
                && (MatchService.Compare(userMsg[userMsg.length - 1].fullContent, userMsg[userMsg.length - 2].fullContent, 0.8))
                && (MatchService.Compare(userMsg[userMsg.length - 2].fullContent, userMsg[userMsg.length - 3].fullContent, 0.8))) {
                    response.json({
                        replies: Override.tautology
                    })
                    return;
            }
            
            // Identity
            let matchIndex = MatchService.PureMatch(Object.keys(Override.Identity), parent, 0.9)
            if (matchIndex >= 0) {
                let keys = Object.keys(Override.Identity)
                let index = keys.indexOf(keys[matchIndex])

                response.json({
                    replies: Override.Identity[keys[index]]
                })
                return;
            }
            
            // Ancestor
            if (parentHistory.length < 3) {
                let replies = Yggdrasil[parent]
                replies = replies.filter(reply => !reply.toLowerCase().includes("xalen"))
                replies = replies.filter(reply => !reply.toLowerCase().includes("pluto"))
                if (replies.length > 0) {
                    response.json({
                        replies: replies
                    })
                    return;
                }
            }

            // Gibberish
            if (asdfjkl(parent) && MatchService.GetMatch(Override.allowedGibberish, parent, 0.8) < 0) {
                response.json({
                    replies: Override.gibberish
                })
                return;
            }

            // Conversation Starter
            matchIndex = MatchService.PureMatch(Override.convoTrigger, parent, 0.8)
            if (matchIndex >= 0) {
                response.json({
                    replies: Override.convoStarter
                })
                return;
            }

            // Joker
            matchIndex = MatchService.PureMatch(Override.jokeTrigger, parent, 0.8)
            if (matchIndex >= 0) {
                response.json({
                    replies: Override.jokes
                })
                return;
            }

            // Cross Reference
            let keys = Object.keys(Yggdrasil)
            if (parentHistory.length > 2) {
                let greatGrandParent = parentHistory[parentHistory.length - 3]
                let grandParent = parentHistory[parentHistory.length - 2]

                if (Yggdrasil[grandParent] && Yggdrasil[greatGrandParent]) {
                    let references = []
                    
                    let firstGen = keys.filter(record => MatchService.Compare(record, greatGrandParent, 0.8))
                    for (let i = 0; i < firstGen.length; i++) {
                        let matchOne = MatchService.PureMatch(Yggdrasil[firstGen[i]], grandParent, 0.8)
                        if (matchOne >= 0) {
                            let secondGen = Yggdrasil[firstGen[i]][matchOne]
                            let matchTwo = MatchService.PureMatch(Yggdrasil[secondGen], parent, 0.8)
                            if (matchTwo >= 0) {
                                references.push(Yggdrasil[secondGen][matchTwo])
                            }
                        }
                    }
                                        
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

            // Actions
            matchIndex = MatchService.GetMatch(Object.keys(Override.Actions), parent.replaceAll("*", ""), 0.9)
            if (matchIndex >= 0 && parent.includes("*")) {
                let keys = Object.keys(Override.Actions)
                let index = keys.indexOf(keys[matchIndex])

                response.json({
                    replies: Override.Actions[keys[index]]
                })
                return;
            }

            // Yggdrasil
            if (parent.split(" ").length > 2 && MatchService.PureMatch(Object.keys(Atheneum), parent, 0.9) < 0) {
                matchIndex = MatchService.PureMatch(Object.keys(Yggdrasil), parent, 0.8)
                if (matchIndex >= 0) {
                    keys = Object.keys(Yggdrasil)
                    let index = keys[matchIndex]
                    let replies = Yggdrasil[index];

                    if (replies.length > 0) {
                        response.json({
                            replies: replies
                        })
                        return;
                    }
                }
            }

            // Atheneum
            if (parent.split(" ").length > 1) matchIndex = MatchService.GetMatch(Object.keys(Atheneum), parent, 0.8)
            else matchIndex = MatchService.PureMatch(Object.keys(Atheneum), parent, 0.8)
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

            // EmojiSense
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

            // Fallback
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
