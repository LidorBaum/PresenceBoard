const express = require('express');
const companyRouter = require('./apis/company.routes');
const authRouter = require('./apis/auth.routes');
const cors = require('cors')

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    };
    app.use(cors(corsOptions));
}

app.use('/api/company', companyRouter);
app.use('/api/auth', authRouter);

const port = process.env.PORT || 4444;
app.listen(port, () => console.log(`Listening on port ${port}...`));