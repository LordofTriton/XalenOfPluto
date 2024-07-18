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
import Fallbacks from "../../services/client/defaults";

const asdfjkl = require("asdfjkl").default;

function OrderMatch(phaseIndex, yggdrasil, orders) {
    let phases = ["alpha", "beta", "gamma", "delta", "epilson", "zeta", "eta", "theta", "iota", "kappa"]
    phases = phases.slice(phaseIndex, phases.length)
    let match = []
    for (let phase of phases) {
        if (phaseIndex === 9) {
            if (orders[phase].split(" ").length > 3) match = yggdrasil.filter((record) => MatchService.PureCompare(record[phase], orders[phase], 0.8))
            else match = [];
        }
        else if (phase === phases[0]) match = yggdrasil.filter((record) => MatchService.Compare(record[phase], orders[phase], 0.8))
        else {
            if (match.length < 1) break;
            match = match.filter((record) => MatchService.Compare(record[phase], orders[phase], 0.8))
        }
    }
    if (match.length > 0) {
        const replies = match.map((record) => record.omega)
        return replies;
    } else return match;
}

export default async (req, response) => {
    const { db } = await connectToDatabase();

    let chatHistory = req.body.chatHistory;

    if (req.headers.origin === Auth.ClientURL) {
        if (chatHistory.length > 0) {
            let storedTree = await StoreService.GetStore(db, "Yggdrasil")
            let Yggdrasil = Tree.concat(storedTree);

            let xalenMsg = chatHistory.filter(msg => msg.parent === "xalen")
            let userMsg = chatHistory.filter(msg => msg.parent === "user")

            let alpha = chatHistory.length > 9 ? (chatHistory[chatHistory.length - 10])?.content : null;
            let beta = chatHistory.length > 8 ? (chatHistory[chatHistory.length - 9])?.content : null;
            let gamma = chatHistory.length > 7 ? (chatHistory[chatHistory.length - 8])?.content : null;
            let delta = chatHistory.length > 6 ? (chatHistory[chatHistory.length - 7])?.content : null;
            let epilson = chatHistory.length > 5 ? (chatHistory[chatHistory.length - 6])?.content : null;
            let zeta = chatHistory.length > 4 ? (chatHistory[chatHistory.length - 5])?.content : null;
            let eta = chatHistory.length > 3 ? (chatHistory[chatHistory.length - 4])?.content : null;
            let theta = chatHistory.length > 2 ? (chatHistory[chatHistory.length - 3])?.content : null;
            let iota = chatHistory.length > 1 ? (chatHistory[chatHistory.length - 2])?.content : null;
            let kappa = chatHistory.length > 0 ? (chatHistory[chatHistory.length - 1])?.content : null;

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
            let matchIndex = MatchService.PureMatch(Object.keys(Override.Identity), kappa, 0.9)
            if (matchIndex >= 0) {
                let replies = Override.Identity[Object.keys(Override.Identity)[matchIndex]];

                response.json({
                    success: true,
                    data: replies,
                    message: "Replies fetched!"
                })
                return;
            }
            
            // OrderMatching
            for (let i = 0; i < 10; i++) {
                let match = OrderMatch(i, Yggdrasil, {alpha, beta, gamma, delta, epilson, zeta, eta, theta, iota, kappa})
                match = match.filter((record) => !Fallbacks.includes(record))

                if (match.length > 0) {
                    response.json({
                        success: true,
                        data: match,
                        message: "Replies fetched!"
                    })
                    return;
                }
            }

            // Gibberish
            if (asdfjkl(kappa) && MatchService.GetMatch(Override.allowedGibberish, kappa, 0.8) < 0) {
                response.json({
                    success: true,
                    data: Override.gibberish,
                    message: "Replies fetched!"
                })
                return;
            }

            // Conversation Starter
            matchIndex = MatchService.PureMatch(Override.convoTrigger, kappa, 0.8)
            if (matchIndex >= 0) {
                response.json({
                    success: true,
                    data: Override.convoStarter,
                    message: "Replies fetched!"
                })
                return;
            }

            // Joker
            matchIndex = MatchService.PureMatch(Override.jokeTrigger, kappa, 0.8)
            if (matchIndex >= 0) {
                response.json({
                    success: true,
                    data: Override.jokes,
                    message: "Replies fetched!"
                })
                return;
            }

            // Actions
            matchIndex = MatchService.GetMatch(Object.keys(Override.Actions), kappa.replaceAll("*", ""), 0.9)
            if (matchIndex >= 0 && kappa.includes("*")) {
                let replies = Override.Actions[Object.keys(Override.Actions)[matchIndex]];

                response.json({
                    success: true,
                    data: replies,
                    message: "Replies fetched!"
                })
                return;
            }

            // Atheneum
            if (kappa.split(" ").length > 1) matchIndex = MatchService.GetMatch(Object.keys(Atheneum), kappa, 0.8)
            else matchIndex = MatchService.PureMatch(Object.keys(Atheneum), kappa, 0.8)
            if (matchIndex >= 0) {
                let replies = Atheneum[Object.keys(Atheneum)[matchIndex]];
                replies = match.filter((record) => !Fallbacks.includes(record))

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
                    if (kappa.includes(range[x])) {
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
