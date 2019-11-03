const request = require("request")
var querystring = require('querystring')

exports.play = function(token, track)
{
    var trackarr = [track]

    request({
        method: "PUT",
        uri: "https://api.spotify.com/v1/me/player/play",
        headers:
        {
            "content-type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ uris: trackarr }),
        json: true
    }, function(req, res){
    })
}

exports.getsong = function(token, callback)
{
    request({
        method: "GET",
        uri: "https://api.spotify.com/v1/me/player/currently-playing",
        headers:
        {
            "content-type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + token
        }
    }, function(req, res){
        var j = JSON.parse(res.body)
        var song = j["item"]["uri"]
        return callback(song)
    })
}
