var _data = require('./data')
var helpers = require('./helpers')

//creating the routes handlers
var handlers = {}

//sample handler
handlers.sample = function(data,callback){
    callback(409,{'name':'sample handler'})
};
handlers.ping = function(data,callback){
    callback(200);
}
//notFound handler
handlers.notFound = function(data,callback){
callback(404);
};
handlers.users = {}
//path for users
handlers.users = function(data,callback){
var acceptableMehods = [ 'get', 'post', 'put', 'delete' ]
if(acceptableMehods.indexOf(data.method) > -1){
    handlers.users[data.method](data,callback);
}else{
    callback(405)
}
}

//Methods used byt the users handler
handlers.users.get = function(data,callback){
    //check that the pgone number is valid
    var phone = typeof(data.queryStringObject.Phone) =='string' && data.queryStringObject.Phone.trim().length == 10 ? data.queryStringObject.Phone : false
    if(phone){
        _data.read('user',phone,function(err,data){
            if(!err && data){
                //remove the hashed password before returning it to the requester
                delete data.Password
                callback(200,data)
            }else{
                callback(404)
            }
        })
    }else{
        callback(400,'missing required field')
    }
}

handlers.users.post = function(data,callback){  
  var firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName : false;
  var lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName : false;
  var Phone = typeof(data.payload.Phone) === 'string' && data.payload.Phone.trim().length == 10 ? data.payload.Phone : false;
  var Password = typeof(data.payload.Password) === 'string' ? data.payload.Password : false;
  var tosAggreement = typeof(data.payload.tosAggreement) == 'boolean' ? data.payload.tosAggreement : false;
  if(firstName && lastName && Phone && Password && tosAggreement){
    _data.read('user',Phone,function(err){
        if(err){
          var hashpassword = helpers.hash(Password)
          if( hashpassword ){
            var userObject = {
                firstName:firstName,
                lastName:lastName,
                Phone:Phone,
                Password:hashpassword
              }
              _data.create('users',Phone,userObject,function(err){
                if(err){
                    callback('user creation failed');
                }else{
                    console.log('success')
                    callback(200);
                }
              })
          }else{
            callback('could not hash the user\'s password');
          }
        }else{
            callback(409,{'Error':'Passoword already exists'});
        }
    })

  }else{
    callback(404,{'Error':'Missing required fields'});
  }
}
handlers.users.delete = function(data,callback){
}
handlers.users.put = function(data,callback){   
}

module.exports = handlers;
