import { connectToDatabase } from "../../util/mongodb";

// Services
import Auth from "../../services/auth";
import MatchService from "../../services/server/matcher";
import StoreService from "../../services/server/StoreService";
import DateTime from "../../services/server/dateTime";

export default async (req, response) => {
    const { db } = await connectToDatabase();

    let parentMessage = req.body.parentMessage;
    let ancestor = req.body.ancestor;
    let newMessage = req.body.newMessage;
    let context = req.body.context;
    let subject = req.body.subject;

    if (req.headers.origin === Auth.ClientURL) {
        if (parentMessage) {
            if (ancestor) {parentMessage = ancestor}

            let result = await StoreService.GetStore(db, "Yggdrasil")
            let data = (StoreService.StoreCompiler(result));
            
            let matchIndex = MatchService.PureMatch(DateTime.removeArrayStamp(context), DateTime.removeStamp(newMessage), 0.7)
            if (matchIndex >= 0) {
                response.json({
                    newContext: data[context[matchIndex]],
                    newAncestor: "",
                    newParent: context[matchIndex]
                })

                return;
            }
            else {
                db.collection("Yggdrasil").updateOne({label: parentMessage}, {$set: {records: [...context, newMessage]}}, function (err, res) {
                    if (err) throw err;

                    db.collection("Yggdrasil").update({label: newMessage}, {$setOnInsert: {label: newMessage, records: []}}, {upsert: true}, function (err, res) {
                        if (err) throw err;

                        response.json({
                            newContext: [],
                            newAncestor: "",
                            newParent: newMessage      
                        });

                        return;
                    })
                });
            }
        }
        else {
            if (subject === "xalen") {
                let result = await StoreService.GetStore(db, "Yggdrasil")
                let data = (StoreService.StoreCompiler(result));

                let keys = Object.keys(data)
                let matchIndex = MatchService.PureMatch(DateTime.removeArrayStamp(keys), DateTime.removeStamp(newMessage), 0.7)
                if (matchIndex >= 0) {
                    response.json({
                        newContext: data[keys[matchIndex]],
                        newAncestor: keys[matchIndex],
                        newParent: keys[matchIndex]
                    })

                    return;
                }
                else {
                    db.collection("Yggdrasil").updateOne({label: ""}, {$set: {records: [...data[""], newMessage]}}, function (err, res) {
                        if (err) throw err;

                        db.collection("Yggdrasil").update({label: newMessage}, {$setOnInsert: {label: newMessage, records: []}}, {upsert: true}, function (err, res) {
                            if (err) throw err;
    
                            response.json({
                                newContext: [],
                                newAncestor: newMessage,
                                newParent: newMessage
                            });
    
                            return;
                        })
                        
                        // db.collection("Yggdrasil").insertOne({label: newMessage, records: []}, function (err, res) {
                        //     if (err) throw err;

                        //     response.json({
                        //         newContext: [],
                        //         newAncestor: newMessage,
                        //         newParent: newMessage
                        //     });

                        //     return;
                        // });
                    });
                }
            }
            else {
                let result = await StoreService.GetStore(db, "Yggdrasil")
                let data = (StoreService.StoreCompiler(result));
                let keys = Object.keys(data)

                response.json({
                    newContext: data[newMessage],
                    newAncestor: newMessage,
                    newParent: newMessage
                });

                return;
            }
        }
    }
    else {
        response.json({
            error: "Failed Authentication."
        });

        return;
    }
};