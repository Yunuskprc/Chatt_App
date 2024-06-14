const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static/image', express.static(path.join(__dirname, 'static/image')));

const loginRouter = require('./routers/loginRouter');
const usersRouter = require('./routers/userRouter')(io);
const adminRouter = require('./routers/adminRouter');

app.use('/auth', loginRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);

server.listen(8080, () => {
    console.log('Sunucu çalıştı');
});

module.exports = {
    app,
};
