var crypto = require('crypto')
var config = require('../config')
var helpers= {}

helpers.hash = function(pwd){
 if(typeof(pwd) === 'string' && pwd.length > 0 ){
    var hashedpwd = crypto.createHmac('sha256',config.hashingSecret).update(pwd).digest('hex')
    return hashedpwd
 }else{
    return false
 }
}

helpers.parseJsonToObject = function(buffer){
    try{
        var obj = JSON.parse(buffer)
        return obj
    }catch{
        return []
    }
}
module.exports = helpers