const express = require("express")
const app = express()
const pug = require("pug")
const mysql = require("mysql")
const path = require("path")
const request = require("request")
var cookieParser = require('cookie-parser')
app.use(cookieParser())
const sapi = require("./server-js/spotifyapi.js")
const port = 1337

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
})

app.use('/static', express.static(path.join(__dirname, 'client-js')))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

con.connect(function(err){
    if (err) throw err;
    console.log("Connected to mysql server");
})

const api = require("./server-js/api.js")(app, con)
const token = require("./server-js/token.js")

token.setup(con)

app.get("/", function(req, res){
    if(req.cookies.session == null)
        res.sendFile(path.join(__dirname+"/index.html"))
    else
        res.render("index", { username: "test" })
})

app.get("/createlobby/", function(req, res){
    // Generate lobby id
    var lobby_id = Math.random().toString(36).substring(6)
    var expiration = Math.floor((new Date().getTime() / 1000) + 3600)
    var host = req.cookies.session
    var sql = "INSERT INTO spotifytogether.lobbies (lobby_id, host, expiration) VALUES ( '" + lobby_id + "','" + host + "','" + expiration + "')"

    con.query(sql, function(err, result){
        if(err) throw err

        token.gettoken(req.cookies.session, function(token){
            res
                .cookie("hosting", lobby_id)
                .cookie("token", token)
                .redirect("/lobby/" + lobby_id)
        })
    })
})

app.get("/lobby/:id", function(req, res){
    var lobby_id = req.params.id
    if(req.cookies.hosting == lobby_id)
        res.render("lobby", { msg: "hosting lobby " + lobby_id })
    else
    {
        var session = req.cookies.session
        var sql = "UPDATE spotifytogether.lobbies SET guests='" + session
                + "' WHERE lobby_id='" + lobby_id + "'"

        con.query(sql, function(err, result){
            var host_sql = "SELECT host FROM spotifytogether.lobbies WHERE lobby_id='" +
                           lobby_id + "'"
            con.query(host_sql, function(err, result){
                token.gettoken(result[0].host, function(htoken){
                    // Play song on joining accounts player
                    sapi.getsong(htoken, function(track){
                        token.gettoken(req.cookies.session, function(ltoken){
                            sapi.play(ltoken, track)
                        })
                    })
                })
            })

            res.render("lobby", { msg: "joined lobby" })
        })
    }
})

app.get("/spotifylogin/", function(req, res){
    request.post({
        url: "https://accounts.spotify.com/api/token",
        form: {
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: "http://localhost:1337/spotifylogin/",
            client_id: "e1e37ca062f34bfe91907973c15353ca",
            client_secret: "****"
        },
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        }
    }, function callback(err, ress, body){
        if(ress.statusCode == 200)
        {
            var j = JSON.parse(body)
            var date = new Date()
            var expiration = Math.round(date.getTime() / 1000) + j["expires_in"]

            // Storing in database
            token.gensession(j["access_token"], j["refresh_token"], expiration,
            function(session){
                res
                    .cookie("session", session, { maxAge: parseInt(expiration, 10) })
                    .redirect("http://localhost:1337")
            })
        }
    })
})

app.set('view engine', 'pug')

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
