// Global variables
var track = ""

function getcookie(cookie_name)
{
    var name = cookie_name + "="
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(';')

    for(var i = 0; i <ca.length; i++)
    {
        var c = ca[i];
        while (c.charAt(0) == ' ')
        {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0)
        {
          return c.substring(name.length, c.length)
        }
    }
    return ""
}

function checkspotify()
{
    // Contacting spotify for track info
    $.ajax({
        type: "GET",
        url: "https://api.spotify.com/v1/me/player/currently-playing",

        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + getcookie("token")
        }
    }).done(function(data){
        var j = JSON.parse(data)
        var item = j["item"]["uri"]

        if(item == track)
            return
        else
            send(track)
    })

    setTimeout(checkspotify, 350)
}

function send(track)
{
    $.ajax({
        type: "PUT",
        url: "localhost:1337/api/play/",

        forms: {
            track: track
        },

        headers: {
            "Authorization": "Bearer " + getcookie("session")
        },
    })
}
