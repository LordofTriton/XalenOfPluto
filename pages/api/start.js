import { connectToDatabase } from "../../util/mongodb";

// Services
import Auth from "../../services/auth";
import StoreService from "../../services/server/StoreService";
import Censor from "../../services/server/censor";

export default async (req, response) => {
    const { db } = await connectToDatabase();

    if (req.headers.origin === Auth.ClientURL) {
        let result = await StoreService.GetStore(db, "Yggdrasil")
        let data = StoreService.StoreCompiler(result)
        let messages = data[""]
        messages = messages.filter(message => !message.toLowerCase().includes("xalen"))
        response.json(Censor(messages));
    }
    else {
        response.json({
            error: "Failed Authentication."
        })
    }
};