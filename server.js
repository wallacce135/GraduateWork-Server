const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "wallacce135",
    password: "Olof0re1351",
    database: "profresouce"
});

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) =>{
    pool.query('SELECT * FROM articles', function(err, data){
        if(err) return console.log(err);

        res.send(data);
    })
});

app.post("/newUser", (req, res)=>{
    pool.query(`INSERT INTO Users (user_login, user_password, user_email) VALUES (?,?,?)`, [req.body.user.Login, req.body.user.Password, req.body.user.Email], function(err, data){
        if(err) return console.log(err);

        res.redirect('/');
    })
})

app.post("/login", (req, res) =>{
    pool.query(`SELECT * FROM Users WHERE user_login=? AND user_password=?`, [req.body.login, req.body.password], function (err, data){
        if(err) return console.log(err);
        res.send(data);
    })
})

app.get("/tips", (req, res)=>{
    pool.query('SELECT * FROM tips', function(err, tips){
        if(err) return console.log(err);
        res.send(tips);
    })
})

app.post("/uploadNewArticle", (req, res)=>{
    pool.query(`INSERT INTO Articles(article_title, article_text, user_id) VALUES (?, ?, ?)`, [req.body.payload.payload.artTitle, req.body.payload.payload.artText, req.body.payload.payload.user_id], function(err, data){
        if(err) return console.log(err);
        res.redirect("/");
    });
})

app.post('/getArticle', (req, res)=>{
    pool.query(`SELECT * FROM Articles WHERE (article_id) = ?`, [req.body.article_id], function(err, data){
        if(err) return console.log(err);
        res.send(data);
    }) 
})

app.post('/getComments', (req, res) =>{ 
    pool.query(`SELECT * FROM comments WHERE (article_id) = ?`, [req.body.article_id], function(err, data){
        if(err) return console.log(err);
        res.send(data);
    })
})

app.post('/getCurrentUser', (req, res) =>{
    pool.query(`SELECT user_login FROM Users WHERE (user_id) = ?`, [req.body.user_id], function(err, data){
        if(err) return console.log(err);
        res.send(data);
    })
})

app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`)
});

module.exports = app;