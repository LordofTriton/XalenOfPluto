import { connectToDatabase } from "../../util/mongodb";

// Services
import Auth from "../../services/auth";
import Tree from "../../services/server/Yggdrasil";
import StoreService from "../../services/server/StoreService";

const Yggdrasil = {
    "": [
        "1648440119398_Hello!",
        "1648440211596_Hi!",
        "1648443193203_Hola!",
        "1648443203671_Konnichiwa!",
        "1648443214329_Howdy! How do you do?",
        "1648771407088_Hiya!",
        "1648772294816_What's up?",
        "1648773205316_Sup?",
        "1648837433378_Wassup?"
    ],
    "1648440211596_Hi!": [],
    "1648443193203_Hola!": [],
    "1648443203671_Konnichiwa!": [],
    "1648443214329_Howdy! How do you do?": [],
    "1648440119398_Hello!": [],
    "1648771407088_Hiya!": [],
    "1648772294816_What's up?": [],
    "1648773205316_Sup?": [],
    "1648837433378_Wassup?": []
}

export default async (req, response) => {
    const { db } = await connectToDatabase();

    let Yggdrasil = {
        "": Tree[""]
    }

    for (let i = 0; i < Tree[""].length; i++) {
        Yggdrasil = {...Yggdrasil, [Tree[""][i]]: Tree[Tree[""][i]]}
    }

    db.collection("Yggdrasil").remove({})
    let keys = Object.keys(Yggdrasil)
    for (let i = 0; i < keys.length; i++) {
        let myDocument = {
            label: keys[i],
            records: Yggdrasil[keys[i]]
        }
        await StoreService.InsertOne(db, myDocument, "Yggdrasil")
    }
    response.json({
        status: "Success."
    })
};