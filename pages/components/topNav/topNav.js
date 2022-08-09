import React from 'react'
import Image from 'next/image'

// Services
import ImageServer from '../../../services/client/image';

const TopNav = ({CortexControl}) => {
    let theme = CortexControl.theme;
    let togglePopMenu = CortexControl.togglePopMenu;
    let popMenuState = CortexControl.popMenuState;
    let infoPage = CortexControl.infoPage;
    let botState = CortexControl.botState;

    return(
        <>
            <div className="topNav" style={{backgroundColor: theme === "Light" ? "white" : "#121212"}}>
                    <div className="topNavProfile" style={{backgroundImage: `url(${ImageServer.ProfilePicture})`}} onClick={() => togglePopMenu()}></div>
                    <div style={{width: "fit-content", height: "fit-content", float: "left"}}>
                        <h3 className="topNavTitle">Xalen</h3>
                        {botState === "Online" ? <div className="botStateIndicator"></div> : null}
                    </div>
                <img className="topNavMenuButton" src={popMenuState || infoPage ? ImageServer.CloseMenu : ImageServer.Menu} alt="pic" onClick={() => {togglePopMenu()}} />
            </div>
        </>
    )
}

export default TopNav;