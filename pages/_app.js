
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

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

let profilePicture = '/images/pink.png';

const Cortex = () => {
    const [titleDisplay, setTitleDisplay] = useState(true)
    const [botState, setBotState] = useState("Online");
    const [theme, setTheme] = useState("Light")
    const [popMenuState, setPopMenuState] = useState(false)
    const [censor, setCensor] = useState("Off")
    const [infoPage, setInfoPage] = useState(false)
    const [alert, setAlert] = useState({
        title: "Hello!",
        content: ["I'm Xalen. Welcome to my chat app! 😎", "I'm Xalen. You're gonna love me 🥰", "I'm Xalen. Can't wait to chat with you 😋"][Math.floor(Math.random() * 3)],
        button: "Continue."
    })
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (localStorage.getItem("XalenTheme")) setTheme(localStorage.getItem("XalenTheme"))
            else setTheme("Light")
            if (localStorage.getItem("XalenCensor")) setCensor(localStorage.getItem("XalenCensor"))
            else setCensor("Off")

            setReady(true)
        }
    }, [])

    function toggleTheme() {
        if (theme === "Light") {
            setTheme("Dark")
            localStorage.setItem("XalenTheme", "Dark")
        }
        else {
            setTheme("Light")
            localStorage.setItem("XalenTheme", "Light")
        }
    }

    function toggleCensor() {
        if (censor === "On") {
            setCensor("Off")
            localStorage.setItem("XalenCensor", "Off")
        }
        else {
            setCensor("On")
            localStorage.setItem("XalenCensor", "On")
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
        <>
            <Head>
                <meta charset="utf-8" />
                <link rel="icon" href="/titleLogo.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <meta name="theme-color" content="#000000" />
                <meta
                    name="description"
                    content="Xalen is a self learning conversational chatbot designed to hold funny and witty conversations with users through artificial intelligence methods that enable the program to communicate like an actual human being."
                />
                <meta
                    name="keywords"
                    content="Xalen, Xalen Chatbot, Fun Chatbot, Free Chatbot Online, Alien from Pluto, Xalen Artificial Intelligence, Alien Artificial Intelligence"
                />
                <meta
                    name="author"
                    content="Joshua Agboola"
                />
                <meta name="google-site-verification" content="hL-o1WyrraUQmzGzqoJ9B2bSzJwRHo06Rbw2aElLwpU" />
                <title>Xalen - Chat With An Alien From Pluto.</title>
            </Head>

            {
                ready ?
                <div className="backDrop" style={{backgroundColor: theme === "Light" ? "#E5E5E5" : "hsla(0, 0%, 7%, 0.952)"}}>
                    <Title CortexControl={CortexControl} />
                    <span className="titleLargeRight">Xalen</span>
                    <span className="titleLargeLeft">Xalen</span>

                    <div className="displayContent" style={{backgroundImage: theme === "Light" ? "url("+lightBckg+")" : "url("+darkBckg+")"}}>
                        <TopNav CortexControl={CortexControl} />
                        <ChatWindow CortexControl={CortexControl} />
                        <PopMenu CortexControl={CortexControl} />
                        <Offline CortexControl={CortexControl} />
                        <InfoPage CortexControl={CortexControl} />
                        {alert ? <Alert CortexControl={CortexControl} /> : null}
                    </div>
                </div>
                : null
            }
        </>
    )
}

export default Cortex;