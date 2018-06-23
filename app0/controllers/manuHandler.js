var request = require('request');
function manuHandler(token){
    var oprions = {
          url:"https://api.weixin.qq.com/cgi-bin/menu/create?access_token="+token,
          method: "POST",
          json:true,
          headers: {
          "content-type": "application/json"},
          body:{
                 "button":[
                     {
                       "name":"Account",
                       "sub_button":[{
                            "type": "click",
                            "name": "Create",
                            "key": "dataCreate"
                       },{
                            "type": "click",
                            "name": "Query",
                             "key": "dataQuery"
                       }]
                     },
                     {
                       "name":"DrivingExp",
                       "sub_button":[{
                            "type": "click",
                            "name": "Apply",
                            "key": "tryDrive"
                       },{
                            "type": "click",
                            "name": "Query",
                             "key": "queryDrive"
                       }]
                     },
                     {
                       "name":"More",
                       "sub_button":[{
                            "type": "view",
                            "name": "Create Account",
                            "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2e364477a9159672&redirect_uri=http%3A%2F%2Ftestc4cwc.duapp.com%2Fclient%2Fwebapp%2Findex.html%23%2Faccount&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                       },{
                            "type": "view",
                            "name": "Create Ticket",
                             "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2e364477a9159672&redirect_uri=http%3A%2F%2Ftestc4cwc.duapp.com%2Fclient%2Fwebapp%2Findex.html%23%2Fticket&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                       },{
                            "type": "view",
                            "name": "Registered Product",
                            "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2e364477a9159672&redirect_uri=http%3A%2F%2Ftestc4cwc.duapp.com%2Fclient%2Fwebapp%2Findex.html%23%2Fproduct&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                       },{
                            "type": "view",
                            "name": "Assign Contact",
                            "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2e364477a9159672&redirect_uri=http%3A%2F%2Ftestc4cwc.duapp.com%2Fclient%2Fwebapp%2Findex.html%23%2FcontactAssign&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                       }]
                     }

                 ]
            }
        };
    request(oprions,function(error,response,data){
      console.log("manu refersh!");
    });
}

module.exports = manuHandler;
