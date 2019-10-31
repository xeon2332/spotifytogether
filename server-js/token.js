// access_token: Token used in spotify api calls
// session: Session cookie used by spotifytogether
var conn = null;

// Setup function to setup connection variable
exports.setup = function(con)
{
    conn = con
}

exports.gensession = function(access_token, refresh_token, expiration, callback)
{
    // Generating session key
    var session = ""
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 200; i++) {
        session += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Inserting token into mysql
    execquery(
      "INSERT INTO spotifytogether.users (session, access_token, refresh_token, expiration) VALUES ('" +
      session + "','" + access_token + "', '" +
      refresh_token + "', '" + expiration + "')", function(result){
          return callback(session)
      })
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
