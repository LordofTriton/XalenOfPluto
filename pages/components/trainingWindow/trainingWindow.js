import React, { useState, useEffect } from 'react'
import axios from 'axios';

import trainingData from '../../../services/client/training';

//Services
import DateTime from '../../../services/client/dateTime';
import Censor from '../../../services/client/censor';

const TrainingWindow = ({CortexControl}) => {
    const [trainingHistory, setTrainingHistory] = useState([])
    const [typing, setTyping] = useState(false)

    let censor = CortexControl.censor;

    const scrollDown = () => {
        let trainingWindowEl = document.getElementById("trainingWindow")
        if (trainingWindowEl) {
            setTimeout(() => trainingWindowEl.scrollTo({top: trainingWindowEl.scrollHeight, left: 0, behavior: 'smooth'}), 1000)
        }
    }

    useEffect(() => {
        train(trainingData, trainingHistory);
    }, [])

    async function train(data, history) {
        const message = data[0];
        if (!message) return;

        if (message === "XALEN_CLEAR") {
            setTrainingHistory([]);

            const updatedTrainingData = data.slice(1);
            setTimeout(() => train(updatedTrainingData, []), 5000);
        }
        else {
            setTyping(true);

            let learnData = {
                alpha: history.length > 9 ? history[history.length - 10] : null,
                beta: history.length > 8 ? history[history.length - 9] : null,
                gamma: history.length > 7 ? history[history.length - 8] : null,
                delta: history.length > 6 ? history[history.length - 7] : null,
                epilson: history.length > 5 ? history[history.length - 6] : null,
                zeta: history.length > 4 ? history[history.length - 5] : null,
                eta: history.length > 3 ? history[history.length - 4] : null,
                theta: history.length > 2 ? history[history.length - 3] : null,
                iota: history.length > 1 ? history[history.length - 2] : null,
                kappa: history.length > 0 ? history[history.length - 1] : null,
                omega: message
            }

            await axios.post(`api/learn/`, learnData);

            const updatedHistory = history.concat(message);
            setTrainingHistory(history);

            setTyping(false)

            scrollDown();

            const updatedTrainingData = data.slice(1);
            setTimeout(() => train(updatedTrainingData, updatedHistory), 5000);
        }
    }

    return(
        <>
            <div className="trainingWindow" id="trainingWindow">
                <h3 className="dateTimeDisplay" style={{color: "white", backgroundColor: "rgba(0,0,0,0.3)"}}>Training Mode</h3>
                {
                    trainingHistory.map((message, index) =>
                        <div className="trainingMessage" key={index}>
                            <h3 className="trainingContent" style={{
                                float: index % 2 === 0 ? "left" : "right",
                                backgroundImage: index % 2 === 1 ? "none" : null,
                                color: index % 2 === 1 ? "var(--blue)" : "var(--white)"
                            }}>
                                {Censor.CensorText(message, censor)}
                            </h3>
                            <h4 className="trainingMessageTime" style={{
                                textAlign: index % 2 === 0 ? "left" : "right",
                                float: index % 2 === 0 ? "left" : "right",
                                transform: index % 2 === 0 ? "translate(15px, 0px)" : "translate(-15px, 0px)"}}
                            >{DateTime.formatTime(new Date())}</h4>
                        </div>
                    )
                }
                {
                    typing ?
                    <div className="trainingMessage">
                        <h3 className="trainingContentTyping" style={{
                            float: trainingHistory.length % 2 === 1 ? "left" : "right",
                            backgroundImage: trainingHistory.length % 2 === 1 ? "none" : null,
                            color: trainingHistory.length % 2 === 1 ? "var(--blue)" : "var(--white)"
                        }}>...</h3>
                    </div> : null
                }
            </div>
        </>
    )
}

export default TrainingWindow;
