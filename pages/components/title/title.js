import React from 'react'

// Services
import ImageServer from '../../../services/client/image';

const Title = ({CortexControl}) => {
    let toggle = CortexControl.titleDisplay;
    let control = CortexControl.setTitleDisplay;
    let theme = CortexControl.theme;

    setTimeout(() => control(false), 10000)
    
    return(
        <div className="titleContainer" style={{marginLeft: toggle ? "0px" : "-100vw", backgroundImage: theme === "Light" ? "url("+ImageServer.LightBckg+")" : "url("+ImageServer.DarkBckg+")"}}>
            {/* <img className="titleLogo" src={logo} alt="logo" /> */}
            {/* <div className="titleProfile" style={{backgroundImage: "url("+profilePicture+")"}}></div>
            <div className="titleLoader" style={{width: ((loader / 10) * 50) + "vw", display: toggle ? "block" : "none"}}></div> */}
            <div className="drawing" id="loading">
                <div className="loadingDot"></div>
            </div>
        </div>
    )
}

export default Title;