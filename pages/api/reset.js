import { connectToDatabase } from "../../util/mongodb";

// Services
import Auth from "../../services/auth";

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

    if (req.headers.origin === Auth.ClientURL) {
        db.collection("Yggdrasil").remove({})
        let keys = Object.keys(Yggdrasil)
        for (let i = 0; i < keys.length; i++) {
            let myDocument = {
                label: keys[i],
                records: Yggdrasil[keys[i]]
            }
            db.collection("Yggdrasil").insertOne(myDocument, function (err, res) {if (err) throw err})
        }
        response.json({
            ststus: "Success."
        })
    }
    else {
        response.json({
            error: "Failed Authentication."
        });

        return;
    }
};