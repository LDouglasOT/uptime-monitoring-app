var fs = require('fs')
var path = require('path')

var lib = {}
lib.baseDir =path.join(__dirname,'../.data/')


//create data and file
lib.create = function(dir, file, data, callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to string
            var stringData  = JSON.stringify(data);
            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(err){
                            callback('error closing new file');
                        }else{
                            callback(false);
                        };
                    })
                }else{
                    callback('error writing data');
                };
            });
        }else{
            callback('could not create a new file, it may already exists');
        };
    });
};


//read data from a file

lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err,data){
        callback(err,data);
    });
}

//update file data
lib.update = function(dir,file,data,callback){
   fs.open(lib.baseDir+'/'+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
    if(!err && fileDescriptor){
        var stringData = JSON.stringify(data)
        console.log(fileDescriptor)
        fs.ftruncate(fileDescriptor,function(err){
            if(!err){
                fs.writeFile(fileDescriptor,stringData,function(err){
                    if(!err){
                       fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false)
                        }else{
                            callback('error closing the file')
                        }
                       })
                    }else{
                        callback('error writing to existing file')
                    }
                })
            }else{
                callback(err)
            }
        })
    }else{
        callback('Faild to open file, it may not exist yet');
    }
   })
}


lib.delete = function(dir,file,callback){
    fs.unlink(lib.baseDir+'/'+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false);
        }else{
            callback(err);
        }
    })
}

module.exports = lib