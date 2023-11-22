const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const authenticateToken = require('./middleware/authenticateToken');
const app = express();
const bd = require('./db');
const router = require('./routes');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');
app.set('Views', path.join(__dirname, 'views'));


app.listen(8000, () => {
    console.log("Servidor rodando");
});
app.use(cookieParser());
app.use(authenticateToken);
app.use(router);