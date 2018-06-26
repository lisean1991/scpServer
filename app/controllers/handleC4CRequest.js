var request = require('request');
var parseString = require('xml2js').parseString;
function handleC4CRequest(){
  this.getDataFromC4C = function(filter,entity){
    var sService = entity.service?entity.service:"c4codata";
    var sUrl = entity.url?entity.url:"https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/";
    var url = sUrl+sService+"/"+entity.collection+"?$filter="+filter;
    console.log("REQUEST URL==" + url);
      var options = {
        url: url,
        method: "GET",
        json:true,
        headers: {
            "content-type": "application/json",
            'Authorization': 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64')
        }
    //    proxy:"http://proxy.wdf.sap.corp:8080"
  //       host:'proxy.hkg.sap.corp',
  //       port:'8080'
      };

   return new Promise(function(resolve,reject){
     console.log("fuck!!!");
     request(options,function(error,response,data){
       if(data && data.d && data.d.results.length > 0){
         resolve(data.d.results);
       }else {
         reject({message:"No data found!"});
       }

       if(error){
         reject(error);
       }

     });
   });
  };

  this.getDataFromC4CByKey = function(key,entity){
    var sService = entity.service?entity.service:"c4codata";
    var url = "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/"+sService+"/"+entity.collection+"(\'"+key+"\')";
    console.log(url);
      var options = {
        url: url,
        method: "GET",
        json:true,
        headers: {
            "content-type": "application/json",
            'Authorization': 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64')
        }
      };

   return new Promise(function(resolve,reject){
     request(options,function(error,response,data){
       if(data && data.d && data.d.results){
         resolve(data.d.results);
       }else {
         reject({message:"No data found!"});
       }

       if(error){
         reject(error);
       }

     });
   });
  };

  this.updateC4CDate = function(entity,objId){
    var url = "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codata";
      var getTokenOptions = {
        url: url+"/"+entity+"(\'"+objId+"\')",
        method: "GET",
        json:true,
        headers: {
            "content-type": "application/json",
            'Authorization': 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64'),
            "x-csrf-token" :"fetch"
        }
      };
  return new Promise(function(resolve,reject){
      var requestC = request.defaults({jar: true});
      requestC(getTokenOptions,function(error,response,body){
        var csrfToken = response.headers['x-csrf-token'];
        if(!csrfToken){
          reject({message:"Token error!"});
          return;
          }
        if(body && body.d && body.d.results ){
          var newData = body.d.results;
          newData.Subject = body.d.results.Subject+"(Confirmed)";
          var updateOptions = {
            url: url+"/"+entity+"(\'"+objId+"\')",
            method: "PUT",
            json:true,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': csrfToken
            },
            body:newData
          };
          console.log(body);
          requestC(updateOptions,function(error,response,data){
            console.log(data);
            if(error){
              reject(error.message);
            }else{
              resolve("Confrim successfully!");
            }

          });
        }
        });
      });
  };


}

module.exports = handleC4CRequest;
