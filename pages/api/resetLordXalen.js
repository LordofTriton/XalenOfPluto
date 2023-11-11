import { connectToDatabase } from "../../util/mongodb";

export default async (req, response) => {
    const { db } = await connectToDatabase();

    db.collection("Yggdrasil").remove({})
    
    response.json({
        status: "Success."
    })
};