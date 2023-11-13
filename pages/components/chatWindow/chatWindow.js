import React, { useState, useEffect } from 'react'
import axios from 'axios';

//Services
import DateTime from '../../../services/client/dateTime';
import Fallbacks from '../../../services/client/defaults';
import Censor from '../../../services/client/censor';
import Emoji from '../../../services/client/emoji';
import ImageServer from '../../../services/client/image';

//Defaults
let d = new Date();
let premierSpeaker = Math.random() * 10 > 5;
// premierSpeaker = true;

const ChatWindow = ({CortexControl}) => {
    const [chatHistory, setChatHistory] = useState([])
    const [typing, setTyping] = useState(false)
    const [newMsg, setNewMsg] = useState("")
    const [emojiBox, setEmojiBox] = useState(false)
    const [turn, setTurn] = useState(premierSpeaker ? "xalen" : "user")

    let botState = CortexControl.botState;
    let setBotState = CortexControl.setBotState;
    let theme = CortexControl.theme;
    let censor = CortexControl.censor;

    const scrollDown = () => {
        let chatWindowEl = document.getElementById("chatWindow")
        if (chatWindowEl) {
            setTimeout(() => chatWindowEl.scrollTo({top: chatWindowEl.scrollHeight, left: 0, behavior: 'smooth'}), 1000)
        }
    }

    useEffect(() => {
        if (premierSpeaker) {
            axios.post(`api/start`).then(re => {
                if (chatHistory.length < 1) {
                    let data = re.data.data;
                    setTurn("xalen")
                    replyMessage(data)
                }
            })
        }
    }, [])

    useEffect(() => {
        window.navigator.onLine ? setBotState("Online") : setBotState("Offline");
    }, [chatHistory])

    async function learnStuff(subject, history, newMessage) {
        let learnData = {
            alpha: history.length >= 10 ? (history[history.length - 11])?.content : null,
            beta: history.length > 9 ? (history[history.length - 10])?.content : null,
            gamma: history.length > 8 ? (history[history.length - 9])?.content : null,
            delta: history.length > 7 ? (history[history.length - 8])?.content : null,
            epilson: history.length > 6 ? (history[history.length - 7])?.content : null,
            zeta: history.length > 5 ? (history[history.length - 6])?.content : null,
            eta: history.length > 4 ? (history[history.length - 5])?.content : null,
            theta: history.length > 3 ? (history[history.length - 4])?.content : null,
            iota: history.length > 2 ? (history[history.length - 3])?.content : null,
            kappa: history.length > 1 ? (history[history.length - 2])?.content : null,
            omega: history.length > 0 ? newMessage : null
        }

        await axios.post(`api/learn/`, learnData)

        if (subject === "xalen") {
            setTurn("user")
        } else {
            await getReply(history)
        }
    }

    async function getReply(history) {
        axios.post(`api/getReply/`, { chatHistory: history }).then(re => {
            setTyping(true)

            let data = re.data.data;
            let typingDelay = 2000;
            let replyIndex = 0;

            if (data && data.length > 0) {
                const naturalReplies = data.filter(item => !Fallbacks.includes(item));
                if (naturalReplies.length > 0) data = naturalReplies;

                replyIndex = Math.floor(Math.random() * data.length);
                typingDelay = 100 * data[replyIndex].length;
            }
            scrollDown();
            setTimeout(() => replyMessage(data, replyIndex), typingDelay)
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setEmojiBox(false)

        if (turn !== "xalen") {
            if (newMsg.trim().length > 0) {
                CortexControl.setAlert(null)
                setTurn("xalen")

                let d = new Date()
                let msg = newMsg.charAt(0).toUpperCase() + newMsg.slice(1);
                msg = msg.replaceAll("_", " ")
                msg = msg.replaceAll("+", " ")
                const newMessage = {
                    parent: "user",
                    content: msg.trim(),
                    time: d
                }

                setChatHistory((history) => {
                    const updatedHistory = history.concat(newMessage);
                    learnStuff("user", updatedHistory, newMessage.content);
                    return updatedHistory;
                })
                setNewMsg("")
                scrollDown()
            }
            else {
                CortexControl.setAlert({
                    title: ["Excuse me?", "Nope.", "Hmmmmm."][Math.floor(Math.random() * 3)],
                    content: ["You might wanna type something before sending. 😒", "You can't send empty messages 😕", "How about typing something first? 🤔"][Math.floor(Math.random() * 3)],
                    button: "Got it."
                })
            }
        }
        else {
            CortexControl.setAlert({
                title: ["Really?", "Seriously?", "Kidding me?"][Math.floor(Math.random() * 3)],
                content: ["Don't type while I'm typing 😒", "At least lemme reply first? 😕", "Won't you let me reply before sending another message? 🤔"][Math.floor(Math.random() * 3)],
                button: "Got it."
            })
        }
    }

    function fallbackMessage() {
        // const currentMessage = chatHistory[chatHistory.length - 1].content;
        // axios.post(`api/addResearch/`, {researchTopic: currentMessage})

        let ignorance = Fallbacks[Math.floor(Math.random() * Fallbacks.length)]
        const ignoranceList = ignorance.split("+")
        let fallbackMessages = []
        for (let i = 0; i < ignoranceList.length; i++) {
            const newXalenMessage = {
                parent: "xalen",
                content: ignoranceList[i].trim(),
                time: d
            }
            fallbackMessages.push(newXalenMessage)
        }

        setChatHistory((history) => {
            const updatedHistory = history.concat(fallbackMessages);
            learnStuff("xalen", updatedHistory, ignorance);
            return updatedHistory;
        })
        setTyping(false)
    }

    function replyMessage(replies) {
        if (replies && replies.length > 0) {
            let replyIndex = Math.floor(Math.random() * replies.length)
            let reply = replies[replyIndex]

            let replyMessages = reply.split("+")
            let replyList = []
            let d = new Date()
            for (let i = 0; i < replyMessages.length; i++) {
                const newXalenMessage = {
                    parent: "xalen",
                    content: replyMessages[i].trim(),
                    time: d
                }
                replyList.push(newXalenMessage)
            }

            setChatHistory((history) => {
                const updatedHistory = history.concat(replyList);
                learnStuff("xalen", updatedHistory, reply);
                return updatedHistory;
            })
            setTyping(false)
        }
        else fallbackMessage()
    }

    return(
        <>
            <div className="chatWindow" id="chatWindow">
                <h3 className="dateTimeDisplay" style={{color: "white", backgroundColor: "rgba(0,0,0,0.3)"}}>{DateTime.getDateFormatOne()}</h3>
                {
                    chatHistory.map((message) =>
                        <div className="chatMessage" key={message.time}>
                            <h3 className="chatContent" style={{float: message.parent === "xalen" ? "left" : "right", backgroundImage: message.parent === "user" ? "none" : null, color: message.parent === "user" ? "var(--blue)" : "var(--white)"}}>
                                {Censor.CensorText(message.content, censor)}
                            </h3>
                            <h4 className="chatMessageTime" style={{
                                textAlign: message.parent === "xalen" ? "left" : "right",
                                float: message.parent === "xalen" ? "left" : "right",
                                transform: message.parent === "xalen" ? "translate(15px, 0px)" : "translate(-15px, 0px)"}}
                            >{DateTime.formatTime(message.time)}</h4>
                        </div>
                    )
                }
                {
                    typing ?
                    <div className="chatMessage">
                        <h3 className="chatContentTyping" style={{float: "left"}}>...</h3>
                    </div> : null
                }
                <div className="chatInputDock">
                    <form onSubmit={handleSubmit}>
                        <input type="text" className="chatInputDockField" value={newMsg} onChange={(el) => setNewMsg(el.target.value)} 
                            style={{backgroundColor: theme === "Light" ? "white" : "#121212", color: theme === "Light" ? "#121212" : "white"}}
                            placeholder="Type your message here..." onClick={() => setEmojiBox(false)} />
                        <button className="chatInputDockSubmit"><img src={ImageServer.SendMessage} alt="Send" /></button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ChatWindow;
