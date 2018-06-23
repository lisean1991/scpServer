sap.ui.define([
	"ygsd/controller/BaseController",
	'sap/ui/model/json/JSONModel'
], function(Controller,JSONModel) {
	"use strict";

	return Controller.extend("ygsd.controller.contactAssign", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ygsd.view.createTicket
		 */
			onInit: function() {
				this.accountModel = new JSONModel({
					"ID":"",
          "email":""
				},true);
				var that = this;
				this.getView().byId("createForm").setModel(this.accountModel,"contact");
				this.getView().byId("createForm").bindElement("contact>/");

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

			onSubmit :function(){
				var oContact = {};
				oContact = this.accountModel.getData();
				oContact.wxOpenId = this.getAccessInfo().openid;
				oContact.entity = "contact";
				this.getView().setBusy(true);
				this.callService("/create","POST",oContact,jQuery.proxy(this.submitSuccess,this),jQuery.proxy(this.submitError,this));
			},

			submitSuccess:function(result){
				this.getView().setBusy(false);
				wx.closeWindow();
				// this.showMessage("Assign Successfully!");
				// this.navBack();
			},

			submitError:function(result){
				this.getView().setBusy(false);
				this.showMessage(result.responseText,"error");
			},

			onCancel :function(){
				wx.closeWindow();
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
