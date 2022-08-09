import { connectToDatabase } from "../../util/mongodb";

// Services
import Auth from "../../services/auth";
import StoreService from "../../services/server/StoreService";

export default async (req, response) => {
    const { db } = await connectToDatabase();

    let result = await GetStore(db, "Yggdrasil");
    
    response.json({
        Store: StoreService.StoreCompiler(result)
    });
};