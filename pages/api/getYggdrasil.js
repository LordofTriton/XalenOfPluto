import { connectToDatabase } from "../../util/mongodb";

// Services
import Auth from "../../services/auth";
import Tree from "../../services/server/Yggdrasil";
import StoreService from "../../services/server/StoreService";

export default async (req, response) => {
    const { db } = await connectToDatabase();

    let storedTree = await StoreService.GetStore(db, "Yggdrasil")
    let Yggdrasil = {...Tree, ...StoreService.StoreCompiler(storedTree)};
    
    response.json({
        Store: Yggdrasil
    });
};