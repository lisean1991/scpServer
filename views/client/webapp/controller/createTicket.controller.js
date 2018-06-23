sap.ui.define([
	"ygsd/controller/BaseController",
	'sap/ui/model/json/JSONModel'
], function(Controller,JSONModel) {
	"use strict";

	return Controller.extend("ygsd.controller.createTicket", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ygsd.view.createTicket
		 */
			onInit: function() {
				this.accountModel = new JSONModel({
					"text":"",
					"title":"",
					"product":""
				},true);
				var that = this;
				this.getView().byId("createForm").setModel(this.accountModel,"ticket");
				this.getView().byId("createForm").bindElement("ticket>/");
				var postData={
						"timestamp":123234252,
						"noncestr":"wcwcssd",
						"url":location.href.split('#')[0]
				};
				//$.getScript("http://res.wx.qq.com/open/js/jweixin-1.2.0.js");
				this.callService("/checkWXJS","POST",postData,jQuery.proxy(this.checkSuccess,this),jQuery.proxy(this.checkError,this));
			},

			checkSuccess:function(result){
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

			checkError:function(result){

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
						if(sId.split(";").length === 2){
							that.getView().byId("serialID").setValue(sId.split(";")[0]);
							that.accountModel.setProperty('/product',sId.split(";")[1]);
							that.accountModel.refresh();
							var wxOpenId = that.getAccessInfo().openid;
							var oRequest = {
								// url: "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/cust/v1/",
								url: "https://my306768.vlab.sapbydesign.com/sap/c4c/zwcaccess",
								open_id: wxOpenId,
								serial_id: sId.split(";")[0],
								product_id:sId.split(";")[1]
								// filter: "NickName eq \'" + wxOpenId + "\'" + "&sap-language=EN",
								// collection: "CustomerCollection",
								// service: "zcustomer"
							};
							that.getView().setBusy(true);
							that.getView().byId("searchInfo").setVisible(false);
							that.callService("/callService", "GET", oRequest, function(results){
								this.getView().setBusy(false);
								if(results[0].RT_CODE === '0'){
									this.getView().byId("searchInfo").setVisible(true);
									this.getView().byId("serialID").removeStyleClass("inputError");
									this.getView().byId("searchInfo").addStyleClass("checkSuccess");
									this.getView().byId("searchInfo").setText("You can use this product!");
								}else{
									this.getView().byId("searchInfo").setVisible(true);
									this.getView().byId("serialID").addStyleClass("inputError");
									this.getView().byId("searchInfo").addStyleClass("checkError");
									this.getView().byId("searchInfo").setText("Registed produt with serial id:"+sId.split(";")[0]+" is not existed!");
								}
							}.bind(that), function(){
								this.getView().setBusy(false);
							}.bind(that));
						}

	        }
	      });
	    },

			onSubmit :function(){
				var oTicket = {};
				oTicket = this.accountModel.getData();
				oTicket.wxOpenId = this.getAccessInfo().openid;
				oTicket.SerialID = this.getView().byId("serialID").getValue();
				oTicket.entity = "ticket";
				this.getView().setBusy(true);
				this.callService("/create","POST",oTicket,jQuery.proxy(this.submitSuccess,this),jQuery.proxy(this.submitError,this));
			},

			submitSuccess:function(result){
				this.getView().setBusy(false);
				this.showMessage("创建成功");
				wx.closeWindow();
				//this.navBack();
			},

			submitError:function(result){
				this.getView().setBusy(false);
				this.showMessage(result.responseText,"error");
			},

			onCancel :function(){
				this.navBack();
			},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ygsd.view.createTicket
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ygsd.view.createTicket
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ygsd.view.createTicket
		 */
		//	onExit: function() {
		//
		//	}

	});

});
