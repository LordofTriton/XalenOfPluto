import React from 'react'

// Services
import ImageServer from '../../../services/client/image';

const Offline = ({CortexControl}) => {
    let theme = CortexControl.theme;
    let botState = CortexControl.botState;
    let setBotState = CortexControl.setBotState;

    const retryConnection = () => {
        window.navigator.onLine ? setBotState("Online") : setBotState("Offline");
    }

    return(
        <>
            <div className="dimmer" style={{display: botState === "Offline" ? "block" : "none", opacity:  botState === "Offline" ? "1" : "0"}}>
            </div>
            <div className="offlineContainer" style={{display: botState === "Offline" ? "block" : "none", backgroundImage: theme === "Light" ? "url("+ImageServer.LightBckg+")" : "url("+ImageServer.DarkBckg+")"}}>
                <h3 className="offlineTitle" style={{color: theme === "Light" ? "black" : "white"}}>No Internet Connection</h3>
                <button className="retryButton" onClick={() => retryConnection()}>Retry</button>
            </div>
        </>
    )
}

export default Offline;