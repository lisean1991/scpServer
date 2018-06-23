sap.ui.define([
	"ygsd/controller/BaseController",
	'sap/ui/model/json/JSONModel'
], function(Controller,JSONModel) {
	"use strict";

	return Controller.extend("ygsd.controller.ticketDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ygsd.view.ticketDetail
		 */
			onInit: function() {
		      this.getRouter().getRoute("ticketDetail").attachPatternMatched(this._beforeShow, this);
			},

      _beforeShow:function(oEvent){
        var oData = oEvent.getParameters().arguments;
        var sTicketId = oData.srId;
        this.oModel = new JSONModel();
        this.getView().setModel(this.oModel);
				this.refresh(sTicketId);

      },

			refresh: function(srId){
        var sTicketId = srId;
        this.getView().setBusy(true);

				this.callService("/c4c/getTickets","GET",{srId:sTicketId},function(result){
          this.srId = sTicketId;
          this.getView().setBusy(false);
          this.oModel.setData(result.ServiceRequest);
          this.getView().bindElement('/');

					this.getView().byId("feeder").bindItems({
						path:"/interAction",
						template:new sap.m.FeedListItem({
						sender:{parts:["initiator_code","author","user_screen_name"],
										formatter: function(code, name1, name2) {
											if (code==='2') {
												return name2;
											} else {
												return name1;
											}
										}
									},
						timestamp:{
							path:"crea_date_time",
							formatter:function(time){
								var oDate = new Date();
								oDate.setUTCFullYear(parseInt(time.substr(0,4)));
								oDate.setUTCMonth(parseInt(time.substr(4,2)));
								oDate.setUTCDate(parseInt(time.substr(6,2)));
								oDate.setUTCHours(parseInt(time.substr(8,2)));
								oDate.setUTCMinutes(parseInt(time.substr(10,2)));
								oDate.setUTCSeconds(parseInt(time.substr(12,2)));
								return oDate.toLocaleString();
							}
						},
						text:"{content}"	,
						icon:{
							path:'initiator_code',
							formatter:function(code){
								if (code==='2') {
									return "sap-icon://customer";
								} else {
									return "sap-icon://employee";
								}
							}
						},
						info:{
							parts:["accountname","initiator_code"],
							formatter:function(name,code){
								if (code==='3') {
									return "shares on " +name;
								} else {
									return "via " +name;
								}
							}
						}
					}),
					sorter: new sap.ui.model.Sorter("crea_date_time")
					});

        }.bind(this),function(result){
          this.getView().setBusy(false);
          this.showMessage(result.responseText,"error");
        }.bind(this));
			},

      handleReplyPress: function(e){
        e.getSource().setVisible(false);

        this.getView().byId('send').setVisible(true);
        this.getView().byId('cancel').setVisible(true);
        this.getView().byId('reply').setEnabled(true);
      },

      handleSendPress: function(e){
        var sReplyText = e.getSource().getValue();
        var openId =  this.getAccessInfo().openid;
        var oData = {};
        oData.openId = openId;
        oData.srId = this.srId;
        oData.reply = sReplyText;
				this.getView().setBusy(true);
        if(oData.openId && oData.srId && oData.reply !== ''){
          this.callService("/c4c/replyTickets","POST",oData,function(result){
						this.getView().setBusy(false);
            if(result.result === 'success'){
              this.showMessage("Reply successfully!","success");
							this.refresh(this.srId);
							wx.closeWindow();
              //this.getRouter().navTo("ticketList", {}, false);
            }else{
              this.showMessage("Reply failed!","error");
            }
          }.bind(this),function(result){
						this.getView().setBusy(false);
            this.showMessage(result.responseText,"error");
          }.bind(this));
        }
      },

      handleCancelPress: function(e){
        this.navBack();
      },

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ygsd.view.ticketDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ygsd.view.ticketDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ygsd.view.ticketDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});
