var environment = {}

environment.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName': 'staging',
    'hashingSecret':'secret'
}

environment.production = {
   'httpPort' : 5000,
   'httpsPort' : 5000,
   'envName' : 'production',
   'hashingSecret':'secret'
}

//determin which environment was passed as commadline argument

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

//make sure current environment is running or default to staging
var environmentToExport = typeof(environment[currentEnvironment]) == 'object' ? currentEnvironment : environment.staging;

module.exports = environmentToExport

