import { connectToDatabase } from "../../util/mongodb";

// Services
import Auth from "../../services/auth";
import Tree from "../../services/server/Yggdrasil";
import StoreService from "../../services/server/StoreService";
import Censor from "../../services/server/censor";

export default async (req, response) => {
    const { db } = await connectToDatabase();

    if (req.headers.origin === Auth.ClientURL) {
        let storedTree = await StoreService.GetStore(db, "Yggdrasil")
        let Yggdrasil = {...Tree, ...StoreService.StoreCompiler(storedTree)};
        let messages = Yggdrasil[""]
        messages = messages.filter(message => !message.toLowerCase().includes("xalen"))
        response.json(Censor(messages));
    }
    else {
        response.json({
            error: "Failed Authentication."
        })
    }
};