var request = require('request');

function mapDestination(host){

  this.getDestinationInfo = function(){
    var target = null;
    if ( process.env.VCAP_SERVICES) {
      var service_info = aa ;//JSON.parse( process.env.VCAP_SERVICES);
      if(service_info.destination){
        for(var i =0;i < service_info.destination.length;i++){
          if(service_info.destination[i].name = 'c4codata'){
            target = service_info.destination[i];
            break;
          }
        }
      }
    }
    return target;
  };

  this.getAccessToken = function(){
    var oDestination = this.getDestinationInfo();
    console.log(oDestination);
    if(!oDestination){
      return null;
    }

    return new Promise(function(resolve,reject){
      var options = {
        url: oDestination.credentials.url+'/oauth/token',
        method: "POST",
        json:true,
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            'Authorization': 'Basic ' + new Buffer(oDestination.credentials.clientid+":"+oDestination.credentials.clientsecret).toString('base64')
        },
        form: {
           client_id: 'sb-clone7e73e10813ea4d508bcdb7f1f44092a0!b4070|destination-xsappname!b404',
           grant_type: 'client_credentials' }
      };
      console.log(options);
      request(options,function(error,response,data){
        console.log(data);
        if(data && data.access_token){
          resolve(data.access_token);
        }else{
          reject()
        }

      });
    });
  };

  this.getDestination = function(token){
    var oDestination = this.getDestinationInfo();
    console.log(token);
    if(!token){
      return null;
    }

    return new Promise(function(resolve,reject){
      var options = {
        url: oDestination.credentials.uri+'/destination-configuration/v1/instanceDestinations',
        method: "GET",
        json:true,
        headers: {
            "content-type": "application/json",
            'Authorization': 'Bearer ' + token
        }
      };
      request(options,function(error,response,data){
        if(data){
          resolve(data);
        }else{
          reject()
        }

      });
    });

  };


};
module.exports = mapDestination;
