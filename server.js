const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');

require('dotenv').config();
require('colors');

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Corrected route path
app.use('/api/users', userRoute);

app.get('*', function (req, res) {
    console.log(req.body);
    console.log('Endpoint does not exist');
    res.status(404).send('Endpoint does not exist');
});

const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.red)
);
