var request = require('request');
function tokenHandler(clientStore){

  this.refreshWechatToken = function(){
    //refresh wechat token per 2h
    setInterval(function(){
      request("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx2e364477a9159672&secret=4da79c282ce226a4682cf4e58a8438b8",function(error,response,data){
        var result = JSON.parse(data);
        clientStore.set("wechartToken",result.access_token);
        request("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+result.access_token+"&type=jsapi",function(error,response,data){
          var result = JSON.parse(data);
          clientStore.set("ticket",result.ticket);
        });
      });
    },7200000);

    return new Promise(function(resolve,reject){
      request("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx2e364477a9159672&secret=4da79c282ce226a4682cf4e58a8438b8",function(error,response,data){
        var result = JSON.parse(data);
        clientStore.set("wechartToken",result.access_token);

        request("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+result.access_token+"&type=jsapi",function(error,response,data){
          var result = JSON.parse(data);
          console.log(result);
          clientStore.set("ticket",result.ticket);
        });
        resolve(result);
      });
    });

  };

  this.refreshMiniToken = function(){
    //refresh wechat token per 2h
    setInterval(function(){
      request("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa9b01c5f7e4c5174&secret=0f5dcdae2ec4f7ba0442b6b650ff3350",function(error,response,data){
        var result = JSON.parse(data);
        clientStore.set("miniToken",result.access_token);
      });
    },7200000);

    return new Promise(function(resolve,reject){
      request("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa9b01c5f7e4c5174&secret=0f5dcdae2ec4f7ba0442b6b650ff3350",function(error,response,data){
        var result = JSON.parse(data);
        clientStore.set("miniToken",result.access_token);
        resolve(result);
      });
    });

  };

  this.refreJSTicket = function(){
    //refresh wechat token per 2h
    this.getWechatToken().then(function(token){
      setInterval(function(){
        request("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+token+"&type=jsapi",function(error,response,data){
          var result = JSON.parse(data);
          console.log(result);
          clientStore.set("ticket",result.ticket);
        });
      },7200000);

      return new Promise(function(resolve,reject){
        request("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+token+"&type=jsapi",function(error,response,data){
          var result = JSON.parse(data);
          clientStore.set("ticket",result.ticket);
          resolve(result);
        });
      });
    });

  };

  this.getminiToken = function(){
    return new Promise(function(resolve,reject){
        clientStore.get("miniToken",function(err,result){
          if(err){
            reject(err);
          }else{
            resolve(result);
          }
        });
    });

  };

  this.getJsTicket = function(){
    return new Promise(function(resolve,reject){
        clientStore.get("ticket",function(err,result){
          console.log(err);
          console.log(result);
          if(err){
            console.log("error"+result);
            reject(err);
          }else{
            console.log(result);
            resolve(result);
          }
        });
    });

  };

  this.getWechatToken = function(){
    return new Promise(function(resolve,reject){
        clientStore.get("wechartToken",function(err,result){
          if(err){
            reject(err);
          }else{
            resolve(result);
          }
        });
    });

  };

  this.refreshC4CToken = function(){

  };

  this.getC4CToken = function(){

  };


}

module.exports = tokenHandler;
