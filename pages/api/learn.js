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
    let omega = req.body.omega;

    let storedTree = await StoreService.GetStore(db, "Yggdrasil")
    let Yggdrasil = Tree.concat(storedTree);

    const addRecord = async () => {
        await StoreService.InsertOne(db, {
            alpha, 
            beta, 
            gamma, 
            delta,
            epilson,
            omega
        }, "Yggdrasil")
    }

    if (req.headers.origin === Auth.ClientURL) {
        const alphaMatch = Yggdrasil.filter((record) => MatchService.Compare(record.alpha, alpha, 0.8))
        if (alphaMatch.length > 0) {
            const betaMatch = alphaMatch.filter((record) => MatchService.Compare(record.beta, beta, 0.8))
            if (betaMatch.length > 0) {
                const gammaMatch = betaMatch.filter((record) => MatchService.Compare(record.gamma, gamma, 0.8))
                if (gammaMatch.length > 0) {
                    const deltaMatch = gammaMatch.filter((record) => MatchService.Compare(record.delta, delta, 0.8))
                    if (deltaMatch.length > 0) {
                        const epilsonMatch = deltaMatch.filter((record) => MatchService.Compare(record.epilson, epilson, 0.8))
                        if (epilsonMatch.length > 0) {
                            const omegaMatch = epilsonMatch.filter((record) => MatchService.Compare(record.omega, omega, 0.8))
                            if (omegaMatch.length > 0) {
                                response.json({
                                    success: true,
                                    data: null,
                                    message: "Already learned :("     
                                });
                            }
                            else {
                                await addRecord()
                                response.json({
                                    success: true,
                                    data: null,
                                    message: "Learned successfully :)"     
                                });
                            }
                        } else {
                            await addRecord()
                            response.json({
                                success: true,
                                data: null,
                                message: "Learned successfully :)"     
                            });
                        }
                    } else {
                        await addRecord()
                        response.json({
                            success: true,
                            data: null,
                            message: "Learned successfully :)"     
                        });
                    }
                } else {
                    await addRecord()
                    response.json({
                        success: true,
                        data: null,
                        message: "Learned successfully :)"     
                    });
                }
            } else {
                await addRecord()
                response.json({
                    success: true,
                    data: null,
                    message: "Learned successfully :)"     
                });
            }
        } else {
            await addRecord()
            response.json({
                success: true,
                data: null,
                message: "Learned successfully :)"     
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