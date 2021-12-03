const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const cookieParser = require('cookie-parser')


const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http ,{
    cors: {
        origin: "http://localhost:3000  ",
        methods: ["GET", "POST"],
        transports: ['websocket'],
        credentials: true
    },
    allowEIO3: true
})

// app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.static('public'));


// app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'presenceboard',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

if (process.env.NODE_ENV === 'production') {
    console.log('it is production environment')
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true,
        allowedHeaders: ["content-type"]
    };
    app.use(cors(corsOptions));
}
const companyRouter = require('./apis/company.routes');
const authRouter = require('./apis/auth.routes');
const employeeRouter = require('./apis/employee.routes')
const connectSockets = require('./apis/socket/socket.routes')

app.use('/api/company', companyRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/auth', authRouter);
connectSockets(io)


app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

const port = process.env.PORT || 4444;
// app.listen(port, () => console.log(`Listening on port ${port}...`));
http.listen(port, () => console.log(`Listening on port ${port}...`));