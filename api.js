const express = require("express")
const path = require("path")
const request = require("request")
var cookieParser = require('cookie-parser')
const spotifyapi = require("./spotifyapi.js")

module.exports = function(app, con)
{
    app.post("/api/update/", function(req, res){
        console.log(req.body.track)
        var session = req.cookies.session
        
        var lobbysql = "SELECT * FROM spotifytogether.lobbies WHERE host='" + session + "'";

        con.query(lobbysql, function(err, result){
            if(err) throw err
            var lobby = result[0].lobby_id
            var users = result[0].guests
            
            spotifyapi.play(users, req.body.track)
        })
    })
}

function getlobby(session, con)
{
    var sql = "SELECT * FROM spotifytogether.lobbies WHERE host='" + session + "'";

    con.query(sql, function(err, result){
        if(err) throw err
        console.log(result[0].lobby_id + "   1")
        return result[0].lobby_id
    })
}

function getusers(lobby_id, con)
{
    var sql = "SELECT * FROM spotifytogether.lobbies WHERE lobby_id='" + lobby_id + "'";

    con.query(sql, function(err, result){
        if(err) throw err
        return result[0].guests
    })
}

function gettoken(session)
{
    var sql = "SELECT * FROM spotifytogether.users WHERE session='" + session + "'";

    con.query(sql, function(err, result){
        if(err) throw err
        return result["access_token"]
    })
}