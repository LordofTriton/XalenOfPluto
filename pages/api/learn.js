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
    
    let result = await StoreService.GetStore(db, "Yggdrasil")
    let data = StoreService.StoreCompiler(result);

    if (req.headers.origin === Auth.ClientURL) {
        if (parentMessage) {
            if (ancestor) {parentMessage = ancestor}
            context = data[parentMessage]
            
            let matchIndex = MatchService.GetMatch(DateTime.removeArrayStamp(context), DateTime.removeStamp(newMessage), 0.7)
            if (matchIndex >= 0) {
                response.json({
                    newContext: data[context[matchIndex]],
                    newAncestor: "",
                    newParent: context[matchIndex]
                })

                return;
            }
            else {
                await StoreService.UpdateYggdrasil(db, parentMessage, [...context, newMessage])

                await StoreService.InsertOne(db, {label: newMessage, records: []}, "Yggdrasil")
                
                response.json({
                    newContext: [],
                    newAncestor: "",
                    newParent: newMessage      
                });
            }
        }
        else {
            if (subject === "xalen") {
                let context = data[""];
                let matchIndex = MatchService.GetMatch(DateTime.removeArrayStamp(context), DateTime.removeStamp(newMessage), 0.7)
                if (matchIndex >= 0) {
                    response.json({
                        newContext: data[context[matchIndex]],
                        newAncestor: context[matchIndex],
                        newParent: context[matchIndex]
                    })

                    return;
                }
                else {
                    await StoreService.UpdateYggdrasil(db, parentMessage, [...context, newMessage])

                    await StoreService.InsertOne(db, {label: newMessage, records: []}, "Yggdrasil")
                    
                    response.json({
                        newContext: [],
                        newAncestor: "",
                        newParent: newMessage      
                    });
                }
            }
            else {
                let context = data[""]

                let matchIndex = MatchService.GetMatch(DateTime.removeArrayStamp(context), DateTime.removeStamp(newMessage), 0.7)
                response.json({
                    newContext: data[context[matchIndex]],
                    newAncestor: context[matchIndex],
                    newParent: context[matchIndex]
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