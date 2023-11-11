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

    if (req.headers.origin === Auth.ClientURL) {
        if (chatHistory.length > 0) {
            let storedTree = await StoreService.GetStore(db, "Yggdrasil")
            let Yggdrasil = Tree.concat(storedTree);

            let xalenMsg = chatHistory.filter(msg => msg.parent === "xalen")
            let userMsg = chatHistory.filter(msg => msg.parent === "user")

            let alpha = chatHistory.length > 4 ? (chatHistory[chatHistory.length - 5])?.content : null;
            let beta = chatHistory.length > 3 ? (chatHistory[chatHistory.length - 4])?.content : null;
            let gamma = chatHistory.length > 2 ? (chatHistory[chatHistory.length - 3])?.content : null;
            let delta = chatHistory.length > 1 ? (chatHistory[chatHistory.length - 2])?.content : null;
            let epilson = chatHistory.length > 0 ? (chatHistory[chatHistory.length - 1])?.content : null;

            // Copycat
            if (xalenMsg.length >= 2) {
                if (MatchService.PureCompare(xalenMsg[xalenMsg.length - 1].content, userMsg[userMsg.length - 1].content, 0.8)
                    && MatchService.PureCompare(xalenMsg[xalenMsg.length - 2].content, userMsg[userMsg.length - 2].content, 0.8)) {
                    response.json({
                        success: true,
                        data: Override.copycat,
                        message: "Replies fetched!"
                    })
                    return;
                }
            }
            
            // Tautology
            if ((userMsg.length >= 3)
                && (MatchService.Compare(userMsg[userMsg.length - 1].content, userMsg[userMsg.length - 2].content, 0.8))
                && (MatchService.Compare(userMsg[userMsg.length - 2].content, userMsg[userMsg.length - 3].content, 0.8))) {
                    response.json({
                        success: true,
                        data: Override.tautology,
                        message: "Replies fetched!"
                    })
                    return;
            }
            
            // Identity
            let matchIndex = MatchService.PureMatch(Object.keys(Override.Identity), epilson, 0.9)
            if (matchIndex >= 0) {
                let keys = Object.keys(Override.Identity)
                let index = keys.indexOf(keys[matchIndex])

                response.json({
                    success: true,
                    data: Override.Identity[keys[index]],
                    message: "Replies fetched!"
                })
                return;
            }
            
            // First Order
            const alphaMatch = Yggdrasil.filter((record) => MatchService.Compare(record.alpha, alpha, 0.8))
            if (alphaMatch.length > 0) {
                const betaMatch = alphaMatch.filter((record) => MatchService.Compare(record.beta, beta, 0.8))
                if (betaMatch.length > 0) {
                    const gammaMatch = betaMatch.filter((record) => MatchService.Compare(record.gamma, gamma, 0.8))
                    if (gammaMatch.length > 0) {
                        const deltaMatch = gammaMatch.filter((record) => MatchService.Compare(record.delta, delta, 0.8))
                        if (deltaMatch.length > 0) {
                            const epilsonMatch = deltaMatch.filter((record) => MatchService.Compare(record.epilson, epilson, 0.8))
                            if (epilsonMatch.length > 0) {
                                const replies = epilsonMatch.map((record) => record.omega)
                                if (replies.length > 0) {
                                    response.json({
                                        success: true,
                                        data: replies,
                                        message: "Replies fetched!"
                                    })
                                    return;
                                }
                            }
                        }
                    }
                }
            }

            // Second Order
            const betaMatch = Yggdrasil.filter((record) => MatchService.Compare(record.beta, beta, 0.8))
            if (betaMatch.length > 0) {
                const gammaMatch = betaMatch.filter((record) => MatchService.Compare(record.gamma, gamma, 0.8))
                if (gammaMatch.length > 0) {
                    const deltaMatch = gammaMatch.filter((record) => MatchService.Compare(record.delta, delta, 0.8))
                    if (deltaMatch.length > 0) {
                        const epilsonMatch = deltaMatch.filter((record) => MatchService.Compare(record.epilson, epilson, 0.8))
                        if (epilsonMatch.length > 0) {
                            const replies = epilsonMatch.map((record) => record.omega)
                            if (replies.length > 0) {
                                response.json({
                                    success: true,
                                    data: replies,
                                    message: "Replies fetched!"
                                })
                                return;
                            }
                        }
                    }
                }
            }

            // Third Order
            const gammaMatch = Yggdrasil.filter((record) => MatchService.Compare(record.gamma, gamma, 0.8))
            if (gammaMatch.length > 0) {
                const deltaMatch = gammaMatch.filter((record) => MatchService.Compare(record.delta, delta, 0.8))
                if (deltaMatch.length > 0) {
                    const epilsonMatch = deltaMatch.filter((record) => MatchService.Compare(record.epilson, epilson, 0.8))
                    if (epilsonMatch.length > 0) {
                        const replies = epilsonMatch.map((record) => record.omega)
                        if (replies.length > 0) {
                            response.json({
                                success: true,
                                data: replies,
                                message: "Replies fetched!"
                            })
                            return;
                        }
                    }
                }
            }

            // Fourth Order
            const deltaMatch = Yggdrasil.filter((record) => MatchService.Compare(record.delta, delta, 0.8))
            if (deltaMatch.length > 0) {
                const epilsonMatch = deltaMatch.filter((record) => MatchService.Compare(record.epilson, epilson, 0.8))
                if (epilsonMatch.length > 0) {
                    const replies = epilsonMatch.map((record) => record.omega)
                    if (replies.length > 0) {
                        response.json({
                            success: true,
                            data: replies,
                            message: "Replies fetched!"
                        })
                        return;
                    }
                }
            }

            // Fifth Order
            if (epilson.split(" ").length > 5) {
                const epilsonMatch = Yggdrasil.filter((record) => MatchService.Compare(record.epilson, epilson, 0.8))
                if (epilsonMatch.length > 0) {
                    const replies = epilsonMatch.map((record) => record.omega)
                    if (replies.length > 0) {
                        response.json({
                            success: true,
                            data: replies,
                            message: "Replies fetched!"
                        })
                        return;
                    }
                }
            }

            // Gibberish
            if (asdfjkl(epilson) && MatchService.GetMatch(Override.allowedGibberish, epilson, 0.8) < 0) {
                response.json({
                    success: true,
                    data: Override.gibberish,
                    message: "Replies fetched!"
                })
                return;
            }

            // Conversation Starter
            matchIndex = MatchService.PureMatch(Override.convoTrigger, epilson, 0.8)
            if (matchIndex >= 0) {
                response.json({
                    success: true,
                    data: Override.convoStarter,
                    message: "Replies fetched!"
                })
                return;
            }

            // Joker
            matchIndex = MatchService.PureMatch(Override.jokeTrigger, epilson, 0.8)
            if (matchIndex >= 0) {
                response.json({
                    success: true,
                    data: Override.jokes,
                    message: "Replies fetched!"
                })
                return;
            }

            // Actions
            matchIndex = MatchService.GetMatch(Object.keys(Override.Actions), epilson.replaceAll("*", ""), 0.9)
            if (matchIndex >= 0 && epilson.includes("*")) {
                let keys = Object.keys(Override.Actions)
                let index = keys.indexOf(keys[matchIndex])

                response.json({
                    success: true,
                    data: Override.Actions[keys[index]],
                    message: "Replies fetched!"
                })
                return;
            }

            // Atheneum
            if (epilson.split(" ").length > 1) matchIndex = MatchService.GetMatch(Object.keys(Atheneum), epilson, 0.8)
            else matchIndex = MatchService.PureMatch(Object.keys(Atheneum), epilson, 0.8)
            if (matchIndex >= 0) {
                let keys = Object.keys(Atheneum)
                let index = keys.indexOf(keys[matchIndex])
                let replies = Atheneum[keys[index]];

                if (replies.length > 0) {
                    response.json({
                        success: true,
                        data: replies,
                        message: "Replies fetched!"
                    })
                    return;
                }
            }

            // EmojiSense
            for (let i = 0; i < EmojiSense.length; i++) {
                let range = EmojiSense[i].target;
                for (let x = 0; x < range.length; x++) {
                    if (epilson.includes(range[x])) {
                        let replies = EmojiSense[i].result;

                        response.json({
                            success: true,
                            data: replies,
                            message: "Replies fetched!"
                        })
                        return;
                    }
                }
            }

            // Fallback
            response.json({
                success: true,
                data: [],
                message: "Replies fetched!"
            })
            return;
        }
    }
    else {
        response.json({
            success: false,
            data: null,
            message: "Failed Authentication :|"
        });
    }
};
