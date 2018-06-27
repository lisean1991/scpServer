var request = require('request'),
    oDestination = require(process.cwd() + '/app/controllers/destination.js'),
    oHandleC4CRequest = require(process.cwd() + '/app/controllers/handleC4CRequest.js');

var Multipart = require('multiparty');
var multer = require('multer');
var FormData = require('form-data');

var upload = multer({dest:'upload/'});

var fs = require('fs');
var crypto = require('crypto');
var superagent = require('superagent');
var URL = require('url');
var DESTINATION_MAP = require(process.cwd() + '/app/desination_map.js');

module.exports = function (app) {
  var that = this;

  //this.DESTINATION_MA = {};
   // this.DESTINATION_MA={
   //  "localhost": {
   //       "Name": "c4c",
   //       "Type": "HTTP",
   //       "URL": "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codata",
   //       "Authentication": "BasicAuthentication",
   //       "ProxyType": "Internet",
   //       "Description": "c4c retrive data",
   //       "User": "crmops",
   //       "Password": "Ondemand1"
   //   }
   // };
  console.log("begain");
  var handleC4CRequest = new oHandleC4CRequest();
  var handleDestination = new oDestination();

  app.route('/api/v1/*').get(function(req, res) {
    var sHost = req.hostname === "localhost" ?req.hostname: req.hostname.split(".")[0];
    console.log(URL.parse(req.url));
    console.log(DESTINATION_MAP.getAll());
    console.log(DESTINATION_MAP.getProperty(req.hostname));
    var requestPath = URL.parse(req.url).href.split("/api/v1/")[1];
    var destination = DESTINATION_MAP.getProperty(sHost);
    superagent.get(destination.URL+requestPath)
    .set('Authorization','Basic ' + new Buffer(destination.User+":"+destination.Password).toString('base64'))
    .set("x-csrf-token","fetch")
    .query({"$format":"json"})
    .end(function(err,response){
      destination.x_csrf_token = response.headers['x-csrf-token'];
      destination.cookie = response.headers.cookie;
      console.log(response.headers.cookie);
      res.send(response.body);
    });
  });

  app.route('/api/v1/*').post(function(req, res) {
    var sHost = req.hostname === "localhost" ?req.hostname: req.hostname.split(".")[0];
    var requestPath = URL.parse(req.url).href.split("/api/v1/")[1];
    var destination = DESTINATION_MAP.getProperty(sHost);
    var getTokenOptions = {
      url: destination.URL+"$metadata",
      method: "GET",
      json:true,
      headers: {
          "content-type": "application/json",
          'Authorization': 'Basic ' + new Buffer(destination.User+":"+destination.Password).toString('base64'),
          "x-csrf-token" :"fetch"
      }
    };
    var requestC = request.defaults({jar: true});
    requestC(getTokenOptions,function(error,response,body){
      var csrfToken = response.headers['x-csrf-token'];
      if(!csrfToken){
        reject({message:"Token error!"});
        return;
        }
      var updateOptions = {
        url: destination.URL+requestPath,
        method: "POST",
        json:true,
        headers: {
            "content-type": "application/json",
            'x-csrf-token': csrfToken
        },
        body:req.body
      };
      requestC(updateOptions).pipe(res);
    });

  });

  app.route('/api/v1/*').patch(function(req, res) {
    var sHost = req.hostname === "localhost" ?req.hostname: req.hostname.split(".")[0];
    var requestPath = URL.parse(req.url).href.split("/api/v1/")[1];
    var destination = DESTINATION_MAP.getProperty(sHost);
    var getTokenOptions = {
      url: destination.URL+"$metadata",
      method: "GET",
      json:true,
      headers: {
          "content-type": "application/json",
          'Authorization': 'Basic ' + new Buffer(destination.User+":"+destination.Password).toString('base64'),
          "x-csrf-token" :"fetch"
      }
    };
    var requestC = request.defaults({jar: true});
    requestC(getTokenOptions,function(error,response,body){
      var csrfToken = response.headers['x-csrf-token'];
      if(!csrfToken){
        reject({message:"Token error!"});
        return;
        }
      var updateOptions = {
        url: destination.URL+requestPath,
        method: "PATCH",
        json:true,
        headers: {
            "content-type": "application/json",
            'x-csrf-token': csrfToken
        },
        body:req.body
      };
      requestC(updateOptions).pipe(res);
    });
    // var sHost = req.hostname === "localhost" ?req.hostname: req.hostname.split(".")[0];
    // var requestPath = URL.parse(req.url).split("/api/v1/")[1];
    // var destination = DESTINATION_MAP.getProperty(sHost);
    // superagent.patch(destination.URL+requestPath)
    // .set('x-csrf-token',destination.x_csrf_token)
    // .send(req.body)
    // .query({"$format":"json"})
    // .pipe(res);
  });

  app.route('/api/v2/checkConnection').get(function(req, res) {
    var sHost = req.hostname === "localhost" ?req.hostname: req.hostname.split(".")[0];
    handleDestination.getAccessToken().then(function(token){
      handleDestination.getDestination(token).then(function(des){
        for(var i = 0 ;i < des.length; i++){
          DESTINATION_MAP.setDest(des[i].Name,des[i]);
        }
        var dest = DESTINATION_MAP.getProperty(sHost);
        var options = {
          url: dest.URL+"$metadata",
          method: "GET",
          json:true,
          headers: {
              "content-type": "application/json",
              'Authorization': 'Basic ' + new Buffer(dest.User+":"+dest.Password).toString('base64'),
              "x-csrf-token" :"fetch"
          }
        };
        requestC(getTokenOptions,function(error,response,body){
          dest.x_csrf_token = response.headers['x-csrf-token'];
        });
        res.send({"result":"success"});
      }).catch(function(){
        res.status(500);
        res.send({"result":"error"});
      });
    }).catch(function(){
      res.status(500);
      res.send({"result":"error"});
    });


  });

  app.route('/api/v2/appointment').post(function(req, res) {
    var filter = "Owner/content eq \'" +"crmops" +"\'&$orderby=CreatedOn desc&$top=20";
    handleC4CRequest.getDataFromC4C(filter,{collection:"AppointmentCollection"}).then(function(results){
      res.send({"appointments":results});
    }).catch(function(){
      res.send({"appointments":[]});
    });
  });

  app.route('/api/v2/appointment').get(function(req, res) {
    var query = req.query;
    var key = query.appointMendtKey;
    if(key){
      handleC4CRequest.getDataFromC4CByKey(key,{collection:"AppointmentCollection"}).then(function(result){
        res.send(result);
      }).catch(function(){
        res.status(500);
        res.send({});
      });
    }else{
      var filter = "Owner/content eq \'" +"*" +"\'&$orderby=CreatedOn desc&$top=20";
      handleC4CRequest.getDataFromC4C(filter,{collection:"AppointmentCollection"}).then(function(results){
        res.send({"appointments":results});
      }).catch(function(){
        res.status(500);
        res.send({"appointments":[]});
      });
    }

  })
};
