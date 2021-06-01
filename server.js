const express = require('express');
const app = express();
const socket = require('socket.io'); // web socket 사용을 위한 라이브러리
const http = require('http'); // express와 같은 역할의 node의 내장 모듈, express의 기본형
                                                // -> 소켓과 연결하기 위해 사용
const server = http.createServer(app); // http server 안에 express로 반환되어 연결됨
const io = socket(server); // web socket과 서버를 연결 
const nunjucks = require('nunjucks');
const cors = require('cors');



app.use(cors());
app.use(express.static('./node_modules/socket.io/client-dist'));
app.set('view engine', 'html');
nunjucks.configure('views',{
    express: app,
})


app.get('/', (req, res)=>{
    res.render('index');
})

    // on은 addEventListener와 비슷한 역할로 연결을 등록해주는..?
    // 첫번째 인자에 발생할 event -> 'connection', 두번째 인자는 callback(socket)
io.sockets.on('connection', (socket)=>{  // 클라이언트(html, js)의 socket.on의 요청을 받아 응답을 줌
    socket.on('send', (data)=>{ 
        console.log(`client에서 받은 메시지 ${data.msg}`);
        socket.broadcast.emit('call',data.msg); 
                // 'call'이라는 이름으로 data.msg를 메시지 요청을 보낸 client를 제외한 사용자에게 메시지 전달 -> socket.on()으로
        
    })
})

server.listen(3000, ()=>{  // app 이 아니라 server로 listen을 해줘야한다
    console.log('it works! 3000')
})