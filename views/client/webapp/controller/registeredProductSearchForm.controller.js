sap.ui.define([
  "ygsd/controller/BaseController",
  "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("ygsd.controller.registeredProductSearchForm", {
    onInit: function() {
      var oData = {
        serialID: "",
        productID: ""
      };

      this.oProductModel = new JSONModel(oData);
      this.getView().setModel(this.oProductModel);
      var postData={
          "timestamp":123234252,
          "noncestr":"wcwcssd",
          "url":location.href.split('#')[0]
      };
      $.getScript("http://res.wx.qq.com/open/js/jweixin-1.2.0.js");
      this.callService("/checkWXJS","POST",postData,jQuery.proxy(this.submitSuccess,this),jQuery.proxy(this.submitError,this));
    },

    submitSuccess:function(result){
      wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wx2e364477a9159672', // 必填，公众号的唯一标识
          timestamp: 123234252, // 必填，生成签名的时间戳
          nonceStr: 'wcwcssd', // 必填，生成签名的随机串
          signature: result.signature,// 必填，签名
          jsApiList: [  'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'translateVoice',
                        'startRecord',
                        'stopRecord',
                        'onVoiceRecordEnd',
                        'playVoice',
                        'onVoicePlayEnd',
                        'pauseVoice',
                        'stopVoice',
                        'uploadVoice',
                        'downloadVoice',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow',
                        'scanQRCode',
                        'chooseWXPay',
                        'openProductSpecificView',
                        'addCard',
                        'chooseCard',
                        'openCard'] // 必填，需要使用的JS接口列表
      });
      wx.ready(function(){
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
    },

    submitError:function(result){

    },

    onSearch: function() {
      var wxOpenId = this.getAccessInfo().openid;
      var oRequest = {
        // url: "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/cust/v1/",
        url: "https://my306768.vlab.sapbydesign.com/sap/c4c/zwcaccess",
        open_id: wxOpenId,
        serial_id: this.oProductModel.getData().serialID,
        product_id: this.oProductModel.getData().productID
        // filter: "NickName eq \'" + wxOpenId + "\'" + "&sap-language=EN",
        // collection: "CustomerCollection",
        // service: "zcustomer"
      };
      this.getView().setBusy(true);
      this.callService("/callService", "GET", oRequest, jQuery.proxy(this.submitSuccess1,this), jQuery.proxy(this.submitError1,this));
    },

    submitSuccess1: function(results) {
      var oRequest = this.oProductModel.getData();
      var sReturnCode = results[0].RT_CODE;
      // var accountuuid = results[0].UUID;
      this.getView().setBusy(false);
      if(sReturnCode == "0") {
        this.getRouter().navTo("productDetail", {serialID: oRequest.serialID, productID: oRequest.productID} ,false);
      } else {
        this.showMessage("No product data found","error");
      }
    },

    submitError1: function(sMessage) {
      this.getView().setBusy(false);
      this.showMessage(sMessage,"error");
    },

    onScan: function () {
      var that = this;
        wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          var n = result.indexOf(",");
          n = n + 1;
          var sId = result.substr(n);
          that.oProductModel.setData({
            serialID: sId
          })
          that.oProductModel.refresh();
        }
      });
    },

    onCancel :function(){
      this.navBack();
    }

  });
});
