import React, { useState } from 'react'
import "./components/alert/alert.css"
import "./components/chatWindow/chatWindow.css"
import "./components/infoPage/infoPage.css"
import "./components/infoPage/infoPage.css"
import "./components/offline/offline.css"
import "./components/popMenu/popMenu.css"
import "./components/title/title.css"
import "./components/title/loader.css"
import "./components/topNav/topNav.css"
import "./index.css"

//Components
import Title from './components/title/title';
import TopNav from './components/topNav/topNav';
import ChatWindow from './components/chatWindow/chatWindow';
import Offline from './components/offline/offline';
import Alert from './components/alert/alert';
import PopMenu from './components/popMenu/popMenu';
import InfoPage from './components/infoPage/infoPage';

//Images
let lightBckg = '/images/lightThemeBckg.png';
let darkBckg = '/images/dark1.jpg';

let profilePicture = '/images/yellow.jpg';

const Cortex = () => {
    const [titleDisplay, setTitleDisplay] = useState(true)
    const [botState, setBotState] = useState("Online");
    const [theme, setTheme] = useState("Light")
    // const [theme, setTheme] = useState(localStorage.getItem("XalenTheme") ? localStorage.getItem("XalenTheme") : "Light")
    const [popMenuState, setPopMenuState] = useState(false)
    const [censor, setCensor] = useState("Off")
    // const [censor, setCensor] = useState(localStorage.getItem("XalenCensor") ? localStorage.getItem("XalenCensor") : "Off")
    const [infoPage, setInfoPage] = useState(false)
    const [alert, setAlert] = useState({
        title: "Hello!",
        content: ["I'm Xalen. Welcome to my chat app! 😎", "I'm Xalen. You're gonna love me 🥰", "I'm Xalen. Can't wait to chat with you 😋"][Math.floor(Math.random() * 3)],
        button: "Continue."
    })

    function toggleTheme() {
        if (theme === "Light") {
            setTheme("Dark")
            // localStorage.setItem("XalenTheme", "Dark")
        }
        else {
            setTheme("Light")
            // localStorage.setItem("XalenTheme", "Light")
        }
    }

    function toggleCensor() {
        if (censor === "On") {
            setCensor("Off")
            // localStorage.setItem("XalenCensor", "Off")
        }
        else {
            setCensor("On")
            // localStorage.setItem("XalenCensor", "On")
        }
    }

    function togglePopMenu() {
        if (botState === "Online") {
            setPopMenuState(!popMenuState)
            setInfoPage(false)
        }
    }

    const CortexControl = {
        profilePicture,
        titleDisplay,
        setTitleDisplay,
        botState,
        setBotState,
        theme,
        setTheme,
        popMenuState,
        setPopMenuState,
        censor,
        setCensor,
        togglePopMenu,
        toggleTheme,
        toggleCensor,
        infoPage,
        setInfoPage,
        alert,
        setAlert
    }

    return(
      <div className="backDrop" style={{backgroundColor: theme === "Light" ? "slategrey" : "hsla(0, 0%, 7%, 0.952)"}}>
        <Title CortexControl={CortexControl} />
        <div className="displayContent" style={{backgroundImage: theme === "Light" ? "url("+lightBckg+")" : "url("+darkBckg+")"}}>
            <TopNav CortexControl={CortexControl} />
            <ChatWindow CortexControl={CortexControl} />
            <PopMenu CortexControl={CortexControl} />
            <Offline CortexControl={CortexControl} />
            <InfoPage CortexControl={CortexControl} />
            {alert ? <Alert CortexControl={CortexControl} /> : null}
        </div>
      </div>
    )
}

export default Cortex;