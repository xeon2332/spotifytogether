// Global variables
var str = $(location).attr("pathname")
var id = str.substring(str.indexOf("/", 2) + 1, str.length)

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
        var item = data["item"]["uri"]
        if(getcookie("track") != item)
            send(item)
    })

    setTimeout(checkspotify, 350)
}

function send(track)
{
    document.cookie = "track=" + track
    $.ajax({
        type: "post",
        url: "http://localhost:1337/api/update/",

        data: {
            track: track,
            lobby: id
        },

        headers: {
            "Authorization": "Bearer " + getcookie("session")
        },
    })
}
