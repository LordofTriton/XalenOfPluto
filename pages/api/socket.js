import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
    let Yggdrasil = {
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
    if (res.socket.server.io) {
        console.log('Socket is already running!')
    } 
    else {
        console.log('Socket is initializing...')
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on('connection', socket => {
            socket.on('getYggdrasil', data => {
                console.log("Here!")
                socket.broadcast.emit('yggdrasil' + data, Yggdrasil)
            })

            socket.on('learnStuff', data => {
                Yggdrasil = {...Yggdrasil, ...data}
                socket.broadcast.emit('updateYggdrasil', data)
            })
        })
    }
    res.end()
}

export default SocketHandler;