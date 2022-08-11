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
        db.collection("Research").insertOne(myDocument, function (err, res) {
            if (err) throw err;
            response.json(res);
        });
    }
    else {
        response.json({
            error: "Failed Authentication."
        })
    }
};