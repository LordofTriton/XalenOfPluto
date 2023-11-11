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
        let Yggdrasil = Tree.concat(storedTree);
        let messages = Yggdrasil.filter((record) => !record.alpha && !record.beta && !record.gamma && !record.delta && !record.epilson)

        messages = messages.filter((message) => !message.omega.toLowerCase().includes("xalen")).map((msg) => msg.omega)

        response.json({
            success: true,
            data: Censor(messages),
            message: "Fetched messages."
        });
    }
    else {
        response.json({
            error: "Failed Authentication."
        })
    }
};