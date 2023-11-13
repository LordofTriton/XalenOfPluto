import { connectToDatabase } from "../../util/mongodb";

// Services
import Auth from "../../services/auth";
import Tree from "../../services/server/Yggdrasil";
import MatchService from "../../services/server/matcher";
import StoreService from "../../services/server/StoreService";

export default async (req, response) => {
    const { db } = await connectToDatabase();

    let alpha = req.body.alpha;
    let beta = req.body.beta;
    let gamma = req.body.gamma;
    let delta = req.body.delta;
    let epilson = req.body.epilson;
    let zeta = req.body.zeta;
    let eta = req.body.eta;
    let theta = req.body.theta;
    let iota = req.body.iota;
    let kappa = req.body.kappa;
    let omega = req.body.omega;

    let storedTree = await StoreService.GetStore(db, "Yggdrasil")
    let Yggdrasil = Tree.concat(storedTree);
    
    let phases = ["alpha", "beta", "gamma", "delta", "epilson", "zeta", "eta", "theta", "iota", "kappa", "omega"]
    let orders = {alpha, beta, gamma, delta, epilson, zeta, eta, theta, iota, kappa, omega}

    const addRecord = async () => {
        await StoreService.InsertOne(db, {
            alpha, 
            beta, 
            gamma, 
            delta,
            epilson,
            zeta, 
            eta, 
            theta, 
            iota, 
            kappa,
            omega
        }, "Yggdrasil")
    }

    if (req.headers.origin === Auth.ClientURL) {
        let match = []
        for (let phase of phases) {
            if (phase === phases[0]) match = Yggdrasil.filter((record) => MatchService.Compare(record[phase], orders[phase], 0.8))
            else match = match.filter((record) => MatchService.Compare(record[phase], orders[phase], 0.8))

            if (match.length > 0) continue;
            else {
                await addRecord()
                response.json({
                    success: true,
                    data: null,
                    message: "Learned successfully :)"     
                });
                break;
            }
        }
        if (match.length > 0) {
            response.json({
                success: true,
                data: null,
                message: "Already learned :)"     
            });
        }
    }
    else {
        response.json({
            error: "Failed Authentication."
        });

        return;
    }
};