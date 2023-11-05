const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const bd = require('./db');
const router = require('./routes');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router); 
app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');
app.set('Views', path.join(__dirname, 'views'));


app.listen(8080, () => {
    console.log("Servidor rodando");
});
