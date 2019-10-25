const request = require("request")
var querystring = require('querystring')

exports.play = function(token, track)
{
    console.log("Playing track " + track + " to user: " + token)
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