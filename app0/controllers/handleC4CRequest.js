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

  this.callHttpService = function(oReq) {
    var getTokenOptions = {
      url: "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codata/$metadata",
      method: "GET",
      json:true,
      headers: {
        "content-type": "application/json",
        'Authorization': 'Basic ' + new Buffer("CRMOPS:Ondemand1").toString('base64'),
        "x-csrf-token" :"fetch"
      }
    };

    var postData = {
            OPEN_ID: oReq.open_id,
            SERIAL_ID: oReq.serial_id,
            PRODUCT_ID: oReq.product_id
          };
    return new Promise(function(resolve,reject){
      var requestC = request.defaults({jar: true});
      requestC(getTokenOptions,function(error, response, body){
        if(body){
          var options = {
            url: oReq.url,
            method: "POST",
            json:true,
            headers: {
                "content-type": "application/json",
                'Authorization': 'Basic ' + new Buffer("CRMOPS:Ondemand1").toString('base64')
            },
            body: postData
          };
          requestC(options,function(error, response, data){
            if(error){
              reject(error.message);
            }else{
              resolve(data);
            }
          });
        }
      });
    });
  };

  this.modifyC4CData = function (oReq) {
    var postData = {
            MPOINT_ID: oReq.id,
            MDOC_VALUE: oReq.value,
            MDOC_DES: oReq.description,
            MEASURED_ON: oReq.measuredOn
          };
    var sUrl = oReq.url;
    var options = {
      url: sUrl,
      method: "GET",
      json: true,
      headers: {
          "content-type": "application/json",
          'Authorization': 'Basic ' + new Buffer("CRMOPS:Ondemand1").toString('base64')
      }
    };

    var getTokenOptions = {
      url: "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codata/$metadata",
      method: "GET",
      json:true,
      headers: {
        "content-type": "application/json",
        'Authorization': 'Basic ' + new Buffer("CRMOPS:Ondemand1").toString('base64'),
        "x-csrf-token" :"fetch"
      }
    };

    return new Promise(function(resolve,reject){
      var requestC = request.defaults({jar: true});
      requestC(getTokenOptions,function(error,response,body){
        if(body){
          var updateOptions = {
            url: sUrl,
            method: "POST",
            json:true,
            headers: {
                "content-type": "application/json",
                'Authorization': 'Basic ' + new Buffer("CRMOPS:Ondemand1").toString('base64')
            },
            body: postData
          };
          requestC(updateOptions,function(error,response,data){
            if(error){
              reject(error.message);
            }else{
              resolve(data);
            }
          });
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

  this.gePushDataFromC4C = function(url){
    //var url = "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codata/IndividualCustomerCollection?$filter=NickName eq \'"+userWCId+"\'";
      var options = {
        url: url,
        method: "GET",
        json:true,
        headers: {
            "content-type": "application/json",
            'Authorization': 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64')
        },
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

  this.createDataToC4C = function(userWCId,oData,entity){
    var that = this;
    var postData = oData;
    var url = "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codata";
      var getTokenOptions = {
        url: url+"/IndividualCustomerCollection?$filter=NickName eq \'"+userWCId+"\'",
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
          reject({message:"Token error"});
          return;
          }
        if(body && body.d && body.d.results.length > 0 ){
          if(entity === 'IndividualCustomerCollection'){
            reject("You have a related account！Account:"+body.d.results[0].CustomerID);
          }else{
            postData.AccountID = body.d.results[0].CustomerID;
            var createOptions = {
              url: url+"/"+entity,
              method: "POST",
              json:true,
              headers: {
                  "content-type": "application/json",
                  'x-csrf-token': csrfToken
              },
              body:postData
            };
            requestC(createOptions,function(error,response,data){
              //console.log(data);
              if(error){
                reject(error.message);
              }else{
                if(data.code && data.code === "ERROR"){
                  resolve("在相同时间段内，你已有预约！");
                }
                resolve("Apply successfully！ID："+data.d.results.ID);
              }

            });
          }


        }else{
          if(entity !== 'IndividualCustomerCollection'){
            reject("You haven't a related account, please create firstly！");
          }else{
            var createOptions = {
              url: url+"/"+entity,
              method: "POST",
              json:true,
              headers: {
                  "content-type": "application/json",
                  'x-csrf-token': csrfToken
              },
              body:postData
            };
            console.log(postData);
            requestC(createOptions,function(error,response,data){
              //console.log(data);
              if(error){
                console.log(error);
                reject(error.message);
              }else{
                console.log("create Account");
                console.log(data);
                that.updateUserProfile(userWCId,data.d.results.CustomerID);
                resolve(data.d.results.CustomerID);
              }

            });
          }
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

  this.updateUserProfile = function(openId,customerId){
    this.getUserProfile(openId).then(function(userProfile){
      console.log(userProfile.ID);
      var options = { method: 'POST',
                  url: 'https://my306768.vlab.sapbydesign.com/sap/bc/srt/scs/sap/managesocialmediauserprofilein',
                  qs: { 'sap-vhost': 'my306768.vlab.sapbydesign.com' },
                  headers: {
                     'cache-control': 'no-cache',
                     'content-type': 'text/xml',
                     authorization: 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64') },
                  body: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global"><soapenv:Header/><soapenv:Body><glob:SocialMediaUserProfileBundleMaintainRequest_sync>'
                        +'<SocialMediaUserProfile>'
                        +'<UUID>'+userProfile.UUID+'</UUID>'
                        +'<UserInformation >'
                        +'<SocialMediaUserAccountID>'+openId+'</SocialMediaUserAccountID>'
                        +'</UserInformation>'
                        +'<CustomerInternalID>'+customerId+'</CustomerInternalID>'
                        +'</SocialMediaUserProfile>'
                        +'</glob:SocialMediaUserProfileBundleMaintainRequest_sync></soapenv:Body></soapenv:Envelope>'
                };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log("userProfile.ID1");
        console.log(body);
        // var paersString = "<SocialMediaActivity>"+body.split("<SocialMediaActivity>")[1].split("</SocialMediaActivity>")[0]+"</SocialMediaActivity>";
        // parseString(paersString,{explicitArray : false}, function (err, result) {

        });
    }).catch(function(){
    });
  };

  this.addContactToUserProfile = function(email, accountId, openId) {
    var options1 = {
        method: 'POST',
        url: 'https://my306768.vlab.sapbydesign.com/sap/bc/srt/scs/sap/querycontactin',
        qs: {'sap-vhost': 'my306768.vlab.sapbydesign.com'},
        headers: {'cache-control': 'no-cache',
                  'content-type': 'text/xml',
                  'Authorization': 'Basic ' + new Buffer("CRMOPS:Ondemand1").toString('base64'),
                  "x-csrf-token" :"fetch"},
        body: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global">'
              + '<soapenv:Header/>'
              + '<soapenv:Body>'
              + '<glob:ContactByElementsQuery_sync>'
              + '<ContactSelectionByElements>'
              + '<SelectionByEMailUri>'
              + '<InclusionExclusionCode>I</InclusionExclusionCode>'
              + '<IntervalBoundaryTypeCode>1</IntervalBoundaryTypeCode>'
              + '<LowerBoundaryName>' + email + '</LowerBoundaryName>'
              + '<UpperBoundaryName></UpperBoundaryName>'
              + '</SelectionByEMailUri>'
              + '</ContactSelectionByElements>'
              + '<ProcessingConditions>'
              + '<QueryHitsMaximumNumberValue>350</QueryHitsMaximumNumberValue>'
              + '<QueryHitsUnlimitedIndicator></QueryHitsUnlimitedIndicator>'
              + '<LastReturnedObjectID></LastReturnedObjectID>'
              + '</ProcessingConditions>'
              + '<RequestedElements>'
              + '<Contact>'
              + '</Contact>'
              + '</RequestedElements>'
              + '</glob:ContactByElementsQuery_sync>'
              + '</soapenv:Body>'
              + '</soapenv:Envelope>'
    };

    var options = {
      url: "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codata/$metadata",
      method: "GET",
      json:true,
      headers: {
        "content-type": "application/json",
        'Authorization': 'Basic ' + new Buffer("CRMOPS:Ondemand1").toString('base64'),
        "x-csrf-token" :"fetch"
      }
    };

    var postData = {
      OPENID: openId,
      UUID: '',
      INTERNAL_ID: accountId
    };
    return new Promise(function(resolve, reject) {
      request(options1, function(error, response, data) {
        if(error) {
          console.log("error=" + error.message);
          reject(error.message);
        } else {
          var uuid;
          if(data.split('<UUID>')[1]) {
            uuid = data.split('<UUID>')[1].split('</UUID>')[0];
          } else {
            resolve([{RT_CODE: '2'}]);
            return;
          }
          // var internalId = data.split('<InternalID>')[1].split('</InternalID>')[0];
          postData.UUID = uuid;
          // postData.INTERNAL_ID = internalId;
          var options2 = {
            url: 'https://my306768.vlab.sapbydesign.com/sap/c4c/zsocialmedia',
            method: "POST",
            json:true,
            headers: {
                "content-type": "application/json",
                'Authorization': 'Basic ' + new Buffer("CRMOPS:Ondemand1").toString('base64')
            },
            body: postData
          };
          var requestC = request.defaults({jar: true});
          requestC(options, function(error, response, data) {
            if(data) {
              requestC(options2, function(error, response, body) {
                if(error) {
                  console.log("error=" + error.message);
                  reject(error.message);
                } else {
                  resolve(body);
                }
              });
            }
          });
        }
      });
    });;
  };

  this.createUserProfile = function(openId,oUserInfo){
    console.log("123");
    var options = { method: 'POST',
                url: 'https://my306768.vlab.sapbydesign.com/sap/bc/srt/scs/sap/managesocialmediauserprofilein',
                qs: { 'sap-vhost': 'my306768.vlab.sapbydesign.com' },
                headers: {
                   'cache-control': 'no-cache',
                   'content-type': 'text/xml',
                   authorization: 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64') },
                body: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global"><soapenv:Header/><soapenv:Body><glob:SocialMediaUserProfileBundleMaintainRequest_sync>'
                      +'<SocialMediaUserProfile>'
                      +'<SocialMediaUserCategoryCode>02</SocialMediaUserCategoryCode>'
                      +'<UserInformation >'
                      +'<SocialMediaUserAccountID>'+openId+'</SocialMediaUserAccountID>'
                      +'<SocialMediaChannelCode>905</SocialMediaChannelCode>'
                      +'<FamilyName>'+oUserInfo.lastName+'</FamilyName>'
                      +'<GivenName>'+oUserInfo.firstName+'</GivenName>'
                      +'<SocialMediaUserName>'+oUserInfo.firstName+'</SocialMediaUserName>'

                      // +'<SocialMediaUserName>'+Wang+'</SocialMediaUserName>'
                      +'</UserInformation>'
                      // +'<ContactPartyInternalID>'+Wang+'</ContactPartyInternalID>'
                      // +'<CustomerInternalID>'+Wang+'</CustomerInternalID>'
                      +'</SocialMediaUserProfile>'
                      +'</glob:SocialMediaUserProfileBundleMaintainRequest_sync></soapenv:Body></soapenv:Envelope>'
              };
    this.getUserProfile(openId).then(function(o){
      console.log("1234");
      console.log(o);
    }).catch(function(){
      request(options, function (error, response, body) {
        console.log("1235");
        if (error) throw new Error(error);
        // var paersString = "<SocialMediaActivity>"+body.split("<SocialMediaActivity>")[1].split("</SocialMediaActivity>")[0]+"</SocialMediaActivity>";
        // parseString(paersString,{explicitArray : false}, function (err, result) {

        });
    });
  };

  this.getUserProfile = function(openId){
    var options = { method: 'POST',
                url: 'https://my306768.vlab.sapbydesign.com/sap/bc/srt/scs/sap/requestforsocialmediauserprofi',
                qs: { 'sap-vhost': 'my306768.vlab.sapbydesign.com' },
                headers: {
                   'cache-control': 'no-cache',
                   'content-type': 'text/xml',
                   authorization: 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64') },
                body: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global"><soapenv:Header/><soapenv:Body><glob:SocialMediaUserProfileRequest_sync>'
                      +'<SocialMediaUserProfileSelectionByElements>'
                      +'<SelectionBySocialMediaUserProfileUserAccountID>'
                      +'<InclusionExclusionCode>I</InclusionExclusionCode>'
                      +'<IntervalBoundaryTypeCode>1</IntervalBoundaryTypeCode>'
                      +'<LowerBoundarySocialMediaUserProfileUserAccountID >'+openId+'</LowerBoundarySocialMediaUserProfileUserAccountID>'
                      +'</SelectionBySocialMediaUserProfileUserAccountID>'
                      +'</SocialMediaUserProfileSelectionByElements>'
                      +'</glob:SocialMediaUserProfileRequest_sync></soapenv:Body></soapenv:Envelope>'
              };

    return new Promise(function(resolve,reject){
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if(body.split('<ReturnedQueryHitsNumberValue>')[1].split('</ReturnedQueryHitsNumberValue>')[0] !== '0'){
          var paersString = "<SocialMediaUserProfile>"+body.split("<SocialMediaUserProfile>")[1].split("</SocialMediaUserProfile>")[0]+"</SocialMediaUserProfile>";
          parseString(paersString,{explicitArray : false}, function (err, result) {
            resolve(result.SocialMediaUserProfile);
          });
        }else{
          reject();
        }
      });
    });
  };

  this.getUserProfileById = function(userProfileId){
    var options = { method: 'POST',
                url: 'https://my306768.vlab.sapbydesign.com/sap/bc/srt/scs/sap/requestforsocialmediauserprofi',
                qs: { 'sap-vhost': 'my306768.vlab.sapbydesign.com' },
                headers: {
                   'cache-control': 'no-cache',
                   'content-type': 'text/xml',
                   authorization: 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64') },
                body: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global"><soapenv:Header/><soapenv:Body><glob:SocialMediaUserProfileRequest_sync>'
                      +'<SocialMediaUserProfileSelectionByElements>'
                      +'<SelectionBySocialMediaUserProfileID>'
                      +'<InclusionExclusionCode>I</InclusionExclusionCode>'
                      +'<IntervalBoundaryTypeCode>1</IntervalBoundaryTypeCode>'
                      +'<LowerBoundarySocialMediaUserProfileID >'+userProfileId+'</LowerBoundarySocialMediaUserProfileID>'
                      +'</SelectionBySocialMediaUserProfileID>'
                      +'</SocialMediaUserProfileSelectionByElements>'
                      +'</glob:SocialMediaUserProfileRequest_sync></soapenv:Body></soapenv:Envelope>'
              };

    return new Promise(function(resolve,reject){
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if(body.split('<ReturnedQueryHitsNumberValue>')[1].split('</ReturnedQueryHitsNumberValue>')[0] !== '0'){
          var paersString = "<SocialMediaUserProfile>"+body.split("<SocialMediaUserProfile>")[1].split("</SocialMediaUserProfile>")[0]+"</SocialMediaUserProfile>";
          parseString(paersString,{explicitArray : false}, function (err, result) {
            resolve(result.SocialMediaUserProfile);
          });
        }else{
          reject();
        }
      });
    });
  };

  this.createSocialMediaMessage = function(openId,oMessage){
    var that = this;
   return new Promise(function(resolve,reject){
    that.getUserProfile(openId).then(function(userProfile){
      console.log(userProfile);
      var options = { method: 'POST',
                  url: 'https://my306768.vlab.sapbydesign.com/sap/bc/srt/scs/sap/managesocialmediaactivityin',
                  qs: { 'sap-vhost': 'my306768.vlab.sapbydesign.com' },
                  headers: {
                     'cache-control': 'no-cache',
                     'content-type': 'text/xml',
                     authorization: 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64') },
                  body: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global"><soapenv:Header/><soapenv:Body><glob:SocialMediaActivityBundleMaintainRequestsync>'
                        +'<SocialMediaActivity>'
                        +'<SocialMediaMessageID>'+oMessage.id+'</SocialMediaMessageID>'
                        +'<SocialMediaUserProfileID>'+userProfile.ID+'</SocialMediaUserProfileID>'
                        +'<SocialMediaActivityProviderID >WechatTest</SocialMediaActivityProviderID>'
                        +'<InteractionContent ><Text>'+oMessage.text+'</Text></InteractionContent>'
                        +'</SocialMediaActivity>'
                        +'</glob:SocialMediaActivityBundleMaintainRequestsync></soapenv:Body></soapenv:Envelope>'
                };
        request(options, function (error, response, body) {
          if (error){
            console.log(error);
            reject("Create Failed!");
          };
          console.log(body);
          if(body.split('<SocialMediaActivity>').length > 1){
            var paersString = "<SocialMediaActivity>"+body.split("<SocialMediaActivity>")[1].split("</SocialMediaActivity>")[0]+"</SocialMediaActivity>";
            parseString(paersString,{explicitArray : false}, function (err, result) {
              resolve(result.SocialMediaActivity);
            });
          }else{
            reject();
          }
          // var paersString = "<SocialMediaActivity>"+body.split("<SocialMediaActivity>")[1].split("</SocialMediaActivity>")[0]+"</SocialMediaActivity>";
          // parseString(paersString,{explicitArray : false}, function (err, result) {
          //
          // });
        });
      });
    });
  };

  this.getSocialMediaMessage = function(msgId){
    var that = this;
    return new Promise(function(resolve,reject){
    var options = { method: 'POST',
                  url: 'https://my306768.vlab.sapbydesign.com/sap/bc/srt/scs/sap/querysocialmediaactivityin',
                  qs: { 'sap-vhost': 'my306768.vlab.sapbydesign.com' },
                  headers: {
                     'cache-control': 'no-cache',
                     'content-type': 'text/xml',
                     authorization: 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64') },
                  body: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global"><soapenv:Header/><soapenv:Body><glob:SocialMediaActivityByElementsQuery_sync>'
                        +'<SocialMediaActivitySelectionByElements>'
                        +'<SelectionBySocialMediaMessageID>'
                        +'<InclusionExclusionCode>I</InclusionExclusionCode>'
                        +'<IntervalBoundaryTypeCode>1</IntervalBoundaryTypeCode>'
                        +'<LowerBoundarySocialMediaMessageID >'+msgId+'</LowerBoundarySocialMediaMessageID>'
                        +'</SelectionBySocialMediaMessageID>'
                        +'</SocialMediaActivitySelectionByElements>'
                        +'</glob:SocialMediaActivityByElementsQuery_sync></soapenv:Body></soapenv:Envelope>'
                };
        request(options, function (error, response, body) {
          if (error){
            reject(error.message);
            return;
          };
          if(body.split('<ReturnedQueryHitsNumberValue>')[1].split('</ReturnedQueryHitsNumberValue>')[0] !== '0'){
            var paersString = "<SocialMediaActivity>"+body.split("<SocialMediaActivity>")[1].split("</SocialMediaActivity>")[0]+"</SocialMediaActivity>";
            parseString(paersString,{explicitArray : false}, function (err, result) {
              resolve(result.SocialMediaActivity);
            });
          }else{
            reject();
          }

        });
    });
  };



  //Handle for Mini-program
  this.getEmployee = function(wcID){

  };

  this.getApponintment = function(sEmpliyeeName){

  };

  this.assignEmployee = function(wcID,sEmpliyeeID){
    var that = this;
    var postData = {"NickName":wcID};
    var url = "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codata";
      var getTokenOptions = {
        url: url+"/EmployeeCollection?$filter=EmployeeID eq \'"+sEmpliyeeID+"\'",
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
            reject({message:"Token error"});
            return;
            }
          if(body && body.d && body.d.results.length > 0 ){
            var createOptions = {
              url: url+"/EmployeeCollection(\'"+body.d.results[0].ObjectID +"\')",
              method: "PATCH",
              json:true,
              headers: {
                  "content-type": "application/json",
                  'x-csrf-token': csrfToken
              },
              body:postData
            };
            console.log(url+"/EmployeeCollection(\'"+body.d.results[0].ObjectID +"\')");

            requestC(createOptions,function(error,response,data){
              //console.log(data);
              if(error){
                reject(error.message);
              }else{
                if(data && data.code && data.code === "ERROR"){
                  resolve("error");
                }
                resolve("Success");
              }

            });

          }else{
            reject({message:"Employee is not existed"});
            };
        });
      });
  };

  this.getOpportunity = function(sEmpliyeeID){

  };

  this.handleAssignProdutToSR = function(oTicket, sTickId){
    var oNewTicket = oTicket;
    var url = "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/ticket/ServiceRequestCollection";
      var filter = "ID eq \'" + sTickId+"\'";
      var getTokenOptions = {
        url: url+"?$filter="+filter,
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
        console.log(url+"?$filter="+filter);
        requestC(getTokenOptions,function(error,response,body){
          var csrfToken = response.headers['x-csrf-token'];
          if(!csrfToken){
            reject({message:"Token error!"});
            return;
            }
              console.log(body);
          if(body && body.d && body.d.results ){
            var newData = {};
            newData.SerialID =  oNewTicket.SerialID;
            newData.Name = oNewTicket.title;
            newData.ProductID = oNewTicket.product;
            console.log(newData);
            var updateOptions = {
              url: "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/ticket/ServiceRequestCollection(\'"+body.d.results[0].ObjectID+"\')",
              method: "PATCH",
              json:true,
              headers: {
                  "content-type": "application/json",
                  'x-csrf-token': csrfToken
              },
              body:newData
            };
            console.log("SerialID");
            requestC(updateOptions,function(error,response,data){
              console.log("SerialID1");
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

  this.createOpportunity = function(oData){
    var postBody = {
                    "ProbabilityPercent": oData.probabilityPercent,
                    "Name": {
                         "content": oData.name
                    },
                    "OwnerID":  oData.owner,
                    "AccountID": oData.accountId,
                    "ExpectedValue": {
                        "currencyCode": oData.currencyCode,
                        "content": oData.amount
                    },
                    "PrimaryContactID": oData.accountId,
                    "SalesCycleCode": "001",
                    "ConsistencyStatusCode": "2",
                    "ProgressCode": "1",
                    "DocumentTypeCode": "OPPT"
                  };
    var that = this;
    var url = "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codata";
      var getTokenOptions = {
        url: url+"/$metadata",
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
            reject({message:"Token error"});
            return;
            }
          var createOptions = {
            url: url+"/OpportunityCollection",
            method: "POST",
            json:true,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': csrfToken
            },
            body:postBody
          };

          requestC(createOptions,function(error,response,data){
            //console.log(data);
            if(error){
              reject(error.message);
            }else{
              if(data.code && data.code === "ERROR"){
                resolve("error");
              }
              console.log(data);
              resolve(data.d.results);
            }

          });

        });
      });
  };

  this.createSMDMIdByTicket = function(req,res,sOpenid,sId,sMessage){
    var that = this;
    var filter = "ID eq \'" + sId+"\'&$expand=ServiceRequestBusinessTransactionDocumentReference";
    that.getDataFromC4C(filter,{service:'ticket',collection:"ServiceRequestCollection"}).then(function(results){

      for(var i= 0; i<results[0].ServiceRequestBusinessTransactionDocumentReference.length;i++){
        if(results[0].ServiceRequestBusinessTransactionDocumentReference[i].TypeCode === '1607'){
          var filter = "ID eq \'" + results[0].ServiceRequestBusinessTransactionDocumentReference[i].ID+"\'";
          that.getDataFromC4C(filter,{service:'socialmediaactivity',collection:"SocialMediaActivityCollection"}).then(function(results){
              that.getUserProfile(sOpenid).then(function(userProfile){
                var newDate = new Date();
                var id = newDate.getFullYear()+newDate.getTime();
                var sParentSMAMid = results[0].SocialMediaMessageID;
                var options = { method: 'POST',
                            url: 'https://my306768.vlab.sapbydesign.com/sap/bc/srt/scs/sap/managesocialmediaactivityin',
                            qs: { 'sap-vhost': 'my306768.vlab.sapbydesign.com' },
                            headers: {
                               'cache-control': 'no-cache',
                               'content-type': 'text/xml',
                               authorization: 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64') },
                            body: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global"><soapenv:Header/><soapenv:Body><glob:SocialMediaActivityBundleMaintainRequestsync>'
                                  +'<SocialMediaActivity>'
                                  +'<SocialMediaMessageID>'+id+'</SocialMediaMessageID>'
                                  +'<RootSocialMediaMessageID>'+sParentSMAMid+'</RootSocialMediaMessageID>'
                                  +'<SocialMediaUserProfileID>'+userProfile.ID+'</SocialMediaUserProfileID>'
                                  +'<SocialMediaActivityProviderID >WechatTest</SocialMediaActivityProviderID>'
                                  +'<ParentSocialMediaMessageID >'+sParentSMAMid+'</ParentSocialMediaMessageID>'
                                  +'<InteractionContent ><Text>'+sMessage+'</Text></InteractionContent>'
                                  +'</SocialMediaActivity>'
                                  +'</glob:SocialMediaActivityBundleMaintainRequestsync></soapenv:Body></soapenv:Envelope>'
                          };
                  request(options, function (error, response, body) {
                    if (error){
                      res.send({"result":"error"});
                    };
                    res.send({"result":"success"});
                  });
              });
          }).catch(function(){
            res.send({"result":"error"});
          });
        }
      }
    }).catch(function(){
      res.send({"result":"error"});
    });
  };
}

module.exports = handleC4CRequest;
