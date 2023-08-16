import { connectToDatabase } from "../../util/mongodb";

//Services
import Auth from "../../services/auth";
import Atheneum from "../../services/server/Atheneum";
import MatchService from "../../services/server/matcher";
import { fallback } from "../../services/server/defaults";

const stringSimilarity = require("string-similarity");

export default async (req, response) => {
    const { db } = await connectToDatabase();

    let message = req.body.message;
    let context = req.body.context;

    if (req.headers.origin === Auth.ClientURL) {
        await db.collection("conversations").insertOne({
            message,
            context
        })

        let conversation = ([...context, message]).splice(-3)
        let conversationBank = await db.collection("conversations").find({}).toArray()
        let matchedReplies = []

        for (let convo of conversationBank) {
            let matchScore = 0;
            for (let i = 0; i < conversation.length; i++) {
                let matchConversation = conversation[i]
                let matchConvo = convo.context[i]
                const similarityScore = stringSimilarity.compareTwoStrings(matchConversation, matchConvo);
                if (similarityScore > 0.8) matchScore += similarityScore;
                else {
                    matchScore = 0;
                    break;
                }
            }
            if (matchScore > 0) matchedReplies.push({ message: convo.message, score: matchScore })
        }

        matchedReplies = matchedReplies.filter((reply) => !fallback.includes(reply.message))
        if (matchedReplies.length > 0) {
            const highestScoreMessage = matchedReplies.reduce((highest, current) => {
                return current.score > highest.score ? current : highest;
            }, { message: '', score: -Infinity })

            await db.collection("conversations").insertOne({
                message: highestScoreMessage.message,
                context: conversation.concat(highestScoreMessage.message).slice(-3)
            })

            response.json({
                reply: highestScoreMessage.message
            })
        }
        else {
            if (message.split(" ").length > 1) matchIndex = MatchService.GetMatch(Object.keys(Atheneum), message, 0.8)
            else matchIndex = MatchService.PureMatch(Object.keys(Atheneum), message, 0.8)
            if (matchIndex >= 0) {
                keys = Object.keys(Atheneum)
                let index = keys.indexOf(keys[matchIndex])
                let replies = Atheneum[keys[index]];

                if (replies.length > 0) {
                    response.json({
                        reply: replies[Math.floor(Math.random() * replies.length)]
                    })
                    return;
                }
            }
            else {
                response.json({
                    reply: fallback[Math.floor(Math.random() * fallback.length)]
                })
            }
        }
    }
    else {
        response.json({
            error: "Failed Authentication."
        });
    }
};
