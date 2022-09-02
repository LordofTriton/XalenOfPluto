import { connectToDatabase } from "../../util/mongodb";

// Services
import Auth from "../../services/auth";
import StoreService from "../../services/server/StoreService";

export default async (req, response) => {
    const { db } = await connectToDatabase();

    if (req.headers.origin === Auth.ClientURL) {
        let myDocument = {
            researchTopic: req.body.researchTopic
        };
        await StoreService.InsertOne(db, myDocument, "Research")
        response.json({
            status: "Success."
        });
    }
    else {
        response.json({
            error: "Failed Authentication."
        })
    }
};