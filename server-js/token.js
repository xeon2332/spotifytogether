// access_token: Token used in spotify api calls
// session: Session cookie used by spotifytogether
var conn = null;

// Setup function to setup connection variable
exports.setup = function(con)
{
    if(con.state == "disconnected")
        console.log("Failed during setup of token functions.")
    else
        conn = con
}

function execquery(query, callback)
{
    conn.query(query, function(err, result){
        if(err) throw err
        return callback(result)
    })
}

exports.getsession = function(token, callback)
{
    var sql = "SELECT session FROM spotifytogether.users WHERE access_token='"
              + token + "'"
    execquery(sql, function(result){
        callback(result[0].session)
    })
}

exports.gettoken = function(session, callback)
{
    var sql = "SELECT access_token FROM spotifytogether.users WHERE session='"
              + session + "'"
    execquery(sql, function(result){
        callback(result[0].token)
    })
}
