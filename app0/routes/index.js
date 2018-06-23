var request = require('request'),
    wchatValidateToken = require(process.cwd() + '/app/controllers/validateWXToken.js'),
    oTokenHandler = require(process.cwd() + '/app/controllers/tokenHandler.js'),
    manuHandler = require(process.cwd() + '/app/controllers/manuHandler.js'),
    miniProgram = require(process.cwd() + '/app/controllers/miniProgram.js'),
    oSQLClient = require(process.cwd() + '/app/controllers/sqlClient.js'),
    oHandleC4CRequest = require(process.cwd() + '/app/controllers/handleC4CRequest.js');

    var Multipart = require('multiparty');
    var multer = require('multer');
    var FormData = require('form-data');

    var upload = multer({dest:'upload/'});

    var fs = require('fs');
    var crypto = require('crypto');

module.exports = function (app,clientStrore,sqlClient) {
  var that = this;
  that.waitConfirm = [];
  console.log("begain");
  //get wechat token
  var tokenHandler = new oTokenHandler(clientStrore);
  var handleC4CRequest = new oHandleC4CRequest();
  var oMiniProgram = new miniProgram();
  var oSqlClient = new oSQLClient(sqlClient);
  tokenHandler.refreshWechatToken().then(function(token){
    console.log(token);
      manuHandler(token);
  });
  tokenHandler.refreshMiniToken();
  // tokenHandler.refreJSTicket();

  // campaign
  app.route('/campaign').post(function(req, res) {
    var oData =  req.body;
    var aTousers = req.body.openids;
    var oTem  = req.body.mdId;
    tokenHandler.getWechatToken().then(function(token){
      var options = {
        url: "https://api.weixin.qq.com/cgi-bin/media/uploadnews?access_token="+token,
        method: "POST",
        json:true,
        headers: {
        "content-type": "application/json"},
        body:{
          "articles": [
             {
                 "title":oTem.header,
                 "content":oTem.content,
                 "digest":oTem.abstract,
                 "content_source_url":oTem.url,
                 "thumb_media_id":oTem.pic,
                 "show_cover_pic":1
             }
           ]
        }
      };

      request(options,function(error,response,body){
        console.log(body);
        for(var i = 0; i<aTousers.length;i++ ){
          var oBody = {
                "touser":aTousers[i],
                "msgtype":"mpnews",
                "mpnews":
                  {
                       "media_id":body.media_id
                  }
            };
            sendWCImageMeaasge(oBody);
        }

      });
    });

    console.log(oData);
    res.status(200);
    res.send({"result":"success"});
  });

  app.route('/getWCToken').post(function(req, res) {
    tokenHandler.getWechatToken().then(function(token){
      res.status(200);
      res.send({"token":token});
    });

  });

  app.route('/sendSurvey').post(function(req, res) {
    var oData = req.body;
    console.log(oData);
    if (Object.prototype.toString.call(oData)=='[object Array]') {
      for(var i =0;i<= oData.length;i++){
          var oBody = {
                "touser":oData[i].openId,
                "msgtype":"news",
                "news":{
                    "articles": [
                     {
                         "title":"Survey Request",
                         "description":"Please click to fill survey!",
                         "url":oData[i].link
                     }
                     ]
                }
            };
            sendWCImageMeaasge(oBody);
      }
    }else{
          sendWCMeaasge(oData.openId,oData.link);
    }

    res.status(200);
    res.send({"result":"success"});
  });

  app.post('/uploadImage',function(req, res) {
    console.log(req.file);
    var pform = new Multipart.Form();
    pform.maxFilesSize = 2 * 1024 * 1024;
    pform.parse(req, function(err, fields, files) {
       if(err){
           console.log('upload error');
           return ;
       }
       var oFile = files.media[0];
       tokenHandler.getWechatToken().then(function(token){
         var options = {
           url: "https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=TYPE",
           method: "POST",
           headers: {
               "content-type": "multipart/form-data",
           }
         };

         var r = request(options,function(error,response,body){
           console.log("body");
           console.log(body);
           console.log(error);
           res.status(200);
           res.send(body);
         });
         var form = r.form();
         form.append('access_token',token);
         form.append('type','thumb');
         form.append('media',fs.createReadStream(oFile.path));
       });

     });

  });

  app.route('/checkWXJS').post(function(req, res){
    var timestamp = req.body.timestamp;
    var noncestr = req.body.noncestr;
    var url = req.body.url;
    tokenHandler.getJsTicket().then(function(ticket){
      console.log(ticket);
      var sSign  ="jsapi_ticket="+ticket+"&noncestr="+noncestr+"&timestamp="+timestamp+"&url="+url;
      var shasum = crypto.createHash('sha1');
      shasum.update(sSign);
      var scyptoString = shasum.digest('hex');
      res.status(200);
      res.send({"signature":scyptoString});
    }).catch(function(error){
      console.log(error);
      res.status(500);
      res.send({"result":"error"});
    });
  });

  // read registered product from C4C
  app.route('/read').get(function(req, res) {
    var oReqData = req.query;
    var oPath = {
      url: oReqData.url,
      service: oReqData.service,
      collection: oReqData.collection
    };
    filter = oReqData.filter;
    handleC4CRequest.getDataFromC4C(filter, oPath).then(function(oProduct) {
      res.send(oProduct);
    });
  });

  // dispatch call https service
  app.route('/callService').get(function(req, res) {
    var oReqData = req.query;
    handleC4CRequest.callHttpService(oReqData).then(function(results) {
      res.send(results);
    });
  });

  //modify C4C data from WechatTest
  app.route('/modify').get(function(req, res) {
    var oReqData = req.query;
    handleC4CRequest.modifyC4CData(oReqData).then(function (oResponse) {
      res.send(oResponse[0]);
    }).catch(function(error) {
      console.log("Error=" + error);
      res.send(error);
    });
  });

  app.route('/mini/formid').post(
    function(req, res){
      oSqlClient.insertFormId(req.body.ids,req.body.openId).then(function(result){
        res.send({"result":"success"});
      }).catch(function(){
        res.send({"result":"error"});
      });
    });

  app.route('/mini/appointment').get(
    function(req, res){
      oSqlClient.getByOpenId(req.query.openId).then(function(result){
      oMiniProgram.getAppointment(result[0],req.query.count, res);
    });
  });

  app.route('/c4c/getTickets').get(
    function(req,res){
      var oData = req.query;
      if(oData.srId && oData.srId !== ''){
        var filter = "ID eq \'" + oData.srId+"\'&$expand=ServiceRequestBusinessTransactionDocumentReference";
        handleC4CRequest.getDataFromC4C(filter,{service:'ticket',collection:"ServiceRequestCollection"}).then(function(results){
          var options = {
            url: "https://my306768.vlab.sapbydesign.com/sap/c4c/zsmaaction",
            method: "POST",
            json:true,
            body:{
              "srid":oData.srId
            },
            headers: {
                "content-type": "application/json",
                'Authorization': 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64')
            }
          };
          var sr = results[0];
         request(options,function(error,response,data){
           sr.interAction = data;
           res.send({"ServiceRequest":sr});
         });
        }).catch(function(){
          res.send({"ServiceRequest":[]});
        });
      }else{
        var options = {
          url: "https://my306768.vlab.sapbydesign.com/sap/c4c/zuserprofile",
          method: "POST",
          json:true,
          body:{
            "openid":oData.openId
          },
          headers: {
              "content-type": "application/json",
              'Authorization': 'Basic ' + new Buffer("crmops:Ondemand1").toString('base64')
          }
        };

       request(options,function(error,response,data){
         var filter = "ReportedPartyID eq \'" + data.patyId+"\'";
         handleC4CRequest.getDataFromC4C(filter,{service:'ticket',collection:"ServiceRequestCollection"}).then(function(results){
           res.send({"ServiceRequest":results});
         }).catch(function(){
           res.send({"ServiceRequest":[]});
         });
       });

        // handleC4CRequest.getUserProfile(oData.openId)
        // .then(function(userProfile){
        //   console.log(userProfile);
        //   var filter = "BuyerPartyID eq \'" + userProfile.CustomerID+"\'&$expand=ServiceRequestBusinessTransactionDocumentReference";
        //   handleC4CRequest.getDataFromC4C(filter,{service:'ticket',collection:"ServiceRequestCollection"}).then(function(results){
        //     res.send({"ServiceRequest":results});
        //   }).catch(function(){
        //     res.send({"ServiceRequest":[]});
        //   });
        // });
      }
    }
  );

  app.route('/c4c/replyTickets').post(
    function(req,res){
      var oData = req.body;
      handleC4CRequest.createSMDMIdByTicket(req,res,oData.openId,oData.srId,oData.reply);
      res.send({"result":"success"});
    }
  );

  app.route('/mini/opportunity').get(
    function(req, res){
      oSqlClient.getByOpenId(req.query.openId).then(function(result){
      oMiniProgram.getOpportunity(result[0],req.query.count, res);
    });
  });

  app.route('/mini/opportunity').post(
    function(req, res){
      oMiniProgram.postOpportunity(req, res);
  });

  app.route('/mini/employee').post(
    function(req, res){
      var oData = req.body;
          oSqlClient.insert(oData.employeeId,oData.openId,oData.employeeName).then(function(){
            res.send({"result":"success"});
          }).catch(function(){
            res.send({"result":"error"});
          });
          //oMiniProgram.postEmployee(req, res);
  });

  app.route('/mini/login').post(
    function(req, res){
      var oData = req.body;
      oSqlClient.getByOpenId(req.body.openId).then(function(result){
        res.send({"result":"success"});
      }).catch(function(){
        res.send({"result":"error"});
      });
  });

  app.route('/mini/getDataDetail').get(
    function(req, res){
      var oData = req.query;
      handleC4CRequest.getDataFromC4CByKey(oData.key,{collection:oData.entity}).then(function(result){
        res.send(result);
      }).catch(function(){
        res.send({});
      });
  });

  app.route('/c4c/mini/employee').post(function(req, res){
    var oData = req.body;
    var sMessage =  '<a href="http://www.qq.com" data-miniprogram-appid="wxa9b01c5f7e4c5174" data-miniprogram-path="pages/index/index">点击跳小程序</a>';
    var pushTMLData = {
      "subject": {
          "value":oData.appointmentName,
          "color":"#173177"
      },
      "date":{
          "value":oData.StartDate+ '-'+oData.EndDate,
          "color":"#173177"
      },
      "customer": {
          "value":oData.AccountName,
          "color":"#173177"
      },
      "location": {
          "value":oData.Location,
          "color":"#173177"
      }
    };
    oSqlClient.getByRole(oData.Owner).then(function(result){
      //sendTemplateMeaasge(result[i].open_id,"Uvobg6LLwQVz9GQJnNIrYGwglDW8CWJ7Gs0h703gE3s",pushTMLData);
      sendMiniMeaasge(result,"5Jg2jvMNN_KWKQqU4RyaeYg3c8i0vs0xZcEc_Sl8NS8",oData);

    });
    res.status(200).end();
    console.log(oData);
  });

  app.route('/')
      .get(function (req, res) {
        var url = "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codata/AccountAddressCollection";
          var options = {
            url: url,
            method: "GET",
            json:true,
            headers: {
                "content-type": "application/json",
                'Authorization': 'Basic ' + new Buffer("Crmops:Ondemand1").toString('base64')
            },
            //proxy:"http://proxy.wdf.sap.corp:8080"
//             host:'proxy.hkg.sap.corp',
//             port:'8080'
          };
          request(options,function(error,response,data){
            if(data){
              res.send(data);
            }else {
              res.send(error.message);
            }
          });
        });

  app.route('/').post(function(req,res){
    console.log(req.body);
    res.send("{key:value}");
  });

  app.route('/getAttach').get(function(req,res){
    var path=process.cwd()+'/public/test.pdf';
    var f = fs.createReadStream(path);
    res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename=NW.pdf'
    });
    f.pipe(res);
  //  res.download(process.cwd()+'/public/test.pdf');
  });

  app.route('/create').post(function(req,res){
    var createData = req.body;
    switch (createData.entity) {
      case "customerAccount":
        var oAccountData = {
          "LastName" :createData.lastName,
          "FirstName": createData.firstName,
          "StreetName": createData.address,
          "RoleCode": "CRM000",
          "Mobile":createData.phone,
          "Phone":createData.phone,
          "NickName":createData.wxOpenId
        };
        handleC4CRequest.createDataToC4C(createData.wxOpenId,oAccountData,"IndividualCustomerCollection").then(function(result){
          res.status(200);
          res.send({"result":"Create Successfully！Account ID："+result});
        }).catch(function(error){
          res.status(500);
          res.send({"error:":error});;
        });
        break;
      case "ticket":
        // var newDate = new Date();
        // var id = newDate.getFullYear()+newDate.getTime();
        handleSRCreate(createData,req,res);
        // handleC4CRequest.createSocialMediaMessage(createData.wxOpenId,{'id':id,'text':createData.text})
        // .then(function(result){
        //   var smsId = result.ID;
        //   res.status(200);
        //   res.send({"success:":result});
        // })
        // .catch(function(error){
        //   res.status(500);
        //   res.send({"error:":error});
        // });
        break;
      case "contact":
        var accountId = createData.ID;
        var email = createData.email;
        var openId = createData.wxOpenId;

        handleC4CRequest.addContactToUserProfile(email, accountId, openId).then(function(result) {
          if(result[0].RT_CODE == "0") {
            sendWCMeaasge(createData.wxOpenId, "Contact was bound to your Wechat!");
          } else if (result[0].RT_CODE == "1") {
            sendWCMeaasge(createData.wxOpenId, "Binding data is existed!");
          } else {
            sendWCMeaasge(createData.wxOpenId, "Failed! Please check your input.");
          }

          res.send(result);
        }).catch(function(error){
          res.status(500);
          res.send({"error:":error});;
        });;

        break;
      default:

    }
  });

  app.route('/getWXWebToken').post(function(req,res){
    var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx2e364477a9159672&secret=4da79c282ce226a4682cf4e58a8438b8&code="
                  +req.body.code
                  +"&grant_type=authorization_code";

      var options = {
        url: url,
        method: "GET",
        json:true,
        // headers: {
        //     "content-type": "application/json"
        //   }
        };
      request(options,function(error,response,data){
        if(data){
          res.status(200);
          console.log(data);
          res.send(data);
        }else {
          res.send(error.message);
        }
      });
  });

  app.route('/c4c/wechat').post(function(req,res){
    var pushData = JSON.parse(req.body.content);
    var replyTime = new Date(pushData.sma_create_datetime);
    var sUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2e364477a9159672&redirect_uri=http%3A%2F%2Ftestc4cwc.duapp.com%2Fclient%2Fwebapp%2Findex.html%23%2FticketDetail/"
                +pushData.service_req_no+ "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    var pushTMLData = {
      "time": {
          "value":replyTime.toLocaleString(),
          "color":"#173177"
      },
      "author":{
          "value":pushData.author_name,
          "color":"#173177"
      },
      "text": {
          "value":pushData.text,
          "color":"#173177"
      },
      "ticket": {
          "value":pushData.service_req_no,
          "color":"#173177"
      },
      "reply": {
          "value":"Please click to detail page or input‘<your reply>@"+pushData.service_req_no+"’to reply.",
          "color":"#173177"
      }
    };
    handleC4CRequest.getSocialMediaMessage(pushData.original_id)
    .then(function(smaMessage){
      console.log(smaMessage);
      handleC4CRequest.getUserProfileById(smaMessage.SocialMediaUserProfileID)
      .then(function(userProfile){
        sendTemplateMeaasge(userProfile.UserInformation.SocialMediaUserAccountID,"Au830kpfkB_AVYviHQQm_vGoIdpX8zgkV2BAxPOWIOE",pushTMLData,sUrl);
      });
    });
    res.status(200).end();
  });

  app.route('/c4c').post(function(req,res){
    var changeUrl = req.body.odataServiceEndpoint;
    var BO =  req.body.businessObject;
    if(BO === "CUSTOMER"){
      handleC4CRequest.gePushDataFromC4C(changeUrl).then(function(c4cData){
        sendWCMeaasge(c4cData.NickName,"Your account info has been updated\nAccount："+c4cData.CustomerID);
      });
    }else{
      handleC4CRequest.gePushDataFromC4C(changeUrl).then(function(appointmentData){
        var filter = "CustomerID eq \'" +appointmentData.AccountID +"\'";
        handleC4CRequest.getDataFromC4C(filter,{collection:"IndividualCustomerCollection"}).then(function(customerDatas){
          var customerData = customerDatas[0];
          var bookingDate = new Date(parseInt(appointmentData.StartDateTime.content.replace("/Date(",'').replace(")/",'')));
          var bookData = {
            "date": {
                "value":bookingDate.toLocaleDateString(),
                "color":"#173177"
            },
            "address":{
                "value":appointmentData.LocationName,
                "color":"#173177"
            },
            "id": {
                "value":customerData.Name,
                "color":"#173177"
            },
            "status": {
                "value":"等待审批",
                "color":"#173177"
            }
          };

          if(appointmentData.Subject.split("(").length === 2){
            bookData.status.value = "Confirmed";
            sendTemplateMeaasge(customerData.NickName,"k8wGS3mKc5_ISWa6mbslpKbY7se_73KNjjRMNgI-byA",bookData,"");
            return;
          }
          switch (appointmentData.StatusCode) {
            case "1":
              sendTemplateMeaasge(customerData.NickName,"yxW2tYMNiQhLnPyZTRp3R38J5OVpmGEJfQa5Ilmz6Zo",bookData,"");
              break;
            case "2":
              that.waitConfirm.push({wcID:customerData.NickName,ID:appointmentData.ObjectID});
              bookData.status.value = "Waiting for Confirm";
              sendTemplateMeaasge(customerData.NickName,"AJj5GVBOfbjuLX7UojGDw5gN7VCNDrgInW9H4E2mHcQ",bookData,"");
              break;
            case "3":
              bookData.status.value = "Confirmed";
              sendTemplateMeaasge(customerData.NickName,"k8wGS3mKc5_ISWa6mbslpKbY7se_73KNjjRMNgI-byA",bookData,"");
              break;
            default:
          }
        });
      });
    }

  });

  app.route('/c4c/ticket/update').post(function(req,res){
    var oData = req.body;
    var sReply;
    console.log(oData);
    switch (oData.type) {
      case '43':
       var replyTime = new Date(oData.reply.time);
        sReply = "Service Technician: " + oData.reply.name +"\nPhone Number: " + oData.reply.phone+
                  "\nRequest Time: " +  replyTime.toLocaleString() + "\nService Location: " + oData.reply.address;
        break;
      case '802':
        var replyTime = new Date(oData.reply);
        sReply = "Arrival Time: "+ replyTime.toLocaleString();
        break;
      case '804':
        var replyTime = new Date(oData.reply);
        sReply = "Resolved Time: "+ replyTime.toLocaleString();
        break;
      default:
      return;

    }
    console.log(sReply);
    if(oData.sma_id === ''){
      return;
    }
    console.log(oData.sma_id);
    handleC4CRequest.getSocialMediaMessage(oData.sma_id)
    .then(function(smaMessage){
      console.log(smaMessage);
      handleC4CRequest.getUserProfileById(smaMessage.SocialMediaUserProfileID)
      .then(function(userProfile){
        console.log(userProfile);
        var pushTMLData = {
          "nickName": {
              "value":userProfile.UserInformation.SocialMediaUserName,
              "color":"#000000"
          },
          "srId":{
              "value":oData.srId,
              "color":"#000000"
          },
          "detail": {
              "value":sReply,
              "color":"#173177"
          }
        };
        sendTemplateMeaasge(userProfile.UserInformation.SocialMediaUserAccountID,"BMDrnRyKHg0CiNRwPvNtqEBvIWv6eDO7INgePpUzEL4",pushTMLData,"");
      });
    });
    res.status(200).end();
  });

  app.route('/wechat').get(function(req,res){
    wchatValidateToken(req,res);
  });

  app.route('/wechat').post(function(req,res){
    var oReqData = req.body.xml;
    var toUserName = oReqData.ToUserName;
    var FromUserName = oReqData.FromUserName;
    var CreateTime = oReqData.CreateTime;
    var MsgType = oReqData.MsgType;
    var Content = oReqData.Content;
    var MsgId = oReqData.MsgId;
    var Event = oReqData.Event;
    var EventKey = oReqData.EventKey;
    console.log(oReqData);

    if (MsgType === 'voice') {
      var xml = '<xml><ToUserName>'+FromUserName+'</ToUserName><FromUserName>'+toUserName+'</FromUserName><CreateTime>'+CreateTime+'</CreateTime><MsgType>text</MsgType><Content>'+oReqData.Recognition+'</Content></xml>';
      res.send(xml);
      Content = vociceHandle(oReqData.Recognition);
      console.log("Voice");
      console.log(Content);
      if( Content === ''){
        return;
      }
    }

    if(Content === "确认"){
      wConfirm(FromUserName);
      res.status(200).end();
      return;
    }
    if(Event === "subscribe"){
      tokenHandler.getWechatToken().then(function(wcToken){
        var oprions = {
              url:"https://api.weixin.qq.com/cgi-bin/user/info?access_token="+wcToken+"&openid="+FromUserName+"&lang=zh_CN",
              method: "GET",
              json:true,
              headers: {
              "content-type": "application/json"},
            };
        request(oprions,function(error,response,data){
          console.log(error);
          console.log(data);
          handleC4CRequest.createUserProfile(FromUserName,{'firstName':data.nickname,'lastName':data.nickname});
        });
      }).catch();

      sendWCMeaasge(FromUserName,"Welcome!\nC4C Wechat");
      res.status(200).end();
      return;
    }
    if(Event){
      eventHandle(FromUserName,EventKey);
      res.status(200).end();
      return;
    }
    var createData = Content.split("@");

    if(createData.length === 2){
      if(createData[1] !== ''){
        var filter = "ID eq \'" + createData[1]+"\'";
        console.log(filter);
        console.log(Content);
        handleC4CRequest.getDataFromC4C(filter,{service:'ticket',collection:"ServiceRequestCollection"}).then(function(results){
          handleC4CRequest.createSMDMIdByTicket(req,res,FromUserName,createData[1],createData[0]);
          sendWCMeaasge(FromUserName,"Reply Successfully!");
        }).catch(function(){
          sendWCMeaasge(FromUserName,"Reply Failed!");
        });
      }
      res.status(200).end();
      return;
    }

    if(createData.length === 3){
      var wcData = createData[2].split("$");
      if(createData[1] === "account"){
        var oAccountData = {
          "LastName" :wcData[0].split("_")[0],
          "FirstName": wcData[0].split("_")[1],
          "StreetName": wcData[1],
          "RoleCode": "CRM000",
          "Mobile":wcData[2],
          "NickName":FromUserName,
          "Phone":wcData[2]
        };
        handleC4CRequest.createDataToC4C(FromUserName,oAccountData,"IndividualCustomerCollection").then(function(result){
          console.log(result);
          sendWCMeaasge(FromUserName,"Create successfully！ID："+result);
        }).catch(function(error){
          sendWCMeaasge(FromUserName,error);
        });
      }else if(createData[1] === "appoint"){
        var startDate = new Date(wcData[0]);
        if(isNaN(startDate)){
          sendWCMeaasge(FromUserName,"Invalid Date!");
          return;
        }
        var oDrivingData = {
          "StartDateTime" :{
            "timeZoneCode":"UTC",
            "content":startDate.toISOString().split(":")[0]+":00:00.0000000Z"
          },
          "EndDateTime" :{
            "timeZoneCode":"UTC",
            "content":startDate.toISOString().split(":")[0]+":00:00.0000000Z"
          },
          "Subject": wcData[2],
          "LocationName": wcData[1],
        };
        handleC4CRequest.createDataToC4C(FromUserName,oDrivingData,"AppointmentCollection").then(function(result){
          sendWCMeaasge(FromUserName,result);
        }).catch(function(error){
          sendWCMeaasge(FromUserName,error);
        });
      }else if(createData[1] === "ticket"){
        console.log(createData);
        var cOdata = {
          "wxOpenId":FromUserName,
          "text":wcData[0]
        };
        handleSRCreate(cOdata,req,res);
        // handleC4CRequest.createSocialMediaMessage(FromUserName,{'id':MsgId,'text':wcData[0]})
        // .then(function(result){
        //   console.log(result);
        //   sendWCMeaasge(FromUserName,result);
        // })
        // .catch(function(error){
        //   console.log(error);
        //   sendWCMeaasge(FromUserName,error);
        // });
      }else if(createData[1] === "employee"){
        oSqlClient.insert(wcData[0],FromUserName,wcData[1]).then(function(){
          sendWCMeaasge(FromUserName,"success");
        }).catch(function(){
          sendWCMeaasge(FromUserName,"error");;
        });
      }


    }else{
      var filter = "NickName eq \'"+FromUserName+"\'";
      handleC4CRequest.getDataFromC4C(filter,{collection:"IndividualCustomerCollection"}).then(function(c4cdatas){
            var c4cdata = c4cdatas[0];
            var returanData;
            switch (Content) {
              case "Name":
                returanData = "Account Name:"+c4cdata.Name;
                break;
              case "Address":
                returanData = c4cdata.StreetName;
                break;
              case "Phone":
                returanData = c4cdata.Phone;
                break;
              default:
                returanData = "Please input 'Name', 'Address' or 'Phone' to query！";
            }
            console.log(returanData);
            sendWCMeaasge(FromUserName,returanData);

            }).catch(function(error){
              sendWCMeaasge(FromUserName,error.message);
             });
    }
    //var xml = '<xml><ToUserName>'+FromUserName+'</ToUserName><FromUserName>'+toUserName+'</FromUserName><CreateTime>'+CreateTime+'</CreateTime><MsgType>'+MsgType+'</MsgType><Content>'+""+'</Content></xml>';
    res.status(200).end();
  });

  function getXMLNodeValue(node_name,xml){
    var tmp = xml.split("<"+node_name+">");
    var _tmp = tmp[1].split("</"+node_name+">");
    return _tmp[0];
  };

  function sendWCMeaasge(toUser,sMessage){
    tokenHandler.getWechatToken().then(function(wcToken){
      console.log(sMessage);
      console.log(wcToken);
      var oprions = {
            url:"https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token="+wcToken,
            method: "POST",
            json:true,
            headers: {
            "content-type": "application/json"},
            body:{
              "touser":toUser,
              "msgtype":"text",
              "text":
              {
                   "content":sMessage
              }
                }
          };
      request(oprions,function(error,response,data){
        console.log(data);
      });
    }).catch();
  };

  function sendWCImageMeaasge(oData){
    tokenHandler.getWechatToken().then(function(wcToken){
      console.log(oData);
      var oprions = {
            url:"https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token="+wcToken,
            method: "POST",
            json:true,
            headers: {
            "content-type": "application/json"},
            body:oData
          };
      request(oprions,function(error,response,data){
        console.log(data);
      });
    }).catch();
  };


  function sendTemplateMeaasge(toUser,templateId,sMessage,sUrl){
    tokenHandler.getWechatToken().then(function(wcToken){
      var oprions = {
            url:"https://api.weixin.qq.com/cgi-bin/message/template/send?access_token="+wcToken,
            method: "POST",
            json:true,
            headers: {
            "content-type": "application/json"},
            body: {
                 "touser":toUser,
                 "url":sUrl,
                 "template_id":templateId,
                 "data":sMessage
             }
          };
      request(oprions,function(error,response,data){
        console.log(data);
      });
    }).catch();
  };

  function sendMiniMeaasge(users,templateId,oData){
    tokenHandler.getminiToken().then(function(wcToken){
      if(templateId){

        var pushTMLData = {
          "keyword2": {
              "value":oData.appointmentName,
              "color":"#173177"
          },
          "keyword3":{
              "value":oData.StartDate,
              "color":"#173177"
          },
          "keyword5": {
              "value":oData.Location,
              "color":"#173177"
          },
          "keyword4": {
              "value":oData.AccountName,
              "color":"#173177"
          },
          "keyword1": {
              "value":oData.id,
              "color":"#173177"
          }
        };
        for(var i=0;i<users.length;i++){//注意闭包问题
          oSqlClient.getFormId(users[i].open_id).then(function(result){
              var oprions = {
                    url:"https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=" + wcToken,
                    method: "POST",
                    json:true,
                    headers: {
                    "content-type": "application/json"},
                    body: {
                         "page": "/pages/showDetail/showDetail?id="+oData.key+"&entity=AppointmentCollection",
                         "form_id": result[0].id,
                         "touser":result[0].open_id,
                         "template_id":templateId,
                         "data":pushTMLData
                     }
                  };
              console.log("/pages/showDetail/showDetail?id="+oData.key);
              request(oprions,function(error,response,data){
                console.log("delete");
                //oSqlClient.deleteFormid(result.id);
                console.log(data);
              });
              oSqlClient.deleteFormid(result[0].id);

          });
        }
      }else{
      }


    }).catch();
  };

  function wConfirm(userId){
    for(var i = 0;i<that.waitConfirm.length;i++){
      if(that.waitConfirm[i].wcID === userId){
        handleC4CRequest.updateC4CDate("AppointmentCollection",that.waitConfirm[i].ID).then(function(result){
          sendWCMeaasge(that.waitConfirm[i].wcID,result);
          that.waitConfirm.splice(i,1);
        }).catch(function(error){
          sendWCMeaasge(that.waitConfirm[i].wcID,error);
          that.waitConfirm.splice(i,1);
        });

      }
    }
  };

  function vociceHandle(content){
    //创建用户姓名xxx创建用户姓名xxx地址xxx电话xxxxxx电话xxx
    //查询我的地址
    //查询我的电话
    //申请试驾日期xxx 地址xxx
    //@account@lastName_firstName$address$phone
    //@appoint@date(e.g. yyyy/mm/dd)$address
    content = content.replace(new RegExp('，',"gm"),'');
    content = content.replace(new RegExp(',',"gm"),'');

    var iLength = content.length - 1;
    if(content.indexOf("创建用户") > -1){
      return "@account@" + content.substring(content.indexOf("姓名")+2,content.indexOf("姓名")+3)
                         + "_" + content.substring(content.indexOf("姓名")+3,content.indexOf("地址"))
                         + "$" + content.substring(content.indexOf("地址")+2,content.indexOf("电话"))
                         + "$" + content.substring(content.indexOf("电话")+2,iLength);
    }else if(content.indexOf("查询我的地址") > -1){
      return "Address";
    }else if(content.indexOf("查询我的姓名") > -1){
      return "Name";
    }else if(content.indexOf("查询我的电话") > -1){
      return "Phone";
    }else if(content.indexOf("申请试驾") > -1){
      return "@appoint@" + content.substring(content.indexOf("日期")+2,content.indexOf("年"))
                         + "/" + content.substring(content.indexOf("年")+1,content.indexOf("月"))
                         + "/" + content.substring(content.indexOf("月")+1,content.indexOf("地址")-1)
                         + "$" + content.substring(content.indexOf("地址")+2,iLength);
    }else{
      return '';
    }

  };

  function eventHandle(FromUserName,EventKey){
    console.log(EventKey);
    switch (EventKey) {
      case 'dataCreate':
        sendWCMeaasge(FromUserName,"Please input your account info following below:\n @account@lastName_firstName$address$phone");
        break;
      case 'dataQuery':
        sendWCMeaasge(FromUserName,"Query following below:\n1.Input 'Name' to get the name maintained in your account\n2.Input 'Address' to get the address maintained in your account\n3.Input 'Phone' to get the phone maintained in your account\n");
        break;
      case 'tryDrive':
        sendWCMeaasge(FromUserName,"Please input your application following below：\n @appoint@date(e.g. yyyy/mm/dd)$address$subject");
        break;
      case 'queryDrive':
        //sendWCMeaasge(FromUserName,"请按以下方式查询：\n 1.查询姓名请输入“姓名”\n2.查询地址请输入“地址”\n1.查询电话请输入“电话”\n");
        break;
      case "subscribe":
        sendWCMeaasge(FromUserName,"Welcome!\nC4C集成微信公众号");
        break;
      default:

    }
  };

  function handleSRCreate(createData,req,res){
    var newDate = new Date();
    var id = newDate.getFullYear()+newDate.getTime();
    handleC4CRequest.createSocialMediaMessage(createData.wxOpenId,{'id':id,'text':createData.text})
    .then(function(result){
      var smsId = result.ID;
      var filter = "ID eq \'" + smsId+"\'&$expand=ServiceRequest";
      handleC4CRequest.getDataFromC4C(filter,{service:'ticket',collection:"ServiceRequestBusinessTransactionDocumentReferenceCollection"}).then(function(results){
        console.log(results);
        console.log(createData);
        if(createData.SerialID && createData.SerialID !== ''){
          handleC4CRequest.handleAssignProdutToSR(createData,results[0].ServiceRequest.ID);
        }
        sendWCMeaasge(createData.wxOpenId,"Your ticket has been created successfully!\n the ticket ID is "+ results[0].ServiceRequest.ID);
      }).catch(function(){
        sendWCMeaasge(createData.wxOpenId,"Create failed2!");
      });
      res.send({"result":"success"});
    })
    .catch(function(error){
      sendWCMeaasge(createData.wxOpenId,"Create failed3!");
      res.status(500);
      res.send({"error:":error});
    });

  }




};
