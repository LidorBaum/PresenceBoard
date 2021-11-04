const express = require('express');
const companyRouter = require('./apis/company.routes');

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/company', companyRouter);

const port = process.env.PORT || 4444;
app.listen(port, () => console.log(`Listening on port ${port}...`));